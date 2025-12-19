"use client";

import React, { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  user: string;
  email: string;
  amount: string;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
}

const PaymentsManagementPage = () => {
  const router = useRouter();
  const [payments] = useState<Payment[]>([
    { 
      id: 'PAY-001', 
      user: 'John Doe',
      email: 'john.doe@example.com',
      amount: '99.99',
      currency: 'USD',
      date: '2023-12-15T10:30:00Z',
      status: 'completed',
      transactionId: 'txn_123456789'
    },
    { 
      id: 'PAY-002', 
      user: 'Jane Smith',
      email: 'jane.smith@example.com',
      amount: '149.99',
      currency: 'USD',
      date: '2023-12-14T14:45:00Z',
      status: 'completed',
      transactionId: 'txn_987654321'
    },
    { 
      id: 'PAY-003', 
      user: 'Robert Johnson',
      email: 'robert.j@example.com',
      amount: '49.99',
      currency: 'USD',
      date: '2023-12-10T09:15:00Z',
      status: 'pending',
      transactionId: 'txn_456789123'
    },
    { 
      id: 'PAY-004', 
      user: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      amount: '199.99',
      currency: 'USD',
      date: '2023-12-05T16:20:00Z',
      status: 'refunded',
      transactionId: 'txn_321654987'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(payment => 
    payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Management</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
        </div>

        {/* Search and Action Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button
              className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg font-medium">No payments found</p>
                        <p className="text-sm mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{payment.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                        <div className="text-sm text-gray-500">{payment.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono text-xs">
                          {payment.transactionId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/super-admin/payments/view/${payment.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="View payment details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsManagementPage;