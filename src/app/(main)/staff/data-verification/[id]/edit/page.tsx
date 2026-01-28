"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataVerificationService } from '@/services/DataVerificationService';
import { ArrowLeft, Save, Globe, MapPin, Building, User, ChevronDown, Search, Plus, Upload } from 'lucide-react';

interface FormData {
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organizationId: string;
  organizationName: string;
  targetUserId: string;
  targetUserFirstName: string;
  targetUserLastName: string;
  organizationDetails: {
    name: string;
    attachments: Array<{ fileUrl: string; comments: string }>;
    headquartersAddress: string;
    addressAttachments: Array<{ fileUrl: string; comments: string }>;
  };
  buildingPictures: {
    frontView: string;
    streetPicture: string;
    agentInFrontBuilding: string;
    whatsappLocation: string;
    insideOrganization: string;
    withStaffOrOwner: string;
    videoWithNeighbor: string;
  };
  transportationCost: {
    going: Array<{
      startPoint: string;
      time: string;
      nextDestination: string;
      fareSpent: number;
      timeSpent: string;
    }>;
    finalDestination: string;
    finalFareSpent: number;
    finalTime: string;
    totalJourneyTime: string;
    comingBack: {
      totalTransportationCost: number;
      otherExpensesCost: number;
      receiptUrl: string;
    };
  };
}

export default function EditDataVerificationPage() {
  const router = useRouter();
  const params = useParams();
  const verificationId = params.id as string;
  
  const dataVerificationService = new DataVerificationService();
  
  const [formData, setFormData] = useState<FormData>({
    country: '',
    state: '',
    lga: '',
    city: '',
    cityRegion: '',
    organizationId: '',
    organizationName: '',
    targetUserId: '',
    targetUserFirstName: '',
    targetUserLastName: '',
    organizationDetails: {
      name: '',
      attachments: [],
      headquartersAddress: '',
      addressAttachments: []
    },
    buildingPictures: {
      frontView: '',
      streetPicture: '',
      agentInFrontBuilding: '',
      whatsappLocation: '',
      insideOrganization: '',
      withStaffOrOwner: '',
      videoWithNeighbor: ''
    },
    transportationCost: {
      going: [],
      finalDestination: '',
      finalFareSpent: 0,
      finalTime: '',
      totalJourneyTime: '',
      comingBack: {
        totalTransportationCost: 0,
        otherExpensesCost: 0,
        receiptUrl: ''
      }
    }
  });

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (verificationId) {
      fetchVerification();
      fetchOrganizations();
      fetchUsers();
    }
  }, [verificationId]);

  const fetchVerification = async () => {
    try {
      const response = await dataVerificationService.getVerificationById(verificationId);
      if (response.success) {
        // Populate form with existing data
        const verification = response.data.verification;
        setFormData({
          country: verification.country || '',
          state: verification.state || '',
          lga: verification.lga || '',
          city: verification.city || '',
          cityRegion: verification.cityRegion || '',
          organizationId: verification.organizationId || '',
          organizationName: verification.organizationName || '',
          targetUserId: verification.targetUserId || '',
          targetUserFirstName: verification.targetUserFirstName || '',
          targetUserLastName: verification.targetUserLastName || '',
          organizationDetails: verification.organizationDetails || {
            name: '',
            attachments: [],
            headquartersAddress: '',
            addressAttachments: []
          },
          buildingPictures: verification.buildingPictures || {
            frontView: '',
            streetPicture: '',
            agentInFrontBuilding: '',
            whatsappLocation: '',
            insideOrganization: '',
            withStaffOrOwner: '',
            videoWithNeighbor: ''
          },
          transportationCost: verification.transportationCost || {
            going: [],
            finalDestination: '',
            finalFareSpent: 0,
            finalTime: '',
            totalJourneyTime: '',
            comingBack: {
              totalTransportationCost: 0,
              otherExpensesCost: 0,
              receiptUrl: ''
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching verification:', error);
      // Use mock data for demo
      setFormData({
        country: 'Nigeria',
        state: 'Lagos',
        lga: 'Ikeja',
        city: 'Ikeja',
        cityRegion: 'Allen Avenue',
        organizationId: 'org-1',
        organizationName: 'Tech Solutions Ltd',
        targetUserId: 'user-1',
        targetUserFirstName: 'John',
        targetUserLastName: 'Doe',
        organizationDetails: {
          name: 'Tech Solutions Ltd',
          attachments: [],
          headquartersAddress: '123 Allen Avenue, Ikeja, Lagos',
          addressAttachments: []
        },
        buildingPictures: {
          frontView: '',
          streetPicture: '',
          agentInFrontBuilding: '',
          whatsappLocation: '',
          insideOrganization: '',
          withStaffOrOwner: '',
          videoWithNeighbor: ''
        },
        transportationCost: {
          going: [],
          finalDestination: '',
          finalFareSpent: 0,
          finalTime: '',
          totalJourneyTime: '',
          comingBack: {
            totalTransportationCost: 0,
            otherExpensesCost: 0,
            receiptUrl: ''
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await dataVerificationService.getOrganizations();
      if (response.success) {
        setOrganizations(response.data.organizations);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Mock data for demo
      setOrganizations([
        { id: 'org-1', name: 'Tech Solutions Ltd' },
        { id: 'org-2', name: 'Global Services Inc' },
        { id: 'org-3', name: 'Innovation Hub Co' }
      ]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await dataVerificationService.getUsers();
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demo
      setUsers([
        { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', organizationId: 'org-1' },
        { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', organizationId: 'org-2' }
      ]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNestedInputChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      
      // Type guard to ensure we're working with object types
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...(sectionData as Record<string, any>),
            [field]: value
          }
        };
      }
      
      // Fallback - shouldn't happen with proper usage
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.lga) newErrors.lga = 'LGA is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.cityRegion) newErrors.cityRegion = 'City Region is required';
    if (!formData.organizationId) newErrors.organizationId = 'Organization is required';
    if (!formData.targetUserId) newErrors.targetUserId = 'Target user is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Prepare the data for update
      const updateData = {
        country: formData.country,
        state: formData.state,
        lga: formData.lga,
        city: formData.city,
        cityRegion: formData.cityRegion,
        organizationId: formData.organizationId,
        organizationName: organizations.find(org => org.id === formData.organizationId)?.name || '',
        targetUserId: formData.targetUserId,
        targetUserFirstName: users.find(user => user.id === formData.targetUserId)?.firstName || '',
        targetUserLastName: users.find(user => user.id === formData.targetUserId)?.lastName || '',
        organizationDetails: formData.organizationDetails,
        buildingPictures: formData.buildingPictures,
        transportationCost: formData.transportationCost
      };

      const response = await dataVerificationService.updateVerification(verificationId, updateData);
      
      if (response.success) {
        alert('Verification updated successfully!');
        router.push(`/staff/data-verification/${verificationId}`);
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Failed to update verification. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push(`/staff/data-verification/${verificationId}`);
    }
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Edit Data Verification</h1>
            <p className="text-gray-600">Update the verification details for this organization</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            {/* Location Information */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Location Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleInputChange}
                    placeholder="Enter Local Government Area"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.lga ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lga && <p className="text-red-500 text-xs mt-1">{errors.lga}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cityRegion"
                    value={formData.cityRegion}
                    onChange={handleInputChange}
                    placeholder="Enter region within the city"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.cityRegion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cityRegion && <p className="text-red-500 text-xs mt-1">{errors.cityRegion}</p>}
                </div>
              </div>
            </div>

            {/* Organization Selection */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Organization Information
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.organizationId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select organization</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                  {errors.organizationId && <p className="text-red-500 text-xs mt-1">{errors.organizationId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target User <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="targetUserId"
                    value={formData.targetUserId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] ${
                      errors.targetUserId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select target user</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.targetUserId && <p className="text-red-500 text-xs mt-1">{errors.targetUserId}</p>}
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Organization Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters Address
                  </label>
                  <textarea
                    value={formData.organizationDetails.headquartersAddress}
                    onChange={(e) => handleNestedInputChange('organizationDetails', 'headquartersAddress', e.target.value)}
                    placeholder="Enter headquarters address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  />
                </div>
              </div>
            </div>

            {/* Building Pictures */}
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4 pb-2 border-b border-gray-200">
                Building Documentation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front View Picture
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.frontView}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'frontView', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Picture
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.streetPicture}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'streetPicture', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent in Front of Building
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.agentInFrontBuilding}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'agentInFrontBuilding', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Location Screenshot
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.whatsappLocation}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'whatsappLocation', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inside Organization
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.insideOrganization}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'insideOrganization', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    With Staff or Owner
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.withStaffOrOwner}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'withStaffOrOwner', e.target.value)}
                      placeholder="Enter image URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video with Neighbor
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="text"
                      value={formData.buildingPictures.videoWithNeighbor}
                      onChange={(e) => handleNestedInputChange('buildingPictures', 'videoWithNeighbor', e.target.value)}
                      placeholder="Enter video URL or upload file"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-5 py-2.5 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Verification
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}