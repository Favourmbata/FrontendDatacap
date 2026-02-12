"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { MessageModal } from '@/app/components/MessageModal';
import CategoryService from '@/services/CategoryService';
import IndustryService from '@/services/industryService';
import { toast } from 'react-toastify';

interface CategoryFormData {
  name: string;
  description: string;
  industryId: string;
}

interface Industry {
  value: string;
  label: string;
  description?: string;
}

const CategoryEdit = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    industryId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Fetch category data and industries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch industries
        const industriesList = await IndustryService.getIndustriesForSelect();
        setIndustries(industriesList);

        // Fetch category data if we have an ID
        if (categoryId) {
          const category = await CategoryService.getCategoryById(categoryId);
          
          setFormData({
            name: category.name,
            description: category.description,
            industryId: category.industryId,
          });
        } else {
          toast.error('No category ID provided');
          router.push('/super-admin/category');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.message || 'Failed to load category data');
        router.push('/super-admin/category');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else {
      // Check if category name already exists (excluding current category)
      const isValidName = await CategoryService.validateCategoryName(
        formData.name,
        categoryId,
        formData.industryId
      );
      if (!isValidName) {
        newErrors.name = 'Category name already exists in this industry';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.industryId) {
      newErrors.industryId = 'Industry selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    
    const isValid = await validateForm();
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    try {
      // Call API to update the category
      const updatedCategory = await CategoryService.updateCategory(categoryId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        industryId: formData.industryId,
      });
      
      console.log('Category updated:', updatedCategory);
      
      // Show success message
      setModalMessage('Category updated successfully!');
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to category list page
    router.push('/super-admin/category');
  };

  const handleCancel = () => {
    router.push('/super-admin/category');
  };

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleCancel}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
         
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Category</h1>
          <p className="text-gray-600">Update category information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
            <div className="flex justify-end space-x-4">
              <div className="h-10 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
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

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleCancel}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Category</h1>
        <p className="text-gray-600">Update category information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category name"
                disabled={submitting}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Enter a unique name for the category
              </p>
            </div>

            <div>
              <label htmlFor="industryId" className="block text-sm font-medium text-gray-700 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industryId"
                name="industryId"
                value={formData.industryId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-colors ${
                  errors.industryId ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.industryId && <p className="mt-1 text-sm text-red-600">{errors.industryId}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Select the industry this category belongs to
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] transition-colors resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category description"
                disabled={submitting}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of the category
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              <Save className="w-5 h-5 mr-2" />
              {submitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>

      <MessageModal
        isOpen={showSuccessModal}
        title="Success"
        message={modalMessage}
        type="success"
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default CategoryEdit;