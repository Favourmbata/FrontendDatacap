"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Building,
  ShieldCheck,
  Upload,
  CheckCircle,
  User,
  FileText,
  Send,
  AlertCircle,
  Plus,
  MapPin,
  Users,
} from "lucide-react";
import OrganizationProfileService, { OrganizationProfile, LocationData } from "@/services/OrganizationProfileService";
import { Country, State, City } from 'country-state-city';
import SearchableLocationForm from "@/app/components/SearchableLocationForm";


interface OrganizationDetails {
  type: "registered" | "unregistered";
  businessRegistrationNumber?: string;
  ownerIdentificationType?: "international-passport" | "nin" | "none";
  ownerDocumentNumber?: string;
  visibility: "public" | "private";
  verifiedBadge: boolean;
  professionalTrade?: {
    associationName?: string;
    membershipId?: string;
    certificateFile?: File;
  };
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const VerificationBadgeSubscriptionPage: React.FC = () => {
  const [workflowStep, setWorkflowStep] = useState<'locations' | 'location-form'>('locations');
  const [hasProfile, setHasProfile] = useState(false);
  
  const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails>({
    type: "unregistered", // Default to unregistered
    visibility: "private", // Default to private (isPublicProfile: false)
    verifiedBadge: false,  // Default to unverified (verificationStatus: unverified)
    professionalTrade: {},
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<{ businessType: 'registered' | 'unregistered'; isPublicProfile: boolean; verificationStatus: 'verified' | 'unverified' } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    locationIndex: null as number | null,
    locationName: ''
  });
  
  // Country-State-City data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [lgas, setLgas] = useState<any[]>([]);
  const [cityRegions, setCityRegions] = useState<any[]>([]);
  const [showOtherCityInput, setShowOtherCityInput] = useState(false);
  const [showOtherLGAInput, setShowOtherLGAInput] = useState(false);
  const [showOtherCityRegionInput, setShowOtherCityRegionInput] = useState(false);
  const [otherCityValue, setOtherCityValue] = useState('');
  const [otherCityRegionValue, setOtherCityRegionValue] = useState('');
  
  // State for cascading dropdown loading indicators
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCityRegions, setLoadingCityRegions] = useState(false);
  
  // State for filtered options
  const [statesForCountry, setStatesForCountry] = useState<any[]>([]);
  const [lgasForState, setLgasForState] = useState<any[]>([]);
  const [citiesForLga, setCitiesForLga] = useState<any[]>([]);
  const [cityRegionsForCity, setCityRegionsForCity] = useState<any[]>([]);
  
  // Initialize country data
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const organizationProfileService = new OrganizationProfileService();

  // Load organization profile and locations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile
        const profileResponse = await organizationProfileService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data.profile;
          setOrganizationDetails(prev => ({
            ...prev,
            type: profile.businessType,
            visibility: profile.isPublicProfile ? "public" : "private",
            verifiedBadge: profile.verificationStatus === "verified"
          }));
          setProfileInfo({
            businessType: profile.businessType,
            isPublicProfile: profile.isPublicProfile || false,
            verificationStatus: profile.verificationStatus
          });
          setHasProfile(true);
        
          setWorkflowStep('locations');
         
          if ('locations' in profileResponse.data.profile && Array.isArray(profileResponse.data.profile.locations)) {
            // Ensure each location has a properly initialized gallery property
            const locationsWithGallery = profileResponse.data.profile.locations.map(location => ({
              ...location,
              gallery: location.gallery || { images: [], videos: [] }
            }));
            setLocations(locationsWithGallery);
          }
        } else {
          
          setHasProfile(false);
          setWorkflowStep('locations');
        }

     
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
       
        setHasProfile(false);
        setWorkflowStep('locations');
      }
    };
    
    loadData();
  }, []);

  const handleOrganizationDetailsChange = (field: keyof OrganizationDetails, value: any) => {
    setOrganizationDetails((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "type" && value === "unregistered") {
        updated.verifiedBadge = false;
        updated.businessRegistrationNumber = "";
        updated.ownerIdentificationType = undefined;
        updated.ownerDocumentNumber = "";
      }

      if (field === "visibility" && value === "private") {
        updated.verifiedBadge = false;
      }

      if (field === "ownerIdentificationType") {
        updated.ownerDocumentNumber = "";
      }

      return updated;
    });
  };

  const handleProfileSubmit = async () => {
   
    if (!organizationDetails.type) {
      setErrorMessage('Business type is a required field');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      
      const profileData: OrganizationProfile = {
        businessType: organizationDetails.type as 'registered' | 'unregistered',
        isPublicProfile: organizationDetails.visibility === "public",
        verificationStatus: organizationDetails.verifiedBadge ? "verified" : "unverified",
      };

      
      const response = await organizationProfileService.createOrUpdateProfile(profileData);
      
      if (response.success) {
        setSuccessMessage('Organization profile updated successfully!');
        setHasProfile(true); // Update the hasProfile state
        setWorkflowStep('locations'); // Return to locations view after successful profile creation
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.message || 'Failed to update organization profile');
      }
    } catch (error: any) {
      console.error('Error updating organization profile:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadFilesAndGetUrls = async (files: (string | File)[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      if (typeof file === 'string') {
        // Already a URL, add directly
        urls.push(file);
      } else {
        // It's a File object, need to upload to Cloudinary
        try {
          // Convert File to data URL first
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          // Upload to Cloudinary and get the secure URL
          // We'll need to create a temporary solution since we can't import CloudinaryUploadService directly
          // In a real implementation, we would use the actual Cloudinary service
          // For now, we'll use a direct fetch to Cloudinary API
          // Determine if it's an image or video to use the appropriate Cloudinary endpoint
          const isImage = file.type.startsWith('image/');
          const uploadEndpoint = isImage 
            ? 'https://api.cloudinary.com/v1_1/disz21zwr/image/upload'
            : 'https://api.cloudinary.com/v1_1/disz21zwr/video/upload';
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'vestradat_preset'); // Using the preset from the service
          
          const cloudinaryResponse = await fetch(uploadEndpoint, {
            method: 'POST',
            body: formData,
          });
          
          const result = await cloudinaryResponse.json();
          
          if (result.secure_url) {
            urls.push(result.secure_url);
          } else {
            console.error('Cloudinary upload failed:', result);
            // Fallback to data URL if upload fails
            urls.push(dataUrl);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          // If upload fails, we'll skip this file
          continue;
        }
      }
    }
    
    return urls;
  };

  const handleLocationSubmit = async () => {
    if (!currentLocation) {
      setErrorMessage('Please fill in location details');
      return;
    }
  
    setIsProcessing(true);
    setFieldErrors({}); // Clear previous field errors before submission
  
    try {
      // Prepare the location data with uploaded URLs
      let processedLocation = { ...currentLocation };
                
      // Process images
      if (currentLocation.gallery && currentLocation.gallery.images && currentLocation.gallery.images.length > 0) {
        const imageUrls = await uploadFilesAndGetUrls(currentLocation.gallery.images);
        processedLocation = {
          ...processedLocation,
          gallery: {
            ...(processedLocation.gallery || {}),
            images: imageUrls
          }
        };
      }
                
      // Process videos
      if (currentLocation.gallery && currentLocation.gallery.videos && currentLocation.gallery.videos.length > 0) {
        const videoUrls = await uploadFilesAndGetUrls(currentLocation.gallery.videos);
        processedLocation = {
          ...processedLocation,
          gallery: {
            ...(processedLocation.gallery || {}),
            videos: videoUrls
          }
        };
      }
        
      let response;
      if (editingIndex !== null) {
        // Update existing location
        response = await organizationProfileService.updateLocation(editingIndex, processedLocation);
      } else {
        // Add new location
        response = await organizationProfileService.addLocation(processedLocation);
      }
        
      if (response.success) {
        // Update the locations from the response
        if (response.data && response.data.profile && response.data.profile.locations) {
          // Ensure each location has a properly initialized gallery property
          const locationsWithGallery = response.data.profile.locations.map(location => ({
            ...location,
            gallery: location.gallery || { images: [], videos: [] }
          }));
          setLocations(locationsWithGallery);
        } else {
          // Fallback to refetching the profile
          const profileResponse = await organizationProfileService.getProfile();
          if (profileResponse.success && profileResponse.data && profileResponse.data.profile && profileResponse.data.profile.locations) {
            // Ensure each location has a properly initialized gallery property
            const locationsWithGallery = profileResponse.data.profile.locations.map(location => ({
              ...location,
              gallery: location.gallery || { images: [], videos: [] }
            }));
            setLocations(locationsWithGallery);
          }
        }
          
        if (editingIndex !== null) {
          setSuccessMessage('Location updated successfully!');
          // After successful update, return to locations view
          setCurrentLocation(null);
          setEditingIndex(null);
          setWorkflowStep('locations');
        } else {
          setSuccessMessage('Location added successfully!');
            
          // Return to locations view
          setCurrentLocation(null);
          setEditingIndex(null);
          setWorkflowStep('locations');
        }
          
        setErrorMessage('');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // When success is false, prioritize displaying the detailed error message
        if (response.error) {
          // Parse validation errors from the response error field
          if (typeof response.error === 'string' && response.error.includes('validation failed')) {
            const fieldErrors: Record<string, string> = {};
              
            // Extract field-specific errors from the validation error message
            if (response.error.includes('street: Path `street` is required')) {
              fieldErrors.street = 'Street is required';
            }
            if (response.error.includes('houseNumber: Path `houseNumber` is required')) {
              fieldErrors.houseNumber = 'House number is required';
            }
            if (response.error.includes('brandName: Path `brandName` is required')) {
              fieldErrors.brandName = 'Brand name is required';
            }
            if (response.error.includes('country: Path `country` is required')) {
              fieldErrors.country = 'Country is required';
            }
            if (response.error.includes('state: Path `state` is required')) {
              fieldErrors.state = 'State is required';
            }
            if (response.error.includes('city: Path `city` is required')) {
              fieldErrors.city = 'City is required';
            }
              
            setFieldErrors(fieldErrors);
              
            // Always display the detailed error message when validation fails
            setErrorMessage(response.error);
          } else {
            // For non-validation errors, clear field errors and show the error message
            setFieldErrors({});
            setErrorMessage(response.error);
          }
        } else {
          // If no error field, fall back to message
          setFieldErrors({});
          setErrorMessage(response.message || 'Failed to save location');
        }
          
        setSuccessMessage('');
      }
    } catch (error: any) {
      console.error('Error saving location:', error);
        
      // Check if there's response data with error information
      if (error.response) {
        const errorData = error.response.data;
          
        // Handle validation errors
        if (errorData?.error) {
          // Check if it's a validation error
          if (typeof errorData.error === 'string' && errorData.error.includes('validation failed')) {
            const fieldErrors: Record<string, string> = {};
              
            // Extract field-specific errors from the validation error message
            if (errorData.error.includes('street: Path `street` is required')) {
              fieldErrors.street = 'Street is required';
            }
            if (errorData.error.includes('houseNumber: Path `houseNumber` is required')) {
              fieldErrors.houseNumber = 'House number is required';
            }
            if (errorData.error.includes('brandName: Path `brandName` is required')) {
              fieldErrors.brandName = 'Brand name is required';
            }
            if (errorData.error.includes('country: Path `country` is required')) {
              fieldErrors.country = 'Country is required';
            }
            if (errorData.error.includes('state: Path `state` is required')) {
              fieldErrors.state = 'State is required';
            }
            if (errorData.error.includes('city: Path `city` is required')) {
              fieldErrors.city = 'City is required';
            }
              
            setFieldErrors(fieldErrors);
              
            // Set a general error message prioritizing the detailed error message
            if (Object.keys(fieldErrors).length === 0) {
              setErrorMessage(errorData.error || errorData.message || 'Failed to save location');
            } else {
              // Show the detailed error message which contains more specific information
              setErrorMessage(errorData.error || 'Please fix the highlighted fields');
            }
          } else {
            // For non-validation errors, clear field errors and show general error
            setFieldErrors({});
            setErrorMessage(errorData.message || errorData.error || 'An unexpected error occurred');
          }
        } else if (errorData?.message) {
          // Check if it's a validation error in the message
          const message = errorData.message;
          if (typeof message === 'string' && message.includes('validation failed')) {
            const fieldErrors: Record<string, string> = {};
              
            // Extract field-specific errors from the validation error message
            if (message.includes('street: Path `street` is required')) {
              fieldErrors.street = 'Street is required';
            }
            if (message.includes('houseNumber: Path `houseNumber` is required')) {
              fieldErrors.houseNumber = 'House number is required';
            }
            if (message.includes('brandName: Path `brandName` is required')) {
              fieldErrors.brandName = 'Brand name is required';
            }
            if (message.includes('country: Path `country` is required')) {
              fieldErrors.country = 'Country is required';
            }
            if (message.includes('state: Path `state` is required')) {
              fieldErrors.state = 'State is required';
            }
            if (message.includes('city: Path `city` is required')) {
              fieldErrors.city = 'City is required';
            }
              
            setFieldErrors(fieldErrors);
              
            // Set a general error message prioritizing the detailed error message
            if (Object.keys(fieldErrors).length === 0) {
              setErrorMessage(errorData.error || message || 'Failed to save location');
            } else {
              // Show the detailed error message which contains more specific information
              setErrorMessage(errorData.error || message || 'Please fix the highlighted fields');
            }
          } else {
            // For non-validation errors, clear field errors and show general error
            setFieldErrors({});
            setErrorMessage(message || 'An unexpected error occurred');
          }
            
          // Check if this is a verification requirement message
          if (errorData.requiresVerification) {
            // Optionally redirect to subscription page or show upgrade option
          }
        } else {
          // If there's response but no recognizable error format, use status text or generic message
          setFieldErrors({});
          setErrorMessage(`Server Error (${error.response.status}): ${error.response.statusText || 'An error occurred'}`);
        }
      } else {
        // For network errors or other non-response errors
        setFieldErrors({});
        setErrorMessage(error.message || 'Network error or An unexpected error occurred');
      }
      setSuccessMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddLocation = () => {
    setWorkflowStep('location-form');
    // Initialize a new location
    const newLocation = {
      locationType: 'headquarters',
      brandName: '',
      country: '',
      state: '',
      lga: '',
      city: '',
      cityRegion: '',
      houseNumber: '',
      street: '',
      landmark: '',
      buildingColor: '',
      buildingType: '',
      cityRegionFee: undefined,
      gallery: { images: [], videos: [] },
    };
    setCurrentLocation(newLocation);
    setEditingIndex(null);
  };
  
  const handleLocationChange = (field: keyof LocationData, value: any) => {
    if (currentLocation) {
      setCurrentLocation({
        ...currentLocation,
        [field]: value
      });
    }
  };
  

  

  

  

  
  const handleStateChange = async (countryName: string) => {
    setLoadingStates(true);
    try {
      const selectedCountry = countries.find(c => c.name === countryName);
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStatesForCountry(countryStates);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoadingStates(false);
    }
  };
  
  const handleLgaChange = async (stateName: string) => {
    setLoadingLgas(true);
    try {
      // In a real app, you'd fetch LGAs from an API
      // For now, we'll use a more general approach or allow manual entry
      // The component already supports 'Other' functionality for manual entry
      setLgasForState([]); // Reset to empty, let the user use 'Other' functionality
    } catch (error) {
      console.error('Error loading LGAs:', error);
    } finally {
      setLoadingLgas(false);
    }
  };
  
  const handleCityChange = async (lga: string) => {
    setLoadingCities(true);
    try {
      // In a real app, you'd fetch cities from an API based on LGA
      // For now, we'll use the 'Other' functionality in the component
      setCitiesForLga([]); // Reset to empty, let the user use 'Other' functionality
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };
  
  const handleCityRegionChange = async (city: string) => {
    setLoadingCityRegions(true);
    try {
      // In a real app, you'd fetch city regions from an API based on city
      // For now, we'll use the 'Other' functionality in the component
      setCityRegionsForCity([]); // Reset to empty, let the user use 'Other' functionality
    } catch (error) {
      console.error('Error loading city regions:', error);
    } finally {
      setLoadingCityRegions(false);
    }
  };

  const handleEditLocation = (index: number) => {
    setWorkflowStep('location-form');
    // For editing, load the specific location
    const locationToEdit = locations[index];
    // Create a location with the existing data, ensuring all fields are present
    const completeLocation = {
      locationType: locationToEdit.locationType || 'headquarters',
      brandName: locationToEdit.brandName || '',
      country: locationToEdit.country || '',
      state: locationToEdit.state || '',
      lga: locationToEdit.lga || '',
      city: locationToEdit.city || '',
      cityRegion: locationToEdit.cityRegion || '',
      houseNumber: locationToEdit.houseNumber || '',
      street: locationToEdit.street || '',
      landmark: locationToEdit.landmark || '',
      buildingColor: locationToEdit.buildingColor || '',
      buildingType: locationToEdit.buildingType || '',
      cityRegionFee: locationToEdit.cityRegionFee,
      gallery: locationToEdit.gallery || { images: [], videos: [] },
    };
    setCurrentLocation(completeLocation);
    setEditingIndex(index);
  };

  const handleDeleteLocation = (index: number) => {
    // Show delete confirmation modal
    const locationToDelete = locations[index];
    setDeleteModal({
      isOpen: true,
      locationIndex: index,
      locationName: locationToDelete.brandName || `Location ${index + 1}`
    });
  };
  
  // Confirm delete location
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

  // Load organization profile and locations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profile
        const profileResponse = await organizationProfileService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data.profile;
          setOrganizationDetails(prev => ({
            ...prev,
            type: profile.businessType,
            visibility: profile.isPublicProfile ? "public" : "private",
            verifiedBadge: profile.verificationStatus === "verified"
          }));
        }

        // Load locations from profile response
        if (profileResponse.success && profileResponse.data && profileResponse.data.profile) {
          const profile = profileResponse.data.profile;
          if (profile.locations && Array.isArray(profile.locations)) {
            // Ensure each location has a properly initialized gallery property
            const locationsWithGallery = profile.locations.map(location => ({
              ...location,
              gallery: location.gallery || { images: [], videos: [] }
            }));
            setLocations(locationsWithGallery);
          } else {
            setLocations([]);
          }
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
          <p className="text-gray-600">
            {workflowStep === 'locations' && 'View and manage your organization locations.'}
            {workflowStep === 'location-form' && 'Add or edit organization location details.'}
          </p>
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
        
        {/* Render location form or locations table based on workflowStep */}
        <div className="mb-8">
          {/* Actions outside the container */}
          <div className="flex justify-between mb-4">
            <a href="/admin/subscription/profile" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Manage Profile
            </a>
          </div>
                  
          {/* Single Location Form */}
          {workflowStep === 'location-form' && (
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                <SearchableLocationForm
                  currentLocation={currentLocation}
                  editingIndex={editingIndex}
                  isEditingExistingLocation={editingIndex !== null}
                  handleLocationChange={handleLocationChange}
                  handleAddLocation={handleLocationSubmit}
                  handleAddMoreLocation={() => {}}
                  handleCancel={() => {
                    setWorkflowStep('locations');
                    setCurrentLocation(null);
                    setEditingIndex(null);
                    setFieldErrors({});
                  }}
                  isProcessing={isProcessing}
                  fieldErrors={fieldErrors}
                />
              </div>
            </div>
          )}
                  
          {/* Back to Locations Button when in location form */}
          {workflowStep === 'location-form' && (
            <div className="mb-6">
              <button
                onClick={() => {
                  setCurrentLocation(null);
                  setEditingIndex(null);
                  setWorkflowStep('locations');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Locations
              </button>
            </div>
          )}
                  
          {/* Locations Table - Only show when not in location form */}
          {workflowStep === 'locations' && (
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.length > 0 ? (
                    locations.map((location, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${location.locationType === 'headquarters' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {location.locationType.charAt(0).toUpperCase() + location.locationType.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.brandName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.state}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.lga}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.cityRegion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {location.houseNumber} {location.street}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {location.landmark || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {location.buildingType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {organizationDetails.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {organizationDetails.visibility === 'public' ? 'Yes' : 'No'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {organizationDetails.verifiedBadge ? 'Verified' : 'Unverified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                          <button
                            onClick={() => handleEditLocation(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14} className="px-6 py-4 text-center text-sm text-gray-500">
                        No locations added yet. Click "Add New Location" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
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