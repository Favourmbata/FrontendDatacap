// services/mockSubscriptionService.ts
// Mock service to track admin subscription status

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionExpiry?: string;
  modulesAccess: string[];
  selectedPackages: string[];
}

class MockSubscriptionService {
  private storageKey = 'adminSubscriptionStatus';

  // Get current subscription status
  getSubscriptionStatus(): SubscriptionStatus {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default: no active subscription
    return {
      hasActiveSubscription: false,
      modulesAccess: [],
      selectedPackages: []
    };
  }

  // Set subscription status
  setSubscriptionStatus(status: SubscriptionStatus): void {
    localStorage.setItem(this.storageKey, JSON.stringify(status));
  }

  // Check if admin has access to a specific module
  hasModuleAccess(moduleName: string): boolean {
    const status = this.getSubscriptionStatus();
    return status.hasActiveSubscription && 
           (status.modulesAccess.includes(moduleName) || status.modulesAccess.includes('all'));
  }

  // Check if admin has any active subscription
  hasActiveSubscription(): boolean {
    const status = this.getSubscriptionStatus();
    return status.hasActiveSubscription;
  }

  // Mock payment processing
  processPayment(selectedPackages: string[]): SubscriptionStatus {
    const newStatus: SubscriptionStatus = {
      hasActiveSubscription: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      modulesAccess: ['body-measurement', 'object-dimension', 'questionaire', 'users', 'role-management', 'group-management', 'subscription'],
      selectedPackages: selectedPackages
    };
    
    this.setSubscriptionStatus(newStatus);
    return newStatus;
  }

  // Get available modules
  getAvailableModules(): string[] {
    return ['body-measurement', 'object-dimension', 'questionaire', 'users', 'role-management', 'group-management', 'subscription'];
  }
}

export const mockSubscriptionService = new MockSubscriptionService();