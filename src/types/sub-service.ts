

export interface SubService {
  id: string;
  name: string;
  description: string;
  picture: File | null;
  pictureUrl?: string; // For existing images from API
  price: string;
  subPlatformUniqueCode: string;
}


export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AvailabilityPeriod {
  startYear: string;
  endYear: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Availability {
  type: "unlimited" | "within_year" | "within_years" | "period";
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}

export interface Service {
  // Core fields
  id: string;
  name: string;              
  description: string;        
  
  // Category/Industry
  categoryId?: string;
  industryId?: string;
  locationIndex?: number;
  
  // Your existing fields (mapped to API)
  category: string;           // Will be mapped to categoryId
  sku: string;              
  producer: string;           
  upc: string;             
  totalProviders: string;     // Maps to totalAvailableServiceProviders
  timeSlot: TimeSlot;         // Maps to startTime/endTime

  // Sub-services
  subServiceCount: number;   
  subServices: SubService[];  

  // Pricing (your existing fields)
  discount: string;           // Maps to discountPercentage
  discountedAmount: string;   // Not used in API, calculated
  platformCharge: string;     // Maps to platformChargePercentage
  actualAmount: string;       // Not used in API, calculated

  // Visibility (your existing fields)
  visibilityPeriod: DateRange; // Maps to startDate/endDate
  upfrontPayment: boolean;     // Maps to upfrontPaymentPercentage (30% if true)

  // Availability (your existing fields)
  availabilityType: "unlimited" | "period"; // Maps to availability.type
  availabilityPeriod: AvailabilityPeriod;    // Maps to availability with within_year type
  
  // Additional fields
  paymentMethods?: string;
  notes?: string;
  image?: File | null;        // Main service image
  imageUrl?: string;          // Existing image URL from API
  visibilityToPublic?: boolean; // Default to true
}

// API SubService interface
export interface ApiSubService {
  name: string;
  description: string;
  price: number;
  subPlatformUniqueCode?: string;
  uploadPicture?: string;
}

// API Availability interface
export interface ApiAvailability {
  type: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}

// API Location Usage interface
export interface ApiLocationUsage {
  locationIndex: number;
  locationName: string;
  images: number;
  maxImages: number;
  videos: number;
  maxVideos: number;
  verified: boolean;
}

// API Pagination interface
export interface ApiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Service Response interface
export interface ApiServiceResponse {
  _id: string;
  organizationId: string;
  locationIndex: number;
  name: string;
  description: string;
  categoryId: string;
  industryId?: string;
  itemType: string;
  platformUniqueCode: string;
  producer?: string;
  totalAvailableServiceProviders?: number;
  totalAvailableQuantity?: number;
  priceInDollars: number;
  discountPercentage: number;
  platformChargePercentage: number;
  upfrontPaymentPercentage: number;
  upfrontPaymentAmount: number;
  actualAmount: number;
  hasSubServices: boolean;
  subServiceCount: number;
  subServices: Array<{
    name: string;
    description: string;
    subPlatformUniqueCode: string;
    uploadPicture?: string;
    price: number;
  }>;
  availability?: {
    type: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  visibilityToPublic: boolean;
  notes?: string;
  paymentMethods?: string;
  sku?: string;
  upc?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  categoryName: string; // Make sure this is required
  imageUrl?: string;
}

// API Gallery Items Response
export interface ApiGalleryItemsResponse {
  success: boolean;
  data: {
    items: ApiServiceResponse[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    locationUsage: Array<{
      locationIndex: number;
      locationName: string;
      images: number;
      maxImages: number;
      videos: number;
      maxVideos: number;
      verified: boolean;
    }>;
  };
  message: string;
}

// API Single Item Response
export interface ApiSingleItemResponse {
  success: boolean;
  data: {
    galleryItem: ApiServiceResponse;
  };
  message: string;
}

// API Media Upload Response
export interface ApiMediaUploadResponse {
  success: boolean;
  data: {
    galleryItem: {
      _id: string;
      imageUrl?: string;
      videoUrl?: string;
    };
    mediaUsage: {
      images: number;
      maxImages: number;
      videos: number;
      maxVideos: number;
    };
  };
  message: string;
}

// API Category interface
export interface ApiCategory {
  id: string;
  name: string;
  industryId: string;
  industryName?: string;
  description?: string;
}

// API Categories Response
export interface ApiCategoriesResponse {
  success: boolean;
  data: {
    categories: ApiCategory[];
  };
  message: string;
}

// API Commission interface
export interface ApiCommission {
  id: string;
  commissionName: string;
  commissionRate: number;
  categoryId: string;
  categoryName?: string;
  description?: string;
}

// API Commission Response
export interface ApiCommissionResponse {
  success: boolean;
  data: {
    commission: ApiCommission;
  };
  message: string;
}

// API Industry interface
export interface ApiIndustry {
  id: string;
  name: string;
}

// API Industries Response
export interface ApiIndustriesResponse {
  success: boolean;
  data: {
    industries: ApiIndustry[];
  };
  message: string;
}

// API Location interface
export interface ApiLocation {
  locationIndex: number;
  brandName: string;
  cityRegion: string;
  city: string;
  state: string;
  status: string;
  isPaidFor: boolean;
  verificationStatus: string;
  locationType: string;
}

// API Locations Response
export interface ApiLocationsResponse {
  success: boolean;
  data: {
    locations: ApiLocation[];
  };
  message: string;
}

// API Platform Code Preview interface
export interface PlatformCodePreview {
  platformUniqueCode: string;
  orgProductNumber: string;
  globalProductNumber: string;
}

// API Platform Code Response
export interface ApiPlatformCodeResponse {
  success: boolean;
  data: PlatformCodePreview;
  message: string;
}

// API Media Usage interface
export interface ApiMediaUsage {
  maxImages: number;
  maxVideos: number;
  currentImages: number;
  currentVideos: number;
  isVerified: boolean;
}

// API Media Usage Response
export interface ApiMediaUsageResponse {
  success: boolean;
  data: ApiMediaUsage;
  message: string;
}

// API Delete Response
export interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

// Public API interfaces
export interface PublicServiceLocation {
  brandName: string;
  city: string;
  verified: boolean;
}

export interface PublicServiceResponse {
  id: string;
  name: string;
  title: string;
  itemType: 'service';
  categoryName: string;
  originalPrice: number;
  discountedPrice: number;
  producer: string;
  totalAvailableServiceProviders: number;
  hasSubServices: boolean;
  subServiceCount: number;
  subServices?: ApiSubService[];
  availability: ApiAvailability;
  imageUrl?: string;
  location: PublicServiceLocation;
}

export interface PublicServiceDetailsResponse {
  id: string;
  name: string;
  title: string;
  itemType: 'service';
  images: {
    main?: string;
    video?: string | null;
    all: string[];
    thumbnails: string[];
  };
  pricing: {
    originalPrice: number;
    discountedPrice: number;
    youSave: number;
    discount: number;
    upfrontPaymentPercentage?: number;
    upfrontPaymentAmount?: number;
  };
  productInfo: {
    category: string;
    platformUniqueCode?: string;
  };
  producer: string;
  totalAvailableServiceProviders: number;
  hasSubServices: boolean;
  subServiceCount: number;
  subServices?: ApiSubService[];
  availability: ApiAvailability;
  description: string;
  paymentMethods?: string;
  notes?: string;
}

export interface PublicServiceProvider {
  producer: string;
  contact?: {
    phone?: string;
    email?: string;
  };
}

export interface PublicServiceLocationDetail {
  title: string;
  subtitle: string;
  fee: number;
  address: string;
  lga: string;
  state: string;
  country: string;
  verified: boolean;
}

export interface PublicServiceDetailsCompleteResponse {
  success: boolean;
  data: {
    product: PublicServiceDetailsResponse;
    serviceProvider: PublicServiceProvider;
    serviceLocations: PublicServiceLocationDetail[];
  };
  message: string;
}

export interface PublicSearchResponse {
  success: boolean;
  data: {
    items: PublicServiceResponse[];
    pagination: ApiPagination;
  };
  message: string;
}

// Constants
export const SUB_SERVICE_COUNT_OPTIONS = Array.from({ length: 99 }, (_, i) => i + 2);

export const INITIAL_SUB_SERVICE: SubService = {
  id: "",
  name: "",
  description: "",
  picture: null,
  price: "",
  subPlatformUniqueCode: "",
};

export const INITIAL_SERVICE: Service = {
  id: "",
  name: "",
  description: "",
  category: "",
  sku: "",
  producer: "",
  upc: "",
  totalProviders: "",
  subServiceCount: 0,
  subServices: [],
  discount: "",
  discountedAmount: "",
  timeSlot: { startTime: "", endTime: "" },
  platformCharge: "",
  actualAmount: "",
  visibilityPeriod: { startDate: "", endDate: "" },
  upfrontPayment: false,
  availabilityType: "unlimited",
  availabilityPeriod: { startYear: "", endYear: "" },
  // Optional new fields
  categoryId: "",
  industryId: "",
  locationIndex: 0,
  paymentMethods: "",
  notes: "",
  image: null,
  visibilityToPublic: true,
};

// Helper function to validate file before upload
export function validateFile(file: File, type: 'image' | 'video'): { valid: boolean; message?: string } {
  if (type === 'image') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, message: 'File size exceeds 5MB limit.' };
    }
  } else {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: 'Invalid file type. Only MP4, MPEG, MOV, and AVI are allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, message: 'File size exceeds 50MB limit.' };
    }
  }

  return { valid: true };
}

// Helper function to convert your Service to API format
export function serviceToApiFormat(service: Service): any {
  return {
    name: service.name,
    description: service.description,
    categoryId: service.categoryId || service.category,
    itemType: "service", // Add this required field
    locationIndex: service.locationIndex || 0,
    sku: service.sku || undefined,
    upc: service.upc || undefined,
    priceInDollars: parseFloat(service.actualAmount) || 0,
    discountPercentage: parseFloat(service.discount) || 0,
    platformChargePercentage: parseFloat(service.platformCharge) || 0,
    upfrontPaymentPercentage: service.upfrontPayment ? 30 : 0,
    producer: service.producer || undefined,
    totalAvailableServiceProviders: parseInt(service.totalProviders) || undefined,
    startDate: service.visibilityPeriod?.startDate || undefined,
    endDate: service.visibilityPeriod?.endDate || undefined,
    startTime: service.timeSlot?.startTime || undefined,
    endTime: service.timeSlot?.endTime || undefined,
    visibilityToPublic: service.visibilityToPublic !== undefined ? service.visibilityToPublic : true,
    hasSubServices: service.subServices.length > 0,
    subServiceCount: service.subServiceCount,
    subServices: service.subServices.map(sub => ({
      name: sub.name,
      description: sub.description,
      price: parseFloat(sub.price)
    })),
    availability: {
      type: service.availabilityType === 'period' ? 'period' : 'unlimited',
      ...(service.availabilityType === 'period' && {
        startDate: service.visibilityPeriod?.startDate,
        startTime: service.timeSlot?.startTime,
        endDate: service.visibilityPeriod?.endDate,
        endTime: service.timeSlot?.endTime
      })
    }
  };
}

// Helper function to convert API response to your Service format
export function apiToServiceFormat(apiResponse: ApiServiceResponse): Service {
  return {
    id: apiResponse._id,
    name: apiResponse.name,
    description: apiResponse.description,
    category: apiResponse.categoryName || '',
    categoryId: apiResponse.categoryId,
    industryId: apiResponse.industryId,
    sku: apiResponse.sku || '',
    producer: apiResponse.producer || '',
    upc: apiResponse.upc || '',
    totalProviders: apiResponse.totalAvailableServiceProviders?.toString() || '',
    subServiceCount: apiResponse.subServiceCount || 0,
    subServices: apiResponse.subServices?.map((sub, index) => ({
      id: `sub-${index}`,
      name: sub.name,
      description: sub.description,
      picture: null,
      pictureUrl: sub.uploadPicture,
      price: sub.price.toString(),
      subPlatformUniqueCode: sub.subPlatformUniqueCode || ''
    })) || [],
    discount: apiResponse.discountPercentage?.toString() || '',
    discountedAmount: '',
    timeSlot: {
      startTime: apiResponse.startTime || '',
      endTime: apiResponse.endTime || ''
    },
    platformCharge: apiResponse.platformChargePercentage?.toString() || '',
    actualAmount: apiResponse.actualAmount?.toString() || '',
    visibilityPeriod: {
      startDate: apiResponse.startDate || '',
      endDate: apiResponse.endDate || ''
    },
    upfrontPayment: (apiResponse.upfrontPaymentPercentage || 0) > 0,
    availabilityType: apiResponse.availability?.type === 'unlimited' ? 'unlimited' : 'period',
    availabilityPeriod: {
      startYear: apiResponse.availability?.startDate?.split('-')[0] || '',
      endYear: apiResponse.availability?.endDate?.split('-')[0] || ''
    },
    paymentMethods: apiResponse.paymentMethods || '',
    notes: apiResponse.notes,
    imageUrl: apiResponse.imageUrl,
    visibilityToPublic: apiResponse.visibilityToPublic,
    locationIndex: apiResponse.locationIndex
  };
}

// Helper function to format location for select dropdown
export function formatLocationForSelect(location: ApiLocation): {
  value: number;
  label: string;
  disabled: boolean;
  locationIndex: number;
  brandName: string;
  cityRegion: string;
  city: string;
  state: string;
  status: string;
  isPaidFor: boolean;
  verificationStatus: string;
  locationType: string;
} {
  return {
    value: location.locationIndex,
    label: `${location.brandName} - ${location.cityRegion}, ${location.city}, ${location.state} (${location.status})`,
    disabled: location.status === 'Pending Payment' || !location.isPaidFor,
    locationIndex: location.locationIndex,
    brandName: location.brandName,
    cityRegion: location.cityRegion,
    city: location.city,
    state: location.state,
    status: location.status,
    isPaidFor: location.isPaidFor,
    verificationStatus: location.verificationStatus,
    locationType: location.locationType
  };
}

// Helper function to get media usage status
export function getMediaUsageStatus(mediaUsage: ApiMediaUsage): {
  canUploadMoreImages: boolean;
  canUploadMoreVideos: boolean;
  imagesRemaining: number;
  videosRemaining: number;
} {
  return {
    canUploadMoreImages: mediaUsage.currentImages < mediaUsage.maxImages,
    canUploadMoreVideos: mediaUsage.currentVideos < mediaUsage.maxVideos,
    imagesRemaining: mediaUsage.maxImages - mediaUsage.currentImages,
    videosRemaining: mediaUsage.maxVideos - mediaUsage.currentVideos
  };
}

// Helper function to calculate actual amount
export function calculateActualAmount(
  price: number, 
  discountPercentage: number, 
  platformChargePercentage: number
): number {
  return price - (price * discountPercentage / 100) + (price * platformChargePercentage / 100);
}

// Helper function to calculate upfront payment amount
export function calculateUpfrontPaymentAmount(
  actualAmount: number,
  upfrontPaymentPercentage: number
): number {
  return actualAmount * (upfrontPaymentPercentage / 100);
}

// Helper function to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

// Helper function to get media limits based on verification status
export function getMediaLimits(isVerified: boolean): { maxImages: number; maxVideos: number } {
  return {
    maxImages: isVerified ? 10 : 3,
    maxVideos: isVerified ? 2 : 0
  };
}