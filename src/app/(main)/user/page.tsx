'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ActionModal from '@/app/components/ActionModal';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useProfile } from '@/api/hooks/useProfile';

const Page = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const { profile } = useProfile();

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows(prev => 
      prev.includes(rowIndex) 
        ? prev.filter(i => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const toggleDropdown = (rowIndex: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + 5,
      left: rect.left - 100 // Position modal to the left of the button
    });
    setDropdownOpen(dropdownOpen === rowIndex ? null : rowIndex);
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const handleViewMeasurement = () => {
    console.log('View Measurement clicked');
  };

  const handleEditMeasurement = () => {
    console.log('Edit Measurement clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    if (dropdownOpen !== null) {
      closeDropdown();
    }
  };

  const measurements = [
    { name: 'Emmanuel', type: 'Body', color: '#5D2A8B', measurements: [35, 35, 35, 35] },
    { name: 'Tobi Wale', type: 'Body', color: '#5D2A8B', measurements: [21, 21, 21, 21] },
    { name: 'Ada Uzo', type: 'Body', color: '#5D2A8B', measurements: [34, 34, 34, 34] },
    { name: 'Dispatch', type: 'Object', color: '#F59E0B', measurements: [20, 20, 20, 20] },
    { name: 'My Box', type: 'Object', color: '#F59E0B', measurements: [10, 10, 10, 10] },
    { name: 'Favour Alo', type: 'Body', color: '#5D2A8B', measurements: [54, 54, 54, 54] }
  ];

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
          <button className="flex items-center gap-1 text-[#5D2A8B]">
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
      <div className="hidden md:block">
        <MeasurementTopNav />
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
                08
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
            <button className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" style={{ background: '#FFFFFF80', color: '#5D2A8B' }}>
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
                --
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
            <button className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" style={{ background: '#FFFFFF80', color: '#5D2A8B' }}>
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
                08
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
            <button className="manrope absolute bottom-4 right-4 px-3 py-1.5 rounded-[20px] text-xs" style={{ background: '#FFFFFF80', color: '#5D2A8B' }}>
              Create New
            </button>
          </div>
        </div>
      </div>

      {/* Total Summary Section - Responsive */}
      <div className="mx-4 mt-6 mb-20 md:mb-6 bg-white shadow-sm rounded-[20px] p-4 md:p-6 md:absolute md:w-[958px] md:top-[596px] md:left-[401px] md:mx-0">
        {/* Total Summary and Export Container */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Total Summary Text */}
          <h2 className="manrope text-xl md:text-[26px] font-semibold leading-tight text-[#1A1A1A]">
            Total Summary
          </h2>

          {/* Export Button */}
          <button className="manrope flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-[#E4D8F3] bg-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83333 8.33333L10 12.5L14.1667 8.33333" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 12.5V2.5" stroke="#6E6E6EB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="manrope text-sm md:text-base font-medium text-[#6E6E6EB2]">
              Export
            </span>
          </button>
        </div>

        {/* Mobile Table Layout - Hidden on Desktop - With Scroll */}
        <div className="md:hidden overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4D8F3]">
                <th className="manrope text-left text-xs font-medium text-[#6E6E6EB2] py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5"></div>
                    Name
                  </div>
                </th>
                <th className="manrope text-left text-xs font-medium text-[#6E6E6EB2] py-3 px-2">
                  Measurement<br/>Type
                </th>
                <th className="manrope text-right text-xs font-medium text-[#6E6E6EB2] py-3 px-2">
                  <div className="flex items-center justify-end gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="7" stroke="#6E6E6E" strokeWidth="1"/>
                      <circle cx="8" cy="5" r="0.5" fill="#6E6E6E"/>
                      <circle cx="8" cy="8" r="0.5" fill="#6E6E6E"/>
                      <circle cx="8" cy="11" r="0.5" fill="#6E6E6E"/>
                    </svg>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((row, index) => (
                <tr 
                  key={index}
                  className="border-b border-[#E4D8F3]"
                  style={{
                    backgroundColor: selectedRows.includes(index) ? '#F4EFFA' : 'white'
                  }}
                >
                  {/* Checkbox and Name */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="cursor-pointer w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: '#6E6E6E33',
                          background: selectedRows.includes(index) ? '#5D2A8B' : 'white'
                        }}
                        onClick={() => toggleRowSelection(index)}
                      >
                        {selectedRows.includes(index) && (
                          <svg width="12" height="9" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="manrope text-sm text-[#1A1A1A]">{row.name}</span>
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="py-3 px-2">
                    <span className="manrope text-sm font-medium" style={{ color: row.color }}>
                      {row.type}
                    </span>
                  </td>
                  
                  {/* Measurement Value */}
                  <td className="py-3 px-2 text-right">
                    <span className="manrope text-sm text-[#1A1A1A]">{row.measurements[0]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop Table Layout - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[60px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3]">
                  {/* Checkbox header */}
                </th>
                <th className="manrope text-left w-[132px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  Name
                </th>
                <th className="manrope text-left w-[131px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  Measurement Type
                </th>
                <th className="manrope text-left w-[132px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  Chest/ length (cm)
                </th>
                <th className="manrope text-left w-[132px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  Waist/ width (cm)
                </th>
                <th className="manrope text-left w-[131px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  Hips/ Height (cm)
                </th>
                <th className="manrope text-left w-[131px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3] font-medium text-sm text-[#6E6E6EB2]">
                  legs (cm)
                </th>
                <th className="w-[131px] h-[54px] px-2.5 py-4 border-b border-[#E4D8F3]">
                  ...
                </th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((row, index) => (
                <tr 
                  key={index}
                  style={{
                    backgroundColor: selectedRows.includes(index) ? '#F4EFFA' : 'transparent'
                  }}
                >
                  {/* Checkbox */}
                  <td className="px-2.5 py-4 border-b border-[#E4D8F3] relative">
                    <div 
                      className="relative cursor-pointer w-[25px] h-[25px] ml-4 mt-2.5 rounded border flex items-center justify-center"
                      style={{
                        borderColor: '#6E6E6E33',
                        background: selectedRows.includes(index) ? '#5D2A8B' : 'white'
                      }}
                      onClick={() => toggleRowSelection(index)}
                    >
                      {selectedRows.includes(index) && (
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="manrope px-2.5 py-4 border-b border-[#E4D8F3] text-sm text-[#1A1A1A]">
                    {row.name}
                  </td>
                  
                  {/* Type */}
                  <td className="manrope px-2.5 py-4 border-b border-[#E4D8F3] text-sm" style={{ color: row.color }}>
                    {row.type}
                  </td>
                  
                  {/* Measurements */}
                  {row.measurements.map((measurement, i) => (
                    <td key={i} className="manrope px-2.5 py-4 border-b border-[#E4D8F3] text-sm text-[#1A1A1A]">
                      {measurement}
                    </td>
                  ))}
                  
                  {/* Actions */}
                  <td className="px-2.5 py-4 border-b border-[#E4D8F3] text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index, e);
                      }}
                      className="cursor-pointer"
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
