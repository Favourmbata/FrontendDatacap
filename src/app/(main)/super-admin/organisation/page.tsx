"use client";

import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Organisation {
  id: string;
  name: string;
  adminEmail: string;
  userCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const OrganisationManagementPage = () => {
  const router = useRouter();
  const [organisations] = useState<Organisation[]>([
    { 
      id: 'ORG-001', 
      name: 'Tech Solutions Inc.', 
      adminEmail: 'admin@techsolutions.com', 
      userCount: 42,
      status: 'active',
      createdAt: '2023-01-15T10:30:00Z'
    },
    { 
      id: 'ORG-002', 
      name: 'Global Enterprises', 
      adminEmail: 'contact@globalent.com', 
      userCount: 28,
      status: 'active',
      createdAt: '2023-02-20T14:45:00Z'
    },
    { 
      id: 'ORG-003', 
      name: 'Innovation Labs', 
      adminEmail: 'info@innovationlabs.io', 
      userCount: 15,
      status: 'inactive',
      createdAt: '2023-03-10T09:15:00Z'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrganisations = organisations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Organisation Management</h1>
          <p className="text-gray-600">Manage organisations and their administrators</p>
        </div>

        {/* Search and Action Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search organisations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button
              className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => router.push('/super-admin/organisation/create')}
            >
              <Plus className="w-5 h-5" />
              Add Organisation
            </button>
          </div>
        </div>

        {/* Organisations Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organisation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredOrganisations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <p className="text-lg font-medium">No organisations found</p>
                        <p className="text-sm mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrganisations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{org.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{org.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{org.adminEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{org.userCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          org.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/super-admin/organisation/view/${org.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="View organisation"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/super-admin/organisation/edit/${org.id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="Edit organisation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete organisation"
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

export default OrganisationManagementPage;