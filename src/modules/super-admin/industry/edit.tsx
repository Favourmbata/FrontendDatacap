"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { MessageModal } from '@/app/components/MessageModal';

interface Industry {
  id: string;
  name: string;
  description: string;
}

interface IndustryFormData {
  name: string;
  description: string;
}

const IndustryEdit = () => {
  const [formData, setFormData] = useState<IndustryFormData>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Mock industry data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call to fetch industry data
    setTimeout(() => {
      const mockIndustry: Industry = {
        id: '1',
        name: 'Technology',
        description: 'Technology and software industry',
      };
      
      setFormData({
        name: mockIndustry.name,
        description: mockIndustry.description,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.name = 'Industry name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would call an API to update the industry
    console.log('Updating industry:', formData);
    
    // Show success message
    setModalMessage('Industry updated successfully!');
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to industry list page
    window.location.href = '/super-admin/industry';
  };

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Industry</h1>
          <p className="text-gray-600">Update industry information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
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
            onClick={() => window.history.back()}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Industry</h1>
        <p className="text-gray-600">Update industry information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Industry Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter industry name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter industry description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Update Industry
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

export default IndustryEdit;