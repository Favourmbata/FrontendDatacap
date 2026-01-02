"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockSubscriptionService } from '@/services/mockSubscriptionService';
import { toast } from '@/app/components/hooks/use-toast';
import { CheckCircle, XCircle, Package, CreditCard, Check } from 'lucide-react';

interface SubscriptionPackage {
  id: string;
  packageName: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

const SubscriptionPage = () => {
  const [selectedPackages, setSelectedPackages] = useState<Record<string, 'monthly' | 'quarterly' | 'yearly'>>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  
  const router = useRouter();

  // Mock subscription packages data
  const packages: SubscriptionPackage[] = [
    {
      id: 'body-measurement',
      packageName: 'Body Measurement',
      description: 'Complete body measurement solution with AI-powered accuracy',
      monthlyPrice: 99.99,
      quarterlyPrice: 249.99,
      yearlyPrice: 899.99,
      features: [
        'AI-powered body measurements',
        '3D body scanning',
        'Size recommendations',
        'Body composition analysis',
        'Progress tracking'
      ]
    },
    {
      id: 'questionnaire',
      packageName: 'Questionnaire',
      description: 'Comprehensive questionnaire management system',
      monthlyPrice: 79.99,
      quarterlyPrice: 199.99,
      yearlyPrice: 699.99,
      features: [
        'Custom questionnaire builder',
        'Multiple question types',
        'Response analytics',
        'Data export capabilities',
        'Automated insights'
      ]
    },
    {
      id: 'assert-management',
      packageName: 'Assert Management',
      description: 'Complete assert management and tracking solution',
      monthlyPrice: 129.99,
      quarterlyPrice: 349.99,
      yearlyPrice: 1199.99,
      features: [
        'Assert tracking and monitoring',
        'Inventory management',
        'Maintenance scheduling',
        'Assert lifecycle management',
        'Reporting and analytics'
      ]
    }
  ];

  // Calculate total amount when selections change
  useEffect(() => {
    let total = 0;
    Object.entries(selectedPackages).forEach(([packageId, billingCycle]) => {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        switch (billingCycle) {
          case 'monthly':
            total += pkg.monthlyPrice;
            break;
          case 'quarterly':
            total += pkg.quarterlyPrice;
            break;
          case 'yearly':
            total += pkg.yearlyPrice;
            break;
        }
      }
    });
    setTotalAmount(total);
  }, [selectedPackages, packages]);

  const handlePackageSelection = (packageId: string, billingCycle: 'monthly' | 'quarterly' | 'yearly') => {
    setSelectedPackages(prev => {
      if (prev[packageId] === billingCycle) {
        const newSelections = { ...prev };
        delete newSelections[packageId];
        return newSelections;
      }
      return { ...prev, [packageId]: billingCycle };
    });
  };

  const handlePayment = async () => {
    if (Object.keys(selectedPackages).length === 0) {
      toast({
        title: 'No packages selected',
        description: 'Please select at least one package to proceed with payment',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Process payment using mock service
      const selectedPackageIds = Object.keys(selectedPackages);
      const status = mockSubscriptionService.processPayment(selectedPackageIds);
      
      // Show success message
      setShowPaymentSuccess(true);
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
      toast({
        title: 'Payment Successful!',
        description: 'Your subscription has been activated. Redirecting to dashboard...',
        variant: 'default'
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'An error occurred while processing your payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getBillingPrice = (pkg: SubscriptionPackage, billingCycle: 'monthly' | 'quarterly' | 'yearly') => {
    switch (billingCycle) {
      case 'monthly': return pkg.monthlyPrice;
      case 'quarterly': return pkg.quarterlyPrice;
      case 'yearly': return pkg.yearlyPrice;
      default: return pkg.monthlyPrice;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/Group 1.png" 
              alt="Brand Logo" 
              width={55} 
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-gray-500 text-sm">Subscription Required</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="manrope text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Subscription Packages
          </h1>
          <p className="manrope text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the packages that best fit your needs. After payment, you'll gain access to all selected modules.
          </p>
        </div>

        {/* Total Amount Card */}
        <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="manrope text-xl font-semibold">Selected Packages Total</h3>
              <p className="manrope text-sm opacity-80">Amount for all selected packages</p>
            </div>
            <div className="mt-3 md:mt-0 text-right md:text-left">
              <p className="manrope text-4xl font-bold">${totalAmount.toFixed(2)}</p>
              <p className="manrope text-sm opacity-80">{Object.keys(selectedPackages).length} package(s) selected</p>
            </div>
          </div>
        </div>
        
        {/* Payment Section */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="manrope text-xl font-semibold text-gray-900">Complete Your Subscription</h3>
              <p className="manrope text-sm text-gray-600 mt-1">Access all modules after payment</p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment || Object.keys(selectedPackages).length === 0}
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                isProcessingPayment || Object.keys(selectedPackages).length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ${totalAmount.toFixed(2)}
                </>
              )}
            </button>
          </div>
          
          {/* Success Message */}
          {showPaymentSuccess && (
            <div className="mt-4 flex items-center p-3 bg-green-100 text-green-800 rounded-lg">
              <Check className="w-5 h-5 mr-2" />
              <span className="manrope font-medium">Payment successful! Redirecting to dashboard...</span>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                selectedPackages[pkg.id] 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="manrope text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <select
                    value={selectedPackages[pkg.id] || ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        handlePackageSelection(pkg.id, e.target.value as 'monthly' | 'quarterly' | 'yearly');
                      }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Plan</option>
                    <option value="monthly">Monthly - ${pkg.monthlyPrice.toFixed(2)}</option>
                    <option value="quarterly">Quarterly - ${pkg.quarterlyPrice.toFixed(2)}</option>
                    <option value="yearly">Yearly - ${pkg.yearlyPrice.toFixed(2)}</option>
                  </select>
                </div>
              </div>

              <p className="manrope text-gray-700 mb-6">{pkg.description}</p>

              <div className="mb-6">
                <h4 className="manrope font-semibold text-gray-900 mb-3">Features:</h4>
                <ul className="manrope text-sm text-gray-700 space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="manrope font-semibold text-gray-900 mb-2">Pricing:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="manrope text-gray-600">Monthly</span>
                    <span className="manrope font-medium">${pkg.monthlyPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="manrope text-gray-600">Quarterly</span>
                    <span className="manrope font-medium">${pkg.quarterlyPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="manrope text-gray-600">Yearly</span>
                    <span className="manrope font-medium">${pkg.yearlyPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="manrope text-sm text-gray-500">
                  {selectedPackages[pkg.id] 
                    ? `Selected: ${selectedPackages[pkg.id]?.charAt(0).toUpperCase() + selectedPackages[pkg.id]?.slice(1)} - $${getBillingPrice(pkg, selectedPackages[pkg.id]!).toFixed(2)}` 
                    : 'Not selected'}
                </span>
                {selectedPackages[pkg.id] && (
                  <button
                    onClick={() => handlePackageSelection(pkg.id, selectedPackages[pkg.id]!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="manrope text-sm text-gray-500">
            © {new Date().getFullYear()} Datacap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPage;