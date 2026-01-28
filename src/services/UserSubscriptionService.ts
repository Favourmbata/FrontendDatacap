import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

// Interface for subscription data
export interface SubscriptionData {
  _id: string;
  userId: string;
  packageId: string;
  packageTitle: string;
  status: 'active' | 'inactive' | 'expired' | 'pending';
  subscriptionDuration: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  amountPaid: number;
  paymentStatus?: 'completed' | 'pending' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

// Interface for subscription status response
export interface SubscriptionStatusResponse {
  success: boolean;
  data: {
    hasActiveSubscription: boolean;
    shouldShowSubscription: boolean;
    subscription: SubscriptionData | null;
    redirectTo: 'subscription' | 'dashboard';
  };
  message: string;
}

class UserSubscriptionService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Check user subscription status
  async getUserSubscriptionStatus(userId: string): Promise<SubscriptionStatusResponse> {
    try {
      const url = routes.getUserSubscriptionStatus(userId);
      const response = await this.httpService.getData<SubscriptionStatusResponse>(url);
      return response;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }

  // Helper method to check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const response = await this.getUserSubscriptionStatus(userId);
      return response.data.hasActiveSubscription;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      // Return false as fallback
      return false;
    }
  }

  // Helper method to get redirect destination
  async getRedirectDestination(userId: string): Promise<'subscription' | 'dashboard'> {
    try {
      const response = await this.getUserSubscriptionStatus(userId);
      return response.data.redirectTo;
    } catch (error) {
      console.error('Error getting redirect destination:', error);
      // Default to subscription page if error occurs
      return 'subscription';
    }
  }
}

export default new UserSubscriptionService();