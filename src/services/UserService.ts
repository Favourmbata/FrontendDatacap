import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Get user profile
  async getUserProfile() {
    return this.httpService.getData(routes.getUserProfile());
  }

  // Update user profile
  async updateUserProfile(data: Partial<User>) {
    return this.httpService.patchData(data, routes.updateUserProfile());
  }
}