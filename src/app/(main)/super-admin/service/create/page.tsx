


"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package, CheckSquare, Square, Settings, Users } from 'lucide-react';
import ServiceService, { type ModuleConfig, type ServiceLimits } from '@/services/ServiceService';
import { useAuthContext } from '@/AuthContext';

const CreateServicePage = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    monthlyPrice: '',
    quarterlyPrice: '',
    yearlyPrice: '',
    modules: [] as ModuleConfig[],
    limits: {
      maxBodyMeasurements: 0,
      maxOrgUsers: 0,
    } as ServiceLimits,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serviceNameError, setServiceNameError] = useState<string | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Available modules configuration
  const availableModules: ModuleConfig[] = [
    { moduleKey: 'body_measurements', moduleName: 'Body Measurements Management', isEnabled: false },
    { moduleKey: 'user_management', moduleName: 'User Management', isEnabled: false },
    { moduleKey: 'role_management', moduleName: 'Role Management', isEnabled: false },
    { moduleKey: 'group_management', moduleName: 'Group Management', isEnabled: false },
    { moduleKey: 'one_time_codes', moduleName: 'One-Time Code Management', isEnabled: false },
  ];

  // Debounced service name validation
  useEffect(() => {
    const validateServiceName = async () => {
      if (!formData.serviceName.trim()) {
        setServiceNameError('Service name is required');
        return;
      }

      setIsCheckingName(true);
      try {
        const serviceService = new ServiceService(token);
        const isUnique = await serviceService.validateServiceName(formData.serviceName.trim());
        
        if (!isUnique) {
          setServiceNameError('A service with this name already exists');
        } else {
          setServiceNameError(null);
        }
      } catch (error) {
        console.error('Error validating service name:', error);
        // Don't set error here, allow submission (server will validate)
      } finally {
        setIsCheckingName(false);
      }
    };

    const timer = setTimeout(() => {
      if (formData.serviceName.trim()) {
        validateServiceName();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.serviceName, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const toggleModule = (moduleKey: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.some(m => m.moduleKey === moduleKey)
        ? prev.modules.map(m => 
            m.moduleKey === moduleKey 
              ? { ...m, isEnabled: !m.isEnabled }
              : m
          )
        : [
            ...availableModules.map(m => 
              m.moduleKey === moduleKey 
                ? { ...m, isEnabled: true }
                : m
            )
          ].filter(m => m.isEnabled || m.moduleKey === moduleKey)
    }));
  };

  const updateLimit = (limitKey: keyof ServiceLimits, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limitKey]: numValue
      }
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

      // Check for duplicate before submission
      const serviceService = new ServiceService(token);
      const isUnique = await serviceService.validateServiceName(formData.serviceName.trim());
      
      if (!isUnique) {
        setError('A service with this name already exists');
        setServiceNameError('A service with this name already exists');
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
        modules: formData.modules.filter(m => m.isEnabled),
        limits: formData.limits,
      };
      
      // Create service using ServiceService
      await serviceService.createService(submitData);
      
      // Update timestamp to invalidate cache in list component
      localStorage.setItem('services_lastUpdated', Date.now().toString());
      
      // Show success message
      setSuccessMessage('Service created successfully!');
    } catch (err: any) {
      console.error('Error creating service:', err);
      
      // Handle duplicate error from API
      if (err.message?.toLowerCase().includes('already exists') || 
          err.message?.toLowerCase().includes('duplicate')) {
        setError('A service with this name already exists');
        setServiceNameError('A service with this name already exists');
      } else {
        setError(err.message || 'Failed to create service');
      }
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

            {/* Service Name with Duplicate Validation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                    serviceNameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter service name (e.g., Body Measurement, Questionnaire)"
                  required
                />
                {isCheckingName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              {serviceNameError && (
                <p className="mt-2 text-sm text-red-600">{serviceNameError}</p>
              )}
              {!serviceNameError && formData.serviceName && !isCheckingName && (
                <p className="mt-2 text-sm text-green-600">Service name is available</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter a unique name for the service
              </p>
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

            {/* Modules Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modules</h3>
              <p className="text-sm text-gray-600 mb-4">Select which modules this service will enable</p>
              
              <div className="space-y-3">
                {availableModules.map((module) => {
                  const isSelected = formData.modules.some(m => m.moduleKey === module.moduleKey && m.isEnabled);
                  return (
                    <div 
                      key={module.moduleKey}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                      onClick={() => toggleModule(module.moduleKey)}
                    >
                      <div className="flex items-center space-x-3">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900">{module.moduleName}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {isSelected ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Limits Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Limits</h3>
              <p className="text-sm text-gray-600 mb-4">Set usage limits for this service (enter 0 for unlimited)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Body Measurements
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.limits.maxBodyMeasurements || ''}
                      onChange={(e) => updateLimit('maxBodyMeasurements', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                      placeholder="0 (unlimited)"
                    />
                    <Settings className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.limits.maxBodyMeasurements === 0 ? 'Unlimited' : `${formData.limits.maxBodyMeasurements} measurements`}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Organization Users
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.limits.maxOrgUsers || ''}
                      onChange={(e) => updateLimit('maxOrgUsers', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                      placeholder="0 (unlimited)"
                    />
                    <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.limits.maxOrgUsers === 0 ? 'Unlimited' : `${formData.limits.maxOrgUsers} users`}
                  </p>
                </div>
              </div>
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
              disabled={loading || !!serviceNameError || isCheckingName}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Creating...' : 'Create Service'}
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

export default CreateServicePage;