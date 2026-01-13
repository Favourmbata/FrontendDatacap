'use client';

import React from 'react';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { StaffUser } from '@/types/staff';

interface ProtectedStaffRouteProps {
  children: React.ReactNode;
  requiredRole?: StaffUser['role'] | StaffUser['role'][];
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedStaffRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedStaffRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useStaffAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/staff/login';
    }
    return null;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have the required role to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
          </p>
          <p className="text-sm text-gray-500">
            Your role: {user?.role}
          </p>
          <button
            onClick={() => window.location.href = '/staff/dashboard'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have the required permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required permission: {requiredPermission}
          </p>
          <button
            onClick={() => window.location.href = '/staff/dashboard'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}