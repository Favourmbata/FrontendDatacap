// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import OrganizationService from '@/services/OrganizationService';
// import { Organization } from '@/types';

// interface OrganizationsTableProps {
//   searchTerm?: string;
//   onSearchChange?: (term: string) => void;
// }

// const OrganizationsTable: React.FC<OrganizationsTableProps> = ({ searchTerm: propSearchTerm = '', onSearchChange }) => {
//   const router = useRouter();
//   const [organizations, setOrganizations] = useState<Organization[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Pagination and filtering state
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrganizations, setTotalOrganizations] = useState(0);
  
//   // Local search term state
//   const [localSearchTerm, setLocalSearchTerm] = useState(propSearchTerm);
  
//   // Filter and sort state
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
//   const [statusFilter, setStatusFilter] = useState<'active' | 'suspended' | 'inactive' | ''>('');
  
//   // Date range state
//   const [fromDate, setFromDate] = useState<string>('');
//   const [toDate, setToDate] = useState<string>('');
  
//   // Export state
//   const [exportLoading, setExportLoading] = useState(false);

//   // Fetch organizations
//   const fetchOrganizations = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const params = {
//         page,
//         limit,
//         search: localSearchTerm,
//         sortBy,
//         sortOrder,
//         status: statusFilter || undefined,
//         fromDate: fromDate || undefined,
//         toDate: toDate || undefined
//       };
      
//       const response = await OrganizationService.getOrganizations(params);
      
//       setOrganizations(response.organizations);
//       setTotalOrganizations(response.total);
//       setTotalPages(response.totalPages);
//     } catch (err) {
//       console.error('Error fetching organizations:', err);
//       setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch organizations when filters change
//   useEffect(() => {
//     fetchOrganizations();
//   }, [page, localSearchTerm, sortBy, sortOrder, statusFilter, fromDate, toDate]);

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setLocalSearchTerm(value);
//     if (onSearchChange) {
//       onSearchChange(value);
//     }
//     setPage(1); // Reset to first page when searching
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setStatusFilter(e.target.value as 'active' | 'suspended' | 'inactive' | '');
//     setPage(1); // Reset to first page when filtering
//   };

//   // Handle sort change
//   const handleSortChange = (field: string) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('desc');
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Handle export
//   const handleExport = async (format: 'csv' | 'excel') => {
//     setExportLoading(true);
    
//     try {
//       // Use current filter parameters for export
//       const params = {
//         search: localSearchTerm,
//         sortBy,
//         sortOrder,
//         status: statusFilter || undefined,
//         fromDate: fromDate || undefined,
//         toDate: toDate || undefined
//       };
      
//       const exportData = await OrganizationService.exportOrganizations(format, params);
      
//       // Create a temporary link to trigger the download
//       const link = document.createElement('a');
//       link.href = exportData.downloadUrl;
//       link.download = exportData.fileName;
//       link.target = '_blank';
//       link.rel = 'noopener noreferrer';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Export failed:', error);
//       alert('Export failed. Please try again.');
//     } finally {
//       setExportLoading(false);
//     }
//   };
  
//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
//       {/* Search and Filter Section */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//           <div className="flex-1 max-w-md">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search organizations..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//                 value={localSearchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
//           </div>
          
//           <div className="flex gap-3">
//             <button
//               className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={() => handleExport('csv')}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <>
//                   <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-5 h-5" />
//                   Export CSV
//                 </>
//               )}
//             </button>
            
//             <button
//               className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={() => handleExport('excel')}
//               disabled={exportLoading}
//             >
//               {exportLoading ? (
//                 <>
//                   <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-5 h-5" />
//                   Export Excel
//                 </>
//               )}
//             </button>
//           </div>
          
//           <div className="flex gap-3">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value as 'active' | 'suspended' | 'inactive' | '')}
//               className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             >
//               <option value="">All Statuses</option>
//               <option value="active">Active</option>
//               <option value="suspended">Suspended</option>
//               <option value="inactive">Inactive</option>
//             </select>
                          
//             <button
//               className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
//               onClick={() => router.push('/super-admin/organisation/create')}
//             >
//               <Plus className="w-5 h-5" />
//               Add Organization
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th 
//                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSortChange('organizationName')}
//               >
//                 <div className="flex items-center gap-1">
//                   Organization
//                   {sortBy === 'organizationName' && (
//                     <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
//                   )}
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSortChange('email')}
//               >
//                 <div className="flex items-center gap-1">
//                   Email
//                   {sortBy === 'email' && (
//                     <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
//                   )}
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSortChange('accountNumber')}
//               >
//                 <div className="flex items-center gap-1">
//                   Account #
//                   {sortBy === 'accountNumber' && (
//                     <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
//                   )}
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSortChange('status')}
//               >
//                 <div className="flex items-center gap-1">
//                   Status
//                   {sortBy === 'status' && (
//                     <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
//                   )}
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSortChange('registrationDate')}
//               >
//                 <div className="flex items-center gap-1">
//                   Registration Date
//                   {sortBy === 'registrationDate' && (
//                     <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
//                   )}
//                 </div>
//               </th>
//               <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center justify-center text-gray-500">
//                     <p className="text-lg font-medium">Loading organizations...</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td colSpan={6} className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center justify-center text-red-500">
//                     <p className="text-lg font-medium">Error loading organizations</p>
//                     <p className="text-sm mt-1">{error}</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : organizations.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center justify-center text-gray-500">
//                     <p className="text-lg font-medium">No organizations found</p>
//                     <p className="text-sm mt-1">Try adjusting your search or filter</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               organizations.map((org) => (
//                 <tr key={org.id} className="hover:bg-gray-50 transition-colors duration-150">
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-semibold text-gray-900">{org.organizationName}</div>
//                     <div className="text-xs text-gray-500 mt-1">{org.id}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">{org.email}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">{org.accountNumber}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       org.status === 'active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : org.status === 'suspended'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                     }`}>
//                       {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-500">
//                       {formatDate(org.registrationDate)}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button
//                         onClick={() => router.push(`/super-admin/organisation/view/${org.id}`)}
//                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                         title="View organisation"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
                      
//                       <button
//                         onClick={() => router.push(`/super-admin/organisation/edit/${org.id}`)}
//                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                         title="Edit organisation"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
                      
//                       <button
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                         title="Delete organisation"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {!loading && organizations.length > 0 && (
//         <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
//             <span className="font-medium">
//               {Math.min(page * limit, totalOrganizations)}
//             </span>{' '}
//             of <span className="font-medium">{totalOrganizations}</span> organizations
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className={`p-2 rounded-lg ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
            
//             <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
//               {page} of {totalPages}
//             </span>
            
//             <button
//               onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               className={`p-2 rounded-lg ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrganizationsTable;



'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrganizationService from '@/services/OrganizationService';
import { Organization } from '@/types';

interface OrganizationsTableProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({ searchTerm: propSearchTerm = '', onSearchChange }) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination and filtering state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  
  // Local search term state
  const [localSearchTerm, setLocalSearchTerm] = useState(propSearchTerm);
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'active' | 'suspended' | 'inactive' | ''>('');
  
  // Date range state
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  
  // Export state
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch organizations
  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit,
        search: localSearchTerm,
        sortBy,
        sortOrder,
        status: statusFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined
      };
      
      const response = await OrganizationService.getOrganizations(params);
      
      setOrganizations(response.organizations);
      setTotalOrganizations(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizations when filters change
  useEffect(() => {
    fetchOrganizations();
  }, [page, localSearchTerm, sortBy, sortOrder, statusFilter, fromDate, toDate]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
    setPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'active' | 'suspended' | 'inactive' | '');
    setPage(1); // Reset to first page when filtering
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'excel') => {
    setExportLoading(true);
    
    try {
      // Use current filter parameters for export
      const params = {
        search: localSearchTerm,
        sortBy,
        sortOrder,
        status: statusFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined
      };
      
      const exportData = await OrganizationService.exportOrganizations(format, params);
      
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = exportData.downloadUrl;
      link.download = exportData.fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {/* Search and Filter Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search organizations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={localSearchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export CSV
                </>
              )}
            </button>
            
            <button
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleExport('excel')}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export Excel
                </>
              )}
            </button>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'active' | 'suspended' | 'inactive' | '')}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
                          
            <button
              className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => router.push('/super-admin/organisation/create')}
            >
              <Plus className="w-5 h-5" />
              Add Organization
            </button>
          </div>
        </div>
      </div>

      {/* Table - Updated to match document structure */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S/N
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('organizationName')}
              >
                <div className="flex items-center gap-1">
                  Organization Name
                  {sortBy === 'organizationName' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('email')}
              >
                <div className="flex items-center gap-1">
                  Email Address
                  {sortBy === 'email' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('accountNumber')}
              >
                <div className="flex items-center gap-1">
                  Account Number
                  {sortBy === 'accountNumber' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('registrationDate')}
              >
                <div className="flex items-center gap-1">
                  Date Registered
                  {sortBy === 'registrationDate' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortBy === 'status' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium">Loading organizations...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-red-500">
                    <p className="text-lg font-medium">Error loading organizations</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </td>
              </tr>
            ) : organizations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium">No organizations found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              organizations.map((org, index) => (
                <tr key={org.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{(page - 1) * limit + index + 1}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{org.organizationName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{org.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{org.phoneNumber || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{org.accountNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {formatDate(org.registrationDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      org.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : org.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => router.push(`/super-admin/organisation/view/${org.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="View organisation"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/super-admin/organisation/edit/${org.id}`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
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

      {/* Pagination */}
      {!loading && organizations.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * limit, totalOrganizations)}
            </span>{' '}
            of <span className="font-medium">{totalOrganizations}</span> organizations
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
              {page} of {totalPages}
            </span>
            
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsTable;