import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  status: 'pending' | 'active' | 'disabled' | 'archived';
  organizationId?: string;
  organizationName: string | null;
  createdBy: string;
  isVerified: boolean;
  customUserId: string;
  permissions: any[];
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  existingUserId?: string;
  role?: 'CUSTOMER' | 'TAILOR';
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface UpdateUserStatusPayload {
  status: 'pending' | 'active' | 'disabled' | 'archived';
}

export interface UpdatePasswordPayload {
  password?: string;
  generateNew?: boolean;
}

export interface PaginatedUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    total: number;
    message: string;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GenerateUserIdResponse {
  success: boolean;
  data: {
    customUserId: string;
    message: string;
  };
}

export interface UpdatePasswordResponse {
  success: boolean;
  data: {
    message: string;
    generatedPassword?: string;
  };
}

export interface CreateUserResponse {
  success: boolean;
  data: {
    user: AdminUser;
    message: string;
  };
}

export interface GetUserByIdResponse {
  success: boolean;
  data: {
    user: AdminUser;
  };
}

export class AdminUserService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Create a new admin user
  async createAdminUser(payload: CreateUserPayload) {
    return this.httpService.postData<CreateUserResponse>(payload, routes.createAdminUser());
  }

  // Get all users with pagination (no status filter)
  async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedUsersResponse> {
    // Use the correct backend endpoint
    const url = routes.getAdminUsers(page, limit);
    return this.httpService.getData<PaginatedUsersResponse>(url);
  }

  // Get user by ID
  async getAdminUserById(userId: string): Promise<AdminUser> {
    const url = routes.getAdminUserById(userId);
    const response: GetUserByIdResponse = await this.httpService.getData<GetUserByIdResponse>(url);
    return response.data.user;
  }

  // Get users by status with pagination
  async getUsersByStatus(
    status: 'pending' | 'active' | 'disabled' | 'archived',
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedUsersResponse> {
    const url = routes.getAdminUsersByStatus(status, page, limit);
    return this.httpService.getData<PaginatedUsersResponse>(url);
  }

  // Generate custom user ID
  async generateCustomUserId(userId: string): Promise<GenerateUserIdResponse> {
    return this.httpService.postData<GenerateUserIdResponse>(
      {}, 
      routes.generateCustomUserId(userId)
    );
  }

  // Update user information
  async updateAdminUser(userId: string, payload: UpdateUserPayload) {
    return this.httpService.putData<AdminUser>(payload, routes.updateAdminUser(userId));
  }

  // Update user password
  async updateAdminUserPassword(userId: string, payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> {
    if (!userId) {
      throw new Error('User ID is required for password update');
    }
    return this.httpService.putData<UpdatePasswordResponse>(
      payload, 
      routes.updateAdminUserPassword(userId)
    );
  }

  // Get available permissions
  async getAvailablePermissions() {
    return this.httpService.getData<any>(routes.getAvailablePermissions());
  }

  // Assign permissions to a user
  async assignUserPermissions(userId: string, payload: { permissions: string[] }) {
    return this.httpService.putData<any>(payload, routes.assignUserPermissions(userId));
  }

  // Get user permissions
  async getUserPermissions(userId: string) {
    return this.httpService.getData<any>(routes.getUserPermissions(userId));
  }

  // Delete user
  async deleteAdminUser(userId: string) {
    return this.httpService.deleteData<any>(routes.deleteAdminUser(userId));
  }

  // Update user status
  async updateAdminUserStatus(userId: string, payload: UpdateUserStatusPayload) {
    const url = routes.updateAdminUserStatus(userId);
    return this.httpService.putData<AdminUser>(payload, url);
  }
}