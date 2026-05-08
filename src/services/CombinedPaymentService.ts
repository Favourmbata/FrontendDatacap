import { HttpService } from './HttpService';

interface CombinedPaymentRequest {
  // Package details
  packageId: string;
  subscriptionDuration: 'monthly' | 'quarterly' | 'yearly';
  packageAmount: number;
  maxUsers: number;
  
  // Location details
  locations: Array<{
    country: string;
    state: string;
    lga?: string;
    city: string;
    cityRegion?: string;
    cityRegionFee?: number; // Pre-calculated fee from frontend
    brandName: string;
    locationType: 'headquarters' | 'branch';
    houseNumber: string;
    street: string;
    landmark?: string;
    buildingColor?: string;
    buildingType?: string;
  }>;
  locationAmount?: number; // Total location amount calculated by frontend
  
  // User details
  userId: string;
  userType: 'organization';
  email: string;
  name: string;
  phone: string;
  
  // Payment details
  returnUrl: string;
  cancelUrl: string;
  
  // Optional promo code
  promoCode?: string;
  discountPercentage?: number;
}

interface CombinedPaymentResponse {
  success: boolean;
  data?: {
    paymentLink: string;
    totalAmount: number;
    packageAmount: number;
    locationAmount: number;
    transactionId: string;
    breakdown: {
      package: {
        name: string;
        amount: number;
        duration: string;
      };
      locations: Array<{
        brandName: string;
        fee: number;
        source: string;
      }>;
    };
  };
  message?: string;
  error?: string;
}

interface CombinedPaymentVerificationRequest {
  transactionId: string;
}

interface CombinedPaymentVerificationResponse {
  success: boolean;
  data?: {
    status: 'success' | 'failed' | 'pending';
    packageSubscription?: {
      id: string;
      status: 'active' | 'inactive';
      expiresAt: string;
    };
    locationVerifications?: Array<{
      locationId: string;
      status: 'verified' | 'pending' | 'rejected';
      verifiedAt?: string;
    }>;
    totalAmountPaid: number;
    packageAmount: number;
    locationAmount: number;
  };
  message?: string;
  error?: string;
}

class CombinedPaymentService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Initialize combined payment for package subscription and location verification
   */
  async initializeCombinedPayment(request: CombinedPaymentRequest): Promise<CombinedPaymentResponse> {
    try {
      const response = await this.httpService.postData<CombinedPaymentResponse>(
        request,
        '/api/payment/combined/initialize'
      );
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to initialize combined payment'
      };
    }
  }

  
   
  async verifyCombinedPayment(request: CombinedPaymentVerificationRequest): Promise<CombinedPaymentVerificationResponse> {
    try {
      const response = await this.httpService.postData<CombinedPaymentVerificationResponse>(
        { tx_ref: request.transactionId },
        '/api/payment/combined/verify'
      );
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to verify combined payment'
      };
    }
  }

  /**
   * Get pricing breakdown for combined payment (package + locations)
   */
  async getCombinedPricing(packageId: string, duration: string, locations: Array<{
    country: string;
    state: string;
    lga?: string;
    city: string;
    cityRegion?: string;
  }>): Promise<{
    success: boolean;
    data?: {
      packageAmount: number;
      locationAmount: number;
      totalAmount: number;
      breakdown: {
        package: {
          name: string;
          amount: number;
          duration: string;
        };
        locations: Array<{
          country: string;
          state: string;
          city: string;
          fee: number;
          source: string;
        }>;
      };
    };
    error?: string;
  }> {
    try {
      const response = await this.httpService.postData<any>(
        { packageId, duration, locations },
        '/api/payment/combined/pricing'
      );
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get combined pricing'
      };
    }
  }
}

export default CombinedPaymentService;
export type { CombinedPaymentRequest, CombinedPaymentResponse, CombinedPaymentVerificationRequest, CombinedPaymentVerificationResponse };