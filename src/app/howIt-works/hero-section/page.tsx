// "use client";

// import { memo } from "react";
// import Image from "next/image";

// const HeroSection = () => {
//   return (
//     <section
//       aria-label="Hero"
//       className="w-full bg-[#F4EFFA] flex items-center"
//       style={{
//         minHeight: "60vh", // Reduced on mobile
//         paddingTop: "1.5rem", // Reduced padding on mobile
//         paddingBottom: "1.5rem",
//       }}
//     >
//       {/* Container with adjusted padding for mobile */}
//       <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
//         {/* Layout: reversed on mobile, normal on desktop */}
//         <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-6 lg:gap-12">
//           {/* LEFT: Text column */}
//           <div
//             className="flex flex-col justify-center text-center lg:text-left"
//             style={{
//               flex: "0 1 44%",
//               minWidth: 280,
//               gap: "1.25rem", // Reduced gap on mobile
//             }}
//           >
//             {/* Text block */}
//             <div>
//               <h1
//                 style={{
//                   fontFamily: "Monument Extended, sans-serif",
//                   fontWeight: 400,
//                   fontSize: "clamp(24px, 6vw, 50px)", // More aggressive scaling for mobile
//                   lineHeight: "1.1", // Slightly tighter on mobile
//                   margin: 0,
//                   color: "#000000",
//                 }}
//               >
//                 Powered by AI,
//                 <br />
//                 designed for
//                 <br />
//                 speed, accuracy,
//                 <br />
//                 and simplicity
//               </h1>

//               <p
//                 style={{
//                   fontFamily: "Manrope, sans-serif",
//                   fontWeight: 400,
//                   fontSize: "clamp(14px, 3.5vw, 20px)", // Better mobile scaling
//                   lineHeight: 1.5, // Better readability on mobile
//                   color: "#666666",
//                   marginTop: "1rem",
//                   maxWidth: "100%", // Full width on mobile
//                 }}
//                 className="mx-auto lg:mx-0" // Center on mobile, left align on desktop
//               >
//                 Get accurate measurements in three simple steps.
//               </p>
//             </div>

//             {/* Action row - centered on mobile */}
//             <div className="flex justify-center lg:justify-start items-center gap-3 lg:gap-4">
//               <button
//                 style={{
//                   minWidth: "140px", // Slightly smaller on mobile
//                   height: "48px", // Slightly shorter on mobile
//                   backgroundColor: "#5D2A8B",
//                   color: "#fff",
//                   borderRadius: "40px",
//                   fontFamily: "Manrope, sans-serif",
//                   fontSize: "clamp(14px, 3vw, 18px)", // Better mobile scaling
//                   fontWeight: 600,
//                 }}
//                 className="hover:bg-[#4B1E6E] px-5 lg:px-6 transition-colors duration-200" // Added transition
//               >
//                 Try it Now
//               </button>
//             </div>
//           </div>

//           {/* RIGHT: Image column */}
//           <div
//             className="flex items-center justify-center"
//             style={{
//               flex: "0 1 50%",
//               minWidth: 280, // Slightly smaller min-width
//             }}
//           >
//             <div
//               className="relative"
//               style={{
//                 width: "100%",
//                 maxWidth: "min(400px, 90vw)", // Better mobile constraint
//                 aspectRatio: "1 / 1",
//               }}
//             >
//               <Image
//                 src="/assets/Artificial Intelligence 2 Streamline Barcelona.png"
//                 alt="AI Scientist Illustration"
//                 fill
//                 priority
//                 sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 90vw"
//                 style={{ 
//                   objectFit: "contain",
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default memo(HeroSection);


"use client";

import { memo } from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-section {
            width: 100% !important;
            min-height: 710px !important;
            padding: 0 !important;
            position: relative !important;
          }
          .hero-container {
            position: relative !important;
            width: 100% !important;
            height: 700px !important;
          }
          .hero-text-content {
            position: absolute !important;
            width: 311px !important;
            top: 120px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            text-align: center !important;
          }
          .hero-heading {
            width: 311px !important;
            font-size: 30px !important;
            line-height: 100% !important;
            text-align: center !important;
            margin-bottom: 16px !important;
          }
          .hero-subtext {
            width: 311px !important;
            font-size: 16px !important;
            line-height: 120% !important;
            text-align: center !important;
            margin-top: 0 !important;
          }
          .hero-cta-wrapper {
            position: absolute !important;
            width: 140px !important;
            height: 48px !important;
            top: 250px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 10 !important;
          }
          .hero-cta-button {
            width: 140px !important;
            height: 48px !important;
            border-radius: 24px !important;
            padding: 0 20px !important;
            font-size: 14px !important;
          }
          .hero-image-wrapper {
            position: absolute !important;
            width: 280px !important;
            height: 280px !important;
            top: 410px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>
      <section
        aria-label="Hero"
        className="hero-section w-full bg-[#F4EFFA] flex items-center"
        style={{
          minHeight: "60vh",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
        }}
      >
        <div className="hero-container w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-6 lg:gap-12">
            {/* LEFT: Text column */}
            <div
              className="hero-text-content flex flex-col justify-center text-center lg:text-left"
              style={{
                flex: "0 1 44%",
                minWidth: 280,
                gap: "1.25rem",
              }}
            >
              <div>
                <h1
                  className="hero-heading"
                  style={{
                    fontFamily: "Monument Extended, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(24px, 6vw, 50px)",
                    lineHeight: "1.1",
                    margin: 0,
                    color: "#000000",
                  }}
                >
                  Powered by AI,
                  <br />
                  designed for
                  <br />
                  speed, accuracy,
                  <br />
                  and simplicity
                </h1>

                <p
                  className="hero-subtext mx-auto lg:mx-0"
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(14px, 3.5vw, 20px)",
                    lineHeight: 1.5,
                    color: "#666666",
                    marginTop: "1rem",
                    maxWidth: "100%",
                  }}
                >
                  Get accurate measurements in three simple steps.
                </p>
              </div>

              {/* Action row */}
              <div className="hero-cta-wrapper flex justify-center lg:justify-start items-center gap-3 lg:gap-4">
                <button
                  className="hero-cta-button hover:bg-[#4B1E6E] transition-colors duration-200"
                  style={{
                    minWidth: "140px",
                    height: "48px",
                    backgroundColor: "#5D2A8B",
                    color: "#fff",
                    borderRadius: "40px",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "clamp(14px, 3vw, 18px)",
                    fontWeight: 600,
                    padding: "0 24px",
                  }}
                >
                  Try it Now
                </button>
              </div>
            </div>

            {/* RIGHT: Image column */}
            <div
              className="flex items-center justify-center"
              style={{
                flex: "0 1 50%",
                minWidth: 280,
              }}
            >
              <div
                className="hero-image-wrapper relative"
                style={{
                  width: "100%",
                  maxWidth: "min(400px, 90vw)",
                  aspectRatio: "1 / 1",
                }}
              >
                <Image
                  src="/assets/Artificial Intelligence 2 Streamline Barcelona.png"
                  alt="AI Scientist Illustration"
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 90vw"
                  style={{ 
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(HeroSection);