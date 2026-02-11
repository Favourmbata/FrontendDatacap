"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Video, Calendar, DollarSign, Tag } from 'lucide-react';
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

interface EditGalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: GalleryItem | null;
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

const EditGalleryItemModal: React.FC<EditGalleryItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  item
}) => {
  const { token } = useAuthContext();
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (token && isOpen) {
        const result = await GalleryService.getCategories(token);
        if (result.success && result.data) {
          setCategories(result.data);
        }
      }
    };
    fetchCategories();
  }, [token, isOpen]);

  // Load item data when modal opens
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        description: item.description,
        category: item.category,
        sku: item.sku || '',
        upc: item.upc || '',
        platformUniqueCode: item.platformUniqueCode || '',
        totalAvailableQuantity: item.totalAvailableQuantity,
        priceInDollars: item.priceInDollars,
        discountPercentage: item.discountPercentage,
        platformChargePercentage: item.platformChargePercentage,
        startDate: item.startDate.split('T')[0], // Extract date part only
        startTime: item.startTime,
        endDate: item.endDate.split('T')[0], // Extract date part only
        endTime: item.endTime,
        visibilityToPublic: item.visibilityToPublic,
        notes: item.notes || '',
        locationIndex: item.locationIndex
      });
      setImages([]);
      setVideos([]);
    } else if (!isOpen) {
      resetForm();
    }
  }, [item, isOpen]);

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

    setLoading(true);
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

        // Upload new videos if any (only for verified organizations)
        if (videos.length > 0) {
          for (const video of videos) {
            await GalleryService.uploadVideo(token, item._id, video);
          }
        }

        onSuccess();
        onClose();
        resetForm();
      } else {
        setErrors({ general: result.message || 'Failed to update gallery item' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setImages([]);
    setVideos([]);
    setErrors({});
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

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Gallery Item</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="bg-gray-50 p-4 rounded-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="flex items-center justify-between">
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
            <div>
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
            <div className="bg-gray-50 p-4 rounded-lg">
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
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {loading ? 'Updating...' : 'Update Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGalleryItemModal;