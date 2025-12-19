"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const EditRolePage = () => {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;
  
  const [role, setRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Mock permissions data for organisation admin
  const permissions: Permission[] = [
    // User Management
    { id: 'create_user', name: 'Create User', description: 'Ability to create new users', category: 'User Management' },
    { id: 'view_user', name: 'View User', description: 'Ability to view user details', category: 'User Management' },
    { id: 'edit_user', name: 'Edit User', description: 'Ability to edit user information', category: 'User Management' },
    { id: 'archive_user', name: 'Archive User', description: 'Ability to archive users', category: 'User Management' },
    { id: 'enable_disable_user', name: 'Enable/Disable User', description: 'Ability to enable or disable users', category: 'User Management' },
    
    // Group Management
    { id: 'create_group', name: 'Create Group', description: 'Ability to create new groups', category: 'Group Management' },
    { id: 'view_group', name: 'View Group', description: 'Ability to view group details', category: 'Group Management' },
    { id: 'edit_group', name: 'Edit Group', description: 'Ability to edit group information', category: 'Group Management' },
    
    // Role Management
    { id: 'view_role', name: 'View Role', description: 'Ability to view role details', category: 'Role Management' },
  ];

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Load role data
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
    if (foundRole) {
      setRole(foundRole);
      setRoleName(foundRole.name);
      setRoleDescription(foundRole.description);
      setSelectedPermissions(foundRole.permissions);
    }
  }, [roleId]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) return;
    
    // In a real app, this would send data to an API
    const updatedRole = {
      ...role,
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updated role:', updatedRole);
    
    // Show success message and redirect
    alert(`Role "${roleName}" updated successfully!`);
    router.push('/admin/role-management');
  };

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
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Role Management
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800">Edit Role</h1>
          <p className="text-gray-600 mt-1">Modify role details and permissions for your organisation</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Role Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Role Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  id="roleName"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter role name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="roleDescription"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter role description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role ID
                </label>
                <input
                  type="text"
                  value={role.id}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Permissions</h2>
            <p className="text-gray-600 text-sm mb-6">Select the permissions to assign to this role</p>
            
            <div className="space-y-8">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category}>
                  <h3 className="text-md font-medium text-gray-800 mb-4">{category}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {perms.map((permission) => (
                      <div 
                        key={permission.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedPermissions.includes(permission.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePermissionToggle(permission.id)}
                      >
                        <div className="flex items-start">
                          <div className={`flex items-center h-5 mt-0.5 mr-3 ${
                            selectedPermissions.includes(permission.id) 
                              ? 'text-purple-600' 
                              : 'text-gray-400'
                          }`}>
                            {selectedPermissions.includes(permission.id) ? (
                              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{permission.name}</div>
                            <div className="text-sm text-gray-500 mt-1">{permission.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Permissions Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Selected Permissions</h2>
            
            {selectedPermissions.length === 0 ? (
              <p className="text-gray-500 italic">No permissions selected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPermissions.map(permissionId => {
                  const permission = permissions.find(p => p.id === permissionId);
                  return permission ? (
                    <div 
                      key={permissionId}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {permission.name}
                      <button
                        type="button"
                        onClick={() => handlePermissionToggle(permissionId)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/role-management')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRolePage;