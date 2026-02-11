"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, Image as ImageIcon, Video, Calendar, DollarSign, Tag, Check } from 'lucide-react';
import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';

interface GalleryItem {
  _id: string;
  description: string;
  category: string;
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity: number;
  priceInDollars: number;
  discountPercentage: number;
  platformChargePercentage: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic: boolean;
  notes?: string;
  locationIndex: number;
  images: string[];
  videos: string[];
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  description: string;
  category: string;
  sku: string;
  upc: string;
  platformUniqueCode: string;
  totalAvailableQuantity: number;
  priceInDollars: number;
  discountPercentage: number;
  platformChargePercentage: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic: boolean;
  notes: string;
  locationIndex: number;
}

const EditGalleryItemPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthContext();
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    description: '',
    category: '',
    sku: '',
    upc: '',
    platformUniqueCode: '',
    totalAvailableQuantity: 0,
    priceInDollars: 0,
    discountPercentage: 0,
    platformChargePercentage: 0,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '23:59',
    visibilityToPublic: true,
    notes: '',
    locationIndex: 0
  });
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories and item data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        // Fetch categories
        const categoriesResult = await GalleryService.getCategories(token);
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
        }

        // Fetch item data
        const itemId = Array.isArray(params.id) ? params.id[0] : params.id;
        if (itemId) {
          const itemResult = await GalleryService.getGalleryItem(token, itemId);
          if (itemResult.success && itemResult.data) {
            setItem(itemResult.data);
            // Populate form data
            setFormData({
              description: itemResult.data.description,
              category: itemResult.data.category,
              sku: itemResult.data.sku || '',
              upc: itemResult.data.upc || '',
              platformUniqueCode: itemResult.data.platformUniqueCode || '',
              totalAvailableQuantity: itemResult.data.totalAvailableQuantity,
              priceInDollars: itemResult.data.priceInDollars,
              discountPercentage: itemResult.data.discountPercentage,
              platformChargePercentage: itemResult.data.platformChargePercentage,
              startDate: itemResult.data.startDate.split('T')[0],
              startTime: itemResult.data.startTime,
              endDate: itemResult.data.endDate.split('T')[0],
              endTime: itemResult.data.endTime,
              visibilityToPublic: itemResult.data.visibilityToPublic,
              notes: itemResult.data.notes || '',
              locationIndex: itemResult.data.locationIndex
            });
          } else {
            setErrors({ general: 'Failed to load gallery item' });
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setErrors({ general: 'Failed to load data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, params.id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.priceInDollars < 0) {
      newErrors.priceInDollars = 'Price must be positive';
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = 'Discount must be between 0 and 100';
    }

    if (formData.platformChargePercentage < 0 || formData.platformChargePercentage > 100) {
      newErrors.platformChargePercentage = 'Platform charge must be between 0 and 100';
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
    
    if (!token || !item) {
      setErrors({ general: 'Authentication required' });
      return;
    }

    setUpdating(true);
    setErrors({});

    try {
      const result = await GalleryService.updateGalleryItem(token, item._id, {
        ...formData,
        totalAvailableQuantity: Number(formData.totalAvailableQuantity),
        priceInDollars: Number(formData.priceInDollars),
        discountPercentage: Number(formData.discountPercentage),
        platformChargePercentage: Number(formData.platformChargePercentage),
        locationIndex: Number(formData.locationIndex)
      });

      if (result.success) {
        // Upload new images if any
        if (images.length > 0) {
          for (const image of images) {
            await GalleryService.uploadImage(token, item._id, image);
          }
        }

        // Upload new videos if any
        if (videos.length > 0) {
          for (const video of videos) {
            await GalleryService.uploadVideo(token, item._id, video);
          }
        }

        router.push('/admin/gallery');
      } else {
        setErrors({ general: result.message || 'Failed to update gallery item' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errorMessages: string[] = [];

      files.forEach(file => {
        const validation = GalleryService.validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errorMessages.push(validation.message || 'Invalid image file');
        }
      });

      if (errorMessages.length > 0) {
        setErrors({ images: errorMessages.join(', ') });
      }

      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errorMessages: string[] = [];

      files.forEach(file => {
        const validation = GalleryService.validateVideoFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errorMessages.push(validation.message || 'Invalid video file');
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
      formData.priceInDollars,
      formData.discountPercentage,
      formData.platformChargePercentage
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">The gallery item you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/gallery')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800">Edit Gallery Item</h1>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
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
                Platform Code
              </label>
              <input
                type="text"
                value={formData.platformUniqueCode}
                onChange={(e) => setFormData(prev => ({ ...prev, platformUniqueCode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Platform unique code"
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.totalAvailableQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalAvailableQuantity: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.priceInDollars}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceInDollars: Number(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.priceInDollars ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.priceInDollars && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceInDollars}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.discountPercentage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  max="100"
                />
                {errors.discountPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.discountPercentage}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Charge (%)
                </label>
                <input
                  type="number"
                  value={formData.platformChargePercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, platformChargePercentage: Number(e.target.value) }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.platformChargePercentage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                  max="100"
                />
                {errors.platformChargePercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.platformChargePercentage}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-800">Actual Amount:</span>
                <span className="text-lg font-bold text-purple-600">
                  ${calculateActualAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Index
              </label>
              <input
                type="number"
                value={formData.locationIndex}
                onChange={(e) => setFormData(prev => ({ ...prev, locationIndex: Number(e.target.value) }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
              />
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

          {/* Media Upload */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Media Upload</h3>
            
            {/* Current Images */}
            {item.images.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {item.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Current ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Videos */}
            {item.videos.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Videos</h4>
                <div className="space-y-2 mb-4">
                  {item.videos.map((video, index) => (
                    <div key={index} className="flex items-center bg-white p-2 rounded border">
                      <Video className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700">Video {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images (Max 5MB each, JPEG/PNG/WebP)
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
              
              {/* New Image Preview */}
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
                Add New Videos (Max 50MB each, MP4/MPEG/MOV/AVI)
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
              
              {/* New Video List */}
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
                        <ArrowLeft className="w-4 h-4" />
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
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={updating}
            >
              {updating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {updating ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGalleryItemPage;