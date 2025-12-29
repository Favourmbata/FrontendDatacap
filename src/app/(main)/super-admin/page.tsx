"use client";

import React, { useState, useEffect } from 'react';
import { Users, Building2, Package, TrendingUp, BarChart3, DollarSign, Calendar } from 'lucide-react';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  totalSubscriptionPackages: number;
  activeSubscriptionPackages: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentRegistrations: {
    organizations: number;
    customers: number;
  };
}

interface AnalyticsData {
  organizationGrowth: Array<{ month: string; count: number }>;
  customerGrowth: Array<{ month: string; count: number }>;
  revenueGrowth: Array<{ month: string; revenue: number }>;
  topStates: Array<{ state: string; customerCount: number }>;
  packagePopularity: Array<{ packageName: string; subscriberCount: number }>;
}

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, analyticsResponse] = await Promise.all([
          fetch('/api/super-admin/dashboard/stats', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          }),
          fetch('/api/super-admin/dashboard/analytics', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          })
        ]);

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const statsData: { data: DashboardStats } = await statsResponse.json();
        const analyticsData: { data: AnalyticsData } = await analyticsResponse.json();

        setStats(statsData.data);
        setAnalytics(analyticsData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the super admin panel. Manage roles, users, and organisations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the super admin panel. Manage roles, users, and organisations.</p>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.totalOrganizations || 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500 text-white">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex text-sm text-gray-600">
            <span className="flex items-center mr-4">
              <span className="text-green-500 mr-1">●</span>
              Active: {formatNumber(stats?.activeOrganizations || 0)}
            </span>
            <span className="flex items-center">
              <span className="text-red-500 mr-1">●</span>
              Suspended: {formatNumber(stats?.suspendedOrganizations || 0)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.totalCustomers || 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex text-sm text-gray-600">
            <span className="flex items-center mr-4">
              <span className="text-green-500 mr-1">●</span>
              Active: {formatNumber(stats?.activeCustomers || 0)}
            </span>
            <span className="flex items-center">
              <span className="text-red-500 mr-1">●</span>
              Suspended: {formatNumber(stats?.suspendedCustomers || 0)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500 text-white">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Monthly: {formatCurrency(stats?.monthlyRevenue || 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Packages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats?.activeSubscriptionPackages || 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500 text-white">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total: {formatNumber(stats?.totalSubscriptionPackages || 0)}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Recent Registrations</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Organizations</p>
              <p className="text-2xl font-bold text-blue-600">{formatNumber(stats?.recentRegistrations.organizations || 0)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Customers</p>
              <p className="text-2xl font-bold text-green-600">{formatNumber(stats?.recentRegistrations.customers || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Top States</h2>
          </div>
          <div className="space-y-3">
            {analytics?.topStates.slice(0, 5).map((state, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{state.state}</span>
                <span className="text-gray-900 font-medium">{formatNumber(state.customerCount)}</span>
              </div>
            )) || [1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Customer Growth</h2>
          </div>
          <div className="h-64 flex items-end space-x-2 pt-4 border-t border-gray-100">
            {analytics?.customerGrowth.slice(-6).map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">{item.month.split('-')[1]}</div>
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${Math.min(100, (item.count / Math.max(...analytics?.customerGrowth.map(c => c.count) || [1])) * 100)}%` }}
                ></div>
                <div className="text-xs mt-1">{formatNumber(item.count)}</div>
              </div>
            )) || [1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">--</div>
                <div className="w-full bg-gray-200 rounded-t h-20"></div>
                <div className="text-xs mt-1">--</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Revenue Growth</h2>
          </div>
          <div className="h-64 flex items-end space-x-2 pt-4 border-t border-gray-100">
            {analytics?.revenueGrowth.slice(-6).map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">{item.month.split('-')[1]}</div>
                <div 
                  className="w-full bg-yellow-500 rounded-t hover:bg-yellow-600 transition-colors"
                  style={{ height: `${Math.min(100, (item.revenue / Math.max(...analytics?.revenueGrowth.map(r => r.revenue) || [1])) * 100)}%` }}
                ></div>
                <div className="text-xs mt-1">{formatCurrency(item.revenue)}</div>
              </div>
            )) || [1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">--</div>
                <div className="w-full bg-gray-200 rounded-t h-20"></div>
                <div className="text-xs mt-1">--</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Package Popularity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Package className="w-5 h-5 text-pink-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Package Popularity</h2>
        </div>
        <div className="space-y-4">
          {analytics?.packagePopularity.map((pkg, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-gray-700">{pkg.packageName}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-pink-500 h-2.5 rounded-full"
                    style={{ width: `${(pkg.subscriberCount / Math.max(...analytics?.packagePopularity.map(p => p.subscriberCount) || [1])) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-right text-gray-900 font-medium">{formatNumber(pkg.subscriberCount)}</div>
            </div>
          )) || [1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center animate-pulse">
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 ml-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;