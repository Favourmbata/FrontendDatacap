
import { routes } from './apiRoutes';

console.log('GalleryService: Imported routes object:', routes);

interface GalleryItemCreateData {
  description: string;
  category: string;
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity?: number;
  priceInDollars?: number;
  discountPercentage?: number;
  platformChargePercentage?: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic?: boolean;
  notes?: string;
  locationIndex?: number;
}
interface LocationUsage {
  locationIndex: number;
  locationName: string;
  images: number;
  maxImages: number;
  videos: number;
  maxVideos: number;
  verified: boolean;
}

interface GalleryItemsResponse {
  success: boolean;
  data: {
    items: GalleryItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    locationUsage: LocationUsage[];
  };
  message: string;
}

interface GalleryItemUpdateData {
  description?: string;
  category?: string;
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity?: number;
  priceInDollars?: number;
  discountPercentage?: number;
  platformChargePercentage?: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  visibilityToPublic?: boolean;
  notes?: string;
  locationIndex?: number;
}

interface GalleryItem {
  _id: string;
  description: string;
  category: string;
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity: number;
  priceInDollars: number;
  discountPercentage: number;
  platformChargePercentage: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic: boolean;
  notes?: string;
  locationIndex: number;
  images: string[];
  videos: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  name: string;
  count: number;
}

interface PaginationResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface MediaUsage {
  maxImages: number;
  maxVideos: number;
  currentImages: number;
  currentVideos: number;
  isVerified: boolean;
}

export class GalleryService {
  private static getHeaders(token: string) {
    console.log('GalleryService: Using backend URL:', process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Create a new gallery item
  static async createGalleryItem(token: string, data: GalleryItemCreateData): Promise<{ success: boolean; data?: GalleryItem; message?: string }> {
    try {
      console.log('GalleryService: Creating gallery item with data:', data);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.base}`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(data)
      });

      console.log('GalleryService: Create response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Create result:', result);
      return result;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return { success: false, message: 'Failed to create gallery item' };
    }
  }

  // Get all gallery items with pagination and filters
static async getGalleryItems(
  token: string,
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  startDate?: string,
  endDate?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  visibilityToPublic?: boolean
): Promise<GalleryItemsResponse> {
  try {
    console.log('GalleryService: Fetching gallery items with token:', token.substring(0, 10) + '...');
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (visibilityToPublic !== undefined) params.append('visibilityToPublic', visibilityToPublic.toString());

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.base}`;
    const url = `${baseUrl}?${params.toString()}`;
    console.log('GalleryService: Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });

    console.log('GalleryService: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('GalleryService: Gallery items result:', result);
    
    // Return the full response with locationUsage
    return {
      success: result.success,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return { 
      success: false, 
      data: {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        },
        locationUsage: []
      },
      message: 'Failed to fetch gallery items' 
    };
  }
}

  // Get single gallery item
  static async getGalleryItem(token: string, itemId: string): Promise<{ success: boolean; data?: GalleryItem; message?: string }> {
    try {
      console.log('GalleryService: Fetching item', itemId);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.item(itemId)}`;
      const response = await fetch(fullUrl, {
        headers: this.getHeaders(token)
      });

      console.log('GalleryService: Get item response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Get item result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return { success: false, message: 'Failed to fetch gallery item' };
    }
  }

  // Update gallery item
  static async updateGalleryItem(
    token: string, 
    itemId: string, 
    data: GalleryItemUpdateData
  ): Promise<{ success: boolean; data?: GalleryItem; message?: string }> {
    try {
      console.log('GalleryService: Updating item', itemId, 'with data:', data);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.item(itemId)}`;
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(data)
      });

      console.log('GalleryService: Update response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Update result:', result);
      return result;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false, message: 'Failed to update gallery item' };
    }
  }

  // Delete gallery item
  static async deleteGalleryItem(token: string, itemId: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('GalleryService: Deleting item', itemId);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.item(itemId)}`;
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: this.getHeaders(token)
      });

      console.log('GalleryService: Delete response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Delete result:', result);
      return result;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false, message: 'Failed to delete gallery item' };
    }
  }

  // Upload image to gallery item
  static async uploadImage(
    token: string, 
    itemId: string, 
    imageFile: File
  ): Promise<{ success: boolean; data?: { imageUrl: string }; message?: string }> {
    try {
      console.log('GalleryService: Uploading image for item', itemId, 'file:', imageFile.name);
      const formData = new FormData();
      formData.append('image', imageFile);

      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.uploadImage(itemId)}`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('GalleryService: Image upload response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Image upload result:', result);
      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, message: 'Failed to upload image' };
    }
  }

  // Upload video to gallery item
  static async uploadVideo(
    token: string, 
    itemId: string, 
    videoFile: File
  ): Promise<{ success: boolean; data?: { videoUrl: string }; message?: string }> {
    try {
      console.log('GalleryService: Uploading video for item', itemId, 'file:', videoFile.name);
      const formData = new FormData();
      formData.append('video', videoFile);

      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.uploadVideo(itemId)}`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('GalleryService: Video upload response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Video upload result:', result);
      return result;
    } catch (error) {
      console.error('Error uploading video:', error);
      return { success: false, message: 'Failed to upload video' };
    }
  }

  // Get categories list
  static async getCategories(token: string): Promise<{ success: boolean; data?: Category[]; message?: string }> {
    try {
      console.log('GalleryService: Fetching categories from', routes.gallery.categories);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.categories}`;
      const response = await fetch(fullUrl, {
        headers: this.getHeaders(token)
      });

      console.log('GalleryService: Categories response status', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Categories result', result);
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, message: `Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Get media usage statistics
  static async getMediaUsage(token: string): Promise<{ success: boolean; data?: MediaUsage; message?: string }> {
    try {
      console.log('GalleryService: Fetching media usage');
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.mediaUsage}`;
      const response = await fetch(fullUrl, {
        headers: this.getHeaders(token)
      });

      console.log('GalleryService: Media usage response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('GalleryService: Media usage result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching media usage:', error);
      return { success: false, message: 'Failed to fetch media usage' };
    }
  }

  // Test backend connectivity
  static async testConnectivity(token: string): Promise<boolean> {
    try {
      console.log('GalleryService: Testing connectivity to', routes.gallery.base);
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}${routes.gallery.base}`;
      const response = await fetch(fullUrl, {
        method: 'HEAD',
        headers: this.getHeaders(token)
      });
      console.log('GalleryService: Connectivity test response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connectivity test failed:', error);
      return false;
    }
  }

  // Calculate actual amount
  static calculateActualAmount(price: number, discount: number, platformCharge: number): number {
    return price - (price * discount / 100) + (price * platformCharge / 100);
  }

  // Validate image file
  static validateImageFile(file: File): { valid: boolean; message?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, message: 'File size exceeds 5MB limit.' };
    }

    return { valid: true };
  }

  // Validate video file
  static validateVideoFile(file: File): { valid: boolean; message?: string } {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Only MP4, MPEG, MOV, and AVI are allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, message: 'File size exceeds 50MB limit.' };
    }

    return { valid: true };
  }
}