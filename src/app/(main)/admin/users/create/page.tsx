"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Building2, MapPin, Calendar, CheckSquare } from 'lucide-react';
import { AdminUserService, CreateUserPayload, CreateUserResponse } from '@/services/AdminUserService';
import { toast } from '@/app/components/hooks/use-toast';

const CreateUserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    userID: '', // This will be used as password if provided
    existingUsersID: '',
    organisationsCustomUsersID: ''
  });
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      setPermissionsLoading(true);
      try {
        const adminUserService = new AdminUserService();
        const response = await adminUserService.getAvailablePermissions();
        setPermissions(response.data.permissions || []);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load permissions',
          variant: 'destructive'
        });
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permissionKey: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionKey)
        ? prev.filter(p => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const generatePassword = () => {
    // Generate a random password with letters, numbers, and special characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure the password has at least one uppercase, lowercase, number, and special character
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()]/.test(password);
    
    if (!hasUpper) {
      password = password.slice(0, -1) + "A";
    }
    if (!hasLower) {
      password = password.slice(0, -1) + "a";
    }
    if (!hasNumber) {
      password = password.slice(0, -1) + "1";
    }
    if (!hasSpecial) {
      password = password.slice(0, -1) + "!";
    }
    
    setFormData(prev => ({
      ...prev,
      userID: password
    }));
  };

  const generateCustomUserId = async () => {
    setLoading(true);
    try {
      const adminUserService = new AdminUserService();
      // This function is now just for UI consistency, as custom ID is auto-generated after user creation
      toast({
        title: 'Note',
        description: 'Custom User ID will be auto-generated after user creation',
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Error generating custom user ID:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate custom user ID',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const adminUserService = new AdminUserService();
      
      // Prepare the payload for the API
      const payload: CreateUserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.emailAddress,
        phoneNumber: formData.phoneNumber || undefined,
        password: formData.userID || undefined, // Use userID as password if provided
        existingUserId: formData.existingUsersID || undefined
      };
      
      // Call the API to create the user
      const response: CreateUserResponse = await adminUserService.createAdminUser(payload);
      
      // If permissions were selected, assign them to the user
      if (selectedPermissions.length > 0 && response?.data?.user?.id) {
        try {
          await adminUserService.assignUserPermissions(response.data.user.id, { permissions: selectedPermissions });
        } catch (permissionError) {
          console.error('Error assigning permissions:', permissionError);
          toast({
            title: 'Warning',
            description: 'User created successfully, but failed to assign permissions',
            variant: 'destructive'
          });
        }
      }
      
      // Generate custom user ID after user creation
      if (response?.data?.user?.id) {
        try {
          const customIdResponse = await adminUserService.generateCustomUserId(response.data.user.id);
          // Update the form data with the generated custom ID
          setFormData(prev => ({
            ...prev,
            organisationsCustomUsersID: customIdResponse.data.customUserId
          }));
          
          toast({
            title: 'Success',
            description: `Custom User ID generated: ${customIdResponse.data.customUserId}`,
            variant: 'default'
          });
        } catch (customIdError) {
          console.error('Error generating custom user ID:', customIdError);
          toast({
            title: 'Warning',
            description: 'User created successfully, but failed to generate custom user ID',
            variant: 'destructive'
          });
        }
      }
      
      toast({ 
        title: 'Success', 
        description: 'User created successfully',
        variant: 'default'
      });
      
      router.push('/admin/users');
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to create user',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-24 md:pt-32 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
           
            <span>Back to Users</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create User</h1>
          <p className="text-gray-600 mt-2">Add a new user to the system</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
               
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter last name"
                    required
                  />
                </div>

               
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>

            {/* Permissions Assignment */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Assign Permissions
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {permissionsLoading ? (
                  <div className="text-center py-8 text-gray-600">Loading permissions...</div>
                ) : permissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No permissions available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPermissions(permissions.map(p => p.key));
                                } else {
                                  setSelectedPermissions([]);
                                }
                              }}
                              checked={selectedPermissions.length === permissions.length && permissions.length > 0}
                              className="h-4 w-4 text-[#5D2A8B] rounded focus:ring-[#5D2A8B] border-gray-300"
                            />
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Permission
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {permissions.map((permission) => (
                          <tr 
                            key={permission.key}
                            className={`cursor-pointer ${selectedPermissions.includes(permission.key) ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                            onClick={() => handlePermissionChange(permission.key)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.key)}
                                onChange={() => {}}
                                className="h-4 w-4 text-[#5D2A8B] rounded focus:ring-[#5D2A8B] border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {permission.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {permission.description}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                              {permission.key}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* User IDs Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
               
                User Identification
              </h2>
              <div className="space-y-4  border border-[#5D2A8B] rounded-lg p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="userID"
                      value={formData.userID}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                      placeholder="Enter password or leave blank for auto-generation"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing User's ID <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="existingUsersID"
                    value={formData.existingUsersID}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                    placeholder="Enter existing user's ID if applicable"
                  />
                </div>

                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 md:flex-none px-8 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#5D2A8B] transition-colors duration-200 font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 md:flex-none px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;