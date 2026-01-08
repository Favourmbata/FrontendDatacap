export const routes = {
  // User profile routes
  getUserProfile: () => '/api/auth/profile',
  updateUserProfile: () => '/api/user/profile',
  
  // Manual measurement routes
  getManualMeasurementForms: () => '/api/manual-measurements/forms',
  createManualMeasurement: () => '/api/manual-measurements',
  
  // Auth routes
  login: () => '/api/auth/login',
  register: () => '/api/auth/register',
  verifyOtp: () => '/api/auth/verify-otp',
  resendOtp: () => '/api/auth/resend-otp',
  
  // Organization routes
  registerOrganization: () => '/api/organisations/register',
  
  // Measurements routes
  getMeasurements: () => '/api/measurements',
  getMeasurementById: (id: string) => `/api/measurements/${id}`,
  
  // Admin user management routes
  createAdminUser: () => '/api/admin/users',
  getAdminUsers: (page: number = 1, limit: number = 10) => `/api/admin/users?page=${page}&limit=${limit}`,
  getAdminUserById: (userId: string) => `/api/admin/users/${userId}`,
  getAdminUsersByStatus: (status: string, page: number = 1, limit: number = 10) => `/api/admin/users/status/${status}?page=${page}&limit=${limit}`,
  generateCustomUserId: (userId: string) => `/api/admin/users/${userId}/generate-id`,
  updateAdminUser: (userId: string) => `/api/admin/users/${userId}`,
  updateAdminUserPassword: (userId: string) => `/api/admin/users/${userId}/password`,
  updateAdminUserStatus: (userId: string) => `/api/admin/users/${userId}/status`,
  getAvailablePermissions: () => '/api/admin/permissions',
  assignUserPermissions: (userId: string) => `/api/admin/users/${userId}/permissions`,
  getUserPermissions: (userId: string) => `/api/admin/users/${userId}/permissions`,
  deleteAdminUser: (userId: string) => `/api/admin/users/${userId}`,
  
  // Admin role management routes
  createRole: () => '/api/admin/roles',
  getRoles: () => '/api/admin/roles',
  getRoleById: (roleId: string) => `/api/admin/roles/${roleId}`,
  updateRole: (roleId: string) => `/api/admin/roles/${roleId}`,
  deleteRole: (roleId: string) => `/api/admin/roles/${roleId}`,
  assignRoleToUsers: (roleId: string) => `/api/admin/roles/${roleId}/assign`,
  unassignRoleFromUsers: (roleId: string) => `/api/admin/roles/${roleId}/unassign`,
  getUsersByRole: (roleId: string) => `/api/admin/roles/${roleId}/users`,
  getRolesWithPagination: (page: number = 1, limit: number = 10) => `/api/admin/roles?page=${page}&limit=${limit}`,
  
  // Admin group management routes
  createGroup: () => '/api/admin/groups',
  getGroups: () => '/api/admin/groups',
  getGroupById: (groupId: string) => `/api/admin/groups/${groupId}`,
  updateGroup: (groupId: string) => `/api/admin/groups/${groupId}`,
  deleteGroup: (groupId: string) => `/api/admin/groups/${groupId}`,
  manageGroupMembers: (groupId: string) => `/api/admin/groups/${groupId}/members`,
  getGroupsWithPagination: (page: number = 1, limit: number = 10) => `/api/admin/groups?page=${page}&limit=${limit}`,
  
  // Admin measurements routes
  getAdminMeasurements: (page: number = 1, limit: number = 10, userId?: string) => {
    let url = `/api/admin/measurements?page=${page}&limit=${limit}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return url;
  },
  createAdminMeasurement: () => '/api/admin/measurements',
  getAdminMeasurementById: (measurementId: string) => `/api/admin/measurements/${measurementId}`,
  updateAdminMeasurement: (measurementId: string) => `/api/admin/measurements/${measurementId}`,
  deleteAdminMeasurement: (measurementId: string) => `/api/admin/measurements/${measurementId}`,
  
  // Admin dashboard routes
  getAdminDashboardStats: () => '/api/admin/dashboard/stats',
  
  // One-time codes routes
  generateOneTimeCode: () => '/api/admin/one-time-codes',
  getOneTimeCodes: (page: number = 1, limit: number = 10) => `/api/admin/one-time-codes?page=${page}&limit=${limit}`,
  sendOneTimeCodeEmail: () => '/api/admin/one-time-codes/send-email',
  validateCode: () => '/api/admin/external/validate-code',
  submitExternalMeasurement: () => '/api/admin/external/measurements',
  
  // General subscription management routes
  getSubscriptions: (search?: string) => {
    let url = '/api/super-admin/subscriptions/general';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  },
  getSubscriptionById: (id: string) => `/api/super-admin/subscriptions/general/${id}`,
  createSubscription: () => '/api/super-admin/subscriptions/general',
  updateSubscription: (id: string) => `/api/super-admin/subscriptions/general/${id}`,
  deleteSubscription: (id: string) => `/api/super-admin/subscriptions/general/${id}`,
  
  // Subscription package management routes
  getSubscriptionPackages: (page: number = 1, limit: number = 10, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: 'active' | 'inactive') => {
    let url = `/api/super-admin/subscriptions?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;
    if (status) url += `&status=${status}`;
    return url;
  },
  createSubscriptionPackage: () => '/api/super-admin/subscriptions',
  getSubscriptionPackageById: (id: string) => `/api/super-admin/subscriptions/${id}`,
  updateSubscriptionPackage: (id: string) => `/api/super-admin/subscriptions/${id}`,
  deleteSubscriptionPackage: (id: string) => `/api/super-admin/subscriptions/${id}`,
  updateSubscriptionStatus: (id: string) => `/api/super-admin/subscriptions/${id}/status`,
  exportSubscriptionPackages: (format: 'csv' | 'excel' | 'pdf') => `/api/super-admin/subscriptions/export/${format}`,


  // Super Admin dashboard routes
  getSuperAdminDashboardStats: () => '/api/super-admin/dashboard/stats',
  getSuperAdminDashboardAnalytics: () => '/api/super-admin/dashboard/analytics',
  
  // Super Admin customer management routes
  superAdmin: {
    customers: '/api/super-admin/customers',
    customerById: (id: string) => `/api/super-admin/customers/${id}`,
    customerStatus: (id: string) => `/api/super-admin/customers/${id}/status`,
    resetCustomerPassword: (id: string) => `/api/super-admin/customers/${id}/reset-password`,
    exportCustomers: (format: 'csv' | 'excel' | 'pdf') => `/api/super-admin/customers/export/${format}`,
  },

  // Module management routes
  getModules: (search?: string, status?: 'active' | 'inactive') => {
    let url = '/api/super-admin/modules';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  },
  getModuleById: (id: string) => `/api/super-admin/modules?id=${id}`,
  createModule: () => '/api/super-admin/modules',
  updateModule: (id: string) => `/api/super-admin/modules`,
  deleteModule: (id: string) => `/api/super-admin/modules?id=${id}`,
  
  // Verified subscription management routes
  getVerifiedSubscriptions: (search?: string) => {
    let url = '/api/super-admin/verified-subscriptions';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const paramString = params.toString();
    return paramString ? `${url}?${paramString}` : url;
  },
  getVerifiedSubscriptionById: (id: string) => `/api/super-admin/verified-subscriptions/${id}`,
  createVerifiedSubscription: () => '/api/super-admin/verified-subscriptions',
  updateVerifiedSubscription: (id: string) => `/api/super-admin/verified-subscriptions/${id}`,
  deleteVerifiedSubscription: (id: string) => `/api/super-admin/verified-subscriptions/${id}`,
  
  scanMeasurements: () => '/api/measurements/scan'
};