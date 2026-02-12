'use client';

import React, { useState } from 'react';
import { VerificationTask } from '@/types/staff';

interface TaskAssignmentDisplayProps {
  assignments: VerificationTask[];
  onTaskSelect: (taskId: string) => void;
}

export function TaskAssignmentDisplay({ assignments, onTaskSelect }: TaskAssignmentDisplayProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  const filteredTasks = assignments.filter(task => {
    if (activeTab === 'pending') return task.status === 'pending';
    if (activeTab === 'in_progress') return task.status === 'in_progress';
    if (activeTab === 'completed') return task.status === 'completed' || task.status === 'rejected';
    return false;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Verification Tasks</h2>
        
        <div className="mt-4 flex space-x-1">
          {(['pending', 'in_progress', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.replace('_', ' ').toUpperCase()}
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {assignments.filter(t => {
                  if (tab === 'pending') return t.status === 'pending';
                  if (tab === 'in_progress') return t.status === 'in_progress';
                  if (tab === 'completed') return t.status === 'completed' || t.status === 'rejected';
                  return false;
                }).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab.replace('_', ' ')} tasks found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onTaskSelect(task.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      Organization ID: {task.organizationId}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {task.location.address}
                    </p>
                    
                    <p className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskSelect(task.id);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {task.status === 'pending' ? 'Start' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}