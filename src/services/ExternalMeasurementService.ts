import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface ValidateCodeRequest {
  code: string;
}

export interface ValidateCodeResponse {
  success: boolean;
  data: {
    isValid: boolean;
    organizationName: string;
    expiresAt: string;
    message: string;
  };
}

export interface SubmitExternalMeasurementRequest {
  code: string;
  userEmail: string;
  measurements: Record<string, number>;
  userHeight?: number;
  notes?: string;
}

export interface SubmitExternalMeasurementResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export class ExternalMeasurementService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async validateCode(request: ValidateCodeRequest): Promise<ValidateCodeResponse> {
    return this.httpService.postData(request, routes.validateCode());
  }

  async submitExternalMeasurement(request: SubmitExternalMeasurementRequest): Promise<SubmitExternalMeasurementResponse> {
    return this.httpService.postData(request, routes.submitExternalMeasurement());
  }
}