import { HttpService } from './HttpService';

// Interfaces for the verified badge payment API
interface PaymentCheckResponse {
  success: boolean;
  data: {
    paymentRequired: boolean;
    unpaidLocations: number;
    totalLocations: number;
    verificationStatus: string;
  };
}

interface PricingResponse {
  success: boolean;
  data: {
    totalAmount: number;
    locationFees: Array<{
      location: string;
      fee: number;
    }>;
    totalLocations: number;
    unpaidLocations: number;
    currency: string;
    description: string;
  };
}

interface InitializePaymentRequest {
  email: string;
  name: string;
  phone: string;
}

interface InitializePaymentResponse {
  message: string;
  success: boolean;
  data: {
    paymentLink: string;
    amount: number;
    description: string;
    locationFees: Array<{
      location: string;
      fee: number;
    }>;
    totalLocations: number;
    unpaidLocations: number;
  };
}

interface VerifyPaymentRequest {
  transactionId: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  data: {
    verificationStatus: string;
    message: string;
  };
}

interface PaymentHistoryResponse {
  success: boolean;
  data: {
    payments: Array<{
      id: string;
      transactionId: string;
      amount: number;
      status: string;
      description: string;
      paidAt: string;
      locations: Array<{
        locationIndex: number;
        brandName: string;
      }>;
    }>;
    total: number;
  };
}

interface PaymentStatusResponse {
  success: boolean;
  data: {
    transactionId: string;
    status: string;
    amount: number;
    currency: string;
    paidAt: string;
    verified: boolean;
  };
}

class LocationPaymentService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Check if payment is required for unpaid locations
   */
  async checkPaymentRequired(): Promise<PaymentCheckResponse> {
    try {
      const url = '/api/payment/verified-badge/check-payment-required';
      const response = await this.httpService.getData<PaymentCheckResponse>(url);
      return response;
    } catch (error) {
      console.error('Error checking payment required:', error);
      throw error;
    }
  }

  /**
   * Get pricing breakdown for unpaid locations only
   */
  async getPricing(): Promise<PricingResponse> {
    try {
      const url = '/api/payment/verified-badge/pricing';
      const response = await this.httpService.getData<PricingResponse>(url);
      return response;
    } catch (error) {
      console.error('Error getting pricing:', error);
      throw error;
    }
  }

  /**
   * Initialize payment for unpaid locations only
   */
  async initializePayment(request: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    try {
      const url = '/api/payment/verified-badge/initialize';
      const response = await this.httpService.postData<InitializePaymentResponse>(request, url);
      return response;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment and mark unpaid locations as paid with pending verification status
   */
  async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const url = '/api/payment/verified-badge/verify';
      const response = await this.httpService.postData<VerifyPaymentResponse>(request, url);
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Get payment history for the organization
   */
  async getPaymentHistory(): Promise<PaymentHistoryResponse> {
    try {
      const url = '/api/payment/verified-badge/history';
      const response = await this.httpService.getData<PaymentHistoryResponse>(url);
      return response;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  /**
   * Get the status of a specific payment transaction
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      const url = `/api/payment/verified-badge/status/${transactionId}`;
      const response = await this.httpService.getData<PaymentStatusResponse>(url);
      return response;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
}

export default new LocationPaymentService();
export type { 
  PaymentCheckResponse, 
  PricingResponse, 
  InitializePaymentRequest, 
  InitializePaymentResponse, 
  VerifyPaymentRequest, 
  VerifyPaymentResponse,
  PaymentHistoryResponse,
  PaymentStatusResponse
};


// Add these to your existing apiRoutes.ts file

export const routes = {
  // ... other existing routes
  
  // Location Verification Routes
  getRejectedLocationVerifications: () => ({
    url: '/super-admin/location-verifications/rejected',
    method: 'GET' as const,
  }),

  getVerifiedLocationVerifications: () => ({
    url: '/super-admin/location-verifications/verified',
    method: 'GET' as const,
  }),

  sendRejectionEmail: (profileId: string, locationIndex: number) => ({
    url: `/super-admin/location-verifications/${profileId}/${locationIndex}/send-rejection-email`,
    method: 'POST' as const,
  }),
};