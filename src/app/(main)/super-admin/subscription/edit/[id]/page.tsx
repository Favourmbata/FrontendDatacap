"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import SubscriptionService, { SubscriptionPackage, CreateSubscriptionPackageData } from '@/services/subscriptionService';

// Update interface to extend SubscriptionPackage with featuresInput
interface ExtendedSubscriptionPackage extends SubscriptionPackage {
  featuresInput?: string;
}

const EditSubscriptionPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<ExtendedSubscriptionPackage | null>(null);
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Get params.id using React.use()
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      loadPackageData();
    }
  }, [id]);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const foundPackage = await SubscriptionService.getSubscriptionPackageById(id);
      
      // Transform the package data to include featuresInput
      const transformedPackage: ExtendedSubscriptionPackage = {
        ...foundPackage,
        featuresInput: '' // Initialize empty for the form
      };
      
      setPackageData(transformedPackage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription package');
      console.error('Error loading package:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateTitle = (title: string): string | null => {
    if (!title.trim()) return 'Title is required';
    if (title.length < 2) return 'Title must be at least 2 characters';
    if (title.length > 100) return 'Title must not exceed 100 characters';
    return null;
  };

  const validatePrice = (price: number): string | null => {
    if (price <= 0) return 'Price must be a positive number';
    if (price > 1000000) return 'Price is too high';
    return null;
  };

  const validateDescription = (description: string): string | null => {
    if (!description.trim()) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters';
    return null;
  };

  const validateFeatures = (features: string[]): string | null => {
    if (features.length === 0) return 'At least one feature is required';
    if (features.some(f => f.length > 200)) return 'Feature must not exceed 200 characters';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (packageData) {
      const titleError = validateTitle(packageData.title);
      if (titleError) errors.title = titleError;
      
      const descriptionError = validateDescription(packageData.description);
      if (descriptionError) errors.description = descriptionError;
      
      const priceError = validatePrice(packageData.price);
      if (priceError) errors.price = priceError;
      
      const featuresError = validateFeatures(packageData.features);
      if (featuresError) errors.features = featuresError;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!packageData) return;
    
    const { name, value } = e.target;
    
    // Skip updating services field since it's read-only
    if (name === 'services') {
      return;
    }
    
    if (name === 'price') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setPackageData(prev => prev ? {
        ...prev,
        price: isNaN(numValue) ? 0 : numValue
      } : null);
    } else if (name === 'discountPercentage') {
      if (value === '') {
        setPackageData(prev => prev ? {
          ...prev,
          discountPercentage: undefined
        } : null);
      } else {
        const numValue = parseFloat(value);
        setPackageData(prev => prev ? {
          ...prev,
          discountPercentage: isNaN(numValue) ? undefined : numValue
        } : null);
      }
    } else if (['totalServiceCost', 'discountAmount', 'finalPriceAfterDiscount'].includes(name)) {
      if (value === '') {
        setPackageData(prev => prev ? {
          ...prev,
          [name]: undefined
        } : null);
      } else {
        const numValue = parseFloat(value);
        setPackageData(prev => prev ? {
          ...prev,
          [name]: isNaN(numValue) ? undefined : numValue
        } : null);
      }
    } else {
      setPackageData(prev => prev ? {
        ...prev,
        [name]: value
      } : null);
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

  const handleFeaturesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!packageData) return;
    
    const { value } = e.target;
    setPackageData(prev => prev ? {
      ...prev,
      featuresInput: value
    } : null);
  };

  const addFeature = () => {
    if (!packageData || !packageData.featuresInput?.trim()) return;
    
    const feature = packageData.featuresInput.trim();
    
    // Check for duplicates
    if (packageData.features.includes(feature)) {
      setFieldErrors(prev => ({
        ...prev,
        features: 'This feature already exists'
      }));
      return;
    }
    
    const newFeatures = [...packageData.features, feature];
    setPackageData(prev => prev ? {
      ...prev,
      features: newFeatures,
      featuresInput: ''
    } : null);
    
    // Clear error if exists
    if (fieldErrors.features) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  const removeFeature = (index: number) => {
    if (!packageData) return;
    
    const newFeatures = packageData.features.filter((_, i) => i !== index);
    setPackageData(prev => prev ? {
      ...prev,
      features: newFeatures
    } : null);
  };

  const handleFeaturesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && packageData?.featuresInput?.trim()) {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageData || !id) return;
    
    // Run validation before submitting
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare update data - only include fields that your API accepts
      const updateData: CreateSubscriptionPackageData = {
        title: packageData.title,
        description: packageData.description,
        features: packageData.features,
        note: packageData.note || '',
        services: packageData.services ? packageData.services.map(service => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          duration: service.duration,
          price: service.price
        })) : [],
        promoCode: packageData.promoCode,
        discountPercentage: packageData.discountPercentage,
        promoStartDate: packageData.promoStartDate,
        promoEndDate: packageData.promoEndDate,
        totalServiceCost: packageData.totalServiceCost || 0,
        discountAmount: packageData.discountAmount || 0,
        finalPriceAfterDiscount: packageData.finalPriceAfterDiscount || 0,
        maxUsers: packageData.maxUsers || 100, // Default value if not set
        isActive: packageData.isActive !== undefined ? packageData.isActive : true, // Default to active
        createdBy: packageData.createdBy || 'admin' // Default creator
      };
      
      // Update package using service
      await SubscriptionService.updateSubscriptionPackage(id, updateData);
      
      // Redirect back to subscription list
      router.push('/super-admin/subscription');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription package');
      console.error('Error updating package:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !packageData) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Loading Package</h1>
              <p className="text-gray-600">Please wait while we load the subscription package details.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Error Loading Package</h1>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={loadPackageData}
                className="mt-4 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Package Not Found</h1>
              <p className="text-gray-600">The subscription package doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Subscription Package</h1>
            <p className="text-gray-600">Update the subscription package details</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* Form Header */}
            <div className="mb-8 flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Package Details</h2>
                <p className="text-sm text-gray-600">Update basic information about the subscription</p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                name="title"
                value={packageData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                  fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter package title"
                required
              />
              {fieldErrors.title && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={packageData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                  fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what this subscription package offers..."
                required
              />
              {fieldErrors.description && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {packageData.description.length} characters (minimum 10)
              </p>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                name="note"
                value={packageData.note || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Additional notes about this subscription package..."
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Features Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Features *</h3>
                  <p className="text-sm text-gray-600">Update features included in this package</p>
                </div>
              </div>

              {/* Feature Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Feature
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={packageData.featuresInput || ''}
                      onChange={handleFeaturesInputChange}
                      onKeyDown={handleFeaturesKeyDown}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                        fieldErrors.features ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter a feature and press Enter or click Add"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors"
                  >
                    Add
                  </button>
                </div>
                {fieldErrors.features && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.features}</p>
                )}
              </div>

              {/* Features List */}
              {packageData.features.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Features ({packageData.features.length})
                    </h4>
                    <span className="text-xs text-gray-500">Click × to remove</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {packageData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-800">{feature}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove feature"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No features added yet</p>
                  <p className="text-sm text-gray-500">
                    Add features that users will get with this subscription
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Pricing Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                  <p className="text-sm text-gray-600">Update subscription pricing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={packageData.price || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                      fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {fieldErrors.price && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.price}</p>
                  )}
                  <p className="text-sm text-green-600 font-medium">
                    {packageData.price > 0 ? formatCurrency(packageData.price) : 'Set price'}
                  </p>
                </div>

                {/* Discount Percentage */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={packageData.discountPercentage || ''}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="0-100%"
                  />
                  <p className="text-sm text-gray-500">Enter discount percentage (0-100%)</p>
                </div>
              </div>
              
              {/* Additional Pricing Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Service Cost</label>
                  <input
                    type="number"
                    name="totalServiceCost"
                    value={packageData.totalServiceCost || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total cost of all services</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={packageData.discountAmount || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Calculated discount amount</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Final Price After Discount</label>
                  <input
                    type="number"
                    name="finalPriceAfterDiscount"
                    value={packageData.finalPriceAfterDiscount || ''}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Final price after discount</p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                  <p className="text-sm text-gray-600">Services included in this subscription package (read-only)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Services Included
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100">
                  {packageData.services && packageData.services.length > 0 ? (
                    <div className="space-y-2">
                      {packageData.services.map((service, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-white rounded border">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                            
                            <div>
                              <span className="text-gray-700 font-medium text-sm">Service Name:</span>
                              <p className="text-gray-900 text-sm">
                                {service.serviceName}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-700 font-medium text-sm">Duration:</span>
                              <p className="text-gray-900 capitalize text-sm">
                                {service.duration}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-700 font-medium text-sm">Price:</span>
                              <p className="text-gray-900 text-sm font-medium">
                                {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No services assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Promo Period Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Promo Period (Optional)</h3>
                  <p className="text-sm text-gray-600">Set promotion dates for this package</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Promo Start Date
                  </label>
                  <input
                    type="date"
                    name="promoStartDate"
                    value={packageData.promoStartDate || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Promo End Date
                  </label>
                  <input
                    type="date"
                    name="promoEndDate"
                    value={packageData.promoEndDate || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                  />
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
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Updating...' : 'Update Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionPage;