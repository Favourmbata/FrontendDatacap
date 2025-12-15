'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useManualMeasurement, MeasurementSection, MeasurementData } from '@/api/hooks/useManualMeasurement';
import { ArrowLeft } from 'lucide-react';

function MeasurementDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const { data: measurement, isLoading, error } = useManualMeasurement(id);

  const getSummaryMeasurements = () => {
    if (!measurement) {
      return [
        { label: 'Chest', value: '--' },
        { label: 'Waist', value: '--' },
        { label: 'Hips', value: '--' },
        { label: 'Legs', value: '--' }
      ];
    }

    const summary: any[] = [];

    measurement.sections?.forEach((section: MeasurementSection) => {
      section.measurements?.forEach((m: MeasurementData) => {
        const partName = m.bodyPartName?.toLowerCase() || section.sectionName?.toLowerCase() || 'Unknown';
        const value = `${m.size} cm`;
        
        // Check for common body parts and add them to summary
        if (partName?.includes('chest')) {
          summary.push({ label: 'Chest', value });
        } else if (partName?.includes('waist')) {
          summary.push({ label: 'Waist', value });
        } else if (partName?.includes('hip')) {
          summary.push({ label: 'Hips', value });
        } else if (partName?.includes('leg') || partName?.includes('thigh')) {
          summary.push({ label: 'Legs', value });
        } else {
          // For other body parts, use the actual name
          const displayName = m.bodyPartName || section.sectionName || 'Measurement';
          summary.push({ label: displayName, value });
        }
      });
    });

    // Ensure we always have at least 4 measurements by filling with defaults if needed
    const requiredMeasurements = ['Chest', 'Waist', 'Hips', 'Legs'];
    requiredMeasurements.forEach(required => {
      if (!summary.some(item => item.label === required)) {
        summary.push({ label: required, value: '--' });
      }
    });

    // Limit to 4 items for display
    return summary.slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-white p-0">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <MeasurementTopNav 
        title="Current body measurement"
        measurements={getSummaryMeasurements()}
      />

      <div 
        className="absolute"
        style={{
          width: '958px',
          top: '271px',
          left: '401px'
        }}
      >
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="manrope flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Measurements
          </button>
          
          <h1 className="manrope text-3xl font-semibold text-gray-800">
            Measurement Details
          </h1>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="manrope text-gray-500 mt-4">Loading measurement details...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="manrope text-red-500">Failed to load measurement details</p>
          </div>
        ) : !measurement ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="manrope text-gray-500">Measurement not found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Measurement Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="manrope text-sm text-gray-500">Name</p>
                  <p className="manrope text-lg font-medium text-gray-900">
                    {measurement.firstName} {measurement.lastName}
                  </p>
                </div>
                <div>
                  <p className="manrope text-sm text-gray-500">Date</p>
                  <p className="manrope text-lg font-medium text-gray-900">
                    {new Date(measurement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="manrope text-sm text-gray-500">Type</p>
                  <p className="manrope text-lg font-medium text-gray-900">
                    {measurement.measurementType}
                  </p>
                </div>
                <div>
                  <p className="manrope text-sm text-gray-500">Subject</p>
                  <p className="manrope text-lg font-medium text-gray-900">
                    {measurement.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* Sections and Measurements */}
            <div className="space-y-6">
              <h2 className="manrope text-xl font-semibold text-gray-800">
                Measurements by Section
              </h2>
              
              {measurement.sections && measurement.sections.length > 0 ? (
                measurement.sections.map((section: MeasurementSection, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="manrope text-lg font-medium text-gray-800 mb-4">
                      {section.sectionName}
                    </h3>
                    
                    {section.measurements && section.measurements.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="manrope px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Body Part
                              </th>
                              <th className="manrope px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Size (cm)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {section.measurements.map((m: MeasurementData, mIndex: number) => (
                              <tr key={mIndex} className="hover:bg-gray-50">
                                <td className="manrope px-4 py-3 text-sm text-gray-900">
                                  {m.bodyPartName}
                                </td>
                                <td className="manrope px-4 py-3 text-sm text-gray-900 font-medium">
                                  {m.size}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="manrope text-sm text-gray-500">No measurements in this section</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="manrope text-gray-500">No sections found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeasurementDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <MeasurementDetailContent />
    </Suspense>
  );
}