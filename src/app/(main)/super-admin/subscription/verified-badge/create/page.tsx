"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Building,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  DollarSign,
  Calendar,
  Globe,
  Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BranchFormData {
  id: string;
  branchName: string;
  houseNumber: string;
  streetName: string;
  cityRegion: string;
  buildingType: string;
  lga: string;
  state: string;
  country: string;
  contactPerson: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
}

const CreateVerifiedBadgePage = () => {
  const router = useRouter();
  
  // Main form state
  const [formData, setFormData] = useState({
    name: '',
    totalSubscriptionAmount: '',
    currency: 'NGN',
    totalLocations: '1',
    headquarters: '',
    locationVerificationCost: '',
    subscriptionDuration: '12',
    address: '',
    city: '',
    lga: '',
    state: '',
    country: 'Nigeria',
  });

  // Branches state
  const [branches, setBranches] = useState<BranchFormData[]>([
    {
      id: '1',
      branchName: '',
      houseNumber: '',
      streetName: '',
      cityRegion: '',
      buildingType: '',
      lga: '',
      state: '',
      country: 'Nigeria',
      contactPerson: '',
      contactPosition: '',
      contactEmail: '',
      contactPhone: ''
    }
  ]);

  // Handle main form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle branch input change
  const handleBranchChange = (index: number, field: keyof BranchFormData, value: string) => {
    const updatedBranches = [...branches];
    updatedBranches[index] = {
      ...updatedBranches[index],
      [field]: value
    };
    setBranches(updatedBranches);
  };

  // Add new branch
  const addBranch = () => {
    const newBranch: BranchFormData = {
      id: Date.now().toString(),
      branchName: '',
      houseNumber: '',
      streetName: '',
      cityRegion: '',
      buildingType: '',
      lga: '',
      state: '',
      country: 'Nigeria',
      contactPerson: '',
      contactPosition: '',
      contactEmail: '',
      contactPhone: ''
    };
    setBranches([...branches, newBranch]);
    
    // Update total locations
    setFormData(prev => ({
      ...prev,
      totalLocations: (branches.length + 1).toString()
    }));
  };

  // Remove branch
  const removeBranch = (index: number) => {
    if (branches.length > 1) {
      const updatedBranches = branches.filter((_, i) => i !== index);
      setBranches(updatedBranches);
      
      // Update total locations
      setFormData(prev => ({
        ...prev,
        totalLocations: updatedBranches.length.toString()
      }));
    }
  };

  // Calculate total subscription amount
  const calculateTotalSubscription = () => {
    const verificationCost = parseFloat(formData.locationVerificationCost) || 0;
    const baseCost = verificationCost * (branches.length || 1);
    return baseCost + (baseCost * 0.2); // Add 20% for service fee
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total
    const totalSubscriptionAmount = calculateTotalSubscription();
    
    const submissionData = {
      ...formData,
      totalSubscriptionAmount,
      branches: branches.map(branch => ({
        ...branch,
        buildingType: branch.buildingType || undefined,
        contactPerson: branch.contactPerson || undefined,
        contactPosition: branch.contactPosition || undefined,
        contactEmail: branch.contactEmail || undefined,
        contactPhone: branch.contactPhone || undefined
      }))
    };

    console.log('Submitting:', submissionData);
    
    // Here you would typically make an API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Verified badge subscription created successfully!');
      
      // Redirect back to list
      router.push('/super-admin/subscription/verified-badge');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription. Please try again.');
    }
  };

  // States for Nigeria
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to List
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Verified Badge Subscription</h1>
              <p className="text-gray-600">Add a new organization for verified badge subscription</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Organization Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Organization Basic Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Organization Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter organization name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headquarters Name *
                    </label>
                    <input
                      type="text"
                      name="headquarters"
                      required
                      value={formData.headquarters}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter headquarters name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter complete address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LGA *
                    </label>
                    <input
                      type="text"
                      name="lga"
                      required
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter Local Government Area"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Locations
                    </label>
                    <input
                      type="number"
                      name="totalLocations"
                      value={formData.totalLocations}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Automatically calculated from branches</p>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Subscription Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Verification Cost (₦) *
                    </label>
                    <input
                      type="number"
                      name="locationVerificationCost"
                      required
                      value={formData.locationVerificationCost}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter verification cost per location"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subscription Duration *
                    </label>
                    <select
                      name="subscriptionDuration"
                      required
                      value={formData.subscriptionDuration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      required
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Total Subscription
                    </label>
                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-lg font-bold text-green-600">
                        ₦ {calculateTotalSubscription().toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Calculated based on {branches.length} location(s) × ₦{formData.locationVerificationCost || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branches Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-blue-600" />
                    Branches ({branches.length})
                  </h2>
                  <button
                    type="button"
                    onClick={addBranch}
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    Add Branch
                  </button>
                </div>
                
                <div className="space-y-6">
                  {branches.map((branch, index) => (
                    <div key={branch.id} className="border border-gray-200 rounded-xl p-6 relative">
                      {branches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBranch(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                      
                      <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        Branch {index + 1} {index === 0 && '(Headquarters)'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Name *
                          </label>
                          <input
                            type="text"
                            value={branch.branchName}
                            onChange={(e) => handleBranchChange(index, 'branchName', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter branch name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Building Type
                          </label>
                          <select
                            value={branch.buildingType}
                            onChange={(e) => handleBranchChange(index, 'buildingType', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          >
                            <option value="">Select Type</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Residential">Residential</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Mixed Use">Mixed Use</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            House Number *
                          </label>
                          <input
                            type="text"
                            value={branch.houseNumber}
                            onChange={(e) => handleBranchChange(index, 'houseNumber', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter house number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Name *
                          </label>
                          <input
                            type="text"
                            value={branch.streetName}
                            onChange={(e) => handleBranchChange(index, 'streetName', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter street name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City's Region *
                          </label>
                          <input
                            type="text"
                            value={branch.cityRegion}
                            onChange={(e) => handleBranchChange(index, 'cityRegion', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter city region (e.g., GRA, CBD)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LGA *
                          </label>
                          <input
                            type="text"
                            value={branch.lga}
                            onChange={(e) => handleBranchChange(index, 'lga', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Enter Local Government Area"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <select
                            value={branch.state}
                            onChange={(e) => handleBranchChange(index, 'state', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          >
                            <option value="">Select State</option>
                            {nigerianStates.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            value={branch.country}
                            onChange={(e) => handleBranchChange(index, 'country', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          Contact Person (Optional)
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={branch.contactPerson}
                              onChange={(e) => handleBranchChange(index, 'contactPerson', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              placeholder="Enter contact person name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Position
                            </label>
                            <input
                              type="text"
                              value={branch.contactPosition}
                              onChange={(e) => handleBranchChange(index, 'contactPosition', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              placeholder="Enter position"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={branch.contactEmail}
                              onChange={(e) => handleBranchChange(index, 'contactEmail', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              placeholder="Enter email address"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={branch.contactPhone}
                              onChange={(e) => handleBranchChange(index, 'contactPhone', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

           
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVerifiedBadgePage;