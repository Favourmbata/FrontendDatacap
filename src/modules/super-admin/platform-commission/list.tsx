
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Eye, Trash2, X, Download } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import PlatformCommissionService, { 
  PlatformCommission, 
  GetPlatformCommissionsParams 
} from '@/services/PlatformCommissionService';
import IndustryService from '@/services/industryService';
import CategoryService from '@/services/CategoryService';


interface ExportCommission {
  'Commission Name': string;
  'Industry': string;
  'Category': string;
  'Commission Rate (%)': number;
  'Description': string;
  'Status': 'active' | 'inactive';
  'Created Date': string;
  'Last Updated': string;
  'Commission ID': string;
  'Industry ID': string;
  'Category ID': string;
}

const PlatformCommissionList = () => {
  const router = useRouter();
  const [commissions, setCommissions] = useState<PlatformCommission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<PlatformCommission[]>([]);
  const [paginatedCommissions, setPaginatedCommissions] = useState<PlatformCommission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
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
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [industries, setIndustries] = useState<Array<{ value: string; label: string }>>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);
  const [initialLoad, setInitialLoad] = useState(true);


  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const industriesList = await IndustryService.getIndustriesForSelect();
        setIndustries(industriesList);
      } catch (error) {
        console.error('Error fetching industries:', error);
        toast.error('Failed to load industries');
      }
    };

    fetchIndustries();
  }, []);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (selectedIndustry) {
          const categoriesList = await CategoryService.getCategoriesForSelect(selectedIndustry);
          setCategories(categoriesList);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    if (selectedIndustry) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [selectedIndustry]);


  const fetchPlatformCommissions = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: GetPlatformCommissionsParams = {
        page: 1, 
        limit: 100, 
        industryId: selectedIndustry || undefined,
        categoryId: selectedCategory || undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      };

      const response = await PlatformCommissionService.getPlatformCommissions(params);
      
      setCommissions(response.commissions);
      
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.commissions.length,
        totalPages: Math.ceil(response.commissions.length / prev.limit),
      }));
      
      setInitialLoad(false);
      
    } catch (error: any) {
      console.error('Error fetching platform commissions:', error);
      toast.error(error.message || 'Failed to fetch platform commissions');
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }, [selectedIndustry, selectedCategory, sortConfig.sortBy, sortConfig.sortOrder]);


  useEffect(() => {
    fetchPlatformCommissions();
  }, [fetchPlatformCommissions]);


  useEffect(() => {
    setSelectedCategory('');
  }, [selectedIndustry]);

  
  useEffect(() => {
    if (commissions.length > 0) {
      let filtered = [...commissions];
      
   
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(commission => 
          commission.commissionName.toLowerCase().includes(searchLower) ||
          commission.description.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredCommissions(filtered);
      
     
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit),
      }));
    }
  }, [searchTerm, commissions]);


  useEffect(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    setPaginatedCommissions(filteredCommissions.slice(startIndex, endIndex));
  }, [filteredCommissions, pagination.page, pagination.limit]);

  const exportToExcel = (exportAll: boolean = true) => {
    try {
      setExportLoading(true);
      
      const dataToExport = exportAll ? filteredCommissions : paginatedCommissions;
      
      if (dataToExport.length === 0) {
        toast.error('No data to export');
        setExportLoading(false);
        setShowExportDropdown(false);
        return;
      }

     
      const exportData: ExportCommission[] = dataToExport.map(commission => ({
        'Commission Name': commission.commissionName,
        'Industry': commission.industryName || 'Unknown',
        'Category': commission.categoryName || 'Unknown',
        'Commission Rate (%)': commission.commissionRate,
        'Description': commission.description,
        'Status': commission.status,
        'Created Date': new Date(commission.createdAt).toLocaleDateString(),
        'Last Updated': new Date(commission.updatedAt).toLocaleDateString(),
        'Commission ID': commission.id,
        'Industry ID': commission.industryId,
        'Category ID': commission.categoryId
      }));

     
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      const wscols = [
        { wch: 30 }, 
        { wch: 25 }, 
        { wch: 25 }, 
        { wch: 15 },
        { wch: 40 }, 
        { wch: 10 }, 
        { wch: 15 }, 
        { wch: 15 }, 
        { wch: 25 }, 
        { wch: 25 }, 
        { wch: 25 },
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Platform Commissions');

      const dateStr = new Date().toISOString().split('T')[0];
      let filename = exportAll 
        ? `platform_commissions_all_${dateStr}`
        : `platform_commissions_page_${pagination.page}_${dateStr}`;
      

      const filterParts = [];
      if (searchTerm) filterParts.push(`search_${searchTerm.replace(/\s+/g, '_')}`);
      if (selectedIndustry) {
        const industry = industries.find(i => i.value === selectedIndustry);
        if (industry) filterParts.push(`industry_${industry.label.replace(/\s+/g, '_')}`);
      }
      if (selectedCategory) {
        const category = categories.find(c => c.value === selectedCategory);
        if (category) filterParts.push(`category_${category.label.replace(/\s+/g, '_')}`);
      }
      
      if (filterParts.length > 0 && exportAll) {
        filename += `_${filterParts.join('_')}`;
      }

    
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      
      toast.success(`${exportAll ? 'All' : 'Page'} exported as Excel successfully (${dataToExport.length} records)`);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export as Excel');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  
  const exportToCSV = (exportAll: boolean = true) => {
    try {
      setExportLoading(true);
      
      const dataToExport = exportAll ? filteredCommissions : paginatedCommissions;
      
      if (dataToExport.length === 0) {
        toast.error('No data to export');
        setExportLoading(false);
        setShowExportDropdown(false);
        return;
      }

   
      const exportData = dataToExport.map(commission => ({
        'Commission Name': commission.commissionName,
        'Industry': commission.industryName || 'Unknown',
        'Category': commission.categoryName || 'Unknown',
        'Commission Rate (%)': commission.commissionRate,
        'Description': commission.description,
        'Status': commission.status,
        'Created Date': new Date(commission.createdAt).toLocaleDateString(),
        'Last Updated': new Date(commission.updatedAt).toLocaleDateString(),
        'Commission ID': commission.id,
        'Industry ID': commission.industryId,
        'Category ID': commission.categoryId
      }));

      
      if (exportData.length > 0) {
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => {
              const value = row[header as keyof typeof row];
           
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        
        const dateStr = new Date().toISOString().split('T')[0];
        let filename = exportAll 
          ? `platform_commissions_all_${dateStr}`
          : `platform_commissions_page_${pagination.page}_${dateStr}`;
        
        // Add filter info to filename if filters are applied
        const filterParts = [];
        if (searchTerm) filterParts.push(`search_${searchTerm.replace(/\s+/g, '_')}`);
        if (selectedIndustry) {
          const industry = industries.find(i => i.value === selectedIndustry);
          if (industry) filterParts.push(`industry_${industry.label.replace(/\s+/g, '_')}`);
        }
        if (selectedCategory) {
          const category = categories.find(c => c.value === selectedCategory);
          if (category) filterParts.push(`category_${category.label.replace(/\s+/g, '_')}`);
        }
        
        if (filterParts.length > 0 && exportAll) {
          filename += `_${filterParts.join('_')}`;
        }

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`${exportAll ? 'All' : 'Page'} exported as CSV successfully (${dataToExport.length} records)`);
      }
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export as CSV');
    } finally {
      setExportLoading(false);
      setShowExportDropdown(false);
    }
  };

  
const exportToPDF = (exportAll: boolean = true) => {
  try {
    setExportLoading(true);
    
    const dataToExport = exportAll ? filteredCommissions : paginatedCommissions;
    
    if (dataToExport.length === 0) {
      toast.error('No data to export');
      setExportLoading(false);
      setShowExportDropdown(false);
      return;
    }

    // Dynamically import jspdf and jspdf-autotable
    Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]).then(([jsPDFModule, autoTableModule]) => {
      const jsPDF = jsPDFModule.default;
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Platform Commissions Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      // Add filters info
      let filterInfo = 'Filters: ';
      if (searchTerm) filterInfo += `Search: "${searchTerm}" `;
      if (selectedIndustry) {
        const industry = industries.find(i => i.value === selectedIndustry);
        filterInfo += `Industry: ${industry?.label || selectedIndustry} `;
      }
      if (selectedCategory) {
        const category = categories.find(c => c.value === selectedCategory);
        filterInfo += `Category: ${category?.label || selectedCategory} `;
      }
      if (filterInfo === 'Filters: ') filterInfo += 'None';
      
      // Add page info if exporting current page
      if (!exportAll) {
        doc.text(`Page ${pagination.page} of ${pagination.totalPages}`, 14, 38);
        doc.text(filterInfo, 14, 46);
      } else {
        doc.text(filterInfo, 14, 38);
      }

      // Prepare table data
      const tableHeaders = [['Name', 'Industry', 'Category', 'Rate', 'Status', 'Created Date']];
      const tableData = dataToExport.map(commission => [
        commission.commissionName,
        commission.industryName || 'Unknown',
        commission.categoryName || 'Unknown',
        `${commission.commissionRate}%`,
        commission.status,
        new Date(commission.createdAt).toLocaleDateString()
      ]);

      // Calculate start Y position
      const startY = exportAll ? 45 : 53;

      // Use autoTable from the imported module
      autoTableModule.default(doc, {
        head: tableHeaders,
        body: tableData,
        startY: startY,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [93, 42, 139], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

     
      const dateStr = new Date().toISOString().split('T')[0];
      let filename = exportAll 
        ? `platform_commissions_${dateStr}`
        : `platform_commissions_page_${pagination.page}_${dateStr}`;
      
      const filterParts = [];
      if (searchTerm) filterParts.push(`search_${searchTerm.replace(/\s+/g, '_')}`);
      if (selectedIndustry) {
        const industry = industries.find(i => i.value === selectedIndustry);
        if (industry) filterParts.push(`industry_${industry.label.replace(/\s+/g, '_')}`);
      }
      if (selectedCategory) {
        const category = categories.find(c => c.value === selectedCategory);
        if (category) filterParts.push(`category_${category.label.replace(/\s+/g, '_')}`);
      }
      
      if (filterParts.length > 0 && exportAll) {
        filename += `_${filterParts.join('_')}`;
      }

      // Save PDF
      doc.save(`${filename}.pdf`);
      
      toast.success(`${exportAll ? 'All' : 'Page'} exported as PDF successfully (${dataToExport.length} records)`);
      setExportLoading(false);
      setShowExportDropdown(false);
    }).catch(error => {
      console.error('Error loading PDF libraries:', error);
      toast.error('Failed to load PDF libraries');
      setExportLoading(false);
      setShowExportDropdown(false);
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Failed to export as PDF');
    setExportLoading(false);
    setShowExportDropdown(false);
  }
};

 
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

    setDeleteLoading(true);
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

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
 
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (loading && initialLoad) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Platform Commission Management</h1>
        <p className="text-gray-600">Manage platform commissions for categories and industries</p>
      </div>

      {/* Controls Section - Above the table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-all text-base"
                  placeholder="Search by commission name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                  Found {filteredCommissions.length} results for "{searchTerm}"
                </div>
              )}
            </div>

            {/* Industry Filter */}
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] text-base bg-white"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={!selectedIndustry}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
          
          <div className="relative">
  <button 
    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
    disabled={exportLoading || filteredCommissions.length === 0}
    onClick={() => setShowExportDropdown(!showExportDropdown)}
  >
    <Download className="w-5 h-5" />
    <span>Export</span>
    {exportLoading && (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
    )}
  </button>
  
  {showExportDropdown && (
    <>
      <div 
        className="fixed inset-0 z-10"
        onClick={() => setShowExportDropdown(false)}
      />
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
        <div className="py-1">
          <button
            onClick={() => exportToExcel(true)}
            disabled={exportLoading || filteredCommissions.length === 0}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export as Excel
          </button>
          
          <button
            onClick={() => exportToCSV(true)}
            disabled={exportLoading || filteredCommissions.length === 0}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export as CSV
          </button>
          
          <button
            onClick={() => exportToPDF(true)}
            disabled={exportLoading || filteredCommissions.length === 0}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </>
  )}
</div>

           
            <button 
              className="flex items-center justify-center bg-[#5D2A8B] text-white px-6 py-3 rounded-lg hover:bg-[#4a216d] transition-colors whitespace-nowrap min-w-[160px]"
              onClick={() => router.push('/super-admin/platform-commission/create')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Commission
            </button>
          </div>

    
          {filteredCommissions.length > 0 && (
            <div className="text-sm text-gray-600 pt-2">
              <span className="font-medium">{filteredCommissions.length}</span> record{filteredCommissions.length !== 1 ? 's' : ''} available for export
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('commissionName')}
                >
                  <div className="flex items-center gap-1">
                    <span>Commission Name</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Industry</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Category</th>
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('commissionRate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Rate</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Description</th>
                <th 
                  className="py-4 px-6 text-left text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Created Date</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCommissions.length > 0 ? (
                paginatedCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{commission.commissionName}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {commission.id.slice(-8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{commission.industryName || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {commission.industryId.slice(-8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{commission.categoryName || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {commission.categoryId.slice(-8)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {getCommissionRateDisplay(commission.commissionRate)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs">
                      <div className="line-clamp-2" title={commission.description}>
                        {commission.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {formatDate(commission.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
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
                  <td colSpan={8} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No platform commissions found</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        {searchTerm || selectedIndustry || selectedCategory
                          ? 'No results match your search criteria. Try adjusting your filters.'
                          : 'Start by adding your first platform commission'}
                      </p>
                      {!searchTerm && !selectedIndustry && !selectedCategory && (
                        <button 
                          className="flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
                          onClick={() => router.push('/super-admin/platform-commission/create')}
                        >
                          <Plus className="w-5 h-5" />
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
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} platform commissions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
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
               
                {pagination.page > 3 && pagination.totalPages > 5 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="min-w-[40px] h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      1
                    </button>
                    {pagination.page > 4 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </>
                )}

              
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
                      onClick={() => handlePageChange(pageNum)}
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

                
                {pagination.page < pagination.totalPages - 2 && pagination.totalPages > 5 && (
                  <>
                    {pagination.page < pagination.totalPages - 3 && (
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
                onClick={() => handlePageChange(pagination.page + 1)}
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
          onConfirm={confirmAction}
          title={`${actionModalConfig.statusToSet === 'active' ? 'Activate' : 'Deactivate'} Commission`}
          message={`Are you sure you want to ${actionModalConfig.statusToSet === 'active' ? 'activate' : 'deactivate'} "${actionModalConfig.item?.commissionName}"?`}
          confirmText={actionModalConfig.statusToSet === 'active' ? 'Activate' : 'Deactivate'}
          confirmColor={actionModalConfig.statusToSet === 'active' ? 'green' : 'orange'}
        />
      )}
    </div>
  );
};

export default PlatformCommissionList;