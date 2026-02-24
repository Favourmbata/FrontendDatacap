


"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Eye, Trash2, ChevronUp, ChevronDown, Download } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryService, { Category } from '@/services/CategoryService';
import IndustryService from '@/services/industryService';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CategoryList = () => {
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '' as 'delete' | 'toggleStatus' | '',
    item: null as Category | null,
    statusToSet: '' as 'active' | 'inactive' | '',
  });
  
  
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

  // Filter state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<Array<{ value: string; label: string }>>([]);

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

  // Fetch all categories
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      // Fetch all categories without pagination for client-side filtering
      const response = await CategoryService.getCategories({ 
        limit: 1000 // Get a large number for client-side filtering
      });
      
      setAllCategories(response.categories);
      setPagination(prev => ({
        ...prev,
        totalItems: response.categories.length,
        totalPages: Math.ceil(response.categories.length / prev.itemsPerPage)
      }));
      
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and storage event listener
  useEffect(() => {
    fetchAllCategories();
    
    // Listen for storage events to refresh data when another tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'categories_lastUpdated') {
        fetchAllCategories();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter and sort categories based on search, industry, and sort config
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = [...allCategories];

    // Apply search filter (searches in name, description, and industry)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower) ||
        (category.industryName || '').toLowerCase().includes(searchLower)
      );
      console.log(`Search for "${searchTerm}" found ${filtered.length} results`);
    }

    // Apply industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(category => category.industryId === selectedIndustry);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.sortBy as keyof Category];
      let bValue: any = b[sortConfig.sortBy as keyof Category];

      // Handle date fields
      if (sortConfig.sortBy === 'createdAt' || sortConfig.sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle status field
      if (sortConfig.sortBy === 'status') {
        aValue = a.status;
        bValue = b.status;
      }

      // Handle name field (case-insensitive)
      if (sortConfig.sortBy === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
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
  }, [allCategories, searchTerm, selectedIndustry, sortConfig]);

  // Update displayed categories based on pagination
  useEffect(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedCategories = filteredAndSortedCategories.slice(startIndex, endIndex);
    
    setDisplayedCategories(paginatedCategories);
    setPagination(prev => ({
      ...prev,
      totalItems: filteredAndSortedCategories.length,
      totalPages: Math.ceil(filteredAndSortedCategories.length / prev.itemsPerPage)
    }));
  }, [filteredAndSortedCategories, pagination.currentPage, pagination.itemsPerPage]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [searchTerm, selectedIndustry, sortConfig]);

  // Export functions
  const exportToCSV = () => {
    try {
      setExportLoading(true);
      
      // Prepare data for export
      const exportData = filteredAndSortedCategories.map(category => ({
        'Category Name': category.name,
        'Industry': category.industryName || 'Unknown',
        'Description': category.description,
        'Status': category.status,
        'Created Date': new Date(category.createdAt).toLocaleDateString(),
        'Last Updated': new Date(category.updatedAt).toLocaleDateString(),
        'Category ID': category.id,
        'Industry ID': category.industryId
      }));

        if (exportData.length > 0) {
      const headers = Object.keys(exportData[0]) as Array<keyof typeof exportData[0]>;
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No data to export');
    }
    
    toast.success('Categories exported as CSV successfully');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    toast.error('Failed to export categories as CSV');
  } finally {
    setExportLoading(false);
    setShowExportDropdown(false);
  }
};

  const exportToExcel = () => {
    try {
      setExportLoading(true);
      
      // Prepare data for export
      const exportData = filteredAndSortedCategories.map(category => ({
        'Category Name': category.name,
        'Industry': category.industryName || 'Unknown',
        'Description': category.description,
        'Status': category.status,
        'Created Date': new Date(category.createdAt).toLocaleDateString(),
        'Last Updated': new Date(category.updatedAt).toLocaleDateString(),
        'Category ID': category.id,
        'Industry ID': category.industryId
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

      // Generate Excel file
      XLSX.writeFile(workbook, `categories_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Categories exported as Excel successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export categories as Excel');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  const exportToPDF = () => {
    try {
      setExportLoading(true);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Categories Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      // Add filters info
      let filterInfo = 'Filters: ';
      if (searchTerm) filterInfo += `Search: "${searchTerm}" `;
      if (selectedIndustry !== 'all') {
        const industry = industries.find(i => i.value === selectedIndustry);
        filterInfo += `Industry: ${industry?.label || selectedIndustry} `;
      }
      if (filterInfo === 'Filters: ') filterInfo += 'None';
      doc.text(filterInfo, 14, 38);

      // Prepare table data
      const tableHeaders = [['Name', 'Industry', 'Description', 'Status', 'Created Date']];
      const tableData = filteredAndSortedCategories.map(category => [
        category.name,
        category.industryName || 'Unknown',
        category.description.length > 50 ? category.description.substring(0, 50) + '...' : category.description,
        category.status,
        new Date(category.createdAt).toLocaleDateString()
      ]);

      // Generate table
      autoTable(doc, {
        head: tableHeaders,
        body: tableData,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [93, 42, 139], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Save PDF
      doc.save(`categories_export_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('Categories exported as PDF successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export categories as PDF');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  const handleView = (category: Category) => {
    router.push(`/super-admin/category/view/${category.id}`);
  };

  const handleEdit = (category: Category) => {
    router.push(`/super-admin/category/edit/${category.id}`);
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
      setDeleteLoading(true);
      if (actionModalConfig.action === 'delete') {
        const result = await CategoryService.deleteCategory(actionModalConfig.item.id);
        if (result.success) {
          toast.success('Category deleted successfully');
          // Remove from local state
          setAllCategories(prev => prev.filter(c => c.id !== actionModalConfig.item!.id));
        } else {
          toast.error(result.message || 'Failed to delete category');
        }
      } else if (actionModalConfig.action === 'toggleStatus') {
        const updatedCategory = await CategoryService.updateCategoryStatus(
          actionModalConfig.item.id,
          actionModalConfig.statusToSet as 'active' | 'inactive'
        );
        toast.success(`Category ${actionModalConfig.statusToSet === 'active' ? 'activated' : 'deactivated'} successfully`);
        // Update local state
        setAllCategories(prev => prev.map(c => 
          c.id === actionModalConfig.item!.id ? updatedCategory : c
        ));
      }
      
      // Update timestamp to notify other tabs
      localStorage.setItem('categories_lastUpdated', Date.now().toString());
      
    } catch (error: any) {
      console.error('Error performing action:', error);
      toast.error(error.message || 'Action failed');
    } finally {
      setDeleteLoading(false);
      setShowActionModal(false);
      setActionModalConfig({
        action: '',
        item: null,
        statusToSet: '',
      });
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
      // Scroll to top of table
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

  if (loading && allCategories.length === 0) {
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
                  placeholder="Search by name, description, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                  Found {filteredAndSortedCategories.length} results for "{searchTerm}"
                </div>
              )}
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

          {/* Action Buttons Row - Moved to the right */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
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
                      onClick={exportToCSV}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors border-t border-gray-100"
                    >
                      Export as PDF
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Items per page selector */}
            <select
              value={pagination.itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] min-w-[120px]"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>

            {/* Add Category Button */}
            <button 
              className="flex items-center gap-2 bg-[#5D2A8B] text-white px-4 py-2.5 rounded-lg hover:bg-[#4a216d] transition-colors min-w-[140px] justify-center"
              onClick={() => router.push('/super-admin/category/create')}
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
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
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    <span>Created Date</span>
                    {sortConfig.sortBy === 'createdAt' && (
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedCategories.length > 0 ? (
                displayedCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500 mt-1">ID: {category.id.slice(-8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700 font-medium">{category.industryName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500 mt-1">ID: {category.industryId.slice(-8)}</div>
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
                          onClick={() => router.push('/super-admin/category/create')}
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
        {filteredAndSortedCategories.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} categories
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
                {/* First page */}
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

                {/* Page numbers */}
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
                          ? 'bg-[#5D2A8B] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Last page */}
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