"use client";

import React from 'react';
import { Home, Users, Shield, Settings } from 'lucide-react';

const SuperAdminDashboard = () => {
  // Mock data for dashboard cards
  const dashboardStats = [
    { title: 'Total Users', value: '1,248', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Active Roles', value: '24', icon: <Shield className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'Organisations', value: '12', icon: <Settings className="w-6 h-6" />, color: 'bg-purple-500' },
  ];

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the super admin panel. Manage roles, users, and organisations.</p>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center py-3 border-b border-gray-100 last:border-0">
              <div className="bg-gray-100 rounded-full p-2 mr-4">
                <Home className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Role "Administrator" was updated</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="text-sm text-gray-500">John Doe</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;