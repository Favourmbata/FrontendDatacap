'use client';

import React, { useState, useEffect } from 'react';
import { VerificationTask, DashboardMetrics } from '@/types/staff';
import { useStaffAuth } from '@/contexts/StaffAuthContext';
import { TaskAssignmentDisplay } from './TaskAssignmentDisplay';
import { DashboardMetricsWidget } from './DashboardMetricsWidget';
import { QuickActions } from './QuickActions';

export function StaffDashboard() {
  const { user, signOut } = useStaffAuth();
  const [assignments, setAssignments] = useState<VerificationTask[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - will be replaced with actual API calls
      const mockAssignments: VerificationTask[] = [
        {
          id: '1',
          organizationId: 'org-1',
          assignedAgentId: user!.id,
          status: 'pending',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000), // Tomorrow
          location: {
            address: '123 Main St, City',
            coordinates: [40.7128, -74.0060],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          organizationId: 'org-2',
          assignedAgentId: user!.id,
          status: 'in_progress',
          priority: 'medium',
          dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
          location: {
            address: '456 Oak Ave, Town',
            coordinates: [40.7589, -73.9851],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockMetrics: DashboardMetrics = {
        totalTasks: 10,
        pendingTasks: 3,
        inProgressTasks: 2,
        completedTasks: 4,
        rejectedTasks: 1,
        averageCompletionTime: 2.5,
        tasksByPriority: {
          low: 2,
          medium: 4,
          high: 3,
          urgent: 1,
        },
      };

      setAssignments(mockAssignments);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with user info and logout */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role.replace('_', ' ').toUpperCase()} - {user.region} Region
          </p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TaskAssignmentDisplay 
            assignments={assignments} 
            onTaskSelect={(taskId) => {
              // Navigate to questionnaire
              const task = assignments.find(t => t.id === taskId);
              if (task) {
                window.location.href = `/staff/questionnaire/${task.organizationId}`;
              }
            }}
          />
        </div>
        <div>
          <DashboardMetricsWidget metrics={metrics} />
          <div className="mt-6">
            <QuickActions userRole={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}