"use client";

import React, { useState } from "react";

type Tab = "android" | "ios";

const androidSteps = [
  {
    number: 1,
    text: 'Tap the "Download for Android" button on the page.',
  },
  {
    number: 2,
    text: "You'll be taken to the sign-up page — fill in your details and tap \"Sign up and download\".",
  },
  {
    number: 3,
    text: "You'll be redirected to a Google Drive link — tap the download button to download the APK file.",
  },
  {
    number: 4,
    text: "Once downloaded, open the file to install the app.",
  },
];

const androidWarnings = [
  {
    icon: "🌐",
    title: "Browser warning",
    description: '"This file type can harm your device" — tap Download anyway.',
  },
  {
    icon: "⚙️",
    title: "Unknown sources",
    description:
      "Your phone may ask you to allow installation from unknown sources — go to your settings, enable it, then return to complete the installation.",
  },
  {
    icon: "🤖",
    title: "App not verified",
    description:
      'Android may show "App not verified by Google Play" — tap Install anyway or More details → Install anyway.',
  },
  {
    icon: "🛡️",
    title: "Antivirus alert",
    description:
      "Some antivirus apps may flag the file as suspicious — this is a false positive, the app is safe.",
  },
];

const iosSteps = [
  {
    number: 1,
    text: "Before anything else, download Expo Go from the App Store — this is required. It acts as a middleman that runs the app on your device since we haven't published to the App Store yet.",
    highlight: true,
  },
  {
    number: 2,
    text: 'Tap the "Download for iOS" button on this page.',
  },
  {
    number: 3,
    text: "You'll be taken to the sign-up page — fill in your details and tap \"Sign up and download\".",
  },
  {
    number: 4,
    text: 'A browser page will open showing two options: Development build and Expo Go — tap Open in Expo Go.',
  },
  {
    number: 5,
    text: "The app will launch inside Expo Go immediately.",
  },
];

export default function DownloadGuide() {
  const [activeTab, setActiveTab] = useState<Tab>("android");

  return (
    <section
      id="download-guide"
      className="bg-white py-16 md:py-24 px-4"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      <div className="mx-auto" style={{ maxWidth: "860px" }}>
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-[#1A1A1A] mb-4"
            style={{
              fontFamily: "Monument Extended, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 4vw, 36px)",
              lineHeight: "110%",
            }}
          >
            Get the App on Your Device
          </h2>
          <p
            className="text-[#6E6E6EB2] mx-auto"
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "150%",
              maxWidth: "520px",
            }}
          >
            Getting the app is quick and easy. Just follow the steps below for
            your device type.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-10">
          <div
            className="flex bg-[#F4EFFA] rounded-xl p-1"
            style={{ gap: "4px" }}
          >
            <button
              onClick={() => setActiveTab("android")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "Manrope, sans-serif",
                background: activeTab === "android" ? "#5D2A8B" : "transparent",
                color: activeTab === "android" ? "#FFFFFF" : "#5D2A8B",
                fontWeight: activeTab === "android" ? 600 : 500,
              }}
            >
              <span>📱</span> Android
            </button>
            <button
              onClick={() => setActiveTab("ios")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "Manrope, sans-serif",
                background: activeTab === "ios" ? "#5D2A8B" : "transparent",
                color: activeTab === "ios" ? "#FFFFFF" : "#5D2A8B",
                fontWeight: activeTab === "ios" ? 600 : 500,
              }}
            >
              <span>🍎</span> iOS
            </button>
          </div>
        </div>

        {/* Android Steps */}
        {activeTab === "android" && (
          <div>
            {/* Steps */}
            <div className="space-y-4 mb-10">
              {androidSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: "#F4EFFA" }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-sm font-semibold"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "#5D2A8B",
                      fontFamily: "Manrope, sans-serif",
                    }}
                  >
                    {step.number}
                  </div>
                  <p
                    className="text-[#1A1A1A] pt-1"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      lineHeight: "150%",
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Warnings callout */}
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "#F4EFFA", border: "1.5px solid #5D2A8B" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <h3
                  className="text-[#1A1A1A] font-semibold"
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "15px",
                  }}
                >
                  Heads up — you may see some warnings during installation
                </h3>
              </div>
              <p
                className="text-[#6E6E6E] mb-6"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "14px",
                  lineHeight: "150%",
                }}
              >
                These are expected and completely safe to proceed through:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {androidWarnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white"
                    style={{ border: "1px solid #E0D0F0" }}
                  >
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>
                      {w.icon}
                    </span>
                    <div>
                      <p
                        className="text-[#1A1A1A] font-semibold mb-1"
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontSize: "13px",
                        }}
                      >
                        {w.title}
                      </p>
                      <p
                        className="text-[#6E6E6E]"
                        style={{
                          fontFamily: "Manrope, sans-serif",
                          fontSize: "13px",
                          lineHeight: "145%",
                        }}
                      >
                        {w.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* iOS Steps */}
        {activeTab === "ios" && (
          <div className="space-y-4">
            {iosSteps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: step.highlight ? "#5D2A8B" : "#F4EFFA",
                  border: step.highlight ? "none" : undefined,
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: step.highlight ? "rgba(255,255,255,0.2)" : "#5D2A8B",
                    color: "#FFFFFF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {step.number}
                </div>
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "150%",
                    color: step.highlight ? "#FFFFFF" : "#1A1A1A",
                    paddingTop: "4px",
                  }}
                >
                  {step.text}
                  {step.highlight && (
                    <span
                      className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "#FFFFFF",
                        display: "block",
                        width: "fit-content",
                      }}
                    >
                      Required first step
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
