"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import PlatformCommissionService, { PlatformCommission, UpdatePlatformCommissionRequest } from '@/services/PlatformCommissionService';
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

const PlatformCommissionEdit = () => {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    commissionName: '',
    commissionRate: '',
    industryId: '',
    categoryId: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commissionId = params?.id as string;

  // Fetch the platform commission data for editing
  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setLoading(true);
        
        if (!commissionId) {
          throw new Error('Commission ID is missing');
        }

        const commission = await PlatformCommissionService.getPlatformCommissionById(commissionId);
        
        // Safely handle commissionRate which might be undefined or null
        setFormData({
          commissionName: commission.commissionName || '',
          commissionRate: commission.commissionRate?.toString() || '0',
          industryId: commission.industryId || '',
          categoryId: commission.categoryId || '',
          description: commission.description || '',
          status: commission.status || 'active',
        });
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching platform commission:', err);
        setError(err.message || 'Failed to fetch platform commission');
        toast.error(err.message || 'Failed to fetch platform commission');
      } finally {
        setLoading(false);
      }
    };

    if (commissionId) {
      fetchCommission();
    }
  }, [commissionId]);

  // Fetch industries on component mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const industriesList = await IndustryService.getIndustriesForSelect();
        setIndustries(industriesList);
      } catch (error: any) {
        console.error('Error fetching industries:', error);
        toast.error('Failed to load industries');
      }
    };

    fetchIndustries();
  }, []);

  // Fetch categories when industry changes
  useEffect(() => {
    if (formData.industryId) {
      const fetchCategories = async () => {
        try {
          const categoriesList = await CategoryService.getCategoriesForSelect(formData.industryId);
          setCategories(categoriesList);
        } catch (error: any) {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load categories');
        }
      };

      fetchCategories();
    } else {
      setCategories([]);
    }
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

    if (!formData.commissionRate || parseFloat(formData.commissionRate) < 0) {
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
      if (!commissionId) {
        throw new Error('Commission ID not provided');
      }

      // Prepare update data
      const updateData: UpdatePlatformCommissionRequest = {
        commissionName: formData.commissionName.trim(),
        commissionRate: parseFloat(formData.commissionRate),
        industryId: formData.industryId,
        categoryId: formData.categoryId,
        description: formData.description.trim(),
        status: formData.status,
      };

      // Call API to update the platform commission
      const updatedCommission = await PlatformCommissionService.updatePlatformCommission(commissionId, updateData);
      
      console.log('Platform commission updated:', updatedCommission);
      
      // Show success message
      toast.success('Platform commission updated successfully!');
      
      // Navigate back to platform commission list page
      setTimeout(() => {
        router.push('/super-admin/platform-commission');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error updating platform commission:', error);
      setError(error.message || 'Failed to update platform commission');
      toast.error(error.message || 'Failed to update platform commission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/super-admin/platform-commission');
  };

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="flex items-center mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Platform Commissions
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 ml-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.commissionName) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="flex items-center mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Platform Commissions
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-red-500 text-center py-8">
              <p className="text-lg font-medium">Error loading platform commission</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={handleCancel}
                className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Return to Platform Commissions
              </button>
            </div>
          </div>
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

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platform Commissions
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Platform Commission</h2>
          
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
                disabled={submitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a unique name for the platform commission
              </p>
            </div>

            <div>
              <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%) *
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
                disabled={submitting}
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
                disabled={submitting}
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
                disabled={submitting || !formData.industryId}
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
                disabled={submitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of the platform commission
              </p>
            </div>

           <div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
    Status *
  </label>
  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      formData.status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {formData.status === 'active' ? 'Active' : 'Inactive'}
    </span>
  </div>
  <p className="mt-1 text-sm text-gray-500">
    Current status of the platform commission (read-only)
  </p>
</div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {submitting ? 'Updating...' : 'Update Commission'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlatformCommissionEdit;