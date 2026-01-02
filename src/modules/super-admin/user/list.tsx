"use client";

import React, { useState, useEffect } from 'react';
import { superAdminUserModule, Customer, GetCustomersParams } from './userModule';
import ActionModal from '../../../components/SuperAdminActionModal';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';

const SuperAdminUserList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionModalPosition, setActionModalPosition] = useState({ top: 0, left: 0 });
  const [selectedCustomerForActions, setSelectedCustomerForActions] = useState<Customer | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: '' as 'active' | 'suspended' | 'inactive' | '',
    state: '',
    lga: '',
    fromDate: '',
    toDate: ''
  });

  const [exportLoading, setExportLoading] = useState<'csv' | 'excel' | 'pdf' | null>(null); // Track export loading state
  const [showExportDropdown, setShowExportDropdown] = useState(false); // Track export dropdown visibility

  const pageSize = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: GetCustomersParams = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: filters.status || undefined,
        state: filters.state || undefined,
        lga: filters.lga || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        sortBy: 'accountCreatedOn',
        sortOrder: 'desc'
      };

      const response = await superAdminUserModule.getCustomers(params);
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
      setTotalCustomers(response.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFilters(prev => ({
        ...prev,
        status: value as 'active' | 'suspended' | 'inactive' | ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setCurrentPage(1);
  };

  const handleAction = (customer: Customer, action: string) => {
    setSelectedCustomer(customer);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await superAdminUserModule.deleteCustomer(selectedCustomer.id);
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const confirmAction = async () => {
    if (!selectedCustomer) return;

    try {
      if (actionType === 'status') {
        // Update status action
        await superAdminUserModule.updateCustomerStatus(selectedCustomer.id, {
          status: selectedCustomer.status === 'active' ? 'suspended' : 'active'
        });
      } else if (actionType === 'reset-password') {
        // Reset password action
        const response = await superAdminUserModule.resetCustomerPassword(selectedCustomer.id);
        alert(response.data.message); // Show the reset password message
      }

      setShowActionModal(false);
      setSelectedCustomer(null);
      fetchCustomers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActionClick = (customer: Customer, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedCustomerForActions(customer);
    
    // Calculate position to ensure modal stays within viewport
    const buttonRect = (e.target as Element).getBoundingClientRect();
    const top = buttonRect.bottom + window.scrollY;
    const left = Math.max(buttonRect.left - 150, 10); // Position to the left of the button, with minimum 10px from left edge
    
    // Ensure the modal doesn't go off the bottom of the screen
    const modalHeight = 150; // Approximate height of the action modal
    const adjustedTop = (buttonRect.bottom + window.scrollY + modalHeight > document.body.scrollHeight) 
      ? buttonRect.top + window.scrollY - modalHeight 
      : buttonRect.bottom + window.scrollY;
    
    setActionModalPosition({
      top: adjustedTop,
      left,
    });
    setShowActionMenu(true);
  };

  const handleViewCustomer = () => {
    if (selectedCustomerForActions) {
      // Navigate to view customer page
      console.log('View customer:', selectedCustomerForActions.id);
      setShowActionMenu(false);
    }
  };

  const handleEditCustomer = () => {
    if (selectedCustomerForActions) {
      // Navigate to edit customer page
      console.log('Edit customer:', selectedCustomerForActions.id);
      setShowActionMenu(false);
    }
  };

  const handleStatusChange = () => {
    if (selectedCustomerForActions) {
      handleAction(selectedCustomerForActions, 'status');
      setShowActionMenu(false);
    }
  };

  const handleResetPassword = () => {
    if (selectedCustomerForActions) {
      handleAction(selectedCustomerForActions, 'reset-password');
      setShowActionMenu(false);
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomerForActions) {
      handleDelete(selectedCustomerForActions);
      setShowActionMenu(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error: {error}
        <button 
          onClick={() => fetchCustomers()} 
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const router = useRouter();

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setExportLoading(format);
      const blob = await superAdminUserModule.exportCustomers(format);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to export customers as ${format.toUpperCase()}`);
      console.error('Export error:', err);
    } finally {
      setExportLoading(null);
    }
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportDropdown && !target.closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/super-admin/users/create')}
            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Create New User
          </button>
                    
          {/* Export Dropdown */}
          <div className="relative export-dropdown">
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center gap-2"
              disabled={exportLoading !== null}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            >
              {exportLoading ? (
                <span>Exporting...</span>
              ) : (
                <span>Export</span>
              )}
            </button>
                      
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => { handleExport('csv'); setShowExportDropdown(false); }}
                  disabled={exportLoading !== null}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => { handleExport('excel'); setShowExportDropdown(false); }}
                  disabled={exportLoading !== null}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => { handleExport('pdf'); setShowExportDropdown(false); }}
                  disabled={exportLoading !== null}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="Filter by state"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
            <input
              type="text"
              name="lga"
              value={filters.lga}
              onChange={handleFilterChange}
              placeholder="Filter by LGA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
         
        </form>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(customer.accountCreatedOn).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleActionClick(customer, e)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="More actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalCustomers)}
                    </span>{' '}
                    of <span className="font-medium">{totalCustomers}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={confirmAction}
        actionType={actionType}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        item="customer"
        itemName={selectedCustomer?.customerName || ''}
      />

      {/* Action Menu Modal */}
      {showActionMenu && selectedCustomerForActions && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setShowActionMenu(false)}
          />
          
          <div 
            className="fixed bg-white shadow-lg rounded-lg z-50"
            style={{
              top: `${actionModalPosition.top}px`,
              left: `${actionModalPosition.left}px`,
              width: '155px',
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '0px 2px 8px 0px #5D2A8B1A',
              border: '1px solid #E4D8F3'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <button 
                className="text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#1A1A1A',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCustomer();
                }}
              >
                View
              </button>
              
              <button 
                className="text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#1A1A1A',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCustomer();
                }}
              >
                Edit
              </button>
              
              <button 
                className="text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#1A1A1A',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange();
                }}
              >
                {selectedCustomerForActions.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              
              <button 
                className="text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#1A1A1A',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetPassword();
                }}
              >
                Reset Password
              </button>
              
              <button 
                className="text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#FF6161',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCustomer();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminUserList;