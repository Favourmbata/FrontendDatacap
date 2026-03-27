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
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Get order data from localStorage
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct) {
      try {
        const productData = JSON.parse(savedProduct);
        
        setOrderData({
          productId: productData.productId,
          productName: productData.name,
          productPrice: productData.price,
          upfrontPayment: productData.upfrontPayment || productData.price * 0.1,
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

        // Set booking date and time if they exist (for services)
        if (productData.bookingDate) {
          setBookingDate(productData.bookingDate);
        }
        if (productData.bookingTime) {
          setBookingTime(productData.bookingTime);
        }
      } catch (err) {
        setError('Failed to load order data');
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
        setLoading(false);
        return;
      }
      
      // For services, validate booking date and time
      if (orderData.itemType === 'service' && (!bookingDate || !bookingTime)) {
        setError('Booking date and time are required for services');
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
        customerPhone: orderData.customerPhone || '',
        paymentType: selectedPaymentType,
        itemType: orderData.itemType,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        redirectUrl: `${window.location.origin}/user/payment/callback`
      };

      const response = await OrderService.initiatePayment(paymentData, token || undefined);
      
      if (response.success) {
        window.location.href = response.data.link;
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Payment Details</h2>
                            
                <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6 mb-8">
                 
                  {/* Booking Information for Services */}
                  {orderData.itemType === 'service' && (
                    <div className="mb-8 pb-6 border-b-2 border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-[#5d2a8b] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                        Service Booking Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Booking Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Booking Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                            required
                          />
                        </div>
                      </div>
                      
                      {!bookingDate || !bookingTime ? (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-yellow-700">
                            Please select your preferred booking date and time to proceed with payment.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Payment Type Selection */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-[#5d2a8b] text-white rounded-full flex items-center justify-center text-sm mr-2">
                          {orderData.itemType === 'service' ? '2' : '1'}
                        </span>
                        Choose your payment option:
                      </h3>
                                  
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