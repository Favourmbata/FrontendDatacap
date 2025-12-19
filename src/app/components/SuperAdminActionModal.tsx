"use client";

import React from 'react';
import { Edit, Trash2, Eye, X } from 'lucide-react';

interface SuperAdminActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  itemName: string;
  position?: { top: number; left: number };
}

export const SuperAdminActionModal: React.FC<SuperAdminActionModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onView,
  itemName,
  position
}) => {
  if (!isOpen) return null;

  // If position is provided, render as a positioned dropdown
  if (position) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:bg-transparent" 
          onClick={onClose}
        />
        
        {/* Positioned Modal */}
        <div 
          className="fixed bg-white shadow-lg rounded-lg z-50"
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
                onView();
                onClose();
              }}
            >
              <Eye className="w-4 h-4 text-blue-500" />
              View Details
            </button>
            
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                onClose();
              }}
            >
              <Edit className="w-4 h-4 text-yellow-500" />
              Edit
            </button>
            
            <div className="border-t my-1"></div>
            
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#FF6161] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              Delete
            </button>
          </div>
        </div>
      </>
    );
  }

  // Default centered modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Actions for {itemName}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onView}
              className="flex items-center w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-5 h-5 text-blue-500 mr-3" />
              <span className="font-medium">View Details</span>
            </button>
            
            <button
              onClick={onEdit}
              className="flex items-center w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit className="w-5 h-5 text-yellow-500 mr-3" />
              <span className="font-medium">Edit</span>
            </button>
            
            <button
              onClick={onDelete}
              className="flex items-center w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500 mr-3" />
              <span className="font-medium">Delete</span>
            </button>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};