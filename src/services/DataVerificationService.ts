import { HttpService } from './HttpService';

// Types for the data verification endpoints
interface OrganizationDetails {
  name: string;
  attachments: Array<{
    fileUrl: string;
    comments: string;
  }>;
  headquartersAddress: string;
  addressAttachments: Array<{
    fileUrl: string;
    comments: string;
  }>;
}

interface BuildingPictures {
  frontView: string;
  streetPicture: string;
  agentInFrontBuilding: string;
  whatsappLocation: string;
  insideOrganization: string;
  withStaffOrOwner: string;
  videoWithNeighbor: string;
}

interface TransportationCost {
  going: Array<{
    startPoint: string;
    time: string;
    nextDestination: string;
    fareSpent: number;
    timeSpent: string;
  }>;
  finalDestination: string;
  finalFareSpent: number;
  finalTime: string;
  totalJourneyTime: string;
  comingBack: {
    totalTransportationCost: number;
    otherExpensesCost: number;
    receiptUrl: string;
  };
}

interface CreateVerificationRequest {
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organizationId: string;
  organizationName: string;
  targetUserId: string;
  targetUserFirstName: string;
  targetUserLastName: string;
  organizationDetails: OrganizationDetails;
  buildingPictures: BuildingPictures;
  transportationCost: TransportationCost;
}

// Export the status type for consistency
export type VerificationStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

interface VerificationResponse {
  _id: string;
  verificationId: string;
  verifierUserId: string;
  verifierName: string;
  status: VerificationStatus;
  createdAt: string;
}

interface MyVerificationsResponse {
  verifications: Array<{
    _id: string;
    verificationId: string;
    organizationName: string;
    status: VerificationStatus;
    createdAt: string;
  }>;
  total: number;
}

interface OrganizationsResponse {
  organizations: Array<{
    id: string;
    name: string;
    adminId: string;
    customIdPrefix: string;
  }>;
  total: number;
}

interface UsersResponse {
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    organizationId: string;
  }>;
  total: number;
}

export class DataVerificationService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Create new verification
  async createVerification(data: CreateVerificationRequest): Promise<{ success: boolean; data: { verification: VerificationResponse }; message: string }> {
    try {
      const response = await this.httpService.postData<any>(data, '/api/data-verification');
      return response;
    } catch (error) {
      console.error('Error creating verification:', error);
      throw error;
    }
  }

  // Get my verifications
  async getMyVerifications(): Promise<{ success: boolean; data: MyVerificationsResponse; message: string }> {
    try {
      const response = await this.httpService.getData<any>('/api/data-verification/my-verifications');
      return response;
    } catch (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
  }

  // Get organizations list
  async getOrganizations(): Promise<{ success: boolean; data: OrganizationsResponse; message: string }> {
    try {
      const response = await this.httpService.getData<any>('/api/data-verification/organizations');
      return response;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  // Get users list
  async getUsers(): Promise<{ success: boolean; data: UsersResponse; message: string }> {
    try {
      const response = await this.httpService.getData<any>('/api/data-verification/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Update verification (only if status is 'draft')
  async updateVerification(id: string, data: Partial<CreateVerificationRequest>): Promise<{ success: boolean; data: { verification: VerificationResponse }; message: string }> {
    try {
      const response = await this.httpService.putData<any>(data, `/api/data-verification/${id}`);
      return response;
    } catch (error) {
      console.error('Error updating verification:', error);
      throw error;
    }
  }

  // Submit verification
  async submitVerification(id: string): Promise<{ success: boolean; data: { verification: VerificationResponse }; message: string }> {
    try {
      const response = await this.httpService.postData<any>({}, `/api/data-verification/${id}/submit`);
      return response;
    } catch (error) {
      console.error('Error submitting verification:', error);
      throw error;
    }
  }

  // Get verification by ID
  async getVerificationById(id: string): Promise<{ success: boolean; data: { verification: any }; message: string }> {
    try {
      const response = await this.httpService.getData<any>(`/api/data-verification/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching verification:', error);
      throw error;
    }
  }

  // Get all verifications (for super admin)
  static async getAllVerifications(status?: string): Promise<{ success: boolean; data: { verifications: any[]; total: number }; message: string }> {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await HttpService.get<any>(`/api/data-verification/admin/all${params}`);
      return response;
    } catch (error) {
      console.error('Error fetching all verifications:', error);
      throw error;
    }
  }

  // Get verification users (for super admin)
  static async getVerificationUsers(): Promise<{ success: boolean; data: UsersResponse; message: string }> {
    try {
      const response = await HttpService.get<any>('/api/data-verification/admin/users');
      return response;
    } catch (error) {
      console.error('Error fetching verification users:', error);
      throw error;
    }
  }

  // Get verification stats (for super admin)
  static async getVerificationStats(): Promise<{ success: boolean; data: { stats: any }; message: string }> {
    try {
      const response = await HttpService.get<any>('/api/data-verification/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw error;
    }
  }

  // Get verification by ID (static version for super admin)
  static async getVerificationById(id: string): Promise<{ success: boolean; data: { verification: any }; message: string }> {
    try {
      const response = await HttpService.get<any>(`/api/data-verification/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching verification:', error);
      throw error;
    }
  }

  // Review verification (for super admin)
  static async reviewVerification(id: string, data: { status: string; comments: string }): Promise<{ success: boolean; data: { verification: any }; message: string }> {
    try {
      const response = await HttpService.post<any>(`/api/data-verification/${id}/review`, data);
      return response;
    } catch (error) {
      console.error('Error reviewing verification:', error);
      throw error;
    }
  }

  // Create new verification (static version)
  static async createVerification(data: CreateVerificationRequest): Promise<{ success: boolean; data: { verification: VerificationResponse }; message: string }> {
    try {
      const response = await HttpService.post<any>('/api/data-verification', data);
      return response;
    } catch (error) {
      console.error('Error creating verification:', error);
      throw error;
    }
  }

  // Get organizations list (static version)
  static async getOrganizations(): Promise<{ success: boolean; data: OrganizationsResponse; message: string }> {
    try {
      const response = await HttpService.get<any>('/api/data-verification/organizations');
      return response;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  // Get my verifications (static version)
  static async getMyVerifications(): Promise<{ success: boolean; data: MyVerificationsResponse; message: string }> {
    try {
      const response = await HttpService.get<any>('/api/data-verification/my-verifications');
      return response;
    } catch (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
  }
}