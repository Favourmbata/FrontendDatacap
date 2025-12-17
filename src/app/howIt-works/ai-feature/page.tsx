
// "use client"
// import type React from "react"
// import Image from "next/image"

// interface FeatureCard {
//   icon: React.ReactNode
//   title: string
//   description: string
// }

// const features: FeatureCard[] = [
//   {
//     icon: (
//       <Image
//         src="/assets/fram66.png"
//         alt="Machine Learning"
//         width={100}
//         height={100}
//         style={{ objectFit: "contain" }}
//       />
//     ),
//     title: "Machine Learning Algorithms",
//     description: "Our system learns from thousands of data samples to improve measurement accuracy over time.",
//   },
//   {
//     icon: (
//       <Image
//         src="/assets/Frame 249.png"
//         alt="Computer Vision"
//         width={100}
//         height={100}
//         style={{ objectFit: "contain" }}
//       />
//     ),
//     title: "Computer Vision Detection",
//     description: "Detects edges, contours, and reference points in your image to calculate dimensions precisely.",
//   },
//   {
//     icon: (
//       <Image
//         src="/assets/fram333.png"
//         alt="Smart Calibration"
//         width={100}
//         height={100}
//         style={{ objectFit: "contain" }}
//       />
//     ),
//     title: "Smart Calibration",
//     description:
//       "Uses object or body ratios and context clues (like posture or object placement) to auto-correct angles and perspective.",
//   },
//   {
//     icon: (
//       <Image
//         src="/assets/Frame 249 (1).png"
//         alt="Data Privacy"
//         width={100}
//         height={100}
//         style={{ objectFit: "contain" }}
//       />
//     ),
//     title: "Data Privacy",
//     description: "All processing happens securely – your uploaded images are not stored or shared.",
//   },
// ]

// export function AIFeaturesSection() {
//   return (
//     <section className="w-full">
//       <div className="relative hidden md:block" style={{ width: "1296px", height: "637px", margin: "0 auto" }}>
//         <div className="absolute" style={{ width: "566px", height: "156px", left: "377px", gap: "16px" }}>
//           <h2
//             style={{
//               fontFamily: "Monument Extended, sans-serif",
//               fontWeight: 400,
//               fontSize: "36px",
//               lineHeight: "100%",
//               letterSpacing: "0%",
//               textAlign: "center",
//               color: "#1A1A1A",
//               width: "566px",
//               height: "86px",
//               margin: 0,
//             }}
//           >
//             Built on Advanced AI & Computer Vision
//           </h2>
//           <p
//             style={{
//               fontFamily: "Manrope, sans-serif",
//               fontWeight: 400,
//               fontSize: "20px",
//               lineHeight: "100%",
//               letterSpacing: "0%",
//               textAlign: "center",
//               color: "#6E6E6EB2",
//               width: "566px",
//               height: "54px",
//               marginTop: "16px",
//             }}
//           >
//             Our technology analyzes every pixel, shape, and proportion — delivering accurate measurements without manual input.
//           </p>
//         </div>

//         <div className="absolute" style={{ width: "1296px", height: "381px", top: "256px", display: "flex", gap: "28px" }}>
//           {features.map((feature, index) => (
//             <div key={index} style={{ width: "303px", height: "381px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: "30px" }}>
//               {/* Increased icon container size */}
//               <div style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 {feature.icon}
//               </div>
//               <h3
//                 style={{
//                   fontFamily: "Manrope, sans-serif",
//                   fontWeight: 500,
//                   fontSize: "28px",
//                   lineHeight: "100%",
//                   letterSpacing: "0%",
//                   textAlign: "center",
//                   color: "#1A1A1A",
//                   width: "239px",
//                   height: "76px",
//                   margin: 0,
//                 }}
//               >
//                 {feature.title}
//               </h3>
//               <p
//                 style={{
//                   fontFamily: "Manrope, sans-serif",
//                   fontWeight: 300,
//                   fontSize: "20px",
//                   lineHeight: "100%",
//                   letterSpacing: "0%",
//                   textAlign: "center",
//                   color: "#6E6E6EB2",
//                   width: "303px",
//                   height: "81px",
//                   margin: 0,
//                 }}
//               >
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="md:hidden w-full" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
//         <div style={{ width: "100%", maxWidth: "1296px", margin: "0 auto" }}>
//           <div style={{ textAlign: "center", paddingLeft: "1rem", paddingRight: "1rem" }}>
//             <h2
//               style={{
//                 fontFamily: "Monument Extended, sans-serif",
//                 fontWeight: 400,
//                 fontSize: "24px",
//                 lineHeight: "110%",
//                 color: "#1A1A1A",
//                 margin: 0,
//               }}
//             >
//               Built on Advanced AI & Computer Vision
//             </h2>
//             <p
//               style={{
//                 fontFamily: "Manrope, sans-serif",
//                 fontWeight: 400,
//                 fontSize: "14px",
//                 lineHeight: "130%",
//                 color: "#6E6E6EB2",
//                 marginTop: "12px",
//               }}
//             >
//               Our technology analyzes every pixel, shape, and proportion — delivering accurate measurements without manual input.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ marginTop: "24px" }}>
//             {features.map((feature, index) => (
//               <FeatureCard key={index} {...feature} index={index} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// function FeatureCard({ icon, title, description}: FeatureCard & { index: number }) {
//   return (
//     <div className="flex flex-col items-center text-center p-4 lg:p-6 bg-white rounded-xl hover:shadow-lg transition-shadow duration-300">
//       {/* Increased icon container size for mobile */}
//       <div className="w-32 h-32 flex items-center justify-center mb-4 lg:mb-6 p-2">
//         <div className="relative w-24 h-24">
//           {icon}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex flex-col items-center gap-3 lg:gap-4">
//         <h3 className="font-manrope font-semibold text-lg sm:text-xl lg:text-2xl leading-tight text-black">
//           {title}
//         </h3>
//         <p className="font-manrope font-light text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
//           {description}
//         </p>
//       </div>
//     </div>
//   )
// }

// export default AIFeaturesSection




"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface FeatureCard {
  icon: React.ReactNode
  iconSrc: string
  title: string
  description: string
}

const features: FeatureCard[] = [
  {
    icon: (
      <Image
        src="/assets/fram66.png"
        alt="Machine Learning"
        width={100}
        height={100}
        style={{ objectFit: "contain" }}
      />
    ),
    iconSrc: "/assets/fram66.png",
    title: "Machine Learning Algorithms",
    description: "Our system learns from thousands of data samples to improve measurement accuracy over time.",
  },
  {
    icon: (
      <Image
        src="/assets/Frame 249.png"
        alt="Computer Vision"
        width={100}
        height={100}
        style={{ objectFit: "contain" }}
      />
    ),
    iconSrc: "/assets/Frame 249.png",
    title: "Computer Vision Detection",
    description: "Detects edges, contours, and reference points in your image to calculate dimensions precisely.",
  },
  {
    icon: (
      <Image
        src="/assets/fram333.png"
        alt="Smart Calibration"
        width={100}
        height={100}
        style={{ objectFit: "contain" }}
      />
    ),
    iconSrc: "/assets/fram333.png",
    title: "Smart Calibration",
    description:
      "Uses object or body ratios and context clues (like posture or object placement) to auto-correct angles and perspective.",
  },
  {
    icon: (
      <Image
        src="/assets/Frame 249 (1).png"
        alt="Data Privacy"
        width={100}
        height={100}
        style={{ objectFit: "contain" }}
      />
    ),
    iconSrc: "/assets/Frame 249 (1).png",
    title: "Data Privacy",
    description: "All processing happens securely – your uploaded images are not stored or shared.",
  },
]

export function AIFeaturesSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="w-full">
      <style jsx>{`
        /* Desktop styles */
        @media (min-width: 768px) {
          .section-container {
            width: 1296px;
            height: 637px;
            margin: 0 auto;
            position: relative;
          }
          
          .header-container {
            width: 566px;
            height: 156px;
            position: absolute;
            left: 377px;
            gap: 16px;
          }
          
          .features-container {
            width: 1296px;
            height: 381px;
            position: absolute;
            top: 256px;
            display: flex;
            gap: 28px;
          }
          
          .feature-card {
            width: 303px;
            height: 381px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 30px;
          }
          
          .icon-wrapper {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .section-title {
            font-family: "Monument Extended, sans-serif";
            font-weight: 400;
            font-size: 36px;
            line-height: 100%;
            text-align: center;
            color: #1A1A1A;
            width: 566px;
            height: 86px;
            margin: 0;
          }
          
          .section-subtitle {
            font-family: "Manrope, sans-serif";
            font-weight: 400;
            font-size: 20px;
            line-height: 100%;
            text-align: center;
            color: #6E6E6EB2;
            width: 566px;
            height: 54px;
            margin-top: 16px;
          }
          
          .feature-title {
            font-family: "Manrope, sans-serif";
            font-weight: 500;
            font-size: 28px;
            line-height: 100%;
            text-align: center;
            color: #1A1A1A;
            width: 239px;
            height: 76px;
            margin: 0;
          }
          
          .feature-description {
            font-family: "Manrope, sans-serif";
            font-weight: 300;
            font-size: 20px;
            line-height: 100%;
            text-align: center;
            color: #6E6E6EB2;
            width: 303px;
            height: 81px;
            margin: 0;
          }
        }
        
        /* Mobile styles */
        @media (max-width: 767px) {
          .container-mobile {
            width: 100%;
            padding: 40px 20px 60px 20px;
            min-height: auto;
          }
          
          .section-container-mobile {
            width: 100%;
            height: auto;
          }
          
          .header-container-mobile {
            width: 284px;
            height: auto;
            margin: 0 auto 40px auto;
            text-align: center;
          }
          
          .features-container-mobile {
            width: 100%;
            height: auto;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          
          .mobile-cards {
            width: 310px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .card-mobile {
            width: 310px;
            height: 250px;
            // border-radius: 10px;
            // border: 1px solid #E4D8F3;
            // box-shadow: 0px 4px 16px 0px #1A1A1A40;
            background: #FFFFFF;
            position: relative;
          }
          
          .icon-container-mobile {
            width: 66px;
            height: 66px;
            position: absolute;
            top: 30px;
            left: 30px;
            border-radius: 33px;
            background: #FCFBFE;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 13px;
          }
          
          .text-container-mobile {
            width: 250px;
            height: 119px;
            position: absolute;
            top: 116px;
            left: 30px;
            gap: 18px;
          }
          
          .card-title-mobile {
            width: 250px;
            height: auto;
            font-family: "Manrope", sans-serif;
            font-weight: 500;
            font-size: 18px;
            line-height: 110%;
            color: #1A1A1A;
            margin-bottom: 12px;
          }
          
          .card-description-mobile {
            width: 250px;
            height: auto;
            font-family: "Manrope", sans-serif;
            font-weight: 300;
            font-size: 14px;
            line-height: 130%;
            color: #6E6E6EB2;
          }
          
          .section-title-mobile {
            width: 284px;
            height: auto;
            font-family: "Monument Extended", sans-serif;
            font-size: 24px;
            font-weight: 400;
            line-height: 100%;
            color: #1A1A1A;
            margin: 0;
            margin-bottom: 16px;
          }
          
          .section-subtitle-mobile {
            width: 284px;
            height: auto;
            font-family: "Manrope", sans-serif;
            font-weight: 400;
            font-size: 16px;
            line-height: 120%;
            text-align: center;
            color: #6E6E6EB2;
            margin: 0;
          }
        }
      `}</style>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="section-container">
          <div className="header-container">
            <h2 className="section-title">
              Built on Advanced AI & Computer Vision
            </h2>
            <p className="section-subtitle">
              Our technology analyzes every pixel, shape, and proportion — delivering accurate measurements without manual input.
            </p>
          </div>

          <div className="features-container">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden container-mobile">
        <div className="section-container-mobile">
          <div className="header-container-mobile">
            <h2 className="section-title-mobile">
              Built on Advanced AI & Computer Vision
            </h2>
            <p className="section-subtitle-mobile">
              Our technology analyzes every pixel, shape, and proportion — delivering accurate measurements without manual input.
            </p>
          </div>

          <div className="features-container-mobile">
            <div className="mobile-cards">
              {features.map((feature, index) => (
                <div key={index} className="card-mobile">
                  <div className="icon-container-mobile">
                    <Image 
                      src={feature.iconSrc} 
                      alt="" 
                      width={100}
                      height={100}
                      style={{
                        borderRadius: "33px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  
                  <div className="text-container-mobile">
                    <h3 className="card-title-mobile">
                      {feature.title}
                    </h3>
                    <p className="card-description-mobile">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIFeaturesSection