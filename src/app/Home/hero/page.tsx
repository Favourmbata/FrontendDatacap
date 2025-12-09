"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const HeroSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleMeasurementChoice = (type: 'yourself' | 'object') => {
    // Redirect to upload-image page with type parameter
    router.push(`/upload-image?type=${type}`)
    setShowModal(false)
  }

  return (
    <section 
      id="hero-section" 
      className="relative"
      style={{
        width: "100%",
        background: "#F4EFFA",
        position: "relative",
      }}
    >
      {/* Desktop Modal - Only shows on desktop screens */}
      {showModal && (
        <div className="hidden md:block">
          {/* Overlay for closing modal */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content - Desktop positioning */}
          <div 
            className="absolute z-50"
            style={{
              width: "214px",
              height: "98px",
              top: "390px",
              left: "1191px",
              borderRadius: "10px",
              border: "1px solid #5D2A8B",
              paddingTop: "12px",
              paddingRight: "20px",
              paddingBottom: "12px",
              paddingLeft: "20px",
              gap: "6px",
              boxShadow: "0px 4px 4px 0px #5D2A8B1A",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Measure Yourself */}
            <button
              onClick={() => handleMeasurementChoice('yourself')}
              style={{
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                textUnderlineOffset: "15%",
                color: "#1A1A1A",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                width: "159px",
                height: "27px",
              }}
            >
              Measure Yourself
            </button>

            {/* Measure an Object */}
            <button
              onClick={() => handleMeasurementChoice('object')}
              style={{
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                textUnderlineOffset: "15%",
                color: "#1A1A1A",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                width: "174px",
                height: "27px",
              }}
            >
              Measure an Object
            </button>
          </div>
        </div>
      )}

      {/* Mobile Modal - Only shows on mobile screens */}
      {showModal && (
        <div className="md:hidden">
          {/* Overlay for closing modal */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content - Mobile positioning */}
          <div 
            className="fixed z-50"
            style={{
              width: "214px",
              height: "98px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "10px",
              border: "1px solid #5D2A8B",
              paddingTop: "12px",
              paddingRight: "20px",
              paddingBottom: "12px",
              paddingLeft: "20px",
              gap: "6px",
              boxShadow: "0px 4px 4px 0px #5D2A8B1A",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Measure Yourself */}
            <button
              onClick={() => handleMeasurementChoice('yourself')}
              style={{
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                textUnderlineOffset: "15%",
                color: "#1A1A1A",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                width: "159px",
                height: "27px",
              }}
            >
              Measure Yourself
            </button>

            {/* Measure an Object */}
            <button
              onClick={() => handleMeasurementChoice('object')}
              style={{
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                textUnderlineOffset: "15%",
                color: "#1A1A1A",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                width: "174px",
                height: "27px",
              }}
            >
              Measure an Object
            </button>
          </div>
        </div>
      )}

      {/* Desktop Hero */}
      <div 
        className="relative hidden md:block"
        style={{
          width: "1440px",
          height: "742px",
          margin: "0 auto",
          marginTop: "110px",
          marginBottom: "200px",
        }}
      >
        {/* Warm Icon - Overlapping with heading text */}
        <div 
          className="absolute"
          style={{
            top: "160px",
            left: "130px",
            zIndex: 5,
          }}
        >
          <Image
            src="/Warm.png"
            alt=""
            width={100}
            height={90}
            className="object-contain"
          />
        </div>

        {/* Spiral Icon - Right side near description */}
        <div 
          className="absolute"
          style={{
            top: "397px",
            left: "550px",
            zIndex: 5,
          }}
        >
          <Image
            src="/Spiral 1.png"
            alt=""
            width={90}
            height={90}
            className="object-contain"
          />
        </div>

        {/* Left Container */}
        <div 
          className="absolute"
          style={{
            width: "614px",
            height: "266px",
            top: "217px",
            left: "80px",
            gap: "20px",
          }}
        >
          {/* Heading */}
          <h1 
            className="text-[#1A1A1A] relative"
            style={{
              fontFamily: "Monument Extended",
              fontWeight: 400,
              fontSize: "50px",
              lineHeight: "100%",
              letterSpacing: "0%",
              width: "614px",
              height: "180px",
              marginBottom: "20px",
              zIndex: 10,
            }}
          >
            Smart, instant &<br />
            accurate way<br />
            to measure
          </h1>

          {/* Description */}
          <p 
            className="text-[#6E6E6EB2]"
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0%",
              width: "557px",
              height: "66px",
            }}
          >
            Upload a single image to get precise body or<br />
            object measurements with our AI-powered engine.
          </p>
        </div>

        {/* Right Container - Upload Card */}
        <div 
          className="absolute"
          style={{
            width: "518px",
            height: "459px",
            top: "160px",
            left: "830px",
            borderRadius: "20px",
            boxShadow: "0px 8px 24px 0px #5D2A8B1A",
            background: "#FFFFFF",
          }}
        >
          {/* Inner Container with Dashed Border */}
          <div 
            className="absolute bg-[#F4EFFA]"
            style={{
              width: "421px",
              height: "346px",
              top: "52px",
              left: "49px",
              borderRadius: "20px",
              border: "1px dashed #EB83FF",
            }}
          >
            <>
              {/* Left Image */}
              <div 
                className="absolute"
                style={{
                  width: "167px",
                  height: "251px",
                  top: "25px",
                  left: "-2px",
                }}
              >
                <Image
                  src="/gbarkz-vqKnuG8GaQc-unsplash-removebg-preview 1.png"
                  alt="silhouette"
                  width={167}
                  height={251}
                  className="object-contain"
                />
              </div>

              {/* Right Image */}
              <div 
                className="absolute"
                style={{
                  width: "200.49px",
                  height: "300.74px",
                  top: "1px",
                  left: "242px",
                }}
              >
                <Image
                  src="/recha-oktaviani-t__61ap00Mc-unsplash-removebg-preview 1.png"
                  alt="object"
                  width={200}
                  height={301}
                  className="object-contain"
                />
              </div>

              {/* Upload Button and Text */}
              <div 
                className="absolute"
                style={{
                  width: "173px",
                  height: "91.48px",
                  top: "222px",
                  left: "124px",
                  gap: "12px",
                }}
              >
                {/* Upload Button */}
                <label className="cursor-pointer inline-block">
                  <div
                    role="button"
                    aria-label="Upload Image"
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center bg-[#5D2A8B] text-white transition-all duration-300 ease-in-out"
                    style={{
                      width: "173px",
                      height: "41.48px",
                      borderRadius: "20px",
                      padding: "7.24px 13.57px",
                      gap: "10.86px",
                      border: "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "scale(1.06)"
                      el.style.boxShadow = "0 14px 36px rgba(93,42,139,0.3)"
                      el.style.border = "2px solid #C8A2E0"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "scale(1)"
                      el.style.boxShadow = "none"
                      el.style.border = "2px solid transparent"
                    }}
                    onMouseDown={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "scale(0.98)"
                    }}
                    onMouseUp={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "scale(1.06)"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "100%",
                      }}
                    >
                      Capture Image
                    </span>
                   <svg
  className="w-4 h-4 inline-block"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5l8 7-8 7" />
</svg>



                  </div>
                </label>

{/*                  
                <p 
                  className="text-center"
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#6E6E6EB2",
                    width: "160px",
                    height: "38px",
                    margin: "12px auto 0",
                  }}
                >
                  or paste your file <span style={{ textDecoration: "underline" }}>here</span>
                </p> */}
              </div>
            </>
          </div>
        </div>

        {/* Privacy Message */}
        <div 
          className="absolute text-[#6E6E6EB2] text-center"
          style={{
            width: "518px",
            height: "38px",
            top: "635px",
            left: "831px",
            fontFamily: "Manrope",
            fontWeight: 300,
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          &quot;Images are processed securely and deleted after 3 hours. No training on user data.&quot;
        </div>
      </div>

      {/* Mobile Hero */}
      <div 
        className="relative md:hidden"
        style={{
          width: "390px",
          margin: "0 auto",
          marginTop: "102px",
          paddingBottom: "60px",
        }}
      >
        {/* Left Container - Text Content */}
        <div 
          className="relative"
          style={{
            width: "311px",
            margin: "0 auto",
            paddingTop: "68px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Warm Icon - Mobile (overlapping with heading text, like desktop) */}
          <div 
            className="absolute"
            style={{
              top: "58px",
              left: "10px",
              zIndex: 1,
            }}
          >
            <Image
              src="/Warm.png"
              alt=""
              width={50}
              height={45}
              className="object-contain"
            />
          </div>

          {/* Spiral Icon - Mobile (right side near description, like desktop) */}
          <div 
            className="absolute"
            style={{
              top: "200px",
              right: "10px",
              zIndex: 1,
            }}
          >
            <Image
              src="/Spiral 1.png"
              alt=""
              width={45}
              height={45}
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h1 
            className="text-[#1A1A1A] text-center relative"
            style={{
              fontFamily: "Monument Extended",
              fontWeight: 400,
              fontSize: "30px",
              lineHeight: "100%",
              letterSpacing: "0%",
              width: "311px",
              height: "144px",
              zIndex: 2,
            }}
          >
            Smart, instant &<br />
            accurate way<br />
            to measure
          </h1>

          {/* Description */}
          <p 
            className="text-[#6E6E6EB2] text-center relative"
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "110%",
              letterSpacing: "0%",
              width: "311px",
              zIndex: 2,
            }}
          >
            Capture a single image to get precise body or object measurements with our AI-powered engine.
          </p>
        </div>

        {/* Image Container - Upload Card */}
        <div 
          style={{
            width: "310px",
            height: "274px",
            margin: "46px auto 0",
            borderRadius: "15px",
            boxShadow: "0px 8px 24px 0px #5D2A8B1A",
            background: "#FFFFFF",
            position: "relative",
          }}
        >
          {/* Inner Container with Dashed Border */}
          <div 
            className="bg-[#F4EFFA]"
            style={{
              width: "252px",
              height: "207px",
              position: "absolute",
              top: "31px",
              left: "29px",
              borderRadius: "15px",
              border: "1px dashed #EB83FF",
            }}
          >
            <>
              {/* Left Image */}
              <div 
                className="absolute"
                style={{
                  width: "100px",
                  height: "150px",
                  top: "15px",
                  left: "-2px",
                }}
              >
                <Image
                  src="/gbarkz-vqKnuG8GaQc-unsplash-removebg-preview 1.png"
                  alt="silhouette"
                  width={100}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Right Image */}
              <div 
                className="absolute"
                style={{
                  width: "120px",
                  height: "180px",
                  top: "1px",
                  right: "-2px",
                }}
              >
                <Image
                  src="/recha-oktaviani-t__61ap00Mc-unsplash-removebg-preview 1.png"
                  alt="object"
                  width={120}
                  height={180}
                  className="object-contain"
                />
              </div>

              {/* Upload Button */}
              <div 
                className="absolute"
                style={{
                  bottom: "15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <label className="cursor-pointer inline-block">
                  <div
                    role="button"
                    aria-label="Upload Image"
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center bg-[#5D2A8B] text-white transition-all duration-300 ease-in-out"
                    style={{
                      width: "130px",
                      height: "36px",
                      borderRadius: "18px",
                      padding: "6px 12px",
                      border: "2px solid transparent",
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "100%",
                      gap: "6px",
                    }}
                  >
                    <span>Capture Image</span>
                    <span style={{ fontSize: "14px" }}>›</span>
                  </div>
                </label>
              </div>
            </>
          </div>
        </div>

        {/* Privacy Message */}
        <div 
          className="text-[#6E6E6EB2] text-center"
          style={{
            width: "309px",
            margin: "10px auto 0",
            fontFamily: "Manrope",
            fontWeight: 300,
            fontSize: "12px",
            lineHeight: "120%",
            letterSpacing: "0%",
          }}
        >
          &quot;Images are processed securely and deleted after 3 hours. No training on user data.&quot;
        </div>
        
        {/* Mobile Measurement Options - Centered at bottom */}
        <div 
          className="flex justify-center gap-4 mt-6"
          style={{
            width: "311px",
            margin: "20px auto 0",
          }}
        >
          <button
            onClick={() => handleMeasurementChoice('yourself')}
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              textDecoration: "underline",
              textDecorationStyle: "solid",
              textUnderlineOffset: "15%",
              color: "#1A1A1A",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            Measure Yourself
          </button>
          <button
            onClick={() => handleMeasurementChoice('object')}
            style={{
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              textDecoration: "underline",
              textDecorationStyle: "solid",
              textUnderlineOffset: "15%",
              color: "#1A1A1A",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            Measure an Object
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection