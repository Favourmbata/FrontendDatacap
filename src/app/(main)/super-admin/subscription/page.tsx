"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import SubscriptionService from '@/services/subscriptionService';

interface SubscriptionPackageData {
  id: string;
  name: string;
  description: string;
  maxUsers: number;
  promoCode: string;
  startDate: string;
  endDate: string;
  services: number;
  pricePerMonth: number;
  pricePerQuarter: number;
  pricePerYear: number;
}

const SubscriptionPage = () => {
  const router = useRouter();
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  const [packages, setPackages] = useState<SubscriptionPackageData[]>([]);
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
    setPackages(SubscriptionService.getAllPackages());
  }, []);

  const handleCreatePackage = () => {
    router.push('/super-admin/subscription/create');
  };

  // Handle action button click
  const handleActionClick = (pkg: SubscriptionPackageData, e: React.MouseEvent) => {
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
          packageName: pkgToDelete.name
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

  const confirmDeletePackage = () => {
    if (deleteModal.packageId) {
      const success = SubscriptionService.deletePackage(deleteModal.packageId);
      if (success) {
        setPackages(SubscriptionService.getAllPackages());
      }
    }
    setDeleteModal({ isOpen: false, packageId: null, packageName: '' });
  };

  const cancelDeletePackage = () => {
    setDeleteModal({ isOpen: false, packageId: null, packageName: '' });
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{pkg.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.maxUsers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.promoCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.startDate} to {pkg.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.services}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>${pkg.pricePerMonth}/mo</div>
                      <div>${pkg.pricePerQuarter}/quarter <span className="text-xs text-gray-500">(5% off)</span></div>
                      <div>${pkg.pricePerYear}/year <span className="text-xs text-gray-500">(10% off)</span></div>
                    </div>
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
              ))}
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
          itemName={packages.find(p => p.id === actionModal.packageId)?.name || 'Package'}
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