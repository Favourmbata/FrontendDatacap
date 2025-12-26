"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/api/hooks/useAuth";
import { routes } from "@/services/apiRoutes";
import { useAuthContext } from "@/AuthContext";
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
function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client } = useAuth();
  const { signIn } = useAuthContext();
  
  const email = searchParams.get("email") || "";
  
  const [formValues, setFormValues] = useState<OtpFormValues>({
    otp: "",
  });
  const [errors, setErrors] = useState<Partial<OtpFormValues>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
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
      
      console.log('🚀 Sending VERIFY OTP request to backend:', payload);
      
      const { data } = await client.post(routes.verifyOtp(), payload);
      return data;
    },
    onSuccess: (response) => {
      setApiError(null);
      
      if (response.success && response.data && response.data.jwtToken && response.data.user) {
        // Successfully verified OTP, sign in user and redirect
        signIn(response.data.jwtToken, response.data.user);
        
        const userRole = response.data.user.role?.toLowerCase();
        
        if (userRole === 'organisation' || userRole === 'organization' || userRole === 'admin') {
          toast({ 
            title: "OTP VERIFIED!",
            description: "Welcome to the admin dashboard!"
          });
          router.replace("/admin");
        } else {
          toast({ 
            title: "OTP VERIFIED!",
            description: "Welcome back!"
          });
          router.replace("/user");
        }
      } else {
        const errorMsg = response.message || "Failed to verify OTP";
        setApiError(errorMsg);
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
        "OTP verification failed";
      
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
      
      console.log('🚀 Sending RESEND OTP request to backend:', payload);
      
      const { data } = await client.post(routes.resendOtp(), payload);
      return data;
    },
    onSuccess: () => {
      setTimer(30);
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
          border-radius: 10px;
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
            className="monument-extended text-2xl font-normal text-[#1A1A1A] mb-4"
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap"
            }}
          >
            Verify Your OTP
          </h1>
          <p 
            className="manrope text-sm font-light text-[#9CA3AF]"
            style={{
              marginTop: "16px"
            }}
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
            {!canResend ? (
              <p className="manrope text-sm text-[#6E6E6E]">
                Resend OTP in {timer}s
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
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
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

          {/* Right Form Section */}
          <div 
            className="absolute"
            style={{
              width: "609px",
              height: "935px",
              top: "35px",
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
                width: "501px",
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
                  minWidth: "317px",
                  height: "36px",
                  margin: 0,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap"
                }}
              >
                Verify Your OTP
              </h1>
              <p 
                className="manrope"
                style={{
                  fontWeight: 300,
                  fontSize: "18px",
                  lineHeight: "100%",
                  color: "#6E6E6EB2",
                  width: "501px",
                  height: "25px",
                  margin: "16px 0 0 0"
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
                    width: "501px",
                    height: "25px",
                    margin: "10px 0 0 0"
                  }}
                >
                  {email}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {apiError && (
              <div 
                className="absolute"
                style={{
                  top: "273px",
                  left: "50px",
                  width: "484px"
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

            {/* OTP Input */}
            <div 
              className="absolute"
              style={{
                top: apiError ? "373px" : "273px",
                left: "50px",
                transition: "top 0.3s ease"
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
                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px", fontFamily: "Manrope" }}>
                  {errors.otp}
                </p>
              )}
            </div>

            {/* Resend OTP */}
            <div 
              className="absolute"
              style={{
                top: apiError ? "478px" : "378px",
                left: "50px",
                width: "484px",
                height: "25px",
                transition: "top 0.3s ease"
              }}
            >
              <div className="text-center">
                {!canResend ? (
                  <p className="manrope" style={{ color: "#6E6E6E", fontSize: "16px" }}>
                    Resend OTP in <span style={{ color: "#5D2A8B", fontWeight: 500 }}>{timer}</span> seconds
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

            {/* Verify Button */}
            <div 
              className="absolute"
              style={{
                top: apiError ? "543px" : "443px",
                left: "50px",
                transition: "top 0.3s ease"
              }}
            >
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isVerifying || formValues.otp.length !== 6}
                style={{
                  width: "484px",
                  height: "60px",
                  background: "#5D2A8B",
                  borderRadius: "10px",
                  border: "none",
                  color: "white",
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "20px",
                  cursor: (isVerifying || formValues.otp.length !== 6) ? "not-allowed" : "pointer",
                  opacity: (isVerifying || formValues.otp.length !== 6) ? 0.7 : 1
                }}
              >
                {isVerifying ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </div>

            {/* Back to Login */}
            <div 
              className="absolute"
              style={{
                top: apiError ? "618px" : "518px",
                left: "50px",
                width: "484px",
                height: "25px",
                transition: "top 0.3s ease"
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

// Fallback component for Suspense
function VerifyOtpFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main page component that wraps the content in Suspense
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpContent />
    </Suspense>
  );
}