"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, MapPin, Building, Layers, Plus, Search, ChevronDown, DollarSign, Info } from 'lucide-react';
import CityRegionService from '@/services/cityRegionService';
import { Country, State, City } from 'country-state-city';

const CreateCityRegionPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  // Form states - using backend field names
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    lga: '',
    city: '',
  });

  // City regions array
  const [cityRegions, setCityRegions] = useState([
    { name: '', fee: 0 }
  ]);

  // Individual region form state
  const [regionForm, setRegionForm] = useState({
    name: '',
    fee: 0
  });

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      // For country name, we need to get country code first
      const country = countries.find(c => c.name === formData.country);
      if (country?.isoCode) {
        loadStates(country.isoCode);
      }
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        state: '', 
        lga: '', 
        city: '' 
      }));
      setShowManualState(false);
      setShowManualLGA(false);
      setShowManualCity(false);
    }
  }, [formData.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      // Get country code for loading cities
      const country = countries.find(c => c.name === formData.country);
      if (country?.isoCode) {
        // Get state code for loading cities
        const state = states.find(s => s.name === formData.state);
        if (state?.isoCode) {
          loadCities(country.isoCode, state.isoCode);
        }
      }
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        lga: '', 
        city: '' 
      }));
      setShowManualLGA(false);
      setShowManualCity(false);
    }
  }, [formData.state, formData.country, countries, states]);

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
    
    if (!formData.country || !formData.state || !formData.city) {
      alert('Please fill in all required fields (Country, State, City)');
      return;
    }
    
    // Validate city regions
    const validRegions = cityRegions.filter(region => region.name.trim() !== '');
    if (validRegions.length === 0) {
      alert('Please add at least one city region');
      return;
    }
    
    setLoading(true);

    try {
      // Create payload matching backend expectations
      const payload = {
        country: formData.country,
        state: formData.state,
        lga: formData.lga || '', // Send empty string if not provided
        city: formData.city,
        cityRegions: validRegions
      };

      console.log('Sending payload:', payload);
      
      // Prepare the payload with properly structured city regions
      const structuredPayload = {
        country: formData.country,
        state: formData.state,
        lga: formData.lga || '',
        city: formData.city,
        cityRegions: validRegions.map(region => ({
          name: region.name,
          fee: region.fee,
          description: '', // Add empty description to match interface
          isActive: true,
          _id: '', // Will be set by backend
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      };
      
      await CityRegionService.createCityRegion(structuredPayload);
      
      // Show success message and navigate
      setSuccessMessage('Location hierarchy created successfully');
      setShowSuccess(true);
      
      // Auto-navigate after showing success
      setTimeout(() => {
        router.push('/super-admin/subscription/city-region');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating location hierarchy:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to create location hierarchy');
      setShowSuccess(false); // Ensure success message is hidden on error
      alert(error.response?.data?.message || 'Failed to create location hierarchy');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Inline Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Success!</h3>
            <div className="mt-1 text-sm text-green-700">
              <p>{successMessage}</p>
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
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Add City Region</h1>
          </div>
          <p className="text-gray-600">Create a new city region for verified badge subscriptions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Form fields remain the same as before */}
              {/* 1. Country Field */}
              <div ref={countryRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
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
                                country: country.name,
                                state: '',
                                lga: '',
                                city: ''
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
                            country: manualCountry,
                            state: '',
                            lga: '',
                            city: ''
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

              
              <div ref={stateRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   State <span className="text-red-500">*</span>
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
                          {formData.state ? (
                            <span>{formData.state}</span>
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
                                    state: state.name,
                                    lga: '',
                                    city: ''
                                  });
                                  setStateDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.state === state.name ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{state.name}</div>
                                  {formData.state === state.name && (
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
                                state: manualState,
                                lga: '',
                                city: ''
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
                   LGA (Local Government Area) - Optional
                </label>
                
                {!formData.state ? (
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
                            Add LGA for {formData.state}
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
                   City <span className="text-red-500">*</span>
                </label>
                
                {!formData.state ? (
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
                                  setFormData(prev => ({ ...prev, city: city.name }));
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
                              setFormData(prev => ({ ...prev, city: manualCity }));
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
                  City Region - Optional
                </label>
                
                {!formData.city ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a city first
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">City Regions</h3>
                      <p className="text-gray-600 mb-4">Add one or more regions within this city with their associated fees</p>
                      
                      {/* Individual region form */}
                      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Region Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                              placeholder="e.g., Allen Avenue, Ikoyi, Yaba"
                              value={regionForm.name}
                              onChange={(e) => setRegionForm({...regionForm, name: e.target.value})}
                            />
                          </div>
                                                    
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fee (NGN) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="number"
                                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                                placeholder="5000"
                                value={regionForm.fee || ''}
                                onChange={(e) => setRegionForm({...regionForm, fee: Number(e.target.value)})}
                              />
                            </div>
                          </div>
                                                    
                        
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (!regionForm.name.trim()) {
                                alert('Please enter a region name');
                                return;
                              }
                              
                              // Add the new region to the list
                              setCityRegions([...cityRegions, { name: regionForm.name, fee: regionForm.fee }]);
                              
                              // Reset the form
                              setRegionForm({
                                name: '',
                                fee: 0
                              });
                            }}
                            className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                          >
                            Add Region
                          </button>
                        </div>
                      </div>
                      
                      {/* Display added regions */}
                      {cityRegions.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee (NGN)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {cityRegions.map((region, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{region.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{region.fee.toLocaleString()}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCityRegions(cityRegions.filter((_, i) => i !== index));
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              {(formData.country || formData.state || formData.lga || formData.city) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Selected Location Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.country && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">Country</span>
                        <span className="font-medium">{formData.country}</span>
                      </div>
                    )}
                    {formData.state && (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600">State</span>
                        <span className="font-medium">{formData.state}</span>
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
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !formData.country || !formData.state || !formData.city}
              >
                {loading ? 'Creating...' : 'Create Location Hierarchy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCityRegionPage;