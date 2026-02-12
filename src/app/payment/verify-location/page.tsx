"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import LocationPaymentService from '@/services/LocationPaymentService';

const VerificationClientComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | 'verifying'>('pending');
  const [message, setMessage] = useState('');
  const [verificationData, setVerificationData] = useState<any>(null);

  useEffect(() => {
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transaction_id');
    
    if (status === 'success' && transactionId) {
      verifyLocationPayment(transactionId);
    } else if (status === 'cancelled') {
      setVerificationStatus('failed');
      setMessage('Payment was cancelled. Please try again.');
    } else {
      setVerificationStatus('failed');
      setMessage('Invalid payment verification request.');
    }
  }, [searchParams]);

  const verifyLocationPayment = async (transactionId: string) => {
    setVerificationStatus('verifying');
    setMessage('Verifying your payment...');
    
    try {
      const response = await LocationPaymentService.verifyPayment({ transactionId });
      
      if (response.success) {
        setVerificationStatus('success');
        setVerificationData(response.data);
        setMessage('Location verification payment successful! Your profile will be updated to pending verification status.');
        
        // Redirect to subscription packages after 3 seconds
        setTimeout(() => {
          router.push('/subscription');
        }, 3000);
      } else {
        setVerificationStatus('failed');
        setMessage(response.data?.message || 'Payment verification failed. Please contact support.');
      }
    } catch (error: any) {
      setVerificationStatus('failed');
      setMessage(error.message || 'An error occurred during payment verification.');
    }
  };

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
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
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

        {verificationData && verificationStatus === 'success' && (
          <div className="mb-6 text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Amount:</span> ₦{verificationData.amount?.toLocaleString('en-NG')}</p>
              <p><span className="font-medium">Description:</span> {verificationData.description}</p>
              <p><span className="font-medium">Locations Verified:</span> {verificationData.totalLocations}</p>
              {verificationData.locationFees && (
                <div className="mt-2">
                  <p className="font-medium">Location Fees:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {verificationData.locationFees.map((fee: any, index: number) => (
                      <li key={index}>
                        {fee.location}: ₦{fee.fee.toLocaleString('en-NG')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {verificationStatus === 'success' && (
            <button
              onClick={() => router.push('/subscription')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Continue to Subscription
            </button>
          )}
          
          {verificationStatus === 'failed' && (
            <>
              <button
                onClick={() => router.push('/subscription')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Go to Homepage
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

const LocationPaymentVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment verification...</p>
        </div>
      </div>
    }>
      <VerificationClientComponent />
    </Suspense>
  );
};

export default LocationPaymentVerificationPage;