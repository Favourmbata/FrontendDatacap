

// import React from 'react';
// import Image from 'next/image';

// const AnimatedAISection = () => {
//   return (
//     <>
//       <style>{`
//         @keyframes pulse-zoom {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.05);
//           }
//         }

//         @keyframes inner-pulse {
//           0%, 100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//           50% {
//             transform: scale(1.15);
//             opacity: 0.8;
//           }
//         }

//         .animate-inner-pulse {
//           animation: inner-pulse 2s ease-in-out infinite;
//         }

//         .animate-glow-pulse {
//           animation: glow-pulse 3s ease-in-out infinite;
//         }

//         .animated-orb-wrapper {
//           position: relative;
//         }

//         @media (max-width: 768px) {
//           .animate-inner-pulse {
//             animation: inner-pulse 3s ease-in-out infinite;
//           }
//         }
//       `}</style>

//       <section className="bg-[#F4EFFA] py-12 lg:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
//             {/* Left Side - Text Content */}
//             <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-800 font-monument font-normal">
//                 Powered by AI technology
//               </h2>
//               <p className="font-manrope font-normal text-[#6E6E6EB2] text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
//                 Our intelligent system uses computer vision and machine learning to detect shapes, calculate proportions, and deliver measurements with remarkable accuracy, all from the images uploaded.
//               </p>
              
//               {/* Features List */}
//               <div className="mt-6 lg:mt-8 space-y-3">
//                 <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#E4D8F380] rounded-lg w-full max-w-md mx-auto lg:mx-0 px-4 py-3">
//                   <p className="font-manrope font-normal text-[#6E6E6EB2] text-sm lg:text-base">
//                     Capture upload → AI analysis → Accurate measurements
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Images */}
//             <div className="flex-1 flex items-center justify-center relative min-h-[300px] lg:min-h-[400px] order-1 lg:order-2 w-full max-w-md mx-auto">
//               {/* Left Decorative Icon - Hidden on mobile, visible on desktop */}
//               <Image
//                 src='/Rss Feed Streamline Ultimate Regular - Free (4).png'
//                 alt="AI Icon"
//                 width={70}
//                 height={70}
//                 className="hidden lg:block absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 opacity-80"
//               />
              
//               {/* Center Frame/Orb with Animation */}
//               <div className="relative z-10 animated-orb-wrapper">
//                 <div className="animate-inner-pulse">
//                   <Image
//                     src='/Frame.png'
//                     alt="AI Technology Visualization"
//                     width={300}
//                     height={300}
//                     className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-contain"
//                     sizes="(max-width: 768px) 256px, 320px"
//                   />
//                 </div>
//               </div>
              
//               {/* Right Decorative Icon - Hidden on mobile, visible on desktop */}
//               <Image
//                 src='/Rss Feed Streamline Ultimate Regular - Free (5).png'
//                 alt="AI Icon"
//                 width={70}
//                 height={70}
//                 className="hidden lg:block absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 opacity-80"
//               />

//               {/* Mobile decorative icons */}
//               <Image
//                 src='/Rss Feed Streamline Ultimate Regular - Free (4).png'
//                 alt="AI Icon"
//                 width={40}
//                 height={40}
//                 className="lg:hidden absolute left-2 top-4 opacity-60"
//               />
//               <Image
//                 src='/Rss Feed Streamline Ultimate Regular - Free (5).png'
//                 alt="AI Icon"
//                 width={40}
//                 height={40}
//                 className="lg:hidden absolute right-2 bottom-4 opacity-60"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AnimatedAISection;

import React from 'react';
import Image from 'next/image';

const AnimatedAISection = () => {
  return (
    <>
      <style>{`
        @keyframes pulse-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes inner-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        .animate-inner-pulse {
          animation: inner-pulse 2s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .animated-orb-wrapper {
          position: relative;
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .desktop-ai-heading {
            font-family: 'Monument Extended' !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-size: 36px !important;
            line-height: 100% !important;
            letter-spacing: 0 !important;
            text-align: center !important;
            width: 667px !important;
            height: 43px !important;
          }
          
          .desktop-ai-description {
            font-family: 'Manrope' !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-size: 20px !important;
            line-height: 100% !important;
            letter-spacing: 0 !important;
            color: #6E6E6EB2 !important;
            width: 625px !important;
            height: 81px !important;
          }
          
          .desktop-feature-box {
            width: 502px !important;
            height: 37px !important;
            gap: 8px !important;
            border-radius: 20px !important;
            padding: 6px 20px !important;
          }
        }

        @media (max-width: 768px) {
          .animate-inner-pulse {
            animation: inner-pulse 3s ease-in-out infinite;
          }
          
          .mobile-ai-section {
            height: 608px !important;
            padding: 0 !important;
          }
          
          .mobile-ai-container {
            flex-direction: column !important;
            gap: 0 !important;
            padding-top: 70px !important;
            align-items: center !important;
          }
          
          .mobile-text-content {
            order: 1 !important;
            width: 309px !important;
            margin: 0 auto !important;
            text-align: center !important;
          }
          
          .mobile-ai-heading {
            font-family: 'Monument Extended' !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-size: 24px !important;
            line-height: 100% !important;
            letter-spacing: 0 !important;
            text-align: center !important;
            color: #1A1A1A !important;
            width: 309px !important;
            height: auto !important;
            min-height: 58px !important;
            margin-bottom: 16px !important;
            padding: 0 !important;
          }
          
          .mobile-ai-description {
            font-family: 'Manrope' !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-size: 16px !important;
            line-height: 100% !important;
            letter-spacing: 0 !important;
            text-align: center !important;
            color: #6E6E6EB2 !important;
            width: 309px !important;
            height: auto !important;
            min-height: 110px !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
            max-width: 309px !important;
          }
          
          .mobile-image-wrapper {
            order: 2 !important;
            margin-top: 20px !important;
            margin-bottom: 10px !important;
            min-height: auto !important;
            padding: 0 !important;
          }
          
          .mobile-center-orb {
            width: 243.53px !important;
            height: 245.92px !important;
            transform: rotate(34.72deg) !important;
          }
          
          .mobile-features-list {
            order: 3 !important;
            margin-top: 10px !important;
            width: 100% !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
          }
          
          .mobile-feature-item {
            width: 356px !important;
            height: 36px !important;
            gap: 4px !important;
            border-radius: 20px !important;
            padding: 6px 10px !important;
            margin: 0 !important;
            max-width: 356px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .mobile-feature-item p {
            margin: 0 !important;
            line-height: 1 !important;
          }
        }
      `}</style>

      <section className="bg-[#F4EFFA] py-12 lg:py-16 mobile-ai-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mobile-ai-container">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1 mobile-text-content">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-800 font-monument font-normal mobile-ai-heading">
                Powered by AI technology
              </h2>
              <p className="font-manrope font-normal text-[#6E6E6EB2] text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mobile-ai-description">
                Our intelligent system uses computer vision and machine learning to detect shapes, estimate proportions, and deliver measurements with remarkable accuracy, all from the images uploaded.
              </p>
              
              {/* Features List - Desktop */}
              <div className="mt-6 lg:mt-8 space-y-3 hidden lg:block">
                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#E4D8F380] rounded-lg w-full max-w-md mx-auto lg:mx-0 px-4 py-3">
                  <p className="font-manrope font-normal text-[#6E6E6EB2] text-sm lg:text-base">
                    Capture upload → AI analysis → Accurate measurements
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Images */}
            <div className="flex-1 flex items-center justify-center relative min-h-[300px] lg:min-h-[400px] order-1 lg:order-2 w-full max-w-md mx-auto mobile-image-wrapper">
              {/* Left Decorative Icon - Hidden on mobile, visible on desktop */}
              <Image
                src='/Rss Feed Streamline Ultimate Regular - Free (4).png'
                alt="AI Icon"
                width={70}
                height={70}
                className="hidden lg:block absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 opacity-80"
              />
              
              {/* Center Frame/Orb with Animation */}
              <div className="relative z-10 animated-orb-wrapper mobile-center-orb">
                <div className="animate-inner-pulse">
                  <Image
                    src='/Frame.png'
                    alt="AI Technology Visualization"
                    width={300}
                    height={300}
                    className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-contain"
                    sizes="(max-width: 768px) 243.53px, 320px"
                  />
                </div>
              </div>
              
              {/* Right Decorative Icon - Hidden on mobile, visible on desktop */}
              <Image
                src='/Rss Feed Streamline Ultimate Regular - Free (5).png'
                alt="AI Icon"
                width={70}
                height={70}
                className="hidden lg:block absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 opacity-80"
              />

              {/* Mobile decorative icons - Hidden */}
              <Image
                src='/Rss Feed Streamline Ultimate Regular - Free (4).png'
                alt="AI Icon"
                width={40}
                height={40}
                className="hidden"
              />
              <Image
                src='/Rss Feed Streamline Ultimate Regular - Free (5).png'
                alt="AI Icon"
                width={40}
                height={40}
                className="hidden"
              />
            </div>
            
            
           
<div className="lg:hidden w-full mobile-features-list">
  <div className="flex items-center justify-center gap-3 bg-[#E4D8F380] rounded-lg mobile-feature-item">
    <p className="font-manrope font-normal text-[#6E6E6EB2] text-sm whitespace-nowrap">
      Image upload → AI analysis → Accurate measurements
    </p>
  </div>
</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnimatedAISection;