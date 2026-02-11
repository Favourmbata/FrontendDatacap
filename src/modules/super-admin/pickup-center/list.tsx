// "use client";

// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
// import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';

// interface PickupCenter {
//   id: string;
//   centerName: string;
//   address: string;
//   contact: string;
//   amount: number;
//   operatingDays: string;
//   operatingHours: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const PickupCenterList = () => {
//   const [pickupCenters, setPickupCenters] = useState<PickupCenter[]>([]);
//   const [filteredPickupCenters, setFilteredPickupCenters] = useState<PickupCenter[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<PickupCenter | null>(null);

//   // Mock data for now - this would come from an API
//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       const mockPickupCenters: PickupCenter[] = [
//         {
//           id: '1',
//           centerName: 'Main Logistics Hub',
//           address: '123 Main Street, Downtown, Cityville',
//           contact: '+1 (555) 123-4567',
//           amount: 1500,
//           operatingDays: 'Monday - Saturday',
//           operatingHours: '9:00 AM - 7:00 PM',
//           createdAt: '2023-01-15',
//           updatedAt: '2023-01-15',
//         },
//         {
//           id: '2',
//           centerName: 'Westside Collection Point',
//           address: '456 West Avenue, West End, Cityville',
//           contact: '+1 (555) 987-6543',
//           amount: 1200,
//           operatingDays: 'Tuesday - Sunday',
//           operatingHours: '8:00 AM - 8:00 PM',
//           createdAt: '2023-02-20',
//           updatedAt: '2023-02-20',
//         },
//         {
//           id: '3',
//           centerName: 'East District Center',
//           address: '789 East Boulevard, Eastside, Cityville',
//           contact: '+1 (555) 456-7890',
//           amount: 1800,
//           operatingDays: 'Monday - Friday',
//           operatingHours: '10:00 AM - 6:00 PM',
//           createdAt: '2023-03-10',
//           updatedAt: '2023-03-10',
//         },
//         {
//           id: '4',
//           centerName: 'North Valley Depot',
//           address: '101 North Road, Valley Area, Cityville',
//           contact: '+1 (555) 111-2222',
//           amount: 1600,
//           operatingDays: 'Monday - Sunday',
//           operatingHours: '24/7',
//           createdAt: '2023-04-05',
//           updatedAt: '2023-04-05',
//         },
//       ];
//       setPickupCenters(mockPickupCenters);
//       setFilteredPickupCenters(mockPickupCenters);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Filter pickup centers based on search term
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredPickupCenters(pickupCenters);
//     } else {
//       const filtered = pickupCenters.filter(pickupCenter =>
//         pickupCenter.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pickupCenter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pickupCenter.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pickupCenter.operatingDays.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredPickupCenters(filtered);
//     }
//   }, [searchTerm, pickupCenters]);

//   const handleView = (pickupCenter: PickupCenter) => {
//     // Navigate to view page
//     window.location.href = `/super-admin/pickup-center/view/${pickupCenter.id}`;
//   };

//   const handleEdit = (pickupCenter: PickupCenter) => {
//     // Navigate to edit page
//     window.location.href = `/super-admin/pickup-center/edit/${pickupCenter.id}`;
//   };

//   const handleDelete = (pickupCenter: PickupCenter) => {
//     setItemToDelete(pickupCenter);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     if (itemToDelete) {
//       // In a real app, this would call an API to delete the pickup center
//       setPickupCenters(pickupCenters.filter(cat => cat.id !== itemToDelete.id));
//       setFilteredPickupCenters(filteredPickupCenters.filter(cat => cat.id !== itemToDelete.id));
//     }
//     setShowDeleteModal(false);
//     setItemToDelete(null);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//           <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
//           {[1, 2, 3].map((item) => (
//             <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
//               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/6"></div>
//               <div className="h-8 bg-gray-200 rounded w-20"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="manrope">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope { font-family: 'Manrope', sans-serif; }
//       `}</style>

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-[#1A1A1A]">Pickup Center Management</h1>
//         <p className="text-gray-600">Manage pickup centers and their details</p>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//           <div className="relative w-full md:w-1/3">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
//               placeholder="Search pickup centers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <button 
//             className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors"
//             onClick={() => window.location.href = '/super-admin/pickup-center/create'}
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Add Pickup Center
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Center Name</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Address</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Contact</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Amount</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Operating Days</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Created Date</th>
//                 <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPickupCenters.length > 0 ? (
//                 filteredPickupCenters.map((pickupCenter) => (
//                   <tr key={pickupCenter.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-4 px-4 font-medium text-gray-900">{pickupCenter.centerName}</td>
//                     <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{pickupCenter.address}</td>
//                     <td className="py-4 px-4 text-gray-600">{pickupCenter.contact}</td>
//                     <td className="py-4 px-4 text-gray-600">{formatCurrency(pickupCenter.amount)}</td>
//                     <td className="py-4 px-4 text-gray-600">{pickupCenter.operatingDays}</td>
//                     <td className="py-4 px-4 text-gray-600">{formatDate(pickupCenter.createdAt)}</td>
//                     <td className="py-4 px-4">
//                       <div className="flex items-center space-x-3">
//                         <button 
//                           onClick={() => handleView(pickupCenter)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View"
//                         >
//                           <Eye className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleEdit(pickupCenter)}
//                           className="text-yellow-600 hover:text-yellow-800"
//                           title="Edit"
//                         >
//                           <Edit className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => handleDelete(pickupCenter)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
//                     No pickup centers found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={confirmDelete}
//         itemName={itemToDelete?.centerName || ''}
//         loading={deleteLoading}
//       />
//     </div>
//   );
// };



// export default PickupCenterList;




// src/app/(main)/super-admin/pickup-center/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Download, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  DollarSign,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { SuperAdminActionModal } from '@/app/components/SuperAdminActionModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PickupCenterService, { GetPickupCentersParams, PickupCenter } from '@/services/pickCenter';

const PickupCenterList = () => {
  const router = useRouter();
  const [pickupCenters, setPickupCenters] = useState<PickupCenter[]>([]);
  const [filteredPickupCenters, setFilteredPickupCenters] = useState<PickupCenter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState({
    action: '' as 'delete' | 'toggleStatus' | '',
    item: null as PickupCenter | null,
    statusToSet: '' as 'active' | 'inactive' | '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'centerName',
    sortOrder: 'asc' as 'asc' | 'desc',
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Fetch pickup centers from API
  const fetchPickupCenters = async (params?: GetPickupCentersParams) => {
    try {
      setLoading(true);
      const defaultParams: GetPickupCentersParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      };

      // Handle status filter
      if (statusFilter === 'active') {
        defaultParams.isActive = true;
      } else if (statusFilter === 'inactive') {
        defaultParams.isActive = false;
      }

      const response = await PickupCenterService.getPickupCenters({
        ...defaultParams,
        ...params,
      });
      
      setPickupCenters(response.pickupCenters);
      setFilteredPickupCenters(response.pickupCenters);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
      
    } catch (error: any) {
      console.error('Error fetching pickup centers:', error);
      toast.error(error.message || 'Failed to fetch pickup centers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupCenters();
  }, [pagination.page, sortConfig, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchPickupCenters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleView = (center: PickupCenter) => {
    router.push(`/super-admin/pickup-center/view/${center.id}`);
  };

  const handleEdit = (center: PickupCenter) => {
    router.push(`/super-admin/pickup-center/edit/${center.id}`);
  };

  const handleDelete = (center: PickupCenter) => {
    setActionModalConfig({
      action: 'delete',
      item: center,
      statusToSet: '',
    });
    setShowActionModal(true);
  };

  const handleToggleStatus = (center: PickupCenter) => {
    setActionModalConfig({
      action: 'toggleStatus',
      item: center,
      statusToSet: center.status === 'active' ? 'inactive' : 'active',
    });
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!actionModalConfig.item) return;

    try {
      setDeleteLoading(true);
      if (actionModalConfig.action === 'delete') {
        const result = await PickupCenterService.deletePickupCenter(actionModalConfig.item.id);
        if (result.success) {
          toast.success('Pickup center deleted successfully');
          fetchPickupCenters();
        } else {
          toast.error(result.message || 'Failed to delete pickup center');
        }
      } else if (actionModalConfig.action === 'toggleStatus') {
        const updatedCenter = await PickupCenterService.updatePickupCenterStatus(
          actionModalConfig.item.id,
          actionModalConfig.statusToSet as 'active' | 'inactive'
        );
        toast.success(`Pickup center ${actionModalConfig.statusToSet === 'active' ? 'activated' : 'deactivated'} successfully`);
        fetchPickupCenters();
      }
    } catch (error: any) {
      console.error('Error performing action:', error);
      toast.error(error.message || 'Action failed');
    } finally {
      setDeleteLoading(false);
      setShowActionModal(false);
      setActionModalConfig({
        action: '',
        item: null,
        statusToSet: '',
      });
    }
  };

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    if (status === 'active') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
    }
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactive</span>;
  };

  const formatAmount = (amount: number) => {
    return PickupCenterService.formatAmount(amount);
  };

  if (loading && pickupCenters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pickup Center Management</h1>
              <p className="text-gray-600 mt-2">Manage pickup centers and their operating details</p>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
              onClick={() => router.push('/super-admin/pickup-center/create')}
            >
              <Plus className="w-5 h-5" />
              Add Pickup Center
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Centers</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pickupCenters.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pickupCenters.filter(c => c.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pickupCenters.length > 0
                    ? formatAmount(pickupCenters.reduce((sum, c) => sum + c.amount, 0) / pickupCenters.length)
                    : formatAmount(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search by center name, address, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[140px] bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              {/* Sort Options */}
              {/* <select
                value={`${sortConfig.sortBy}-${sortConfig.sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortConfig({
                    sortBy: newSortBy,
                    sortOrder: newSortOrder as 'asc' | 'desc',
                  });
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[180px] bg-white"
              >
                <option value="centerName-asc">Name: A to Z</option>
                <option value="centerName-desc">Name: Z to A</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select> */}

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Centers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('centerName')}
                  >
                    <div className="flex items-center gap-1">
                      Center Name
                      {sortConfig.sortBy === 'centerName' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Hours
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortConfig.sortBy === 'amount' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.sortBy === 'status' && (
                        sortConfig.sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPickupCenters.length > 0 ? (
                  filteredPickupCenters.map((center) => (
                    <tr key={center.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{center.centerName}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {center.id.slice(-8)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{center.address}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{center.contactNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {center.operatingDays}
                          </div>
                          <div className="flex items-center text-sm text-gray-700 mt-1">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            {center.operatingHours}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">
                          {formatAmount(center.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(center.status || (center.isActive ? 'active' : 'inactive'))}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(center.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(center)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(center)}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                         
                          <button 
                            onClick={() => handleDelete(center)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 px-6 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <MapPin className="w-16 h-16 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No pickup centers found</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                          {searchTerm || statusFilter !== 'all'
                            ? 'No pickup centers match your search criteria. Try adjusting your filters.'
                            : 'Get started by creating your first pickup center.'}
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                          <button 
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            onClick={() => router.push('/super-admin/pickup-center/create')}
                          >
                            <Plus className="w-5 h-5" />
                            Add Your First Pickup Center
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPickupCenters.length > 0 && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} pickup centers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    pagination.page === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`min-w-[40px] h-10 rounded-lg transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    pagination.page >= pagination.totalPages
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModalConfig.action === 'delete' && (
        <DeleteConfirmationModal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setActionModalConfig({
              action: '',
              item: null,
              statusToSet: '',
            });
          }}
          onConfirm={confirmAction}
          itemName={actionModalConfig.item?.centerName || ''}
          loading={deleteLoading}
        />
      )}

      
    </div>
  );
};

export default PickupCenterList;