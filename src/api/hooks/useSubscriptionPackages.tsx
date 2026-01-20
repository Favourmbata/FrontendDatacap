"use client";

import { useState, useEffect } from "react";
import { routes } from '@/services/apiRoutes';
import SubscriptionService from '@/services/subscriptionService';

interface Service {
  serviceId: string;
  serviceName: string;
  duration: string;
  price: number;
  _id?: string;
}

interface SubscriptionPackage {
  _id: string;
  title: string;
  description: string;
  totalServiceCost?: number;
  promoCode?: string;
  discountPercentage?: number;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  discountAmount?: number;
  finalPriceAfterDiscount?: number;
  features: string[];
  note?: string;
  isActive?: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  services: Service[];
  // Handle packages without services array (backward compatibility)
  price?: number;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  setupDate?: string;
  updatedDate?: string;
  status?: 'active' | 'inactive';
  subscriberCount?: number;
  id?: string;
  maxUsers?: number;
}

const useSubscriptionPackages = () => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await SubscriptionService.getAllSubscriptionPackages();
        
        // Transform the data to match our expected format
        const transformedPackages = data.map(pkg => ({
          _id: pkg.id || pkg._id || '',
          title: pkg.title,
          description: pkg.description,
          totalServiceCost: pkg.totalServiceCost,
          promoCode: pkg.promoCode,
          discountPercentage: pkg.discountPercentage,
          promoStartDate: pkg.promoStartDate,
          promoEndDate: pkg.promoEndDate,
          discountAmount: pkg.discountAmount,
          finalPriceAfterDiscount: pkg.finalPriceAfterDiscount,
          features: pkg.features,
          note: pkg.note,
          isActive: pkg.isActive,
          createdBy: pkg.createdBy,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt,
          __v: pkg.__v,
          services: pkg.services || [],
          price: pkg.price,
          monthlyPrice: pkg.monthlyPrice,
          quarterlyPrice: pkg.quarterlyPrice,
          yearlyPrice: pkg.yearlyPrice,
          setupDate: pkg.setupDate,
          updatedDate: pkg.updatedDate,
          status: pkg.status,
          subscriberCount: pkg.subscriberCount,
          maxUsers: pkg.maxUsers,
        }));
        
        setPackages(transformedPackages);
      } catch (err) {
        console.error('Error fetching subscription packages:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, loading, error };
};

export default useSubscriptionPackages;