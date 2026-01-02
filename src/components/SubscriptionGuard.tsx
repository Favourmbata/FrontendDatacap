// components/SubscriptionGuard.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockSubscriptionService } from '@/services/mockSubscriptionService';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  moduleName?: string; // Optional: specific module name to check
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children, moduleName }) => {
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = () => {
      // Check if user has active subscription
      const hasSubscription = mockSubscriptionService.hasActiveSubscription();
      
      // If no subscription, redirect to subscription page
      if (!hasSubscription) {
        router.replace('/subscription');
        return;
      }

      // If checking specific module access
      if (moduleName && !mockSubscriptionService.hasModuleAccess(moduleName)) {
        // Redirect to subscription page if no access to specific module
        router.replace('/subscription');
        return;
      }
    };

    checkSubscription();
  }, [moduleName, router]);

  // For now, just return children - the useEffect handles the redirect
  // In a real implementation, we might want to show a loading state while checking
  return <>{children}</>;
};

export default SubscriptionGuard;