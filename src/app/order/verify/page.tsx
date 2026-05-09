"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import OrderService from '@/services/OrderService';

const OrderVerificationComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | 'verifying'>('pending');
  const [message, setMessage] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const txRef = urlParams.get('tx_ref');
      const status = urlParams.get('status');
      
      if (!txRef) {
        setVerificationStatus('failed');
        setMessage('No transaction reference found');
        return;
      }
      
      if (status !== 'successful' && status !== 'success') {
        setVerificationStatus('failed');
        setMessage(status === 'cancelled' ? 'Payment was cancelled. Please try again.' : 'Payment was not successful');
        return;
      }
      
      setVerificationStatus('verifying');
      setMessage('Verifying your payment...');
      
      try {
        const response = await OrderService.verifyPayment({ transactionId: txRef });
        
        if (response.success) {
          setVerificationStatus('success');
          setOrderData(response.data.order);
          
          const order = response.data.order;
          const isPaid = order.orderStatus === 'fully_paid';
          const isPartial = order.orderStatus === 'partially_paid';
          
          setMessage(
            isPaid 
              ? 'Payment successful! Your order has been confirmed.' 
              : isPartial 
              ? 'Upfront payment successful! Complete remaining payment to finalize your order.'
              : 'Payment verified successfully!'
          );
          
          setTimeout(() => {
            router.push('/user/orders');
          }, 3000);
        } else {
          setVerificationStatus('failed');
          setMessage(response.message || 'Payment verification failed. Please contact support.');
        }
      } catch (error: any) {
        console.error('Order payment verification failed:', error);
        setVerificationStatus('failed');
        setMessage(error.message || 'An error occurred during payment verification.');
      }
    };
    
    verifyPayment();
  }, [router]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      case 'verifying':
        return (
          <div className="mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        );
      default:
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'verifying':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {getStatusIcon()}
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {verificationStatus === 'success' && 'Payment Successful!'}
          {verificationStatus === 'failed' && 'Payment Failed'}
          {verificationStatus === 'verifying' && 'Verifying Payment...'}
          {verificationStatus === 'pending' && 'Payment Status'}
        </h1>
        
        <div className={`mb-6 p-4 rounded-lg border ${getStatusColor()}`}>
          <p className="font-medium">{message}</p>
        </div>

        {orderData && verificationStatus === 'success' && (
          <div className="mb-6 text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details:
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {orderData.productName && (
                <p><span className="font-medium">Product/Service:</span> {orderData.productName}</p>
              )}
              {orderData.organizationName && (
                <p><span className="font-medium">Provider:</span> {orderData.organizationName}</p>
              )}
              {orderData.productPrice && (
                <p><span className="font-medium">Total Price:</span> ₦{orderData.productPrice?.toLocaleString('en-NG')}</p>
              )}
              {orderData.totalAmountPaid && (
                <p><span className="font-medium">Amount Paid:</span> ₦{orderData.totalAmountPaid?.toLocaleString('en-NG')}</p>
              )}
              {orderData.orderStatus && (
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`px-2 py-1 rounded text-xs ${
                    orderData.orderStatus === 'fully_paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {orderData.orderStatus === 'fully_paid' ? 'Fully Paid' : 'Partially Paid'}
                  </span>
                </p>
              )}
              {orderData.itemType && (
                <p><span className="font-medium">Type:</span> {orderData.itemType === 'service' ? 'Service' : 'Product'}</p>
              )}
              {orderData.serviceBooking && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium mb-1">Service Booking:</p>
                  <p className="ml-4">Date: {new Date(orderData.serviceBooking.bookingDate).toLocaleDateString()}</p>
                  <p className="ml-4">Time: {orderData.serviceBooking.bookingTime}</p>
                  <p className="ml-4">Status: {orderData.serviceBooking.bookingStatus}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {verificationStatus === 'success' && (
            <>
              <button
                onClick={() => router.push('/user/orders')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                View My Orders
              </button>
              {orderData?.orderStatus === 'partially_paid' && (
                <button
                  onClick={() => router.push('/user/orders')}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Complete Payment
                </button>
              )}
            </>
          )}
          
          {verificationStatus === 'failed' && (
            <>
              <button
                onClick={() => router.back()}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/user')}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>

        {verificationStatus === 'verifying' && (
          <p className="text-sm text-gray-500 mt-4">
            Please wait while we verify your payment...
          </p>
        )}
      </div>
    </div>
  );
};

const OrderVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment verification...</p>
        </div>
      </div>
    }>
      <OrderVerificationComponent />
    </Suspense>
  );
};

export default OrderVerificationPage;
