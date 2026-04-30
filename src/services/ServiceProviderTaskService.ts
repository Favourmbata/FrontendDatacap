import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface AssignedTask {
  taskId: string;
  serviceName: string;
  customerFirstName: string;
  customerId: string;
  date: string;
  time: string;
  duration: number;
  location: string | { type: string; address?: string };
  fee: number;
  assignedAt: string;
  status: 'assigned' | 'accepted' | 'rejected' | 'completed';
  notes?: string;
}

export interface AcceptedTask extends AssignedTask {
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  location: { type: string; address?: string };
  acceptedAt: string;
}

export interface RejectedTask {
  taskId: string;
  serviceName: string;
  customerFirstName: string;
  customerId: string;
  date: string;
  time: string;
  duration: number;
  assignedAt: string;
  rejectedAt: string;
  rejectionReason: string;
  status: 'rejected';
}

export interface CompletionField {
  type: 'textarea' | 'file[]' | 'file' | 'url';
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  accept?: string;
  maxFiles?: number;
  maxDuration?: number;
  description?: string;
}

export interface CompletionTemplate {
  taskId: string;
  serviceName: string;
  customerName: string;
  serviceDate: string;
  serviceTime: string;
  location: { type: string; address?: string };
  completionFields: Record<string, CompletionField>;
}

export interface CompletionTemplateResponse {
  success: boolean;
  data: {
    template: CompletionTemplate;
  };
  message?: string;
}

export interface ConfirmationDetails {
  serviceCompletionDeclaration: string;
  serviceComment?: string;
  serviceImages?: string[];
  serviceVideoUrl?: string;
  videoUrl?: string;
  confirmedAt: string;
  confirmedBy: string;
}

export interface CompletedTask {
  taskId: string;
  serviceName: string;
  customerFirstName: string;
  customerFullName: string;
  customerId: string;
  date: string;
  time: string;
  duration: number;
  fee: number;
  acceptedAt: string;
  completedAt: string;
  settlementStatus: 'pending' | 'paid' | 'disputed';
  status: 'completed';
  confirmationDetails?: ConfirmationDetails;
}

export interface TaskStatistics {
  assigned: number;
  accepted: number;
  rejected: number;
  completed: number;
}

export interface AssignedTasksResponse {
  success: boolean;
  data: {
    tasks: AssignedTask[];
    total: number;
    providerId: string;
  };
  message?: string;
}

export interface AcceptedTasksResponse {
  success: boolean;
  data: {
    tasks: AcceptedTask[];
    total: number;
  };
  message?: string;
}

export interface RejectedTasksResponse {
  success: boolean;
  data: {
    tasks: RejectedTask[];
    total: number;
  };
  message?: string;
}

export interface CompletedTasksResponse {
  success: boolean;
  data: {
    tasks: CompletedTask[];
    total: number;
  };
  message?: string;
}

export interface TaskStatisticsResponse {
  success: boolean;
  data: {
    statistics: TaskStatistics;
    message: string;
  };
  message?: string;
}

export interface RejectTaskRequest {
  reason: string;
}

export interface AcceptTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: 'accepted';
    acceptedAt: string;
    customerDetails: {
      fullName: string;
      email: string;
      phone: string;
    };
  };
  message?: string;
}

export interface RejectTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: 'rejected';
    rejectedAt: string;
    reason: string;
  };
  message?: string;
}

export interface CompleteTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: 'completed';
    completedAt: string;
    settlementStatus: 'pending' | 'paid' | 'disputed';
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class ServiceProviderTaskService {
  /**
   * Get assigned tasks (available for acceptance/rejection)
   */
  static async getAssignedTasks(): Promise<AssignedTasksResponse> {
    return HttpService.get<AssignedTasksResponse>(
      '/api/service-provider-tasks/tasks/assigned'
    );
  }

  /**
   * Get accepted tasks
   */
  static async getAcceptedTasks(): Promise<AcceptedTasksResponse> {
    return HttpService.get<AcceptedTasksResponse>(
      '/api/service-provider-tasks/tasks/accepted'
    );
  }

  /**
   * Get rejected tasks
   */
  static async getRejectedTasks(): Promise<RejectedTasksResponse> {
    return HttpService.get<RejectedTasksResponse>(
      '/api/service-provider-tasks/tasks/rejected'
    );
  }

  /**
   * Get completed tasks
   */
  static async getCompletedTasks(): Promise<CompletedTasksResponse> {
    return HttpService.get<CompletedTasksResponse>(
      '/api/service-provider-tasks/tasks/completed'
    );
  }

  /**
   * Get task statistics
   */
  static async getTaskStatistics(): Promise<TaskStatisticsResponse> {
    return HttpService.get<TaskStatisticsResponse>(
      '/api/service-provider-tasks/tasks/statistics'
    );
  }

  /**
   * Accept a task
   */
  static async acceptTask(taskId: string): Promise<AcceptTaskResponse> {
    return HttpService.post<AcceptTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/accept`,
      {}
    );
  }

  /**
   * Reject a task with reason
   */
  static async rejectTask(taskId: string, reason: string): Promise<RejectTaskResponse> {
    return HttpService.post<RejectTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/reject`,
      { reason }
    );
  }

  /**
   * Complete a task
   */
  static async completeTask(taskId: string): Promise<CompleteTaskResponse> {
    return HttpService.post<CompleteTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/complete`,
      {}
    );
  }

  /**
   * Get completion template for a task
   */
  static async getCompletionTemplate(taskId: string): Promise<CompletionTemplateResponse> {
    return HttpService.get<CompletionTemplateResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/completion-template`
    );
  }

  /**
   * Complete a task with confirmation details
   */
  static async completeTaskWithDetails(taskId: string, data: {
    serviceCompletionDeclaration: string;
    serviceComment?: string;
    serviceImages?: string[];
    serviceVideoUrl?: string;
    videoUrl?: string;
  }): Promise<CompleteTaskResponse> {
    return HttpService.post<CompleteTaskResponse>(
      `/api/service-provider-tasks/tasks/${taskId}/complete`,
      data
    );
  }

  /**
   * Get completed tasks with details
   */
  static async getCompletedTasksWithDetails(): Promise<CompletedTasksResponse> {
    return HttpService.get<CompletedTasksResponse>(
      '/api/service-provider-tasks/tasks/completed-with-details'
    );
  }
}

export default ServiceProviderTaskService;
