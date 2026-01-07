"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

interface Category {
  id: string;
  name: string;
  description: string;
  industryId: string;
  industryName: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);

  // Mock data for now - this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Mobile Phones',
          description: 'Mobile phone products',
          industryId: '1',
          industryName: 'Technology',
          createdAt: '2023-01-15',
          updatedAt: '2023-01-15',
        },
        {
          id: '2',
          name: 'Laptops',
          description: 'Laptop computers',
          industryId: '1',
          industryName: 'Technology',
          createdAt: '2023-02-20',
          updatedAt: '2023-02-20',
        },
        {
          id: '3',
          name: 'Medicines',
          description: 'Pharmaceutical products',
          industryId: '2',
          industryName: 'Healthcare',
          createdAt: '2023-03-10',
          updatedAt: '2023-03-10',
        },
      ];
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.industryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleView = (category: Category) => {
    // Navigate to view page
    window.location.href = `/super-admin/category/view/${category.id}`;
  };

  const handleEdit = (category: Category) => {
    // Navigate to edit page
    window.location.href = `/super-admin/category/edit/${category.id}`;
  };

  const handleDelete = (category: Category) => {
    setItemToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // In a real app, this would call an API to delete the category
      setCategories(categories.filter(cat => cat.id !== itemToDelete.id));
      setFilteredCategories(filteredCategories.filter(cat => cat.id !== itemToDelete.id));
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Management</h1>
        <p className="text-gray-600">Manage categories for the platform</p>
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
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
            onClick={() => window.location.href = '/super-admin/category/create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Industry</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Description</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{category.name}</td>
                    <td className="py-4 px-4 text-gray-600">{category.industryName}</td>
                    <td className="py-4 px-4 text-gray-600">{category.description}</td>
                    <td className="py-4 px-4 text-gray-600">{formatDate(category.createdAt)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleView(category)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(category)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category)}
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
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                    No categories found
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
        itemType="category"
      />
    </div>
  );
};

export default CategoryList;