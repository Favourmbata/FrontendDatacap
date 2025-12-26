"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionService, { SubscriptionPackage } from '@/services/subscriptionService';

const ViewSubscriptionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<SubscriptionPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackageData();
  }, [params.id]);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const foundPackage = await SubscriptionService.getSubscriptionPackageById(params.id);
      setPackageData(foundPackage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription package');
      console.error('Error loading package:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-800">Loading Package</h1>
          <p className="text-gray-600 mt-2">Please wait while we load the subscription package details.</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <h1 className="text-2xl font-bold text-gray-800">Error Loading Package</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={loadPackageData}
            className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-600">Detailed information about {packageData.packageName}</p>
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
                <p className="text-lg font-medium text-gray-900">{packageData.packageName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Services</label>
                <p className="text-gray-900">{packageData.services}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-900">{packageData.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  packageData.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {packageData.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Subscriber Count</label>
                <p className="text-lg font-medium text-gray-900">{packageData.subscriberCount}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing & Validity</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Promo Code</label>
                <p className="text-lg font-medium text-gray-900">{packageData.promoCode || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Promo Period</label>
                <p className="text-lg font-medium text-gray-900">
                  {packageData.promoStartDate ? `${packageData.promoStartDate} to ${packageData.promoEndDate || 'N/A'}` : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pricing</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-medium">₦{packageData.monthlyPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quarterly:</span>
                      <span className="font-medium">₦{packageData.quarterlyPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yearly:</span>
                      <span className="font-medium">₦{packageData.yearlyPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Setup Date</label>
                <p className="text-lg font-medium text-gray-900">{packageData.setupDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial Details Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Details</h2>
          
          {/* Table header - always visible */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₦)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Charge %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Charge Value (₦)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Amount (₦)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row - in a real implementation, you would map through actual financial details */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sample Service</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">Note: Financial details are calculated based on selected pricing type and additional services.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionPage;