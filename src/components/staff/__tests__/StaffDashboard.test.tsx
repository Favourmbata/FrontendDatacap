import React from 'react';
import { render, screen } from '@testing-library/react';
import { StaffDashboard } from '../StaffDashboard';

// Mock the child components
jest.mock('../TaskAssignmentDisplay', () => ({
  TaskAssignmentDisplay: ({ assignments, onTaskSelect }: any) => (
    <div data-testid="task-assignment-display">
      Task Assignment Display - {assignments.length} tasks
    </div>
  ),
}));

jest.mock('../DashboardMetricsWidget', () => ({
  DashboardMetricsWidget: ({ metrics }: any) => (
    <div data-testid="dashboard-metrics">
      Metrics - {metrics.totalTasks} total tasks
    </div>
  ),
}));

jest.mock('../QuickActions', () => ({
  QuickActions: ({ userRole }: any) => (
    <div data-testid="quick-actions">
      Quick Actions for {userRole}
    </div>
  ),
}));

describe('StaffDashboard', () => {
  it('renders loading state initially', () => {
    render(<StaffDashboard />);
    
    expect(screen.getByRole('generic')).toHaveClass('animate-spin');
  });

  it('renders dashboard components after loading', async () => {
    render(<StaffDashboard />);
    
    // Wait for loading to complete and components to render
    await screen.findByText(/Welcome back/);
    
    expect(screen.getByTestId('task-assignment-display')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
  });
});