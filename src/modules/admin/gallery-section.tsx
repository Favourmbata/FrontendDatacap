"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Package,
  FileText,
  CheckCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  file?: File;
  description: string;
  category: string;
  sku: string;
  upc: string;
  platformUniqueCode: string;
  totalAvailableQuantity: string;
  price: string;
  discountPercentage: string;
  platformChargePercentage: string;
  actualAmount: string;
  visibilityToPublic: boolean;
  notes?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

interface GallerySectionProps {
  locationIndex?: number;
  initialGallery?: {
    images: (string | File)[];
    videos: (string | File)[];
  };
  onGalleryChange?: (gallery: { images: (string | File)[]; videos: (string | File)[] }) => void;
  maxItems?: number;
}

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverage",
  "Home & Garden",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books & Media",
  "Toys & Games",
  "Automotive",
  "Health & Wellness",
  "Services",
  "Other",
];

const GallerySection: React.FC<GallerySectionProps> = ({
  initialGallery,
  onGalleryChange,
  maxItems = 10,
}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
    type: "image",
    description: "",
    category: "",
    sku: "",
    upc: "",
    platformUniqueCode: "",
    price: "",
    totalAvailableQuantity: "",
    discountPercentage: "0",
    platformChargePercentage: "0",
    actualAmount: "",
    visibilityToPublic: true,
    notes: "",
  });

  // Calculate actual amount when price or discounts change
  useEffect(() => {
    if (currentItem.price) {
      const price = parseFloat(currentItem.price) || 0;
      const discount = parseFloat(currentItem.discountPercentage || "0") || 0;
      const platformCharge = parseFloat(currentItem.platformChargePercentage || "0") || 0;
      
      const discountedPrice = price - (price * discount / 100);
      const actualAmount = discountedPrice - (discountedPrice * platformCharge / 100);
      
      setCurrentItem((prev) => ({
        ...prev,
        actualAmount: actualAmount.toFixed(2),
      }));
    }
  }, [currentItem.price, currentItem.discountPercentage, currentItem.platformChargePercentage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    setCurrentItem((prev) => ({
      ...prev,
      type,
      url,
      file,
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.url || !currentItem.description || !currentItem.category) {
      setErrorMessage("Please provide media, description, and category");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (galleryItems.length >= maxItems) {
      setErrorMessage(`Maximum ${maxItems} items can be displayed to public for now`);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const newItem: GalleryItem = {
      id: `item-${Date.now()}`,
      type: currentItem.type!,
      url: currentItem.url!,
      file: currentItem.file,
      description: currentItem.description!,
      category: currentItem.category!,
      sku: currentItem.sku || "",
      upc: currentItem.upc || "",
      platformUniqueCode: currentItem.platformUniqueCode || "",
      price: currentItem.price || "",
      totalAvailableQuantity: currentItem.totalAvailableQuantity || "",
      discountPercentage: currentItem.discountPercentage || "0",
      platformChargePercentage: currentItem.platformChargePercentage || "0",
      actualAmount: currentItem.actualAmount || "",
      visibilityToPublic: currentItem.visibilityToPublic ?? true,
      notes: currentItem.notes || "",
      startDate: currentItem.startDate,
      endDate: currentItem.endDate,
      startTime: currentItem.startTime,
      endTime: currentItem.endTime,
    };

    const updatedItems = [...galleryItems, newItem];
    setGalleryItems(updatedItems);
    updateParentGallery(updatedItems);
    
    setSuccessMessage("Gallery item added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    
    resetForm();
  };

  const handleUpdateItem = () => {
    if (!editingItemId || !currentItem.description || !currentItem.category) {
      setErrorMessage("Please provide description and category");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const updatedItems = galleryItems.map((item) =>
      item.id === editingItemId
        ? {
            ...item,
            description: currentItem.description!,
            category: currentItem.category!,
            sku: currentItem.sku || "",
            upc: currentItem.upc || "",
            platformUniqueCode: currentItem.platformUniqueCode || "",
            price: currentItem.price || "",
            totalAvailableQuantity: currentItem.totalAvailableQuantity || "",
            discountPercentage: currentItem.discountPercentage || "0",
            platformChargePercentage: currentItem.platformChargePercentage || "0",
            actualAmount: currentItem.actualAmount || "",
            visibilityToPublic: currentItem.visibilityToPublic ?? true,
            notes: currentItem.notes || "",
            startDate: currentItem.startDate,
            endDate: currentItem.endDate,
            startTime: currentItem.startTime,
            endTime: currentItem.endTime,
          }
        : item
    );

    setGalleryItems(updatedItems);
    updateParentGallery(updatedItems);

    setSuccessMessage("Gallery item updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = galleryItems.filter((item) => item.id !== id);
    setGalleryItems(updatedItems);
    updateParentGallery(updatedItems);
    
    setSuccessMessage("Gallery item deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEditItem = (item: GalleryItem) => {
    setCurrentItem({
      type: item.type,
      url: item.url,
      file: item.file,
      description: item.description,
      category: item.category,
      sku: item.sku,
      upc: item.upc,
      platformUniqueCode: item.platformUniqueCode,
      price: item.price,
      totalAvailableQuantity: item.totalAvailableQuantity,
      discountPercentage: item.discountPercentage,
      platformChargePercentage: item.platformChargePercentage,
      actualAmount: item.actualAmount,
      visibilityToPublic: item.visibilityToPublic,
      notes: item.notes,
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: item.startTime,
      endTime: item.endTime,
    });
    setEditingItemId(item.id);
    setIsAddingItem(true);
  };

  const resetForm = () => {
    setCurrentItem({
      type: "image",
      description: "",
      category: "",
      sku: "",
      upc: "",
      platformUniqueCode: "",
      price: "",
      totalAvailableQuantity: "",
      discountPercentage: "0",
      platformChargePercentage: "0",
      actualAmount: "",
      visibilityToPublic: true,
      notes: "",
    });
    setIsAddingItem(false);
    setEditingItemId(null);
  };

  const updateParentGallery = (items: GalleryItem[]) => {
    if (onGalleryChange) {
      const images = items
        .filter((item) => item.type === "image")
        .map((item) => item.file || item.url);
      const videos = items
        .filter((item) => item.type === "video")
        .map((item) => item.file || item.url);
      
      onGalleryChange({ images, videos });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Gallery Section
          </h2>
          <p className="text-gray-600 text-sm">
            Manage products and services for this location
          </p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors flex items-center gap-2"
          disabled={galleryItems.length >= maxItems}
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{galleryItems.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Public Items</p>
          <p className="text-2xl font-bold text-gray-900">
            {galleryItems.filter((i) => i.visibilityToPublic).length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Images</p>
          <p className="text-2xl font-bold text-gray-900">
            {galleryItems.filter((i) => i.type === "image").length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Videos</p>
          <p className="text-2xl font-bold text-gray-900">
            {galleryItems.filter((i) => i.type === "video").length}
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItemId ? "Edit Gallery Item" : "Add New Gallery Item"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5d2a8b] transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video
                  </label>
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5d2a8b] transition-colors">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload video</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Media Preview */}
              {currentItem.url && (
                <div className="rounded-lg overflow-hidden">
                  {currentItem.type === "image" ? (
                    <img
                      src={currentItem.url}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={currentItem.url}
                      controls
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentItem.description || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Product or service description..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentItem.category || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU (Stock Keeping Unit Code)
                  </label>
                  <input
                    type="text"
                    value={currentItem.sku || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    placeholder="e.g., PROD-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPC (Universal Product Code)
                  </label>
                  <input
                    type="text"
                    value={currentItem.upc || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, upc: e.target.value }))
                    }
                    placeholder="e.g., 12-digit code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Unique Code
                  </label>
                  <input
                    type="text"
                    value={currentItem.platformUniqueCode || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, platformUniqueCode: e.target.value }))
                    }
                    placeholder="e.g., PLT-123456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Available Quantity
                  </label>
                  <input
                    type="number"
                    value={currentItem.totalAvailableQuantity || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        totalAvailableQuantity: e.target.value,
                      }))
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.price || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.discountPercentage || "0"}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        discountPercentage: e.target.value,
                      }))
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Charge (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentItem.platformChargePercentage || "0"}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({
                        ...prev,
                        platformChargePercentage: e.target.value,
                      }))
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Amount (Calculated)
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900">
                    ${currentItem.actualAmount || "0.00"}
                  </div>
                </div>
              </div>

              {/* Visibility Period (Optional) */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Visibility Period (Optional)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={currentItem.startDate || ""}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={currentItem.startTime || ""}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={currentItem.endDate || ""}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={currentItem.endTime || ""}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Visibility Radio Buttons */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <p className="font-medium text-gray-900">Visibility to Public</p>
                  <p className="text-sm text-gray-600">Make this item visible on your public profile</p>
                </div>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="true"
                      checked={currentItem.visibilityToPublic === true}
                      onChange={() => {
                        // Check if we already have 10 visible items and this one would be the 11th
                        if (
                          galleryItems.filter(i => i.visibilityToPublic).length >= 10 &&
                          editingItemId
                        ) {
                          // Check if we are editing a non-visible item that will be made visible
                          const itemToBeUpdated = galleryItems.find(item => item.id === editingItemId);
                          if (itemToBeUpdated && itemToBeUpdated.visibilityToPublic === false) {
                            setErrorMessage("Maximum of 10 items can be displayed to the public. You have reached this limit. Change existing item to 'No' visibility before changing another one to 'Yes'.");
                            setTimeout(() => setErrorMessage(""), 5000);
                            return;
                          }
                        }
                        setCurrentItem((prev) => ({ ...prev, visibilityToPublic: true }));
                      }}
                      className="h-4 w-4 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="false"
                      checked={currentItem.visibilityToPublic === false}
                      onChange={() => setCurrentItem((prev) => ({ ...prev, visibilityToPublic: false }))}
                      className="h-4 w-4 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {/* Warning message for visibility limit */}
                {currentItem.visibilityToPublic === true && 
                 galleryItems.filter(i => i.visibilityToPublic).length >= 10 && 
                 editingItemId && 
                 (() => {
                   const itemToBeUpdated = galleryItems.find(item => item.id === editingItemId);
                   return itemToBeUpdated && itemToBeUpdated.visibilityToPublic === false;
                 })() && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ You have reached the maximum limit of 10 items visible to the public. 
                      To make this item visible, you need to change an existing visible item to "No" visibility first.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={currentItem.notes || ""}
                  onChange={(e) =>
                    setCurrentItem((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add any additional notes about this product/service..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingItemId ? handleUpdateItem : handleAddItem}
                  className="px-6 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors"
                >
                  {editingItemId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {galleryItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {galleryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.type === "image" ? (
                          <img src={item.url} alt={item.description} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="relative">
                            <video src={item.url} className="w-12 h-12 object-cover rounded" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <PlayCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-[#5d2a8b] text-white text-xs rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {item.description}
                        {item.notes && (
                          <div className="text-gray-500 text-xs mt-1">
                            <i>Notes:</i> {item.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.actualAmount || item.price || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalAvailableQuantity || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.visibilityToPublic ? (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-green-500" />
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Public
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <EyeOff className="w-4 h-4 text-gray-500" />
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            Private
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No gallery items yet. Add your first item to get started!
            </p>
          </div>
        )}
      </div>

      {/* Items limit notice */}
      {galleryItems.length >= maxItems && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">
                Maximum {maxItems} items can be displayed to public for now
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Organization can save up to 50 products/services
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;