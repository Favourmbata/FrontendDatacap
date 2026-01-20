import React, { useState, useEffect, useRef } from "react";
import { Building, Globe, MapPin, Search, ChevronDown, Plus, Layers } from "lucide-react";
import { Country, State, City } from 'country-state-city';

interface LocationData {
  locationType: 'headquarters' | 'branch';
  brandName: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  cityRegionFee?: number;
  houseNumber: string;
  street: string;
  landmark?: string;
  buildingColor?: string;
  buildingType?: string;
  gallery: {
    images: string[];
    videos: string[];
  };
}

interface SearchableLocationFormProps {
  currentLocation: any;
  editingIndex: number | null;
  isEditingExistingLocation?: boolean; // Flag to distinguish between editing existing vs creating new
  handleLocationChange: (field: keyof LocationData, value: any) => void;
  handleAddLocation: () => void;
  handleAddMoreLocation: () => void;
  handleCancel: () => void;
  isProcessing: boolean;
  onAddAnotherLocation?: () => void;
  fieldErrors?: Record<string, string>;
}

const SearchableLocationForm: React.FC<SearchableLocationFormProps> = ({
  currentLocation,
  editingIndex,
  isEditingExistingLocation,
  handleLocationChange,
  handleAddLocation,
  handleAddMoreLocation,
  handleCancel,
  isProcessing,
  onAddAnotherLocation,
  fieldErrors
}) => {
  
  // State variables for dropdowns and search
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
    if (currentLocation?.country) {
      const country = countries.find(c => c.name === currentLocation.country);
      if (country?.isoCode) {
        loadStates(country.isoCode);
      }
    }
  }, [currentLocation?.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (currentLocation?.state && currentLocation?.country) {
      const country = countries.find(c => c.name === currentLocation.country);
      if (country?.isoCode) {
        const state = states.find(s => s.name === currentLocation.state);
        if (state?.isoCode) {
          loadCities(country.isoCode, state.isoCode);
        }
      }
    }
  }, [currentLocation?.state, currentLocation?.country, countries, states]);

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

  // Handler functions to update location data
  const updateLocationField = (field: keyof LocationData, value: any) => {
    handleLocationChange(field, value);
  };

  if (!currentLocation) return null;

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">
        {editingIndex !== null ? 'Edit Location' : 'Add New Location'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
          <select
            value={currentLocation.locationType}
            onChange={(e) => updateLocationField('locationType', e.target.value as 'headquarters' | 'branch')}
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
            value={currentLocation.brandName}
            onChange={(e) => updateLocationField('brandName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors?.brandName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter brand name"
          />
          {fieldErrors?.brandName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.brandName}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Country Field - Searchable Dropdown */}
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
              className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldErrors?.country ? 'border-red-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                {currentLocation.country ? (
                  <span>{currentLocation.country}</span>
                ) : (
                  <span className="text-gray-500">Select a country...</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${countryDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {fieldErrors?.country && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.country}</p>
            )}
            
            {countryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                        updateLocationField('country', country.name);
                        setCountryDropdownOpen(false);
                        setCountrySearch(''); // Clear search after selection
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
                        currentLocation.country === country.name ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{country.name}</div>
                      </div>
                      {currentLocation.country === country.name && (
                        <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></div>
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
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
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
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    updateLocationField('country', manualCountry);
                    setShowManualCountry(false);
                    setManualCountry('');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
        
        {/* State Field - Searchable Dropdown */}
        <div ref={stateRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province <span className="text-red-500">*</span>
          </label>
          
          {!currentLocation.country ? (
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
                  className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldErrors?.state ? 'border-red-500' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    {currentLocation.state ? (
                      <span>{currentLocation.state}</span>
                    ) : (
                      <span className="text-gray-500">Select state...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {fieldErrors?.state && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>
                )}
                
                {stateDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search states..."
                          className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                            updateLocationField('state', state.name);
                            setStateDropdownOpen(false);
                            setStateSearch(''); // Clear search after selection
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                            currentLocation.state === state.name ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{state.name}</div>
                            {currentLocation.state === state.name && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
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
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        updateLocationField('state', manualState);
                        setShowManualState(false);
                        setManualState('');
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* LGA Field - Manual Entry Only */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LGA (Local Government Area) - Optional
          </label>
          
          {!currentLocation.state ? (
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
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter LGA name (if applicable)..."
                    value={currentLocation.lga}
                    onChange={(e) => updateLocationField('lga', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This field is optional. Enter LGA if it exists for this location.
                  </p>
                </div>

                {/* Alternative: Add LGA button */}
                {!currentLocation.lga && (
                  <button
                    type="button"
                    onClick={() => setShowManualLGA(!showManualLGA)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
                  >
                    <Building className="w-4 h-4" />
                    Add LGA Manually
                  </button>
                )}

                {showManualLGA && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add LGA for {currentLocation.state}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          updateLocationField('lga', manualLGA);
                          setShowManualLGA(false);
                          setManualLGA('');
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
        
        {/* City Field - Searchable Dropdown */}
        <div ref={cityRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          
          {!currentLocation.state ? (
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
                  className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldErrors?.city ? 'border-red-500' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    {currentLocation.city ? (
                      <span>{currentLocation.city}</span>
                    ) : (
                      <span className="text-gray-500">Select city...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${cityDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {fieldErrors?.city && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
                )}
                
                {cityDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search cities..."
                          className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                            updateLocationField('city', city.name);
                            setCityDropdownOpen(false);
                            setCitySearch(''); // Clear search after selection
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                            currentLocation.city === city.name ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{city.name}</div>
                            {currentLocation.city === city.name && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
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
                      className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        updateLocationField('city', manualCity);
                        setShowManualCity(false);
                        setManualCity('');
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* City Region Field - Manual Entry Only */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City Region - Optional
          </label>
          
          {!currentLocation.city ? (
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
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter region/area within the city (e.g., GRA, Lekki, Yaba)..."
                    value={currentLocation.cityRegion}
                    onChange={(e) => updateLocationField('cityRegion', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This field is optional. Enter specific area within the city.
                  </p>
                </div>

                {/* Alternative: Add Region button */}
                {!currentLocation.cityRegion && (
                  <button
                    type="button"
                    onClick={() => setShowManualRegion(!showManualRegion)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
                  >
                    <Layers className="w-4 h-4" />
                    Add Region Manually
                  </button>
                )}

                {showManualRegion && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Region for {currentLocation.city}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          updateLocationField('cityRegion', manualRegion);
                          setShowManualRegion(false);
                          setManualRegion('');
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
          <input
            type="text"
            value={currentLocation.houseNumber}
            onChange={(e) => updateLocationField('houseNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors?.houseNumber ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="House Number"
          />
          {fieldErrors?.houseNumber && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.houseNumber}</p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
        <input
          type="text"
          value={currentLocation.street}
          onChange={(e) => updateLocationField('street', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${fieldErrors?.street ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Street Address"
        />
        {fieldErrors?.street && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.street}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
          <input
            type="text"
            value={currentLocation.landmark || ''}
            onChange={(e) => updateLocationField('landmark', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Nearby landmark or bus stop"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Building Color</label>
          <input
            type="text"
            value={currentLocation.buildingColor || ''}
            onChange={(e) => updateLocationField('buildingColor', e.target.value)}
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
            value={currentLocation.buildingType || ''}
            onChange={(e) => updateLocationField('buildingType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type of building"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City Region Fee</label>
          <input
            type="number"
            value={currentLocation.cityRegionFee || ''}
            onChange={(e) => updateLocationField('cityRegionFee', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Delivery/service fee for region"
          />
        </div>
      </div>
      
      {/* Gallery Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Gallery</label>
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Images</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(currentLocation.gallery?.images || []).map((image: string | File, index: number) => (
                <div key={index} className="relative">
                  {typeof image === 'string' ? (
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ) : (
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded border"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedImages = [...(currentLocation.gallery?.images || [])];
                      updatedImages.splice(index, 1);
                      updateLocationField('gallery', { 
                        ...currentLocation.gallery, 
                        images: updatedImages 
                      });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newImages = Array.from(e.target.files);
                    const updatedGallery = {
                      ...currentLocation.gallery,
                      images: [...(currentLocation.gallery?.images || []), ...newImages]
                    };
                    updateLocationField('gallery', updatedGallery);
                    // Reset the input so the same file can be selected again if needed
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Videos</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(currentLocation.gallery?.videos || []).map((video: string | File, index: number) => (
                <div key={index} className="relative">
                  {typeof video === 'string' && video.startsWith('http') ? (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border">
                      <span className="text-xs text-center">Video</span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border">
                      <span className="text-xs text-center">Video</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedVideos = [...(currentLocation.gallery?.videos || [])];
                      updatedVideos.splice(index, 1);
                      updateLocationField('gallery', { 
                        ...currentLocation.gallery, 
                        videos: updatedVideos 
                      });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const newVideos = Array.from(e.target.files);
                    const updatedGallery = {
                      ...currentLocation.gallery,
                      videos: [...(currentLocation.gallery?.videos || []), ...newVideos]
                    };
                    updateLocationField('gallery', updatedGallery);
                    // Reset the input so the same file can be selected again if needed
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              handleAddLocation();
            }}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg font-medium text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                Saving...
              </>
            ) : (isEditingExistingLocation ? 'Update Location' : 'Add Location')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchableLocationForm;