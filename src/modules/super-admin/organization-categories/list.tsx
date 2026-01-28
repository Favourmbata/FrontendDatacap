"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Package, Building2 } from 'lucide-react';

interface OrganizationCategory {
  id: string;
  categoryName: string;
  organizationName: string;
  organizationId: string;
  industry: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const OrganizationCategoriesList = () => {
  const [categories, setCategories] = useState<OrganizationCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<OrganizationCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  // Mock data for organization categories
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCategories: OrganizationCategory[] = [
        {
          id: '1',
          categoryName: 'Hair Styling Services',
          organizationName: 'Glamour Beauty Salon',
          organizationId: 'org_001',
          industry: 'Beauty & Personal Care',
          description: 'Professional hair styling and cutting services',
          status: 'approved',
          createdAt: '2023-01-15',
          updatedAt: '2023-01-15',
        },
        {
          id: '2',
          categoryName: 'Fitness Training',
          organizationName: 'Elite Fitness Center',
          organizationId: 'org_002',
          industry: 'Health & Fitness',
          description: 'Personal training and fitness coaching services',
          status: 'pending',
          createdAt: '2023-02-20',
          updatedAt: '2023-02-20',
        },
        {
          id: '3',
          categoryName: 'Wedding Photography',
          organizationName: 'Capture Moments Studio',
          organizationId: 'org_003',
          industry: 'Photography',
          description: 'Professional wedding and event photography services',
          status: 'approved',
          createdAt: '2023-03-10',
          updatedAt: '2023-03-10',
        },
        {
          id: '4',
          categoryName: 'Mobile Car Repair',
          organizationName: 'AutoFix Mobile Services',
          organizationId: 'org_004',
          industry: 'Automotive',
          description: 'On-site car repair and maintenance services',
          status: 'rejected',
          createdAt: '2023-04-05',
          updatedAt: '2023-04-05',
        },
      ];
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter categories based on search term and organization
  useEffect(() => {
    let filtered = [...categories];
    
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedOrganization && selectedOrganization !== 'all') {
      filtered = filtered.filter(category => category.organizationId === selectedOrganization);
    }
    
    setFilteredCategories(filtered);
  }, [searchTerm, selectedOrganization, categories]);

  const handleView = (category: OrganizationCategory) => {
    // Navigate to view page
    window.location.href = `/super-admin/organization-categories/view/${category.id}`;
  };

  const handleEdit = (category: OrganizationCategory) => {
    // Navigate to edit page
    window.location.href = `/super-admin/organization-categories/edit/${category.id}`;
  };

  const handleAddToPlatform = (category: OrganizationCategory) => {
    // Add category to platform categories
    console.log(`Adding ${category.categoryName} to platform categories`);
    // In a real app, this would call an API to add the category to platform categories
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getUniqueOrganizations = () => {
    const orgs = categories.reduce((acc, category) => {
      if (!acc.find(org => org.id === category.organizationId)) {
        acc.push({
          id: category.organizationId,
          name: category.organizationName
        });
      }
      return acc;
    }, [] as { id: string; name: string }[]);
    
    return [{ id: 'all', name: 'All Organizations' }, ...orgs];
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Organization Categories</h1>
        <p className="text-gray-600">Manage categories created by organizations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
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
            
            <select
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
            >
              {getUniqueOrganizations().map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
            onClick={() => window.location.href = '/super-admin/organization-categories/create'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Organization</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Industry</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{category.categoryName}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{category.organizationName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{category.industry}</td>
                    <td className="py-4 px-4">{getStatusBadge(category.status)}</td>
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
                        {category.status === 'approved' && (
                          <button 
                            onClick={() => handleAddToPlatform(category)}
                            className="text-green-600 hover:text-green-800"
                            title="Add to Platform Categories"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No organization categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCategoriesList;