import { HttpService } from './HttpService';

interface AssignRolePayload {
  assign: boolean;
}

interface ReviewPayload {
  status: 'approved' | 'rejected';
  comments?: string;
}

interface CreateVerificationPayload {
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organizationId: string;
  buildingPictures: {
    frontView: string;
    streetPicture: string;
    agentInFrontBuilding: string;
    whatsappLocation: string;
    insideOrganization: string;
    withStaffOrOwner: string;
    videoWithNeighbor: string;
  };
  transportationCost: {
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
  };
}

export class DataVerificationService {
  private static BASE_URL = '/api/super-admin/data-verification';

  // Super Admin - Assign/Remove Data Verification Role
  static async assignRole(userId: string, payload: AssignRolePayload) {
    return await HttpService.post(`${this.BASE_URL}/assign-role/${userId}`, payload);
  }

  // Super Admin - Get All Verifications
  static async getAllVerifications(status?: string) {
    const queryString = status ? `?status=${status}` : '';
    return await HttpService.get(`${this.BASE_URL}/verifications${queryString}`);
  }

  // Super Admin - Get Verification Details
  static async getVerificationById(id: string) {
    return await HttpService.get(`${this.BASE_URL}/verifications/${id}`);
  }

  // Super Admin - Review Verification
  static async reviewVerification(id: string, payload: ReviewPayload) {
    return await HttpService.post(`${this.BASE_URL}/verifications/${id}/review`, payload);
  }

  // Super Admin - Get Data Verification Users
  static async getVerificationUsers() {
    return await HttpService.get(`${this.BASE_URL}/verification-users`);
  }

  // Super Admin - Get Verification Statistics
  static async getVerificationStats() {
    return await HttpService.get(`${this.BASE_URL}/verification-stats`);
  }

  // Field Agent - Get Organizations
  static async getOrganizations() {
    return await HttpService.get('/api/data-verification/organizations');
  }

  // Field Agent - Get Users
  static async getUsers() {
    return await HttpService.get('/api/data-verification/users');
  }

  // Field Agent - Create Verification
  static async createVerification(payload: CreateVerificationPayload) {
    return await HttpService.post('/api/data-verification', payload);
  }

  // Field Agent - Submit Verification
  static async submitVerification(id: string) {
    return await HttpService.post(`/api/data-verification/${id}/submit`, {});
  }

  // Field Agent - Get My Verifications
  static async getMyVerifications() {
    return await HttpService.get('/api/data-verification/my-verifications');
  }
}