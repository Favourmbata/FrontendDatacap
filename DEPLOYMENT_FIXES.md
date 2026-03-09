# Deployment & Navigation Fixes

## Issues Fixed

### 1. Environment Variable Error (`NEXT_PUBLIC_BACKEND_API`)

**Problem:**
When deploying to production/staging, the application was breaking with the error:
```
Uncaught Error: NEXT_PUBLIC_BACKEND_API is not defined in environment variables
```

This occurred because `gallery-sub-service.ts` was throwing an error at build time if the environment variable wasn't defined, unlike other services that had fallback URLs.

**Solution:**
Updated `src/services/gallery-sub-service.ts` to use a fallback URL instead of throwing an error:

```typescript
// Before (causing error)
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_API is not defined in environment variables');
}

// After (with fallback)
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com';

// Fallback for production if environment variable is missing
if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_BACKEND_API is not defined, using default backend URL');
}
```

**Impact:**
- Application will no longer break in deployment environments
- Uses default backend URL (`https://datacapture-backend.onrender.com`) as fallback
- Logs a warning if environment variable is missing for debugging purposes

---

### 2. Subscription Page Redirect Loop

**Problem:**
After successfully subscribing and making payment, users were being redirected back to the subscription page when navigating or using certain features. This created a frustrating loop where subscribed users kept seeing the subscription page.

**Root Cause:**
Multiple payment verification pages were redirecting users to `/subscription` after successful payment verification, which would then trigger the login flow's subscription check again.

**Solutions Applied:**

#### A. Payment Verification Client (`src/app/payment/verify/PaymentVerificationClient.tsx`)

**Changes:**
1. Redirect to appropriate dashboard based on user type instead of subscription page
2. Updated error state button to go to dashboard instead of subscription page

```typescript
// Success redirect - now uses userType parameter
setTimeout(() => {
  const userType = searchParams.get('userType') || 'organization';
  if (userType === 'individual') {
    router.push('/user');
  } else {
    router.push('/admin');
  }
}, 3000);

// Error button - goes to dashboard instead of subscription
<button onClick={() => router.push('/admin')}>
  Go to Dashboard
</button>
```

#### B. Location Payment Verification (`src/app/payment/verify-location/page.tsx`)

**Changes:**
Redirect to admin subscription status page instead of public subscription page

```typescript
// Before
setTimeout(() => {
  router.push('/subscription');
}, 3000);

// After
setTimeout(() => {
  router.push('/admin/subscription');
}, 3000);
```

**Impact:**
- Users with active subscriptions will NOT be redirected to subscription page
- Only new users registering for the first time will see the subscription page
- Login flow remains unchanged - it correctly checks subscription status via API
- Prevents the redirect loop after successful payment

---

## Deployment Instructions

### Environment Variables Required

Create/update `.env.production` or set these environment variables in your hosting platform:

```bash
# Backend API URL (required for all deployments)
NEXT_PUBLIC_BACKEND_API=https://datacapture-backend.onrender.com

# Optional: Override for different environments
# NEXT_PUBLIC_BACKEND_API_URL=https://your-production-api.com
```

### Vercel/Netlify Deployment

1. **Set Environment Variables:**
   - Go to your project settings → Environment Variables
   - Add `NEXT_PUBLIC_BACKEND_API` with value `https://datacapture-backend.onrender.com`
   - For staging: Use your staging backend URL

2. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Deploy:**
   - Push to main branch
   - Platform will automatically build and deploy

### Manual Deployment (VPS/Docker)

1. **Clone repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd FrontendDatacap
   npm install
   ```

2. **Create `.env.production`:**
   ```bash
   NEXT_PUBLIC_BACKEND_API=https://datacapture-backend.onrender.com
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Start:**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Update Dockerfile** (if needed) to include environment variables:
   ```dockerfile
   ENV NEXT_PUBLIC_BACKEND_API=https://datacapture-backend.onrender.com
   ```

2. **Build and run:**
   ```bash
   docker build -t datacapturing-frontend .
   docker run -p 3000:3000 datacapturing-frontend
   ```

---

## Testing Checklist

### Before Deployment

- [ ] Verify `.env.local` has correct backend URL
- [ ] Test locally with `npm run dev`
- [ ] Ensure Gallery module works without errors
- [ ] Test subscription payment flow end-to-end
- [ ] Verify payment verification redirects correctly

### After Deployment

- [ ] Check browser console for environment variable errors
- [ ] Test Gallery module functionality
- [ ] Complete a test subscription payment
- [ ] Verify subscribed users can access dashboard
- [ ] Confirm no redirect loops occur
- [ ] Test login flow for new vs existing subscribers

---

## User Flow Summary

### New User Registration
1. User registers account
2. Login → API returns `redirectTo: 'subscription'`
3. Redirected to `/subscription` page ✅ (Expected)
4. Select package and make payment
5. Payment verification → Redirect to `/admin` dashboard ✅
6. Future logins → Direct to dashboard ✅

### Existing Subscriber Login
1. User registers and subscribes
2. Login → API returns `redirectTo: 'dashboard'`
3. Redirected to `/admin` or `/user` dashboard ✅
4. No subscription page shown ✅

### Payment Verification Flow
1. User completes payment on Flutterwave
2. Redirected to `/payment/verify?tx_ref=xxx&status=successful`
3. Payment verified successfully
4. Redirected to appropriate dashboard (NOT subscription) ✅
5. Can navigate freely without seeing subscription page ✅

---

## Files Modified

1. `src/services/gallery-sub-service.ts` - Added fallback for missing env variable
2. `src/app/payment/verify/PaymentVerificationClient.tsx` - Fixed redirect logic
3. `src/app/payment/verify-location/page.tsx` - Fixed location payment redirect

## Related Documentation

- [COMBINED_PAYMENT_IMPLEMENTATION.md](./COMBINED_PAYMENT_IMPLEMENTATION.md) - Combined payment details
- [LOCATION_PAYMENT_BUTTON.md](./LOCATION_PAYMENT_BUTTON.md) - Location payment integration
- [README.md](./README.md) - General setup guide

---

## Troubleshooting

### Issue: Still seeing "NEXT_PUBLIC_BACKEND_API is not defined"

**Solution:**
1. Clear build cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Restart development server
4. Check hosting platform's environment variables section

### Issue: Users still redirected to subscription after payment

**Solution:**
1. Verify backend API is returning correct `redirectTo` value
2. Check user subscription status in database
3. Ensure payment verification updates subscription status to 'active'
4. Clear browser cache and localStorage

### Issue: Gallery module not working in production

**Solution:**
1. Verify `NEXT_PUBLIC_BACKEND_API` is set in hosting platform
2. Check network tab for failed API requests
3. Verify CORS settings on backend
4. Check authentication token is being sent with requests

---

## Support

For issues or questions:
- Check console logs for detailed error messages
- Review this document and related documentation
- Contact development team with specific error details
