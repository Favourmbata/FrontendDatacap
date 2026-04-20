"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Filter, DollarSign, CheckCircle, XCircle, Clock, Loader2, AlertCircle, MapPin, User, Mail, FileText } from 'lucide-react';
import BookingAdminService, { AdminBooking } from '@/services/BookingAdminService';
import { useAuthContext } from '@/AuthContext';

type TabType = 'all' | 'pending' | 'confirmed' | 'accepted' | 'rejected' | 'completed';

const AdminBookingsPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // Booking details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, currentPage, dateFrom, dateTo]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const status = activeTab === 'all' ? undefined : activeTab;
      
      const response = await BookingAdminService.getAdminBookings({
        page: currentPage,
        limit: 20,
        status,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });

      if (response.success) {
        setBookings(response.data.bookings);
        setTotalBookings(response.data.total);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getLocationLabel = (type: string): string => {
    const labels: Record<string, string> = {
      merchant_location: 'Provider Location',
      customer_address: 'Customer Address',
      new_address: 'Custom Address',
      whatsapp_location: 'WhatsApp Location'
    };
    return labels[type] || type;
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">View and manage all service bookings</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'all' as TabType, label: 'All Bookings', count: totalBookings },
                { id: 'pending' as TabType, label: 'Pending' },
                { id: 'confirmed' as TabType, label: 'Confirmed' },
                { id: 'accepted' as TabType, label: 'Accepted' },
                { id: 'rejected' as TabType, label: 'Rejected' },
                { id: 'completed' as TabType, label: 'Completed' },
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-1 text-xs">({count})</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persons</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}

                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-xs">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">{booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.slotDateTime)}</td>
                    <td className="px-4 py-3 text-sm text-center">{booking.totalPersons}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(booking.fee)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        {getLocationLabel(booking.location.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        View Details
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

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
              
              {/* Booking ID and Status */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="text-lg font-mono font-bold">{selectedBooking.bookingId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Service Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Service Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Service Name</p>
                    <p className="font-medium">{selectedBooking.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-medium">{selectedBooking.organizationName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium">{formatDate(selectedBooking.slotDateTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fee</p>
                    <p className="font-medium text-purple-600">{formatCurrency(selectedBooking.fee)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Persons</p>
                    <p className="font-medium">{selectedBooking.totalPersons}</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{getLocationLabel(selectedBooking.location.type)}</p>
                  {selectedBooking.location.address && (
                    <p className="text-sm text-gray-600 mt-1">{selectedBooking.location.address}</p>
                  )}
                  {selectedBooking.location.whatsappLocationUrl && (
                    <a 
                      href={selectedBooking.location.whatsappLocationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                    >
                      View WhatsApp Location
                    </a>
                  )}
                </div>
              </div>

              {/* Notes */}
              {(selectedBooking.customerNotes || selectedBooking.providerNotes) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Notes
                  </h3>
                  {selectedBooking.customerNotes && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Customer Notes:</p>
                      <p className="text-sm text-blue-700">{selectedBooking.customerNotes}</p>
                    </div>
                  )}
                  {selectedBooking.providerNotes && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">Provider Notes:</p>
                      <p className="text-sm text-green-700">{selectedBooking.providerNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamps */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                  </div>
                  {selectedBooking.acceptedAt && (
                    <div>
                      <p className="text-gray-600">Accepted</p>
                      <p className="font-medium">{formatDate(selectedBooking.acceptedAt)}</p>
                    </div>
                  )}
                  {selectedBooking.completedAt && (
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="font-medium">{formatDate(selectedBooking.completedAt)}</p>
                    </div>
                  )}
                  {selectedBooking.rejectedAt && (
                    <div>
                      <p className="text-gray-600">Rejected</p>
                      <p className="font-medium">{formatDate(selectedBooking.rejectedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
