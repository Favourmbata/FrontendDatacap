"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionService from '@/services/subscriptionService';

interface SubscriptionPackageData {
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

const ViewSubscriptionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<SubscriptionPackageData | null>(null);

  useEffect(() => {
    // Get the package with the matching ID from service
    const foundPackage = SubscriptionService.getPackageById(params.id);
    setPackageData(foundPackage || null);
  }, [params.id]);

  if (!packageData) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Package Not Found</h1>
          <p className="text-gray-600 mt-2">The subscription package you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mb-4"
        >
          ← Back
        </button>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">View Subscription Package</h1>
            <p className="text-gray-600">Detailed information about {packageData.name}</p>
          </div>
          <button 
            onClick={() => router.push(`/super-admin/subscription/edit/${packageData.id}`)}
            className="px-4 py-2 bg-[#5D2A8B] hover:bg-[#4a216e] text-white rounded-lg transition-colors"
          >
            Edit Package
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Package Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Package Name</label>
                <p className="text-lg font-medium text-gray-900">{packageData.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-900">{packageData.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Maximum Users</label>
                <p className="text-lg font-medium text-gray-900">{packageData.maxUsers}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Number of Services</label>
                <p className="text-lg font-medium text-gray-900">{packageData.services}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing & Validity</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Promo Code</label>
                <p className="text-lg font-medium text-gray-900">{packageData.promoCode}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Validity Period</label>
                <p className="text-lg font-medium text-gray-900">
                  {packageData.startDate} to {packageData.endDate}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pricing</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-medium">${packageData.pricePerMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quarterly:</span>
                      <span className="font-medium">${packageData.pricePerQuarter} <span className="text-sm text-gray-500">(5% discount)</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yearly:</span>
                      <span className="font-medium">${packageData.pricePerYear} <span className="text-sm text-gray-500">(10% discount)</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionPage;