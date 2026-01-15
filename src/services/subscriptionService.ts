// services/subscriptionService.ts
import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

// Define the subscription package interface to match the API response
export interface SubscriptionPackage {
  id: string;
  _id?: string; // For MongoDB compatibility
  title: string;
  description: string;
  price: number;
  features: string[];
  note?: string;
  services?: string;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  setupDate?: string;
  promoStartDate?: string;
  promoEndDate?: string;
  updatedDate?: string;
  status: 'active' | 'inactive';
  isActive?: boolean; // Some APIs use isActive instead of status
  subscriberCount?: number;
  createdAt: string;
  updatedAt: string;
  promoCode?: string;
  // Additional fields from API
  createdBy?: string;
  __v?: number; // MongoDB version key
}

// Extended interface for form data (used in create/edit pages)
export interface SubscriptionPackageFormData extends SubscriptionPackage {
  featuresInput?: string;
  financialDetails?: Array<{
    id: string;
    amount: number;
    platformChargePercent: number;
    platformChargeValue: number;
    actualAmount: number;
    discountPercentage: number;
  }>;
}

// Interface for creating a subscription package
export interface CreateSubscriptionPackageData {
  title: string;
  description: string;
  price: number;
  features: string[];
  note?: string;
  services?: string;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  promoStartDate?: string;
  promoEndDate?: string;
}

// Interface for updating subscription status
export interface UpdateSubscriptionStatusData {
  status: 'active' | 'inactive';
}

// Interface for the API response structure
interface SubscriptionPackageResponse {
  success: boolean;
  data: {
    package: SubscriptionPackage;
    message?: string;
  };
}

interface SubscriptionPackagesResponse {
  success: boolean;
  data: {
    packages: Array<{
      _id: string;
      title: string;
      description: string;
      price: number;
      features: string[];
      note?: string;
      services?: string;
      monthlyPrice?: number;
      quarterlyPrice?: number;
      yearlyPrice?: number;
      setupDate?: string;
      promoStartDate?: string;
      promoEndDate?: string;
      updatedDate?: string;
      isActive?: boolean;
      subscriberCount?: number;
      createdAt: string;
      updatedAt: string;
      promoCode?: string;
      createdBy?: string;
      __v?: number;
    }>;
    total: number;
    message?: string;
  };
}

class SubscriptionService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService(process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com');
  }

  // Helper function to transform API package to SubscriptionPackage interface
  private transformPackage(pkg: any): SubscriptionPackage {
    return {
      id: pkg._id, // Map _id to id
      _id: pkg._id,
      title: pkg.title || '',
      description: pkg.description || '',
      price: pkg.price || 0,
      features: Array.isArray(pkg.features) ? pkg.features : [],
      note: pkg.note,
      services: pkg.services,
      monthlyPrice: pkg.monthlyPrice,
      quarterlyPrice: pkg.quarterlyPrice,
      yearlyPrice: pkg.yearlyPrice,
      setupDate: pkg.setupDate,
      promoStartDate: pkg.promoStartDate,
      promoEndDate: pkg.promoEndDate,
      updatedDate: pkg.updatedDate,
      status: pkg.isActive ? 'active' : 'inactive', // Convert isActive to status
      isActive: pkg.isActive,
      subscriberCount: pkg.subscriberCount,
      createdAt: pkg.createdAt || new Date().toISOString(),
      updatedAt: pkg.updatedAt || new Date().toISOString(),
      promoCode: pkg.promoCode,
      createdBy: pkg.createdBy,
      __v: pkg.__v
    };
  }

  // Get all subscription packages
  async getSubscriptionPackages(): Promise<{ packages: SubscriptionPackage[]; total: number }> {
    try {
      const url = routes.getAllSubscriptionPackage();
      const response = await this.httpService.getData<SubscriptionPackagesResponse>(url);
      
      if (response.success) {
        // Transform all packages to match our interface
        const transformedPackages = response.data.packages.map(pkg => 
          this.transformPackage(pkg)
        );
        
        return {
          packages: transformedPackages,
          total: response.data.total
        };
      } else {
        throw new Error(response.data?.message || 'Failed to fetch subscription packages');
      }
    } catch (error) {
      console.error('Error fetching subscription packages:', error);
      throw error;
    }
  }

  // Get all subscription packages (alias for compatibility)
  async getAllSubscriptionPackages(): Promise<SubscriptionPackage[]> {
    try {
      const { packages } = await this.getSubscriptionPackages();
      return packages;
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
        return this.transformPackage(response.data.package);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch subscription package');
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
        return this.transformPackage(response.data.package);
      } else {
        throw new Error(response.data?.message || 'Failed to create subscription package');
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
        return this.transformPackage(response.data.package);
      } else {
        throw new Error(response.data?.message || 'Failed to update subscription package');
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
      // Convert status to isActive for the API
      const isActive = status === 'active';
      const response = await this.httpService.putData<SubscriptionPackageResponse>({ isActive }, url);
      
      if (response.success) {
        return this.transformPackage(response.data.package);
      } else {
        throw new Error(response.data?.message || 'Failed to update subscription status');
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
