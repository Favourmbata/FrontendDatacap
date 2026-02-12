"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import ServiceService from '@/services/ServiceService';
import { useAuthContext } from '@/AuthContext';

const EditServicePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthContext();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    monthlyPrice: '',
    quarterlyPrice: '',
    yearlyPrice: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch service data when component mounts
  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceService = new ServiceService(token);
        const serviceData = await serviceService.getServiceById(id as string);
        
        setFormData({
          serviceName: serviceData.serviceName,
          description: serviceData.description || '',
          monthlyPrice: serviceData.monthlyPrice.toString(),
          quarterlyPrice: serviceData.quarterlyPrice.toString(),
          yearlyPrice: serviceData.yearlyPrice.toString(),
        });
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
        console.error('Error loading service:', err);
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

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
      
      // Update service using ServiceService
      const serviceService = new ServiceService(token);
      await serviceService.updateService(id as string, submitData);
      
      // Show success message
      setSuccessMessage('Service updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      console.error('Error updating service:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const handleSuccessClose = () => {
    setSuccessMessage(null);
    router.push('/super-admin/service');
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

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Service</h1>
              <p className="text-gray-600">Update service information and pricing</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Service</h1>
            <p className="text-gray-600">Update service information and pricing</p>
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
                <p className="text-sm text-gray-600">Update the service information and pricing</p>
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
            {/* Removed pricing summary section as per requirements */}

           
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
              {loading ? 'Saving...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successMessage && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleSuccessClose}
        >
          <div 
            className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Success</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {successMessage}
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSuccessClose}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditServicePage;