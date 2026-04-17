"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, UserPlus, UserMinus, Loader2, Plus, X } from 'lucide-react';
import ServiceProviderAssignmentService, { 
  OrganizationUser,
  UserAssignment
} from '@/services/ServiceProviderAssignmentService';

const AssignServiceProvidersPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [assignments, setAssignments] = useState<Map<string, UserAssignment>>(new Map());
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    const preSelectedUsers = searchParams.get('users');
    fetchUsers(preSelectedUsers);
  }, []);

  const fetchUsers = async (preSelectedUsers: string | null) => {
    try {
      setLoading(true);
      const response = await ServiceProviderAssignmentService.getAllUsers();
      
      if (response.success) {
        let filteredUsers = response.data.users;
        
        // If specific users were pre-selected, filter to those
        if (preSelectedUsers) {
          const userIds = preSelectedUsers.split(',');
          filteredUsers = response.data.users.filter(u => userIds.includes(u.userId));
        }
        
        setUsers(filteredUsers);
        
        // Initialize assignments map
        const initialAssignments = new Map<string, UserAssignment>();
        filteredUsers.forEach(user => {
          initialAssignments.set(user.userId, {
            userId: user.userId,
            isServiceProvider: user.isServiceProvider,
            specialties: user.serviceProviderInfo?.specialties || [],
            availabilityHours: user.serviceProviderInfo?.availabilityHours || '9 AM - 5 PM'
          });
        });
        setAssignments(initialAssignments);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      alert(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProvider = (userId: string, isProvider: boolean) => {
    const updated = new Map(assignments);
    const assignment = updated.get(userId);
    if (assignment) {
      assignment.isServiceProvider = isProvider;
      updated.set(userId, assignment);
      setAssignments(updated);
    }
  };

  const handleAddSpecialty = (userId: string) => {
    if (!newSpecialty.trim()) return;
    
    const updated = new Map(assignments);
    const assignment = updated.get(userId);
    if (assignment) {
      if (!assignment.specialties) {
        assignment.specialties = [];
      }
      if (!assignment.specialties.includes(newSpecialty.trim())) {
        assignment.specialties.push(newSpecialty.trim());
        updated.set(userId, assignment);
        setAssignments(updated);
      }
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (userId: string, specialty: string) => {
    const updated = new Map(assignments);
    const assignment = updated.get(userId);
    if (assignment && assignment.specialties) {
      assignment.specialties = assignment.specialties.filter(s => s !== specialty);
      updated.set(userId, assignment);
      setAssignments(updated);
    }
  };

  const handleAvailabilityChange = (userId: string, hours: string) => {
    const updated = new Map(assignments);
    const assignment = updated.get(userId);
    if (assignment) {
      assignment.availabilityHours = hours;
      updated.set(userId, assignment);
      setAssignments(updated);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const userAssignments: UserAssignment[] = Array.from(assignments.values());
      
      const response = await ServiceProviderAssignmentService.bulkAssign({
        userAssignments
      });

      if (response.success) {
        alert(`Successfully assigned ${response.data.assigned} and unassigned ${response.data.unassigned} users`);
        router.push('/admin/gallery/service-provider-assignment');
      }
    } catch (err: any) {
      console.error('Error assigning users:', err);
      alert(err.message || 'Failed to assign users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Providers
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Service Providers</h1>
          <p className="text-gray-600">Assign or remove service provider roles and configure specialties</p>
        </div>

        {/* Users Assignment Cards */}
        <div className="space-y-6">
          {users.map((user) => {
            const assignment = assignments.get(user.userId);
            if (!assignment) return null;

            return (
              <div key={user.userId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">ID: {user.customUserId}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleProvider(user.userId, true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        assignment.isServiceProvider
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign as Provider
                    </button>
                    <button
                      onClick={() => handleToggleProvider(user.userId, false)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        !assignment.isServiceProvider
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <UserMinus className="w-4 h-4" />
                      Remove Provider
                    </button>
                  </div>
                </div>

                {assignment.isServiceProvider && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Specialties */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialties
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {assignment.specialties?.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {specialty}
                              <button
                                onClick={() => handleRemoveSpecialty(user.userId, specialty)}
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
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty(user.userId)}
                            placeholder="Add specialty..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={() => handleAddSpecialty(user.userId)}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Availability Hours */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Availability Hours
                        </label>
                        <input
                          type="text"
                          value={assignment.availabilityHours || '9 AM - 5 PM'}
                          onChange={(e) => handleAvailabilityChange(user.userId, e.target.value)}
                          placeholder="e.g., 9 AM - 5 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Example: 9 AM - 5 PM, 10 AM - 7 PM
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignServiceProvidersPage;
