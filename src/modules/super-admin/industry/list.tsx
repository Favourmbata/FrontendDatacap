

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import IndustryService, { Industry, GetIndustriesParams } from '@/services/industryService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndustryList = () => {
  const router = useRouter();
  const [allIndustries, setAllIndustries] = useState<Industry[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>([]);
  const [displayedIndustries, setDisplayedIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '' as 'delete' | '',
    item: null as Industry | null,
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

  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  
  const fetchAllIndustries = async () => {
    try {
      setLoading(true);
     
      const response = await IndustryService.getIndustries({ 
        limit: 1000 
      });
      
      setAllIndustries(response.industries);
      setPagination(prev => ({
        ...prev,
        totalItems: response.industries.length,
        totalPages: Math.ceil(response.industries.length / prev.itemsPerPage)
      }));
      
      setInitialLoad(false);
      
    } catch (error: any) {
      console.error('Error fetching industries:', error);
      toast.error(error.message || 'Failed to fetch industries');
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllIndustries();
    
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'industries_lastUpdated') {
        fetchAllIndustries();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

 
  const filteredAndSortedIndustries = useMemo(() => {
    let filtered = [...allIndustries];

   
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(industry => 
        industry.name.toLowerCase().includes(searchLower) ||
        industry.description.toLowerCase().includes(searchLower)
      );
      console.log(`Search for "${searchTerm}" found ${filtered.length} results`);
    }

  
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.sortBy as keyof Industry];
      let bValue: any = b[sortConfig.sortBy as keyof Industry];

    
      if (sortConfig.sortBy === 'createdAt' || sortConfig.sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

     
      if (sortConfig.sortBy === 'status') {
        aValue = a.status;
        bValue = b.status;
      }


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
  }, [allIndustries, searchTerm, sortConfig]);

 
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: filteredAndSortedIndustries.length,
      totalPages: Math.ceil(filteredAndSortedIndustries.length / prev.itemsPerPage)
    }));
  }, [filteredAndSortedIndustries]);


  useEffect(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedIndustries = filteredAndSortedIndustries.slice(startIndex, endIndex);
    
    setDisplayedIndustries(paginatedIndustries);
  }, [filteredAndSortedIndustries, pagination.currentPage, pagination.itemsPerPage]);

  const handleView = (industry: Industry) => {
    router.push(`/super-admin/industry/view/${industry.id}`);
  };

  const handleEdit = (industry: Industry) => {
    router.push(`/super-admin/industry/edit/${industry.id}`);
  };

  const handleDelete = (industry: Industry) => {
    setActionModalConfig({
      action: 'delete',
      item: industry,
    });
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!actionModalConfig.item) return;

    setDeleteLoading(true);
    try {
      if (actionModalConfig.action === 'delete') {
        const result = await IndustryService.deleteIndustry(actionModalConfig.item.id);
        if (result.success) {
          toast.success('Industry deleted successfully');
        
          setAllIndustries(prev => prev.filter(i => i.id !== actionModalConfig.item!.id));
         
          localStorage.setItem('industries_lastUpdated', Date.now().toString());
        } else {
          toast.error(result.message || 'Failed to delete industry');
        }
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

  if (loading && initialLoad) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Industry Management</h1>
          <p className="text-gray-600">Manage industries for the platform</p>
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Industry Management</h1>
        <p className="text-gray-600">Manage industries for the platform</p>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col gap-4">
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
  {/* Search Input - Reduced width */}
  <div className="lg:col-span-7">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-all"
        placeholder="Search industries by name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    {searchTerm && (
      <div className="mt-2 text-sm text-gray-600">
        Found {filteredAndSortedIndustries.length} results for "{searchTerm}"
      </div>
    )}
  </div>

  {/* Right side controls - Equally aligned */}
  <div className="lg:col-span-5 flex items-center justify-end gap-3">
    <select
      value={pagination.itemsPerPage}
      onChange={handleItemsPerPageChange}
      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] text-sm bg-white w-[140px]"
    >
      <option value="5">5 per page</option>
      <option value="10">10 per page</option>
      <option value="25">25 per page</option>
      <option value="50">50 per page</option>
      <option value="100">100 per page</option>
    </select>

    <button 
      className="flex items-center gap-2 bg-[#5D2A8B] text-white px-4 py-3 rounded-lg hover:bg-[#4a216d] transition-colors w-[160px] justify-center"
      onClick={() => router.push('/super-admin/industry/create')}
    >
      <Plus className="w-5 h-5" />
      <span>Add Industry</span>
    </button>
  </div>
</div>
         
        </div>
      </div>

     
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
                    <span>Industry Name</span>
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
              {displayedIndustries.length > 0 ? (
                displayedIndustries.map((industry) => (
                  <tr key={industry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{industry.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {industry.id.slice(-8)}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-md">
                      <div className="line-clamp-2" title={industry.description}>
                        {industry.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(industry.status)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                      {formatDate(industry.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(industry)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(industry)}
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
                  <td colSpan={5} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No industries found</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        {searchTerm 
                          ? `No results for "${searchTerm}"` 
                          : 'Start by adding your first industry to get started'}
                      </p>
                      {!searchTerm && (
                        <button 
                          className="flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
                          onClick={() => router.push('/super-admin/industry/create')}
                        >
                          <Plus className="w-5 h-5" />
                          Add Your First Industry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

     
        {filteredAndSortedIndustries.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} industries
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
                          ? 'bg-[#5D2A8B] text-white'
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

      

 
      {actionModalConfig.action === 'delete' && (
        <DeleteConfirmationModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={confirmAction}
          itemName={actionModalConfig.item?.name || ''}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default IndustryList;