"use client";

import React, { useState, useEffect } from 'react';
import ServiceService, { type ModuleConfig, type ServiceLimits } from '@/services/ServiceService';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Tag, DollarSign, FileText, Plus, X, Calendar, Percent, Gift, ShoppingBag, Building, Users, CheckSquare, Square } from 'lucide-react';
import SubscriptionService, { CreateSubscriptionPackageData } from '@/services/subscriptionService';

const CreateSubscriptionPage = () => {
  const router = useRouter();
  
  interface ServiceOption {
    id: string;
    name: string;
    monthlyPrice: number;
    quarterlyPrice: number;
    yearlyPrice: number;
    modules?: ModuleConfig[];
    limits?: ServiceLimits;
  }
  
  interface ExtendedSubscriptionData {
    title: string;
    description: string;
    features: string[];
    note?: string;
    featuresInput: string;
    services: Array<{
      id: string;
      name: string;
      monthlyPrice: number;
      quarterlyPrice: number;
      yearlyPrice: number;
      selectedCycle: 'monthly' | 'quarterly' | 'yearly';
      modules?: ModuleConfig[];
      limits?: ServiceLimits;
    }>;
    promoCode: string;
    discountPercentage: number;
    promoStartDate: string;
    promoEndDate: string;
    applyTo: {
      individual: boolean;
      industries: string[];
      categories: string[];
    };
    maxUsers: number;
    calculatedPrice: number;
    enabledModules: ModuleConfig[];
    aggregatedLimits: ServiceLimits;
  }
  
  const [availableServices, setAvailableServices] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [existingPackages, setExistingPackages] = useState<string[]>([]);
  const [checkingPackageName, setCheckingPackageName] = useState<boolean>(false);

  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState<boolean>(false);
  const [industriesSearch, setIndustriesSearch] = useState<string>('');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState<boolean>(false);
  const [categoriesSearch, setCategoriesSearch] = useState<string>('');
  
  const allIndustries = ['Fashion', 'Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Manufacturing', 'Transportation', 'Hospitality', 'Real Estate'];
  const allCategories = ['Basic', 'Professional', 'Enterprise', 'Startup', 'Premium', 'Standard', 'Essential', 'Advanced'];

  const [formData, setFormData] = useState<ExtendedSubscriptionData>({
    title: '',
    description: '',
    features: [],
    note: '',
    featuresInput: '',
    services: [],
    promoCode: '',
    discountPercentage: 0,
    promoStartDate: '',
    promoEndDate: '',
    applyTo: {
      individual: false,
      industries: [],
      categories: []
    },
    calculatedPrice: 0,
    maxUsers: 1,
    enabledModules: [],
    aggregatedLimits: {},
  });
    
  // Load available services and existing packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingServices(true);
        
        // Fetch services
        const serviceService = new ServiceService();
        const services = await serviceService.getAllServices();
        
        const serviceOptions: ServiceOption[] = services.map(service => ({
          id: service.id,
          name: service.serviceName,
          monthlyPrice: service.monthlyPrice,
          quarterlyPrice: service.quarterlyPrice,
          yearlyPrice: service.yearlyPrice,
        }));
          
        setAvailableServices(serviceOptions);
        
        // Fetch existing packages to check for unique names
        const packages = await SubscriptionService.getAllSubscriptionPackages();
        const packageNames = packages.map(pkg => pkg.title.toLowerCase());
        setExistingPackages(packageNames);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setAvailableServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
      
    fetchData();
  }, []);
    
  // Aggregate modules and limits from selected services
  useEffect(() => {
    // Aggregate all enabled modules from selected services
    const allModules: ModuleConfig[] = [];
    const aggregatedLimits: ServiceLimits = {};
    
    formData.services.forEach(service => {
      // Collect modules
      if (service.modules && service.modules.length > 0) {
        service.modules.forEach(module => {
          if (module.isEnabled && !allModules.some(m => m.moduleKey === module.moduleKey)) {
            allModules.push(module);
          }
        });
      }
      
      // Aggregate limits (take maximum value for each limit type)
      if (service.limits) {
        Object.entries(service.limits).forEach(([key, value]) => {
          if (value !== undefined) {
            const currentLimit = aggregatedLimits[key as keyof ServiceLimits] || 0;
            aggregatedLimits[key as keyof ServiceLimits] = Math.max(currentLimit, value) as never;
          }
        });
      }
    });
    
    setFormData(prev => ({
      ...prev,
      enabledModules: allModules,
      aggregatedLimits: aggregatedLimits
    }));
  }, [formData.services]);

  // Calculate the total price based on selected services and discount
  useEffect(() => {
    const totalPrice = formData.services.reduce((sum, service) => {
      if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
      if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
      return sum + service.yearlyPrice;
    }, 0);
      
    const discountAmount = formData.discountPercentage 
      ? (totalPrice * formData.discountPercentage) / 100 
      : 0;
    const finalPrice = totalPrice - discountAmount;
      
    setFormData(prev => ({
      ...prev,
      calculatedPrice: finalPrice
    }));
  }, [formData.services, formData.discountPercentage]);
    
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Date validation function
  const validateDates = (startDate: string, endDate: string): { isValid: boolean; startError?: string; endError?: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = { isValid: true, startError: undefined as string | undefined, endError: undefined as string | undefined };
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      if (start < today) {
        result.isValid = false;
        result.startError = 'Start date cannot be in the past';
      }
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      
      if (end < today) {
        result.isValid = false;
        result.endError = 'End date cannot be in the past';
      }
    }
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      if (start > end) {
        result.isValid = false;
        result.endError = 'End date must be after start date';
      }
    }
    
    return result;
  };

  // Package name uniqueness validation
  const validatePackageName = async (name: string): Promise<string | null> => {
    if (!name.trim()) return 'Package title is required';
    if (name.length < 2) return 'Package title must be at least 2 characters';
    if (name.length > 100) return 'Package title must not exceed 100 characters';
    
    // Check if name already exists (case-insensitive)
    const nameLower = name.toLowerCase();
    if (existingPackages.includes(nameLower)) {
      return 'This package title already exists. Please use a unique name.';
    }
    
    return null;
  };

  const validateTitle = (title: string): string | null => {
    if (!title.trim()) return 'Title is required';
    if (title.length < 2) return 'Title must be at least 2 characters';
    if (title.length > 100) return 'Title must not exceed 100 characters';
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

  const validatePromoCode = (promoCode: string): string | null => {
    if (promoCode && !/^[A-Za-z0-9_-]{3,20}$/.test(promoCode)) {
      return 'Promo code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores';
    }
    return null;
  };

  const validateDiscount = (discount: number): string | null => {
    if (discount < 0 || discount > 100) return 'Discount must be between 0 and 100 percent';
    return null;
  };

  const validatePromoDates = (startDate: string, endDate: string): string | null => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      if (start > end) return 'Start date must be before end date';
      if (start < today) return 'Start date cannot be in the past';
      if (end < today) return 'End date cannot be in the past';
    }
    return null;
  };

  const validateMaxUsers = (maxUsers: number): string | null => {
    if (maxUsers <= 0) return 'Maximum users must be greater than 0';
    if (maxUsers > 10000) return 'Maximum users cannot exceed 10,000';
    return null;
  };

  const validateApplyTo = (applyTo: { individual: boolean; industries: string[]; categories: string[] }): string | null => {
    // ApplyTo is not required, so always return null
    return null;
  };

  const validateForm = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};
    
    // Validate package name uniqueness
    const packageNameError = await validatePackageName(formData.title);
    if (packageNameError) errors.title = packageNameError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;
    
    const featuresError = validateFeatures(formData.features);
    if (featuresError) errors.features = featuresError;
    
    // Validate services
    if (formData.services.length === 0) {
      errors.services = 'At least one service is required';
    } else {
      formData.services.forEach((service, index) => {
        if (!service.id) {
          errors[`service-${index}`] = `Service ${index + 1} must have a valid service ID`;
        }
        if (!service.selectedCycle) {
          errors[`service-${index}`] = `Service ${index + 1} must have a duration selected`;
        }
      });
    }
    
    // Validate new fields
    const promoCodeError = validatePromoCode(formData.promoCode);
    if (promoCodeError) errors.promoCode = promoCodeError;
    
    const discountError = validateDiscount(formData.discountPercentage);
    if (discountError) errors.discountPercentage = discountError;
    
    // Validate dates
    const dateValidation = validateDates(formData.promoStartDate, formData.promoEndDate);
    if (dateValidation.startError) {
      errors.promoStartDate = dateValidation.startError;
    }
    if (dateValidation.endError) {
      errors.promoEndDate = dateValidation.endError;
    }
    
    const maxUsersError = validateMaxUsers(formData.maxUsers);
    if (maxUsersError) errors.maxUsers = maxUsersError;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle title change with uniqueness check
  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      title: value
    }));
    
    // Clear previous title error
    if (fieldErrors.title) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
    
    // Check uniqueness in real-time (with debounce)
    if (value.trim().length >= 2) {
      setCheckingPackageName(true);
      
      // Simulate debounce
      setTimeout(async () => {
        const error = await validatePackageName(value);
        if (error) {
          setFieldErrors(prev => ({
            ...prev,
            title: error
          }));
        }
        setCheckingPackageName(false);
      }, 500);
    }
  };

  // Handle features input
  const addFeature = () => {
    const feature = formData.featuresInput.trim();
    if (feature) {
      // Check for duplicates
      if (formData.features.includes(feature)) {
        setFieldErrors(prev => ({
          ...prev,
          features: 'This feature already exists'
        }));
        return;
      }
      
      const newFeatures = [...formData.features, feature];
      setFormData(prev => ({
        ...prev,
        features: newFeatures,
        featuresInput: ''
      }));
      
      // Clear error if exists
      if (fieldErrors.features) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.features;
          return newErrors;
        });
      }
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.featuresInput.trim()) {
      e.preventDefault();
      addFeature();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate dates in real-time
    const newFormData = { ...formData, [name]: value };
    const dateValidation = validateDates(
      name === 'promoStartDate' ? value : newFormData.promoStartDate,
      name === 'promoEndDate' ? value : newFormData.promoEndDate
    );
    
    // Clear previous date errors
    const newErrors = { ...fieldErrors };
    delete newErrors.promoStartDate;
    delete newErrors.promoEndDate;
    
    // Add new errors if any
    if (dateValidation.startError) {
      newErrors.promoStartDate = dateValidation.startError;
    }
    if (dateValidation.endError) {
      newErrors.promoEndDate = dateValidation.endError;
    }
    
    setFieldErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validation before submitting
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Calculate total service cost based on selected cycles
      const totalServiceCost = formData.services.reduce((sum, service) => {
        if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
        if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
        return sum + service.yearlyPrice;
      }, 0);
      
      // Apply discount if applicable
      const discountAmount = formData.discountPercentage 
        ? (totalServiceCost * formData.discountPercentage) / 100 
        : 0;
      const finalPriceAfterDiscount = totalServiceCost - discountAmount;
      
      
      const formattedData: CreateSubscriptionPackageData = {
        title: formData.title,
        description: formData.description,
        services: formData.services.map(service => ({
          serviceId: service.id,
          serviceName: service.name,
          duration: service.selectedCycle,
          price: service.selectedCycle === 'monthly' ? service.monthlyPrice : 
                 service.selectedCycle === 'quarterly' ? service.quarterlyPrice : 
                 service.yearlyPrice,
          modules: service.modules || [],
          limits: service.limits || {}
        })),
        totalServiceCost: totalServiceCost,
        promoCode: formData.promoCode,
        discountPercentage: formData.discountPercentage,
        promoStartDate: formData.promoStartDate,
        promoEndDate: formData.promoEndDate,
        discountAmount: discountAmount,
        finalPriceAfterDiscount: finalPriceAfterDiscount,
        features: formData.features,
        maxUsers: formData.maxUsers,
        note: formData.note,
        isActive: true,
        createdBy: "", // This will be set by the backend
        enabledModules: formData.enabledModules,
        limits: formData.aggregatedLimits
      };
      
      // Create package using service
      await SubscriptionService.createSubscriptionPackage(formattedData);
      
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
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close industries dropdown if clicked outside
      if (showIndustriesDropdown && !target.closest('.industries-dropdown-container')) {
        setShowIndustriesDropdown(false);
      }
      
      // Close categories dropdown if clicked outside
      if (showCategoriesDropdown && !target.closest('.categories-dropdown-container')) {
        setShowCategoriesDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIndustriesDropdown, showCategoriesDropdown]);

  // Format price display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Subscription Package</h1>
            <p className="text-gray-600">Add a new subscription package with features and pricing</p>
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
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Package Details</h2>
                <p className="text-sm text-gray-600">Basic information about the subscription</p>
              </div>
            </div>

            {/* Title with Uniqueness Validation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                    fieldErrors.title ? 'border-red-500' : formData.title && !fieldErrors.title && formData.title.length >= 2 ? 'border-green-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter package title (e.g., Premium Plan, Business Suite)"
                  required
                />
                {checkingPackageName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {fieldErrors.title && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.title}</p>
              )}
              {!fieldErrors.title && formData.title && !checkingPackageName && formData.title.length >= 2 && (
                <p className="mt-2 text-sm text-green-600">Package name is available</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Package title must be unique and at least 2 characters long
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
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
                {formData.description.length} characters (minimum 10)
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>
           <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                  <p className="text-sm text-gray-600">Add services included in this subscription package</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Service Selection Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service
                  </label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    onChange={(e) => {
                      const selectedServiceId = e.target.value;
                      if (selectedServiceId && !formData.services.some(s => s.id === selectedServiceId)) {
                        const selectedService = availableServices.find(service => service.id === selectedServiceId);
                        if (selectedService) {
                          setFormData(prev => ({
                            ...prev,
                            services: [...prev.services, {
                              ...selectedService,
                              modules: selectedService.modules || [],
                              limits: selectedService.limits || {},
                              selectedCycle: 'monthly'
                            }]
                          }));
                        }
                      }
                    }}
                    value=""
                    disabled={loadingServices}
                  >
                    <option value="">Select a service to add...</option>
                    {loadingServices ? (
                      <option>Loading services...</option>
                    ) : (
                      availableServices.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Services List */}
                {formData.services.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Added Services ({formData.services.length})</h4>
                    <div className="space-y-3">
                      {formData.services.map((service, index) => (
                        <div key={`${service.id}-${index}`} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex-1 mb-2 md:mb-0">
                            <h5 className="font-medium text-gray-900">{service.name}</h5>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <div>
                                <span className="text-xs text-gray-500">Monthly</span>
                                <p className="text-sm font-medium">₦{service.monthlyPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Quarterly</span>
                                <p className="text-sm font-medium">₦{service.quarterlyPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Yearly</span>
                                <p className="text-sm font-medium">₦{service.yearlyPrice.toLocaleString()}</p>
                              </div>
                            </div>
                            {fieldErrors[`service-${index}`] && (
                              <p className="mt-2 text-sm text-red-600">{fieldErrors[`service-${index}`]}</p>
                            )}
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <select 
                              className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                                fieldErrors[`service-${index}`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              value={service.selectedCycle}
                              onChange={(e) => {
                                const newServices = [...formData.services];
                                newServices[index].selectedCycle = e.target.value as 'monthly' | 'quarterly' | 'yearly';
                                setFormData(prev => ({
                                  ...prev,
                                  services: newServices
                                }));
                                // Clear error when user updates selection
                                if (fieldErrors[`service-${index}`]) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors[`service-${index}`];
                                    return newErrors;
                                  });
                                }
                              }}
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newServices = formData.services.filter((_, i) => i !== index);
                                setFormData(prev => ({
                                  ...prev,
                                  services: newServices
                                }));
                              }}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calculate and Display Total Cost */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total Service Cost:</span>
                        <span>₦{formData.services.reduce((sum, service) => {
                          if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
                          if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
                          return sum + service.yearlyPrice;
                        }, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                {fieldErrors.services && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.services}</p>
                )}
              </div>
            </div>
            {/* Pricing Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
               
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
                  <p className="text-sm text-gray-600">Set the subscription price</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Calculated Subscription Price (₦)
                </label>
                <div className="flex items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="calculatedPrice"
                      value={formData.calculatedPrice || ''}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                      placeholder="Calculated automatically"
                      readOnly
                    />
                  </div>
                  <div className="ml-4 text-lg font-semibold text-green-600">
                    {formData.calculatedPrice > 0 ? formatCurrency(formData.calculatedPrice) : 'Calculated automatically'}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Price is calculated based on selected services and applied discounts
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Features Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Features *</h3>
                  <p className="text-sm text-gray-600">Add features included in this subscription package</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Feature
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.featuresInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuresInput: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                        fieldErrors.features ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter a feature and press Enter or click Add"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {fieldErrors.features && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.features}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Press Enter or click Add to add the feature
                </p>
              </div>
              
              {/* Features List */}
              {formData.features.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Added Features ({formData.features.length})
                    </h4>
                    <span className="text-xs text-gray-500">Click × to remove</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <span className="text-gray-800">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove feature"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No features added yet</p>
                  <p className="text-sm text-gray-500">
                    Add features that users will get with this subscription
                  </p>
                </div>
              )}
            </div>

            {/* Note Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Users
              </label>
              <input
                type="number"
                name="maxUsers"
                value={formData.maxUsers}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setFormData(prev => ({ ...prev, maxUsers: value }));
                  if (fieldErrors.maxUsers) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.maxUsers;
                      return newErrors;
                    });
                  }
                }}
                min="1"
                max="10000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors ${
                  fieldErrors.maxUsers ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter maximum number of users"
              />
              {fieldErrors.maxUsers && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.maxUsers}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum number of users allowed for this subscription
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                placeholder="Any additional information, terms, or conditions..."
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be displayed to users before they subscribe
              </p>
            </div>

            

            {/* Promo Code & Discount Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Promo Code & Discount</h3>
                  <p className="text-sm text-gray-600">Apply promotional codes and discounts to this subscription</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, promoCode: e.target.value }))}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                        fieldErrors.promoCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter promo code"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Generate a random promo code
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                        let result = '';
                        for (let i = 0; i < 8; i++) {
                          result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        setFormData(prev => ({ ...prev, promoCode: result }));
                      }}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  {fieldErrors.promoCode && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.promoCode}</p>
                  )}
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage || ''}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setFormData(prev => ({ ...prev, discountPercentage: value }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                      fieldErrors.discountPercentage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0-100%"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter discount percentage (0-100%)</p>
                  {fieldErrors.discountPercentage && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.discountPercentage}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="promoStartDate"
                      value={formData.promoStartDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                        fieldErrors.promoStartDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {fieldErrors.promoStartDate && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.promoStartDate}</p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="promoEndDate"
                      value={formData.promoEndDate}
                      onChange={handleDateChange}
                      min={formData.promoStartDate || new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                        fieldErrors.promoEndDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {fieldErrors.promoEndDate && (
                    <p className="mt-2 text-sm text-red-600">{fieldErrors.promoEndDate}</p>
                  )}
                </div>
              </div>

             
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-3">Price Calculation</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm text-[#1A1A1A]">Original Price</p>
                    <p className="text-lg font-semibold text-gray-900">₦{formData.services.reduce((sum, service) => {
                      if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
                      if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
                      return sum + service.yearlyPrice;
                    }, 0).toLocaleString()}</p>
                  </div>
                  
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm text-[#1A1A1A]">Discount Amount</p>
                    <p className="text-lg font-semibold text-[#1A1A1A]">-₦{Math.round((formData.services.reduce((sum, service) => {
                      if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
                      if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
                      return sum + service.yearlyPrice;
                    }, 0) * formData.discountPercentage) / 100).toLocaleString()}</p>
                  </div>
                  
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm text-[#1A1A1A]">Final Price After Discount</p>
                    <p className="text-lg font-semibold text-green-700">₦{Math.max(0, Math.round(formData.services.reduce((sum, service) => {
                      if (service.selectedCycle === 'monthly') return sum + service.monthlyPrice;
                      if (service.selectedCycle === 'quarterly') return sum + service.quarterlyPrice;
                      return sum + service.yearlyPrice;
                    }, 0) * (1 - formData.discountPercentage / 100))).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply To Options Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Apply To</h3>
                  <p className="text-sm text-gray-600">Specify who this subscription is available to</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Individual Option */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applyTo.individual}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        applyTo: {
                          ...prev.applyTo,
                          individual: e.target.checked
                        }
                      }))}
                      className="h-5 w-5 text-purple-600 rounded focus:ring-purple-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Individual</p>
                      <p className="text-sm text-gray-600">Available to all individual users</p>
                    </div>
                  </label>
                </div>

                {/* Industries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Industries
                  </label>
                  <div className="relative industries-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowIndustriesDropdown(!showIndustriesDropdown)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-left flex justify-between items-center"
                    >
                      <span>
                        {formData.applyTo.industries.length === 0
                          ? 'Select industries...'
                          : `${formData.applyTo.industries.length} industry${formData.applyTo.industries.length !== 1 ? 's' : ''} selected`}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${showIndustriesDropdown ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showIndustriesDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search industries..."
                              value={industriesSearch}
                              onChange={(e) => setIndustriesSearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {allIndustries
                              .filter(industry => 
                                industry.toLowerCase().includes(industriesSearch.toLowerCase())
                              )
                              .map(industry => (
                                <label 
                                  key={industry} 
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.applyTo.industries.includes(industry)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      
                                      let newIndustries;
                                      
                                      if (isChecked) {
                                        newIndustries = [...formData.applyTo.industries, industry];
                                      } else {
                                        newIndustries = formData.applyTo.industries.filter(i => i !== industry);
                                      }
                                      
                                      setFormData(prev => ({
                                        ...prev,
                                        applyTo: {
                                          ...prev.applyTo,
                                          industries: newIndustries
                                        }
                                      }));
                                    }}
                                    className="h-4 w-4 text-purple-600 rounded focus:ring-purple-600 mr-3"
                                  />
                                  <span className="text-gray-700">{industry}</span>
                                </label>
                              ))}
                          </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categories
                  </label>
                  <div className="relative categories-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-left flex justify-between items-center"
                    >
                      <span>
                        {formData.applyTo.categories.length === 0
                          ? 'Select categories...'
                          : `${formData.applyTo.categories.length} category${formData.applyTo.categories.length !== 1 ? 's' : ''} selected`}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showCategoriesDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search categories..."
                              value={categoriesSearch}
                              onChange={(e) => setCategoriesSearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {allCategories
                              .filter(category => 
                                category.toLowerCase().includes(categoriesSearch.toLowerCase())
                              )
                              .map(category => (
                                <label 
                                  key={category} 
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.applyTo.categories.includes(category)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      let newCategories;
                                      
                                      if (isChecked) {
                                        newCategories = [...formData.applyTo.categories, category];
                                      } else {
                                        newCategories = formData.applyTo.categories.filter(c => c !== category);
                                      }
                                      
                                      setFormData(prev => ({
                                        ...prev,
                                        applyTo: {
                                          ...prev.applyTo,
                                          categories: newCategories
                                        }
                                      }));
                                    }}
                                    className="h-4 w-4 text-purple-600 rounded focus:ring-purple-600 mr-3"
                                  />
                                  <span className="text-gray-700">{category}</span>
                                </label>
                              ))}
                          </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Selected Options:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.applyTo.individual && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Individual
                      </span>
                    )}
                    {formData.applyTo.industries.map(industry => (
                      <span key={industry} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Industry: {industry}
                      </span>
                    ))}
                    {formData.applyTo.categories.map(category => (
                      <span key={category} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Category: {category}
                      </span>
                    ))}
                    {!formData.applyTo.individual && formData.applyTo.industries.length === 0 && formData.applyTo.categories.length === 0 && (
                      <span className="text-sm text-gray-500 italic">No options selected yet</span>
                    )}
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
              disabled={loading || checkingPackageName || Object.keys(fieldErrors).some(key => key.includes('promo') || key === 'title')}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        </form>
        

      </div>
    </div>
  );
};

export default CreateSubscriptionPage;