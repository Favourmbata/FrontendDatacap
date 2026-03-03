"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import OrderService from '@/services/OrderService';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const PaymentCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        
        const statusParam = searchParams.get('status');
        const transactionId = searchParams.get('transaction_id') || searchParams.get('tx_ref') || searchParams.get('transaction_id');
        const txRef = searchParams.get('tx_ref');
        
        console.log('Callback parameters:', { statusParam, transactionId, txRef });
        
        if (statusParam === 'cancelled') {
          setStatus('error');
          setMessage('Payment was cancelled by the user.');
          return;
        }
        
        if (!transactionId && !txRef) {
          setStatus('error');
          setMessage('Transaction details not found. Unable to verify payment.');
          return;
        }

        
        const verifyData = {
          transactionId: transactionId || txRef!
        };

        const response = await OrderService.verifyPayment(verifyData);
        
        if (response.success) {
          setStatus('success');
          setMessage('Payment verified successfully!');
          setOrder(response.data.order);
          
         
          localStorage.removeItem('selectedProduct');
        } else {
          setStatus('error');
          setMessage(response.message || 'Payment verification failed.');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred while verifying payment.');
      }
    };

    
    const timer = setTimeout(() => {
      verifyPayment();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

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
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader className="w-16 h-16 text-[#5d2a8b] animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {order && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <h2 className="font-semibold text-gray-900 mb-2">Order Details</h2>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Item Type:</span> {order.itemType}</p>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Product/Service:</span> {order.productName}</p>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Amount Paid:</span> {formatCurrency(order.totalAmountPaid)}</p>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Order Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    order.orderStatus === 'fully_paid' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'partially_paid' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </p>
                <p className="text-sm text-gray-600"><span className="font-medium">Order ID:</span> {order._id}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                className="w-full bg-[#5d2a8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors"
                onClick={() => router.push('/user/orders')}
              >
                View My Orders
              </button>
              
              <button
                className="w-full border-2 border-[#5d2a8b] text-[#5d2a8b] px-6 py-3 rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
                onClick={() => router.push('/user/body-care')}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
            <p className="text-red-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                className="w-full bg-[#5d2a8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors"
                onClick={() => router.push('/user/orders')}
              >
                View My Orders
              </button>
              
              <button
                className="w-full border-2 border-[#5d2a8b] text-[#5d2a8b] px-6 py-3 rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
                onClick={() => router.push('/user/body-care')}
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;