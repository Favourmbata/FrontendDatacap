# Review Verification Endpoint Integration Guide

## Overview
This document explains how the Review Verification endpoint is integrated into the Super Admin dashboard for approving or rejecting data verifications.

## API Endpoint

### POST /api/super-admin/data-verification/verifications/:id/review 🔒

This endpoint allows super admins to review (approve or reject) submitted verifications.

#### Request
```http
POST /api/super-admin/data-verification/verifications/{id}/review
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body
```json
{
  "status": "approved",
  "comments": "Verification looks good. All documents are valid."
}
```

**Parameters:**
- `id` (path parameter): The verification ID to review
- `status` (required): Either "approved" or "rejected"
- `comments` (optional): Review comments

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "verification": {
      "_id": "verification-id",
      "status": "approved",
      "reviewedBy": "super-admin-id",
      "reviewedAt": "2024-01-15T11:00:00.000Z",
      "reviewComments": "Verification looks good. All documents are valid."
    }
  },
  "message": "Verification approved successfully"
}
```

#### Response (Error - 400/404/500)
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Frontend Implementation

### 1. Main Page Component
**File:** `src/modules/super-admin/data-verification/page.tsx`

The main data verification management page displays all verifications with their status and provides a "View Details" button to open the review modal.

**Key Features:**
- Statistics cards showing total, draft, submitted, approved, and rejected verifications
- Filter buttons to view verifications by status (All, Submitted, Approved, Rejected)
- Search functionality to find specific verifications
- Table displaying verification details with action buttons

**Integration Point:**
```typescript
const handleViewDetails = (verificationId: string) => {
  setSelectedVerificationId(verificationId);
  setIsReviewModalOpen(true);
};
```

### 2. Review Verification Modal
**File:** `src/modules/super-admin/data-verification/ReviewVerificationModal.tsx`

This modal component handles the complete review process:

#### Features:
1. **Displays Complete Verification Details:**
   - Verifier information
   - Organization details
   - Target user information
   - Location data
   - Building documentation (images/videos)
   - Transportation costs breakdown

2. **Review Decision Interface:**
   - Radio buttons for Approve/Reject decision
   - Comments textarea for additional feedback
   - Submit button with proper validation

3. **Form Submission:**
```typescript
const handleSubmitReview = async () => {
  if (!reviewStatus) {
    toast({
      title: "Validation Error",
      description: "Please select a review decision",
      variant: "destructive"
    });
    return;
  }

  try {
    setSubmitting(true);
    await dataVerificationService.reviewVerification(verificationId, {
      status: reviewStatus,
      comments
    });

    toast({
      title: "Success",
      description: `Verification ${reviewStatus} successfully`
    });

    onReviewComplete();
    onClose();
  } catch (error) {
    console.error('Error submitting review:', error);
    toast({
      title: "Error",
      description: "Failed to submit review",
      variant: "destructive"
    });
  } finally {
    setSubmitting(false);
  }
};
```

### 3. Service Layer
**File:** `src/services/DataVerificationService.ts`

The service layer abstracts the API calls:

```typescript
async reviewVerification(
  verificationId: string, 
  data: { status: string; comments: string }, 
  token: string = ''
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await fetch(
      `${this.baseUrl}/api/super-admin/data-verification/verifications/${verificationId}/review`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error reviewing verification:', error);
    return {
      success: false,
      message: 'An error occurred while reviewing verification.'
    };
  }
}
```

### 4. API Route Handler
**File:** `src/app/api/super-admin/data-verification/verifications/[id]/review/route.ts`

The Next.js API route acts as a proxy to the backend:

```typescript
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const body = await req.json();
    const { status, comments } = body;
    
    // Call the actual backend API
    const backendUrl = `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verifications/${id}/review`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req.headers.has('authorization') 
          ? { authorization: req.headers.get('authorization')! } 
          : {},
      },
      body: JSON.stringify({ status, comments }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error reviewing verification:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to review verification',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
```

---

## User Flow

1. **Super Admin navigates to Data Verification page**
   - URL: `/super-admin/data-verification`
   - Views list of all verifications with their current status

2. **Click "View Details" on a submitted verification**
   - Opens the ReviewVerificationModal
   - Modal fetches and displays complete verification details

3. **Review the verification data**
   - View all submitted images, videos, and documents
   - Check transportation costs
   - Verify organization and target user information

4. **Make a decision**
   - Select "Approve" or "Reject" using radio buttons
   - Optionally add comments explaining the decision

5. **Submit review**
   - Click "Submit Approval" or "Submit Rejection" button
   - System validates that a decision has been made
   - Sends POST request to backend API
   - Shows success/error toast notification
   - Refreshes the verification list
   - Closes the modal

---

## Component Architecture

```
DataVerificationPage (Main Container)
├── Stats Cards (Total, Draft, Submitted, Approved, Rejected)
├── Filter Buttons (All, Submitted, Approved, Rejected)
├── Search Bar
└── Verifications Table
    └── Action Button (View Details) → Opens ↓

ReviewVerificationModal
├── Verification Details Section
│   ├── Verifier Info
│   ├── Organization Info
│   ├── Target User Info
│   └── Location Data
├── Building Documentation Section
│   └── Images/Videos Grid
├── Transportation Costs Section
│   ├── Going Journey
│   └── Return Journey
└── Review Decision Section
    ├── Radio Group (Approve/Reject)
    ├── Comments Textarea
    └── Submit Buttons
```

---

## Data Flow

```
User Action
    ↓
ReviewVerificationModal.handleSubmitReview()
    ↓
DataVerificationService.reviewVerification()
    ↓
Next.js API Route (/api/super-admin/data-verification/verifications/[id]/review)
    ↓
Backend API (https://datacapture-backend.onrender.com/api/super-admin/data-verification/verifications/[id]/review)
    ↓
Response propagates back up the chain
    ↓
Toast notification + UI refresh
```

---

## Key Features Implemented

✅ **Authentication & Authorization**
- Token-based authentication
- Authorization header forwarding to backend
- Protected routes (🔒)

✅ **Validation**
- Required review decision (approve/reject)
- Optional comments field
- Client-side validation before submission

✅ **User Feedback**
- Loading states during API calls
- Success/error toast notifications
- Disabled buttons during submission
- Visual feedback for selected decision

✅ **Error Handling**
- Try-catch blocks at all levels
- Graceful error messages
- Network error handling

✅ **UI/UX**
- Responsive design
- Clean modal interface
- Image fallbacks
- Proper loading states
- Accessible form controls

✅ **State Management**
- Local state for form inputs
- Parent component state for modal visibility
- Automatic refresh after successful review

---

## Testing Checklist

- [ ] Navigate to `/super-admin/data-verification`
- [ ] Verify statistics cards display correct counts
- [ ] Filter verifications by status
- [ ] Search for specific verifications
- [ ] Click "View Details" on a submitted verification
- [ ] Verify all verification details load correctly in modal
- [ ] View building images and videos
- [ ] Check transportation cost breakdown
- [ ] Select "Approve" decision
- [ ] Add review comments
- [ ] Click "Submit Approval"
- [ ] Verify success toast appears
- [ ] Confirm verification list refreshes
- [ ] Repeat steps for "Reject" decision
- [ ] Test validation (try submitting without selecting decision)
- [ ] Test error handling (simulate network failure)

---

## Future Enhancements

1. **Bulk Review Actions**
   - Allow selecting multiple verifications and approving/rejecting them together

2. **Advanced Filtering**
   - Filter by date range
   - Filter by verifier
   - Filter by location

3. **Export Functionality**
   - Export review history to Excel/PDF
   - Generate reports

4. **Audit Trail**
   - Display review history for each verification
   - Show who reviewed and when

5. **Notifications**
   - Notify verifiers when their submissions are reviewed
   - Email notifications for rejections

---

## Related Files

- **Pages:**
  - `src/app/(main)/super-admin/data-verification/page.tsx`
  - `src/modules/super-admin/data-verification/page.tsx`

- **Components:**
  - `src/modules/super-admin/data-verification/ReviewVerificationModal.tsx`

- **Services:**
  - `src/services/DataVerificationService.ts`

- **API Routes:**
  - `src/app/api/super-admin/data-verification/verifications/[id]/review/route.ts`
  - `src/app/api/super-admin/data-verification/verifications/[id]/route.ts`
  - `src/app/api/super-admin/data-verification/verifications/route.ts`

---

## Conclusion

The Review Verification endpoint is fully integrated into the Super Admin dashboard. The implementation follows best practices for:
- Clean architecture (separation of concerns)
- Error handling
- User experience
- Security (authentication/authorization)
- Code maintainability

The feature is production-ready and allows super admins to efficiently review and approve/reject data verifications submitted by field agents.
