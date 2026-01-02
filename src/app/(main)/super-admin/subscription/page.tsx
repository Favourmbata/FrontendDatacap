"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Search, Download } from 'lucide-react';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import SubscriptionService, { SubscriptionPackage } from '@/services/subscriptionService';

const SubscriptionPage = () => {
  const router = useRouter();
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    packageName: string;
  }>({
    isOpen: false,
    packageId: null,
    packageName: ''
  });

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    position: { top: number; left: number };
  }>({
    isOpen: false,
    packageId: null,
    position: { top: 0, left: 0 }
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'active' | 'inactive' | ''>('');
  const [sortBy, setSortBy] = useState<string>('setupDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [exportLoading, setExportLoading] = useState<'csv' | 'excel' | 'pdf' | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPackages();
  };

  useEffect(() => {
    loadPackages();
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setExportLoading(format);
      const blob = await SubscriptionService.exportSubscriptionPackages(format);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscription-packages-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to export subscription packages as ${format.toUpperCase()}`);
      console.error('Export error:', err);
    } finally {
      setExportLoading(null);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

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

  const loadPackages = async () => {
    try {
      setLoading(true);
      const result = await SubscriptionService.getSubscriptionPackages(1, 10, searchTerm, sortBy, sortOrder, filterStatus || undefined);
      setPackages(result.packages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription packages');
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = () => {
    router.push('/super-admin/subscription/create');
  };

  const handleActionClick = (pkg: SubscriptionPackage, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = actionButtonRefs.current[pkg.id];
    if (button) {
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const modalHeight = 200;
      
      let top = rect.bottom;
      if (rect.bottom + modalHeight > viewportHeight) {
        top = rect.top - modalHeight;
      }
      
      setActionModal({
        isOpen: true,
        packageId: pkg.id,
        position: {
          top: top + window.scrollY,
          left: rect.left + window.scrollX - 140
        }
      });
    }
  };

  const closeActionModal = () => {
    setActionModal({ isOpen: false, packageId: null, position: { top: 0, left: 0 } });
  };

  const handleEditPackage = () => {
    if (actionModal.packageId) {
      router.push(`/super-admin/subscription/edit/${actionModal.packageId}`);
    }
    closeActionModal();
  };

  const handleDeletePackage = () => {
    if (actionModal.packageId) {
      const pkgToDelete = packages.find(pkg => pkg.id === actionModal.packageId);
      if (pkgToDelete) {
        setDeleteModal({
          isOpen: true,
          packageId: actionModal.packageId,
          packageName: pkgToDelete.packageName
        });
      }
    }
    closeActionModal();
  };

  const handleViewPackage = () => {
    if (actionModal.packageId) {
      router.push(`/super-admin/subscription/view/${actionModal.packageId}`);
    }
    closeActionModal();
  };

  const confirmDeletePackage = async () => {
    if (deleteModal.packageId) {
      try {
        const success = await SubscriptionService.deleteSubscriptionPackage(deleteModal.packageId);
        if (success) {
          await loadPackages();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete subscription package');
        console.error('Error deleting package:', err);
      }
    }
    setDeleteModal({ isOpen: false, packageId: null, packageName: '' });
  };

  const cancelDeletePackage = () => {
    setDeleteModal({ isOpen: false, packageId: null, packageName: '' });
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen flex items-center justify-center">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        <p>Loading subscription packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="mb-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Management</h1>
                <p className="text-gray-600">Manage subscription packages for organizations</p>
              </div>
              <button 
                onClick={handleCreatePackage}
                className="px-4 py-2 bg-[#5D2A8B] hover:bg-[#4a216e] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Package
              </button>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
          <button 
            onClick={loadPackages}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      {/* Header Section */}
      <div className="mb-6">
        {/* Row 1: Title and Create Button */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Management</h1>
            <p className="text-gray-600">Manage subscription packages for organizations</p>
          </div>
          <button 
            onClick={handleCreatePackage}
            className="px-4 py-2 bg-[#5D2A8B] hover:bg-[#4a216e] text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Package
          </button>
        </div>

        {/* Row 2: Filter, Export, and Search (all on left side) */}
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: All filters and search */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filter and Export in one row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex gap-1">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'active' | 'inactive' | '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {filterStatus && (
                      <button
                        onClick={() => setFilterStatus('')}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                        title="Clear filter"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Export Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export</label>
                  <div className="relative export-dropdown">
                    <button 
                      className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
                      disabled={exportLoading !== null}
                      onClick={() => setShowExportDropdown(!showExportDropdown)}
                    >
                      <Download className="w-4 h-4" />
                      {exportLoading ? (
                        <span>Exporting...</span>
                      ) : (
                        <span>Export</span>
                      )}
                    </button>
                    
                    {showExportDropdown && (
                      <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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

              {/* Search below Filter and Export */}
              <div>
                <form onSubmit={handleSearch}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(e);
                        }
                      }}
                      placeholder="Search by name, description, or services"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Empty or can be used for other elements if needed */}
            <div className="hidden lg:block">
              {/* This column is empty, keeping layout structure */}
            </div>
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('packageName');
                    setSortOrder(sortBy === 'packageName' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Package Name
                    {sortBy === 'packageName' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('monthlyPrice');
                    setSortOrder(sortBy === 'monthlyPrice' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Monthly Price
                    {sortBy === 'monthlyPrice' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('quarterlyPrice');
                    setSortOrder(sortBy === 'quarterlyPrice' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Quarterly Price
                    {sortBy === 'quarterlyPrice' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('yearlyPrice');
                    setSortOrder(sortBy === 'yearlyPrice' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Yearly Price
                    {sortBy === 'yearlyPrice' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('status');
                    setSortOrder(sortBy === 'status' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortBy === 'status' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortBy('subscriberCount');
                    setSortOrder(sortBy === 'subscriberCount' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">
                    Subscribers
                    {sortBy === 'subscriberCount' && (
                      <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pkg.packageName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{pkg.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{pkg.monthlyPrice.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{pkg.quarterlyPrice.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{pkg.yearlyPrice.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{pkg.services}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        pkg.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.subscriberCount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end">
                        <button
                          ref={(el) => {
                            actionButtonRefs.current[pkg.id] = el;
                          }}
                          onClick={(e) => handleActionClick(pkg, e)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg">No subscription packages found</p>
                      <p className="text-sm text-gray-400">Create a new package to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.packageId && (
        <SuperAdminActionModal
          isOpen={actionModal.isOpen}
          onClose={closeActionModal}
          onEdit={handleEditPackage}
          onDelete={handleDeletePackage}
          onView={handleViewPackage}
          itemName={packages.find(p => p.id === actionModal.packageId)?.packageName || 'Package'}
          position={actionModal.position}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeletePackage}
        onConfirm={confirmDeletePackage}
        itemName={deleteModal.packageName}
        itemType="subscription package"
      />
    </div>
  );
};

export default SubscriptionPage;