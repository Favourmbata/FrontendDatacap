import { HttpService } from './HttpService';

// ============ INTERFACES ============

export interface BankDetails {
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  hasBankDetails: boolean;
}

export interface BankDetailsResponse {
  success: boolean;
  data: {
    bankDetails: BankDetails;
  };
  message: string;
}

export interface UpdateBankDetailsRequest {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface UpdateBankDetailsResponse {
  success: boolean;
  message: string;
}

export interface ProviderBankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface AdminBankDetails {
  bankName: string;
  accountNumber: string;
}

export interface Settlement {
  _id: string;
  settlementId: string;
  organizationId: string;
  serviceProviderId: string;
  providerUserId: string;
  orderId?: string;
  taskId?: string;
  serviceId?: string;
  description: string;
  amount: number;
  currency: string;
  providerBankDetails: ProviderBankDetails;
  adminBankDetails: AdminBankDetails;
  settlementDate: string;
  paymentEvidenceUrl: string;
  settlementStatus: 'pending' | 'confirmed' | 'disputed';
  providerComment?: string;
  providerConfirmedAt?: string;
  processedByAdminId?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementsListResponse {
  success: boolean;
  data: {
    settlements: Settlement[];
    total: number;
  };
  message: string;
}

export interface SettlementDetailResponse {
  success: boolean;
  data: {
    settlement: Settlement;
  };
  message: string;
}

export interface ConfirmSettlementRequest {
  comment?: string;
}

// Admin interfaces
export interface DetailedServiceProvider {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  customUserId: string;
  phoneNumber: string;
  organizationId: string;
  providerId: string;
  isServiceProvider: boolean;
  specialties: string[];
  photo?: string;
  availabilityHours?: string;
  isAvailable: boolean;
  maxConcurrentBookings?: number;
  status: string;
  rating?: number;
  totalBookings?: number;
  completedBookings?: number;
  serviceProviderFeeName?: string;
  serviceProviderFeeDescription?: string;
  serviceProviderFee?: number;
  serviceProviderFeeCurrency?: string;
  serviceProviderFeeFrequency?: string;
  bankDetails?: ProviderBankDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface DetailedServiceProvidersResponse {
  success: boolean;
  data: {
    serviceProviders: DetailedServiceProvider[];
    totalCount: number;
    organizationId: string;
  };
  message: string;
}

export interface ProcessSettlementRequest {
  serviceProviderId: string;
  orderId?: string;
  taskId?: string;
  serviceId?: string;
  description: string;
  amount: number;
  currency: string;
  adminBankName: string;
  adminAccountNumber: string;
  settlementDate: string;
  paymentEvidenceUrl: string;
}

// ============ SERVICE CLASS ============

class ProviderSettlementService {
  private http: HttpService;

  constructor() {
    this.http = new HttpService();
  }

  // ---- PROVIDER ENDPOINTS ----

  async getMyBankDetails(): Promise<BankDetailsResponse> {
    return this.http.getData<BankDetailsResponse>(
      '/api/service-provider-settlements/provider/my-bank-details'
    );
  }

  async updateBankDetails(data: UpdateBankDetailsRequest): Promise<UpdateBankDetailsResponse> {
    return this.http.putData<UpdateBankDetailsResponse>(
      data,
      '/api/service-provider-settlements/provider/bank-details'
    );
  }

  async getMySettlements(status?: string): Promise<SettlementsListResponse> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.http.getData<SettlementsListResponse>(
      `/api/service-provider-settlements/provider/my-settlements${query}`
    );
  }

  async getMySettlementById(settlementId: string): Promise<SettlementDetailResponse> {
    return this.http.getData<SettlementDetailResponse>(
      `/api/service-provider-settlements/provider/${settlementId}`
    );
  }

  async confirmSettlement(
    settlementId: string,
    data: ConfirmSettlementRequest
  ): Promise<SettlementDetailResponse> {
    return this.http.postData<SettlementDetailResponse>(
      data,
      `/api/service-provider-settlements/provider/${settlementId}/confirm`
    );
  }

  // ---- ADMIN ENDPOINTS ----

  async getDetailedServiceProviders(): Promise<DetailedServiceProvidersResponse> {
    return this.http.getData<DetailedServiceProvidersResponse>(
      '/api/service-provider-assignment/detailed'
    );
  }

  async processSettlement(data: ProcessSettlementRequest): Promise<SettlementDetailResponse> {
    return this.http.postData<SettlementDetailResponse>(
      data,
      '/api/service-provider-settlements/admin/process'
    );
  }

  async getOrganizationSettlements(
    status?: string,
    serviceProviderId?: string
  ): Promise<SettlementsListResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (serviceProviderId) params.append('serviceProviderId', serviceProviderId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.http.getData<SettlementsListResponse>(
      `/api/service-provider-settlements/admin/all${query}`
    );
  }

  async getAdminSettlementById(settlementId: string): Promise<SettlementDetailResponse> {
    return this.http.getData<SettlementDetailResponse>(
      `/api/service-provider-settlements/admin/${settlementId}`
    );
  }
}

export default new ProviderSettlementService();
