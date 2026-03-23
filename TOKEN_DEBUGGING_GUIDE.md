# Token Authentication Debugging Guide

## Issue: "Access token required" Error

This error occurs when the API request doesn't include a valid authentication token.

---

## 🔍 How to Debug

### Step 1: Check if Token Exists in Browser

1. **Open Browser DevTools** (F12 or Right-click → Inspect)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** on the left
4. Click on your app URL (e.g., `http://localhost:3000`)
5. Look for a key named `token`

**Expected:**
```
Key: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long JWT string)
```

**If token is missing:**
- You need to login again
- The token might have expired
- Check if login is properly saving the token

---

### Step 2: Verify Token Format

The token should be a JWT (JSON Web Token) that looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

It should have:
- Three parts separated by dots (`.`)
- Base64 encoded characters
- No "Bearer " prefix in localStorage (the code adds this automatically)

---

### Step 3: Check Console Logs

Open the **Console** tab in DevTools and look for:

**Good Signs:**
```
No specific auth errors
```

**Bad Signs:**
```
⚠️ No authorization header in request. Client must include Bearer token.
Error: Access token required
Unauthorized
Session Expired
```

---

### Step 4: Test Token Manually

In the browser console, run:

```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token:', token);

// Check if it's valid
if (!token || token === 'undefined' || token === 'null') {
  console.error('❌ Token is missing or invalid!');
} else {
  console.log('✅ Token found:', token.substring(0, 50) + '...');
}
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: Token Not Saved After Login

**Problem:** User logs in but token is not saved to localStorage

**Solution:**
1. Check if login API call was successful
2. Verify the response contains a token
3. Check AuthContext.tsx signIn function is being called
4. Ensure localStorage is not disabled in browser

**Code Location:** `src/AuthContext.tsx` lines 37-50

---

### Issue 2: Token Saved as "undefined" or "null"

**Problem:** localStorage has `token: "undefined"` instead of actual token

**Solution:**
This is already handled in the code with checks:
```typescript
if (!token || token === 'undefined' || token === 'null') {
  // Redirect to login
}
```

But if this happens:
1. Clear localStorage completely
2. Login again
3. Check if backend is returning proper token

---

### Issue 3: Token Expires

**Problem:** Token works initially but then expires

**Symptoms:**
- Works right after login
- After some time (minutes/hours), get "Access token required"
- Need to logout and login again

**Solution:**
1. Check token expiration time in backend
2. Implement token refresh mechanism
3. For now: Logout and login again to get new token

**To Check Expiration:**
```javascript
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires at:', new Date(payload.exp * 1000));
console.log('Current time:', new Date());
```

---

### Issue 4: Token Not Sent with Request

**Problem:** Token exists but not sent to API

**Check Network Tab:**
1. Open DevTools → Network tab
2. Perform action that triggers API call
3. Click on the request to `/api/super-admin/data-verification/...`
4. Check **Request Headers**
5. Look for `Authorization` header

**Expected:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If Missing:**
- Service layer might not be adding it correctly
- Check DataVerificationService.ts reviewVerification method

---

### Issue 5: Wrong Token Format in Request

**Problem:** Authorization header format is wrong

**Correct Format:**
```
Authorization: Bearer <token>
```

**Incorrect Formats:**
```
Authorization: <token>  (missing "Bearer ")
Authorization: bearer <token>  (lowercase 'b')
Authorization: Bearer undefined  (invalid token)
```

**Solution:**
Check DataVerificationService.ts line 698:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,  // Should add "Bearer " prefix
}
```

---

## 🔧 Quick Fixes

### Fix 1: Force Refresh Token

If token is expired, force user to re-login:

```javascript
// In browser console
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/auth/login';
```

---

### Fix 2: Manually Set Token (Testing Only)

If you have a valid token from another source:

```javascript
// In browser console
localStorage.setItem('token', 'YOUR_VALID_JWT_TOKEN_HERE');
location.reload();
```

⚠️ **Warning:** Only use tokens from trusted sources!

---

### Fix 3: Clear All and Start Fresh

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
// Then login again
```

---

## 📝 Testing Checklist

Before reporting token issues, verify:

- [ ] Can access localStorage in browser (not incognito/private mode)
- [ ] Token exists in localStorage under key `token`
- [ ] Token is a valid JWT format (three base64 parts separated by dots)
- [ ] Token is not "undefined" or "null"
- [ ] Login was successful (check network tab for 200 OK)
- [ ] No console errors about authentication
- [ ] Authorization header present in API requests
- [ ] Token hasn't expired (check JWT payload)

---

## 🎯 Expected Flow

```
1. User enters credentials
   ↓
2. Login API called
   ↓
3. Backend returns JWT token
   ↓
4. AuthContext saves token to localStorage
   ↓
5. Future API calls read token from localStorage
   ↓
6. Service adds "Bearer " prefix
   ↓
7. Request sent with Authorization header
   ✅ Success!
```

---

## 🚨 Emergency Debug Mode

Add this to your component to debug token issues:

```typescript
// Add to ReviewVerificationModal.tsx or any component
useEffect(() => {
  const token = localStorage.getItem('token');
  console.log('🔍 DEBUG TOKEN:', {
    exists: !!token,
    value: token?.substring(0, 50) + '...',
    length: token?.length,
    isValid: token && token !== 'undefined' && token !== 'null'
  });
}, []);
```

This will log token status every time component mounts.

---

## 📞 Still Having Issues?

If none of the above helps:

1. **Check Backend:**
   - Is backend running and accessible?
   - Is the endpoint `/api/super-admin/data-verification/verifications/:id/review` correct?
   - Does backend require different auth format?

2. **Check Network:**
   - Are requests reaching backend?
   - What's the exact error message from backend?
   - Check CORS errors in console

3. **Check Permissions:**
   - Does user have super-admin role?
   - Is token for correct user type?

4. **Provide These Details:**
   - Screenshot of localStorage
   - Network tab request/response
   - Console error messages
   - Exact steps to reproduce

---

## ✅ Working State Indicators

Your authentication is working correctly when:

1. ✅ Token visible in localStorage
2. ✅ No auth errors in console
3. ✅ API requests show 200 OK status
4. ✅ Authorization header present in requests
5. ✅ Can access protected pages without redirect
6. ✅ User data displays correctly

---

**Last Updated:** March 23, 2026
**Applies To:** Review Verification Feature
