# Quick Reference: Reviewing Verifications

## How to Use the Review Verification Feature

### Step 1: Access Data Verification Dashboard
- Navigate to: `/super-admin/data-verification`
- You'll see statistics and a list of all verifications

### Step 2: Find a Verification to Review
- Use the filter buttons to show only "Submitted" verifications
- Or use the search bar to find specific verifications by:
  - Verification ID
  - Verifier name
  - Organization name
  - Target user name

### Step 3: Open Review Modal
- Click the 👁️ (View Details) button next to any verification
- The review modal will open with complete details

### Step 4: Review the Submission
Carefully examine:
- ✅ **Verifier Information** - Who submitted this
- ✅ **Organization Details** - Company being verified
- ✅ **Target User** - Person/entity being verified
- ✅ **Building Documentation** - Photos/videos of the location
- ✅ **Transportation Costs** - Agent's travel expenses

### Step 5: Make Your Decision
- Select either:
  - 🔵 **Approve** - If everything looks correct
  - 🔴 **Reject** - If there are issues or discrepancies

### Step 6: Add Comments (Optional but Recommended)
Provide feedback explaining your decision:
```
Example for Approval:
"All documents verified. Building matches the provided address. 
Photos are clear and professional."

Example for Rejection:
"Building pictures do not match the claimed location. 
Street view shows different landmarks than provided."
```

### Step 7: Submit Review
- Click the appropriate submit button:
  - Green button: "Submit Approval"
  - Red button: "Submit Rejection"
- Wait for confirmation toast notification

### Step 8: Verify Success
- You should see a success message
- The verification list will refresh
- The reviewed verification will now show its new status

---

## Keyboard Shortcuts & Tips

💡 **Pro Tips:**
- Filter by "Submitted" to see only pending reviews
- Use search to quickly find specific verifications
- Always add comments for rejected verifications
- Review all images carefully before approving
- Check transportation costs for reasonableness

⚠️ **Important Notes:**
- Once submitted, reviews cannot be undone
- Comments are visible to the verifier
- All building images must load properly
- Transportation receipts should be included

---

## Common Scenarios

### Scenario 1: Complete Approval
✅ All documents present
✅ Images are clear and match location
✅ Costs are reasonable
✅ Information is consistent

**Action:** Approve + Positive comments

### Scenario 2: Request Resubmission
❌ Missing documents
❌ Blurry or wrong images
❌ Incomplete information

**Action:** Reject + Detailed explanation of what's needed

### Scenario 3: Fraud Detection
❌ Fake/altered documents
❌ Completely wrong location
❌ Suspicious inconsistencies

**Action:** Reject + Flag for investigation in comments

---

## Status Meanings

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| 📝 Draft | Saved but not submitted | None - not yet sent |
| ⏳ Submitted | Awaiting review | Review and approve/reject |
| ✅ Approved | Accepted by super admin | None - complete |
| ❌ Rejected | Sent back by super admin | Verifier needs to resubmit |

---

## Troubleshooting

**Issue:** Modal won't open
- **Solution:** Check your internet connection, refresh page

**Issue:** Images not loading
- **Solution:** Wait a moment, check network speed

**Issue:** Submit button disabled
- **Solution:** You must select Approve or Reject first

**Issue:** Error on submission
- **Solution:** Check console for errors, verify token is valid

**Issue:** Can't see submitted verifications
- **Solution:** Make sure "Submitted" filter is selected

---

## Need Help?

If you encounter technical issues:
1. Check browser console for errors (F12)
2. Verify you're logged in as Super Admin
3. Ensure your session hasn't expired
4. Contact technical support if problems persist
