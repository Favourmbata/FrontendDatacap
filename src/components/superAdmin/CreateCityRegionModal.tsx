"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, MapPin, Building, Layers, Plus, Search, ChevronDown, X } from 'lucide-react';
import CityRegionService from '@/services/cityRegionService';
import { Country, State, City } from 'country-state-city';

interface CityRegionFormData {
  countryCode: string;
  stateCode: string;
  lga: string;
  cityName: string;
  region: string;
}

interface CityRegion {
  id: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
  cityName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lga?: string;
  region?: string;
}

interface CreateCityRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  regionToEdit?: CityRegion;
}

const CreateCityRegionModal: React.FC<CreateCityRegionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  regionToEdit 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<CityRegionFormData>({
    countryCode: '',
    stateCode: '',
    lga: '',
    cityName: '',
    region: ''
  });

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [lgaDropdownOpen, setLgaDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [lgaSearch, setLgaSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  
  // Add more forms
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [showAddState, setShowAddState] = useState(false);
  const [newState, setNewState] = useState('');
  const [showAddLga, setShowAddLga] = useState(false);
  const [newLga, setNewLga] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [showAddRegion, setShowAddRegion] = useState(false);
  const [newRegion, setNewRegion] = useState('');

  // Refs for closing dropdowns on outside click
  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const lgaRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadCountries();
      
      // If editing, populate form with existing data
      if (regionToEdit) {
        setFormData({
          countryCode: regionToEdit.countryCode,
          stateCode: regionToEdit.stateCode,
          lga: regionToEdit.lga || '',
          cityName: regionToEdit.cityName,
          region: regionToEdit.region || ''
        });
      } else {
        // Reset form if creating new
        setFormData({
          countryCode: '',
          stateCode: '',
          lga: '',
          cityName: '',
          region: ''
        });
      }
    }
  }, [isOpen, regionToEdit]);

  // Load states when country changes
  useEffect(() => {
    if (formData.countryCode) {
      loadStates(formData.countryCode);
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        stateCode: '', 
        lga: '', 
        cityName: '', 
        region: '' 
      }));
      setLgas([]);
      setCities([]);
      setRegions([]);
    }
  }, [formData.countryCode]);

  // Load LGAs and cities when state changes
  useEffect(() => {
    if (formData.stateCode && formData.countryCode) {
      loadMockLGAs(formData.stateCode);
      loadCities(formData.countryCode, formData.stateCode);
      // Reset dependent fields
      setFormData(prev => ({ 
        ...prev, 
        lga: '', 
        cityName: '', 
        region: '' 
      }));
      setRegions([]);
    }
  }, [formData.stateCode, formData.countryCode]);

  // Load regions when city is selected
  useEffect(() => {
    if (formData.cityName) {
      loadMockRegions();
    }
  }, [formData.cityName]);

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

  const loadMockLGAs = (stateCode: string) => {
    // Mock LGAs - in real app, fetch from API
    const mockLGAs = {
      'LA': ['Ikeja', 'Alimosho', 'Kosofe', 'Mushin', 'Oshodi-Isolo', 'Shomolu'],
      'AB': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
      'RI': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Etche'],
    };
    
    setLgas(mockLGAs[stateCode as keyof typeof mockLGAs] || []);
  };

  const loadMockRegions = () => {
    // Mock regions - in real app, fetch from API
    const mockRegions = [
      'Lekki Phase 1',
      'Victoria Island',
      'Ikoyi',
      'Yaba',
      'Surulere',
      'GRA',
      'Central Business District',
      'Maitama',
      'Asokoro',
      'Wuse'
    ];
    
    setRegions(mockRegions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.countryCode || !formData.stateCode || !formData.cityName) {
      alert('Please fill in all required fields (Country, State, City)');
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        country: formData.countryCode,
        state: formData.stateCode,
        city: formData.cityName,
        lga: formData.lga,
        cityRegions: [{
          _id: '',
          name: formData.region,
          fee: 0, // Default fee, can be modified later
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      if (regionToEdit) {
        // Update existing region
        await CityRegionService.updateCityRegion(regionToEdit.id, payload);
      } else {
        // Create new region
        await CityRegionService.createCityRegion(payload);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving city region:', error);
      alert('Failed to save city region');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      countryCode: '',
      stateCode: '',
      lga: '',
      cityName: '',
      region: ''
    });
    setCountrySearch('');
    setStateSearch('');
    setLgaSearch('');
    setCitySearch('');
    setRegionSearch('');
    setShowAddCountry(false);
    setShowAddState(false);
    setShowAddLga(false);
    setShowAddCity(false);
    setShowAddRegion(false);
    setNewCountry('');
    setNewState('');
    setNewLga('');
    setNewCity('');
    setNewRegion('');
    setCountryDropdownOpen(false);
    setStateDropdownOpen(false);
    setLgaDropdownOpen(false);
    setCityDropdownOpen(false);
    setRegionDropdownOpen(false);
  };

  const handleAddNewCountry = () => {
    if (!newCountry.trim()) {
      alert('Please enter a country name');
      return;
    }
    
    const newCountryCode = newCountry.substring(0, 3).toUpperCase();
    
    setCountries(prev => [
      ...prev,
      {
        name: newCountry,
        isoCode: newCountryCode,
        flag: "🏳️"
      }
    ]);
    
    setFormData({
      countryCode: newCountryCode,
      stateCode: '',
      lga: '',
      cityName: '',
      region: ''
    });
    
    setShowAddCountry(false);
    setNewCountry('');
    alert(`Country "${newCountry}" added!`);
  };

  const handleAddNewState = () => {
    if (!newState.trim()) {
      alert('Please enter a state name');
      return;
    }
    
    const newStateCode = newState.substring(0, 2).toUpperCase();
    
    setStates(prev => [
      ...prev,
      {
        name: newState,
        isoCode: newStateCode,
        countryCode: formData.countryCode
      }
    ]);
    
    setFormData(prev => ({ ...prev, stateCode: newStateCode }));
    setShowAddState(false);
    setNewState('');
    alert(`State "${newState}" added!`);
  };

  const handleAddNewLga = () => {
    if (!newLga.trim()) {
      alert('Please enter an LGA name');
      return;
    }
    
    setLgas(prev => [...prev, newLga]);
    setFormData(prev => ({ ...prev, lga: newLga }));
    setShowAddLga(false);
    setNewLga('');
    alert(`LGA "${newLga}" added!`);
  };

  const handleAddNewCity = () => {
    if (!newCity.trim()) {
      alert('Please enter a city name');
      return;
    }
    
    setCities(prev => [
      ...prev,
      {
        name: newCity,
        stateCode: formData.stateCode,
        countryCode: formData.countryCode
      }
    ]);
    
    setFormData(prev => ({ ...prev, cityName: newCity }));
    setShowAddCity(false);
    setNewCity('');
    alert(`City "${newCity}" added!`);
  };

  const handleAddNewRegion = () => {
    if (!newRegion.trim()) {
      alert('Please enter a region name');
      return;
    }
    
    setRegions(prev => [...prev, newRegion]);
    setFormData(prev => ({ ...prev, region: newRegion }));
    setShowAddRegion(false);
    setNewRegion('');
    alert(`Region "${newRegion}" added!`);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    (country.isoCode && country.isoCode.toLowerCase().includes(countrySearch.toLowerCase()))
  );

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
    state.isoCode.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredLgas = lgas.filter(lga =>
    lga.toLowerCase().includes(lgaSearch.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredRegions = regions.filter(region =>
    region.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const selectedCountry = countries.find(c => c.isoCode === formData.countryCode);
  const selectedState = states.find(s => s.isoCode === formData.stateCode);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [countryRef, stateRef, lgaRef, cityRef, regionRef];
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === countryRef) setCountryDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === lgaRef) setLgaDropdownOpen(false);
          if (ref === cityRef) setCityDropdownOpen(false);
          if (ref === regionRef) setRegionDropdownOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1A1A1A]">
              {regionToEdit ? 'Edit City Region' : 'Add City Region'}
            </h2>
            <button 
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                      setLgaDropdownOpen(false);
                      setCityDropdownOpen(false);
                      setRegionDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      {selectedCountry ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{selectedCountry.flag || "🏳️"}</span>
                          <span>{selectedCountry.name} ({selectedCountry.isoCode})</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Select a country...</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${countryDropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
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
                                countryCode: country.isoCode,
                                stateCode: '',
                                lga: '',
                                cityName: '',
                                region: ''
                              });
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
                              formData.countryCode === country.isoCode ? 'bg-[#5D2A8B]/10' : ''
                            }`}
                          >
                            <span className="text-lg">{country.flag || "🏳️"}</span>
                            <div className="text-left">
                              <div className="font-medium">{country.name}</div>
                              <div className="text-xs text-gray-500">{country.isoCode}</div>
                            </div>
                            {formData.countryCode === country.isoCode && (
                              <div className="ml-auto w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                            )}
                          </button>
                        ))}
                        
                        {filteredCountries.length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-center">No countries found</div>
                        )}
                      </div>

                      <div className="border-t">
                        <button
                          type="button"
                          onClick={() => setShowAddCountry(true)}
                          className="w-full flex items-center gap-2 px-3 py-3 text-[#5D2A8B] hover:bg-[#5D2A8B]/10"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Country
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {showAddCountry && (
                  <div className="mt-3 p-4 border rounded-lg bg-blue-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add New Country
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                        placeholder="Enter country name..."
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCountry}
                        className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCountry(false);
                          setNewCountry('');
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
                
                {!formData.countryCode ? (
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
                          setLgaDropdownOpen(false);
                          setCityDropdownOpen(false);
                          setRegionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          {selectedState ? (
                            <span>{selectedState.name} ({selectedState.isoCode})</span>
                          ) : (
                            <span className="text-gray-500">Select state...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {stateDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
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
                                    stateCode: state.isoCode,
                                    lga: '',
                                    cityName: '',
                                    region: ''
                                  });
                                  setStateDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.stateCode === state.isoCode ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">{state.name}</div>
                                    <div className="text-xs text-gray-500">{state.isoCode}</div>
                                  </div>
                                  {formData.stateCode === state.isoCode && (
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

                          <div className="border-t">
                            <button
                              type="button"
                              onClick={() => setShowAddState(true)}
                              className="w-full flex items-center gap-2 px-3 py-3 text-[#5D2A8B] hover:bg-[#5D2A8B]/10"
                            >
                              <Plus className="w-4 h-4" />
                              Add New State
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {showAddState && (
                      <div className="mt-3 p-4 border rounded-lg bg-green-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add New State for {selectedCountry?.name}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter state name..."
                            value={newState}
                            onChange={(e) => setNewState(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddNewState}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddState(false);
                              setNewState('');
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

              {/* 3. LGA Field */}
              <div ref={lgaRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. LGA (Local Government Area)
                </label>
                
                {!formData.stateCode ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a state first
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setLgaDropdownOpen(!lgaDropdownOpen);
                          setCountryDropdownOpen(false);
                          setStateDropdownOpen(false);
                          setCityDropdownOpen(false);
                          setRegionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          {formData.lga ? (
                            <span>{formData.lga}</span>
                          ) : (
                            <span className="text-gray-500">Select LGA...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${lgaDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {lgaDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search LGAs..."
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                value={lgaSearch}
                                onChange={(e) => setLgaSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto max-h-60">
                            {filteredLgas.map((lga) => (
                              <button
                                key={lga}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, lga }));
                                  setLgaDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.lga === lga ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{lga}</div>
                                  {formData.lga === lga && (
                                    <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {filteredLgas.length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-center">
                                {lgas.length === 0 ? 'No LGAs found for this state' : 'No results match your search'}
                              </div>
                            )}
                          </div>

                          <div className="border-t">
                            <button
                              type="button"
                              onClick={() => setShowAddLga(true)}
                              className="w-full flex items-center gap-2 px-3 py-3 text-[#5D2A8B] hover:bg-[#5D2A8B]/10"
                            >
                              <Plus className="w-4 h-4" />
                              Add New LGA
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {showAddLga && (
                      <div className="mt-3 p-4 border rounded-lg bg-yellow-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add New LGA for {selectedState?.name}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Enter LGA name..."
                            value={newLga}
                            onChange={(e) => setNewLga(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddNewLga}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddLga(false);
                              setNewLga('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Enter manually if LGA doesn't exist
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 4. City Field */}
              <div ref={cityRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4. City <span className="text-red-500">*</span>
                </label>
                
                {!formData.stateCode ? (
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
                          setLgaDropdownOpen(false);
                          setRegionDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          {formData.cityName ? (
                            <span>{formData.cityName}</span>
                          ) : (
                            <span className="text-gray-500">Select city...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${cityDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {cityDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
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
                                  setFormData(prev => ({ ...prev, cityName: city.name, region: '' }));
                                  setCityDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.cityName === city.name ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{city.name}</div>
                                  {formData.cityName === city.name && (
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

                          <div className="border-t">
                            <button
                              type="button"
                              onClick={() => setShowAddCity(true)}
                              className="w-full flex items-center gap-2 px-3 py-3 text-[#5D2A8B] hover:bg-[#5D2A8B]/10"
                            >
                              <Plus className="w-4 h-4" />
                              Add New City
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {showAddCity && (
                      <div className="mt-3 p-4 border rounded-lg bg-purple-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add New City for {selectedState?.name}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter city name..."
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddNewCity}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddCity(false);
                              setNewCity('');
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

              {/* 5. City Region Field */}
              <div ref={regionRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. City Region (e.g., Lekki, VI, Yaba)
                </label>
                
                {!formData.cityName ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a city first
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setRegionDropdownOpen(!regionDropdownOpen);
                          setCountryDropdownOpen(false);
                          setStateDropdownOpen(false);
                          setLgaDropdownOpen(false);
                          setCityDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                      >
                        <div className="flex items-center gap-3">
                          <Layers className="w-5 h-5 text-gray-400" />
                          {formData.region ? (
                            <span>{formData.region}</span>
                          ) : (
                            <span className="text-gray-500">Select region...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${regionDropdownOpen ? 'transform rotate-180' : ''}`} />
                      </button>

                      {regionDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Search regions..."
                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                                value={regionSearch}
                                onChange={(e) => setRegionSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          <div className="overflow-y-auto max-h-60">
                            {filteredRegions.map((region) => (
                              <button
                                key={region}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, region }));
                                  setRegionDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
                                  formData.region === region ? 'bg-[#5D2A8B]/10' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{region}</div>
                                  {formData.region === region && (
                                    <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {filteredRegions.length === 0 && (
                              <div className="px-3 py-2 text-gray-500 text-center">
                                {regions.length === 0 ? 'No regions found for this city' : 'No results match your search'}
                              </div>
                            )}
                          </div>

                          <div className="border-t">
                            <button
                              type="button"
                              onClick={() => setShowAddRegion(true)}
                              className="w-full flex items-center gap-2 px-3 py-3 text-[#5D2A8B] hover:bg-[#5D2A8B]/10"
                            >
                              <Plus className="w-4 h-4" />
                              Add New Region
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {showAddRegion && (
                      <div className="mt-3 p-4 border rounded-lg bg-pink-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add New Region for {formData.cityName}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Enter region name (e.g., Lekki, VI, Yaba)..."
                            value={newRegion}
                            onChange={(e) => setNewRegion(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddNewRegion}
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddRegion(false);
                              setNewRegion('');
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

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !formData.countryCode || !formData.stateCode || !formData.cityName}
              >
                {loading ? (regionToEdit ? 'Updating...' : 'Creating...') : (regionToEdit ? 'Update City Region' : 'Create City Region')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCityRegionModal;