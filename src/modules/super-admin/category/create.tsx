


"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { MessageModal } from '@/app/components/MessageModal';

interface CategoryFormData {
  name: string;
  description: string;
  industryId: string;
}

const CategoryCreate = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    industryId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Mock industries data
  const industries = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Healthcare' },
    { id: '3', name: 'Finance' },
  ];

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would call an API to create the category
    console.log('Creating category:', formData);
    
    // Show success message
    setModalMessage('Category created successfully!');
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to category list page
    window.location.href = '/super-admin/category';
  };

  return (
    <div className="manrope w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Create New Category</h1>
          <p className="text-sm md:text-base text-gray-600">Add a new category to the platform</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Category Name Field */}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Industry Field */}
              <div>
                <label htmlFor="industryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  id="industryId"
                  name="industryId"
                  value={formData.industryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                    errors.industryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
                {errors.industryId && <p className="mt-1 text-sm text-red-600">{errors.industryId}</p>}
              </div>

              {/* Description Field */}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter category description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Create Category
              </button>
            </div>
          </form>
        </div>
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

export default CategoryCreate;