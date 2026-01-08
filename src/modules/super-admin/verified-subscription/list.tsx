"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Search, Download } from 'lucide-react';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import BranchDetailsModal from '@/app/components/modals/BranchDetailsModal';
import { useRouter } from 'next/navigation';
import VerifiedSubscriptionService, { VerifiedSubscription } from '@/services/VerifiedSubscriptionService';

const VerifiedSubscriptionList = () => {
  const router = useRouter();
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [subscriptions, setSubscriptions] = useState<VerifiedSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    subscriptionId: string | null;
    organizationName: string;
  }>({
    isOpen: false,
    subscriptionId: null,
    organizationName: ''
  });

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    subscriptionId: string | null;
    position: { top: number; left: number };
  }>({
    isOpen: false,
    subscriptionId: null,
    position: { top: 0, left: 0 }
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('organizationName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [exportLoading, setExportLoading] = useState<'csv' | 'excel' | 'pdf' | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // State for branch details modal
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<VerifiedSubscription | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubscriptions();
  };

  useEffect(() => {
    loadSubscriptions();
  }, [searchTerm, sortBy, sortOrder]);

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setExportLoading(format);
      // For now, we'll simulate export functionality
      alert(`Exporting verified subscriptions as ${format.toUpperCase()}`);
      // In a real implementation, you would call the actual export function
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to export verified subscriptions as ${format.toUpperCase()}`);
      console.error('Export error:', err);
    } finally {
      setExportLoading(null);
    }
  };

  useEffect(() => {
    loadSubscriptions();
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

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const result = await VerifiedSubscriptionService.getVerifiedSubscriptions(searchTerm);
      setSubscriptions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verified subscriptions');
      console.error('Error loading verified subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (sub: VerifiedSubscription, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = actionButtonRefs.current[sub.id];
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
        subscriptionId: sub.id,
        position: {
          top: top + window.scrollY,
          left: rect.left + window.scrollX - 140
        }
      });
    }
  };

  const closeActionModal = () => {
    setActionModal({ isOpen: false, subscriptionId: null, position: { top: 0, left: 0 } });
  };

  const handleEditSubscription = () => {
    if (actionModal.subscriptionId) {
      router.push(`/super-admin/subscription/verified-badge-subscription/edit/${actionModal.subscriptionId}`);
    }
    closeActionModal();
  };

  const handleDeleteSubscription = () => {
    if (actionModal.subscriptionId) {
      const subToDelete = subscriptions.find(sub => sub.id === actionModal.subscriptionId);
      if (subToDelete) {
        setDeleteModal({
          isOpen: true,
          subscriptionId: actionModal.subscriptionId,
          organizationName: subToDelete.organizationName
        });
      }
    }
    closeActionModal();
  };

  const handleViewSubscription = () => {
    if (actionModal.subscriptionId) {
      router.push(`/super-admin/subscription/verified-badge-subscription/view/${actionModal.subscriptionId}`);
    }
    closeActionModal();
  };

  const confirmDeleteSubscription = async () => {
    if (deleteModal.subscriptionId) {
      try {
        const success = await VerifiedSubscriptionService.deleteVerifiedSubscription(deleteModal.subscriptionId);
        if (success) {
          await loadSubscriptions();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete verified subscription');
        console.error('Error deleting verified subscription:', err);
      }
    }
    setDeleteModal({ isOpen: false, subscriptionId: null, organizationName: '' });
  };

  const cancelDeleteSubscription = () => {
    setDeleteModal({ isOpen: false, subscriptionId: null, organizationName: '' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D2A8B]"></div>
          <span className="ml-2 text-gray-600">Loading verified subscriptions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
          <button 
            onClick={loadSubscriptions}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verified Badge Subscriptions</h1>
            <p className="text-gray-600">Manage verified badge subscriptions for organizations</p>
          </div>
        </div>

        {/* Filter, Export, and Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: All filters and search */}
          <div className="lg:col-span-2 space-y-4">
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

            {/* Search */}
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
                    placeholder="Search by organization name, ID, or location"
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

      {/* Verified Subscriptions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy('organizationName');
                  setSortOrder(sortBy === 'organizationName' && sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <div className="flex items-center gap-1">
                  Name of the Organization
                  {sortBy === 'organizationName' && (
                    <span className="text-[#5D2A8B]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Subscription Amount (₦)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Number of Locations</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headquarters Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Verification Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address (City's Region)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LGA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub, index) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sub.organizationName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.organizationId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₦{sub.totalSubscriptionAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.totalNumberOfLocations}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedSubscription(sub);
                        setBranchModalOpen(true);
                      }}
                    >
                      {sub.headquartersLocation}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₦{sub.locationVerificationCost.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.subscriptionDuration}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sub.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.lga}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sub.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {sub.branches && sub.branches.length > 0 ? sub.branches[0].branchName : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-end">
                      <button
                        ref={(el) => {
                          actionButtonRefs.current[sub.id] = el;
                        }}
                        onClick={(e) => handleActionClick(sub, e)}
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
                <td colSpan={16} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg">No verified subscriptions found</p>
                    <p className="text-sm text-gray-400">Create a new verified subscription to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.subscriptionId && (
        <SuperAdminActionModal
          isOpen={actionModal.isOpen}
          onClose={closeActionModal}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
          onView={handleViewSubscription}
          itemName={subscriptions.find(s => s.id === actionModal.subscriptionId)?.organizationName || 'Subscription'}
          position={actionModal.position}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeleteSubscription}
        onConfirm={confirmDeleteSubscription}
        itemName={deleteModal.organizationName}
        itemType="verified subscription"
      />

      {/* Branch Details Modal */}
      <BranchDetailsModal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default VerifiedSubscriptionList;