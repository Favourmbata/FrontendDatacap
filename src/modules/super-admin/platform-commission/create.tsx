


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
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platform Commissions
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Create New Platform Commission</h1>
          <p className="text-sm md:text-base text-gray-600">Add a new platform commission for categories and industries</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Commission Name */}
            <div>
              <label htmlFor="commissionName" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="commissionName"
                name="commissionName"
                value={formData.commissionName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                placeholder="e.g., Standard Commission Rate"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a unique name for the platform commission
              </p>
            </div>

            {/* Commission Rate */}
            <div>
              <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors"
                  placeholder="0.00"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the commission percentage (0-100%)
              </p>
            </div>

            {/* Industry Selection */}
            <div>
              <label htmlFor="industryId" className="block text-sm font-medium text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industryId"
                name="industryId"
                value={formData.industryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors appearance-none bg-white"
                disabled={loading}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" disabled>Select an industry</option>
                {industries.length > 0 ? (
                  industries.map((industry) => (
                    <option key={industry.value} value={industry.value} className="py-2">
                      {industry.label}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Loading industries...</option>
                )}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select the industry this commission applies to
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors appearance-none bg-white ${
                  !formData.industryId ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                disabled={loading || !formData.industryId}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" disabled>
                  {!formData.industryId 
                    ? 'Select an industry first' 
                    : categories.length === 0 
                      ? 'No categories available' 
                      : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="py-2">
                    {category.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {!formData.industryId 
                  ? 'Please select an industry first to load categories' 
                  : 'Select the category this commission applies to'}
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors resize-none"
                placeholder="Enter a detailed description of the commission..."
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of the platform commission
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium order-2 sm:order-1"
                disabled={submitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center order-1 sm:order-2"
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