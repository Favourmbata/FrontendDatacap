import { 
  ApiServiceResponse, 
  Service, 
  serviceToApiFormat,
  ApiGalleryItemsResponse,
  ApiSingleItemResponse,
  ApiMediaUploadResponse,
  ApiCategoriesResponse,
  ApiCommissionResponse,
  ApiIndustriesResponse,
  ApiLocationsResponse,
  ApiPlatformCodeResponse,
  ApiMediaUsageResponse,
  ApiDeleteResponse,
  ApiErrorResponse,
  PublicSearchResponse,
  PublicServiceDetailsCompleteResponse,
  ApiCategory,
  ApiIndustry,
  ApiLocation,
  ApiCommission,
  ApiMediaUsage,
  PlatformCodePreview,
  validateFile
} from "@/types/sub-service";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_API is not defined in environment variables');
}
// Helper function to parse API errors
function parseApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export class GalleryService {
  private static getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  private static getJsonHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

 

static async createService(
  token: string,
  serviceData: Service
): Promise<{ success: boolean; data?: ApiServiceResponse; message?: string }> {
  try {
    console.log('GalleryService: Creating service');
    
    // Convert service data to API format
    const apiData = serviceToApiFormat(serviceData);
    
    // Log the data being sent (for debugging)
    console.log('Sending to API:', JSON.stringify(apiData, null, 2));
    
    // Send as JSON - NO FormData, just plain JSON
    const response = await fetch(`${API_BASE_URL}/api/admin/gallery`, {
      method: 'POST',
      headers: this.getJsonHeaders(token), // This sets Content-Type: application/json
      body: JSON.stringify(apiData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Create service failed:', result);
      return {
        success: false,
        message: result.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return {
      success: true,
      data: result.data?.galleryItem,
      message: result.message
    };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, message: parseApiError(error) };
  }
}

  /**
   * Get all gallery items with pagination and filters
   * GET /api/admin/gallery
   */
  static async getGalleryItems(
    token: string,
    params: {
      page?: number;
      limit?: number;
      categoryId?: string;
      industryId?: string;
      locationIndex?: number;
      visibilityToPublic?: boolean;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{ success: boolean; data?: ApiGalleryItemsResponse['data']; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.industryId) queryParams.append('industryId', params.industryId);
      if (params.locationIndex !== undefined) queryParams.append('locationIndex', params.locationIndex.toString());
      if (params.visibilityToPublic !== undefined) queryParams.append('visibilityToPublic', params.visibilityToPublic.toString());
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/api/admin/gallery${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiGalleryItemsResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Get single gallery item
   * GET /api/admin/gallery/:itemId
   */
  static async getGalleryItem(
    token: string,
    itemId: string
  ): Promise<{ success: boolean; data?: ApiServiceResponse; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiSingleItemResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data?.galleryItem,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Update gallery item
   * PUT /api/admin/gallery/:itemId
   */
  static async updateGalleryItem(
    token: string,
    itemId: string,
    data: Partial<Service>
  ): Promise<{ success: boolean; data?: ApiServiceResponse; message?: string }> {
    try {
      // Convert to API format
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.categoryId) updateData.categoryId = data.categoryId;
      if (data.producer) updateData.producer = data.producer;
      if (data.actualAmount) updateData.priceInDollars = parseFloat(data.actualAmount);
      if (data.discount) updateData.discountPercentage = parseFloat(data.discount);
      if (data.platformCharge) updateData.platformChargePercentage = parseFloat(data.platformCharge);
      if (data.upfrontPayment) updateData.upfrontPaymentPercentage = 30;
      if (data.paymentMethods) updateData.paymentMethods = data.paymentMethods;
      if (data.visibilityPeriod?.startDate) updateData.startDate = data.visibilityPeriod.startDate;
      if (data.visibilityPeriod?.endDate) updateData.endDate = data.visibilityPeriod.endDate;
      if (data.timeSlot?.startTime) updateData.startTime = data.timeSlot.startTime;
      if (data.timeSlot?.endTime) updateData.endTime = data.timeSlot.endTime;
      if (data.visibilityToPublic !== undefined) updateData.visibilityToPublic = data.visibilityToPublic;
      if (data.notes) updateData.notes = data.notes;
      if (data.totalProviders) updateData.totalAvailableServiceProviders = parseInt(data.totalProviders);
      
      if (data.subServices) {
        updateData.subServices = data.subServices.map(sub => ({
          name: sub.name,
          description: sub.description,
          price: parseFloat(sub.price)
        }));
      }
      
      if (data.availabilityType) {
        updateData.availability = {
          type: data.availabilityType,
          ...(data.visibilityPeriod?.startDate && { startDate: data.visibilityPeriod.startDate }),
          ...(data.timeSlot?.startTime && { startTime: data.timeSlot.startTime }),
          ...(data.visibilityPeriod?.endDate && { endDate: data.visibilityPeriod.endDate }),
          ...(data.timeSlot?.endTime && { endTime: data.timeSlot.endTime })
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}`, {
        method: 'PUT',
        headers: this.getJsonHeaders(token),
        body: JSON.stringify(updateData)
      });

      const result: ApiSingleItemResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data?.galleryItem,
        message: result.message
      };
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Delete gallery item
   * DELETE /api/admin/gallery/:itemId
   */
  static async deleteGalleryItem(
    token: string,
    itemId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}`, {
        method: 'DELETE',
        headers: this.getJsonHeaders(token)
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Upload image to gallery item
   * POST /api/admin/gallery/:itemId/upload-image
   */
  static async uploadImage(
    token: string,
    itemId: string,
    imageFile: File
  ): Promise<{ success: boolean; data?: ApiMediaUploadResponse['data']; message?: string }> {
    try {
      // Validate file
      const validation = validateFile(imageFile, 'image');
      if (!validation.valid) {
        return { success: false, message: validation.message };
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}/upload-image`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: formData
      });

      const result: ApiMediaUploadResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Upload video to gallery item
   * POST /api/admin/gallery/:itemId/upload-video
   */
  static async uploadVideo(
    token: string,
    itemId: string,
    videoFile: File
  ): Promise<{ success: boolean; data?: ApiMediaUploadResponse['data']; message?: string }> {
    try {
      // Validate file
      const validation = validateFile(videoFile, 'video');
      if (!validation.valid) {
        return { success: false, message: validation.message };
      }

      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/${itemId}/upload-video`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: formData
      });

      const result: ApiMediaUploadResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { success: false, message: parseApiError(error) };
    }
  }


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
 
  static async getCommissionByCategory(
    token: string,
    categoryId: string
  ): Promise<{ success: boolean; data?: ApiCommission; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/commission/${categoryId}`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiCommissionResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data?.commission,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching commission:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  static async getIndustries(
    token: string
  ): Promise<{ success: boolean; data?: ApiIndustry[]; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/industries`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiIndustriesResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data?.industries,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching industries:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Get locations
   * GET /api/admin/gallery/locations
   */
  static async getLocations(
    token: string
  ): Promise<{ success: boolean; data?: ApiLocation[]; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/locations`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiLocationsResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data?.locations,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Get platform code preview
   * GET /api/admin/gallery/preview-code
   */
  static async getPlatformCodePreview(
    token: string
  ): Promise<{ success: boolean; data?: PlatformCodePreview; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/preview-code`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiPlatformCodeResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching platform code preview:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Get media usage
   * GET /api/admin/gallery/media-usage
   */
  static async getMediaUsage(
    token: string
  ): Promise<{ success: boolean; data?: ApiMediaUsage; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery/media-usage`, {
        headers: this.getJsonHeaders(token)
      });

      const result: ApiMediaUsageResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching media usage:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Search services (public endpoint)
   * GET /api/public/products/search
   */
  static async searchServices(
    params: {
      search?: string;
      categoryId?: string;
      city?: string;
      state?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ success: boolean; data?: PublicSearchResponse['data']; message?: string }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('itemType', 'service');
      
      if (params.search) queryParams.append('search', params.search);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.city) queryParams.append('city', params.city);
      if (params.state) queryParams.append('state', params.state);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/api/public/products/search?${queryParams.toString()}`;
      
      const response = await fetch(url);
      const result: PublicSearchResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error searching services:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Get service details (public endpoint)
   * GET /api/public/products/:itemId
   */
  static async getServiceDetails(
    itemId: string
  ): Promise<{ success: boolean; data?: PublicServiceDetailsCompleteResponse['data']; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/public/products/${itemId}`);
      const result: PublicServiceDetailsCompleteResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error fetching service details:', error);
      return { success: false, message: parseApiError(error) };
    }
  }

  /**
   * Test connectivity
   */
  static async testConnectivity(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/gallery`, {
        method: 'HEAD',
        headers: this.getHeaders(token)
      });
      return response.ok;
    } catch (error) {
      console.error('Connectivity test failed:', error);
      return false;
    }
  }
}