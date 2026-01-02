"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/api/hooks/useAuth"
import { routes } from "@/services/apiRoutes"
import { useAuthContext } from "@/AuthContext"
import { toast } from "@/app/components/hooks/use-toast"
import Link from "next/link"
import { MessageModal } from "@/app/components/MessageModal"

interface FormValues {
  email: string
  password: string
}

type ApiError = {
  response?: {
    data?: {
      errors?: Array<{ message: string }>
      message?: string
    }
  }
  message?: string
}

export default function LoginForm() {
  const router = useRouter()
  const { client } = useAuth()
  const { signIn } = useAuthContext()

  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<FormValues>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error'
  })

  const { mutate: submitMutate, isPending } = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const payload = {
        email: values.email,
        password: values.password,
      }
      const { data } = await client.post(routes.login(), payload)
      return data
    },
    onSuccess: (response) => {
      // Extract the actual data from the response
      const data = response.data;
      if (data && data.jwtToken && data.user) {
        // Use the AuthContext to sign in
        signIn(data.jwtToken, data.user);
        
        toast({ title: "Login Successful!" })
        
        // Redirect based on user role
        const userRole = data.user.role?.toLowerCase();
        if (userRole === 'ORGANIZATION' || userRole === 'ORGANIZATION' || userRole === 'ADMIN') {
          router.replace("/subscription");
        } else {
          router.replace("/user");
        }
      } else {
        toast({ title: "Invalid response from server" })
      }
    },
    onError: (error: ApiError) => {
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed"
      toast({ title: message })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {}
    if (!formValues.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) newErrors.email = "Invalid email address"
    if (!formValues.password) newErrors.password = "Password is required"
    else if (formValues.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    submitMutate({ email: formValues.email, password: formValues.password })
  }

  const handleGoogleLogin = () => {
    setModalState({
      isOpen: true,
      title: 'Google Login',
      message: 'Google login integration is coming soon. Please use email and password for now.',
      type: 'info'
    });
  }

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  }

  return (
    <div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope {
          font-family: 'Manrope', sans-serif;
        }
        .input-with-notch {
          position: relative;
        }
        .input-with-notch input {
          border: 1px solid #d1d5db;
          border-radius: 12px;
        }
        .input-with-notch input:focus {
          border-color: #5d2a8b;
        }
        .input-with-notch.has-value input {
          clip-path: polygon(0 8px, 12px 8px, 12px 0, calc(12px + 70px) 0, calc(12px + 70px) 8px, 100% 8px, 100% 100%, 0 100%);
        }
        .input-with-notch.has-value::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          pointer-events: none;
          clip-path: polygon(0 0, 12px 0, 12px 8px, calc(12px + 70px) 8px, calc(12px + 70px) 0, 100% 0, 100% 100%, 0 100%);
        }
        .input-with-notch.focused::before {
          border-color: #5d2a8b;
        }
        .input-with-notch.error input {
          border-color: #ef4444;
        }
        .input-with-notch.error::before {
          border-color: #ef4444;
        }
      `}</style>

      {/* Message Modal */}
      <MessageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.8 10.2273C19.8 9.52045 19.7364 8.83636 19.6182 8.18182H10.2V12.05H15.5891C15.3545 13.3 14.6182 14.3591 13.5182 15.0682V17.5773H16.8091C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z"
            fill="#4285F4"
          />
          <path
            d="M10.2 20C12.9 20 15.1636 19.1045 16.8091 17.5773L13.5182 15.0682C12.5909 15.6682 11.4182 16.0227 10.2 16.0227C7.59545 16.0227 5.39091 14.2636 4.57273 11.9H1.16364V14.4909C2.79545 17.7591 6.26364 20 10.2 20Z"
            fill="#34A853"
          />
          <path
            d="M4.57273 11.9C4.37273 11.3 4.25909 10.6591 4.25909 10C4.25909 9.34091 4.37273 8.7 4.57273 8.1V5.50909H1.16364C0.477273 6.85909 0.0909091 8.38636 0.0909091 10C0.0909091 11.6136 0.477273 13.1409 1.16364 14.4909L4.57273 11.9Z"
            fill="#FBBC04"
          />
          <path
            d="M10.2 3.97727C11.5318 3.97727 12.7136 4.43182 13.6409 5.30909L16.5682 2.38182C15.1591 1.08182 12.8955 0.227273 10.2 0.227273C6.26364 0.227273 2.79545 2.46818 1.16364 5.50909L4.57273 8.1C5.39091 5.73636 7.59545 3.97727 10.2 3.97727Z"
            fill="#EA4335"
          />
        </svg>
        <span className="manrope text-gray-700 font-medium text-[15px]">Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mt-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="manrope text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Form Fields */}
      <div className="mt-8 space-y-6">
        {/* Email Field */}
        <div className={`input-with-notch ${formValues.email ? "has-value" : ""} ${errors.email ? "error" : ""}`}>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="manrope w-full h-[75px] px-6 pt-6 pb-2 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
          />
          {formValues.email && (
            <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">
              Email
            </label>
          )}
          {errors.email && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.email}</p>}
        </div>

        {/* Password Field with Forgot Password Link */}
        <div className={`input-with-notch ${formValues.password ? "has-value" : ""} ${errors.password ? "error" : ""}`}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="manrope w-full h-[75px] px-6 pt-6 pb-2 pr-14 focus:outline-none bg-white text-gray-900 text-[20px] placeholder-gray-400"
          />
          {formValues.password && (
            <label className="manrope absolute left-[18px] top-[2px] text-[11px] text-gray-500 font-medium bg-white px-1">
              Password
            </label>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <Link
            href="/auth/forgot-password"
            className="manrope absolute right-0 top-[80px] text-[14px] text-[#5D2A8B] font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
          {errors.password && <p className="manrope mt-2 text-sm text-red-500 ml-2">{errors.password}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        type="button"
        disabled={isPending}
        className="manrope w-full h-[60px] bg-[#5D2A8B] hover:bg-[#4a2170] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-[16px] mt-8"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>
    </div>
  )
}