"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

interface PickupCenter {
  id: string;
  centerName: string;
  address: string;
  contact: string;
  amount: number;
  operatingDays: string;
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
}

const PickupCenterList = () => {
  const [pickupCenters, setPickupCenters] = useState<PickupCenter[]>([]);
  const [filteredPickupCenters, setFilteredPickupCenters] = useState<PickupCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PickupCenter | null>(null);

  // Mock data for now - this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPickupCenters: PickupCenter[] = [
        {
          id: '1',
          centerName: 'Main Logistics Hub',
          address: '123 Main Street, Downtown, Cityville',
          contact: '+1 (555) 123-4567',
          amount: 1500,
          operatingDays: 'Monday - Saturday',
          operatingHours: '9:00 AM - 7:00 PM',
          createdAt: '2023-01-15',
          updatedAt: '2023-01-15',
        },
        {
          id: '2',
          centerName: 'Westside Collection Point',
          address: '456 West Avenue, West End, Cityville',
          contact: '+1 (555) 987-6543',
          amount: 1200,
          operatingDays: 'Tuesday - Sunday',
          operatingHours: '8:00 AM - 8:00 PM',
          createdAt: '2023-02-20',
          updatedAt: '2023-02-20',
        },
        {
          id: '3',
          centerName: 'East District Center',
          address: '789 East Boulevard, Eastside, Cityville',
          contact: '+1 (555) 456-7890',
          amount: 1800,
          operatingDays: 'Monday - Friday',
          operatingHours: '10:00 AM - 6:00 PM',
          createdAt: '2023-03-10',
          updatedAt: '2023-03-10',
        },
        {
          id: '4',
          centerName: 'North Valley Depot',
          address: '101 North Road, Valley Area, Cityville',
          contact: '+1 (555) 111-2222',
          amount: 1600,
          operatingDays: 'Monday - Sunday',
          operatingHours: '24/7',
          createdAt: '2023-04-05',
          updatedAt: '2023-04-05',
        },
      ];
      setPickupCenters(mockPickupCenters);
      setFilteredPickupCenters(mockPickupCenters);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter pickup centers based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPickupCenters(pickupCenters);
    } else {
      const filtered = pickupCenters.filter(pickupCenter =>
        pickupCenter.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickupCenter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickupCenter.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickupCenter.operatingDays.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPickupCenters(filtered);
    }
  }, [searchTerm, pickupCenters]);

  const handleView = (pickupCenter: PickupCenter) => {
    // Navigate to view page
    window.location.href = `/super-admin/pickup-center/view/${pickupCenter.id}`;
  };

  const handleEdit = (pickupCenter: PickupCenter) => {
    // Navigate to edit page
    window.location.href = `/super-admin/pickup-center/edit/${pickupCenter.id}`;
  };

  const handleDelete = (pickupCenter: PickupCenter) => {
    setItemToDelete(pickupCenter);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, this would call an API to delete the pickup center
      setPickupCenters(pickupCenters.filter(cat => cat.id !== itemToDelete.id));
      setFilteredPickupCenters(filteredPickupCenters.filter(cat => cat.id !== itemToDelete.id));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Pickup Center Management</h1>
        <p className="text-gray-600">Manage pickup centers and their details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
              placeholder="Search pickup centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
            onClick={() => window.location.href = '/super-admin/pickup-center/create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Pickup Center
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Center Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Address</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Contact</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Amount</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Operating Days</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPickupCenters.length > 0 ? (
                filteredPickupCenters.map((pickupCenter) => (
                  <tr key={pickupCenter.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{pickupCenter.centerName}</td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{pickupCenter.address}</td>
                    <td className="py-4 px-4 text-gray-600">{pickupCenter.contact}</td>
                    <td className="py-4 px-4 text-gray-600">{formatCurrency(pickupCenter.amount)}</td>
                    <td className="py-4 px-4 text-gray-600">{pickupCenter.operatingDays}</td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(pickupCenter.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleView(pickupCenter)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(pickupCenter)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pickupCenter)}
                          className="text-red-600 hover:text-red-800"
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
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                    No pickup centers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.centerName || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default PickupCenterList;