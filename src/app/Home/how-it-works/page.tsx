

// "use client";

// import React from "react";
// import Image from "next/image";

// const Page = () => {
//   return (
//     <section className="py-20 bg-white" style={{ marginBottom: "200px" }}>
//       {/* Desktop Version */}
//       <div
//         className="mx-auto px-4 md:px-20 hidden md:block"
//         style={{
//           maxWidth: "1440px",
//           width: "100%",
//         }}
//       >
//         {/* Header */}
//         <div
//           className="text-center mb-16"
//           style={{
//             width: "439px",
//             height: "86px",
//             margin: "0 auto",
//             marginBottom: "64px",
//             gap: "16px",
//           }}
//         >
//           <h2
//             className="text-[#1A1A1A]"
//             style={{
//               fontFamily: "Monument Extended",
//               fontWeight: 400,
//               fontSize: "36px",
//               lineHeight: "100%",
//               letterSpacing: "0%",
//               textAlign: "center",
//               width: "439px",
//               height: "43px",
//               marginBottom: "16px",
//             }}
//           >
//             How it works
//           </h2>
//           <p
//             className="text-[#6E6E6EB2]"
//             style={{
//               fontFamily: "Manrope",
//               fontWeight: 400,
//               fontSize: "16px",
//               lineHeight: "100%",
//               textAlign: "center",
//             }}
//           >
//             Get accurate measurements in just three steps
//           </p>
//         </div>

//         {/* Cards Container */}
//         <div
//           className="flex flex-col lg:flex-row items-end justify-center relative gap-5 lg:gap-[21px]"
//           style={{
//             maxWidth: "1281px",
//             minHeight: "622px",
//             margin: "0 auto",
//           }}
//         >
//           {/* Card 1 - Upload an image */}
//           <div
//             className="rounded-[20px] border-2 border-dashed border-[#E0D0F0] relative w-full lg:w-[413px]"
//             style={{
//               background: "#f4effa", // background color for Step 1
//               height: "492px",
//             }}
//           >
//             {/* Decorative icon */}
//             <div className="absolute top-6 right-6">
//               <Image
//                 src="/Summertime Sadness.png"
//                 alt="decor"
//                 width={24}
//                 height={24}
//               />
//             </div>

//             {/* Step Badge */}
//             <div className="px-10 pt-6">
//               <span
//                 className="inline-block px-3 py-1.5 rounded-[10px] text-sm text-[#6E6E6E] text-center"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 400,
//                   fontSize: "14px",
//                   lineHeight: "100%",
//                   background: "#FFFFFF",
//                   width: "66px",
//                   height: "31px",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 Step 1
//               </span>
//             </div>

//             {/* Image */}
//             <div className="flex justify-center mt-4">
//               <Image
//                 src="/aiony-haust-3TLl_97HNJo-unsplash-removebg-preview 1.png"
//                 alt="Upload an image"
//                 width={240}
//                 height={300}
//                 className="object-contain"
//               />
//             </div>

//             {/* Content */}
//             <div className="px-10 pb-10 mt-4 text-[#1A1A1A]">
//               <h3
//                 className="mb-4"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 600,
//                   fontSize: "26px",
//                   lineHeight: "100%",
//                 }}
//               >
//                 Take an Image
//               </h3>
//               <p
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 300,
//                   fontSize: "16px",
//                   lineHeight: "140%",
//                   color:"#6E6E6EB2",
//                 }}
//               >
//                 Open your camera to take a clear image of a person or object.
//               </p>
//             </div>
//           </div>

//           {/* Card 2 - AI analysis (Featured/Taller) */}
//           <div
//             className="bg-[#5D2A8B] rounded-[20px] relative w-full lg:w-[413px]"
//             style={{
//               height: "622px",
//             }}
//           >
//             {/* Step Badge */}
//             <div className="px-10 pt-6">
//               <span
//                 className="inline-block px-3 py-1.5 rounded-[10px] text-sm text-white"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 400,
//                   fontSize: "14px",
//                   lineHeight: "100%",
//                   background: "#FFFFFF66",
//                 }}
//               >
//                 Step 2
//               </span>
//             </div>

//             {/* Image with overlay circles */}
//             <div
//               className="flex justify-center items-center mt-8 relative"
//               style={{ height: "350px" }}
//             >
//               {/* Overlay circles */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Image
//                   src="/Group 2.png"
//                   alt="Analysis circles"
//                   width={280}
//                   height={280}
//                   className="object-contain"
//                 />
//               </div>
//               {/* Mannequin with animation */}
//               <Image
//                 src="/26760494_2002.i123.009.S.m004.c13.mannequins_realistic_colored_1-removebg-preview 3@2x.png"
//                 alt="AI analysis"
//                 width={120}
//                 height={180}
//                 className="object-contain relative z-10 animate-slide"
//               />
//             </div>

//             {/* Content */}
//             <div className="px-10 pb-10">
//               <h3
//                 className="text-[#FFFFFF] mb-4"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 600,
//                   fontSize: "26px",
//                   lineHeight: "100%",
//                 }}
//               >
//                 AI analysis
//               </h3>
//               <p
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 300,
//                   fontSize: "20.31px",
//                   lineHeight: "100%",
//                   color: "rgba(255, 255, 255, 0.6)",
//                   width: "330px",
//                 }}
//               >
//                 Our engine detects scale, angles, and proportions
//               </p>
//             </div>
//           </div>

//           {/* Card 3 - View Measurements */}
//           <div
//             className="rounded-[20px] border-2 border-dashed border-[#E0D0F0] relative w-full lg:w-[413px]"
//             style={{
//               background: "#f4effa", // background color for Step 3
//               height: "492px",
//             }}
//           >
//             {/* Decorative icon */}
//             <div className="absolute top-6 right-6">
//               <Image src="/5 Dots.png" alt="decor" width={24} height={24} />
//             </div>

//             {/* Step Badge */}
//             <div className="px-10 pt-6">
//               <span
//                 className="inline-block rounded-[10px] text-sm text-[#6E6E6E] text-center"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 400,
//                   fontSize: "14px",
//                   lineHeight: "100%",
//                   background: "#ffffff",
//                   padding: "6px 12px",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 Step 3
//               </span>
//             </div>

//             {/* Image */}
//             <div className="flex justify-center mt-4">
//               <Image
//                 src="/18021 1.png"
//                 alt="View Measurements"
//                 width={450}
//                 height={300}
//                 className="object-contain"
//                 style={{
//                   maxWidth: "100%",
//                   height: "auto",
//                 }}
//               />
//             </div>

//             {/* Content */}
//             <div className="px-10 pb-10 mt-4 text-[#1A1A1A]">
//               <h3
//                 className="mb-4"
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 600,
//                   fontSize: "26px",
//                   lineHeight: "100%",
//                 }}
//               >
//                 View Measurements Instantly
//               </h3>
//               <p
//                 style={{
//                   fontFamily: "Manrope",
//                   fontWeight: 300,
//                   fontSize: "16px",
//                   lineHeight: "140%",
//                   color: "#6E6E6EB2",
//                 }}
//               >
//                 Get exact height, width, and fit details
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Version */}
      
//       {/* Animation */}
//       <style jsx>{`
//         @keyframes slide {
//           0% {
//             transform: translateX(0);
//           }
//           50% {
//             transform: translateX(15px);
//           }
//           100% {
//             transform: translateX(0);
//           }
//         }

//         .animate-slide {
//           animation: slide 4s ease-in-out infinite;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Page;


"use client";

import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <section className="bg-white pt-5 md:pt-20 pb-10 md:pb-20 mb-[40px] md:mb-[200px]">
      {/* Desktop Version */}
      <div
        className="mx-auto px-4 md:px-20 hidden md:block"
        style={{
          maxWidth: "1440px",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            width: "439px",
            height: "86px",
            margin: "0 auto",
            marginBottom: "64px",
            gap: "16px",
          }}
        >
          <h2
            className="text-[#1A1A1A]"
            style={{
              fontFamily: "Monument Extended",
              fontWeight: 400,
              fontSize: "36px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              width: "439px",
              height: "43px",
              marginBottom: "16px",
            }}
          >
            How it works
          </h2>
          <p
            className="text-[#6E6E6EB2]"
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "100%",
              textAlign: "center",
            }}
          >
            Get accurate measurements in just three steps
          </p>
        </div>

        {/* Cards Container */}
        <div
          className="flex flex-col lg:flex-row items-end justify-center relative gap-5 lg:gap-[21px]"
          style={{
            maxWidth: "1281px",
            minHeight: "622px",
            margin: "0 auto",
          }}
        >
          {/* Card 1 - Upload an image */}
          <div
            className="rounded-[20px] border-2 border-dashed border-[#E0D0F0] relative w-full lg:w-[413px]"
            style={{
              background: "#f4effa", // background color for Step 1
              height: "492px",
            }}
          >
            {/* Decorative icon */}
            <div className="absolute top-6 right-6">
              <Image
                src="/Summertime Sadness.png"
                alt="decor"
                width={24}
                height={24}
              />
            </div>

            {/* Step Badge */}
            <div className="px-10 pt-6">
              <span
                className="inline-block px-3 py-1.5 rounded-[10px] text-sm text-[#6E6E6E] text-center"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "100%",
                  background: "#FFFFFF",
                  width: "66px",
                  height: "31px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Step 1
              </span>
            </div>

            {/* Image */}
            <div className="flex justify-center mt-4">
              <Image
                src="/aiony-haust-3TLl_97HNJo-unsplash-removebg-preview 1.png"
                alt="Upload an image"
                width={240}
                height={300}
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="px-10 pb-10 mt-4 text-[#1A1A1A]">
              <h3
                className="mb-4"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "26px",
                  lineHeight: "100%",
                }}
              >
                Take an Image
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "140%",
                  color:"#6E6E6EB2",
                }}
              >
                Open your camera to take a clear image of a person or object.
              </p>
            </div>
          </div>

          {/* Card 2 - AI analysis (Featured/Taller) */}
          <div
            className="bg-[#5D2A8B] rounded-[20px] relative w-full lg:w-[413px]"
            style={{
              height: "622px",
            }}
          >
            {/* Step Badge */}
            <div className="px-10 pt-6">
              <span
                className="inline-block px-3 py-1.5 rounded-[10px] text-sm text-white"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "100%",
                  background: "#FFFFFF66",
                }}
              >
                Step 2
              </span>
            </div>

            {/* Image with overlay circles */}
            <div
              className="flex justify-center items-center mt-8 relative"
              style={{ height: "350px" }}
            >
              {/* Overlay circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/Group 2.png"
                  alt="Analysis circles"
                  width={280}
                  height={280}
                  className="object-contain"
                />
              </div>
              {/* Mannequin with animation */}
              <Image
                src="/26760494_2002.i123.009.S.m004.c13.mannequins_realistic_colored_1-removebg-preview 3@2x.png"
                alt="AI analysis"
                width={120}
                height={180}
                className="object-contain relative z-10 animate-slide"
              />
            </div>

            {/* Content */}
            <div className="px-10 pb-10">
              <h3
                className="text-[#FFFFFF] mb-4"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "26px",
                  lineHeight: "100%",
                }}
              >
                AI analysis
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "20.31px",
                  lineHeight: "100%",
                  color: "rgba(255, 255, 255, 0.6)",
                  width: "330px",
                }}
              >
                Our engine detects scale, angles, and proportions
              </p>
            </div>
          </div>

          {/* Card 3 - View Measurements */}
          <div
            className="rounded-[20px] border-2 border-dashed border-[#E0D0F0] relative w-full lg:w-[413px]"
            style={{
              background: "#f4effa", // background color for Step 3
              height: "492px",
            }}
          >
            {/* Decorative icon */}
            <div className="absolute top-6 right-6">
              <Image src="/5 Dots.png" alt="decor" width={24} height={24} />
            </div>

            {/* Step Badge */}
            <div className="px-10 pt-6">
              <span
                className="inline-block rounded-[10px] text-sm text-[#6E6E6E] text-center"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "100%",
                  background: "#ffffff",
                  padding: "6px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Step 3
              </span>
            </div>

            {/* Image */}
            <div className="flex justify-center mt-4">
              <Image
                src="/18021 1.png"
                alt="View Measurements"
                width={450}
                height={300}
                className="object-contain"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>

            {/* Content */}
            <div className="px-10 pb-10 mt-4 text-[#1A1A1A]">
              <h3
                className="mb-4"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "26px",
                  lineHeight: "100%",
                }}
              >
                View Measurements Instantly
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "140%",
                  color: "#6E6E6EB2",
                }}
              >
                Get exact height, width, and fit details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden" style={{ width: "100%", maxWidth: "390px", margin: "0 auto", paddingTop: "28px" }}>
        {/* Header */}
        <div
          style={{
            width: "232px",
            margin: "0 auto 50px",
            textAlign: "center",
          }}
        >
          <h2
            className="text-[#1A1A1A]"
            style={{
              fontFamily: "Monument Extended",
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "100%",
              marginBottom: "16px",
            }}
          >
            How it works
          </h2>
          <p
            className="text-[#6E6E6EB2]"
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "110%",
            }}
          >
            Get accurate measurements in just three steps
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          className="scroll-container"
          style={{
            width: "390px",
            height: "639px",
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            gap: "20px",
            padding: "0 13px 20px 13px",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE/Edge
          }}
        >
          {/* Card 1 - Take an Image */}
          <div
            className="rounded-[15px] border-2 border-dashed border-[#E0D0F0] relative flex-shrink-0"
            style={{
              background: "#f4effa",
              width: "364px",
              height: "430px",
            }}
          >
            {/* Decorative icon */}
            <div className="absolute top-4 right-4">
              <Image
                src="/Summertime Sadness.png"
                alt="decor"
                width={20}
                height={20}
              />
            </div>

            {/* Step Badge */}
            <div className="px-6 pt-4">
              <span
                className="inline-block rounded-[8px] text-[#6E6E6E] text-center"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "100%",
                  background: "#FFFFFF",
                  padding: "6px 10px",
                }}
              >
                Step 1
              </span>
            </div>

            {/* Image */}
            <div className="flex justify-center mt-3">
              <Image
                src="/aiony-haust-3TLl_97HNJo-unsplash-removebg-preview 1.png"
                alt="Upload an image"
                width={180}
                height={220}
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 mt-2 text-[#1A1A1A]" style={{width:"320px", height: "104px", gap:"18px"}}>
              <h3
                className="mt-6"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "20px",
                  lineHeight: "100%",
                }}
              >
                Take an Image
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: "130%",
                  color: "#6E6E6EB2",
                }}
              >
                Open your camera to take a clear image of a person or object.
              </p>
            </div>
          </div>

          {/* Card 2 - AI analysis (Featured/Taller) */}
          <div
            className="bg-[#5D2A8B] rounded-[15px] relative flex-shrink-0"
            style={{
              width: "364px",
              height: "550px",
            }}
          >
            {/* Step Badge */}
            <div className="px-6 pt-4">
              <span
                className="inline-block rounded-[8px] text-white text-center"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "100%",
                  background: "#FFFFFF66",
                  padding: "6px 10px",
                }}
              >
                Step 2
              </span>
            </div>

            {/* Image with overlay circles */}
            <div
              className="flex justify-center items-center mt-6 relative"
              style={{ height: "350px" }}
            >
              {/* Overlay circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/Group 2.png"
                  alt="Analysis circles"
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div>
              {/* Mannequin with animation */}
              <Image
                src="/26760494_2002.i123.009.S.m004.c13.mannequins_realistic_colored_1-removebg-preview 3@2x.png"
                alt="AI analysis"
                width={100}
                height={150}
                className="object-contain relative z-10 animate-slide"
              />
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <h3
                className="text-[#FFFFFF] mb-3"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "20px",
                  lineHeight: "100%",
                }}
              >
                AI analysis
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "110%",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                Our engine detects scale, angles, and proportions
              </p>
            </div>
          </div>

          {/* Card 3 - View Measurements */}
          <div
            className="rounded-[15px] border-2 border-dashed border-[#E0D0F0] relative flex-shrink-0"
            style={{
              background: "#f4effa",
              width: "364px",
              height: "430px",
            }}
          >
            {/* Decorative icon */}
            <div className="absolute top-4 right-4">
              <Image src="/5 Dots.png" alt="decor" width={20} height={20} />
            </div>

            {/* Step Badge */}
            <div className="px-6 pt-4">
              <span
                className="inline-block rounded-[8px] text-[#6E6E6E] text-center"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "100%",
                  background: "#ffffff",
                  padding: "6px 10px",
                }}
              >
                Step 3
              </span>
            </div>

            {/* Image */}
            <div className="flex justify-center mt-3">
              <Image
                src="/18021 1.png"
                alt="View Measurements"
                width={320}
                height={220}
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 mt-2 text-[#1A1A1A]">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "20px",
                  lineHeight: "100%",
                }}
              >
                View Measurements Instantly
              </h3>
              <p
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: "130%",
                  color: "#6E6E6EB2",
                }}
              >
                Get exact height, width, and fit details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation and scrollbar styles */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(15px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-slide {
          animation: slide 4s ease-in-out infinite;
        }

        /* Hide scrollbar for Chrome/Safari */
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Page;