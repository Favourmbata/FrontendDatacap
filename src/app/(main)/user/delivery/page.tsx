"use client";

import React, { useState, useEffect } from 'react';
import DeliveryService from '@/services/DeliveryService';

const DeliveryPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [declarationText, setDeclarationText] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('pickup_center');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupCenterName, setPickupCenterName] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [representativeImage, setRepresentativeImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [representativeImagePreview, setRepresentativeImagePreview] = useState<string | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [imageComment, setImageComment] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const deliveryService = new DeliveryService();

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await deliveryService.getUserOrders(token);
      
      if (response.success && response.data) {
        // Filter orders that are fully paid and not yet delivered
        const eligibleOrders = response.data.orders.filter(
          (order: any) => order.orderStatus === 'fully_paid' && 
                        order.deliveryStatus !== 'confirmed'
        );
        setOrders(eligibleOrders);
      } else {
        console.error('Failed to fetch orders:', response.message);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryTemplate = async (orderId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        console.error('No authentication token found');
        return '';
      }
      
      const response = await deliveryService.getDeliveryTemplate(orderId, token);
      
      if (response.success && response.data) {
        setDeclarationText(response.data.template);
        return response.data.template;
      } else {
        console.error('Failed to fetch delivery template:', response.message);
      }
    } catch (error) {
      console.error('Error getting delivery template:', error);
    }
    return '';
  };

  const handleOrderSelect = async (order: any) => {
    setSelectedOrder(order);
    await getDeliveryTemplate(order._id);
  };

  const handleConfirmDelivery = async () => {
    if (!selectedOrder) return;

    // Validation
    if (!declarationText.trim()) {
      alert('Please provide a satisfaction declaration');
      return;
    }

    if (deliveryMode === 'shipping' && !deliveryAddress.trim()) {
      alert('Please enter delivery address for shipping mode');
      return;
    }

    if ((deliveryMode === 'pickup_center' || deliveryMode === 'organization_location') && !pickupCenterName.trim()) {
      alert(`Please enter ${deliveryMode === 'pickup_center' ? 'pickup center name' : 'organization location'}`);
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const confirmationData = {
        deliveryMode: deliveryMode as 'pickup_center' | 'shipping' | 'organization_location',
        deliveryAddress: deliveryAddress || undefined,
        pickupCenterName: pickupCenterName || undefined,
        productImage: productImage || undefined,
        representativeImage: representativeImage || undefined,
        userImage: userImage || undefined,
        imageComment: imageComment || undefined,
        videoUrl: videoUrl || undefined,
        satisfactionDeclaration: declarationText
      };

      const response = await deliveryService.confirmDelivery(selectedOrder._id, token, confirmationData);
      
      if (response.success) {
        alert('Delivery confirmed successfully! Payment will be released to the organization.');
        setShowConfirmationModal(false);
        setSelectedOrder(null);
        setDeclarationText('');
        setDeliveryMode('pickup_center');
        setDeliveryAddress('');
        setPickupCenterName('');
        setProductImage(null);
        setRepresentativeImage(null);
        setUserImage(null);
        setProductImagePreview(null);
        setRepresentativeImagePreview(null);
        setUserImagePreview(null);
        setImageComment('');
        setVideoUrl('');
        loadUserOrders(); // Refresh the orders list
      } else {
        alert(response.message || 'Failed to confirm delivery');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Error confirming delivery. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (setter: React.Dispatch<React.SetStateAction<File | null>>, 
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setter(null);
    previewSetter(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-6 border-b">
              <h1 className="text-2xl font-semibold text-gray-800">Delivery Confirmation</h1>
              <p className="mt-1 text-gray-600">Confirm receipt of your purchased products/services</p>
            </div>

            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders available for delivery confirmation</p>
                  <p className="text-gray-400 text-sm mt-2">Orders must be fully paid to be eligible for delivery confirmation</p>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Select Order for Delivery Confirmation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {orders.map((order) => (
                        <div 
                          key={order._id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedOrder?._id === order._id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleOrderSelect(order)}
                        >
                          <div className="font-medium">{order.productName}</div>
                          <div className="text-sm text-gray-600 mt-1">₦{order.totalAmountPaid?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {order._id.substring(0, 8)}...</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder && (
                    <div className="mt-8 border-t pt-6">
                      <h2 className="text-lg font-medium text-gray-800 mb-4">Confirm Delivery for: {selectedOrder.productName}</h2>
                      
                      <div className="space-y-6">
                        {/* Delivery Mode Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Mode</label>
                          <div className="flex space-x-4">
                            {['pickup_center', 'shipping', 'organization_location'].map((mode) => (
                              <label key={mode} className="flex items-center">
                                <input
                                  type="radio"
                                  name="deliveryMode"
                                  value={mode}
                                  checked={deliveryMode === mode}
                                  onChange={(e) => setDeliveryMode(e.target.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 capitalize">{mode.replace('_', ' ')}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Conditional Fields */}
                        {deliveryMode === 'shipping' && (
                          <div>
                            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                              Delivery Address
                            </label>
                            <input
                              type="text"
                              id="deliveryAddress"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter delivery address"
                            />
                          </div>
                        )}

                        {(deliveryMode === 'pickup_center' || deliveryMode === 'organization_location') && (
                          <div>
                            <label htmlFor="pickupCenterName" className="block text-sm font-medium text-gray-700 mb-1">
                              {deliveryMode === 'pickup_center' ? 'Pickup Center Name' : 'Organization Location'}
                            </label>
                            <input
                              type="text"
                              id="pickupCenterName"
                              value={pickupCenterName}
                              onChange={(e) => setPickupCenterName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={deliveryMode === 'pickup_center' ? 'Enter pickup center name' : 'Enter organization location'}
                            />
                          </div>
                        )}

                        {/* Satisfaction Declaration */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label htmlFor="declarationText" className="block text-sm font-medium text-gray-700">
                              Satisfaction Declaration
                            </label>
                            <button
                              type="button"
                              onClick={() => getDeliveryTemplate(selectedOrder._id)}
                              disabled={!selectedOrder}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              Get Template
                            </button>
                          </div>
                          <textarea
                            id="declarationText"
                            value={declarationText}
                            onChange={(e) => setDeclarationText(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Click 'Get Template' to load the pre-filled declaration, then edit with your information"
                          />
                          <p className="mt-1 text-xs text-gray-500">Edit the template with your actual information before submitting</p>
                          {declarationText && (
                            <p className="mt-1 text-xs text-gray-400">Character count: {declarationText.length}</p>
                          )}
                        </div>

                        {/* Image Uploads */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Images (Optional)
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Product Image</label>
                              {productImagePreview ? (
                                <div className="relative border border-gray-300 rounded-md p-2">
                                  <img src={productImagePreview} alt="Product preview" className="w-full h-32 object-cover rounded" />
                                  <button
                                    type="button"
                                    onClick={() => clearImage(setProductImage, setProductImagePreview)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setProductImage, setProductImagePreview)}
                                  className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              )}
                              {productImage && !productImagePreview && (
                                <p className="mt-1 text-xs text-gray-500 truncate">{productImage.name}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Representative Image</label>
                              {representativeImagePreview ? (
                                <div className="relative border border-gray-300 rounded-md p-2">
                                  <img src={representativeImagePreview} alt="Representative preview" className="w-full h-32 object-cover rounded" />
                                  <button
                                    type="button"
                                    onClick={() => clearImage(setRepresentativeImage, setRepresentativeImagePreview)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setRepresentativeImage, setRepresentativeImagePreview)}
                                  className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              )}
                              {representativeImage && !representativeImagePreview && (
                                <p className="mt-1 text-xs text-gray-500 truncate">{representativeImage.name}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">User Image</label>
                              {userImagePreview ? (
                                <div className="relative border border-gray-300 rounded-md p-2">
                                  <img src={userImagePreview} alt="User preview" className="w-full h-32 object-cover rounded" />
                                  <button
                                    type="button"
                                    onClick={() => clearImage(setUserImage, setUserImagePreview)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, setUserImage, setUserImagePreview)}
                                  className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              )}
                              {userImage && !userImagePreview && (
                                <p className="mt-1 text-xs text-gray-500 truncate">{userImage.name}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Additional Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="imageComment" className="block text-sm font-medium text-gray-700 mb-1">
                              Image Comment (Optional)
                            </label>
                            <input
                              type="text"
                              id="imageComment"
                              value={imageComment}
                              onChange={(e) => setImageComment(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Comment about uploaded images"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                              Video URL (Optional)
                            </label>
                            <input
                              type="text"
                              id="videoUrl"
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="URL of confirmation video"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                          <button
                            onClick={() => setShowConfirmationModal(true)}
                            disabled={
                              !declarationText.trim() ||
                              (deliveryMode === 'shipping' && !deliveryAddress.trim()) ||
                              ((deliveryMode === 'pickup_center' || deliveryMode === 'organization_location') && !pickupCenterName.trim())
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              !declarationText.trim() ||
                              (deliveryMode === 'shipping' && !deliveryAddress.trim()) ||
                              ((deliveryMode === 'pickup_center' || deliveryMode === 'organization_location') && !pickupCenterName.trim())
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            Confirm Delivery
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedOrder(null);
                              setDeclarationText('');
                              setProductImage(null);
                              setRepresentativeImage(null);
                              setUserImage(null);
                              setProductImagePreview(null);
                              setRepresentativeImagePreview(null);
                              setUserImagePreview(null);
                              setImageComment('');
                              setVideoUrl('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delivery?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to confirm delivery for this order? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmDelivery}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;