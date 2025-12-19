"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const CreateRolePage = () => {
  const router = useRouter();
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Mock permissions data
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
    { id: 'create_role', name: 'Create Role', description: 'Ability to create new roles', category: 'Role Management' },
    { id: 'view_role', name: 'View Role', description: 'Ability to view role details', category: 'Role Management' },
    { id: 'edit_role', name: 'Edit Role', description: 'Ability to edit role information', category: 'Role Management' },
  ];

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    console.log({
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions
    });
    
    // Show success message and redirect
    alert(`Role "${roleName}" created successfully!`);
    router.push('/super-admin/role-management');
  };

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
          
          <h1 className="text-2xl font-bold text-gray-800">Create New Role</h1>
          <p className="text-gray-600 mt-1">Define a new role with specific permissions</p>
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
              onClick={() => router.push('/super-admin/role-management')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRolePage;