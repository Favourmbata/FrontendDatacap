
"use client"

import Image from "next/image";

const HeroBanner = () => {
  return (
    <div id="feature-hero" className="relative bg-[#F4EFFA]">
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-container {
            width: 100% !important;
            min-height: 800px !important;
            padding: 0 !important;
            position: relative !important;
          }
          .hero-content {
            position: absolute !important;
            width: 100% !important;
            height: auto !important;
            top: 170px !important;
            left: 0 !important;
            gap: 20px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-text {
            width: 311px !important;
            height: 230px !important;
            gap: 20px !important;
            text-align: center !important;
          }
          .hero-title {
            width: 311px !important;
            height: 144px !important;
            font-size: 30px !important;
            line-height: 100% !important;
            text-align: center !important;
          }
          .hero-description {
            width: 311px !important;
            height: 66px !important;
            font-size: 16px !important;
            line-height: 120% !important;
            text-align: center !important;
            margin-top: 0 !important;
          }
          .hero-description span {
            display: inline !important;
            margin-top: 0 !important;
          }
          /* Moved button further up - from 370px to 330px */
          .hero-button-wrapper {
            position: absolute !important;
            width: 103px !important;
            height: 34px !important;
            top: 260px !important; /* Changed from 370px to 330px (moved up 40px) */
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 10 !important;
          }
          .hero-button {
            width: 103px !important;
            height: 34px !important;
            gap: 6.48px !important;
            border-radius: 20px !important;
            padding: 6px 14px !important;
            margin: 0 !important;
          }
          .hero-button span {
            font-size: 14px !important;
          }
          .hero-images {
            position: absolute !important;
            width: 301.654296875px !important;
            height: 220px !important;
            top: 520px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          .hero-bg-image {
            display: block !important;
            position: absolute !important;
            width: 125.70862579345703px !important;
            height: 188.610107421875px !important;
            top: 17.77px !important;
            left: 20px !important;
            opacity: 0.5 !important;
            z-index: 1 !important;
          }
          .hero-main-image {
            position: absolute !important;
            width: 165.07275390625px !important;
            height: 198.16900634765625px !important;
            top: 14.24px !important;
            left: 125px !important;
            z-index: 2 !important;
          }
        }
      `}</style>
      <div
        className="hero-container relative mx-auto"
        style={{ width: "1440px", minHeight: "640px" }}
      >
        <div
          className="hero-content absolute"
          style={{
            width: "614px",
            height: "381.89617919921875px",
            top: "217px",
            left: "80px",
            gap: "60px",
          }}
        >
          <div
            className="hero-text flex flex-col"
            style={{ width: "614px", height: "266px", gap: "20px" }}
          >
            <h1
              className="hero-title font-normal"
              style={{
                fontFamily: 'Monument Extended, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: "50px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#1A1A1A",
              }}
            >
              Smart features
              <br />
              for effortless
              <br />
              precision
            </h1>
            <p
              className="hero-description"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '24px',
                lineHeight: '130%',
                letterSpacing: '0%',
                color: '#6E6E6EB2',
                marginTop: '10px',
              }}
            >
              Experience AI-powered tools that make measuring
              <span style={{ display: 'block', marginTop: '12px' }}>
                faster, easier, and more accurate than ever
              </span>
            </p>
          </div>
          <div
            className="hero-button-wrapper"
            style={{
              width: "237.7393035888672px",
              height: "55.89617919921875px",
            }}
          >
            <button
              className="hero-button"
              style={{
                width: "237.74px",
                height: "55.9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14.92px",
                borderRadius: "29.84px",
                padding: "0 18.65px",
                background: "#5D2A8B",
                marginTop: "20px",       
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "26px",
                  lineHeight: "1",
                  color: "#FFFFFF",
                }}
              >
                Try it Now
              </span>
            </button>
          </div>
        </div>
        <div
          className="hero-images absolute"
          style={{
            width: "713px",
            height: "520px",
            top: "119px",
            left: "679px",
            position: "absolute",
          }}
        >
          <div
            className="hero-bg-image absolute"
            style={{ width: "297px", height: "446px", top: "42px", left: "0px", opacity: 0.5 }}
          >
            <Image
              alt=""
              src="/assets/freepik__background__98107 1.png"
              width={297}
              height={446}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div
            className="hero-main-image absolute"
            style={{ width: "520px", height: "520px", top: "0px", left: "193px" }}
          >
            <Image
              alt=""
              src="/assets/Get Inspired Streamline Bangalore - Free.png"
              width={520}
              height={520}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;