'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav'; 
import ActionModal from '@/app/components/ActionModal';
import { AdminMeasurementService, Measurement } from '@/services/AdminMeasurementService';
import { toast } from '@/app/components/hooks/use-toast';
import { Plus, MoreVertical } from 'lucide-react';

interface MeasurementData {
  chest: string;
  waist: string;
  hips: string;
  legs: string;
}

interface MeasurementItem {
  label: string;
  value: string;
}

const AdminBodyMeasurementPage = () => {
  const router = useRouter();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMeasurements, setTotalMeasurements] = useState(0);

  // Fetch measurements from API
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLoading(true);
        const measurementService = new AdminMeasurementService();
        const response = await measurementService.getMeasurements(currentPage, 10);
        
        setMeasurements(response.data.measurements);
        setTotalPages(response.data.pagination.totalPages);
        setTotalMeasurements(response.data.total);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching measurements:', err);
        setError(err.message || 'Failed to fetch measurements');
        toast({ 
          title: 'Error', 
          description: err.message || 'Failed to fetch measurements',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [currentPage]);

  const getSummaryMeasurements = (): any => {
    if (!measurements || measurements.length === 0) {
      return [
        { label: 'Chest', value: '--' },
        { label: 'Waist', value: '--' },
        { label: 'Hips', value: '--' },
        { label: 'Shoulder', value: '--' }
      ];
    }

    const latestMeasurement = measurements[0];
    const summary: any[] = [];

    // Process all measurements from the latest measurement
    Object.entries(latestMeasurement.measurements).forEach(([key, value]) => {
      // Skip undefined or null values
      if (value === undefined || value === null) return;
      
      const partName = key.toLowerCase();
      const displayValue = `${value} cm`;
      
      // Check for common body parts and add them to summary
      if (partName.includes('chest')) {
        summary.push({ label: 'Chest', value: displayValue });
      } else if (partName.includes('waist')) {
        summary.push({ label: 'Waist', value: displayValue });
      } else if (partName.includes('hip')) {
        summary.push({ label: 'Hips', value: displayValue });
      } else if (partName.includes('shoulder')) {
        summary.push({ label: 'Shoulder', value: displayValue });
      } else {
        // For other body parts, use the actual name
        const displayName = key.charAt(0).toUpperCase() + key.slice(1);
        summary.push({ label: displayName, value: displayValue });
      }
    });

    // Ensure we always have at least 4 measurements by filling with defaults if needed
    const requiredMeasurements = ['Chest', 'Waist', 'Hips', 'Shoulder'];
    requiredMeasurements.forEach(required => {
      if (!summary.some(item => item.label === required)) {
        summary.push({ label: required, value: '--' });
      }
    });

    // Limit to 4 items for display
    return summary.slice(0, 4);
  };

  // Helper function to get a specific measurement value
  const getMeasurementValue = (label: string): string => {
    const measurements = getSummaryMeasurements();
    const item = measurements.find((m: any) => m.label === label);
    return item ? item.value : '--';
  };

  const handleActionClick = (measurement: Measurement, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeasurement(measurement);
    setIsModalOpen(true);
    
    // Set modal position based on button position with better viewport awareness
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    
    // Calculate position relative to viewport
    const top = rect.bottom + window.scrollY + 5;
    const left = rect.left + window.scrollX - 50; // Adjust to center the modal on the button
    
    setModalPosition({
      top,
      left
    });
  };

  const handleEdit = () => {
    if (selectedMeasurement) {
      router.push(`/admin/body-measurement/edit/${selectedMeasurement.id}`);
    }
  };

  const handleView = () => {
    if (selectedMeasurement) {
      router.push(`/admin/body-measurement/view/${selectedMeasurement.id}`);
    }
  };

  const handleDelete = async () => {
    if (selectedMeasurement) {
      try {
        const measurementService = new AdminMeasurementService();
        await measurementService.deleteMeasurement(selectedMeasurement.id);
        
        // Remove the deleted measurement from the list
        setMeasurements(prev => prev.filter(m => m.id !== selectedMeasurement.id));
        
        toast({ 
          title: 'Success', 
          description: 'Measurement deleted successfully',
          variant: 'default'
        });
      } catch (err: any) {
        console.error('Failed to delete measurement:', err);
        toast({ 
          title: 'Error', 
          description: err.message || 'Failed to delete measurement',
          variant: 'destructive'
        });
      }
    }
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filter measurements based on search term
  const filteredMeasurements = measurements.filter((measurement: Measurement) => {
    const userName = measurement.userName || '';
    const fullName = measurement.userInfo?.fullName || '';
    const email = measurement.userInfo?.email || '';
    const submissionType = measurement.submissionType || '';
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           submissionType.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get unique section names for table headers
  const getUniqueSectionNames = () => {
    const sectionNames = new Set<string>();
    
    filteredMeasurements.forEach((item: Measurement) => {
      // Extract section names from the measurements object keys
      Object.keys(item.measurements).forEach(key => {
        // Only add section names that have actual values
        if (item.measurements[key] !== undefined && item.measurements[key] !== null) {
          sectionNames.add(key.charAt(0).toUpperCase() + key.slice(1));
        }
      });
    });
    
    return Array.from(sectionNames);
  };

  // Get measurements for a specific section (only sizes)
  const getMeasurementsForSection = (item: Measurement, sectionName: string) => {
    // Convert section name back to lowercase to match object keys
    const key = sectionName.toLowerCase();
    if (item.measurements[key] !== undefined && item.measurements[key] !== null) {
      return `${item.measurements[key]} cm`;
    }
    return '--';
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Measurement Top Nav */}
      <MeasurementTopNav
        title="Current body measurement"
        measurements={getSummaryMeasurements()}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />

      {/* Main Content - Responsive Positioning */}
      <div className="w-full px-4 py-6 md:absolute md:w-[958px] md:top-[271px] md:left-[401px] md:px-0">
        
        {/* Header with Title and Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="manrope text-xl md:text-3xl font-semibold text-gray-800">
            All Body Measurements
          </h1>
          <button
            onClick={() => router.push('/admin/body-measurement/create')}
            className="manrope flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          
          {/* Loading, Error, Empty State Handling */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="manrope text-gray-500 mt-4">Loading measurements...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="manrope text-red-500">Failed to load measurements</p>
            </div>
          ) : !filteredMeasurements || filteredMeasurements.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl border-2 border-purple-200 flex items-center justify-center">
                <Plus className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="manrope text-lg font-semibold text-gray-800 mb-2">
                No measurements recorded yet!
              </h3>
              <p className="manrope text-sm text-gray-500 mb-6 max-w-sm mx-auto">
               There is nothing to view right now, <br />
                Create a body measurement to see here.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="manrope text-left px-6 py-4 text-sm font-medium text-gray-500">User Details</th>
                      <th className="manrope text-left px-6 py-4 text-sm font-medium text-gray-500">Measurement Type</th>
                      {/* Dynamic section headers */}
                      {getUniqueSectionNames().slice(0, 4).map((sectionName, index) => (
                        <th key={index} className="manrope text-left px-6 py-4 text-sm font-medium text-gray-500">
                          {sectionName}
                        </th>
                      ))}
                      <th className="manrope text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMeasurements.map((measurement: Measurement) => (
                      <tr key={measurement.id} className="hover:bg-gray-50">
                        <td className="manrope px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold text-gray-900">
                              {measurement.userInfo?.fullName || measurement.userName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {measurement.userInfo?.email || 'N/A'}
                            </div>
                            {measurement.userInfo?.customUserId && (
                              <div className="text-xs text-gray-400 mt-1">
                                ID: {measurement.userInfo.customUserId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.submissionType}
                        </td>
                        {/* Dynamic section measurements */}
                        {getUniqueSectionNames().slice(0, 4).map((sectionName, secIndex) => (
                          <td key={secIndex} className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getMeasurementsForSection(measurement, sectionName)}
                          </td>
                        ))}
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => handleActionClick(measurement, e)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span> (Total: {totalMeasurements} measurements)
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                <div className="space-y-4">
                  {filteredMeasurements.map((measurement: Measurement) => (
                    <div key={measurement.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="manrope font-semibold text-gray-900">
                            {measurement.userInfo?.fullName || measurement.userName || 'N/A'}
                          </h3>
                          <p className="manrope text-sm text-gray-500 mt-1">
                            {measurement.userInfo?.email || 'N/A'}
                          </p>
                          <p className="manrope text-xs text-gray-400 mt-1">
                            {measurement.submissionType} • ID: {measurement.userInfo?.customUserId || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {getUniqueSectionNames().slice(0, 4).map((sectionName, secIndex) => (
                          <div key={secIndex} className="flex justify-between items-center">
                            <span className="manrope text-sm text-gray-500">{sectionName}:</span>
                            <span className="manrope text-sm font-medium text-gray-900">
                              {getMeasurementsForSection(measurement, sectionName)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => router.push(`/admin/body-measurement/view/${measurement.id}`)}
                          className="manrope flex-1 bg-indigo-50 text-indigo-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-100"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleActionClick(measurement, e)}
                          className="manrope flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-100"
                        >
                          More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        <button 
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onViewMeasurement={handleView}
        onEditMeasurement={handleEdit}
        onDelete={handleDelete}
        position={modalPosition}
      />
    </div>
  );
};

export default AdminBodyMeasurementPage;