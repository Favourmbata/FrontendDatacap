"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataVerificationService } from '@/services/DataVerificationService';
import { ArrowLeft, FileText, Clock, CheckCircle, AlertCircle, Building, MapPin, User, Calendar } from 'lucide-react';

interface VerificationDetail {
  _id: string;
  verificationId: string;
  organizationName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  createdAt: string;
  submittedAt?: string;
  organizationDetails?: any;
  buildingPictures?: any;
  transportationCost?: any;
}

export default function ViewVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const verificationId = params.id as string;
  
  const [verification, setVerification] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const dataVerificationService = new DataVerificationService();

  useEffect(() => {
    if (verificationId) {
      fetchVerification();
    }
  }, [verificationId]);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      const response = await dataVerificationService.getVerificationById(verificationId);
      if (response.success) {
        setVerification(response.data.verification);
      }
    } catch (error) {
      console.error('Error fetching verification:', error);
      // Mock data for demo
      setVerification({
        _id: verificationId,
        verificationId: 'DV-001',
        organizationName: 'Tech Solutions Ltd',
        status: 'draft',
        country: 'Nigeria',
        state: 'Lagos',
        lga: 'Ikeja',
        city: 'Ikeja',
        cityRegion: 'Allen Avenue',
        createdAt: '2024-01-15T09:00:00.000Z'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Verification not found</h3>
          <button
            onClick={() => router.push('/staff/data-verification')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5D2A8B] hover:bg-[#4a216d]"
          >
            Back to Verifications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/staff/data-verification')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verifications
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">{verification.organizationName}</h1>
              <p className="text-gray-600 mt-1">Verification ID: {verification.verificationId}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verification.status)}`}>
              {getStatusIcon(verification.status)}
              <span className="ml-1">
                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
              </span>
            </span>
          </div>
        </div>

        {/* Verification Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Verification Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  Location Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Country</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.country}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.state}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">LGA</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.lga}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.city}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City Region</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.cityRegion}</p>
                  </div>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  Timeline
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(verification.createdAt)}</p>
                  </div>
                  
                  {verification.submittedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Submitted</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(verification.submittedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Details */}
            {verification.organizationDetails && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 flex items-center mb-4">
                  <Building className="w-5 h-5 mr-2 text-gray-500" />
                  Organization Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Headquarters Address</label>
                    <p className="mt-1 text-sm text-gray-900">{verification.organizationDetails.headquartersAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              {verification.status === 'draft' && (
                <>
                  <button
                    onClick={() => router.push(`/staff/data-verification/${verificationId}/edit`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Edit Verification
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await dataVerificationService.submitVerification(verificationId);
                        if (response.success) {
                          alert('Verification submitted successfully!');
                          router.push('/staff/data-verification');
                        }
                      } catch (error) {
                        console.error('Error submitting verification:', error);
                        alert('Failed to submit verification.');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Verification
                  </button>
                </>
              )}
              
              <button
                onClick={() => router.push('/staff/data-verification')}
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}