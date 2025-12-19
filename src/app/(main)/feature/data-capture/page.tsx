

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const DataCapturingRealWorld = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const useCases = [
    {
      id: 1,
      title: "Fashion & Retail",
      description: "Designers and brands use it for accurate sizing, reducing returns.",
      image: "/assets/unsplash_77Ga1TXf3vQ.png",
    },
    {
      id: 2,
      title: "Engineering & Design",
      description: "Used to capture precise measurements, improve product accuracy, and speed up the design process.",
      image: "/assets/engineering-design.png",
    },
    {
      id: 3,
      title: "Fitness & Wellness",
      description: "Helps trainers and users track body changes, set goals, and personalize workout plans.",
      image: "/assets/fitness.png",
    },
    {
      id: 4,
      title: "Interior Planning",
      description: "Enables quick room measurements, accurate layout planning, and better visualization of furniture and space.",
      image: "/assets/interion-planing.png",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index);
  };

  // Get the active item (default to first item if none is active)
  const activeItem = activeIndex !== null ? useCases[activeIndex] : useCases[0];

  // Get only the items that are NOT active
  const inactiveItems = useCases.filter((_, idx) => idx !== activeIndex);

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

 // Update the mobile version section
if (isMobile) {
  return (
    <section
      className="relative bg-[#F4EFFA]"
      style={{ 
        width: "100%", 
        minHeight: "auto", 
        margin: "0 auto", 
        padding: "40px 20px 60px 20px"
      }}
    >
      {/* Main Header - Always visible */}
      <div
        style={{
          width: "299px",
          height: "auto",
          margin: "0 auto 40px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <h2
          style={{
            width: "299px",
            height: "auto",
            fontFamily: "Monument Extended, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "24px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          How data capturing works in the real world
        </h2>
        <p
          style={{
            width: "299px",
            height: "auto",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#6E6E6EB2",
            margin: 0,
          }}
        >
          Designed for versatility — empowering individuals and professionals across industries to measure smarter.
        </p>
      </div>

      {/* Border between header and content */}
      <div style={{ 
        width: "351px", 
        margin: "0 auto",
        borderTop: "1px solid #E4D8F3",
      }} />

      {/* Content Area */}
      <div style={{ 
        width: "351px", 
        margin: "0 auto",
      }}>
        {/* All Items as Accordion */}
        {useCases.map((item, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div key={item.id}>
              {/* Item Row - Always visible */}
              <div
                style={{ 
                  width: "351px",
                  minHeight: "81px",
                  borderTop: index === 0 ? "none" : "1px solid #E4D8F3",
                  display: "flex", 
                  alignItems: "flex-start",
                  cursor: "pointer",
                  padding: isActive ? "20px 0 16px 0" : "20px 0",
                  backgroundColor: "transparent",
                }}
                onClick={() => toggleAccordion(index)}
              >
                {/* Number */}
                <div 
                  style={{ 
                    width: "28px", 
                    color: "#1A1A1A",
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    flexShrink: 0,
                    marginRight: "16px",
                    marginLeft: "0",
                  }}
                >
                  {item.id}
                </div>
                
                {/* Title and Description Container */}
                <div style={{ 
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "16px",
                }}>
                  {/* Title - Always visible */}
                  <div
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: isActive ? "20px" : "18px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#000000",
                      marginBottom: isActive ? "8px" : "0",
                    }}
                  >
                    {item.title}
                  </div>
                  
                  {/* Description - Only visible when active */}
                  {isActive && (
                    <div
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 300,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "140%",
                        letterSpacing: "0%",
                        color: "#666666B2",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
                
                {/* Plus/Minus Icon */}
                <div style={{ 
                  width: "16px",
                  height: "16px",
                  position: "relative",
                  flexShrink: 0,
                  marginTop: "4px",
                }}>
                  {isActive ? (
                    // Minus icon for active item
                    <div style={{ 
                      position: "absolute", 
                      top: "7px", 
                      left: "0px", 
                      right: "0px", 
                      borderTop: "2.2px solid #000000" 
                    }} />
                  ) : (
                    // Plus icon for inactive items
                    <>
                      <div style={{ 
                        position: "absolute", 
                        top: "7px", 
                        left: "0px", 
                        right: "0px", 
                        borderTop: "2.2px solid #000000" 
                      }} />
                      <div style={{ 
                        position: "absolute", 
                        left: "7px", 
                        top: "0px", 
                        bottom: "0px", 
                        borderLeft: "2.2px solid #000000" 
                      }} />
                    </>
                  )}
                </div>
              </div>
              
              {/* Image Container - Only appears below the active item */}
              {isActive && (
                <>
                  {/* Border between content and image */}
                  <div style={{ 
                    width: "351px",
                    borderTop: "1px solid #E4D8F3",
                    margin: "0 0 20px 0",
                  }} />
                  
                  {/* Image Container */}
                  <div
                    style={{ 
                      width: "351px", 
                      height: "250px",
                      margin: "0 auto 20px auto",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        borderRadius: "10px", 
                        overflow: "hidden", 
                        border: "3px solid rgba(255, 255, 255, 0.7)",
                        boxShadow: "0px 4px 16px 0px rgba(93, 42, 139, 0.1)",
                        boxSizing: "border-box",
                        position: "relative"
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ 
                          objectFit: "cover",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Border after image (if not the last item) */}
                  {index !== useCases.length - 1 && (
                    <div style={{ 
                      width: "351px",
                      borderTop: "1px solid #E4D8F3",
                      margin: "0 0 20px 0",
                    }} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

  // Desktop Version - Updated to match mobile behavior
  return (
    <section
      className="relative"
      style={{ 
        width: "1441px", 
        height: "871px", 
        margin: "0 auto", 
        background: "#F4EFFA",
      }}
    >
      {/* Main Header */}
      <div
        className="absolute"
        style={{
          width: "602px",
          height: "156px",
          top: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <h2
          style={{
            width: "602px",
            height: "86px",
            fontFamily: "Monument Extended, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "36px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            textWrap: "balance",
            color: "#1A1A1A",
          }}
        >
          How data capturing works in the real world
        </h2>
        <p
          style={{
            width: "602px",
            height: "54px",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "20px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#6E6E6EB2",
            margin: 0,
          }}
        >
          Designed for versatility — empowering individuals and professionals across industries to measure smarter.
        </p>
      </div>

      {/* Content Area with Borders */}
      <div
        className="absolute"
        style={{ 
          width: "1288px", 
          height: "450px", 
          top: "356px", 
          left: "80px",
        }}
      >
        {/* Border between header and image area */}
        <div style={{ 
          width: "100%",
          borderTop: "1px solid #E4D8F3",
          position: "absolute",
          top: "-17px",
        }} />

        {/* Image Section */}
        <div
          className="absolute"
          style={{ 
            width: "607px", 
            height: "416px", 
            top: "17px", 
            left: "0px", 
            borderRadius: "10px", 
            overflow: "hidden", 
            border: "7px solid #FFFFFF",
            boxSizing: "border-box" 
          }}
        >
          <Image
            src={activeItem.image}
            alt={activeItem.title}
            fill
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" 
            }}
          />
        </div>

        {/* Active Item Content on Right Side */}
        <div
          className="absolute"
          style={{ 
            width: "583px", 
            top: "17px", 
            left: "683px",
            padding: "33px 0",
            borderBottom: "1px solid #E4D8F3",
          }}
        >
          <div style={{ 
            display: "flex",
            alignItems: "flex-start",
          }}>
            {/* Active Item Number */}
            <div 
              style={{ 
                width: "28px", 
                color: "#1A1A1A",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                flexShrink: 0,
                marginRight: "16px",
              }}
            >
              {activeItem.id}
            </div>
            
            {/* Active Item Title and Description */}
            <div style={{ 
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              <div
                style={{
                  width: "341px",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 500,
                  fontStyle: "Medium",
                  fontSize: "24px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                {activeItem.title}
              </div>
              <div
                style={{
                  width: "341px",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 300,
                  fontStyle: "Light",
                  fontSize: "16px",
                  lineHeight: "140%", 
                  letterSpacing: "0%",
                  color: "#666666B2",
                  wordWrap: "break-word", 
                  whiteSpace: "normal", 
                }}
              >
                {activeItem.description}
              </div>
            </div>
            
            {/* Minus Icon for Active Item */}
            <div style={{ 
              width: "24px", 
              height: "24px", 
              position: "relative", 
              flexShrink: 0,
              marginTop: "4px",
            }}>
              <div style={{ 
                position: "absolute", 
                top: "11px", 
                left: "0px", 
                right: "0px", 
                borderTop: "2.2px solid #000000" 
              }} />
            </div>
          </div>
        </div>

        {/* Inactive Items List on Right Side */}
        <div
          className="absolute"
          style={{ 
            width: "583px", 
            top: "160px", 
            left: "683px",
          }}
        >
          {inactiveItems.map((item, idx) => {
            // Find the original index
            const originalIndex = useCases.findIndex(useCase => useCase.id === item.id);
            
            return (
              <div
                key={item.id}
                style={{ 
                  width: "583px", 
                  height: "81px", 
                  borderTop: idx === 0 ? "none" : "1px solid #E4D8F3", 
                  display: "flex", 
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "0",
                  backgroundColor: "transparent",
                }}
                onClick={() => toggleAccordion(originalIndex)}
              >
                <div 
                  style={{ 
                    width: "28px", 
                    color: "#1A1A1A",
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    flexShrink: 0, 
                    marginLeft: "0",
                  }}
                >
                  {item.id}
                </div>
                <div style={{ 
                  marginLeft: "16px", 
                  flex: 1,
                  minWidth: 0, 
                }}>
                  <div
                    style={{
                      width: "341px",
                      height: "33px",
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontStyle: "Medium",
                      fontSize: "24px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#000000",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.title}
                  </div>
                </div>
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  position: "relative", 
                  flexShrink: 0, 
                }}>
                  <div style={{ 
                    position: "absolute", 
                    top: "11px", 
                    left: "0px", 
                    right: "0px", 
                    borderTop: "2.2px solid #000000" 
                  }} />
                  <div style={{ 
                    position: "absolute", 
                    left: "11px", 
                    top: "0px", 
                    bottom: "0px", 
                    borderLeft: "2.2px solid #000000" 
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DataCapturingRealWorld;