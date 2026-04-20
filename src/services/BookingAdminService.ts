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
    page: number;
    limit: number;
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
   * Admin: View all organization bookings
   */
  static async getAdminBookings(
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<AdminBookingsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

    const queryString = queryParams.toString();
    const url = `/api/booking/admin/bookings${queryString ? `?${queryString}` : ''}`;

    return HttpService.get<AdminBookingsResponse>(url);
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
}

export default BookingService;
