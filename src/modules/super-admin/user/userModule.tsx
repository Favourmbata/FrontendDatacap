import { HttpService } from '../../../services/HttpService';
import { routes } from '../../../services/apiRoutes';

export interface Customer {
  id: string;
  customerName: string;
  accountNumber: string;
  customerId: string;
  email: string;
  phoneNumber: string;
  state: string;
  lga: string;
  address: string;
  status: 'active' | 'suspended' | 'inactive';
  accountCreatedOn: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fromDate?: string;
  toDate?: string;
  status?: 'active' | 'suspended' | 'inactive';
  state?: string;
  lga?: string;
}

export interface CreateCustomerRequest {
  customerName: string;
  email: string;
  phoneNumber: string;
  state: string;
  lga: string;
  address: string;
  customerId: string;
}

export interface UpdateCustomerStatusRequest {
  status: 'active' | 'suspended' | 'inactive';
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
  message: string;
}

export interface CustomersResponse {
  success: boolean;
  data: {
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  data: {
    newPassword: string;
    message: string;
  };
  message: string;
}

export interface UpdateCustomerStatusResponse {
  success: boolean;
  data: Customer;
  message: string;
}

class SuperAdminUserModule {
  // Get all customers with filters
  async getCustomers(params: GetCustomersParams = {}): Promise<CustomersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.fromDate) searchParams.append('fromDate', params.fromDate);
    if (params.toDate) searchParams.append('toDate', params.toDate);
    if (params.status) searchParams.append('status', params.status);
    if (params.state) searchParams.append('state', params.state);
    if (params.lga) searchParams.append('lga', params.lga);

    const url = `${routes.superAdmin.customers}?${searchParams.toString()}`;
    return await HttpService.get(url);
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<CustomerResponse> {
    const url = routes.superAdmin.customerById(id);
    return await HttpService.get(url);
  }

  // Create customer
  async createCustomer(data: CreateCustomerRequest): Promise<CustomerResponse> {
    return await HttpService.post(routes.superAdmin.customers, data);
  }

  // Update customer
  async updateCustomer(id: string, data: Partial<CreateCustomerRequest>): Promise<CustomerResponse> {
    const url = routes.superAdmin.customerById(id);
    return await HttpService.put(url, data);
  }

  // Delete customer
  async deleteCustomer(id: string): Promise<{ success: boolean; message: string }> {
    const url = routes.superAdmin.customerById(id);
    return await HttpService.delete(url);
  }

  // Update customer status
  async updateCustomerStatus(
    id: string, 
    statusData: UpdateCustomerStatusRequest
  ): Promise<UpdateCustomerStatusResponse> {
    const url = routes.superAdmin.customerStatus(id);
    return await HttpService.put(url, statusData);
  }

  // Reset customer password
  async resetCustomerPassword(id: string): Promise<ResetPasswordResponse> {
    const url = routes.superAdmin.resetCustomerPassword(id);
    return await HttpService.put(url, {});
  }

  // Export customers
  async exportCustomers(format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    const url = routes.superAdmin.exportCustomers(format);
    return await HttpService.download(url);
  }
}

export const superAdminUserModule = new SuperAdminUserModule();