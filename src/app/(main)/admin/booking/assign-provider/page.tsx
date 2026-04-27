"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Loader2, AlertCircle, CheckCircle, User, Mail, Phone, 
  Star, ArrowLeft, Filter, RefreshCw
} from 'lucide-react';
import BookingAdminService, { 
  AdminBooking, ServiceProvider 
} from '@/services/BookingAdminService';

const AssignProviderPage: React.FC = () => {
  // State for bookings
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // State for providers
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // State for assignment
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [assigningProvider, setAssigningProvider] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState<{bookingId: string, providerName: string} | null>(null);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoadingBookings(true);
      setError(null);

      const response = await BookingAdminService.getAdminBookings(
        currentPage,
        20,
        filterStatus || undefined
      );

      if (response.success) {
        setBookings(response.data.bookings);
        setTotalBookings(response.data.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  }, [currentPage, filterStatus]);

  // Fetch service providers
  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await BookingAdminService.getServiceProviders();
      
      if (response.success) {
        setServiceProviders(response.data.providers);
      }
    } catch (err: any) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  // Load bookings on mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Load providers when modal opens
  useEffect(() => {
    if (showAssignModal && serviceProviders.length === 0) {
      fetchProviders();
    }
  }, [showAssignModal]);

  // Filter bookings by search term
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handle assign provider
  const handleAssignProvider = async () => {
    try {
      if (!selectedBooking || !selectedProviderId) {
        alert('Please select a service provider');
        return;
      }

      setAssigningProvider(true);
      
      const response = await BookingAdminService.assignServiceProvider(
        selectedBooking.bookingId,
        {
          serviceProviderId: selectedProviderId
        }
      );

      if (response.success) {
        setAssignmentSuccess({
          bookingId: selectedBooking.bookingId,
          providerName: response.data.provider.name
        });
        setShowAssignModal(false);
        setSelectedBooking(null);
        setSelectedProviderId('');
        
        // Refresh bookings
        fetchBookings();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setAssignmentSuccess(null);
        }, 3000);
      } else {
        alert(response.message || 'Failed to assign service provider');
      }
    } catch (err: any) {
      console.error('Error assigning service provider:', err);
      alert(err.message || 'Failed to assign service provider');
    } finally {
      setAssigningProvider(false);
    }
  };

  // Open assign modal
  const openAssignModal = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setSelectedProviderId('');
    setShowAssignModal(true);
    setAssignmentSuccess(null);
  };

  // Close assign modal
  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedBooking(null);
    setSelectedProviderId('');
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800',
      rescheduled: 'bg-indigo-100 text-indigo-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  if (loadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Service Providers</h1>
          <p className="text-gray-600">Select a booking and click the "Assign Provider" button in the Actions column</p>
        </div>

        {/* Success Message */}
        {assignmentSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">
                Successfully assigned <strong>{assignmentSuccess.providerName}</strong> to booking <strong>{assignmentSuccess.bookingId}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by booking ID, customer, or service..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {(searchTerm || filterStatus) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}

                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-xs">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.slotDateTime)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {booking.assignedProvider || booking.serviceProviderId ? (
                        <span className="text-green-600 font-medium">✓ Assigned</span>
                      ) : (
                        <span className="text-orange-600">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openAssignModal(booking)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          booking.assignedProvider || booking.serviceProviderId
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {booking.assignedProvider || booking.serviceProviderId ? 'Reassign' : 'Assign Provider'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalBookings)} of {totalBookings} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Provider Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Assign Service Provider</h2>
              
              {/* Booking Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Booking ID:</span>
                    <p className="font-mono font-bold">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <p className="font-medium">{selectedBooking.serviceName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date & Time:</span>
                    <p className="font-medium">{formatDate(selectedBooking.slotDateTime)}</p>
                  </div>
                </div>
              </div>

              {/* Provider Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Service Provider *
                </label>
                
                {loadingProviders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  </div>
                ) : serviceProviders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
                    <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No service providers available</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {serviceProviders.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProviderId(provider.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedProviderId === provider.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-lg">{provider.name}</div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {provider.email}
                              </span>
                              {provider.phoneNumber && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {provider.phoneNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <span className="flex items-center gap-1 text-yellow-600">
                                <Star className="w-3 h-3" />
                                {provider.rating}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{provider.completedTasks} tasks completed</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{provider.totalBookings} bookings</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              provider.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {provider.isAvailable ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleAssignProvider}
                  disabled={assigningProvider || !selectedProviderId}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {assigningProvider ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Assign Provider
                    </>
                  )}
                </button>
                <button
                  onClick={closeAssignModal}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignProviderPage;
