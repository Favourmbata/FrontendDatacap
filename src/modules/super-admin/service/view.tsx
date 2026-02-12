"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const ServiceView = () => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock service data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call to fetch service data
    setTimeout(() => {
      const mockService: Service = {
        id: '1',
        name: 'Body Measurement',
        description: 'Service for body measurement and scanning',
        createdAt: '2023-01-15',
        updatedAt: '2023-01-15',
      };
      
      setService(mockService);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="text-center py-8">
            <p className="text-gray-600">Service not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Service Name</h2>
            <p className="text-gray-900">{service.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Created Date</h2>
            <p className="text-gray-900">{formatDate(service.createdAt)}</p>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-900">{service.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Last Updated</h2>
            <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => window.location.href = `/super-admin/service/edit/${service.id}`}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;