# Task Management API Integration

## API Endpoints Used

### 1. Get Service Bookings
**Endpoint:** `GET /api/orders/admin/service-bookings`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "69ef13027c9c6aadd670ca0c",
        "productId": "...",
        "productName": "Fishery",
        "organizationId": "ORG1776351205261",
        "organizationName": "Organization",
        "productPrice": 110,
        "customerEmail": "favourmbata250@gmail.com",
        "customerName": "Ujunwa Mbata",
        "customerPhone": "08104427559",
        "serviceBooking": {
          "bookingDate": "2026-04-27T00:00:00.000Z",
          "bookingTime": "10:00",
          "duration": 60,
          "location": {
            "type": "merchant_location"
          },
          "bookingStatus": "scheduled",
          "assignedProviders": [],
          "bookingId": "BK1777275650229",
          "taskId": "TSK1777275650229Y5UG4R"
        },
        "orderStatus": "pending",
        "deliveryStatus": "pending"
      }
    ],
    "total": 4
  },
  "message": "Service bookings retrieved successfully"
}
```

### 2. Get Service Providers for Assignment
**Endpoint:** `GET /api/service-provider-assignment/detailed`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "serviceProviders": [
      {
        "id": "user-uuid-1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "customUserId": "ORG001",
        "role": "SERVICE_PROVIDER",
        "status": "active",
        "serviceProviderInfo": {
          "providerId": "000001",
          "specialties": ["Hair Styling", "Makeup"],
          "availabilityHours": "9 AM - 5 PM",
          "isAvailable": true,
          "maxConcurrentBookings": 5,
          "status": "active",
          "rating": 4.5,
          "totalBookings": 25,
          "completedBookings": 23,
          "serviceProviderFeeName": "Premium Package",
          "serviceProviderFee": 150,
          "serviceProviderFeeCurrency": "USD",
          "serviceProviderFeeFrequency": "hourly"
        }
      }
    ],
    "totalCount": 1,
    "organizationId": "ORG1774504140651"
  },
  "message": "Service providers retrieved successfully"
}
```

### 3. Assign Service Provider to Booking
**Endpoint:** `POST /api/admin/bookings/{bookingId}/assign-provider`

**Request Body:**
```json
{
  "serviceProviderId": "user-uuid-1"
}
```

**Headers:**
```json
{
  "Authorization": "Bearer {admin_token}",
  "Content-Type": "application/json"
}
```

## Service Layer Implementation

### AdminTaskManagementService.ts

All three endpoints are now integrated into `AdminTaskManagementService`:

```typescript
// Get service bookings
static async getServiceBookings(date?: string): Promise<ServiceBookingsResponse>

// Get service providers
static async getServiceProviders(): Promise<ServiceProvidersResponse>

// Assign provider to booking
static async assignServiceProvider(
  bookingId: string,
  data: { serviceProviderId: string }
): Promise<any>
```

## Data Transformation

### Service Booking Transformation

The API response is transformed to match the `ServiceBooking` interface:

```typescript
const transformedBookings = response.data.bookings.map((booking: any) => ({
  _id: booking._id,
  bookingId: booking.serviceBooking?.bookingId || `BK${booking._id}`,
  serviceName: booking.productName || 'Unknown Service',
  organizationName: booking.organizationName || '',
  customerName: booking.customerName || '',
  customerEmail: booking.customerEmail || '',
  customerPhone: booking.customerPhone || '',
  bookingDate: booking.serviceBooking?.bookingDate || booking.createdAt,
  bookingTime: booking.serviceBooking?.bookingTime || '',
  duration: booking.serviceBooking?.duration || 0,
  productPrice: booking.productPrice || 0,
  totalAmount: booking.productPrice || 0,
  orderStatus: booking.orderStatus || 'pending',
  deliveryStatus: booking.deliveryStatus || 'pending',
  taskStatus: booking.serviceBooking?.bookingStatus || 'pending',
  serviceProviderName: booking.serviceProviderName || '',
  assignedProviders: booking.serviceBooking?.assignedProviders || [],
  settlementStatus: booking.settlementStatus || 'pending',
  payments: booking.payments || [],
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt
}));
```

## Provider Display in Modal

The service provider card displays:

- **Name:** `{provider.firstName} {provider.lastName}`
- **Email:** `{provider.email}`
- **Phone:** `{provider.phoneNumber}`
- **Specialties:** `{provider.serviceProviderInfo.specialties.join(', ')}`
- **Rating:** `★ {provider.serviceProviderInfo.rating}`
- **Completed Tasks:** `{provider.serviceProviderInfo.completedBookings} tasks`
- **Availability:** Green "Available" or Red "Busy" based on `provider.serviceProviderInfo.isAvailable`

## Key Changes Made

1. ✅ Added `ServiceProvider` and `ServiceProviderInfo` interfaces
2. ✅ Added `getServiceProviders()` method to fetch from `/api/service-provider-assignment/detailed`
3. ✅ Added `assignServiceProvider()` method for provider assignment
4. ✅ Updated Task Management page to use correct service methods
5. ✅ Fixed provider display to use nested `serviceProviderInfo` structure
6. ✅ Added specialties display in provider cards

## Testing

To test the integration:

1. Navigate to `/admin/settlement/task-management`
2. Click "Assign" button on any booking
3. Verify providers load from the correct endpoint
4. Check provider information displays correctly (name, specialties, rating, availability)
5. Select a provider and click "Assign Provider"
6. Verify successful assignment and data refresh

## Notes

- All endpoints require JWT authentication
- Provider data structure is nested with `serviceProviderInfo` containing most details
- The `id` field from provider is used as `serviceProviderId` in assignment request
- Specialties are displayed if available
- Availability status is determined by `serviceProviderInfo.isAvailable`
