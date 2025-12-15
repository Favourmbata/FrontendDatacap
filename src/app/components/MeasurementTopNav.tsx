'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserTopBar } from './user-topbar';

// Updated interface to handle dynamic measurements
interface MeasurementItem {
  label: string;
  value: string;
}

// Backward compatible interface
interface LegacyMeasurementData {
  chest: string;
  waist: string;
  hips: string;
  legs: string;
}

interface MeasurementTopNavProps {
  measurements?: MeasurementItem[] | LegacyMeasurementData;
  title?: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

export const MeasurementTopNav: React.FC<MeasurementTopNavProps> = ({ 
  measurements,
  title = 'Current body measurement',
  onSearch,
  searchTerm = ''
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Helper function to convert legacy data to new format
  const convertToMeasurementItems = (measurements: MeasurementItem[] | LegacyMeasurementData | undefined): MeasurementItem[] => {
    // Check if it's the new format
    if (!measurements) {
      return [];
    }
    
    // If it's already an array, it's the new format
    if (Array.isArray(measurements)) {
      return measurements as MeasurementItem[];
    }
    
    // Convert legacy format to new format
    const legacy = measurements as LegacyMeasurementData;
    return [
      { label: 'Chest', value: legacy.chest || '--' },
      { label: 'Waist', value: legacy.waist || '--' },
      { label: 'Hips', value: legacy.hips || '--' },
      { label: 'Legs', value: legacy.legs || '--' }
    ];
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleCopyMeasurements = () => {
    const measurementItems = convertToMeasurementItems(measurements);
    if (measurementItems && measurementItems.length > 0) {
      const textToCopy = measurementItems.map(item => `${item.label}: ${item.value}`).join('\n');
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Measurements copied to clipboard');
          // Optionally show a toast notification here
        })
        .catch(err => {
          console.error('Failed to copy measurements: ', err);
        });
    }
  };

  // Default measurements if none provided
  const defaultMeasurements: MeasurementItem[] = [
    { label: 'Chest', value: '--' },
    { label: 'Waist', value: '--' },
    { label: 'Hips', value: '--' },
    { label: 'Legs', value: '--' }
  ];

  const displayMeasurements = convertToMeasurementItems(measurements);
  if (displayMeasurements.length === 0) {
    displayMeasurements.push(...defaultMeasurements);
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Mobile-first responsive design */
        .measurement-card {
          position: relative;
          width: 100%;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 16px;
          z-index: 20;
        }
        
        @media (min-width: 768px) {
          .measurement-card {
            position: absolute;
            width: 958px;
            height: 129px;
            top: 80px;
            left: 401px;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin: 0;
          }
        }
        
        .measurement-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        @media (min-width: 640px) {
          .measurement-grid {
            display: flex;
            gap: 16px;
          }
        }
        
        .measurement-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        
        .measurement-item:hover {
          background-color: #f9fafb;
        }
        
        @media (min-width: 640px) {
          .measurement-item {
            padding: 0;
          }
        }
        
        .search-container {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
        }
        
        .search-input {
          padding: 8px 12px 8px 32px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          width: 180px;
        }
        
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
        }
      `}</style>

      {/* User TopBar - Hidden on mobile measurement creation */}
      <div className="hidden md:block">
        <UserTopBar />
      </div>

      <div className="measurement-card">
        <div className="flex flex-col justify-center h-full">
          {/* Current Body Measurement Label */}
          <div className="manrope text-xs md:text-sm text-gray-400 mb-2 md:mb-3">{title}</div>
          
          {/* Measurement Grid */}
          <div className="measurement-grid">
            {displayMeasurements.map((item, index) => (
              <button 
                key={index} 
                className={`measurement-item manrope text-sm text-gray-600 hover:text-purple-700 ${
                  item.label === 'Copy' ? 'text-purple-700 font-medium col-span-2 sm:col-span-1' : ''
                }`}
                onClick={item.label === 'Copy' ? handleCopyMeasurements : undefined}
              >
                {item.label === 'Copy' ? (
                  <>
                    <Image 
                      src="/Copy Streamline Bootstrap.png" 
                      alt="Copy" 
                      width={16} 
                      height={16}
                      className="object-contain mb-1"
                    />
                    <span className="text-xs md:text-sm">{item.value}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">{item.value}</span>
                    <span className="text-xs md:text-sm">{item.label}</span>
                  </>
                )}
              </button>
            ))}
            
            {/* Add Copy button if not already in measurements */}
            {!displayMeasurements.some(item => item.label === 'Copy') && (
              <button 
                className="measurement-item manrope text-sm text-purple-700 font-medium col-span-2 sm:col-span-1"
                onClick={handleCopyMeasurements}
              >
                <Image 
                  src="/Copy Streamline Bootstrap.png" 
                  alt="Copy" 
                  width={16} 
                  height={16}
                  className="object-contain mb-1"
                />
                <span className="text-xs md:text-sm">Copy</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Search Input - Only show on desktop */}
        {onSearch && (
          <div className="search-container hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="search-input manrope"
                value={localSearchTerm}
                onChange={handleSearchChange}
              />
              <svg 
                className="search-icon" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.5 14.5L11.5 11.5M12.5 7.5C12.5 10.2614 10.2614 12.5 7.5 12.5C4.73858 12.5 2.5 10.2614 2.5 7.5C2.5 4.73858 4.73858 2.5 7.5 2.5C10.2614 2.5 12.5 4.73858 12.5 7.5Z" stroke="#6E6E6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
};