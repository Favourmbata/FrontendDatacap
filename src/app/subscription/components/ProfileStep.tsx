
"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Package, CreditCard, Check, Building, ShieldCheck, Upload, Plus, X, Clock, Globe, MapPin, Search, ChevronDown, Layers } from "lucide-react";
import OrganizationProfileService, { OrganizationProfile } from '@/services/OrganizationProfileService';

interface ProfileStepProps {
  organizationProfile: OrganizationProfile;
  setOrganizationProfile: React.Dispatch<React.SetStateAction<OrganizationProfile>>;
  currentStep: 'packages' | 'profile' | 'locations' | 'location-payment' | 'payment';
  setCurrentStep: React.Dispatch<React.SetStateAction<'packages' | 'profile' | 'locations' | 'location-payment' | 'payment'>>;
  orgProfileSubmitting: boolean;
  setOrgProfileSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  orgProfileSuccess: boolean;
  setOrgProfileSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  orgProfileError: string | null;
  setOrgProfileError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  organizationProfile,
  setOrganizationProfile,
  currentStep,
  setCurrentStep,
  orgProfileSubmitting,
  setOrgProfileSubmitting,
  orgProfileSuccess,
  setOrgProfileSuccess,
  orgProfileError,
  setOrgProfileError,
}) => {
 
  const safeOrganizationProfile = {
    ...organizationProfile,
    isPublicProfile: organizationProfile.isPublicProfile ?? false,
  };

  const handleOrgProfileSubmit = async () => {
    setOrgProfileSubmitting(true);
    setOrgProfileError(null);
    
    try {
      const orgProfileService = new OrganizationProfileService();
      
      
      const response = await orgProfileService.createOrUpdateProfile({
        ...organizationProfile,
        isPublicProfile: organizationProfile.isPublicProfile ?? false,
      });
      
      if (response.success) {
        setOrgProfileSuccess(true);
        
        setTimeout(() => {
          if (organizationProfile.isPublicProfile) {
           
            setCurrentStep('locations');
          } else {
           
            setCurrentStep('payment');
          }
        }, 1500);
      } else {
        setOrgProfileError(response.message || 'Failed to save organization profile');
      }
    } catch (error: any) {
      console.error('Error saving organization profile:', error);
      setOrgProfileError(error.message || 'An error occurred while saving organization profile');
    } finally {
      setOrgProfileSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Organization Profile Setup</h3>
      
      {orgProfileSuccess ? (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          <p className="font-medium">Organization profile saved successfully!</p>
        </div>
      ) : (
        <>
          {orgProfileError && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
              <p className="font-medium">Error: {orgProfileError}</p>
            </div>
          )}
          
          <div className="space-y-6">
         
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Business Registration Status</h4>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    checked={organizationProfile.businessType === 'registered'}
                    onChange={() => setOrganizationProfile({...organizationProfile, businessType: 'registered'})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">Registered</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    checked={organizationProfile.businessType === 'unregistered'}
                    onChange={() => setOrganizationProfile({...organizationProfile, businessType: 'unregistered'})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">Unregistered</span>
                </label>
              </div>
            </div>
            
           
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Make Your Organization Profile Available to the Public?</h4>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublicProfile"
                    checked={safeOrganizationProfile.isPublicProfile === true} 
                    onChange={() => setOrganizationProfile({...organizationProfile, isPublicProfile: true})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublicProfile"
                    checked={safeOrganizationProfile.isPublicProfile === false} 
                    onChange={() => setOrganizationProfile({...organizationProfile, isPublicProfile: false})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
              
           
            
            </div>
            
     
            {safeOrganizationProfile.isPublicProfile && ( 
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h4>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="verificationStatus"
                      checked={organizationProfile.verificationStatus === 'verified'}
                      onChange={() => setOrganizationProfile({...organizationProfile, verificationStatus: 'verified'})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Verified</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="verificationStatus"
                      checked={organizationProfile.verificationStatus === 'unverified'}
                      onChange={() => setOrganizationProfile({...organizationProfile, verificationStatus: 'unverified'})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Unverified</span>
                  </label>
                </div>
                
              
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep('packages')}
              className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Back to Packages
            </button>
            <button
              onClick={handleOrgProfileSubmit}
              disabled={orgProfileSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${orgProfileSubmitting ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {orgProfileSubmitting ? 'Saving...' : 
               safeOrganizationProfile.isPublicProfile ?  
                 (organizationProfile.verificationStatus === 'verified' ? 'Continue to Locations & Verification' : 'Continue to Locations') 
                 : 'Continue to Package Payment'
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileStep;