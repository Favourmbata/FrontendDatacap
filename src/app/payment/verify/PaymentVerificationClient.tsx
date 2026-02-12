'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import PaymentService from '@/services/PaymentService';

const PaymentVerificationClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');
        const paymentStatus = searchParams.get('status');

        if (!transactionId) {
          setStatus('error');
          setMessage('Missing transaction ID');
          return;
        }

        if (paymentStatus !== 'successful') {
          setStatus('error');
          setMessage('Payment was not successful');
          return;
        }

        // Verify payment with backend
        const response = await PaymentService.verifyPayment({
          transactionId
        });

        if (response.success) {
          setStatus('success');
          setMessage('Payment verified successfully! Subscription activated.');
          
          // Redirect to admin page after delay
          setTimeout(() => {
            router.push('/admin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('An error occurred while verifying payment');
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Verifying Payment</h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-gray-600">{message}</p>
              <button
                onClick={() => router.push('/subscription')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationClient;