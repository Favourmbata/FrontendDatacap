import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

interface CityRegion {
  message: string;
  _id: string;
  id: string;
  country: string;
  stateProvince: string;
  lga: string;
  city: string;
  cityRegion: string;
  isActive: boolean;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
  // For backward compatibility (if API returns old field names)
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  stateName?: string;
  cityName?: string;
  region?: string;
}

interface CityRegionFormData {
  country: string;
  stateProvince: string;
  city: string;
  lga?: string;
  cityRegion?: string;
}

class CityRegionService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getCityRegions(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    status?: 'active' | 'inactive'
  ): Promise<{
    regions: CityRegion[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { 
          regions: CityRegion[]; 
          total: number; 
          page: number; 
          limit: number; 
          totalPages: number 
        };
        message: string;
      }>(routes.getCityRegions(page, limit, search, sortBy, sortOrder, status));

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch city regions');
      }
    } catch (error) {
      console.error('Error fetching city regions:', error);
      throw error;
    }
  }

  async getCityRegionById(id: string): Promise<CityRegion> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { region: CityRegion };
        message: string;
      }>(routes.getCityRegionById(id));

      if (response.success) {
        return response.data.region;
      } else {
        throw new Error(response.message || 'Failed to fetch city region');
      }
    } catch (error) {
      console.error('Error fetching city region:', error);
      throw error;
    }
  }

  async createCityRegion(data: CityRegionFormData): Promise<CityRegion> {
    try {
      const response = await this.httpService.postData<{ 
        success: boolean; 
        data: { region: CityRegion };
        message: string;
      }>(data, routes.createCityRegion());

      if (response.success) {
        return response.data.region;
      } else {
        throw new Error(response.message || 'Failed to create city region');
      }
    } catch (error) {
      console.error('Error creating city region:', error);
      throw error;
    }
  }

  async updateCityRegion(id: string, data: Partial<CityRegionFormData>): Promise<CityRegion> {
    try {
      const response = await this.httpService.putData<{ 
        success: boolean; 
        data: { region: CityRegion };
        message: string;
      }>(data, routes.updateCityRegion(id));

      if (response.success) {
        return response.data.region;
      } else {
        throw new Error(response.message || 'Failed to update city region');
      }
    } catch (error) {
      console.error('Error updating city region:', error);
      throw error;
    }
  }

  async updateCityRegionStatus(id: string, status: 'active' | 'inactive'): Promise<CityRegion> {
    try {
      const response = await this.httpService.putData<{ 
        success: boolean; 
        data: { region: CityRegion };
        message: string;
      }>({ status }, routes.updateCityRegionStatus(id));

      if (response.success) {
        return response.data.region;
      } else {
        throw new Error(response.message || 'Failed to update city region status');
      }
    } catch (error) {
      console.error('Error updating city region status:', error);
      throw error;
    }
  }

  async deleteCityRegion(id: string): Promise<boolean> {
    try {
      const response = await this.httpService.deleteData<{ 
        success: boolean; 
        message: string;
      }>(routes.deleteCityRegion(id));

      return response.success;
    } catch (error) {
      console.error('Error deleting city region:', error);
      throw error;
    }
  }
}

export default new CityRegionService();
export type { CityRegion, CityRegionFormData };