"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionService, { CreateSubscriptionPackageData } from '@/services/subscriptionService';

const CreateSubscriptionPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateSubscriptionPackageData & {
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
  }>({
    packageName: '',
    description: '',
    services: '',
    monthlyPrice: 0,
    quarterlyPrice: 0,
    yearlyPrice: 0,
    promoStartDate: '',
    promoEndDate: '',
    promoCode: '',
    selectedPricing: 'monthly',
    financialDetails: [{
      id: '1',
      amount: 0,
      platformChargePercent: 0,
      platformChargeValue: 0,
      actualAmount: 0,
      discountPercentage: 0
    }]
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validatePackageName = (name: string): string | null => {
    if (!name.trim()) return 'Package name is required';
    if (name.length < 2) return 'Package name must be at least 2 characters';
    if (name.length > 50) return 'Package name must not exceed 50 characters';
    return null;
  };

  const validatePrices = (monthly: number, quarterly: number, yearly: number): string | null => {
    if (monthly <= 0) return 'Monthly price must be a positive number';
    if (quarterly <= 0) return 'Quarterly price must be a positive number';
    if (yearly <= 0) return 'Yearly price must be a positive number';
    
    // Check pricing logic: Monthly ≤ Quarterly ≤ Yearly
    if (monthly > quarterly) return 'Quarterly price should be greater than or equal to monthly price';
    if (quarterly > yearly) return 'Yearly price should be greater than or equal to quarterly price';
    
    return null;
  };

  const validatePromoDates = (startDate: string | undefined, endDate: string | undefined): string | null => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) return 'End date must be after start date';
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const nameError = validatePackageName(formData.packageName);
    if (nameError) errors.packageName = nameError;
    
    const priceError = validatePrices(formData.monthlyPrice, formData.quarterlyPrice, formData.yearlyPrice);
    if (priceError) errors.prices = priceError;
    
    const dateError = validatePromoDates(formData.promoStartDate, formData.promoEndDate);
    if (dateError) errors.promoDates = dateError;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate amounts whenever related fields change
  useEffect(() => {
    const updatedFinancialDetails = formData.financialDetails.map(detail => {
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
    const hasChanges = formData.financialDetails.some((detail, index) => {
      const updatedDetail = updatedFinancialDetails[index];
      return (
        detail.platformChargeValue !== updatedDetail.platformChargeValue ||
        detail.actualAmount !== updatedDetail.actualAmount
      );
    });
    
    if (hasChanges) {
      setFormData(prev => ({
        ...prev,
        financialDetails: updatedFinancialDetails
      }));
    }
  }, [formData.financialDetails]); // Only watch financialDetails changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedPricing') {
      setFormData(prev => ({
        ...prev,
        selectedPricing: value as 'monthly' | 'quarterly' | 'yearly'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Price')
          ? Number(value) 
          : value
      }));
    }
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFinancialDetailChange = (id: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      financialDetails: prev.financialDetails.map(detail => 
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const addFinancialDetail = () => {
    setFormData(prev => ({
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
    }));
  };

  const removeFinancialDetail = (id: string) => {
    if (formData.financialDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        financialDetails: prev.financialDetails.filter(detail => detail.id !== id)
      }));
    }
  };

  const generatePromoCode = () => {
    const prefix = formData.packageName.substring(0, 4).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    setFormData(prev => ({
      ...prev,
      promoCode: `${prefix}${randomNum}${year}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validation before submitting
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setFieldErrors({}); // Clear any previous field errors
      
      // Create package using service
      await SubscriptionService.createSubscriptionPackage({
        packageName: formData.packageName,
        description: formData.description,
        services: formData.services,
        monthlyPrice: formData.monthlyPrice,
        quarterlyPrice: formData.quarterlyPrice,
        yearlyPrice: formData.yearlyPrice,
        promoStartDate: formData.promoStartDate,
        promoEndDate: formData.promoEndDate
      });
      
      // Redirect back to subscription list
      router.push('/super-admin/subscription');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription package');
      console.error('Error creating package:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-6">
        <button 
          onClick={goBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mb-4"
        >
           Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Create Subscription Package</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new subscription package</p>
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
              value={formData.packageName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.packageName ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.packageName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.packageName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
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
                    value={formData.promoCode || ''}
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
                    value={formData.promoStartDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.promoDates ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo End Date</label>
                  <input
                    type="date"
                    name="promoEndDate"
                    value={formData.promoEndDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.promoDates ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              </div>
              {fieldErrors.promoDates && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.promoDates}</p>
              )}
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
                    value={formData.monthlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.prices ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quarterly Price (₦)</label>
                  <input
                    type="number"
                    name="quarterlyPrice"
                    value={formData.quarterlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.prices ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price (₦)</label>
                  <input
                    type="number"
                    name="yearlyPrice"
                    value={formData.yearlyPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${fieldErrors.prices ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                </div>
              </div>
              {fieldErrors.prices && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.prices}</p>
              )}
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
                  value={formData.selectedPricing}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {formData.financialDetails.map((detail, index) => (
                  <div key={detail.id} className="border border-gray-200 rounded-lg p-4 relative">
                    {formData.financialDetails.length > 1 && (
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
            {loading ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscriptionPage;