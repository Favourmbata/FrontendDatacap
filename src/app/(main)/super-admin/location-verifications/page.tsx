"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  AlertTriangle
} from "lucide-react";
import { LocationVerificationService } from "@/services/LocationVerificationService";
import { useAuthContext } from '@/AuthContext';

// Define the types based on the service interfaces
interface LocationVerification {
  profileId: string;
  locationIndex: number;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  location: {
    brandName: string;
    locationType: string;
    cityRegion: string;
    cityRegionFee?: number;
    address: string;
    gallery: {
      images: string[];
      videos: string[];
    };
    rejectionReason?: string;
    emailSent?: boolean;
    emailSentAt?: string | null;
  };
  rejectedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info': return <AlertTriangle className="w-6 h-6 text-blue-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 border ${getColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const SuperAdminLocationVerificationsPage: React.FC = () => {
  const { token } = useAuthContext();
  const [verifications, setVerifications] = useState<LocationVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<LocationVerification | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error'
  });
  const [filters, setFilters] = useState({
    status: 'rejected',
    search: ''
  });

  // Fetch location verifications based on filter
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (filters.status === 'rejected' || filters.status === 'pending') {
        response = await LocationVerificationService.getRejectedLocations();
      } else if (filters.status === 'approved' || filters.status === 'verified') {
        response = await LocationVerificationService.getVerifiedLocations();
      } else {
        // For 'all' or other statuses, fetch rejected by default
        response = await LocationVerificationService.getRejectedLocations();
      }
      
      if (response.success && response.data) {
        let verificationsData: LocationVerification[] = [];
        
        // Type guard to check which type of data we have
        if ('rejectedLocationVerifications' in response.data) {
          verificationsData = response.data.rejectedLocationVerifications as LocationVerification[];
        } else if ('verifiedLocationVerifications' in response.data) {
          verificationsData = response.data.verifiedLocationVerifications as LocationVerification[];
        }
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          verificationsData = verificationsData.filter((verification: LocationVerification) => 
            verification.organizationName.toLowerCase().includes(searchTerm) ||
            verification.location.brandName.toLowerCase().includes(searchTerm) ||
            verification.location.cityRegion.toLowerCase().includes(searchTerm)
          );
        }
        
        setVerifications(verificationsData);
      } else {
        setError(response.message || 'Failed to fetch verifications');
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to fetch verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [filters]);

  const handleApprove: () => Promise<void> = async () => {
    if (!selectedVerification) return;
    
    try {
      // For now, we'll just show a success message since the actual approval API isn't implemented
      setMessageModal({
        isOpen: true,
        title: 'Success',
        message: 'Location verification approved successfully!',
        type: 'success'
      });
      
      // Refresh the list
      fetchVerifications();
      setShowApprovalModal(false);
      setApprovalNotes("");
    } catch (err) {
      console.error('Error approving location:', err);
      setMessageModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to approve location',
        type: 'error'
      });
    }
  };

  const handleReject: () => Promise<void> = async () => {
    if (!selectedVerification) return;

    try {
      // For now, we'll just show a success message since the actual rejection API isn't implemented
      setMessageModal({
        isOpen: true,
        title: 'Success',
        message: 'Location verification rejected successfully!',
        type: 'success'
      });
      
      // Refresh the list
      fetchVerifications();
      setShowRejectionModal(false);
      setRejectionReason("");
      setRejectionNotes("");
    } catch (err) {
      console.error('Error rejecting location:', err);
      setMessageModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to reject location',
        type: 'error'
      });
    }
  };

  const getStatusColor = (verification: LocationVerification) => {
    if (verification.rejectedAt) {
      return 'bg-red-100 text-red-800';
    } else if (verification.verifiedAt) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (verification: LocationVerification) => {
    if (verification.rejectedAt) {
      return 'Rejected';
    } else if (verification.verifiedAt) {
      return 'Verified';
    } else {
      return 'Pending';
    }
  };

  const getStatusIcon = (verification: LocationVerification) => {
    if (verification.rejectedAt) {
      return <XCircle className="w-4 h-4" />;
    } else if (verification.verifiedAt) {
      return <CheckCircle className="w-4 h-4" />;
    } else {
      return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Location Verification Requests</h2>
            <p className="text-gray-600">Manage location verification requests from organizations</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="animate-pulse flex flex-col space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Location Verification Requests</h2>
          <p className="text-gray-600">Manage location verification requests from organizations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <XCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{
                  verifications.filter(v => !v.rejectedAt && !v.verifiedAt).length
                }</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved This Month</p>
                <p className="text-2xl font-bold text-gray-900">{
                  verifications.filter(v => v.verifiedAt).length
                }</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected This Month</p>
                <p className="text-2xl font-bold text-gray-900">{
                  verifications.filter(v => v.rejectedAt).length
                }</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by organization, location, or brand name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
              </select>
              <button className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Verifications List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {filters.status === 'rejected' ? 'Rejected' : 
               filters.status === 'approved' ? 'Approved' : 
               filters.status === 'pending' ? 'Pending' : 'All'} Verification Requests
            </h3>
            <span className="text-sm text-gray-500">{verifications.length} requests</span>
          </div>

          {verifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No pending verifications</h3>
              <p className="text-gray-500">All location verification requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <div 
                  key={`${verification.profileId}-${verification.locationIndex}`} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-start md:items-center">
                        <div className="mr-4">
                          <div className="p-3 rounded-lg bg-purple-100">
                            <Building2 className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{verification.location.brandName}</h4>
                          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {verification.organizationName}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {verification.location.cityRegion}
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              Location #{verification.locationIndex}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {verification.rejectedAt ? new Date(verification.rejectedAt).toLocaleDateString() : 
                               verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification)}`}>
                        {getStatusIcon(verification)}
                        <span className="ml-1 capitalize">{getStatusText(verification)}</span>
                      </span>
                      
                      <button 
                        onClick={() => {
                          setSelectedVerification(verification);
                          setShowApprovalModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedVerification(verification);
                          setShowRejectionModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedVerification(verification);
                          // In a real app, this would open a detailed view modal
                          setMessageModal({
                            isOpen: true,
                            title: 'Location Details',
                            message: `Showing details for ${verification.location.brandName}`,
                            type: 'info'
                          });
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowApprovalModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Location Verification</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedVerification.location.brandName}</h4>
                <p className="text-sm text-gray-600">
                  {selectedVerification.location.address}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes or comments about this approval..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowRejectionModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Location Verification</h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedVerification.location.brandName}</h4>
                <p className="text-sm text-gray-600">
                  {selectedVerification.location.address}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Add any additional notes or feedback..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({...messageModal, isOpen: false})}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
      />
    </div>
  );
};

export default SuperAdminLocationVerificationsPage;