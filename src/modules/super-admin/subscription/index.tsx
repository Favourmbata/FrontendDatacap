"use client";

import React from 'react';
import SubscriptionList from '@/modules/super-admin/subscription/list/index';

const SubscriptionPage = () => {
  return (
    <div className="manrope bg-white rounded-xl shadow-sm border border-gray-200">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Package Subscription</h2>
          <p className="text-gray-600">Manage package subscriptions for organizations</p>
        </div>
        
        <SubscriptionList />
      </div>
    </div>
  );
};

export default SubscriptionPage;