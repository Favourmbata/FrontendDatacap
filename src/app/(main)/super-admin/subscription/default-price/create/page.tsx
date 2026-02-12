
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, AlertCircle, Globe, MapPin, Building, Plus, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DefaultPricingService, { DefaultPricingFormData } from '@/services/DefaultPricingService';
import { Country, State, City } from 'country-state-city';

interface CountryType {
  isoCode: string;
  name: string;
}

interface StateType {
  isoCode: string;
  name: string;
  countryCode: string;
}

interface CityType {
  name: string;
  countryCode: string;
  stateCode: string;
}

const CreateDefaultPricingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DefaultPricingFormData>({
    country: '',
    state: '',
    lga: '',
    city: '',
    defaultFee: 0,
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DefaultPricingFormData, string>>>({});
  const [apiError, setApiError] = useState<string>('');
  const [apiSuccess, setApiSuccess] = useState<string>('');
  const [level, setLevel] = useState<'country' | 'state' | 'lga' | 'city'>('country');

  const [manualCountry, setManualCountry] = useState(false);
  const [manualState, setManualState] = useState(false);
  const [manualLGA, setManualLGA] = useState(false);
  const [manualCity, setManualCity] = useState(false);
  
  
  const [manualCountryInput, setManualCountryInput] = useState('');
  const [manualStateInput, setManualStateInput] = useState('');
  const [manualLGAInput, setManualLGAInput] = useState('');
  const [manualCityInput, setManualCityInput] = useState('');

  const [countries, setCountries] = useState<CountryType[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [lgas, setLGAs] = useState<string[]>([]);

 
  useEffect(() => {
    fetchAllCountries();
  }, []);

  const fetchAllCountries = () => {
    try {
      const allCountries = Country.getAllCountries().map(country => ({
        isoCode: country.isoCode,
        name: country.name
      }));
      setCountries(allCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStatesByCountry = (countryCode: string) => {
    try {
      const countryStates = State.getStatesOfCountry(countryCode).map(state => ({
        isoCode: state.isoCode,
        name: state.name,
        countryCode: state.countryCode
      }));
      setStates(countryStates);
      setLGAs([]);
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    }
  };

  const fetchCitiesByState = (countryCode: string, stateCode: string) => {
    try {
      const stateCities = City.getCitiesOfState(countryCode, stateCode).map(city => ({
        name: city.name,
        countryCode: city.countryCode,
        stateCode: city.stateCode
      }));
      setCities(stateCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const getCountryCode = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.isoCode || '';
  };


  const getStateCode = (stateName: string, countryCode: string) => {
    const state = states.find(s => s.name === stateName && s.countryCode === countryCode);
    return state?.isoCode || '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'defaultFee') {
      const numValue = value === '' ? 0 : parseFloat(value) || 0;
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

   
    if (errors[name as keyof DefaultPricingFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }

    
    if (name === 'country' && value && !manualCountry) {
      const countryCode = getCountryCode(value);
      if (countryCode) {
        setFormData(prev => ({
          ...prev,
          state: '',
          lga: '',
          city: ''
        }));
        setManualState(false);
        setManualLGA(false);
        setManualCity(false);
        fetchStatesByCountry(countryCode);
      }
    } else if (name === 'state' && value && !manualState) {
      const countryCode = getCountryCode(formData.country);
      const stateCode = getStateCode(value, countryCode);
      if (countryCode && stateCode) {
        setFormData(prev => ({
          ...prev,
          lga: '',
          city: ''
        }));
        setManualLGA(false);
        setManualCity(false);
        fetchCitiesByState(countryCode, stateCode);
       
        const availableLGAs = getLGAs(formData.country, value);
        setLGAs(availableLGAs);
      }
    }
  };

  const handleManualToggle = (field: 'country' | 'state' | 'lga' | 'city') => {
    switch (field) {
      case 'country':
        setManualCountry(!manualCountry);
        if (!manualCountry) {
         
          setManualCountryInput('');
          setFormData(prev => ({ ...prev, country: '' }));
          setStates([]);
          setLGAs([]);
          setCities([]);
        } else {
       
          setFormData(prev => ({ ...prev, country: '' }));
        }
        break;
      case 'state':
        setManualState(!manualState);
        if (!manualState) {
          setManualStateInput('');
          setFormData(prev => ({ ...prev, state: '' }));
          setLGAs([]);
          setCities([]);
        }
        break;
      case 'lga':
        setManualLGA(!manualLGA);
        if (!manualLGA) {
          setManualLGAInput('');
          setFormData(prev => ({ ...prev, lga: '' }));
        }
        break;
      case 'city':
        setManualCity(!manualCity);
        if (!manualCity) {
          setManualCityInput('');
          setFormData(prev => ({ ...prev, city: '' }));
        }
        break;
    }
  };

  const handleManualInputChange = (field: 'country' | 'state' | 'lga' | 'city', value: string) => {
    switch (field) {
      case 'country':
        setManualCountryInput(value);
        setFormData(prev => ({ ...prev, country: value }));
        break;
      case 'state':
        setManualStateInput(value);
        setFormData(prev => ({ ...prev, state: value }));
        break;
      case 'lga':
        setManualLGAInput(value);
        setFormData(prev => ({ ...prev, lga: value }));
        break;
      case 'city':
        setManualCityInput(value);
        setFormData(prev => ({ ...prev, city: value }));
        break;
    }
  };

  const handleLevelChange = (newLevel: 'country' | 'state' | 'lga' | 'city') => {
    setLevel(newLevel);
    
    
    if (newLevel === 'country') {
      setFormData(prev => ({
        ...prev,
        state: '',
        lga: '',
        city: ''
      }));
      setManualState(false);
      setManualLGA(false);
      setManualCity(false);
    } else if (newLevel === 'state') {
      setFormData(prev => ({
        ...prev,
        lga: '',
        city: ''
      }));
      setManualLGA(false);
      setManualCity(false);
    } else if (newLevel === 'lga') {
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
      setManualCity(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DefaultPricingFormData, string>> = {};

    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (level === 'state' && !formData.state?.trim()) {
      newErrors.state = 'State is required for state-level pricing';
    }

    if (level === 'lga' && !formData.lga?.trim()) {
      newErrors.lga = 'LGA is required for LGA-level pricing';
    }

    if (level === 'city' && !formData.city?.trim()) {
      newErrors.city = 'City is required for city-level pricing';
    }

    if (formData.defaultFee <= 0) {
      newErrors.defaultFee = 'Default fee must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');
    setApiSuccess('');

    try {
  
      const submitData: DefaultPricingFormData = {
        country: formData.country,
        defaultFee: formData.defaultFee,
        description: formData.description || '',
        isActive: formData.isActive
      };

      if (level === 'state' && formData.state) {
        submitData.state = formData.state;
      } else if (level === 'lga' && formData.lga) {
        submitData.state = formData.state;
        submitData.lga = formData.lga;
      } else if (level === 'city' && formData.city) {
        submitData.state = formData.state;
        submitData.city = formData.city;
      }

      await DefaultPricingService.createDefaultPricing(submitData);
      
      setApiSuccess('Default pricing created successfully!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/super-admin/subscription/default-price');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating default pricing:', error);
      
      // Handle specific API error messages
      if (error.message.includes('Default fee must be a positive number')) {
        setApiError('Default fee must be a positive number');
      } else if (error.message.includes('already exists')) {
        setApiError('Default pricing already exists for this location combination');
      } else {
        setApiError(error.message || 'Failed to create default pricing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/super-admin/subscription/default-price');
  };

  const getLevelLabel = () => {
    switch (level) {
      case 'country': return 'Country Level Pricing';
      case 'state': return 'State Level Pricing';
      case 'lga': return 'LGA Level Pricing';
      case 'city': return 'City Level Pricing';
      default: return 'Default Pricing';
    }
  };


  const NairaSymbol = () => (
    <span className="font-bold">₦</span>
  );


  const getLGAs = (country: string, state: string) => {
    const lgaData: Record<string, Record<string, string[]>> = {
      'Nigeria': {
        'Lagos': ['Lagos Island', 'Lagos Mainland', 'Ikeja', 'Eti-Osa', 'Alimosho', 'Agege', 'Ajeromi-Ifelodun', 'Apapa', 'Badagry', 'Epe', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
        'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Okrika', 'Oyigbo', 'Abua-Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Ogba-Egbema-Ndoni', 'Ogu-Bolo', 'Omuma', 'Opobo-Nkoro', 'Tai'],
        'Oyo': ['Ibadan North', 'Ibadan South', 'Ogbomoso North', 'Ogbomoso South', 'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North East', 'Ibadan North West', 'Ibadan South East', 'Ibadan South West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogo Oluwa', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
        'Abuja': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
        'Kano': ['Kano Municipal', 'Dala', 'Fagge', 'Gwale', 'Kumbotso', 'Nassarawa', 'Tarauni', 'Ungogo', 'Bichi', 'Gaya', 'Kabo', 'Kiru', 'Madobi', 'Makoda', 'Rimin Gado', 'Shanono', 'Takai', 'Tofa', 'Tsanyawa', 'Warawa', 'Wudil']
      },
      'Ghana': {
        'Greater Accra': ['Accra Metropolitan', 'Tema Metropolitan', 'Ga Central', 'Ga East', 'Ga West', 'Ledzokuku', 'Ashaiman Municipal', 'Adenta Municipal', 'La Nkwantanang-Madina'],
        'Ashanti': ['Kumasi Metropolitan', 'Asokore Mampong Municipal', 'Oforikrom Municipal', 'Bosome Freho', 'Ejisu Municipal', 'Ejura Sekyedumase Municipal', 'Mampong Municipal', 'Obuasi Municipal'],
        'Western': ['Sekondi Takoradi Metropolitan', 'Ahanta West Municipal', 'Effia Kwesimintsim Municipal', 'Ellembelle', 'Jomoro', 'Mpohor', 'Prestea Huni-Valley Municipal', 'Shama', 'Tarkwa Nsuaem Municipal', 'Wassa Amenfi East Municipal']
      }
    };

    return lgaData[country]?.[state] || [];
  };


  useEffect(() => {
    if (formData.country && formData.state && !manualState) {
      const availableLGAs = getLGAs(formData.country, formData.state);
      setLGAs(availableLGAs);
    }
  }, [formData.country, formData.state, manualState]);

 
  const CustomDropdown = ({ 
    value, 
    onChange, 
    options, 
    placeholder, 
    error, 
    disabled,
    required = false 
  }: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => {
      if (!search) return options;
      return options.filter(option => 
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [options, search]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearch('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 text-sm text-left border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
          disabled={disabled}
        >
          {value || placeholder}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64">
            
            <div className="sticky top-0 p-2 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  placeholder={`Search ${placeholder.toLowerCase()}...`}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

           
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-[#5D2A8B]/10 ${value === option.value ? 'bg-[#5D2A8B]/20' : ''}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    <span className={`text-sm ${value === option.value ? 'text-[#5D2A8B] font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Default Pricing
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Default Pricing</h1>
              <p className="text-gray-600">Set default pricing for different location levels</p>
            </div>
          </div>
        </div>

        {/* Level Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Pricing Level</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => handleLevelChange('country')}
              className={`p-4 rounded-lg border-2 transition-all ${level === 'country' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full ${level === 'country' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
                  <Globe className={`w-6 h-6 ${level === 'country' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
                </div>
                <span className={`font-medium ${level === 'country' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>Country</span>
                <span className="text-xs text-gray-500 mt-1">Applies to entire country</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLevelChange('state')}
              className={`p-4 rounded-lg border-2 transition-all ${level === 'state' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full ${level === 'state' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
                  <MapPin className={`w-6 h-6 ${level === 'state' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
                </div>
                <span className={`font-medium ${level === 'state' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>State</span>
                <span className="text-xs text-gray-500 mt-1">Applies to specific state</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLevelChange('lga')}
              className={`p-4 rounded-lg border-2 transition-all ${level === 'lga' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full ${level === 'lga' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
                  <MapPin className={`w-6 h-6 ${level === 'lga' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
                </div>
                <span className={`font-medium ${level === 'lga' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>LGA</span>
                <span className="text-xs text-gray-500 mt-1">Applies to specific LGA</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLevelChange('city')}
              className={`p-4 rounded-lg border-2 transition-all ${level === 'city' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-2 rounded-full ${level === 'city' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
                  <Building className={`w-6 h-6 ${level === 'city' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
                </div>
                <span className={`font-medium ${level === 'city' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>City</span>
                <span className="text-xs text-gray-500 mt-1">Applies to specific city</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{getLevelLabel()}</h3>
            <p className="text-sm text-gray-600">
              Configure the default pricing for {level === 'country' ? 'the entire country' : 
              level === 'state' ? 'a specific state' : 
              level === 'lga' ? 'a specific LGA' : 'a specific city'}
            </p>
          </div>

    
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">{apiError}</p>
                  <p className="text-sm text-red-600 mt-1">Please check your input and try again.</p>
                </div>
              </div>
            </div>
          )}

          {apiSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">{apiSuccess}</p>
                  <p className="text-sm text-green-600 mt-1">Redirecting to default pricing list...</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
          
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <button
                  type="button"
                  onClick={() => handleManualToggle('country')}
                  className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                >
                  {manualCountry ? (
                    <>
                      <X className="w-3 h-3" />
                      Use dropdown
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      Add manually
                    </>
                  )}
                </button>
              </div>
              
              {manualCountry ? (
                <div>
                  <input
                    type="text"
                    value={manualCountryInput}
                    onChange={(e) => handleManualInputChange('country', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter country name"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the country name manually
                  </p>
                </div>
              ) : (
                <CustomDropdown
                  value={formData.country || ''} 
                  onChange={(value) => {
                    const event = {
                      target: { name: 'country', value }
                    } as React.ChangeEvent<HTMLSelectElement>;
                    handleInputChange(event);
                  }}
                  options={countries.map(c => ({ value: c.name, label: c.name }))}
                  placeholder="Select Country"
                  error={errors.country}
                  required
                />
              )}
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

           
            {level !== 'country' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('state')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.country && !manualCountry}
                  >
                    {manualState ? (
                      <>
                        <X className="w-3 h-3" />
                        Use dropdown
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add manually
                      </>
                    )}
                  </button>
                </div>
                
                {manualState ? (
                  <div>
                    <input
                      type="text"
                      value={manualStateInput}
                      onChange={(e) => handleManualInputChange('state', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter state name"
                      required
                      disabled={!formData.country && !manualCountry}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the state name manually
                    </p>
                  </div>
                ) : (
                  <CustomDropdown
                    value={formData.state || ''} 
                    onChange={(value) => {
                      const event = {
                        target: { name: 'state', value }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      handleInputChange(event);
                    }}
                    options={states.map(s => ({ value: s.name, label: s.name }))}
                    placeholder="Select State"
                    error={errors.state}
                    disabled={!formData.country && !manualCountry}
                    required={level === 'state' || level === 'lga' || level === 'city'}
                  />
                )}
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
                {!formData.country && !manualCountry && (
                  <p className="mt-1 text-sm text-gray-500">Select or enter a country first</p>
                )}
              </div>
            )}

           
            {level === 'lga' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LGA *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('lga')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.state && !manualState}
                  >
                    {manualLGA ? (
                      <>
                        <X className="w-3 h-3" />
                        Use dropdown
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add manually
                      </>
                    )}
                  </button>
                </div>
                
                {manualLGA ? (
                  <div>
                    <input
                      type="text"
                      value={manualLGAInput}
                      onChange={(e) => handleManualInputChange('lga', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.lga ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter LGA name"
                      required
                      disabled={!formData.state && !manualState}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the Local Government Area name manually
                    </p>
                  </div>
                ) : (
                  <CustomDropdown
                    value={formData.lga || ''} 
                    onChange={(value) => {
                      const event = {
                        target: { name: 'lga', value }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      handleInputChange(event);
                    }}
                    options={lgas.map(lga => ({ value: lga, label: lga }))}
                    placeholder="Select LGA"
                    error={errors.lga}
                    disabled={!formData.state && !manualState}
                    required
                  />
                )}
                {errors.lga && (
                  <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
                )}
                {!formData.state && !manualState && (
                  <p className="mt-1 text-sm text-gray-500">Select or enter a state first</p>
                )}
                {lgas.length === 0 && formData.state && !manualState && (
                  <p className="mt-1 text-xs text-yellow-600">
                    No LGAs found for this state. Please add manually or check state selection.
                  </p>
                )}
              </div>
            )}

            
            {level === 'city' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('city')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.state && !manualState}
                  >
                    {manualCity ? (
                      <>
                        <X className="w-3 h-3" />
                        Use dropdown
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add manually
                      </>
                    )}
                  </button>
                </div>
                
                {manualCity ? (
                  <div>
                    <input
                      type="text"
                      value={manualCityInput}
                      onChange={(e) => handleManualInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city name"
                      required
                      disabled={!formData.state && !manualState}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the city name manually
                    </p>
                  </div>
                ) : (
                  <CustomDropdown
                    value={formData.city || ''} 
                    onChange={(value) => {
                      const event = {
                        target: { name: 'city', value }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      handleInputChange(event);
                    }}
                    options={cities.map(c => ({ value: c.name, label: c.name }))}
                    placeholder="Select City"
                    error={errors.city}
                    disabled={!formData.state && !manualState}
                    required
                  />
                )}
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
                {!formData.state && !manualState && (
                  <p className="mt-1 text-sm text-gray-500">Select or enter a state first</p>
                )}
                {cities.length === 0 && formData.state && !manualState && (
                  <p className="mt-1 text-xs text-yellow-600">
                    No cities found for this state. Please add manually or check state selection.
                  </p>
                )}
              </div>
            )}

         
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Fee *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-700 font-medium"><NairaSymbol /></span>
                </div>
                <input
                  type="number"
                  name="defaultFee"
                  value={formData.defaultFee === 0 ? '' : formData.defaultFee}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                    errors.defaultFee ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter default fee"
                  required
                />
              </div>
              {errors.defaultFee && (
                <p className="mt-1 text-sm text-red-600">{errors.defaultFee}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter the default fee in NGN (<NairaSymbol />). This fee will be applied to all locations at this level.
              </p>
            </div>

           
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter an optional description for this default pricing"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Add a description to help identify this pricing rule
              </p>
            </div>

           
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-[#5D2A8B] border-gray-300 rounded focus:ring-[#5D2A8B]"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Activate this pricing immediately
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Inactive pricing will not be applied to new subscriptions.
              </p>
            </div>

         
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center px-6 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Default Pricing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

       
      </div>
    </div>
  );
};

export default CreateDefaultPricingPage;