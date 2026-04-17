import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  hasAvailability: boolean;
  imageUrl: string;
  hasSubServices: boolean;
  subServices: ServiceItem[];
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: ServiceItem[];
    total: number;
  };
  message?: string;
}

export interface AvailableDaysResponse {
  success: boolean;
  data: {
    availableDays: string[];
    month: number;
    year: number;
    total: number;
  };
  message?: string;
}

export interface TimeSlot {
  datetime: string;
  time: string;
  displayTime: string;
}

export interface AvailableSlotsResponse {
  success: boolean;
  data: {
    date: string;
    slots: TimeSlot[];
    total: number;
  };
  message?: string;
}

export interface LocationOption {
  type: string;
  label: string;
  address?: string;
  requiresInput: boolean;
  placeholder?: string;
}

export interface LocationOptionsResponse {
  success: boolean;
  data: {
    organizationName: string;
    locationOptions: {
      merchantLocation: LocationOption;
      customerAddress: LocationOption;
      newAddress: LocationOption;
      whatsappLocation: LocationOption;
    };
    defaultOption: string;
  };
  message?: string;
}

export interface BookedPerson {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  slotDateTime: string;
}

export interface BookingLocation {
  type: 'merchant_location' | 'customer_address' | 'new_address' | 'whatsapp_location';
  address?: string;
  whatsappLocationUrl?: string;
}

export interface InitiatePaymentRequest {
  productId: string;
  productName: string;
  organizationId: string;
  organizationName: string;
  productPrice: number;
  upfrontPercentage: number;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  paymentType: 'full' | 'upfront' | 'remaining';
  itemType: 'service';
  platform?: 'mobile' | 'web';
  bookingDate: string;
  bookingTime: string;
  bookingDuration?: number;
  bookingLocation: BookingLocation;
  bookedForPersons: BookedPerson[];
  bookingNotes?: string;
}

export interface PricingBreakdown {
  baseProductPrice: number;
  numberOfPersons: number;
  totalServicePrice: number;
  upfrontPercentage: number;
  upfrontAmount: number;
  remainingBalance: number;
  totalPaymentAmount: number;
  paymentType: string;
  paymentNumber: number;
}

export interface InitiatePaymentResponse {
  success: boolean;
  data: {
    link: string;
    orderId: string;
    tx_ref: string;
    pricingBreakdown: PricingBreakdown;
  };
  message?: string;
}

export interface VerifyPaymentRequest {
  transactionId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    order: {
      _id: string;
      productName: string;
      orderStatus: string;
      itemType: string;
      customerEmail: string;
      totalAmountPaid: number;
      serviceBooking: {
        bookingDate: string;
        bookingTime: string;
        bookingStatus: string;
      };
    };
  };
  message?: string;
}

export interface CustomerOrder {
  _id: string;
  productName: string;
  orderStatus: string;
  itemType: string;
  totalAmountPaid: number;
  serviceBooking: {
    bookingDate: string;
    bookingTime: string;
    bookingStatus: string;
    location: BookingLocation;
  };
}

export interface CustomerOrdersResponse {
  success: boolean;
  data: {
    orders: CustomerOrder[];
    total: number;
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class BookingService {
  /**
   * Step 1: Fetch all services offered by an organization
   */
  static async getOrganizationServices(organizationId: string): Promise<ServicesResponse> {
    return HttpService.get<ServicesResponse>(
      `/api/orders/public/services/${organizationId}`
    );
  }

  /**
   * Step 2: Get available days for a given month
   */
  static async getAvailableDays(params: {
    organizationId: string;
    month: number;
    year: number;
    serviceId?: string;
  }): Promise<AvailableDaysResponse> {
    const queryParams = new URLSearchParams({
      organizationId: params.organizationId,
      month: params.month.toString(),
      year: params.year.toString(),
      ...(params.serviceId && { serviceId: params.serviceId }),
    });

    return HttpService.get<AvailableDaysResponse>(
      `/api/orders/public/available-days?${queryParams.toString()}`
    );
  }

  /**
   * Step 3: Get available time slots for a specific date
   */
  static async getAvailableSlots(params: {
    organizationId: string;
    date: string;
    serviceId?: string;
  }): Promise<AvailableSlotsResponse> {
    const queryParams = new URLSearchParams({
      organizationId: params.organizationId,
      date: params.date,
      ...(params.serviceId && { serviceId: params.serviceId }),
    });

    return HttpService.get<AvailableSlotsResponse>(
      `/api/orders/public/available-slots?${queryParams.toString()}`
    );
  }

  /**
   * Step 4: Get location options for the service
   */
  static async getLocationOptions(params: {
    organizationId: string;
    serviceId?: string;
  }): Promise<LocationOptionsResponse> {
    const queryParams = new URLSearchParams({
      organizationId: params.organizationId,
      ...(params.serviceId && { serviceId: params.serviceId }),
    });

    return HttpService.get<LocationOptionsResponse>(
      `/api/orders/public/location-options?${queryParams.toString()}`
    );
  }

  /**
   * Step 5: Initiate payment and create order
   */
  static async initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    return HttpService.post<InitiatePaymentResponse>(
      '/api/orders/public/initiate',
      data
    );
  }

  /**
   * Step 6: Verify payment after Flutterwave redirect
   */
  static async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    return HttpService.post<VerifyPaymentResponse>(
      '/api/orders/public/verify',
      data
    );
  }

  /**
   * Step 7: Get customer's order history (requires authentication)
   */
  static async getCustomerOrders(): Promise<CustomerOrdersResponse> {
    return HttpService.get<CustomerOrdersResponse>(
      '/api/orders/user/my-orders'
    );
  }
}

export default BookingService;
