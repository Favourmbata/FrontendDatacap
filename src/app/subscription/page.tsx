
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  Check,
  Building,
  ShieldCheck,
  Upload,
  Plus,
  X,
  Clock,
  Globe,
  MapPin,
  Search,
  ChevronDown,
  Layers,
} from "lucide-react"
import useSubscriptionPackages from '@/api/hooks/useSubscriptionPackages';
import PaymentService from '@/services/PaymentService';
import CombinedPaymentService from '@/services/CombinedPaymentService';
import LocationPaymentService from '@/services/LocationPaymentService';
import { useAuth } from '@/api/hooks/useAuth'; // Assuming we have an auth hook for user data
import { useAuthContext, User } from '@/AuthContext';
import OrganizationProfileService, { OrganizationProfile } from '@/services/OrganizationProfileService';
import ProfileStep from "./components/ProfileStep";
import LocationStep from "./components/LocationStep";


interface APIService {
  _id: string;
  serviceId: string;
  serviceName: string;
  duration: 'monthly' | 'quarterly' | 'yearly';
  price: number;
}

interface APISubscriptionPackage {
  _id: string;
  title: string;
  description: string;
  totalServiceCost: number;
  promoCode: string;
  discountPercentage: number;
  discountAmount: number;
  finalPriceAfterDiscount: number;
  features: string[];
  note: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  services: APIService[];
  maxUsers?: number;
}

interface Service {
  id: string
  name: string
  duration: string
  price: number
  numberOfUsers: number
}

interface SubscriptionPackage {
  id: string;
  packageName: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  originalMonthlyPrice: number;
  originalQuarterlyPrice: number;
  originalYearlyPrice: number;
  hasApiDiscount?: boolean;
  features: string[];
  services: Service[];
  maxUsers?: number;
  finalPriceAfterDiscount?: number;
  totalServiceCost?: number;
  promoCode?: string;
  discountPercentage?: number;
  discountAmount?: number;
  hasActivePromo?: boolean;
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


const SubscriptionPage: React.FC = () => {
  const { packages: apiPackages, loading, error } = useSubscriptionPackages();
  const authContext = useAuthContext();
  
  
  const user = authContext.user as User || null; // Get user data from auth context
  const [selectedPackages, setSelectedPackages] = useState<Record<string, "monthly" | "quarterly" | "yearly">>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [userLimitError, setUserLimitError] = useState<string | null>(null)
  const [packageUserCounts, setPackageUserCounts] = useState<Record<string, number>>({})
  const [paymentInitializationError, setPaymentInitializationError] = useState<string | null>(null);
  
 
  const [organizationProfile, setOrganizationProfile] = useState<OrganizationProfile>({
    businessType: 'unregistered',
    isPublicProfile: false,
    verificationStatus: 'unverified',
  });
  
  const [orgProfileSubmitting, setOrgProfileSubmitting] = useState(false);
  const [orgProfileSuccess, setOrgProfileSuccess] = useState(false);
  const [orgProfileError, setOrgProfileError] = useState<string | null>(null);
  

  const [locations, setLocations] = useState<LocationData[]>([
    {
      locationType: 'headquarters',
      brandName: '',
      country: '',
      state: '',
      lga: '',
      city: '',
      cityRegion: '',
      houseNumber: '',
      street: '',
      landmark: undefined, // Optional fields as undefined
      buildingColor: undefined,
      buildingType: undefined,
      cityRegionFee: undefined,
      gallery: {
        images: [],
        videos: []
      }
    }
  ]);
  
 
  const [locationDropdownStates, setLocationDropdownStates] = useState<DropdownState[]>([
    {
      countryDropdownOpen: false,
      stateDropdownOpen: false,
      lgaDropdownOpen: false,
      cityDropdownOpen: false,
      cityRegionDropdownOpen: false,
   
      countrySearch: '',
      stateSearch: '',
      lgaSearch: '',
      citySearch: '',
      cityRegionSearch: '',
   
      loadingStates: false,
      loadingLgas: false,
      loadingCities: false,
      loadingCityRegions: false,
      
      statesForCountry: [],
      lgasForState: [],
      citiesForLga: [],
      cityRegionsForCity: [],
    }
  ]);
  
  const [locationSubmitting, setLocationSubmitting] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Location payment states
  const [locationPaymentInitializing, setLocationPaymentInitializing] = useState(false);
  const [locationPaymentError, setLocationPaymentError] = useState<string | null>(null);
  const [locationPaymentData, setLocationPaymentData] = useState<any>(null);
  
  const [currentStep, setCurrentStep] = useState<'packages' | 'profile' | 'locations' | 'location-payment' | 'payment'>('packages');
  
  // State for country data
  const [countries, setCountries] = useState<any[]>([]);
  
  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);
  
  const loadCountries = async () => {
    try {
      // Use country-state-city package directly for all countries
      const { Country } = await import('country-state-city');
      const allCountries = Country.getAllCountries();
      
      const countryObjects = allCountries.map((country: any) => ({
        name: country.name,
        isoCode: country.isoCode
      }));
      
      setCountries(countryObjects);
      console.log(`✅ Loaded ${countryObjects.length} countries`);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };
  
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
      // Use country-state-city package for all states
      const { Country, State } = await import('country-state-city');
      const allCountries = Country.getAllCountries();
      const country = allCountries.find(c => c.name === countryName);
      
      if (country) {
        const states = State.getStatesOfCountry(country.isoCode);
        const stateList = states.map(state => ({
          name: state.name,
          isoCode: state.isoCode
        }));
        
        const newDropdownStates = [...locationDropdownStates];
        newDropdownStates[index].statesForCountry = stateList;
        setLocationDropdownStates(newDropdownStates);
        console.log(`✅ Loaded ${stateList.length} states for ${countryName}`);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadLgasForLocation = async (index: number, countryName: string, stateName: string) => {
    try {
      // LGAs are only available for specific countries (like Nigeria) from backend
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const data = await httpService.getData<any>(`/api/locations/lgas?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
      const lgaList = data.data?.lgas?.map((lga: any) => typeof lga === 'string' ? lga : lga.name) || [];
      
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].lgasForState = lgaList;
      setLocationDropdownStates(newDropdownStates);
      
      if (lgaList.length > 0) {
        console.log(`✅ Loaded ${lgaList.length} LGAs for ${stateName}`);
      } else {
        console.log(`⚠️ No LGAs available for ${stateName} (LGA is optional)`);
      }
    } catch (error) {
      console.error('Error loading LGAs:', error);
      // LGA is optional, so don't fail if not available
      const newDropdownStates = [...locationDropdownStates];
      newDropdownStates[index].lgasForState = [];
      setLocationDropdownStates(newDropdownStates);
    }
  };

  const loadCitiesForLocation = async (index: number, countryName: string, stateName: string, lgaName: string) => {
    try {
      // Use country-state-city package for all cities
      const { Country, State, City } = await import('country-state-city');
      const allCountries = Country.getAllCountries();
      const country = allCountries.find(c => c.name === countryName);
      
      if (country) {
        const states = State.getStatesOfCountry(country.isoCode);
        const state = states.find(s => s.name === stateName);
        
        if (state) {
          const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
          const cityList = cities.map(city => ({
            name: city.name
          }));
          
          const newDropdownStates = [...locationDropdownStates];
          newDropdownStates[index].citiesForLga = cityList;
          setLocationDropdownStates(newDropdownStates);
          console.log(`✅ Loaded ${cityList.length} cities for ${stateName}`);
        }
      }
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


  

  

  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);


  const getValidatedUserData = (context: string = 'payment') => {
    const currentUser = authContext.user;
    
    console.log(`${context} - Current user data:`, currentUser);
    
    let paymentUserData = currentUser;
    if (!currentUser || !currentUser.email || !currentUser.fullName || 
        currentUser.email.trim() === '' || currentUser.fullName.trim() === '') {
      console.log(`${context} - User data incomplete, checking localStorage...`);

      if (typeof window !== 'undefined') {
        const storedUserStr = localStorage.getItem('user');
        console.log(`${context} - Stored user string:`, storedUserStr);
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            console.log(`${context} - Parsed stored user:`, storedUser);
            if (storedUser && storedUser.email && storedUser.fullName && 
                storedUser.email.trim() !== '' && storedUser.fullName.trim() !== '') {
              paymentUserData = storedUser;
              console.log(`${context} - Using stored user data:`, paymentUserData);
            }
          } catch (e) {
            console.error(`${context} - Error parsing stored user data:`, e);
          }
        }
      }
    }
    
    // Final validation for required fields
    if (!paymentUserData || 
        !paymentUserData.email || 
        !paymentUserData.fullName || 
        paymentUserData.email.trim() === '' || 
        paymentUserData.fullName.trim() === '') {
      
      console.error(`${context} - Required user fields missing after all attempts:`, {
        currentUser: currentUser,
        paymentUserData: paymentUserData,
        currentUserEmail: currentUser?.email,
        currentUserFullName: currentUser?.fullName,
        paymentUserEmail: paymentUserData?.email,
        paymentUserFullName: paymentUserData?.fullName
      });
      
      return {
        isValid: false,
        error: `User profile is incomplete. Email and full name are required to process ${context}. Please update your profile with valid email and full name.`,
        userData: null
      };
    }
    
    // Ensure we have clean data
    const cleanPaymentData = {
      email: paymentUserData.email.trim(),
      fullName: paymentUserData.fullName.trim(),
      phoneNumber: paymentUserData.phoneNumber || '',
      id: paymentUserData.id || ''
    };
    
    console.log(`${context} - Clean payment user data:`, cleanPaymentData);
    
    return {
      isValid: true,
      error: null,
      userData: cleanPaymentData
    };
  };

  // State for promo codes
  const [appliedPromoCodes, setAppliedPromoCodes] = useState<Record<string, {code: string, discount: number}>>({});
  const [promoCodeInputs, setPromoCodeInputs] = useState<Record<string, string>>({});
  const [promoValidationStates, setPromoValidationStates] = useState<Record<string, {isValid: boolean, error?: string}>>({});
  
  const packages: SubscriptionPackage[] = apiPackages?.map(pkg => {
    // Calculate original prices from services
    const servicesByDuration = {
      monthly: pkg.services?.filter(s => s.duration === 'monthly') || [],
      quarterly: pkg.services?.filter(s => s.duration === 'quarterly') || [],
      yearly: pkg.services?.filter(s => s.duration === 'yearly') || []
    };
    
    const originalMonthlyPrice = servicesByDuration.monthly.reduce((sum, service) => sum + (service.price || 0), 0);
    const originalQuarterlyPrice = servicesByDuration.quarterly.reduce((sum, service) => sum + (service.price || 0), 0);
    const originalYearlyPrice = servicesByDuration.yearly.reduce((sum, service) => sum + (service.price || 0), 0);

    // Check for user-applied promo codes
    const appliedPromo = appliedPromoCodes[pkg._id];
    const promoValidation = promoValidationStates[pkg._id];
    const hasUserPromo = appliedPromo && promoValidation?.isValid;

    // Only apply discount when user has entered and validated a promo code
    const discountPercentage = (hasUserPromo ? appliedPromo.discount : 0) || 0;
    const monthlyDiscount = discountPercentage > 0 ? (originalMonthlyPrice * discountPercentage / 100) : 0;
    const quarterlyDiscount = discountPercentage > 0 ? (originalQuarterlyPrice * discountPercentage / 100) : 0;
    const yearlyDiscount = discountPercentage > 0 ? (originalYearlyPrice * discountPercentage / 100) : 0;

    const finalMonthlyPrice = originalMonthlyPrice - monthlyDiscount;
    const finalQuarterlyPrice = originalQuarterlyPrice - quarterlyDiscount;
    const finalYearlyPrice = originalYearlyPrice - yearlyDiscount;

    return {
      id: pkg._id,
      packageName: pkg.title,
      description: pkg.description,
      // Show original prices by default; discounted only after valid promo applied
      monthlyPrice: finalMonthlyPrice,
      quarterlyPrice: finalQuarterlyPrice,
      yearlyPrice: finalYearlyPrice,
      // Store original prices for strikethrough display
      originalMonthlyPrice: originalMonthlyPrice,
      originalQuarterlyPrice: originalQuarterlyPrice,
      originalYearlyPrice: originalYearlyPrice,
      hasApiDiscount: (pkg.discountPercentage || 0) > 0,
      hasUserPromo: hasUserPromo,
      features: pkg.features || [],
      services: pkg.services?.map(service => ({
        id: service._id || service.serviceId,
        name: service.serviceName,
        duration: service.duration,
        price: service.price,
        numberOfUsers: 1
      })) || [],
      maxUsers: pkg.maxUsers,
      finalPriceAfterDiscount: pkg.finalPriceAfterDiscount,
      totalServiceCost: pkg.totalServiceCost,
      promoCode: pkg.promoCode,
      discountPercentage: pkg.discountPercentage,
      discountAmount: pkg.discountAmount,
      hasActivePromo: Boolean(hasUserPromo)
    };
  }) || [];

  useEffect(() => {
    let packageTotal = 0;
    Object.entries(selectedPackages).forEach(([packageId, billingCycle]) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) {
        // Calculate based on services for the selected duration
        const servicesForDuration = pkg.services.filter(service => service.duration === billingCycle);
        const totalCost = servicesForDuration.reduce((sum, service) => sum + (service.price || 0), 0);
        
        // Apply discount only if valid promo code is applied
        const appliedPromo = appliedPromoCodes[packageId];
        const promoValidation = promoValidationStates[packageId];
        
        let durationAmount = totalCost;
        
        if (appliedPromo && promoValidation?.isValid) {
          const discountPercentage = appliedPromo.discount || 0;
          const discountAmount = discountPercentage > 0 ? (totalCost * discountPercentage / 100) : 0;
          durationAmount = totalCost - discountAmount;
          
          console.log(`💰 Package ${pkg.packageName} (${billingCycle}): ₦${durationAmount.toLocaleString()} (${discountPercentage}% discount applied)`);
        } else {
          console.log(`💰 Package ${pkg.packageName} (${billingCycle}): ₦${durationAmount.toLocaleString()} (no discount)`);
        }
        
        packageTotal += durationAmount;
      }
    });

    // Add location fees if public profile and locations exist
    let locationTotal = 0;
    if (organizationProfile.isPublicProfile && locations.length > 0) {
      locationTotal = locations.reduce((total, location) => {
        return total + (location.cityRegionFee || 0);
      }, 0);
    }

    const combinedTotal = packageTotal + locationTotal;
    setTotalAmount(combinedTotal);
    
    console.log('💰 Total calculation:', {
      packageTotal,
      locationTotal,
      combinedTotal,
      hasLocations: organizationProfile.isPublicProfile && locations.length > 0
    });
  }, [selectedPackages, packages, organizationProfile.isPublicProfile, locations])

  const handlePackageSelection = (packageId: string, billingCycle: "monthly" | "quarterly" | "yearly") => {
    setSelectedPackages((prev) => {
      if (prev[packageId] === billingCycle) {
        const newSelections = { ...prev }
        delete newSelections[packageId]
        return newSelections
      }
      return { ...prev, [packageId]: billingCycle }
    })
  }

  // Validate promo code with backend API
  const validatePromoCode = async (packageId: string, promoCode: string) => {
    if (!promoCode.trim()) {
      return;
    }

    try {
      const HttpService = (await import('@/services/HttpService')).HttpService;
      const httpService = new HttpService();
      
      const response = await httpService.postData<any>({
        packageId,
        promoCode: promoCode.trim()
      }, `/api/user-subscriptions/validate-promo`);
      
      if (response.success && response.data?.isValid) {
        // Apply the valid promo code
        setAppliedPromoCodes(prev => ({
          ...prev,
          [packageId]: {
            code: promoCode.trim(),
            discount: response.data.discountPercentage
          }
        }));
        
        // Store success message
        setPromoValidationStates(prev => ({
          ...prev,
          [packageId]: { 
            isValid: true,
            error: response.message || 'Promo code is valid'
          }
        }));
      } else {
        // Show validation error
        setPromoValidationStates(prev => ({
          ...prev,
          [packageId]: { 
            isValid: false, 
            error: response.message || 'Invalid promo code'
          }
        }));
        
        // Remove any previously applied promo
        const newApplied = {...appliedPromoCodes};
        delete newApplied[packageId];
        setAppliedPromoCodes(newApplied);
      }
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      setPromoValidationStates(prev => ({
        ...prev,
        [packageId]: { 
          isValid: false, 
          error: error.message || 'Failed to validate promo code'
        }
      }));
      
      // Remove any previously applied promo
      const newApplied = {...appliedPromoCodes};
      delete newApplied[packageId];
      setAppliedPromoCodes(newApplied);
    }
  };

  const handlePayment = async () => {
    setPaymentInitializationError(null);
    
    if (Object.keys(selectedPackages).length === 0) {
      alert("Please select at least one package to proceed with payment");
      return;
    }

    const [firstPackageId, subscriptionDuration] = Object.entries(selectedPackages)[0];
    const currentUser = authContext.user;
    
    if (!authContext.token) {
      alert("User not authenticated. Please log in.");
      window.location.reload();
      return;
    }

    // Use the helper function for validation
    const validationResult = getValidatedUserData('package payment');
    if (!validationResult.isValid || !validationResult.userData) {
      setPaymentInitializationError(validationResult.error || 'User profile validation failed');
      setIsProcessingPayment(false);
      return;
    }

    const cleanPaymentData = validationResult.userData;
    setIsProcessingPayment(true);
        
    try {
      const selectedPackage = packages.find(p => p.id === firstPackageId);
      const numberOfUsers = packageUserCounts[firstPackageId] || selectedPackage?.maxUsers || 1;
          
      if (selectedPackage?.maxUsers && numberOfUsers > selectedPackage.maxUsers) {
        setUserLimitError(`Number of users (${numberOfUsers}) exceeds the maximum allowed (${selectedPackage.maxUsers}) for this package.`);
        setIsProcessingPayment(false);
        return;
      }

      // Clear any previous user limit error
      setUserLimitError(null);
          
      // CRITICAL: Get the correct amount for the selected billing cycle
      // Filter services by the selected duration and sum their prices
      const servicesForDuration = selectedPackage?.services?.filter(service => service.duration === subscriptionDuration) || [];
      const totalCost = servicesForDuration.reduce((sum, service) => sum + (service.price || 0), 0);
      
      // Apply discount only if valid promo code is applied
      const selectedAppliedPromo = appliedPromoCodes[firstPackageId];
      const selectedPromoValidation = promoValidationStates[firstPackageId];
      
      let packageAmount = totalCost;
      let discountAmount = 0;
      
      if (selectedAppliedPromo && selectedPromoValidation?.isValid) {
        const discountPercentage = selectedAppliedPromo.discount || 0;
        discountAmount = discountPercentage > 0 ? (totalCost * discountPercentage / 100) : 0;
        packageAmount = totalCost - discountAmount;
      }
      
     
      const paymentAppliedPromo = appliedPromoCodes[firstPackageId];
      const paymentPromoValidation = promoValidationStates[firstPackageId];

      const hasLocations = organizationProfile.isPublicProfile && locations.length > 0 && 
                          locations.some(loc => loc.country && loc.state && loc.city && loc.cityRegionFee);
      
      console.log('🔍 Combined payment check:', {
        isPublicProfile: organizationProfile.isPublicProfile,
        locationsCount: locations.length,
        locations: locations,
        hasLocations: hasLocations,
        locationWithFee: locations.find(loc => loc.cityRegionFee),
        hasValidPromo: paymentAppliedPromo && paymentPromoValidation?.isValid
      });

      if (hasLocations) {
        // Use Combined Payment Service
        console.log('🔄 Using combined payment for package + locations');
        
        const combinedPaymentService = new CombinedPaymentService();
        
        // Prepare locations data for combined payment
        const locationsForPayment = locations
          .filter(loc => loc.country && loc.state && loc.city)
          .map(loc => ({
            country: loc.country,
            state: loc.state,
            lga: loc.lga || undefined,
            city: loc.city,
            cityRegion: loc.cityRegion || undefined,
            brandName: loc.brandName,
            locationType: loc.locationType,
            houseNumber: loc.houseNumber,
            street: loc.street,
            landmark: loc.landmark,
            buildingColor: loc.buildingColor,
            buildingType: loc.buildingType,
          }));

        // Calculate location total
        const locationTotal = locationsForPayment.reduce((sum, loc) => {
          const location = locations.find(l => l.brandName === loc.brandName);
          return sum + (location?.cityRegionFee || 0);
        }, 0);
        
        const combinedPaymentRequest = {
          // Package details
          packageId: firstPackageId,
          subscriptionDuration,
          packageAmount, // Duration-specific amount
          maxUsers: numberOfUsers,
          
          // Location details - only include if we have locations
          includeVerifiedBadge: locationsForPayment.length > 0,
          locations: locationsForPayment,
          
          // User details
          userId: cleanPaymentData.id as string,
          userType: 'organization' as const,
          email: cleanPaymentData.email,
          name: cleanPaymentData.fullName,
          phone: cleanPaymentData.phoneNumber,
          
          // Payment details
          returnUrl: `${window.location.origin}/payment/verify?status=success&type=combined`,
          cancelUrl: `${window.location.origin}/payment/verify?status=cancelled&type=combined`,
          
          // Optional promo code - only include if validated
          ...(paymentAppliedPromo && paymentPromoValidation?.isValid && {
            promoCode: paymentAppliedPromo.code
          })
        };

     

        const response = await combinedPaymentService.initializeCombinedPayment(combinedPaymentRequest);
        
        if (response.success && response.data) {
          setPaymentInitializationError(null);
        
          
          // Redirect to payment gateway
          window.location.href = response.data.paymentLink;
        } else {
          setPaymentInitializationError(response.error || 'Combined payment initialization failed');
          setIsProcessingPayment(false);
        }
      } else {
        // Use Regular Package Payment Service (existing logic)
        console.log('🔄 Using regular package payment (no locations)');
        
        const paymentRequest = {
          userId: cleanPaymentData.id as string, 
          userType: 'organization' as const, 
          packageId: firstPackageId,
          subscriptionDuration,
          amount: packageAmount, // Duration-specific amount
          maxUsers: numberOfUsers, 
          email: cleanPaymentData.email,
          name: cleanPaymentData.fullName,
          phone: cleanPaymentData.phoneNumber,
          returnUrl: `${window.location.origin}/payment/verify?status=success&type=package`,
          cancelUrl: `${window.location.origin}/payment/verify?status=cancelled&type=package`,
          // Optional promo code - only include if validated
          ...(paymentAppliedPromo && paymentPromoValidation?.isValid && {
            promoCode: paymentAppliedPromo.code
          })
        };
        
      
        const response = await PaymentService.initializePayment(paymentRequest);
        
        if (response.success) {
          setPaymentInitializationError(null);
          window.location.href = response.data.paymentLink;
        } else {
          setPaymentInitializationError('Payment initialization failed');
          setIsProcessingPayment(false);
        }
      }
    } catch (error: any) {
      console.error('❌ Error initializing payment:', error);
      setPaymentInitializationError(error.message || 'An error occurred while initializing payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  }

  const getBillingPrice = (pkg: SubscriptionPackage, billingCycle: "monthly" | "quarterly" | "yearly") => {
    switch (billingCycle) {
      case "monthly":
        return pkg.monthlyPrice
      case "quarterly":
        return pkg.quarterlyPrice
      case "yearly":
        return pkg.yearlyPrice
      default:
        return pkg.monthlyPrice
    }
  }

  const getOriginalPrice = (pkg: SubscriptionPackage, billingCycle: "monthly" | "quarterly" | "yearly") => {
    switch (billingCycle) {
      case "monthly":
        return pkg.originalMonthlyPrice
      case "quarterly":
        return pkg.originalQuarterlyPrice
      case "yearly":
        return pkg.originalYearlyPrice
      default:
        return pkg.originalMonthlyPrice
    }
  }

  const handleLocationPayment = async () => {
    setLocationPaymentInitializing(true);
    setLocationPaymentError(null);
    
    try {
      // Use the helper function for validation
      const validationResult = getValidatedUserData('location payment');
      if (!validationResult.isValid || !validationResult.userData) {
        setLocationPaymentError(validationResult.error || 'User profile validation failed');
        setLocationPaymentInitializing(false);
        return;
      }
      
      const cleanPaymentData = validationResult.userData;
      
      // Prepare payment data
      const paymentData = {
        email: cleanPaymentData.email,
        name: cleanPaymentData.fullName,
        phone: cleanPaymentData.phoneNumber
      };
      
      console.log('Location payment - Payment data being sent:', paymentData);
      
      // Initialize location payment
      const response = await LocationPaymentService.initializePayment(paymentData);
      
      if (response.success && response.data) {
        setLocationPaymentData(response.data);
        // Redirect to payment gateway
        window.location.href = response.data.paymentLink;
      } else {
        setLocationPaymentError('Failed to initialize location payment');
      }
    } catch (error: any) {
      console.error('Error initializing location payment:', error);
      setLocationPaymentError(error.message || 'An error occurred while initializing location payment');
    } finally {
      setLocationPaymentInitializing(false);
    }
  };
  
  const handleOrgProfileSubmit = async () => {
    setOrgProfileSubmitting(true);
    setOrgProfileError(null);
    
    try {
      const orgProfileService = new OrganizationProfileService();
      const response = await orgProfileService.createOrUpdateProfile(organizationProfile);
      
      if (response.success) {
        setOrgProfileSuccess(true);
        // Move to next step based on profile visibility
        setTimeout(() => {
          if (organizationProfile.isPublicProfile) {
            // If profile is public, go to locations step
            setCurrentStep('locations');
          } else {
            // If profile is not public, skip locations and go to payment
            setCurrentStep('payment');
          }
        }, 1500);
      } else {
        setOrgProfileError('Failed to save organization profile');
      }
    } catch (error: any) {
      console.error('Error saving organization profile:', error);
      setOrgProfileError(error.message || 'An error occurred while saving organization profile');
    } finally {
      setOrgProfileSubmitting(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading subscription packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Packages</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              DC
            </div>
          </div>
          <span className="text-gray-500 text-sm">Subscription Required</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'packages' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium px-2">Packages</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'profile' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium px-2">Profile</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'locations' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              } ${organizationProfile.isPublicProfile ? '' : 'opacity-50'}`}
            >
              3
            </div>
            <span className={`text-sm font-medium px-2 ${organizationProfile.isPublicProfile ? '' : 'opacity-50'}`}>Locations</span>
            <div className={`w-16 h-0.5 bg-gray-300 ${organizationProfile.isPublicProfile ? '' : 'opacity-50'}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'location-payment' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              } ${(organizationProfile.isPublicProfile && organizationProfile.verificationStatus === 'verified') ? '' : 'opacity-50'}`}
            >
              4
            </div>
            <span className={`text-sm font-medium px-2 ${(organizationProfile.isPublicProfile && organizationProfile.verificationStatus === 'verified') ? '' : 'opacity-50'}`}>Location Payment</span>
            <div className={`w-16 h-0.5 bg-gray-300 ${(organizationProfile.isPublicProfile && organizationProfile.verificationStatus === 'verified') ? '' : 'opacity-50'}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'payment' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              5
            </div>
            <span className="text-sm font-medium px-2">Package Payment</span>
          </div>
        </div>


   

{currentStep === 'packages' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    {packages.map((pkg) => (
      <div
        key={pkg.id}
        className={`relative flex flex-col rounded-xl border-2 p-6 transition-all duration-200 min-h-[650px] ${
          selectedPackages[pkg.id]
            ? "border-purple-500 bg-purple-50 shadow-lg"
            : "border-gray-200 bg-white hover:shadow-md"
        }`}
      >
        
        <div className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{pkg.packageName}</h3>
            {pkg.hasApiDiscount && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                🎉 {pkg.discountPercentage || 0}% OFF
              </span>
            )}
          </div>
          
      
          <p className="text-gray-600 mb-4 text-sm line-clamp-2 min-h-[2.5rem]">
            {pkg.description}
          </p>
        </div>

        
        <div className="mb-4 space-y-2">
          <div className="space-y-2">
            <select
              value={selectedPackages[pkg.id] || ""}
              onChange={(e) => {
                if (e.target.value) {
                  handlePackageSelection(pkg.id, e.target.value as "monthly" | "quarterly" | "yearly")
                }
              }}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Plan</option>
              <option value="monthly">Monthly - ₦{Math.round(pkg.monthlyPrice).toLocaleString('en-NG')}</option>
              <option value="quarterly">Quarterly - ₦{Math.round(pkg.quarterlyPrice).toLocaleString('en-NG')}</option>
              <option value="yearly">Yearly - ₦{Math.round(pkg.yearlyPrice).toLocaleString('en-NG')}</option>
            </select>

          
          </div>

          
          {pkg.promoCode && (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={promoCodeInputs[pkg.id] || ''}
                  onChange={(e) => {
                    setPromoCodeInputs(prev => ({
                      ...prev,
                      [pkg.id]: e.target.value
                    }));
                    
                  
                    if (promoValidationStates[pkg.id]) {
                      setPromoValidationStates(prev => {
                        const newState = {...prev};
                        delete newState[pkg.id];
                        return newState;
                      });
                    }
                  }}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => validatePromoCode(pkg.id, promoCodeInputs[pkg.id] || '')}
                  disabled={!promoCodeInputs[pkg.id]?.trim()}
                  className={`px-3 py-1.5 text-xs rounded whitespace-nowrap ${
                    appliedPromoCodes[pkg.id] 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  } ${!promoCodeInputs[pkg.id]?.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {appliedPromoCodes[pkg.id] 
                    ? 'Applied ✓' 
                    : 'Apply'}
                </button>
              </div>
              
              {/* Message display - success or error */}
              {promoValidationStates[pkg.id] && (
                <div className={`text-xs p-2 rounded ${
                  promoValidationStates[pkg.id].isValid 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {promoValidationStates[pkg.id].isValid 
                    ? `✅ ${promoValidationStates[pkg.id].error}` 
                    : `❌ ${promoValidationStates[pkg.id].error}`
                  }
                </div>
              )}
            </div>
          )}
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Users
          </label>
          <input
            name={`numberOfUsers-${pkg.id}`}
            type="number"
            min="1"
            max={pkg.maxUsers || 10}
            defaultValue={pkg.maxUsers || 1}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
              packageUserCounts[pkg.id] && pkg.maxUsers && packageUserCounts[pkg.id] > pkg.maxUsers 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}
            placeholder={`Enter number of users (up to ${pkg.maxUsers || 10})`}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setPackageUserCounts(prev => ({
                ...prev,
                [pkg.id]: value
              }));
              
              if (pkg.maxUsers && value > pkg.maxUsers) {
                setUserLimitError(`Number of users (${value}) exceeds the maximum allowed (${pkg.maxUsers}) for this package.`);
              } else if (userLimitError && selectedPackages[pkg.id]) {
                setUserLimitError(null);
              }
            }}
          />
          <p className="mt-1 text-xs text-gray-500">
            Maximum allowed: {pkg.maxUsers || 1} users
          </p>
        </div>

      
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Services:</h4>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {pkg.services.map((service, idx) => (
              <div key={service.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{service.name}</span>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1"></div>

          <hr className="my-3 border-t-2 border-gray-300" />
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Features:</h4>
          <ul className="text-sm text-gray-700 space-y-1.5 max-h-[150px] overflow-y-auto">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {selectedPackages[pkg.id] ? (
                <div>
                  <span className="text-gray-600">Selected:</span>
                  <span className="font-medium text-purple-600 ml-1 capitalize">
                    {selectedPackages[pkg.id]} - ₦{Math.round(
                      getBillingPrice(pkg, selectedPackages[pkg.id]!)
                    ).toLocaleString('en-NG')}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">Not selected</span>
              )}
            </div>
            {selectedPackages[pkg.id] && (
              <button
                onClick={() => handlePackageSelection(pkg.id, selectedPackages[pkg.id]!)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        {currentStep === 'packages' && Object.keys(selectedPackages).length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setCurrentStep('profile')}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700"
            >
              Continue to Profile Setup
            </button>
          </div>
        )}

        {currentStep === 'packages' && Object.keys(selectedPackages).length === 0 && (
          <div className="mb-8 bg-blue-50 rounded-xl border border-blue-200 p-8 text-center">
            <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Packages Selected</h3>
            <p className="text-blue-800">
              Please select at least one package above to proceed.
            </p>
          </div>
        )}

        {/* Organization Profile Form - Step 2 */}
        {currentStep === 'profile' && (
          <ProfileStep
            organizationProfile={organizationProfile as OrganizationProfile & { isPublicProfile: boolean }}
            setOrganizationProfile={setOrganizationProfile}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            orgProfileSubmitting={orgProfileSubmitting}
            setOrgProfileSubmitting={setOrgProfileSubmitting}
            orgProfileSuccess={orgProfileSuccess}
            setOrgProfileSuccess={setOrgProfileSuccess}
            orgProfileError={orgProfileError}
            setOrgProfileError={setOrgProfileError}
          />
        )}

        {/* Location Form - Step 3 */}
        <LocationStep
          locations={locations}
          setLocations={setLocations}
          locationDropdownStates={locationDropdownStates}
          setLocationDropdownStates={setLocationDropdownStates}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          organizationProfile={{
            businessType: organizationProfile.businessType,
            isPublicProfile: organizationProfile.isPublicProfile ?? false,
            verificationStatus: organizationProfile.verificationStatus
          }}
          locationSubmitting={locationSubmitting}
          setLocationSubmitting={setLocationSubmitting}
          locationSuccess={locationSuccess}
          setLocationSuccess={setLocationSuccess}
          locationError={locationError}
          setLocationError={setLocationError}
          countries={countries}
          locationPaymentInitializing={locationPaymentInitializing}
          setLocationPaymentInitializing={setLocationPaymentInitializing}
          locationPaymentError={locationPaymentError}
          setLocationPaymentError={setLocationPaymentError}
          locationPaymentData={locationPaymentData}
          setLocationPaymentData={setLocationPaymentData}
          handleLocationPayment={handleLocationPayment}
          selectedPackageInfo={(() => {
            const [firstPackageId, billingCycle] = Object.entries(selectedPackages)[0] || [];
            if (!firstPackageId) return undefined;
            
            const selectedPackage = packages.find(p => p.id === firstPackageId);
            if (!selectedPackage) return undefined;
            
            // Calculate original price (without discount)
            const servicesForDuration = selectedPackage?.services?.filter(service => service.duration === billingCycle) || [];
            const totalCost = servicesForDuration.reduce((sum, service) => sum + (service.price || 0), 0);
            
            console.log(`📦 Selected package original amount for ${billingCycle}:`, totalCost);
            console.log(`📦 Services for ${billingCycle}:`, servicesForDuration);
            
            return {
              packageName: selectedPackage.packageName,
              billingCycle: billingCycle,
              amount: totalCost
            };
          })()}
          // Pass main page functions
          getFilteredCountries={getFilteredCountries}
          getFilteredStatesForLocation={getFilteredStatesForLocation}
          getFilteredLgasForLocation={getFilteredLgasForLocation}
          getFilteredCitiesForLocation={getFilteredCitiesForLocation}
          getFilteredCityRegionsForLocation={getFilteredCityRegionsForLocation}
          loadStatesForLocation={loadStatesForLocation}
          loadLgasForLocation={loadLgasForLocation}
          loadCitiesForLocation={loadCitiesForLocation}
          loadCityRegionsForLocation={loadCityRegionsForLocation}
        />


        {/* Payment Section - Step 4 */}
        {currentStep === 'payment' && Object.keys(selectedPackages).length > 0 && (
          <>
            {/* Payment Summary Banner */}
            <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Payment Summary</h2>
                <p className="text-purple-100 mb-4">Review your order before completing payment</p>
                
                {/* Quick Summary */}
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-purple-100">Package(s)</p>
                      <p className="text-lg font-semibold">{Object.keys(selectedPackages).length}</p>
                    </div>
                    {organizationProfile.isPublicProfile && locations.length > 0 && (
                      <div>
                        <p className="text-sm text-purple-100">Location(s)</p>
                        <p className="text-lg font-semibold">{locations.length}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-purple-100">Total Amount</p>
                      <p className="text-2xl font-bold">₦{Math.round(totalAmount).toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Summary Section */}
            <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  <span>Ready for Payment</span>
                </div>
              </div>
              
              {/* Selected Packages Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Selected Packages</h4>
                <div className="space-y-3">
                  {Object.entries(selectedPackages).map(([packageId, billingCycle]) => {
                    const pkg = packages.find(p => p.id === packageId);
                    if (!pkg) return null;
                    
                    const userCount = packageUserCounts[packageId] || pkg.maxUsers || 1;
                    
                    // Calculate price with discount
                    const cycleServices = pkg.services.filter(service => service.duration === billingCycle);
                    const totalCost = cycleServices.reduce((sum, service) => sum + (service.price || 0), 0);
                    const discountPercentage = pkg.discountPercentage || 0;
                    const discountAmount = discountPercentage > 0 ? (totalCost * discountPercentage / 100) : 0;
                    const actualPrice = totalCost - discountAmount;
                    
                    console.log(`📦 Payment summary - ${pkg.packageName} (${billingCycle}): ₦${actualPrice.toLocaleString()}`);
                    
                    return (
                      <div key={packageId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{pkg.packageName}</h5>
                            <p className="text-sm text-gray-600 capitalize font-medium">{billingCycle} Plan</p>
                            <p className="text-sm text-gray-600">{userCount} user{userCount > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            {discountAmount > 0 && (
                              <p className="text-sm text-gray-500 line-through">₦{Math.round(totalCost).toLocaleString('en-NG')}</p>
                            )}
                            <p className="text-xl font-bold text-gray-900">₦{Math.round(actualPrice).toLocaleString('en-NG')}</p>
                            {discountAmount > 0 && (
                              <p className="text-xs text-green-600">Save ₦{Math.round(discountAmount).toLocaleString('en-NG')} ({discountPercentage}% off)</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Services included in this plan */}
                        {cycleServices.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Services included:</p>
                            <div className="space-y-1">
                              {cycleServices.map((service: Service, idx: number) => (
                                <div key={idx} className="flex justify-between text-xs text-gray-600">
                                  <span>• {service.name}</span>
                                  <span>₦{service.price.toLocaleString('en-NG')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Profile Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Organization Profile</h4>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">
                      {organizationProfile.isPublicProfile ? 'Public Profile' : 'Private Profile'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {organizationProfile.businessType === 'registered' ? 'Registered Business' : 'Unregistered Business'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${organizationProfile.isPublicProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {organizationProfile.isPublicProfile ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Locations Summary (if public profile) */}
              {organizationProfile.isPublicProfile && locations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location Verification Fees</h4>
                  <div className="space-y-2">
                    {locations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">{location.brandName || `Location ${index + 1}`}</p>
                            <p className="text-sm text-gray-600">
                              {location.city}, {location.state}, {location.country}
                            </p>
                            {location.pricingSource && (
                              <p className="text-xs text-gray-500">{location.pricingSource}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {location.cityRegionFee ? (
                            <p className="font-semibold text-gray-900">₦{location.cityRegionFee.toLocaleString('en-NG')}</p>
                          ) : (
                            <p className="text-sm text-gray-500">Fee pending</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Location Total */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Location Verification Total:</span>
                      <span className="font-bold text-blue-900">
                        ₦{locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0).toLocaleString('en-NG')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Total Summary */}
              <div className="border-t border-gray-200 pt-4">
                {/* Show breakdown if we have both package and location costs */}
                {organizationProfile.isPublicProfile && locations.length > 0 && locations.some(loc => loc.cityRegionFee) ? (
                  <div className="space-y-3">
                    {/* Package Subtotal */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-700">Package Subscription</p>
                        <p className="text-sm text-gray-500">{Object.keys(selectedPackages).length} package(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₦{Math.round(totalAmount - locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0)).toLocaleString('en-NG')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Location Subtotal */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-700">Location Verification</p>
                        <p className="text-sm text-gray-500">{locations.length} location(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₦{locations.reduce((total, loc) => total + (loc.cityRegionFee || 0), 0).toLocaleString('en-NG')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Combined Total */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xl font-bold text-gray-900">Total Amount</p>
                          <p className="text-sm text-gray-500">Package + Location Verification</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-600">₦{Math.round(totalAmount).toLocaleString('en-NG')}</p>
                          <p className="text-sm text-green-600">Combined Payment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Simple total for package-only payments */
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                      <p className="text-sm text-gray-500">{Object.keys(selectedPackages).length} package(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">₦{Math.round(totalAmount).toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
           

            {userLimitError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {userLimitError}
              </div>
            )}

            {paymentInitializationError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <strong>Error:</strong> {paymentInitializationError}
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
                  <p className="text-sm text-gray-600 mt-1">Access all modules after payment</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isProcessingPayment ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {organizationProfile.isPublicProfile && locations.length > 0 && locations.some(loc => loc.cityRegionFee) 
                        ? `Pay Combined ₦${Math.round(totalAmount).toLocaleString('en-NG')} (Package + Locations)`
                        : `Pay ₦${Math.round(totalAmount).toLocaleString('en-NG')} (Package Only)`
                      }
                    </>
                  )}
                </button>
              </div>

              {showPaymentSuccess && (
                <div className="mt-4 flex items-center p-3 bg-green-100 text-green-800 rounded-lg">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment successful! Redirecting...</span>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  )
}

export default SubscriptionPage