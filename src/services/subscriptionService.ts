// services/subscriptionService.ts
import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

// Define the subscription package interface to match the API response
interface SubscriptionPackage {
  id: string;
  packageName: string;
  services: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  setupDate: string;
  promoStartDate?: string;
  promoEndDate?: string;
  updatedDate: string;
  status: 'active' | 'inactive';
  description: string;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
  promoCode?: string; // Add this field for the form
}

// Interface for creating a subscription package
interface CreateSubscriptionPackageData {
  packageName: string;
  services: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  promoStartDate?: string;
  promoEndDate?: string;
  description: string;
}

// Interface for updating subscription status
interface UpdateSubscriptionStatusData {
  status: 'active' | 'inactive';
}

// Interface for the response from the API
interface SubscriptionPackageResponse {
  success: boolean;
  data: {
    package: SubscriptionPackage;
  };
  message: string;
}

interface SubscriptionPackagesResponse {
  success: boolean;
  data: {
    packages: SubscriptionPackage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

class SubscriptionService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Get all subscription packages with pagination and filtering
  async getSubscriptionPackages(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    status?: 'active' | 'inactive'
  ): Promise<{ packages: SubscriptionPackage[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const url = routes.getSubscriptionPackages(page, limit, search, sortBy, sortOrder, status);
      const response = await this.httpService.getData<SubscriptionPackagesResponse>(url);
      
      if (response.success) {
        return {
          packages: response.data.packages,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        };
      } else {
        throw new Error(response.message || 'Failed to fetch subscription packages');
      }
    } catch (error) {
      console.error('Error fetching subscription packages:', error);
      throw error;
    }
  }

  // Get a specific subscription package by ID
  async getSubscriptionPackageById(id: string): Promise<SubscriptionPackage> {
    try {
      const url = routes.getSubscriptionPackageById(id);
      const response = await this.httpService.getData<SubscriptionPackageResponse>(url);
      
      if (response.success) {
        return response.data.package;
      } else {
        throw new Error(response.message || 'Failed to fetch subscription package');
      }
    } catch (error) {
      console.error('Error fetching subscription package:', error);
      throw error;
    }
  }

  // Create a new subscription package
  async createSubscriptionPackage(data: CreateSubscriptionPackageData): Promise<SubscriptionPackage> {
    try {
      const url = routes.createSubscriptionPackage();
      const response = await this.httpService.postData<SubscriptionPackageResponse>(data, url);
      
      if (response.success) {
        return response.data.package;
      } else {
        throw new Error(response.message || 'Failed to create subscription package');
      }
    } catch (error) {
      console.error('Error creating subscription package:', error);
      throw error;
    }
  }

  // Update a subscription package
  async updateSubscriptionPackage(id: string, data: Partial<CreateSubscriptionPackageData>): Promise<SubscriptionPackage> {
    try {
      const url = routes.updateSubscriptionPackage(id);
      const response = await this.httpService.putData<SubscriptionPackageResponse>(data, url);
      
      if (response.success) {
        return response.data.package;
      } else {
        throw new Error(response.message || 'Failed to update subscription package');
      }
    } catch (error) {
      console.error('Error updating subscription package:', error);
      throw error;
    }
  }

  // Delete a subscription package
  async deleteSubscriptionPackage(id: string): Promise<boolean> {
    try {
      const url = routes.deleteSubscriptionPackage(id);
      const response = await this.httpService.deleteData<{ success: boolean; message: string }>(url);
      
      return response.success;
    } catch (error) {
      console.error('Error deleting subscription package:', error);
      throw error;
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(id: string, status: 'active' | 'inactive'): Promise<SubscriptionPackage> {
    try {
      const url = routes.updateSubscriptionStatus(id);
      const response = await this.httpService.putData<SubscriptionPackageResponse>({ status }, url);
      
      if (response.success) {
        return response.data.package;
      } else {
        throw new Error(response.message || 'Failed to update subscription status');
      }
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  // Export subscription packages
  async exportSubscriptionPackages(format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    try {
      const url = routes.exportSubscriptionPackages(format);
      return await this.httpService.download(url);
    } catch (error) {
      console.error('Error exporting subscription packages:', error);
      throw error;
    }
  }
}

export default new SubscriptionService();
export type { SubscriptionPackage, CreateSubscriptionPackageData, UpdateSubscriptionStatusData };