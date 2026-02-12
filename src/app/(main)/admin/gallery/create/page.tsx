



"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Image as ImageIcon, Video, Calendar, DollarSign, Tag, Check, Briefcase, Package, AlertCircle } from 'lucide-react';

import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';

interface FormData {
  name: string; 
  description: string;
  industryId: string;
  categoryId: string;
  category: string;
  itemType: 'product' | 'service';
  sku: string;
  upc: string;
  platformUniqueCode: string;
  totalAvailableQuantity: number;
  priceInNaira: number; // Changed from priceInDollars
  discountPercentage: number;
  upfrontPaymentPercentage: number;
  platformChargePercentage: number;
  platformCommissionId?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic: boolean;
  notes: string;
  locationIndex: number;
}

interface Industry {
  value: string;
  label: string;
}

interface Category {
  id: string;
  name: string;
}

interface PlatformCommission {
  id: string;
  commissionName: string;
  commissionRate: number;
  industryId: string;
  categoryId: string;
}

interface PlatformCodePreview {
  platformUniqueCode: string;
  orgProductNumber: string;
  globalProductNumber: string;
}

const CreateGalleryItemPage = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  
  // State for cascading dropdowns
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [platformCodePreview, setPlatformCodePreview] = useState<PlatformCodePreview | null>(null);
  const [platformCommission, setPlatformCommission] = useState<PlatformCommission | null>(null);
  
  // Loading states
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingCommission, setLoadingCommission] = useState(false);
  const [loadingCodePreview, setLoadingCodePreview] = useState(true);


  const [commissionError, setCommissionError] = useState<string | null>(null);
const [commissionLoading, setCommissionLoading] = useState(false);

  const [locations, setLocations] = useState<Array<{
    value: number;
    label: string;
    disabled: boolean;
    brandName: string;
    cityRegion: string;
    status: string;
    isPaidFor: boolean;
    verificationStatus: string;
  }>>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    industryId: '',
    categoryId: '',
    category: '',
    itemType: 'product',
    sku: '',
    upc: '',
    platformUniqueCode: '',
    totalAvailableQuantity: 0,
    priceInNaira: 0,
    discountPercentage: 0,
    upfrontPaymentPercentage: 0,
    platformChargePercentage: 0,
    startDate: '', 
    startTime: '',
    endDate: '', 
    endTime: '',
    visibilityToPublic: true,
    notes: '',
    locationIndex: 0
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [mediaLimits, setMediaLimits] = useState<{
    images: { current: number; max: number; remaining: number };
    videos: { current: number; max: number; remaining: number };
    verified: boolean;
  } | null>(null);

  // Fetch industries on mount
  useEffect(() => {
    const fetchIndustries = async () => {
      if (!token) return;
      
      try {
        setLoadingIndustries(true);
        const result = await GalleryService.getIndustries(token);
        
        if (result.success && result.data?.industries) {
          const industriesList = result.data.industries.map(ind => ({
            value: ind.id,
            label: ind.name
          }));
          setIndustries(industriesList);
        } else {
          setIndustries([]);
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        setIndustries([]);
      } finally {
        setLoadingIndustries(false);
      }
    };

    fetchIndustries();
  }, [token]);

  // Load locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      if (!token) return;
      
      try {
        setLoadingLocations(true);
        const locationsList = await GalleryService.getLocationsForSelect(token);
        setLocations(locationsList);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [token]);


useEffect(() => {
  const fetchPlatformCodePreview = async () => {
    if (!token) return;
    
    try {
      setLoadingCodePreview(true);
      const result = await GalleryService.getPlatformCodePreview(token);
      
     
      if (result.success && result.data) {
        const previewData = result.data as PlatformCodePreview;
        setPlatformCodePreview(previewData);
        setFormData(prev => ({
          ...prev,
          platformUniqueCode: previewData.platformUniqueCode
        }));
      }
    } catch (error) {
      console.error('Error fetching platform code preview:', error);
    } finally {
      setLoadingCodePreview(false);
    }
  };

  fetchPlatformCodePreview();
}, [token]);
 
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token || !formData.industryId) {
        setCategories([]);
        return;
      }
      
      try {
        setLoadingCategories(true);
        const result = await GalleryService.getCategoriesByIndustry(token, formData.industryId);
        
        if (result.success && result.data?.categories) {
          const transformedCategories = result.data.categories.map((cat: { id: any; name: any; }) => ({
            id: cat.id,
            name: cat.name
          }));
          setCategories(transformedCategories);
        } else {
          setCategories([]);
        }
        
        setFormData(prev => ({ 
          ...prev, 
          categoryId: '', 
          category: '',
          platformChargePercentage: 0,
          platformCommissionId: undefined 
        }));
        setPlatformCommission(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token, formData.industryId]);

  // Fetch platform commission when category is selected
  useEffect(() => {
    const fetchPlatformCommission = async () => {
      if (!token || !formData.categoryId) {
        setPlatformCommission(null);
        setFormData(prev => ({ ...prev, platformChargePercentage: 0, platformCommissionId: undefined }));
        return;
      }
      
      try {
        setLoadingCommission(true);
        const result = await GalleryService.getPlatformCommissionByCategory(token, formData.categoryId);
        
        if (result.success && result.data?.commission) {
          const commission = result.data.commission;
          setPlatformCommission(commission);
          setFormData(prev => ({
            ...prev,
            platformChargePercentage: commission.commissionRate,
            platformCommissionId: commission.id
          }));
        }
      } catch (error) {
        console.error('Error fetching platform commission:', error);
      } finally {
        setLoadingCommission(false);
      }
    };

    fetchPlatformCommission();
  }, [token, formData.categoryId]);

  const checkMediaLimits = async () => {
    if (!token) return false;
    
    try {
      const result = await GalleryService.getMediaUsage(token);
      
      if (result.success && result.data) {
        const data = result.data;
        const usage = {
          images: {
            current: data.currentImages,
            max: data.maxImages,
            remaining: data.maxImages - data.currentImages
          },
          videos: {
            current: data.currentVideos,
            max: data.maxVideos,
            remaining: data.maxVideos - data.currentVideos
          },
          verified: data.isVerified
        };
        
        setMediaLimits(usage);
        return usage;
      }
    } catch (error) {
      console.error('Error checking media limits:', error);
    }
    
    return false;
  };

  // Remove default dates - they should be empty
  // No useEffect for default dates

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.industryId) {
      newErrors.industryId = 'Industry is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.itemType) {
      newErrors.itemType = 'Item type is required';
    }

    if (formData.priceInNaira <= 0) {
      newErrors.priceInNaira = 'Price must be greater than 0';
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'Discount must be between 0 and 100';
    }

    if (formData.upfrontPaymentPercentage < 0 || formData.upfrontPaymentPercentage > 100) {
      newErrors.upfrontPaymentPercentage = 'Upfront payment must be between 0 and 100';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!token) {
      setErrors({ general: 'Authentication required' });
      return;
    }

    // Check media limits before proceeding
    const limits = await checkMediaLimits();
    if (limits && images.length > limits.images.remaining) {
      setErrors({ images: `You only have ${limits.images.remaining} image slots available` });
      return;
    }
    if (limits && videos.length > limits.videos.remaining) {
      setErrors({ videos: `You only have ${limits.videos.remaining} video slots available` });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('Create page: Creating gallery item with data:', formData);
      
      // Get the selected category name
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      
      const result = await GalleryService.createGalleryItem(token, {
        name: formData.name,
        description: formData.description.trim(),
        category: selectedCategory?.name || formData.category,
        categoryId: formData.categoryId,
        industryId: formData.industryId,
        itemType: formData.itemType,
        sku: formData.sku || undefined,
        upc: formData.upc || undefined,
        platformUniqueCode: formData.platformUniqueCode || undefined,
        totalAvailableQuantity: Number(formData.totalAvailableQuantity) || 0,
        priceInDollars: Number(formData.priceInNaira) || 0, // Send as priceInDollars but value is NGN
        discountPercentage: Number(formData.discountPercentage) || 0,
        upfrontPaymentPercentage: Number(formData.upfrontPaymentPercentage) || 0,
        platformChargePercentage: formData.platformChargePercentage,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        visibilityToPublic: formData.visibilityToPublic,
        notes: formData.notes || undefined,
        locationIndex: Number(formData.locationIndex) || 0
      });

      if (result.success && result.data?._id) {
        // Upload images if any
        if (images.length > 0) {
          console.log('Create page: Uploading', images.length, 'images');
          for (const image of images) {
            await GalleryService.uploadImage(token, result.data._id, image);
          }
        }

        // Upload videos if any
        if (videos.length > 0) {
          console.log('Create page: Uploading', videos.length, 'videos');
          for (const video of videos) {
            await GalleryService.uploadVideo(token, result.data._id, video);
          }
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/gallery');
        }, 2000);
      } else {
        setErrors({ general: result.message || 'Failed to create gallery item' });
      }
    } catch (error: any) {
      console.error('Error creating gallery item:', error);
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const limits = await checkMediaLimits();
      if (limits && images.length + e.target.files.length > limits.images.remaining) {
        setErrors({ images: `You can only upload ${limits.images.remaining} more image(s)` });
        return;
      }

      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errorMessages: string[] = [];

      files.forEach(file => {
        const validation = GalleryService.validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errorMessages.push(`${file.name}: ${validation.message || 'Invalid image file'}`);
        }
      });

      if (errorMessages.length > 0) {
        setErrors({ images: errorMessages.join(', ') });
      }

      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const limits = await checkMediaLimits();
      if (limits && videos.length + e.target.files.length > limits.videos.remaining) {
        setErrors({ videos: `You can only upload ${limits.videos.remaining} more video(s)` });
        return;
      }

      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errorMessages: string[] = [];

      files.forEach(file => {
        const validation = GalleryService.validateVideoFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errorMessages.push(`${file.name}: ${validation.message || 'Invalid video file'}`);
        }
      });

      if (errorMessages.length > 0) {
        setErrors({ videos: errorMessages.join(', ') });
      }

      setVideos(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const calculateActualAmount = () => {
    return GalleryService.calculateActualAmount(
      formData.priceInNaira,
      formData.discountPercentage,
      formData.platformChargePercentage
    );
  };

  const calculateTotalWithUpfront = () => {
    const actual = calculateActualAmount();
    const upfront = (actual * (formData.upfrontPaymentPercentage || 0)) / 100;
    return {
      actual,
      upfront,
      remaining: actual - upfront
    };
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600">Gallery item created successfully.</p>
          <p className="text-gray-500 text-sm mt-2">Redirecting to gallery...</p>
        </div>
      </div>
    );
  }

  const totalCalculation = calculateTotalWithUpfront();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create Gallery Item</h1>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        {/* Platform Code Preview - Read Only */}
        {platformCodePreview && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
             
              <div className="flex-1">
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Platform Unique Code  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={platformCodePreview.platformUniqueCode}
                  readOnly
                  className="w-full px-3 py-2 bg-purple-100 border border-purple-300 rounded-lg text-purple-800 font-mono text-sm cursor-not-allowed"
                />
                {/* <p className="text-xs text-purple-600 mt-1">
                  This product will be #{platformCodePreview.orgProductNumber} in your organization and 
                  #{platformCodePreview.globalProductNumber} globally
                </p> */}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Product/service name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Industry and Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.industryId}
                onChange={(e) => setFormData(prev => ({ ...prev, industryId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.industryId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loadingIndustries}
              >
                <option value="">
                  {loadingIndustries ? 'Loading industries...' : 'Select an industry'}
                </option>
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
              {errors.industryId && (
                <p className="mt-1 text-sm text-red-600">{errors.industryId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  const selectedCategory = categories.find(c => c.id === categoryId);
                  setFormData(prev => ({
                    ...prev,
                    categoryId,
                    category: selectedCategory?.name || ''
                  }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!formData.industryId || loadingCategories}
              >
                <option value="">
                  {!formData.industryId
                    ? 'Select an industry first'
                    : loadingCategories
                    ? 'Loading categories...'
                    : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Location Selection - Optional */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-gray-500">(Optional)</span>
            </label>
            <select
              value={formData.locationIndex}
              onChange={(e) => setFormData(prev => ({ ...prev, locationIndex: parseInt(e.target.value) }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.locationIndex ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loadingLocations}
            >
              <option value="0">No location selected</option>
              {locations.map((location) => (
                <option 
                  key={location.value} 
                  value={location.value}
                  disabled={location.disabled}
                >
                  {location.label}
                  {!location.isPaidFor && ' (Payment Required)'}
                </option>
              ))}
            </select>
            {errors.locationIndex && (
              <p className="mt-1 text-sm text-red-600">{errors.locationIndex}</p>
            )}
          </div>
         
          {/* Item Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, itemType: 'product' }))}
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
                  formData.itemType === 'product'
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                Product
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, itemType: 'service' }))}
                className={`flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors ${
                  formData.itemType === 'service'
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Service
              </button>
            </div>
            {errors.itemType && (
              <p className="mt-1 text-sm text-red-600">{errors.itemType}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Product/service description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Identification Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Stock Keeping Unit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPC
              </label>
              <input
                type="text"
                value={formData.upc}
                onChange={(e) => setFormData(prev => ({ ...prev, upc: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Universal Product Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.totalAvailableQuantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAvailableQuantity: e.target.value ? Number(e.target.value) : 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          {/* Pricing Information - NGN Currency */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing Information (NGN)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₦</span>
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
                    value={loadingCommission ? 'Loading...' : `${formData.platformChargePercentage}%`}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                  />
                </div>
                {platformCommission && (
                  <p className="text-xs text-gray-500 mt-1">
                    Commission: {platformCommission.commissionName}
                  </p>
                )}
                {!formData.categoryId && (
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

          {/* Date and Time - Empty by default */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="visibility"
                checked={formData.visibilityToPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, visibilityToPublic: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="visibility" className="ml-2 block text-sm text-gray-700">
                Visible to Public
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>

          {/* Media Limits Info */}
          {mediaLimits && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Media Limits</p>
                <p>Images: {mediaLimits.images.current}/{mediaLimits.images.max} used ({mediaLimits.images.remaining} remaining)</p>
                <p>Videos: {mediaLimits.videos.current}/{mediaLimits.videos.max} used ({mediaLimits.videos.remaining} remaining)</p>
                {!mediaLimits.verified && (
                  <p className="text-xs mt-1">Upgrade to verified badge for more upload slots.</p>
                )}
              </div>
            </div>
          )}

          {/* Media Upload */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Media Upload</h3>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Max 5MB each, JPEG/PNG/WebP)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Upload Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
              
              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (Max 50MB each, MP4/MPEG/MOV/AVI)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                  <Video className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Upload Videos</span>
                  <input
                    type="file"
                    multiple
                    accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.videos && (
                <p className="mt-1 text-sm text-red-600">{errors.videos}</p>
              )}
              
              {/* Video List */}
              {videos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">{video.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(video.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading || !formData.industryId || !formData.categoryId} 
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGalleryItemPage;