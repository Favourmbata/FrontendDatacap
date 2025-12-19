import { memo } from "react";
import Image from "next/image";

const Features = () => {
  const features = [
    {
      title: "Multi-object measurement",
      description: "Measure people or objects from a single image upload.",
      icon: "/Ruler Streamline Tabler Line.png",
    },
    {
      title: "Create questionnaire for clients",
      description: "Collect data from clients",
      icon: "/Vector.png",
    },
    {
      title: "Privacy-first system",
      description: "Your data stays yours",
      icon: "/Vector (1).png",
    },
    {
      title: "Cross-platform support",
      description: "Simple, fast, and intuitive. No setup needed on any device.",
      icon: "/Electric Bolt Streamline Rounded Line - Material Pro Free.png",
    },
  ];

  return (
    <section className="py-20 bg-white flex flex-col items-center  mb-[200ppx]">
      {/* Desktop Header Section */}
      <div 
        className="text-center mb-12 hidden md:block"
        style={{
          width: "532px",
          height: "113px",
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
            width: "532px",
            height: "43px",
            marginBottom: "16px",
          }}
        >
          Our features
        </h2>
        <p
          className="text-[#6E6E6EB2]"
          style={{
            fontFamily: "Manrope",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            width: "532px",
            height: "54px",
          }}
        >
          Our core tools built with intelligent features that make precision effortless.
        </p>
      </div>

      {/* Mobile Header Section */}
      <div 
        className="text-center mb-12 md:hidden"
        style={{
          width: "290px",
          margin: "0 auto 50px",
        }}
      >
        <h2
          className="text-[#1A1A1A]"
          style={{
            fontFamily: "Monument Extended",
            fontWeight: 400,
            fontSize: "24px",
            lineHeight: "100%",
            letterSpacing: "0%",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Our features
        </h2>
        <p
          className="text-[#6E6E6EB2]"
          style={{
            fontFamily: "Manrope",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "130%",
            letterSpacing: "0%",
            textAlign: "center",
          }}
        >
          Our core tools built with intelligent features that make precision effortless.
        </p>
      </div>

      {/* Desktop Inner colored background container */}
      <div
        className="bg-[#F4EFFA] rounded-[20px] justify-center items-center hidden md:flex"
        style={{
          width: "1255px",
          height: "876px",
        }}
      >
        {/* Cards Layout - Two Rows */}
        <div
          className="flex flex-col"
          style={{
            gap: "38px",
          }}
        >
          {/* First Row */}
          <div
            className="flex"
            style={{
              width: "980px",
              height: "325px",
              gap: "80px",
            }}
          >
            {features.slice(0, 2).map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] flex flex-col items-center text-center"
                style={{
                  width: "450px",
                  height: "325px",
                  boxShadow: "0px 4px 16px 0px #5D2A8B1A",
                  padding: "58px 40px 40px",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-6"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={100}
                    height={100}
                    style={{ objectFit: "contain" }}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 
                    className="text-[#1A1A1A] mb-3"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "18px",
                      font: "semibold",
                      lineHeight: "100%",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-[#6E6E6EB2]"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "140%",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div
            className="flex"
            style={{
              width: "980px",
              height: "325px",
              gap: "80px",
            }}
          >
            {features.slice(2, 4).map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] flex flex-col items-center text-center"
                style={{
                  width: "450px",
                  height: "325px",
                  boxShadow: "0px 4px 16px 0px #5D2A8B1A",
                  padding: "58px 40px 40px",
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-6"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={100}
                    height={100}
                   
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 
                    className="text-[#1A1A1A] mb-3"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "18px",
                      lineHeight: "100%",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-[#6E6E6EB2]"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "140%",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cards Container */}
      <div
        className="md:hidden flex flex-col items-center"
        style={{
          width: "100%",
          maxWidth: "390px",
          margin: "0 auto",
          gap: "20px",
          backgroundColor: "#F4EFFA",
          padding: "28px",
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[11.63px] flex items-start"
            style={{
              width: "309px",
              height: "140px",
              boxShadow: "0px 2.33px 9.3px 0px #5D2A8B1A",
              padding: "22px",
              gap: "16px",
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                marginTop:"20px"
              }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Text */}
                <div style={{ flex: 1 }}>
              <h3 
                className="text-[#1A1A1A]"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "18px",
                  lineHeight: "120%",
                  letterSpacing: "0%",
                  margin: 0,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {feature.title === "Cross-platform support" ? (
                  <>
                    Cross-platform<br />support
                  </>
                ) : (
                  feature.title
                )}
              </h3>
              <p 
                className="text-[#6E6E6EB2]"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  margin: 0,
                  marginTop: "14px",
                }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(Features);
