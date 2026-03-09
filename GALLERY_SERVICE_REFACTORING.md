# Gallery Service Refactoring Guide

## Objective
Remove direct `API_BASE_URL` usage and `parseApiError` helper, replacing all fetch calls with `HttpService` methods.

## Current Status
✅ **DONE:**
- Removed `API_BASE_URL` constant
- Removed `parseApiError` function  
- Added static `httpService` instance
- Updated `createService()` method
- Updated `getGalleryItems()` method

❌ **REMAINING METHODS TO FIX (13 methods):**

All these methods still use old pattern with `API_BASE_URL` and `parseApiError`:

### 1. getGalleryItem() - Line ~140
**Current Pattern:**
```typescript
const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}`, {
  headers: this.getJsonHeaders(token)
});
// ... manual response handling
return { success: false, message: parseApiError(error) };
```

**Should Be:**
```typescript
const response = await GalleryService.httpService.getData<ApiSingleItemResponse>(
  `/api/admin/gallery/${itemId}`
);
return { 
  success: response.success,
  data: response.data?.galleryItem,
  message: response.message
};
// Error handler:
return { 
  success: false, 
  message: error instanceof Error ? error.message : 'An unknown error occurred' 
};
```

### 2. updateGalleryItem() - Line ~180
**Pattern:** PUT request → Use `GalleryService.httpService.putData()`

### 3. deleteGalleryItem() - Line ~220
**Pattern:** DELETE request → Use `GalleryService.httpService.deleteData()`

### 4. uploadImage() - Line ~260
**Pattern:** FormData POST → Keep using fetch but with `GalleryService.httpService.baseUrl`
OR use `GalleryService.httpService.postData()` if it supports FormData

### 5. uploadVideo() - Line ~305
**Pattern:** Same as uploadImage

### 6. getCategories() - Line ~350
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 7. getCommissionByCategory() - Line ~380
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 8. getIndustries() - Line ~410
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 9. getLocations() - Line ~440
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 10. getPlatformCodePreview() - Line ~475
**Pattern:** POST request → Use `GalleryService.httpService.postData()`

### 11. getMediaUsage() - Line ~510
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 12. searchServices() - Line ~545
**Pattern:** GET request → Use `GalleryService.httpService.getData()`

### 13. getServiceDetails() - Line ~590
**Pattern:** GET request (public, no auth) → Use `GalleryService.httpService.getData()`

### 14. testConnectivity() - Line ~620
**Pattern:** HEAD request → Use fetch with `GalleryService.httpService.baseUrl`

---

## Replacement Patterns

### Pattern 1: Simple GET Requests
```typescript
// OLD
const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
  headers: this.getJsonHeaders(token)
});
const result = await response.json();
if (!response.ok) { /* handle error */ }
return { success: true, data: result.data };
// Error: return { success: false, message: parseApiError(error) };

// NEW
const response = await GalleryService.httpService.getData<any>('/api/endpoint');
return { 
  success: response.success,
  data: response.data,
  message: response.message
};
// Error: return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
```

### Pattern 2: POST/PUT Requests
```typescript
// OLD - POST
const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
  method: 'POST',
  headers: this.getJsonHeaders(token),
  body: JSON.stringify(data)
});

// NEW - POST
const response = await GalleryService.httpService.postData<any>(data, '/api/endpoint');

// OLD - PUT
const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
  method: 'PUT',
  headers: this.getJsonHeaders(token),
  body: JSON.stringify(data)
});

// NEW - PUT
const response = await GalleryService.httpService.putData<any>(data, '/api/endpoint');
```

### Pattern 3: DELETE Requests
```typescript
// OLD
const response = await fetch(`${API_BASE_URL}/api/endpoint/${id}`, {
  method: 'DELETE',
  headers: this.getJsonHeaders(token)
});

// NEW
const response = await GalleryService.httpService.deleteData<any>(`/api/endpoint/${id}`);
```

### Pattern 4: FormData Uploads (Special Case)
For `uploadImage()` and `uploadVideo()`, keep using fetch but reference baseUrl:

```typescript
// OLD
const response = await fetch(`${API_BASE_URL}/api/endpoint`, {
  method: 'POST',
  headers: this.getHeaders(token),
  body: formData
});

// NEW - Option 1 (if HttpService supports FormData)
const response = await GalleryService.httpService.uploadImage(formData, '/api/endpoint');

// NEW - Option 2 (manual with baseUrl)
const response = await fetch(`${GalleryService.httpService['baseUrl']}/api/endpoint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type for FormData!
  },
  body: formData
});
```

---

## Step-by-Step Instructions

### For Each Method:

1. **Identify the HTTP method** (GET/POST/PUT/DELETE)

2. **Replace fetch call** with corresponding HttpService method:
   - GET → `GalleryService.httpService.getData<T>(url)`
   - POST → `GalleryService.httpService.postData<T>(data, url)`
   - PUT → `GalleryService.httpService.putData<T>(data, url)`
   - DELETE → `GalleryService.httpService.deleteData<T>(url)`

3. **Update return statement**:
   ```typescript
   return {
     success: response.success,
     data: response.data,  // or response.data?.specificField
     message: response.message
   };
   ```

4. **Update error handler**:
   ```typescript
   catch (error) {
     console.error('Error [action]:', error);
     return { 
       success: false, 
       message: error instanceof Error ? error.message : 'An unknown error occurred' 
     };
   }
   ```

5. **Remove references to**:
   - `API_BASE_URL`
   - `parseApiError`
   - Manual `fetch()` calls
   - Manual `response.json()` parsing
   - Manual `!response.ok` checks (HttpService handles this)

---

## Testing Checklist

After refactoring each method:

- [ ] No TypeScript errors
- [ ] No references to `API_BASE_URL`
- [ ] No references to `parseApiError`
- [ ] Uses `GalleryService.httpService`
- [ ] Return type matches signature
- [ ] Error handling is consistent
- [ ] Test in browser DevTools
- [ ] Verify API calls work correctly

---

## Benefits of This Refactoring

✅ **Centralized Configuration**: Base URL managed in one place (HttpService)
✅ **Consistent Error Handling**: All methods use same error pattern
✅ **Automatic Auth Headers**: HttpService handles tokens automatically
✅ **Easier Maintenance**: Changes to HTTP logic in one place
✅ **Better Testing**: Can mock HttpService easily
✅ **Type Safety**: Generic types ensure correct response handling

---

## Example: Complete Method Transformation

### Before (Old Pattern):
```typescript
static async getCategories(
  token: string
): Promise<{ success: boolean; data?: ApiCategory[]; message?: string }> {
  try {
    const url = `${API_BASE_URL}/api/admin/gallery/categories`;
    const response = await fetch(url, {
      headers: this.getJsonHeaders(token)
    });
    
    const result: ApiCategoriesResponse = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    return {
      success: true,
      data: result.data?.categories,
      message: result.message
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, message: parseApiError(error) };
  }
}
```

### After (HttpService Pattern):
```typescript
static async getCategories(
  token: string
): Promise<{ success: boolean; data?: ApiCategory[]; message?: string }> {
  try {
    const response = await GalleryService.httpService.getData<ApiCategoriesResponse>(
      '/api/admin/gallery/categories'
    );
    
    return {
      success: response.success,
      data: response.data?.categories,
      message: response.message
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
```

---

## Priority Order

Fix methods in this order (most used first):

1. ✅ `createService()` - DONE
2. ✅ `getGalleryItems()` - DONE  

3. `getGalleryItem()` - View single item
4. `updateGalleryItem()` - Edit item
5. `deleteGalleryItem()` - Delete item
6. `uploadImage()` - Image uploads
7. `uploadVideo()` - Video uploads
8. `getCategories()` - Category list
9. `getIndustries()` - Industry list
10. `searchServices()` - Public search
11. `getServiceDetails()` - Public details
12. Others (less critical)

---

## Notes

- The static `httpService` instance is created once and shared
- All methods remain static for backward compatibility
- HttpService constructor uses: `process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'`
- No more environment variable checks needed in individual files
- Consistent with other services like `PaymentService`, `CombinedPaymentService`

---

## Related Files

- `src/services/HttpService.ts` - Central HTTP client
- `src/services/PaymentService.ts` - Example implementation
- `src/services/CombinedPaymentService.ts` - Another example
- `src/types/sub-service.ts` - Type definitions

---

## Completion Criteria

The refactoring is complete when:
- [ ] Zero references to `API_BASE_URL` in file
- [ ] Zero references to `parseApiError` in file
- [ ] All methods use `GalleryService.httpService`
- [ ] No TypeScript compilation errors
- [ ] All gallery features work in production
- [ ] No console errors about missing environment variables
