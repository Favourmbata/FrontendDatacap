"use client";

import React, { useState, useEffect } from 'react';
import { superAdminUserModule, Customer } from './userModule';
import { useParams, useRouter } from 'next/navigation';

const SuperAdminUserView: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await superAdminUserModule.getCustomerById(id as string);
      setCustomer(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error: {error}
        <button 
          onClick={() => fetchCustomer()} 
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4 text-center">
        <p>Customer not found</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
        <p className="text-gray-600">View customer information</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{customer.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-gray-900">{customer.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Customer ID</label>
                <p className="text-gray-900">{customer.customerId}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Number</label>
                <p className="text-gray-900">{customer.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(customer.status)}`}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Created</label>
                <p className="text-gray-900">{new Date(customer.accountCreatedOn).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(customer.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">State</label>
              <p className="text-gray-900">{customer.state}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">LGA</label>
              <p className="text-gray-900">{customer.lga}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{customer.address}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/super-admin/users/edit/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Customer
          </button>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUserView;