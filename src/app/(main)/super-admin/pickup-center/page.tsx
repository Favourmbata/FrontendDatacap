"use client";

import React from 'react';
import PickupCenterList from '@/modules/super-admin/pickup-center/list';

const SuperAdminPickupCenter = () => {
  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <PickupCenterList />
    </div>
  );
};

export default SuperAdminPickupCenter;
