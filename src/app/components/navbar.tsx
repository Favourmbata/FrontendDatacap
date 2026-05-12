"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import DownloadAppModal from "./DownloadAppModal"


export default function Navbar() {
  const pathname = usePathname()
  const [isSignUpDropdownOpen, setIsSignUpDropdownOpen] = useState(false)
  const [navbarBackground, setNavbarBackground] = useState<string>("#F4EFFA")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  const shouldShowLinks = !pathname?.startsWith("/auth")

  const signUpOptions = [
    { label: "Sign up as an organization", href: "/auth/signup/admin" },
    { label: "Sign up as an individual", href: "/auth/signup/user" },
  ]

  useEffect(() => {
    const computeBackground = () => {
      if (pathname === "/feature") {
        const featureHero = document.getElementById("feature-hero")
        if (featureHero) {
          const bottom = featureHero.getBoundingClientRect().bottom
          setNavbarBackground(
            bottom <= 110
              ? "#FFFFFF"
              : "linear-gradient(180deg, #F4EFFA 0%, rgba(93, 42, 139, 0.1) 10%, #F4EFFA 100%)"
          )
          return
        }
      }

      if (pathname === "/howIt-works") {
        const howitHero = document.getElementById("howit-hero")
        if (howitHero) {
          const bottom = howitHero.getBoundingClientRect().bottom
          setNavbarBackground(
            bottom <= 110
              ? "#FFFFFF"
              : "linear-gradient(180deg, #F4EFFA 0%, rgba(93, 42, 139, 0.1) 10%, #F4EFFA 100%)"
          )
          return
        } else {
          setNavbarBackground("linear-gradient(180deg, #F4EFFA 0%, rgba(93, 42, 139, 0.1) 10%, #F4EFFA 100%)")
          return
        }
      }

      if (pathname === "/about") {
        const aboutHero = document.getElementById("about-hero")
        if (aboutHero) {
          const bottom = aboutHero.getBoundingClientRect().bottom
          setNavbarBackground(
            bottom <= 110
              ? "#FFFFFF"
              : "linear-gradient(180deg, #F4EFFA 0%, rgba(93, 42, 139, 0.1) 10%, #F4EFFA 100%)"
          )
          return
        } else {
          setNavbarBackground("linear-gradient(180deg, #F4EFFA 0%, rgba(93, 42, 139, 0.1) 10%, #F4EFFA 100%)")
          return
        }
      }

      const heroSection = document.getElementById("hero-section")
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        setNavbarBackground(heroBottom <= 110 ? "#FFFFFF" : "#F4EFFA")
      } else {
        setNavbarBackground("#F4EFFA")
      }
    }

    window.addEventListener("scroll", computeBackground)
    computeBackground()

    return () => window.removeEventListener("scroll", computeBackground)
  }, [pathname])

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        width: "100%",
        background: navbarBackground,
      }}
    >
      {/* Desktop Navbar */}
      <div 
        className="relative mx-auto hidden md:flex items-center justify-between px-8 lg:px-20 xl:px-24"
        style={{
          maxWidth: "1920px",
          height: "110px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/assets/vetra.png" alt="Brand Logo" width={180} height={180} className="object-contain" />
          </Link>
        </div>

        {shouldShowLinks && (
          <>
            {/* Navigation Links */}
            <nav 
              className="hidden lg:flex items-center gap-8 xl:gap-10"
            >
              <Link
                href="/feature"
                className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "100%",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline"
                  e.currentTarget.style.textDecorationThickness = "1px"
                  e.currentTarget.style.textUnderlineOffset = "4px"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none"
                }}
              >
                Features
              </Link>

              <Link
                href="/howIt-works"
                className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "100%",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline"
                  e.currentTarget.style.textDecorationThickness = "1px"
                  e.currentTarget.style.textUnderlineOffset = "4px"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none"
                }}
              >
                How it works
              </Link>

              <Link
                href="/about"
                className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "100%",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline"
                  e.currentTarget.style.textDecorationThickness = "1px"
                  e.currentTarget.style.textUnderlineOffset = "4px"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none"
                }}
              >
                About
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div 
              className="flex items-center gap-3 xl:gap-5"
            >
              {/* Download App button */}
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="flex items-center justify-center transition-all duration-200 hover:opacity-90"
                style={{
                  height: "40px",
                  borderRadius: "20px",
                  background: "#5D2A8B",
                  color: "#FFFFFF",
                  padding: "8px 16px",
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "14px",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Download App
              </button>

              {/* Download Guide button */}
              <Link
                href="/#download-guide"
                onClick={(e) => {
                  e.preventDefault()
                  const section = document.getElementById('download-guide')
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="flex items-center justify-center transition-all duration-200 hover:opacity-90"
                style={{
                  height: "40px",
                  borderRadius: "20px",
                  border: "1px solid #5D2A8B",
                  background: "transparent",
                  color: "#5D2A8B",
                  padding: "8px 16px",
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
              Download Guide
              </Link>

              {/* Sign Up dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSignUpDropdownOpen(!isSignUpDropdownOpen)}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    minWidth: "100px",
                    height: "40px",
                    borderRadius: "20px",
                    border: "1px solid #5D2A8B",
                    background: "transparent",
                    color: "#5D2A8B",
                    padding: "8px 10px",
                    gap: "6px",
                    fontFamily: "Manrope",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                >
                  <span className="hidden xl:inline">Sign up</span>
                  <span className="xl:hidden">Sign up</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isSignUpDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sign Up dropdown */}
                {isSignUpDropdownOpen && (
                  <div
                    className="absolute right-0 bg-white border border-[#5D2A8B] shadow-lg z-50"
                    style={{
                      top: "50px",
                      width: "194px",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      gap: "8px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {signUpOptions.map((option, idx) => (
                      <Link
                        key={idx}
                        href={option.href}
                        className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                        style={{
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "14px",
                          lineHeight: "100%",
                          textDecoration: "underline",
                          textDecorationStyle: "solid",
                          textUnderlineOffset: "15%",
                        }}
                        onClick={() => setIsSignUpDropdownOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Login button */}
              <Link
                href="/auth/login"
                className="flex items-center justify-center transition-all duration-200 hover:opacity-90 whitespace-nowrap"
                style={{
                  minWidth: "70px",
                  height: "40px",
                  borderRadius: "20px",
                  background: "#5D2A8B",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  fontFamily: "Manrope",
                  fontWeight: 500,
                  fontSize: "16px",
                }}
              >
                Login
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navbar */}
      <div 
        className="relative md:hidden"
        style={{
          width: "390px",
          height: "102px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div 
          className="absolute flex items-center"
          style={{
            top: "27px",
            left: "20px",
          }}
        >
          <Link href="/">
            <Image src="/assets/vetra.png" alt="Brand Logo" width={100} height={79} className="object-contain" />
          </Link>
        </div>

        {shouldShowLinks && (
          <>
            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="absolute flex flex-col justify-center items-center"
              style={{
                top: "35px",
                right: "20px",
                width: "30px",
                height: "24px",
                gap: "5px",
              }}
            >
              <span 
                className="block transition-all duration-300"
                style={{
                  width: "30px",
                  height: "3px",
                  background: "#5D2A8B",
                  borderRadius: "2px",
                  transform: isMobileMenuOpen ? "rotate(45deg) translateY(8px)" : "none",
                }}
              />
              <span 
                className="block transition-all duration-300"
                style={{
                  width: "30px",
                  height: "3px",
                  background: "#5D2A8B",
                  borderRadius: "2px",
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <span 
                className="block transition-all duration-300"
                style={{
                  width: "30px",
                  height: "3px",
                  background: "#5D2A8B",
                  borderRadius: "2px",
                  transform: isMobileMenuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
                }}
              />
            </button>

            {/* Mobile Menu Full Screen Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-[#F4EFFA] z-50 flex flex-col items-center"
                style={{
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  padding: "40px 30px",
                }}
              >
                {/* Logo and Close Button Row */}
                <div className="w-full flex justify-between items-center mb-16">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="/assets/vetra.png" alt="Brand Logo" width={100} height={79} className="object-contain" />
                  </Link>
                  
                  {/* X Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#1A1A1A]"
                    style={{
                      fontSize: "32px",
                      fontWeight: 300,
                      lineHeight: "1",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Navigation Links - Centered */}
                <nav className="flex flex-col items-center gap-10 mb-16">
                  <Link
                    href="/feature"
                    className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "100%",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </Link>

                  <Link
                    href="/howIt-works"
                    className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "100%",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How it works
                  </Link>

                  <Link
                    href="/about"
                    className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "100%",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </nav>

                {/* Auth Section - Centered */}
                <div className="flex flex-col items-center gap-6 w-full max-w-[300px]">
                  {/* Sign Up Links */}
                  <Link
                    href="/auth/signup/admin"
                    className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors underline"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "100%",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up as an organization
                  </Link>

                  <Link
                    href="/auth/signup/user"
                    className="text-[#1A1A1A] hover:text-[#5D2A8B] transition-colors underline"
                    style={{
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "100%",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up as an individual
                  </Link>

                  {/* Login button */}
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center transition-all duration-200 hover:opacity-90 mt-6"
                    style={{
                      width: "140px",
                      height: "48px",
                      borderRadius: "24px",
                      background: "#5D2A8B",
                      color: "#FFFFFF",
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "18px",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>

                  {/* Download App */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsDownloadModalOpen(true)
                    }}
                    className="flex items-center justify-center transition-all duration-200 hover:opacity-90"
                    style={{
                      width: "160px",
                      height: "48px",
                      borderRadius: "24px",
                      border: "2px solid #5D2A8B",
                      background: "transparent",
                      color: "#5D2A8B",
                      fontFamily: "Manrope",
                      fontWeight: 500,
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    Download App
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Download App Modal */}
      <DownloadAppModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />
    </header>
  )
}
