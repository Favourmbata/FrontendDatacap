'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStaffAuth } from '@/contexts/StaffAuthContext';

export default function StaffDashboardPage() {
  const router = useRouter();
  const { user } = useStaffAuth();

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ml-70"> {/* Reduced width and adjusted ml for sidebar */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Staff Portal</h1>
        <p className="mt-1 text-sm text-gray-500">
          {displayUser.firstName} {displayUser.lastName} ({displayUser.role})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Verifications</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">24</div>
                </dd>
              </dl>
            </div>
          </div>
          <button
            onClick={() => router.push('/staff/verifications')}
            className="mt-4 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View Verifications
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Verification Tasks</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">12</div>
                </dd>
              </dl>
            </div>
          </div>
          <button
            onClick={() => router.push('/staff/tasks')}
            className="mt-4 w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Tasks
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/staff/questionnaire')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start New Verification
          </button>
          <button
            onClick={() => router.push('/staff/verifications')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View My Verifications
          </button>
        </div>
      </div>
    </div>
  );
}