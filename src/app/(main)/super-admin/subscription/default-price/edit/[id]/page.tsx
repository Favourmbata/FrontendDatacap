// "use client";

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { ArrowLeft, Save, AlertCircle, Globe, MapPin, Building, Search, ChevronDown, Trash2, DollarSign } from 'lucide-react';
// import { useRouter, useParams } from 'next/navigation';
// import DefaultPricingService, { DefaultPricingFormData } from '@/services/DefaultPricingService';
// import { Country, State, City } from 'country-state-city';

// interface CountryType {
//   isoCode: string;
//   name: string;
// }

// interface StateType {
//   isoCode: string;
//   name: string;
//   countryCode: string;
// }

// interface CityType {
//   name: string;
//   countryCode: string;
//   stateCode: string;
// }

// const EditDefaultPricingPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const pricingId = params.id as string;
  
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [formData, setFormData] = useState<DefaultPricingFormData>({
//     country: '',
//     state: '',
//     lga: '',
//     city: '',
//     defaultFee: 0,
//     description: '',
//     isActive: true
//   });

//   const [errors, setErrors] = useState<Partial<Record<keyof DefaultPricingFormData, string>>>({});
//   const [apiError, setApiError] = useState<string>('');
//   const [apiSuccess, setApiSuccess] = useState<string>('');
//   const [level, setLevel] = useState<'country' | 'state' | 'lga' | 'city'>('country');
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   // Available options
//   const [countries, setCountries] = useState<CountryType[]>([]);
//   const [states, setStates] = useState<StateType[]>([]);
//   const [cities, setCities] = useState<CityType[]>([]);
//   const [lgas, setLGAs] = useState<string[]>([]);

//   // Manual entry modes
//   const [manualCountry, setManualCountry] = useState(false);
//   const [manualState, setManualState] = useState(false);
//   const [manualLGA, setManualLGA] = useState(false);
//   const [manualCity, setManualCity] = useState(false);
  
//   // Manual entry values
//   const [manualCountryInput, setManualCountryInput] = useState('');
//   const [manualStateInput, setManualStateInput] = useState('');
//   const [manualLGAInput, setManualLGAInput] = useState('');
//   const [manualCityInput, setManualCityInput] = useState('');

//   // Dropdown states
//   const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
//   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
//   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
//   const [lgaDropdownOpen, setLGADropdownOpen] = useState(false);
  
//   // Search states
//   const [countrySearch, setCountrySearch] = useState('');
//   const [stateSearch, setStateSearch] = useState('');
//   const [citySearch, setCitySearch] = useState('');
//   const [lgaSearch, setLGASearch] = useState('');

//   // Refs for closing dropdowns on outside click
//   const countryRef = useRef<HTMLDivElement>(null);
//   const stateRef = useRef<HTMLDivElement>(null);
//   const cityRef = useRef<HTMLDivElement>(null);
//   const lgaRef = useRef<HTMLDivElement>(null);

//   // Fetch all countries on mount
//   useEffect(() => {
//     fetchAllCountries();
//   }, []);

//   // Fetch pricing data on mount
//   useEffect(() => {
//     if (pricingId) {
//       fetchPricingData();
//     }
//   }, [pricingId]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const refs = [countryRef, stateRef, cityRef, lgaRef];
//       refs.forEach(ref => {
//         if (ref.current && !ref.current.contains(event.target as Node)) {
//           if (ref === countryRef) setCountryDropdownOpen(false);
//           if (ref === stateRef) setStateDropdownOpen(false);
//           if (ref === cityRef) setCityDropdownOpen(false);
//           if (ref === lgaRef) setLGADropdownOpen(false);
//         }
//       });
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchAllCountries = () => {
//     try {
//       const allCountries = Country.getAllCountries().map(country => ({
//         isoCode: country.isoCode,
//         name: country.name
//       }));
//       setCountries(allCountries);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   const fetchPricingData = async () => {
//     try {
//       setLoading(true);
//       const pricing = await DefaultPricingService.getDefaultPricingById(pricingId);

//       // Set form data from fetched pricing
//       const newFormData: DefaultPricingFormData = {
//         country: pricing.country,
//         state: pricing.state || '',
//         lga: pricing.lga || '',
//         city: pricing.city || '',
//         defaultFee: pricing.defaultFee,
//         description: pricing.description || '',
//         isActive: pricing.isActive
//       };

//       setFormData(newFormData);

//       // Determine level based on data
//       if (pricing.city) {
//         setLevel('city');
//         fetchStatesByCountry(pricing.country);
//         fetchCitiesByState(pricing.country, pricing.state || '');
//         if (pricing.lga) {
//           fetchLGAs(pricing.country, pricing.state || '');
//         }
//       } else if (pricing.lga) {
//         setLevel('lga');
//         fetchStatesByCountry(pricing.country);
//         fetchLGAs(pricing.country, pricing.state || '');
//       } else if (pricing.state) {
//         setLevel('state');
//         fetchStatesByCountry(pricing.country);
//       } else {
//         setLevel('country');
//       }

//     } catch (error: any) {
//       console.error('Error fetching pricing data:', error);
//       setApiError(error.message || 'Failed to load pricing data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStatesByCountry = (countryName: string) => {
//     try {
//       const country = countries.find(c => c.name === countryName);
//       if (country?.isoCode) {
//         const countryStates = State.getStatesOfCountry(country.isoCode).map(state => ({
//           isoCode: state.isoCode,
//           name: state.name,
//           countryCode: state.countryCode
//         }));
//         setStates(countryStates);
//         return countryStates;
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       setStates([]);
//     }
//     return [];
//   };

//   const fetchCitiesByState = (countryName: string, stateName: string) => {
//     try {
//       const country = countries.find(c => c.name === countryName);
//       const state = states.find(s => s.name === stateName);
      
//       if (country?.isoCode && state?.isoCode) {
//         const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode).map(city => ({
//           name: city.name,
//           countryCode: city.countryCode,
//           stateCode: city.stateCode
//         }));
//         setCities(stateCities);
//       }
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//       setCities([]);
//     }
//   };

//   const fetchLGAs = (country: string, state: string) => {
//     const lgaData: Record<string, Record<string, string[]>> = {
//       'Nigeria': {
//         'Lagos': ['Lagos Island', 'Lagos Mainland', 'Ikeja', 'Eti-Osa', 'Alimosho', 'Agege', 'Ajeromi-Ifelodun', 'Apapa', 'Badagry', 'Epe', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
//         'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Okrika', 'Oyigbo', 'Abua-Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Ogba-Egbema-Ndoni', 'Ogu-Bolo', 'Omuma', 'Opobo-Nkoro', 'Tai'],
//         'Oyo': ['Ibadan North', 'Ibadan South', 'Ogbomoso North', 'Ogbomoso South', 'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North East', 'Ibadan North West', 'Ibadan South East', 'Ibadan South West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogo Oluwa', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
//         'Abuja': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
//         'Kano': ['Kano Municipal', 'Dala', 'Fagge', 'Gwale', 'Kumbotso', 'Nassarawa', 'Tarauni', 'Ungogo', 'Bichi', 'Gaya', 'Kabo', 'Kiru', 'Madobi', 'Makoda', 'Rimin Gado', 'Shanono', 'Takai', 'Tofa', 'Tsanyawa', 'Warawa', 'Wudil']
//       },
//       'Ghana': {
//         'Greater Accra': ['Accra Metropolitan', 'Tema Metropolitan', 'Ga Central', 'Ga East', 'Ga West', 'Ledzokuku', 'Ashaiman Municipal', 'Adenta Municipal', 'La Nkwantanang-Madina'],
//         'Ashanti': ['Kumasi Metropolitan', 'Asokore Mampong Municipal', 'Oforikrom Municipal', 'Bosome Freho', 'Ejisu Municipal', 'Ejura Sekyedumase Municipal', 'Mampong Municipal', 'Obuasi Municipal'],
//         'Western': ['Sekondi Takoradi Metropolitan', 'Ahanta West Municipal', 'Effia Kwesimintsim Municipal', 'Ellembelle', 'Jomoro', 'Mpohor', 'Prestea Huni-Valley Municipal', 'Shama', 'Tarkwa Nsuaem Municipal', 'Wassa Amenfi East Municipal']
//       }
//     };

//     const availableLGAs = lgaData[country]?.[state] || [];
//     setLGAs(availableLGAs);
//     return availableLGAs;
//   };

//   // Get country code from country name
//   const getCountryCode = (countryName: string) => {
//     const country = countries.find(c => c.name === countryName);
//     return country?.isoCode || '';
//   };

//   // Get state code from state name and country code
//   const getStateCode = (stateName: string, countryCode: string) => {
//     const state = states.find(s => s.name === stateName && s.countryCode === countryCode);
//     return state?.isoCode || '';
//   };

//   const handleCountrySelect = (countryName: string) => {
//     setFormData(prev => ({
//       ...prev,
//       country: countryName,
//       state: '',
//       lga: '',
//       city: ''
//     }));
//     setCountryDropdownOpen(false);
    
//     if (countryName) {
//       fetchStatesByCountry(countryName);
//       setManualCountry(false);
//     }
//   };

//   const handleStateSelect = (stateName: string) => {
//     setFormData(prev => ({
//       ...prev,
//       state: stateName,
//       lga: '',
//       city: ''
//     }));
//     setStateDropdownOpen(false);
    
//     if (stateName && formData.country) {
//       fetchCitiesByState(formData.country, stateName);
//       fetchLGAs(formData.country, stateName);
//       setManualState(false);
//     }
//   };

//   const handleLGASelect = (lgaName: string) => {
//     setFormData(prev => ({
//       ...prev,
//       lga: lgaName
//     }));
//     setLGADropdownOpen(false);
//     setManualLGA(false);
//   };

//   const handleCitySelect = (cityName: string) => {
//     setFormData(prev => ({
//       ...prev,
//       city: cityName
//     }));
//     setCityDropdownOpen(false);
//     setManualCity(false);
//   };

//   const handleManualToggle = (field: 'country' | 'state' | 'lga' | 'city') => {
//     switch (field) {
//       case 'country':
//         setManualCountry(!manualCountry);
//         if (!manualCountry) {
//           setManualCountryInput('');
//         }
//         break;
//       case 'state':
//         setManualState(!manualState);
//         if (!manualState) {
//           setManualStateInput('');
//         }
//         break;
//       case 'lga':
//         setManualLGA(!manualLGA);
//         if (!manualLGA) {
//           setManualLGAInput('');
//         }
//         break;
//       case 'city':
//         setManualCity(!manualCity);
//         if (!manualCity) {
//           setManualCityInput('');
//         }
//         break;
//     }
//   };

//   const handleManualInputChange = (field: 'country' | 'state' | 'lga' | 'city', value: string) => {
//     switch (field) {
//       case 'country':
//         setManualCountryInput(value);
//         setFormData(prev => ({ ...prev, country: value, state: '', lga: '', city: '' }));
//         setStates([]);
//         setLGAs([]);
//         setCities([]);
//         break;
//       case 'state':
//         setManualStateInput(value);
//         setFormData(prev => ({ ...prev, state: value, lga: '', city: '' }));
//         setLGAs([]);
//         setCities([]);
//         break;
//       case 'lga':
//         setManualLGAInput(value);
//         setFormData(prev => ({ ...prev, lga: value }));
//         break;
//       case 'city':
//         setManualCityInput(value);
//         setFormData(prev => ({ ...prev, city: value }));
//         break;
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'defaultFee') {
//       const numValue = value === '' ? 0 : parseFloat(value) || 0;
//       setFormData({
//         ...formData,
//         [name]: numValue
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }

//     // Clear error for this field
//     if (errors[name as keyof DefaultPricingFormData]) {
//       setErrors({
//         ...errors,
//         [name]: undefined
//       });
//     }
//   };

//   const handleLevelChange = (newLevel: 'country' | 'state' | 'lga' | 'city') => {
//     setLevel(newLevel);
    
//     // Reset lower level fields when moving to a higher level
//     if (newLevel === 'country') {
//       setFormData(prev => ({
//         ...prev,
//         state: '',
//         lga: '',
//         city: ''
//       }));
//     } else if (newLevel === 'state') {
//       setFormData(prev => ({
//         ...prev,
//         lga: '',
//         city: ''
//       }));
//     } else if (newLevel === 'lga') {
//       setFormData(prev => ({
//         ...prev,
//         city: ''
//       }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof DefaultPricingFormData, string>> = {};

//     if (!formData.country?.trim()) {
//       newErrors.country = 'Country is required';
//     }

//     if (level === 'state' && !formData.state?.trim()) {
//       newErrors.state = 'State is required for state-level pricing';
//     }

//     if (level === 'lga' && !formData.lga?.trim()) {
//       newErrors.lga = 'LGA is required for LGA-level pricing';
//     }

//     if (level === 'city' && !formData.city?.trim()) {
//       newErrors.city = 'City is required for city-level pricing';
//     }

//     if (formData.defaultFee <= 0) {
//       newErrors.defaultFee = 'Default fee must be a positive number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setUpdating(true);
//     setApiError('');
//     setApiSuccess('');

//     try {
//       // Prepare data based on selected level
//       const submitData: Partial<DefaultPricingFormData> = {
//         country: formData.country,
//         defaultFee: formData.defaultFee,
//         description: formData.description || '',
//         isActive: formData.isActive
//       };

//       if (level === 'state' && formData.state) {
//         submitData.state = formData.state;
//       } else if (level === 'lga' && formData.lga) {
//         submitData.state = formData.state;
//         submitData.lga = formData.lga;
//       } else if (level === 'city' && formData.city) {
//         submitData.state = formData.state;
//         submitData.city = formData.city;
//       }

//       await DefaultPricingService.updateDefaultPricing(pricingId, submitData);
      
//       setSuccessMessage('Default pricing updated successfully!');
//       setShowSuccessModal(true);
      
//     } catch (error: any) {
//       console.error('Error updating default pricing:', error);
      
//       // Handle specific API error messages
//       if (error.message.includes('Default fee must be a positive number')) {
//         setApiError('Default fee must be a positive number');
//       } else if (error.message.includes('already exists')) {
//         setApiError('Default pricing already exists for this location combination');
//       } else {
//         setApiError(error.message || 'Failed to update default pricing. Please try again.');
//       }
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSuccessModalClose = () => {
//     setShowSuccessModal(false);
//     router.push('/super-admin/subscription/default-price');
//   };

//   const handleDeleteClick = () => {
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     setDeleting(true);
//     try {
//       const success = await DefaultPricingService.deleteDefaultPricing(pricingId);
//       if (success) {
//         setSuccessMessage('Default pricing deleted successfully!');
//         setShowSuccessModal(true);
//       } else {
//         setApiError('Failed to delete default pricing');
//       }
//     } catch (error: any) {
//       console.error('Error deleting default pricing:', error);
//       setApiError(error.message || 'Failed to delete default pricing');
//     } finally {
//       setDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false);
//   };

//   const handleBack = () => {
//     router.push('/super-admin/subscription/default-price');
//   };

//   const getLevelLabel = () => {
//     switch (level) {
//       case 'country': return 'Country Level Pricing';
//       case 'state': return 'State Level Pricing';
//       case 'lga': return 'LGA Level Pricing';
//       case 'city': return 'City Level Pricing';
//       default: return 'Default Pricing';
//     }
//   };

//   // Filter functions for dropdowns
//   const filteredCountries = useMemo(() => 
//     countries.filter(country =>
//       country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
//       country.isoCode.toLowerCase().includes(countrySearch.toLowerCase())
//     ),
//     [countries, countrySearch]
//   );

//   const filteredStates = useMemo(() => 
//     states.filter(state =>
//       state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
//       state.isoCode.toLowerCase().includes(stateSearch.toLowerCase())
//     ),
//     [states, stateSearch]
//   );

//   const filteredCities = useMemo(() => 
//     cities.filter(city =>
//       city.name.toLowerCase().includes(citySearch.toLowerCase())
//     ),
//     [cities, citySearch]
//   );

//   const filteredLGAs = useMemo(() => 
//     lgas.filter(lga =>
//       lga.toLowerCase().includes(lgaSearch.toLowerCase())
//     ),
//     [lgas, lgaSearch]
//   );

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const NairaSymbol = () => (
//     <span className="font-bold">₦</span>
//   );

//   if (loading) {
//     return (
//       <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//             <div className="animate-pulse space-y-6">
//               <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               <div className="space-y-4">
//                 <div className="h-10 bg-gray-200 rounded"></div>
//                 <div className="h-10 bg-gray-200 rounded"></div>
//                 <div className="h-10 bg-gray-200 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope { font-family: 'Manrope', sans-serif; }
//       `}</style>

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="absolute inset-0 bg-transparent" onClick={handleSuccessModalClose}></div>
//           <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
//               <p className="text-gray-600 mb-6">{successMessage}</p>
//               <button
//                 onClick={handleSuccessModalClose}
//                 className="w-full bg-[#5D2A8B] text-white py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
//               >
//                 Continue
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="absolute inset-0 bg-black bg-opacity-25" onClick={handleDeleteCancel}></div>
//           <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                 <Trash2 className="w-8 h-8 text-red-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Default Pricing</h3>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete this default pricing? This action cannot be undone.
//               </p>
//               <div className="flex gap-3 w-full">
//                 <button
//                   onClick={handleDeleteCancel}
//                   className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
//                   disabled={deleting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
//                   disabled={deleting}
//                 >
//                   {deleting ? 'Deleting...' : 'Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <button
//             onClick={handleBack}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Default Pricing
//           </button>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Default Pricing</h1>
//               <p className="text-gray-600">Update default pricing for different location levels</p>
//             </div>
          
//           </div>
//         </div>

//         {/* Level Selection */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Level</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <button
//               type="button"
//               onClick={() => handleLevelChange('country')}
//               className={`p-4 rounded-lg border-2 transition-all ${level === 'country' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className={`p-2 rounded-full ${level === 'country' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
//                   <Globe className={`w-6 h-6 ${level === 'country' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
//                 </div>
//                 <span className={`font-medium ${level === 'country' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>Country</span>
//                 <span className="text-xs text-gray-500 mt-1">Applies to entire country</span>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() => handleLevelChange('state')}
//               className={`p-4 rounded-lg border-2 transition-all ${level === 'state' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className={`p-2 rounded-full ${level === 'state' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
//                   <MapPin className={`w-6 h-6 ${level === 'state' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
//                 </div>
//                 <span className={`font-medium ${level === 'state' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>State</span>
//                 <span className="text-xs text-gray-500 mt-1">Applies to specific state</span>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() => handleLevelChange('lga')}
//               className={`p-4 rounded-lg border-2 transition-all ${level === 'lga' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className={`p-2 rounded-full ${level === 'lga' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
//                   <MapPin className={`w-6 h-6 ${level === 'lga' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
//                 </div>
//                 <span className={`font-medium ${level === 'lga' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>LGA</span>
//                 <span className="text-xs text-gray-500 mt-1">Applies to specific LGA</span>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() => handleLevelChange('city')}
//               className={`p-4 rounded-lg border-2 transition-all ${level === 'city' ? 'border-[#5D2A8B] bg-[#5D2A8B]/10' : 'border-gray-200 hover:border-gray-300'}`}
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className={`p-2 rounded-full ${level === 'city' ? 'bg-[#5D2A8B]/20' : 'bg-gray-100'} mb-2`}>
//                   <Building className={`w-6 h-6 ${level === 'city' ? 'text-[#5D2A8B]' : 'text-gray-500'}`} />
//                 </div>
//                 <span className={`font-medium ${level === 'city' ? 'text-[#5D2A8B]' : 'text-gray-700'}`}>City</span>
//                 <span className="text-xs text-gray-500 mt-1">Applies to specific city</span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="mb-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">{getLevelLabel()}</h3>
//               <div className="flex items-center gap-2">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {formData.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600">
//               Update the default pricing for {level === 'country' ? 'the entire country' : 
//               level === 'state' ? 'a specific state' : 
//               level === 'lga' ? 'a specific LGA' : 'a specific city'}
//             </p>
//           </div>

//           {/* API Error Messages */}
//           {apiError && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
//                 <div>
//                   <p className="text-sm font-medium text-red-800">{apiError}</p>
//                   <p className="text-sm text-red-600 mt-1">Please check your input and try again.</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Country Field */}
//             <div ref={countryRef} className="relative mb-6">
//               <div className="flex items-center justify-between mb-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Country *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => handleManualToggle('country')}
//                   className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
//                 >
//                   {manualCountry ? 'Use dropdown' : 'Add manually'}
//                 </button>
//               </div>
              
//               {manualCountry ? (
//                 <div>
//                   <input
//                     type="text"
//                     value={manualCountryInput || formData.country}
//                     onChange={(e) => handleManualInputChange('country', e.target.value)}
//                     className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                       errors.country ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter country name"
//                     required
//                   />
//                 </div>
//               ) : (
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setCountryDropdownOpen(!countryDropdownOpen);
//                       setStateDropdownOpen(false);
//                       setLGADropdownOpen(false);
//                       setCityDropdownOpen(false);
//                     }}
//                     className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Globe className="w-5 h-5 text-gray-400" />
//                       {formData.country ? (
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">🌍</span>
//                           <span>{formData.country}</span>
//                         </div>
//                       ) : (
//                         <span className="text-gray-500">Select a country...</span>
//                       )}
//                     </div>
//                     <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${countryDropdownOpen ? 'transform rotate-180' : ''}`} />
//                   </button>

//                   {countryDropdownOpen && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
//                       <div className="p-2 border-b">
//                         <div className="relative">
//                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                           <input
//                             type="text"
//                             placeholder="Search countries..."
//                             className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
//                             value={countrySearch}
//                             onChange={(e) => setCountrySearch(e.target.value)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </div>
//                       </div>

//                       <div className="overflow-y-auto max-h-60">
//                         {filteredCountries.map((country) => (
//                           <button
//                             key={country.isoCode}
//                             type="button"
//                             onClick={() => handleCountrySelect(country.name)}
//                             className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 ${
//                               formData.country === country.name ? 'bg-[#5D2A8B]/10' : ''
//                             }`}
//                           >
//                             <span className="text-lg">🌍</span>
//                             <div className="text-left">
//                               <div className="font-medium">{country.name}</div>
//                             </div>
//                             {formData.country === country.name && (
//                               <div className="ml-auto w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
//                             )}
//                           </button>
//                         ))}
                        
//                         {filteredCountries.length === 0 && (
//                           <div className="px-3 py-2 text-gray-500 text-center">No countries found</div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {errors.country && (
//                 <p className="mt-1 text-sm text-red-600">{errors.country}</p>
//               )}
//             </div>

//             {/* State Field */}
//             {level !== 'country' && (
//               <div ref={stateRef} className="relative mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     State *
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => handleManualToggle('state')}
//                     className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
//                     disabled={!formData.country}
//                   >
//                     {manualState ? 'Use dropdown' : 'Add manually'}
//                   </button>
//                 </div>
                
//                 {!formData.country ? (
//                   <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
//                     Please select a country first
//                   </div>
//                 ) : manualState ? (
//                   <div>
//                     <input
//                       type="text"
//                       value={manualStateInput || formData.state}
//                       onChange={(e) => handleManualInputChange('state', e.target.value)}
//                       className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                         errors.state ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter state name"
//                       required
//                     />
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setStateDropdownOpen(!stateDropdownOpen);
//                         setCountryDropdownOpen(false);
//                         setLGADropdownOpen(false);
//                         setCityDropdownOpen(false);
//                       }}
//                       className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
//                     >
//                       <div className="flex items-center gap-3">
//                         <MapPin className="w-5 h-5 text-gray-400" />
//                         {formData.state ? (
//                           <span>{formData.state}</span>
//                         ) : (
//                           <span className="text-gray-500">Select state...</span>
//                         )}
//                       </div>
//                       <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${stateDropdownOpen ? 'transform rotate-180' : ''}`} />
//                     </button>

//                     {stateDropdownOpen && (
//                       <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
//                         <div className="p-2 border-b">
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               placeholder="Search states..."
//                               className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
//                               value={stateSearch}
//                               onChange={(e) => setStateSearch(e.target.value)}
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                         </div>

//                         <div className="overflow-y-auto max-h-60">
//                           {filteredStates.map((state) => (
//                             <button
//                               key={`${state.countryCode}-${state.isoCode}`}
//                               type="button"
//                               onClick={() => handleStateSelect(state.name)}
//                               className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
//                                 formData.state === state.name ? 'bg-[#5D2A8B]/10' : ''
//                               }`}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="font-medium">{state.name}</div>
//                                 {formData.state === state.name && (
//                                   <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
//                                 )}
//                               </div>
//                             </button>
//                           ))}
                          
//                           {filteredStates.length === 0 && (
//                             <div className="px-3 py-2 text-gray-500 text-center">
//                               {states.length === 0 ? 'No states found for this country' : 'No results match your search'}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {errors.state && (
//                   <p className="mt-1 text-sm text-red-600">{errors.state}</p>
//                 )}
//               </div>
//             )}

//             {/* LGA Field */}
//             {level === 'lga' && (
//               <div ref={lgaRef} className="relative mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     LGA *
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => handleManualToggle('lga')}
//                     className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
//                     disabled={!formData.state}
//                   >
//                     {manualLGA ? 'Use dropdown' : 'Add manually'}
//                   </button>
//                 </div>
                
//                 {!formData.state ? (
//                   <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
//                     Please select a state first
//                   </div>
//                 ) : manualLGA ? (
//                   <div>
//                     <input
//                       type="text"
//                       value={manualLGAInput || formData.lga}
//                       onChange={(e) => handleManualInputChange('lga', e.target.value)}
//                       className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                         errors.lga ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter LGA name"
//                       required
//                     />
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setLGADropdownOpen(!lgaDropdownOpen);
//                         setCountryDropdownOpen(false);
//                         setStateDropdownOpen(false);
//                         setCityDropdownOpen(false);
//                       }}
//                       className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
//                     >
//                       <div className="flex items-center gap-3">
//                         <MapPin className="w-5 h-5 text-gray-400" />
//                         {formData.lga ? (
//                           <span>{formData.lga}</span>
//                         ) : (
//                           <span className="text-gray-500">Select LGA...</span>
//                         )}
//                       </div>
//                       <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${lgaDropdownOpen ? 'transform rotate-180' : ''}`} />
//                     </button>

//                     {lgaDropdownOpen && (
//                       <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
//                         <div className="p-2 border-b">
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               placeholder="Search LGAs..."
//                               className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
//                               value={lgaSearch}
//                               onChange={(e) => setLGASearch(e.target.value)}
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                         </div>

//                         <div className="overflow-y-auto max-h-60">
//                           {filteredLGAs.map((lga) => (
//                             <button
//                               key={lga}
//                               type="button"
//                               onClick={() => handleLGASelect(lga)}
//                               className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
//                                 formData.lga === lga ? 'bg-[#5D2A8B]/10' : ''
//                               }`}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="font-medium">{lga}</div>
//                                 {formData.lga === lga && (
//                                   <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
//                                 )}
//                               </div>
//                             </button>
//                           ))}
                          
//                           {filteredLGAs.length === 0 && (
//                             <div className="px-3 py-2 text-gray-500 text-center">
//                               {lgas.length === 0 ? 'No LGAs found for this state' : 'No results match your search'}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {errors.lga && (
//                   <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
//                 )}
//                 {lgas.length === 0 && formData.state && !manualState && !manualLGA && (
//                   <p className="mt-1 text-xs text-yellow-600">
//                     No LGAs found for this state. Please add manually.
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* City Field */}
//             {level === 'city' && (
//               <div ref={cityRef} className="relative mb-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     City *
//                   </label>
//                   <button
//                     type="button"
//                     onClick={() => handleManualToggle('city')}
//                     className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
//                     disabled={!formData.state}
//                   >
//                     {manualCity ? 'Use dropdown' : 'Add manually'}
//                   </button>
//                 </div>
                
//                 {!formData.state ? (
//                   <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
//                     Please select a state first
//                   </div>
//                 ) : manualCity ? (
//                   <div>
//                     <input
//                       type="text"
//                       value={manualCityInput || formData.city}
//                       onChange={(e) => handleManualInputChange('city', e.target.value)}
//                       className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                         errors.city ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter city name"
//                       required
//                     />
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setCityDropdownOpen(!cityDropdownOpen);
//                         setCountryDropdownOpen(false);
//                         setStateDropdownOpen(false);
//                         setLGADropdownOpen(false);
//                       }}
//                       className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
//                     >
//                       <div className="flex items-center gap-3">
//                         <Building className="w-5 h-5 text-gray-400" />
//                         {formData.city ? (
//                           <span>{formData.city}</span>
//                         ) : (
//                           <span className="text-gray-500">Select city...</span>
//                         )}
//                       </div>
//                       <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${cityDropdownOpen ? 'transform rotate-180' : ''}`} />
//                     </button>

//                     {cityDropdownOpen && (
//                       <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
//                         <div className="p-2 border-b">
//                           <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                             <input
//                               type="text"
//                               placeholder="Search cities..."
//                               className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
//                               value={citySearch}
//                               onChange={(e) => setCitySearch(e.target.value)}
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </div>
//                         </div>

//                         <div className="overflow-y-auto max-h-60">
//                           {filteredCities.map((city) => (
//                             <button
//                               key={`${city.countryCode}-${city.stateCode}-${city.name}`}
//                               type="button"
//                               onClick={() => handleCitySelect(city.name)}
//                               className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${
//                                 formData.city === city.name ? 'bg-[#5D2A8B]/10' : ''
//                               }`}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="font-medium">{city.name}</div>
//                                 {formData.city === city.name && (
//                                   <div className="w-2 h-2 bg-[#5D2A8B] rounded-full"></div>
//                                 )}
//                               </div>
//                             </button>
//                           ))}
                          
//                           {filteredCities.length === 0 && (
//                             <div className="px-3 py-2 text-gray-500 text-center">
//                               {cities.length === 0 ? 'No cities found for this state' : 'No results match your search'}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {errors.city && (
//                   <p className="mt-1 text-sm text-red-600">{errors.city}</p>
//                 )}
//                 {cities.length === 0 && formData.state && !manualState && !manualCity && (
//                   <p className="mt-1 text-xs text-yellow-600">
//                     No cities found for this state. Please add manually.
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Default Fee */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Default Fee *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-700 font-medium"><NairaSymbol /></span>
//                 </div>
//                 <input
//                   type="number"
//                   name="defaultFee"
//                   value={formData.defaultFee === 0 ? '' : formData.defaultFee}
//                   onChange={handleInputChange}
//                   min="0"
//                   step="1"
//                   className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                     errors.defaultFee ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter default fee"
//                   required
//                 />
//               </div>
//               {errors.defaultFee && (
//                 <p className="mt-1 text-sm text-red-600">{errors.defaultFee}</p>
//               )}
//               <p className="mt-1 text-sm text-gray-500">
//                 Enter the default fee in NGN (<NairaSymbol />). This fee will be applied to all locations at this level.
//               </p>
//             </div>

//             {/* Description */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description (Optional)
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
//                   errors.description ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter an optional description for this default pricing"
//               />
//               <p className="mt-1 text-sm text-gray-500">
//                 Optional: Add a description to help identify this pricing rule
//               </p>
//             </div>

//             {/* Status */}
//             <div className="mb-8">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                   className="h-4 w-4 text-[#5D2A8B] border-gray-300 rounded focus:ring-[#5D2A8B]"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">
//                   Activate this pricing immediately
//                 </span>
//               </label>
//               <p className="mt-1 text-sm text-gray-500">
//                 Inactive pricing will not be applied to new subscriptions.
//               </p>
//             </div>

//             {/* Form Actions */}
//             <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 disabled={updating}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={updating}
//                 className="flex items-center justify-center px-6 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors disabled:opacity-50"
//               >
//                 {updating ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     Update Default Pricing
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>

       
//       </div>
//     </div>
//   );
// };

// export default EditDefaultPricingPage;


"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Save, AlertCircle, Globe, MapPin, Building, Search, ChevronDown, DollarSign } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
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

const EditDefaultPricingPage = () => {
  const router = useRouter();
  const params = useParams();
  const pricingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  // Available options
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [lgas, setLGAs] = useState<string[]>([]);

  // Manual entry modes
  const [manualCountry, setManualCountry] = useState(false);
  const [manualState, setManualState] = useState(false);
  const [manualLGA, setManualLGA] = useState(false);
  const [manualCity, setManualCity] = useState(false);
  
  // Manual entry values
  const [manualCountryInput, setManualCountryInput] = useState('');
  const [manualStateInput, setManualStateInput] = useState('');
  const [manualLGAInput, setManualLGAInput] = useState('');
  const [manualCityInput, setManualCityInput] = useState('');

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [lgaDropdownOpen, setLGADropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [lgaSearch, setLGASearch] = useState('');

  // Refs for closing dropdowns on outside click
  const countryRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const lgaRef = useRef<HTMLDivElement>(null);

  // Fetch all countries on mount
  useEffect(() => {
    fetchAllCountries();
  }, []);

  // Fetch pricing data on mount
  useEffect(() => {
    if (pricingId) {
      fetchPricingData();
    }
  }, [pricingId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [countryRef, stateRef, cityRef, lgaRef];
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === countryRef) setCountryDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === cityRef) setCityDropdownOpen(false);
          if (ref === lgaRef) setLGADropdownOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const pricing = await DefaultPricingService.getDefaultPricingById(pricingId);

      // Set form data from fetched pricing
      const newFormData: DefaultPricingFormData = {
        country: pricing.country,
        state: pricing.state || '',
        lga: pricing.lga || '',
        city: pricing.city || '',
        defaultFee: pricing.defaultFee,
        description: pricing.description || '',
        isActive: pricing.isActive
      };

      setFormData(newFormData);

      // Determine level based on data
      if (pricing.city) {
        setLevel('city');
        fetchStatesByCountry(pricing.country);
        fetchCitiesByState(pricing.country, pricing.state || '');
        if (pricing.lga) {
          fetchLGAs(pricing.country, pricing.state || '');
        }
      } else if (pricing.lga) {
        setLevel('lga');
        fetchStatesByCountry(pricing.country);
        fetchLGAs(pricing.country, pricing.state || '');
      } else if (pricing.state) {
        setLevel('state');
        fetchStatesByCountry(pricing.country);
      } else {
        setLevel('country');
      }

    } catch (error: any) {
      console.error('Error fetching pricing data:', error);
      setApiError(error.message || 'Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatesByCountry = (countryName: string) => {
    try {
      const country = countries.find(c => c.name === countryName);
      if (country?.isoCode) {
        const countryStates = State.getStatesOfCountry(country.isoCode).map(state => ({
          isoCode: state.isoCode,
          name: state.name,
          countryCode: state.countryCode
        }));
        setStates(countryStates);
        return countryStates;
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    }
    return [];
  };

  const fetchCitiesByState = (countryName: string, stateName: string) => {
    try {
      const country = countries.find(c => c.name === countryName);
      const state = states.find(s => s.name === stateName);
      
      if (country?.isoCode && state?.isoCode) {
        const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode).map(city => ({
          name: city.name,
          countryCode: city.countryCode,
          stateCode: city.stateCode
        }));
        setCities(stateCities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const fetchLGAs = (country: string, state: string) => {
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

    const availableLGAs = lgaData[country]?.[state] || [];
    setLGAs(availableLGAs);
    return availableLGAs;
  };

  // Get country code from country name
  const getCountryCode = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country?.isoCode || '';
  };

  // Get state code from state name and country code
  const getStateCode = (stateName: string, countryCode: string) => {
    const state = states.find(s => s.name === stateName && s.countryCode === countryCode);
    return state?.isoCode || '';
  };

  const handleCountrySelect = (countryName: string) => {
    setFormData(prev => ({
      ...prev,
      country: countryName,
      state: '',
      lga: '',
      city: ''
    }));
    setCountryDropdownOpen(false);
    
    if (countryName) {
      fetchStatesByCountry(countryName);
      setManualCountry(false);
    }
  };

  const handleStateSelect = (stateName: string) => {
    setFormData(prev => ({
      ...prev,
      state: stateName,
      lga: '',
      city: ''
    }));
    setStateDropdownOpen(false);
    
    if (stateName && formData.country) {
      fetchCitiesByState(formData.country, stateName);
      fetchLGAs(formData.country, stateName);
      setManualState(false);
    }
  };

  const handleLGASelect = (lgaName: string) => {
    setFormData(prev => ({
      ...prev,
      lga: lgaName
    }));
    setLGADropdownOpen(false);
    setManualLGA(false);
  };

  const handleCitySelect = (cityName: string) => {
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
    setCityDropdownOpen(false);
    setManualCity(false);
  };

  const handleManualToggle = (field: 'country' | 'state' | 'lga' | 'city') => {
    switch (field) {
      case 'country':
        setManualCountry(!manualCountry);
        if (!manualCountry) {
          setManualCountryInput('');
        }
        break;
      case 'state':
        setManualState(!manualState);
        if (!manualState) {
          setManualStateInput('');
        }
        break;
      case 'lga':
        setManualLGA(!manualLGA);
        if (!manualLGA) {
          setManualLGAInput('');
        }
        break;
      case 'city':
        setManualCity(!manualCity);
        if (!manualCity) {
          setManualCityInput('');
        }
        break;
    }
  };

  const handleManualInputChange = (field: 'country' | 'state' | 'lga' | 'city', value: string) => {
    switch (field) {
      case 'country':
        setManualCountryInput(value);
        setFormData(prev => ({ ...prev, country: value, state: '', lga: '', city: '' }));
        setStates([]);
        setLGAs([]);
        setCities([]);
        break;
      case 'state':
        setManualStateInput(value);
        setFormData(prev => ({ ...prev, state: value, lga: '', city: '' }));
        setLGAs([]);
        setCities([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Clear error for this field
    if (errors[name as keyof DefaultPricingFormData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleLevelChange = (newLevel: 'country' | 'state' | 'lga' | 'city') => {
    setLevel(newLevel);
    
    // Reset lower level fields when moving to a higher level
    if (newLevel === 'country') {
      setFormData(prev => ({
        ...prev,
        state: '',
        lga: '',
        city: ''
      }));
    } else if (newLevel === 'state') {
      setFormData(prev => ({
        ...prev,
        lga: '',
        city: ''
      }));
    } else if (newLevel === 'lga') {
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
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

    setUpdating(true);
    setApiError('');
    setApiSuccess('');

    try {
      // Prepare data based on selected level
      const submitData: Partial<DefaultPricingFormData> = {
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

      await DefaultPricingService.updateDefaultPricing(pricingId, submitData);
      
      setApiSuccess('Default pricing updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setApiSuccess('');
      }, 3000);

    } catch (error: any) {
      console.error('Error updating default pricing:', error);
      
      if (error.message.includes('Default fee must be a positive number')) {
        setApiError('Default fee must be a positive number');
      } else if (error.message.includes('already exists')) {
        setApiError('Default pricing already exists for this location combination');
      } else {
        setApiError(error.message || 'Failed to update default pricing. Please try again.');
      }
    } finally {
      setUpdating(false);
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

  // Filter functions for dropdowns
  const filteredCountries = useMemo(() => 
    countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.isoCode.toLowerCase().includes(countrySearch.toLowerCase())
    ),
    [countries, countrySearch]
  );

  const filteredStates = useMemo(() => 
    states.filter(state =>
      state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
      state.isoCode.toLowerCase().includes(stateSearch.toLowerCase())
    ),
    [states, stateSearch]
  );

  const filteredCities = useMemo(() => 
    cities.filter(city =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    ),
    [cities, citySearch]
  );

  const filteredLGAs = useMemo(() => 
    lgas.filter(lga =>
      lga.toLowerCase().includes(lgaSearch.toLowerCase())
    ),
    [lgas, lgaSearch]
  );

  const NairaSymbol = () => (
    <span className="font-bold">₦</span>
  );

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Default Pricing
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Default Pricing</h1>
            <p className="text-gray-600">Update default pricing for different location levels</p>
          </div>
        </div>

        {/* Level Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Level</h3>
          
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

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getLevelLabel()}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Update the default pricing for {level === 'country' ? 'the entire country' : 
              level === 'state' ? 'a specific state' : 
              level === 'lga' ? 'a specific LGA' : 'a specific city'}
            </p>
          </div>

          {/* Inline Success Message */}
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
                </div>
              </div>
            </div>
          )}

          {/* API Error Messages */}
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

          <form onSubmit={handleSubmit}>
            {/* Country Field */}
            <div ref={countryRef} className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <button
                  type="button"
                  onClick={() => handleManualToggle('country')}
                  className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                >
                  {manualCountry ? 'Use dropdown' : 'Add manually'}
                </button>
              </div>
              
              {manualCountry ? (
                <div>
                  <input
                    type="text"
                    value={manualCountryInput || formData.country}
                    onChange={(e) => handleManualInputChange('country', e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter country name"
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setCountryDropdownOpen(!countryDropdownOpen);
                      setStateDropdownOpen(false);
                      setLGADropdownOpen(false);
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
                            onClick={() => handleCountrySelect(country.name)}
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
              )}
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* State Field */}
            {level !== 'country' && (
              <div ref={stateRef} className="relative mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('state')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.country}
                  >
                    {manualState ? 'Use dropdown' : 'Add manually'}
                  </button>
                </div>
                
                {!formData.country ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a country first
                  </div>
                ) : manualState ? (
                  <div>
                    <input
                      type="text"
                      value={manualStateInput || formData.state}
                      onChange={(e) => handleManualInputChange('state', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter state name"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setStateDropdownOpen(!stateDropdownOpen);
                        setCountryDropdownOpen(false);
                        setLGADropdownOpen(false);
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
                              onClick={() => handleStateSelect(state.name)}
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
                )}
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
            )}

            {/* LGA Field */}
            {level === 'lga' && (
              <div ref={lgaRef} className="relative mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LGA *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('lga')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.state}
                  >
                    {manualLGA ? 'Use dropdown' : 'Add manually'}
                  </button>
                </div>
                
                {!formData.state ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a state first
                  </div>
                ) : manualLGA ? (
                  <div>
                    <input
                      type="text"
                      value={manualLGAInput || formData.lga}
                      onChange={(e) => handleManualInputChange('lga', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.lga ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter LGA name"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setLGADropdownOpen(!lgaDropdownOpen);
                        setCountryDropdownOpen(false);
                        setStateDropdownOpen(false);
                        setCityDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {formData.lga ? (
                          <span>{formData.lga}</span>
                        ) : (
                          <span className="text-gray-500">Select LGA...</span>
                        )}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${lgaDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {lgaDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search LGAs..."
                              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5D2A8B]"
                              value={lgaSearch}
                              onChange={(e) => setLGASearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        <div className="overflow-y-auto max-h-60">
                          {filteredLGAs.map((lga) => (
                            <button
                              key={lga}
                              type="button"
                              onClick={() => handleLGASelect(lga)}
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
                          
                          {filteredLGAs.length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-center">
                              {lgas.length === 0 ? 'No LGAs found for this state' : 'No results match your search'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {errors.lga && (
                  <p className="mt-1 text-sm text-red-600">{errors.lga}</p>
                )}
                {lgas.length === 0 && formData.state && !manualState && !manualLGA && (
                  <p className="mt-1 text-xs text-yellow-600">
                    No LGAs found for this state. Please add manually.
                  </p>
                )}
              </div>
            )}

            {/* City Field */}
            {level === 'city' && (
              <div ref={cityRef} className="relative mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleManualToggle('city')}
                    className="flex items-center gap-1 text-xs text-[#5D2A8B] hover:text-[#4a216d]"
                    disabled={!formData.state}
                  >
                    {manualCity ? 'Use dropdown' : 'Add manually'}
                  </button>
                </div>
                
                {!formData.state ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                    Please select a state first
                  </div>
                ) : manualCity ? (
                  <div>
                    <input
                      type="text"
                      value={manualCityInput || formData.city}
                      onChange={(e) => handleManualInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city name"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setCityDropdownOpen(!cityDropdownOpen);
                        setCountryDropdownOpen(false);
                        setStateDropdownOpen(false);
                        setLGADropdownOpen(false);
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
                              onClick={() => handleCitySelect(city.name)}
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
                )}
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
                {cities.length === 0 && formData.state && !manualState && !manualCity && (
                  <p className="mt-1 text-xs text-yellow-600">
                    No cities found for this state. Please add manually.
                  </p>
                )}
              </div>
            )}

            {/* Default Fee */}
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

            {/* Description */}
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

            {/* Status */}
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

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex items-center justify-center px-6 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Default Pricing
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

export default EditDefaultPricingPage;