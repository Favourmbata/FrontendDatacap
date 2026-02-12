"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Eye, Download, FileText } from 'lucide-react';
import ServiceService from '@/services/ServiceService';
import { useAuthContext } from '@/AuthContext';

const ViewServicePage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthContext();
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service data when component mounts
  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceService = new ServiceService(token);
        const serviceData = await serviceService.getServiceById(id as string);
        
        setService(serviceData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
        console.error('Error loading service:', err);
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const goBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/super-admin/service/${id}/edit`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-50 p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-red-600 text-center py-8">
              <p>Error loading service: {error}</p>
              <button 
                onClick={goBack}
                className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to List
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-gray-600 text-center py-8">
              <p>Service not found</p>
              <button 
                onClick={goBack}
                className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
              <p className="text-gray-600">View and manage service information</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Service
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Service Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Service Name</h3>
                <p className="text-lg font-medium text-gray-900">{service.serviceName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Status</h3>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    service.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Created Date</h3>
                <p className="text-gray-900">{formatDate(service.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</h3>
                <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{service.description}</p>
            </div>
          )}

          {/* Pricing Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Monthly</h3>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(service.monthlyPrice)}</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Quarterly</h3>
                <p className="text-2xl font-bold text-green-600">{formatPrice(service.quarterlyPrice)}</p>
                <p className="text-sm text-gray-600">per quarter</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Yearly</h3>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(service.yearlyPrice)}</p>
                <p className="text-sm text-gray-600">per year</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleEdit}
              className="flex items-center px-6 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServicePage;