

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useManualMeasurement, useUpdateManualMeasurement, MeasurementSection, MeasurementData, Measurement } from '@/api/hooks/useManualMeasurement';
import { ArrowLeft, Save, Upload, Plus, Trash2 } from 'lucide-react';

interface MeasurementDataSummary {
  chest: string;
  waist: string;
  hips: string;
  legs: string;
}

// Add image state to the component
interface MeasurementWithImages extends Measurement {
  frontImage?: string;
  sideImage?: string;
}

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
  
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [sideImagePreview, setSideImagePreview] = useState<string | null>(null);
  
  const addSection = () => {
    const newSection = {
      sectionName: '',
      measurements: [{ bodyPartName: '', size: '' }]
    };
    setSections([...sections, newSection]);
  };
  
  const removeSection = (index: number) => {
    if (sections.length <= 1) return; // Prevent removing the last section
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };
  
  const addField = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].measurements.push({ bodyPartName: '', size: '' });
    setSections(newSections);
  };
  
  const removeField = (sectionIndex: number, fieldIndex: number) => {
    if (sections[sectionIndex].measurements.length <= 1) return; // Prevent removing the last field in a section
    const newSections = [...sections];
    newSections[sectionIndex].measurements.splice(fieldIndex, 1);
    setSections(newSections);
  };
  
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
      
      // Set image previews if they exist
      if ('frontImageUrl' in measurement && measurement.frontImageUrl) {
        setFrontImagePreview(measurement.frontImageUrl);
      }
      if ('sideImageUrl' in measurement && measurement.sideImageUrl) {
        setSideImagePreview(measurement.sideImageUrl);
      }
    }
  }, [measurement]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      // In a real implementation, we would show an error message
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      // In a real implementation, we would show an error message
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageData = event.target.result as string;
        if (type === 'front') {
          setFrontImagePreview(imageData);
        } else {
          setSideImagePreview(imageData);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!id) return;
    
    // Prepare data with images
    const updateData = {
      ...formData,
      sections,
      // Include image data if available
      ...(frontImagePreview && { frontImageUrl: frontImagePreview }),
      ...(sideImagePreview && { sideImageUrl: sideImagePreview })
    };
    
    updateMeasurement(
      { id, ...updateData },
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
        <MeasurementTopNav 
          title="Current body measurement"
          measurements={getSummaryMeasurements()}
        />
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

      <MeasurementTopNav 
        title="Current body measurement"
        measurements={getSummaryMeasurements()}
      />

      <div className="px-4 md:px-0">
        {/* Mobile layout: full width, responsive padding */}
        <div className="w-full mt-4 md:hidden">
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Images Preview Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="manrope text-xl font-semibold text-gray-800 mb-4">
                Uploaded Images
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="manrope text-sm text-gray-500 mb-2">Front View</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'front')}
                      className="hidden"
                      id="edit-front-image"
                    />
                    <label htmlFor="edit-front-image" className="cursor-pointer">
                      {frontImagePreview ? (
                        <img 
                          src={frontImagePreview} 
                          alt="Front view" 
                          className="w-full h-auto max-h-48 object-contain rounded"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="manrope text-sm text-gray-500">
                            Upload front view
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="manrope text-sm text-gray-500 mb-2">Side View</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'side')}
                      className="hidden"
                      id="edit-side-image"
                    />
                    <label htmlFor="edit-side-image" className="cursor-pointer">
                      {sideImagePreview ? (
                        <img 
                          src={sideImagePreview} 
                          alt="Side view" 
                          className="w-full h-auto max-h-48 object-contain rounded"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="manrope text-sm text-gray-500">
                            Upload side view
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Basic Information */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="manrope text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
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
              
              <div className="space-y-6">
                {sections && sections.length > 0 ? (
                  sections.map((section: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={section.sectionName}
                          onChange={(e) => {
                            const updatedSections = [...sections];
                            updatedSections[index].sectionName = e.target.value;
                            setSections(updatedSections);
                          }}
                          placeholder="Section Name (e.g., Upper Body)"
                          className="manrope px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium w-full"
                        />
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Remove section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
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
                                <th className="manrope px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {section.measurements.map((m: any, mIndex: number) => (
                                <tr key={mIndex} className="hover:bg-gray-50">
                                  <td className="manrope px-4 py-3 text-sm">
                                    <input
                                      type="text"
                                      value={m.bodyPartName}
                                      onChange={(e) => {
                                        const updatedSections = [...sections];
                                        updatedSections[index].measurements[mIndex].bodyPartName = e.target.value;
                                        setSections(updatedSections);
                                      }}
                                      placeholder="Measurement Name"
                                      className="manrope w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                  </td>
                                  <td className="manrope px-4 py-3 text-sm">
                                    <input
                                      type="number"
                                      value={m.size}
                                      onChange={(e) => {
                                        const updatedSections = [...sections];
                                        updatedSections[index].measurements[mIndex].size = e.target.value;
                                        setSections(updatedSections);
                                      }}
                                      placeholder="Value"
                                      className="manrope w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                  </td>
                                  <td className="manrope px-4 py-3 text-sm">
                                    {section.measurements.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeField(index, mIndex)}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                        title="Remove field"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="manrope text-sm text-gray-500 mb-4">No measurements in this section</p>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => addField(index)}
                        className="manrope text-[#5D2A8B] text-sm font-medium flex items-center gap-1 hover:text-purple-700 px-3 py-1 hover:bg-purple-50 rounded-lg mt-3"
                      >
                        <Plus className="w-4 h-4" />
                        Add Field
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="manrope text-gray-500">No sections found</p>
                )}
                
                <button
                  type="button"
                  onClick={addSection}
                  className="manrope w-full text-[#5D2A8B] text-sm font-medium flex items-center justify-center gap-1 hover:text-purple-700 border border-[#5D2A8B] rounded-lg px-4 py-2 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
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
        </div>

        {/* Desktop layout: positioned absolutely */}
        <div 
          className="hidden md:block absolute"
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Images Preview Section - Added */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="manrope text-xl font-semibold text-gray-800 mb-4">
                Uploaded Images
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="manrope text-sm text-gray-500 mb-2">Front View</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'front')}
                      className="hidden"
                      id="edit-front-image-desktop"
                    />
                    <label htmlFor="edit-front-image-desktop" className="cursor-pointer">
                      {frontImagePreview ? (
                        <img 
                          src={frontImagePreview} 
                          alt="Front view" 
                          className="w-full h-auto max-h-48 object-contain rounded"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="manrope text-sm text-gray-500">
                            Upload front view
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="manrope text-sm text-gray-500 mb-2">Side View</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'side')}
                      className="hidden"
                      id="edit-side-image-desktop"
                    />
                    <label htmlFor="edit-side-image-desktop" className="cursor-pointer">
                      {sideImagePreview ? (
                        <img 
                          src={sideImagePreview} 
                          alt="Side view" 
                          className="w-full h-auto max-h-48 object-contain rounded"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <p className="manrope text-sm text-gray-500">
                            Upload side view
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
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
              
              <div className="space-y-6">
                {sections && sections.length > 0 ? (
                  sections.map((section: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={section.sectionName}
                          onChange={(e) => {
                            const updatedSections = [...sections];
                            updatedSections[index].sectionName = e.target.value;
                            setSections(updatedSections);
                          }}
                          placeholder="Section Name (e.g., Upper Body)"
                          className="manrope px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-medium w-full max-w-xs"
                        />
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Remove section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
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
                                <th className="manrope px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {section.measurements.map((m: any, mIndex: number) => (
                                <tr key={mIndex} className="hover:bg-gray-50">
                                  <td className="manrope px-4 py-3 text-sm">
                                    <input
                                      type="text"
                                      value={m.bodyPartName}
                                      onChange={(e) => {
                                        const updatedSections = [...sections];
                                        updatedSections[index].measurements[mIndex].bodyPartName = e.target.value;
                                        setSections(updatedSections);
                                      }}
                                      placeholder="Measurement Name (e.g., Chest)"
                                      className="manrope w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                  </td>
                                  <td className="manrope px-4 py-3 text-sm">
                                    <input
                                      type="number"
                                      value={m.size}
                                      onChange={(e) => {
                                        const updatedSections = [...sections];
                                        updatedSections[index].measurements[mIndex].size = e.target.value;
                                        setSections(updatedSections);
                                      }}
                                      placeholder="Value (e.g., 92)"
                                      className="manrope w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                  </td>
                                  <td className="manrope px-4 py-3 text-sm">
                                    {section.measurements.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeField(index, mIndex)}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                        title="Remove field"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="manrope text-sm text-gray-500 mb-4">No measurements in this section</p>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => addField(index)}
                        className="manrope text-[#5D2A8B] text-sm font-medium flex items-center gap-1 hover:text-purple-700 px-3 py-1 hover:bg-purple-50 rounded-lg mt-3"
                      >
                        <Plus className="w-4 h-4" />
                        Add Field
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="manrope text-gray-500">No sections found</p>
                )}
                
                <button
                  type="button"
                  onClick={addSection}
                  className="manrope w-full text-[#5D2A8B] text-sm font-medium flex items-center justify-center gap-1 hover:text-purple-700 border border-[#5D2A8B] rounded-lg px-4 py-2 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
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
        </div>
      </div>
    </div>
  );
};

export default function EditMeasurementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <EditMeasurementContent />
    </Suspense>
  );
}