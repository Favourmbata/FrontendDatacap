"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionPackage } from '@/services/subscriptionService';

const SubscriptionList = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - this would come from your service in a real implementation
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockSubscriptions: SubscriptionPackage[] = [
        {
          id: '1',
          packageName: 'Basic Plan',
          services: 'Basic Services',
          monthlyPrice: 5000,
          quarterlyPrice: 14000,
          yearlyPrice: 50000,
          setupDate: '2024-01-15',
          status: 'active',
          description: 'Basic subscription package',
          subscriberCount: 25,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          updatedDate: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          packageName: 'Premium Plan',
          services: 'Premium Services',
          monthlyPrice: 10000,
          quarterlyPrice: 28000,
          yearlyPrice: 100000,
          setupDate: '2024-02-20',
          status: 'active',
          description: 'Premium subscription package',
          subscriberCount: 15,
          createdAt: '2024-02-20T14:45:00Z',
          updatedAt: '2024-02-20T14:45:00Z',
          updatedDate: '2024-02-20T14:45:00Z'
        }
      ];
      setSubscriptions(mockSubscriptions);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateNew = () => {
    router.push('/super-admin/subscription/create');
  };

  const handleViewDetails = (id: string) => {
    router.push(`/super-admin/subscription/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/super-admin/subscription/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    }
  };

  const handleStatusChange = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id 
        ? { ...sub, status: sub.status === 'active' ? 'inactive' : 'active' } 
        : sub
    ));
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.services.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search subscriptions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={handleCreateNew}
          className="w-full sm:w-auto px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
        >
          + Create New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prices
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribers
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subscription.packageName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.services}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Monthly: ₦{subscription.monthlyPrice.toLocaleString()}</div>
                      <div>Quarterly: ₦{subscription.quarterlyPrice.toLocaleString()}</div>
                      <div>Yearly: ₦{subscription.yearlyPrice.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.subscriberCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(subscription.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(subscription.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStatusChange(subscription.id)}
                        className={
                          subscription.status === 'active'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }
                      >
                        {subscription.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionList;