"use client";

import { useState } from "react";
import Sidebar from "@/components/staff/Sidebar";
import { StaffAuthProvider } from "@/contexts/StaffAuthContext";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false); // Start with sidebar closed on mobile

  // Mock user data for demo purposes since backend is not ready
  const mockUser = {
    id: 'demo-user-id',
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin' as const, // Use 'as const' to ensure correct type
    region: 'North',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <StaffAuthProvider>
      <div className="min-h-screen relative">
        <Sidebar user={mockUser} onShow={showSidebar} setShow={setShowSidebar} />
        
        <div className="relative w-full pt-0 md:pt-0">
          {children}
        </div>
      </div>
    </StaffAuthProvider>
  );
}