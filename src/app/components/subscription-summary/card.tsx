import React from 'react';

interface SubscriptionSummaryCardProps {
  totalPackageSubscription: number;
  govtVerificationCost: number;
  officeLocationCost: number;
  headquartersCost: number;
  branchCost: number;
  totalVerificationCost: number;
  grandTotal: number;
}

const SubscriptionSummaryCard: React.FC<SubscriptionSummaryCardProps> = ({
  totalPackageSubscription,
  govtVerificationCost,
  officeLocationCost,
  headquartersCost,
  branchCost,
  totalVerificationCost,
  grandTotal
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Package (Service) Subscription</p>
          <p className="text-lg font-semibold text-gray-900">₦{totalPackageSubscription.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Govt Verification Cost</p>
          <p className="text-lg font-semibold text-gray-900">₦{govtVerificationCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Office Location Cost</p>
          <p className="text-lg font-semibold text-gray-900">₦{officeLocationCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Headquarters Cost</p>
          <p className="text-lg font-semibold text-gray-900">₦{headquartersCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Branch Cost</p>
          <p className="text-lg font-semibold text-gray-900">₦{branchCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Verification Cost</p>
          <p className="text-lg font-semibold text-gray-900">₦{totalVerificationCost.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800">Grand Total</p>
          <p className="text-xl font-bold text-[#5D2A8B]">₦{grandTotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummaryCard;