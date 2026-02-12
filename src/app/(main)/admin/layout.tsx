"use client";


import { AdminSidebar } from "@/app/components/AdminSidebar";
import { useState } from "react";
import SubscriptionGuard from "@/components/SubscriptionGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false); // Start with sidebar closed on mobile

  return (
    <SubscriptionGuard>
      <div className="min-h-screen relative">
        
        <AdminSidebar onShow={showSidebar} setShow={setShowSidebar}  />
        
        
        <div className="relative w-full pt-0 md:pt-0">
          {children}
        </div>
      </div>
    </SubscriptionGuard>
  );
}