export const routes = {
  // User profile routes
  getUserProfile: () => '/api/user/profile',
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
  
  // Admin measurements routes
  getAdminMeasurements: (page: number = 1, limit: number = 10, userId?: string) => {
    let url = `/api/admin/measurements?page=${page}&limit=${limit}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return url;
  },
  createAdminMeasurement: () => '/api/admin/measurements',
  updateAdminMeasurement: (measurementId: string) => `/api/admin/measurements/${measurementId}`,
  deleteAdminMeasurement: (measurementId: string) => `/api/admin/measurements/${measurementId}`,
  
  // Admin dashboard routes
  getAdminDashboardStats: () => '/api/admin/dashboard/stats',
  
  // One-time codes routes
  generateOneTimeCode: () => '/api/admin/one-time-codes',
  getOneTimeCodes: (page: number = 1, limit: number = 10) => `/api/admin/one-time-codes?page=${page}&limit=${limit}`,
  
  // Subscription management routes
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
  }
};