"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionService, { SubscriptionPackage, CreateSubscriptionPackageData } from '@/services/subscriptionService';

const EditSubscriptionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<SubscriptionPackage & {
    promoCode?: string;
    selectedPricing: 'monthly' | 'quarterly' | 'yearly';
    financialDetails: {
      id: string;
      amount: number;
      platformChargePercent: number;
      platformChargeValue: number;
      actualAmount: number;
      discountPercentage: number;
    }[];
  } | null>(null);
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
      setPackageData({
        ...foundPackage,
        promoCode: foundPackage.promoCode || '',
        selectedPricing: 'monthly',
        financialDetails: [{
          id: '1',
          amount: 0, // Default value, can be loaded from backend if stored there
          platformChargePercent: 0,
          platformChargeValue: 0,
          actualAmount: 0,
          discountPercentage: 0
        }]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription package');
      console.error('Error loading package:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate amounts whenever related fields change
  useEffect(() => {
    if (!packageData) return;
    
    const updatedFinancialDetails = packageData.financialDetails.map(detail => {
      const amount = detail.amount || 0;
      const platformChargePercent = detail.platformChargePercent || 0;
      const discountPercentage = detail.discountPercentage || 0;
      
      // Calculate platform charge value
      const platformChargeValue = (amount * platformChargePercent) / 100;
      
      // Calculate actual amount before discount
      const actualAmountBeforeDiscount = amount + platformChargeValue;
      
      // Calculate discount amount and final actual amount
      const discountValue = (actualAmountBeforeDiscount * discountPercentage) / 100;
      const actualAmount = actualAmountBeforeDiscount - discountValue;
      
      return {
        ...detail,
        platformChargeValue: parseFloat(platformChargeValue.toFixed(2)),
        actualAmount: parseFloat(actualAmount.toFixed(2))
      };
    });
    
    // Only update if there are actual changes
    const hasChanges = packageData.financialDetails.some((detail, index) => {
      const updatedDetail = updatedFinancialDetails[index];
      return (
        detail.platformChargeValue !== updatedDetail.platformChargeValue ||
        detail.actualAmount !== updatedDetail.actualAmount
      );
    });
    
    if (hasChanges) {
      setPackageData(prev => prev ? {
        ...prev,
        financialDetails: updatedFinancialDetails
      } : null);
    }
  }, [packageData?.financialDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!packageData) return;
    
    const { name, value } = e.target;
    if (name === 'selectedPricing') {
      setPackageData(prev => prev ? {
        ...prev,
        selectedPricing: value as 'monthly' | 'quarterly' | 'yearly'
      } : null);
    } else {
      setPackageData(prev => prev ? {
        ...prev,
        [name]: name.includes('Price')
          ? Number(value)
          : value
      } : null);
    }
  };

  const handleFinancialDetailChange = (id: string, field: string, value: string | number) => {
    if (!packageData) return;
    
    setPackageData(prev => prev ? {
      ...prev,
      financialDetails: prev.financialDetails.map(detail => 
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    } : null);
  };

  const addFinancialDetail = () => {
    if (!packageData) return;
    
    setPackageData(prev => prev ? {
      ...prev,
      financialDetails: [
        ...prev.financialDetails,
        {
          id: Date.now().toString(),
          amount: 0,
          platformChargePercent: 0,
          platformChargeValue: 0,
          actualAmount: 0,
          discountPercentage: 0
        }
      ]
    } : null);
  };

  const removeFinancialDetail = (id: string) => {
    if (!packageData || packageData.financialDetails.length <= 1) return;
    
    setPackageData(prev => prev ? {
      ...prev,
      financialDetails: prev.financialDetails.filter(detail => detail.id !== id)
    } : null);
  };

  const generatePromoCode = () => {
    if (!packageData) return;
    
    const prefix = packageData.packageName.substring(0, 4).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    setPackageData(prev => prev ? {
      ...prev,
      promoCode: `${prefix}${randomNum}${year}`
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (packageData) {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare update data - only include fields that can be updated
        const updateData: Partial<CreateSubscriptionPackageData> = {
          packageName: packageData.packageName,
          services: packageData.services,
          description: packageData.description,
          monthlyPrice: packageData.monthlyPrice,
          quarterlyPrice: packageData.quarterlyPrice,
          yearlyPrice: packageData.yearlyPrice,
          promoStartDate: packageData.promoStartDate,
          promoEndDate: packageData.promoEndDate
        };
        
        // Update package using service
        await SubscriptionService.updateSubscriptionPackage(packageData.id, updateData);
        
        // Redirect back to subscription list
        router.push('/super-admin/subscription');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update subscription package');
        console.error('Error updating package:', err);
      } finally {
        setLoading(false);
      }
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
          Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Loading Package</h1>
         
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
             Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Package Not Found</h1>
          
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
           Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Subscription Package</h1>
        
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input
              type="text"
              name="packageName"
              value={packageData.packageName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
            <input
              type="text"
              name="services"
              value={packageData.services}
              onChange={handleChange}
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
                    value={packageData.promoCode || ''}
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
          
          {/* Promo Period Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Promo Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Start Date</label>
                  <input
                    type="date"
                    name="promoStartDate"
                    value={packageData.promoStartDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo End Date</label>
                  <input
                    type="date"
                    name="promoEndDate"
                    value={packageData.promoEndDate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₦)</label>
                  <input
                    type="number"
                    name="monthlyPrice"
                    value={packageData.monthlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quarterly Price (₦)</label>
                  <input
                    type="number"
                    name="quarterlyPrice"
                    value={packageData.quarterlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (₦)</label>
                  <input
                    type="number"
                    name="yearlyPrice"
                    value={packageData.yearlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Details Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
                <button
                  type="button"
                  onClick={addFinancialDetail}
                  className="px-3 py-1 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e] text-sm"
                >
                  Add More
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Pricing Type</label>
                <select
                  name="selectedPricing"
                  value={packageData.selectedPricing}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {packageData.financialDetails.map((detail, index) => (
                  <div key={detail.id} className="border border-gray-200 rounded-lg p-4 relative">
                    {packageData.financialDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFinancialDetail(detail.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                    
                    <h4 className="text-md font-medium text-gray-800 mb-3">Financial Detail #{index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                        <input
                          type="number"
                          value={detail.amount}
                          onChange={(e) => handleFinancialDetailChange(detail.id, 'amount', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Charge %</label>
                        <input
                          type="number"
                          value={detail.platformChargePercent}
                          onChange={(e) => handleFinancialDetailChange(detail.id, 'platformChargePercent', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Charge Value (₦)</label>
                        <input
                          type="number"
                          value={detail.platformChargeValue}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                        <input
                          type="number"
                          value={detail.discountPercentage}
                          onChange={(e) => handleFinancialDetailChange(detail.id, 'discountPercentage', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Amount (₦)</label>
                        <input
                          type="number"
                          value={detail.actualAmount}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubscriptionPage;