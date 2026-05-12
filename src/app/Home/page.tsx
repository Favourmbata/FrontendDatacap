

"use client"
import React from "react";
import Navbar from "../components/navbar";
import Hero from "@/app/Home/hero/page"
import HowItWorks from "./how-it-works/page";
import Features from "@/app/Home/features/page"
import Audience from "./users/page";
import Footer from "./footer/page";
import AnimatedAISection from "./animatedAi-section/page";
import CallToActionSection from "./capture/page";
import DownloadGuide from "./download-guide/page";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow w-full">
        <div className="w-full max-w-none">
          <Hero/>
          <HowItWorks/>
          <Features/>
          <CallToActionSection/>
                <div style={{marginBottom: "80px",marginTop: "80px"}}>
                  <DownloadGuide/>
                </div>
                <div style={{marginBottom: "200px",marginTop: "200px"}}>
                  <Audience/>
                  </div>
                <div style={{marginBottom: "200px",marginTop: "200px"}}>
                   <AnimatedAISection/>
                  </div>
         
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default HomePage;