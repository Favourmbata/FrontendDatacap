"use client";

import React, { useState, useEffect } from 'react';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminMeasurementService } from '@/services/AdminMeasurementService';
import { toast } from '@/app/components/hooks/use-toast';
import { User, Users, BarChart3, UserCheck, Key, Archive, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    archivedUsers: 0,
    totalMeasurements: 0,
    oneTimeCodesGenerated: 0,
    oneTimeCodesUsed: 0,
    organizationId: ''
  });
  
  interface StatCard {
    name: string;
    value: string;
    bgColor: string;
    icon: string | React.ReactNode;
  }
  
  // Mock data for current measurement (for the top nav)
  const currentMeasurement = {
    chest: '95 cm',
    waist: '82 cm',
    hips: '98 cm',
    legs: '88 cm'
  };



  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const measurementService = new AdminMeasurementService();
        const response = await measurementService.getDashboardStats();
        
        if (response.success && response.data) {
          setStats({
            totalUsers: response.data.totalUsers || 0,
            activeUsers: response.data.activeUsers || 0,
            pendingUsers: response.data.pendingUsers || 0,
            archivedUsers: response.data.archivedUsers || 0,
            totalMeasurements: response.data.totalMeasurements || 0,
            oneTimeCodesGenerated: response.data.oneTimeCodesGenerated || 0,
            oneTimeCodesUsed: response.data.oneTimeCodesUsed || 0,
            organizationId: response.data.organizationId || ''
          });
        } else {
          console.error('Dashboard stats API returned unsuccessful response:', response);
          toast({ 
            title: 'Error', 
            description: response.data?.message || 'Failed to fetch dashboard statistics',
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to fetch dashboard statistics',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleCreateNew = (type: string) => {
    // Navigate to respective creation pages
    switch(type) {
      case 'body':
        router.push('/admin/body-measurement/create');
        break;
      case 'object':
        router.push('/admin/object-dimension/create');
        break;
      case 'questionnaire':
        router.push('/admin/questionaire/create');
        break;
      default:
        break;
    }
  };

  // Stats cards data using real API data
  const statCards: StatCard[] = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers?.toLocaleString() || '0',
      bgColor: '#F4EFFA',
      icon: <User className="w-5 h-5" />
    },
    { 
      name: 'Active Users', 
      value: stats.activeUsers?.toLocaleString() || '0',
      bgColor: '#FBF8EF',
      icon: <Users className="w-5 h-5" />
    },
    { 
      name: 'Total Measurements', 
      value: stats.totalMeasurements?.toLocaleString() || '0',
      bgColor: '#FCEEEE',
      icon: <BarChart3 className="w-5 h-5" />
    },
    { 
      name: 'Pending Users', 
      value: stats.pendingUsers?.toLocaleString() || '0',
      bgColor: '#E8F4F8',
      icon: <UserCheck className="w-5 h-5" />
    },
    { 
      name: 'Archived Users', 
      value: stats.archivedUsers?.toLocaleString() || '0',
      bgColor: '#F0F4E8',
      icon: <Archive className="w-5 h-5" />
    },
   
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      {/* Measurement Top Nav */}
      <MeasurementTopNav 
        title="Current system metrics"
        measurements={currentMeasurement}
      />

      {/* Overview Section - Responsive */}
      <div className="px-4 pt-4 md:pt-0 md:absolute md:w-[958px] md:top-[271px] md:left-[401px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="manrope text-xl md:text-2xl font-semibold text-gray-800">Overview</h2>
          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[20px]">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="relative w-full h-[146px] rounded-[20px] p-6"
              style={{ background: stat.bgColor }}
            >
              <div className="flex flex-col gap-3">
                <span className="manrope text-sm md:text-base font-normal leading-tight" style={{ color: '#6E6E6EB2' }}>
                  {stat.name}
                </span>
                <span className="manrope text-2xl font-medium leading-tight text-[#1A1A1A]">
                  {loading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </span>
              </div>

              {/* Card Icon - Handle both Image and Lucide icons */}
              <div className="absolute top-4 right-4 w-[30px] h-[30px] rounded-full flex items-center justify-center" style={{ background: '#FFFFFF80' }}>
                {typeof stat.icon === 'string' ? (
                  <Image 
                    src={stat.icon} 
                    alt={stat.name} 
                    width={20} 
                    height={20}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-[#5D2A8B]">
                    {stat.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;