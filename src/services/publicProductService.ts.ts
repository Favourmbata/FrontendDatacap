// services/publicProductService.ts

export interface PublicProductSearchParams {
  search?: string;
  itemType?: 'product' | 'service';
  categoryId?: string;
  categoryName?: string;
  industryId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PublicProduct {
  id: string;
  name: string;
  title: string;
  itemType: 'product' | 'service';
  categoryName: string;
  industryName: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  youSave: number;
  availableQuantity: number;
  sku: string;
  upc: string;
  platformUniqueCode: string;
  imageUrl: string | null;
  videoUrl: string | null;
  location: {
    brandName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    verified: boolean;
  } | null;
  businessName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProductDetails {
  product: {
    id: string;
    name: string;
    title: string;
    itemType: 'product' | 'service';
    location: {
      brandName: string;
      address: string;
      verified: boolean;
    };
    images: {
      main: string | null;
      video: string | null;
      all: string[];
      thumbnails: string[];
    };
    pricing: {
      originalPrice: number;
      discountedPrice: number;
      youSave: number;
      discount: number;
      upfrontPaymentPercentage: number;
      upfrontPaymentAmount: number;
    };
    productInfo: {
      category: string;
      industry: string;
      availableQuantity: number;
      sku: string;
      upc: string;
      platformUniqueCode: string;
    };
    description: string;
    ingredients: string;
    paymentMethods: string;
    notes: string;
  };
  serviceProvider: {
    producer: string;
    contact: {
      phone: string;
      email: string;
    };
    availability: {
      hours: string;
      days: string;
    };
  };
  serviceLocations: Array<{
    title: string;
    subtitle: string;
    fee: number;
    address: string;
    lga: string;
    state: string;
    country: string;
    verified: boolean;
    gallery: {
      images: string[];
      videos: string[];
    };
  }>;
}

export interface PublicSearchResponse {
  success: boolean;
  data: {
    items: PublicProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface PublicProductDetailsResponse {
  success: boolean;
  data: PublicProductDetails;
  message: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: Array<{ id: string; name: string; count: number }>;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com';

export class PublicProductService {
 
  static async searchProducts(params: PublicProductSearchParams = {}): Promise<PublicSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all non-undefined params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

     
      if (!params.page) queryParams.append('page', '1');
      if (!params.limit) queryParams.append('limit', '20');
      if (!params.sortBy) queryParams.append('sortBy', 'createdAt');
      if (!params.sortOrder) queryParams.append('sortOrder', 'desc');

      const url = `${BASE_URL}/api/public/products/search?${queryParams.toString()}`;
      console.log('PublicProductService: Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error searching public products:', error);
      return {
        success: false,
        data: {
          items: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
          },
        },
        message: 'Failed to fetch products',
      };
    }
  }

  static async getProductDetails(itemId: string): Promise<PublicProductDetailsResponse> {
    try {
      const url = `${BASE_URL}/api/public/products/${itemId}`;
      console.log('PublicProductService: Fetching product details from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product/Service not found or not available');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }

 
  static async getProductByCode(platformCode: string): Promise<PublicProductDetailsResponse> {
    try {
      const url = `${BASE_URL}/api/public/products/code/${platformCode}`;
      console.log('PublicProductService: Fetching product by code from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found with this platform code');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching product by code:', error);
      throw error;
    }
  }

  
  static async getAllCategories(): Promise<CategoryListResponse> {
    try {
      const url = `${BASE_URL}/api/public/products/categories`;
      console.log('PublicProductService: Fetching categories from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch categories',
      };
    }
  }

 
  static extractCategories(products: PublicProduct[]): Array<{ id: string; name: string }> {
    const categoryMap = new Map<string, string>();
    
    products.forEach(product => {
      if (product.categoryName && !categoryMap.has(product.categoryName)) {
        categoryMap.set(product.categoryName, product.categoryName);
      }
    });

    return Array.from(categoryMap.entries()).map(([name]) => ({
      id: name,
      name,
    }));
  }

 
  static extractIndustries(products: PublicProduct[]): Array<{ id: string; name: string }> {
    const industryMap = new Map<string, string>();
    
    products.forEach(product => {
      if (product.industryName && !industryMap.has(product.industryName)) {
        industryMap.set(product.industryName, product.industryName);
      }
    });

    return Array.from(industryMap.entries()).map(([name]) => ({
      id: name,
      name,
    }));
  }

  
  static extractLocations(products: PublicProduct[]): {
    cities: string[];
    states: string[];
  } {
    const cities = new Set<string>();
    const states = new Set<string>();

    products.forEach(product => {
      if (product.location?.city) {
        cities.add(product.location.city);
      }
      if (product.location?.state) {
        states.add(product.location.state);
      }
    });

    return {
      cities: Array.from(cities),
      states: Array.from(states),
    };
  }

  
  static formatNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

 
  static calculateSavingsPercentage(original: number, discounted: number): number {
    if (original === 0) return 0;
    return ((original - discounted) / original) * 100;
  }
}