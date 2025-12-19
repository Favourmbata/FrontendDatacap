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

const EditSubscriptionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<SubscriptionPackageData | null>(null);

  useEffect(() => {
    // Get the package with the matching ID from service
    const foundPackage = SubscriptionService.getPackageById(params.id);
    if (foundPackage) {
      setPackageData(foundPackage);
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!packageData) return;
    
    const { name, value } = e.target;
    setPackageData(prev => ({
      ...prev!,
      [name]: name.includes('price') || name.includes('maxUsers') || name.includes('services') 
        ? Number(value) 
        : value
    }));
  };

  const generatePromoCode = () => {
    if (!packageData) return;
    
    const prefix = packageData.name.substring(0, 4).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    setPackageData(prev => ({
      ...prev!,
      promoCode: `${prefix}${randomNum}${year}`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    if (packageData) {
      console.log('Form submitted:', packageData);
      
      // Update package using service
      const { id, name, description, maxUsers, promoCode, startDate, endDate, services, pricePerMonth, pricePerQuarter, pricePerYear } = packageData;
      const updated = SubscriptionService.updatePackage(id, {
        name,
        description,
        maxUsers,
        promoCode,
        startDate,
        endDate,
        services,
        pricePerMonth,
        pricePerQuarter,
        pricePerYear
      });
      
      if (updated) {
        console.log('Package updated successfully');
      }
    }
    
    // Redirect back to subscription list
    router.push('/super-admin/subscription');
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Edit Subscription Package</h1>
        <p className="text-gray-600 mt-2">Modify the details for {packageData.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input
              type="text"
              name="name"
              value={packageData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Users</label>
            <input
              type="number"
              name="maxUsers"
              value={packageData.maxUsers}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={packageData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              required
            />
          </div>
          
          {/* Promo Code Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Promo Code</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    name="promoCode"
                    value={packageData.promoCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={generatePromoCode}
                    className="w-full px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e]"
                  >
                    Generate Code
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Validity Period Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Validity Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={packageData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={packageData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Services</label>
            <input
              type="number"
              name="services"
              value={packageData.services}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
            />
          </div>
          
          {/* Services Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Services & Pricing</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Month ($)</label>
                    <input
                      type="number"
                      name="pricePerMonth"
                      value={packageData.pricePerMonth}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Quarter ($)</label>
                    <input
                      type="number"
                      name="pricePerQuarter"
                      value={packageData.pricePerQuarter}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">5% discount applied</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Year ($)</label>
                    <input
                      type="number"
                      name="pricePerYear"
                      value={packageData.pricePerYear}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">10% discount applied</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Discount Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Quarterly billing offers a 5% discount on the monthly rate.</p>
                    <p>• Annual billing offers a 10% discount on the monthly rate.</p>
                    <p>• Discounts are automatically calculated and applied at checkout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e]"
          >
            Update Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubscriptionPage;