# Super Admin Data Verification - Endpoint Fix

## Overview
Fixed the Super Admin Data Verification feature to use the correct API endpoints as specified.

## Changes Made

### 1. Service Layer (`src/services/DataVerificationService.ts`)

Updated the following static methods to use the correct super admin endpoints:

#### Updated Methods:
- **`getAllVerifications(status?)`**
  - Old: `/api/data-verification/admin/all${params}`
  - New: `/api/super-admin/data-verification/verifications${params}`

- **`getVerificationUsers()`**
  - Old: `/api/data-verification/admin/users`
  - New: `/api/super-admin/data-verification/verification-users`

- **`getVerificationStats()`**
  - Old: `/api/data-verification/admin/stats`
  - New: `/api/super-admin/data-verification/verification-stats`

- **`getVerificationById(id)`**
  - Old: `/api/data-verification/${id}`
  - New: `/api/super-admin/data-verification/verifications/${id}`

- **`reviewVerification(id, data)`**
  - Old: `/api/data-verification/${id}/review`
  - New: `/api/super-admin/data-verification/verifications/${id}/review`

#### New Method Added:
- **`assignDataVerificationRole(userId, assign)`**
  - Endpoint: `/api/super-admin/data-verification/assign-role/${userId}`
  - Purpose: Assign or remove data verification role from a user
  - Parameters: 
    - `userId`: The ID of the user to assign/remove role
    - `assign`: Boolean indicating whether to assign (true) or remove (false) the role

### 2. API Route Handlers

Updated all API route handlers to call the actual backend API instead of using mock data:

#### Updated Routes:

1. **`/api/super-admin/data-verification/verifications/route.ts`**
   - Method: GET
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verifications`
   - Removed mock implementation

2. **`/api/super-admin/data-verification/verification-users/route.ts`**
   - Method: GET
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verification-users`
   - Removed mock implementation

3. **`/api/super-admin/data-verification/verification-stats/route.ts`**
   - Method: GET
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verification-stats`
   - Removed mock implementation

4. **`/api/super-admin/data-verification/assign-role/[userId]/route.ts`**
   - Method: POST
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/assign-role/${userId}`
   - Removed mock implementation

5. **`/api/super-admin/data-verification/verifications/[id]/route.ts`**
   - Method: GET
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verifications/${id}`
   - Removed mock implementation

6. **`/api/super-admin/data-verification/verifications/[id]/review/route.ts`**
   - Method: POST
   - Now calls: `https://datacapture-backend.onrender.com/api/super-admin/data-verification/verifications/${id}/review`
   - Removed mock implementation

## Correct Endpoints Summary

All endpoints now follow the pattern: `/api/super-admin/data-verification/*`

| Functionality | HTTP Method | Endpoint |
|--------------|-------------|----------|
| Get All Verifications | GET | `/api/super-admin/data-verification/verifications` |
| Get Verification Users | GET | `/api/super-admin/data-verification/verification-users` |
| Get Verification Stats | GET | `/api/super-admin/data-verification/verification-stats` |
| Get Verification by ID | GET | `/api/super-admin/data-verification/verifications/:id` |
| Review Verification | POST | `/api/super-admin/data-verification/verifications/:id/review` |
| Assign/Remove Role | POST | `/api/super-admin/data-verification/assign-role/:userId` |

## Implementation Details

### API Route Handler Pattern

All route handlers now follow this pattern:

```typescript
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) { // or POST
  try {
    // Call the actual backend API
    const backendUrl = `https://datacapture-backend.onrender.com/api/super-admin/data-verification/...`;
    
    const response = await fetch(backendUrl, {
      method: 'GET', // or POST
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if present
        ...req.headers.has('authorization') 
          ? { authorization: req.headers.get('authorization')! } 
          : {},
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return new Response(errorText, {
        status: response.status,
        headers: { /* CORS headers */ },
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { /* CORS headers */ },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed...' }),
      { status: 500 }
    );
  }
}
```

## Testing Recommendations

1. **Test Data Verification Page**
   - Navigate to Super Admin → Data Verification
   - Verify that verifications load correctly
   - Check that stats are displayed properly
   - Test filtering by status

2. **Test Field Agents Tab**
   - Verify that field agents list loads
   - Check that user data is displayed correctly

3. **Test Assign Role Feature** (when implemented in UI)
   - Use the `assignDataVerificationRole` method
   - Verify role assignment works correctly

4. **Test Review Verification** (when modal is connected)
   - Open review modal for a verification
   - Submit approval/rejection
   - Verify the action completes successfully

## Files Modified

1. `src/services/DataVerificationService.ts`
2. `src/app/api/super-admin/data-verification/verifications/route.ts`
3. `src/app/api/super-admin/data-verification/verification-users/route.ts`
4. `src/app/api/super-admin/data-verification/verification-stats/route.ts`
5. `src/app/api/super-admin/data-verification/assign-role/[userId]/route.ts`
6. `src/app/api/super-admin/data-verification/verifications/[id]/route.ts`
7. `src/app/api/super-admin/data-verification/verifications/[id]/review/route.ts`

## Notes

- All endpoints now properly forward authentication tokens from the request
- CORS headers are set to allow cross-origin requests during development
- Error handling is consistent across all routes
- Mock implementations have been removed from all route handlers
- The service layer provides both instance and static methods for flexibility

## Backend Integration

The frontend now expects the backend API to be running at:
`https://datacapture-backend.onrender.com`

Ensure the backend has the following endpoints implemented:
- GET `/api/super-admin/data-verification/verifications`
- GET `/api/super-admin/data-verification/verification-users`
- GET `/api/super-admin/data-verification/verification-stats`
- GET `/api/super-admin/data-verification/verifications/:id`
- POST `/api/super-admin/data-verification/verifications/:id/review`
- POST `/api/super-admin/data-verification/assign-role/:userId`
