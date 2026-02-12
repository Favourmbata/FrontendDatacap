"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Phone, Calendar, Clock, DollarSign, Edit3 } from 'lucide-react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PickupCenterService from '@/services/pickCenter';

interface PickupCenter {
  id: string;
  centerName: string;
  address: string;
  contactNumber: string;
  amount: number;
  operatingDays: string;
  operatingHours: string;
  isActive?: boolean;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const EditPickupCenter = () => {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;

  const [pickupCenter, setPickupCenter] = useState<PickupCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCustomDays, setIsCustomDays] = useState(false);

  
  const daysOptions = [
    'Monday - Friday',
    'Monday - Saturday',
    'Tuesday - Saturday',
    'Wednesday - Sunday',
    'Monday - Sunday',
    '24/7 (All Days)',
    'Weekdays Only',
    'Weekends Only',
    'Custom Schedule'
  ];


  useEffect(() => {
    const fetchPickupCenter = async () => {
      try {
        setLoading(true);
        const data = await PickupCenterService.getPickupCenterById(centerId);
        setPickupCenter(data);
       
        const isCustom = !daysOptions.includes(data.operatingDays);
        setIsCustomDays(isCustom);
        
      } catch (error: any) {
        console.error('Error fetching pickup center:', error);
        toast.error(error.message || 'Failed to load pickup center');
        router.push('/super-admin/pickup-center');
      } finally {
        setLoading(false);
      }
    };

    if (centerId) {
      fetchPickupCenter();
    }
  }, [centerId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!pickupCenter) return;
    
    const { name, value } = e.target;
    
    // Handle operating days special case
    if (name === 'operatingDays') {
      if (value === 'Custom Schedule') {
        setIsCustomDays(true);
    
        setPickupCenter(prev => ({
          ...prev!,
          operatingDays: prev?.operatingDays || ''
        }));
      } else {
        setIsCustomDays(false);
        setPickupCenter(prev => ({
          ...prev!,
          operatingDays: value
        }));
      }
    } else {
      setPickupCenter(prev => ({
        ...prev!,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      }));
    }
    
 
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pickupCenter) return;
    
    const { value } = e.target;
    setPickupCenter(prev => ({
      ...prev!,
      operatingDays: value
    }));
    
    if (errors.operatingDays) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.operatingDays;
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    if (!pickupCenter) return false;
    
    const newErrors: Record<string, string> = {};
    
    if (!pickupCenter.centerName.trim()) {
      newErrors.centerName = 'Center name is required';
    }
    
    if (!pickupCenter.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!pickupCenter.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (pickupCenter.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!pickupCenter.operatingDays.trim()) {
      newErrors.operatingDays = 'Operating days are required';
    }
    
    if (!pickupCenter.operatingHours.trim()) {
      newErrors.operatingHours = 'Operating hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupCenter) return;
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await PickupCenterService.updatePickupCenter(centerId, {
        centerName: pickupCenter.centerName.trim(),
        address: pickupCenter.address.trim(),
        contactNumber: pickupCenter.contactNumber.trim(),
        amount: pickupCenter.amount,
        operatingDays: pickupCenter.operatingDays.trim(),
        operatingHours: pickupCenter.operatingHours.trim()
      });
      
      console.log('Pickup center updated:', result);
      toast.success('Pickup center updated successfully!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/super-admin/pickup-center');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating pickup center:', error);
      toast.error(error.message || 'Failed to update pickup center');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return PickupCenterService.formatAmount(amount);
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/super-admin/pickup-center')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Pickup Center</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-32 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pickupCenter) {
    return null;
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/super-admin/pickup-center')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Pickup Center</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="centerName"
                  value={pickupCenter.centerName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.centerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter center name"
                  disabled={submitting}
                />
                {errors.centerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.centerName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={pickupCenter.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full address"
                    disabled={submitting}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={pickupCenter.contactNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., +234 801 234 5678"
                    disabled={submitting}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (NGN) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  
                  <input
                    type="number"
                    name="amount"
                    value={pickupCenter.amount}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    disabled={submitting}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Days <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="operatingDays"
                    value={isCustomDays ? 'Custom Schedule' : pickupCenter.operatingDays}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none bg-white ${
                      errors.operatingDays ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={submitting}
                  >
                    <option value="">Select operating days</option>
                    {daysOptions.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                {/* Custom Operating Days Input */}
                {isCustomDays && (
                  <div className="mt-3">
                    <div className="relative">
                      <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="customOperatingDays"
                        value={pickupCenter.operatingDays}
                        onChange={handleCustomDaysChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                          errors.operatingDays ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter custom operating days"
                        disabled={submitting}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your custom operating days schedule
                    </p>
                  </div>
                )}
                
                {errors.operatingDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.operatingDays}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="operatingHours"
                    value={pickupCenter.operatingHours}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.operatingHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 9:00 AM - 7:00 PM"
                    disabled={submitting}
                  />
                </div>
                {errors.operatingHours && (
                  <p className="mt-1 text-sm text-red-600">{errors.operatingHours}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/super-admin/pickup-center')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Pickup Center
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

export default EditPickupCenter;