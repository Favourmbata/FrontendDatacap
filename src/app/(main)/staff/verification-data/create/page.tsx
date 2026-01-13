"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Globe, MapPin, Building, User, ChevronDown, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Country, State, City } from 'country-state-city';

const CreateVerificationDataPage = () => {
  const router = useRouter();
  
  // Data states
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    lga: '',
    city: '',
    cityRegion: '',
    organisation: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for closing dropdowns
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
      loadStates(formData.country);
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        state: '', 
        lga: '', 
        city: '', 
        cityRegion: '' 
      }));
      setCities([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      loadCities(formData.country, formData.state);
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        city: '', 
        cityRegion: '' 
      }));
    }
  }, [formData.state, formData.country]);

  const loadCountries = () => {
    try {
      const data = Country.getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadStates = (countryCode: string) => {
    try {
      const data = State.getStatesOfCountry(countryCode);
      setStates(data || []);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadCities = (countryCode: string, stateCode: string) => {
    try {
      const data = City.getCitiesOfState(countryCode, stateCode);
      setCities(data || []);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.lga.trim()) newErrors.lga = 'LGA is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.cityRegion.trim()) newErrors.cityRegion = 'City Region is required';
    if (!formData.organisation.trim()) newErrors.organisation = 'Organisation is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Verification data created successfully!');
      router.push('/staff/verification-data');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/staff/verification-data');
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.isoCode.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
    state.isoCode.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectedCountry = countries.find(c => c.isoCode === formData.country);
  const selectedState = states.find(s => s.isoCode === formData.state);
  const selectedCity = cities.find(c => c.name === formData.city);

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

  // Mock LGAs - in real app, fetch from API
  const getMockLGAs = () => {
    const mockLGAs = {
      'LA': ['Ikeja', 'Alimosho', 'Kosofe', 'Mushin', 'Oshodi-Isolo', 'Shomolu'],
      'AB': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
      'RI': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Etche'],
    };
    
    return mockLGAs[formData.state as keyof typeof mockLGAs] || [];
  };

  const lgas = getMockLGAs();

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification Data
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Verification Data</h1>
            <p className="text-gray-600">Add new organization verification information</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Location Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Location Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Field */}
                <div ref={countryRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`w-full flex items-center justify-between p-2 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {selectedCountry ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{selectedCountry.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Select country...</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${countryDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {countryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                            <input
                              type="text"
                              placeholder="Search countries..."
                              className="w-full pl-8 pr-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        <div className="overflow-y-auto max-h-48">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.isoCode}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  country: country.isoCode,
                                  state: '',
                                  lga: '',
                                  city: '',
                                  cityRegion: '',
                                  organisation: formData.organisation,
                                  firstName: formData.firstName,
                                  lastName: formData.lastName
                                });
                                setCountryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
                                formData.country === country.isoCode ? 'bg-[#5D2A8B]/10' : ''
                              }`}
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm">{country.name}</div>
                                <div className="text-xs text-gray-500">{country.isoCode}</div>
                              </div>
                              {formData.country === country.isoCode && (
                                <div className="ml-auto w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>

                {/* State Field */}
                <div ref={stateRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  {!formData.country ? (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-sm text-center">
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
                          className={`w-full flex items-center justify-between p-2 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {selectedState ? (
                              <span className="text-sm">{selectedState.name}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Select state...</span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${stateDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>

                        {stateDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                                <input
                                  type="text"
                                  placeholder="Search states..."
                                  className="w-full pl-8 pr-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                  value={stateSearch}
                                  onChange={(e) => setStateSearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            <div className="overflow-y-auto max-h-48">
                              {filteredStates.map((state) => (
                                <button
                                  key={`${state.countryCode}-${state.isoCode}`}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      state: state.isoCode,
                                      lga: '',
                                      city: '',
                                      cityRegion: ''
                                    }));
                                    setStateDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                    formData.state === state.isoCode ? 'bg-[#5D2A8B]/10' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-sm">{state.name}</div>
                                      <div className="text-xs text-gray-500">{state.isoCode}</div>
                                    </div>
                                    {formData.state === state.isoCode && (
                                      <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </>
                  )}
                </div>

                {/* LGA Field - Manual input for now */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleInputChange}
                    placeholder="Enter LGA name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.lga ? 'border-red-500' : 'border-gray-300'
                    }`}
                    list="lga-options"
                  />
                  {lgas.length > 0 && (
                    <datalist id="lga-options">
                      {lgas.map((lga) => (
                        <option key={lga} value={lga} />
                      ))}
                    </datalist>
                  )}
                  {errors.lga && (
                    <p className="text-red-500 text-xs mt-1">{errors.lga}</p>
                  )}
                </div>

                {/* City Field */}
                <div ref={cityRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  {!formData.state ? (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-sm text-center">
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
                          className={`w-full flex items-center justify-between p-2 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Building className="w-4 h-4 text-gray-400" />
                            {selectedCity ? (
                              <span className="text-sm">{selectedCity.name}</span>
                            ) : (
                              <span className="text-gray-500 text-sm">Select city...</span>
                            )}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>

                        {cityDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                                <input
                                  type="text"
                                  placeholder="Search cities..."
                                  className="w-full pl-8 pr-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                  value={citySearch}
                                  onChange={(e) => setCitySearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            <div className="overflow-y-auto max-h-48">
                              {filteredCities.map((city) => (
                                <button
                                  key={`${city.countryCode}-${city.stateCode}-${city.name}`}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      city: city.name,
                                      cityRegion: ''
                                    }));
                                    setCityDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                    formData.city === city.name ? 'bg-[#5D2A8B]/10' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm">{city.name}</div>
                                    {formData.city === city.name && (
                                      <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </>
                  )}
                </div>

                {/* City Region Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City's Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cityRegion"
                    value={formData.cityRegion}
                    onChange={handleInputChange}
                    placeholder="Enter region within the city"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.cityRegion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cityRegion && (
                    <p className="text-red-500 text-xs mt-1">{errors.cityRegion}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Organization Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.organisation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.organisation && (
                    <p className="text-red-500 text-xs mt-1">{errors.organisation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* User Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center px-5 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Verification Data
            </button>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CreateVerificationDataPage;