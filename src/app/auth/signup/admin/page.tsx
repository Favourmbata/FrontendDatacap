




// 'use client';

// import React, { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useMutation } from '@tanstack/react-query';
// import { useAuth } from '@/api/hooks/useAuth';
// import { toast } from '@/app/components/hooks/use-toast';
// import Link from "next/link"
// interface FormValues {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// type ApiError = {
//   response?: {
//     status?: number;
//     statusText?: string;
//     data?: {
//       errors?: Array<{ message: string }>;
//       message?: string;
//     };
//   };
//   message?: string;
//   code?: string;
//   name?: string;
// };

// export default function SignupPage() {
//   const router = useRouter();
//   const { client } = useAuth();

//   const [formValues, setFormValues] = useState<FormValues>({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState<Partial<FormValues>>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const { mutate: submitMutate, isPending } = useMutation({
//     mutationFn: async (values: { name: string; email: string; phone: string; password: string }) => {
//       // Split the name into firstName and lastName
//       const nameParts = values.name.trim().split(' ');
//       const firstName = nameParts[0] || '';
//       const lastName = nameParts.slice(1).join(' ') || '';
      
//       const payload = {
//         firstName,
//         lastName,
//         email: values.email,
//         password: values.password,
//         phone: values.phone,
//         role: "admin" // Automatically set role to 'admin'
//       };
      
//       console.log('🚀 Sending ADMIN registration to backend:', payload);
//       console.log('🎯 Backend URL:', 'https://datacapture-backend.onrender.com/api/auth/register');

//       const { data } = await client.post('/api/auth/register', payload);
//       return data;
//     },
//     onSuccess: (data) => {
//       console.log('Registration successful:', data);
//       toast({ title: 'REGISTRATION SUCCESSFUL!' });
//       router.replace('/auth/login');
//     },
//     onError: (error: ApiError) => {

      
//       // Handle different types of errors
//       let message = 'Registration failed';
      
//       if (error?.response?.data?.errors?.[0]?.message) {
//         message = error.response.data.errors[0].message;
//       } else if (error?.response?.data?.message) {
//         message = error.response.data.message;
//       } else if (error?.message) {
//         message = error.message;
//       } else if (error.code === 'ERR_NETWORK') {
//         message = 'Network error. Please check your internet connection.';
//       } else if (error.name === 'AxiosError' && !error.response) {
//         message = 'Unable to connect to server. Please try again later.';
//       }
      
//       toast({ 
//         title: 'Registration Failed',
//         description: message,
//         variant: 'destructive'
//       });
//     },
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormValues(prev => ({ ...prev, [name]: value }));
//     if (errors[name as keyof FormValues]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: Partial<FormValues> = {};
//     if (!formValues.name.trim()) newErrors.name = 'Name is required';
//     if (!formValues.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) newErrors.email = 'Invalid email address';
//     if (!formValues.phone.trim()) newErrors.phone = 'Phone number is required';
//     else if (!/^[0-9]{10,15}$/.test(formValues.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10-15 digits';
//     if (!formValues.password) newErrors.password = 'Password is required';
//     else if (formValues.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
//     if (!formValues.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
//     else if (formValues.password !== formValues.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;

//     submitMutate({ name: formValues.name, email: formValues.email, phone: formValues.phone, password: formValues.password });
//   };

//   const handleGoogleSignUp = () => alert('Google sign up would be implemented here');

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-6 lg:p-11">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .monument-extended { font-family: 'Monument Extended', sans-serif; }
//         .manrope { font-family: 'Manrope', sans-serif; }
//         .input-with-notch { position: relative; }
//         .input-with-notch input { border: 1px solid #d1d5db; border-radius: 12px; }
//         .input-with-notch input:focus { border-color: #5D2A8B; }
//         .input-with-notch.has-value input { clip-path: polygon(0 8px,12px 8px,12px 0,calc(12px + 70px) 0,calc(12px + 70px) 8px,100% 8px,100% 100%,0 100%); }
//         .input-with-notch.has-value::before { content: ''; position:absolute; left:0; top:0; right:0; bottom:0; border:1px solid #d1d5db; border-radius:12px; pointer-events:none; clip-path: polygon(0 0,12px 0,12px 8px,calc(12px + 70px) 8px,calc(12px + 70px) 0,100% 0,100% 100%,0 100%); }
//         .input-with-notch.focused::before { border-color:#5D2A8B; }
//         .input-with-notch.error input { border-color: #ef4444; }
//         .input-with-notch.error::before { border-color: #ef4444; }
//       `}</style>


//       <div className="w-full max-w-[1439px] flex gap-10 relative">
       
//         <div className="hidden lg:block lg:w-[700px] lg:h-[1025px] rounded-[40px] overflow-hidden lg:mt-[44px] lg:ml-[45px]">
//           <Image src="/Frame 335677.png" alt="Data Capturing Illustration" width={700} height={1025} priority className="w-full h-full object-cover" />
//         </div>

        
//         <div className="w-full lg:w-[609px] lg:h-[1025px] bg-[#FBFAFC] rounded-[40px] flex flex-col relative lg:mt-[44px]">
         
//           <div className="pt-6 pl-6 lg:pt-[50px] lg:pl-[50px]">
//             <Image width={55} height={48} src="/Group 1.png" alt="Company Logo" className="object-contain" />
//           </div>

         
//           <div className="mt-6 px-6 lg:px-0 lg:absolute lg:top-[180px] lg:left-12 lg:right-12">
//             <h1 className="monument-extended text-[30px] lg:text-[30px] font-normal text-gray-900 mb-3 leading-[100%]">Sign Up</h1>
//             <p className="manrope text-[15px] lg:text-[18px] font-light leading-[100%] text-gray-500">Create an account with us and get started!</p>
//           </div>

         
//           <div className="mt-4 px-6 lg:px-0 lg:absolute lg:top-[310px] lg:left-12 lg:right-12">
//             <button type="button" onClick={handleGoogleSignUp} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M19.8 10.2273C19.8 9.52045 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5891C15.3545 13.3 14.6182 14.3591 13.5182 15.0682V17.5773H16.8091C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
//                 <path d="M10.2 20C12.9 20 15.1636 19.1045 16.8091 17.5773L13.5182 15.0682C12.5909 15.6682 11.4182 16.0227 10.2 16.0227C7.59545 16.0227 5.39091 14.2636 4.57273 11.9H1.16364V14.4909C2.79545 17.7591 6.26364 20 10.2 20Z" fill="#34A853"/>
//                 <path d="M4.57273 11.9C4.37273 11.3 4.25909 10.6591 4.25909 10C4.25909 9.34091 4.37273 8.7 4.57273 8.1V5.50909H1.16364C0.477273 6.85909 0.0909091 8.38636 0.0909091 10C0.0909091 11.6136 0.477273 13.1409 1.16364 14.4909L4.57273 11.9Z" fill="#FBBC04"/>
//                 <path d="M10.2 3.97727C11.5318 3.97727 12.7136 4.43182 13.6409 5.30909L16.5682 2.38182C15.1591 1.08182 12.8955 0.227273 10.2 0.227273C6.26364 0.227273 2.79545 2.46818 1.16364 5.50909L4.57273 8.1C5.39091 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
//               </svg>
//               <span className="manrope text-gray-700 font-medium text-[15px]">Sign up with Google</span>
//             </button>
//           </div>

         
//           <div className="flex items-center gap-4 mt-4 px-6 lg:px-0 lg:absolute lg:top-[390px] lg:left-12 lg:right-12">
//             <div className="flex-1 h-px bg-gray-300" />
//             <span className="manrope text-sm text-gray-400">or</span>
//             <div className="flex-1 h-px bg-gray-300" />
//           </div>

       
//           <div className="mt-4 px-6 pb-8 lg:px-0 lg:absolute lg:top-[438px] lg:left-[62px] lg:right-[63px] space-y-6">
            
//             <div className={`input-with-notch ${formValues.name ? 'has-value' : ''} ${errors.name ? 'error' : ''}`}>
//               <input
//                 type="text"
//                 name="name"
//                 value={formValues.name}
//                 onChange={handleChange}
//                 placeholder="Demola Alo"
//                 className="manrope w-full lg:w-[484px] h-[75px] px-6 pt-6 pb-2 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
//               />
//               {formValues.name && <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">Full Name</label>}
//               {errors.name && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.name}</p>}
//             </div>

          
//             <div className={`input-with-notch ${formValues.email ? 'has-value' : ''} ${errors.email ? 'error' : ''}`}>
//               <input
//                 type="email"
//                 name="email"
//                 value={formValues.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 className="manrope w-full lg:w-[484px] h-[75px] px-6 pt-6 pb-2 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
//               />
//               {formValues.email && <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">Email</label>}
//               {errors.email && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.email}</p>}
//             </div>

//             {/* Phone */}
//             <div className={`input-with-notch ${formValues.phone ? 'has-value' : ''} ${errors.phone ? 'error' : ''}`}>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formValues.phone}
//                 onChange={handleChange}
//                 placeholder="09012533097"
//                 className="manrope w-full lg:w-[484px] h-[75px] px-6 pt-6 pb-2 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
//               />
//               {formValues.phone && <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">Phone Number</label>}
//               {errors.phone && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.phone}</p>}
//             </div>

//             {/* Password */}
//             <div className={`input-with-notch ${formValues.password ? 'has-value' : ''} ${errors.password ? 'error' : ''}`}>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formValues.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="manrope w-full lg:w-[484px] h-[75px] px-6 pt-6 pb-2 pr-14 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
//               />
//               {formValues.password && <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">Password</label>}
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//               {errors.password && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             <div className={`input-with-notch ${formValues.confirmPassword ? 'has-value' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 name="confirmPassword"
//                 value={formValues.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 className="manrope w-full lg:w-[484px] h-[75px] px-6 pt-6 pb-2 pr-14 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
//               />
//               {formValues.confirmPassword && <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">Confirm Password</label>}
//               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//               {errors.confirmPassword && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.confirmPassword}</p>}
//             </div>

//             {/* Submit */}
//             <button onClick={handleSubmit} type="button" disabled={isPending} className="manrope w-full lg:w-[484px] h-[60px] bg-[#5D2A8B] hover:bg-[#4a2170] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-[16px] mt-4">
//               {isPending ? 'Signing up...' : 'Sign Up'}
//             </button>
//           </div>

//           {/* Footer */}
//          <div className="mt-6 px-6 lg:px-0 lg:absolute lg:bottom-16 lg:left-12 lg:right-12 text-center">
//   <p className="manrope text-gray-600 text-[15px]">
//     Already have an account?{" "}
//     <Link
//       href="/auth/login"
//       className="text-[#5D2A8B] font-semibold hover:underline"
//     >
//       Login
//     </Link>
//   </p>
// </div>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/api/hooks/useAuth';
import { toast } from '@/app/components/hooks/use-toast';
import Link from "next/link";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type ApiError = {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      errors?: Array<{ message: string }>;
      message?: string;
    };
  };
  message?: string;
  code?: string;
  name?: string;
};

export default function AdminSignupPage() {
  const router = useRouter();
  const { client } = useAuth();

  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: submitMutate, isPending } = useMutation({
    mutationFn: async (values: { name: string; email: string; phone: string; password: string }) => {
      // Split the name into firstName and lastName
      const nameParts = values.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const payload = {
        firstName,
        lastName,
        email: values.email.toLowerCase().trim(),
        password: values.password,
        phone: values.phone.replace(/\s/g, ''),
        role: "admin"
      };
      
      console.log('🚀 Sending ADMIN registration to backend:', payload);

      const { data } = await client.post('/api/auth/register', payload);
      return data;
    },
    onSuccess: (data) => {
      console.log('Admin registration successful:', data);
      toast({ 
        title: 'ADMIN REGISTRATION SUCCESSFUL!',
        description: 'Your admin account has been created successfully' 
      });
      router.replace('/auth/login');
    },
    onError: (error: ApiError) => {
      let message = 'Registration failed';
      
      if (error?.response?.data?.errors?.[0]?.message) {
        message = error.response.data.errors[0].message;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Network error. Please check your internet connection.';
      } else if (error.name === 'AxiosError' && !error.response) {
        message = 'Unable to connect to server. Please try again later.';
      }
      
      toast({ 
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    
    if (!formValues.name.trim()) newErrors.name = 'Full name is required';
    if (!formValues.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) newErrors.email = 'Invalid email address';
    if (!formValues.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^(\+?234|0)?[789][01]\d{8}$/.test(formValues.phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid Nigerian phone number';
    if (!formValues.password) newErrors.password = 'Password is required';
    else if (formValues.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formValues.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formValues.password !== formValues.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitMutate({ 
      name: formValues.name, 
      email: formValues.email, 
      phone: formValues.phone, 
      password: formValues.password 
    });
  };

  const handleGoogleSignUp = () => {
    toast({
      title: 'Google Sign Up',
      description: 'This feature will be implemented soon'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .monument-extended { font-family: 'Monument Extended', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Mobile-first responsive layout */
        .desktop-layout {
          display: none;
        }
        
        .mobile-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 24px;
          max-width: 400px;
          margin: 0 auto;
        }
        
        @media (min-width: 1024px) {
          .desktop-layout {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: white;
            padding: 44px 45px;
          }
          
          .mobile-layout {
            display: none;
          }
        }
        
        .mobile-input-container {
          position: relative;
          width: 100%;
          height: 50px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          background: white;
          margin-bottom: 16px;
        }
        
        .mobile-input-container input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: white !important;
          padding: 14px 16px;
          font-family: 'Manrope', sans-serif;
          font-size: 16px;
          color: #374151;
        }
        
        .mobile-input-container input::placeholder {
          color: #9CA3AF;
        }
        
        .mobile-input-container.error {
          border-color: #EF4444;
        }
        
        .mobile-password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6B7280;
        }
        
        /* Desktop styles */
        .desktop-container {
          width: 100%;
          max-width: 1439px;
          display: flex;
          gap: 76px;
        }
        
        .desktop-left-image {
          flex: 0 0 700px;
          height: 1025px;
          border-radius: 40px;
          overflow: hidden;
        }
        
        .desktop-form-container {
          flex: 0 0 609px;
          height: 1025px;
          background: #FBFAFC;
          border-radius: 40px;
          position: relative;
        }
        
        .input-with-notch {
          position: relative;
          width: 100%;
          max-width: 484px;
        }
        
        .input-with-notch input {
          width: 100%;
          height: 75px;
          border: 1px solid #6E6E6E4D;
          border-radius: 12px;
          background: white;
          padding: 17px 30px;
          font-family: 'Manrope', sans-serif;
          font-size: 20px;
          color: #6E6E6E;
          outline: none;
        }
        
        .input-with-notch input:focus {
          border-color: #5D2A8B;
        }
        
        .input-with-notch.has-value input {
          padding-top: 25px;
          padding-bottom: 9px;
        }
        
        .input-label {
          position: absolute;
          top: -10px;
          left: 30px;
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #5D2A8B;
          background: white;
          padding: 0 5px;
          pointer-events: none;
        }
        
        .input-with-notch.error input {
          border-color: #ef4444;
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6E6E6E;
        }
      `}</style>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Logo */}
        <div className="mb-6">
          <Image 
            width={40} 
            height={35} 
            src="/Group 1.png" 
            alt="Company Logo" 
            className="object-contain" 
          />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 
            className="monument-extended text-2xl font-normal text-[#1A1A1A] mb-3"
          >
             Sign Up
          </h1>
          <p 
            className="manrope text-sm font-light text-[#9CA3AF]"
          >
            Create an account with us and get started!
          </p>
        </div>

        

        {/* Form */}
        <div className="flex-1">
          {/* Full Name Input */}
          <div className="mb-3">
            <label className="manrope text-sm font-medium text-[#374151] mb-2 block">
              Full Name
            </label>
            <div className={`mobile-input-container ${errors.name ? 'error' : ''}`}>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            {errors.name && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label className="manrope text-sm font-medium text-[#374151] mb-2 block">
              Email Address
            </label>
            <div className={`mobile-input-container ${errors.email ? 'error' : ''}`}>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            {errors.email && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Input */}
          <div className="mb-3">
            <label className="manrope text-sm font-medium text-[#374151] mb-2 block">
              Phone Number
            </label>
            <div className={`mobile-input-container ${errors.phone ? 'error' : ''}`}>
              <input
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            {errors.phone && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="manrope text-sm font-medium text-[#374151] mb-2 block">
              Password
            </label>
            <div className={`mobile-input-container ${errors.password ? 'error' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder=""
                style={{ paddingRight: "45px" }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="mobile-password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="manrope text-sm font-medium text-[#374151] mb-2 block">
              Confirm Password
            </label>
            <div className={`mobile-input-container ${errors.confirmPassword ? 'error' : ''}`}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder=""
                style={{ paddingRight: "45px" }}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="mobile-password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-12 bg-[#5D2A8B] rounded-lg text-white manrope font-semibold text-base disabled:opacity-70 disabled:cursor-not-allowed mb-4"
          >
            {isPending ? 'Signing up...' : 'Sign Up as Admin'}
          </button>

          {/* Footer */}
          <p className="manrope text-sm text-center text-[#6E6E6E] mt-auto">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#5D2A8B]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="desktop-layout">
        <div className="desktop-container">
          {/* Left Image Section */}
          <div className="desktop-left-image">
            <Image 
              src="/Frame 335677.png" 
              alt="Data Capturing Illustration" 
              width={700} 
              height={1025} 
              priority 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Right Form Section */}
          <div className="desktop-form-container">
            {/* Logo */}
            <div className="absolute top-[50px] left-[50px]">
              <Image 
                width={55} 
                height={48} 
                src="/Group 1.png" 
                alt="Company Logo" 
                className="object-contain" 
              />
            </div>

            {/* Header */}
            <div className="absolute top-[136px] left-[50px]">
              <h1 className="monument-extended text-[30px] font-normal text-[#1A1A1A] mb-4">
                Admin Sign Up
              </h1>
              <p className="manrope text-[18px] font-light text-[#6E6E6EB2]">
                Create an admin account to manage the platform
              </p>
            </div>

            {/* Google Sign Up Button - Desktop */}
            <div className="absolute top-[273px] left-[50px]">
              <button 
                type="button" 
                onClick={handleGoogleSignUp}
                className="w-[484px] h-[60px] flex items-center justify-center gap-3 border border-[#6E6E6E4D] rounded-xl bg-white hover:bg-gray-50"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8 10.2273C19.8 9.52045 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5891C15.3545 13.3 14.6182 14.3591 13.5182 15.0682V17.5773H16.8091C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                  <path d="M10.2 20C12.9 20 15.1636 19.1045 16.8091 17.5773L13.5182 15.0682C12.5909 15.6682 11.4182 16.0227 10.2 16.0227C7.59545 16.0227 5.39091 14.2636 4.57273 11.9H1.16364V14.4909C2.79545 17.7591 6.26364 20 10.2 20Z" fill="#34A853"/>
                  <path d="M4.57273 11.9C4.37273 11.3 4.25909 10.6591 4.25909 10C4.25909 9.34091 4.37273 8.7 4.57273 8.1V5.50909H1.16364C0.477273 6.85909 0.0909091 8.38636 0.0909091 10C0.0909091 11.6136 0.477273 13.1409 1.16364 14.4909L4.57273 11.9Z" fill="#FBBC04"/>
                  <path d="M10.2 3.97727C11.5318 3.97727 12.7136 4.43182 13.6409 5.30909L16.5682 2.38182C15.1591 1.08182 12.8955 0.227273 10.2 0.227273C6.26364 0.227273 2.79545 2.46818 1.16364 5.50909L4.57273 8.1C5.39091 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
                </svg>
                <span className="manrope text-[15px] font-medium text-gray-700">
                  Sign up with Google
                </span>
              </button>
            </div>

            {/* Divider - Desktop */}
            <div className="absolute top-[393px] left-[50px] right-[50px] flex items-center">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="manrope text-sm text-gray-400 px-4">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Form Inputs */}
            <div className="absolute top-[463px] left-[50px] space-y-6">
              {/* Full Name */}
              <div className={`input-with-notch ${formValues.name ? 'has-value' : ''} ${errors.name ? 'error' : ''}`}>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Demola Alo"
                />
                {formValues.name && (
                  <label className="input-label">Full Name</label>
                )}
                {errors.name && (
                  <p className="manrope text-sm text-red-500 mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className={`input-with-notch ${formValues.email ? 'has-value' : ''} ${errors.email ? 'error' : ''}`}>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {formValues.email && (
                  <label className="input-label">Email</label>
                )}
                {errors.email && (
                  <p className="manrope text-sm text-red-500 mt-2">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className={`input-with-notch ${formValues.phone ? 'has-value' : ''} ${errors.phone ? 'error' : ''}`}>
                <input
                  type="tel"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="09012345678"
                />
                {formValues.phone && (
                  <label className="input-label">Phone Number</label>
                )}
                {errors.phone && (
                  <p className="manrope text-sm text-red-500 mt-2">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className={`input-with-notch ${formValues.password ? 'has-value' : ''} ${errors.password ? 'error' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ paddingRight: '50px' }}
                />
                {formValues.password && (
                  <label className="input-label">Password</label>
                )}
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="manrope text-sm text-red-500 mt-2">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`input-with-notch ${formValues.confirmPassword ? 'has-value' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ paddingRight: '50px' }}
                />
                {formValues.confirmPassword && (
                  <label className="input-label">Confirm Password</label>
                )}
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="manrope text-sm text-red-500 mt-2">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-[484px] h-[60px] bg-[#5D2A8B] rounded-xl text-white manrope font-semibold text-[16px] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {isPending ? 'Signing up...' : 'Sign Up as Admin'}
              </button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-[50px] left-0 right-0 text-center">
              <p className="manrope text-[18px] font-light text-[#6E6E6E]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#5D2A8B]"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}