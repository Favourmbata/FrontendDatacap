"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Users, TrendingUp, Award, Calendar, Loader2 } from 'lucide-react';
import ServiceProviderAssignmentService, { 
  AssignmentSummary 
} from '@/services/ServiceProviderAssignmentService';

const AnalyticsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AssignmentSummary | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await ServiceProviderAssignmentService.getSummary();
      
      if (response.success) {
        // Transform API response to match our interface
        const apiSummary: any = response.data.summary;
        setSummary({
          totalUsers: apiSummary.statistics.totalOrgUsers,
          totalServiceProviders: apiSummary.statistics.totalServiceProviders,
          activeProviders: apiSummary.statistics.activeServiceProviders,
          inactiveProviders: apiSummary.statistics.inactiveServiceProviders,
          averageRating: 0, // Not provided by API yet
          totalBookings: 0, // Not provided by API yet
          completedBookings: 0 // Not provided by API yet
        });
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      alert(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const completionRate = summary.totalBookings > 0 
    ? ((summary.completedBookings / summary.totalBookings) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Providers
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Analytics</h1>
          <p className="text-gray-600">Insights and metrics for service provider assignments</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Service Providers</p>
            <p className="text-3xl font-bold text-gray-900">{summary.totalServiceProviders}</p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.activeProviders} active, {summary.inactiveProviders} inactive
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary.averageRating != null ? summary.averageRating.toFixed(1) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.completedBookings} of {summary.totalBookings} bookings
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{summary.totalBookings}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Provider Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Activity</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Providers</span>
                  <span className="font-medium text-green-600">{summary.activeProviders}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${summary.totalServiceProviders > 0 ? (summary.activeProviders / summary.totalServiceProviders) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Inactive Providers</span>
                  <span className="font-medium text-red-600">{summary.inactiveProviders}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${summary.totalServiceProviders > 0 ? (summary.inactiveProviders / summary.totalServiceProviders) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completed Bookings</span>
                  <span className="font-medium text-blue-600">{summary.completedBookings}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${summary.totalBookings > 0 ? (summary.completedBookings / summary.totalBookings) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pending/In-Progress</span>
                  <span className="font-medium text-orange-600">
                    {summary.totalBookings - summary.completedBookings}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${summary.totalBookings > 0 ? ((summary.totalBookings - summary.completedBookings) / summary.totalBookings) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Quick Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-purple-100 text-sm mb-1">Provider Utilization</p>
              <p className="text-2xl font-bold">
                {summary.totalServiceProviders > 0 
                  ? `${((summary.activeProviders / summary.totalServiceProviders) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-1">Avg Bookings per Provider</p>
              <p className="text-2xl font-bold">
                {summary.totalServiceProviders > 0
                  ? (summary.totalBookings / summary.totalServiceProviders).toFixed(1)
                  : '0'
                }
              </p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-1">Success Rate</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
