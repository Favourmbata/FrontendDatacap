"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const RoleManagementPage = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 'ROLE-001', 
      name: 'Administrator', 
      description: 'Can manage users and organisations', 
      permissions: ['user_management', 'org_management'],
      createdAt: '2023-02-20T14:45:00Z', 
      updatedAt: '2023-02-20T14:45:00Z'
    },
    { 
      id: 'ROLE-002', 
      name: 'Organisation Admin', 
      description: 'Can manage organisation users and settings', 
      permissions: ['org_user_management'],
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
    { 
      id: 'ROLE-004', 
      name: 'User', 
      description: 'Standard user with limited permissions', 
      permissions: ['view_content'],
      createdAt: '2023-05-12T11:30:00Z', 
      updatedAt: '2023-05-12T11:30:00Z'
    },
  ]);
  
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize and filter roles
  useEffect(() => {
    filterRoles();
  }, [searchTerm, roles]);

  const filterRoles = () => {
    let result = [...roles];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRoles(result);
  };

  // Handle role deletion
  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find(role => role.id === roleId);
    if (roleToDelete && window.confirm(`Are you sure you want to delete role ${roleToDelete.name}?`)) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Table container with fixed height for scroll */
        .table-container {
          max-height: calc(100vh - 300px);
          overflow-y: auto;
        }
        
        @media (min-width: 768px) {
          .table-container {
            max-height: calc(100vh - 280px);
          }
        }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Role Management</h1>
          <p className="text-gray-600">Manage roles and their permissions for your organisation</p>
        </div>

        {/* Search and Action Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button
              className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => router.push('/admin/role-management/create')}
            >
              <Plus className="w-5 h-5" />
              Create Role
            </button>
          </div>
        </div>

        {/* Roles Table with Scroll */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg font-medium">No roles found</p>
                        <p className="text-sm mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{role.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{role.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{role.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 2).map((permission, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                          {role.permissions.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{role.permissions.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(role.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/role-management/view/${role.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="View role"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/admin/role-management/edit/${role.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="Edit role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementPage;