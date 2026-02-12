import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

interface CityRegion {
  _id: string;
  name: string;
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Location {
  _id: string;
  country: string;
  state: string;
  lga?: string;
  city: string;
  cityRegions: CityRegion[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
  // For backward compatibility (if API returns old field names)
  stateProvince?: string;
  cityRegion?: string;
  countryCode?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
  region?: string;
}

interface CityRegionFormData {
  country: string;
  state: string;
  city: string;
  lga?: string;
  cityRegions?: CityRegion[];
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
    regions: Location[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { 
          locations: Location[]; 
          total: number; 
          page: number; 
          limit: number; 
          totalPages: number 
        };
        message: string;
      }>(routes.getCityRegions(page, limit, search, sortBy, sortOrder, status));

      if (response.success) {
        // Flatten the locations and their cityRegions into a single array for backward compatibility
        const flattenedRegions: any[] = [];
        response.data.locations.forEach(location => {
          if (location.cityRegions && location.cityRegions.length > 0) {
            location.cityRegions.forEach(cityRegion => {
              flattenedRegions.push({
                ...location,
                _id: cityRegion._id,
                name: cityRegion.name,
                fee: cityRegion.fee,
                isActive: cityRegion.isActive
              });
            });
          } else {
            // If no city regions, still add the location as a region
            flattenedRegions.push(location);
          }
        });
        
        return {
          regions: flattenedRegions,
          total: flattenedRegions.length,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages
        };
      } else {
        throw new Error(response.message || 'Failed to fetch city regions');
      }
    } catch (error) {
      console.error('Error fetching city regions:', error);
      throw error;
    }
  }

  async getCityRegionById(id: string): Promise<Location> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { location: Location };
        message: string;
      }>(routes.getCityRegionById(id));

      if (response.success) {
        return response.data.location;
      } else {
        throw new Error(response.message || 'Failed to fetch city region');
      }
    } catch (error) {
      console.error('Error fetching city region:', error);
      throw error;
    }
  }

  async createCityRegion(data: CityRegionFormData): Promise<Location> {
    try {
      const response = await this.httpService.postData<{ 
        success: boolean; 
        data: { location: Location };
        message: string;
      }>(data, routes.createCityRegion());

      if (response.success) {
        return response.data.location;
      } else {
        throw new Error(response.message || 'Failed to create city region');
      }
    } catch (error) {
      console.error('Error creating city region:', error);
      throw error;
    }
  }

  async updateCityRegion(id: string, data: Partial<CityRegionFormData>): Promise<Location> {
    try {
      const response = await this.httpService.putData<{ 
        success: boolean; 
        data: { location: Location };
        message: string;
      }>(data, routes.updateCityRegion(id));

      if (response.success) {
        return response.data.location;
      } else {
        throw new Error(response.message || 'Failed to update city region');
      }
    } catch (error) {
      console.error('Error updating city region:', error);
      throw error;
    }
  }

  async updateCityRegionStatus(id: string, status: 'active' | 'inactive'): Promise<Location> {
    try {
      const response = await this.httpService.putData<{ 
        success: boolean; 
        data: { location: Location };
        message: string;
      }>({ status }, routes.updateCityRegionStatus(id));

      if (response.success) {
        return response.data.location;
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
export type { Location as CityRegion, CityRegionFormData };