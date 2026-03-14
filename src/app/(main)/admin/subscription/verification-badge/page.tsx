"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  CreditCard,
} from "lucide-react";
import OrganizationProfileService from "@/services/OrganizationProfileService";
import { useAuthContext } from "@/AuthContext";
import { useRouter } from "next/navigation";

const VerificationBadgeSubscriptionPage: React.FC = () => {
  const { token, user } = useAuthContext();
  const router = useRouter();
  const [isAuthRestored, setIsAuthRestored] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [profileInfo, setProfileInfo] = useState<{ businessType: 'registered' | 'unregistered'; isPublicProfile: boolean; verificationStatus: 'verified' | 'unverified' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState<number | null>(null);
    
  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    locationIndex: null as number | null,
    locationName: ''
  });
  
  // Track when auth is restored from localStorage
  useEffect(() => {
    // Wait for the auth context to be properly initialized
    const timer = setTimeout(() => {
      // Check if we have a token or user data (meaning auth has been restored)
      if ((token !== null && token !== undefined) || (user !== null && user !== undefined)) {
        setIsAuthRestored(true);
      }
    }, 100); // Small delay to ensure context is fully loaded

    return () => clearTimeout(timer);
  }, [token, user]);
  
  const organizationProfileService = new OrganizationProfileService();

  // Removed old sessionStorage verification flow - now using dedicated /payment/verify-location page

  const handleDeleteLocation = (index: number) => {
    const locationToDelete = locations[index];
    setDeleteModal({
      isOpen: true,
      locationIndex: index,
      locationName: locationToDelete.brandName || `Location ${index + 1}`
    });
  };

  const confirmDeleteLocation = async () => {
    if (deleteModal.locationIndex !== null) {
      setIsProcessing(true);
      try {
        const response = await organizationProfileService.deleteLocation(deleteModal.locationIndex);
        if (response.success) {
          // Refetch the profile to get updated locations
          const profileResponse = await organizationProfileService.getProfile();
          if (profileResponse.success && profileResponse.data && profileResponse.data.profile && profileResponse.data.profile.locations) {
            // Ensure each location has a properly initialized gallery property
            const locationsWithGallery = profileResponse.data.profile.locations.map(location => ({
              ...location,
              gallery: location.gallery || { images: [], videos: [] }
            }));
            setLocations(locationsWithGallery);
          }
          setSuccessMessage('Location deleted successfully!');
          setErrorMessage('');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setErrorMessage(response.message || 'Failed to delete location');
          setSuccessMessage('');
        }
      } catch (error: any) {
        console.error('Error deleting location:', error);
        setErrorMessage(error.message || 'An unexpected error occurred');
        setSuccessMessage('');
      } finally {
        setIsProcessing(false);
        // Close the modal
        setDeleteModal({
          isOpen: false,
          locationIndex: null,
          locationName: ''
        });
      }
    }
  };

  const handleMakePayment = async (locationIndex: number) => {
    const location = locations[locationIndex];
    const locData = location._doc ? location._doc : location;
    
    // Check authentication first
    if (!token) {
      setErrorMessage('Please login to make a payment');
      return;
    }

    // Wait for auth to be restored before checking user data
    if (!isAuthRestored) {
      setErrorMessage('Loading user information... Please wait a moment and try again.');
      return;
    }

    // Now user should be available after auth is restored
    if (!user) {
      setErrorMessage('User information not found. Please login again.');
      console.error('User object is null even after auth restoration');
      return;
    }

    // Validate user has required fields - email should ALWAYS exist for logged-in users
    if (!user.email) {
      console.error('User email missing. Full user object:', user);
      setErrorMessage('User email not found. Please login again.');
      return;
    }

    setPaymentProcessing(locationIndex);
    setErrorMessage('');

    try {
      // Step 1: Initialize payment for this specific location with actual user data
      const initializeUrl = '/api/payment/verified-badge/initialize';
      
      const { HttpService } = await import('@/services/HttpService');
      
      console.log('🚀 ===== INITIALIZING VERIFIED BADGE PAYMENT =====');
      console.log('Initializing payment with user data:', {
        email: user.email,
        name: user.fullName || locData.brandName,
        phone: user.phoneNumber || '+2348012345678',
        redirect_url: `${window.location.origin}/payment/verify-verified-badge`,
      });
      
      const initializeResponse = await HttpService.post<any>(initializeUrl, {
        email: user.email,
        name: user.fullName || locData.brandName || 'Business Owner',
        phone: user.phoneNumber || '+2348012345678',
        redirect_url: `${window.location.origin}/payment/verify-verified-badge`, // ✅ Redirect to verified badge verification page
      });
      
      console.log('✅ Payment initialization response:', initializeResponse);
      
      if (!initializeResponse.success || !initializeResponse.data) {
        throw new Error(initializeResponse.message || 'Unable to initialize payment');
      }

      const { paymentLink, transactionRef, amount, fee } = initializeResponse.data;
      const locationDescription = `${locData.brandName} - ${locData.city}, ${locData.state}`;

      console.log('Payment initialized successfully:', {
        transactionRef,
        amount,
        location: locationDescription,
      });

      // Step 2: Redirect to Flutterwave payment page
      if (paymentLink) {
        // Redirect directly to Flutterwave - the returnUrl will handle redirect back
        window.location.href = paymentLink;
      } else {
        throw new Error('No payment URL received from server');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Failed to process payment');
      setPaymentProcessing(null);
    }
  };

  
  useEffect(() => {
    const loadData = async () => {
      try {
       
        const profileResponse = await organizationProfileService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data.profile;
          setProfileInfo({
            businessType: profile.businessType,
            isPublicProfile: profile.isPublicProfile || false,
            verificationStatus: profile.verificationStatus
          });
        
          if ('locations' in profileResponse.data.profile && Array.isArray(profileResponse.data.profile.locations)) {
            // Ensure each location has a properly initialized gallery property
            const locationsWithGallery = profileResponse.data.profile.locations.map(location => ({
              ...location,
              gallery: location.gallery || { images: [], videos: [] }
            }));
            setLocations(locationsWithGallery);
          }
        }

        // Load locations from API
        const locationsResponse = await organizationProfileService.getAllLocations();
        if (locationsResponse.success && locationsResponse.data) {
          // Ensure each location has a properly initialized gallery property
          const locationsWithGallery = locationsResponse.data.locations.map(location => ({
            ...location,
            gallery: location.gallery || { images: [], videos: [] }
          }));
          setLocations(locationsWithGallery);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Management</h2>
          <p className="text-gray-600">View and manage your organization locations.</p>
        </div>
        
        {/* Display success and error messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
        
        <div className="mb-8">
        
          {/* Actions outside the container */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <a href="/admin/subscription/profile" className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors">
                Manage Profile
              </a>
              
            </div>
            <a 
              href="/admin/subscription/verification-badge/add-location"
              className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
            </a>
          </div>
                  
          {/* Locations Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {/* Organization Info Header */}
            {profileInfo && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div><span className="font-medium">Business Type:</span> {profileInfo.businessType}</div>
                  <div><span className="font-medium">Public Profile:</span> {profileInfo.isPublicProfile ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Verification Status:</span> {profileInfo.verificationStatus}</div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LGA</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City Region</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landmark</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public Profile</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid For</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Verification</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery Images</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gallery Videos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {locations.length > 0 ? (
    locations.map((location, index) => {
      // Extract the actual location data from _doc if it exists
      const locData = location._doc ? location._doc : location;
      
      return (
        <tr key={index}>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${locData.locationType === 'headquarters' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {locData.locationType ? locData.locationType.charAt(0).toUpperCase() + locData.locationType.slice(1) : 'Unknown'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{locData.brandName || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{locData.country || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{locData.state || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{locData.lga || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{locData.city || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{locData.cityRegion || 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.houseNumber || 'N/A'} {locData.street || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.landmark || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.buildingType || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {profileInfo?.businessType || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {profileInfo?.isPublicProfile ? 'Yes' : 'No'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.isPaidFor ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Yes
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                No
              </span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${locData.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : locData.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {locData.verificationStatus?.charAt(0).toUpperCase() + locData.verificationStatus?.slice(1) || 'N/A'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.gallery?.images?.length || 0} images
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {locData.gallery?.videos?.length || 0} videos
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            {!locData.isPaidFor && (
              <button
                onClick={() => handleMakePayment(index)}
                disabled={paymentProcessing === index}
                className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  paymentProcessing === index
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#572e7f] hover:bg-[#572e7f]'
                } text-white`}
              >
                {paymentProcessing === index ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 mr-1" />
                    Make Payment
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => handleDeleteLocation(index)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={17} className="px-6 py-4 text-center text-sm text-gray-500">
        No locations added yet. Click "Add New Location" to get started.
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="fixed inset-0" onClick={() => setDeleteModal({isOpen: false, locationIndex: null, locationName: ''})}></div>
          <div className="relative bg-white rounded-xl shadow-2xl z-50 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete <span className="font-semibold">{deleteModal.locationName}</span>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModal({isOpen: false, locationIndex: null, locationName: ''})}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLocation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerificationBadgeSubscriptionPage;
