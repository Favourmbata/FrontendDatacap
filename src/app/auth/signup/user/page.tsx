'use client'

import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/api/hooks/useAuth'
import { toast } from '@/app/components/hooks/use-toast'
import Link from "next/link"

// Define carousel image interface with optional text overlay properties
interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  titlePosition?: 'top' | 'bottom';
  backgroundColor?: string;
}

interface FormValues {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

type ApiError = {
  response?: {
    status?: number
    statusText?: string
    data?: {
      errors?: Array<{ message: string }>
      message?: string
    }
  }
  message?: string
  code?: string
  name?: string
}

export default function SignupPage() {
  const router = useRouter()
  const { client } = useAuth()

  const [formValues, setFormValues] = useState<FormValues>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<FormValues>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Define carousel images with text overlays for specific slides
  const carouselImages: CarouselImage[] = [
    { 
      src: "/Frame 335677.png", 
      alt: "Data Capturing Illustration"
    },
    { 
      src: "/assets/view-measurement.png", 
      alt: "View Measurement",
      title: "VIEW MEASUREMENT",
      titlePosition: "top",
      backgroundColor: "#ccbddb"
    },
    { 
      src: "/assets/Group (2).png", 
      alt: "Take Image",
      title: "TAKE IMAGE",
      titlePosition: "top",
      backgroundColor: "#ccbddb"
    }
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const normalizePhoneNumber = (phoneNumber: string): string => {
    let normalized = phoneNumber.replace(/\s/g, '').replace(/[()-]/g, '')
    
    if (normalized.startsWith('0')) {
      normalized = '+234' + normalized.substring(1)
    }
    
    if (!normalized.startsWith('+') && normalized.length === 10) {
      normalized = '+234' + normalized
    }
    
    return normalized
  }

  const { mutate: submitMutate, isPending } = useMutation({
    mutationFn: async (values: { 
      fullName: string
      email: string
      phoneNumber: string
      password: string
    }) => {
      const normalizedPhone = normalizePhoneNumber(values.phoneNumber)

      const payload = {
        fullName: values.fullName,
        email: values.email.toLowerCase().trim(),
        phoneNumber: normalizedPhone,
        password: values.password,
        role: 'user',
      }
      
      console.log('🚀 Sending USER registration to backend:', payload)

      const { data } = await client.post('/api/auth/register', payload)
      return data
    },
    onSuccess: (response) => {
      // Always redirect to email verification after registration
      toast({ 
        title: 'REGISTRATION SUCCESSFUL!',
        description: 'Please check your email for the verification code'
      })
      router.push(`/auth/verify-email?email=${encodeURIComponent(formValues.email)}`)
    },
    onError: (error: ApiError) => {
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed'
      
      const errorMessage = message.toLowerCase()
      if (errorMessage.includes('phoneNumber') && 
          (errorMessage.includes('duplicate') || 
           errorMessage.includes('already exists') ||
           errorMessage.includes('taken') ||
           errorMessage.includes('already registered'))) {
        setPhoneNumberError('This phone number is already registered. Please use a different phone number or try logging in.')
      } else {
        setPhoneNumberError('')
      }
      
      toast({ 
        title: 'Registration Failed',
        description: message,
        variant: 'destructive'
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof FormValues]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    if (name === 'phoneNumber' && phoneNumberError) {
      setPhoneNumberError('')
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {}
    
    if (!formValues.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formValues.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) newErrors.email = 'Invalid email address'
    if (!formValues.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
    else if (!/^(\+?234|0)?[789][01]\d{8}$/.test(formValues.phoneNumber.replace(/\s/g, ''))) newErrors.phoneNumber = 'Please enter a valid Nigerian phone number'
    if (!formValues.password) newErrors.password = 'Password is required'
    else if (formValues.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formValues.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formValues.password !== formValues.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneNumberError('')
    
    if (!validate()) return

    submitMutate({ 
      fullName: formValues.fullName, 
      email: formValues.email, 
      phoneNumber: formValues.phoneNumber,
      password: formValues.password
    })
  }

  const handleGoogleSignUp = () => {
    toast({
      title: 'Google Sign Up',
      description: 'This feature will be implemented soon'
    })
  }

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
            display: block;
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
        .input-container {
          position: relative;
          width: 484px;
          height: 60px;
          border: 1px solid #6E6E6E4D;
          border-radius: 10px;
          background: white;
        }
        
        .input-container input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: white !important;
          padding: 17px 30px;
          font-family: 'Manrope', sans-serif;
          font-size: 20px;
          color: #6E6E6E;
        }
        
        .input-container input:-webkit-autofill,
        .input-container input:-webkit-autofill:hover,
        .input-container input:-webkit-autofill:focus,
        .input-container input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #6E6E6E !important;
          background-color: white !important;
          background: white !important;
        }
        
        .input-container input::placeholder {
          color: #6E6E6E;
          opacity: 1;
        }
        
        .input-container.has-value {
          border: 1px solid #5D2A8B99;
        }
        
        .input-container.has-value input {
          padding-top: 25px;
          padding-bottom: 9px;
          background: white;
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
          transition: all 0.2s ease;
        }
        
        .input-container:focus-within {
          border: 1px solid #5D2A8B99;
        }
        
        .input-container:focus-within .input-label {
          color: #5D2A8B;
        }
        
        .input-container.error {
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
        
        /* Hide left image on tablet and mobile */
        @media (max-width: 1023px) {
          .hide-on-tablet {
            display: none;
          }
        }
        
        /* Carousel styles */
        .carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .carousel-image-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.5s ease-in-out;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Custom background container for specific slides */
        .custom-background {
          background-color: #ccbddb;
        }
        
        /* Text overlay styles */
        .carousel-text-overlay {
          position: absolute;
          width: 180px;
          height: 17px;
          top: 37px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Monument Extended', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          line-height: 100%;
          letter-spacing: 0%;
          text-align: center;
          color: white;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        
        .carousel-text-overlay.top {
          /* Using absolute positioning with specific coordinates */
        }
        
        .carousel-text-overlay.bottom {
          bottom: 80px;
        }
        
        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        
        .carousel-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .carousel-indicator.active {
          background-color: white;
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
            <div className={`mobile-input-container ${errors.fullName ? 'error' : ''}`}>
              <input
                type="text"
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            {errors.fullName && (
              <p className="manrope text-xs text-[#EF4444] -mt-3 mb-3">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-3  rounded-full">
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
            onTouchStart={() => {}} // Fixes potential iOS Safari click delay
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
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
        <div className="relative" style={{ width: "1440px", minHeight: "1100px", margin: "0 auto" }}>
          {/* Left Image Section - Carousel */}
          <div 
            className="absolute hide-on-tablet"
            style={{
              width: "700px",
              height: "1025px",
              top: "44px",
              left: "45px",
              borderRadius: "40px",
              overflow: "hidden"
            }}
          >
            <div className="carousel-container">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-image-wrapper ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundColor: image.backgroundColor || 'transparent'
                  }}
                >
                  <Image 
                    src={image.src}
                    alt={image.alt}
                    width={700}
                    height={1025}
                    priority={index === 0}
                    className="carousel-image"
                  />
                  {image.title && (
                    <div className={`carousel-text-overlay ${image.titlePosition || 'bottom'}`}>
                      {image.title}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`carousel-indicator ${
                      index === currentImageIndex ? 'active' : ''
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div 
            className="absolute"
            style={{
              width: "609px",
              height: "1025px",
              top: "44px",
              left: "785px",
              borderRadius: "40px",
              background: "#FBFAFC"
            }}
          >
            {/* Logo */}
            <div 
              className="absolute"
              style={{
                top: "50px",
                left: "50px"
              }}
            >
              <Image 
                width={55} 
                height={48} 
                src="/Group 1.png" 
                alt="Company Logo" 
                className="object-contain" 
              />
            </div>

            {/* Header */}
            <div 
              className="absolute"
              style={{
                width: "349px",
                height: "77px",
                top: "136px",
                left: "50px",
                gap: "16px"
              }}
            >
              <h1 
                className="monument-extended"
                style={{
                  fontSize: "30px",
                  fontWeight: 400,
                  lineHeight: "100%",
                  color: "#1A1A1A",
                  margin: 0,
                  marginBottom: "16px"
                }}
              >
                Sign Up
              </h1>
              <p 
                className="manrope"
                style={{
                  fontWeight: 300,
                  fontSize: "18px",
                  lineHeight: "100%",
                  color: "#6E6E6EB2",
                  width: "349px",
                  height: "25px",
                  margin: 0
                }}
              >
                Create an account with us and get started!
              </p>
            </div>

            {/* Google Sign Up Button */}
            <div 
              className="absolute"
              style={{
                top: "273px",
                left: "50px"
              }}
            >
              <button 
                type="button" 
                onClick={handleGoogleSignUp}
                style={{
                  width: "484px",
                  height: "60px",
                  border: "1px solid #6E6E6E4D",
                  borderRadius: "10px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  cursor: "pointer"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8 10.2273C19.8 9.52045 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5891C15.3545 13.3 14.6182 14.3591 13.5182 15.0682V17.5773H16.8091C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                  <path d="M10.2 20C12.9 20 15.1636 19.1045 16.8091 17.5773L13.5182 15.0682C12.5909 15.6682 11.4182 16.0227 10.2 16.0227C7.59545 16.0227 5.39091 14.2636 4.57273 11.9H1.16364V14.4909C2.79545 17.7591 6.26364 20 10.2 20Z" fill="#34A853"/>
                  <path d="M4.57273 11.9C4.37273 11.3 4.25909 10.6591 4.25909 10C4.25909 9.34091 4.37273 8.7 4.57273 8.1V5.50909H1.16364C0.477273 6.85909 0.0909091 8.38636 0.0909091 10C0.0909091 11.6136 0.477273 13.1409 1.16364 14.4909L4.57273 11.9Z" fill="#FBBC04"/>
                  <path d="M10.2 3.97727C11.5318 3.97727 12.7136 4.43182 13.6409 5.30909L16.5682 2.38182C15.1591 1.08182 12.8955 0.227273 10.2 0.227273C6.26364 0.227273 2.79545 2.46818 1.16364 5.50909L4.57273 8.1C5.39091 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
                </svg>
                <span className="manrope" style={{ fontSize: "15px", fontWeight: 500, color: "#374151" }}>
                  Sign up with Google
                </span>
              </button>
            </div>

            {/* Divider */}
            <div 
              className="absolute flex items-center"
              style={{
                width: "484px",
                height: "25px",
                top: "393px",
                left: "50px"
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
              <span className="manrope" style={{ padding: "0 16px", fontSize: "14px", color: "#9ca3af" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
            </div>

            {/* Desktop Form */}
            <div>
              {/* Full Name Input */}
              <div 
                className="absolute"
                style={{
                  top: "463px",
                  left: "50px"
                }}
              >
                <div className={`input-container ${formValues.fullName ? 'has-value' : ''} ${errors.fullName ? 'error' : ''}`}>
                  <input
                    type="text"
                    name="fullName"
                    value={formValues.fullName}
                    onChange={handleChange}
                    placeholder="Demola Alo"
                  />
                  {formValues.fullName && (
                    <label className="input-label">Full Name</label>
                  )}
                </div>
                {errors.fullName && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div 
                className="absolute"
                style={{
                  top: "568px",
                  left: "50px"
                }}
              >
                <div className={`input-container ${formValues.email ? 'has-value' : ''} ${errors.email ? 'error' : ''}`}>
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
                </div>
                {errors.email && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div 
                className="absolute"
                style={{
                  top: "658px",
                  left: "50px"
                }}
              >
                <div className={`input-container ${formValues.phoneNumber ? 'has-value' : ''} ${errors.phoneNumber || phoneNumberError ? 'error' : ''}`}>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formValues.phoneNumber}
                    onChange={handleChange}
                    placeholder="09012345678"
                  />
                  {formValues.phoneNumber && (
                    <label className="input-label">Phone Number</label>
                  )}
                </div>
                {errors.phoneNumber && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {errors.phoneNumber}
                  </p>
                )}
                {phoneNumberError && !errors.phoneNumber && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {phoneNumberError}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div 
                className="absolute"
                style={{
                  top: "748px",
                  left: "50px"
                }}
              >
                <div className={`input-container ${formValues.password ? 'has-value' : ''} ${errors.password ? 'error' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{ paddingRight: "50px" }}
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
                </div>
                {errors.password && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div 
                className="absolute"
                style={{
                  top: "838px",
                  left: "50px"
                }}
              >
                <div className={`input-container ${formValues.confirmPassword ? 'has-value' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{ paddingRight: "50px" }}
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
                </div>
                {errors.confirmPassword && (
                  <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Sign Up Button */}
              <div 
                className="absolute"
                style={
                  {
                  top: "928px",
                  left: "50px"
                }}
              >
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  style={{
                    width: "484px",
                    height: "60px",
                    background: "#5D2A8B",
                    borderRadius: "10px",
                    border: "none",
                    color: "white",
                    fontFamily: "Manrope",
                    fontWeight: 600,
                    fontSize: "16px",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.7 : 1
                  }}
                  onTouchStart={() => {}} // Fixes potential iOS Safari click delay
                >
                  {isPending ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div 
              className="absolute"
              style={{
                top: "1000px",
                left: "163px",
                width: "258px",
                height: "25px"
              }}
            >
              <p 
                className="manrope"
                style={{
                  fontWeight: 300,
                  fontSize: "18px",
                  lineHeight: "100%",
                  color: "#6E6E6E",
                  textAlign: "center",
                  margin: 0
                }}
              >
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  style={{
                    fontWeight: 500,
                    color: "#5D2A8B",
                    textDecoration: "none"
                  }}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}