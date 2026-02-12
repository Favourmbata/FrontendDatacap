"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import { routes } from "@/services/apiRoutes";
import { toast } from "@/app/components/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

interface OtpFormValues {
  otp: string;
}

type ApiError = {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      errors?: Array<{ message: string }>;
      message?: string;
      code?: string;
    };
  };
  message?: string;
  code?: string;
  name?: string;
};

// Separate component that uses useSearchParams
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client } = useAuth();
  
  const email = searchParams.get("email") || "";
  
  const [formValues, setFormValues] = useState<OtpFormValues>({
    otp: "",
  });
  const [errors, setErrors] = useState<Partial<OtpFormValues>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  // Initialize with default values that will be updated from API response
  const [timer, setTimer] = useState<number>(600); // 10 minutes default
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [formattedTime, setFormattedTime] = useState<string>("10:00");

  // Timer for resend OTP - 10 minutes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          
          // Format time as MM:SS
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          setFormattedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          
          return newTime;
        });
      }, 1000);
    } else {
      setCanResend(true);
      setFormattedTime("00:00");
    }
    
    // Initialize formatted time
    const initialMinutes = Math.floor(timer / 60);
    const initialSeconds = timer % 60;
    setFormattedTime(`${initialMinutes.toString().padStart(2, '0')}:${initialSeconds.toString().padStart(2, '0')}`);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const { mutate: verifyOtpMutate, isPending: isVerifying } = useMutation({
    mutationFn: async (values: { email: string; otp: string }) => {
      const payload = {
        email: values.email,
        otp: values.otp,
      };
      
      console.log('🚀 Sending VERIFY EMAIL OTP request to backend:', payload);
      
      const { data } = await client.post(routes.verifyOtp(), payload);
      return data;
    },
    onSuccess: (response) => {
      setApiError(null);
      
      if (response.success) {
        toast({ 
          title: "EMAIL VERIFIED!",
          description: "Your email has been successfully verified. You can now log in."
        });
        router.push("/auth/login");
      } else {
        const errorMsg = response.message || "Failed to verify email";
        setApiError(errorMsg);
        
        // Update attempts if available in response
        if (response.data && response.data.remainingAttempts !== undefined) {
          setRemainingAttempts(response.data.remainingAttempts);
        }
        
        toast({ 
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }
    },
    onError: (error: ApiError) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Email verification failed";
      
      setApiError(message);
      toast({ 
        title: "Verification Failed",
        description: message,
        variant: "destructive"
      });
    },
  });

  const { mutate: resendOtpMutate, isPending: isResending } = useMutation({
    mutationFn: async (email: string) => {
      const payload = { email };
      
      const { data } = await client.post(routes.resendOtp(), payload);
      return data;
    },
    onSuccess: (response) => {
      // Update timer and attempts from response if available
      if (response.data) {
        if (response.data.otpExpiresIn !== undefined) {
          setTimer(response.data.otpExpiresIn);
        }
        if (response.data.maxAttempts !== undefined) {
          setMaxAttempts(response.data.maxAttempts);
        }
        if (response.data.remainingAttempts !== undefined) {
          setRemainingAttempts(response.data.remainingAttempts);
        }
      } else {
        // Fallback to default values
        setTimer(600); // 10 minutes
        setMaxAttempts(3);
        setRemainingAttempts(3);
      }
      
      setCanResend(false);
      toast({ 
        title: "OTP Sent",
        description: "A new OTP has been sent to your email."
      });
    },
    onError: (error: ApiError) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP";
      
      toast({ 
        title: "Resend Failed",
        description: message,
        variant: "destructive"
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Only allow numeric input for OTP
    if (name === "otp" && !/^\d*$/.test(value)) return;
    
    setFormValues((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof OtpFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<OtpFormValues> = {};
    if (!formValues.otp) {
      newErrors.otp = "OTP is required";
    } else if (formValues.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    if (!email) {
      setApiError("Email is missing");
      return;
    }
    verifyOtpMutate({ email, otp: formValues.otp });
  };

  const handleResendOtp = () => {
    if (!email) {
      toast({ 
        title: "Error",
        description: "Email is missing",
        variant: "destructive"
      });
      return;
    }
    resendOtpMutate(email);
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (formValues.otp.length === 6) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [formValues.otp]);

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
          text-align: center;
        }
        
        .mobile-input-container input::placeholder {
          color: #9CA3AF;
        }
        
        .mobile-input-container.error {
          border-color: #EF4444;
        }
        
        /* Desktop styles */
        .input-container {
          position: relative;
          width: 484px;
          height: 60px;
          border: 1px solid #6E6E6E4D;
          border-radius: 30px; /* Changed to fully rounded */
          background: white;
          transition: border-color 0.2s ease;
          margin: 0 auto;
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
          text-align: center;
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
          font-weight: 400,
          fontSize: "14px",
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
        
        /* Hide left image on tablet and mobile */
        @media (max-width: 1023px) {
          .hide-on-tablet {
            display: none;
          }
        }
        
        .otp-digit {
          width: 40px;
          height: 50px;
          margin: 0 5px;
          text-align: center;
          font-size: 24px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .otp-digit:focus {
          outline: none;
          border-color: #5D2A8B;
        }
      `}</style>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            width={40} 
            height={35} 
            src="/Group 1.png" 
            alt="Company Logo" 
            className="object-contain" 
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 
            className="monument-extended text-2xl font-normal text-[#1A1A1A] mb-3"
          >
            Verify Your Email
          </h1>
          <p 
            className="manrope text-sm font-light text-[#9CA3AF]"
          >
            Enter the 6-digit code sent to your email
          </p>
          {email && (
            <p className="manrope text-sm font-medium text-[#5D2A8B] mt-2">
              {email}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="flex-1">
          {/* OTP Input */}
          <div className="mb-4">
            <div className={`mobile-input-container ${errors.otp ? 'error' : ''}`}>
              <input
                type="text"
                name="otp"
                value={formValues.otp}
                onChange={handleChange}
                placeholder="123456"
                maxLength={6}
                autoFocus
              />
            </div>
            {errors.otp && (
              <p className="manrope text-xs text-[#EF4444] mt-1">
                {errors.otp}
              </p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            <p className="manrope text-sm text-[#6E6E6E] mb-2">
              Remaining attempts: <span className="font-semibold">{remainingAttempts}/{maxAttempts}</span>
            </p>
            {!canResend ? (
              <p className="manrope text-sm text-[#6E6E6E]">
                Resend OTP in {formattedTime}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="manrope text-sm text-[#5D2A8B] underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isVerifying || formValues.otp.length !== 6}
            className="w-full h-12 bg-[#5D2A8B] rounded-lg text-white manrope font-semibold text-base disabled:opacity-70 disabled:cursor-not-allowed mb-4"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="manrope text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {/* Back to Login */}
          <p className="manrope text-sm text-center text-[#6E6E6E] mt-auto">
            Already verified?{" "}
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
        <div className="relative" style={{ width: "1440px", minHeight: "1000px", margin: "0 auto" }}>
          {/* Left Image Section */}
          <div 
            className="absolute hide-on-tablet"
            style={{
              width: "700px",
              height: "935px",
              top: "35px",
              left: "45px",
              borderRadius: "40px",
              background: "linear-gradient(180deg, #F4EFFA 0%, #5D2A8B1A 10%)",
              overflow: "hidden"
            }}
          >
            <Image 
              src="/Frame 1.png" 
              alt="Data Capturing Illustration" 
              width={700} 
              height={935} 
              priority 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Right Form Section - Changed to flex */}
          <div 
            className="absolute flex flex-col"
            style={{
              width: "609px",
              height: "935px",
              top: "35px",
              left: "785px",
              borderRadius: "40px",
              background: "#FBFAFC",
              padding: "0 50px"
            }}
          >
            {/* Logo - Top */}
            <div className="mt-12">
              <Image 
                width={55} 
                height={48} 
                src="/Group 1.png" 
                alt="Company Logo" 
                className="object-contain" 
              />
            </div>

            {/* Header Section - Flexed and spaced */}
            <div 
              className="flex flex-col mt-16"
              style={{
                width: "100%",
                gap: "24px"
              }}
            >
              <h1 
                className="monument-extended"
                style={{
                  fontSize: "30px",
                  fontWeight: 400,
                  lineHeight: "100%",
                  color: "#1A1A1A",
                  margin: 0
                }}
              >
                Verify Your Email
              </h1>
              
              {/* Paragraph text lowered with margin-top */}
              <div className="flex flex-col gap-4">
                <p 
                  className="manrope"
                  style={{
                    fontWeight: 300,
                    fontSize: "18px",
                    lineHeight: "140%",
                    color: "#6E6E6EB2",
                    margin: 0,
                    marginTop: "12px" /* Lowered the text */
                  }}
                >
                  Enter the 6-digit code sent to your email
                </p>
                
                {email && (
                  <p 
                    className="manrope"
                    style={{
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: "100%",
                      color: "#5D2A8B",
                      margin: 0
                    }}
                  >
                    {email}
                  </p>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {apiError && (
              <div 
                className="mt-8"
                style={{
                  width: "100%"
                }}
              >
                <div 
                  className="manrope"
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #EF4444",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 6V10" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14H10.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: "#991B1B", fontSize: "14px", flex: 1 }}>
                    {apiError}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setApiError(null)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer",
                      color: "#991B1B",
                      fontSize: "18px",
                      lineHeight: "1"
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* OTP Input Section - Flexed */}
            <div 
              className="flex flex-col mt-8"
              style={{
                width: "100%",
                gap: "8px"
              }}
            >
              <div className={`input-container ${formValues.otp ? 'has-value' : ''} ${errors.otp ? 'error' : ''}`}>
                <input
                  type="text"
                  name="otp"
                  value={formValues.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  autoFocus
                />
                {formValues.otp && (
                  <label className="input-label">OTP Code</label>
                )}
              </div>
              {errors.otp && (
                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope", textAlign: "center" }}>
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Resend OTP - Flexed */}
            <div 
              className="flex flex-col items-center mt-4"
              style={{
                width: "100%"
              }}
            >
              <p className="manrope" style={{ color: "#6E6E6E", fontSize: "14px", marginBottom: "8px" }}>
                Remaining attempts: <span style={{ fontWeight: 600 }}>{remainingAttempts}/{maxAttempts}</span>
              </p>
              <div className="text-center">
                {!canResend ? (
                  <p className="manrope" style={{ color: "#6E6E6E", fontSize: "16px" }}>
                    Resend OTP in <span style={{ color: "#5D2A8B", fontWeight: 500 }}>{formattedTime}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="manrope"
                    style={{ 
                      color: "#5D2A8B", 
                      fontSize: "16px", 
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      cursor: isResending ? "not-allowed" : "pointer",
                      opacity: isResending ? 0.7 : 1
                    }}
                  >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* Verify Button - Flexed */}
            <div 
              className="flex flex-col items-center mt-8"
              style={{
                width: "100%"
              }}
            >
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isVerifying || formValues.otp.length !== 6}
                style={{
                  width: "100%",
                  height: "60px",
                  background: "#5D2A8B",
                  borderRadius: "30px", /* Also rounded full for consistency */
                  border: "none",
                  color: "white",
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "20px",
                  cursor: (isVerifying || formValues.otp.length !== 6) ? "not-allowed" : "pointer",
                  opacity: (isVerifying || formValues.otp.length !== 6) ? 0.7 : 1
                }}
              >
                {isVerifying ? 'Verifying Email...' : 'Verify Email'}
              </button>
            </div>

            {/* Back to Login - Flexed */}
            <div 
              className="flex justify-center mt-8"
              style={{
                width: "100%",
                height: "25px",
                marginTop: "auto",
                marginBottom: "60px"
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
                Already verified?{" "}
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
  );
}

// Loading component for Suspense fallback
function VerifyEmailLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading verification page...</p>
      </div>
    </div>
  );
}

// Main page component that wraps the content in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}