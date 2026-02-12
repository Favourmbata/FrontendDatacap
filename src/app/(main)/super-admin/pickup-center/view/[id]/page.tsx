"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, MapPin, Phone, Calendar, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PickupCenterService from '@/services/pickCenter';

interface PickupCenter {
  id: string;
  centerName: string;
  address: string;
  contactNumber: string;
  amount: number;
  operatingDays: string;
  operatingHours: string;
  isActive?: boolean;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const ViewPickupCenter = () => {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;

  const [pickupCenter, setPickupCenter] = useState<PickupCenter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickupCenter = async () => {
      try {
        setLoading(true);
        const data = await PickupCenterService.getPickupCenterById(centerId);
        setPickupCenter(data);
      } catch (error: any) {
        console.error('Error fetching pickup center:', error);
        toast.error(error.message || 'Failed to load pickup center');
        router.push('/super-admin/pickup-center');
      } finally {
        setLoading(false);
      }
    };

    if (centerId) {
      fetchPickupCenter();
    }
  }, [centerId, router]);

  const formatCurrency = (amount: number) => {
    return PickupCenterService.formatAmount(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    if (!pickupCenter) return null;
    
    const status = pickupCenter.status || (pickupCenter.isActive ? 'active' : 'inactive');
    
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="w-4 h-4 mr-1" />
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/super-admin/pickup-center')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">View Pickup Center</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pickupCenter) {
    return null;
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/super-admin/pickup-center')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
           
          </div>
           <h1 className="text-2xl font-bold text-gray-900">Pickup Center Details</h1>
          
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{pickupCenter.centerName}</h2>
                <p className="text-sm text-gray-500 mt-1">ID: {pickupCenter.id}</p>
              </div>
              <div>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Center Name
                    </label>
                    <p className="text-gray-900 font-medium">{pickupCenter.centerName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Address
                    </label>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-900">{pickupCenter.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Contact Number
                    </label>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-gray-900">{pickupCenter.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Operational Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Operational Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Amount
                    </label>
                    <div className="flex items-center">
                      
                      <p className="text-gray-900 font-semibold text-lg">
                        {formatCurrency(pickupCenter.amount)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Operating Days
                    </label>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-gray-900">{pickupCenter.operatingDays}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Operating Hours
                    </label>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-gray-900">{pickupCenter.operatingHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Created Date
                  </label>
                  <p className="text-gray-900">{formatDate(pickupCenter.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">{formatDate(pickupCenter.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPickupCenter;