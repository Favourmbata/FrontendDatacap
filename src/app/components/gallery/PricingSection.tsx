import React from 'react';
import { FormData } from '@/types/gallery';

interface PricingSectionProps {
  formData: {
    priceInNaira: number;
    discountPercentage: number;
    upfrontPaymentPercentage: number;
    platformChargePercentage: number;
    categoryId?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
  commissionLoading: boolean;
  commissionError: string | null;
  platformCommission: {
    commissionName: string;
    commissionRate: number;
  } | null;
  calculateActualAmount: () => number;
  calculateTotalWithUpfront: () => {
    actual: number;
    upfront: number;
    remaining: number;
  };
  formatNaira: (amount: number) => string;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  formData, 
  setFormData, 
  errors, 
  commissionLoading, 
  commissionError, 
  platformCommission, 
  calculateActualAmount, 
  calculateTotalWithUpfront, 
  formatNaira 
}) => {
  const totalCalculation = calculateTotalWithUpfront();
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing Information (NGN)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.priceInNaira || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, priceInNaira: e.target.value ? Number(e.target.value) : 0 }))}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.priceInNaira ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
          {errors.priceInNaira && (
            <p className="mt-1 text-sm text-red-600">{errors.priceInNaira}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount (%)
          </label>
          <input
            type="number"
            value={formData.discountPercentage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value ? Number(e.target.value) : 0 }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.discountPercentage ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            max="100"
            placeholder="0"
          />
          {errors.discountPercentage && (
            <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upfront Payment (%)
          </label>
          <input
            type="number"
            value={formData.upfrontPaymentPercentage || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, upfrontPaymentPercentage: e.target.value ? Number(e.target.value) : 0 }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.upfrontPaymentPercentage ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            max="100"
            placeholder="0 (Optional)"
          />
          {errors.upfrontPaymentPercentage && (
            <p className="mt-1 text-sm text-red-600">{errors.upfrontPaymentPercentage}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Optional</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Charge
          </label>
          <div className="relative">
            <input
              type="text"
              value={commissionLoading ? 'Loading...' : commissionError ? 'N/A' : `${formData.platformChargePercentage}%`}
              readOnly
              className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 cursor-not-allowed ${
                commissionError ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {commissionLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading commission rate...</p>
          )}
          {commissionError && (
            <p className="text-xs text-red-600 mt-1">{commissionError}</p>
          )}
          {platformCommission && !commissionError && (
            <p className="text-xs text-gray-500 mt-1">
              Commission: {platformCommission.commissionName}
            </p>
          )}
          {!formData.categoryId && !commissionLoading && (
            <p className="text-xs text-amber-600 mt-1">
              Select a category to view platform commission
            </p>
          )}
        </div>
      </div>
      
      {/* Price Calculation Summary - NGN */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-purple-800">Actual Amount:</span>
          <span className="ml-2 text-lg font-bold text-purple-600">
            {formatNaira(calculateActualAmount())}
          </span>
        </div>
        
        {formData.upfrontPaymentPercentage > 0 && (
          <>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Upfront Payment:</span>
              <span className="ml-2 text-lg font-bold text-blue-600">
                {formatNaira(totalCalculation.upfront)}
              </span>
              <span className="ml-1 text-xs text-blue-600">
                ({formData.upfrontPaymentPercentage}%)
              </span>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Remaining:</span>
              <span className="ml-2 text-lg font-bold text-green-600">
                {formatNaira(totalCalculation.remaining)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingSection;
