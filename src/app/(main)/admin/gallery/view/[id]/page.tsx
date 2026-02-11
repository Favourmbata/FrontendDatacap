"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, Video, Calendar, DollarSign, Tag, Eye } from 'lucide-react';
import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

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

const ViewGalleryItemPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthContext();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<string>('');

  // Fetch item data on mount
  useEffect(() => {
    const fetchItem = async () => {
      if (!token) return;
      
      try {
        const itemId = Array.isArray(params.id) ? params.id[0] : params.id;
        if (itemId) {
          const result = await GalleryService.getGalleryItem(token, itemId);
          if (result.success && result.data) {
            setItem(result.data);
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

  const handleDelete = async () => {
    if (!item || !token) return;

    setDeleteLoading(true);
    try {
      const result = await GalleryService.deleteGalleryItem(token, item._id);
      if (result.success) {
        router.push('/admin/gallery');
      } else {
        setErrors(result.message || 'Failed to delete gallery item');
      }
    } catch (error: any) {
      setErrors('An error occurred while deleting the item');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const calculateActualAmount = (price: number, discount: number, platformCharge: number) => {
    return price - (price * discount / 100) + (price * platformCharge / 100);
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
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Gallery Item Details</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/gallery/edit/${item._id}`)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {errors && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Section */}
            {item.images.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${item.description} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {item.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Videos</h2>
                <div className="space-y-3">
                  {item.videos.map((video, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Video className="w-6 h-6 text-red-500 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Video {index + 1}</p>
                        <p className="text-sm text-gray-600">Click to play</p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* Notes */}
            {item.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{item.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-800 font-medium">{item.category}</p>
                </div>
                
                {item.sku && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">SKU</label>
                    <p className="text-gray-800">{item.sku}</p>
                  </div>
                )}
                
                {item.upc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">UPC</label>
                    <p className="text-gray-800">{item.upc}</p>
                  </div>
                )}
                
                {item.platformUniqueCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Platform Code</label>
                    <p className="text-gray-800">{item.platformUniqueCode}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">Location Index</label>
                  <p className="text-gray-800">{item.locationIndex}</p>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{item.totalAvailableQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${item.priceInDollars.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium">{item.discountPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Charge:</span>
                  <span className="font-medium">{item.platformChargePercentage}%</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Actual Amount:</span>
                    <span className="font-bold text-purple-600">
                      ${calculateActualAmount(
                        item.priceInDollars, 
                        item.discountPercentage, 
                        item.platformChargePercentage
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates and Visibility */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-gray-800">{new Date(item.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">{item.startTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">End Date</label>
                  <p className="text-gray-800">{new Date(item.endDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">{item.endTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Visibility</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    item.visibilityToPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.visibilityToPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Metadata</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-800">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-800">{new Date(item.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Media Count</label>
                  <p className="text-gray-800">{item.images.length} images, {item.videos.length} videos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={item.description}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default ViewGalleryItemPage;