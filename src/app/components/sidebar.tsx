



// "use client";

// import React, { Dispatch, SetStateAction, ReactNode } from 'react';
// import { 
  

//   Menu, 
 
// } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';


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

// // Reusable Menu Button Component
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


// export const UserSidebar: React.FC<SidebarProps> = ({ onShow, setShow }) => {
//   const pathname = usePathname();
  
//   const toggleSidebar = (): string => onShow ? "block" : "hidden";
//   const toggleLeftPadding = (): string => onShow ? "pl-4 md:pl-12" : "";

//   // Helper function to check if a route is active
//   const isActive = (route: string): boolean => {
//     if (route === '/user' && pathname === '/user') return true;
//     if (route !== '/user' && pathname.startsWith(route)) return true;
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

//   return (
//     <aside>
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope { font-family: 'Manrope', sans-serif; }
        
//         /* Mobile responsive styles */
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
//           }
          
//           .sidebar-logout {
//             position: fixed !important;
//             bottom: 30px !important;
//             left: 38px !important;
//           }
//         }
        
//         /* Overlay for mobile */
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
      
//       {/* Overlay for mobile - click to close sidebar */}
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
//           height: '633px',
//           top: '80px',
//           left: '37px',
//           borderRadius: '20px',
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
//           <Image 
//             src="/Group 1.png" 
//             alt="Brand Logo" 
//             width={55} 
//             height={48}
//             className="object-contain"
//           />
          
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

//         <nav className="sidebar-nav-container flex flex-col text-white" style={{ gap: '40px' }}>
//           <div className="cursor-pointer space-y-3">
//             <Link href={`/user`}>
//               <div 
//                 className="manrope flex items-center rounded-lg cursor-pointer absolute"
//                 style={{
//                   ...getActiveStyles('/user'),
//                   top: '169px',
//                   left: '15px',
//                   ...(isActive('/user') ? {} : {
//                     width: '275px',
//                     height: '71px'
//                   })
//                 }}
//               >
//                 <div 
//                   className="flex items-center"
//                   style={{
//                     width: '139px',
//                     height: '27px',
//                     position: 'absolute',
//                     top: '22px',
//                     left: '23px',
//                     gap: '12px'
//                   }}
//                 >
//                   <Image 
//                     src="/Dashboard Circle Streamline Core Remix - Free.png" 
//                     alt="Dashboard" 
//                     width={24} 
//                     height={24}
//                     className="object-contain"
//                   />
//                   <span 
//                     className="manrope"
//                     style={{
//                       fontWeight: 500,
//                       fontSize: '20px',
//                       lineHeight: '100%',
//                       color: getTextColor('/user'),
//                       width: '103px',
//                       height: '27px'
//                     }}
//                   >
//                     Dashboard
//                   </span>
//                 </div>
//               </div>
//             </Link>

//             {/* Menu Items Container */}
//             <div 
//               className="absolute"
//               style={{
//                 width: '234px',
//                 height: '161px',
//                 top: '280px',
//                 left: '38px',
//                 gap: '40px',
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               <Link href="/user/body-measurement">
//                 <div 
//                   className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
//                   style={{
//                     ...getActiveStyles('/user/body-measurement'),
//                     ...(isActive('/user/body-measurement') ? {
//                       padding: '22px 23px'
//                     } : {
//                       width: '218px',
//                       height: '27px',
//                       gap: '12px'
//                     })
//                   }}
//                 >
//                   <div 
//                     className="flex items-center"
//                     style={{
//                       gap: '12px'
//                     }}
//                   >
//                     <Image 
//                       src="/Body Streamline Ionic Filled.png" 
//                       alt="Body Measurement" 
//                       width={24} 
//                       height={24}
//                       className="object-contain"
//                     />
//                     <span 
//                       className="manrope"
//                       style={{
//                         fontWeight: 500,
//                         fontSize: '20px',
//                         lineHeight: '100%',
//                         color: getTextColor('/user/body-measurement')
//                       }}
//                     >
//                       Body Measurement
//                     </span>
//                   </div>
//                 </div>
//               </Link>

//               <Link href="/user/object-dimension">
//                 <div 
//                   className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
//                   style={{
//                     ...getActiveStyles('/user/object-dimension'),
//                     ...(isActive('/user/object-dimension') ? {
//                       padding: '22px 23px'
//                     } : {
//                       width: '234px',
//                       height: '27px',
//                       gap: '12px'
//                     })
//                   }}
//                 >
//                   <div 
//                     className="flex items-center"
//                     style={{
//                       gap: '12px'
//                     }}
//                   >
//                     <Image 
//                       src="/Object Scan Streamline Tabler Line.png" 
//                       alt="Object Measurement" 
//                       width={24} 
//                       height={24}
//                       className="object-contain"
//                     />
//                     <span 
//                       className="manrope"
//                       style={{
//                         fontWeight: 500,
//                         fontSize: '20px',
//                         lineHeight: '100%',
//                         color: getTextColor('/user/object-dimension')
//                       }}
//                     >
//                       Object Measurement
//                     </span>
//                   </div>
//                 </div>
//               </Link>

//               <Link href="/user/questionaire">
//                 <div 
//                   className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
//                   style={{
//                     ...getActiveStyles('/user/questionaire'),
//                     ...(isActive('/user/questionaire') ? {
//                       padding: '22px 23px'
//                     } : {
//                       width: '170px',
//                       height: '27px',
//                       gap: '12px'
//                     })
//                   }}
//                 >
//                   <div 
//                     className="flex items-center"
//                     style={{
//                       gap: '12px'
//                     }}
//                   >
//                     <Image 
//                       src="/List Dropdown Streamline Carbon.png" 
//                       alt="Questionnaire" 
//                       width={24} 
//                       height={24}
//                       className="object-contain"
//                     />
//                     <span 
//                       className="manrope"
//                       style={{
//                         fontWeight: 500,
//                         fontSize: '20px',
//                         lineHeight: '100%',
//                         color: getTextColor('/user/questionaire')
//                       }}
//                     >
//                       Questionnaire
//                     </span>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>

//           <div 
//             className="sidebar-logout absolute"
//             style={{
//               width: '105.39px',
//               height: '27px',
//               top: '547px',
//               left: '38px',
//               gap: '12px',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             <button 
//               className="manrope flex items-center hover:opacity-80"
//               style={{
//                 gap: '12px'
//               }}
//               onClick={() => {/* Add logout logic */}}
//             >
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M17.5 10H7.5" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//               <span 
//                 className="manrope"
//                 style={{
//                   width: '67px',
//                   height: '27px',
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

//       {/* Menu Toggle Button */}
//      {!onShow && (
//         <MenuBtn
//           positioning="fixed  left-4 z-[1000]"
//           icon={<Menu className="h-6 w-6" />}
//           onClick={() => setShow(!onShow)}
//           toggleLeftPadding={toggleLeftPadding()}
//         />
//       )}
//     </aside>
//   );
// };

"use client";

import React, { Dispatch, SetStateAction, ReactNode, useState } from 'react';
import { 
  Menu, 
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

// Reusable Menu Button Component
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

export const UserSidebar: React.FC<SidebarProps> = ({ onShow, setShow }) => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Add state for logout modal
  
  const toggleSidebar = (): string => onShow ? "block" : "hidden";
  const toggleLeftPadding = (): string => onShow ? "pl-4 md:pl-12" : "";

  // Helper function to check if a route is active
  const isActive = (route: string): boolean => {
    if (route === '/user' && pathname === '/user') return true;
    if (route !== '/user' && pathname.startsWith(route)) return true;
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

  // Logout handler functions
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShow(false); // Close sidebar on mobile when logout is clicked
  };

  const handleConfirmLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    
    // Example logout logic:
    // 1. Clear authentication tokens
    // 2. Clear user data from state/store
    // 3. Redirect to login page
    
    // For example:
    // localStorage.removeItem('authToken');
    // router.push('/login');
    
    setShowLogoutModal(false);
    
    // Show success message
    alert('Logged out successfully!');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Mobile responsive styles */
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
          }
          
          .sidebar-logout {
            position: fixed !important;
            bottom: 30px !important;
            left: 38px !important;
          }
        }
        
        /* Overlay for mobile */
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
      
      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      
      {/* Overlay for mobile - click to close sidebar */}
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
          height: '633px',
          top: '80px',
          left: '37px',
          borderRadius: '20px',
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
          <Image 
            src="/Group 1.png" 
            alt="Brand Logo" 
            width={55} 
            height={48}
            className="object-contain"
          />
          
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

        <nav className="sidebar-nav-container flex flex-col text-white" style={{ gap: '40px' }}>
          <div className="cursor-pointer space-y-3">
            <Link href={`/user`}>
              <div 
                className="manrope flex items-center rounded-lg cursor-pointer absolute"
                style={{
                  ...getActiveStyles('/user'),
                  top: '169px',
                  left: '15px',
                  ...(isActive('/user') ? {} : {
                    width: '275px',
                    height: '71px'
                  })
                }}
              >
                <div 
                  className="flex items-center"
                  style={{
                    width: '139px',
                    height: '27px',
                    position: 'absolute',
                    top: '22px',
                    left: '23px',
                    gap: '12px'
                  }}
                >
                  <Image 
                    src="/Dashboard Circle Streamline Core Remix - Free.png" 
                    alt="Dashboard" 
                    width={24} 
                    height={24}
                    className="object-contain"
                  />
                  <span 
                    className="manrope"
                    style={{
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '100%',
                      color: getTextColor('/user'),
                      width: '103px',
                      height: '27px'
                    }}
                  >
                    Dashboard
                  </span>
                </div>
              </div>
            </Link>

            {/* Menu Items Container */}
            <div 
              className="absolute"
              style={{
                width: '234px',
                height: '161px',
                top: '280px',
                left: '38px',
                gap: '40px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Link href="/user/body-measurement">
                <div 
                  className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
                  style={{
                    ...getActiveStyles('/user/body-measurement'),
                    ...(isActive('/user/body-measurement') ? {
                      padding: '22px 23px'
                    } : {
                      width: '218px',
                      height: '27px',
                      gap: '12px'
                    })
                  }}
                >
                  <div 
                    className="flex items-center"
                    style={{
                      gap: '12px'
                    }}
                  >
                    <Image 
                      src="/Body Streamline Ionic Filled.png" 
                      alt="Body Measurement" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                    <span 
                      className="manrope"
                      style={{
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: getTextColor('/user/body-measurement')
                      }}
                    >
                      Body Measurement
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/user/object-dimension">
                <div 
                  className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
                  style={{
                    ...getActiveStyles('/user/object-dimension'),
                    ...(isActive('/user/object-dimension') ? {
                      padding: '22px 23px'
                    } : {
                      width: '234px',
                      height: '27px',
                      gap: '12px'
                    })
                  }}
                >
                  <div 
                    className="flex items-center"
                    style={{
                      gap: '12px'
                    }}
                  >
                    <Image 
                      src="/Object Scan Streamline Tabler Line.png" 
                      alt="Object Measurement" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                    <span 
                      className="manrope"
                      style={{
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: getTextColor('/user/object-dimension')
                      }}
                    >
                      Object Measurement
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/user/questionaire">
                <div 
                  className="manrope flex items-center cursor-pointer hover:bg-gray-100 relative"
                  style={{
                    ...getActiveStyles('/user/questionaire'),
                    ...(isActive('/user/questionaire') ? {
                      padding: '22px 23px'
                    } : {
                      width: '170px',
                      height: '27px',
                      gap: '12px'
                    })
                  }}
                >
                  <div 
                    className="flex items-center"
                    style={{
                      gap: '12px'
                    }}
                  >
                    <Image 
                      src="/List Dropdown Streamline Carbon.png" 
                      alt="Questionnaire" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                    <span 
                      className="manrope"
                      style={{
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: getTextColor('/user/questionaire')
                      }}
                    >
                      Questionnaire
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div 
            className="sidebar-logout absolute"
            style={{
              width: '105.39px',
              height: '27px',
              top: '547px',
              left: '38px',
              gap: '12px',
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
              onClick={handleLogoutClick} // Updated to call the handler
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 10H7.5" stroke="#FF6161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span 
                className="manrope"
                style={{
                  width: '67px',
                  height: '27px',
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

      {/* Menu Toggle Button */}
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