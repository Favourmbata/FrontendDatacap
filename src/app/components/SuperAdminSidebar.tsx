// "use client";

// import React, { Dispatch, SetStateAction, ReactNode, useState } from 'react';
// import { 
//   Menu,
//   User,
//   Users,
//   Shield,
//   LogOut,
//   Settings,
//   Home,
//   FileText,
//   CreditCard,
//   Medal,
//   Pen,
//   Building2,
//   Package,
//   DollarSign
// } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import { LogoutModal } from './logoutModal';

// interface SidebarProps {
//   onShow: boolean;
//   setShow: Dispatch<SetStateAction<boolean>>;
// }

// interface MenuBtnProps {
//   icon: ReactNode;
//   positioning?: string;
//   onClick: () => void;
//   toggleLeftPadding?: string;
// }

// const MenuBtn: React.FC<MenuBtnProps> = ({ icon, positioning = '', onClick, toggleLeftPadding = '' }) => (
//   <button
//     type="button"
//     className={`${positioning} inline-flex cursor-pointer items-center justify-center rounded-md p-2 pl-0 text-gray-400 ${toggleLeftPadding}`}
//     onClick={onClick}
//   >
//     <span className="sr-only">Toggle menu</span>
//     {icon}
//   </button>
// );

// export const SuperAdminSidebar: React.FC<SidebarProps> = ({ onShow, setShow }) => {
//   const pathname = usePathname();
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
  
//   const toggleSidebar = (): string => onShow ? "block" : "hidden";
//   const toggleLeftPadding = (): string => onShow ? "pl-4 md:pl-12" : "";

//   // Helper function to check if a route is active
//   const isActive = (route: string): boolean => {
//     if (route === '/super-admin' && pathname === '/super-admin') return true;
//     if (route !== '/super-admin' && pathname.startsWith(route)) return true;
//     return false;
//   };

//   // Helper function to get active styles
//   const getActiveStyles = (route: string) => {
//     return isActive(route) ? {
//       background: '#5D2A8B',
//       borderRadius: '20px',
//       width: '275px',
//       height: '71px'
//     } : {};
//   };

//   // Helper function to get text color
//   const getTextColor = (route: string) => {
//     return isActive(route) ? '#FFFFFF' : '#6E6E6EB2';
//   };

//   // Logout handler functions
//   const handleLogoutClick = () => {
//     setShowLogoutModal(true);
//     setShow(false);
//   };

//   const handleConfirmLogout = () => {
//     console.log('Logging out...');
//     setShowLogoutModal(false);
//     alert('Logged out successfully!');
//   };

//   const handleCancelLogout = () => {
//     setShowLogoutModal(false);
//   };

//   // Super Admin menu items with their positions
//   const superAdminMenuItems = [
//     { 
//       id: 'dashboard', 
//       name: 'Dashboard', 
//       route: '/super-admin', 
//       icon: <Home className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'role-management', 
//       name: 'Role Management', 
//       route: '/super-admin/role-management', 
//       icon: <Shield className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'user-management', 
//       name: 'User Management', 
//       route: '/super-admin/users', 
//       icon: <User className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'organisation', 
//       name: 'Organisation', 
//       route: '/super-admin/organisation', 
//       icon: <Users className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'subscription', 
//       name: 'Subscription', 
//       route: '/super-admin/subscription', 
//       icon: <CreditCard className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'payments', 
//       name: 'Payments', 
//       route: '/super-admin/payments', 
//       icon: <CreditCard className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'industry', 
//       name: 'Industry', 
//       route: '/super-admin/industry', 
//       icon: <Building2 className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'category', 
//       name: 'Category', 
//       route: '/super-admin/category', 
//       icon: <Package className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//     { 
//       id: 'platform-commission', 
//       name: 'Platform Commission', 
//       route: '/super-admin/platform-commission', 
//       icon: <DollarSign className="w-6 h-6 text-[#dcdcdc]" />,
//     },
//   ];

//   return (
//     <aside>
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope { font-family: 'Manrope', sans-serif; }
        
//         @media (max-width: 768px) {
//           .sidebar-container {
//             width: 280px !important;
//             height: 100vh !important;
//             top: 0 !important;
//             left: 0 !important;
//             border-radius: 0 !important;
//           }
          
//           .sidebar-logo-container {
//             position: relative !important;
//             top: auto !important;
//             left: auto !important;
//             padding: 20px;
//           }
          
//           .sidebar-nav-container {
//             position: relative !important;
//             padding: 0 20px;
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//           }
          
//           .menu-item-container {
//             display: flex !important;
//             flex-direction: column !important;
//             gap: 8px !important;
//             margin-top: 100px !important;
//           }
          
//           .sidebar-logout {
//             position: fixed !important;
//             bottom: 30px !important;
//             left: 38px !important;
//           }
//         }
        
//         .sidebar-overlay {
//           display: none;
//           position: fixed;
//           inset: 0;
//           background: rgba(0, 0, 0, 0.5);
//           z-index: 998;
//         }
        
//         @media (max-width: 768px) {
//           .sidebar-overlay.active {
//             display: block;
//           }
//         }
//       `}</style>
      
//       <LogoutModal 
//         isOpen={showLogoutModal}
//         onConfirm={handleConfirmLogout}
//         onCancel={handleCancelLogout}
//       />
      
//       {onShow && (
//         <div 
//           className="sidebar-overlay active"
//           onClick={() => setShow(false)}
//         />
//       )}
      
//       <div 
//         className={`${toggleSidebar()} sidebar-container bg-[#FFFFFF] fixed overflow-y-auto shadow-sm`}
//         style={{
//           width: '328px',
//           height: '100vh',
//           top: '0',
//           left: '0',
//           borderRadius: '0 20px 20px 0',
//           boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
//           zIndex: 999
//         }}
//       >
//         {/* Header with Logo and Close Button */}
//         <div 
//           className="sidebar-logo-container flex items-center"
//           style={{
//             width: '252px',
//             height: '48px',
//             justifyContent: 'space-between',
//             top: '43px',
//             left: '38px',
//             position: 'absolute'
//           }}
//         >
//           <div className="flex items-center">
//             <Image 
//               src="/Group 1.png" 
//               alt="Brand Logo" 
//               width={55} 
//               height={48}
//               className="object-contain"
//             />
//           </div>
          
//           <button
//             type="button"
//             onClick={() => setShow(!onShow)}
//             className="cursor-pointer"
//           >
//             <Image 
//               src="/Panel Left Close Streamline Lucide Line.png" 
//               alt="Close Panel" 
//               width={24} 
//               height={24}
//               className="object-contain"
//             />
//           </button>
//         </div>

//         <nav className="sidebar-nav-container" style={{ marginTop: '120px' }}>
//           <div className="menu-item-container flex flex-col" style={{ gap: '12px' }}>
//             {/* Super Admin Menu Items */}
//             {superAdminMenuItems.map((item) => (
//               <Link href={item.route} key={item.id}>
//                 <div 
//                   className={`manrope flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
//                     isActive(item.route) ? 'bg-[#5D2A8B]' : ''
//                   }`}
//                   style={{
//                     width: '275px',
//                     height: '71px',
//                     padding: '0 23px',
//                     marginLeft: '15px'
//                   }}
//                 >
//                   <div 
//                     className="flex items-center w-full"
//                     style={{
//                       gap: '12px'
//                     }}
//                   >
//                     <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
//                       {item.icon}
//                     </div>
//                     <span 
//                       className="manrope whitespace-nowrap overflow-hidden text-ellipsis"
//                       style={{
//                         fontWeight: 500,
//                         fontSize: '20px',
//                         lineHeight: '100%',
//                         color: getTextColor(item.route),
//                         flex: 1,
//                         minWidth: 0 // This ensures text truncation works
//                       }}
//                     >
//                       {item.name}
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {/* Logout Module */}
//           <div 
//             className="sidebar-logout"
//             style={{
//               position: 'absolute',
//               bottom: '40px',
//               left: '38px',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             <button 
//               className="manrope flex items-center hover:opacity-80 cursor-pointer"
//               style={{
//                 gap: '12px',
//                 background: 'none',
//                 border: 'none',
//                 padding: 0
//               }}
//               onClick={handleLogoutClick}
//             >
//               <LogOut className="w-6 h-6 text-[#FF6161]" />
//               <span 
//                 className="manrope"
//                 style={{
//                   fontWeight: 500,
//                   fontSize: '20px',
//                   lineHeight: '100%',
//                   color: '#FF6161'
//                 }}
//               >
//                 Logout
//               </span>
//             </button>
//           </div>
//         </nav>
//       </div>

//       {!onShow && (
//         <MenuBtn
//           positioning="fixed left-4 z-[1000]"
//           icon={<Menu className="h-6 w-6" />}
//           onClick={() => setShow(!onShow)}
//           toggleLeftPadding={toggleLeftPadding()}
//         />
//       )}
//     </aside>
//   );
// };

"use client";

import React, { Dispatch, SetStateAction, ReactNode, useState, useEffect, useRef } from 'react';
import { 
  Menu,
  User,
  Users,
  Shield,
  LogOut,
  Settings,
  Home,
  FileText,
  CreditCard,
  Medal,
  Pen,
  Building2,
  Package,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogoutModal } from './logoutModal';

interface SidebarProps {
  onShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

interface SubMenuItem {
  id: string;
  name: string;
  route: string;
}

interface MenuItem {
  id: string;
  name: string;
  route?: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
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

export const SuperAdminSidebar: React.FC<SidebarProps> = ({ onShow, setShow }) => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const toggleSidebar = (): string => onShow ? "block" : "hidden";
  const toggleLeftPadding = (): string => onShow ? "pl-4 md:pl-12" : "";

  // Helper function to check if a route is active
  const isActive = (route: string): boolean => {
    if (route === '/super-admin' && pathname === '/super-admin') return true;
    if (route !== '/super-admin' && pathname.startsWith(route)) return true;
    return false;
  };

  // Helper function to get text color
  const getTextColor = (route: string) => {
    return isActive(route) ? '#FFFFFF' : '#6E6E6EB2';
  };

  // Helper function to get icon filter for active state
  const getIconFilter = (route: string) => {
    return isActive(route) ? 'brightness(0) invert(1)' : 'none';
  };

  // Toggle submenu
  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  // Check if any submenu item is active
  const isSubmenuActive = (subItems?: SubMenuItem[]): boolean => {
    if (!subItems) return false;
    return subItems.some(item => isActive(item.route));
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

  // Super Admin menu items with their positions
  const superAdminMenuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      route: '/super-admin', 
      icon: <Home className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'role-management', 
      name: 'Role Management', 
      route: '/super-admin/role-management', 
      icon: <Shield className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'user-management', 
      name: 'User Management', 
      route: '/super-admin/users', 
      icon: <User className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'organisation', 
      name: 'Organisation', 
      route: '/super-admin/organisation', 
      icon: <Users className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'service', 
      name: 'Service', 
      route: '/super-admin/service', 
      icon: <Pen className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'subscription', 
      name: 'Subscription', 
      route: '/super-admin/subscription', 
      icon: <CreditCard className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'payments', 
      name: 'Payments', 
      route: '/super-admin/payments', 
      icon: <CreditCard className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'industry', 
      name: 'Industry', 
      route: '/super-admin/industry', 
      icon: <Building2 className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'category', 
      name: 'Category', 
      route: '/super-admin/category', 
      icon: <Package className="w-6 h-6 text-[#dcdcdc]" />,
    },
    { 
      id: 'platform-commission', 
      name: 'Platform Commission', 
      route: '/super-admin/platform-commission', 
      icon: <DollarSign className="w-6 h-6 text-[#dcdcdc]" />,
    },
  ];

  return (
    <aside>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar styles */
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
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
        className={`${toggleSidebar()} sidebar-container sidebar-scroll bg-[#FFFFFF] fixed overflow-y-auto shadow-sm`}
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

        <nav className="sidebar-nav-container" style={{ marginTop: '120px', paddingBottom: '40px' }}>
          <div className="menu-item-container flex flex-col" style={{ gap: '12px' }}>
            {/* Super Admin Menu Items */}
            {superAdminMenuItems.map((item: MenuItem) => (
              <div key={item.id}>
                {item.route ? (
                  // Menu item with route (no submenu)
                  <Link href={item.route}>
                    <div 
                      className={`manrope flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${isActive(item.route) ? 'bg-[#5D2A8B]' : ''}`}
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
                            minWidth: 0
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Menu item with submenu
                  <div className="relative">
                    <div 
                      className={`manrope flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                        isSubmenuActive(item.subItems) ? 'bg-[#5D2A8B]' : ''
                      }`}
                      style={{
                        width: '275px',
                        height: '71px',
                        padding: '0 23px',
                        marginLeft: '15px'
                      }}
                      onClick={() => toggleSubmenu(item.id)}
                    >
                      <div 
                        className="flex items-center w-full"
                        style={{
                          gap: '12px'
                        }}
                      >
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ filter: getIconFilter(item.subItems?.[0].route || '') }}>
                          {item.icon}
                        </div>
                        <span 
                          className="manrope whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{
                            fontWeight: 500,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: isSubmenuActive(item.subItems) ? '#FFFFFF' : '#6E6E6EB2',
                            flex: 1,
                            minWidth: 0
                          }}
                        >
                          {item.name}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            expandedMenu === item.id ? 'rotate-180' : ''
                          }`}
                          style={{ 
                            filter: isSubmenuActive(item.subItems) ? 'brightness(0) invert(1)' : 'none',
                            color: isSubmenuActive(item.subItems) ? '#FFFFFF' : '#6E6E6EB2'
                          }}
                        />
                      </div>
                    </div>
                            
                    {/* Submenu items - only show if this menu is expanded */}
                    {expandedMenu === item.id && item.subItems && (
                      <div className="ml-8 mt-2 flex flex-col gap-2 submenu-up" style={{ width: '230px', marginLeft: '40px' }}>
                        {item.subItems.map((subItem: SubMenuItem) => (
                          <Link href={subItem.route} key={subItem.id}>
                            <div 
                              className={`manrope flex items-center rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                                isActive(subItem.route) ? 'bg-[#5D2A8B]' : 'bg-gray-100'
                              }`}
                              style={{
                                width: '230px',
                                height: '45px',
                                padding: '0 15px',
                                marginLeft: '10px',
                                borderRadius: '8px',
                                margin: '2px 0'
                              }}
                            >
                              <span 
                                className="manrope whitespace-nowrap overflow-hidden text-ellipsis"
                                style={{
                                  fontWeight: 400,
                                  fontSize: '15px',
                                  lineHeight: '100%',
                                  color: isActive(subItem.route) ? '#FFFFFF' : '#6E6E6EB2',
                                  flex: 1,
                                  minWidth: 0
                                }}
                              >
                                {subItem.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logout Module */}
          <div 
            style={{
              marginTop: '60px',
              marginLeft: '23px',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px'
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