


"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import CategoryService from '@/services/CategoryService';
import IndustryService from '@/services/industryService';
import { toast } from 'react-toastify';

interface Industry {
  value: string;
  label: string;
  description?: string;
}

const CategoryCreate = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industryId: '',
  });
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);


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


  const validateCategoryName = async (name: string) => {
    if (!name.trim()) {
      setNameError('Category name is required');
      return false;
    }

    try {
      const isUnique = await CategoryService.validateCategoryName(name.trim());
      if (!isUnique) {
        setNameError('A category with this name already exists');
        return false;
      } else {
        setNameError(null);
        return true;
      }
    } catch (error) {
      console.error('Error validating category name:', error);
      return true; 
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (error) {
      setError(null);
    }

    if (name === 'name') {
      await validateCategoryName(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      toast.error('Category name is required');
      return;
    }


    const isNameValid = await validateCategoryName(formData.name);
    if (!isNameValid) {
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      toast.error('Description is required');
      return;
    }

    if (!formData.industryId) {
      setError('Industry selection is required');
      toast.error('Industry selection is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {

      const newCategory = await CategoryService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        industryId: formData.industryId,
      });
      
      console.log('Category created:', newCategory);
      
      
      localStorage.setItem('categories_lastUpdated', Date.now().toString());
      
     
      setSuccess(true);
      
      toast.success('Category created successfully!');
 
      setTimeout(() => {
        router.push('/super-admin/category');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating category:', error);
   
      if (error.message?.toLowerCase().includes('already exists') || 
          error.message?.toLowerCase().includes('duplicate')) {
        setError('A category with this name already exists');
        setNameError('A category with this name already exists');
        toast.error('A category with this name already exists');
      } else {
        setError(error.message || 'Failed to create category');
        toast.error(error.message || 'Failed to create category');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/super-admin/category');
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900"
            disabled={submitting || success}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Create New Category</h1>
          <p className="text-sm md:text-base text-gray-600">Add a new category to the platform</p>
        </div>

   
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">Category created successfully!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your category has been created. Redirecting to the categories list...</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-opacity duration-300 ${success ? 'opacity-50 pointer-events-none' : ''}`}>
          {error && !success && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent transition-colors ${
                  nameError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category name"
                disabled={loading || submitting || success}
              />
              {nameError && !success && (
                <p className="mt-1 text-sm text-red-600">{nameError}</p>
              )}
              {!nameError && formData.name && !success && (
                <p className="mt-1 text-sm text-green-600">Category name is available</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter a unique name for the category
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
                disabled={loading || submitting || success}
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
                Select the industry this category belongs to
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
                placeholder="Enter category description"
                disabled={loading || submitting || success}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a detailed description of the category
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={submitting || loading || success}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={submitting || loading || !!nameError || success}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Created!
                  </>
                ) : (
                  'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>

        {success && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/super-admin/category')}
              className="text-[#5D2A8B] hover:text-[#4a216d] text-sm font-medium"
            >
              Click here if you're not redirected automatically
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCreate;