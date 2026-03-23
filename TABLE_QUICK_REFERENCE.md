# Service Provider Dashboard - Table View Quick Reference

## 📊 Visual Guide

**Quick reference for the new tabular layout with Excel export**

---

## Complete Dashboard Layout

```
╔════════════════════════════════════════════════════════════════════════════╗
║  Service Provider Dashboard                                                ║
║  Manage your allocated tasks from organizations                            ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         ║
║  │ ⏰ Pending  │ │ ✓ Accepted  │ │ ✓ Completed │ │ ✗ Rejected  │         ║
║  │     3       │ │     2       │ │     4       │ │     1       │         ║
║  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         ║
║                                                                            ║
╠════════════════════════════════════════════════════════════════════════════╣
║  TAB NAVIGATION                                                            ║
║  ┌──────────────────────────────────────────────────────────────────┐     ║
║  │ 🕐 Available  ✓ Accepted  ✓ Completed  ✗ Rejected                │     ║
║  │ 3 tasks       2 tasks      4 tasks      1 task                   │     ║
║  └──────────────────────────────────────────────────────────────────┘     ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Available Tasks                                      [⬇️ Export to Excel] ║
║  Review and accept or reject allocated tasks                              ║
║  ─────────────────────────────────────────────────────────────────────    ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ S/N      │ Task        │ Service Prov │ Provider ID │ Customer... │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ SN-2026- │ Add New     │ Creative     │ SP-001      │ Chidinma   │   ║
║  │ 001      │ Gallery     │ Studio NG    │             │ Okafor     │   ║
║  │          │ Item        │              │             │            │   ║
║  │          │ Create and upload new gallery items for fashion...     │   ║
║  │          │ Mar 20, 2026, 10:30 AM │ 5 days │ ₦150,000.00 │ [✓][✗]│   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ SN-2026- │ Update      │ Premium      │ SP-002      │ Adebayo    │   ║
║  │ 002      │ Product     │ Products Ltd │             │ Johnson    │   ║
║  │          │ Measurements│              │             │            │   ║
║  │          │ Update measurement data for winter clothing line...    │   ║
║  │          │ Mar 19, 2026, 02:15 PM │ 3 days │ ₦85,000.00  │ [✓][✗]│   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ SN-2026- │ Create      │ Expert       │ SP-003      │ Fatima     │   ║
║  │ 003      │ Service     │ Services Inc │             │ Abdullahi  │   ║
║  │          │ Package     │              │             │            │   ║
║  │          │ Define new tailoring service package with pricing...   │   ║
║  │          │ Mar 18, 2026, 09:00 AM │ 7 days │ ₦200,000.00 │ [✓][✗]│   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Table Columns Detail

```
Column Headers (Uppercase, Gray Background)
┌──────────────────────────────────────────────────────────────────────────┐
│ S/N  │ Task │ Service │ Provider │ Customer │ Customer │ Date/Time │ ... │
│      │      │Provider │   ID     │   Name   │    ID    │           │     │
├──────────────────────────────────────────────────────────────────────────┤
│ Data rows with hover effect (light gray on hover)                        │
│ SN-2026-│Add New│Creative│ SP-001 │Chidinma │CUST-001 │Mar 20,...│ ... │
│ 001     │Gallery│Studio │        │Okafor   │         │10:30 AM  │     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Action Buttons

### Available Tab Actions
```
[✓] [✗]
Accept  Reject
(Green) (Red)
```

### Accepted Tab Actions
```
[↻]
Reset Task
(Gray)
```

### Completed Tab Indicator
```
✓
(Green checkmark - static)
```

### Rejected Tab Indicator
```
✗
(Red X mark - static)
```

---

## Export Button Detail

```
┌─────────────────────────────┐
│ ⬇️  Export to Excel         │  ← Green button, top-right
└─────────────────────────────┘
```

**On Click:**
```
Downloads file:
Service_Provider_Available_Tasks_2026-03-23T10-30-00.xlsx
```

---

## Currency Formatting Examples

All fees displayed in Nigerian Naira with proper formatting:

```
₦150,000.00  ← One hundred fifty thousand Naira
₦85,000.00   ← Eighty-five thousand Naira
₦200,000.00  ← Two hundred thousand Naira
₦45,000.50   ← Forty-five thousand, fifty Kobo
```

**Features:**
- ✅ Naira symbol (₦)
- ✅ Thousand separators (comma)
- ✅ Always 2 decimal places
- ✅ Proper Nigerian locale formatting

---

## Date-Time Format Examples

```
Mar 20, 2026, 10:30 AM
Mar 19, 2026, 02:15 PM
Mar 18, 2026, 09:00 AM
Mar 21, 2026, 04:20 PM
```

**Format breakdown:**
- Month (abbreviated)
- Day (numeric)
- Year (4 digits)
- Time (12-hour with AM/PM)

---

## Sample Row Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Row: SN-2026-001                                                        │
├──────────────┬──────────────────┬──────────────┬───────────────────────┤
│ Column       │ Content          │ Style        │ Notes                 │
├──────────────┼──────────────────┼──────────────┼───────────────────────┤
│ S/N          │ SN-2026-001      │ Regular      │ Unique identifier     │
│ Task         │ Add New Gallery  │ Bold title   │ Truncated if long     │
│              │ Item             │ + desc       │ Description below     │
│ Service Prov │ Creative Studio  │ Regular      │ Company name          │
│ Provider ID  │ SP-001           │ Monospace    │ Code format           │
│ Customer     │ Chidinma Okafor  │ Regular      │ Full name             │
│ Customer ID  │ CUST-2026-001    │ Monospace    │ Code format           │
│ Date/Time    │ Mar 20, 2026,    │ Regular      │ Formatted timestamp   │
│              │ 10:30 AM         │              │                       │
│ Duration     │ 5 days           │ Regular      │ Text description      │
│ Fee          │ ₦150,000.00      │ Bold         │ Currency formatted    │
│ Actions      │ [✓] [✗]          │ Icon buttons │ Green & Red           │
└──────────────┴──────────────────┴──────────────┴───────────────────────┘
```

---

## Empty State Display

When no tasks in current tab:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│              No pending tasks available                    │
│                                                            │
│              (or)                                          │
│                                                            │
│              No accepted tasks                             │
│                                                            │
│              (or)                                          │
│                                                            │
│              No completed tasks                            │
│                                                            │
│              (or)                                          │
│                                                            │
│              No rejected tasks                             │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop View (> 1024px)
```
All columns visible, comfortable spacing
Table fits entire screen width
No scrolling needed
```

### Tablet View (768px - 1024px)
```
Some columns may compress
Horizontal scroll appears
All data still accessible
Touch-friendly buttons
```

### Mobile View (< 768px)
```
Compact table layout
Essential columns shown first
Swipe horizontally for more
Action buttons remain accessible
Export button stays visible
```

---

## Color Coding

| Element | Color | Purpose |
|---------|-------|---------|
| Table Header | Gray (#F9FAFB) | Distinguish headers |
| Row Hover | Light Gray (#F3F4F6) | Interactive feedback |
| Accept Button | Green (#16A34A) | Positive action |
| Reject Button | Red (#DC2626) | Negative action |
| Reset Button | Gray (#4B5563) | Neutral action |
| Export Button | Green (#16A34A) | Primary action |
| Fee Text | Dark (#111827) | Readability |
| Status Icons | Context-based | Visual indicators |

---

## Interaction Flow

### Viewing Tasks
```
1. User opens dashboard
2. Default: "Available" tab selected
3. Table shows all pending tasks
4. User can see all details at a glance
```

### Accepting Task
```
1. Find task in Available tab
2. Click green ✓ button
3. Task status changes to "accepted"
4. Task moves to Accepted tab
5. Table updates automatically
```

### Rejecting Task
```
1. Find task in Available tab
2. Click red ✗ button
3. Modal opens for reason
4. Enter rejection reason
5. Submit rejection
6. Task moves to Rejected tab
```

### Exporting Data
```
1. Navigate to desired tab
2. Click "Export to Excel" button
3. Excel file downloads immediately
4. Open file in Excel/Sheets
5. All data properly formatted
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move between cells/buttons |
| `Enter` | Activate selected button |
| `Space` | Activate button (alternative) |
| `Escape` | Close modal dialogs |
| `Arrow Keys` | Navigate within table (future) |

---

## Accessibility Features

✅ **Screen Readers**: Proper table markup  
✅ **Keyboard Navigation**: Full keyboard support  
✅ **Focus Indicators**: Visible focus rings  
✅ **Color Contrast**: WCAG AA compliant  
✅ **Tooltips**: Descriptive text on icons  
✅ **Alt Text**: Meaningful descriptions  

---

## Best Practices

### For Users

1. **Review Before Acting**: Read all task details before accepting/rejecting
2. **Use Export Regularly**: Download data for offline analysis
3. **Check All Tabs**: Monitor progress across all task states
4. **Track Fees**: Use fee column for financial planning
5. **Note Durations**: Be aware of time commitments

### For Admins

1. **Monitor Assignments**: Track which providers get which tasks
2. **Verify Customers**: Ensure customer info is accurate
3. **Audit Fees**: Check fee structures are correct
4. **Review Timestamps**: Verify assignment timing
5. **Export Reports**: Generate regular reports for stakeholders

---

## Common Questions

**Q: Can I customize the table columns?**  
A: Currently fixed. Custom columns coming in future update.

**Q: How many tasks can I export at once?**  
A: All tasks in the current tab. No limit currently.

**Q: What format is the exported file?**  
A: Microsoft Excel (.xlsx) format, compatible with Excel, Google Sheets, etc.

**Q: Can I print the table?**  
A: Use browser print (Ctrl+P). Consider "Print to PDF" for better results.

**Q: Are the action buttons touch-friendly?**  
A: Yes! Buttons are sized appropriately for touch interactions.

---

**Last Updated:** March 23, 2026  
**Version:** 3.0.0  
**Feature:** Comprehensive Task Table with Excel Export
