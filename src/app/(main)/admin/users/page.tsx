"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/app/components/hooks/use-toast';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  UserPlus,
  Users,
  Calendar,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'pending';
}

const UsersManagementPage = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'USR-001', email: 'john.doe@example.com', fullName: 'John Doe', role: 'user', createdAt: '2023-01-15T10:30:00Z', isVerified: true, status: 'active' },
    { id: 'USR-002', email: 'jane.smith@example.com', fullName: 'Jane Smith', role: 'admin', createdAt: '2023-02-20T14:45:00Z', isVerified: true, status: 'active' },
    { id: 'USR-003', email: 'robert.johnson@example.com', fullName: 'Robert Johnson', role: 'user', createdAt: '2023-03-10T09:15:00Z', isVerified: false, status: 'pending' },
    { id: 'USR-004', email: 'sarah.wilson@example.com', fullName: 'Sarah Wilson', role: 'organisation', createdAt: '2023-04-05T16:20:00Z', isVerified: true, status: 'active' },
    { id: 'USR-005', email: 'mike.brown@example.com', fullName: 'Mike Brown', role: 'user', createdAt: '2023-05-12T11:30:00Z', isVerified: false, status: 'inactive' },
    { id: 'USR-006', email: 'lisa.anderson@example.com', fullName: 'Lisa Anderson', role: 'moderator', createdAt: '2023-06-18T08:20:00Z', isVerified: true, status: 'active' },
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Initialize and filter users
  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (userToDelete && window.confirm(`Are you sure you want to delete user ${userToDelete.fullName}?`)) {
      setUsers(users.filter(user => user.id !== userId));
      toast({ 
        title: 'Success', 
        description: `User ${userToDelete.fullName} deleted successfully`,
        variant: 'default'
      });
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
      'User ID': user.id,
      'Full Name': user.fullName,
      'Email': user.email,
      'Role': user.role,
      'Created At': new Date(user.createdAt).toLocaleDateString(),
      'Status': user.status,
      'Verified': user.isVerified ? 'Yes' : 'No'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({ 
      title: 'Export Successful', 
      description: 'Users data exported to Excel',
      variant: 'default'
    });
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['User ID', 'Full Name', 'Email', 'Role', 'Created At', 'Status', 'Verified'],
      ...users.map(user => [
        user.id,
        user.fullName,
        user.email,
        user.role,
        new Date(user.createdAt).toLocaleDateString(),
        user.status,
        user.isVerified ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast({ 
      title: 'Export Successful', 
      description: 'Users data exported to CSV',
      variant: 'default'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'organisation': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>

    
      <div className="ml-0 md:ml-[350px] p-4 md:p-8 bg-gray-50 min-h-screen transition-all duration-300">
         

       

     
        <div className=" p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
             
            
              
              <button
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                onClick={() => {
                  // Add new user functionality
                  toast({
                    title: 'Coming Soon',
                    description: 'Add user feature will be available soon',
                    variant: 'default'
                  });
                }}
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
              
              <button
                className="px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 mt-1">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            onClick={() => {
                              toast({
                                title: 'Edit User',
                                description: `Edit ${user.fullName}`,
                                variant: 'default'
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;