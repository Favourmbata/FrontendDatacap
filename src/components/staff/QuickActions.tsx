'use client';

import React from 'react';
import { StaffUser } from '@/types/staff';

interface QuickActionsProps {
  userRole: StaffUser['role'];
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const actions = [
    {
      label: 'New Verification',
      icon: '📋',
      href: '/staff/questionnaire/new',
      roles: ['field_agent', 'supervisor', 'admin'],
    },
    {
      label: 'Search Organizations',
      icon: '🔍',
      href: '/staff/organizations/search',
      roles: ['field_agent', 'supervisor', 'admin'],
    },
    {
      label: 'Review Submissions',
      icon: '✅',
      href: '/staff/reviews',
      roles: ['supervisor', 'admin'],
    },
    {
      label: 'Manage Staff',
      icon: '👥',
      href: '/staff/admin/users',
      roles: ['admin'],
    },
    {
      label: 'System Reports',
      icon: '📊',
      href: '/staff/admin/reports',
      roles: ['supervisor', 'admin'],
    },
    {
      label: 'Settings',
      icon: '⚙️',
      href: '/staff/settings',
      roles: ['field_agent', 'supervisor', 'admin'],
    },
  ];

  const availableActions = actions.filter(action => 
    action.roles.includes(userRole)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {availableActions.map((action) => (
          <button
            key={action.label}
            onClick={() => window.location.href = action.href}
            className="flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}