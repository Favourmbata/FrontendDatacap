"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, X } from 'lucide-react';
import { toast } from '@/app/components/hooks/use-toast';
import { useAuthContext } from '@/AuthContext';

interface UserInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  customUserId: string;
}

interface Service {
  serviceId: string;
  serviceName: string;
  duration: string;
  _id: string;
}

interface Payment {
  _id: string;
  userId: string;
  userType: string;
  packageId: string;
  packageTitle: string;
  subscriptionDuration: string;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  amountPaid: number;
  paymentStatus: 'completed' | 'pending' | 'failed';
  services: Service[];
  createdAt: string;
  updatedAt: string;
  userInfo: UserInfo;
}

interface ApiResponse {
  data: {
    subscriptions: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { token } = useAuthContext();
  
  // Fetch payments from API
  useEffect(() => {
    fetchPayments();
  }, [currentPage]);
  
  // Refresh payments when search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
    fetchPayments();
  }, [searchTerm]);
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Check if token exists before making the request
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      // Build query parameters
      let queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10', // Default limit of 10
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      // Add search parameter if search term exists
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const response = await fetch(`https://datacapture-backend.onrender.com/api/super-admin/paid-subscriptions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setPayments(data.data.subscriptions);
        setFilteredPayments(data.data.subscriptions); // Still set this for consistency in case we need it elsewhere
        setTotalPages(data.data.totalPages);
        setTotalItems(data.data.total);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch payments',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while fetching payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    // Use NGN as default if currency is not provided or invalid
    const validCurrency = currency && currency.length === 3 ? currency : 'NGN';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: validCurrency,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const openServicesModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowServicesModal(true);
  };
  
  const closeServicesModal = () => {
    setShowServicesModal(false);
    setSelectedPayment(null);
  };
  
  // Calculate totals
  const totalRevenue = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const completedPayments = payments.filter(p => p.paymentStatus === 'completed').length;
  
  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Table container with fixed height for scroll */
        .table-container {
          max-height: calc(100vh - 300px);
          overflow-y: auto;
        }
        
        @media (min-width: 768px) {
          .table-container {
            max-height: calc(100vh - 280px);
          }
        }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payments</h1>
          <p className="text-gray-600">Manage and monitor all subscription payments</p>
        </div>
        
        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue, 'NGN')}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedPayments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.paymentStatus === 'pending').length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Action Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            

          </div>
        </div>

        {/* Payments Table with Scroll */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D2A8B]"></div>
            </div>
          ) : (
            <div className="table-container">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <p className="text-lg font-medium">No payments found</p>
                          <p className="text-sm mt-1">Try adjusting your search</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{payment._id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{payment.userInfo.fullName}</div>
                              <div className="text-sm text-gray-500">{payment.userInfo.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-900">{payment.packageTitle}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {payment.subscriptionDuration}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => openServicesModal(payment)}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full hover:bg-purple-200 transition-colors"
                          >
                            View Services ({payment.services.length})
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amountPaid, 'NGN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                            {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Services Modal */}
        {showServicesModal && selectedPayment && (
          <div className="fixed inset-0 ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 flex items-start justify-center z-50">
            <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[70vh] overflow-hidden mt-16">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Services for {selectedPayment.userInfo.fullName}
                  </h3>
                  <button
                    onClick={closeServicesModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Package: {selectedPayment.packageTitle}
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {selectedPayment.services.map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {service.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Service ID: {service.serviceId}
                      </p>
                    </div>
                  ))}
                  
                  {selectedPayment.services.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No services found for this subscription</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeServicesModal}
                  className="w-full px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;