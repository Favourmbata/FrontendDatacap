"use client";

import React, { Dispatch, SetStateAction, ReactNode, useState } from 'react';
import { 
  Menu,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogoutModal } from './logoutModal';

interface SidebarProps {
  onShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

interface MenuBtnProps {
  icon: ReactNode;
  positioning?: string;
  onClick: () => void;
  toggleLeftPadding?: string;
}

const MenuBtn: React.FC<MenuBtnProps> = ({ icon, positioning = '', onClick, toggleLeftPadding = '' }) => (
  <button
    type="button"
    className={`${positioning} inline-flex cursor-pointer items-center justify-center rounded-md p-2 pl-0 text-gray-400 ${toggleLeftPadding}`}
    onClick={onClick}
  >
    <span className="sr-only">Toggle menu</span>
    {icon}
  </button>
);

export const AdminSidebar: React.FC<SidebarProps> = ({ onShow, setShow }) => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const toggleSidebar = (): string => onShow ? "block" : "hidden";
  const toggleLeftPadding = (): string => onShow ? "pl-4 md:pl-12" : "";

  // Helper function to check if a route is active
  const isActive = (route: string): boolean => {
    if (route === '/admin' && pathname === '/admin') return true;
    if (route !== '/admin' && pathname.startsWith(route)) return true;
    return false;
  };

  // Helper function to get active styles
  const getActiveStyles = (route: string) => {
    return isActive(route) ? {
      background: '#5D2A8B',
      borderRadius: '20px',
      width: '275px',
      height: '71px'
    } : {};
  };

  // Helper function to get text color
  const getTextColor = (route: string) => {
    return isActive(route) ? '#FFFFFF' : '#6E6E6EB2';
  };

  // Helper function to get icon filter for active state
  const getIconFilter = (route: string) => {
    return isActive(route) ? 'brightness(0) invert(1)' : 'none';
  };

  // Logout handler functions
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShow(false);
  };

  const handleConfirmLogout = () => {
    console.log('Logging out...');
    setShowLogoutModal(false);
    alert('Logged out successfully!');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Admin menu items with their positions
  const adminMenuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      route: '/admin', 
      icon: <Image src="/Dashboard Circle Streamline Core Remix - Free.png" alt="Dashboard" width={24} height={24} className="object-contain" />,
    },
    { 
      id: 'body-measurement', 
      name: 'Body Measurement', 
      route: '/admin/body-measurement', 
      icon: <Image src="/Body Streamline Ionic Filled.png" alt="Body Measurement" width={24} height={24} className="object-contain" />,
    },
    { 
      id: 'object-dimension', 
      name: 'Object Dimension', 
      route: '/admin/object-dimension', 
      icon: <Image src="/Object Scan Streamline Tabler Line.png" alt="Object Dimension" width={24} height={24} className="object-contain" />,
    },
    { 
      id: 'questionaire', 
      name: 'Questionnaire', 
      route: '/admin/questionaire', 
      icon: <Image src="/List Dropdown Streamline Carbon.png" alt="Questionnaire" width={24} height={24} className="object-contain" />,
    },
    { 
      id: 'subscription', 
      name: 'Subscription', 
      route: '/admin/subscription', 
      icon: <Image src="/List Dropdown Streamline Carbon.png" alt="Subscription" width={24} height={24} className="object-contain" />,
    },
    { 
      id: 'users', 
      name: 'User Management', 
      route: '/admin/users', 
      icon: <User className="w-6 h-6" />,
    },
    { 
      id: 'role-management', 
      name: 'Role Management', 
      route: '/admin/role-management', 
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  return (
    <aside>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        @media (max-width: 768px) {
          .sidebar-container {
            width: 280px !important;
            height: 100vh !important;
            top: 0 !important;
            left: 0 !important;
            border-radius: 0 !important;
          }
          
          .sidebar-logo-container {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            padding: 20px;
          }
          
          .sidebar-nav-container {
            position: relative !important;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .menu-item-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            margin-top: 100px !important;
          }
          
          .sidebar-logout {
            position: fixed !important;
            bottom: 30px !important;
            left: 38px !important;
          }
        }
        
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }
        
        @media (max-width: 768px) {
          .sidebar-overlay.active {
            display: block;
          }
        }
      `}</style>
      
      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      
      {onShow && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setShow(false)}
        />
      )}
      
      <div 
        className={`${toggleSidebar()} sidebar-container bg-[#FFFFFF] fixed overflow-y-auto shadow-sm`}
        style={{
          width: '328px',
          height: '100vh',
          top: '0',
          left: '0',
          borderRadius: '0 20px 20px 0',
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
          zIndex: 999
        }}
      >
        {/* Header with Logo and Close Button */}
        <div 
          className="sidebar-logo-container flex items-center"
          style={{
            width: '252px',
            height: '48px',
            justifyContent: 'space-between',
            top: '43px',
            left: '38px',
            position: 'absolute'
          }}
        >
          <div className="flex items-center">
            <Image 
              src="/Group 1.png" 
              alt="Brand Logo" 
              width={55} 
              height={48}
              className="object-contain"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShow(!onShow)}
            className="cursor-pointer"
          >
            <Image 
              src="/Panel Left Close Streamline Lucide Line.png" 
              alt="Close Panel" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </button>
        </div>

        <nav className="sidebar-nav-container" style={{ marginTop: '120px' }}>
          <div className="menu-item-container flex flex-col" style={{ gap: '12px' }}>
            {/* Admin Menu Items */}
            {adminMenuItems.map((item: { id: string; route: string; icon: React.ReactNode; name: string; }) => (
              <Link href={item.route} key={item.id}>
                <div 
                  className={`manrope flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                    isActive(item.route) ? 'bg-[#5D2A8B]' : ''
                  }`}
                  style={{
                    width: '275px',
                    height: '71px',
                    padding: '0 23px',
                    marginLeft: '15px'
                  }}
                >
                  <div 
                    className="flex items-center w-full"
                    style={{
                      gap: '12px'
                    }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ filter: getIconFilter(item.route) }}>
                      {item.icon}
                    </div>
                    <span 
                      className="manrope whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: getTextColor(item.route),
                        flex: 1,
                        minWidth: 0 // This ensures text truncation works
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout Module */}
          <div 
            className="sidebar-logout"
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '38px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <button 
              className="manrope flex items-center hover:opacity-80 cursor-pointer"
              style={{
                gap: '12px',
                background: 'none',
                border: 'none',
                padding: 0
              }}
              onClick={handleLogoutClick}
            >
              <LogOut className="w-6 h-6 text-[#FF6161]" />
              <span 
                className="manrope"
                style={{
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '100%',
                  color: '#FF6161'
                }}
              >
                Logout
              </span>
            </button>
          </div>
        </nav>
      </div>

      {!onShow && (
        <MenuBtn
          positioning="fixed left-4 z-[1000]"
          icon={<Menu className="h-6 w-6" />}
          onClick={() => setShow(!onShow)}
          toggleLeftPadding={toggleLeftPadding()}
        />
      )}
    </aside>
  );
};