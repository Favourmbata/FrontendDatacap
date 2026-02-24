


"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  ChevronUp,
  ChevronDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PickupCenterService, { PickupCenter } from '@/services/pickCenter';

const PickupCenterList = () => {
  const router = useRouter();
  const [allPickupCenters, setAllPickupCenters] = useState<PickupCenter[]>([]);
  const [displayedCenters, setDisplayedCenters] = useState<PickupCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PickupCenter | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

 
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });


  const [statusFilter, setStatusFilter] = useState<string>('all');

  
  const fetchAllPickupCenters = async () => {
    try {
      setLoading(true);
    
      const response = await PickupCenterService.getPickupCenters({ 
        limit: 1000 
      });
      
      setAllPickupCenters(response.pickupCenters);
      setPagination(prev => ({
        ...prev,
        totalItems: response.pickupCenters.length,
        totalPages: Math.ceil(response.pickupCenters.length / prev.itemsPerPage)
      }));
      
    } catch (error: any) {
      console.error('Error fetching pickup centers:', error);
      toast.error(error.message || 'Failed to fetch pickup centers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPickupCenters();
  }, []);

  
  const filteredAndSortedCenters = useMemo(() => {
    let filtered = [...allPickupCenters];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(center => 
        center.centerName.toLowerCase().includes(searchLower) ||
        center.address.toLowerCase().includes(searchLower) ||
        center.contactNumber.toLowerCase().includes(searchLower)
      );
      console.log(`Search for "${searchTerm}" found ${filtered.length} results`);
    }

    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(center => 
        (center.status || (center.isActive ? 'active' : 'inactive')) === statusFilter
      );
    }

 
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.sortBy as keyof PickupCenter];
      let bValue: any = b[sortConfig.sortBy as keyof PickupCenter];

     
      if (sortConfig.sortBy === 'createdAt' || sortConfig.sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle amount field
      if (sortConfig.sortBy === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

  
      if (sortConfig.sortBy === 'status') {
        aValue = a.status || (a.isActive ? 'active' : 'inactive');
        bValue = b.status || (b.isActive ? 'active' : 'inactive');
      }

      if (aValue < bValue) {
        return sortConfig.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [allPickupCenters, searchTerm, statusFilter, sortConfig]);


  useEffect(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedCenters = filteredAndSortedCenters.slice(startIndex, endIndex);
    
    setDisplayedCenters(paginatedCenters);
    setPagination(prev => ({
      ...prev,
      totalItems: filteredAndSortedCenters.length,
      totalPages: Math.ceil(filteredAndSortedCenters.length / prev.itemsPerPage)
    }));
  }, [filteredAndSortedCenters, pagination.currentPage, pagination.itemsPerPage]);


  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [searchTerm, statusFilter, sortConfig]);

  const handleView = (center: PickupCenter) => {
    router.push(`/super-admin/pickup-center/view/${center.id}`);
  };

  const handleEdit = (center: PickupCenter) => {
    router.push(`/super-admin/pickup-center/edit/${center.id}`);
  };

  const handleDelete = (center: PickupCenter) => {
    setItemToDelete(center);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      const result = await PickupCenterService.deletePickupCenter(itemToDelete.id);
      
      if (result.success) {
        toast.success('Pickup center deleted successfully');
       
        setAllPickupCenters(prev => prev.filter(c => c.id !== itemToDelete.id));
        setShowDeleteModal(false);
        setItemToDelete(null);
      } else {
        toast.error(result.message || 'Failed to delete pickup center');
      }
    } catch (error: any) {
      console.error('Error deleting pickup center:', error);
      toast.error(error.message || 'Failed to delete pickup center');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    console.log(`Changing from page ${pagination.currentPage} to ${newPage}`);
    console.log(`Total pages available: ${pagination.totalPages}`);
    
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
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

  const getStatusBadge = (status: 'active' | 'inactive') => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === 'active') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
    }
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactive</span>;
  };

  const formatAmount = (amount: number) => {
    return PickupCenterService.formatAmount(amount);
  };

  if (loading && allPickupCenters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
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
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pickup Center Management</h1>
              <p className="text-gray-600 mt-2">Manage pickup centers and their operating details</p>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
              onClick={() => router.push('/super-admin/pickup-center/create')}
            >
              <Plus className="w-5 h-5" />
              Add Pickup Center
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Centers</p>
                <p className="text-2xl font-bold text-gray-900">{allPickupCenters.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPickupCenters.filter(c => (c.status || (c.isActive ? 'active' : 'inactive')) === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPickupCenters.filter(c => (c.status || (c.isActive ? 'active' : 'inactive')) === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <span className="text-blue-600 font-bold text-xl">₦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPickupCenters.length > 0
                    ? formatAmount(allPickupCenters.reduce((sum, c) => sum + c.amount, 0) / allPickupCenters.length)
                    : formatAmount(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search by center name, address, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                  Found {filteredAndSortedCenters.length} results for "{searchTerm}"
                </div>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[140px] bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

           
              <select
                value={pagination.itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[120px] bg-white"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
      
        
        </div>

     
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('centerName')}
                  >
                    <div className="flex items-center gap-1">
                      Center Name
                      {sortConfig.sortBy === 'centerName' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Hours
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortConfig.sortBy === 'amount' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.sortBy === 'status' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Created
                      {sortConfig.sortBy === 'createdAt' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedCenters.length > 0 ? (
                  displayedCenters.map((center) => (
                    <tr key={center.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{center.centerName}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {center.id.slice(-8)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{center.address}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{center.contactNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {center.operatingDays}
                          </div>
                          <div className="flex items-center text-sm text-gray-700 mt-1">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            {center.operatingHours}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">
                          {formatAmount(center.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(center.status || (center.isActive ? 'active' : 'inactive'))}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(center.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(center)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(center)}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(center)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 px-6 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <MapPin className="w-16 h-16 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No pickup centers found</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                          {searchTerm || statusFilter !== 'all'
                            ? 'No pickup centers match your search criteria. Try adjusting your filters.'
                            : 'Get started by creating your first pickup center.'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                          <button 
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            onClick={() => router.push('/super-admin/pickup-center/create')}
                          >
                            <Plus className="w-5 h-5" />
                            Add Your First Pickup Center
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredAndSortedCenters.length > 0 && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} pickup centers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    pagination.currentPage === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                
                  {pagination.currentPage > 3 && pagination.totalPages > 5 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="min-w-[40px] h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        1
                      </button>
                      {pagination.currentPage > 4 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[40px] h-10 rounded-lg transition-colors ${
                          pagination.currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  
                  {pagination.currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                    <>
                      {pagination.currentPage < pagination.totalPages - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="min-w-[40px] h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    console.log('Next button clicked');
                    console.log('Current page:', pagination.currentPage);
                    console.log('Total pages:', pagination.totalPages);
                    console.log('Can go next:', pagination.currentPage < pagination.totalPages);
                    handlePageChange(pagination.currentPage + 1);
                  }}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    pagination.currentPage >= pagination.totalPages
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.centerName || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default PickupCenterList;