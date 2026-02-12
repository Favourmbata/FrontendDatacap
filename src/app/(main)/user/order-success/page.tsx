"use client";

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 border-2 border-[#5d2a8b] text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your items will be delivered according to your selected delivery method.
        </p>
        
        <button
          className="w-full bg-[#5d2a8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors"
          onClick={() => router.push('/user/body-care')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;