"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X, Save } from 'lucide-react';
import ServiceProviderAssignmentService, { 
  OrganizationUser,
  UserAssignment
} from '@/services/ServiceProviderAssignmentService';

const EditServiceProviderPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<OrganizationUser | null>(null);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [availabilityHours, setAvailabilityHours] = useState('9 AM - 5 PM');
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await ServiceProviderAssignmentService.getAllUsers();
      
      if (response.success) {
        const foundUser = response.data.users.find(u => u.userId === userId);
        if (foundUser) {
          setUser(foundUser);
          setIsServiceProvider(foundUser.isServiceProvider);
          setSpecialties(foundUser.serviceProviderInfo?.specialties || []);
          setAvailabilityHours(foundUser.serviceProviderInfo?.availabilityHours || '9 AM - 5 PM');
        } else {
          alert('User not found');
          router.push('/admin/gallery/service-provider-assignment');
        }
      }
    } catch (err: any) {
      console.error('Error fetching user:', err);
      alert(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    if (!specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const assignment: UserAssignment = {
        userId,
        isServiceProvider,
        specialties: isServiceProvider ? specialties : [],
        availabilityHours: isServiceProvider ? availabilityHours : undefined
      };

      const response = await ServiceProviderAssignmentService.bulkAssign({
        userAssignments: [assignment]
      });

      if (response.success) {
        alert('User updated successfully');
        router.push('/admin/gallery/service-provider-assignment');
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Providers
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Service Provider</h1>
          <p className="text-gray-600">Update user role and configuration</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm">{user.customUserId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg text-sm">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg text-sm">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
              <p className="px-3 py-2 bg-gray-100 rounded-lg text-sm">{user.systemRole}</p>
            </div>
          </div>
        </div>

        {/* Service Provider Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Service Provider Settings</h2>
          
          {/* Toggle Service Provider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Provider Status
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setIsServiceProvider(true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  isServiceProvider
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Service Provider</div>
                <div className="text-xs mt-1">Can receive bookings</div>
              </button>
              <button
                onClick={() => setIsServiceProvider(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  !isServiceProvider
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Regular User</div>
                <div className="text-xs mt-1">Cannot receive bookings</div>
              </button>
            </div>
          </div>

          {isServiceProvider && (
            <>
              {/* Specialties */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                    placeholder="Add specialty (e.g., Hair Cutting)..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAddSpecialty}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Availability Hours */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Hours
                </label>
                <input
                  type="text"
                  value={availabilityHours}
                  onChange={(e) => setAvailabilityHours(e.target.value)}
                  placeholder="e.g., 9 AM - 5 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: 9 AM - 5 PM, 10 AM - 7 PM, Monday - Friday
                </p>
              </div>

              {/* Current Stats */}
              {user.serviceProviderInfo && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Current Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Total Bookings</p>
                      <p className="text-xl font-bold text-blue-900">{user.serviceProviderInfo.totalBookings}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Completed</p>
                      <p className="text-xl font-bold text-green-900">{user.serviceProviderInfo.completedBookings}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-xs text-yellow-600 mb-1">Rating</p>
                      <p className="text-xl font-bold text-yellow-900">{user.serviceProviderInfo.rating.toFixed(1)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-600 mb-1">Status</p>
                      <p className="text-xl font-bold text-purple-900">
                        {user.serviceProviderInfo.isAvailable ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceProviderPage;
