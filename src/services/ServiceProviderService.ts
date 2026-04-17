import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface BookingLocation {
  type: string;
  address?: string;
  whatsappLocationUrl?: string;
}

export interface TaskActions {
  accept: string;
  reject: string;
  complete: string;
}

export interface ServiceTask {
  taskId: string;
  orderId: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  location: BookingLocation;
  notes?: string;
  customerFirstName: string;
  customerFullName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerId: string;
  bookedForPersons?: Array<{
    name: string;
    email: string;
    phone?: string;
  }>;
  fee: number;
  totalOrderAmount: number;
  orderStatus: string;
  taskStatus: 'assigned' | 'accepted' | 'completed' | 'rejected';
  assignedAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  settlementStatus: string;
  canAccept: boolean;
  canReject: boolean;
  canComplete: boolean;
  actions: TaskActions;
}

export interface BookingsSummary {
  assigned: number;
  accepted: number;
  completed: number;
  rejected: number;
}

export interface BookingsResponse {
  success: boolean;
  data: {
    bookings: ServiceTask[];
    total: number;
    summary: BookingsSummary;
  };
  message?: string;
}

export interface StatisticsResponse {
  success: boolean;
  data: {
    statistics: BookingsSummary;
  };
  message?: string;
}

export interface AcceptTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: string;
    acceptedAt: string;
    customerDetails: {
      fullName: string;
      email: string;
      phone: string;
    };
  };
  message?: string;
}

export interface RejectTaskRequest {
  reason: string;
}

export interface RejectTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: string;
    rejectedAt: string;
    reason: string;
  };
  message?: string;
}

export interface CompleteTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: string;
    completedAt: string;
    settlementStatus: string;
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class ServiceProviderService {
  /**
   * Get all bookings for the service provider (primary endpoint)
   * Returns all tasks: assigned, accepted, completed, rejected
   */
  static async getMyBookings(): Promise<BookingsResponse> {
    return HttpService.get<BookingsResponse>(
      '/api/service-provider-tasks/my-bookings'
    );
  }

  /**
   * Get task statistics for dashboard summary
   */
  static async getTaskStatistics(): Promise<StatisticsResponse> {
    return HttpService.get<StatisticsResponse>(
      '/api/service-provider-tasks/tasks/statistics'
    );
  }

  /**
   * Accept a task
   * Locks the task to this provider and reveals full customer details
   */
  static async acceptTask(taskId: string): Promise<AcceptTaskResponse> {
    return HttpService.post<AcceptTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/accept`,
      {}
    );
  }

  /**
   * Reject a task with reason
   * Task remains available for other providers
   */
  static async rejectTask(taskId: string, reason: string): Promise<RejectTaskResponse> {
    return HttpService.post<RejectTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/reject`,
      { reason }
    );
  }

  /**
   * Complete a task
   * Mark accepted task as completed after service delivery
   */
  static async completeTask(taskId: string): Promise<CompleteTaskResponse> {
    return HttpService.post<CompleteTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/complete`,
      {}
    );
  }

  /**
   * Get assigned tasks only (alternative endpoint)
   * Prefer getMyBookings() as it returns richer data
   */
  static async getAssignedTasks(): Promise<BookingsResponse> {
    return HttpService.get<BookingsResponse>(
      '/api/service-provider-tasks/tasks/assigned'
    );
  }

  /**
   * Get accepted tasks only (alternative endpoint)
   */
  static async getAcceptedTasks(): Promise<BookingsResponse> {
    return HttpService.get<BookingsResponse>(
      '/api/service-provider-tasks/tasks/accepted'
    );
  }

  /**
   * Get rejected tasks only (alternative endpoint)
   */
  static async getRejectedTasks(): Promise<BookingsResponse> {
    return HttpService.get<BookingsResponse>(
      '/api/service-provider-tasks/tasks/rejected'
    );
  }

  /**
   * Get completed tasks only (alternative endpoint)
   */
  static async getCompletedTasks(): Promise<BookingsResponse> {
    return HttpService.get<BookingsResponse>(
      '/api/service-provider-tasks/tasks/completed'
    );
  }
}

export default ServiceProviderService;
