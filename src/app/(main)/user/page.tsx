'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ActionModal from '@/app/components/ActionModal';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useProfile } from '@/api/hooks/useProfile';
import { useManualMeasurements } from '@/api/hooks/useManualMeasurement';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Page = () => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null);
  const { profile } = useProfile();
  const { data: measurementsData, isLoading, error } = useManualMeasurements();

  const handleCreateNew = (type: string) => {
    switch(type) {
      case 'body':
        router.push('/user/body-measurement/create');
        break;
      case 'object':
        router.push('/user/object-dimension/create');
        break;
      case 'questionnaire':
        router.push('/user/questionaire/create');
        break;
      default:
        break;
    }
  };

  const handleCopyMeasurements = () => {
    // TODO: Implement copy functionality
    console.log('Copy measurements clicked');
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // Use all measurements for export, not just filtered ones
    const allMeasurements = measurements.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      measurements: item.measurements
    }));

    if (format === 'excel') {
      // Export to Excel
      const worksheet = XLSX.utils.json_to_sheet(allMeasurements.map((item: any) => ({
        Name: item.name,
        Type: item.type,
        Measurements: item.measurements.join(', ')
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Measurements');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'measurements.xlsx');
    } else {
      // Export to PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Measurements Report', 14, 22);
      
      // Add table
      (doc as any).autoTable({
        head: [['Name', 'Type', 'Measurements']],
        body: allMeasurements.map((item: any) => [
          item.name,
          item.type,
          item.measurements.join(', ')
        ]),
        startY: 30,
      });
      
      doc.save('measurements.pdf');
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows(prev => 
      prev.includes(rowIndex) 
        ? prev.filter(i => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const toggleDropdown = (rowIndex: number, measurementId: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 100 // Position modal to the left of the button
    });
    setSelectedMeasurementId(measurementId);
    setDropdownOpen(dropdownOpen === rowIndex ? null : rowIndex);
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const handleViewMeasurement = () => {
    if (selectedMeasurementId) {
      router.push(`/user/body-measurement/view?id=${selectedMeasurementId}`);
    }
  };

  const handleEditMeasurement = () => {
    if (selectedMeasurementId) {
      router.push(`/user/body-measurement/edit?id=${selectedMeasurementId}`);
    }
  };

  const handleDelete = () => {
    if (selectedMeasurementId) {
      console.log('Delete clicked for ID:', selectedMeasurementId);
      // TODO: Implement delete functionality
    }
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    if (dropdownOpen !== null) {
      closeDropdown();
    }
  };

  // Transform the fetched data to match the existing structure
  const measurements = measurementsData?.map((item: any, index: number) => {
    // Determine the type based on measurementType
    let type = item.measurementType || 'Manual'; // Default to Manual
    let color = '#5D2A8B'; // Default purple for Manual
    
    // Set color based on type
    if (type === 'Object') {
      color = '#F59E0B'; // Yellow for Object
    } else if (type === 'Questionnaire') {
      color = '#EF4444'; // Red for Questionnaire
    } else if (type === 'AI') {
      color = '#3B82F6'; // Blue for AI
    }
    
    return {
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      type: type,
      color: color,
      measurements: item.sections.flatMap((section: any) => 
        section.measurements.map((m: any) => m.size)
      ).slice(0, 4), // Take only first 4 measurements to match UI
      sections: item.sections, // Keep the sections data for table headers
      createdAt: item.createdAt
    };
  }) || [];

  // Get unique section names for table headers
  const getUniqueSectionNames = () => {
    const sectionNames = new Set<string>();
    
    measurementsData?.forEach((item: any) => {
      item.sections?.forEach((section: any) => {
        sectionNames.add(section.sectionName);
      });
    });
    
    return Array.from(sectionNames);
  };

  // Get measurements for a specific section (only sizes)
  const getMeasurementsForSection = (item: any, sectionName: string) => {
    const section = item.sections?.find((s: any) => s.sectionName === sectionName);
    if (section && section.measurements && section.measurements.length > 0) {
      // Return only the sizes, not the body part names
      return section.measurements.map((m: any) => `${m.size}`).join(', ');
    }
    return '--';
  };

  // Get the latest measurement for the top nav
  const latestMeasurement = measurementsData && measurementsData.length > 0 ? measurementsData[0] : null;

  // Extract measurements for the MeasurementTopNav component
  const getSummaryMeasurements = () => {
    if (!latestMeasurement) {
      return [
        { label: 'Chest', value: '--' },
        { label: 'Waist', value: '--' },
        { label: 'Hips', value: '--' },
        { label: 'Legs', value: '--' }
      ];
    }

    const summary: any[] = [];

    // Process all sections and their measurements
    latestMeasurement.sections?.forEach((section: any) => {
      section.measurements?.forEach((m: any) => {
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
    <div className="min-h-screen bg-white" onClick={handleOutsideClick}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Mobile Top Section - Only visible on mobile */}
      <div className="md:hidden px-4 pt-4 pb-2">
        {/* Hello User and Icons */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="manrope text-lg font-normal text-[#1A1A1A]">
            Hello, &ldquo;{profile?.fullName || 'User'}&ldquo;
          </h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-[#E4D8F3] bg-[#FBFAFC] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="#6E6E6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42112 18.2537 9.16813 18.1079C8.91514 17.9622 8.70484 17.7526 8.55835 17.5" stroke="#6E6E6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#6D1E1E] overflow-hidden">
              <Image 
                src="/Frame 1707479300.png" 
                alt="User Avatar" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Measurement Summary - Mobile Only */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="manrope text-xs text-[#6E6E6EB2]">Chest</span>
              <span className="manrope text-sm font-medium text-[#1A1A1A]">--</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="manrope text-xs text-[#6E6E6EB2]">Waist</span>
              <span className="manrope text-sm font-medium text-[#1A1A1A]">--</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="manrope text-xs text-[#6E6E6EB2]">Hips</span>
              <span className="manrope text-sm font-medium text-[#1A1A1A]">--</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="manrope text-xs text-[#6E6E6EB2]">Legs</span>
              <span className="manrope text-sm font-medium text-[#1A1A1A]">--</span>
            </div>
          </div>
          <button 
            className="flex items-center gap-1 text-[#5D2A8B]"
            onClick={handleCopyMeasurements}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3333 8.66667V13.3333C13.3333 13.6869 13.1929 14.0261 12.9428 14.2761C12.6928 14.5262 12.3536 14.6667 12 14.6667H2.66667C2.31304 14.6667 1.97391 14.5262 1.72386 14.2761C1.47381 14.0261 1.33333 13.6869 1.33333 13.3333V4C1.33333 3.64638 1.47381 3.30724 1.72386 3.05719C1.97391 2.80714 2.31304 2.66667 2.66667 2.66667H7.33333" stroke="#5D2A8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.3333 1.33333H14.6666V4.66667" stroke="#5D2A8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 9.33333L14.6667 1.33333" stroke="#5D2A8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="manrope text-xs font-medium">Copy</span>
          </button>
        </div>
      </div>

      {/* Top Navigation - Desktop Only */}
      <div className="hidden md:block mb-6">
        <MeasurementTopNav 
          title="Current body measurement"
          measurements={getSummaryMeasurements()}
        />
      </div>

      {/* Overview Section - Responsive */}
      <div className="px-4 pt-4 md:pt-0 md:absolute md:w-[958px] md:top-[271px] md:left-[401px]">
        <h2 className="manrope text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Overview</h2>

        {/* Three Cards Container - Responsive Grid */}
        <div className="flex flex-col gap-4 md:flex-row md:absolute md:top-[56px] md:gap-[53px] mt-4 md:mt-0">
          {/* Card 1 - Total Body Measurement - Responsive */}
          <div className="relative w-full md:w-[284px] h-[146px] rounded-[20px] p-6" style={{ background: '#F4EFFA' }}>
            <div className="flex flex-col gap-3">
              <span className="manrope text-sm md:text-base font-normal leading-tight" style={{ color: '#6E6E6EB2' }}>
                Total Body Measurement
              </span>
              <span className="manrope text-2xl font-medium leading-tight text-[#1A1A1A]">
                {measurements.filter((m: any) => m.type === 'Manual' || m.type === 'AI').length}
              </span>
            </div>

            {/* Card Image */}
            <div className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full flex items-center justify-center" style={{ background: '#FFFFFF80' }}>
              <Image 
                src="/Body Streamline Ionic Filled.png" 
                alt="Body" 
                width={20} 
                height={20}
                className="object-contain"
              />
            </div>

            {/* Create New Button */}
            <button 
              className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" 
              style={{ background: '#FFFFFF80', color: '#5D2A8B' }}
              onClick={() => handleCreateNew('body')}
            >
              Create New
            </button>
          </div>

          {/* Card 2 - Total Object Measurement - Responsive */}
          <div className="relative w-full md:w-[284px] h-[146px] rounded-[20px] p-6" style={{ background: '#FBF8EF' }}>
            <div className="flex flex-col gap-3">
              <span className="manrope text-sm md:text-base font-normal leading-tight" style={{ color: '#6E6E6EB2' }}>
                Total Object Measurement
              </span>
              <span className="manrope text-2xl font-medium leading-tight text-[#1A1A1A]">
                {measurements.filter((m: any) => m.type === 'Object').length}
              </span>
            </div>

            {/* Object Image */}
            <div className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full flex items-center justify-center" style={{ background: '#FFFFFF80' }}>
              <Image 
                src="/Object Scan Streamline Tabler Line.png" 
                alt="Object" 
                width={20} 
                height={20}
                className="object-contain"
              />
            </div>

            {/* Create New Button */}
            <button 
              className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" 
              style={{ background: '#FFFFFF80', color: '#5D2A8B' }}
              onClick={() => handleCreateNew('object')}
            >
              Create New
            </button>
          </div>

          {/* Card 3 - Total Questionnaire - Responsive */}
          <div className="relative w-full md:w-[284px] h-[146px] rounded-[20px] p-6" style={{ background: '#FCEEEE' }}>
            <div className="flex flex-col gap-3">
              <span className="manrope text-sm md:text-base font-normal leading-tight" style={{ color: '#6E6E6EB2' }}>
                Total Questionnaire
              </span>
              <span className="manrope text-2xl font-medium leading-tight text-[#1A1A1A]">
                {measurements.filter((m: any) => m.type === 'Questionnaire').length}
              </span>
            </div>

            {/* Image */}
            <div className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full flex items-center justify-center" style={{ background: '#FFFFFF80' }}>
              <Image 
                src="/List Dropdown Streamline Carbon.png" 
                alt="Questionnaire" 
                width={20} 
                height={20}
                className="object-contain"
              />
            </div>

            {/* Create New Button */}
            <button 
              className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" 
              style={{ background: '#FFFFFF80', color: '#5D2A8B' }}
              onClick={() => handleCreateNew('questionnaire')}
            >
              Create New
            </button>
          </div>
        </div>
      </div>

      {/* Total Summary Section - Responsive */}
      <div className="mx-4  mb-20 md:mb-6 bg-white shadow-sm rounded-[20px] p-4 md:p-6 md:absolute md:w-[958px] md:top-[596px] md:left-[401px] md:mx-0">
        {/* Total Summary and Export Container */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Total Summary Text */}
          <h2 className="manrope text-xl md:text-[26px] font-semibold leading-tight text-[#1A1A1A]">
            Total Summary
          </h2>

          {/* Export Options */}
          <div className="relative">
            <div className="flex gap-2">
              <button 
                className="manrope flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-[#E4D8F3] bg-white"
                onClick={() => handleExport('excel')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 8.33333L10 12.5L14.1667 8.33333" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12.5V2.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="manrope text-sm md:text-base font-medium text-[#6E6E6EB2]">
                  Excel
                </span>
              </button>
              {/* <button 
                className="manrope flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-[#E4D8F3] bg-white"
                onClick={() => handleExport('pdf')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 8.33333L10 12.5L14.1667 8.33333" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12.5V2.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="manrope text-sm md:text-base font-medium text-[#6E6E6EB2]">
                  PDF
                </span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Mobile Table Layout - Hidden on Desktop - With Scroll */}
        <div className="md:hidden">
          <div className="space-y-4">
            {measurements.map((row: any, index: number) => (
              <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="manrope font-semibold text-gray-900">
                      {row.name}
                    </h3>
                    <p className="manrope text-sm text-gray-500 mt-1">
                      {row.type}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {getUniqueSectionNames().slice(0, 4).map((sectionName, secIndex) => (
                    <div key={secIndex} className="flex justify-between items-center">
                      <span className="manrope text-sm text-gray-500">{sectionName}:</span>
                      <span className="manrope text-sm font-medium text-gray-900">
                        {getMeasurementsForSection(row, sectionName)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(index, row.id, e);
                    }}
                    className="manrope text-sm text-gray-500 hover:text-gray-700"
                  >
                    ...
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto ">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="manrope text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
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
              {measurements.map((row: any, index: number) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="manrope px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {row.name}
                    </div>
                  </td>
                  <td className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.type}
                  </td>
                  {/* Dynamic section measurements */}
                  {getUniqueSectionNames().slice(0, 4).map((sectionName, secIndex) => (
                    <td key={secIndex} className="manrope px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMeasurementsForSection(row, sectionName)}
                    </td>
                  ))}
                  <td className="manrope px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index, row.id, e);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={dropdownOpen !== null}
        onClose={closeDropdown}
        onViewMeasurement={handleViewMeasurement}
        onEditMeasurement={handleEditMeasurement}
        onDelete={handleDelete}
        position={modalPosition}
      />
    </div>
  );
};

export default Page;