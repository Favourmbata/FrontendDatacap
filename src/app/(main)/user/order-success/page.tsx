"use client";

import { CheckCircle, Package, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const OrderSuccessPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Get order data from localStorage if available
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct) {
      try {
        const productData = JSON.parse(savedProduct);
        setOrderData(productData);
      } catch (err) {
        console.error('Error parsing order data:', err);
      }
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 border-2 border-[#5d2a8b] text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        
        {orderData ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-2">{orderData.name}</h2>
            <p className="text-gray-600 mb-1">Amount: {formatCurrency(orderData.price)}</p>
            <p className="text-sm text-gray-500">Order ID: {orderData.productId}</p>
          </div>
        ) : (
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your items will be delivered according to your selected delivery method.
          </p>
        )}
        
        <div className="space-y-3">
          <button
            className="w-full bg-[#5d2a8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors flex items-center justify-center"
            onClick={() => router.push('/user/orders')}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View My Orders
          </button>
          
          <button
            className="w-full border-2 border-[#5d2a8b] text-[#5d2a8b] px-6 py-3 rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
            onClick={() => router.push('/user/body-care')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;