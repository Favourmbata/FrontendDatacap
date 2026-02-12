import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface DefaultPricing {
  _id: string;
  country: string;
  state?: string;
  lga?: string;
  city?: string;
  defaultFee: number;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface DefaultPricingFormData {
  country: string;
  state?: string;
  lga?: string;
  city?: string;
  defaultFee: number;
  description: string;
  isActive?: boolean;
}

export interface DefaultPricingResponse {
  success: boolean;
  data: {
    pricing?: DefaultPricing;
    pricings?: DefaultPricing[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  message: string;
}

class DefaultPricingService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }
async getDefaultPricings(
  page: number = 1,
  limit: number = 20,
  country?: string,
  state?: string
): Promise<{
  pricings: DefaultPricing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const response = await this.httpService.getData<any>(
      routes.getDefaultPricing(page, limit, country, state)
    );

    console.log('API Response:', response);

    if (response.success) {
      // The API returns array in "pricing" key
      const pricingsArray = response.data.pricing || [];
      
      return {
        pricings: Array.isArray(pricingsArray) ? pricingsArray : [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 20,
        totalPages: response.data.totalPages || 1
      };
    } else {
      throw new Error(response.message || 'Failed to fetch default pricings');
    }
  } catch (error) {
    console.error('Error fetching default pricings:', error);
    throw error;
  }
}
  // async getDefaultPricings(
  //   page: number = 1,
  //   limit: number = 20,
  //   country?: string,
  //   state?: string
  // ): Promise<{
  //   pricings: DefaultPricing[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // }> {
  //   try {
  //     const response = await this.httpService.getData<DefaultPricingResponse>(
  //       routes.getDefaultPricing(page, limit, country, state)
  //     );

  //     if (response.success) {
  //       return {
  //         pricings: response.data.pricings || [],
  //         total: response.data.total || 0,
  //         page: response.data.page || 1,
  //         limit: response.data.limit || 20,
  //         totalPages: response.data.totalPages || 1
  //       };
  //     } else {
  //       throw new Error(response.message || 'Failed to fetch default pricings');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching default pricings:', error);
  //     throw error;
  //   }
  // }

  async getDefaultPricingById(id: string): Promise<DefaultPricing> {
    try {
      const response = await this.httpService.getData<DefaultPricingResponse>(
        routes.getDefaultPricingById(id)
      );

      if (response.success && response.data.pricing) {
        return response.data.pricing;
      } else {
        throw new Error(response.message || 'Failed to fetch default pricing');
      }
    } catch (error) {
      console.error('Error fetching default pricing:', error);
      throw error;
    }
  }

  async createDefaultPricing(data: DefaultPricingFormData): Promise<DefaultPricing> {
    try {
      // Validate defaultFee is positive
      if (data.defaultFee <= 0) {
        throw new Error('Default fee must be a positive number');
      }

      const response = await this.httpService.postData<DefaultPricingResponse>(
        data,
        routes.createDefaultPricing()
      );

      if (response.success && response.data.pricing) {
        return response.data.pricing;
      } else {
        throw new Error(response.message || 'Failed to create default pricing');
      }
    } catch (error) {
      console.error('Error creating default pricing:', error);
      throw error;
    }
  }

  async updateDefaultPricing(id: string, data: Partial<DefaultPricingFormData>): Promise<DefaultPricing> {
    try {
      // Validate defaultFee if provided
      if (data.defaultFee !== undefined && data.defaultFee <= 0) {
        throw new Error('Default fee must be a positive number');
      }

      const response = await this.httpService.putData<DefaultPricingResponse>(
        data,
        routes.updateDefaultPricing(id)
      );

      if (response.success && response.data.pricing) {
        return response.data.pricing;
      } else {
        throw new Error(response.message || 'Failed to update default pricing');
      }
    } catch (error) {
      console.error('Error updating default pricing:', error);
      throw error;
    }
  }

  async updateDefaultPricings(id: string, status: 'active' | 'inactive'): Promise<DefaultPricing> {
    try {
      const response = await this.httpService.putData<DefaultPricingResponse>(
        { status },
        routes.updateDefaultPricing(id)
      );

      if (response.success && response.data.pricing) {
        return response.data.pricing;
      } else {
        throw new Error(response.message || 'Failed to update default pricing status');
      }
    } catch (error) {
      console.error('Error updating default pricing status:', error);
      throw error;
    }
  }

  async deleteDefaultPricing(id: string): Promise<boolean> {
    try {
      const response = await this.httpService.deleteData<DefaultPricingResponse>(
        routes.deleteDefaultPricing(id)
      );

      return response.success;
    } catch (error) {
      console.error('Error deleting default pricing:', error);
      throw error;
    }
  }

  // Helper method to get pricing level
  getPricingLevel(pricing: DefaultPricing): string {
    if (pricing.city) return 'City';
    if (pricing.lga) return 'LGA';
    if (pricing.state) return 'State';
    return 'Country';
  }

  // Helper method to get pricing location string
  getPricingLocation(pricing: DefaultPricing): string {
    const parts = [];
    if (pricing.country) parts.push(pricing.country);
    if (pricing.state) parts.push(pricing.state);
    if (pricing.lga) parts.push(pricing.lga);
    if (pricing.city) parts.push(pricing.city);
    return parts.join(' • ');
  }
}

export default new DefaultPricingService();
export type { DefaultPricing as DefaultPricingType };