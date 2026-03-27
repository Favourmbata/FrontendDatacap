"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BookAppointmentPage = () => {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load product data from localStorage
    const savedProduct = localStorage.getItem('appointmentProduct');
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct));
    }
    
    // Generate available time slots (9AM to 6PM in 30-minute intervals)
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      times.push(`${hour}:00`);
      if (hour < 18) {
        times.push(`${hour}:30`);
      }
    }
    setAvailableTimes(times);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate appointment booking
    console.log("Appointment booking data:", {
      product,
      ...formData
    });
    
    // In a real app, you would send this to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Appointment booked successfully! You will receive a confirmation shortly.");
      router.push('/user/body-care');
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No product selected for appointment</p>
          <button 
            onClick={() => router.push('/user/body-care')}
            className="mt-4 text-[#5d2a8b] hover:text-[#7a3aa3] font-medium"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold">Book Appointment</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>
            </div>

            <div className="p-6">
              {/* Product Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Details</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#5d2a8b]"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
                    <p className="text-gray-600 mb-2">By {product.producer}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {product.address}
                      </span>
                      <span className="font-bold text-[#5d2a8b]">
                        {formatCurrency(product.actualAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Form */}
              <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] appearance-none"
                        >
                          <option value="">Select time</option>
                          {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                      placeholder="Any special requests or information you'd like to share..."
                    ></textarea>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Service cost:</span>
                        <span className="font-semibold">{formatCurrency(product.actualAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Up-front payment (deposit) %:</span>
                        <span className="font-semibold">10%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Actual up-front payment:</span>
                        <span className="font-semibold text-[#5d2a8b]">
                          {formatCurrency(product.actualAmount * 0.1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Remaining balance:</span>
                        <span className="font-semibold">
                          {formatCurrency(product.actualAmount * 0.9)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Discount on up-front payment (balance):</span>
                        <span className="font-semibold">5%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Provider Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Service Provider Contact</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-[#5d2a8b]" />
                        {product.contact?.phone || 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-[#5d2a8b]" />
                        {product.contact?.email || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You can also contact the service provider directly using the information above.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 px-6 py-3 border border-[#5d2a8b] text-[#5d2a8b] rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 px-6 py-3 bg-[#5d2a8b] text-white rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;