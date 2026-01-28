import { HttpService } from './HttpService';

interface LocationPaymentRequest {
  email: string;
  name: string;
  phone: string;
}

interface LocationFee {
  location: string;
  fee: number;
}

interface LocationPaymentResponse {
  paymentLink: string;
  amount: number;
  description: string;
  locationFees: LocationFee[];
  totalLocations: number;
}

interface PaymentResult {
  success: boolean;
  data?: LocationPaymentResponse;
  message?: string;
}

class LocationPaymentService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Initialize payment for verified badge location fees
   * @param paymentData - User payment information
   * @returns Payment initialization result with payment link and fee breakdown
   */
  async initializeLocationPayment(paymentData: LocationPaymentRequest): Promise<PaymentResult> {
    try {
      const response = await this.httpService.postData<LocationPaymentResponse>(
        {
          ...paymentData,
          returnUrl: `${window.location.origin}/payment/verify-location?status=success`,
          cancelUrl: `${window.location.origin}/payment/verify-location?status=cancelled`
        },
        '/api/payment/verified-badge/initialize'
      );
      
      return {
        success: true,
        data: response,
        message: 'Payment initialized successfully'
      };
    } catch (error: any) {
      console.error('Error initializing location payment:', error);
      return {
        success: false,
        message: error.message || 'Failed to initialize location payment'
      };
    }
  }

  /**
   * Verify location payment status
   * @param transactionId - Payment transaction ID
   * @returns Payment verification result
   */
  async verifyLocationPayment(transactionId: string): Promise<PaymentResult> {
    try {
      const response = await this.httpService.getData<any>(
        `/api/payment/verified-badge/verify/${transactionId}`
      );
      
      return {
        success: true,
        data: response,
        message: 'Payment verified successfully'
      };
    } catch (error: any) {
      console.error('Error verifying location payment:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify location payment'
      };
    }
  }
}

export default LocationPaymentService;