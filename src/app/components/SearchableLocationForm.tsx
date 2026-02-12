import React, { useState, useEffect, useRef } from "react";
import { Building, Globe, MapPin, Search, ChevronDown, Plus, Layers } from "lucide-react";

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
  statesForCountry?: any[];
  lgasForState?: any[];
  citiesForLga?: any[];
  cityRegionsForCity?: any[];
  loadingStates?: boolean;
  loadingLgas?: boolean;
  loadingCities?: boolean;
  loadingCityRegions?: boolean;
  // Functions for cascading dropdowns
  handleStateChange?: (countryName: string) => void;
  handleLgaChange?: (stateName: string) => void;
  handleCityChange?: (lga: string) => void;
  handleCityRegionChange?: (city: string) => void;
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
  fieldErrors,
  statesForCountry = [],
  lgasForState = [],
  citiesForLga = [],
  cityRegionsForCity = [],
  loadingStates = false,
  loadingLgas = false,
  loadingCities = false,
  loadingCityRegions = false,
  handleStateChange,
  handleLgaChange,
  handleCityChange,
  handleCityRegionChange
}) => {
  
  // State variables for dropdowns and search
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [lgas, setLgas] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [cityRegions, setCityRegions] = useState<any[]>([]);
  
  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [lgaDropdownOpen, setLgaDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [cityRegionDropdownOpen, setCityRegionDropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [lgaSearch, setLgaSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [cityRegionSearch, setCityRegionSearch] = useState('');
  
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
  const lgaRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const cityRegionRef = useRef<HTMLDivElement>(null);
  
  // Load initial data
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (currentLocation?.country) {
      loadStates(currentLocation.country);
    }
  }, [currentLocation?.country]);

  // Load LGAs when state changes
  useEffect(() => {
    if (currentLocation?.country && currentLocation?.state) {
      loadLGAs(currentLocation.country, currentLocation.state);
    }
  }, [currentLocation?.country, currentLocation?.state]);

  // Load cities when LGA changes
  useEffect(() => {
    if (currentLocation?.country && currentLocation?.state && currentLocation?.lga) {
      loadCities(currentLocation.country, currentLocation.state, currentLocation.lga);
    }
  }, [currentLocation?.country, currentLocation?.state, currentLocation?.lga]);

  // Load city regions when city changes
  useEffect(() => {
       console.log('=== CURRENT LOCATION PROPS CHANGED ===');
  console.log('Full currentLocation:', currentLocation);
  console.log('cityRegion:', currentLocation?.cityRegion);
  console.log('cityRegionFee:', currentLocation?.cityRegionFee);
    if (currentLocation?.country && currentLocation?.state && currentLocation?.lga && currentLocation?.city) {
      loadCityRegions(currentLocation.country, currentLocation.state, currentLocation.lga, currentLocation.city);
    }
  }, [currentLocation?.country, currentLocation?.state, currentLocation?.lga, currentLocation?.city]);



  const loadCountries = async () => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('../../services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const result = await httpService.getData<any>('/api/locations/countries');
      
      if (result.success) {
        // Convert country objects to the format expected by the component
        const countryObjects = result.data.countries.map((country: any) => ({
          name: typeof country === 'string' ? country : country.name,
          isoCode: (typeof country === 'string' ? country : country.name).substring(0, 2).toUpperCase()
        }));
        setCountries(countryObjects);
      } else {
        console.error('Failed to load countries:', result.message);
        setCountries([]); // Set to empty array if API call succeeds but returns no data
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]); // Set to empty array if API call fails
    }
  };

  const loadStates = async (countryName: string) => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('../../services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/states?country=${encodeURIComponent(countryName)}`);
      // Transform the response to extract just the state names
      const stateList = data.data?.states?.map((state: any) => typeof state === 'string' ? state : state.name) || [];
      setStates(stateList);
    } catch (error) {
      console.error('Error loading states:', error);
      setStates([]);
    }
  };

  const loadLGAs = async (countryName: string, stateName: string) => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('../../services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/lgas?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
      // Transform the response to extract just the LGA names
      const lgaList = data.data?.lgas?.map((lga: any) => typeof lga === 'string' ? lga : lga.name) || [];
      setLgas(lgaList);
    } catch (error) {
      console.error('Error loading LGAs:', error);
      setLgas([]);
    }
  };

  const loadCities = async (countryName: string, stateName: string, lgaName: string) => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('../../services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/cities?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}&lga=${encodeURIComponent(lgaName)}`);
      // Transform the response to extract just the city names
      const cityList = data.data?.cities?.map((city: any) => typeof city === 'string' ? city : city.name) || [];
      setCities(cityList);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  const loadCityRegions = async (countryName: string, stateName: string, lgaName: string, cityName: string) => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('../../services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/city-regions?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}&lga=${encodeURIComponent(lgaName)}&city=${encodeURIComponent(cityName)}`);
      // Transform the response to extract just the city region names and fees
      const regionList = data.data?.cityRegions?.map((region: any) => ({
        name: region.name || region,
        fee: region.fee,
        _id: region._id || region.name || region
      })) || [];
      setCityRegions(regionList);
    } catch (error) {
      console.error('Error loading city regions:', error);
      setCityRegions([]);
    }
  };

  // Note: We don't need loadStates and loadCities anymore since we're using the props passed from parent component
  // The parent component handles the cascading loading and passes the data as props

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    (country.isoCode && country.isoCode.toLowerCase().includes(countrySearch.toLowerCase()))
  );

  const filteredStates = (states).filter(state =>
    (typeof state === 'string' && state.toLowerCase().includes(stateSearch.toLowerCase())) ||
    (state.name && state.name.toLowerCase().includes(stateSearch.toLowerCase())) ||
    (state.isoCode && state.isoCode.toLowerCase().includes(stateSearch.toLowerCase()))
  );

  const filteredCities = (cities).filter(city =>
    (typeof city === 'string' && city.toLowerCase().includes(citySearch.toLowerCase())) ||
    (city.name && city.name.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const filteredLgas = (lgas).filter(lga =>
    (typeof lga === 'string' && lga.toLowerCase().includes(lgaSearch.toLowerCase())) ||
    (lga.name && lga.name.toLowerCase().includes(lgaSearch.toLowerCase()))
  );

  const filteredCityRegions = (cityRegions).filter(region =>
    (region.name && region.name.toLowerCase().includes(cityRegionSearch.toLowerCase()))
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [countryRef, stateRef, lgaRef, cityRef, cityRegionRef];
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === countryRef) setCountryDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === lgaRef) setLgaDropdownOpen(false);
          if (ref === cityRef) setCityDropdownOpen(false);
          if (ref === cityRegionRef) setCityRegionDropdownOpen(false);
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

  // Special handler to update multiple fields at once
  const updateMultipleLocationFields = (updates: Partial<LocationData>) => {
    Object.entries(updates).forEach(([field, value]) => {
      handleLocationChange(field as keyof LocationData, value);
    });
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
                        
                        // The useEffect will handle loading states for the selected country
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
                      {(filteredStates || []).map((state, index) => (
                        <button
                          key={`${currentLocation.country || 'country'}-${typeof state === 'string' ? state : state.name || index}`}
                          type="button"
                          onClick={() => {
                            const stateName = typeof state === 'string' ? state : state.name;
                            if (stateName) {
                              updateLocationField('state', stateName);
                              setStateDropdownOpen(false);
                              setStateSearch(''); // Clear search after selection
                              
                              // The useEffect will handle loading LGAs for the selected state
                            }
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                            currentLocation.state === (typeof state === 'string' ? state : state.name) ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{typeof state === 'string' ? state : state.name}</div>
                            {currentLocation.state === (typeof state === 'string' ? state : state.name) && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                      
                      {(filteredStates || []).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center">
                          {loadingStates ? 'Loading states...' : states.length === 0 ? 'No states found for this country' : 'No results match your search'}
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
        {/* LGA Field - Searchable Dropdown */}
        <div ref={lgaRef} className="relative">
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
                {/* Searchable dropdown for LGA */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setLgaDropdownOpen(!lgaDropdownOpen);
                      setCountryDropdownOpen(false);
                      setStateDropdownOpen(false);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldErrors?.lga ? 'border-red-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      {currentLocation.lga ? (
                        <span>{currentLocation.lga}</span>
                      ) : (
                        <span className="text-gray-500">Select LGA...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${lgaDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  {fieldErrors?.lga && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.lga}</p>
                  )}
                  
                  {lgaDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search LGAs..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={lgaSearch}
                            onChange={(e) => setLgaSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-60">
                        {(filteredLgas || []).map((lga, index) => (
                          <button
                            key={`${currentLocation.state || 'state'}-${typeof lga === 'string' ? lga : lga.name || index}`}
                            type="button"
                            onClick={() => {
                              const lgaName = typeof lga === 'string' ? lga : lga.name;
                              if (lgaName) {
                                updateLocationField('lga', lgaName);
                                setLgaDropdownOpen(false);
                                setLgaSearch(''); // Clear search after selection
                                
                                // The useEffect will handle loading cities for the selected LGA
                              }
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                              currentLocation.lga === (typeof lga === 'string' ? lga : lga.name) ? 'bg-purple-500/10' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{typeof lga === 'string' ? lga : lga.name}</div>
                              {currentLocation.lga === (typeof lga === 'string' ? lga : lga.name) && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                        
                        {(filteredLgas || []).length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-center">
                            {loadingLgas ? 'Loading LGAs...' : lgas.length === 0 ? 'No LGAs found for this state' : 'No results match your search'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This field is optional. Select LGA if it exists for this location.
                </p>

                {/* Alternative: Add LGA button */}
                <button
                  type="button"
                  onClick={() => setShowManualLGA(!showManualLGA)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
                >
                  <Building className="w-4 h-4" />
                  Add LGA Manually
                </button>

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
                      {(filteredCities || []).map((city, index) => (
                        <button
                          key={`${currentLocation.state || 'state'}-${typeof city === 'string' ? city : city.name || index}`}
                          type="button"
                          onClick={() => {
                            const cityName = typeof city === 'string' ? city : city.name;
                            if (cityName) {
                              updateLocationField('city', cityName);
                              setCityDropdownOpen(false);
                              setCitySearch(''); // Clear search after selection
                              
                              // The useEffect will handle loading city regions for the selected city
                            }
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                            currentLocation.city === (typeof city === 'string' ? city : city.name) ? 'bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{typeof city === 'string' ? city : city.name}</div>
                            {currentLocation.city === (typeof city === 'string' ? city : city.name) && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                      
                      {(cities || []).length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-center">
                          {loadingCities ? 'Loading cities...' : cities.length === 0 ? 'No cities found for this LGA' : 'No results match your search'}
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
        {/* City Region Field - Searchable Dropdown with Fees */}
        <div ref={cityRegionRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City Region with Fee - Optional
          </label>
          
          {!currentLocation.city ? (
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
                        setCityRegionDropdownOpen(!cityRegionDropdownOpen);
                        setCountryDropdownOpen(false);
                        setStateDropdownOpen(false);
                        setLgaDropdownOpen(false);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldErrors?.cityRegion ? 'border-red-500' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-gray-400" />
                        {currentLocation.cityRegion ? (
                          <span>{currentLocation.cityRegion} {currentLocation.cityRegionFee ? `(₦${currentLocation.cityRegionFee.toLocaleString()})` : ''}</span>
                        ) : (
                          <span className="text-gray-500">Select city region...</span>
                        )}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${cityRegionDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    {fieldErrors?.cityRegion && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.cityRegion}</p>
                    )}
                                    
                    {cityRegionDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search city regions..."
                              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                              value={cityRegionSearch}
                              onChange={(e) => setCityRegionSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                  
                        <div className="overflow-y-auto max-h-60">
                          {(filteredCityRegions || []).map((region) => (
                            <button
                              key={region._id}
                              type="button"
                              onClick={() => {
                                console.log('Selecting city region:', region.name, 'with fee:', region.fee);
                                // Update both fields together to ensure consistency
                                handleLocationChange('cityRegion', region.name);
                                setTimeout(() => {
                                  handleLocationChange('cityRegionFee', region.fee);
                                }, 0);
                                console.log('After updates - cityRegion:', currentLocation.cityRegion, 'cityRegionFee:', currentLocation.cityRegionFee);
                                setCityRegionDropdownOpen(false);
                                setCityRegionSearch(''); // Clear search after selection
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                currentLocation.cityRegion === region.name ? 'bg-purple-500/10' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{region.name} (₦{region.fee.toLocaleString()})</div>
                                {currentLocation.cityRegion === region.name && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          ))}
                                          
                          {(filteredCityRegions || []).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center">
                              {loadingCityRegions ? 'Loading city regions...' : cityRegions.length === 0 ? 'No city regions found for this city' : 'No results match your search'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    {loadingCityRegions ? 'Loading city regions...' : 'This field is optional. Select or enter region within the city.'}
                  </p>
                </div>

                {/* Show selected region fee if available */}
                {currentLocation.cityRegion && (cityRegions || []).some(r => (typeof r === 'string' ? r : r.name) === currentLocation.cityRegion) && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800">
                      Selected Region Fee: ₦{((cityRegions || []).find(r => (typeof r === 'string' ? r : r.name) === currentLocation.cityRegion)?.fee || 0).toLocaleString()}
                    </p>
                    <button 
                      type="button" 
                      className="text-xs text-blue-600 hover:underline mt-1"
                      onClick={() => {
                        // Auto-populate the fee when region is selected from the list
                        const selectedRegion = (cityRegions || []).find(r => (typeof r === 'string' ? r : r.name) === currentLocation.cityRegion);
                        if (selectedRegion) {
                          updateLocationField('cityRegionFee', selectedRegion.fee);
                        }
                      }}
                    >
                      Apply Fee Automatically
                    </button>
                  </div>
                )}

                {/* Alternative: Add Region button */}
                <button
                  type="button"
                  onClick={() => setShowManualRegion(!showManualRegion)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-500/10 rounded-lg border border-dashed border-purple-600"
                >
                  <Layers className="w-4 h-4" />
                  Add Region Manually
                </button>

                {showManualRegion && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Region for {currentLocation.city}
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                        placeholder="Enter region name..."
                        value={manualRegion}
                        onChange={(e) => setManualRegion(e.target.value)}
                        autoFocus
                      />
                      <input
                        type="number"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter fee..."
                        value={manualRegion ? currentLocation.cityRegionFee || '' : ''}
                        onChange={(e) => updateLocationField('cityRegionFee', Number(e.target.value))}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!manualRegion.trim()) {
                              alert('Please enter a region name');
                              return;
                            }
                            // Update both city region name and fee together
                            handleLocationChange('cityRegion', manualRegion);
                            // Set a default fee if none provided, otherwise keep the entered fee
                            const feeValue = currentLocation.cityRegionFee !== undefined && currentLocation.cityRegionFee !== null 
                              ? currentLocation.cityRegionFee 
                              : 0;
                            handleLocationChange('cityRegionFee', feeValue);
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