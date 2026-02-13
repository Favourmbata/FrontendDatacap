"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Eye, Trash2, MoreVertical, Download, AlertCircle } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlatformCommissionService, { 
  PlatformCommission, 
  GetPlatformCommissionsParams 
} from '@/services/PlatformCommissionService';
import IndustryService from '@/services/industryService';
import CategoryService from '@/services/CategoryService';

const PlatformCommissionList = () => {
  const router = useRouter();
  const [commissions, setCommissions] = useState<PlatformCommission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<PlatformCommission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '' as 'delete' | 'toggleStatus' | '',
    item: null as PlatformCommission | null,
    statusToSet: '' as 'active' | 'inactive' | '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'commissionName',
    sortOrder: 'asc' as 'asc' | 'desc',
  });
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [industries, setIndustries] = useState<Array<{ value: string; label: string }>>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch industries for filter dropdown
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const industriesList = await IndustryService.getIndustriesForSelect();
        setIndustries([{ value: 'all', label: 'All Industries' }, ...industriesList]);
      } catch (error) {
        console.error('Error fetching industries:', error);
      }
    };

    fetchIndustries();
  }, []);

  // Fetch categories when industry changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (selectedIndustry !== 'all') {
          const categoriesList = await CategoryService.getCategoriesForSelect(selectedIndustry);
          setCategories([{ value: 'all', label: 'All Categories' }, ...categoriesList]);
        } else {
          setCategories([{ value: 'all', label: 'All Categories' }]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [selectedIndustry]);

  // Fetch platform commissions from API
  const fetchPlatformCommissions = async (params?: GetPlatformCommissionsParams) => {
    try {
      setLoading(true);
      const defaultParams: GetPlatformCommissionsParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        industryId: selectedIndustry !== 'all' ? selectedIndustry : undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      };

      const response = await PlatformCommissionService.getPlatformCommissions({
        ...defaultParams,
        ...params,
      });
      
      setCommissions(response.commissions);
      setFilteredCommissions(response.commissions);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      
    } catch (error: any) {
      console.error('Error fetching platform commissions:', error);
      toast.error(error.message || 'Failed to fetch platform commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformCommissions();
  }, [pagination.page, sortConfig, selectedIndustry, selectedCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchPlatformCommissions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = (commission: PlatformCommission) => {
    router.push(`/super-admin/platform-commission/view/${commission.id}`);
  };

  const handleEdit = (commission: PlatformCommission) => {
    router.push(`/super-admin/platform-commission/edit/${commission.id}`);
  };

  const handleDelete = (commission: PlatformCommission) => {
    setActionModalConfig({
      action: 'delete',
      item: commission,
      statusToSet: '',
    });
    setShowActionModal(true);
  };

  const handleToggleStatus = (commission: PlatformCommission) => {
    setActionModalConfig({
      action: 'toggleStatus',
      item: commission,
      statusToSet: commission.status === 'active' ? 'inactive' : 'active',
    });
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!actionModalConfig.item) return;

    try {
      if (actionModalConfig.action === 'delete') {
        const result = await PlatformCommissionService.deletePlatformCommission(actionModalConfig.item.id);
        if (result.success) {
          toast.success('Platform commission deleted successfully');
          fetchPlatformCommissions();
        } else {
          toast.error(result.message || 'Failed to delete platform commission');
        }
      } else if (actionModalConfig.action === 'toggleStatus') {
        const updatedCommission = await PlatformCommissionService.updatePlatformCommissionStatus(
          actionModalConfig.item.id,
          actionModalConfig.statusToSet as 'active' | 'inactive'
        );
        toast.success(`Platform commission ${actionModalConfig.statusToSet === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchPlatformCommissions();
      }
    } catch (error: any) {
      console.error('Error performing action:', error);
      toast.error(error.message || 'Action failed');
    } finally {
      setShowActionModal(false);
      setActionModalConfig({
        action: '',
        item: null,
        statusToSet: '',
      });
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setExportLoading(true);
      await PlatformCommissionService.exportPlatformCommissions(format, {
        search: searchTerm || undefined,
        industryId: selectedIndustry !== 'all' ? selectedIndustry : undefined,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      });
      toast.success(`Platform commissions exported as ${format.toUpperCase()} successfully`);
    } catch (error: any) {
      console.error('Error exporting platform commissions:', error);
      toast.error(error.message || 'Failed to export platform commissions');
    } finally {
      setExportLoading(false);
    }
  };

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
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

  const getCommissionRateDisplay = (rate: number) => {
    return `${rate}%`;
  };

  if (loading && commissions.length === 0) {
    return (
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
    );
  }

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Platform Commission Management</h1>
        <p className="text-gray-600">Manage platform commissions for categories and industries</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-all"
                placeholder="Search by commission name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setSelectedCategory('all');
                }}
              >
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={selectedIndustry === 'all'}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                value={sortConfig.sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="commissionName">Name</option>
                <option value="commissionRate">Rate</option>
                <option value="createdAt">Date Created</option>
                <option value="updatedAt">Date Updated</option>
                <option value="status">Status</option>
              </select>
              <button
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => handleSort(sortConfig.sortBy)}
              >
                {sortConfig.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            
            <div className="relative group">
              <button 
                className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={exportLoading}
                title="Export"
              >
                <Download className="w-5 h-5" />
                {exportLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Export as PDF
                </button>
              </div>
            </div>
            
            <button 
              className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
              onClick={() => window.location.href = '/super-admin/platform-commission/create'}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Commission
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('commissionName')}
                >
                  <div className="flex items-center">
                    Commission Name
                    {sortConfig.sortBy === 'commissionName' && (
                      <span className="ml-1">{sortConfig.sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Industry</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('commissionRate')}
                >
                  <div className="flex items-center">
                    Rate
                    {sortConfig.sortBy === 'commissionRate' && (
                      <span className="ml-1">{sortConfig.sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Description</th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.sortBy === 'status' && (
                      <span className="ml-1">{sortConfig.sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.length > 0 ? (
                filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{commission.commissionName}</div>
                      <div className="text-sm text-gray-500">ID: {commission.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-600">{commission.industryName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">ID: {commission.industryId}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-600">{commission.categoryName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">ID: {commission.categoryId}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {getCommissionRateDisplay(commission.commissionRate)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 max-w-md truncate" title={commission.description}>
                      {commission.description}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {formatDate(commission.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleView(commission)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(commission)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                       
                        <button 
                          onClick={() => handleDelete(commission)}
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
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No platform commissions found</h3>
                      <p className="text-gray-400 mb-4">
                        {searchTerm || selectedIndustry !== 'all' || selectedCategory !== 'all'
                          ? `No results for "${searchTerm}"${selectedIndustry !== 'all' ? ` in selected industry` : ''}${selectedCategory !== 'all' ? ` and category` : ''}`
                          : 'Start by adding your first platform commission'}
                      </p>
                      {!searchTerm && selectedIndustry === 'all' && selectedCategory === 'all' && (
                        <button 
                          className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
                          onClick={() => window.location.href = '/super-admin/platform-commission/create'}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Add Your First Commission
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} platform commissions
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-lg border ${
                  pagination.page === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`w-8 h-8 rounded-lg ${
                        pagination.page === pageNum
                          ? 'bg-[#5D2A8B] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className={`px-3 py-1 rounded-lg border ${
                  pagination.page >= pagination.totalPages
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModalConfig.action === 'delete' && (
        <DeleteConfirmationModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={confirmAction}
          itemName={actionModalConfig.item?.commissionName || ''}
          loading={deleteLoading}
        />
      )}

      {actionModalConfig.action === 'toggleStatus' && actionModalConfig.item && (
        <SuperAdminActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onEdit={confirmAction}
          onDelete={() => {}} // Not used for status toggle
          onView={() => {
            if (actionModalConfig.item) {
              router.push(`/super-admin/platform-commission/view/${actionModalConfig.item.id}`);
              setShowActionModal(false);
            }
          }}
          itemName={actionModalConfig.item?.commissionName || ''}
        />
      )}
    </div>
  );
};

export default PlatformCommissionList;