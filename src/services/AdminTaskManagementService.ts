import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface ServiceBooking {
  _id: string;
  orderId?: string;
  bookingId: string;
  serviceName: string;
  organizationName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  productPrice: number;
  totalAmount: number;
  orderStatus: string;
  deliveryStatus?: string;
  taskStatus?: string;
  serviceProviderName?: string;
  assignedProviders?: any[];
  settlementStatus: string;
  payments?: any[];
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceBookingsResponse {
  success: boolean;
  data: {
    bookings: ServiceBooking[];
    total: number;
  };
  message?: string;
}

export interface ProviderReport {
  providerId: string;
  providerName: string;
  providerEmail: string;
  totalTasks: number;
  acceptedTasks: number;
  completedTasks: number;
  rejectedTasks: number;
  totalEarnings: number;
  settledAmount: number;
  pendingAmount: number;
}

export interface ProviderReportResponse {
  success: boolean;
  data: {
    providers: ProviderReport[];
    total: number;
  };
  message?: string;
}

export interface TaskReport {
  taskId: string;
  bookingId: string;
  serviceName: string;
  providerName: string;
  customerName: string;
  bookingDate: string;
  fee: number;
  status: string;
  settlementStatus: string;
  acceptedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface TaskReportResponse {
  success: boolean;
  data: {
    tasks: TaskReport[];
    total: number;
  };
  message?: string;
}

export interface UpdateSettlementRequest {
  status: 'pending' | 'paid' | 'disputed';
}

export interface UpdateSettlementResponse {
  success: boolean;
  data: {
    taskId: string;
    settlementStatus: string;
    updatedAt: string;
  };
  message?: string;
}

export interface ServiceProviderInfo {
  providerId: string;
  specialties: string[];
  availabilityHours: string;
  isAvailable: boolean;
  maxConcurrentBookings: number;
  status: string;
  rating: number;
  totalBookings: number;
  completedBookings: number;
  serviceProviderFeeName?: string;
  serviceProviderFeeDescription?: string;
  serviceProviderFee?: number;
  serviceProviderFeeCurrency?: string;
  serviceProviderFeeFrequency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  customUserId: string;
  role: string;
  status: string;
  serviceProviderInfo: ServiceProviderInfo;
}

export interface ServiceProvidersResponse {
  success: boolean;
  data: {
    serviceProviders: ServiceProvider[];
    totalCount: number;
    organizationId: string;
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class AdminTaskManagementService {
  /**
   * View all service bookings (orders view)
   * Optional: filter by date
   */
  static async getServiceBookings(date?: string): Promise<ServiceBookingsResponse> {
    const query = date ? `?date=${date}` : '';
    const response = await HttpService.get<any>(
      `/api/orders/admin/service-bookings${query}`
    );
    
    // Transform API response to match ServiceBooking interface
    if (response.success && response.data?.bookings) {
      const transformedBookings = response.data.bookings.map((booking: any) => ({
        _id: booking._id,
        orderId: booking.orderId || booking._id,
        bookingId: booking.serviceBooking?.bookingId || `BK${booking._id}`,
        serviceName: booking.productName || 'Unknown Service',
        organizationName: booking.organizationName || '',
        customerName: booking.customerName || '',
        customerEmail: booking.customerEmail || '',
        customerPhone: booking.customerPhone || '',
        bookingDate: booking.serviceBooking?.bookingDate || booking.createdAt,
        bookingTime: booking.serviceBooking?.bookingTime || '',
        duration: booking.serviceBooking?.duration || 0,
        productPrice: booking.productPrice || 0,
        totalAmount: booking.productPrice || 0,
        orderStatus: booking.orderStatus || 'pending',
        deliveryStatus: booking.deliveryStatus || 'pending',
        taskStatus: booking.serviceBooking?.bookingStatus || 'pending',
        serviceProviderName: booking.serviceProviderName || '',
        assignedProviders: booking.serviceBooking?.assignedProviders || [],
        settlementStatus: booking.settlementStatus || 'pending',
        payments: booking.payments || [],
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }));
      
      return {
        success: true,
        data: {
          bookings: transformedBookings,
          total: response.data.total || transformedBookings.length
        },
        message: response.message
      };
    }
    
    return response;
  }

  /**
   * View all providers report
   */
  static async getProvidersReport(): Promise<ProviderReportResponse> {
    return HttpService.get<ProviderReportResponse>(
      '/api/service-provider-tasks/admin/report/providers'
    );
  }

  /**
   * View accepted tasks report
   */
  static async getAcceptedTasksReport(): Promise<TaskReportResponse> {
    return HttpService.get<TaskReportResponse>(
      '/api/service-provider-tasks/admin/report/accepted'
    );
  }

  /**
   * View rejected tasks report
   */
  static async getRejectedTasksReport(): Promise<TaskReportResponse> {
    return HttpService.get<TaskReportResponse>(
      '/api/service-provider-tasks/admin/report/rejected'
    );
  }

  /**
   * View completed tasks report
   */
  static async getCompletedTasksReport(): Promise<TaskReportResponse> {
    return HttpService.get<TaskReportResponse>(
      '/api/service-provider-tasks/admin/report/completed'
    );
  }

  /**
   * Export report to Excel
   * reportType: all-providers, accepted-tasks, rejected-tasks, completed-tasks
   */
  static async exportReport(reportType: string): Promise<Blob> {
    return HttpService.download(
      `/api/service-provider-tasks/admin/report/${reportType}/export`
    );
  }

  /**
   * Update settlement status for a task
   */
  static async updateSettlementStatus(
    taskId: string,
    status: 'pending' | 'paid' | 'disputed'
  ): Promise<UpdateSettlementResponse> {
    return HttpService.patch<UpdateSettlementResponse>(
      `/api/service-provider-tasks/admin/tasks/${taskId}/settlement`,
      { status }
    );
  }

  /**
   * Get all service providers for assignment
   */
  static async getServiceProviders(): Promise<ServiceProvidersResponse> {
    return HttpService.get<ServiceProvidersResponse>(
      '/api/service-provider-assignment/detailed'
    );
  }

  /**
   * Assign service provider to a booking
   */
  static async assignServiceProvider(
    bookingId: string,
    data: { serviceProviderId: string }
  ): Promise<any> {
    return HttpService.post<any>(
      `/api/admin/bookings/${bookingId}/assign-provider`,
      data
    );
  }
}

export default AdminTaskManagementService;
