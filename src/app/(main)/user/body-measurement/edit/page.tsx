'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useManualMeasurement, useUpdateManualMeasurement } from '@/api/hooks/useManualMeasurement';
import { ArrowLeft, Save } from 'lucide-react';

// Separate component for the main content that uses useSearchParams
const EditMeasurementContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const { data: measurement, isLoading, error } = useManualMeasurement(id);
  const { mutate: updateMeasurement, isPending } = useUpdateManualMeasurement();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    measurementType: '',
    subject: ''
  });
  
  const [sections, setSections] = useState<any[]>([]);

  // Load measurement data when it's available
  useEffect(() => {
    if (measurement) {
      setFormData({
        firstName: measurement.firstName || '',
        lastName: measurement.lastName || '',
        measurementType: measurement.measurementType || '',
        subject: measurement.subject || ''
      });
      setSections(measurement.sections || []);
    }
  }, [measurement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!id) return;
    
    updateMeasurement(
      { id, ...formData, sections },
      {
        onSuccess: () => {
          router.push(`/user/body-measurement/view?id=${id}`);
        },
        onError: (err) => {
          console.error('Failed to update measurement:', err);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !measurement) {
    return (
      <div className="min-h-screen bg-white p-4">
        <MeasurementTopNav />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-500">Failed to load measurement data</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-0">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <MeasurementTopNav />

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
          
          <div className="flex justify-between items-center">
            <h1 className="manrope text-3xl font-semibold text-gray-800">
              Edit Measurement
            </h1>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="manrope flex items-center gap-2 bg-[#5D2A8B] text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Basic Information */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="manrope text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="manrope block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="manrope w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="manrope block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="manrope w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="manrope block text-sm font-medium text-gray-700 mb-1">
                  Measurement Type
                </label>
                <input
                  type="text"
                  name="measurementType"
                  value={formData.measurementType}
                  onChange={handleInputChange}
                  className="manrope w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="manrope block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="manrope w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Sections and Measurements */}
          <div className="space-y-6">
            <h2 className="manrope text-xl font-semibold text-gray-800">
              Measurements by Section
            </h2>
            
            {sections && sections.length > 0 ? (
              sections.map((section: any, index: number) => (
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
                          {section.measurements.map((m: any, mIndex: number) => (
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
      </div>
    </div>
  );
};

// Main component wrapped in Suspense
const EditMeasurementPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <EditMeasurementContent />
    </Suspense>
  );
};

export default EditMeasurementPage;