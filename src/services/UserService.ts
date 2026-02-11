console.log('UserService: File initialization started');
console.log('UserService: Module loading started');
console.log('UserService: File initialization started');
console.log('UserService: Module initialization started');
console.log('UserService: File loading started');
console.log('UserService: Module loading started');
console.log('UserService: File execution started');
console.log('UserService: Module execution started');
console.log('UserService: Starting file execution');
console.log('UserService: Importing HttpService');
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