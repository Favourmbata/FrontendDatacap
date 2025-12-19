"use client";

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  pricePerMonth: number;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  maxUsers: number;
  services: number;
  pricePerMonth: number;
  pricePerQuarter: number;
  pricePerYear: number;
}

const AdminSubscriptionPage = () => {
  // Mock data for subscription packages
  const subscriptionPackages: SubscriptionPackage[] = [
    {
      id: '1',
      name: 'Basic Package',
      maxUsers: 50,
      services: 1,
      pricePerMonth: 20,
      pricePerQuarter: 55,
      pricePerYear: 200
    },
    {
      id: '2',
      name: 'Professional Package',
      maxUsers: 200,
      services: 2,
      pricePerMonth: 50,
      pricePerQuarter: 140,
      pricePerYear: 500
    },
    {
      id: '3',
      name: 'Enterprise Package',
      maxUsers: 1000,
      services: 3,
      pricePerMonth: 100,
      pricePerQuarter: 280,
      pricePerYear: 1000
    }
  ];

  // Mock data for services
  const services: Service[] = [
    { id: 1, name: 'All Services', pricePerMonth: 60 },
    { id: 2, name: 'Body Measurement Service', pricePerMonth: 20 },
    { id: 3, name: 'Object Measurement Service', pricePerMonth: 30 },
    { id: 4, name: 'Questionnaire Service', pricePerMonth: 15 }
  ];

  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [numberOfUsers, setNumberOfUsers] = useState<number>(10);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [showServiceDetails, setShowServiceDetails] = useState<number | null>(null);
  
  // Debugging: Log state changes
  React.useEffect(() => {
    console.log('State changed:', { selectedPackage, selectedServices, billingCycle, totalAmount });
  }, [selectedPackage, selectedServices, billingCycle, totalAmount]);

  // Calculate total amount based on selections
  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const pkg = subscriptionPackages.find(p => p.id === selectedPackage);
    if (!pkg) return 0;
    
    // If no services selected, return 0
    if (selectedServices.length === 0) return 0;
    
    // If "All Services" is selected, use package price
    if (selectedServices.includes(1)) {
      switch (billingCycle) {
        case 'monthly': return pkg.pricePerMonth;
        case 'quarterly': return pkg.pricePerQuarter;
        case 'yearly': return pkg.pricePerYear;
        default: return pkg.pricePerMonth;
      }
    }
    
    // Calculate based on individual services
    let serviceTotal = 0;
    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        serviceTotal += service.pricePerMonth;
      }
    });
    
    // Apply discounts based on billing cycle
    switch (billingCycle) {
      case 'monthly': 
        return serviceTotal;
      case 'quarterly':
        return serviceTotal * 3 * 0.95; // 5% discount
      case 'yearly':
        return serviceTotal * 12 * 0.9; // 10% discount
      default:
        return serviceTotal;
    }
  };

  // Update total whenever selections change
  React.useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [selectedPackage, numberOfUsers, selectedServices, billingCycle]);

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev => {
      // If selecting "All Services", deselect all other services
      if (serviceId === 1 && !prev.includes(1)) {
        return [1];
      }
      
      // If selecting an individual service while "All Services" is selected, deselect "All Services"
      if (serviceId !== 1 && prev.includes(1)) {
        return prev.filter(id => id !== 1).concat(serviceId);
      }
      
      // Toggle individual services
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      selectedPackage,
      numberOfUsers,
      selectedServices,
      billingCycle,
      totalAmount
    });
    alert(`Subscription request submitted! Total: $${totalAmount.toFixed(2)}`);
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
        <p className="text-gray-600 mt-2">Select a package and customize your subscription</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Package Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Package</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a subscription package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
            >
              <option value="">Select a package</option>
              {subscriptionPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - Up to {pkg.maxUsers} users (${pkg.pricePerMonth}/month)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Number of Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Number of Users</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many users will be using the service?
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={numberOfUsers}
              onChange={(e) => setNumberOfUsers(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
            />
            <p className="text-sm text-gray-500 mt-1">
              Select a package that supports at least {numberOfUsers} users
            </p>
          </div>
        </div>

        {/* Service Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Services</h2>
          <p className="text-gray-600 mb-4">
            Click on any service to view pricing details.
          </p>
          
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id}>
                <div 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    showServiceDetails === service.id
                      ? 'border-[#5D2A8B] bg-[#f8f5fa]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setShowServiceDetails(showServiceDetails === service.id ? null : service.id)}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">{service.name}</span>
                  </div>
                  <span className="text-gray-700">${service.pricePerMonth}/month</span>
                </div>
                
                {/* Service Details Panel */}
                {showServiceDetails === service.id && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">{service.name} Pricing</h3>
                      <button 
                        onClick={() => handleServiceToggle(service.id)}
                        className={`px-3 py-1 rounded text-sm ${selectedServices.includes(service.id) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                        disabled={service.id === 1 && selectedServices.some(id => id !== 1) || service.id !== 1 && selectedServices.includes(1)}
                      >
                        {selectedServices.includes(service.id) ? 'Remove from Subscription' : 'Add to Subscription'}
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-medium">${service.pricePerMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarterly:</span>
                        <span className="font-medium">${(service.pricePerMonth * 3 * 0.95).toFixed(2)} (5% discount)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yearly:</span>
                        <span className="font-medium">${(service.pricePerMonth * 12 * 0.9).toFixed(2)} (10% discount)</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Billing Frequency</label>
                      <div className="text-sm text-gray-600">
                        <p>Select your preferred billing cycle from the options above.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Billing Cycle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Cycle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                billingCycle === 'monthly' 
                  ? 'border-[#5D2A8B] ring-2 ring-[#5D2A8B] ring-opacity-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              <h3 className="font-semibold text-gray-800">Monthly</h3>
              <p className="text-sm text-gray-600 mt-1">Pay month to month</p>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                billingCycle === 'quarterly' 
                  ? 'border-[#5D2A8B] ring-2 ring-[#5D2A8B] ring-opacity-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setBillingCycle('quarterly')}
            >
              <h3 className="font-semibold text-gray-800">Quarterly</h3>
              <p className="text-sm text-gray-600 mt-1">Save 5% with 3-month billing</p>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                billingCycle === 'yearly' 
                  ? 'border-[#5D2A8B] ring-2 ring-[#5D2A8B] ring-opacity-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              <h3 className="font-semibold text-gray-800">Yearly</h3>
              <p className="text-sm text-gray-600 mt-1">Save 10% with annual billing</p>
            </div>
          </div>
        </div>

        {/* Summary and Total */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          
          {selectedPackage && (
            <div className="mb-4">
              <p className="text-gray-700">
                Package: <span className="font-medium">
                  {subscriptionPackages.find(p => p.id === selectedPackage)?.name}
                </span>
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <p className="text-gray-700">
              Users: <span className="font-medium">{numberOfUsers}</span>
            </p>
          </div>
          
          {selectedServices.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-700">Services:</p>
              <ul className="list-disc list-inside mt-1">
                {selectedServices.map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  return service ? <li key={serviceId} className="text-gray-600">{service.name}</li> : null;
                })}
              </ul>
              {selectedServices.includes(1) && (
                <p className="text-sm text-gray-500 mt-2">* Includes all available services</p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <p className="text-gray-700">
              Billing Cycle: <span className="font-medium capitalize">{billingCycle}</span>
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
            </div>
            <div className="flex justify-end items-center">
              <span className="text-3xl font-bold text-[#5D2A8B]">${totalAmount.toFixed(2)}</span>
              {billingCycle !== 'monthly' && (
                <span className="text-sm text-gray-500 ml-2">
                  {billingCycle === 'quarterly' ? '(5% discount)' : '(10% discount)'}
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500 text-right">
              {billingCycle === 'monthly' && 'Billed monthly'}
              {billingCycle === 'quarterly' && 'Billed quarterly'}
              {billingCycle === 'yearly' && 'Billed annually'}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedPackage || selectedServices.length === 0}
            className={`px-6 py-3 rounded-lg font-medium ${
              !selectedPackage || selectedServices.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#5D2A8B] text-white hover:bg-[#4a216e]'
            }`}
          >
            Submit Subscription Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSubscriptionPage;