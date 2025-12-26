"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
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

  useEffect(() => {
    // Load packages from service
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const result = await SubscriptionService.getSubscriptionPackages();
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

  // Handle action button click
  const handleActionClick = (pkg: SubscriptionPackage, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = actionButtonRefs.current[pkg.id];
    if (button) {
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const modalHeight = 200; // Approximate modal height
      
      // Calculate position - show modal above if near bottom of viewport
      let top = rect.bottom;
      if (rect.bottom + modalHeight > viewportHeight) {
        top = rect.top - modalHeight;
      }
      
      setActionModal({
        isOpen: true,
        packageId: pkg.id,
        position: {
          top: top + window.scrollY,
          left: rect.left + window.scrollX - 140 // Adjust to align properly
        }
      });
    }
  };

  // Close action modal
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
          await loadPackages(); // Refresh the list
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
      
      <div className="mb-6">
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

      {/* Packages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarterly Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscriber Count</th>
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
                      <div className="text-sm text-gray-900">₦{pkg.monthlyPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{pkg.quarterlyPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₦{pkg.yearlyPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.services}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pkg.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.subscriberCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
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
                    No subscription packages found. Create a new package to get started.
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