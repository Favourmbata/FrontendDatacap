// Mock subscription service for development
// This will be replaced with actual API calls when backend is ready

interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
}

class MockSubscriptionService {
  private subscriptions: Subscription[] = [
    // Mock data - in real implementation, this would come from API
    {
      id: 'sub_1',
      userId: 'user_1',
      packageId: 'pkg_1',
      packageName: 'Basic Package',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      paymentStatus: 'completed'
    }
  ];

  // Check if user has active subscription
  hasActiveSubscription(userId: string): boolean {
    const userSubscriptions = this.subscriptions.filter(sub => sub.userId === userId);
    return userSubscriptions.some(sub => 
      sub.status === 'active' && sub.paymentStatus === 'completed'
    );
  }

  // Get all subscriptions for user
  getUserSubscriptions(userId: string): Subscription[] {
    return this.subscriptions.filter(sub => sub.userId === userId);
  }

  // Check if user has access to specific module/package
  hasModuleAccess(userId: string, moduleId: string): boolean {
    const activeSubscriptions = this.subscriptions.filter(sub => 
      sub.userId === userId && 
      sub.status === 'active' && 
      sub.paymentStatus === 'completed'
    );
    
    // In real implementation, check if any subscription includes the module
    return activeSubscriptions.length > 0;
  }
}

export const mockSubscriptionService = new MockSubscriptionService();