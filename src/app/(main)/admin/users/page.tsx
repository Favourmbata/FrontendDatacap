"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/app/components/hooks/use-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  Search, 
  Download, 
  Trash2, 
  Edit, 
  UserPlus,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Phone
} from 'lucide-react';
import UserActionModal from '@/app/components/userActionModal';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  customerUserId: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
  status: 'active' | 'inactive' | 'pending';
}

const UsersManagementPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    { 
      id: 'USR-001', 
      customerUserId: '0020000201',
      email: 'john.doe@example.com', 
      fullName: 'John Doe', 
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      role: 'user', 
      createdAt: '2023-01-15T10:30:00Z', 
      isVerified: true, 
      status: 'active' 
    },
    { 
      id: 'USR-002', 
      customerUserId: '0020000202',
      email: 'jane.smith@example.com', 
      fullName: 'Jane Smith', 
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+1234567891',
      role: 'admin', 
      createdAt: '2023-02-20T14:45:00Z', 
      isVerified: true, 
      status: 'active' 
    },
    { 
      id: 'USR-003', 
      customerUserId: '0020000203',
      email: 'robert.johnson@example.com', 
      fullName: 'Robert Johnson', 
      firstName: 'Robert',
      lastName: 'Johnson',
      phoneNumber: '+1234567892',
      role: 'user', 
      createdAt: '2023-03-10T09:15:00Z', 
      isVerified: false, 
      status: 'pending' 
    },
    { 
      id: 'USR-004', 
      customerUserId: '0020000204',
      email: 'sarah.wilson@example.com', 
      fullName: 'Sarah Wilson', 
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'organisation', 
      createdAt: '2023-04-05T16:20:00Z', 
      isVerified: true, 
      status: 'active' 
    },
    { 
      id: 'USR-005', 
      customerUserId: '0020000205',
      email: 'mike.brown@example.com', 
      fullName: 'Mike Brown', 
      firstName: 'Mike',
      lastName: 'Brown',
      phoneNumber: '+1234567894',
      role: 'user', 
      createdAt: '2023-05-12T11:30:00Z', 
      isVerified: false, 
      status: 'inactive' 
    },
  ]);
  
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    position: { top: number; left: number };
  }>({
    isOpen: false,
    userId: null,
    position: { top: 0, left: 0 }
  });

  // Refs for action buttons
  const actionButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Initialize and filter users
  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.customerUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
      );
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
      'Customer User ID': user.customerUserId,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Full Name': user.fullName,
      'Email': user.email,
      'Phone Number': user.phoneNumber || 'N/A',
      'Created At': new Date(user.createdAt).toLocaleDateString(),
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
      ['User ID', 'Customer User ID', 'First Name', 'Last Name', 'Email', 'Phone Number', 'Created At'],
      ...users.map(user => [
        user.id,
        user.customerUserId,
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber || 'N/A',
        new Date(user.createdAt).toLocaleDateString(),
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

  // Handle action button click
  const handleActionClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = actionButtonRefs.current[userId];
    if (button) {
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const modalHeight = 250; // Approximate modal height
      
      // Calculate position - show modal above if near bottom of viewport
      let top = rect.bottom;
      if (rect.bottom + modalHeight > viewportHeight) {
        top = rect.top - modalHeight;
      }
      
      setActionModal({
        isOpen: true,
        userId,
        position: {
          top: top + window.scrollY,
          left: rect.left + window.scrollX - 140 // Adjust to align properly
        }
      });
    }
  };

  // Close action modal
  const closeActionModal = () => {
    setActionModal({ isOpen: false, userId: null, position: { top: 0, left: 0 } });
  };

  // Action handlers with routing
  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/view/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  const handlePendingUser = (userId: string) => {
   router.push(`/admin/users/pending/${userId}`);
};

  const handleCreateUser   = (userId: string) => {
    router.push(`/admin/users/create/${userId}`);
  };
    const handleOneTimeCode = (userId: string) => {
    router.push(`/admin/users/one-time-code/${userId}`);
  };

  const handleDelete = (userId: string) => {
    handleDeleteUser(userId);
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
        {/* Search and Filter Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h1>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                onClick={() => router.push('/admin/users/create')}
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
              
              <button
                className="px-4 py-3 border border-[#5D2A8B] text-[#5D2A8B] rounded-lg hover:bg-[#5D2A8B] hover:text-white transition-colors duration-200 flex items-center gap-2 bg-white"
                onClick={handleExportExcel}
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Users Table with Scroll */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                      
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{user.firstName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{user.lastName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.phoneNumber ? (
                            <>
                             
                              <span className="text-sm text-gray-900">{user.phoneNumber}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Not provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{user.customerUserId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{user.id}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                         
                          <button
                            ref={(el) => {
                              actionButtonRefs.current[user.id] = el;
                            }}
                            onClick={(e) => handleActionClick(user.id, e)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            title="More actions"
                          >
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

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.userId && (
        <UserActionModal
          isOpen={actionModal.isOpen}
          onClose={closeActionModal}
          onViewUser={() => handleViewUser(actionModal.userId!)}
          onEditUser={() => handleEditUser(actionModal.userId!)}
          onPendingUser={() => handlePendingUser(actionModal.userId!)}
          onOneTimeCode={() => handleOneTimeCode(actionModal.userId!)}
          onDelete={() => handleDelete(actionModal.userId!)}
          position={actionModal.position}
        />
      )}
    </div>
  );
};

export default UsersManagementPage;