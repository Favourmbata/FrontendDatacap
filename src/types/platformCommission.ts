export interface PlatformCommission {
  id: string;
  commissionName: string;
  commissionRate: number;
  categoryId: string;
  categoryName: string;
  industryId: string;
  industryName: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformCommissionRequest {
  commissionName: string;
  commissionRate: number;
  categoryId: string;
  industryId: string;
  description: string;
}

export interface UpdatePlatformCommissionRequest {
  commissionName?: string;
  commissionRate?: number;
  categoryId?: string;
  industryId?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface GetPlatformCommissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  industryId?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'inactive';
}