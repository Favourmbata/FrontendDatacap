export interface CityRegion {
  id: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lga?: string;
  region?: string;
}

export interface CityRegionFormData {
  countryCode: string;
  stateCode: string;
  cityName: string;
  lga?: string;
  region?: string;
}


import { HttpService } from '../services/HttpService';

export interface VerificationData {
  id: string;
  field: string;
  agentId: string;
  organisationId: string;
  isOrganisationUpload: boolean;
  uploadCommit: string;
  address: string;
  headquartersUpload: string;
  operatingAddress: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationDataResponse {
  verificationData: VerificationData[];
  total: number;
  page: number;
  limit: number;
}

class VerificationDataService {
  private static httpService = new HttpService();

  static async getVerificationData(page: number = 1, limit: number = 10): Promise<VerificationDataResponse> {
    const response = await this.httpService.getData<{ 
      success: boolean; 
      data: VerificationDataResponse; 
      message: string; 
    }>(`/verification-data?page=${page}&limit=${limit}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch verification data');
    }
  }

  static async getVerificationDataById(id: string): Promise<VerificationData> {
    const response = await this.httpService.getData<{ 
      success: boolean; 
      data: { verificationData: VerificationData }; 
      message: string; 
    }>(`/verification-data/${id}`);
    
    if (response.success) {
      return response.data.verificationData;
    } else {
      throw new Error(response.message || 'Failed to fetch verification data');
    }
  }

  static async createVerificationData(data: Partial<VerificationData>): Promise<VerificationData> {
    const response = await this.httpService.postData<{ 
      success: boolean; 
      data: { verificationData: VerificationData }; 
      message: string; 
    }>(data, '/verification-data');
    
    if (response.success) {
      return response.data.verificationData;
    } else {
      throw new Error(response.message || 'Failed to create verification data');
    }
  }

  static async updateVerificationData(id: string, data: Partial<VerificationData>): Promise<VerificationData> {
    const response = await this.httpService.putData<{ 
      success: boolean; 
      data: { verificationData: VerificationData }; 
      message: string; 
    }>(data, `/verification-data/${id}`);
    
    if (response.success) {
      return response.data.verificationData;
    } else {
      throw new Error(response.message || 'Failed to update verification data');
    }
  }

  static async deleteVerificationData(id: string): Promise<void> {
    const response = await this.httpService.deleteData<{ 
      success: boolean; 
      message: string; 
    }>(`/verification-data/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete verification data');
    }
  }

  static async updateVerificationDataStatus(id: string, status: 'active' | 'inactive'): Promise<VerificationData> {
    const response = await this.httpService.patchData<{ 
      success: boolean; 
      data: { verificationData: VerificationData }; 
      message: string; 
    }>({ status }, `/verification-data/${id}/status`);
    
    if (response.success) {
      return response.data.verificationData;
    } else {
      throw new Error(response.message || 'Failed to update verification data status');
    }
  }

  static async searchVerificationData(query: string, page: number = 1, limit: number = 10): Promise<VerificationDataResponse> {
    const response = await this.httpService.getData<{ 
      success: boolean; 
      data: VerificationDataResponse; 
      message: string; 
    }>(`/verification-data/search?q=${query}&page=${page}&limit=${limit}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to search verification data');
    }
  }
}

export default VerificationDataService;