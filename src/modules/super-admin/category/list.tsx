"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Download, ChevronUp, ChevronDown } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryService, { Category, GetCategoriesParams } from '@/services/CategoryService';
import IndustryService from '@/services/industryService';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '' as 'delete' | 'toggleStatus' | '',
    item: null as Category | null,
    statusToSet: '' as 'active' | 'inactive' | '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc',
  });
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<Array<{ value: string; label: string }>>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

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

  // Fetch categories from API
  const fetchCategories = async (params?: GetCategoriesParams) => {
    try {
      setLoading(true);
      const defaultParams: GetCategoriesParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        industryId: selectedIndustry !== 'all' ? selectedIndustry : undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      };

      const response = await CategoryService.getCategories({
        ...defaultParams,
        ...params,
      });
      
      setCategories(response.categories);
      setFilteredCategories(response.categories);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, sortConfig, selectedIndustry]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchCategories();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = (category: Category) => {
    window.location.href = `/super-admin/category/view/${category.id}`;
  };

  const handleEdit = (category: Category) => {
    window.location.href = `/super-admin/category/edit/${category.id}`;
  };

  const handleDelete = (category: Category) => {
    setActionModalConfig({
      action: 'delete',
      item: category,
      statusToSet: '',
    });
    setShowActionModal(true);
  };

  const handleToggleStatus = (category: Category) => {
    setActionModalConfig({
      action: 'toggleStatus',
      item: category,
      statusToSet: category.status === 'active' ? 'inactive' : 'active',
    });
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!actionModalConfig.item) return;

    try {
      if (actionModalConfig.action === 'delete') {
        const result = await CategoryService.deleteCategory(actionModalConfig.item.id);
        if (result.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        } else {
          toast.error(result.message || 'Failed to delete category');
        }
      } else if (actionModalConfig.action === 'toggleStatus') {
        const updatedCategory = await CategoryService.updateCategoryStatus(
          actionModalConfig.item.id,
          actionModalConfig.statusToSet as 'active' | 'inactive'
        );
        toast.success(`Category ${actionModalConfig.statusToSet === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchCategories();
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
      await CategoryService.exportCategories(format, {
        search: searchTerm || undefined,
        industryId: selectedIndustry !== 'all' ? selectedIndustry : undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      });
      toast.success(`Categories exported as ${format.toUpperCase()} successfully`);
    } catch (error: any) {
      console.error('Error exporting categories:', error);
      toast.error(error.message || 'Failed to export categories');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
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

  if (loading && categories.length === 0) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Management</h1>
          <p className="text-gray-600">Manage categories for the platform</p>
        </div>

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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Management</h1>
        <p className="text-gray-600">Manage categories for the platform</p>
      </div>

      {/* Controls Section - Above the table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-all"
                  placeholder="Search categories by name, description, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex items-center gap-2">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] min-w-[140px]"
                  value={sortConfig.sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Date Updated</option>
                  <option value="status">Status</option>
                </select>
                <button
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort(sortConfig.sortBy)}
                  title={sortConfig.sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
                >
                  {sortConfig.sortOrder === 'asc' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Export and Add Buttons */}
            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
                  disabled={exportLoading}
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
                
                {showExportDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <button
                        onClick={() => handleExport('csv')}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-t border-gray-100"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Add Category Button */}
              <button 
                className="flex items-center gap-2 bg-[#5D2A8B] text-white px-4 py-2.5 rounded-lg hover:bg-[#4a216d] transition-colors min-w-[140px] justify-center"
                onClick={() => window.location.href = '/super-admin/category/create'}
              >
                <Plus className="w-5 h-5" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Category Name</span>
                    {sortConfig.sortBy === 'name' && (
                      <span>
                        {sortConfig.sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  Industry
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  Description
                </th>
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {sortConfig.sortBy === 'status' && (
                      <span>
                        {sortConfig.sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  Created Date
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500 mt-1">ID: {category.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700 font-medium">{category.industryName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500 mt-1">ID: {category.industryId}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-md">
                      <div className="line-clamp-2" title={category.description}>
                        {category.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(category.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(category)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      
                        <button 
                          onClick={() => handleDelete(category)}
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
                  <td colSpan={6} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No categories found</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        {searchTerm || selectedIndustry !== 'all' 
                          ? `No results for "${searchTerm}"${selectedIndustry !== 'all' ? ` in selected industry` : ''}` 
                          : 'Start by adding your first category to get started'}
                      </p>
                      {!searchTerm && selectedIndustry === 'all' && (
                        <button 
                          className="flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
                          onClick={() => window.location.href = '/super-admin/category/create'}
                        >
                          <Plus className="w-5 h-5" />
                          Add Your First Category
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} categories
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  pagination.page === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
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
                      className={`min-w-[40px] h-10 rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-[#5D2A8B] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
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
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  pagination.page >= pagination.totalPages
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

      {/* Action Modals */}
      {actionModalConfig.action === 'delete' && (
        <DeleteConfirmationModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={confirmAction}
          itemName={actionModalConfig.item?.name || ''}
          loading={deleteLoading}
        />
      )}

      {actionModalConfig.action === 'toggleStatus' && (
        <SuperAdminActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={confirmAction}
          title={`${actionModalConfig.statusToSet === 'active' ? 'Activate' : 'Deactivate'} Category`}
          message={`Are you sure you want to ${actionModalConfig.statusToSet === 'active' ? 'activate' : 'deactivate'} "${actionModalConfig.item?.name}"?`}
          confirmText={actionModalConfig.statusToSet === 'active' ? 'Activate' : 'Deactivate'}
          confirmColor={actionModalConfig.statusToSet === 'active' ? 'green' : 'orange'}
        />
      )}
    </div>
  );
};

export default CategoryList;