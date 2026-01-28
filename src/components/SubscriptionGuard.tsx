"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/AuthContext';
import axios from 'axios';
import { mockSubscriptionService } from '@/services/mockSubscriptionService';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const router = useRouter();
  const { token, user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      // Skip check if no token or user
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      // Skip for super admin users
      const userRole = user.role?.toLowerCase();
      if (userRole === 'super_admin') {
        setHasActiveSubscription(true);
        setIsLoading(false);
        return;
      }

      // For organization/admin users, check subscription status using the correct API
      if (userRole === 'organisation' || userRole === 'organization' || userRole === 'admin') {
        try {
          // First try the real API with correct endpoint
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}/api/user-subscriptions/user/${user.id}/status`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.success) {
            // Use the redirectTo field to determine access
            const shouldShowSubscription = response.data.data.shouldShowSubscription;
            setHasActiveSubscription(!shouldShowSubscription);
          } else {
            // Fallback to mock service
            setHasActiveSubscription(mockSubscriptionService.hasActiveSubscription(user.id));
          }
        } catch (error) {
          console.error('Error checking subscription status via API:', error);
          // Fallback to mock service when API fails
          setHasActiveSubscription(mockSubscriptionService.hasActiveSubscription(user.id));
        } finally {
          setIsLoading(false);
        }
      } else {
        // For other user types, no subscription check needed
        setHasActiveSubscription(true);
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [token, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  // If user has active subscription, show protected content
  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  // If user doesn't have active subscription, redirect to subscription page
  if (token && user && !hasActiveSubscription) {
    const userRole = user.role?.toLowerCase();
    if (userRole === 'organisation' || userRole === 'organization' || userRole === 'admin') {
      router.replace('/subscription');
      return null;
    }
  }

  // For other cases, show children (unprotected routes)
  return <>{children}</>;
};

export default SubscriptionGuard;