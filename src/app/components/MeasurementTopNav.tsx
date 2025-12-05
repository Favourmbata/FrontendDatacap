


'use client';

import React from 'react';
import Image from 'next/image';
import { UserTopBar } from './user-topbar';

interface MeasurementData {
  chest: string;
  waist: string;
  hips: string;
  legs: string;
}

interface MeasurementTopNavProps {
  measurements?: MeasurementData;
  title?: string;
}

export const MeasurementTopNav: React.FC<MeasurementTopNavProps> = ({ 
  measurements = {
    chest: '8cm',
    waist: '10cm', 
    hips: '35cm',
    legs: '35cm'
  },
  title = 'Current body measurement'
}) => {
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
            <button className="measurement-item manrope text-sm text-gray-600 hover:text-purple-700">
              <span className="font-medium">{measurements.chest}</span>
              <span className="text-xs md:text-sm">Chest</span>
            </button>
            <button className="measurement-item manrope text-sm text-gray-600 hover:text-purple-700">
              <span className="font-medium">{measurements.waist}</span>
              <span className="text-xs md:text-sm">Waist</span>
            </button>
            <button className="measurement-item manrope text-sm text-gray-600 hover:text-purple-700">
              <span className="font-medium">{measurements.hips}</span>
              <span className="text-xs md:text-sm">Hips</span>
            </button>
            <button className="measurement-item manrope text-sm text-gray-600 hover:text-purple-700">
              <span className="font-medium">{measurements.legs}</span>
              <span className="text-xs md:text-sm">Legs</span>
            </button>
            <button 
              className="measurement-item manrope text-sm text-purple-700 font-medium col-span-2 sm:col-span-1"
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
          </div>
        </div>
      </div>
    </>
  );
};

