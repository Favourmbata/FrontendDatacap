'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrganizationService from '@/services/OrganizationService';

interface OrganizationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ onSuccess, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    phoneNumber: '',
    address: '',
    contactPerson: '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateOrganizationName = (name: string): string | null => {
    if (!name.trim()) return 'Organization name is required';
    if (name.length < 2) return 'Organization name must be at least 2 characters';
    if (name.length > 100) return 'Organization name must not exceed 100 characters';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Phone is optional
    // Nigerian phone format validation (11 digits, starting with 0, or +234, or 234)
    const phoneRegex = /^(\+?234|0)?[789]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid Nigerian phone number';
    return null;
  };

  const validateAccountNumber = (accountNumber: string): string | null => {
    if (!accountNumber) return null; // Account number is optional
    if (accountNumber.length !== 10) return 'Account number must be 10 digits';
    if (!/^[0-9]+$/.test(accountNumber)) return 'Account number must contain only digits';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const nameError = validateOrganizationName(formData.organizationName);
    if (nameError) errors.organizationName = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
    
    const accountNumberError = validateAccountNumber(formData.accountNumber);
    if (accountNumberError) errors.accountNumber = accountNumberError;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validation before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setFieldErrors({}); // Clear any previous field errors

    try {
      await OrganizationService.createOrganization(formData);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/super-admin/organisation');
      }
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Organization</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors.organizationName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter organization name"
            />
            {fieldErrors.organizationName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.organizationName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter email address"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter phone number"
            />
            {fieldErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter account number"
            />
            {fieldErrors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.accountNumber}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter contact person name"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter organization address"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;