"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerificationData {
  id: number;
  field: string;
  agentId: string;
  organisationId: string;
  isOrganisationUpload: boolean;
  uploadCommit: string;
  address: string;
  headquartersUpload: string;
  operatingAddress: string;
}

const CreateVerificationDataPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<VerificationData>>({
    field: '',
    agentId: '',
    organisationId: '',
    isOrganisationUpload: false,
    uploadCommit: '',
    address: '',
    headquartersUpload: '',
    operatingAddress: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.field || !formData.agentId || !formData.organisationId || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call
      console.log('Creating verification data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful creation, navigate back to the list page
      router.push('/super-admin/questionaire/verification-data');
    } catch (error) {
      console.error('Error creating verification data:', error);
      alert('Failed to create verification data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification Data
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Verification Data</h1>
              <p className="text-gray-600">Add new verification information for organizations</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Field <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.field}
                    onChange={(e) => handleInputChange('field', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none"
                    placeholder="e.g., Registration Documents"
                    required
                  />
                </div>

                {/* Agent ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Agent ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.agentId}
                    onChange={(e) => handleInputChange('agentId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none"
                    placeholder="e.g., AGT-001"
                    required
                  />
                </div>

                {/* Organisation ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organisation ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organisationId}
                    onChange={(e) => handleInputChange('organisationId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none"
                    placeholder="e.g., ORG-1234"
                    required
                  />
                </div>

                {/* Headquarters Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Headquarters Upload
                  </label>
                  <input
                    type="text"
                    value={formData.headquartersUpload}
                    onChange={(e) => handleInputChange('headquartersUpload', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none"
                    placeholder="e.g., HQ_DOC_001.pdf"
                  />
                </div>
              </div>

              {/* Upload Commit */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Commit
                </label>
                <input
                  type="text"
                  value={formData.uploadCommit}
                  onChange={(e) => handleInputChange('uploadCommit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none"
                  placeholder="e.g., Initial upload"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none resize-none"
                  placeholder="Enter full address"
                  required
                />
              </div>

              {/* Operating Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Operating Address
                </label>
                <textarea
                  value={formData.operatingAddress}
                  onChange={(e) => handleInputChange('operatingAddress', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent outline-none resize-none"
                  placeholder="Enter operating address"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isOrganisationUpload}
                  onChange={(e) => handleInputChange('isOrganisationUpload', e.target.checked)}
                  className="w-4 h-4 text-[#5D2A8B] border-gray-300 rounded focus:ring-[#5D2A8B]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Is Organisation Upload
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a2270] transition-colors font-medium flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Verification Data
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

export default CreateVerificationDataPage;