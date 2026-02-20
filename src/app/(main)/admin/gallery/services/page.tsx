"use client";

import { useState } from "react";
import { 
  Service, 
  SubService,
  SUB_SERVICE_COUNT_OPTIONS, 
  INITIAL_SERVICE,
  INITIAL_SUB_SERVICE
} from "@/types/sub-service";
import { SubServiceForm } from "@/app/components/sub-service";



const Input = ({ label, value, onChange, error, type = "text", placeholder, ...props }: any) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, error, options, ...props }: any) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Checkbox = ({ label, checked, onChange, error, ...props }: any) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300 rounded"
      {...props}
    />
    <label className="text-sm text-gray-700">{label}</label>
    {error && <p className="text-red-500 text-xs ml-2">{error}</p>}
  </div>
);

const RadioGroup = ({ options, value, onChange, name }: any) => (
  <div className="flex space-x-4">
    {options.map((option: any) => (
      <label key={option.value} className="flex items-center space-x-2">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={(e) => onChange(e.target.value)}
          className="w-4 h-4 text-[#5d2a8b] focus:ring-[#5d2a8b] border-gray-300"
        />
        <span className="text-sm text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);

export default function ServiceSetupPage() {
  const [step, setStep] = useState<"basic" | "subservices">("basic");
  const [service, setService] = useState<Service>(INITIAL_SERVICE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleServiceChange = (field: keyof Service, value: any) => {
    setService(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleSubServiceChange = (index: number, field: keyof SubService, value: any) => {
    const updatedSubServices = [...service.subServices];
    updatedSubServices[index] = { ...updatedSubServices[index], [field]: value };
    setService(prev => ({ ...prev, subServices: updatedSubServices }));
    
    const errorKey = `subServices.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSubServiceCountChange = (count: number) => {
    const countNum = Number(count);
    setService(prev => ({ ...prev, subServiceCount: countNum }));
    
    const currentCount = service.subServices.length;
    let updatedSubServices = [...service.subServices];
    
    if (countNum > currentCount) {
      for (let i = currentCount; i < countNum; i++) {
        updatedSubServices.push({
          ...INITIAL_SUB_SERVICE,
          id: `sub-${i}`,
        });
      }
    } else if (countNum < currentCount) {
      updatedSubServices = updatedSubServices.slice(0, countNum);
    }
    
    setService(prev => ({ ...prev, subServices: updatedSubServices }));
  };

  const removeSubService = (index: number) => {
    const updatedSubServices = service.subServices.filter((_, i) => i !== index);
    setService(prev => ({ 
      ...prev, 
      subServices: updatedSubServices,
      subServiceCount: updatedSubServices.length 
    }));
  };

  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!service.name) newErrors.name = "Service name is required";
    if (!service.description) newErrors.description = "Description is required";
    if (!service.category) newErrors.category = "Category is required";
    if (!service.totalProviders) newErrors.totalProviders = "Total providers is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSubServices = (): boolean => {
    const newErrors: Record<string, string> = {};

    service.subServices.forEach((sub, index) => {
      if (!sub.name) newErrors[`subServices.${index}.name`] = "Sub-service name is required";
      if (!sub.description) newErrors[`subServices.${index}.description`] = "Description is required";
      if (!sub.price) newErrors[`subServices.${index}.price`] = "Price is required";
      if (!sub.subPlatformUniqueCode) newErrors[`subServices.${index}.subPlatformUniqueCode`] = "Unique code is required";
    });

    if (!service.timeSlot?.startTime) newErrors["timeSlot.startTime"] = "Start time is required";
    if (!service.timeSlot?.endTime) newErrors["timeSlot.endTime"] = "End time is required";
    
    if (service.visibilityPeriod.startDate && service.visibilityPeriod.endDate) {
      if (new Date(service.visibilityPeriod.startDate) > new Date(service.visibilityPeriod.endDate)) {
        newErrors["visibilityPeriod.endDate"] = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = step === "basic" ? validateBasicInfo() : validateSubServices();
    
    if (isValid) {
      if (step === "basic") {
        setStep("subservices");
      } else {
        console.log("Service submitted:", service);
        alert("Service setup completed successfully!");
      }
    } else {
      alert("Please fix the errors before proceeding");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
       
        <p className="text-gray-600 mb-8">Configure your service and its sub-services</p>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center ${step === "basic" ? "text-[#5d2a8b]" : "text-gray-400"}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === "basic" ? "bg-[#5d2a8b] text-white" : "bg-gray-200 text-gray-600"
            }`}>1</span>
            <span className="ml-2 font-medium">Basic Info</span>
          </div>
          <div className={`w-16 h-0.5 mx-4 ${step === "subservices" ? "bg-[#5d2a8b]" : "bg-gray-300"}`}></div>
          <div className={`flex items-center ${step === "subservices" ? "text-[#5d2a8b]" : "text-gray-400"}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === "subservices" ? "bg-[#5d2a8b] text-white" : "bg-gray-200 text-gray-600"
            }`}>2</span>
            <span className="ml-2 font-medium">Sub-services</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
         
          {step === "basic" && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Basic Service Information 
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Service"
                    value={service.name}
                    onChange={(v: string) => handleServiceChange("name", v)}
                    error={errors.name}
                    placeholder="Enter service name"
                  />
                  <Input
                    label="Description"
                    value={service.description}
                    onChange={(v: string) => handleServiceChange("description", v)}
                    error={errors.description}
                    placeholder="Enter description"
                  />
                  <Input
                    label=" Category"
                    value={service.category}
                    onChange={(v: string) => handleServiceChange("category", v)}
                    error={errors.category}
                    placeholder="Enter category"
                  />
                  <Input
                    label="SKU"
                    value={service.sku}
                    onChange={(v: string) => handleServiceChange("sku", v)}
                    error={errors.sku}
                    placeholder="Enter SKU"
                  />
                  <Input
                    label=" Prodnar"
                    value={service.prodnar}
                    onChange={(v: string) => handleServiceChange("prodnar", v)}
                    error={errors.prodnar}
                    placeholder="Enter Prodnar"
                  />
                  <Input
                    label="UPC"
                    value={service.upc}
                    onChange={(v: string) => handleServiceChange("upc", v)}
                    error={errors.upc}
                    placeholder="Enter UPC code"
                  />
                  <Input
                    label=" Total Number of Available Workstation Service Providers"
                    value={service.totalProviders}
                    onChange={(v: string) => handleServiceChange("totalProviders", v)}
                    error={errors.totalProviders}
                    type="number"
                    placeholder="Enter number"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Sub-service Configuration 
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label=" Number of Sub-services"
                    value={service.subServiceCount}
                    onChange={handleSubServiceCountChange}
                    error={errors.subServiceCount}
                    options={SUB_SERVICE_COUNT_OPTIONS.map(n => ({ value: n, label: n }))}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Number selected will determine how many sub-services will be displayed
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-[#5d2a8b] text-white rounded-md hover:bg-[#4a2170] transition-colors"
              >
                Continue to Sub-services
              </button>
            </>
          )}

         
          {step === "subservices" && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Sub-services{service.subServiceCount}
                </h2>
                {service.subServices.length === 0 ? (
                  <div className="bg-purple-50 text-[#5d2a8b] px-4 py-3 rounded-md">
                    No sub-services configured. Please go back and set the number of sub-services.
                  </div>
                ) : (
                  service.subServices.map((sub, index) => (
                    <SubServiceForm
                      key={sub.id}
                      index={index}
                      subService={sub}
                      onChange={handleSubServiceChange}
                      onRemove={service.subServices.length > 2 ? () => removeSubService(index) : undefined}
                      showRemove={service.subServices.length > 2}
                      errors={errors}
                    />
                  ))
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Pricing & Charges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Discount"
                    value={service.discount}
                    onChange={(v: string) => handleServiceChange("discount", v)}
                    error={errors.discount}
                    type="number"
                    placeholder="0"
                  />
                  <Input
                    label="Discounted Amount"
                    value={service.discountedAmount}
                    onChange={(v: string) => handleServiceChange("discountedAmount", v)}
                    error={errors.discountedAmount}
                    type="number"
                    placeholder="0.00"
                  />
                  <Input
                    label="Platform Charge"
                    value={service.platformCharge}
                    onChange={(v: string) => handleServiceChange("platformCharge", v)}
                    error={errors.platformCharge}
                    type="number"
                    placeholder="0.00"
                  />
                  <Input
                    label="Actual Amount"
                    value={service.actualAmount}
                    onChange={(v: string) => handleServiceChange("actualAmount", v)}
                    error={errors.actualAmount}
                    type="number"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Visibility Period & Upfront Payment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Visibility Start Date"
                    value={service.visibilityPeriod.startDate}
                    onChange={(v: string) => handleServiceChange("visibilityPeriod", { 
                      ...service.visibilityPeriod, 
                      startDate: v 
                    })}
                    error={errors["visibilityPeriod.startDate"]}
                    type="date"
                  />
                  <Input
                    label="Visibility End Date"
                    value={service.visibilityPeriod.endDate}
                    onChange={(v: string) => handleServiceChange("visibilityPeriod", { 
                      ...service.visibilityPeriod, 
                      endDate: v 
                    })}
                    error={errors["visibilityPeriod.endDate"]}
                    type="date"
                  />
                </div>

                <div className="mt-4">
                  <Checkbox
                    label="Upfront Payment Required"
                    checked={service.upfrontPayment}
                    onChange={(v: boolean) => handleServiceChange("upfrontPayment", v)}
                    error={errors.upfrontPayment}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                  Service Providers' Calendar Availability
                </h2>
                <p className="text-sm text-gray-500 mb-4">Probability to use within a year:</p>
                
                <RadioGroup
                  options={[
                    { value: "unlimited", label: "1. Unlimited" },
                    { value: "period", label: "2. Over a period of time" }
                  ]}
                  value={service.availabilityType}
                  onChange={(v: "unlimited" | "period") => handleServiceChange("availabilityType", v)}
                  name="availabilityType"
                />

                {service.availabilityType === "period" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-3">For 18.2 - three months acceptance</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Year"
                        value={service.availabilityPeriod.startYear}
                        onChange={(v: string) => handleServiceChange("availabilityPeriod", { 
                          ...service.availabilityPeriod, 
                          startYear: v 
                        })}
                        error={errors["availabilityPeriod.startYear"]}
                        type="number"
                        placeholder={new Date().getFullYear().toString()}
                      />
                      <Input
                        label="End Year"
                        value={service.availabilityPeriod.endYear}
                        onChange={(v: string) => handleServiceChange("availabilityPeriod", { 
                          ...service.availabilityPeriod, 
                          endYear: v 
                        })}
                        error={errors["availabilityPeriod.endYear"]}
                        type="number"
                        placeholder={(new Date().getFullYear() + 1).toString()}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep("basic")}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#5d2a8b] text-white rounded-md hover:bg-[#4a2170] transition-colors font-semibold"
                >
                  Submit 
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}