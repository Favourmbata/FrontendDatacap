"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/app/components/hooks/use-toast';
import { AlertCircle, Download, CheckCircle } from 'lucide-react';

const OrderPage = () => {
  const [loading, setLoading] = useState(true);
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
        loadOrders();
        toast({
          title: "Success",
          description: "Remittance confirmed successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || 'Failed to confirm remittance',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error confirming remittance:', error);
      toast({
        title: "Error",
        description: "Error confirming remittance",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settlements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Settlements</h2>
          <p className="text-gray-600">View and manage order settlements and remittances.</p>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product/Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Remitted (₦)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settlement Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Evidence</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const remittance = order.remittance;
                    return (
                      <tr key={order._id || order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{remittance?.amountRemitted?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {remittance?.settlementDate || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {remittance?.paymentEvidenceUrl ? (
                            <a 
                              href={remittance.paymentEvidenceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            remittance?.remittanceStatus === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {remittance?.remittanceStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {remittance?.remittanceStatus !== 'confirmed' && (
                            <button
                              onClick={() => confirmRemittance(order._id || order.id)}
                              className="inline-flex items-center px-3 py-1 bg-[#5d2a8b] text-white rounded-md hover:bg-[#7a3aa3] transition-colors text-xs font-medium"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No settlement records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;