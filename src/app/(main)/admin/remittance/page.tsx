"use client";

import React, { useState, useEffect } from 'react';
import BankDetailsService from '@/services/BankDetailsService';

const RemittancePage = () => {
  const [loading, setLoading] = useState(true);
  
  // Settlement data state
  const [settlements, setSettlements] = useState<any[]>([]);
 
  // Bank details state
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState('');

  useEffect(() => {
    loadSettlements();
    loadBankDetails();
  }, []);

  const loadSettlements = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/orders/admin/settlements`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSettlements(result.data.settlements || []);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch settlements:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading settlements:', error);
    }
  };

  const loadBankDetails = async () => {
    try {
      setBankLoading(true);
      // Admin uses admin endpoint
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/admin/bank-details`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.data?.bankDetails) {
          setBankDetails(result.data.bankDetails);
          setBankForm({
            bankName: result.data.bankDetails.bankName,
            accountNumber: result.data.bankDetails.accountNumber,
            accountName: result.data.bankDetails.accountName,
          });
        }
      } else if (response.status === 404) {
        // No bank details found, keep bankDetails as null
        setBankDetails(null);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch admin bank details:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading bank details:', error);
    } finally {
      setBankLoading(false);
    }
  };



  const handleBankDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBankLoading(true);
      setBankError('');
      
      // Admin uses admin endpoint
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/admin/bank-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(bankForm),
      });
      
      const result = await response.json();
      
      if (response.ok && result.data?.bankDetails) {
        setBankDetails(result.data.bankDetails);
        setIsEditingBank(false);
      } else {
        const errorText = await response.text();
        console.error('Bank details save failed:', response.status, errorText);
        throw new Error(result.data?.bankDetails ? 'Failed to register bank details' : 'Organization must exist in database before adding bank details');
      }
    } catch (error: any) {
      setBankError(error.message || 'Failed to save bank details');
    } finally {
      setBankLoading(false);
    }
  };

  const handleBankEdit = () => {
    setIsEditingBank(true);
    setBankError('');
  };

  const handleConfirmRemittance = async (orderId: string) => {
    try {
      const comment = prompt('Add a comment (optional):');
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/orders/admin/${orderId}/confirm-remittance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ comment }),
      });
      
      if (response.ok) {
        alert('Remittance confirmed successfully!');
        loadSettlements(); // Refresh the table
      } else {
        const errorText = await response.text();
        console.error('Failed to confirm remittance:', response.status, errorText);
        alert('Failed to confirm remittance: ' + errorText);
      }
    } catch (error) {
      console.error('Error confirming remittance:', error);
      alert('Error confirming remittance');
    }
  };

  if (loading) {
    return <div className="container ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading settlements...</div>
      </div>
    </div>;
  }

  return (
    <div className="container ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settlement Records</h1>
            <p className="text-gray-600">Manage organization settlement confirmations</p>
          </div>
          <button
            onClick={() => window.location.href = '/admin/remittance/create'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Settlement
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Settlement Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Remitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settlement Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Evidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settlements.map((order) => {
                  const remittance = order.remittance;
                  return (
                    <tr key={order._id || order.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{order.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${remittance?.amountRemitted?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{remittance?.settlementDate || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {remittance?.paymentEvidenceUrl ? (
                          <a href={remittance.paymentEvidenceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            Download
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          remittance?.remittanceStatus === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {remittance?.remittanceStatus?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {remittance?.organizationComment || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {remittance?.remittanceStatus !== 'confirmed' ? (
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleConfirmRemittance(order._id || order.id)}
                          >
                            Confirm
                          </button>
                        ) : (
                          <span className="text-gray-500">Confirmed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Bank Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Organization Bank Details</h2>
            {!isEditingBank && bankDetails && (
              <button
                onClick={() => {
                  setIsEditingBank(true);
                  setBankError('');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
          
          {bankError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {bankError}
            </div>
          )}
          
          {isEditingBank || !bankDetails ? (
            <form onSubmit={handleBankDetailsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    value={bankForm.bankName}
                    onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <input
                    type="text"
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                  <input
                    type="text"
                    value={bankForm.accountName}
                    onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter account name"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={bankLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {bankLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Bank Details
                    </>
                  )}
                </button>
                {isEditingBank && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingBank(false);
                      setBankError('');
                      if (bankDetails) {
                        setBankForm({
                          bankName: bankDetails.bankName,
                          accountNumber: bankDetails.accountNumber,
                          accountName: bankDetails.accountName,
                        });
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <p className="text-gray-900">{bankDetails.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <p className="text-gray-900">{bankDetails.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <p className="text-gray-900">{bankDetails.accountName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{new Date(bankDetails.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemittancePage;