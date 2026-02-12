

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionService, { SubscriptionPackage } from '@/services/subscriptionService';

const ViewSubscriptionPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [packageData, setPackageData] = useState<SubscriptionPackage | null>(null);
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get params.id using React.use() pattern for Next.js 15
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
      setPackageData(foundPackage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription package');
      console.error('Error loading package:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push('/super-admin/subscription');
  };

  const handleEdit = () => {
    if (packageData?.id) {
      router.push(`/super-admin/subscription/edit/${packageData.id}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
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
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              ← Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loading Package</h1>
              <p className="text-gray-600">Please wait while we load the subscription package details.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              ← Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Error Loading Package</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={loadPackageData}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
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
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              ← Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Package Not Found</h1>
              <p className="text-gray-600">The subscription package doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
           
          <button 
            onClick={goBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
         
       
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">View Subscription Package</h1>
             
            </div>
            
            
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              packageData.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Status: {packageData.status.charAt(0).toUpperCase() + packageData.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Basic Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                <p className="text-gray-900">{packageData.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 whitespace-pre-line">{packageData.description}</p>
              </div>

              {packageData.note && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                  <p className="text-gray-900">{packageData.note}</p>
                </div>
              )}

              {packageData.services && packageData.services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services Included</label>
                  <div className="space-y-2">
                    {Array.isArray(packageData.services) && packageData.services.map((service, index) => (
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
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Total Service Cost</p>
                  <p className="text-lg font-semibold text-gray-900">{packageData.totalServiceCost !== undefined ? formatCurrency(packageData.totalServiceCost) : 'N/A'}</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Final Price After Discount</p>
                  <p className="text-lg font-semibold text-green-600">{packageData.finalPriceAfterDiscount !== undefined ? formatCurrency(packageData.finalPriceAfterDiscount) : 'N/A'}</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Discount Amount</p>
                  <p className="text-lg font-semibold text-red-600">{packageData.discountAmount !== undefined ? formatCurrency(packageData.discountAmount) : 'N/A'}</p>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">Subscription Price</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(packageData.price)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            
            {packageData.features && packageData.features.length > 0 ? (
              <div className="space-y-2">
                {packageData.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-900 mr-2">•</span>
                    <span className="text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No features added to this package</p>
            )}
          </div>

          {/* Timeline Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <p className="text-gray-900">{formatDate(packageData.createdAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(packageData.updatedAt)}</p>
              </div>

              {packageData.createdBy && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <p className="text-gray-900">{packageData.createdBy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Promotion Section */}
          {(packageData.promoStartDate || packageData.promoEndDate || packageData.promoCode) && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Promotion Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.promoCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                    <p className="text-gray-900 font-medium">{packageData.promoCode}</p>
                  </div>
                )}

                {packageData.promoStartDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Start Date</label>
                    <p className="text-gray-900">{formatDate(packageData.promoStartDate)}</p>
                  </div>
                )}

                {packageData.promoEndDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo End Date</label>
                    <p className="text-gray-900">{formatDate(packageData.promoEndDate)}</p>
                  </div>
                )}

                {packageData.setupDate && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Date</label>
                    <p className="text-gray-900">{formatDate(packageData.setupDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
       
      </div>
    </div>
  );
};

export default ViewSubscriptionPage;