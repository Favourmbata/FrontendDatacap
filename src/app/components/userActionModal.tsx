
'use client';

import React, { useState } from 'react';
import { Eye, Edit, Clock, Key, Trash2, UserCheck, UserX, Archive } from 'lucide-react';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewUser: () => void;
  onEditUser: () => void;
  onPendingUser?: () => void; 
  onOneTimeCode: () => void;
  onDelete: () => void;
  onChangePassword?: () => void;
  onStatusChange?: (newStatus: 'pending' | 'active' | 'disabled' | 'archived') => void;
  onGenerateCustomId?: () => void;
  position: { top: number; left: number };
}

const UserActionModal: React.FC<UserActionModalProps> = ({
  isOpen,
  onClose,
  onViewUser,
  onEditUser,
  onDelete,
  onStatusChange,
  position
}) => {
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: 'pending' | 'active' | 'disabled' | 'archived') => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    onClose();
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

     
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-30 md:bg-transparent" 
        onClick={onClose}
      />
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-50 p-6 shadow-2xl">
        <div className="flex flex-col gap-4">
          
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              onViewUser();
              onClose();
            }}
          >
            
            View User
          </button>
          
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
            onClick={(e) => {
              e.stopPropagation();
              onEditUser();
              onClose();
            }}
          >
            
            Edit User
          </button>
          
         
          
          
          
          <button 
            className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#FF6161] flex items-center gap-3"
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

     
      <div 
        className="hidden md:block fixed bg-white shadow-lg rounded-lg z-50"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '180px',
          borderRadius: '12px',
          padding: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
            onClick={(e) => {
              e.stopPropagation();
              onViewUser();
              onClose();
            }}
          >
            
            View User
          </button>
          
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
            onClick={(e) => {
              e.stopPropagation();
              onEditUser();
              onClose();
            }}
          >
            
            Edit User
          </button>
        
          
          <button 
            className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#FF6161] w-full"
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

export default UserActionModal;