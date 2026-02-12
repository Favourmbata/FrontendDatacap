'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { DataVerificationService } from '@/services/DataVerificationService';
import { Plus, FileText, Users, Building, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user } = useStaffAuth();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0
  });

  // Mock user data for demo purposes since backend is not ready
  const mockUser = {
    id: 'demo-user-id',
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin' as const,
    region: 'North',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Use mock user if real user is not available
  const displayUser = user || mockUser;

  const dataVerificationService = new DataVerificationService();

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await dataVerificationService.getMyVerifications();
      if (response.success) {
        setVerifications(response.data.verifications);
        
        // Calculate stats
        const verificationStats = {
          total: response.data.total,
          draft: response.data.verifications.filter((v: any) => v.status === 'draft').length,
          submitted: response.data.verifications.filter((v: any) => v.status === 'submitted').length,
          approved: response.data.verifications.filter((v: any) => v.status === 'approved').length,
          rejected: response.data.verifications.filter((v: any) => v.status === 'rejected').length
        };
        setStats(verificationStats);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
      // Use mock data for demo
      setVerifications([
        {
          _id: '1',
          verificationId: 'DV-001',
          organizationName: 'Tech Solutions Ltd',
          status: 'draft',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          verificationId: 'DV-002',
          organizationName: 'Global Services Inc',
          status: 'submitted',
          createdAt: new Date().toISOString()
        }
      ]);
      setStats({
        total: 2,
        draft: 1,
        submitted: 1,
        approved: 0,
        rejected: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ml-70">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Verification Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {displayUser.firstName} {displayUser.lastName} ({displayUser.role})
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Verifications</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-md">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Draft</p>
              <p className="text-lg font-semibold text-gray-900">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Submitted</p>
              <p className="text-lg font-semibold text-gray-900">{stats.submitted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-lg font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 p-2 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-lg font-semibold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Create Verification</h3>
              <p className="text-sm text-gray-500">Start new data verification</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/staff/data-verification/create')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            New Verification
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">My Verifications</h3>
              <p className="text-sm text-gray-500">View all your verifications</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/staff/data-verification')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Verifications
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Organizations</h3>
              <p className="text-sm text-gray-500">Manage organizations</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/staff/organizations')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Manage Orgs
          </button>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Verifications</h2>
        </div>
        <div className="overflow-hidden">
          {loading ? (
            <div className="px-6 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading verifications...</p>
            </div>
          ) : verifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new verification.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/staff/data-verification/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Create Verification
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {verifications.slice(0, 5).map((verification) => (
                <li key={verification._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(verification.status)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {verification.organizationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {verification.verificationId}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                        {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                      </span>
                      <button
                        onClick={() => router.push(`/staff/data-verification/${verification._id}`)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {verifications.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <button
              onClick={() => router.push('/staff/data-verification')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all verifications →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}