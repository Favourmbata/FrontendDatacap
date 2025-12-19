"use client";

import { SuperAdminSidebar } from "@/app/components/SuperAdminSidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false); // Start with sidebar closed on mobile

  return (
    <div className="min-h-screen relative">
      <SuperAdminSidebar onShow={showSidebar} setShow={setShowSidebar} />
      
      <div className="relative w-full pt-0 md:pt-0">
        {children}
      </div>
    </div>
  );
}