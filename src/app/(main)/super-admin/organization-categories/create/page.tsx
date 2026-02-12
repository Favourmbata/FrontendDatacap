"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

const CreateOrganizationCategoryPage = () => {
  const [formData, setFormData] = useState({
    categoryName: '',
    organizationId: '',
    industry: '',
    description: '',
    status: 'pending'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Mock organizations data
  const organizations = [
    { id: 'org_001', name: 'Glamour Beauty Salon' },
    { id: 'org_002', name: 'Elite Fitness Center' },
    { id: 'org_003', name: 'Capture Moments Studio' },
    { id: 'org_004', name: 'AutoFix Mobile Services' },
  ];

  // Mock industries data
  const industries = [
    'Beauty & Personal Care',
    'Health & Fitness',
    'Photography',
    'Automotive',
    'Technology',
    'Food & Beverage',
    'Education',
    'Real Estate'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    
    if (!formData.organizationId) {
      newErrors.organizationId = 'Organization is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Creating category:', formData);
      // In a real app, this would call an API to create the category
      
      // Redirect back to list page
      window.location.href = '/super-admin/organization-categories';
    } catch (error) {
      console.error('Error creating category:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      window.location.href = '/super-admin/organization-categories';
    }
  };

  return (
    <div className="manrope min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Organization Category</h1>
          <p className="text-gray-600">Add a new category for an organization</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.categoryName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category name"
              />
              {errors.categoryName && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryName}</p>
              )}
            </div>

            <div>
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-2">
                Organization *
              </label>
              <select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.organizationId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              {errors.organizationId && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationId}</p>
              )}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationCategoryPage;