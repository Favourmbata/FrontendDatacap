# Service Provider Dashboard - Quick Reference Guide

## 🎯 Tab Interface Overview

**Quick visual guide for the new tabbed layout**

---

## Layout Structure

```
╔═══════════════════════════════════════════════════════════╗
║  Service Provider Dashboard                               ║
║  Manage your allocated tasks from organizations           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
║  │ ⏰ Pending  │ │ ✓ Accepted  │ │ ✓ Completed │ │ ✗ Rejected  │
║  │     3       │ │     2       │ │     4       │ │     1       │
║  │ (Clickable) │ (Clickable)   │ (Clickable)   │ (Clickable)   │
║  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║  TAB NAVIGATION                                           ║
║  ┌──────────────────────────────────────────────────┐    ║
║  │ 🕐 Available  ✓ Accepted  ✓ Completed  ✗ Rejected│    ║
║  │ 3 tasks       2 tasks      4 tasks      1 task   │    ║
║  │ ═══════════                                      │    ║
║  │ (Active tab - colored underline)                  │    ║
║  └──────────────────────────────────────────────────┘    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Available Tasks                              ← Dynamic   ║
║  Review and accept or reject allocated tasks  ← Dynamic   ║
║  ─────────────────────────────────────────────────────    ║
║                                                           ║
║  ┌─────────────────────────────────────────────────┐     ║
║  │ Add New Gallery Item                      HIGH  │     ║
║  │ Create and upload new gallery items...          │     ║
║  │ Organization: Fashion Hub Ltd | Due: 03/30/2026 │     ║
║  │                             [✓ Accept] [✗ Reject]│     ║
║  ├─────────────────────────────────────────────────┤     ║
║  │ Update Product Measurements            MEDIUM   │     ║
║  │ Update measurement data for winter...           │     ║
║  │ Organization: Style Co | Due: 03/28/2026        │     ║
║  │                             [✓ Accept] [✗ Reject]│     ║
║  └─────────────────────────────────────────────────┘     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Tab Behavior

### Clicking Statistics Cards
```\nUser clicks "Pending Tasks" card (shows 3)\n         ↓\nAutomatically switches to "Available" tab\n         ↓\nShows pending tasks list\n```\n\n### Switching Tabs
```\nUser clicks "Accepted" tab\n         ↓\nContent area updates instantly\n         ↓\nShows accepted tasks with Reset button\n```\n\n---

## Action Buttons by Tab

| Tab | Actions Available | Button Colors |
|-----|------------------|---------------|
| **Available** | Accept, Reject | Green, Red |
| **Accepted** | Reset Task | Gray |
| **Completed** | None (Read-only) | - |
| **Rejected** | View Reason (future) | - |

---

## Color Legend

```
🟡 Yellow/Orange → Available/Pending Tasks
🟢 Green        → Accepted Tasks  
🔵 Blue         → Completed Tasks
🔴 Red          → Rejected Tasks
⚪ Gray         → Neutral/Inactive
```

---

## Quick Navigation Shortcuts

### Method 1: Via Statistics Cards
- Click **Pending Tasks** card → Opens Available tab
- Click **Accepted Tasks** card → Opens Accepted tab
- Click **Completed Tasks** card → Opens Completed tab
- Click **Rejected Tasks** card → Opens Rejected tab

### Method 2: Via Tab Bar
- Click **Available** tab → Shows pending tasks
- Click **Accepted** tab → Shows accepted tasks
- Click **Completed** tab → Shows completed tasks
- Click **Rejected** tab → Shows rejected tasks

---

## Responsive Behavior

### Desktop View (> 768px)
```
Statistics: [Card 1] [Card 2] [Card 3] [Card 4]
Tabs:       [Tab 1] [Tab 2] [Tab 3] [Tab 4]
Content:    Full width task list
```

### Tablet View (768px)
```
Statistics: [Card 1] [Card 2]
            [Card 3] [Card 4]
Tabs:       [Tab 1] [Tab 2] [Tab 3] [Tab 4]
Content:    Full width task list
```

### Mobile View (< 640px)
```
Statistics: [Card 1]
            [Card 2]
            [Card 3]
            [Card 4]
Tabs:       [Tab 1] [Tab 2] [Tab 3] [Tab 4] (scrollable)
Content:    Single column task cards
```

---

## Common User Actions

### Scenario 1: Accepting a Task
```
1. Go to "Available" tab (default)
2. Find task you want to accept
3. Click green "Accept Task" button
4. Task moves to "Accepted" tab
5. Confirmation message appears
```

### Scenario 2: Rejecting a Task
```
1. Go to "Available" tab
2. Find task you want to reject
3. Click red "Reject" button
4. Modal opens asking for reason
5. Enter rejection reason (required)
6. Click "Confirm Rejection"
7. Task moves to "Rejected" tab
8. Admin is notified
```

### Scenario 3: Resetting a Task
```
1. Click "Accepted" tab or statistics card
2. Find task you want to reset
3. Click gray "Reset Task" button
4. Task status changes back to pending
5. Task moves back to "Available" tab
```

### Scenario 4: Viewing Completed Work
```
1. Click "Completed" tab or statistics card
2. View list of completed tasks
3. See completion dates and details
4. Read-only view (no actions needed)
```

---

## Status Flow Diagram

```
         ┌──────────────┐
         │   AVAILABLE  │
         │   (Pending)  │
         └──────┬───────┘
                │
        ┌───────┴───────┐
        │               │
    [Accept]        [Reject]
        │               │
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│   ACCEPTED   │ │   REJECTED   │
│              │ │ (Reason shown│
│ [Reset Task] │ │  to admin)   │
└──────┬───────┘ └──────────────┘
       │
   [Complete]
       │
       ▼
┌──────────────┐
│  COMPLETED   │
│  (Read-only) │
└──────────────┘
```

---

## Visual Indicators

### Priority Badges
```
🔴 URGENT  → Red background badge
🟠 HIGH    → Orange background badge
🟡 MEDIUM  → Yellow background badge
🟢 LOW     → Green background badge
```

### Type Badges (Available tab only)
```
🔵 Gallery  → Blue badge
🔵 Product  → Blue badge
🔵 Service  → Blue badge
```

### Status Icons
```
⏰ Clock        → Pending/Available
✓ CheckCircle   → Accepted/Completed
✗ XCircle       → Rejected
↻ RefreshCw     → Reset action
```

---

## Empty States

When a tab has no tasks:

```
┌─────────────────────────────────────┐
│                                     │
│        No pending tasks available   │
│                                     │
│  (or)                               │
│                                     │
│        No accepted tasks            │
│                                     │
│  (or)                               │
│                                     │
│        No completed tasks           │
│                                     │
│  (or)                               │
│                                     │
│        No rejected tasks            │
│                                     │
└─────────────────────────────────────┘
```

---

## Tips for Users

### 💡 Pro Tips

1. **Use Statistics Cards for Quick Navigation**
   - Faster than scrolling through tabs
   - See counts at a glance

2. **Check Available Tab First**
   - New tasks appear here
   - Accept tasks promptly

3. **Use Reset Wisely**
   - Only reset if you can't complete
   - Consider communicating with admin first

4. **Monitor Completed Tab**
   - Track your progress
   - Build track record

5. **Rejection Reasons Matter**
   - Be specific and professional
   - Admins read all reasons
   - Helps improve task allocation

---

## Keyboard Navigation

```
Tab Key      → Move between buttons
Enter Key    → Activate selected button
Space Key    → Activate selected button
Escape Key   → Close modal dialogs
```

---

## Troubleshooting

### Issue: Can't see my tasks
**Solution:** Check that you're on the correct tab. Tasks are filtered by status.

### Issue: Tab won't switch
**Solution:** Try clicking the statistics card instead. Clear browser cache if persistent.

### Issue: Missing Accept/Reject buttons
**Solution:** These only appear in the "Available" tab. Other tabs have different actions.

### Issue: Can't read rejection reason
**Solution:** Currently, reasons are visible to admins. Feature coming soon.

---

## Getting Help

If you need assistance:

1. ✅ Check this quick reference guide
2. ✅ Review the full documentation
3. ✅ Contact your organization admin
4. ✅ Submit a support ticket

---

**Last Updated:** March 23, 2026  
**Version:** 2.0.0  
**Format:** Quick Reference Card
