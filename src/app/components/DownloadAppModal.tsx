"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, ChevronDown } from "lucide-react"
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
  
  // Country search state
  const [countrySearchTerm, setCountrySearchTerm] = useState("")
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const countrySearchRef = useRef<HTMLDivElement>(null)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [loadingPlatform, setLoadingPlatform] = useState<Platform | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Load industries when modal opens and role is ORGANIZATION
  useEffect(() => {
    if (isOpen && role === "ORGANIZATION") {
      loadIndustries()
    }
  }, [isOpen, role])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countrySearchRef.current && !countrySearchRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadIndustries = async () => {
    try {
      console.log("Loading industries...")
      const response = await apkDownloadService.getIndustries()
      console.log("Industries response:", response)
      
      if (response.success && response.data?.industries) {
        setIndustries(response.data.industries)
      } else {
        console.warn("No industries found in response")
        setIndustries([])
      }
    } catch (err) {
      console.error("Failed to load industries:", err)
      setIndustries([])
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
          payload.industryName = selectedIndustry?.name || ""
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
          } else {
            setTimeout(() => {
              handleClose()
            }, 2000)
          }
        } else {
          throw new Error(response.message || "Signup failed")
        }
      }
    } catch (err: any) {
      console.error("Submission error:", err)
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
    setCountrySearchTerm("")
    setIsCountryDropdownOpen(false)
    setError("")
    setSuccess(false)
    setLoading(false)
    setLoadingPlatform(null)
    onClose()
  }

  if (!isOpen) return null

  // List of countries
  const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ]

  // Filter countries based on search term
  const filteredCountries = allCountries.filter(country =>
    country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  )

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
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {mode === "signup" 
              ? "Account created successfully! Download started. Please check your email to verify your account."
              : "Login successful! Download started."}
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

                  {/* Searchable Country Dropdown */}
                  <div className="relative" ref={countrySearchRef}>
                    <div
                      onClick={() => !loading && setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#5D2A8B] focus-within:border-transparent cursor-pointer flex items-center justify-between bg-white"
                    >
                      <span className={country ? "text-gray-900" : "text-gray-500"}>
                        {country || "Select your country *"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${
                          isCountryDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchTerm}
                              onChange={(e) => setCountrySearchTerm(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setCountry(c)
                                  setIsCountryDropdownOpen(false)
                                  setCountrySearchTerm("")
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-[#F4EFFA] transition-colors focus:outline-none focus:bg-[#F4EFFA]"
                              >
                                {c}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-sm text-gray-500 text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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

            {/* Download Guide link */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  handleClose()
                  setTimeout(() => {
                    const section = document.getElementById("download-guide")
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  }, 150)
                }}
                className="inline-flex items-center gap-1.5 text-[#5D2A8B] hover:underline"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span>📖</span>
                <span>Not sure how to install? Read the download guide</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}