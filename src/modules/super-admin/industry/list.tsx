"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2, MoreVertical } from 'lucide-react';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

interface Industry {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const IndustryList = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '',
    item: null as Industry | null,
  });

  // Mock data for now - this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockIndustries: Industry[] = [
        {
          id: '1',
          name: 'Technology',
          description: 'Technology and software industry',
          createdAt: '2023-01-15',
          updatedAt: '2023-01-15',
        },
        {
          id: '2',
          name: 'Healthcare',
          description: 'Healthcare and medical industry',
          createdAt: '2023-02-20',
          updatedAt: '2023-02-20',
        },
        {
          id: '3',
          name: 'Finance',
          description: 'Financial services industry',
          createdAt: '2023-03-10',
          updatedAt: '2023-03-10',
        },
      ];
      setIndustries(mockIndustries);
      setFilteredIndustries(mockIndustries);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter industries based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredIndustries(industries);
    } else {
      const filtered = industries.filter(industry =>
        industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIndustries(filtered);
    }
  }, [searchTerm, industries]);

  const handleView = (industry: Industry) => {
    // Navigate to view page
    window.location.href = `/super-admin/industry/view/${industry.id}`;
  };

  const handleEdit = (industry: Industry) => {
    // Navigate to edit page
    window.location.href = `/super-admin/industry/edit/${industry.id}`;
  };

  const handleDelete = (industry: Industry) => {
    setActionModalConfig({
      action: 'delete',
      item: industry,
    });
    setShowActionModal(true);
  };

  const confirmDelete = () => {
    if (actionModalConfig.action === 'delete' && actionModalConfig.item) {
      // In a real app, this would call an API to delete the industry
      setIndustries(industries.filter(ind => ind.id !== actionModalConfig.item?.id));
      setFilteredIndustries(filteredIndustries.filter(ind => ind.id !== actionModalConfig.item?.id));
    }
    setShowActionModal(false);
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Industry Management</h1>
        <p className="text-gray-600">Manage industries for the platform</p>
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
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
            onClick={() => window.location.href = '/super-admin/industry/create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Industry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Description</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndustries.length > 0 ? (
                filteredIndustries.map((industry) => (
                  <tr key={industry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{industry.name}</td>
                    <td className="py-4 px-4 text-gray-600">{industry.description}</td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(industry.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleView(industry)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(industry)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(industry)}
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
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                    No industries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={confirmDelete}
        itemName={actionModalConfig.item?.name || ''}
        itemType="industry"
      />
    </div>
  );
};

export default IndustryList;