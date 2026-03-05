"use client";

import React, { useState } from 'react';
import { Landmark, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BankDetailsService from '@/services/BankDetailsService';
import { toast } from '@/app/components/hooks/use-toast';

const CreateBankDetailsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const result = await BankDetailsService.registerBankDetails(bankForm);
      
      toast({
        title: 'Success',
        description: 'Bank details saved successfully',
        variant: 'default'
      });
      
      // Wait a moment for the toast to show before redirecting
      setTimeout(() => {
        router.push('/admin/remittance');
      }, 500);
    } catch (error: any) {
      setError(error.message || 'Failed to save bank details');
      toast({
        title: 'Error',
        description: error.message || 'Failed to save bank details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/admin/remittance" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Landmark className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Add Bank Details
            </h1>
          </div>
        </div>
        <p className="text-gray-600 mt-1 ml-12">
          Add your organization bank account information
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Bank Account Information
          </h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter bank name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter account number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bankForm.accountName}
                onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter account name"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Bank Details
                  </>
                )}
              </button>
              <Link
                href="/admin/remittance"
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBankDetailsPage;