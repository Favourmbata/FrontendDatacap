'use client';

import React from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewMeasurement: () => void;
  onEditMeasurement: () => void;
  onDelete: () => void;
  onCopyMeasurement?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onShareToOthers?: () => void;
  onShareToOrganization?: () => void;
  position: { top: number; left: number };
  windowHeight?: number;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onViewMeasurement,
  onEditMeasurement,
  onDelete,
  onCopyMeasurement,
  onShare,
  onShareToOthers,
  onShareToOrganization,
  position,
  windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
}) => {
  if (!isOpen) return null;

  // Calculate modal position based on button position to avoid going off-screen
  const modalTop = position.top > windowHeight / 2 
    ? position.top - 160 // Position above if button is in lower half of screen
    : position.top + 30;  // Position below if button is in upper half of screen

  const handleShare = () => {
    console.log('Share clicked');
    onClose();
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-30 md:bg-transparent" 
        onClick={onClose}
      />
      
      {/* Mobile Bottom Sheet - Only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-50 p-6 shadow-2xl max-h-[70vh] overflow-y-auto">
        <div className="flex flex-col gap-4">
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
            onClick={(e) => {
              e.stopPropagation();
              onViewMeasurement();
              onClose();
            }}
          >
            View Measurement
          </button>
          
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
            onClick={(e) => {
              e.stopPropagation();
              onEditMeasurement();
              onClose();
            }}
          >
            Edit Measurement
          </button>
          
          {onCopyMeasurement && (
            <button 
              className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
              onClick={(e) => {
                e.stopPropagation();
                onCopyMeasurement();
                onClose();
              }}
            >
              Copy Measurement
            </button>
          )}
          
          
          {onShareToOthers && onShareToOrganization && (
            <div className="relative" id="share-dropdown">
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = document.getElementById('share-dropdown');
                  const menu = dropdown?.querySelector('.share-menu');
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                Share
              </button>
              
              <div className="share-menu absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 hidden max-h-[200px] overflow-y-auto">
                <button 
                  className="manrope w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareToOthers();
                    onClose();
                  }}
                >
                  Share to others
                </button>
                <button 
                  className="manrope w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareToOrganization();
                    onClose();
                  }}
                >
                  Share to organization
                </button>
              </div>
            </div>
          )}
          
          {onShareToOthers && !onShareToOrganization && (
            <button 
              className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
              onClick={(e) => {
                e.stopPropagation();
                onShareToOthers();
                onClose();
              }}
            >
              Share to others
            </button>
          )}
          
          {!onShareToOthers && onShareToOrganization && (
            <button 
              className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
              onClick={(e) => {
                e.stopPropagation();
                onShareToOrganization();
                onClose();
              }}
            >
              Share to organization
            </button>
          )}
          
          {onShare && !(onShareToOthers || onShareToOrganization) && (
            <button 
              className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A]"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
                onClose();
              }}
            >
              Share
            </button>
          )}
          
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#FF6161]"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Desktop Modal - Only on desktop */}
      <div 
        className="hidden md:block fixed bg-white shadow-lg rounded-lg z-50"
        style={{
          top: `${modalTop}px`,
          left: `${position.left}px`,
          width: '155px',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: '0px 2px 8px 0px #5D2A8B1A',
          border: '1px solid #E4D8F3',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
            style={{
              fontSize: '14px',
              color: '#1A1A1A',
              border: 'none',
              background: 'none',
              width: '100%'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onViewMeasurement();
              onClose();
            }}
          >
            View Measurement
          </button>
          
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
            style={{
              fontSize: '14px',
              color: '#1A1A1A',
              border: 'none',
              background: 'none',
              width: '100%'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEditMeasurement();
              onClose();
            }}
          >
            Edit Measurement
          </button>
                    
          {onCopyMeasurement && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
              style={{
                fontSize: '14px',
                color: '#1A1A1A',
                border: 'none',
                background: 'none',
                width: '100%'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onCopyMeasurement();
                onClose();
              }}
            >
              Copy Measurement
            </button>
          )}
                    
         
                    
          {onShareToOthers && onShareToOrganization && (
            <div className="relative" id="share-dropdown-desktop">
              <button 
                className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
                style={{
                  fontSize: '14px',
                  color: '#1A1A1A',
                  border: 'none',
                  background: 'none',
                  width: '100%'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = document.getElementById('share-dropdown-desktop');
                  const menu = dropdown?.querySelector('.share-menu-desktop');
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                Share
              </button>
                         
              <div className="share-menu-desktop absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 hidden max-h-[200px] overflow-y-auto">
                <button 
                  className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
                  style={{
                    fontSize: '14px',
                    color: '#1A1A1A',
                    border: 'none',
                    background: 'none',
                    width: '100%'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareToOthers();
                    onClose();
                  }}
                >
                  Share to others
                </button>
                <button 
                  className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
                  style={{
                    fontSize: '14px',
                    color: '#1A1A1A',
                    border: 'none',
                    background: 'none',
                    width: '100%'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareToOrganization();
                    onClose();
                  }}
                >
                  Share to organization
                </button>
              </div>
            </div>
          )}
                    
          {onShareToOthers && !onShareToOrganization && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
              style={{
                fontSize: '14px',
                color: '#1A1A1A',
                border: 'none',
                background: 'none',
                width: '100%'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onShareToOthers();
                onClose();
              }}
            >
              Share to others
            </button>
          )}
                    
          {!onShareToOthers && onShareToOrganization && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
              style={{
                fontSize: '14px',
                color: '#1A1A1A',
                border: 'none',
                background: 'none',
                width: '100%'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onShareToOrganization();
                onClose();
              }}
            >
              Share to organization
            </button>
          )}
                    
          {onShare && !(onShareToOthers || onShareToOrganization) && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
              style={{
                fontSize: '14px',
                color: '#1A1A1A',
                border: 'none',
                background: 'none',
                width: '100%'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onShare();
                onClose();
              }}
            >
              Share
            </button>
          )}
                    
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors"
            style={{
              fontSize: '14px',
              color: '#FF6161',
              border: 'none',
              background: 'none',
              width: '100%'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionModal;