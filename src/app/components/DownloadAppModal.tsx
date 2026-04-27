"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { apkDownloadService } from "@/services/apkDownloadService"

interface DownloadAppModalProps {
  isOpen: boolean
  onClose: () => void
}

type UserRole = "CUSTOMER" | "ORGANIZATION" | "SERVICE_PROVIDER" | "TAILOR"
type Platform = "android" | "ios"

interface Industry {
  id: string
  name: string
  description?: string
}

export default function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const router = useRouter()
  
  // Mode: signup or login
  const [mode, setMode] = useState<"signup" | "login">("signup")
  
  // Form state
  const [role, setRole] = useState<UserRole>("CUSTOMER")
  const [platform, setPlatform] = useState<Platform>("android")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  
  // Organization-specific fields
  const [organizationName, setOrganizationName] = useState("")
  const [country, setCountry] = useState("")
  const [industryId, setIndustryId] = useState("")
  const [industries, setIndustries] = useState<Industry[]>([])
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [loadingPlatform, setLoadingPlatform] = useState<Platform | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen && role === "ORGANIZATION" && industries.length === 0) {
      loadIndustries()
    }
  }, [isOpen, role])

  const loadIndustries = async () => {
    try {
      const response = await apkDownloadService.getIndustries()
      if (response.success) {
        setIndustries(response.data.industries)
      }
    } catch (err) {
      console.error("Failed to load industries:", err)
    }
  }

  const handleSubmit = async (selectedPlatform: Platform) => {
    setError("")
    setPlatform(selectedPlatform)
    setLoading(true)
    setLoadingPlatform(selectedPlatform)

    try {
      // Validation
      if (!email || !password) {
        throw new Error("Please fill in email and password")
      }

      if (mode === "signup") {
        if (!fullName) {
          throw new Error("Please fill in your full name")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        if (role === "ORGANIZATION") {
          if (!organizationName || !country || !phoneNumber || !industryId) {
            throw new Error("Please fill in all organization fields")
          }
        }
      }

      if (mode === "login") {
        // Login and download for existing users
        const payload = {
          email,
          password,
          platform: selectedPlatform,
        }

        const response = await apkDownloadService.loginAndDownload(payload)

        if (response.success) {
          // Store JWT token
          if (response.data.jwtToken) {
            localStorage.setItem("authToken", response.data.jwtToken)
          }

          // Trigger download
          apkDownloadService.triggerDownload(response.data.downloadUrl, selectedPlatform)

          // Show success message
          setSuccess(true)

          // Close modal after delay
          setTimeout(() => {
            handleClose()
          }, 2000)
        } else {
          throw new Error(response.message || "Login failed")
        }
      } else {
        // Signup and download for new users
        const payload: any = {
          email,
          password,
          fullName,
          firstName,
          lastName,
          phoneNumber,
          role,
          platform: selectedPlatform,
        }

        if (role === "ORGANIZATION") {
          const selectedIndustry = industries.find(ind => ind.id === industryId)
          payload.organizationName = organizationName
          payload.country = country
          payload.industryId = industryId
          payload.industryName = selectedIndustry?.name
        }

        const response = await apkDownloadService.signupAndDownload(payload)

        if (response.success) {
          // Store JWT token if provided
          if (response.data.jwtToken) {
            localStorage.setItem("authToken", response.data.jwtToken)
          }

          // Trigger download
          apkDownloadService.triggerDownload(response.data.downloadUrl, selectedPlatform)

          // Show success message
          setSuccess(true)

          // Redirect to verification after delay
          if (response.data.requiresVerification) {
            setTimeout(() => {
              onClose()
              router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
            }, 3000)
          }
        } else {
          throw new Error(response.message || "Signup failed")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
      setLoadingPlatform(null)
    }
  }

  const handleClose = () => {
    // Reset form
    setMode("signup")
    setEmail("")
    setPassword("")
    setFullName("")
    setFirstName("")
    setLastName("")
    setPhoneNumber("")
    setOrganizationName("")
    setCountry("")
    setIndustryId("")
    setError("")
    setSuccess(false)
    setLoading(false)
    setLoadingPlatform(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative bg-white rounded-2xl w-full max-w-md p-6 pt-8 max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2
          className="text-xl font-semibold text-[#1A1A1A] mb-2"
          style={{ fontFamily: "Monument Extended, sans-serif" }}
        >
          Download App
        </h2>
        <p className="text-sm text-[#6E6E6E] mb-6">
          {mode === "signup" 
            ? "Sign up briefly to download the app for a great experience." 
            : "Login to download the app."}
        </p>

        {/* Mode Toggle */}
        <div className="mb-6 flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-white text-[#5D2A8B] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white text-[#5D2A8B] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            Account created successfully! Download started. Please check your email to verify your account.
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Role Selection - Only for signup */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                I am signing up as:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                disabled={loading}
              >
                <option value="CUSTOMER">Customer (Individual User)</option>
                <option value="ORGANIZATION">Organization</option>
                <option value="SERVICE_PROVIDER">Service Provider</option>
                <option value="TAILOR">Tailor</option>
              </select>
            </div>
          )}

          {/* Basic Fields */}
          <div>
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={mode === "signup" ? "Password * (min 6 characters)" : "Password *"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
              required
              minLength={mode === "signup" ? 6 : undefined}
              disabled={loading}
            />
          </div>

          {mode === "signup" && (
            <div>
              <input
                type="text"
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          )}

          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Organization Fields */}
              {role === "ORGANIZATION" && (
                <div className="space-y-4 p-4 bg-[#F4EFFA] rounded-lg">
                  <h3 className="font-medium text-[#1A1A1A]">Organization Details</h3>
                  
                  <input
                    type="text"
                    placeholder="Organization Name *"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    required
                    disabled={loading}
                  />

                  <input
                    type="text"
                    placeholder="Country *"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    required
                    disabled={loading}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    required
                    disabled={loading}
                  />

                  <select
                    value={industryId}
                    onChange={(e) => setIndustryId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Industry *</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Phone number for non-organization roles */}
              {role !== "ORGANIZATION" && (
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              )}
            </>
          )}

          {/* Platform Download Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit("android")}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-[#5D2A8B] text-[#5D2A8B] font-medium text-sm hover:bg-[#F4EFFA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPlatform === "android" ? "Processing..." : "📱 Sign Up & Download for Android"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("ios")}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#5D2A8B] text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPlatform === "ios" ? "Processing..." : "🍎 Sign Up & Download for iOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
