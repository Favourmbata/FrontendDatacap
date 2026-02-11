"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Video, Tag, Package, Briefcase, MapPin, Calendar, DollarSign, Copy, Check, Clock, Hash, CreditCard } from 'lucide-react';
import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';

interface GalleryItem {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  industryId: string;
  itemType: 'product' | 'service';
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity: number;
  priceInDollars: number;
  discountPercentage: number;
  upfrontPaymentPercentage?: number;
  upfrontPaymentAmount?: number;
  actualAmount?: number;
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
  categoryName?: string;
  industryName?: string;
  commissionName?: string;
}

const ViewGalleryItemPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthContext();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Fetch item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      if (!token) return;
      
      try {
        const itemId = Array.isArray(params.id) ? params.id[0] : params.id;
        if (itemId) {
          const result = await GalleryService.getGalleryItem(token, itemId);
          
          if (result.success) {
            if (result.data && 'galleryItem' in result.data) {
              setItem((result.data as any).galleryItem);
            } else {
              setItem(result.data || null);
            }
          } else {
            setErrors('Failed to load gallery item');
          }
        }
      } catch (error: any) {
        console.error('Error fetching item:', error);
        setErrors('Failed to load item data');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [token, params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const actualAmount = item.actualAmount || 
    (item.priceInDollars - (item.priceInDollars * (item.discountPercentage || 0) / 100) + 
    (item.priceInDollars * (item.platformChargePercentage || 0) / 100));

  const displayId = item._id ? item._id.slice(-8) : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add margin-left for sidebar */}
      <div className="ml-0 lg:ml-[280px] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </button>

          {errors && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {errors}
            </div>
          )}

          {/* Header with Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">{item.name || item.description}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.itemType === 'product' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {item.itemType === 'product' ? 'Product' : 'Service'}
              </span>
            </div>
            <p className="text-gray-600 text-lg">{item.description}</p>
          </div>

          {/* Platform Code Banner */}
          {item.platformUniqueCode && (
            <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-700 uppercase tracking-wider">Platform Unique Code</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono bg-white px-3 py-1.5 rounded-lg border border-purple-200 text-purple-900">
                      {item.platformUniqueCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.platformUniqueCode!)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-purple-600 hover:text-purple-800" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-purple-600 flex items-center mt-2 sm:mt-0">
                <Hash className="w-3 h-3 mr-1" />
                #{item.platformUniqueCode.split('-').pop()}
              </div>
            </div>
          )}

          {/* Images Section - Full Width at Top */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
              Images
            </h2>
            {item.images && item.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {item.images.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={image}
                      alt={`${item.name || item.description} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No images uploaded</p>
              </div>
            )}
          </div>

          {/* Videos Section - Full Width */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2 text-purple-600" />
              Videos
            </h2>
            {item.videos && item.videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.videos.map((video, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                    <Video className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">Video {index + 1}</p>
                      <p className="text-xs text-gray-600">Click to preview</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Video className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No videos uploaded</p>
              </div>
            )}
          </div>

          {/* Single Details Card - All information in one place */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
            </div>

            {/* Card Body - Grid Layout */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Classification Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-purple-600" />
                    Classification
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Industry</span>
                      <span className="text-sm font-medium text-gray-900">{item.industryName || 'Fintech'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="text-sm font-medium text-gray-900">{item.categoryName || 'Bank'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                        Location {item.locationIndex}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">SKU / UPC</span>
                      <span className="text-sm font-mono text-gray-900">
                        {item.sku || item.upc || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory & Status Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center">
                    <Package className="w-4 h-4 mr-2 text-purple-600" />
                    Inventory & Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Available Quantity</span>
                      <span className="text-sm font-bold text-gray-900">{item.totalAvailableQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Visibility</span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.visibilityToPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.visibilityToPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Media Count</span>
                      <span className="text-sm text-gray-900">
                        {item.images?.length || 0} images, {item.videos?.length || 0} videos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="text-sm text-gray-900">{formatDate(item.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">End Date</span>
                      <span className="text-sm text-gray-900">{formatDate(item.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm text-gray-900">
                        {Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing Section - Full Width on its own row */}
                <div className="md:col-span-2 lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center mb-4">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                    Pricing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Base Price</p>
                      <p className="text-lg font-bold text-gray-900">{formatNaira(item.priceInDollars)}</p>
                      {item.discountPercentage > 0 && (
                        <p className="text-xs text-red-600 mt-1">-{item.discountPercentage}% discount</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Platform Charge</p>
                      <p className="text-lg font-bold text-amber-600">{item.platformChargePercentage}%</p>
                      {item.commissionName && (
                        <p className="text-xs text-gray-500 mt-1">{item.commissionName}</p>
                      )}
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1">Actual Amount</p>
                      <p className="text-lg font-bold text-purple-600">{formatNaira(actualAmount)}</p>
                      <p className="text-xs text-purple-600 mt-1">After commission & discount</p>
                    </div>
                    {item.upfrontPaymentPercentage && item.upfrontPaymentPercentage > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Upfront Payment</p>
                        <p className="text-lg font-bold text-blue-600">{item.upfrontPaymentPercentage}%</p>
                        <p className="text-xs text-blue-600 mt-1">{formatNaira(item.upfrontPaymentAmount || 0)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Section - Full Width */}
                {item.notes && (
                  <div className="md:col-span-2 lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center mb-3">
                      <Clock className="w-4 h-4 mr-2 text-purple-600" />
                      Additional Notes
                    </h3>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-gray-700 whitespace-pre-wrap text-sm">{item.notes}</p>
                    </div>
                  </div>
                )}

                {/* Metadata Section - Full Width */}
                <div className="md:col-span-2 lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Item ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{displayId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Created:</span>
                      <span className="text-xs text-gray-800">{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Updated:</span>
                      <span className="text-xs text-gray-800">{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGalleryItemPage;