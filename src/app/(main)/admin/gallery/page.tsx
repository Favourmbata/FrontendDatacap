// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Plus, 
//   Search, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Image as ImageIcon,
//   Video,
//   Tag,
//   BarChart3,
//   MapPin,
//   CheckCircle,
//   XCircle
// } from 'lucide-react';
// import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
// import { GalleryService } from '@/services/GalleryService';
// import { useAuthContext } from '@/AuthContext';

// interface GalleryItem {
//   _id: string;
//   description: string;
//   category: string;
//   sku?: string;
//   upc?: string;
//   platformUniqueCode?: string;
//   totalAvailableQuantity: number;
//   priceInDollars: number;
//   discountPercentage: number;
//   platformChargePercentage: number;
//   startDate: string;
//   startTime: string;
//   endDate: string;
//   endTime: string;
//   visibilityToPublic: boolean;
//   notes?: string;
//   locationIndex: number;
//   images: string[];
//   videos: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface LocationUsage {
//   locationIndex: number;
//   locationName: string;
//   images: number;
//   maxImages: number;
//   videos: number;
//   maxVideos: number;
//   verified: boolean;
// }

// interface GalleryResponse {
//   success: boolean;
//   data: {
//     items: GalleryItem[];
//     pagination: {
//       total: number;
//       page: number;
//       limit: number;
//       totalPages: number;
//     };
//     locationUsage: LocationUsage[];
//   };
//   message: string;
// }

// const GalleryManagementPage = () => {
//   const router = useRouter();
//   const { token } = useAuthContext();
  
//   console.log('Gallery page: Component mounted, token available:', !!token);
//   const [items, setItems] = useState<GalleryItem[]>([]);
//   const [locationUsage, setLocationUsage] = useState<LocationUsage[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState('');

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

//   // Fetch gallery items
//   const fetchGalleryItems = async () => {
//     if (!token) return;
    
//     try {
//       setLoading(true);
//       console.log('Gallery page: Fetching gallery items');
      
//       const result = await GalleryService.getGalleryItems(
//         token,
//         currentPage,
//         10,
//         selectedCategory || undefined,
//         searchTerm || undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         sortBy,
//         sortOrder
//       ) /* as GalleryResponse */;
      
//       if (result.success && result.data) {
//         setItems(result.data.items || []);
//         // Note: locationUsage is not returned by current API, using empty array
//         setLocationUsage([]);
//         setTotalPages(result.data.totalPages || 1);
//         setTotalItems(result.data.totalItems || 0);
        
//         // Extract unique categories from items
//         const uniqueCategories = [...new Set(result.data.items.map(item => item.category))];
//         setCategories(uniqueCategories);
//       } else {
//         console.error('Failed to fetch gallery items:', result.message);
//       }
//     } catch (error: any) {
//       console.error('Error fetching gallery items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update categories when items change
//   useEffect(() => {
//     if (items.length > 0) {
//       const uniqueCategories = [...new Set(items.map(item => item.category))];
//       setCategories(uniqueCategories);
//     }
//   }, [items]);

//   useEffect(() => {
//     if (token) {
//       fetchGalleryItems();
//     }
//   }, [token, currentPage, sortBy, sortOrder, searchTerm, selectedCategory, selectedLocation]);

//   const handleCreateItem = () => {
//     router.push('/admin/gallery/create');
//   };

//   const handleEditItem = (item: GalleryItem) => {
//     router.push(`/admin/gallery/edit/${item._id}`);
//   };

//   const handleDeleteItem = (item: GalleryItem) => {
//     setSelectedItem(item);
//     setShowDeleteModal(true);
//   };

//   const confirmDeleteItem = async () => {
//     if (!selectedItem || !token) return;

//     setDeleteLoading(true);
//     try {
//       console.log('Gallery page: Deleting item', selectedItem._id);
//       const result = await GalleryService.deleteGalleryItem(token, selectedItem._id);
      
//       if (result.success) {
//         fetchGalleryItems();
//         setShowDeleteModal(false);
//         setSelectedItem(null);
//       } else {
//         alert(result.message || 'Failed to delete gallery item');
//       }
//     } catch (error: any) {
//       console.error('Error deleting gallery item:', error);
//       alert(error.message || 'An error occurred while deleting the gallery item');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleCategoryFilter = (category: string) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//   };

//   const handleLocationFilter = (locationIndex: string) => {
//     setSelectedLocation(locationIndex);
//     setCurrentPage(1);
//   };

//   const calculateActualAmount = (price: number, discount: number, platformCharge: number) => {
//     return price - (price * discount / 100) + (price * platformCharge / 100);
//   };

//   const getLocationName = (locationIndex: number) => {
//     const location = locationUsage.find(loc => loc.locationIndex === locationIndex);
//     return location?.locationName || `Location ${locationIndex + 1}`;
//   };

//   const getLocationVerificationStatus = (locationIndex: number) => {
//     const location = locationUsage.find(loc => loc.locationIndex === locationIndex);
//     return location?.verified || false;
//   };

//   const getCategoryCount = (categoryName: string) => {
//     return items.filter(item => item.category === categoryName).length;
//   };

//   if (loading && items.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
//               <p className="text-gray-600 mt-2">Manage your gallery items and locations</p>
//             </div>
//             <button
//               onClick={handleCreateItem}
//               className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Create Item</span>
//             </button>
//           </div>
//         </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-lg bg-purple-100">
//               <BarChart3 className="w-6 h-6 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Items</p>
//               <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-lg bg-blue-100">
//               <Tag className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Categories</p>
//               <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-lg bg-green-100">
//               <MapPin className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Locations</p>
//               <p className="text-2xl font-bold text-gray-900">{locationUsage.length}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-lg bg-emerald-100">
//               <ImageIcon className="w-6 h-6 text-emerald-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Images</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {locationUsage.reduce((sum, loc) => sum + loc.images, 0)}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center">
//             <div className="p-3 rounded-lg bg-rose-100">
//               <Video className="w-6 h-6 text-rose-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Videos</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {locationUsage.reduce((sum, loc) => sum + loc.videos, 0)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Location Usage Summary */}
//       {locationUsage.length > 0 && (
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Usage</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {locationUsage.map((location) => (
//               <div key={location.locationIndex} className="border rounded-lg p-3">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="font-medium text-gray-800">{location.locationName}</span>
//                   {location.verified ? (
//                     <span className="flex items-center text-green-600 text-xs">
//                       <CheckCircle className="w-4 h-4 mr-1" />
//                       Verified
//                     </span>
//                   ) : (
//                     <span className="flex items-center text-red-600 text-xs">
//                       <XCircle className="w-4 h-4 mr-1" />
//                       Unverified
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex gap-4 text-sm">
//                   <div>
//                     <span className="text-gray-600">Images:</span>
//                     <span className="ml-1 font-medium">{location.images}/{location.maxImages}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Videos:</span>
//                     <span className="ml-1 font-medium">{location.videos}/{location.maxVideos}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search items..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//             </div>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <select
//               value={selectedCategory}
//               onChange={(e) => handleCategoryFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[180px]"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category} ({getCategoryCount(category)})
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedLocation}
//               onChange={(e) => handleLocationFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[180px]"
//             >
//               <option value="">All Locations</option>
//               {locationUsage.map((location) => (
//                 <option key={location.locationIndex} value={location.locationIndex.toString()}>
//                   {location.locationName} {location.verified ? '✓' : ''}
//                 </option>
//               ))}
//             </select>
            
//             <select
//               value={`${sortBy}-${sortOrder}`}
//               onChange={(e) => {
//                 const [newSortBy, newSortOrder] = e.target.value.split('-');
//                 setSortBy(newSortBy);
//                 setSortOrder(newSortOrder as 'asc' | 'desc');
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[180px]"
//             >
//               <option value="createdAt-desc">Newest First</option>
//               <option value="createdAt-asc">Oldest First</option>
//               <option value="priceInDollars-desc">Price: High to Low</option>
//               <option value="priceInDollars-asc">Price: Low to High</option>
//               <option value="description-asc">Name: A to Z</option>
//               <option value="description-desc">Name: Z to A</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Gallery Items Grid */}

//       {items.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {items.map((item) => (
//             <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
//               {/* Item Image Preview */}
//               <div className="relative h-48 bg-gray-200">
//                 {item.images.length > 0 ? (
//                   <img 
//                     src={item.images[0]} 
//                     alt={item.description}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <ImageIcon className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//                 <div className="absolute top-2 right-2 flex gap-1">
//                   {item.images.length > 0 && (
//                     <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
//                       <ImageIcon className="w-3 h-3 inline mr-1" />
//                       {item.images.length}
//                     </span>
//                   )}
//                   {item.videos.length > 0 && (
//                     <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
//                       <Video className="w-3 h-3 inline mr-1" />
//                       {item.videos.length}
//                     </span>
//                   )}
//                 </div>
//                 {!item.visibilityToPublic && (
//                   <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                     Private
//                   </div>
//                 )}
//                 <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center">
//                   <MapPin className="w-3 h-3 mr-1" />
//                   {getLocationName(item.locationIndex)}
//                   {getLocationVerificationStatus(item.locationIndex) && (
//                     <CheckCircle className="w-3 h-3 ml-1 text-green-400" />
//                   )}
//                 </div>
//               </div>

//               {/* Item Details */}
//               <div className="p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="font-semibold text-gray-800 line-clamp-2">{item.description}</h3>
//                   <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
//                     {item.category}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Price:</span>
//                     <span className="font-medium">${item.priceInDollars.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Actual:</span>
//                     <span className="font-medium text-green-600">
//                       ${calculateActualAmount(
//                         item.priceInDollars, 
//                         item.discountPercentage, 
//                         item.platformChargePercentage
//                       ).toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Quantity:</span>
//                     <span className="font-medium">{item.totalAvailableQuantity}</span>
//                   </div>
//                   {item.sku && (
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600">SKU:</span>
//                       <span className="font-medium">{item.sku}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => router.push(`/admin/gallery/view/${item._id}`)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View
//                   </button>
//                   <button 
//                     onClick={() => handleEditItem(item)}
//                     className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteItem(item)}
//                     className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-800 mb-2">No gallery items found</h3>
//           <p className="text-gray-600 mb-4">
//             {searchTerm || selectedCategory || selectedLocation
//               ? 'Try adjusting your search or filter criteria'
//               : 'Get started by creating your first gallery item'}
//           </p>
//           {!searchTerm && !selectedCategory && !selectedLocation && (
//             <button
//               onClick={handleCreateItem}
//               className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               Create Gallery Item
//             </button>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-2">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setSelectedItem(null);
//         }}
//         onConfirm={confirmDeleteItem}
//         itemName={selectedItem?.description || ''}
//         loading={deleteLoading}
//       />
//     </div>
//   </div>
//   );
// };

// export default GalleryManagementPage;


"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Video,
  Tag,
  BarChart3,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import DeleteConfirmationModal from '@/app/components/DeleteConfirmationModal';
import { GalleryService } from '@/services/GalleryService';
import { useAuthContext } from '@/AuthContext';

interface GalleryItem {
  _id: string;
  description: string;
  category: string;
  sku?: string;
  upc?: string;
  platformUniqueCode?: string;
  totalAvailableQuantity: number;
  priceInDollars: number;
  discountPercentage: number;
  platformChargePercentage: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibilityToPublic: boolean;
  notes?: string;
  locationIndex: number;
  images: string[];
  videos: string[];
  createdAt: string;
  updatedAt: string;
}

interface LocationUsage {
  locationIndex: number;
  locationName: string;
  images: number;
  maxImages: number;
  videos: number;
  maxVideos: number;
  verified: boolean;
}

const GalleryManagementPage = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  
  console.log('Gallery page: Component mounted, token available:', !!token);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [locationUsage, setLocationUsage] = useState<LocationUsage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      console.log('Gallery page: Fetching gallery items');
      
      const result = await GalleryService.getGalleryItems(
        token,
        currentPage,
        10,
        selectedCategory || undefined,
        searchTerm || undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        sortBy,
        sortOrder
      );
      
      if (result.success && result.data) {
        setItems(result.data.items || []);
        setLocationUsage(result.data.locationUsage || []);
        setTotalPages(result.data.pagination.totalPages || 1);
        setTotalItems(result.data.pagination.total || 0);
        
        // Extract unique categories from items
        if (result.data.items && result.data.items.length > 0) {
          const uniqueCategories = [...new Set(result.data.items.map(item => item.category))];
          setCategories(uniqueCategories);
        } else {
          setCategories([]);
        }
      } else {
        console.error('Failed to fetch gallery items:', result.message);
      }
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update categories when items change
  useEffect(() => {
    if (items.length > 0) {
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  }, [items]);

  useEffect(() => {
    if (token) {
      fetchGalleryItems();
    }
  }, [token, currentPage, sortBy, sortOrder, searchTerm, selectedCategory, selectedLocation]);

  const handleCreateItem = () => {
    router.push('/admin/gallery/create');
  };

  const handleEditItem = (item: GalleryItem) => {
    router.push(`/admin/gallery/edit/${item._id}`);
  };

  const handleViewItem = (item: GalleryItem) => {
    router.push(`/admin/gallery/view/${item._id}`);
  };

  const handleDeleteItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = async () => {
    if (!selectedItem || !token) return;

    setDeleteLoading(true);
    try {
      console.log('Gallery page: Deleting item', selectedItem._id);
      const result = await GalleryService.deleteGalleryItem(token, selectedItem._id);
      
      if (result.success) {
        fetchGalleryItems();
        setShowDeleteModal(false);
        setSelectedItem(null);
      } else {
        alert(result.message || 'Failed to delete gallery item');
      }
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      alert(error.message || 'An error occurred while deleting the gallery item');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleLocationFilter = (locationIndex: string) => {
    setSelectedLocation(locationIndex);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setCurrentPage(1);
  };

  const calculateActualAmount = (price: number, discount: number, platformCharge: number) => {
    return price - (price * discount / 100) + (price * platformCharge / 100);
  };

  const getLocationName = (locationIndex: number) => {
    const location = locationUsage.find(loc => loc.locationIndex === locationIndex);
    return location?.locationName || `Location ${locationIndex + 1}`;
  };

  const getLocationVerificationStatus = (locationIndex: number) => {
    const location = locationUsage.find(loc => loc.locationIndex === locationIndex);
    return location?.verified || false;
  };

  const getCategoryCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length;
  };

  const getLocationUsageStats = () => {
    const totalImages = locationUsage.reduce((sum, loc) => sum + loc.images, 0);
    const totalVideos = locationUsage.reduce((sum, loc) => sum + loc.videos, 0);
    const verifiedLocations = locationUsage.filter(loc => loc.verified).length;
    return { totalImages, totalVideos, verifiedLocations };
  };

  const locationStats = getLocationUsageStats();

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-2">Manage your gallery items and locations</p>
            </div>
            <button
              onClick={handleCreateItem}
              className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Item</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{locationUsage.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100">
                <ImageIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.totalImages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-rose-100">
                <Video className="w-6 h-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">{locationStats.totalVideos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Usage Summary */}
        {locationUsage.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Location Usage</h2>
              <span className="text-sm text-gray-500">
                {locationStats.verifiedLocations} of {locationUsage.length} verified
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locationUsage.map((location) => (
                <div key={location.locationIndex} className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{location.locationName}</span>
                    {location.verified ? (
                      <span className="flex items-center text-green-600 text-xs font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-600 text-xs font-medium">
                        <XCircle className="w-4 h-4 mr-1" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Images:</span>
                      <span className="ml-2 font-semibold text-gray-700">{location.images}/{location.maxImages}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Videos:</span>
                      <span className="ml-2 font-semibold text-gray-700">{location.videos}/{location.maxVideos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by description, category, or SKU..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[160px] bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} ({getCategoryCount(category)})
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              {locationUsage.length > 0 && (
                <select
                  value={selectedLocation}
                  onChange={(e) => handleLocationFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[160px] bg-white"
                >
                  <option value="">All Locations</option>
                  {locationUsage.map((location) => (
                    <option key={location.locationIndex} value={location.locationIndex.toString()}>
                      {location.locationName} {location.verified ? '✓' : ''}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Sort Options */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[160px] bg-white"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="priceInDollars-desc">Price: High to Low</option>
                <option value="priceInDollars-asc">Price: Low to High</option>
                <option value="description-asc">Name: A to Z</option>
                <option value="description-desc">Name: Z to A</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory || selectedLocation) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Items Grid/List View */}
        {items.length > 0 ? (
          viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                  {/* Item Image Preview */}
                  <div 
                    className="relative h-48 bg-gray-100 cursor-pointer group"
                    onClick={() => handleViewItem(item)}
                  >
                    {item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {item.images.length > 0 && (
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          {item.images.length}
                        </span>
                      )}
                      {item.videos.length > 0 && (
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Video className="w-3 h-3 mr-1" />
                          {item.videos.length}
                        </span>
                      )}
                    </div>
                    {!item.visibilityToPublic && (
                      <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
                        Private
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {getLocationName(item.locationIndex)}
                      {getLocationVerificationStatus(item.locationIndex) && (
                        <CheckCircle className="w-3 h-3 ml-1 text-green-400" />
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-purple-600"
                        onClick={() => handleViewItem(item)}
                      >
                        {item.description}
                      </h3>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {item.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-semibold text-gray-900">${item.priceInDollars.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Actual:</span>
                        <span className="font-semibold text-green-600">
                          ${calculateActualAmount(
                            item.priceInDollars, 
                            item.discountPercentage, 
                            item.platformChargePercentage
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-semibold text-gray-900">{item.totalAvailableQuantity}</span>
                      </div>
                      {item.sku && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">SKU:</span>
                          <span className="font-mono text-xs text-gray-700">{item.sku}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewItem(item)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item)}
                        className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {item.images.length > 0 ? (
                                <img 
                                  src={item.images[0]} 
                                  alt={item.description}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.description}</div>
                              <div className="text-xs text-gray-500">ID: {item._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{getLocationName(item.locationIndex)}</div>
                          {getLocationVerificationStatus(item.locationIndex) ? (
                            <span className="text-xs text-green-600">Verified</span>
                          ) : (
                            <span className="text-xs text-amber-600">Unverified</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">${item.priceInDollars.toFixed(2)}</div>
                          <div className="text-xs text-green-600">
                            Actual: ${calculateActualAmount(item.priceInDollars, item.discountPercentage, item.platformChargePercentage).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.totalAvailableQuantity}</td>
                        <td className="px-6 py-4">
                          {item.visibilityToPublic ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Public</span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Private</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleViewItem(item)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full p-4 inline-flex mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory || selectedLocation
                  ? 'No items match your search criteria. Try adjusting your filters.'
                  : 'Get started by creating your first gallery item.'}
              </p>
              {!searchTerm && !selectedCategory && !selectedLocation && (
                <button
                  onClick={handleCreateItem}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Item
                </button>
              )}
              {(searchTerm || selectedCategory || selectedLocation) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            <div className="text-sm text-gray-600">
              Showing {items.length} of {totalItems} items • Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={confirmDeleteItem}
          itemName={selectedItem?.description || ''}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default GalleryManagementPage;