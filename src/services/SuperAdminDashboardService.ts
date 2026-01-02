// services/SuperAdminDashboardService.ts
import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  totalSubscriptionPackages: number;
  activeSubscriptionPackages: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentRegistrations?: {
    organizations: number;
    customers: number;
  };
  totalUsers?: number;
  activeUsers?: number;
  pendingUsers?: number;
  totalSubscriptions?: number;
}

interface AnalyticsData {
  organizationGrowth: Array<{ month: string; count: number }>;
  customerGrowth: Array<{ month: string; count: number }>;
  revenueGrowth: Array<{ month: string; revenue: number }>;
  topStates: Array<{ state: string; customerCount: number }>;
  packagePopularity: Array<{ packageName: string; subscriberCount: number }>;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  message: string;
}

export class SuperAdminDashboardService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const url = routes.getSuperAdminDashboardStats();
      const response: any = await this.httpService.getData<any>(url);
      
      if (response.success) {
        // Map the API response to the expected DashboardStats format
        const mappedData: DashboardStats = {
          totalOrganizations: response.data.totalOrganizations || 0,
          activeOrganizations: response.data.activeOrganizations || 0,
          suspendedOrganizations: 0, // API doesn't provide this, default to 0
          totalCustomers: response.data.totalCustomers || 0,
          activeCustomers: 0, // API doesn't provide this, default to 0
          suspendedCustomers: 0, // API doesn't provide this, default to 0
          totalSubscriptionPackages: response.data.totalSubscriptions || 0,
          activeSubscriptionPackages: response.data.totalSubscriptions || 0, // Assuming all subscriptions are active
          totalRevenue: 0, // API doesn't provide this, default to 0
          monthlyRevenue: 0, // API doesn't provide this, default to 0
          recentRegistrations: {
            organizations: response.data.totalOrganizations || 0,
            customers: response.data.totalCustomers || 0,
          },
          totalUsers: response.data.totalUsers || 0,
          activeUsers: response.data.activeUsers || 0,
          pendingUsers: response.data.pendingUsers || 0,
          totalSubscriptions: response.data.totalSubscriptions || 0,
        };
        return mappedData;
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getDashboardAnalytics(): Promise<AnalyticsData> {
    try {
      const url = routes.getSuperAdminDashboardAnalytics();
      const response: any = await this.httpService.getData<any>(url);
      
      if (response.success) {
        // Return the analytics data as is, but ensure it matches the expected format
        return {
          organizationGrowth: response.data.organizationGrowth || [],
          customerGrowth: response.data.customerGrowth || [],
          revenueGrowth: response.data.revenueGrowth || [],
          topStates: response.data.topStates || [],
          packagePopularity: response.data.packagePopularity || [],
        };
      } else {
        throw new Error(response.message || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  async getFullDashboardData(): Promise<{ stats: DashboardStats; analytics: AnalyticsData }> {
    try {
      const [stats, analytics] = await Promise.all([
        this.getDashboardStats(),
        this.getDashboardAnalytics()
      ]);
      
      return { stats, analytics };
    } catch (error) {
      console.error('Error fetching full dashboard data:', error);
      throw error;
    }
  }
}