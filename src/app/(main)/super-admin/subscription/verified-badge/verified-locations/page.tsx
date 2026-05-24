// "use client";

// import { useState, useEffect } from "react";
// import { Search, CheckCircle, Eye, Filter, User, Building2 } from "lucide-react";
// import { LocationVerificationService } from '@/services/LocationVerificationService';

// interface VerifiedLocation {
//   profileId: string;
//   locationIndex: number;
//   organizationId: string;
//   organizationName: string;
//   adminEmail: string;
//   adminName: string;
//   location: {
//     brandName: string;
//     locationType: string;
//     cityRegion: string;
//     cityRegionFee?: number;
//     address: string;
//     gallery: {
//       images: string[];
//       videos: string[];
//     };
//   };
//   verifiedAt: string;
//   verifiedBy: string;
// }

// const VerifiedLocationVerificationsPage = () => {
//   const [verifiedLocations, setVerifiedLocations] = useState<VerifiedLocation[]>([]);
//   const [filteredLocations, setFilteredLocations] = useState<VerifiedLocation[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchVerifiedLocations = async () => {
//       try {
//         setLoading(true);
        
//         const response = await LocationVerificationService.getVerifiedLocations();
        
//         if (response.success && response.data) {
//           setVerifiedLocations(response.data.verifiedLocationVerifications);
//           setFilteredLocations(response.data.verifiedLocationVerifications);
//         } else {
//           throw new Error(response.message || 'Failed to fetch verified locations');
//         }
//       } catch (error) {
//         console.error("Error fetching verified locations:", error);
//         // alert('Error fetching verified locations: ' + (error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVerifiedLocations();
//   }, []);

 
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredLocations(verifiedLocations);
//     } else {
//       const filtered = verifiedLocations.filter(
//         (location) =>
//           location.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.location.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           location.location.cityRegion.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredLocations(filtered);
//     }
//   }, [searchTerm, verifiedLocations]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   if (loading) {
//     return (
//       <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
//         <div className="max-w-full mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
//             <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr>
//                     {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
//                       <th key={col} className="py-3 px-4">
//                         <div className="h-4 bg-gray-200 rounded w-20"></div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[1, 2, 3].map((row) => (
//                     <tr key={row} className="border-b border-gray-100">
//                       {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
//                         <td key={col} className="py-4 px-4">
//                           <div className="h-4 bg-gray-200 rounded w-full"></div>
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
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

//       <div className="max-w-full mx-auto">
      
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-[#1A1A1A]">Verified Location Verifications</h1>
//           <p className="text-gray-600">Manage and review approved location verification requests</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex flex-col md:flex-row gap-4 md:w-2/3">
//               <div className="relative w-full md:w-1/2">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Search className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
//                   placeholder="Search by organization, admin, location, or city region..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
//                 <Filter className="w-5 h-5 mr-2" />
//                 More Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1200px]">
//               <thead className="bg-gray-50">
//                 <tr className="border-b border-gray-200">
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">S/N</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Organization</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Admin</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location Type</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">City Region</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Address</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Verified At</th>
//                   <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Verified By</th>
//                   {/* <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Actions</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLocations.length > 0 ? (
//                   filteredLocations.map((location, index) => (
//                     <tr key={`${location.profileId}-${location.locationIndex}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-4 px-4 text-gray-900 font-medium text-sm">{index + 1}</td>
//                       <td className="py-4 px-4 text-gray-900 font-medium text-sm">{location.organizationName}</td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-gray-500" />
//                           <div>
//                             <div>{location.adminName}</div>
//                             <div className="text-gray-500 text-xs">{location.adminEmail}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Building2 className="w-4 h-4 text-gray-500" />
//                           {location.location.brandName}
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">{location.location.locationType}</td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">{location.location.cityRegion}</td>
//                       <td className="py-4 px-4 text-gray-600 text-sm max-w-xs">{location.location.address}</td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">{formatDate(location.verifiedAt)}</td>
//                       <td className="py-4 px-4 text-gray-600 text-sm">{location.verifiedBy}</td>
                     
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={10} className="py-8 px-4 text-center text-gray-500">
//                       No verified locations found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifiedLocationVerificationsPage;


"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, Eye, Filter, User, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { LocationVerificationService } from '@/services/LocationVerificationService';

interface VerifiedLocation {
  profileId: string;
  locationIndex: number;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  location: {
    brandName: string;
    locationType: string;
    cityRegion: string;
    cityRegionFee?: number;
    address: string;
    gallery: {
      images: string[];
      videos: string[];
    };
  };
  verifiedAt: string;
  verifiedBy: string;
}

const VerifiedLocationVerificationsPage = () => {
  const [verifiedLocations, setVerifiedLocations] = useState<VerifiedLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<VerifiedLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVerifiedLocations = async () => {
      try {
        setLoading(true);
        
        const response = await LocationVerificationService.getVerifiedLocations();
        
        if (response.success && response.data) {
          setVerifiedLocations(response.data.verifiedLocationVerifications);
          setFilteredLocations(response.data.verifiedLocationVerifications);
        } else {
          throw new Error(response.message || 'Failed to fetch verified locations');
        }
      } catch (error) {
        console.error("Error fetching verified locations:", error);
        // alert('Error fetching verified locations: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedLocations();
  }, []);

  // Filter when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(verifiedLocations);
    } else {
      const filtered = verifiedLocations.filter(
        (location) =>
          location.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.location.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.location.cityRegion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
    // Reset to first page whenever search results change
    setCurrentPage(1);
  }, [searchTerm, verifiedLocations]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLocations.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                      <th key={col} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row} className="border-b border-gray-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                        <td key={col} className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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

      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Verified Location Verifications</h1>
          <p className="text-gray-600">Manage and review approved location verification requests</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:w-2/3">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  placeholder="Search by organization, admin, location, or city region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">S/N</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Organization</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Admin</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location Type</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">City Region</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Address</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Verified At</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Verified By</th>
                  {/* <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((location, index) => (
                    <tr key={`${location.profileId}-${location.locationIndex}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{startIndex + index + 1}</td>
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{location.organizationName}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <div>{location.adminName}</div>
                            <div className="text-gray-500 text-xs">{location.adminEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          {location.location.brandName}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.location.locationType}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.location.cityRegion}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm max-w-xs">{location.location.address}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{formatDate(location.verifiedAt)}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.verifiedBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 px-4 text-center text-gray-500">
                      No verified locations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredLocations.length)}</span> of{' '}
                <span className="font-medium">{filteredLocations.length}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === page
                        ? 'bg-[#5d2a8b] text-white border-[#5d2a8b]'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedLocationVerificationsPage;