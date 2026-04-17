import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface ServiceProviderModule {
  organizationId: string;
  adminId: string;
  name: string;
  description: string;
  isActive: boolean;
  settings: {
    allowSelfAssignment: boolean;
    requireApproval: boolean;
    defaultSpecialties: string[];
    defaultAvailabilityHours: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateModuleRequest {
  name: string;
  description: string;
}

export interface UpdateModuleRequest {
  name?: string;
  description?: string;
  settings?: {
    allowSelfAssignment?: boolean;
    requireApproval?: boolean;
    defaultSpecialties?: string[];
    defaultAvailabilityHours?: string;
  };
}

export interface ModuleResponse {
  success: boolean;
  data: {
    module: ServiceProviderModule;
  };
  message?: string;
}

export interface ServiceProviderInfo {
  providerId: string;
  specialties: string[];
  status: string;
  totalBookings: number;
  completedBookings: number;
  rating: number;
  isAvailable: boolean;
  availabilityHours: string;
  assignedDate: string;
}

export interface OrganizationUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  customUserId: string;
  systemRole: string;
  isServiceProvider: boolean;
  serviceProviderInfo?: ServiceProviderInfo;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: OrganizationUser[];
    total: number;
    serviceProviders: number;
    regularUsers: number;
  };
  message?: string;
}

export interface UserAssignment {
  userId: string;
  isServiceProvider: boolean;
  specialties?: string[];
  availabilityHours?: string;
}

export interface BulkAssignRequest {
  userAssignments: UserAssignment[];
}

export interface AssignResponse {
  success: boolean;
  data: {
    assigned: number;
    unassigned: number;
    results: Array<{
      userId: string;
      success: boolean;
      message: string;
    }>;
  };
  message?: string;
}

export interface AssignmentSummary {
  totalUsers: number;
  totalServiceProviders: number;
  activeProviders: number;
  inactiveProviders: number;
  averageRating: number;
  totalBookings: number;
  completedBookings: number;
}

export interface SummaryResponse {
  success: boolean;
  data: {
    summary: AssignmentSummary;
  };
  message?: string;
}

export interface AssignmentHistory {
  id: string;
  userId: string;
  userName: string;
  action: 'assigned' | 'unassigned';
  assignedBy: string;
  specialties?: string[];
  availabilityHours?: string;
  timestamp: string;
}

export interface HistoryResponse {
  success: boolean;
  data: {
    history: AssignmentHistory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}

// ============ SERVICE CLASS ============

class ServiceProviderAssignmentService {
  /**
   * Create service provider module (one-time setup)
   */
  static async createModule(data: CreateModuleRequest): Promise<ModuleResponse> {
    return HttpService.post<ModuleResponse>(
      '/api/service-provider-assignment/module',
      data
    );
  }

  /**
   * Get service provider module
   */
  static async getModule(): Promise<ModuleResponse> {
    return HttpService.get<ModuleResponse>(
      '/api/service-provider-assignment/module'
    );
  }

  /**
   * Update service provider module
   */
  static async updateModule(data: UpdateModuleRequest): Promise<ModuleResponse> {
    return HttpService.put<ModuleResponse>(
      '/api/service-provider-assignment/module',
      data
    );
  }

  /**
   * Get all organization users
   */
  static async getAllUsers(): Promise<UsersResponse> {
    return HttpService.get<UsersResponse>(
      '/api/service-provider-assignment/users'
    );
  }

  /**
   * Get assigned service providers only
   */
  static async getServiceProviders(): Promise<UsersResponse> {
    return HttpService.get<UsersResponse>(
      '/api/service-provider-assignment/users/service-providers'
    );
  }

  /**
   * Get available users for assignment
   */
  static async getAvailableUsers(): Promise<UsersResponse> {
    return HttpService.get<UsersResponse>(
      '/api/service-provider-assignment/users/available'
    );
  }

  /**
   * Bulk assign/unassign service provider roles
   */
  static async bulkAssign(data: BulkAssignRequest): Promise<AssignResponse> {
    return HttpService.post<AssignResponse>(
      '/api/service-provider-assignment/assign',
      data
    );
  }

  /**
   * Get assignment summary
   */
  static async getSummary(): Promise<SummaryResponse> {
    return HttpService.get<SummaryResponse>(
      '/api/service-provider-assignment/summary'
    );
  }

  /**
   * Get assignment history
   */
  static async getHistory(page: number = 1, limit: number = 20): Promise<HistoryResponse> {
    return HttpService.get<HistoryResponse>(
      `/api/service-provider-assignment/history?page=${page}&limit=${limit}`
    );
  }
}

export default ServiceProviderAssignmentService;
