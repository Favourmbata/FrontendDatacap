
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  Check,
  Building,
  ShieldCheck,
  Upload,
  Plus,
  X,
  Clock,
} from "lucide-react"
import useSubscriptionPackages from '@/api/hooks/useSubscriptionPackages';
import PaymentService from '@/services/PaymentService';
import { useAuth } from '@/api/hooks/useAuth'; // Assuming we have an auth hook for user data
import { useAuthContext, User } from '@/AuthContext';

interface APIService {
  _id: string;
  serviceId: string;
  serviceName: string;
  duration: 'monthly' | 'quarterly' | 'yearly';
  price: number;
}

interface APISubscriptionPackage {
  _id: string;
  title: string;
  description: string;
  totalServiceCost: number;
  promoCode: string;
  discountPercentage: number;
  discountAmount: number;
  finalPriceAfterDiscount: number;
  features: string[];
  note: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  services: APIService[];
  maxUsers?: number;
}

interface Service {
  id: string
  name: string
  numberOfUsers: number
}

interface SubscriptionPackage {
  id: string;
  packageName: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  features: string[];
  services: Service[];
  maxUsers?: number;
  finalPriceAfterDiscount?: number;
  totalServiceCost?: number;
}

// Using the User interface from AuthContext
// export interface User {
//   id: string;
//   email: string;
//   fullName: string;
//   phoneNumber: string | null;
//   role: string;
//   isAdmin: boolean;
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

const SubscriptionPage: React.FC = () => {
  const { packages: apiPackages, loading, error } = useSubscriptionPackages();
  const authContext = useAuthContext();
  
  
  const user = authContext.user as User || null; // Get user data from auth context
  const [selectedPackages, setSelectedPackages] = useState<Record<string, "monthly" | "quarterly" | "yearly">>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [userLimitError, setUserLimitError] = useState<string | null>(null)
  const [packageUserCounts, setPackageUserCounts] = useState<Record<string, number>>({})

  // Map API packages to our local format
  const packages: SubscriptionPackage[] = apiPackages?.map(pkg => {
    // Use the pricing as provided by the API
    // finalPriceAfterDiscount is what the user should pay after discount
    // totalServiceCost is the original price before discount
    const monthlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    const quarterlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    const yearlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    
    return {
      id: pkg._id,
      packageName: pkg.title,
      description: pkg.description,
      monthlyPrice,
      quarterlyPrice,
      yearlyPrice,
      features: pkg.features || [],
      services: pkg.services?.map(service => ({
        id: service._id || service.serviceId,
        name: service.serviceName,
        numberOfUsers: 1 // Default to 1, can be adjusted by user
      })) || [],
      maxUsers: pkg.maxUsers,
      finalPriceAfterDiscount: pkg.finalPriceAfterDiscount,
      totalServiceCost: pkg.totalServiceCost
    };
  }) || [];

  useEffect(() => {
    let total = 0
    Object.entries(selectedPackages).forEach(([packageId, billingCycle]) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) {
        switch (billingCycle) {
          case "monthly":
            total += pkg.monthlyPrice
            break
          case "quarterly":
            total += pkg.quarterlyPrice
            break
          case "yearly":
            total += pkg.yearlyPrice
            break
        }
      }
    })
    setTotalAmount(total)
  }, [selectedPackages, packages])

  const handlePackageSelection = (packageId: string, billingCycle: "monthly" | "quarterly" | "yearly") => {
    setSelectedPackages((prev) => {
      if (prev[packageId] === billingCycle) {
        const newSelections = { ...prev }
        delete newSelections[packageId]
        return newSelections
      }
      return { ...prev, [packageId]: billingCycle }
    })
  }

  const handlePayment = async () => {
    if (Object.keys(selectedPackages).length === 0) {
      alert("Please select at least one package to proceed with payment");
      return;
    }

    // Get the first selected package for payment initialization
    const [firstPackageId, subscriptionDuration] = Object.entries(selectedPackages)[0];
    
    // Double-check that user is authenticated
    const currentUser = authContext.user;
    if (!authContext.token) {
      alert("User not authenticated. Please log in.");
      // Force a refresh of auth state
      window.location.reload();
      return;
    }
    
    // If currentUser is not available from context, try to extract from token
    let paymentUserData = currentUser;
    if (!currentUser || !currentUser.email || !currentUser.fullName) {
      // Try to get user data from localStorage if context doesn't have complete data
      if (typeof window !== 'undefined') {
        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            if (storedUser && storedUser.email && storedUser.fullName) {
              paymentUserData = storedUser;
            }
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
      }
    }
    
    // Final check if we have required user data
    if (!paymentUserData || !paymentUserData.email || !paymentUserData.fullName) {
      console.error('Required user fields missing after all attempts:', {
        currentUser: currentUser,
        paymentUserData: paymentUserData
      });
      alert("User profile is incomplete. Please ensure your profile has email and name.");
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Prepare payment initialization request
      const selectedPackage = packages.find(p => p.id === firstPackageId);
      
      // Get the number of users from the state for this package
      const numberOfUsers = packageUserCounts[firstPackageId] || selectedPackage?.maxUsers || 1;
      
      // Validate number of users against maxUsers
      if (selectedPackage?.maxUsers && numberOfUsers > selectedPackage.maxUsers) {
        setUserLimitError(`Number of users (${numberOfUsers}) exceeds the maximum allowed (${selectedPackage.maxUsers}) for this package.`);
        setIsProcessingPayment(false);
        return;
      }
      
      // Clear any previous user limit error
      setUserLimitError(null);
      
      // Determine the amount to charge based on discount availability
      const baseAmount = getBillingPrice(selectedPackage!, subscriptionDuration);
      let amountToCharge = baseAmount;
      
      // Check if the package has a discount
      if (selectedPackage?.finalPriceAfterDiscount !== undefined && 
          selectedPackage?.finalPriceAfterDiscount > 0 && 
          selectedPackage?.finalPriceAfterDiscount < baseAmount) {
        // Use discounted price if available and it's less than the base amount
        amountToCharge = selectedPackage.finalPriceAfterDiscount;
      } else if (selectedPackage?.totalServiceCost !== undefined && selectedPackage?.totalServiceCost > 0) {
        // Fallback to total service cost if no discount is applied
        amountToCharge = selectedPackage.totalServiceCost;
      }
      
      const paymentRequest = {
        userId: paymentUserData?.id as string, // Use the id from the User interface
        userType: 'organization' as const, // Could be dynamic based on user type
        packageId: firstPackageId,
        subscriptionDuration,
        amount: amountToCharge, // Use the appropriate price based on discount
        maxUsers: numberOfUsers, // Use the number of users entered by the user
        email: paymentUserData?.email || '',
        name: paymentUserData?.fullName || '',
        phone: paymentUserData?.phoneNumber || ''
      };
      

      
      // Initialize payment with Flutterwave
      const response = await PaymentService.initializePayment(paymentRequest);
      
      if (response.success) {
        // Redirect to payment link
        window.location.href = response.data.paymentLink;
      } else {
        alert(`Payment initialization failed: ${response.message}`);
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('An error occurred while initializing payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  }

  const getBillingPrice = (pkg: SubscriptionPackage, billingCycle: "monthly" | "quarterly" | "yearly") => {
    switch (billingCycle) {
      case "monthly":
        return pkg.monthlyPrice
      case "quarterly":
        return pkg.quarterlyPrice
      case "yearly":
        return pkg.yearlyPrice
      default:
        return pkg.monthlyPrice
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading subscription packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Packages</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              DC
            </div>
          </div>
          <span className="text-gray-500 text-sm">Subscription Required</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                Object.keys(selectedPackages).length > 0 ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium px-2">Packages</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                Object.keys(selectedPackages).length > 0 ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium px-2">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                selectedPackages[pkg.id]
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                <select
                  value={selectedPackages[pkg.id] || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      handlePackageSelection(pkg.id, e.target.value as "monthly" | "quarterly" | "yearly")
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Plan</option>
                  <option value="monthly">Monthly - ₦{Math.round(pkg.monthlyPrice).toLocaleString('en-NG')}</option>
                  <option value="quarterly">Quarterly - ₦{Math.round(pkg.quarterlyPrice).toLocaleString('en-NG')}</option>
                  <option value="yearly">Yearly - ₦{Math.round(pkg.yearlyPrice).toLocaleString('en-NG')}</option>
                </select>
              </div>

              <p className="text-gray-700 mb-6 text-sm">{pkg.description}</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Users</label>
                <input
                  name={`numberOfUsers-${pkg.id}`}
                  type="number"
                  min="1"
                  max={pkg.maxUsers || 10}
                  defaultValue={pkg.maxUsers || 1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                    packageUserCounts[pkg.id] && pkg.maxUsers && packageUserCounts[pkg.id] > pkg.maxUsers 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder={`Enter number of users (up to ${pkg.maxUsers || 10})`}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setPackageUserCounts(prev => ({
                      ...prev,
                      [pkg.id]: value
                    }));
                    
                    // Real-time validation
                    if (pkg.maxUsers && value > pkg.maxUsers) {
                      setUserLimitError(`Number of users (${value}) exceeds the maximum allowed (${pkg.maxUsers}) for this package.`);
                    } else {
                      // Clear error if it was for this package
                      if (userLimitError && selectedPackages[pkg.id]) {
                        setUserLimitError(null);
                      }
                    }
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Maximum allowed: {pkg.maxUsers || 1} users</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Services:</h4>
                <div className="space-y-2">
                  {pkg.services.map((service, idx) => (
                    <div key={service.id} className="p-2 bg-gray-50 rounded">
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-t-2 border-gray-500" />

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {selectedPackages[pkg.id]
                    ? `Selected: ${selectedPackages[pkg.id]} - ₦${Math.round(getBillingPrice(pkg, selectedPackages[pkg.id]!)).toLocaleString('en-NG')}`
                    : "Not selected"}
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



        {Object.keys(selectedPackages).length === 0 && (
          <div className="mb-8 bg-blue-50 rounded-xl border border-blue-200 p-8 text-center">
            <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Packages Selected</h3>
            <p className="text-blue-800">
              Please select at least one package above to proceed with payment.
            </p>
          </div>
        )}

        {Object.keys(selectedPackages).length > 0 && (
          <>
            <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Total Amount</h3>
                  <p className="text-sm opacity-90">For all selected packages</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <p className="text-4xl font-bold">₦{Math.round(totalAmount).toLocaleString('en-NG')}</p>
                  <p className="text-sm opacity-90">{Object.keys(selectedPackages).length} package(s)</p>
                </div>
              </div>
            </div>

            {userLimitError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {userLimitError}
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
                  <p className="text-sm text-gray-600 mt-1">Access all modules after payment</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isProcessingPayment ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₦{Math.round(totalAmount).toLocaleString('en-NG')}
                    </>
                  )}
                </button>
              </div>

              {showPaymentSuccess && (
                <div className="mt-4 flex items-center p-3 bg-green-100 text-green-800 rounded-lg">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment successful! Redirecting...</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default SubscriptionPage
