import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface BookingGuest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  slotDateTime: string;
  notes?: string;
}

export interface BookingLocation {
  type: 'merchant_location' | 'customer_address' | 'new_address' | 'whatsapp_location';
  address?: string;
  whatsappLocationUrl?: string;
}

export interface CreateBookingRequest {
  organizationId: string;
  galleryItemId: string;
  customerName: string;
  primarySlot: string;
  guests?: BookingGuest[];
  location: BookingLocation;
  customerNotes?: string;
}

export interface CreateGuestBookingRequest {
  organizationId: string;
  galleryItemId: string;
  customerName: string;
  customerEmail: string;
  primarySlot: string;
  guests?: BookingGuest[];
  location: BookingLocation;
  customerNotes?: string;
}

export interface BookingResponse {
  success: boolean;
  data: {
    booking: {
      bookingId: string;
      taskId: string;
      status: string;
      slotDateTime: string;
      totalPersons: number;
      fee: number;
      location: BookingLocation;
    };
  };
  message?: string;
}

export interface BookingStatus {
  bookingId: string;
  taskId: string;
  status: string;
  slotDateTime: string;
  customerName: string;
  customerEmail: string;
  totalPersons: number;
  location: BookingLocation;
  fee: number;
  acceptedAt?: string;
  providerNotes?: string;
  createdAt: string;
}

export interface BookingServiceInfo {
  name: string;
  description: string;
  producer: string;
}

export interface BookingStatusResponse {
  success: boolean;
  data: {
    booking: BookingStatus;
    service: BookingServiceInfo;
    message: string;
  };
}

export interface AdminBooking {
  _id: string;
  bookingId: string;
  taskId: string;
  organizationId: string;
  organizationName: string;
  galleryItemId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  status: string;
  slotDateTime: string;
  totalPersons: number;
  fee: number;
  location: BookingLocation;
  customerNotes?: string;
  providerNotes?: string;
  serviceProviderId?: string;
  assignedProvider?: string;
  acceptedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingsResponse {
  success: boolean;
  data: {
    bookings: AdminBooking[];
    total: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface UpdateBookingStatusRequest {
  status: string;
  newDate?: string;
  newTime?: string;
  adminNotes?: string;
}

export interface UpdateBookingStatusResponse {
  success: boolean;
  data: {
    booking: AdminBooking;
  };
  message?: string;
}

export interface AssignServiceProviderRequest {
  serviceProviderId: string;
}

export interface AssignServiceProviderResponse {
  success: boolean;
  data: {
    booking: {
      bookingId: string;
      serviceProviderId: string;
      status: string;
    };
    provider: {
      id: string;
      name: string;
      email: string;
    };
  };
  message?: string;
}

// New interfaces for admin booking flow
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

export interface AvailableSlot {
  datetime: string;
  time: string;
  displayTime: string;
}

export interface AvailableSlotsResponse {
  success: boolean;
  data: {
    date: string;
    slots: AvailableSlot[];
    total: number;
  };
  message?: string;
}

export interface OrganizationUser {
  name: string;
  email: string;
  customUserId: string;
  phoneNumber?: string;
  status: string;
}

export interface OrganizationUsersResponse {
  success: boolean;
  data: {
    users: OrganizationUser[];
    total: number;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface ServiceProvider {
  id: string;
  providerId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  specialties: string[];
  rating: number;
  completedTasks: number;
  totalBookings: number;
  isAvailable: boolean;
  availabilityHours: string;
  maxConcurrentBookings: number;
  serviceProviderFee: number;
  serviceProviderFeeCurrency: string;
  serviceProviderFeeFrequency: string;
}

export interface ServiceProvidersResponse {
  success: boolean;
  data: {
    providers: ServiceProvider[];
    total: number;
  };
  message?: string;
}

export interface LocationOption {
  type: string;
  label: string;
  address?: string;
  organizationName?: string;
  description?: string;
  requiresInput: boolean;
  inputType?: string;
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

export interface ValidateLocationRequest {
  locationType: string;
  address?: string;
  whatsappLocationUrl?: string;
  customerEmail?: string;
}

export interface ValidateLocationResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface AdminBookingGuest {
  name: string;
  email: string;
  slotDateTime: string;
  notes?: string;
}

export interface CreateAdminBookingRequest {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  customerType: 'existing' | 'external';
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  primarySlot: string;
  guests?: AdminBookingGuest[];
  location: BookingLocation;
  customerNotes?: string;
  serviceProviderId?: string;
  paymentType?: 'upfront' | 'full';
  upfrontPercentage?: number;
  processPayment?: boolean;
}

export interface CreateAdminBookingResponse {
  success: boolean;
  data: {
    booking: {
      orderId?: string;
      paymentLink?: string;
      transactionId?: string;
      amount?: number;
      paymentType?: string;
      bookingId?: string;
      taskId?: string;
      status: string;
      slotDateTime: string;
      totalPersons: number;
      fee: number;
      location: BookingLocation;
      assignedProvider?: string;
    };
  };
  message?: string;
}

export interface ProviderTask {
  taskId: string;
  bookingId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  status: 'assigned' | 'accepted' | 'rejected' | 'completed';
  slotDateTime: string;
  fee: number;
  location: BookingLocation;
  customerNotes?: string;
  providerNotes?: string;
  acceptedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ProviderTasksResponse {
  success: boolean;
  data: {
    tasks: ProviderTask[];
    total: number;
  };
  message?: string;
}

export interface TaskActionResponse {
  success: boolean;
  data: {
    taskId: string;
    bookingId: string;
    status: string;
    updatedAt: string;
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class BookingService {
  /**
   * Create a customer booking (requires customer token)
   */
  static async createBooking(
    data: CreateBookingRequest
  ): Promise<BookingResponse> {
    return HttpService.post<BookingResponse>(
      '/api/booking/book',
      data
    );
  }

  /**
   * Create a guest booking (public endpoint)
   */
  static async createGuestBooking(data: CreateGuestBookingRequest): Promise<BookingResponse> {
    return HttpService.post<BookingResponse>(
      '/api/booking/book-guest',
      data
    );
  }

  /**
   * Get booking status by booking ID (public endpoint)
   */
  static async getBookingStatus(bookingId: string): Promise<BookingStatusResponse> {
    return HttpService.get<BookingStatusResponse>(
      `/api/booking/booking/${bookingId}/status`
    );
  }

  /**
   * Service Provider: Get assigned tasks
   */
  static async getProviderAssignedTasks(): Promise<ProviderTasksResponse> {
    return HttpService.get<ProviderTasksResponse>(
      '/api/booking/provider/tasks/assigned'
    );
  }

  /**
   * Service Provider: Get accepted tasks
   */
  static async getProviderAcceptedTasks(): Promise<ProviderTasksResponse> {
    return HttpService.get<ProviderTasksResponse>(
      '/api/booking/provider/tasks/accepted'
    );
  }

  /**
   * Service Provider: Get completed tasks
   */
  static async getProviderCompletedTasks(): Promise<ProviderTasksResponse> {
    return HttpService.get<ProviderTasksResponse>(
      '/api/booking/provider/tasks/completed'
    );
  }

  /**
   * Service Provider: Accept a booking
   */
  static async acceptBooking(
    bookingId: string,
    providerNotes?: string
  ): Promise<TaskActionResponse> {
    return HttpService.patch<TaskActionResponse>(
      `/api/booking/provider/${bookingId}/accept`,
      { providerNotes }
    );
  }

  /**
   * Service Provider: Reject a booking
   */
  static async rejectBooking(
    bookingId: string,
    rejectionReason: string
  ): Promise<TaskActionResponse> {
    return HttpService.patch<TaskActionResponse>(
      `/api/booking/provider/${bookingId}/reject`,
      { rejectionReason }
    );
  }

  /**
   * Service Provider: Complete a booking
   */
  static async completeBooking(
    bookingId: string,
    providerNotes?: string
  ): Promise<TaskActionResponse> {
    return HttpService.patch<TaskActionResponse>(
      `/api/booking/provider/${bookingId}/complete`,
      { providerNotes }
    );
  }

  // ============ ADMIN BOOKING FLOW METHODS ============

  /**
   * Get available days for booking
   */
  static async getAvailableDays(
    month: number,
    year: number,
    serviceId?: string
  ): Promise<AvailableDaysResponse> {
    const queryParams = new URLSearchParams({
      month: month.toString(),
      year: year.toString()
    });
    
    if (serviceId) queryParams.append('serviceId', serviceId);

    return HttpService.get<AvailableDaysResponse>(
      `/api/admin/booking/available-days?${queryParams.toString()}`
    );
  }

  /**
   * Get available time slots for a specific date
   */
  static async getAvailableSlots(
    date: string,
    serviceId?: string
  ): Promise<AvailableSlotsResponse> {
    const queryParams = new URLSearchParams({ date });
    
    if (serviceId) queryParams.append('serviceId', serviceId);

    return HttpService.get<AvailableSlotsResponse>(
      `/api/admin/booking/available-slots?${queryParams.toString()}`
    );
  }

  /**
   * Get organization users for customer selection
   */
  static async getOrganizationUsers(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<OrganizationUsersResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (search) queryParams.append('search', search);

    return HttpService.get<OrganizationUsersResponse>(
      `/api/admin/booking/organization-users?${queryParams.toString()}`
    );
  }

  /**
   * Get service providers for manual assignment
   */
  static async getServiceProviders(
    serviceId?: string
  ): Promise<ServiceProvidersResponse> {
    const queryParams = new URLSearchParams();
    
    if (serviceId) queryParams.append('serviceId', serviceId);

    const queryString = queryParams.toString();
    const url = `/api/admin/booking/service-providers${queryString ? `?${queryString}` : ''}`;

    return HttpService.get<ServiceProvidersResponse>(url);
  }

  /**
   * Get location options for booking
   */
  static async getLocationOptions(
    serviceId?: string
  ): Promise<LocationOptionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (serviceId) queryParams.append('serviceId', serviceId);

    const queryString = queryParams.toString();
    const url = `/api/admin/booking/location-options${queryString ? `?${queryString}` : ''}`;

    return HttpService.get<LocationOptionsResponse>(url);
  }

  /**
   * Validate location selection
   */
  static async validateLocation(
    data: ValidateLocationRequest
  ): Promise<ValidateLocationResponse> {
    return HttpService.post<ValidateLocationResponse>(
      '/api/admin/booking/validate-location',
      data
    );
  }

  /**
   * Create admin booking with optional payment processing
   */
  static async createAdminBooking(
    data: CreateAdminBookingRequest
  ): Promise<CreateAdminBookingResponse> {
    return HttpService.post<CreateAdminBookingResponse>(
      '/api/admin/booking/create',
      data
    );
  }

  /**
   * Get all admin bookings with pagination and filters
   * GET /api/admin/bookings
   */
  static async getAdminBookings(
    page: number = 1,
    limit: number = 20,
    status?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<AdminBookingsResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (status) queryParams.append('status', status);
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);

    return HttpService.get<AdminBookingsResponse>(
      `/api/admin/bookings?${queryParams.toString()}`
    );
  }

  /**
   * Get single booking details
   * GET /api/admin/bookings/{bookingId}
   */
  static async getAdminBooking(bookingId: string): Promise<{ success: boolean; data: { booking: AdminBooking }; message?: string }> {
    return HttpService.get<{ success: boolean; data: { booking: AdminBooking }; message?: string }>(
      `/api/admin/bookings/${bookingId}`
    );
  }

  /**
   * Update booking status
   * PUT /api/admin/bookings/{bookingId}/status
   */
  static async updateBookingStatus(
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<UpdateBookingStatusResponse> {
    return HttpService.put<UpdateBookingStatusResponse>(
      `/api/admin/bookings/${bookingId}/status`,
      data
    );
  }

  /**
   * Assign service provider to booking
   * POST /api/admin/bookings/{bookingId}/assign-provider
   */
  static async assignServiceProvider(
    bookingId: string,
    data: AssignServiceProviderRequest
  ): Promise<AssignServiceProviderResponse> {
    return HttpService.post<AssignServiceProviderResponse>(
      `/api/admin/bookings/${bookingId}/assign-provider`,
      data
    );
  }
}

export default BookingService;
