

// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft, Save, MapPin, Phone, Calendar, Clock, Edit3 } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import PickupCenterService from '@/services/pickCenter';

// interface FormData {
//   centerName: string;
//   address: string;
//   contactNumber: string;
//   amount: number;
//   operatingDays: string;
//   operatingHours: string;
// }

// const CreatePickupCenter = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     centerName: '',
//     address: '',
//     contactNumber: '',
//     amount: 0,
//     operatingDays: '',
//     operatingHours: ''
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [isCustomDays, setIsCustomDays] = useState(false);

//   // Days options for dropdown
//   const daysOptions = [
//     'Monday - Friday',
//     'Monday - Saturday',
//     'Tuesday - Saturday',
//     'Wednesday - Sunday',
//     'Monday - Sunday',
//     '24/7 (All Days)',
//     'Weekdays Only',
//     'Weekends Only',
//     'Custom Schedule'
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'operatingDays') {
//       if (value === 'Custom Schedule') {
//         setIsCustomDays(true);
//         setFormData(prev => ({
//           ...prev,
//           operatingDays: ''
//         }));
//       } else {
//         setIsCustomDays(false);
//         setFormData(prev => ({
//           ...prev,
//           operatingDays: value
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: name === 'amount' ? parseFloat(value) || 0 : value
//       }));
//     }
    
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       operatingDays: value
//     }));
    
//     if (errors.operatingDays) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.operatingDays;
//         return newErrors;
//       });
//     }
//   };

//   const validate = async (): Promise<boolean> => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.centerName.trim()) {
//       newErrors.centerName = 'Center name is required';
//     } else {
//       // Check for duplicate center name
//       try {
//         const isUnique = await PickupCenterService.validatePickupCenterName(formData.centerName.trim());
//         if (!isUnique) {
//           newErrors.centerName = 'A pickup center with this name already exists';
//         }
//       } catch (error) {
//         console.error('Error validating center name:', error);
//       }
//     }
    
//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     }
    
//     if (!formData.contactNumber.trim()) {
//       newErrors.contactNumber = 'Contact number is required';
//     }
    
//     if (formData.amount <= 0) {
//       newErrors.amount = 'Amount must be greater than 0';
//     }
    
//     if (!formData.operatingDays.trim()) {
//       newErrors.operatingDays = 'Operating days are required';
//     }
    
//     if (!formData.operatingHours.trim()) {
//       newErrors.operatingHours = 'Operating hours are required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const isValid = await validate();
//     if (!isValid) {
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const result = await PickupCenterService.createPickupCenter({
//         centerName: formData.centerName.trim(),
//         address: formData.address.trim(),
//         contactNumber: formData.contactNumber.trim(),
//         amount: formData.amount,
//         operatingDays: formData.operatingDays.trim(),
//         operatingHours: formData.operatingHours.trim()
//       });
      
//       console.log('Pickup center created:', result);
//       setSuccess(true);
//       toast.success('Pickup center created successfully!');
      
//       // Update timestamp to invalidate cache in other components
//       localStorage.setItem('pickupCenters_lastUpdated', Date.now().toString());
      
//       setTimeout(() => {
//         router.push('/super-admin/pickup-center');
//       }, 1500);
      
//     } catch (error: any) {
//       console.error('Error creating pickup center:', error);
      
//       // Handle specific error messages
//       if (error.message?.toLowerCase().includes('already exists') || 
//           error.message?.toLowerCase().includes('duplicate')) {
//         setErrors({ centerName: 'A pickup center with this name already exists' });
//         toast.error('A pickup center with this name already exists');
//       } else if (error.message?.includes('All fields are required')) {
//         setErrors({ general: error.message });
//         toast.error(error.message);
//       } else if (error.message?.includes('Amount must be a positive number')) {
//         setErrors({ amount: error.message });
//         toast.error(error.message);
//       } else {
//         toast.error(error.message || 'Failed to create pickup center');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
//         <style jsx>{`
//           @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//           .manrope { font-family: 'Manrope', sans-serif; }
//         `}</style>
        
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Save className="w-8 h-8 text-green-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
//           <p className="text-gray-600 mb-4">Pickup center created successfully.</p>
//           <p className="text-gray-500 text-sm">Redirecting to pickup centers list...</p>
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

//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center mb-6">
//           <button
//             onClick={() => router.push('/super-admin/pickup-center')}
//             className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
//           >
//             <ArrowLeft className="w-5 h-5 mr-1" />
//             Back
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">Add New Pickup Center</h1>
//         </div>

//         {errors.general && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//             {errors.general}
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Center Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="centerName"
//                   value={formData.centerName}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                     errors.centerName ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter center name"
//                   disabled={loading}
//                 />
//                 {errors.centerName && (
//                   <p className="mt-1 text-sm text-red-600">{errors.centerName}</p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     rows={3}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                       errors.address ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter full address"
//                     disabled={loading}
//                   />
//                 </div>
//                 {errors.address && (
//                   <p className="mt-1 text-sm text-red-600">{errors.address}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Contact Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="tel"
//                     name="contactNumber"
//                     value={formData.contactNumber}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                       errors.contactNumber ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="e.g., +234 801 234 5678"
//                     disabled={loading}
//                   />
//                 </div>
//                 {errors.contactNumber && (
//                   <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Amount (NGN) <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleChange}
//                     className={`w-full pl-4 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                       errors.amount ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount"
//                     min="0"
//                     step="0.01"
//                     disabled={loading}
//                   />
//                 </div>
//                 {errors.amount && (
//                   <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Operating Days <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <select
//                     name="operatingDays"
//                     value={isCustomDays ? 'Custom Schedule' : formData.operatingDays}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none bg-white ${
//                       errors.operatingDays ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     disabled={loading}
//                   >
//                     <option value="">Select operating days</option>
//                     {daysOptions.map((day) => (
//                       <option key={day} value={day}>{day}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 {isCustomDays && (
//                   <div className="mt-3">
//                     <div className="relative">
//                       <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <input
//                         type="text"
//                         name="customOperatingDays"
//                         value={formData.operatingDays}
//                         onChange={handleCustomDaysChange}
//                         className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                           errors.operatingDays ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         placeholder="Enter custom operating days"
//                         disabled={loading}
//                       />
//                     </div>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Enter your custom operating days schedule
//                     </p>
//                   </div>
//                 )}
                
//                 {errors.operatingDays && (
//                   <p className="mt-1 text-sm text-red-600">{errors.operatingDays}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Operating Hours <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="operatingHours"
//                     value={formData.operatingHours}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
//                       errors.operatingHours ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="e.g., 9:00 AM - 7:00 PM"
//                     disabled={loading}
//                   />
//                 </div>
//                 {errors.operatingHours && (
//                   <p className="mt-1 text-sm text-red-600">{errors.operatingHours}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => router.push('/super-admin/pickup-center')}
//                 className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     Create Pickup Center
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

// export default CreatePickupCenter;


"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Phone, Calendar, Clock, Edit3, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PickupCenterService from '@/services/pickCenter';

interface FormData {
  centerName: string;
  address: string;
  contactNumber: string;
  amount: number;
  operatingDays: string;
  operatingHours: string;
}

const CreatePickupCenter = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    centerName: '',
    address: '',
    contactNumber: '',
    amount: 0,
    operatingDays: '',
    operatingHours: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isCustomDays, setIsCustomDays] = useState(false);

  // Days options for dropdown
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'operatingDays') {
      if (value === 'Custom Schedule') {
        setIsCustomDays(true);
        setFormData(prev => ({
          ...prev,
          operatingDays: ''
        }));
      } else {
        setIsCustomDays(false);
        setFormData(prev => ({
          ...prev,
          operatingDays: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
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
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
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

  const validate = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.centerName.trim()) {
      newErrors.centerName = 'Center name is required';
    } else {
      // Check for duplicate center name
      try {
        const isUnique = await PickupCenterService.validatePickupCenterName(formData.centerName.trim());
        if (!isUnique) {
          newErrors.centerName = 'A pickup center with this name already exists';
        }
      } catch (error) {
        console.error('Error validating center name:', error);
      }
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.operatingDays.trim()) {
      newErrors.operatingDays = 'Operating days are required';
    }
    
    if (!formData.operatingHours.trim()) {
      newErrors.operatingHours = 'Operating hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validate();
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await PickupCenterService.createPickupCenter({
        centerName: formData.centerName.trim(),
        address: formData.address.trim(),
        contactNumber: formData.contactNumber.trim(),
        amount: formData.amount,
        operatingDays: formData.operatingDays.trim(),
        operatingHours: formData.operatingHours.trim()
      });
      
      console.log('Pickup center created:', result);
      
      // Show inline success message
      setSuccess(true);
      
      // Update timestamp to invalidate cache in other components
      localStorage.setItem('pickupCenters_lastUpdated', Date.now().toString());
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push('/super-admin/pickup-center');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating pickup center:', error);
      
      // Handle specific error messages
      if (error.message?.toLowerCase().includes('already exists') || 
          error.message?.toLowerCase().includes('duplicate')) {
        setErrors({ centerName: 'A pickup center with this name already exists' });
        toast.error('A pickup center with this name already exists');
      } else if (error.message?.includes('All fields are required')) {
        setErrors({ general: error.message });
        toast.error(error.message);
      } else if (error.message?.includes('Amount must be a positive number')) {
        setErrors({ amount: error.message });
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Failed to create pickup center');
      }
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading || success}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Pickup Center</h1>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Inline Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800">Pickup center created successfully!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your pickup center has been created. Redirecting to the pickup centers list...</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-opacity duration-300 ${success ? 'opacity-50 pointer-events-none' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="centerName"
                  value={formData.centerName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    errors.centerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter center name"
                  disabled={loading || success}
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
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full address"
                    disabled={loading || success}
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
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., +234 801 234 5678"
                    disabled={loading || success}
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
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    disabled={loading || success}
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
                    value={isCustomDays ? 'Custom Schedule' : formData.operatingDays}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none bg-white ${
                      errors.operatingDays ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading || success}
                  >
                    <option value="">Select operating days</option>
                    {daysOptions.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                {isCustomDays && (
                  <div className="mt-3">
                    <div className="relative">
                      <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="customOperatingDays"
                        value={formData.operatingDays}
                        onChange={handleCustomDaysChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                          errors.operatingDays ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter custom operating days"
                        disabled={loading || success}
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
                    value={formData.operatingHours}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      errors.operatingHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 9:00 AM - 7:00 PM"
                    disabled={loading || success}
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
                disabled={loading || success}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Created!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Pickup Center
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Manual redirect link when success */}
        {success && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/super-admin/pickup-center')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Click here if you're not redirected automatically
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePickupCenter;