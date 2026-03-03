"use client";

import { useState, useEffect } from 'react';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import OrderService from '@/services/OrderService';

const PaymentPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'upfront' | 'remaining' | 'full'>('upfront');

  // Get order data from localStorage
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct) {
      try {
        const productData = JSON.parse(savedProduct);
        
       
        console.log('Retrieved product data from localStorage:', productData);
        setOrderData({
          productId: productData.productId,
          productName: productData.name,
          productPrice: productData.price,
          upfrontPayment: productData.upfrontPayment || productData.price * 0.1, // Use product's upfront amount or 10% default
          organizationId: productData.organizationId || 'ORG1766704354663',
          organizationName: productData.organizationName || 'Service Provider',
          customerEmail: user?.email || '',
          customerName: user?.fullName || '',
          customerPhone: user?.phoneNumber || '',
          upfrontPercentage: productData.upfrontPercentage || 10,
          itemType: productData.itemType, 
          discountPercent: 5, 
          platformChargePercent: 2.5, 
          deliveryFee: 500 
        });
      } catch (err) {
        setError('Failed to load order data');
        console.error('Error parsing order data:', err);
      }
    } else {
      setError('No order data found. Please select a product first.');
    }
  }, [user]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  // No payment breakdown calculation needed since we removed the section

  const handleInitiatePayment = async () => {
    console.log('Pay button clicked');
    console.log('Order data:', orderData);
    console.log('Selected payment type:', selectedPaymentType);
    console.log('User:', user);
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate that orderData exists
      if (!orderData) {
        setError('Order data not loaded. Please go back and select a product again.');
        setLoading(false);
        return;
      }
      
      // Validate required fields before proceeding
      if (!orderData.productId || !orderData.productName || !orderData.organizationId || !orderData.organizationName || 
          !orderData.customerEmail || !orderData.customerName || !orderData.itemType) {
        setError('Missing required customer information. Please ensure you are logged in and your profile is complete.');
        console.log('Missing fields:', {
          productId: orderData.productId,
          productName: orderData.productName,
          organizationId: orderData.organizationId,
          organizationName: orderData.organizationName,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          itemType: orderData.itemType
        });
        setLoading(false);
        return;
      }
      
      const paymentData = {
        productId: orderData.productId,
        productName: orderData.productName,
        organizationId: orderData.organizationId,
        organizationName: orderData.organizationName,
        productPrice: orderData.productPrice,
        upfrontPercentage: orderData.upfrontPercentage,
        userId: user?.id,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone || '', // Phone is optional
        paymentType: selectedPaymentType,
        itemType: orderData.itemType, // Include item type (product or service)
        // Include callback URL for payment verification after completion
        redirectUrl: `${window.location.origin}/user/payment/callback`
      };

      console.log('Sending payment data:', paymentData);
      const response = await OrderService.initiatePayment(paymentData, token || undefined);
      console.log('Payment response:', response);
      
      if (response.success) {
        // Redirect to Flutterwave payment page
        window.location.href = response.data.link;
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      console.error('Payment initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // formatCardNumber function removed as it's no longer needed

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold">Payment</h1>
                <div className="w-16"></div> 
              </div>
            </div>

            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Payment Type</h2>
                            
                <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6 mb-8">
                 
                  <div className="space-y-4 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your payment option:</h3>
                                  
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5d2a8b] transition-colors">
                          <input
                            type="radio"
                            name="paymentType"
                            value="upfront"
                            checked={selectedPaymentType === 'upfront'}
                            onChange={(e) => setSelectedPaymentType(e.target.value as 'upfront' | 'remaining' | 'full')}
                            className="h-5 w-5 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">Upfront Payment</div>
                            <div className="text-sm text-gray-600">Pay {orderData.upfrontPercentage}% upfront ({new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(orderData.upfrontPayment)})</div>
                          </div>
                        </label>
                                    
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5d2a8b] transition-colors">
                          <input
                            type="radio"
                            name="paymentType"
                            value="remaining"
                            checked={selectedPaymentType === 'remaining'}
                            onChange={(e) => setSelectedPaymentType(e.target.value as 'upfront' | 'remaining' | 'full')}
                            className="h-5 w-5 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">Remaining Balance</div>
                            <div className="text-sm text-gray-600">Pay the remaining balance ({new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(orderData.productPrice - orderData.upfrontPayment)})</div>
                          </div>
                        </label>
                                    
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5d2a8b] transition-colors">
                          <input
                            type="radio"
                            name="paymentType"
                            value="full"
                            checked={selectedPaymentType === 'full'}
                            onChange={(e) => setSelectedPaymentType(e.target.value as 'upfront' | 'remaining' | 'full')}
                            className="h-5 w-5 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">Full Payment</div>
                            <div className="text-sm text-gray-600">Pay the full amount ({new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(orderData.productPrice)})</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
            
                 
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Error</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg flex items-start">
                    <Lock className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Secure Payment Processing</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        You will be redirected to Flutterwave for secure payment processing.
                      </p>
                    </div>
                  </div>
            
                  
                  <button 
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      loading 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-[#5d2a8b] text-white hover:bg-[#7a3aa3] cursor-pointer'
                    }`}
                    onClick={handleInitiatePayment}
                    disabled={loading || !orderData}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : !orderData ? (
                      'Loading Order Data...'
                    ) : (
                      `Pay ${selectedPaymentType === 'upfront' ? 'Upfront' : selectedPaymentType === 'remaining' ? 'Remaining' : 'Full'} Amount`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;