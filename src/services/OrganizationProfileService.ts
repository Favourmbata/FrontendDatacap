import { HttpService } from './HttpService';

export interface OrganizationProfile {
  businessType: 'registered' | 'unregistered';
  isPublicProfile?: boolean;
  verificationStatus: 'verified' | 'unverified';
  locations?: LocationData[];
  _id?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface LocationData {
  locationType: 'headquarters' | 'branch';
  brandName: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  cityRegionFee?: number;
  houseNumber: string;
  street: string;
  landmark?: string;
  buildingColor?: string;
  buildingType?: string;
  gallery: {
    images: (string | File)[];
    videos: (string | File)[];
  };
}

export interface VerificationEligibility {
  verificationStatus: 'verified' | 'unverified';
  canAddMoreLocations: boolean;
  currentLocations: number;
  limits: {
    maxLocations: number;
    maxImagesPerLocation: number;
    maxVideosPerLocation: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  requiresVerification?: boolean;
}

class OrganizationProfileService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Create or update organization profile
   */
  async createOrUpdateProfile(profileData: OrganizationProfile): Promise<ApiResponse<{ profile: OrganizationProfile }>> {
    return this.httpService.postData<ApiResponse<{ profile: OrganizationProfile }>>(
      profileData,
      '/api/admin/organization-profile'
    );
  }

  /**
   * Get organization profile
   */
  async getProfile(): Promise<ApiResponse<{ profile: OrganizationProfile }>> {
    return this.httpService.getData<ApiResponse<{ profile: OrganizationProfile }>>(
      '/api/admin/organization-profile'
    );
  }

  /**
   * Add a new location
   */
  async addLocation(locationData: LocationData | LocationData[]): Promise<ApiResponse<{ profile: OrganizationProfile }>> {
    return this.httpService.postData<ApiResponse<{ profile: OrganizationProfile }>>(
      locationData,
      '/api/admin/organization-profile/locations'
    );
  }

  /**
   * Update existing location
   */
  async updateLocation(locationIndex: number, locationData: Partial<LocationData>): Promise<ApiResponse<{ profile: OrganizationProfile }>> {
    // Prepare data for updating location
    const updateData = {
      locationIndex,
      locationData
    };
    return this.httpService.putData<ApiResponse<{ profile: OrganizationProfile }>>(
      updateData,
      `/api/admin/organization-profile/locations/${locationIndex}`
    );
  }

  /**
   * Delete location
   */
  async deleteLocation(locationIndex: number): Promise<ApiResponse<null>> {
    // Prepare data for deleting location
    const deleteData = { locationIndex };
    return this.httpService.deleteData<ApiResponse<null>>(
      `/api/admin/organization-profile/locations/${locationIndex}`,
      deleteData
    );
  }

  /**
   * Check verification eligibility
   */
  async checkVerificationEligibility(): Promise<ApiResponse<VerificationEligibility>> {
    return this.httpService.getData<ApiResponse<VerificationEligibility>>(
      '/api/admin/organization-profile/verification/check'
    );
  }

  /**
   * Get all locations
   */
  async getAllLocations(): Promise<ApiResponse<{ locations: LocationData[] }>> {
    // Get locations from the main profile endpoint
    const response = await this.getProfile();
    if (response.success && response.data && response.data.profile) {
      return {
        success: true,
        data: { locations: response.data.profile.locations || [] }
      };
    }
    return {
      success: false,
      message: response.message || 'Failed to retrieve locations',
      data: { locations: [] }
    };
  }

  /**
   * Get all public profiles
   */
  async getAllPublicProfiles(): Promise<ApiResponse<any[]>> {
    return this.httpService.getData<ApiResponse<any[]>>(
      '/api/organization-profiles/public/all'
    );
  }
}

export default OrganizationProfileService;