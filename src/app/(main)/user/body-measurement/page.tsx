'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// Components should be imported relative to your project structure
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav'; 
import { UserTopBar } from '@/app/components/user-topbar'; 
import ActionModal from '@/app/components/ActionModal';

import { 
    useManualMeasurements, 
    Measurement, 
    MeasurementSection, 
    MeasurementData as ApiMeasurementData,
    useDeleteManualMeasurement
} from '@/api/hooks/useManualMeasurement'; 
import { Plus, Eye, Camera, MoreVertical } from 'lucide-react';

interface MeasurementData {
  chest: string;
  waist: string;
  hips: string;
  legs: string;
}

const BodyMeasurementPage = () => {
  const router = useRouter();
  const { data: measurements, isLoading, error, refetch } = useManualMeasurements();
  const { mutate: deleteMeasurement } = useDeleteManualMeasurement();
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  const latestMeasurement = measurements && measurements.length > 0 ? measurements[0] : null;

  const getSummaryMeasurements = (): MeasurementData => {
    if (!latestMeasurement) {
      return { chest: '--', waist: '--', hips: '--', legs: '--' };
    }

    const summary: MeasurementData = { chest: '--', waist: '--', hips: '--', legs: '--' };

    latestMeasurement.sections?.forEach((section: MeasurementSection) => {
      section.measurements?.forEach((m: ApiMeasurementData) => {
        const partName = m.bodyPartName?.toLowerCase();
        // Check for common body parts and assign size with ' cm'
        if (partName?.includes('chest')) summary.chest = `${m.size} cm`;
        if (partName?.includes('waist')) summary.waist = `${m.size} cm`;
        if (partName?.includes('hip')) summary.hips = `${m.size} cm`;
        if (partName?.includes('leg') || partName?.includes('thigh')) summary.legs = `${m.size} cm`;
      });
    });

    return summary;
  };

  const handleActionClick = (measurement: Measurement, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeasurement(measurement);
    setIsModalOpen(true);
    
    // Set modal position based on button position
    if (actionButtonRef.current) {
      const rect = actionButtonRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  };

  const handleEdit = () => {
    if (selectedMeasurement) {
      router.push(`/user/body-measurement/edit?id=${selectedMeasurement.id}`);
    }
  };

  const handleView = () => {
    if (selectedMeasurement) {
      router.push(`/user/body-measurement/view?id=${selectedMeasurement.id}`);
    }
  };

  const handleDelete = () => {
    // Open confirmation modal instead of directly deleting
    setIsDeleteConfirmOpen(true);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedMeasurement) {
      deleteMeasurement(selectedMeasurement.id, {
        onSuccess: () => {
          // Refetch measurements to update the list
          refetch();
          // Close the confirmation modal
          setIsDeleteConfirmOpen(false);
        },
        onError: (err) => {
          console.error('Failed to delete measurement:', err);
          // Close the confirmation modal even if delete fails
          setIsDeleteConfirmOpen(false);
        }
      });
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Mobile: Show only UserTopBar */}
      <div className="md:hidden">
        <UserTopBar />
      </div>

      {/* Desktop: Show MeasurementTopNav (which includes UserTopBar) */}
      <div className="hidden md:block">
        <MeasurementTopNav
          title="Current body measurement"
          measurements={getSummaryMeasurements()}
        />
      </div>

      {/* Mobile: Measurement Card (Separate implementation for fixed mobile layout) */}
      <div className="md:hidden px-4 py-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="manrope text-xs text-gray-500 mb-3">Body Measurement</div>
          
          {/* Mobile Measurement Row: Using flex and horizontal scroll */}
          <div className="flex overflow-x-auto flex-nowrap gap-3 pb-2 -mx-2 px-2">
            
            <div className="flex flex-col items-center p-2 flex-shrink-0 w-1/4 min-w-[80px]">
              <span className="manrope font-semibold text-gray-800">{getSummaryMeasurements().chest}</span>
              <span className="manrope text-xs text-gray-600 mt-0.5">Chest</span>
            </div>
            <div className="flex flex-col items-center p-2 flex-shrink-0 w-1/4 min-w-[80px]">
              <span className="manrope font-semibold text-gray-800">{getSummaryMeasurements().waist}</span>
              <span className="manrope text-xs text-gray-600 mt-0.5">Waist</span>
            </div>
            <div className="flex flex-col items-center p-2 flex-shrink-0 w-1/4 min-w-[80px]">
              <span className="manrope font-semibold text-gray-800">{getSummaryMeasurements().hips}</span>
              <span className="manrope text-xs text-gray-600 mt-0.5">Hips</span>
            </div>
            <div className="flex flex-col items-center p-2 flex-shrink-0 w-1/4 min-w-[80px]">
              <span className="manrope font-semibold text-gray-800">{getSummaryMeasurements().legs}</span>
              <span className="manrope text-xs text-gray-600 mt-0.5">Legs</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Positioning */}
      <div className="w-full px-4 py-6 md:absolute md:w-[958px] md:top-[271px] md:left-[401px] md:px-0">
        
        {/* Header with Title and Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="manrope text-xl md:text-3xl font-semibold text-gray-800">
            Overview
          </h1>
          <button
            onClick={() => router.push('/user/body-measurement/create')}
            className="manrope flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          
          {/* Loading, Error, Empty State Handling */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="manrope text-gray-500 mt-4">Loading measurements...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="manrope text-red-500">Failed to load measurements</p>
            </div>
          ) : !measurements || measurements.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl border-2 border-purple-200 flex items-center justify-center">
                <Camera className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="manrope text-lg font-semibold text-gray-800 mb-2">
                No measurements recorded yet!
              </h3>
              <p className="manrope text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                There is nothing to view right now.<br />
                Create a body measurement to see here.
              </p>
              <button
                onClick={() => router.push('/user/body-measurement/create')}
                className="manrope bg-[#5D2A8B] text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                Create Your First Measurement
              </button>
            </div>
          ) : (
            <>
              {/* Mobile: Card List Layout */}
              <div className="md:hidden divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {measurements.map((measurement: Measurement) => (
                  <div key={measurement.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="manrope font-semibold text-gray-900">
                          {measurement.firstName} {measurement.lastName}
                        </h3>
                        <p className="manrope text-sm text-gray-500 mt-1">
                          {measurement.measurementType}
                        </p>
                      </div>
                      <button
                        ref={actionButtonRef}
                        onClick={(e) => handleActionClick(measurement, e)}
                        className="text-[#5D2A8B] hover:text-purple-700 flex items-center gap-1 text-sm"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="manrope text-gray-500">
                        {new Date(measurement.createdAt).toLocaleDateString()}
                      </span>
                      <span className="manrope text-gray-500">
                        {measurement.sections?.length || 0} sections
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sections
                      </th>
                      <th className="manrope px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {measurements.map((measurement: Measurement) => (
                      <tr key={measurement.id} className="hover:bg-gray-50">
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {measurement.firstName} {measurement.lastName}
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.measurementType}
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.subject}
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(measurement.createdAt).toLocaleDateString()}
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.sections?.length || 0} sections
                        </td>
                        <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            ref={actionButtonRef}
                            onClick={(e) => handleActionClick(measurement, e)}
                            className="text-[#5D2A8B] hover:text-purple-700 flex items-center gap-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                            Actions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedMeasurement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={cancelDelete}></div>
          <div className="bg-white rounded-lg p-6 z-10 w-96 max-w-[90vw]">
            <h3 className="manrope text-lg font-semibold text-gray-800 mb-2">
              Confirm Delete
            </h3>
            <p className="manrope text-gray-600 mb-6">
              Are you sure you want to delete the measurement for{' '}
              <strong>{selectedMeasurement.firstName} {selectedMeasurement.lastName}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="manrope px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="manrope px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to prevent content from being hidden behind bottom nav on mobile */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default BodyMeasurementPage;