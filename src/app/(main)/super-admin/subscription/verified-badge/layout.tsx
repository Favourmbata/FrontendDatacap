"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const VerifiedBadgeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-8 pt-6">
          <Link 
            href="/super-admin/subscription/verified-badge"
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              pathname === '/super-admin/subscription/verified-badge'
                ? 'border-[#5D2A8B] text-[#5D2A8B]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Subscriptions
          </Link>
          <Link 
            href="/super-admin/subscription/verified-badge/rejected-locations"
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              pathname === '/super-admin/subscription/verified-badge/rejected-locations'
                ? 'border-[#5D2A8B] text-[#5D2A8B]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rejected Locations
          </Link>
          <Link 
            href="/super-admin/subscription/verified-badge/verified-locations"
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              pathname === '/super-admin/subscription/verified-badge/verified-locations'
                ? 'border-[#5D2A8B] text-[#5D2A8B]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verified Locations
          </Link>
        </div>
      </div>

      <div className="py-6">
        {children}
      </div>
    </div>
  );
};

export default VerifiedBadgeLayout;