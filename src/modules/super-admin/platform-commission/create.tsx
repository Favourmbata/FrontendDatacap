"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { MessageModal } from '@/app/components/MessageModal';

interface PlatformCommissionFormData {
  name: string;
  commissionRate: number;
  category: string;
  industry: string;
  description: string;
}

const PlatformCommissionCreate = () => {
  const [formData, setFormData] = useState<PlatformCommissionFormData>({
    name: '',
    commissionRate: 0,
    category: '',
    industry: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Mock categories and industries data
  const categories = [
    { id: '1', name: 'Mobile Phones' },
    { id: '2', name: 'Laptops' },
    { id: '3', name: 'Medicines' },
  ];

  const industries = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Healthcare' },
    { id: '3', name: 'Finance' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'commissionRate' ? Number(value) : value,
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
      newErrors.name = 'Commission name is required';
    }

    if (formData.commissionRate <= 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = 'Commission rate must be between 0 and 100';
    }

    if (!formData.category) {
      newErrors.category = 'Category selection is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would call an API to create the platform commission
    console.log('Creating platform commission:', formData);
    
    // Show success message
    setModalMessage('Platform commission created successfully!');
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to platform commission list page
    window.location.href = '/super-admin/platform-commission';
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
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            Create New Platform Commission
          </h1>
          <p className="text-sm md:text-base text-gray-600">Add a new platform commission rate</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Commission Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter commission name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Two Column Grid for Commission Rate and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Commission Rate Field */}
                <div>
                  <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="commissionRate"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                      errors.commissionRate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter commission rate"
                  />
                  {errors.commissionRate && <p className="mt-1 text-sm text-red-600">{errors.commissionRate}</p>}
                </div>

                {/* Category Field */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>

              {/* Industry Field */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an industry</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.name}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                  {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] outline-none transition-all resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter commission description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors duration-200 font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Create Commission
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

export default PlatformCommissionCreate;