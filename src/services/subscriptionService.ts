// services/subscriptionService.ts
interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  maxUsers: number;
  promoCode: string;
  startDate: string;
  endDate: string;
  services: number;
  pricePerMonth: number;
  pricePerQuarter: number;
  pricePerYear: number;
}

class SubscriptionService {
  private static instance: SubscriptionService;
  private packages: SubscriptionPackage[];

  private constructor() {
    // Initialize with mock data
    this.packages = [
      {
        id: '1',
        name: 'Basic Package',
        description: 'Perfect for small organizations',
        maxUsers: 50,
        promoCode: 'BASIC2025',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        services: 1,
        pricePerMonth: 20,
        pricePerQuarter: 55,
        pricePerYear: 200
      },
      {
        id: '2',
        name: 'Professional Package',
        description: 'Ideal for medium businesses',
        maxUsers: 200,
        promoCode: 'PRO2025',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        services: 2,
        pricePerMonth: 50,
        pricePerQuarter: 140,
        pricePerYear: 500
      },
      {
        id: '3',
        name: 'Enterprise Package',
        description: 'Best for large organizations',
        maxUsers: 1000,
        promoCode: 'ENTERPRISE2025',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        services: 3,
        pricePerMonth: 100,
        pricePerQuarter: 280,
        pricePerYear: 1000
      }
    ];
  }

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  getAllPackages(): SubscriptionPackage[] {
    return this.packages;
  }

  getPackageById(id: string): SubscriptionPackage | undefined {
    return this.packages.find(pkg => pkg.id === id);
  }

  createPackage(newPackage: Omit<SubscriptionPackage, 'id'>): SubscriptionPackage {
    const id = (this.packages.length + 1).toString();
    const packageWithId = { ...newPackage, id };
    this.packages.push(packageWithId);
    return packageWithId;
  }

  updatePackage(id: string, updatedPackage: Partial<SubscriptionPackage>): SubscriptionPackage | null {
    const index = this.packages.findIndex(pkg => pkg.id === id);
    if (index === -1) return null;
    
    this.packages[index] = { ...this.packages[index], ...updatedPackage };
    return this.packages[index];
  }

  deletePackage(id: string): boolean {
    const initialLength = this.packages.length;
    this.packages = this.packages.filter(pkg => pkg.id !== id);
    return this.packages.length !== initialLength;
  }
}

export default SubscriptionService.getInstance();
export type { SubscriptionPackage };