"use client"

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const VerifiedBadgeVerificationComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | 'verifying'>('pending');
  const [message, setMessage] = useState('');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
    console.log(log);
  };

  useEffect(() => {
    const verifyPayment = async () => {
      addLog('🔥🔥🔥 VERIFIED BADGE PAYMENT VERIFICATION START 🔥🔥🔥');
      
      // Extract tx_ref from URL
      const urlParams = new URLSearchParams(window.location.search);
      const txRef = urlParams.get('tx_ref');
      const status = urlParams.get('status');
      
      addLog(`📍 Full URL: ${window.location.href}`);
      addLog(`🔍 Status: ${status}`);
      addLog(`🔍 tx_ref: ${txRef}`);
      
      if (!txRef) {
        addLog('❌ No transaction reference found');
        setVerificationStatus('failed');
        setMessage('No transaction reference found');
        return;
      }
      
      if (status !== 'successful' && status !== 'success') {
        addLog(`❌ Payment status is not successful: ${status}`);
        setVerificationStatus('failed');
        setMessage('Payment was not successful');
        return;
      }
      
      setVerificationStatus('verifying');
      setMessage('Verifying your payment...');
      addLog('🔥 Calling backend verification endpoint');
      
      try {
        const token = localStorage.getItem('token');
        
        // 🔍 COMPREHENSIVE TOKEN DEBUGGING
        addLog('\n🔍 ===== TOKEN DEBUG START =====');
        addLog(`Token exists: ${!!token}`);
        addLog(`Token length: ${token?.length}`);
        if (token) {
          addLog(`Token preview: ${token.substring(0, 50)}...`);
          
          // Decode JWT to see payload
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            addLog('📦 Token Payload:');
            addLog(`  - User ID: ${payload.userId || payload.id || payload._id}`);
            addLog(`  - Organization ID: ${payload.organizationId}`);
            addLog(`  - Has organizationId: ${!!payload.organizationId}`);
            addLog(`  - Token expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
            addLog(`  - Full payload: ${JSON.stringify(payload, null, 2)}`);
            
            if (!payload.organizationId) {
              addLog('⚠️⚠️⚠️ WARNING: Token does NOT contain organizationId!');
              addLog('⚠️ User needs to LOG OUT and LOG BACK IN to get a fresh token!');
            }
          } catch (e: any) {
            addLog(`❌ Failed to decode token: ${e.message}`);
          }
        } else {
          addLog('❌ NO TOKEN FOUND IN LOCALSTORAGE!');
          addLog('❌ User needs to log in!');
        }
        addLog('===== TOKEN DEBUG END =====\n');
        
        if (!token) {
          setVerificationStatus('failed');
          setMessage('Please log in to verify your payment. Redirecting to login...');
          setTimeout(() => {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            router.push('/auth/login');
          }, 2000);
          return;
        }
        
        const requestBody = { tx_ref: txRef };
        addLog(`📤 Request body: ${JSON.stringify(requestBody)}`);
        addLog(`📤 Authorization header: Bearer ${token.substring(0, 20)}...`);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com'}/api/payment/verified-badge/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });
        
        addLog(`📡 Response status: ${response.status}`);
        
        const result = await response.json();
        addLog(`✅ Response: ${JSON.stringify(result)}`);
        
        if (result.success) {
          addLog('✅✅✅ PAYMENT VERIFICATION SUCCESSFUL!');
          setVerificationStatus('success');
          setVerificationData(result.data);
          setMessage('Payment successful! Your locations are now pending admin verification.');
          
          setTimeout(() => {
            addLog('🔄 Redirecting to verification-badge page...');
            router.push('/admin/subscription/verification-badge');
          }, 3000);
        } else {
          addLog('❌❌❌ PAYMENT VERIFICATION FAILED');
          addLog(`❌ Error: ${result.message}`);
          setVerificationStatus('failed');
          setMessage(result.message || 'Payment verification failed. Please contact support.');
        }
      } catch (error: any) {
        addLog('❌❌❌ VERIFICATION ERROR CAUGHT');
        addLog(`❌ Error: ${error.message}`);
        console.error('Payment verification failed:', error);
        setVerificationStatus('failed');
        
        if (error.message?.includes('Authentication')) {
          addLog('❌ Authentication error detected');
          setMessage('Please log in to verify your payment. Redirecting to login...');
          setTimeout(() => {
            localStorage.setItem('redirectAfterLogin', window.location.href);
            router.push('/auth/login');
          }, 2000);
        } else {
          setMessage(error.message || 'An error occurred during payment verification.');
        }
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

        {verificationData && verificationStatus === 'success' && (
          <div className="mb-6 text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Status:</span> Pending Admin Verification</p>
              {verificationData.amount && (
                <p><span className="font-medium">Amount:</span> ₦{verificationData.amount?.toLocaleString('en-NG')}</p>
              )}
              {verificationData.description && (
                <p><span className="font-medium">Description:</span> {verificationData.description}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {verificationStatus === 'success' && (
            <button
              onClick={() => router.push('/admin/subscription/verification-badge')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Go to Locations
            </button>
          )}
          
          {verificationStatus === 'failed' && (
            <>
              <button
                onClick={() => router.push('/admin/subscription/verification-badge')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/admin')}
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

        {/* Debug Logs Panel */}
        {debugLogs.length > 0 && (
          <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-xs">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold">Debug Logs</h3>
              <button 
                onClick={() => setDebugLogs([])} 
                className="text-red-400 hover:text-red-300 text-xs"
              >
                Clear
              </button>
            </div>
            {debugLogs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VerifiedBadgeVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment verification...</p>
        </div>
      </div>
    }>
      <VerifiedBadgeVerificationComponent />
    </Suspense>
  );
};

export default VerifiedBadgeVerificationPage;
