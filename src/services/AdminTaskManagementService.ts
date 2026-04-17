import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface ServiceBooking {
  _id: string;
  orderId: string;
  bookingId: string;
  serviceName: string;
  organizationName: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  totalAmount: number;
  orderStatus: string;
  taskStatus: string;
  serviceProviderName?: string;
  settlementStatus: string;
  createdAt: string;
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

// ============ SERVICE CLASS ============

class AdminTaskManagementService {
  /**
   * View all service bookings (orders view)
   * Optional: filter by date
   */
  static async getServiceBookings(date?: string): Promise<ServiceBookingsResponse> {
    const query = date ? `?date=${date}` : '';
    return HttpService.get<ServiceBookingsResponse>(
      `/api/orders/admin/service-bookings${query}`
    );
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
}

export default AdminTaskManagementService;
