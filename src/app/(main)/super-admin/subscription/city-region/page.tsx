"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CityRegionService, { CityRegion as Location } from '@/services/cityRegionService';
import { routes } from '@/services/apiRoutes';

const CityRegionPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // City regions modal states
  const [showCityRegionsModal, setShowCityRegionsModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Fetch data from the API
  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
  
      const response = await CityRegionService.getCityRegions(1, 100);
      
     
      const locationMap = new Map<string, Location>();
      
      for (const item of response.regions) {
       
        if (!locationMap.has(item._id)) {
        
          locationMap.set(item._id, {
            ...item,
            cityRegions: [] 
          });
        }
      }
      
    
      const rawData = await CityRegionService['httpService'].getData<any>(routes.getCityRegions(1, 100));
      
      if (rawData.success) {
        setLocations(rawData.data.locations);
        setFilteredLocations(rawData.data.locations);
      } else {
        throw new Error(rawData.message || 'Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter locations based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(location =>
        location.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (location.lga && location.lga.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (location.cityRegions && location.cityRegions.some(cr => cr.name.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  const handleCreateClick = () => {
    router.push('/super-admin/subscription/city-region/create');
  };

  const handleEdit = (location: Location) => {
    router.push(`/super-admin/subscription/city-region/edit/${location._id}`);
  };

  const handleDeleteClick = (id: string) => {
    setRegionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!regionToDelete) return;
    
    setDeleteLoading(true);
    try {
      const success = await CityRegionService.deleteCityRegion(regionToDelete);
      if (success) {
        setSuccessMessage('City region deleted successfully');
        await fetchRegions();
        setShowDeleteModal(false);
        setShowDeleteSuccess(true);
      }
    } catch (error: any) {
      console.error('Error deleting city region:', error);
      setSuccessMessage(error.message || 'Failed to delete city region');
      setShowDeleteSuccess(true);
    } finally {
      setDeleteLoading(false);
      setRegionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRegionToDelete(null);
  };

  const handleViewCityRegions = (location: Location) => {
    setCurrentLocation(location);
    setShowCityRegionsModal(true);
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  if (loading) {
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
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 relative">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Delete Confirmation Overlay (no dark background) */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-transparent" onClick={handleDeleteCancel}></div>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete City Region</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this city region? This action cannot be undone.
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

      {/* Success Overlay */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setShowDeleteSuccess(false)}></div>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowDeleteSuccess(false)}
                className="w-full bg-[#5D2A8B] text-white py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* City Regions Modal */}
      {showCityRegionsModal && currentLocation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setShowCityRegionsModal(false)}></div>
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                City Regions - {currentLocation.city}, {currentLocation.state}
              </h3>
              <button
                onClick={() => setShowCityRegionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Location Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Country:</span> {currentLocation.country}</div>
                <div><span className="font-medium">State:</span> {currentLocation.state}</div>
                <div><span className="font-medium">LGA:</span> {currentLocation.lga || '-'}</div>
                <div><span className="font-medium">City:</span> {currentLocation.city}</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLocation.cityRegions && currentLocation.cityRegions.length > 0 ? (
                    currentLocation.cityRegions.map((region, index) => (
                      <tr key={region._id || index}>
                        <td className="py-2 px-3 text-sm text-gray-900">{region.name}</td>
                        <td className="py-2 px-3 text-sm text-gray-900">{formatCurrency(region.fee)}</td>
                        <td className="py-2 px-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            region.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              region.isActive
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}></span>
                            {region.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-3 text-center text-gray-500">
                        No city regions found for this location
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCityRegionsModal(false)}
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">City Region Management</h1>
              <p className="text-gray-600">Manage city regions for verified badge subscriptions</p>
            </div>
            <div className="text-sm text-gray-500">
              Total: <span className="font-medium">{locations?.length || 0}</span> locations
            </div>
          </div>
        </div>

        {/* Search and Add buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] bg-white"
              placeholder="Search city regions..."
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
              Add City Region
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Country</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">State/Province</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">LGA</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">City</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">City Regions</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Status</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Created Date</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations && filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => {
                    const locationId = location._id;
                    
                    return (
                      <tr key={locationId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <span className="font-medium text-sm">{location.country || '-'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-sm">{location.state || '-'}</span>
                        </td>
                        <td className="py-4 px-4">
                          {location.lga ? (
                            <span className="font-medium text-sm">{location.lga}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-sm">{location.city || '-'}</span>
                        </td>
                        <td className="py-4 px-4">
                          {location.cityRegions && location.cityRegions.length > 0 ? (
                            <button
                              onClick={() => handleViewCityRegions(location)}
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              View {location.cityRegions.length} region(s)
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No regions</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            location.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              location.isActive
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}></span>
                            {location.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700 text-sm">
                          {formatDate(location.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEdit(location)}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-xs"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteClick(locationId)}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-xs"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No city regions found</h3>
                        <p className="mb-4 text-sm">
                          {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first city region'}
                        </p>
                        {!searchTerm && (
                          <button 
                            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
                            onClick={handleCreateClick}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add City Region
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredLocations && filteredLocations.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLocations.length}</span> of{' '}
                <span className="font-medium">{filteredLocations.length}</span> results
              </div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs">
                  Previous
                </button>
                <button className="px-2 py-1 bg-[#5D2A8B] text-white rounded hover:bg-[#4a216d] text-xs">
                  1
                </button>
                <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-xs">
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

export default CityRegionPage;