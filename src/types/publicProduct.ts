// types/publicProduct.ts

export interface PublicProductSearchParams {
  search?: string;
  itemType?: 'product' | 'service';
  categoryId?: string;
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
    organizationId: string;
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

export interface Industry {
  id: string;
  name: string;
}

export interface LocationFilter {
  cities: string[];
  states: string[];
}