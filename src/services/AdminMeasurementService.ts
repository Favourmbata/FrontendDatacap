import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface Measurement {
  id: string;
  userId: string;
  userCustomId: string;
  userName: string;
  measurements: {
    shoulder?: number;
    bust?: number;
    armLength?: number;
    neck?: number;
    waist?: number;
    hips?: number;
    chest?: number;
    [key: string]: number | undefined;
  };
  notes?: string;
  createdAt: string;
  submissionType: 'AI' | 'Manual' | 'External';
}

export interface CreateMeasurementPayload {
  userId: string;
  measurements: {
    shoulder?: number;
    bust?: number;
    armLength?: number;
    neck?: number;
    waist?: number;
    hips?: number;
    chest?: number;
    [key: string]: number | undefined;
  };
  notes?: string;
}

export interface UpdateMeasurementPayload {
  userId?: string;
  measurements?: {
    shoulder?: number;
    bust?: number;
    armLength?: number;
    neck?: number;
    waist?: number;
    hips?: number;
    chest?: number;
    [key: string]: number | undefined;
  };
  notes?: string;
}

export interface PaginatedMeasurementsResponse {
  success: boolean;
  data: {
    measurements: Measurement[];
    total: number;
    message: string;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface DashboardStats {
  success: boolean;
  data: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    archivedUsers: number;
    disabledUsers: number;
    totalMeasurements: number;
    oneTimeCodesGenerated: number;
    oneTimeCodesUsed: number;
    organizationId: string;
    message: string;
  };
}

export class AdminMeasurementService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Get all measurements with pagination and optional user filter
  async getMeasurements(
    page: number = 1,
    limit: number = 10,
    userId?: string
  ): Promise<PaginatedMeasurementsResponse> {
    const url = routes.getAdminMeasurements(page, limit, userId);
    return this.httpService.getData<PaginatedMeasurementsResponse>(url);
  }

  // Create a new measurement
  async createMeasurement(payload: CreateMeasurementPayload) {
    return this.httpService.postData<Measurement>(payload, routes.createAdminMeasurement());
  }

  // Update an existing measurement
  async updateMeasurement(measurementId: string, payload: UpdateMeasurementPayload) {
    return this.httpService.putData<Measurement>(payload, routes.updateAdminMeasurement(measurementId));
  }

  // Delete a measurement
  async deleteMeasurement(measurementId: string) {
    return this.httpService.deleteData<{ success: boolean; message: string }>(routes.deleteAdminMeasurement(measurementId));
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    return this.httpService.getData<DashboardStats>(routes.getAdminDashboardStats());
  }
}