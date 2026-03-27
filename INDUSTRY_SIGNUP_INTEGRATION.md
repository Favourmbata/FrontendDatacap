# Admin Signup Industry Integration

## Overview
Updated the admin signup page to include an industry dropdown that fetches data from `/api/auth/industries` and displays industry information in the user profile.

## Changes Made

### 1. Admin Signup Page (`src/app/auth/signup/admin/page.tsx`)

#### Added Industry Interface
```typescript
interface Industry {
  id: string;
  name: string;
  description?: string;
}
```

#### Added State Management
- `industries`: Stores fetched industries list
- `loadingIndustries`: Loading state for API call
- `showIndustriesDropdown`: Controls dropdown visibility
- `industrySearch`: Search filter for industries

#### API Integration
- Fetches industries from `/api/auth/industries` on component mount
- Handles response format: `{ success: true, data: { industries: [...] } }`
- Includes error handling with toast notifications

#### Updated Registration Payload
```javascript
const payload = {
  fullName: values.name,
  email: values.email.toLowerCase().trim(),
  password: values.password,
  phoneNumber: normalizedPhone,
  organizationName: values.organizationName,
  country: values.country,
  industryId: values.industry,        // Added
  industryName: selectedIndustry?.name || '',  // Added
  categoryId: values.category,
  role: "ORGANIZATION"
};
```

#### UI Components
- **Mobile & Desktop**: Replaced text input with custom dropdown
- Features:
  - Search functionality
  - Radio button selection
  - Click-outside to close
  - Loading state display
  - Empty state handling
  - Custom arrow indicator

### 2. Profile Service (`src/services/ProfileService.ts`)

#### Extended UserProfile Interface
Added fields to support industry and organization display:
```typescript
export interface UserProfile {
  // ... existing fields
  country?: string;
  industryId?: string;
  industryName?: string;
  isVerified?: boolean;
  status?: string;
}
```

### 3. User Profile Page (`src/app/(main)/user/profile/page.tsx`)

#### Added Read-Only Fields
- **Organization Name**: Displays user's organization
- **Country**: Displays user's country
- **Industry**: Displays selected industry name

All new fields are:
- Read-only (cannot be edited by users)
- Styled with gray background to indicate non-editable status
- Populated from profile data

## API Requirements

### GET `/api/auth/industries`
**Response Format:**
```json
{
  "success": true,
  "data": {
    "industries": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Technology",
        "description": "Tech companies"
      }
    ]
  }
}
```

### POST `/api/auth/register`
**Request Body:**
```json
{
  "fullName": "John Smith",
  "email": "admin@techcorp.com",
  "password": "securePassword",
  "phoneNumber": "+2348012345678",
  "organizationName": "TechCorp Solutions",
  "country": "Nigeria",
  "industryId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "industryName": "Technology",
  "categoryId": "...",
  "role": "ORGANIZATION"
}
```

### GET `/api/auth/profile`
**Response Format:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-123",
      "email": "admin@techcorp.com",
      "fullName": "John Smith",
      "phoneNumber": "+2348012345678",
      "role": "ORGANIZATION",
      "organizationId": "ORG1766391801122",
      "organizationName": "TechCorp Solutions",
      "country": "Nigeria",
      "industryId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "industryName": "Technology",
      "isVerified": true,
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "message": "User found"
  }
}
```

## User Experience

### Signup Flow
1. User clicks on Industry dropdown
2. Searches/filter through available industries
3. Selects desired industry
4. Industry ID and name are included in registration payload

### Profile View
- Users can view their selected industry
- Industry field is read-only (set during signup)
- Displayed alongside other organization details

## Technical Details

### Dropdown Features
- **Search**: Real-time filtering as user types
- **Keyboard accessible**: Radio button selection
- **Click outside**: Automatically closes dropdown
- **Responsive**: Works on both mobile and desktop
- **Loading states**: Shows loading indicator while fetching
- **Empty states**: Displays message when no results found

### Styling
- Consistent with existing design system
- Uses Manrope font family
- Purple accent color (#5D2A8B)
- Proper spacing and responsive layout

## Notes
- Industry selection is required for signup
- Industry cannot be changed after registration
- Profile displays industry as read-only field
- Backend must provide `/api/auth/industries` endpoint without authentication requirement
