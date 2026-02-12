"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Eye, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import PlatformCommissionService, { PlatformCommission } from '@/services/PlatformCommissionService';

const PlatformCommissionView = () => {
  const router = useRouter();
  const params = useParams();
  const [commission, setCommission] = useState<PlatformCommission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch platform commission data from API
  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setError('Commission ID not provided');
          setLoading(false);
          return;
        }
        
        const fetchedCommission = await PlatformCommissionService.getPlatformCommissionById(id);
        setCommission(fetchedCommission);
      } catch (err: any) {
        console.error('Error fetching platform commission:', err);
        setError(err.message || 'Failed to fetch platform commission');
        toast.error(err.message || 'Failed to fetch platform commission');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommission();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleStatus = async () => {
    if (!commission) return;
    
    try {
      const newStatus = commission.status === 'active' ? 'inactive' : 'active';
      await PlatformCommissionService.updatePlatformCommissionStatus(
        commission.id,
        newStatus
      );
      
      // Refresh the commission data
      const updatedCommission = await PlatformCommissionService.getPlatformCommissionById(commission.id);
      setCommission(updatedCommission);
      
      toast.success(`Commission ${newStatus} successfully`);
    } catch (err: any) {
      console.error('Error updating commission status:', err);
      toast.error(err.message || 'Failed to update commission status');
    }
  };

  const handleDelete = async () => {
    if (!commission) return;
    
    if (!window.confirm(`Are you sure you want to delete the commission "${commission.commissionName}"?`)) {
      return;
    }
    
    try {
      await PlatformCommissionService.deletePlatformCommission(commission.id);
      toast.success('Commission deleted successfully');
      router.push('/super-admin/platform-commission');
    } catch (err: any) {
      console.error('Error deleting commission:', err);
      toast.error(err.message || 'Failed to delete commission');
    }
  };

  if (loading) {
    return (
      <div className="manrope w-full min-h-screen bg-gray-50 p-4 md:p-8">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d] mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Platform Commissions
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Platform Commission Details</h1>
            <p className="text-sm md:text-base text-gray-600">View details of the selected platform commission</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded w-full col-span-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-40 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="manrope w-full min-h-screen bg-gray-50 p-4 md:p-8">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d] mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Platform Commissions
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Platform Commission Details</h1>
            <p className="text-sm md:text-base text-gray-600">View details of the selected platform commission</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Commission Not Found</h3>
              <p className="text-gray-500 mb-4">The requested platform commission could not be found or may have been deleted.</p>
              <button
                onClick={() => router.push('/super-admin/platform-commission')}
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Back to Platform Commissions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platform Commissions
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Platform Commission Details</h1>
          <p className="text-sm md:text-base text-gray-600">View details of the selected platform commission</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Commission Name</h2>
              <p className="text-gray-900">{commission.commissionName}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Commission Rate</h2>
              <p className="text-gray-900">{commission.commissionRate}%</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Industry</h2>
              <p className="text-gray-900">{commission.industryName || commission.industryId}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Category</h2>
              <p className="text-gray-900">{commission.categoryName || commission.categoryId}</p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-900">{commission.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${commission.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Created Date</h2>
              <p className="text-gray-900">{formatDate(commission.createdAt)}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Last Updated</h2>
              <p className="text-gray-900">{formatDate(commission.updatedAt)}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </button>
            <button
              onClick={handleToggleStatus}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${commission.status === 'active' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {commission.status === 'active' ? <AlertCircle className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
              {commission.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => router.push(`/super-admin/platform-commission/edit/${commission.id}`)}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformCommissionView;