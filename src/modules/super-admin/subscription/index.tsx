"use client";

import React, { useEffect, useState } from 'react';
import useSubscriptionPackages from '@/api/hooks/useSubscriptionPackages';

const SubscriptionPage = () => {
  const { packages, loading, error } = useSubscriptionPackages();
  
  return (
    <div className="manrope bg-white rounded-xl shadow-sm border border-gray-200">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Package Subscription</h2>
          <p className="text-gray-600">Manage package subscriptions for organizations</p>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading packages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Error loading packages: {error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{pkg.finalPriceAfterDiscount?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;