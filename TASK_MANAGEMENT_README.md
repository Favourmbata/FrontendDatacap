# Task Management Module - Service Provider

## Overview
A comprehensive task management system for service providers to manage their assigned bookings, accept/reject tasks, and track completions.

## Features

### 📊 Dashboard Statistics
- **Assigned Tasks**: Tasks available for acceptance/rejection
- **Accepted Tasks**: Tasks the provider has committed to
- **Rejected Tasks**: Tasks declined with reasons
- **Completed Tasks**: Finished tasks awaiting settlement

### ⚡ Task Actions
1. **Accept Task**
   - Locks task to the provider
   - Reveals full customer details
   - Sends notification to customer
   - Moves task to "Accepted" tab

2. **Reject Task**
   - Requires mandatory rejection reason
   - Notifies admin for reassignment
   - Task requeued to other providers
   - Moves task to "Rejected" tab

3. **Complete Task**
   - Marks task as finished
   - Initiates settlement process
   - Updates provider statistics
   - Moves task to "Completed" tab

### 🔒 Privacy Protection
- **Before Acceptance**: Only customer's first name and ID visible
- **After Acceptance**: Full name, email, and phone revealed
- **Location Details**: Address shown only after acceptance

## File Structure

```
src/
├── services/
│   └── ServiceProviderTaskService.ts    # API service layer
├── app/(main)/user/body-care/
│   └── task-management/
│       └── page.tsx                      # Main UI component
└── app/components/
    └── sidebar.tsx                        # Updated with new menu item
```

## API Endpoints Used

### Task Dashboard
- `GET /api/service-provider-tasks/tasks/assigned` - Get available tasks
- `GET /api/service-provider-tasks/tasks/accepted` - Get accepted tasks
- `GET /api/service-provider-tasks/tasks/rejected` - Get rejected tasks
- `GET /api/service-provider-tasks/tasks/completed` - Get completed tasks
- `GET /api/service-provider-tasks/tasks/statistics` - Get dashboard stats

### Task Actions
- `POST /api/service-provider-tasks/tasks/:taskId/accept` - Accept a task
- `POST /api/service-provider-tasks/tasks/:taskId/reject` - Reject with reason
- `POST /api/service-provider-tasks/tasks/:taskId/complete` - Mark as complete

## Navigation

The Task Management module is accessible from the user dashboard sidebar:

```
User Dashboard
└── Body Care (submenu)
    ├── Body Care Dashboard
    ├── Book Appointment
    ├── My Orders
    ├── Task Management ← NEW
    └── Delivery
```

**Route**: `/user/body-care/task-management`

## Authentication

All endpoints require:
- Valid JWT token: `Authorization: Bearer <token>`
- Service provider role (assigned through bulk assignment system)

## User Interface

### Statistics Cards
- 4 cards showing task counts (Assigned, Accepted, Rejected, Completed)
- Color-coded borders for quick visual identification
- Real-time updates after each action

### Task Cards
Each task card displays:
- Service name and task ID
- Date, time, and duration
- Location (type revealed, address after acceptance)
- Fee amount in Nigerian Naira (₦)
- Customer information (partial or full based on status)
- Action buttons (Accept/Reject/Complete)

### Tab Navigation
- **Assigned Tasks**: Shows tasks awaiting response
- **Accepted**: Shows committed tasks with full customer details
- **Rejected**: Shows declined tasks with rejection reasons
- **Completed**: Shows finished tasks with settlement status

## Special Features

### 1. Rejection Modal
- Mandatory reason field
- Clean modal interface
- Validation before submission

### 2. Loading States
- Spinner icons during API calls
- Disabled buttons while processing
- Loading screen on initial data fetch

### 3. Error Handling
- User-friendly error messages
- Retry button on failures
- Console logging for debugging

### 4. Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly buttons
- Collapsible navigation on mobile

### 5. Currency Formatting
- Nigerian Naira symbol (₦)
- Proper decimal places (2)
- Thousands separator

## Status Badges

### Settlement Status (Completed Tasks)
- **Pending**: Yellow badge - Awaiting payment
- **Paid**: Green badge - Settlement complete
- **Disputed**: Red badge - Issue requiring resolution

### Task Status
- **Assigned**: Blue theme - Awaiting action
- **Accepted**: Green theme - Committed
- **Rejected**: Red theme - Declined
- **Completed**: Purple theme - Finished

## Next Steps

To fully integrate this module:

1. **Backend Integration**: Ensure all API endpoints are implemented and returning correct data structure
2. **Role-Based Access**: Verify only service providers can access this page
3. **Real-time Notifications**: Implement WebSocket or polling for new task alerts
4. **Calendar Integration**: Add calendar view for better task visualization
5. **Export Functionality**: Allow providers to export their task history
6. **Rating System**: Enable customer ratings after task completion

## Troubleshooting

### Common Issues

1. **"Failed to load tasks"**
   - Check JWT token validity
   - Verify user has service provider role
   - Check network connectivity

2. **Task actions not working**
   - Ensure task is in correct status (can't complete unaccepted task)
   - Check API endpoint availability
   - Review browser console for errors

3. **Customer details not showing**
   - Task must be accepted first
   - Verify API response includes customer fields
   - Check permissions

## Support

For issues or questions:
- Check browser console for detailed error messages
- Verify API endpoints are responding correctly
- Ensure proper authentication headers are being sent
- Contact backend team for API-related issues
