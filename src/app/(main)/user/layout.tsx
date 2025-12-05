
"use client";


import { UserSidebar } from "@/app/components/sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false); // Start with sidebar closed on mobile

  return (
    <div className="min-h-screen bg-[#F7F0FE] relative">
      
      <UserSidebar onShow={showSidebar} setShow={setShowSidebar} />
      
      
      <div className="relative w-full pt-0 md:pt-0">
        {children}
      </div>
    </div>
  );
}
