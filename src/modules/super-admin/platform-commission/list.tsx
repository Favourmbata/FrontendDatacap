"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

interface PlatformCommission {
  id: string;
  name: string;
  commissionRate: number;
  category: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

const PlatformCommissionList = () => {
  const [commissions, setCommissions] = useState<PlatformCommission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<PlatformCommission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PlatformCommission | null>(null);

  // Mock data for now - this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCommissions: PlatformCommission[] = [
        {
          id: '1',
          name: 'Standard Commission',
          commissionRate: 5.0,
          category: 'Mobile Phones',
          industry: 'Technology',
          createdAt: '2023-01-15',
          updatedAt: '2023-01-15',
        },
        {
          id: '2',
          name: 'Premium Commission',
          commissionRate: 8.5,
          category: 'Laptops',
          industry: 'Technology',
          createdAt: '2023-02-20',
          updatedAt: '2023-02-20',
        },
        {
          id: '3',
          name: 'Healthcare Commission',
          commissionRate: 6.0,
          category: 'Medicines',
          industry: 'Healthcare',
          createdAt: '2023-03-10',
          updatedAt: '2023-03-10',
        },
      ];
      setCommissions(mockCommissions);
      setFilteredCommissions(mockCommissions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter commissions based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCommissions(commissions);
    } else {
      const filtered = commissions.filter(commission =>
        commission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCommissions(filtered);
    }
  }, [searchTerm, commissions]);

  const handleView = (commission: PlatformCommission) => {
    // Navigate to view page
    window.location.href = `/super-admin/platform-commission/view/${commission.id}`;
  };

  const handleEdit = (commission: PlatformCommission) => {
    // Navigate to edit page
    window.location.href = `/super-admin/platform-commission/edit/${commission.id}`;
  };

  const handleDelete = (commission: PlatformCommission) => {
    setItemToDelete(commission);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, this would call an API to delete the commission
      setCommissions(commissions.filter(com => com.id !== itemToDelete.id));
      setFilteredCommissions(filteredCommissions.filter(com => com.id !== itemToDelete.id));
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Platform Commission Management</h1>
        <p className="text-gray-600">Manage platform commission rates</p>
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
              placeholder="Search commissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
            onClick={() => window.location.href = '/super-admin/platform-commission/create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Commission
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Commission Rate (%)</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Industry</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.length > 0 ? (
                filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{commission.name}</td>
                    <td className="py-4 px-4 text-gray-600">{commission.commissionRate}%</td>
                    <td className="py-4 px-4 text-gray-600">{commission.category}</td>
                    <td className="py-4 px-4 text-gray-600">{commission.industry}</td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(commission.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleView(commission)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(commission)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(commission)}
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
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No platform commissions found
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
        itemName={itemToDelete?.name || ''}
        itemType="platform commission"
      />
    </div>
  );
};

export default PlatformCommissionList;