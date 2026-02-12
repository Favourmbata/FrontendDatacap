"use client";

import type React from "react";
import { CreditCard, MapPin } from "lucide-react";

interface LocationPaymentStepProps {
  locations: Array<{
    brandName?: string;
    city: string;
    state: string;
    country: string;
    cityRegion?: string;
    cityRegionFee?: number;
  }>;
  organizationProfile: {
    verificationStatus: 'verified' | 'unverified';
  };
  locationPaymentInitializing: boolean;
  locationPaymentError: string | null;
  onBack: () => void;
  onPayment: () => void;
  onPaymentDataChange?: (data: any) => void;
}

const LocationPaymentStep: React.FC<LocationPaymentStepProps> = ({
  locations,
  organizationProfile,
  locationPaymentInitializing,
  locationPaymentError,
  onBack,
  onPayment,
  onPaymentDataChange,
}) => {
  if (organizationProfile?.verificationStatus !== 'verified') {
    return null;
  }

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Location Verification Payment</h3>
      
      {locationPaymentError && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <p className="font-medium">Error: {locationPaymentError}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Locations Summary */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Locations to Verify</h4>
          <div className="space-y-3">
            {locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{location.brandName || `Location ${index + 1}`}</h5>
                  <p className="text-sm text-gray-600">
                    {location.city}, {location.state}, {location.country}
                  </p>
                  {location.cityRegion && (
                    <p className="text-sm text-gray-600">
                      Region: {location.cityRegion}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {location.cityRegionFee ? (
                    <p className="font-semibold text-gray-900">₦{location.cityRegionFee.toLocaleString('en-NG')}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Fee to be calculated</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
       
     
        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            disabled={locationPaymentInitializing}
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Locations
          </button>
          <button
            onClick={onPayment}
            disabled={locationPaymentInitializing}
            className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
              locationPaymentInitializing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {locationPaymentInitializing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Initializing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Pay for Location Verification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPaymentStep;