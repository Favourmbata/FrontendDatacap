"use client";

import React, { useState } from 'react';
import { superAdminUserModule, CreateCustomerRequest } from './userModule';
import { useRouter } from 'next/navigation';

const SuperAdminUserCreate: React.FC = () => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    customerName: '',
    email: '',
    phoneNumber: '',
    state: '',
    lga: '',
    address: '',
    customerId: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();

  // Nigerian states list
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  // Validation functions
  const validateCustomerName = (name: string): string | null => {
    if (!name.trim()) return 'Customer name is required';
    if (name.length < 2) return 'Customer name must be at least 2 characters';
    if (name.length > 100) return 'Customer name must not exceed 100 characters';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return 'Phone number is required';
    // Nigerian phone format validation (11 digits, starting with 0, or +234, or 234)
    const phoneRegex = /^(\+?234|0)?[789]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Please enter a valid Nigerian phone number';
    return null;
  };

  const validateState = (state: string): string | null => {
    if (!state) return 'State is required';
    if (!nigerianStates.includes(state)) return 'Please select a valid Nigerian state';
    return null;
  };

  const validateLGA = (lga: string, state: string): string | null => {
    if (!lga) return 'LGA is required';
    // In a real implementation, you would validate the LGA against the specific state
    // For now, we'll just check if it's not empty
    if (!lga.trim()) return 'LGA is required';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const nameError = validateCustomerName(formData.customerName);
    if (nameError) errors.customerName = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
    
    const stateError = validateState(formData.state);
    if (stateError) errors.state = stateError;
    
    const lgaError = validateLGA(formData.lga, formData.state);
    if (lgaError) errors.lga = lgaError;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    setSuccess(null);
    setFieldErrors({}); // Clear any previous field errors

    try {
      const response = await superAdminUserModule.createCustomer(formData);
      setSuccess(response.message || 'Customer created successfully');
      // Reset form
      setFormData({
        customerName: '',
        email: '',
        phoneNumber: '',
        state: '',
        lga: '',
        address: '',
        customerId: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Customer</h1>
        <p className="text-gray-600">Add a new customer to the system</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter customer full name"
              />
              {fieldErrors.customerName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.customerName}</p>
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter customer email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter customer phone number"
              />
              {fieldErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                Customer ID *
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer ID"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.state ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a state</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {fieldErrors.state && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700 mb-1">
                LGA *
              </label>
              <input
                type="text"
                id="lga"
                name="lga"
                value={formData.lga}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.lga ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter customer LGA"
              />
              {fieldErrors.lga && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.lga}</p>
              )}
            </div>

            <div className="md:col-span-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer address"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminUserCreate;