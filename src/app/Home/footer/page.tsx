"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const handleUploadClick = () => {
    router.push("/upload-image");
  };

  return (
    <div className="relative">
      {/* ---------- DESKTOP (unchanged) ---------- */}
      <div className="hidden lg:block">
        {/* Ready to Capture Section - Positioned on top of footer */}
        <div
          className="relative z-10 flex justify-center -mb-20"
          style={{ paddingLeft: "92px", paddingRight: "92px" }}
        >
          <div
            className="bg-[#5D2A8B] text-white shadow-lg rounded-[20px]"
            style={{
              width: "1255px",
              height: "236px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 72px 0 80px",
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <h2
                  className="text-white mb-4"
                  style={{
                    fontFamily: "Monument Extended",
                    fontWeight: 400,
                    fontSize: "36px",
                    lineHeight: "100%",
                  }}
                >
                  Ready to capture now?
                </h2>
                <p
                  className="text-white opacity-90"
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: "20px",
                    lineHeight: "100%",
                  }}
                >
                  Experience instant, accurate measurements with AI.
                </p>
              </div>

              <button
                onClick={handleUploadClick}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.06)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 14px 36px rgba(255,255,255,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "2px solid #C8A2E0";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "2px solid transparent";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.06)";
                }}
                className="bg-white text-[#5D2A8B] px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out cursor-pointer"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 600,
                  fontSize: "16px",
                  transformOrigin: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "2px solid transparent",
                }}
              >
                Capture Image
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <footer className="bg-[#f7f4fa] text-gray-700 pt-32 pb-8">
          <div className="relative mx-auto" style={{ width: "1440px" }}>
            <div
              className="flex justify-between items-start border-b border-gray-300 pb-6 mb-4"
              style={{ paddingLeft: "80px", paddingRight: "80px" }}
            >
              {/* Logo - Aligned with navbar logo */}
              <div className="flex items-start">
                <Link href="/" className="inline-block">
                  <Image
                    src="/assets/vetra.png"
                    alt="Brand Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </Link>
              </div>

              {/* Quick Links & Contact */}
              <div className="flex gap-16">
                {/* Quick Links */}
                <div style={{ width: "102px" }}>
                  <h3
                    className="font-manrope font-semibold text-[#1A1A1A] mb-5"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "24px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Quick links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="hover:text-[#5D2A8B] transition-colors"
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0.05em",
                          color: "#6E6E6EB2",
                        }}
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-[#5D2A8B] transition-colors"
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0.05em",
                          color: "#6E6E6EB2",
                        }}
                      >
                        How it works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="hover:text-[#5D2A8B] transition-colors"
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0.05em",
                          color: "#6E6E6EB2",
                        }}
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Section */}
                <div style={{ width: "235px" }}>
                  <h3
                    className="font-manrope font-semibold text-[#1A1A1A] mb-5"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "24px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Contact
                  </h3>
                  <ul className="space-y-2">
                    <li
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0.05em",
                        color: "#6E6E6EB2",
                      }}
                    >
                      (+234) 08097227051
                    </li>
                    <li>
                      <a
                        href="mailto:DC@emailaddress.com.ng"
                        className="hover:text-[#5D2A8B] transition-colors"
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0.05em",
                          color: "#6E6E6EB2",
                        }}
                      >
                        Gamai@raoatech.com
                      </a>
                    </li>
                    <li
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0.05em",
                        color: "#6E6E6EB2",
                      }}
                    >
                      1A, Huges Avenue, <br />
                      Alagomeji, Yaba, Lagos state.<br />
                      Nigeria.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom line */}
            <div
              className="text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center"
              style={{ paddingLeft: "80px", paddingRight: "80px" }}
            >
              <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
                <Link
                  href="#"
                  className="hover:text-[#5D2A8B] transition-colors"
                >
                  Legal
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#5D2A8B] transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#5D2A8B] transition-colors"
                >
                  Terms of Services
                </Link>
              </div>
              <p>© {currentYear} Powered by Raoatech. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* ---------- MOBILE: Figma-accurate layout (adjusted) ---------- */}
      <div className="lg:hidden flex justify-center">
        <div style={{ width: 369 }}>
          {/* Purple card — 369 x 289, borderRadius 20 */}
          <div
            style={{
              width: 369,
              height: 289,
              background: "#5D2A8B",
              borderRadius: 20,
              paddingTop: 50, // matches figma top: 50px inside card for h/p
              boxSizing: "border-box",
            }}
            className="mx-auto"
          >
            {/* H and P container: width 311, height 118, centered horizontally */}
            <div
              style={{
                width: 311,
                height: 118,
                marginLeft: "auto",
                marginRight: "auto",
                gap: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {/* Heading: Monument Extended; 24px; centered */}
              <h3
                style={{
                  width: 311,
                  height: 58,
                  fontFamily: "Monument Extended, sans-serif",
                  fontWeight: 400,
                  fontSize: 24,
                  lineHeight: "100%",
                  textAlign: "center",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                Ready to capture{"\n"}now?
              </h3>

              {/* Paragraph: Manrope 16px, color #FFFFFFB2 */}
              <p
                style={{
                  width: 311,
                  height: 44,
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "100%",
                  textAlign: "center",
                  color: "#FFFFFFB2",
                  margin: 0,
                }}
              >
                Experience instant, accurate{"\n"}measurements with AI.
              </p>
            </div>

            {/* Button centered, beneath text; visually aligned with Figma */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <button
                onClick={handleUploadClick}
                aria-label="Take Image"
                style={{
                  borderRadius: 9999,
                  padding: "8px 20px",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  background: "#FFFFFF",
                  color: "#5D2A8B",
                  border: "none",
                }}
                className="shadow-sm active:scale-95"
              >
                Take Image
              </button>
            </div>
          </div>

          {/* Space */}
          <div style={{ height: 18 }} />

          {/* Divider line: width 311, 1px solid #6E6E6E4D */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 311,
                borderTop: "1px solid rgba(110,110,110,0.302)",
                opacity: 0.6,
              }}
            />
          </div>

         
          <div style={{ width: 313, marginLeft: "auto", marginRight: "auto", marginTop: 14 }}>
           
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            
              <div style={{ width: 102, height: 120 }}>
                <h4 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, margin: 0, marginBottom: 8 }}>
                  Quick links
                </h4>
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  <li>
                    <Link
                      href="#"
                      style={{ fontFamily: "Manrope", fontSize: 14, color: "rgba(110,110,110,0.7)", textDecoration: "none" }}
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      style={{ fontFamily: "Manrope", fontSize: 14, color: "rgba(110,110,110,0.7)", textDecoration: "none" }}
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      style={{ fontFamily: "Manrope", fontSize: 14, color: "rgba(110,110,110,0.7)", textDecoration: "none" }}
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>

              
              <div style={{ width: 155, height: 168 }}>
                <h4 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600, fontSize: 14, margin: 0, marginBottom: 8 }}>
                  Contact
                </h4>
                <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400, fontSize: 14, color: "rgba(110,110,110,0.7)", lineHeight: "24px", letterSpacing: "0.05em" }}>
                  <div style={{ marginBottom: 6, width: 142, height: 24 }}>+234) 809 722 7051</div>
                  <div style={{ marginBottom: 6, width: 155, height: 24 }}>
                    <a href="mailto:DC@emailaddress.com.ng" style={{ textDecoration: "none", color: "rgba(110,110,110,0.7)" }}>Gamai@raoatech.com</a>
                  </div>
                  <div style={{ width: 146, height: 72 }}>
                    1A, Huges Avenue,<br />
                    Alagomeji, Yaba,<br />
                    Lagos state, Nigeria.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link href="/" className="inline-block">
                  <Image src="/assets/vetra.png" alt="logo" width={100} height={79} />
                </Link>
              </div>
            </div>
          </div>

         
          <div style={{ marginTop: 16, width: 369, paddingBottom: 20 }}>
            <div style={{ width: 313, marginLeft: "auto", marginRight: "auto", fontSize: 12, color: "#9B9B9B" }}>
              <div style={{ borderTop: "1px solid rgba(110,110,110,0.12)", marginTop: 12, paddingTop: 12 }}>
                <div style={{ fontSize: 12, color: "#9B9B9B", marginBottom: 8 }}>
                  Legal  Privacy  Terms of Services
                </div>
                <div style={{ fontSize: 12, color: "#9B9B9B" }}>© {currentYear} Powered by Raoatech.</div>
                <div style={{ fontSize: 11, color: "#C0BFC0", marginTop: 6 }}>All rights reserved.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
