"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Globe, MapPin, Building, Layers, Plus, Search, ChevronDown } from 'lucide-react';
import CityRegionService from '@/services/cityRegionService';
import { Country, State, City } from 'country-state-city';

const EditCityRegionPage = () => {
  const router = useRouter();
  const params = useParams();
  const regionId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  // Form states - using backend field names
  const [formData, setFormData] = useState({
    country: '',
    stateProvince: '',
    lga: '',
    city: '',
    cityRegion: ''
  });

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  
  // Manual input states
  const [showManualCountry, setShowManualCountry] = useState(false);
  const [manualCountry, setManualCountry] = useState('');
  const [showManualState, setShowManualState] = useState(false);
  const [manualState, setManualState] = useState('');
  const [showManualLGA, setShowManualLGA] = useState(false);
  const [manualLGA, setManualLGA] = useState('');
  const [showManualCity, setShowManualCity] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [showManualRegion, setShowManualRegion] = useState(false);
  const [manualRegion, setManualRegion] = useState('');

  // Refs for closing dropdowns on outside click
  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    loadCountries();
    fetchRegionData();
  }, []);

  const fetchRegionData = async () => {
    try {
      setLoading(true);
      const region = await CityRegionService.getCityRegionById(regionId);
      
      // Pre-fill form with existing data
      setFormData({
        country: region.country || region.countryName || '',
        stateProvince: region.stateProvince || region.stateName || '',
        lga: region.lga || '',
        city: region.city || region.cityName || '',
        cityRegion: region.cityRegion || region.region || ''
      });

      // Load states for this country
      const country = Country.getAllCountries().find(c => 
        c.name === region.country || c.name === region.countryName
      );
      if (country?.isoCode) {
        loadStates(country.isoCode);
      }
    } catch (error) {
      console.error('Error fetching city region:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const country = countries.find(c => c.name === formData.country);
      if (country?.isoCode) {
        loadStates(country.isoCode);
      }
    }
  }, [formData.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.stateProvince && formData.country) {
      const country = countries.find(c => c.name === formData.country);
      if (country?.isoCode) {
        const state = states.find(s => s.name === formData.stateProvince);
        if (state?.isoCode) {
          loadCities(country.isoCode, state.isoCode);
        }
      }
    }
  }, [formData.stateProvince, formData.country, countries, states]);

  const loadCountries = async () => {
    try {
      const data = Country.getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadStates = async (countryCode: string) => {
    try {
      const data = State.getStatesOfCountry(countryCode);
      setStates(data || []);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    try {
      const data = City.getCitiesOfState(countryCode, stateCode);
      setCities(data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.country || !formData.stateProvince || !formData.city) {
      alert('Please fill in all required fields (Country, State, City)');
      return;
    }
    
    setUpdating(true);

    try {
      // Create payload matching backend expectations
      const payload = {
        country: formData.country,
        stateProvince: formData.stateProvince,
        city: formData.city,
        lga: formData.lga || undefined, // Optional field
        cityRegion: formData.cityRegion || undefined // Optional field
      };

      const response = await CityRegionService.updateCityRegion(regionId, payload);
      
      // Show success modal with API message
      setSuccessMessage(response.message || 'City region updated successfully');
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Error updating city region:', error);
      alert(error.response?.data?.message || 'Failed to update city region');
    } finally {
      setUpdating(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate back to city region list after user closes modal
    router.push('/super-admin/subscription/city-region');
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    (country.isoCode && country.isoCode.toLowerCase().includes(countrySearch.toLowerCase()))
  );

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
    state.isoCode.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [countryRef, stateRef, cityRef];
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === countryRef) setCountryDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === cityRef) setCityDropdownOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-[#5D2A8B]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit City Region</h1>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-transparent" onClick={handleSuccessModalClose}></div>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-[#5D2A8B] text-white py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-[#5D2A8B]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit City Region</h1>
          </div>
          <p className="text-gray-600">Update city region details</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* All the form fields from CreateCityRegionPage go here */}
              {/* 1. Country Field */}
              <div ref={countryRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Country <span className="text-red-500">*</span>
                </label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setCountryDropdownOpen(!countryDropdownOpen);
                      setStateDropdownOpen(false);
                      setCityDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      {formData.country ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌍</span>
                          <span>{formData.country}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Select a country...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${countryDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-60">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.isoCode}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                country: country.name,
                                stateProvince: '',
                                lga: '',
                                city: '',
                                cityRegion: ''
                              });
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
                              formData.country === country.name ? 'bg-[#5D2A8B]/10' : ''
                            }`}
                          >
                            <span className="text-lg">🌍</span>
                            <div className="text-left">
                              <div className="font-medium">{country.name}</div>
                            </div>
                            {formData.country === country.name && (
                              <div className="ml-auto w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                            )}
                          </button>
                        ))}
                        
                        {filteredCountries.length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-center">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Other/Add manually option */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualCountry(!showManualCountry)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#5D2A8B] hover:bg-[#5D2A8B]/10 rounded-lg border border-dashed border-[#5D2A8B]"
                  >
                    <Plus className="w-4 h-4" />
                    Other (Add manually)
                  </button>
                </div>

                {showManualCountry && (
                  <div className="mt-3 p-4 border rounded-lg bg-blue-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Country Manually
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        placeholder="Enter country name..."
                        value={manualCountry}
                        onChange={(e) => setManualCountry(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!manualCountry.trim()) {
                            alert('Please enter a country name');
                            return;
                          }
                          setFormData({
                            ...formData,
                            country: manualCountry,
                            stateProvince: '',
                            lga: '',
                            city: '',
                            cityRegion: ''
                          });
                          setShowManualCountry(false);
                          setManualCountry('');
                        }}
                        className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowManualCountry(false);
                          setManualCountry('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. State Field */}
              <div ref={stateRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. State/Province <span className="text-red-500">*</span>
                </label>
                
                {!formData.country ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a country first
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setStateDropdownOpen(!stateDropdownOpen);
                          setCountryDropdownOpen(false);
                          setCityDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          {formData.stateProvince ? (
                            <span>{formData.stateProvince}</span>
                          ) : (
                            <span className="text-gray-500">Select state...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {stateDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search states..."
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                value={stateSearch}
                                onChange={(e) => setStateSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto max-h-60">
                            {filteredStates.map((state) => (
                              <button
                                key={`${state.countryCode}-${state.isoCode}`}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    stateProvince: state.name,
                                    lga: '',
                                    city: '',
                                    cityRegion: ''
                                  });
                                  setStateDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.stateProvince === state.name ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{state.name}</div>
                                  {formData.stateProvince === state.name && (
                                    <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {filteredStates.length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-center">
                                {states.length === 0 ? 'No states found for this country' : 'No results match your search'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Other/Add manually option */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowManualState(!showManualState)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#5D2A8B] hover:bg-[#5D2A8B]/10 rounded-lg border border-dashed border-[#5D2A8B]"
                      >
                        <Plus className="w-4 h-4" />
                        Other (Add manually)
                      </button>
                    </div>

                    {showManualState && (
                      <div className="mt-3 p-4 border rounded-lg bg-blue-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add State/Province Manually
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                            placeholder="Enter state/province name..."
                            value={manualState}
                            onChange={(e) => setManualState(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!manualState.trim()) {
                                alert('Please enter a state/province name');
                                return;
                              }
                              setFormData({
                                ...formData,
                                stateProvince: manualState,
                                lga: '',
                                city: '',
                                cityRegion: ''
                              });
                              setShowManualState(false);
                              setManualState('');
                            }}
                            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualState(false);
                              setManualState('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 3. LGA Field - MANUAL ENTRY ONLY */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. LGA (Local Government Area) - Optional
                </label>
                
                {!formData.stateProvince ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a state first
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {/* Manual input for LGA */}
                      <div>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                          placeholder="Enter LGA name (if applicable)..."
                          value={formData.lga}
                          onChange={(e) => setFormData(prev => ({ ...prev, lga: e.target.value }))}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          This field is optional. Enter LGA if it exists for this location.
                        </p>
                      </div>

                      {/* Alternative: Add LGA button */}
                      {!formData.lga && (
                        <button
                          type="button"
                          onClick={() => setShowManualLGA(!showManualLGA)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#5D2A8B] hover:bg-[#5D2A8B]/10 rounded-lg border border-dashed border-[#5D2A8B]"
                        >
                          <Building className="w-4 h-4" />
                          Add LGA Manually
                        </button>
                      )}

                      {showManualLGA && (
                        <div className="p-4 border rounded-lg bg-blue-50">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add LGA for {formData.stateProvince}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                              placeholder="Enter LGA name..."
                              value={manualLGA}
                              onChange={(e) => setManualLGA(e.target.value)}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!manualLGA.trim()) {
                                  alert('Please enter an LGA name');
                                  return;
                                }
                                setFormData(prev => ({ ...prev, lga: manualLGA }));
                                setShowManualLGA(false);
                                setManualLGA('');
                              }}
                              className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowManualLGA(false);
                                setManualLGA('');
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* 4. City Field */}
              <div ref={cityRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. City <span className="text-red-500">*</span>
                </label>
                
                {!formData.stateProvince ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a state first
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setCityDropdownOpen(!cityDropdownOpen);
                          setCountryDropdownOpen(false);
                          setStateDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          {formData.city ? (
                            <span>{formData.city}</span>
                          ) : (
                            <span className="text-gray-500">Select city...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${cityDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {cityDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search cities..."
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto max-h-60">
                            {filteredCities.map((city) => (
                              <button
                                key={`${city.countryCode}-${city.stateCode}-${city.name}`}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, city: city.name, cityRegion: '' }));
                                  setCityDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.city === city.name ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{city.name}</div>
                                  {formData.city === city.name && (
                                    <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {filteredCities.length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-center">
                                {cities.length === 0 ? 'No cities found for this state' : 'No results match your search'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Other/Add manually option */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setShowManualCity(!showManualCity)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#5D2A8B] hover:bg-[#5D2A8B]/10 rounded-lg border border-dashed border-[#5D2A8B]"
                      >
                        <Plus className="w-4 h-4" />
                        Other (Add manually)
                      </button>
                    </div>

                    {showManualCity && (
                      <div className="mt-3 p-4 border rounded-lg bg-blue-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add City Manually
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                            placeholder="Enter city name..."
                            value={manualCity}
                            onChange={(e) => setManualCity(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!manualCity.trim()) {
                                alert('Please enter a city name');
                                return;
                              }
                              setFormData(prev => ({ ...prev, city: manualCity, cityRegion: '' }));
                              setShowManualCity(false);
                              setManualCity('');
                            }}
                            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualCity(false);
                              setManualCity('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 5. City Region Field - MANUAL ENTRY ONLY */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. City Region - Optional
                </label>
                
                {!formData.city ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a city first
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {/* Manual input for region */}
                      <div>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                          placeholder="Enter region/area within the city (e.g., GRA, Lekki, Yaba)..."
                          value={formData.cityRegion}
                          onChange={(e) => setFormData(prev => ({ ...prev, cityRegion: e.target.value }))}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          This field is optional. Enter specific area within the city.
                        </p>
                      </div>

                      {/* Alternative: Add Region button */}
                      {!formData.cityRegion && (
                        <button
                          type="button"
                          onClick={() => setShowManualRegion(!showManualRegion)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#5D2A8B] hover:bg-[#5D2A8B]/10 rounded-lg border border-dashed border-[#5D2A8B]"
                        >
                          <Layers className="w-4 h-4" />
                          Add Region Manually
                        </button>
                      )}

                      {showManualRegion && (
                        <div className="p-4 border rounded-lg bg-blue-50">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Region for {formData.city}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                              placeholder="Enter region name..."
                              value={manualRegion}
                              onChange={(e) => setManualRegion(e.target.value)}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!manualRegion.trim()) {
                                  alert('Please enter a region name');
                                  return;
                                }
                                setFormData(prev => ({ ...prev, cityRegion: manualRegion }));
                                setShowManualRegion(false);
                                setManualRegion('');
                              }}
                              className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowManualRegion(false);
                                setManualRegion('');
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Summary */}
              {(formData.country || formData.stateProvince || formData.lga || formData.city || formData.cityRegion) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Selected Region Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.country && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">Country</span>
                        <span className="font-medium">{formData.country}</span>
                      </div>
                    )}
                    {formData.stateProvince && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">State/Province</span>
                        <span className="font-medium">{formData.stateProvince}</span>
                      </div>
                    )}
                    {formData.lga && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">LGA</span>
                        <span className="font-medium">{formData.lga}</span>
                      </div>
                    )}
                    {formData.city && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">City</span>
                        <span className="font-medium">{formData.city}</span>
                      </div>
                    )}
                    {formData.cityRegion && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">City Region</span>
                        <span className="font-medium">{formData.cityRegion}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updating || !formData.country || !formData.stateProvince || !formData.city}
              >
                {updating ? 'Updating...' : 'Update City Region'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCityRegionPage;