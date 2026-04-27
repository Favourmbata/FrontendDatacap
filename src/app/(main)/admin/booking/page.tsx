"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Filter, DollarSign, CheckCircle, XCircle, Clock, Loader2, 
  AlertCircle, MapPin, User, Mail, FileText, Plus, Search, ArrowLeft,
  ArrowRight, Users
} from 'lucide-react';
import BookingAdminService, { 
  AdminBooking, AvailableSlot, OrganizationUser, ServiceProvider, 
  LocationOption, CreateAdminBookingRequest 
} from '@/services/BookingAdminService';
import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';

interface GalleryServiceItem {
  _id: string;
  name: string;
  description: string;
  itemType: 'product' | 'service';
  priceInDollars: number;
  actualAmount: number;
  categoryName?: string;
  industryName?: string;
  imageUrl?: string;
}

type TabType = 'all' | 'pending' | 'confirmed' | 'accepted' | 'rejected' | 'completed';
type BookingStep = 'service-date' | 'customer' | 'details' | 'location' | 'review';

const AdminBookingsPage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  
  // View mode: 'list' or 'create'
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  
  // List view states
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [showAssignProviderModal, setShowAssignProviderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigningProvider, setAssigningProvider] = useState(false);
  const [selectedProviderForAssignment, setSelectedProviderForAssignment] = useState<string>('');
  const [newStatus, setNewStatus] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Create booking flow states
  const [currentStep, setCurrentStep] = useState<BookingStep>('service-date');
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  
  // Step 1: Service & Date Selection
  const [galleryServices, setGalleryServices] = useState<GalleryServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [selectedServicePrice, setSelectedServicePrice] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loadingDays, setLoadingDays] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  // Step 2: Customer Selection
  const [customerType, setCustomerType] = useState<'existing' | 'external'>('existing');
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<OrganizationUser | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [externalCustomerName, setExternalCustomerName] = useState('');
  const [externalCustomerEmail, setExternalCustomerEmail] = useState('');
  const [externalCustomerPhone, setExternalCustomerPhone] = useState('');

  // Step 3: Details (Service Provider & Guests)
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [guests, setGuests] = useState<Array<{ name: string; email: string; slotDateTime: string; notes?: string }>>([]);
  const [customerNotes, setCustomerNotes] = useState('');

  // Step 4: Location Selection
  const [locationOptions, setLocationOptions] = useState<{
    merchantLocation: LocationOption;
    customerAddress: LocationOption;
    newAddress: LocationOption;
    whatsappLocation: LocationOption;
  } | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Step 5: Review & Payment
  const [processPayment, setProcessPayment] = useState(true);
  const [paymentType, setPaymentType] = useState<'upfront' | 'full'>('upfront');
  const [upfrontPercentage, setUpfrontPercentage] = useState(50);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Load bookings list
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BookingAdminService.getAdminBookings(
        currentPage,
        20,
        activeTab === 'all' ? undefined : activeTab,
        dateFrom || undefined,
        dateTo || undefined
      );

      if (response.success) {
        setBookings(response.data.bookings);
        setTotalBookings(response.data.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab, dateFrom, dateTo]);

  useEffect(() => {
    if (viewMode === 'list') {
      fetchBookings();
    }
  }, [viewMode, fetchBookings]);

  // Load available days when month/year changes
  useEffect(() => {
    if (viewMode === 'create' && currentStep === 'service-date') {
      fetchAvailableDays();
    }
  }, [selectedMonth, selectedYear, selectedServiceId, viewMode, currentStep]);

  // Load available slots when date changes
  useEffect(() => {
    if (selectedDate && viewMode === 'create') {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedServiceId, viewMode]);

  // Load organization users when searching
  useEffect(() => {
    if (customerType === 'existing' && viewMode === 'create' && currentStep === 'customer') {
      const timeoutId = setTimeout(() => {
        fetchOrganizationUsers();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [customerSearch, customerType, viewMode, currentStep]);

  // Load gallery services for booking
  useEffect(() => {
    if (viewMode === 'create' && currentStep === 'service-date') {
      fetchGalleryServices();
    }
  }, [viewMode, currentStep]);

  // Load service providers
  useEffect(() => {
    if (viewMode === 'create' && currentStep === 'details') {
      fetchServiceProviders();
    }
  }, [selectedServiceId, viewMode, currentStep]);

  // Load location options
  useEffect(() => {
    if (viewMode === 'create' && currentStep === 'location') {
      fetchLocationOptions();
    }
  }, [selectedServiceId, viewMode, currentStep]);

  const fetchAvailableDays = async () => {
    try {
      setLoadingDays(true);
      const response = await BookingAdminService.getAvailableDays(
        selectedMonth,
        selectedYear,
        selectedServiceId || undefined
      );

      if (response.success) {
        setAvailableDays(response.data.availableDays);
      }
    } catch (err: any) {
      console.error('Error fetching available days:', err);
    } finally {
      setLoadingDays(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await BookingAdminService.getAvailableSlots(
        selectedDate,
        selectedServiceId || undefined
      );

      if (response.success) {
        setAvailableSlots(response.data.slots);
      }
    } catch (err: any) {
      console.error('Error fetching available slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchOrganizationUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await BookingAdminService.getOrganizationUsers(
        customerSearch || undefined,
        1,
        20
      );

      if (response.success) {
        console.log('Fetched organization users:', response.data.users);
        setOrganizationUsers(response.data.users);
      }
    } catch (err: any) {
      console.error('Error fetching organization users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchServiceProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await BookingAdminService.getServiceProviders(
        selectedServiceId || undefined
      );

      if (response.success) {
        setServiceProviders(response.data.providers);
      }
    } catch (err: any) {
      console.error('Error fetching service providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const fetchLocationOptions = async () => {
    try {
      setLoadingLocation(true);
      const response = await BookingAdminService.getLocationOptions(
        selectedServiceId || undefined
      );

      if (response.success) {
        setLocationOptions(response.data.locationOptions);
        setSelectedLocationType(response.data.defaultOption);
      }
    } catch (err: any) {
      console.error('Error fetching location options:', err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchGalleryServices = async () => {
    try {
      setLoadingServices(true);
      const response = await GalleryService.getGalleryItems(
        token || '',
        1,
        100, // Get all services
        undefined, // category
        undefined, // search
        undefined, // minPrice
        undefined, // maxPrice
        undefined, // startDate
        undefined, // endDate
        'createdAt',
        'desc',
        undefined, // visibilityToPublic
        undefined, // industryId
        undefined, // categoryId
        undefined, // locationIndex
        'service' // itemType - filter for services only
      );

      if (response.success && response.data) {
        // Map GalleryItem to GalleryServiceItem with actualAmount calculation
        const services: GalleryServiceItem[] = response.data.items.map((item: any) => ({
          _id: item._id,
          name: item.name,
          description: item.description,
          itemType: item.itemType,
          priceInDollars: item.priceInDollars,
          actualAmount: item.actualAmount || item.priceInDollars,
          categoryName: item.categoryName,
          industryName: item.industryName,
          imageUrl: item.imageUrl
        }));
        setGalleryServices(services);
      }
    } catch (err: any) {
      console.error('Error fetching gallery services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleViewDetails = async (booking: AdminBooking) => {
    try {
      setSelectedBooking(booking);
      setShowDetailsModal(true);
      
      // Fetch latest booking details
      const response = await BookingAdminService.getAdminBooking(booking.bookingId);
      if (response.success) {
        setSelectedBooking(response.data.booking);
      }

      // Fetch service providers for assignment
      const providersResponse = await BookingAdminService.getServiceProviders();
      if (providersResponse.success) {
        setServiceProviders(providersResponse.data.providers);
      }
    } catch (err: any) {
      console.error('Error fetching booking details:', err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (!selectedBooking || !newStatus) {
        alert('Please select a status');
        return;
      }

      setUpdatingStatus(true);
      
      const response = await BookingAdminService.updateBookingStatus(
        selectedBooking.bookingId,
        {
          status: newStatus,
          newDate: newDate || undefined,
          newTime: newTime || undefined,
          adminNotes: adminNotes || undefined
        }
      );

      if (response.success) {
        // Fetch updated booking details
        const bookingResponse = await BookingAdminService.getAdminBooking(selectedBooking.bookingId);
        if (bookingResponse.success) {
          setSelectedBooking(bookingResponse.data.booking);
        }
        setShowStatusUpdateModal(false);
        // Refresh bookings list
        fetchBookings();
        // Reset form
        setNewStatus('');
        setNewDate('');
        setNewTime('');
        setAdminNotes('');
      } else {
        alert(response.message || 'Failed to update booking status');
      }
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignProvider = async () => {
    try {
      if (!selectedBooking || !selectedProviderForAssignment) {
        alert('Please select a service provider');
        return;
      }

      setAssigningProvider(true);
      
      const response = await BookingAdminService.assignServiceProvider(
        selectedBooking.bookingId,
        {
          serviceProviderId: selectedProviderForAssignment
        }
      );

      if (response.success) {
        // Fetch updated booking details
        const bookingResponse = await BookingAdminService.getAdminBooking(selectedBooking.bookingId);
        if (bookingResponse.success) {
          setSelectedBooking(bookingResponse.data.booking);
        }
        setShowAssignProviderModal(false);
        // Refresh bookings list
        fetchBookings();
        // Reset form
        setSelectedProviderForAssignment('');
        alert(`Service provider "${response.data.provider.name}" assigned successfully!`);
      } else {
        alert(response.message || 'Failed to assign service provider');
      }
    } catch (err: any) {
      console.error('Error assigning service provider:', err);
      alert(err.message || 'Failed to assign service provider');
    } finally {
      setAssigningProvider(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      setCreatingBooking(true);
      setStepError(null);

      if (!selectedServiceId || !selectedSlot) {
        setStepError('Please select service and time slot');
        return;
      }

      if (customerType === 'existing' && !selectedCustomer) {
        setStepError('Please select a customer');
        return;
      }

      if (customerType === 'external' && (!externalCustomerName || !externalCustomerEmail)) {
        setStepError('Please provide customer name and email');
        return;
      }

      // Debug logging
      console.log('Creating booking with customer:', {
        customerType,
        selectedCustomer,
        customerId: selectedCustomer?.customUserId
      });

      if (customerType === 'existing' && !selectedCustomer?.customUserId) {
        setStepError('Selected customer is missing ID. Please select the customer again.');
        return;
      }

      const location = {
        type: selectedLocationType as any,
        address: locationAddress || undefined,
        whatsappLocationUrl: whatsappUrl || undefined
      };

      const bookingData: CreateAdminBookingRequest = {
        serviceId: selectedServiceId,
        serviceName: selectedServiceName,
        servicePrice: selectedServicePrice,
        customerType,
        customerId: customerType === 'existing' ? selectedCustomer?.customUserId : undefined,
        customerName: customerType === 'external' ? externalCustomerName : selectedCustomer?.name,
        customerEmail: customerType === 'external' ? externalCustomerEmail : selectedCustomer?.email,
        customerPhone: customerType === 'external' ? externalCustomerPhone : selectedCustomer?.phoneNumber,
        primarySlot: selectedSlot,
        guests: guests.length > 0 ? guests : undefined,
        location,
        customerNotes: customerNotes || undefined,
        serviceProviderId: selectedProvider?.id,
        processPayment,
        paymentType: processPayment ? paymentType : undefined,
        upfrontPercentage: processPayment && paymentType === 'upfront' ? upfrontPercentage : undefined
      };

      console.log('Booking data being sent:', bookingData);

      const response = await BookingAdminService.createAdminBooking(bookingData);

      if (response.success) {
        setCreatedBooking(response.data.booking);
      } else {
        setStepError(response.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Error creating booking:', err);
      console.error('Error details:', {
        message: err.message,
        customerType,
        customerId: selectedCustomer?.customUserId,
        customerName: selectedCustomer?.name
      });
      setStepError(err.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getLocationLabel = (type: string): string => {
    const labels: Record<string, string> = {
      merchant_location: 'Provider Location',
      customer_address: 'Customer Address',
      new_address: 'Custom Address',
      whatsapp_location: 'WhatsApp Location'
    };
    return labels[type] || type;
  };

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const resetCreateFlow = () => {
    setViewMode('list');
    setCurrentStep('service-date');
    setSelectedServiceId('');
    setSelectedServiceName('');
    setSelectedServicePrice(0);
    setSelectedDate('');
    setSelectedSlot('');
    setSelectedCustomer(null);
    setSelectedProvider(null);
    setGuests([]);
    setCustomerNotes('');
    setSelectedLocationType('');
    setLocationAddress('');
    setWhatsappUrl('');
    setCreatedBooking(null);
    setStepError(null);
  };

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case 'service-date':
        return !!(selectedServiceId && selectedDate && selectedSlot);
      case 'customer':
        if (customerType === 'existing') return !!selectedCustomer;
        return !!(externalCustomerName && externalCustomerEmail);
      case 'details':
        return true;
      case 'location':
        if (selectedLocationType === 'new_address') return !!locationAddress;
        if (selectedLocationType === 'whatsapp_location') return !!whatsappUrl;
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const steps: BookingStep[] = ['service-date', 'customer', 'details', 'location', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: BookingStep[] = ['service-date', 'customer', 'details', 'location', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Loading state
  if (loading && viewMode === 'list') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Create booking flow
  if (viewMode === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={resetCreateFlow}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bookings
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Booking</h1>
            <p className="text-gray-600">Step-by-step booking creation</p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              {['service-date', 'customer', 'details', 'location', 'review'].map((step, index) => {
                const steps = ['service-date', 'customer', 'details', 'location', 'review'];
                const currentIndex = steps.indexOf(currentStep);
                const stepIndex = steps.indexOf(step);
                const isActive = step === currentStep;
                const isCompleted = stepIndex < currentIndex;

                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-purple-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>
                    {stepIndex < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Date & Time</span>
              <span>Customer</span>
              <span>Details</span>
              <span>Location</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step Error */}
          {stepError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{stepError}</p>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Step 1: Service & Date */}
            {currentStep === 'service-date' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Select Service, Date & Time</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service (from Gallery)
                  </label>
                  {loadingServices ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {galleryServices.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg">
                          No services available in gallery
                        </div>
                      ) : (
                        galleryServices.map(service => (
                          <button
                            key={service._id}
                            onClick={() => {
                              setSelectedServiceId(service._id);
                              setSelectedServiceName(service.name);
                              setSelectedServicePrice(service.actualAmount || service.priceInDollars);
                            }}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              selectedServiceId === service._id
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                                {service.categoryName && (
                                  <div className="text-xs text-gray-500 mt-1">Category: {service.categoryName}</div>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-purple-600">
                                  ₦{(service.actualAmount || service.priceInDollars).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('en', { month: 'long' })}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {[2024, 2025, 2026].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days {loadingDays && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {availableDays.map(day => {
                      const date = new Date(day);
                      const isSelected = selectedDate === day;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(day)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-sm font-medium">{date.getDate()}</div>
                          <div className="text-xs text-gray-500">
                            {date.toLocaleString('en', { weekday: 'short' })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots {loadingSlots && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.datetime}
                          onClick={() => setSelectedSlot(slot.datetime)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedSlot === slot.datetime
                              ? 'border-purple-600 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {slot.displayTime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Customer */}
            {currentStep === 'customer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Select Customer</h2>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setCustomerType('existing')}
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      customerType === 'existing'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">Existing Customer</div>
                    <div className="text-sm text-gray-600">Select from organization</div>
                  </button>
                  <button
                    onClick={() => setCustomerType('external')}
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      customerType === 'external'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">External Customer</div>
                    <div className="text-sm text-gray-600">Enter new customer details</div>
                  </button>
                </div>

                {customerType === 'existing' && (
                  <div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    {loadingUsers && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                      </div>
                    )}

                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                      {organizationUsers.map(user => (
                        <button
                          key={user.customUserId}
                          onClick={() => setSelectedCustomer(user)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedCustomer?.customUserId === user.customUserId
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          {user.customUserId && (
                            <div className="text-xs text-gray-500">ID: {user.customUserId}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {customerType === 'external' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={externalCustomerName}
                        onChange={(e) => setExternalCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={externalCustomerEmail}
                        onChange={(e) => setExternalCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={externalCustomerPhone}
                        onChange={(e) => setExternalCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 'details' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Provider (Optional) {loadingProviders && <Loader2 className="w-4 h-4 animate-spin inline ml-2" />}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {serviceProviders.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedProvider?.id === provider.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-600">{provider.email}</div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="text-yellow-600">★ {provider.rating}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{provider.completedTasks} tasks</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Guests (Optional)</label>
                    <button
                      onClick={() => setGuests([...guests, { name: '', email: '', slotDateTime: selectedSlot }])}
                      className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-4 h-4" /> Add Guest
                    </button>
                  </div>
                  
                  {guests.map((guest, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => {
                            const newGuests = [...guests];
                            newGuests[index].name = e.target.value;
                            setGuests(newGuests);
                          }}
                          placeholder="Guest name"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="email"
                          value={guest.email}
                          onChange={(e) => {
                            const newGuests = [...guests];
                            newGuests[index].email = e.target.value;
                            setGuests(newGuests);
                          }}
                          placeholder="Guest email"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Notes</label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    placeholder="Special instructions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 'location' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Select Location</h2>
                
                {loadingLocation && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  </div>
                )}

                {locationOptions && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedLocationType('merchant_location')}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedLocationType === 'merchant_location'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium">{locationOptions.merchantLocation.label}</div>
                      <div className="text-sm text-gray-600">{locationOptions.merchantLocation.address}</div>
                    </button>

                    <button
                      onClick={() => setSelectedLocationType('customer_address')}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedLocationType === 'customer_address'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-medium">{locationOptions.customerAddress.label}</div>
                      <div className="text-sm text-gray-600">{locationOptions.customerAddress.description}</div>
                    </button>

                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      selectedLocationType === 'new_address'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}>
                      <button
                        onClick={() => setSelectedLocationType('new_address')}
                        className="w-full text-left"
                      >
                        <div className="font-medium">{locationOptions.newAddress.label}</div>
                        <div className="text-sm text-gray-600">{locationOptions.newAddress.description}</div>
                      </button>
                      {selectedLocationType === 'new_address' && (
                        <input
                          type="text"
                          value={locationAddress}
                          onChange={(e) => setLocationAddress(e.target.value)}
                          placeholder={locationOptions.newAddress.placeholder}
                          className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      )}
                    </div>

                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      selectedLocationType === 'whatsapp_location'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}>
                      <button
                        onClick={() => setSelectedLocationType('whatsapp_location')}
                        className="w-full text-left"
                      >
                        <div className="font-medium">{locationOptions.whatsappLocation.label}</div>
                        <div className="text-sm text-gray-600">{locationOptions.whatsappLocation.description}</div>
                      </button>
                      {selectedLocationType === 'whatsapp_location' && (
                        <input
                          type="url"
                          value={whatsappUrl}
                          onChange={(e) => setWhatsappUrl(e.target.value)}
                          placeholder={locationOptions.whatsappLocation.placeholder}
                          className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Review & Payment */}
            {currentStep === 'review' && !createdBooking && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review & Create Booking</h2>
                
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Service:</span>
                      <p className="font-medium">{selectedServiceName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date & Time:</span>
                      <p className="font-medium">{formatDate(selectedSlot)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <p className="font-medium">
                        {customerType === 'existing' ? selectedCustomer?.name : externalCustomerName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{getLocationLabel(selectedLocationType)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Persons:</span>
                      <p className="font-medium">{1 + guests.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Service Fee:</span>
                      <p className="font-medium">{formatCurrency(selectedServicePrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="processPayment"
                      checked={processPayment}
                      onChange={(e) => setProcessPayment(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="processPayment" className="text-sm font-medium">Process Payment</label>
                  </div>

                  {processPayment && (
                    <div className="space-y-3 pl-7">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setPaymentType('upfront')}
                          className={`flex-1 p-3 rounded-lg border-2 ${
                            paymentType === 'upfront'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="font-medium">Upfront Payment</div>
                          <div className="text-sm text-gray-600">Partial payment required</div>
                        </button>
                        <button
                          onClick={() => setPaymentType('full')}
                          className={`flex-1 p-3 rounded-lg border-2 ${
                            paymentType === 'full'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="font-medium">Full Payment</div>
                          <div className="text-sm text-gray-600">Complete amount</div>
                        </button>
                      </div>

                      {paymentType === 'upfront' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upfront Percentage: {upfrontPercentage}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={upfrontPercentage}
                            onChange={(e) => setUpfrontPercentage(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-600 mt-1">
                            Amount: {formatCurrency((selectedServicePrice * upfrontPercentage) / 100)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateBooking}
                  disabled={creatingBooking}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Booking'
                  )}
                </button>
              </div>
            )}

            {currentStep === 'review' && createdBooking && (
              <div className="space-y-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <h2 className="text-2xl font-semibold text-green-700">Booking Created Successfully!</h2>
                
                <div className="p-6 bg-gray-50 rounded-lg text-left space-y-3">
                  {createdBooking.bookingId && (
                    <div>
                      <span className="text-gray-600">Booking ID:</span>
                      <p className="font-mono font-bold">{createdBooking.bookingId}</p>
                    </div>
                  )}
                  {createdBooking.orderId && (
                    <div>
                      <span className="text-gray-600">Order ID:</span>
                      <p className="font-mono font-bold">{createdBooking.orderId}</p>
                    </div>
                  )}
                  {createdBooking.taskId && (
                    <div>
                      <span className="text-gray-600">Task ID:</span>
                      <p className="font-mono font-bold">{createdBooking.taskId}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium capitalize">{createdBooking.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Persons:</span>
                    <p className="font-medium">{createdBooking.totalPersons || 1}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-medium">{formatCurrency(createdBooking.fee || selectedServicePrice)}</p>
                  </div>
                  {createdBooking.assignedProvider && (
                    <div>
                      <span className="text-gray-600">Service Provider:</span>
                      <p className="font-medium">{createdBooking.assignedProvider}</p>
                    </div>
                  )}
                  {createdBooking.location && (
                    <div>
                      <span className="text-gray-600">Location Type:</span>
                      <p className="font-medium">{getLocationLabel(createdBooking.location.type)}</p>
                    </div>
                  )}
                  {createdBooking.paymentLink && (
                    <div>
                      <a
                        href={createdBooking.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Proceed to Payment
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={resetCreateFlow}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Back to Bookings
                </button>
              </div>
            )}

            {currentStep !== 'review' && (
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={prevStep}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceedToNextStep()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">View and manage all service bookings</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/booking/assign-provider"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Assign Providers
            </a>
            <button
              onClick={() => setViewMode('create')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Booking
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'all' as TabType, label: 'All Bookings', count: totalBookings },
                { id: 'pending' as TabType, label: 'Pending' },
                { id: 'confirmed' as TabType, label: 'Confirmed' },
                { id: 'accepted' as TabType, label: 'Accepted' },
                { id: 'rejected' as TabType, label: 'Rejected' },
                { id: 'completed' as TabType, label: 'Completed' },
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-1 text-xs">({count})</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persons</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}

                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-xs">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">{booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.slotDateTime)}</td>
                    <td className="px-4 py-3 text-sm text-center">{booking.totalPersons}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(booking.fee)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        {getLocationLabel(booking.location.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalBookings)} of {totalBookings} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
              
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="text-lg font-mono font-bold">{selectedBooking.bookingId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Service Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Service Name</p>
                    <p className="font-medium">{selectedBooking.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-medium">{selectedBooking.organizationName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium">{formatDate(selectedBooking.slotDateTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fee</p>
                    <p className="font-medium text-purple-600">{formatCurrency(selectedBooking.fee)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Persons</p>
                    <p className="font-medium">{selectedBooking.totalPersons}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{getLocationLabel(selectedBooking.location.type)}</p>
                  {selectedBooking.location.address && (
                    <p className="text-sm text-gray-600 mt-1">{selectedBooking.location.address}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProviderForAssignment(selectedBooking.serviceProviderId || '');
                    setShowAssignProviderModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Assign Provider
                </button>
                <button
                  onClick={() => {
                    setNewStatus(selectedBooking.status);
                    setShowStatusUpdateModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusUpdateModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Update Booking Status</h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-mono font-bold">{selectedBooking.bookingId}</p>
                <p className="text-sm text-gray-600 mt-2">Current Status</p>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>

                {(newStatus === 'rescheduled' || newStatus === 'confirmed') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes about this status change..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !newStatus}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowStatusUpdateModal(false);
                    setNewStatus('');
                    setNewDate('');
                    setNewTime('');
                    setAdminNotes('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Provider Modal */}
      {showAssignProviderModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Assign Service Provider</h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-mono font-bold">{selectedBooking.bookingId}</p>
                <p className="text-sm text-gray-600 mt-2">Service</p>
                <p className="font-medium">{selectedBooking.serviceName}</p>
                {selectedBooking.serviceProviderId && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">Current Provider</p>
                    <p className="font-medium text-green-600">Already Assigned</p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Provider *</label>
                  {loadingProviders ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : serviceProviders.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg">
                      No service providers available
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {serviceProviders.map(provider => (
                        <button
                          key={provider.id}
                          onClick={() => setSelectedProviderForAssignment(provider.id)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedProviderForAssignment === provider.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-sm text-gray-600">{provider.email}</div>
                              {provider.phoneNumber && (
                                <div className="text-xs text-gray-500 mt-1">{provider.phoneNumber}</div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-yellow-600">★ {provider.rating}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">{provider.completedTasks} tasks</span>
                              </div>
                              <div className={`text-xs mt-1 ${provider.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {provider.isAvailable ? 'Available' : 'Busy'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAssignProvider}
                  disabled={assigningProvider || !selectedProviderForAssignment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {assigningProvider ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Provider'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowAssignProviderModal(false);
                    setSelectedProviderForAssignment('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
