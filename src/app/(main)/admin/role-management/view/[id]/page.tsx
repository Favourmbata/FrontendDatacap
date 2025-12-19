"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const ViewRolePage = () => {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;
  
  // Mock role data
  const [role, setRole] = useState<Role | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockRoles: Role[] = [
      { 
        id: 'ROLE-001', 
        name: 'Administrator', 
        description: 'Can manage users and organisations', 
        permissions: [
          'create_user', 'view_user', 'edit_user', 'archive_user', 'enable_disable_user',
          'create_group', 'view_group', 'edit_group'
        ],
        createdAt: '2023-02-20T14:45:00Z', 
        updatedAt: '2023-02-20T14:45:00Z'
      },
      { 
        id: 'ROLE-002', 
        name: 'Organisation Admin', 
        description: 'Can manage organisation users and settings', 
        permissions: ['create_user', 'view_user', 'edit_user'],
        createdAt: '2023-03-10T09:15:00Z', 
        updatedAt: '2023-03-10T09:15:00Z'
      },
      { 
        id: 'ROLE-003', 
        name: 'Content Manager', 
        description: 'Can create and manage content', 
        permissions: ['content_management'],
        createdAt: '2023-04-05T16:20:00Z', 
        updatedAt: '2023-04-05T16:20:00Z'
      },
    ];
    
    const foundRole = mockRoles.find(r => r.id === roleId);
    setRole(foundRole || null);
  }, [roleId]);

  if (!role) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Role Management
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Role Not Found</h2>
            <p className="text-gray-600">The requested role could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Role Management
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{role.name}</h1>
                <p className="text-gray-600 mt-1">{role.description}</p>
              </div>
              
              <button
                onClick={() => router.push(`/admin/role-management/edit/${role.id}`)}
                className="mt-4 md:mt-0 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Role
              </button>
            </div>
          </div>

          {/* Role Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Role Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role ID</label>
                <p className="text-gray-900">{role.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Role Name</label>
                <p className="text-gray-900">{role.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-900">{role.description || 'No description provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <p className="text-gray-900">
                  {new Date(role.createdAt).toLocaleDateString()} at {new Date(role.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(role.updatedAt).toLocaleDateString()} at {new Date(role.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Permissions</h2>
            
            {role.permissions.length === 0 ? (
              <p className="text-gray-500 italic">No permissions assigned to this role</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {role.permissions.map((permission, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="font-medium text-gray-900 capitalize">
                      {permission.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRolePage;