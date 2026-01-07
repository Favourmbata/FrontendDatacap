"use client";

import React from 'react';
import PlatformCommissionList from '@/modules/super-admin/platform-commission/list';

const PlatformCommissionManagementPage = () => {
  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <PlatformCommissionList />
      </div>
    </div>
  );
};

export default PlatformCommissionManagementPage;