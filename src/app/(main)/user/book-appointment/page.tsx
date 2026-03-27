// "use client";

// import { useState, useEffect } from 'react';
// import { Calendar, Clock, User, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const BookAppointmentPage = () => {
//   const router = useRouter();
//   const [product, setProduct] = useState<any>(null);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     appointmentDate: '',
//     appointmentTime: '',
//     notes: ''
//   });
//   const [availableTimes, setAvailableTimes] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     // Load product data from localStorage
//     const savedProduct = localStorage.getItem('appointmentProduct');
//     if (savedProduct) {
//       setProduct(JSON.parse(savedProduct));
//     }
    
//     // Generate available time slots (9AM to 6PM in 30-minute intervals)
//     const times = [];
//     for (let hour = 9; hour <= 18; hour++) {
//       times.push(`${hour}:00`);
//       if (hour < 18) {
//         times.push(`${hour}:30`);
//       }
//     }
//     setAvailableTimes(times);
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate appointment booking
//     console.log("Appointment booking data:", {
//       product,
//       ...formData
//     });
    
//     // In a real app, you would send this to your backend
//     setTimeout(() => {
//       setIsSubmitting(false);
//       alert("Appointment booked successfully! You will receive a confirmation shortly.");
//       router.push('/user/body-care');
//     }, 1500);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">No product selected for appointment</p>
//           <button 
//             onClick={() => router.push('/user/body-care')}
//             className="mt-4 text-[#5d2a8b] hover:text-[#7a3aa3] font-medium"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <button 
//                   onClick={() => router.back()}
//                   className="flex items-center text-white hover:text-gray-200 transition-colors"
//                 >
//                   <ArrowLeft className="w-6 h-6 mr-2" />
//                   Back
//                 </button>
//                 <h1 className="text-3xl font-bold">Book Appointment</h1>
//                 <div className="w-16"></div> {/* Spacer for alignment */}
//               </div>
//             </div>

//             <div className="p-6">
//               {/* Product Summary */}
//               <div className="bg-gray-50 rounded-lg p-6 mb-8">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
//                 <div className="flex items-start gap-4">
//                   <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
//                       <div className="w-4 h-4 rounded-full bg-[#5d2a8b]"></div>
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
//                     <p className="text-gray-600 mb-2">By {product.producer}</p>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <span className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         {product.address}
//                       </span>
//                       <span className="font-bold text-[#5d2a8b]">
//                         {formatCurrency(product.actualAmount)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Appointment Form */}
//               <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Information</h2>
                
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Full Name *
//                       </label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="text"
//                           name="fullName"
//                           value={formData.fullName}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
//                           placeholder="Enter your full name"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email Address *
//                       </label>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
//                           placeholder="your@email.com"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Phone Number *
//                       </label>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
//                           placeholder="+234 801 234 5678"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Appointment Date *
//                       </label>
//                       <div className="relative">
//                         <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <input
//                           type="date"
//                           name="appointmentDate"
//                           value={formData.appointmentDate}
//                           onChange={handleInputChange}
//                           required
//                           min={new Date().toISOString().split('T')[0]}
//                           className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Appointment Time *
//                       </label>
//                       <div className="relative">
//                         <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                         <select
//                           name="appointmentTime"
//                           value={formData.appointmentTime}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] appearance-none"
//                         >
//                           <option value="">Select time</option>
//                           {availableTimes.map(time => (
//                             <option key={time} value={time}>{time}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Additional Notes
//                     </label>
//                     <textarea
//                       name="notes"
//                       value={formData.notes}
//                       onChange={handleInputChange}
//                       rows={4}
//                       className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
//                       placeholder="Any special requests or information you'd like to share..."
//                     ></textarea>
//                   </div>

//                   {/* Payment Breakdown */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h3 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                    
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span>Service cost:</span>
//                         <span className="font-semibold">{formatCurrency(product.actualAmount)}</span>
//                       </div>
                      
//                       <div className="flex justify-between">
//                         <span>Up-front payment (deposit) %:</span>
//                         <span className="font-semibold">10%</span>
//                       </div>
                      
//                       <div className="flex justify-between">
//                         <span>Actual up-front payment:</span>
//                         <span className="font-semibold text-[#5d2a8b]">
//                           {formatCurrency(product.actualAmount * 0.1)}
//                         </span>
//                       </div>
                      
//                       <div className="flex justify-between">
//                         <span>Remaining balance:</span>
//                         <span className="font-semibold">
//                           {formatCurrency(product.actualAmount * 0.9)}
//                         </span>
//                       </div>
                      
//                       <div className="flex justify-between">
//                         <span>Discount on up-front payment (balance):</span>
//                         <span className="font-semibold">5%</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Service Provider Info */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2">Service Provider Contact</h3>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <span className="flex items-center">
//                         <Phone className="w-4 h-4 mr-1 text-[#5d2a8b]" />
//                         {product.contact?.phone || 'N/A'}
//                       </span>
//                       <span className="flex items-center">
//                         <Mail className="w-4 h-4 mr-1 text-[#5d2a8b]" />
//                         {product.contact?.email || 'N/A'}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       You can also contact the service provider directly using the information above.
//                     </p>
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => router.back()}
//                       className="flex-1 px-6 py-3 border border-[#5d2a8b] text-[#5d2a8b] rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`flex-1 px-6 py-3 bg-[#5d2a8b] text-white rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors ${
//                         isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                     >
//                       {isSubmitting ? (
//                         <div className="flex items-center justify-center">
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                           Booking...
//                         </div>
//                       ) : (
//                         'Confirm Appointment'
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointmentPage;





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
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  productName: string;
  producer: string;
  address: string;
  actualAmount: number;
  contact?: { phone?: string; email?: string };
}

interface TimeSlot {
  time: string;
  time24: string;
  duration: number;
  totalProviders: number;
  bookedCount: number;
}

interface Guest {
  id: number;
  name: string;
  email: string;
}

type LocationType = "merchant" | "customer" | "new" | "whatsapp";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function generateSlots(year: number, month: number, day: number): TimeSlot[] {
  const seed = day + month * 31 + year * 365;
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 21;

  for (let h = startHour; h < endHour; h++) {
    const booked = Math.floor(((seed * h * 7) % 10) + 0);
    slots.push({
      time: `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`,
      time24: `${String(h).padStart(2, "0")}:00`,
      duration: 60,
      totalProviders: 10,
      bookedCount: Math.min(booked % 11, 10),
    });
  }
  return slots;
}

const AVAILABLE_DAYS = new Set([18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 30, 31]);

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

  const [product, setProduct] = useState<Product | null>(null);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [primaryGuest, setPrimaryGuest] = useState({ name: "", email: "" });
  const [extraGuests, setExtraGuests] = useState<Guest[]>([]);

  const [locationType, setLocationType] = useState<LocationType>("merchant");
  const [newAddress, setNewAddress] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("appointmentProduct");
    if (saved) setProduct(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const s = generateSlots(selectedDate.year, selectedDate.month, selectedDate.day);
    setSlots(s);
    setSelectedSlot(null);
  }, [selectedDate]);

  const firstDayOfMonth = useCallback(() => {
    const d = new Date(viewYear, viewMonth, 1).getDay();
    return d === 0 ? 6 : d - 1;
  }, [viewMonth, viewYear]);

  const daysInMonth = useCallback(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewMonth, viewYear]
  );

  const isAvailable = (day: number) => {
    if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
      return AVAILABLE_DAYS.has(day) && day >= today.getDate();
    }
    return day % 7 !== 0 && day % 7 !== 6;
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate?.day === day &&
    selectedDate?.month === viewMonth &&
    selectedDate?.year === viewYear;

  function selectDay(day: number) {
    if (!isAvailable(day)) return;
    setSelectedDate({ day, month: viewMonth, year: viewYear });
  }

  function handleSlotSelect(slot: TimeSlot) {
    if (slot.bookedCount >= slot.totalProviders) return;
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
  const serviceAmount = product?.actualAmount ?? 0;
  const depositPercent = 0.1;
  const depositAmount = serviceAmount * depositPercent;
  const balance = serviceAmount - depositAmount;
  const discountOnBalance = 0.05;

  async function handleConfirm() {
    setIsSubmitting(true);
    const payload = {
      product,
      selectedDate,
      selectedSlot,
      primaryGuest,
      extraGuests,
      locationType,
      newAddress: locationType === "new" ? newAddress : undefined,
      whatsappLink: locationType === "whatsapp" ? whatsappLink : undefined,
      notes,
      totalPeople,
    };
    console.log("Booking payload:", payload);
    
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep(4);
  }

  if (!product) {
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
            No service selected for booking.
          </p>
          <button
            onClick={() => router.push("/user/body-care")}
            style={{
              color: "#5d2a8b",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            ← Back to services
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
    ? `${selectedDate.day} ${MONTHS[selectedDate.month].slice(0, 3)} ${selectedDate.year}`
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
                    {product.productName}
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
                      {product.producer}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} />1 hour
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={12} />
                      10 stylists
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
                        const avail = slot.totalProviders - slot.bookedCount;
                        const full = avail === 0;
                        const isSel = selectedSlot?.time24 === slot.time24;
                        return (
                          <div
                            key={slot.time24}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <button
                              onClick={() => !full && handleSlotSelect(slot)}
                              style={{
                                flex: 1,
                                padding: "10px 14px",
                                border: isSel
                                  ? "none"
                                  : full
                                  ? "0.5px solid #e8e0f5"
                                  : "0.5px solid #d0c4e8",
                                borderRadius: 8,
                                background: isSel
                                  ? "#5d2a8b"
                                  : full
                                  ? "#f9f7ff"
                                  : "#fff",
                                color: isSel
                                  ? "#fff"
                                  : full
                                  ? "#ccc"
                                  : "#5d2a8b",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: full ? "not-allowed" : "pointer",
                                textAlign: "center",
                                transition: "all 0.15s",
                              }}
                            >
                              {slot.time}
                              {full && (
                                <span
                                  style={{ fontSize: 11, marginLeft: 6, color: "#bbb" }}
                                >
                                  Fully booked
                                </span>
                              )}
                            </button>

                            {!full && !isSel && (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#888",
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <AvailabilityDot avail={avail} />
                                {avail} available
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
                    Service location *
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <RadioOption
                      value="merchant"
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
                        {product.address}
                      </div>
                    </RadioOption>

                    <RadioOption
                      value="customer"
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
                      value="new"
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
                      value="whatsapp"
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
                    ["Service", product.productName],
                    ["Provider", product.producer],
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
                      {locationType === "merchant"
                        ? "Merchant's address"
                        : locationType === "customer"
                        ? "My address"
                        : locationType === "new"
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
                    {product.contact?.phone && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Phone size={12} style={{ color: "#5d2a8b" }} />
                        {product.contact.phone}
                      </span>
                    )}
                    {product.contact?.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Mail size={12} style={{ color: "#5d2a8b" }} />
                        {product.contact.email}
                      </span>
                    )}
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