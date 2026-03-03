"use client";

import React, { useState, useEffect } from 'react';

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
  
  // Orders data state
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/orders/admin/settlements`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOrders(result.data.settlements || []);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch settlements:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmRemittance = async (orderId: string) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${BASE_URL}/api/orders/admin/${orderId}/confirm-remittance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Refresh the orders list
        loadOrders();
        alert('Remittance confirmed successfully!');
      } else {
        alert(result.message || 'Failed to confirm remittance');
      }
    } catch (error) {
      console.error('Error confirming remittance:', error);
      alert('Error confirming remittance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-6 border-b">
              <h1 className="text-2xl font-semibold text-gray-800">Order Settlements</h1>
              <p className="mt-1 text-gray-600">View and manage order settlements and remittances</p>
            </div>

            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No settlement records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Remitted (₦)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settlement Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Evidence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => {
                        const remittance = order.remittance;
                        return (
                          <tr key={order._id || order.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{order.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₦{remittance?.amountRemitted?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{remittance?.settlementDate || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {remittance?.paymentEvidenceUrl ? (
                                <a href={remittance.paymentEvidenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
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
                              {remittance?.remittanceStatus !== 'confirmed' && (
                                <button
                                  onClick={() => confirmRemittance(order._id || order.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;