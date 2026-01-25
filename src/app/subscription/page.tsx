
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
import { useAuth } from '@/api/hooks/useAuth'; // Assuming we have an auth hook for user data
import { useAuthContext, User } from '@/AuthContext';
import OrganizationProfileService, { OrganizationProfile } from '@/services/OrganizationProfileService';

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
  numberOfUsers: number
}

interface SubscriptionPackage {
  id: string;
  packageName: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  features: string[];
  services: Service[];
  maxUsers?: number;
  finalPriceAfterDiscount?: number;
  totalServiceCost?: number;
}


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
      landmark: '',
      buildingColor: '',
      buildingType: '',
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
  
  const [currentStep, setCurrentStep] = useState<'packages' | 'profile' | 'locations' | 'payment'>('packages');
  
  // State for country data
  const [countries, setCountries] = useState<any[]>([]);
  
  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);
  
  const loadCountries = async () => {
    try {
      // Using HttpService to call the backend API directly
      const HttpService = (await import('@/services/HttpService')).HttpService;
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
  
  // Helper function to get filtered countries
  const getFilteredCountries = (searchTerm: string = '') => {
    if (!countries) return [];
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country.isoCode && country.isoCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
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
  
  // Helper function to get filtered states for a location
  const getFilteredStatesForLocation = (index: number, searchTerm: string = ''): (string | { name: string; isoCode?: string })[] => {
    const states = locationDropdownStates[index]?.statesForCountry || [];
    return states.filter((state) =>
      (typeof state === 'string' && state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof state === 'object' && state.name && state.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof state === 'object' && state.isoCode && state.isoCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Helper function to get filtered lgas for a location
  const getFilteredLgasForLocation = (index: number, searchTerm: string = ''): (string | { name: string })[] => {
    const lgas = locationDropdownStates[index]?.lgasForState || [];
    return lgas.filter((lga) =>
      (typeof lga === 'string' && lga.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof lga === 'object' && lga.name && lga.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Helper function to get filtered cities for a location
  const getFilteredCitiesForLocation = (index: number, searchTerm: string = ''): (string | { name: string })[] => {
    const cities = locationDropdownStates[index]?.citiesForLga || [];
    return cities.filter((city) =>
      (typeof city === 'string' && city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof city === 'object' && city.name && city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Helper function to get filtered city regions for a location
  const getFilteredCityRegionsForLocation = (index: number, searchTerm: string = ''): { name: string; fee: number; _id: string }[] => {
    const regions = locationDropdownStates[index]?.cityRegionsForCity || [];
    return regions.filter((region) =>
      (region.name && region.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Function to load states for a location
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
  
  // Function to load lgas for a location
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
  
  // Function to load cities for a location
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
  
  // Function to load city regions for a location
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
  
  // Refs for closing dropdowns on outside click
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);


  const packages: SubscriptionPackage[] = apiPackages?.map(pkg => {
   
    const monthlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    const quarterlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    const yearlyPrice = pkg.finalPriceAfterDiscount !== undefined && pkg.finalPriceAfterDiscount !== 0 ? 
      pkg.finalPriceAfterDiscount : pkg.totalServiceCost || 0;
    
    return {
      id: pkg._id,
      packageName: pkg.title,
      description: pkg.description,
      monthlyPrice,
      quarterlyPrice,
      yearlyPrice,
      features: pkg.features || [],
      services: pkg.services?.map(service => ({
        id: service._id || service.serviceId,
        name: service.serviceName,
        numberOfUsers: 1 // Default to 1, can be adjusted by user
      })) || [],
      maxUsers: pkg.maxUsers,
      finalPriceAfterDiscount: pkg.finalPriceAfterDiscount,
      totalServiceCost: pkg.totalServiceCost
    };
  }) || [];

  useEffect(() => {
    let total = 0
    Object.entries(selectedPackages).forEach(([packageId, billingCycle]) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) {
        switch (billingCycle) {
          case "monthly":
            total += pkg.monthlyPrice
            break
          case "quarterly":
            total += pkg.quarterlyPrice
            break
          case "yearly":
            total += pkg.yearlyPrice
            break
        }
      }
    })
    setTotalAmount(total)
  }, [selectedPackages, packages])

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
    
    
    let paymentUserData = currentUser;
    if (!currentUser || !currentUser.email || !currentUser.fullName) {
      
      if (typeof window !== 'undefined') {
        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr) {
          try {
            const storedUser = JSON.parse(storedUserStr);
            if (storedUser && storedUser.email && storedUser.fullName) {
              paymentUserData = storedUser;
            }
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
      }
    }
    
 
    if (!paymentUserData || !paymentUserData.email || !paymentUserData.fullName) {
      console.error('Required user fields missing after all attempts:', {
        currentUser: currentUser,
        paymentUserData: paymentUserData
      });
      alert("User profile is incomplete. Please ensure your profile has email and name.");
      return;
    }

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
      
      // Determine the amount to charge based on discount availability
      const baseAmount = getBillingPrice(selectedPackage!, subscriptionDuration);
      let amountToCharge = baseAmount;
      
      // Check if the package has a discount
      if (selectedPackage?.finalPriceAfterDiscount !== undefined && 
          selectedPackage?.finalPriceAfterDiscount > 0 && 
          selectedPackage?.finalPriceAfterDiscount < baseAmount) {
        // Use discounted price if available and it's less than the base amount
        amountToCharge = selectedPackage.finalPriceAfterDiscount;
      } else if (selectedPackage?.totalServiceCost !== undefined && selectedPackage?.totalServiceCost > 0) {
        // Fallback to total service cost if no discount is applied
        amountToCharge = selectedPackage.totalServiceCost;
      }
      
      const paymentRequest = {
        userId: paymentUserData?.id as string, 
        userType: 'organization' as const, 
        packageId: firstPackageId,
        subscriptionDuration,
        amount: amountToCharge, 
        maxUsers: numberOfUsers, 
        email: paymentUserData?.email || '',
        name: paymentUserData?.fullName || '',
        phone: paymentUserData?.phoneNumber || '',
        returnUrl: `${window.location.origin}/payment/verify?status=success`,
        cancelUrl: `${window.location.origin}/payment/verify?status=cancelled`
      };
      

      
   
      const response = await PaymentService.initializePayment(paymentRequest);
      
      if (response.success) {
              
        setPaymentInitializationError(null);
              
        // Redirect to payment gateway
        window.location.href = response.data.paymentLink;
      } else {
              
        setPaymentInitializationError(response.message || 'Payment initialization failed');
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error('Error initializing payment:', error);
        
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

  const handleOrgProfileSubmit = async () => {
    setOrgProfileSubmitting(true);
    setOrgProfileError(null);
    
    try {
      const orgProfileService = new OrganizationProfileService();
      const response = await orgProfileService.createOrUpdateProfile(organizationProfile);
      
      if (response.success) {
        setOrgProfileSuccess(true);
        // Move to locations step after successful profile submission
        setTimeout(() => {
          setCurrentStep('locations');
        }, 1500);
      } else {
        setOrgProfileError(response.message || 'Failed to save organization profile');
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
              }`}
            >
              3
            </div>
            <span className="text-sm font-medium px-2">Locations</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === 'payment' ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              4
            </div>
            <span className="text-sm font-medium px-2">Payment</span>
          </div>
        </div>

        {currentStep === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                  selectedPackages[pkg.id]
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 bg-white hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                  <select
                    value={selectedPackages[pkg.id] || ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        handlePackageSelection(pkg.id, e.target.value as "monthly" | "quarterly" | "yearly")
                      }
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Plan</option>
                    <option value="monthly">Monthly - ₦{Math.round(pkg.monthlyPrice).toLocaleString('en-NG')}</option>
                    <option value="quarterly">Quarterly - ₦{Math.round(pkg.quarterlyPrice).toLocaleString('en-NG')}</option>
                    <option value="yearly">Yearly - ₦{Math.round(pkg.yearlyPrice).toLocaleString('en-NG')}</option>
                  </select>
                </div>

                <p className="text-gray-700 mb-6 text-sm">{pkg.description}</p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Users</label>
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
                      
                      // Real-time validation
                      if (pkg.maxUsers && value > pkg.maxUsers) {
                        setUserLimitError(`Number of users (${value}) exceeds the maximum allowed (${pkg.maxUsers}) for this package.`);
                      } else {
                        // Clear error if it was for this package
                        if (userLimitError && selectedPackages[pkg.id]) {
                          setUserLimitError(null);
                        }
                      }
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">Maximum allowed: {pkg.maxUsers || 1} users</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Services:</h4>
                  <div className="space-y-2">
                    {pkg.services.map((service, idx) => (
                      <div key={service.id} className="p-2 bg-gray-50 rounded">
                        <span className="text-sm">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="my-4 border-t-2 border-gray-500" />

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {selectedPackages[pkg.id]
                      ? `Selected: ${selectedPackages[pkg.id]} - ₦${Math.round(getBillingPrice(pkg, selectedPackages[pkg.id]!)).toLocaleString('en-NG')}`
                      : "Not selected"}
                  </span>
                  {selectedPackages[pkg.id] && (
                    <button
                      onClick={() => handlePackageSelection(pkg.id, selectedPackages[pkg.id]!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
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
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Organization Profile Setup</h3>
            
            {orgProfileSuccess ? (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                <p className="font-medium">Organization profile saved successfully!</p>
              </div>
            ) : (
              <>
                {orgProfileError && (
                  <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                    <p className="font-medium">Error: {orgProfileError}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* Business Type Selection */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Business Registration Status</h4>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="businessType"
                          checked={organizationProfile.businessType === 'registered'}
                          onChange={() => setOrganizationProfile({...organizationProfile, businessType: 'registered'})}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">Registered</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="businessType"
                          checked={organizationProfile.businessType === 'unregistered'}
                          onChange={() => setOrganizationProfile({...organizationProfile, businessType: 'unregistered'})}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">Unregistered</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Public Profile Selection */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Make Your Organization Profile Available to the Public?</h4>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublicProfile"
                          checked={organizationProfile.isPublicProfile === true}
                          onChange={() => setOrganizationProfile({...organizationProfile, isPublicProfile: true})}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublicProfile"
                          checked={organizationProfile.isPublicProfile === false}
                          onChange={() => setOrganizationProfile({...organizationProfile, isPublicProfile: false})}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Verification Status Selection - Only shown if public profile is Yes */}
                  {organizationProfile.isPublicProfile && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h4>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="verificationStatus"
                            checked={organizationProfile.verificationStatus === 'verified'}
                            onChange={() => setOrganizationProfile({...organizationProfile, verificationStatus: 'verified'})}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-gray-700">Verified</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="verificationStatus"
                            checked={organizationProfile.verificationStatus === 'unverified'}
                            onChange={() => setOrganizationProfile({...organizationProfile, verificationStatus: 'unverified'})}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-gray-700">Unverified</span>
                        </label>
                      </div>
                      
                      {/* Business Rules */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-2">Business Rules:</h5>
                        {organizationProfile.verificationStatus === 'verified' ? (
                          <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                            <li>Verified organizations can add more than one location</li>
                            <li>Each location can add up to 10 items (products/services) with pictures and two videos under the gallery</li>
                          </ul>
                        ) : (
                          <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                            <li>Unverified organizations can only add one location (headquarters)</li>
                            <li>The only allowed location can add 3 items (products)</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep('packages')}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
                  >
                    Back to Packages
                  </button>
                  <button
                    onClick={handleOrgProfileSubmit}
                    disabled={orgProfileSubmitting}
                    className={`px-6 py-3 rounded-lg font-semibold text-white ${orgProfileSubmitting ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {orgProfileSubmitting ? 'Saving...' : 'Continue to Locations'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Locations Form - Step 3 */}
        {currentStep === 'locations' && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add Locations</h3>
            
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
                                                newLocations[index].cityRegionFee = region.fee;
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
                              newLocations[index].landmark = e.target.value;
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
                              newLocations[index].buildingColor = e.target.value;
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
                              newLocations[index].buildingType = e.target.value;
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
                        landmark: '',
                        buildingColor: '',
                        buildingType: '',
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
                        // Save locations to organization profile
                        const orgProfileService = new OrganizationProfileService();
                        const profileResponse = await orgProfileService.addLocation(locations);
                        
                        if (profileResponse.success) {
                          setLocationSuccess(true);
                          setTimeout(() => {
                            setCurrentStep('payment');
                          }, 1500);
                        } else {
                          setLocationError(profileResponse.message || 'Failed to save locations');
                        }
                      } catch (error: any) {
                        setLocationError(error.message || 'An error occurred while saving locations');
                      } finally {
                        setLocationSubmitting(false);
                      }
                    }}
                    disabled={locationSubmitting}
                    className={`px-6 py-3 rounded-lg font-semibold text-white ${locationSubmitting ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {locationSubmitting ? 'Saving...' : 'Continue to Payment'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Payment Section - Step 4 */}
        {currentStep === 'payment' && Object.keys(selectedPackages).length > 0 && (
          <>
            <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Total Amount</h3>
                  <p className="text-sm opacity-90">For all selected packages</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <p className="text-4xl font-bold">₦{Math.round(totalAmount).toLocaleString('en-NG')}</p>
                  <p className="text-sm opacity-90">{Object.keys(selectedPackages).length} package(s)</p>
                </div>
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
                      Pay ₦{Math.round(totalAmount).toLocaleString('en-NG')}
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
