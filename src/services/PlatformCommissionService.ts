import { 
  PlatformCommission, 
  CreatePlatformCommissionRequest, 
  UpdatePlatformCommissionRequest, 
  GetPlatformCommissionsParams 
} from '@/types/platformCommission';

class PlatformCommissionService {
  private static BASE_URL = '/api/super-admin/platform-commissions';

  private static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  }

  private static async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success === false) {
      throw new Error(result.message || 'Operation failed');
    }

    return result.data || result;
  }

  static async getPlatformCommissions(params: GetPlatformCommissionsParams = {}): Promise<{
    commissions: PlatformCommission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const token = this.getToken();
      
      let url = this.BASE_URL;
      const queryParams = new URLSearchParams();
      
      // Add query parameters
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.industryId) queryParams.append('industryId', params.industryId);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        cache: 'no-store',
      });

      const result = await this.handleResponse(response);

      // Handle different response formats
      let commissionsArray: any[] = [];
      let total = 0;
      let page = params.page || 1;
      let limit = params.limit || 10;
      let totalPages = 1;

      if (Array.isArray(result)) {
        commissionsArray = result;
        total = result.length;
        totalPages = Math.ceil(total / limit);
      } else if (result.commissions && Array.isArray(result.commissions)) {
        commissionsArray = result.commissions;
        total = result.total || result.commissions.length;
        page = result.page || page;
        limit = result.limit || limit;
        totalPages = result.totalPages || Math.ceil(total / limit);
      } else {
        commissionsArray = [result];
        total = 1;
        totalPages = 1;
      }

      const commissions: PlatformCommission[] = commissionsArray.map((item: any) => ({
        id: item.id || item._id,
        commissionName: item.commissionName,
        commissionRate: item.commissionRate,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        industryId: item.industryId,
        industryName: item.industryName,
        description: item.description,
        status: item.status || 'active',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      }));

      return {
        commissions,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching platform commissions:', error);
      throw error;
    }
  }

  static async getPlatformCommissionById(id: string): Promise<PlatformCommission> {
    try {
      const token = this.getToken();
      const url = `${this.BASE_URL}/${id}`;
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        cache: 'no-store',
      });

      const result = await this.handleResponse(response);

      const commission: PlatformCommission = {
        id: result.id || result._id,
        commissionName: result.commissionName,
        commissionRate: result.commissionRate,
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        industryId: result.industryId,
        industryName: result.industryName,
        description: result.description,
        status: result.status || 'active',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || result.createdAt || new Date().toISOString(),
      };

      return commission;
    } catch (error) {
      console.error('Error fetching platform commission by ID:', error);
      throw error;
    }
  }

  static async getPlatformCommissionsByCategoryId(categoryId: string): Promise<PlatformCommission[]> {
    try {
      const token = this.getToken();
      const url = `${this.BASE_URL}/category/${categoryId}`;
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        cache: 'no-store',
      });

      const result = await this.handleResponse(response);

      let commissionsArray: any[] = [];
      if (Array.isArray(result)) {
        commissionsArray = result;
      } else if (result.commissions && Array.isArray(result.commissions)) {
        commissionsArray = result.commissions;
      } else {
        commissionsArray = [result];
      }

      const commissions: PlatformCommission[] = commissionsArray.map((item: any) => ({
        id: item.id || item._id,
        commissionName: item.commissionName,
        commissionRate: item.commissionRate,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        industryId: item.industryId,
        industryName: item.industryName,
        description: item.description,
        status: item.status || 'active',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      }));

      return commissions;
    } catch (error) {
      console.error('Error fetching platform commissions by category ID:', error);
      throw error;
    }
  }

  static async createPlatformCommission(data: CreatePlatformCommissionRequest): Promise<PlatformCommission> {
    try {
      const token = this.getToken();
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${this.BASE_URL}`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse(response);

      const commission: PlatformCommission = {
        id: result.id || result._id,
        commissionName: result.commissionName,
        commissionRate: result.commissionRate,
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        industryId: result.industryId,
        industryName: result.industryName,
        description: result.description,
        status: result.status || 'active',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || result.createdAt || new Date().toISOString(),
      };

      return commission;
    } catch (error) {
      console.error('Error creating platform commission:', error);
      throw error;
    }
  }

  static async updatePlatformCommission(
    id: string, 
    data: UpdatePlatformCommissionRequest
  ): Promise<PlatformCommission> {
    try {
      const token = this.getToken();
      const url = `${this.BASE_URL}/${id}`;
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse(response);

      const commission: PlatformCommission = {
        id: result.id || result._id,
        commissionName: result.commissionName,
        commissionRate: result.commissionRate,
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        industryId: result.industryId,
        industryName: result.industryName,
        description: result.description,
        status: result.status || 'active',
        createdAt: result.createdAt || new Date().toISOString(),
        updatedAt: result.updatedAt || result.createdAt || new Date().toISOString(),
      };

      return commission;
    } catch (error) {
      console.error('Error updating platform commission:', error);
      throw error;
    }
  }

  static async updatePlatformCommissionStatus(
    id: string, 
    status: 'active' | 'inactive'
  ): Promise<PlatformCommission> {
    return this.updatePlatformCommission(id, { status });
  }

  static async deletePlatformCommission(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.getToken();
      const url = `${this.BASE_URL}/${id}`;
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const result = await this.handleResponse(response);
      
      return {
        success: true,
        message: result.message || 'Platform commission deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting platform commission:', error);
      throw error;
    }
  }

  static async exportPlatformCommissions(
    format: 'csv' | 'excel' | 'pdf',
    params: GetPlatformCommissionsParams = {}
  ): Promise<void> {
    try {
      const token = this.getToken();
      
      let url = `${this.BASE_URL}/export/${format}`;
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.industryId) queryParams.append('industryId', params.industryId);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.status) queryParams.append('status', params.status);
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://datacapture-backend.onrender.com'}${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `platform-commissions-${format}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting platform commissions:', error);
      throw error;
    }
  }
}

export default PlatformCommissionService;
export type { PlatformCommission, CreatePlatformCommissionRequest, UpdatePlatformCommissionRequest, GetPlatformCommissionsParams };