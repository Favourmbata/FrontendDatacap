// "use client";

// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Edit2, Trash2, DollarSign, Globe, MapPin, Filter, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import DefaultPricingService, { DefaultPricing as PricingType } from '@/services/DefaultPricingService';

// const DefaultPricingPage = () => {
//   const router = useRouter();
//   const [pricings, setPricings] = useState<PricingType[]>([]);
//   const [filteredPricings, setFilteredPricings] = useState<PricingType[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 20;
  
//   // Modal states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [pricingToDelete, setPricingToDelete] = useState<PricingType | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
  
//   // Status update
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [pricingToUpdate, setPricingToUpdate] = useState<PricingType | null>(null);
//   const [statusLoading, setStatusLoading] = useState(false);
  
//   // Messages
//   const [showMessage, setShowMessage] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
//   // Filters
//   const [countryFilter, setCountryFilter] = useState('');
//   const [stateFilter, setStateFilter] = useState('');
//   const [levelFilter, setLevelFilter] = useState('');

//   // Filters dropdown
//   const [showFilters, setShowFilters] = useState(false);

//   // Fetch data
//   useEffect(() => {
//     fetchPricings();
//   }, [page, countryFilter, stateFilter]);

//   const fetchPricings = async () => {
//     try {
//       setLoading(true);
//       const response = await DefaultPricingService.getDefaultPricings(
//         page,
//         limit,
//         countryFilter || undefined,
//         stateFilter || undefined
//       );
      
//       setPricings(response.pricings);
//       setFilteredPricings(response.pricings);
//       setTotal(response.total);
//       setPage(response.page);
//       setTotalPages(response.totalPages);
      
//     } catch (error: any) {
//       console.error('Error fetching default pricings:', error);
//       showErrorMessage(error.message || 'Failed to fetch default pricings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter pricings based on search and level filter
//   useEffect(() => {
//     let filtered = pricings;
    
//     if (searchTerm) {
//       filtered = filtered.filter(pricing =>
//         pricing.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pricing.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pricing.lga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pricing.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         pricing.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (levelFilter) {
//       filtered = filtered.filter(pricing => {
//         const level = getPricingLevel(pricing).toLowerCase();
//         return level === levelFilter.toLowerCase();
//       });
//     }
    
//     setFilteredPricings(filtered);
//   }, [searchTerm, pricings, levelFilter]);

//   // Helper functions
//   const getPricingLevel = (pricing: PricingType) => {
//     if (pricing.city) return 'City';
//     if (pricing.lga) return 'LGA';
//     if (pricing.state) return 'State';
//     return 'Country';
//   };

//   const getPricingLocation = (pricing: PricingType) => {
//     const parts = [];
//     if (pricing.country) parts.push(pricing.country);
//     if (pricing.state) parts.push(pricing.state);
//     if (pricing.lga) parts.push(pricing.lga);
//     if (pricing.city) parts.push(pricing.city);
//     return parts.join(' • ');
//   };

//   const getLevelIcon = (pricing: PricingType) => {
//     if (pricing.city) return <MapPin className="w-4 h-4" />;
//     if (pricing.lga) return <MapPin className="w-4 h-4" />;
//     if (pricing.state) return <MapPin className="w-4 h-4" />;
//     return <Globe className="w-4 h-4" />;
//   };

//   const getLevelColor = (pricing: PricingType) => {
//     if (pricing.city) return 'bg-purple-100 text-purple-800';
//     if (pricing.lga) return 'bg-blue-100 text-blue-800';
//     if (pricing.state) return 'bg-green-100 text-green-800';
//     return 'bg-yellow-100 text-yellow-800';
//   };

//   const showSuccessMessage = (msg: string) => {
//     setMessage(msg);
//     setMessageType('success');
//     setShowMessage(true);
//     setTimeout(() => setShowMessage(false), 3000);
//   };

//   const showErrorMessage = (msg: string) => {
//     setMessage(msg);
//     setMessageType('error');
//     setShowMessage(true);
//     setTimeout(() => setShowMessage(false), 3000);
//   };

//   const handleCreateClick = () => {
//     router.push('/super-admin/subscription/default-price/create');
//   };

//   const handleEdit = (pricing: PricingType) => {
//     router.push(`/super-admin/subscription/default-price/edit/${pricing._id}`);
//   };

//   const handleDeleteClick = (pricing: PricingType) => {
//     setPricingToDelete(pricing);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!pricingToDelete) return;
    
//     setDeleteLoading(true);
//     try {
//       const success = await DefaultPricingService.deleteDefaultPricing(pricingToDelete._id);
      
//       if (success) {
//         // Remove the item from state
//         const updatedPricings = pricings.filter(p => p._id !== pricingToDelete._id);
//         setPricings(updatedPricings);
//         setFilteredPricings(updatedPricings);
//         setTotal(prev => prev - 1);
        
//         showSuccessMessage('Default pricing deleted successfully');
//         setShowDeleteModal(false);
//       } else {
//         showErrorMessage('Failed to delete default pricing');
//       }
//     } catch (error: any) {
//       console.error('Error deleting default pricing:', error);
//       showErrorMessage(error.message || 'Failed to delete default pricing');
//     } finally {
//       setDeleteLoading(false);
//       setPricingToDelete(null);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setShowDeleteModal(false);
//     setPricingToDelete(null);
//   };

//   const handleStatusUpdateClick = (pricing: PricingType) => {
//     setPricingToUpdate(pricing);
//     setShowStatusModal(true);
//   };

//   const handleStatusUpdateConfirm = async () => {
//     if (!pricingToUpdate) return;
    
//     setStatusLoading(true);
//     try {
//       const newStatus = !pricingToUpdate.isActive ? 'active' : 'inactive';
//       const updatedPricing = await DefaultPricingService.updateDefaultPricings(pricingToUpdate._id, newStatus);
      
//       // Update the status in state
//       const updatedPricings = pricings.map(pricing => 
//         pricing._id === pricingToUpdate._id 
//           ? { ...pricing, isActive: updatedPricing.isActive }
//           : pricing
//       );
      
//       setPricings(updatedPricings);
//       setFilteredPricings(updatedPricings);
      
//       showSuccessMessage(`Default pricing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//       setShowStatusModal(false);
//     } catch (error: any) {
//       console.error('Error updating pricing status:', error);
//       showErrorMessage(error.message || 'Failed to update pricing status');
//     } finally {
//       setStatusLoading(false);
//       setPricingToUpdate(null);
//     }
//   };

//   const handleStatusUpdateCancel = () => {
//     setShowStatusModal(false);
//     setPricingToUpdate(null);
//   };

//   const handleApplyFilters = () => {
//     setPage(1); // Reset to first page when applying filters
//     fetchPricings();
//   };

//   const handleClearFilters = () => {
//     setCountryFilter('');
//     setStateFilter('');
//     setLevelFilter('');
//     setSearchTerm('');
//     setPage(1);
//     fetchPricings();
//   };

//   const formatDate = (dateString: string | Date) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (page < totalPages) {
//       setPage(page + 1);
//     }
//   };

//   // Refresh data function
//   const refreshData = () => {
//     fetchPricings();
//   };

//   if (loading && pricings.length === 0) {
//     return (
//       <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="animate-pulse">
//               <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//               <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
//                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/6"></div>
//                   <div className="h-8 bg-gray-200 rounded w-20"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope { font-family: 'Manrope', sans-serif; }
//       `}</style>

//       {/* Success/Error Message */}
//       {showMessage && (
//         <div className={`fixed top-4 right-4 z-50 ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg shadow-lg p-4 max-w-md`}>
//           <div className="flex items-start">
//             <div className={`flex-shrink-0 ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
//               {messageType === 'success' ? (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               )}
//             </div>
//             <div className="ml-3">
//               <p className={`text-sm font-medium ${messageType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
//                 {message}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal - Overlay on table */}
//       {showDeleteModal && pricingToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px]" onClick={handleDeleteCancel}></div>
//           <div className="relative z-10 bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-gray-200">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                 <Trash2 className="w-8 h-8 text-red-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Default Pricing</h3>
//               <p className="text-gray-600 mb-4">
//                 Are you sure you want to delete this default pricing?
//               </p>
//               <div className="bg-gray-50 p-4 rounded-lg mb-4 w-full">
//                 <p className="text-sm font-medium text-gray-700">
//                   {getPricingLocation(pricingToDelete)}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <DollarSign className="w-4 h-4 text-green-600" />
//                   <span className="font-bold text-green-700 text-sm">
//                     {formatCurrency(pricingToDelete.defaultFee)}
//                   </span>
//                 </div>
//               </div>
//               <p className="text-sm text-red-600 mb-6">
//                 This action cannot be undone.
//               </p>
//               <div className="flex gap-3 w-full">
//                 <button
//                   onClick={handleDeleteCancel}
//                   className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
//                   disabled={deleteLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
//                   disabled={deleteLoading}
//                 >
//                   {deleteLoading ? 'Deleting...' : 'Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Status Update Modal */}
//       {showStatusModal && pricingToUpdate && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="absolute inset-0 bg-black bg-opacity-25" onClick={handleStatusUpdateCancel}></div>
//           <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
//             <div className="flex flex-col items-center text-center">
//               <div className={`w-16 h-16 ${pricingToUpdate.isActive ? 'bg-yellow-100' : 'bg-green-100'} rounded-full flex items-center justify-center mb-4`}>
//                 {pricingToUpdate.isActive ? (
//                   <AlertCircle className="w-8 h-8 text-yellow-600" />
//                 ) : (
//                   <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                 )}
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 {pricingToUpdate.isActive ? 'Deactivate' : 'Activate'} Default Pricing
//               </h3>
//               <div className="bg-gray-50 p-4 rounded-lg mb-4 w-full">
//                 <p className="text-sm font-medium text-gray-700">
//                   {getPricingLocation(pricingToUpdate)}
//                 </p>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to {pricingToUpdate.isActive ? 'deactivate' : 'activate'} this default pricing?
//               </p>
//               <div className="flex gap-3 w-full">
//                 <button
//                   onClick={handleStatusUpdateCancel}
//                   className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
//                   disabled={statusLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleStatusUpdateConfirm}
//                   className={`flex-1 ${pricingToUpdate.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg transition-colors disabled:opacity-50`}
//                   disabled={statusLoading}
//                 >
//                   {statusLoading ? 'Updating...' : (pricingToUpdate.isActive ? 'Deactivate' : 'Activate')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-[#1A1A1A]">Default Pricing Management</h1>
//               <p className="text-gray-600">Manage default pricing for different location levels</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-sm text-gray-500">
//                 Total: <span className="font-medium">{total}</span> pricings
//               </div>
//               <button
//                 onClick={refreshData}
//                 className="text-sm text-[#5D2A8B] hover:text-[#4a216d]"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
//           >
//             <Filter className="w-5 h-5" />
//             <span className="font-medium">Filters</span>
//             {showFilters ? (
//               <ChevronUp className="w-4 h-4" />
//             ) : (
//               <ChevronDown className="w-4 h-4" />
//             )}
//           </button>
          
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                   <input
//                     type="text"
//                     value={countryFilter}
//                     onChange={(e) => setCountryFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
//                     placeholder="Filter by country..."
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                   <input
//                     type="text"
//                     value={stateFilter}
//                     onChange={(e) => setStateFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
//                     placeholder="Filter by state..."
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//                   <select
//                     value={levelFilter}
//                     onChange={(e) => setLevelFilter(e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
//                   >
//                     <option value="">All Levels</option>
//                     <option value="country">Country Level</option>
//                     <option value="state">State Level</option>
//                     <option value="lga">LGA Level</option>
//                     <option value="city">City Level</option>
//                   </select>
//                 </div>
                
//                 <div className="flex items-end gap-2">
//                   <button
//                     onClick={handleApplyFilters}
//                     className="flex-1 bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
//                   >
//                     Apply Filters
//                   </button>
//                   <button
//                     onClick={handleClearFilters}
//                     className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                   >
//                     Clear
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Search and Add */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div className="relative md:w-1/3">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-4 h-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] bg-white"
//               placeholder="Search by country, state, LGA, city, or description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div>
//             <button 
//               className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors whitespace-nowrap"
//               onClick={handleCreateClick}
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Default Pricing
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 bg-gray-50">
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Level</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Location</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Default Fee</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Description</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Status</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Created Date</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPricings.length > 0 ? (
//                   filteredPricings.map((pricing) => (
//                     <tr key={pricing._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2">
//                           <div className={`p-1.5 rounded ${getLevelColor(pricing)}`}>
//                             {getLevelIcon(pricing)}
//                           </div>
//                           <span className="font-medium text-sm">
//                             {getPricingLevel(pricing)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="font-medium text-sm">
//                           {getPricingLocation(pricing)}
//                         </div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="w-4 h-4 text-green-600" />
//                           <span className="font-bold text-green-700">
//                             {formatCurrency(pricing.defaultFee)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4">
//                         <span className="text-sm text-gray-600 line-clamp-2" title={pricing.description}>
//                           {pricing.description || '-'}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <button
//                           onClick={() => handleStatusUpdateClick(pricing)}
//                           className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
//                             pricing.isActive
//                               ? 'bg-green-100 text-green-800 hover:bg-green-200'
//                               : 'bg-red-100 text-red-800 hover:bg-red-200'
//                           }`}
//                         >
//                           <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
//                             pricing.isActive ? 'bg-green-500' : 'bg-red-500'
//                           }`}></span>
//                           {pricing.isActive ? 'Active' : 'Inactive'}
//                         </button>
//                       </td>
//                       <td className="py-4 px-4 text-gray-700 text-sm">
//                         {formatDate(pricing.createdAt)}
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex items-center space-x-1">
//                           <button
//                             onClick={() => handleEdit(pricing)}
//                             className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-xs"
//                             title="Edit"
//                           >
//                             <Edit2 className="w-3.5 h-3.5" />
//                             <span>Edit</span>
//                           </button>
                          
//                           <button
//                             onClick={() => handleDeleteClick(pricing)}
//                             className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-xs"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="py-12 px-4 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                           <DollarSign className="w-8 h-8 text-gray-400" />
//                         </div>
//                         <h3 className="text-lg font-medium mb-2">No default pricing found</h3>
//                         <p className="mb-4 text-sm">
//                           {searchTerm || countryFilter || stateFilter || levelFilter 
//                             ? 'Try adjusting your search terms or filters' 
//                             : 'Get started by adding your first default pricing'}
//                         </p>
//                         {!(searchTerm || countryFilter || stateFilter || levelFilter) && (
//                           <button 
//                             className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
//                             onClick={handleCreateClick}
//                           >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Add Default Pricing
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {filteredPricings.length > 0 && (
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
//               <div className="text-xs text-gray-600">
//                 Showing <span className="font-medium">{filteredPricings.length}</span> of{' '}
//                 <span className="font-medium">{total}</span> results (Page {page} of {totalPages})
//               </div>
//               <div className="flex space-x-1">
//                 <button 
//                   onClick={handlePreviousPage}
//                   className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs flex items-center"
//                   disabled={page === 1}
//                 >
//                   Previous
//                 </button>
//                 <button className="px-3 py-1.5 bg-[#5D2A8B] text-white rounded hover:bg-[#4a216d] text-xs">
//                   {page}
//                 </button>
//                 <button 
//                   onClick={handleNextPage}
//                   className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs flex items-center"
//                   disabled={page === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DefaultPricingPage;



"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, DollarSign, Globe, MapPin, Filter, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DefaultPricingService, { DefaultPricing as PricingType } from '@/services/DefaultPricingService';

const DefaultPricingPage = () => {
  const router = useRouter();
  const [pricings, setPricings] = useState<PricingType[]>([]);
  const [filteredPricings, setFilteredPricings] = useState<PricingType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pricingToDelete, setPricingToDelete] = useState<PricingType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pricingToUpdate, setPricingToUpdate] = useState<PricingType | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  const [countryFilter, setCountryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPricings();
  }, [page, countryFilter, stateFilter]);

  const fetchPricings = async () => {
    try {
      setLoading(true);
      const response = await DefaultPricingService.getDefaultPricings(
        page,
        limit,
        countryFilter || undefined,
        stateFilter || undefined
      );
      
      setPricings(response.pricings);
      setFilteredPricings(response.pricings);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
      
    } catch (error: any) {
      console.error('Error fetching default pricings:', error);
      showErrorMessage(error.message || 'Failed to fetch default pricings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = pricings;
    
    if (searchTerm) {
      filtered = filtered.filter(pricing =>
        pricing.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.lga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (levelFilter) {
      filtered = filtered.filter(pricing => {
        const level = getPricingLevel(pricing).toLowerCase();
        return level === levelFilter.toLowerCase();
      });
    }
    
    setFilteredPricings(filtered);
  }, [searchTerm, pricings, levelFilter]);

  const getPricingLevel = (pricing: PricingType) => {
    if (pricing.city) return 'City';
    if (pricing.lga) return 'LGA';
    if (pricing.state) return 'State';
    return 'Country';
  };

  const getPricingLocation = (pricing: PricingType) => {
    const parts = [];
    if (pricing.country) parts.push(pricing.country);
    if (pricing.state) parts.push(pricing.state);
    if (pricing.lga) parts.push(pricing.lga);
    if (pricing.city) parts.push(pricing.city);
    return parts.join(' • ');
  };

  const getLevelIcon = (pricing: PricingType) => {
    if (pricing.city) return <MapPin className="w-4 h-4" />;
    if (pricing.lga) return <MapPin className="w-4 h-4" />;
    if (pricing.state) return <MapPin className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const getLevelColor = (pricing: PricingType) => {
    if (pricing.city) return 'bg-purple-100 text-purple-800';
    if (pricing.lga) return 'bg-blue-100 text-blue-800';
    if (pricing.state) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const showSuccessMessage = (msg: string) => {
    setMessage(msg);
    setMessageType('success');
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const showErrorMessage = (msg: string) => {
    setMessage(msg);
    setMessageType('error');
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleCreateClick = () => {
    router.push('/super-admin/subscription/default-price/create');
  };

  const handleEdit = (pricing: PricingType) => {
    router.push(`/super-admin/subscription/default-price/edit/${pricing._id}`);
  };

  const handleDeleteClick = (pricing: PricingType) => {
    setPricingToDelete(pricing);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pricingToDelete) return;
    
    setDeleteLoading(true);
    try {
      const success = await DefaultPricingService.deleteDefaultPricing(pricingToDelete._id);
      
      if (success) {
        const updatedPricings = pricings.filter(p => p._id !== pricingToDelete._id);
        setPricings(updatedPricings);
        setFilteredPricings(updatedPricings);
        setTotal(prev => prev - 1);
        
        showSuccessMessage('Default pricing deleted successfully');
        setShowDeleteModal(false);
      } else {
        showErrorMessage('Failed to delete default pricing');
      }
    } catch (error: any) {
      console.error('Error deleting default pricing:', error);
      showErrorMessage(error.message || 'Failed to delete default pricing');
    } finally {
      setDeleteLoading(false);
      setPricingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPricingToDelete(null);
  };

  const handleStatusUpdateClick = (pricing: PricingType) => {
    setPricingToUpdate(pricing);
    setShowStatusModal(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (!pricingToUpdate) return;
    
    setStatusLoading(true);
    try {
      const newStatus = !pricingToUpdate.isActive ? 'active' : 'inactive';
      const updatedPricing = await DefaultPricingService.updateDefaultPricings(pricingToUpdate._id, newStatus);
      
      const updatedPricings = pricings.map(pricing => 
        pricing._id === pricingToUpdate._id 
          ? { ...pricing, isActive: updatedPricing.isActive }
          : pricing
      );
      
      setPricings(updatedPricings);
      setFilteredPricings(updatedPricings);
      
      showSuccessMessage(`Default pricing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      setShowStatusModal(false);
    } catch (error: any) {
      console.error('Error updating pricing status:', error);
      showErrorMessage(error.message || 'Failed to update pricing status');
    } finally {
      setStatusLoading(false);
      setPricingToUpdate(null);
    }
  };

  const handleStatusUpdateCancel = () => {
    setShowStatusModal(false);
    setPricingToUpdate(null);
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchPricings();
  };

  const handleClearFilters = () => {
    setCountryFilter('');
    setStateFilter('');
    setLevelFilter('');
    setSearchTerm('');
    setPage(1);
    fetchPricings();
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const refreshData = () => {
    fetchPricings();
  };

  if (loading && pricings.length === 0) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
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
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg shadow-lg p-4 max-w-md`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {messageType === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${messageType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && pricingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0" onClick={handleDeleteCancel}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-300">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Default Pricing</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this default pricing?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 w-full">
                <p className="text-sm font-medium text-gray-700">
                  {getPricingLocation(pricingToDelete)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-700 text-sm">
                    {formatCurrency(pricingToDelete.defaultFee)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && pricingToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={handleStatusUpdateCancel}></div>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${pricingToUpdate.isActive ? 'bg-yellow-100' : 'bg-green-100'} rounded-full flex items-center justify-center mb-4`}>
                {pricingToUpdate.isActive ? (
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                ) : (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pricingToUpdate.isActive ? 'Deactivate' : 'Activate'} Default Pricing
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 w-full">
                <p className="text-sm font-medium text-gray-700">
                  {getPricingLocation(pricingToUpdate)}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {pricingToUpdate.isActive ? 'deactivate' : 'activate'} this default pricing?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleStatusUpdateCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={statusLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdateConfirm}
                  className={`flex-1 ${pricingToUpdate.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 rounded-lg transition-colors disabled:opacity-50`}
                  disabled={statusLoading}
                >
                  {statusLoading ? 'Updating...' : (pricingToUpdate.isActive ? 'Deactivate' : 'Activate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Default Pricing Management</h1>
              <p className="text-gray-600">Manage default pricing for different location levels</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Total: <span className="font-medium">{total}</span> pricings
              </div>
              <button
                onClick={refreshData}
                className="flex items-center gap-1 text-sm text-[#5D2A8B] hover:text-[#4a216d]"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                    placeholder="Filter by country..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                    placeholder="Filter by state..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  >
                    <option value="">All Levels</option>
                    <option value="country">Country Level</option>
                    <option value="state">State Level</option>
                    <option value="lga">LGA Level</option>
                    <option value="city">City Level</option>
                  </select>
                </div>
                
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] bg-white"
              placeholder="Search by country, state, LGA, city, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <button 
              className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors whitespace-nowrap"
              onClick={handleCreateClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Default Pricing
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Level</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Location</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Default Fee</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Description</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Status</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Created Date</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPricings.length > 0 ? (
                  filteredPricings.map((pricing) => (
                    <tr key={pricing._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${getLevelColor(pricing)}`}>
                            {getLevelIcon(pricing)}
                          </div>
                          <span className="font-medium text-sm">
                            {getPricingLevel(pricing)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-sm">
                          {getPricingLocation(pricing)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          
                          <span className="font-bold text-green-700">
                            {formatCurrency(pricing.defaultFee)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600 line-clamp-2" title={pricing.description}>
                          {pricing.description || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusUpdateClick(pricing)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            pricing.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            pricing.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {pricing.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-gray-700 text-sm">
                        {formatDate(pricing.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(pricing)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-xs"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(pricing)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-xs"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <DollarSign className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No default pricing found</h3>
                        <p className="mb-4 text-sm">
                          {searchTerm || countryFilter || stateFilter || levelFilter 
                            ? 'Try adjusting your search terms or filters' 
                            : 'Get started by adding your first default pricing'}
                        </p>
                        {!(searchTerm || countryFilter || stateFilter || levelFilter) && (
                          <button 
                            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
                            onClick={handleCreateClick}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Default Pricing
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPricings.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-t border-gray-200 bg-gray-50 gap-4">
              <div className="text-xs text-gray-600">
                Showing <span className="font-medium">{filteredPricings.length}</span> of{' '}
                <span className="font-medium">{total}</span> results (Page {page} of {totalPages})
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={handlePreviousPage}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs flex items-center"
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-[#5D2A8B] text-white rounded hover:bg-[#4a216d] text-xs">
                  {page}
                </button>
                <button 
                  onClick={handleNextPage}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs flex items-center"
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultPricingPage;