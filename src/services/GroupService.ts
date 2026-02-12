import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface GroupMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Group {
  _id: string;
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  members?: GroupMember[];
  organizationId: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupData {
  name: string;
  description: string;
  memberIds: string[];
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
}

export interface ManageGroupMembersData {
  action: 'add' | 'remove';
  userIds: string[];
}

export interface PaginatedGroupsResponse {
  success: boolean;
  data: {
    groups: Group[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      total: number;
    };
    message: string;
  };
}

export interface GroupResponse {
  success: boolean;
  data: {
    group: Group;
    message: string;
  };
}

export interface GroupMembersResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export class GroupService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  // Create a new group
  async createGroup(data: CreateGroupData): Promise<GroupResponse> {
    return this.httpService.postData<GroupResponse>(data, routes.createGroup());
  }

  // Get all groups with pagination
  async getGroups(page: number = 1, limit: number = 10): Promise<PaginatedGroupsResponse> {
    const url = routes.getGroupsWithPagination(page, limit);
    return this.httpService.getData<PaginatedGroupsResponse>(url);
  }

  // Get group by ID
  async getGroupById(groupId: string): Promise<GroupResponse> {
    const url = routes.getGroupById(groupId);
    const response = await this.httpService.getData<GroupResponse>(url);
    return response;
  }

  // Update group
  async updateGroup(groupId: string, data: UpdateGroupData): Promise<GroupResponse> {
    const url = routes.updateGroup(groupId);
    return this.httpService.putData<GroupResponse>(data, url);
  }

  // Delete group
  async deleteGroup(groupId: string): Promise<any> {
    const url = routes.deleteGroup(groupId);
    return this.httpService.deleteData<any>(url);
  }

  // Manage group members (add or remove)
  async manageGroupMembers(groupId: string, data: ManageGroupMembersData): Promise<GroupMembersResponse> {
    const url = routes.manageGroupMembers(groupId);
    return this.httpService.putData<GroupMembersResponse>(data, url);
  }
}