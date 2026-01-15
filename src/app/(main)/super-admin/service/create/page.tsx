"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package } from 'lucide-react';

const CreateServicePage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    monthlyPrice: '',
    quarterlyPrice: '',
    yearlyPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!formData.serviceName.trim()) {
        setError('Service name is required');
        setLoading(false);
        return;
      }
      
      // Validate that at least one price is set
      const monthly = parseFloat(formData.monthlyPrice) || 0;
      const quarterly = parseFloat(formData.quarterlyPrice) || 0;
      const yearly = parseFloat(formData.yearlyPrice) || 0;
      
      if (monthly === 0 && quarterly === 0 && yearly === 0) {
        setError('Please set at least one pricing option');
        setLoading(false);
        return;
      }
      
      // Prepare data for submission
      const submitData = {
        serviceName: formData.serviceName.trim(),
        description: formData.description.trim(),
        monthlyPrice: monthly,
        quarterlyPrice: quarterly,
        yearlyPrice: yearly,
      };
      
      console.log('Creating service:', submitData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Service created successfully!');
      
      // Redirect back to services list
      router.push('/super-admin/service');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
      console.error('Error creating service:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const formatNaira = (amount: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate savings
  const monthly = parseFloat(formData.monthlyPrice) || 0;
  const quarterly = parseFloat(formData.quarterlyPrice) || 0;
  const yearly = parseFloat(formData.yearlyPrice) || 0;
  
  const quarterlySavings = monthly > 0 ? (monthly * 3) - quarterly : 0;
  const yearlySavings = monthly > 0 ? (monthly * 12) - yearly : 0;

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Service</h1>
            <p className="text-gray-600">Add a new service with pricing options</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Form Header */}
            <div className="mb-8 flex items-center">
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
                <p className="text-sm text-gray-600">Fill in the service information and pricing</p>
              </div>
            </div>

            {/* Service Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Enter service name (e.g., Body Measurement, Questionnaire)"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors resize-none"
                placeholder="Describe what this service offers..."
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Pricing Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing Options</h3>
              <p className="text-sm text-gray-600 mb-6">
                Set pricing for different subscription periods. Leave blank or set to 0 if not offering a particular period.
              </p>

              <div className="space-y-6">
                {/* Monthly Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Price (₦)
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="monthlyPrice"
                        value={formData.monthlyPrice}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div className="ml-4 text-sm text-gray-500">
                      {formData.monthlyPrice && parseFloat(formData.monthlyPrice) > 0 ? (
                        <span className="font-medium text-gray-700">{formatNaira(formData.monthlyPrice)} per month</span>
                      ) : (
                        'No monthly subscription'
                      )}
                    </div>
                  </div>
                </div>

                {/* Quarterly Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quarterly Price (₦)
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="quarterlyPrice"
                        value={formData.quarterlyPrice}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div className="ml-4 text-sm">
                      {formData.quarterlyPrice && parseFloat(formData.quarterlyPrice) > 0 ? (
                        <div>
                          <span className="font-medium text-gray-700">{formatNaira(formData.quarterlyPrice)} per quarter</span>
                          {quarterlySavings > 0 && (
                            <div className="text-green-600">Save {formatNaira(quarterlySavings.toString())} vs monthly</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No quarterly subscription</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Yearly Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Yearly Price (₦)
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="yearlyPrice"
                        value={formData.yearlyPrice}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                        placeholder="0"
                      />
                    </div>
                    <div className="ml-4 text-sm">
                      {formData.yearlyPrice && parseFloat(formData.yearlyPrice) > 0 ? (
                        <div>
                          <span className="font-medium text-gray-700">{formatNaira(formData.yearlyPrice)} per year</span>
                          {yearlySavings > 0 && (
                            <div className="text-blue-600">Save {formatNaira(yearlySavings.toString())} vs monthly</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No yearly subscription</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            {(monthly > 0 || quarterly > 0 || yearly > 0) && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {monthly > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Monthly</p>
                      <p className="text-lg font-bold text-purple-600">{formatNaira(formData.monthlyPrice)}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  )}
                  {quarterly > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Quarterly</p>
                      <p className="text-lg font-bold text-green-600">{formatNaira(formData.quarterlyPrice)}</p>
                      <p className="text-xs text-gray-500">per quarter</p>
                      {quarterlySavings > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Save {formatNaira(quarterlySavings.toString())}
                        </p>
                      )}
                    </div>
                  )}
                  {yearly > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Yearly</p>
                      <p className="text-lg font-bold text-blue-600">{formatNaira(formData.yearlyPrice)}</p>
                      <p className="text-xs text-gray-500">per year</p>
                      {yearlySavings > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Save {formatNaira(yearlySavings.toString())}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

           
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;