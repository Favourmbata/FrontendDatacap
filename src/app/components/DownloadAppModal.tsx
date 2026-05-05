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
          {/* <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white text-[#5D2A8B] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button> */}
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
                {/* <option value="SERVICE_PROVIDER">Service Provider</option>
                <option value="TAILOR">Tailor</option> */}
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

                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="" disabled>Select your country *</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="East Timor">East Timor</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Grenada">Grenada</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bissau">Guinea-Bissau</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Korea">North Korea</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="South Sudan">South Sudan</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>

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
