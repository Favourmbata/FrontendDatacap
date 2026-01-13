'use client';

import React from 'react';
import { DashboardMetrics } from '@/types/staff';

interface DashboardMetricsWidgetProps {
  metrics: DashboardMetrics;
}

export function DashboardMetricsWidget({ metrics }: DashboardMetricsWidgetProps) {
  const completionRate = metrics.totalTasks > 0 
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      
      <div className="space-y-4">
        {/* Completion Rate */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Completion Rate</span>
            <span className="text-sm font-bold text-green-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{metrics.pendingTasks}</div>
            <div className="text-xs text-blue-700">Pending</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{metrics.inProgressTasks}</div>
            <div className="text-xs text-yellow-700">In Progress</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}</div>
            <div className="text-xs text-green-700">Completed</div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{metrics.rejectedTasks}</div>
            <div className="text-xs text-red-700">Rejected</div>
          </div>
        </div>

        {/* Average Completion Time */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-1">Avg. Completion Time</div>
          <div className="text-lg font-bold text-gray-900">{metrics.averageCompletionTime} days</div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Tasks by Priority</div>
          <div className="space-y-2">
            {Object.entries(metrics.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{priority}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}