"use client";

import { Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PaymentPage = () => {
  const router = useRouter();

  // Mock order data - in real app this would come from context or props
  const orderData = {
    items: [
      {
        name: "Premium Body Care Cream",
        quantity: 1,
        price: 5000
      }
    ],
    subtotal: 5000,
    deliveryFee: 500,
    // Payment breakdown calculations
    upfrontPaymentPercent: 10,
    discountPercent: 5,
    platformChargePercent: 2.5
  };

  // Calculate payment breakdown
  const itemCost = orderData.subtotal;
  const upfrontPayment = itemCost * (orderData.upfrontPaymentPercent / 100);
  const remainBalance = itemCost;
  const actualDiscounted = upfrontPayment * (orderData.discountPercent / 100);
  const platformCharge = remainBalance * (orderData.platformChargePercent / 100);
  const finalAmount = upfrontPayment + remainBalance - actualDiscounted + platformCharge + orderData.deliveryFee;

  const handlePayment = () => {
    // Simulate payment processing
    console.log("Processing payment...");
    // In real app, integrate with Flutterwave or other payment gateway
    setTimeout(() => {
      router.push('/user/order-success');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

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
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Breakdown - Left Side */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Breakdown</h2>
                  
                  <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Up-front payment %</span>
                        <span className="font-semibold">{orderData.upfrontPaymentPercent}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Actual up-front payment</span>
                        <span className="font-semibold text-[#5d2a8b]">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(upfrontPayment)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Remain balance</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(remainBalance)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Discount % on up-front payment</span>
                        <span className="font-semibold">{orderData.discountPercent}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Actual discounted</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(actualDiscounted)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Platform's charge %</span>
                        <span className="font-semibold">{orderData.platformChargePercent}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Platform's charge amount</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(platformCharge)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(orderData.deliveryFee)}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Final Amount</span>
                          <span className="text-[#5d2a8b]">
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(finalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form - Right Side */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
                  
                  <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6">
                    {/* Security Notice */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg flex items-start">
                      <Lock className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Secure Payment Processing</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          You will be redirected to Flutterwave for secure payment processing.
                        </p>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button 
                      className="w-full bg-[#5d2a8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors"
                      onClick={handlePayment}
                    >
                      Pay Now
                    </button>
                  </div>
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