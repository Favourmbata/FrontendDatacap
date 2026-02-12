### 🔧 Super Admin Dashboard Integration

For Super Admin Dashboard:

- **Get Pending Locations**: Call `GET /api/super-admin/location-verifications/pending`
- **Show Approval Interface**: Display location details with Approve/Reject buttons
- **Handle Actions**: Call approve/reject endpoints with location details

## 🔧 SUPER ADMIN VERIFICATION API (/api/super-admin/location-verifications/*)

### 1. Get All Pending Locations
**GET /api/super-admin/location-verifications/pending 🔒**

Get all paid locations awaiting Super Admin approval.

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc_ver_12345",
        "locationId": "loc_67890",
        "organizationId": "org_11111",
        "locationIndex": 0,
        "brandName": "Main Branch - Lekki",
        "country": "Nigeria",
        "state": "Lagos",
        "city": "Lekki",
        "address": "123 Lekki Road",
        "paymentStatus": "paid",
        "verificationStatus": "pending",
        "createdAt": "2024-01-15T10:30:00Z",
        "paidAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "pendingCount": 1
  }
}
```

### 2. Approve Location Verification
**PATCH /api/super-admin/location-verifications/{id}/approve 🔒**

Approve a specific location verification request.

#### Request Body:
```json
{
  "approvedBy": "super_admin_123",
  "notes": "Location verified successfully"
}
```

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "id": "loc_ver_12345",
    "locationId": "loc_67890",
    "verificationStatus": "approved",
    "approvedBy": "super_admin_123",
    "approvedAt": "2024-01-15T11:00:00Z",
    "notes": "Location verified successfully"
  }
}
```

### 3. Reject Location Verification
**PATCH /api/super-admin/location-verifications/{id}/reject 🔒**

Reject a specific location verification request.

#### Request Body:
```json
{
  "rejectedBy": "super_admin_123",
  "rejectionReason": "Insufficient documentation provided",
  "notes": "Please provide valid business registration documents"
}
```

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "id": "loc_ver_12345",
    "locationId": "loc_67890",
    "verificationStatus": "rejected",
    "rejectedBy": "super_admin_123",
    "rejectedAt": "2024-01-15T11:00:00Z",
    "rejectionReason": "Insufficient documentation provided",
    "notes": "Please provide valid business registration documents"
  }
}
```

### 4. Get Location Verification Details
**GET /api/super-admin/location-verifications/{id} 🔒**

Get detailed information about a specific location verification request.

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "id": "loc_ver_12345",
    "locationId": "loc_67890",
    "organizationId": "org_11111",
    "locationIndex": 0,
    "brandName": "Main Branch - Lekki",
    "country": "Nigeria",
    "state": "Lagos",
    "city": "Lekki",
    "address": "123 Lekki Road",
    "paymentStatus": "paid",
    "verificationStatus": "pending",
    "paymentAmount": 25000,
    "paymentMethod": "card",
    "transactionId": "txn_98765",
    "createdAt": "2024-01-15T10:30:00Z",
    "paidAt": "2024-01-15T10:30:00Z",
    "organization": {
      "name": "Tech Solutions Ltd",
      "email": "admin@techsolutions.com",
      "phone": "+2348012345678"
    }
  }
}
```

### 5. Get Verification Statistics
**GET /api/super-admin/location-verifications/stats 🔒**

Get statistics about location verifications.

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "approved": 100,
    "rejected": 25,
    "today": 5,
    "thisWeek": 30,
    "thisMonth": 80
  }
}
```

### 6. Search Location Verifications
**GET /api/super-admin/location-verifications/search 🔒**

Search location verifications with filters.

#### Query Parameters:
- `status`: pending|approved|rejected
- `organization`: Organization name or ID
- `location`: Location name or address
- `dateFrom`: Start date (YYYY-MM-DD)
- `dateTo`: End date (YYYY-MM-DD)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc_ver_12345",
        "locationId": "loc_67890",
        "organizationId": "org_11111",
        "brandName": "Main Branch - Lekki",
        "verificationStatus": "pending",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## 💳 PAYMENT API ENDPOINTS (/api/payment/verified-badge/*)

### 1. Check Payment Required
**GET /api/payment/verified-badge/check-payment-required 🔒**

Check if organization has unpaid locations requiring payment.

#### Response (200) - Payment Required:
```json
{
  "success": true,
  "data": {
    "paymentRequired": true,
    "unpaidLocations": 2,
    "totalLocations": 3,
    "verificationStatus": "verified"
  }
}
```

#### Response (200) - No Payment Required:
```json
{
  "success": true,
  "data": {
    "paymentRequired": false,
    "unpaidLocations": 0,
    "totalLocations": 2,
    "verificationStatus": "verified"
  }
}
```

### 2. Get Pricing for Unpaid Locations
**GET /api/payment/verified-badge/pricing 🔒**

Get pricing breakdown for unpaid locations only.

#### Response (200) - Has Unpaid Locations:
```json
{
  "success": true,
  "data": {
    "totalAmount": 75000,
    "locationFees": [
      {
        "location": "New Branch - Lekki",
        "fee": 25000
      },
      {
        "location": "Office 2 - Victoria Island",
        "fee": 50000
      }
    ],
    "totalLocations": 3,
    "unpaidLocations": 2,
    "currency": "NGN",
    "description": "Verified Badge - 2 unpaid location(s)"
  }
}
```

### 3. Initialize Payment for Unpaid Locations
**POST /api/payment/verified-badge/initialize 🔒**

Initialize payment for unpaid locations only.

#### Request Body:
```json
{
  "email": "admin@company.com",
  "name": "John Smith",
  "phone": "+2348012345678"
}
```

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "paymentLink": "https://checkout.flutterwave.com/v3/hosted/pay/abc123",
    "amount": 75000,
    "description": "Verified Badge - 2 unpaid location(s)",
    "locationFees": [
      {
        "location": "New Branch - Lekki",
        "fee": 25000
      },
      {
        "location": "Office 2 - Victoria Island",
        "fee": 50000
      }
    ],
    "totalLocations": 3,
    "unpaidLocations": 2
  }
}
```

### 4. Verify Payment
**POST /api/payment/verified-badge/verify 🔒**

Verify payment and mark unpaid locations as paid with pending verification status.

#### Request Body:
```json
{
  "transactionId": "1234567890"
}
```

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "verificationStatus": "pending",
    "message": "Payment verified successfully. Your verification is now pending admin approval."
  }
}
```

### 5. Get Payment History
**GET /api/payment/verified-badge/history 🔒**

Get payment history for the organization.

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "pay_12345",
        "transactionId": "txn_67890",
        "amount": 25000,
        "status": "completed",
        "description": "Verified Badge - 1 location(s)",
        "paidAt": "2024-01-15T10:30:00Z",
        "locations": [
          {
            "locationIndex": 0,
            "brandName": "Main Branch - Lekki"
          }
        ]
      }
    ],
    "total": 1
  }
}
```

### 6. Get Payment Status
**GET /api/payment/verified-badge/status/{transactionId} 🔒**

Get the status of a specific payment transaction.

#### Response (200) - Success:
```json
{
  "success": true,
  "data": {
    "transactionId": "1234567890",
    "status": "completed",
    "amount": 25000,
    "currency": "NGN",
    "paidAt": "2024-01-15T10:30:00Z",
    "verified": true
  }
}
```