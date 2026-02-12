"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { CreditCard, Building, Globe, MapPin, Search, ChevronDown, Layers, Plus } from "lucide-react";

interface LocationStepProps {
  locations: LocationData[];
  setLocations: React.Dispatch<React.SetStateAction<LocationData[]>>;
  locationDropdownStates: DropdownState[];
  setLocationDropdownStates: React.Dispatch<React.SetStateAction<DropdownState[]>>;
  currentStep: 'packages' | 'profile' | 'locations' | 'location-payment' | 'payment';
  setCurrentStep: React.Dispatch<React.SetStateAction<'packages' | 'profile' | 'locations' | 'location-payment' | 'payment'>>;
  organizationProfile: {
    businessType: 'registered' | 'unregistered';
    isPublicProfile: boolean;
    verificationStatus: 'verified' | 'unverified';
  };
  locationSubmitting: boolean;
  setLocationSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  locationSuccess: boolean;
  setLocationSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  locationError: string | null;
  setLocationError: React.Dispatch<React.SetStateAction<string | null>>;
  countries: any[];
  locationPaymentInitializing: boolean;
  setLocationPaymentInitializing: React.Dispatch<React.SetStateAction<boolean>>;
  locationPaymentError: string | null;
  setLocationPaymentError: React.Dispatch<React.SetStateAction<string | null>>;
  locationPaymentData: any;
  setLocationPaymentData: React.Dispatch<React.SetStateAction<any>>;
  handleLocationPayment: () => void;
  // Add selected package info
  selectedPackageInfo?: {
    packageName: string;
    billingCycle: string;
    amount: number;
  };
}

// Define types for location data
type LocationData = {
  locationType: 'headquarters' | 'branch';
  brandName: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  cityRegionFee?: number;
  pricingSource?: string; // New field to track pricing source
  houseNumber: string;
  street: string;
  landmark?: string;
  buildingColor?: string;
  buildingType?: string;
  gallery: {
    images: (string | File)[];
    videos: (string | File)[];
  };
};

type DropdownState = {
  countryDropdownOpen: boolean;
  stateDropdownOpen: boolean;
  lgaDropdownOpen: boolean;
  cityDropdownOpen: boolean;
  cityRegionDropdownOpen: boolean;
  // Search states
  countrySearch: string;
  stateSearch: string;
  lgaSearch: string;
  citySearch: string;
  cityRegionSearch: string;
  // Loading states
  loadingStates: boolean;
  loadingLgas: boolean;
  loadingCities: boolean;
  loadingCityRegions: boolean;
  // Filtered options
  statesForCountry: (string | { name: string; isoCode?: string })[];
  lgasForState: (string | { name: string })[];
  citiesForLga: (string | { name: string })[];
  cityRegionsForCity: { name: string; fee: number; _id: string }[];
};

const LocationStep: React.FC<LocationStepProps> = ({
  locations,
  setLocations,
  locationDropdownStates,
  setLocationDropdownStates,
  currentStep,
  setCurrentStep,
  organizationProfile,
  locationSubmitting,
  setLocationSubmitting,
  locationSuccess,
  setLocationSuccess,
  locationError,
  setLocationError,
  countries,
  locationPaymentInitializing,
  setLocationPaymentInitializing,
  locationPaymentError,
  setLocationPaymentError,
  locationPaymentData,
  setLocationPaymentData,
  handleLocationPayment,
  selectedPackageInfo,
}) => {
  // Helper functions for filtering
  const getFilteredCountries = (searchTerm: string = '') => {
    if (!countries) return [];
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country.isoCode && country.isoCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredStatesForLocation = (index: number, searchTerm: string = ''): (string | { name: string; isoCode?: string })[] => {
    const states = locationDropdownStates[index]?.statesForCountry || [];
    return states.filter((state) =>
      (typeof state === 'string' && state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof state === 'object' && state.name && state.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof state === 'object' && state.isoCode && state.isoCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredLgasForLocation = (index: number, searchTerm: string = ''): (string | { name: string })[] => {
    const lgas = locationDropdownStates[index]?.lgasForState || [];
    return lgas.filter((lga) =>
      (typeof lga === 'string' && lga.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof lga === 'object' && lga.name && lga.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredCitiesForLocation = (index: number, searchTerm: string = ''): (string | { name: string })[] => {
    const cities = locationDropdownStates[index]?.citiesForLga || [];
    return cities.filter((city) =>
      (typeof city === 'string' && city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof city === 'object' && city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getFilteredCityRegionsForLocation = (index: number, searchTerm: string = ''): { name: string; fee: number; _id: string }[] => {
    const regions = locationDropdownStates[index]?.cityRegionsForCity || [];
    return regions.filter((region) =>
      (region.name && region.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Functions to load location data
  const loadStatesForLocation = async (index: number, countryName: string) => {
    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/states?country=${encodeURIComponent(countryName)}`);
      // Transform the response to extract just the state names
      const stateList = data.data?.states?.map((state: any) => typeof state === 'string' ? state : state.name) || [];
      
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].statesForCountry = stateList;
      setLocationDropdownStates(newDropdownStates);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadLgasForLocation = async (index: number, countryName: string, stateName: string) => {
    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/lgas?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
      // Transform the response to extract just the LGA names
      const lgaList = data.data?.lgas?.map((lga: any) => typeof lga === 'string' ? lga : lga.name) || [];
      
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].lgasForState = lgaList;
      setLocationDropdownStates(newDropdownStates);
    } catch (error) {
      console.error('Error loading LGAs:', error);
    }
  };

  const loadCitiesForLocation = async (index: number, countryName: string, stateName: string, lgaName: string) => {
    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/cities?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}&lga=${encodeURIComponent(lgaName)}`);
      // Transform the response to extract just the city names
      const cityList = data.data?.cities?.map((city: any) => typeof city === 'string' ? city : city.name) || [];
      
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].citiesForLga = cityList;
      setLocationDropdownStates(newDropdownStates);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const loadCityRegionsForLocation = async (index: number, countryName: string, stateName: string, lgaName: string, cityName: string) => {
    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/city-regions?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}&lga=${encodeURIComponent(lgaName)}&city=${encodeURIComponent(cityName)}`);
      // Transform the response to extract just the city region names and fees
      const regionList = data.data?.cityRegions?.map((region: any) => ({
        name: region.name || region,
        fee: region.fee,
        _id: region._id || region.name || region
      })) || [];
      
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].cityRegionsForCity = regionList;
      setLocationDropdownStates(newDropdownStates);
    } catch (error) {
      console.error('Error loading city regions:', error);
    }
  };

  // New function to get location pricing with hierarchical fallback
  const getLocationPricing = async (locationData: LocationData): Promise<{ fee: number; source: string }> => {
    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();

      const pricingData = {
        country: locationData.country,
        state: locationData.state,
        lga: locationData.lga || undefined,
        city: locationData.city,
        cityRegion: locationData.cityRegion || undefined
      };

      console.log('🔍 Fetching location pricing for:', pricingData);

      // Use the correct endpoint for location fees
      const response = await httpService.getData<any>(`/api/payment/verified-badge/pricing?country=${encodeURIComponent(pricingData.country)}&state=${encodeURIComponent(pricingData.state)}&city=${encodeURIComponent(pricingData.city)}${pricingData.lga ? `&lga=${encodeURIComponent(pricingData.lga)}` : ''}${pricingData.cityRegion ? `&cityRegion=${encodeURIComponent(pricingData.cityRegion)}` : ''}`);

      if (response.success && response.data) {
        console.log('✅ Location pricing response:', response.data);
        return {
          fee: response.data.fee,
          source: response.data.source
        };
      }

      // Fallback to default pricing if no specific pricing found
      console.log('⚠️ No specific pricing found, using default');
      return {
        fee: 5000, // Default fallback fee
        source: 'Default System Pricing'
      };
    } catch (error) {
      console.error('❌ Error fetching location pricing:', error);
      // Return default pricing on error
      return {
        fee: 5000,
        source: 'Default System Pricing (Error Fallback)'
      };
    }
  };

  // Function to update location pricing when location details change
  const updateLocationPricing = async (index: number) => {
    const location = locations[index];
    
    // CRITICAL: Only fetch pricing if we DON'T have an existing cityRegionFee
    // This respects existing fees and only uses hierarchical pricing when needed
    if (location.country && location.state && location.city && !location.cityRegionFee) {
      try {
        const pricingResult = await getLocationPricing(location);
        
        // Update the location with the fetched pricing
        const newLocations = [...locations];
        newLocations[index].cityRegionFee = pricingResult.fee;
        newLocations[index].pricingSource = pricingResult.source;
        setLocations(newLocations);
        
        console.log(`💰 Updated pricing for location ${index + 1}: ₦${pricingResult.fee.toLocaleString()} (${pricingResult.source})`);
      } catch (error) {
        console.error('Error updating location pricing:', error);
      }
    } else if (location.cityRegionFee) {
      console.log(`💰 Location ${index + 1} already has fee: ₦${location.cityRegionFee.toLocaleString()} - not overriding`);
    }
  };

  return (
    <div>
      {/* Location Payment Section - Step 4 (for verified organizations) */}
      {currentStep === 'location-payment' && organizationProfile?.verificationStatus === 'verified' && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Payment Summary</h3>
          
          {locationPaymentError && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
              <p className="font-medium">Error: {locationPaymentError}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Selected Package Summary */}
            {selectedPackageInfo && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Selected Package</h4>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-purple-900">{selectedPackageInfo.packageName}</h5>
                      <p className="text-sm text-purple-700 capitalize">
                        {selectedPackageInfo.billingCycle} Plan
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-900">
                        ₦{selectedPackageInfo.amount.toLocaleString('en-NG')}
                      </p>
                      <p className="text-xs text-purple-600">Package amount</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
                        <div>
                          <p className="font-semibold text-gray-900">₦{location.cityRegionFee.toLocaleString('en-NG')}</p>
                          <p className="text-xs text-gray-500">
                            {location.pricingSource || (location.cityRegion ? 'City Region Fee' : 'Calculated Fee')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Fee to be calculated</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Location Total */}
              {locations.some(loc => loc.cityRegionFee) && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">Location Verification Total:</span>
                    <span className="text-xl font-bold text-blue-900">
                      ₦{locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0).toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Combined Total Summary */}
            {selectedPackageInfo && locations.some(loc => loc.cityRegionFee) && (
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Total Payment Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">Package Subscription</p>
                      <p className="text-sm text-gray-500">{selectedPackageInfo.packageName} - {selectedPackageInfo.billingCycle}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₦{selectedPackageInfo.amount.toLocaleString('en-NG')}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">Location Verification</p>
                      <p className="text-sm text-gray-500">{locations.length} location(s)</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₦{locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0).toLocaleString('en-NG')}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">Total Amount</p>
                        <p className="text-sm text-green-600">Combined Payment</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ₦{(selectedPackageInfo.amount + locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0)).toLocaleString('en-NG')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
           
            
           
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('locations')}
                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Back to Locations
              </button>
              <button
                onClick={handleLocationPayment}
                disabled={locationPaymentInitializing}
                className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center ${
                  locationPaymentInitializing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
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
                    {selectedPackageInfo && locations.some(loc => loc.cityRegionFee) 
                      ? `Pay Combined ₦${(selectedPackageInfo.amount + locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0)).toLocaleString('en-NG')} (Package + Locations)`
                      : 'Pay for Location Verification'
                    }
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locations Form - Step 3 */}
      {currentStep === 'locations' && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add Locations</h3>
          
          {/* Selected Package Display */}
          {selectedPackageInfo && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-purple-900">Selected Package</h4>
                  <p className="text-sm text-purple-700">
                    {selectedPackageInfo.packageName} - {selectedPackageInfo.billingCycle}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    This package will be included in your payment
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-900">
                    ₦{selectedPackageInfo.amount.toLocaleString('en-NG')}
                  </p>
                  <p className="text-xs text-purple-600">Package amount</p>
                </div>
              </div>
            </div>
          )}
          
          {locationSuccess ? (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-medium">Locations saved successfully!</p>
            </div>
          ) : (
            <>
              {locationError && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                  <p className="font-medium">Error: {locationError}</p>
                </div>
              )}
              
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Location {index + 1}</h4>
                      {locations.length > 1 && (
                        <button
                          onClick={() => {
                            const newLocations = [...locations];
                            newLocations.splice(index, 1);
                            setLocations(newLocations);
                            
                            // Also remove the corresponding dropdown state
                            const newDropdownStates = [...locationDropdownStates];
                            newDropdownStates.splice(index, 1);
                            setLocationDropdownStates(newDropdownStates);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                        <select
                          value={location.locationType}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].locationType = e.target.value as 'headquarters' | 'branch';
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="headquarters">Headquarters</option>
                          <option value="branch">Branch</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={location.brandName}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].brandName = e.target.value;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter brand name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Country Field - Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newDropdownStates = [...locationDropdownStates];
                              newDropdownStates[index].countryDropdownOpen = !newDropdownStates[index].countryDropdownOpen;
                              newDropdownStates[index].stateDropdownOpen = false;
                              newDropdownStates[index].cityDropdownOpen = false;
                              setLocationDropdownStates(newDropdownStates);
                            }}
                            className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${location.country ? '' : 'text-gray-500'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-gray-400" />
                              {location.country ? (
                                <span>{location.country}</span>
                              ) : (
                                <span className="text-gray-500">Select a country...</span>
                              )}
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${locationDropdownStates[index]?.countryDropdownOpen ? 'transform rotate-180' : ''}`} />
                          </button>
                          
                          {locationDropdownStates[index]?.countryDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                              <div className="p-2 border-b">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                                    type="text"
                                    placeholder="Search countries..."
                                    className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    value={locationDropdownStates[index]?.countrySearch || ''}
                                    onChange={(e) => {
                                      const newDropdownStates = [...locationDropdownStates];
                                      newDropdownStates[index].countrySearch = e.target.value;
                                      setLocationDropdownStates(newDropdownStates);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="overflow-y-auto max-h-60">
                                {getFilteredCountries(locationDropdownStates[index]?.countrySearch).map((country) => (
                                  <button
                                    key={country.isoCode}
                                    type="button"
                                    onClick={() => {
                                      const newLocations = [...locations];
                                      newLocations[index].country = country.name;
                                      setLocations(newLocations);
                                      
                                      // Close dropdown and clear search
                                      const newDropdownStates = [...locationDropdownStates];
                                      newDropdownStates[index].countryDropdownOpen = false;
                                      newDropdownStates[index].countrySearch = '';
                                      setLocationDropdownStates(newDropdownStates);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
                                      location.country === country.name ? 'bg-purple-500/10' : ''
                                    }`}
                                  >
                                    <div className="text-left">
                                      <div className="font-medium">{country.name}</div>
                                    </div>
                                    {location.country === country.name && (
                                      <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></div>
                                    )}
                                  </button>
                                ))}
                                
                                {getFilteredCountries(locationDropdownStates[index]?.countrySearch).length === 0 && (
                                  <div className="px-3 py-2 text-gray-500 text-center">No countries found</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* State Field - Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province <span className="text-red-500">*</span>
                        </label>
                        
                        {!location.country ? (
                          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                            Please select a country first
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  // Load states for this location if not already loaded
                                  if (!locationDropdownStates[index]?.statesForCountry.length) {
                                    loadStatesForLocation(index, location.country);
                                  }
                                  
                                  const newDropdownStates = [...locationDropdownStates];
                                  newDropdownStates[index].stateDropdownOpen = !newDropdownStates[index].stateDropdownOpen;
                                  newDropdownStates[index].countryDropdownOpen = false;
                                  newDropdownStates[index].cityDropdownOpen = false;
                                  setLocationDropdownStates(newDropdownStates);
                                }}
                                className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${location.state ? '' : 'text-gray-500'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-5 h-5 text-gray-400" />
                                  {location.state ? (
                                    <span>{location.state}</span>
                                  ) : (
                                    <span className="text-gray-500">Select state...</span>
                                  )}
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${locationDropdownStates[index]?.stateDropdownOpen ? 'transform rotate-180' : ''}`} />
                              </button>
                              
                              {locationDropdownStates[index]?.stateDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                                  <div className="p-2 border-b">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                      <input
                                        type="text"
                                        placeholder="Search states..."
                                        className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        value={locationDropdownStates[index]?.stateSearch || ''}
                                        onChange={(e) => {
                                          const newDropdownStates = [...locationDropdownStates];
                                          newDropdownStates[index].stateSearch = e.target.value;
                                          setLocationDropdownStates(newDropdownStates);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="overflow-y-auto max-h-60">
                                    {(getFilteredStatesForLocation(index, locationDropdownStates[index]?.stateSearch) || []).map((state) => (
                                      <button
                                        key={`${location.country}-${typeof state === 'string' ? state : state.name}`}
                                        type="button"
                                        onClick={() => {
                                          const stateName = typeof state === 'string' ? state : state.name;
                                          if (stateName) {
                                            const newLocations = [...locations];
                                            newLocations[index].state = stateName;
                                            setLocations(newLocations);
                                            
                                            // Close dropdown and clear search
                                            const newDropdownStates = [...locationDropdownStates];
                                            newDropdownStates[index].stateDropdownOpen = false;
                                            newDropdownStates[index].stateSearch = '';
                                            setLocationDropdownStates(newDropdownStates);
                                          }
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                          location.state === (typeof state === 'string' ? state : state.name) ? 'bg-purple-500/10' : ''
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">{typeof state === 'string' ? state : state.name}</div>
                                          {location.state === (typeof state === 'string' ? state : state.name) && (
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                          )}
                                        </div>
                                      </button>
                                    ))}
                                    
                                    {(getFilteredStatesForLocation(index, locationDropdownStates[index]?.stateSearch) || []).length === 0 && (
                                      <div className="px-3 py-2 text-gray-500 text-center">
                                        {locationDropdownStates[index]?.loadingStates ? 'Loading states...' : locationDropdownStates[index]?.statesForCountry.length === 0 ? 'No states found for this country' : 'No results match your search'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* LGA Field - Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LGA (Local Government Area) - Optional
                        </label>
                        
                        {!location.state ? (
                          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                            Please select a state first
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3">
                              {/* Searchable dropdown for LGA */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Load LGAs for this location if not already loaded
                                    if (!locationDropdownStates[index]?.lgasForState.length) {
                                      loadLgasForLocation(index, location.country, location.state);
                                    }
                                    
                                    const newDropdownStates = [...locationDropdownStates];
                                    newDropdownStates[index].lgaDropdownOpen = !newDropdownStates[index].lgaDropdownOpen;
                                    newDropdownStates[index].countryDropdownOpen = false;
                                    newDropdownStates[index].stateDropdownOpen = false;
                                    newDropdownStates[index].cityDropdownOpen = false;
                                    setLocationDropdownStates(newDropdownStates);
                                  }}
                                  className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${location.lga ? '' : 'text-gray-500'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    {location.lga ? (
                                      <span>{location.lga}</span>
                                    ) : (
                                      <span className="text-gray-500">Select LGA...</span>
                                    )}
                                  </div>
                                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${locationDropdownStates[index]?.lgaDropdownOpen ? 'transform rotate-180' : ''}`} />
                                </button>
                                
                                {locationDropdownStates[index]?.lgaDropdownOpen && (
                                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                                    <div className="p-2 border-b">
                                      <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                          type="text"
                                          placeholder="Search LGAs..."
                                          className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                          value={locationDropdownStates[index]?.lgaSearch || ''}
                                          onChange={(e) => {
                                            const newDropdownStates = [...locationDropdownStates];
                                            newDropdownStates[index].lgaSearch = e.target.value;
                                            setLocationDropdownStates(newDropdownStates);
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="overflow-y-auto max-h-60">
                                      {(getFilteredLgasForLocation(index, locationDropdownStates[index]?.lgaSearch) || []).map((lga) => (
                                        <button
                                          key={`${location.state}-${typeof lga === 'string' ? lga : lga.name}`}
                                          type="button"
                                          onClick={() => {
                                            const lgaName = typeof lga === 'string' ? lga : lga.name;
                                            if (lgaName) {
                                              const newLocations = [...locations];
                                              newLocations[index].lga = lgaName;
                                              setLocations(newLocations);
                                              
                                              // Close dropdown and clear search
                                              const newDropdownStates = [...locationDropdownStates];
                                              newDropdownStates[index].lgaDropdownOpen = false;
                                              newDropdownStates[index].lgaSearch = '';
                                              setLocationDropdownStates(newDropdownStates);
                                            }
                                          }}
                                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                            location.lga === (typeof lga === 'string' ? lga : lga.name) ? 'bg-purple-500/10' : ''
                                          }`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">{typeof lga === 'string' ? lga : lga.name}</div>
                                            {location.lga === (typeof lga === 'string' ? lga : lga.name) && (
                                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            )}
                                          </div>
                                        </button>
                                      ))}
                                      
                                      {(getFilteredLgasForLocation(index, locationDropdownStates[index]?.lgaSearch) || []).length === 0 && (
                                        <div className="px-3 py-2 text-gray-500 text-center">
                                          {locationDropdownStates[index]?.loadingLgas ? 'Loading LGAs...' : locationDropdownStates[index]?.lgasForState.length === 0 ? 'No LGAs found for this state' : 'No results match your search'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                This field is optional. Select LGA if it exists for this location.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* City Field - Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        
                        {!location.state ? (
                          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                            Please select a state first
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  // Load cities for this location if not already loaded
                                  if (!locationDropdownStates[index]?.citiesForLga.length) {
                                    loadCitiesForLocation(index, location.country, location.state, location.lga);
                                  }
                                  
                                  const newDropdownStates = [...locationDropdownStates];
                                  newDropdownStates[index].cityDropdownOpen = !newDropdownStates[index].cityDropdownOpen;
                                  newDropdownStates[index].countryDropdownOpen = false;
                                  newDropdownStates[index].stateDropdownOpen = false;
                                  setLocationDropdownStates(newDropdownStates);
                                }}
                                className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${location.city ? '' : 'text-gray-500'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Building className="w-5 h-5 text-gray-400" />
                                  {location.city ? (
                                    <span>{location.city}</span>
                                  ) : (
                                    <span className="text-gray-500">Select city...</span>
                                  )}
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${locationDropdownStates[index]?.cityDropdownOpen ? 'transform rotate-180' : ''}`} />
                              </button>
                              
                              {locationDropdownStates[index]?.cityDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                                  <div className="p-2 border-b">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                      <input
                                        type="text"
                                        placeholder="Search cities..."
                                        className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        value={locationDropdownStates[index]?.citySearch || ''}
                                        onChange={(e) => {
                                          const newDropdownStates = [...locationDropdownStates];
                                          newDropdownStates[index].citySearch = e.target.value;
                                          setLocationDropdownStates(newDropdownStates);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="overflow-y-auto max-h-60">
                                    {(getFilteredCitiesForLocation(index, locationDropdownStates[index]?.citySearch) || []).map((city) => (
                                      <button
                                        key={`${location.state}-${typeof city === 'string' ? city : city.name}`}
                                        type="button"
                                        onClick={() => {
                                          const cityName = typeof city === 'string' ? city : city.name;
                                          if (cityName) {
                                            const newLocations = [...locations];
                                            newLocations[index].city = cityName;
                                            setLocations(newLocations);
                                            
                                            // Close dropdown and clear search
                                            const newDropdownStates = [...locationDropdownStates];
                                            newDropdownStates[index].cityDropdownOpen = false;
                                            newDropdownStates[index].citySearch = '';
                                            setLocationDropdownStates(newDropdownStates);
                                            
                                            // Update pricing when city changes (for hierarchical fallback)
                                            setTimeout(() => updateLocationPricing(index), 100);
                                          }
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                          location.city === (typeof city === 'string' ? city : city.name) ? 'bg-purple-500/10' : ''
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="font-medium">{typeof city === 'string' ? city : city.name}</div>
                                          {location.city === (typeof city === 'string' ? city : city.name) && (
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                          )}
                                        </div>
                                      </button>
                                    ))}
                                    
                                    {(getFilteredCitiesForLocation(index, locationDropdownStates[index]?.citySearch) || []).length === 0 && (
                                      <div className="px-3 py-2 text-gray-500 text-center">
                                        {locationDropdownStates[index]?.loadingCities ? 'Loading cities...' : locationDropdownStates[index]?.citiesForLga.length === 0 ? 'No cities found for this LGA' : 'No results match your search'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* City Region Field - Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City Region with Fee - Optional
                        </label>
                        
                        {!location.city ? (
                          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                            Please select a city first
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3">
                              {/* Searchable dropdown for city region */}
                              <div>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Load city regions for this location if not already loaded
                                      if (!locationDropdownStates[index]?.cityRegionsForCity.length) {
                                        loadCityRegionsForLocation(index, location.country, location.state, location.lga, location.city);
                                      }
                                      
                                      const newDropdownStates = [...locationDropdownStates];
                                      newDropdownStates[index].cityRegionDropdownOpen = !newDropdownStates[index].cityRegionDropdownOpen;
                                      newDropdownStates[index].countryDropdownOpen = false;
                                      newDropdownStates[index].stateDropdownOpen = false;
                                      newDropdownStates[index].lgaDropdownOpen = false;
                                      newDropdownStates[index].cityDropdownOpen = false;
                                      setLocationDropdownStates(newDropdownStates);
                                    }}
                                    className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${location.cityRegion ? '' : 'text-gray-500'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Layers className="w-5 h-5 text-gray-400" />
                                      {location.cityRegion ? (
                                        <span>{location.cityRegion} {location.cityRegionFee ? `(₦${location.cityRegionFee.toLocaleString()})` : ''}</span>
                                      ) : (
                                        <span className="text-gray-500">Select city region...</span>
                                      )}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${locationDropdownStates[index]?.cityRegionDropdownOpen ? 'transform rotate-180' : ''}`} />
                                  </button>
                                  
                                  {locationDropdownStates[index]?.cityRegionDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                                      <div className="p-2 border-b">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                          <input
                                            type="text"
                                            placeholder="Search city regions..."
                                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            value={locationDropdownStates[index]?.cityRegionSearch || ''}
                                            onChange={(e) => {
                                              const newDropdownStates = [...locationDropdownStates];
                                              newDropdownStates[index].cityRegionSearch = e.target.value;
                                              setLocationDropdownStates(newDropdownStates);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="overflow-y-auto max-h-60">
                                        {(getFilteredCityRegionsForLocation(index, locationDropdownStates[index]?.cityRegionSearch) || []).map((region) => (
                                          <button
                                            key={region._id}
                                            type="button"
                                            onClick={() => {
                                              const newLocations = [...locations];
                                              newLocations[index].cityRegion = region.name;
                                              // CRITICAL: Only set fee if it doesn't already exist
                                              if (!newLocations[index].cityRegionFee) {
                                                newLocations[index].cityRegionFee = region.fee;
                                                newLocations[index].pricingSource = `City Region: ${region.name}`;
                                              }
                                              setLocations(newLocations);
                                              
                                              // Close dropdown and clear search
                                              const newDropdownStates = [...locationDropdownStates];
                                              newDropdownStates[index].cityRegionDropdownOpen = false;
                                              newDropdownStates[index].cityRegionSearch = '';
                                              setLocationDropdownStates(newDropdownStates);
                                            }}
                                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                              location.cityRegion === region.name ? 'bg-purple-500/10' : ''
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="font-medium">{region.name} (₦{region.fee.toLocaleString()})</div>
                                              {location.cityRegion === region.name && (
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                              )}
                                            </div>
                                          </button>
                                        ))}
                                        
                                        {(getFilteredCityRegionsForLocation(index, locationDropdownStates[index]?.cityRegionSearch) || []).length === 0 && (
                                          <div className="px-3 py-2 text-gray-500 text-center">
                                            {locationDropdownStates[index]?.loadingCityRegions ? 'Loading city regions...' : locationDropdownStates[index]?.cityRegionsForCity.length === 0 ? 'No city regions found for this city' : 'No results match your search'}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-500 mt-2">
                                  {locationDropdownStates[index]?.loadingCityRegions ? 'Loading city regions...' : 'This field is optional. Select or enter region within the city.'}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
                        <input
                          type="text"
                          value={location.houseNumber}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].houseNumber = e.target.value;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="House Number"
                        />
                      </div>
                    </div>
                    
                    {/* Location Pricing Display */}
                    {location.cityRegionFee && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-green-900">Location Verification Fee</h5>
                            <p className="text-sm text-green-700">
                              {location.pricingSource || (location.cityRegion 
                                ? `City Region: ${location.cityRegion}` 
                                : 'Calculated based on location hierarchy'
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-900">
                              ₦{location.cityRegionFee.toLocaleString('en-NG')}
                            </p>
                            <p className="text-xs text-green-600">Verification fee</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        value={location.street}
                        onChange={(e) => {
                          const newLocations = [...locations];
                          newLocations[index].street = e.target.value;
                          setLocations(newLocations);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Street Address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                        <input
                          type="text"
                          value={location.landmark || ''}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].landmark = e.target.value || undefined;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Nearby landmark or bus stop"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building Color</label>
                        <input
                          type="text"
                          value={location.buildingColor || ''}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].buildingColor = e.target.value || undefined;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Building color"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Building Type</label>
                        <input
                          type="text"
                          value={location.buildingType || ''}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].buildingType = e.target.value || undefined;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Type of building"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City Region Fee</label>
                        <input
                          type="number"
                          value={location.cityRegionFee || ''}
                          onChange={(e) => {
                            const newLocations = [...locations];
                            newLocations[index].cityRegionFee = e.target.value ? Number(e.target.value) : undefined;
                            setLocations(newLocations);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Delivery/service fee for region"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    // Add new location
                    setLocations([...locations, {
                      locationType: 'branch',
                      brandName: '',
                      country: '',
                      state: '',
                      lga: '',
                      city: '',
                      cityRegion: '',
                      houseNumber: '',
                      street: '',
                      landmark: undefined,
                      buildingColor: undefined,
                      buildingType: undefined,
                      cityRegionFee: undefined,
                      gallery: {
                        images: [],
                        videos: []
                      }
                    } as LocationData]);
                    
                    // Add corresponding dropdown state
                    setLocationDropdownStates([...locationDropdownStates, {
                      countryDropdownOpen: false,
                      stateDropdownOpen: false,
                      lgaDropdownOpen: false,
                      cityDropdownOpen: false,
                      cityRegionDropdownOpen: false,
                      // Search states
                      countrySearch: '',
                      stateSearch: '',
                      lgaSearch: '',
                      citySearch: '',
                      cityRegionSearch: '',
                      // Manual input states
                      showManualCountry: false,
                      manualCountry: '',
                      showManualState: false,
                      manualState: '',
                      showManualLGA: false,
                      manualLGA: '',
                      showManualCity: false,
                      manualCity: '',
                      showManualRegion: false,
                      manualRegion: '',
                      // Loading states
                      loadingStates: false,
                      loadingLgas: false,
                      loadingCities: false,
                      loadingCityRegions: false,
                      // Filtered options
                      statesForCountry: [],
                      lgasForState: [],
                      citiesForLga: [],
                      cityRegionsForCity: [],
                    } as DropdownState]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Location
                </button>
                
              
               
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('profile')}
                  className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  Back to Profile
                </button>
                <button
  onClick={async () => {
    setLocationSubmitting(true);
    setLocationError(null);
    
    try {
      // Basic validation
      if (locations.length === 0) {
        setLocationError('Please add at least one location');
        setLocationSubmitting(false);
        return;
      }
      
      // Check if unverified organization is trying to add more than one location
      if (organizationProfile?.verificationStatus === 'unverified' && locations.length > 1) {
        setLocationError('Unverified organizations can only add one location (headquarters). Please subscribe to verified badge to add more locations.');
        setLocationSubmitting(false);
        return;
      }
      
      // Prepare location to send - always send first location for now
      const locationToSend: LocationData = { ...locations[0] };
      
      // For unverified organizations, ensure it's headquarters
      if (organizationProfile?.verificationStatus === 'unverified') {
        locationToSend.locationType = 'headquarters';
        
        // Additional validation for unverified orgs
        if (locations.length === 1 && locationToSend.locationType !== 'headquarters') {
          setLocationError('Unverified organizations must have exactly one headquarters location.');
          setLocationSubmitting(false);
          return;
        }
      }
      
      // Validate required fields
      if (!locationToSend.brandName?.trim()) {
        setLocationError('Brand name is required');
        setLocationSubmitting(false);
        return;
      }
      
      if (!locationToSend.country?.trim()) {
        setLocationError('Country is required');
        setLocationSubmitting(false);
        return;
      }
      
      if (!locationToSend.state?.trim()) {
        setLocationError('State is required');
        setLocationSubmitting(false);
        return;
      }
      
      if (!locationToSend.city?.trim()) {
        setLocationError('City is required');
        setLocationSubmitting(false);
        return;
      }
      
      if (!locationToSend.houseNumber?.trim()) {
        setLocationError('House number is required');
        setLocationSubmitting(false);
        return;
      }
      
      if (!locationToSend.street?.trim()) {
        setLocationError('Street is required');
        setLocationSubmitting(false);
        return;
      }
      
      console.log('🚀 Location being sent to backend:', locationToSend);
      
      // Save location to organization profile
      const OrganizationProfileServiceModule = await import('@/services/OrganizationProfileService');
      const orgProfileService = new OrganizationProfileServiceModule.default();
      
      const profileResponse = await orgProfileService.addLocation(locationToSend);
      
      console.log('🚀 Backend response:', profileResponse);
      
      if (profileResponse.success) {
        setLocationSuccess(true);
        setLocationError(null);
        
        // Navigate to next step after success
        setTimeout(() => {
          if (organizationProfile?.verificationStatus === 'verified') {
            setCurrentStep('location-payment');
          } else {
            setCurrentStep('payment');
          }
        }, 1500);
      } else {
        // Handle backend errors
        const errorMsg = profileResponse.message || profileResponse.error || 'Failed to save location';
        setLocationError(errorMsg);
        setLocationSuccess(false);
      }
    } catch (error: any) {
      console.error('🚨 Error saving location:', error);
      
      // Handle network errors
      let errorMessage = 'An error occurred while saving location';
      if (error.message) {
        if (error.message.includes('500')) {
          errorMessage = 'Server error occurred. Please try again or contact support.';
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLocationError(errorMessage);
      setLocationSuccess(false);
    } finally {
      setLocationSubmitting(false);
    }
  }}
  disabled={locationSubmitting}
  className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
    locationSubmitting 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-purple-600 hover:bg-purple-700'
  }`}
>
  {locationSubmitting ? (
    <>
      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Saving...
    </>
  ) : (
    organizationProfile?.verificationStatus === 'verified' 
      ? 'Continue to Location Payment' 
      : 'Continue to Package Payment'
  )}
</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationStep;