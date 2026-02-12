// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";

// type UserType = "user" | "admin";

// export default function Signup() {
//   const router = useRouter();
//   const [selectedType, setSelectedType] = useState<UserType | null>(null);

//   const handleContinue = () => {
//     if (selectedType) {
//       router.push(`/auth/signup/${selectedType}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .monument-extended { font-family: 'Monument Extended', sans-serif; }
//         .manrope { font-family: 'Manrope', sans-serif; }
//       `}</style>

//       <div className="relative" style={{ width: "1440px", minHeight: "1000px", margin: "0 auto" }}>
//         {/* Left Image Section */}
//         <div 
//           className="absolute"
//           style={{
//             width: "700px",
//             height: "935px",
//             top: "35px",
//             left: "45px",
//             borderRadius: "40px",
//             background: "linear-gradient(180deg, #F4EFFA 0%, #5D2A8B 10%)",
//             overflow: "hidden"
//           }}
//         >
//           <Image 
//             src="/Frame 335677.png" 
//             alt="Data Capturing Illustration" 
//             width={700} 
//             height={935} 
//             priority 
//             className="w-full h-full object-cover" 
//           />
//         </div>

//         {/* Right Form Section */}
//         <div 
//           className="absolute"
//           style={{
//             width: "609px",
//             height: "935px",
//             top: "35px",
//             left: "785px",
//             borderRadius: "40px",
//             background: "#FBFAFC",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "50px"
//           }}
//         >
//           {/* Logo */}
//           <div 
//             className="absolute"
//             style={{
//               top: "50px",
//               left: "50px"
//             }}
//           >
//             <Image 
//               width={55} 
//               height={48} 
//               src="/Group 1.png" 
//               alt="Company Logo" 
//               className="object-contain" 
//             />
//           </div>

//           {/* Content Container */}
//           <div style={{ width: "484px", marginTop: "80px" }}>
//             {/* Header */}
//             <div className="text-center mb-12">
//               <h1 
//                 className="monument-extended"
//                 style={{
//                   fontSize: "30px",
//                   fontWeight: 400,
//                   lineHeight: "100%",
//                   color: "#1A1A1A",
//                   marginBottom: "16px"
//                 }}
//               >
//                 Create Account
//               </h1>
//               <p 
//                 className="manrope"
//                 style={{
//                   fontWeight: 300,
//                   fontSize: "18px",
//                   lineHeight: "100%",
//                   color: "#6E6E6EB2"
//                 }}
//               >
//                 Choose your account type to get started
//               </p>
//             </div>

//             {/* Account Type Selection */}
//             <div style={{ marginBottom: "32px" }}>
//               {/* User Account Option */}
//               <div
//                 onClick={() => setSelectedType("user")}
//                 style={{
//                   padding: "24px",
//                   border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                   background: selectedType === "user" ? "#F4EFFA" : "white",
//                   marginBottom: "16px"
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <div>
//                     <h3 
//                       className="manrope"
//                       style={{
//                         fontWeight: 600,
//                         fontSize: "20px",
//                         color: "#1A1A1A",
//                         marginBottom: "8px"
//                       }}
//                     >
//                       User Account
//                     </h3>
//                     <p 
//                       className="manrope"
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         color: "#6E6E6E",
//                         lineHeight: "140%"
//                       }}
//                     >
//                       For individuals who want to use the data capturing service
//                     </p>
//                   </div>
//                   <div 
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                       border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
//                       background: selectedType === "user" ? "#5D2A8B" : "white",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                       marginLeft: "16px"
//                     }}
//                   >
//                     {selectedType === "user" && (
//                       <div 
//                         style={{
//                           width: "10px",
//                           height: "10px",
//                           borderRadius: "50%",
//                           background: "white"
//                         }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Admin Account Option */}
//               <div
//                 onClick={() => setSelectedType("admin")}
//                 style={{
//                   padding: "24px",
//                   border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                   background: selectedType === "admin" ? "#F4EFFA" : "white"
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <div>
//                     <h3 
//                       className="manrope"
//                       style={{
//                         fontWeight: 600,
//                         fontSize: "20px",
//                         color: "#1A1A1A",
//                         marginBottom: "8px"
//                       }}
//                     >
//                       Admin Account
//                     </h3>
//                     <p 
//                       className="manrope"
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         color: "#6E6E6E",
//                         lineHeight: "140%"
//                       }}
//                     >
//                       For administrators who manage the platform and users
//                     </p>
//                   </div>
//                   <div 
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                       border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
//                       background: selectedType === "admin" ? "#5D2A8B" : "white",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                       marginLeft: "16px"
//                     }}
//                   >
//                     {selectedType === "admin" && (
//                       <div 
//                         style={{
//                           width: "10px",
//                           height: "10px",
//                           borderRadius: "50%",
//                           background: "white"
//                         }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Continue Button */}
//             <button
//               onClick={handleContinue}
//               disabled={!selectedType}
//               className="manrope"
//               style={{
//                 width: "100%",
//                 height: "60px",
//                 background: selectedType ? "#5D2A8B" : "#D1D5DB",
//                 color: "white",
//                 borderRadius: "10px",
//                 border: "none",
//                 fontWeight: 600,
//                 fontSize: "20px",
//                 cursor: selectedType ? "pointer" : "not-allowed",
//                 transition: "all 0.2s",
//                 marginBottom: "24px"
//               }}
//             >
//               Continue
//             </button>

//             {/* Login Link */}
//             <div className="text-center">
//               <p 
//                 className="manrope"
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: 300,
//                   color: "#6E6E6E"
//                 }}
//               >
//                 Already have an account?{" "}
//                 <Link
//                   href="/auth/login"
//                   style={{
//                     fontWeight: 500,
//                     color: "#5D2A8B",
//                     textDecoration: "none"
//                   }}
//                 >
//                   Log in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";

// type UserType = "user" | "admin";

// export default function Signup() {
//   const router = useRouter();
//   const [selectedType, setSelectedType] = useState<UserType | null>(null);

//   const handleContinue = () => {
//     if (selectedType) {
//       router.push(`/auth/signup/${selectedType}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .monument-extended { font-family: 'Monument Extended', sans-serif; }
//         .manrope { font-family: 'Manrope', sans-serif; }
//       `}</style>

//       <div className="relative" style={{ width: "1440px", minHeight: "1000px", margin: "0 auto" }}>
//         {/* Left Image Section */}
//         <div 
//           className="absolute"
//           style={{
//             width: "700px",
//             height: "935px",
//             top: "35px",
//             left: "45px",
//             borderRadius: "40px",
//             background: "linear-gradient(180deg, #F4EFFA 0%, #5D2A8B 10%)",
//             overflow: "hidden"
//           }}
//         >
//           <Image 
//             src="/Frame 335677.png" 
//             alt="Data Capturing Illustration" 
//             width={700} 
//             height={935} 
//             priority 
//             className="w-full h-full object-cover" 
//           />
//         </div>

//         {/* Right Form Section */}
//         <div 
//           className="absolute"
//           style={{
//             width: "609px",
//             height: "935px",
//             top: "35px",
//             left: "785px",
//             borderRadius: "40px",
//             background: "#FBFAFC",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "50px"
//           }}
//         >
//           {/* Logo */}
//           <div 
//             className="absolute"
//             style={{
//               top: "50px",
//               left: "50px"
//             }}
//           >
//             <Image 
//               width={55} 
//               height={48} 
//               src="/Group 1.png" 
//               alt="Company Logo" 
//               className="object-contain" 
//             />
//           </div>

//           {/* Content Container */}
//           <div style={{ width: "484px", marginTop: "80px" }}>
//             {/* Header */}
//             <div className="text-center mb-12">
//               <h1 
//                 className="monument-extended"
//                 style={{
//                   fontSize: "30px",
//                   fontWeight: 400,
//                   lineHeight: "100%",
//                   color: "#1A1A1A",
//                   marginBottom: "16px"
//                 }}
//               >
//                 Create Account
//               </h1>
//               <p 
//                 className="manrope"
//                 style={{
//                   fontWeight: 300,
//                   fontSize: "18px",
//                   lineHeight: "100%",
//                   color: "#6E6E6EB2"
//                 }}
//               >
//                 Choose your account type to get started
//               </p>
//             </div>

//             {/* Account Type Selection */}
//             <div style={{ marginBottom: "32px" }}>
//               {/* User Account Option */}
//               <div
//                 onClick={() => setSelectedType("user")}
//                 style={{
//                   padding: "24px",
//                   border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                   background: selectedType === "user" ? "#F4EFFA" : "white",
//                   marginBottom: "16px"
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <div>
//                     <h3 
//                       className="manrope"
//                       style={{
//                         fontWeight: 600,
//                         fontSize: "20px",
//                         color: "#1A1A1A",
//                         marginBottom: "8px"
//                       }}
//                     >
//                       User Account
//                     </h3>
//                     <p 
//                       className="manrope"
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         color: "#6E6E6E",
//                         lineHeight: "140%"
//                       }}
//                     >
//                       For individuals who want to use the data capturing service
//                     </p>
//                   </div>
//                   <div 
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                       border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
//                       background: selectedType === "user" ? "#5D2A8B" : "white",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                       marginLeft: "16px"
//                     }}
//                   >
//                     {selectedType === "user" && (
//                       <div 
//                         style={{
//                           width: "10px",
//                           height: "10px",
//                           borderRadius: "50%",
//                           background: "white"
//                         }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Admin Account Option */}
//               <div
//                 onClick={() => setSelectedType("admin")}
//                 style={{
//                   padding: "24px",
//                   border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                   background: selectedType === "admin" ? "#F4EFFA" : "white"
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <div>
//                     <h3 
//                       className="manrope"
//                       style={{
//                         fontWeight: 600,
//                         fontSize: "20px",
//                         color: "#1A1A1A",
//                         marginBottom: "8px"
//                       }}
//                     >
//                       Admin Account
//                     </h3>
//                     <p 
//                       className="manrope"
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         color: "#6E6E6E",
//                         lineHeight: "140%"
//                       }}
//                     >
//                       For administrators who manage the platform and users
//                     </p>
//                   </div>
//                   <div 
//                     style={{
//                       width: "24px",
//                       height: "24px",
//                       borderRadius: "50%",
//                       border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
//                       background: selectedType === "admin" ? "#5D2A8B" : "white",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                       marginLeft: "16px"
//                     }}
//                   >
//                     {selectedType === "admin" && (
//                       <div 
//                         style={{
//                           width: "10px",
//                           height: "10px",
//                           borderRadius: "50%",
//                           background: "white"
//                         }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Continue Button */}
//             <button
//               onClick={handleContinue}
//               disabled={!selectedType}
//               className="manrope"
//               style={{
//                 width: "100%",
//                 height: "60px",
//                 background: selectedType ? "#5D2A8B" : "#D1D5DB",
//                 color: "white",
//                 borderRadius: "10px",
//                 border: "none",
//                 fontWeight: 600,
//                 fontSize: "20px",
//                 cursor: selectedType ? "pointer" : "not-allowed",
//                 transition: "all 0.2s",
//                 marginBottom: "24px"
//               }}
//             >
//               Continue
//             </button>

//             {/* Login Link */}
//             <div className="text-center">
//               <p 
//                 className="manrope"
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: 300,
//                   color: "#6E6E6E"
//                 }}
//               >
//                 Already have an account?{" "}
//                 <Link
//                   href="/auth/login"
//                   style={{
//                     fontWeight: 500,
//                     color: "#5D2A8B",
//                     textDecoration: "none"
//                   }}
//                 >
//                   Log in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type UserType = "user" | "admin";

export default function Signup() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/auth/signup/${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .monument-extended { font-family: 'Monument Extended', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Mobile Layout */
        .mobile-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 24px;
        }
        
        /* Desktop Layout */
        .desktop-layout {
          display: none;
        }
        
        @media (min-width: 1024px) {
          .mobile-layout {
            display: none;
          }
          
          .desktop-layout {
            display: block;
          }
        }
        
        /* Mobile Styles */
        .mobile-option {
          padding: 20px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        
        .mobile-option.selected {
          border-color: #5D2A8B;
          background: #F4EFFA;
        }
        
        .mobile-radio {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #D1D5DB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 12px;
        }
        
        .mobile-radio.selected {
          border-color: #5D2A8B;
          background: #5D2A8B;
        }
        
        .mobile-radio-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        }
      `}</style>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            width={40} 
            height={35} 
            src="/Group 1.png" 
            alt="Company Logo" 
            className="object-contain" 
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="monument-extended text-2xl text-[#1A1A1A] mb-3">
            Create Account
          </h1>
          <p className="manrope text-base text-[#6E6E6EB2]">
            Choose your account type to get started
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="mb-8">
          {/* User Account Option */}
          <div
            onClick={() => setSelectedType("user")}
            className={`mobile-option ${selectedType === "user" ? "selected" : ""}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedType("user");
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="manrope font-semibold text-lg text-[#1A1A1A] mb-2">
                  User Account
                </h3>
                <p className="manrope text-sm text-[#6E6E6E] leading-relaxed">
                  For individuals who want to use the data capturing service
                </p>
              </div>
              <div className={`mobile-radio ${selectedType === "user" ? "selected" : ""}`}>
                {selectedType === "user" && <div className="mobile-radio-inner" />}
              </div>
            </div>
          </div>

          {/* Admin Account Option */}
          <div
            onClick={() => setSelectedType("admin")}
            className={`mobile-option ${selectedType === "admin" ? "selected" : ""}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedType("admin");
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="manrope font-semibold text-lg text-[#1A1A1A] mb-2">
                  Admin Account
                </h3>
                <p className="manrope text-sm text-[#6E6E6E] leading-relaxed">
                  For administrators who manage the platform and users
                </p>
              </div>
              <div className={`mobile-radio ${selectedType === "admin" ? "selected" : ""}`}>
                {selectedType === "admin" && <div className="mobile-radio-inner" />}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`manrope w-full h-14 rounded-lg font-semibold text-base mb-6
            ${selectedType 
              ? "bg-[#5D2A8B] text-white cursor-pointer" 
              : "bg-[#D1D5DB] text-gray-500 cursor-not-allowed"}`}
          onTouchStart={() => {}} // Fixes potential iOS Safari click delay
        >
          Continue
        </button>

        {/* Login Link */}
        <div className="text-center">
          <p className="manrope text-sm text-[#6E6E6E]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#5D2A8B]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="desktop-layout">
        <div className="relative" style={{ width: "1440px", minHeight: "1000px", margin: "0 auto" }}>
          {/* Left Image Section */}
          <div 
            className="absolute"
            style={{
              width: "700px",
              height: "935px",
              top: "35px",
              left: "45px",
              borderRadius: "40px",
              // background: "linear-gradient(180deg, #F4EFFA 0%, #5D2A8B 10%)",
              overflow: "hidden"
            }}
          >
            <Image 
              src="/Frame 335677.png" 
              alt="Data Capturing Illustration" 
              width={700} 
              height={935} 
              priority 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Right Form Section */}
          <div 
            className="absolute"
            style={{
              width: "609px",
              height: "935px",
              top: "35px",
              left: "785px",
              borderRadius: "40px",
              background: "#FBFAFC",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "50px"
            }}
          >
            {/* Logo */}
            <div 
              className="absolute"
              style={{
                top: "50px",
                left: "50px"
              }}
            >
              <Image 
                width={55} 
                height={48} 
                src="/Group 1.png" 
                alt="Company Logo" 
                className="object-contain" 
              />
            </div>

            {/* Content Container */}
            <div style={{ width: "484px", marginTop: "80px" }}>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 
                  className="monument-extended"
                  style={{
                    fontSize: "30px",
                    fontWeight: 400,
                    lineHeight: "100%",
                    color: "#1A1A1A",
                    marginBottom: "16px"
                  }}
                >
                  Create Account
                </h1>
                <p 
                  className="manrope"
                  style={{
                    fontWeight: 300,
                    fontSize: "18px",
                    lineHeight: "100%",
                    color: "#6E6E6EB2"
                  }}
                >
                  Choose your account type to get started
                </p>
              </div>

              {/* Account Type Selection */}
              <div style={{ marginBottom: "32px" }}>
                {/* User Account Option */}
                <div
                  onClick={() => setSelectedType("user")}
                  style={{
                    padding: "24px",
                    border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedType === "user" ? "#F4EFFA" : "white",
                    marginBottom: "16px"
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedType("user");
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 
                        className="manrope"
                        style={{
                          fontWeight: 600,
                          fontSize: "20px",
                          color: "#1A1A1A",
                          marginBottom: "8px"
                        }}
                      >
                        User Account
                      </h3>
                      <p 
                        className="manrope"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#6E6E6E",
                          lineHeight: "140%"
                        }}
                      >
                        For individuals who want to use the data capturing service
                      </p>
                    </div>
                    <div 
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: selectedType === "user" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
                        background: selectedType === "user" ? "#5D2A8B" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: "16px"
                      }}
                    >
                      {selectedType === "user" && (
                        <div 
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "white"
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Account Option */}
                <div
                  onClick={() => setSelectedType("admin")}
                  style={{
                    padding: "24px",
                    border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #E5E7EB",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedType === "admin" ? "#F4EFFA" : "white"
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedType("admin");
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 
                        className="manrope"
                        style={{
                          fontWeight: 600,
                          fontSize: "20px",
                          color: "#1A1A1A",
                          marginBottom: "8px"
                        }}
                      >
                        Admin Account
                      </h3>
                      <p 
                        className="manrope"
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#6E6E6E",
                          lineHeight: "140%"
                        }}
                      >
                        For administrators who manage the platform and users
                      </p>
                    </div>
                    <div 
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: selectedType === "admin" ? "2px solid #5D2A8B" : "2px solid #D1D5DB",
                        background: selectedType === "admin" ? "#5D2A8B" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginLeft: "16px"
                      }}
                    >
                      {selectedType === "admin" && (
                        <div 
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "white"
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedType}
                className="manrope"
                style={{
                  width: "100%",
                  height: "60px",
                  background: selectedType ? "#5D2A8B" : "#D1D5DB",
                  color: "white",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "20px",
                  cursor: selectedType ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  marginBottom: "24px"
                }}
                onTouchStart={() => {}} // Fixes potential iOS Safari click delay
              >
                Continue
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p 
                  className="manrope"
                  style={{
                    fontSize: "18px",
                    fontWeight: 300,
                    color: "#6E6E6E"
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    style={{
                      fontWeight: 500,
                      color: "#5D2A8B",
                      textDecoration: "none"
                    }}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}