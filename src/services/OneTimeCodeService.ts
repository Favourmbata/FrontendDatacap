import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface OneTimeCodeRequest {
  userEmail: string;
  expirationHours: number;
}

export interface OneTimeCodeResponse {
  success: boolean;
  data: {
    code: string;
    expiresAt: string;
    userEmail: string;
    message: string;
  };
}

export interface OneTimeCode {
  id: string;
  code: string;
  userEmail: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface PaginatedOneTimeCodesResponse {
  success: boolean;
  data: {
    codes: OneTimeCode[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
    message: string;
  };
}

export class OneTimeCodeService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async generateOneTimeCode(request: OneTimeCodeRequest): Promise<OneTimeCodeResponse> {
    return this.httpService.postData(request, routes.generateOneTimeCode());
  }

  async getOneTimeCodes(page: number = 1, limit: number = 10): Promise<PaginatedOneTimeCodesResponse> {
    return this.httpService.getData(routes.getOneTimeCodes(page, limit));
  }

  async sendOneTimeCodeEmail(code: string): Promise<any> {
    return this.httpService.postData({ code }, routes.sendOneTimeCodeEmail());
  }
}