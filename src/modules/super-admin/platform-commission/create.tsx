"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import PlatformCommissionService, { CreatePlatformCommissionRequest } from '@/services/PlatformCommissionService';
import IndustryService from '@/services/industryService';
import CategoryService from '@/services/CategoryService';

interface Industry {
  value: string;
  label: string;
  description?: string;
}

interface Category {
  value: string;
  label: string;
  description?: string;
}

const PlatformCommissionCreate = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    commissionName: '',
    commissionRate: '',
    industryId: '',
    categoryId: '',
    description: '',
  });
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch industries on component mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const industriesList = await IndustryService.getIndustriesForSelect();
        setIndustries(industriesList);
      } catch (error: any) {
        console.error('Error fetching industries:', error);
        toast.error('Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  // Fetch categories when industry changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.industryId) {
        try {
          const categoriesList = await CategoryService.getCategoriesForSelect(formData.industryId);
          setCategories(categoriesList);
          // Reset category selection if industry changes
          if (formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: '' }));
          }
        } catch (error: any) {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load categories');
        }
      } else {
        setCategories([]);
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
    };

    fetchCategories();
  }, [formData.industryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.commissionName.trim()) {
      setError('Commission name is required');
      toast.error('Commission name is required');
      return;
    }

    if (!formData.commissionRate || parseFloat(formData.commissionRate) <= 0) {
      setError('Commission rate must be a positive number');
      toast.error('Commission rate must be a positive number');
      return;
    }

    if (parseFloat(formData.commissionRate) > 100) {
      setError('Commission rate cannot exceed 100%');
      toast.error('Commission rate cannot exceed 100%');
      return;
    }

    if (!formData.industryId) {
      setError('Industry selection is required');
      toast.error('Industry selection is required');
      return;
    }

    if (!formData.categoryId) {
      setError('Category selection is required');
      toast.error('Category selection is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      toast.error('Description is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Call API to create the platform commission
      const createData: CreatePlatformCommissionRequest = {
        commissionName: formData.commissionName.trim(),
        commissionRate: parseFloat(formData.commissionRate),
        industryId: formData.industryId,
        categoryId: formData.categoryId,
        description: formData.description.trim(),
      };

      const newCommission = await PlatformCommissionService.createPlatformCommission(createData);
      
      console.log('Platform commission created:', newCommission);
      
      // Show success message
      toast.success('Platform commission created successfully!');
      
      // Navigate back to platform commission list page
      setTimeout(() => {
        router.push('/super-admin/platform-commission');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error creating platform commission:', error);
      setError(error.message || 'Failed to create platform commission');
      toast.error(error.message || 'Failed to create platform commission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/super-admin/platform-commission');
  };

  return (
    <div className="manrope w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platform Commissions
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Create New Platform Commission</h1>
          <p className="text-sm md:text-base text-gray-600">Add a new platform commission for categories and industries</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="commissionName" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Name *
              </label>
              <input
                type="text"
                id="commissionName"
                name="commissionName"
                value={formData.commissionName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                placeholder="Enter commission name"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a unique name for the platform commission
              </p>
            </div>

            <div>
              <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)*
              </label>
              <input
                type="number"
                id="commissionRate"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                placeholder="Enter commission rate (0-100)"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the commission percentage (0-100%)
              </p>
            </div>

            <div>
              <label htmlFor="industryId" className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                id="industryId"
                name="industryId"
                value={formData.industryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                disabled={loading}
              >
                <option value="">Select an industry</option>
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                    {industry.description && ` - ${industry.description}`}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select the industry this commission applies to
              </p>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                disabled={loading || !formData.industryId}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                    {category.description && ` - ${category.description}`}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select the category this commission applies to
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors resize-none"
                placeholder="Enter commission description"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of the platform commission
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={submitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={submitting || loading}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Commission
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

export default PlatformCommissionCreate;