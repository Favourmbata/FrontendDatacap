





"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
  Users,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingService, {
  ServiceItem,
  TimeSlot,
  LocationOption,
  BookingLocation,
} from "@/services/BookingService";

interface Product {
  productName: string;
  producer: string;
  address: string;
  actualAmount: number;
  contact?: { phone?: string; email?: string };
}

interface Guest {
  id: number;
  name: string;
  email: string;
}

interface SubService {
  subServiceId: string;
  name: string;
  description: string;
  code: string;
  price: number;
  imageUrl?: string;
}

interface GuestWithPhone {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  slotDateTime: string;
  selectedSubServices?: {
    subServiceId: string;
    name: string;
    code: string;
    price: number;
  }[];
  individualTotal?: number;
}

type LocationType = "merchant_location" | "customer_address" | "new_address" | "whatsapp_location";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function availabilityStatus(avail: number): "full" | "low" | "ok" {
  if (avail === 0) return "full";
  if (avail <= 3) return "low";
  return "ok";
}

function AvailabilityDot({ avail }: { avail: number }) {
  const status = availabilityStatus(avail);
  const color =
    status === "full" ? "#A32D2D" : status === "low" ? "#BA7517" : "#3B6D11";
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  );
}

function StepDots({ step }: { step: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        padding: "10px 0 4px",
      }}
    >
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: n <= step ? "#5d2a8b" : "#e0d6f5",
            transition: "background 0.2s",
          }}
        />
      ))}
    </div>
  );
}

const BookAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params
  const organizationId = searchParams.get("organizationId") || "";
  const serviceId = searchParams.get("serviceId") || "";

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // API uses 1-12
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [primaryGuest, setPrimaryGuest] = useState({ name: "", email: "", phone: "" });
  const [extraGuests, setExtraGuests] = useState<Guest[]>([]);

  const [locationType, setLocationType] = useState<LocationType>("merchant_location");
  const [newAddress, setNewAddress] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [locationOptions, setLocationOptions] = useState<{
    merchantLocation?: LocationOption;
    customerAddress?: LocationOption;
    newAddress?: LocationOption;
    whatsappLocation?: LocationOption;
  } | null>(null);

  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sub-service state
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [selectedSubServices, setSelectedSubServices] = useState<Record<number, SubService[]>>({ });
  const [pricingBreakdown, setPricingBreakdown] = useState<any>(null);

  // Load service details from localStorage (passed from body-care page)
  useEffect(() => {
    const loadService = () => {
      if (!organizationId) {
        setError("Organization ID is required");
        setLoading(false);
        return;
      }

      try {
        const appointmentDataStr = localStorage.getItem('appointmentProduct');
        
        if (appointmentDataStr) {
          const appointmentData = JSON.parse(appointmentDataStr);
          
          let serviceData: ServiceItem;
          
          // Check if it's a sub-service or main service
          if (appointmentData.isSubService && appointmentData.selectedSubService) {
            const subService = appointmentData.selectedSubService;
            serviceData = {
              id: serviceId || subService.subPlatformUniqueCode || '',
              name: subService.name || appointmentData.name || 'Service',
              description: subService.description || appointmentData.description || '',
              price: subService.price || appointmentData.price || 0,
              duration: subService.duration || 60,
              hasAvailability: true,
              imageUrl: '',
              hasSubServices: false,
              subServices: [],
            };
          } else {
            // Main service
            serviceData = {
              id: serviceId || appointmentData.productId || '',
              name: appointmentData.name || 'Service',
              description: appointmentData.description || '',
              price: appointmentData.price || appointmentData.actualAmount || 0,
              duration: appointmentData.duration || 60,
              hasAvailability: true,
              imageUrl: appointmentData.imageUrl || '',
              hasSubServices: appointmentData.hasSubServices || false,
              subServices: appointmentData.subServices || [],
            };
          }
          
          setService(serviceData);
        } else {
          setError('No service data found. Please select a service first.');
        }
      } catch (err: any) {
        console.error('Error loading service data:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [organizationId, serviceId]);

  // Fetch location options
  useEffect(() => {
    const fetchLocationOptions = async () => {
      if (!organizationId) return;

      try {
        const response = await BookingService.getLocationOptions({
          organizationId,
          serviceId: serviceId || undefined,
        });

        if (response.success) {
          setLocationOptions(response.data.locationOptions);
          setLocationOptions(response.data.locationOptions);
          // Set default location type
          const defaultOpt = response.data.defaultOption;
          if (defaultOpt === "merchant_location") setLocationType("merchant_location");
          else if (defaultOpt === "customer_address") setLocationType("customer_address");
          else if (defaultOpt === "new_address") setLocationType("new_address");
          else if (defaultOpt === "whatsapp_location") setLocationType("whatsapp_location");
        }
      } catch (err) {
        console.error("Error fetching location options:", err);
      }
    };

    if (service) {
      fetchLocationOptions();
    }
  }, [organizationId, serviceId, service]);

  // Fetch sub-services when service is loaded
  useEffect(() => {
    const fetchSubServices = async () => {
      if (!service || !organizationId) return;
      
      try {
        const response = await fetch(`https://datacapture-backend.onrender.com/api/orders/public/services/${service.id}/sub-services`);
        const result = await response.json();
        if (result.success) {
          setSubServices(result.data.subServices);
        }
      } catch (err) {
        console.error('Error fetching sub-services:', err);
      }
    };
    
    if (service) {
      fetchSubServices();
    }
  }, [service, organizationId]);

  // Fetch available days when month/year changes
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAvailableDays = async () => {
      if (!organizationId) return;

      try {
        const response = await BookingService.getAvailableDays({
          organizationId,
          month: viewMonth,
          year: viewYear,
          serviceId: serviceId || undefined,
        });

        if (response.success) {
          // Convert to Set for faster lookup
          const daysSet = new Set(response.data.availableDays);
          setAvailableDays(daysSet);
        }
      } catch (err) {
        console.error("Error fetching available days:", err);
      }
    };

    fetchAvailableDays();
  }, [organizationId, viewMonth, viewYear, serviceId]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate || !organizationId) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const response = await BookingService.getAvailableSlots({
          organizationId,
          date: selectedDate,
          serviceId: serviceId || undefined,
        });

        if (response.success) {
          setSlots(response.data.slots);
          setSelectedSlot(null);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, organizationId, serviceId]);

  const firstDayOfMonth = useCallback(() => {
    const d = new Date(viewYear, viewMonth - 1, 1).getDay(); // month - 1 because JS uses 0-11
    return d === 0 ? 6 : d - 1;
  }, [viewMonth, viewYear]);

  const daysInMonth = useCallback(
    () => new Date(viewYear, viewMonth, 0).getDate(),
    [viewMonth, viewYear]
  );

  const isAvailable = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDays.has(dateStr);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() + 1 &&
    viewYear === today.getFullYear();

  const isSelected = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDate === dateStr;
  };

  function selectDay(day: number) {
    if (!isAvailable(day)) return;
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
  }

  function addGuest() {
    setExtraGuests((prev) => [
      ...prev,
      { id: Date.now(), name: "", email: "" },
    ]);
  }

  function removeGuest(id: number) {
    setExtraGuests((prev) => prev.filter((g) => g.id !== id));
  }

  function updateGuest(id: number, field: "name" | "email", value: string) {
    setExtraGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  }

  const totalPeople = 1 + extraGuests.length;
  const serviceAmount = service?.price ?? 0;
  const serviceDuration = service?.duration ?? 60;
  const depositPercent = 0.1;
  const depositAmount = serviceAmount * depositPercent;
  const balance = serviceAmount - depositAmount;
  const discountOnBalance = 0.05;

  // Real-time pricing calculation
  const calculatePricing = async () => {
    if (!service || !organizationId || !selectedDate || !selectedSlot) return;
    
    try {
      // Ensure at least the primary guest is included
      const bookedForPersons = [
        {
          name: primaryGuest.name || 'Primary Guest',
          selectedSubServices: selectedSubServices[0] || []
        },
        ...extraGuests.filter(guest => guest.name && guest.name.trim()).map((guest, index) => ({
          name: guest.name || `Guest ${index + 1}`,
          selectedSubServices: selectedSubServices[guest.id] || []
        }))
      ];
      
      // Ensure at least one person is booked
      if (bookedForPersons.length === 0) {
        bookedForPersons.push({
          name: primaryGuest.name || 'Primary Guest',
          selectedSubServices: selectedSubServices[0] || []
        });
      }
      
      const response = await fetch('https://datacapture-backend.onrender.com/api/orders/public/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          organizationId,
          paymentType: 'full',
          bookedForPersons
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setPricingBreakdown(result.data);
        // Update UI with pricing breakdown
        updatePricingUI(result.data);
      }
    } catch (err) {
      console.error('Error calculating pricing:', err);
      setError('Failed to calculate pricing. Please try again.');
    }
  };

  const updatePricingUI = (pricingData: any) => {
    // Update UI with pricing breakdown
    // This will be called when pricing calculation completes
  };

  async function handleConfirm() {
    if (!service || !selectedDate || !selectedSlot) {
      alert("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build booking location object
      let bookingLocation: BookingLocation;
      switch (locationType) {
        case "merchant_location":
          bookingLocation = { type: "merchant_location" };
          break;
        case "customer_address":
          bookingLocation = { type: "customer_address" };
          break;
        case "new_address":
          bookingLocation = {
            type: "new_address",
            address: newAddress || "",
          };
          break;
        case "whatsapp_location":
          bookingLocation = {
            type: "whatsapp_location",
            whatsappLocationUrl: whatsappLink || "",
          };
          break;
        default:
          bookingLocation = { type: "merchant_location" };
      }
      
      // Ensure booking location is properly defined
      if (!bookingLocation || typeof bookingLocation !== 'object') {
        bookingLocation = { type: "merchant_location" };
      }

      // Parse name into first/last
      const nameParts = primaryGuest.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;

      // Build booked persons array
      const bookedForPersons: GuestWithPhone[] = [
        {
          name: primaryGuest.name,
          firstName,
          lastName,
          email: primaryGuest.email,
          phone: primaryGuest.phone,
          slotDateTime: selectedSlot.datetime,
          selectedSubServices: selectedSubServices[0] || [],
          individualTotal: pricingBreakdown?.individualBreakdowns?.[0]?.individualTotal
        },
        ...extraGuests.map((guest, index) => {
          const guestNameParts = guest.name.trim().split(" ");
          return {
            name: guest.name,
            firstName: guestNameParts[0] || "",
            lastName: guestNameParts.slice(1).join(" ") || "Guest",
            email: guest.email,
            slotDateTime: selectedSlot.datetime,
            selectedSubServices: selectedSubServices[guest.id] || [],
            individualTotal: pricingBreakdown?.individualBreakdowns?.[index + 1]?.individualTotal
          };
        }),
      ];

      // Get user ID from localStorage if available
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      let userId: string | undefined;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.userId || payload.id;
        } catch (e) {
          console.error("Error parsing token:", e);
        }
      }

      // Initiate payment
      const paymentRequest = {
        productId: service.id,
        productName: service.name,
        organizationId,
        organizationName: locationOptions?.merchantLocation?.address || "",
        productPrice: serviceAmount,
        upfrontPercentage: 100, // Full payment for now
        userId,
        customerEmail: primaryGuest.email,
        customerName: primaryGuest.name,
        customerPhone: primaryGuest.phone,
        paymentType: "full" as const,
        itemType: "service" as const,
        platform: "web" as const,
        bookingDate: selectedDate,
        bookingTime: selectedSlot.time,
        bookingDuration: serviceDuration,
        bookingLocation,
        bookedForPersons,
        bookingNotes: notes || undefined,
      };

      console.log("Booking payload:", paymentRequest);

      const response = await BookingService.initiatePayment(paymentRequest);

      if (response.success && response.data.link) {
        // Redirect to Flutterwave payment page
        window.location.href = response.data.link;
      } else {
        alert("Failed to initiate payment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "Failed to process booking. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f5ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2
            size={40}
            style={{ animation: "spin 1s linear infinite", color: "#5d2a8b", margin: "0 auto 16px" }}
          />
          <p style={{ color: "#666" }}>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f5ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: 16 }}>
            {error || "No service selected for booking."}
          </p>
          <button
            onClick={() => router.back()}
            style={{
              color: "#5d2a8b",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const divider: React.CSSProperties = {
    borderBottom: "0.5px solid #e8e0f5",
  };

  const sectionPad: React.CSSProperties = {
    padding: "1.25rem 1.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "0.5px solid #d0c4e8",
    borderRadius: 8,
    fontSize: 14,
    background: "#fff",
    color: "#1a1a2e",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  };

  const confirmBtnStyle: React.CSSProperties = {
    width: "100%",
    background: isSubmitting ? "#9b6dc0" : "#5d2a8b",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 600,
    cursor: isSubmitting ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background 0.15s",
  };

  const calDays: React.ReactNode[] = [];
  for (let blank = 0; blank < firstDayOfMonth(); blank++) {
    calDays.push(<div key={`b${blank}`} />);
  }
  for (let d = 1; d <= daysInMonth(); d++) {
    const avail = isAvailable(d);
    const sel = isSelected(d);
    const tod = isToday(d);
    calDays.push(
      <div
        key={d}
        onClick={() => selectDay(d)}
        style={{
          aspectRatio: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          fontSize: 13,
          fontWeight: avail ? 500 : 400,
          cursor: avail ? "pointer" : "default",
          color: sel
            ? "#fff"
            : avail
            ? "#1a1a2e"
            : "#ccc",
          background: sel ? "#5d2a8b" : "transparent",
          border: tod && !sel ? "1.5px solid #5d2a8b" : "none",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (avail && !sel)
            (e.currentTarget as HTMLDivElement).style.background = "#ede0fa";
        }}
        onMouseLeave={(e) => {
          if (!sel)
            (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        {d}
      </div>
    );
  }

  const dateLabelStr = selectedDate
    ? (() => {
        const [year, month, day] = selectedDate.split("-");
        return `${parseInt(day)} ${MONTHS[parseInt(month) - 1].slice(0, 3)} ${year}`;
      })()
    : "";

  const RadioOption = ({
    value,
    label,
    sublabel,
    children,
  }: {
    value: LocationType;
    label: string;
    sublabel?: string;
    children?: React.ReactNode;
  }) => {
    const active = locationType === value;
    return (
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "10px 12px",
          border: active ? "1.5px solid #5d2a8b" : "0.5px solid #e0d6f5",
          borderRadius: 10,
          cursor: "pointer",
          background: active ? "#faf6ff" : "#fff",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onClick={() => setLocationType(value)}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: active ? "5px solid #5d2a8b" : "1.5px solid #bbb",
            flexShrink: 0,
            marginTop: 2,
            transition: "border 0.15s",
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: "#1a1a2e" }}>{label}</div>
          {sublabel && !active && (
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {sublabel}
            </div>
          )}
          {active && children}
        </div>
      </label>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f5ff",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          marginLeft: 0,
          paddingTop: 24,
          padding: "24px 32px",
        }}
        className="md:ml-[350px]"
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              border: "0.5px solid #e0d6f5",
              boxShadow: "0 4px 24px rgba(93,42,139,0.07)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #5d2a8b 0%, #7a3aa3 100%)",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                onClick={() => (step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back())}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
                  {step === 1
                    ? "Select a day"
                    : step === 2
                    ? "Your details"
                    : step === 3
                    ? "Confirm booking"
                    : "Booking confirmed"}
                </div>
              </div>
              <div style={{ width: 32 }} />
            </div>

            {step < 4 && <StepDots step={step} />}

            {step === 1 && (
              <>
                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 600, fontSize: 16, color: "#1a1a2e" }}
                  >
                    {service.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#888",
                      marginTop: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#5d2a8b",
                          display: "inline-block",
                        }}
                      />
                      {service.name}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={12} />{service.duration || 60} min
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={12} />
                      10 providers
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 8,
                    }}
                  >
                    <Globe size={12} style={{ color: "#888" }} />
                    <select
                      style={{
                        fontSize: 12,
                        border: "none",
                        background: "none",
                        color: "#888",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option>West Africa Time (WAT)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (CET)</option>
                    </select>
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <button
                      onClick={() => {
                        if (viewMonth === 0) {
                          setViewMonth(11);
                          setViewYear((y) => y - 1);
                        } else {
                          setViewMonth((m) => m - 1);
                        }
                      }}
                      style={{
                        background: "none",
                        border: "0.5px solid #e0d6f5",
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#5d2a8b",
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                      {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <button
                      onClick={() => {
                        if (viewMonth === 11) {
                          setViewMonth(0);
                          setViewYear((y) => y + 1);
                        } else {
                          setViewMonth((m) => m + 1);
                        }
                      }}
                      style={{
                        background: "none",
                        border: "0.5px solid #e0d6f5",
                        borderRadius: "50%",
                        width: 30,
                        height: 30,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#5d2a8b",
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7,1fr)",
                      marginBottom: 4,
                    }}
                  >
                    {DAYS.map((d) => (
                      <div
                        key={d}
                        style={{
                          textAlign: "center",
                          fontSize: 11,
                          color: "#aaa",
                          paddingBottom: 4,
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7,1fr)",
                      gap: 2,
                    }}
                  >
                    {calDays}
                  </div>
                </div>

                {selectedDate && (
                  <div style={{ ...sectionPad, ...divider }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: 14 }}>
                        {dateLabelStr}
                      </span>
                      <span style={{ fontSize: 12, color: "#888" }}>
                        Duration: 1 hr
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {slots.map((slot) => {
                        const isSel = selectedSlot?.time === slot.time;
                        return (
                          <div
                            key={slot.time}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <button
                              onClick={() => handleSlotSelect(slot)}
                              style={{
                                flex: 1,
                                padding: "10px 14px",
                                border: isSel
                                  ? "none"
                                  : "0.5px solid #d0c4e8",
                                borderRadius: 8,
                                background: isSel
                                  ? "#5d2a8b"
                                  : "#fff",
                                color: isSel
                                  ? "#fff"
                                  : "#5d2a8b",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.15s",
                              }}
                            >
                              {slot.displayTime}
                            </button>

                            {!isSel && (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#888",
                                }}
                              >
                                Available
                              </span>
                            )}

                            {isSel && (
                              <button
                                onClick={() => setStep(2)}
                                style={{
                                  background: "#5d2a8b",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "10px 16px",
                                  fontSize: 14,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Next →
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div
                  style={{
                    ...sectionPad,
                    ...divider,
                    background: "#faf6ff",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Booking for{" "}
                    <strong style={{ color: "#5d2a8b" }}>
                      {dateLabelStr} at {selectedSlot?.time}
                    </strong>
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}
                  >
                    Your details
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>Full name *</label>
                    <input
                      style={inputStyle}
                      type="text"
                      placeholder="Enter your full name"
                      value={primaryGuest.name}
                      onChange={(e) =>
                        setPrimaryGuest((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email address *</label>
                    <input
                      style={inputStyle}
                      type="email"
                      placeholder="you@email.com"
                      value={primaryGuest.email}
                      onChange={(e) =>
                        setPrimaryGuest((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: extraGuests.length ? 12 : 0,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      Additional guests
                    </div>
                    <button
                      onClick={addGuest}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 13,
                        color: "#5d2a8b",
                        border: "0.5px solid #5d2a8b",
                        borderRadius: 8,
                        padding: "5px 10px",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={12} /> Add person
                    </button>
                  </div>

                  {extraGuests.map((g) => (
                    <div
                      key={g.id}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <input
                          style={{ ...inputStyle, marginBottom: 6 }}
                          type="text"
                          placeholder="Guest name"
                          value={g.name}
                          onChange={(e) =>
                            updateGuest(g.id, "name", e.target.value)
                          }
                        />
                        <input
                          style={inputStyle}
                          type="email"
                          placeholder="Guest email"
                          value={g.email}
                          onChange={(e) =>
                            updateGuest(g.id, "email", e.target.value)
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeGuest(g.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#bbb",
                          paddingTop: 8,
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}
                  >
                    Sub-service selection
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Primary guest sub-service selection */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                        {primaryGuest.name || "You"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {subServices.map((subService) => {
                          const isSelected = selectedSubServices[0]?.some(
                            (s) => s.subServiceId === subService.subServiceId
                          );
                          return (
                            <label
                              key={subService.subServiceId}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: isSelected ? "#f0e6ff" : "#fff",
                                border: isSelected ? "1px solid #5d2a8b" : "1px solid #e0d6f5",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSubServices((prev) => ({
                                    ...prev,
                                    0: prev[0]?.filter((s) => s.subServiceId !== subService.subServiceId) || [],
                                  }));
                                } else {
                                  setSelectedSubServices((prev) => ({
                                    ...prev,
                                    0: [...(prev[0] || []), subService],
                                  }));
                                }
                                calculatePricing();
                              }}
                            >
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  border: "2px solid #5d2a8b",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {isSelected && <Check size={12} style={{ color: "#5d2a8b" }} />}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>
                                  {subService.name}
                                </div>
                                <div style={{ fontSize: 12, color: "#888" }}>
                                  {subService.description}
                                </div>
                                <div style={{ fontSize: 13, color: "#5d2a8b", fontWeight: 600 }}>
                                  {formatCurrency(subService.price)}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Additional guests sub-service selection */}
                    {extraGuests.map((guest, index) => (
                      <div key={guest.id}>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                          {guest.name || `Guest ${index + 1}`}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {subServices.map((subService) => {
                            const isSelected = selectedSubServices[guest.id]?.some(
                              (s) => s.subServiceId === subService.subServiceId
                            );
                            return (
                              <label
                                key={subService.subServiceId}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  background: isSelected ? "#f0e6ff" : "#fff",
                                  border: isSelected ? "1px solid #5d2a8b" : "1px solid #e0d6f5",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedSubServices((prev) => ({
                                      ...prev,
                                      [guest.id]: prev[guest.id]?.filter(
                                        (s) => s.subServiceId !== subService.subServiceId
                                      ) || [],
                                    }));
                                  } else {
                                    setSelectedSubServices((prev) => ({
                                      ...prev,
                                      [guest.id]: [...(prev[guest.id] || []), subService],
                                    }));
                                  }
                                  calculatePricing();
                                }}
                              >
                                <div
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    border: "2px solid #5d2a8b",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {isSelected && <Check size={12} style={{ color: "#5d2a8b" }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                                    {subService.name}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#888" }}>
                                    {subService.description}
                                  </div>
                                  <div style={{ fontSize: 13, color: "#5d2a8b", fontWeight: 600 }}>
                                    {formatCurrency(subService.price)}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}
                  >
                    Service location *
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <RadioOption
                      value="merchant_location"
                      label="Merchant's registered location"
                      sublabel="The salon's official address on the platform"
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#5d2a8b",
                          marginTop: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MapPin size={11} />
                        {locationOptions?.merchantLocation?.address || "Merchant address"}
                      </div>
                    </RadioOption>

                    <RadioOption
                      value="customer_address"
                      label="My registered address"
                      sublabel="Service will come to your platform address"
                    >
                      <div
                        style={{ fontSize: 12, color: "#888", marginTop: 4 }}
                      >
                        Your address on file will be used
                      </div>
                    </RadioOption>

                    <RadioOption
                      value="new_address"
                      label="New address"
                      sublabel="Enter a different address"
                    >
                      <input
                        style={{ ...inputStyle, marginTop: 8 }}
                        placeholder="Enter delivery address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </RadioOption>

                    <RadioOption
                      value="whatsapp_location"
                      label="WhatsApp location link"
                      sublabel="Share a pin from WhatsApp"
                    >
                      <input
                        style={{ ...inputStyle, marginTop: 8 }}
                        placeholder="Paste WhatsApp location link"
                        value={whatsappLink}
                        onChange={(e) => setWhatsappLink(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </RadioOption>
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <label style={{ ...labelStyle, fontWeight: 500 }}>
                    Additional notes
                  </label>
                  <textarea
                    style={{ ...inputStyle, resize: "vertical" }}
                    rows={3}
                    placeholder="Any special requests or information..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={sectionPad}>
                  <button
                    style={confirmBtnStyle}
                    onClick={() => setStep(3)}
                    disabled={!primaryGuest.name || !primaryGuest.email}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 500, fontSize: 14, marginBottom: 14 }}
                  >
                    Booking summary
                  </div>

                  {[
                    ["Service", service.name],
                    ["Provider", service.name],
                    [
                      "Date & time",
                      `${dateLabelStr}, ${selectedSlot?.time}`,
                    ],
                    ["Duration", "1 hour"],
                    [
                      "Guests",
                      `${totalPeople} person${totalPeople > 1 ? "s" : ""}`,
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        padding: "5px 0",
                      }}
                    >
                      <span style={{ color: "#888" }}>{k}</span>
                      <span style={{ color: "#1a1a2e", fontWeight: 500 }}>
                        {v}
                      </span>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      padding: "5px 0",
                    }}
                  >
                    <span style={{ color: "#888" }}>Location</span>
                    <span
                      style={{
                        color: "#1a1a2e",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MapPin size={11} style={{ color: "#5d2a8b" }} />
                      {locationType === "merchant_location"
                        ? "Merchant's address"
                        : locationType === "customer_address"
                        ? "My address"
                        : locationType === "new_address"
                        ? newAddress || "New address"
                        : "WhatsApp location"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    ...sectionPad,
                    ...divider,
                    background: "#faf6ff",
                  }}
                >
                  <div
                    style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}
                  >
                    Payment breakdown
                  </div>

                  {[
                    ["Service cost", formatCurrency(serviceAmount), "#1a1a2e"],
                    [
                      `Deposit (${depositPercent * 100}%)`,
                      formatCurrency(depositAmount),
                      "#5d2a8b",
                    ],
                    ["Remaining balance", formatCurrency(balance), "#1a1a2e"],
                    [
                      `Discount on balance`,
                      `${discountOnBalance * 100}% off`,
                      "#3B6D11",
                    ],
                  ].map(([k, v, col]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        padding: "5px 0",
                      }}
                    >
                      <span style={{ color: "#888" }}>{k}</span>
                      <span style={{ color: col as string, fontWeight: 500 }}>
                        {v}
                      </span>
                    </div>
                  ))}

                  {pricingBreakdown && pricingBreakdown.individualBreakdowns && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#1a1a2e" }}>
                        Sub-services
                      </div>
                      {pricingBreakdown.individualBreakdowns.map((breakdown: any, index: number) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#5d2a8b", marginBottom: 4 }}>
                            {breakdown.personName}
                          </div>
                          {breakdown.subServices.map((subService: any, subIndex: number) => (
                            <div key={subIndex} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "2px 0" }}>
                              <span style={{ color: "#888" }}>
                                {subService.name}
                              </span>
                              <span style={{ color: "#5d2a8b", fontWeight: 500 }}>
                                {formatCurrency(subService.price)}
                              </span>
                            </div>
                          ))}
                          {breakdown.subServices.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, paddingTop: 4, borderTop: "1px solid #e0d6f5" }}>
                              <span style={{ color: "#888" }}>Sub-services total</span>
                              <span style={{ color: "#5d2a8b" }}>
                                {formatCurrency(breakdown.subServicesTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 15,
                      fontWeight: 600,
                      padding: "10px 0 0",
                      borderTop: "0.5px solid #e0d6f5",
                      marginTop: 6,
                    }}
                  >
                    <span>Pay now (deposit)</span>
                    <span style={{ color: "#5d2a8b" }}>
                      {formatCurrency(depositAmount)}
                    </span>
                  </div>
                </div>

                <div style={{ ...sectionPad, ...divider }}>
                  <div
                    style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}
                  >
                    Service provider contact
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 13,
                      color: "#888",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Phone size={12} style={{ color: "#5d2a8b" }} />
                      Contact provider
                    </span>
                  </div>
                </div>

                <div style={sectionPad}>
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    style={confirmBtnStyle}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={16}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        Booking...
                      </>
                    ) : (
                      "Confirm & Pay Deposit"
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <div
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#ede0fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <CheckCircle size={28} style={{ color: "#5d2a8b" }} />
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: "#1a1a2e",
                  }}
                >
                  Appointment booked!
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#888",
                    marginBottom: 24,
                    lineHeight: 1.6,
                  }}
                >
                  A confirmation has been sent to{" "}
                  <strong>{primaryGuest.email}</strong>. Your stylist will
                  reach out to confirm shortly.
                </div>
                <button
                  onClick={() => router.push("/user/body-care")}
                  style={confirmBtnStyle}
                >
                  Back to services
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: #5d2a8b !important; box-shadow: 0 0 0 2px rgba(93,42,139,0.12); }
      `}</style>
    </div>
  );
};

export default BookAppointmentPage;