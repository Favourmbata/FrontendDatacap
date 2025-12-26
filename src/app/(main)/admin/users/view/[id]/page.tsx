"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Building2, MapPin, Calendar, CheckSquare } from 'lucide-react';
import { AdminUserService, AdminUser } from '@/services/AdminUserService';
import { toast } from '@/app/components/hooks/use-toast';

const ViewUserPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Extract user ID from URL
        const urlParts = window.location.pathname.split('/');
        const id = urlParts[urlParts.length - 1];
        setUserId(id);
        
        const adminUserService = new AdminUserService();
        
        // Fetch user data
        const userData = await adminUserService.getAdminUserById(id);
        setUser(userData);
        
        // Fetch user's permissions
        try {
          const userPermissions = await adminUserService.getUserPermissions(id);
          setPermissions(userPermissions.data.permissions || []);
        } catch (error) {
          console.error('Error fetching user permissions:', error);
          // Continue without permissions if there's an error
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to load user data',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">User not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">View User</h1>
          <p className="text-gray-600 mt-2">View user details</p>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900">{user.firstName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900">{user.lastName}</p>
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
                    Email Address
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{user.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
           
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    user.status === 'disabled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : user.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom User ID
                  </label>
                  <p className="text-gray-900">{user.customUserId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verified
                  </label>
                  <p className="text-gray-900">{user.isVerified ? 'Yes' : 'No'}</p>
                </div>
                
               
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <p className="text-gray-900">{user.organizationName || 'N/A'}</p>
                </div> */}
                
               
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Assigned Permissions
              </h2>
              {permissions.length === 0 ? (
                <p className="text-gray-600">No permissions assigned</p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Permission Key
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {permissions.map((permission) => (
                          <tr key={permission.key}>
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
                </div>
              )}
            </div>

            

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;