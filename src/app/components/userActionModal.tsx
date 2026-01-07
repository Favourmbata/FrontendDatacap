'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Clock, Key, Trash2, UserCheck, UserX, Archive, UserRoundCheck } from 'lucide-react';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewUser: () => void;
  onEditUser: () => void;
  onPendingUser?: () => void; 
  onOneTimeCode: () => void;
  onDelete: () => void;
  onChangePassword?: () => void;
  onStatusChange?: (newStatus: 'pending' | 'active'  | 'archived') => void;
  onGenerateCustomId?: () => void;
  onSendEmail?: () => void;
  onResetPassword?: () => void;
  onSetPending?: () => void;
  onArchiveUser?: () => void;
  onSendWelcomeEmail?: () => void;
  onSetActive?: () => void;
  onShareToOthers?: () => void;
  onShareToOrganization?: () => void;
  currentUserStatus?: 'pending' | 'active' | 'disabled' | 'archived';
 
  position: { top: number; left: number };
  windowHeight?: number;
}

const UserActionModal: React.FC<UserActionModalProps> = ({
  isOpen,
  onClose,
  onViewUser,
  onEditUser,
  onDelete,
  onStatusChange,
  onSendEmail,
  onResetPassword,
  onSetPending,
  onArchiveUser,
  onSendWelcomeEmail,
  onSetActive,
  onShareToOthers,
  onShareToOrganization,
  currentUserStatus,
  position,
  windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800
}) => {
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Calculate modal position based on button position to avoid going off-screen
  const modalTop = position.top > windowHeight / 2 
    ? position.top - 160 // Position above if button is in lower half of screen
    : position.top + 30;  // Position below if button is in upper half of screen

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: 'pending' | 'active' | 'archived') => {
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

      {/* Mobile View */}
      <div 
        className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div 
          ref={modalRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] z-50 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
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
            
            {onResetPassword && (
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetPassword();
                  onClose();
                }}
              >
                Reset Password
              </button>
            )}
            
            {onSetPending && (
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetPending();
                  onClose();
                }}
              >
                <Clock className="w-5 h-5" />
                Set to Pending
              </button>
            )}
            
            {onArchiveUser && (
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchiveUser();
                  onClose();
                }}
              >
                <Archive className="w-5 h-5" />
                {currentUserStatus === 'archived' ? 'Unarchive User' : 'Archive User'}
              </button>
            )}
            
            {onSendWelcomeEmail && (
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendWelcomeEmail();
                  onClose();
                }}
              >
               
                Send Email
              </button>
            )}
            
            {onSetActive && currentUserStatus !== 'active' && (
              <button 
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetActive();
                  onClose();
                }}
              >
                            
                Activate User
              </button>
            )}
                        
            {onShareToOthers && onShareToOrganization && (
              <div className="relative" id="share-dropdown">
                <button 
                  className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] w-full flex items-center gap-3"
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
                    className="manrope w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareToOthers();
                      onClose();
                    }}
                  >
                                
                    Share to others
                  </button>
                  <button 
                    className="manrope w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
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
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
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
                className="manrope text-left p-3 rounded-lg hover:bg-gray-50 transition-colors text-base text-[#1A1A1A] flex items-center gap-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onShareToOrganization();
                  onClose();
                }}
              >
                            
                Share to organization
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Desktop View */}
      <div 
        ref={modalRef}
        className="hidden md:block fixed bg-white shadow-lg rounded-lg z-50"
        style={{
          top: `${modalTop}px`,
          left: `${position.left}px`,
          width: '180px',
          borderRadius: '12px',
          padding: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb'
        }}
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
          
          {onResetPassword && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onResetPassword();
                onClose();
              }}
            >
              Reset Password
            </button>
          )}
          
          {onSetPending && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSetPending();
                onClose();
              }}
            >
             
              Set to Pending
            </button>
          )}
          
          {onArchiveUser && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onArchiveUser();
                onClose();
              }}
            >
              
              {currentUserStatus === 'archived' ? 'Unarchive User' : 'Archive User'}
            </button>
          )}
          
          {onSendWelcomeEmail && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSendWelcomeEmail();
                onClose();
              }}
            >
             
              Send Email
            </button>
          )}
          
          {onSetActive && currentUserStatus !== 'active' && (
            <button 
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSetActive();
                onClose();
              }}
            >
                        
              Activate User
            </button>
          )}
                    
          {onShareToOthers && onShareToOrganization && (
            <div className="relative" id="share-dropdown-desktop">
              <button 
                className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
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
                  className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
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
                  className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
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
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
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
              className="manrope text-left hover:bg-gray-50 p-2 rounded transition-colors flex items-center gap-2 text-sm text-[#1A1A1A] w-full"
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
                    
          {onDelete && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default UserActionModal;