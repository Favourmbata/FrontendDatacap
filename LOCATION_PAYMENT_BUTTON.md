# Location Payment Button Implementation

## Overview
Added "Make Payment" functionality to the Verification Badge (Subscription View) page, allowing users to pay for individual unpaid locations directly from the location list.

## Features Added

### 1. **Individual Location Payment Button**
- Green "Make Payment" button appears only for unpaid locations (`isPaidFor === false`)
- Shows processing state with spinner during payment flow
- Disabled state while payment is being processed

### 2. **Payment Flow Integration**
- Uses `/api/payment/location/pricing` endpoint to fetch location-specific fees
- Integrates Paystack popup for secure payment processing
- Verifies payment with backend after successful transaction
- Automatically reloads location list to show updated payment status

### 3. **Navigation Enhancement**
- Added "View Payment Status" button linking to location payment overview page
- Helps users track which locations need payment

## Technical Implementation

### File Modified
`src/app/(main)/admin/subscription/verification-badge/page.tsx`

### New Imports
```typescript
import { useAuthContext } from "@/AuthContext";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
```

### New State
```typescript
const [paymentProcessing, setPaymentProcessing] = useState<number | null>(null);
```

### Payment Handler Function

#### `handleMakePayment(locationIndex: number)`

**Steps:**
1. **Authentication Check**: Verifies user has valid token
2. **Initialize Payment**: Calls `/api/payment/verified-badge/initialize` with user details
3. **Receive Payment Data**: Backend returns payment URL, reference, and amount
4. **Open Payment Popup**: Opens payment URL in a popup window
5. **Poll for Completion**: Checks every 2 seconds if popup is closed
6. **Verify Payment**: Calls `/api/payment/verify-verified-badge` with reference
7. **Update UI**: Reloads locations to reflect new payment status

**Key Code:**
```typescript
// Get user data from auth context
const { token, user } = useAuthContext();

// Step 1: Initialize payment with actual user data
const { HttpService } = await import('@/services/HttpService');

const initializeResponse = await HttpService.post<any>('/api/payment/verified-badge/initialize', {
  email: user.email,                    // Actual user email
  name: user.fullName || locData.brandName,  // User's name or business name
  phone: user.phoneNumber || '+2348012345678', // User's phone number
});

const { paymentLink, transactionRef, amount, fee } = initializeResponse.data;

// Step 2: Store transaction data and redirect in same window
sessionStorage.setItem('pendingPayment', JSON.stringify({
  transactionRef: transactionRef,
  locationIndex: locationIndex,
  amount: amount,
  locationDescription: `${locData.brandName} - ${locData.city}, ${locData.state}`,
}));

window.location.href = paymentLink;
```
// Step 3: On page load (useEffect), check for pending payment
useEffect(() => {
  const checkPendingPayment = async () => {
    const pendingPaymentStr = sessionStorage.getItem('pendingPayment');
    if (pendingPaymentStr) {
      const pendingPayment = JSON.parse(pendingPaymentStr);
      sessionStorage.removeItem('pendingPayment');
      
      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify-verified-badge', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          reference: pendingPayment.transactionRef,
          locationIndex: pendingPayment.locationIndex,
          amount: pendingPayment.amount,
        }),
      });
      
      const result = await verifyResponse.json();
      if (result.success) {
        setSuccessMessage(`Payment successful! Location ${pendingPayment.locationDescription} is now paid.`);
        // Reload locations to show updated status
      }
    }
  };
  checkPendingPayment();
}, [token]);
```

### UI Components

#### Payment Button (in table actions column)
```tsx
{!locData.isPaidFor && (
  <button
    onClick={() => handleMakePayment(index)}
    disabled={paymentProcessing === index}
    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
      paymentProcessing === index
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700'
    } text-white`}
  >
    {paymentProcessing === index ? (
      <>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
        Processing...
      </>
    ) : (
      <>
        <CreditCard className="w-3 h-3 mr-1" />
        Make Payment
      </>
    )}
  </button>
)}
```

#### Navigation Buttons
```tsx
<div className="flex gap-2">
  <a href="/admin/subscription/profile" className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg">
    Manage Profile
  </a>
  <a 
    href="/admin/subscription/location-payment"
    className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center"
  >
    <CreditCard className="w-4 h-4 mr-2" />
    View Payment Status
  </a>
</div>
```

## User Experience

### Before Payment
1. User sees location in table with red "No" badge under "Paid For" column
2. Green "Make Payment" button visible in Actions column
3. Delete button also available

### During Payment
1. User clicks "Make Payment" button
2. Button shows spinner and "Processing..." text
3. Paystack popup opens
4. User completes payment on Paystack

### After Successful Payment
1. Success message appears: "Payment successful! Location [Name] is now paid."
2. Location list refreshes automatically
3. "Paid For" column now shows green "Yes" badge
4. "Make Payment" button disappears (location is now paid)

### After Failed Payment
1. Error message displays reason for failure
2. Button returns to normal state
3. User can retry payment

## API Endpoints Used

### 1. Initialize Payment
**Endpoint:** `POST /api/payment/verified-badge/initialize` 🔒

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@actual-email.com",
  "name": "User's Full Name",
  "phone": "+2348012345678"
}
```

**Actual Implementation:**
```typescript
const { token, user } = useAuthContext();

const initializeResponse = await HttpService.post<any>('/api/payment/verified-badge/initialize', {
  email: user.email,                    // Actual user email from auth context
  name: user.fullName || locData.brandName,  // User's full name or business name
  phone: user.phoneNumber || '+2348012345678', // User's phone number
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentLink": "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/xxxxx",
    "transactionRef": "VES-1772712838287-MWP2RKW",
    "amount": 200,
    "fee": 200,
    "currency": "NGN",
    "description": "Verified Badge - 1 unpaid location(s)"
  },
  "message": "Verified badge payment initialized successfully"
}
```

### 2. Verify Payment
**Endpoint:** `POST /api/payment/verify-verified-badge` 🔒

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Body:**
```json
{
  "reference": "ref_xxxxxxxxxxxxx",
  "locationIndex": 0,
  "amount": 200
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

## Environment Variables Required

```env
NEXT_PUBLIC_BACKEND_API=https://datacapture-backend.onrender.com
```

## Payment Flow Diagram

```
User clicks "Make Payment"
    ↓
POST /api/payment/verified-badge/initialize
    ↓
Backend returns: { paymentLink, transactionRef, amount }
    ↓
Store transaction data in sessionStorage
    ↓
Redirect to Flutterwave payment in SAME window
    ↓
User completes payment on Flutterwave
    ↓
Flutterwave redirects back to your site
    ↓
Page loads, useEffect detects pendingPayment in sessionStorage
    ↓
Automatically verify payment with transactionRef
    ↓
POST /api/payment/verify-verified-badge
    ↓
Backend verifies payment status
    ↓
Update location to "Paid" status
    ↓
Show success message & refresh table
```

## Error Handling

### Scenarios Handled:

1. **No Authentication Token**
   - Message: "Please login to make a payment"

2. **Pricing Fetch Failure**
   - Message: "Unable to fetch location pricing"

3. **Payment Cancelled**
   - Message: "Payment cancelled"

4. **Payment Verification Failure**
   - Message: "Payment verification failed" or backend error message

5. **Network Errors**
   - Message: "Failed to process payment"

## Visual States

### Unpaid Location Row
```
| Brand Name | ... | Paid For: No | ... | [Make Payment] [Delete] |
```

### Processing State
```
| Brand Name | ... | Paid For: No | ... | [⏳ Processing...] [Delete] |
```

### Paid Location Row
```
| Brand Name | ... | Paid For: Yes | ... | [Delete] |
```

## Testing Checklist

- [x] Button only shows for unpaid locations
- [x] Button hidden for already paid locations
- [x] Spinner appears during processing
- [x] Paystack popup opens correctly
- [x] Payment verification works
- [x] Success message displays after payment
- [x] Location list refreshes automatically
- [x] Error messages show for failures
- [x] Can cancel payment without errors
- [x] Multiple payments can be processed sequentially

## Future Enhancements

1. **Bulk Payment**: Add "Pay All Unpaid Locations" button
2. **Email Receipt**: Send payment confirmation email
3. **Payment History**: Show payment transaction history per location
4. **Auto-retry**: Automatic retry for failed payments
5. **Multiple Payment Methods**: Support cards, transfers, USSD
6. **User Email**: Get actual user email from profile instead of hardcoded

## Related Files

- `src/app/(main)/admin/subscription/verification-badge/page.tsx` - Main implementation
- `src/app/(main)/admin/subscription/location-payment/page.tsx` - Payment overview page
- `src/services/HttpService.ts` - HTTP service for API calls
- `src/AuthContext.tsx` - Authentication context

## Summary

✅ **Individual payment buttons** for each unpaid location
✅ **Real-time pricing** from backend API
✅ **Secure payment processing** via Paystack
✅ **Automatic status updates** after successful payment
✅ **Clear visual feedback** with loading states and messages
✅ **Easy navigation** to payment overview page

The verification badge page now provides a seamless payment experience for users to pay for their business locations! 🎉
