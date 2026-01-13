

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  Check,
  Building,
  ShieldCheck,
  Upload,
  Plus,
  X,
  Clock,
} from "lucide-react"

interface SubscriptionPackage {
  id: string
  packageName: string
  description: string
  monthlyPrice: number
  quarterlyPrice: number
  yearlyPrice: number
  features: string[]
}

interface OrganizationDetails {
  type: "registered" | "unregistered"
  visibility: "public" | "private"
  verifiedBadge: boolean
  businessRegistrationNumber?: string
  ownerIdentificationType?: "international-passport" | "nin"
  ownerDocumentNumber?: string
  professionalTrade?: {
    associationName?: string
    membershipId?: string
    certificateFile?: File
  }
  products?: Array<{
    id: string
    name: string
    description: string
    price: number
    platformChargePercent: number
    actualPrice: number
    discount: number
    discountedActualPrice: number
    images: File[]
    video?: File
  }>
  locations?: Array<{
    id: string
    address: string
    openingTime: string
    closingTime: string
    availability: boolean
  }>
}

const SubscriptionPage: React.FC = () => {
  const [selectedPackages, setSelectedPackages] = useState<Record<string, "monthly" | "quarterly" | "yearly">>({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails>({
    type: "registered",
    visibility: "private",
    verifiedBadge: false,
    professionalTrade: {},
    products: [],
    locations: [],
  })

  const packages: SubscriptionPackage[] = [
    {
      id: "body-measurement",
      packageName: "Body Measurement",
      description: "Complete body measurement solution with AI-powered accuracy",
      monthlyPrice: 99.99,
      quarterlyPrice: 249.99,
      yearlyPrice: 899.99,
      features: [
        "AI-powered body measurements",
        "3D body scanning",
        "Size recommendations",
        "Body composition analysis",
        "Progress tracking",
      ],
    },
    {
      id: "questionnaire",
      packageName: "Questionnaire",
      description: "Comprehensive questionnaire management system",
      monthlyPrice: 79.99,
      quarterlyPrice: 199.99,
      yearlyPrice: 699.99,
      features: [
        "Custom questionnaire builder",
        "Multiple question types",
        "Response analytics",
        "Data export capabilities",
        "Automated insights",
      ],
    },
    {
      id: "assert-management",
      packageName: "Assert Management",
      description: "Complete assert management and tracking solution",
      monthlyPrice: 129.99,
      quarterlyPrice: 349.99,
      yearlyPrice: 1199.99,
      features: [
        "Assert tracking and monitoring",
        "Inventory management",
        "Maintenance scheduling",
        "Assert lifecycle management",
        "Reporting and analytics",
      ],
    },
  ]

  useEffect(() => {
    let total = 0
    Object.entries(selectedPackages).forEach(([packageId, billingCycle]) => {
      const pkg = packages.find((p) => p.id === packageId)
      if (pkg) {
        switch (billingCycle) {
          case "monthly":
            total += pkg.monthlyPrice
            break
          case "quarterly":
            total += pkg.quarterlyPrice
            break
          case "yearly":
            total += pkg.yearlyPrice
            break
        }
      }
    })
    setTotalAmount(total)
  }, [selectedPackages])

  const handlePackageSelection = (packageId: string, billingCycle: "monthly" | "quarterly" | "yearly") => {
    setSelectedPackages((prev) => {
      if (prev[packageId] === billingCycle) {
        const newSelections = { ...prev }
        delete newSelections[packageId]
        return newSelections
      }
      return { ...prev, [packageId]: billingCycle }
    })
  }

  const handleOrganizationDetailsChange = (field: keyof OrganizationDetails, value: any) => {
    setOrganizationDetails((prev) => {
      const updated = { ...prev, [field]: value }

      if (field === "type" && value === "unregistered") {
        updated.verifiedBadge = false
        updated.businessRegistrationNumber = ""
        updated.ownerIdentificationType = undefined
        updated.ownerDocumentNumber = ""
      }

      if (field === "visibility" && value === "private") {
        updated.verifiedBadge = false
      }

      if (field === "ownerIdentificationType") {
        updated.ownerDocumentNumber = ""
      }

      return updated
    })
  }

  const addProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: 0,
      platformChargePercent: 0,
      actualPrice: 0,
      discount: 0,
      discountedActualPrice: 0,
      images: [],
      video: undefined,
    }
    setOrganizationDetails((prev) => ({
      ...prev,
      products: [...(prev.products || []), newProduct],
    }))
  }

  const updateProduct = (productId: string, field: string, value: any) => {
    setOrganizationDetails((prev) => ({
      ...prev,
      products: (prev.products || []).map((p) =>
        p.id === productId
          ? {
              ...p,
              [field]: value,
              actualPrice:
                field === "price" || field === "platformChargePercent"
                  ? (value || p.price) +
                    ((value || p.price) * (field === "platformChargePercent" ? value : p.platformChargePercent)) / 100
                  : p.actualPrice,
              discountedActualPrice:
                field === "discount"
                  ? (p.actualPrice || 0) - ((p.actualPrice || 0) * (value || p.discount)) / 100
                  : p.discountedActualPrice,
            }
          : p,
      ),
    }))
  }

  const removeProduct = (productId: string) => {
    setOrganizationDetails((prev) => ({
      ...prev,
      products: (prev.products || []).filter((p) => p.id !== productId),
    }))
  }

  const addLocation = () => {
    const newLocation = {
      id: Date.now().toString(),
      address: "",
      openingTime: "10:00",
      closingTime: "17:00",
      availability: true,
    }
    setOrganizationDetails((prev) => ({
      ...prev,
      locations: [...(prev.locations || []), newLocation],
    }))
  }

  const updateLocation = (locationId: string, field: string, value: any) => {
    setOrganizationDetails((prev) => ({
      ...prev,
      locations: (prev.locations || []).map((l) => (l.id === locationId ? { ...l, [field]: value } : l)),
    }))
  }

  const removeLocation = (locationId: string) => {
    setOrganizationDetails((prev) => ({
      ...prev,
      locations: (prev.locations || []).filter((l) => l.id !== locationId),
    }))
  }

  const handlePayment = async () => {
    if (Object.keys(selectedPackages).length === 0) {
      alert("Please select at least one package to proceed with payment")
      return
    }

    if (organizationDetails.type === "registered" && !organizationDetails.businessRegistrationNumber?.trim()) {
      alert("Please enter your business registration number")
      return
    }

    if (organizationDetails.type === "registered") {
      if (!organizationDetails.ownerIdentificationType) {
        alert("Please select a means of identification for business owner verification")
        return
      }
      if (!organizationDetails.ownerDocumentNumber?.trim()) {
        alert("Please enter your identification document number")
        return
      }
    }

    setIsProcessingPayment(true)

    setTimeout(() => {
      setShowPaymentSuccess(true)
      setIsProcessingPayment(false)

      setTimeout(() => {
        alert("Payment successful! Redirecting to dashboard...")
      }, 1000)
    }, 2000)
  }

  const getBillingPrice = (pkg: SubscriptionPackage, billingCycle: "monthly" | "quarterly" | "yearly") => {
    switch (billingCycle) {
      case "monthly":
        return pkg.monthlyPrice
      case "quarterly":
        return pkg.quarterlyPrice
      case "yearly":
        return pkg.yearlyPrice
      default:
        return pkg.monthlyPrice
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              DC
            </div>
          </div>
          <span className="text-gray-500 text-sm">Subscription Required</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                Object.keys(selectedPackages).length > 0 ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium px-2">Packages</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                Object.keys(selectedPackages).length > 0 ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium px-2">Organization</span>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-300 text-gray-600">
              3
            </div>
            <span className="text-sm font-medium px-2">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                selectedPackages[pkg.id]
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                <select
                  value={selectedPackages[pkg.id] || ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      handlePackageSelection(pkg.id, e.target.value as "monthly" | "quarterly" | "yearly")
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Select Plan</option>
                  <option value="monthly">Monthly - ${pkg.monthlyPrice.toFixed(2)}</option>
                  <option value="quarterly">Quarterly - ${pkg.quarterlyPrice.toFixed(2)}</option>
                  <option value="yearly">Yearly - ${pkg.yearlyPrice.toFixed(2)}</option>
                </select>
              </div>
                      
              <p className="text-gray-700 mb-6 text-sm">{pkg.description}</p>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {selectedPackages[pkg.id]
                    ? `Selected: ${selectedPackages[pkg.id]} - $${getBillingPrice(pkg, selectedPackages[pkg.id]!).toFixed(2)}`
                    : "Not selected"}
                </span>
                {selectedPackages[pkg.id] && (
                  <button
                    onClick={() => handlePackageSelection(pkg.id, selectedPackages[pkg.id]!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(selectedPackages).length > 0 && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-6">
              <Building className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Step 2: Organization Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">1. Type of Business:</h3>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="organizationType"
                      value="registered"
                      checked={organizationDetails.type === "registered"}
                      onChange={(e) => handleOrganizationDetailsChange("type", e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Registered</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="organizationType"
                      value="unregistered"
                      checked={organizationDetails.type === "unregistered"}
                      onChange={(e) => handleOrganizationDetailsChange("type", e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Unregistered</span>
                  </label>
                </div>
              </div>

              {organizationDetails.type === "registered" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Registration Number (From government) *
                  </label>
                  <input
                    type="text"
                    value={organizationDetails.businessRegistrationNumber || ""}
                    onChange={(e) => handleOrganizationDetailsChange("businessRegistrationNumber", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your business registration number"
                  />
                  <p className="text-sm text-gray-500 mt-1">* Required for registered businesses</p>
                </div>
              )}

              {organizationDetails.type === "registered" && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">3. Business Owner's Verification</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select means of identification *
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="identificationType"
                          value="international-passport"
                          checked={organizationDetails.ownerIdentificationType === "international-passport"}
                          onChange={(e) => handleOrganizationDetailsChange("ownerIdentificationType", e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">International Passport</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="identificationType"
                          value="nin"
                          checked={organizationDetails.ownerIdentificationType === "nin"}
                          onChange={(e) => handleOrganizationDetailsChange("ownerIdentificationType", e.target.value)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700">NIN (National Identity Number)</span>
                      </label>
                    </div>
                  </div>

                  {organizationDetails.ownerIdentificationType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter Document Number *</label>
                      <input
                        type="text"
                        value={organizationDetails.ownerDocumentNumber || ""}
                        onChange={(e) => handleOrganizationDetailsChange("ownerDocumentNumber", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={
                          organizationDetails.ownerIdentificationType === "international-passport"
                            ? "Enter your International Passport number"
                            : "Enter your NIN"
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {organizationDetails.type === "registered" ? "4." : "2."} Make my organization's profile visible to
                  the public
                </h3>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={organizationDetails.visibility === "public"}
                      onChange={(e) => handleOrganizationDetailsChange("visibility", e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={organizationDetails.visibility === "private"}
                      onChange={(e) => handleOrganizationDetailsChange("visibility", e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">
                  Note: Visibility of your organization's profile to the public showcases your products & services and
                  increases revenue generation.
                </p>
              </div>

              {organizationDetails.visibility === "public" && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {organizationDetails.type === "registered" ? "5." : "3."} Do you want to be verified organisation to
                    gain prospective customers trust and get more preferential patronage?
                  </h3>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="verifiedBadge"
                        checked={organizationDetails.verifiedBadge === true}
                        onChange={() => handleOrganizationDetailsChange("verifiedBadge", true)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="verifiedBadge"
                        checked={organizationDetails.verifiedBadge === false}
                        onChange={() => handleOrganizationDetailsChange("verifiedBadge", false)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>

                  {organizationDetails.verifiedBadge && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start mb-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Verification Benefits</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            A verified badge helps build trust with customers and increases your organization's
                            credibility.
                            {organizationDetails.type === "registered" &&
                              " Your registration number and owner verification will be used for the verification process."}
                          </p>
                        </div>
                      </div>

                      {organizationDetails.type === "unregistered" && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                          <p className="text-sm text-yellow-900">
                            <strong>Note:</strong> To receive a verified badge, you need to have a registered business.
                            Please select "Registered" business type above and provide your registration number.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {Object.keys(selectedPackages).length > 0 && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Step 3: Professional Trade Association (Optional)</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Professional/Trade Association
                </label>
                <input
                  type="text"
                  value={organizationDetails.professionalTrade?.associationName || ""}
                  onChange={(e) =>
                    setOrganizationDetails((prev) => ({
                      ...prev,
                      professionalTrade: {
                        ...prev.professionalTrade,
                        associationName: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Chamber of Commerce, Professional Association"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membership ID (Optional)</label>
                <input
                  type="text"
                  value={organizationDetails.professionalTrade?.membershipId || ""}
                  onChange={(e) =>
                    setOrganizationDetails((prev) => ({
                      ...prev,
                      professionalTrade: {
                        ...prev.professionalTrade,
                        membershipId: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your membership ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Membership Certificate or ID
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setOrganizationDetails((prev) => ({
                            ...prev,
                            professionalTrade: {
                              ...prev.professionalTrade,
                              certificateFile: e.target.files![0],
                            },
                          }))
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {Object.keys(selectedPackages).length > 0 && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Step 4: Gallery (Optional)</h2>
              <button
                onClick={addProduct}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </div>

            {organizationDetails.products && organizationDetails.products.length > 0 ? (
              <div className="space-y-6">
                {organizationDetails.products.map((product, index) => (
                  <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900">Product {index + 1}</h3>
                      <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <input
                          type="text"
                          value={product.description}
                          onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="Enter product description"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, "price", Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform Charge %</label>
                        <input
                          type="number"
                          value={product.platformChargePercent}
                          onChange={(e) => updateProduct(product.id, "platformChargePercent", Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price (Auto)</label>
                        <input
                          type="number"
                          value={product.actualPrice}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                        <input
                          type="number"
                          value={product.discount}
                          onChange={(e) => updateProduct(product.id, "discount", Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discounted Actual Price (Auto)
                        </label>
                        <input
                          type="number"
                          value={product.discountedActualPrice}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images {organizationDetails.type === "registered" ? "(10 max)" : "(3 max)"}
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">Click to upload images</p>
                          </div>
                          <input type="file" className="hidden" multiple accept="image/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Note: Unverified firms can upload 3 images max, verified firms can upload 10 images max
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Video (Optional)</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">Click to upload video</p>
                          </div>
                          <input type="file" className="hidden" accept="video/*" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Max 3MB per video</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No products added yet. Click "Add Product" to get started.</p>
              </div>
            )}
          </div>
        )}

        {Object.keys(selectedPackages).length > 0 && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Step 5: Availability & Location (Optional)</h2>
              <button
                onClick={addLocation}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </button>
            </div>

            {organizationDetails.locations && organizationDetails.locations.length > 0 ? (
              <div className="space-y-6">
                {organizationDetails.locations.map((location, index) => (
                  <div key={location.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-purple-600" />
                        Location {index + 1}
                      </h3>
                      <button onClick={() => removeLocation(location.id)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                        <input
                          type="text"
                          value={location.address}
                          onChange={(e) => updateLocation(location.id, "address", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter business location address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time *</label>
                          <input
                            type="time"
                            value={location.openingTime}
                            onChange={(e) => updateLocation(location.id, "openingTime", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time *</label>
                          <input
                            type="time"
                            value={location.closingTime}
                            onChange={(e) => updateLocation(location.id, "closingTime", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={location.availability}
                            onChange={(e) => updateLocation(location.id, "availability", e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Currently Open/Available</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No locations added yet. Click "Add Location" to get started.</p>
              </div>
            )}
          </div>
        )}

        {Object.keys(selectedPackages).length === 0 && (
          <div className="mb-8 bg-blue-50 rounded-xl border border-blue-200 p-8 text-center">
            <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Packages Selected</h3>
            <p className="text-blue-800">
              Please select at least one package above to proceed with organization setup and payment.
            </p>
          </div>
        )}

        {Object.keys(selectedPackages).length > 0 && (
          <>
            <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Total Amount</h3>
                  <p className="text-sm opacity-90">For all selected packages</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm opacity-90">{Object.keys(selectedPackages).length} package(s)</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Complete Payment</h3>
                  <p className="text-sm text-gray-600 mt-1">Access all modules after payment</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isProcessingPayment ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ${totalAmount.toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              {showPaymentSuccess && (
                <div className="mt-4 flex items-center p-3 bg-green-100 text-green-800 rounded-lg">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment successful! Redirecting...</span>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default SubscriptionPage
