"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, FileText, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import ServiceProviderService, { ServiceTask, BookingsSummary } from '@/services/ServiceProviderService';

interface Task {
  id: string;
  serialNumber: string;
  title: string;
  description: string;
  type: 'gallery' | 'product' | 'service';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  assignedDate: Date;
  dueDate: Date;
  organizationName: string;
  serviceProviderName: string;
  serviceProviderId: string;
  customerFullName: string;
  customerId: string;
  assignmentDateTime: Date;
  serviceDuration: string;
  feeInNaira: number;
}

type TaskTab = 'assigned' | 'accepted' | 'completed' | 'rejected';

const ServiceProviderDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<ServiceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ServiceTask | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState<TaskTab>('assigned');
  const [statistics, setStatistics] = useState<BookingsSummary>({
    assigned: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchStatistics();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ServiceProviderService.getMyBookings();
      
      if (response.success) {
        setTasks(response.data.bookings);
      } else {
        setError(response.message || 'Failed to fetch bookings');
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks. Please ensure you are logged in as a service provider.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await ServiceProviderService.getTaskStatistics();
      
      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      setSubmitting(taskId);
      const response = await ServiceProviderService.acceptTask(taskId);
      
      if (response.success) {
        alert('Task accepted successfully! Customer has been notified.');
        await fetchTasks();
        await fetchStatistics();
      }
    } catch (err: any) {
      console.error('Error accepting task:', err);
      alert(err.message || 'Failed to accept task');
    } finally {
      setSubmitting(null);
    }
  };

  const handleRejectTask = (task: ServiceTask) => {
    setSelectedTask(task);
    setShowRejectionModal(true);
  };

  const handleSubmitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!selectedTask) return;

    try {
      setSubmitting(selectedTask.taskId);
      const response = await ServiceProviderService.rejectTask(
        selectedTask.taskId,
        rejectionReason
      );
      
      if (response.success) {
        alert('Task rejected. Admin has been notified.');
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedTask(null);
        await fetchTasks();
        await fetchStatistics();
      }
    } catch (err: any) {
      console.error('Error rejecting task:', err);
      alert(err.message || 'Failed to reject task');
    } finally {
      setSubmitting(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setSubmitting(taskId);
      const response = await ServiceProviderService.completeTask(taskId);
      
      if (response.success) {
        alert('Task completed successfully!');
        await fetchTasks();
        await fetchStatistics();
      }
    } catch (err: any) {
      console.error('Error completing task:', err);
      alert(err.message || 'Failed to complete task');
    } finally {
      setSubmitting(null);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFilteredTasks = (): ServiceTask[] => {
    switch (activeTab) {
      case 'assigned': return tasks.filter(t => t.taskStatus === 'assigned');
      case 'accepted': return tasks.filter(t => t.taskStatus === 'accepted');
      case 'completed': return tasks.filter(t => t.taskStatus === 'completed');
      case 'rejected': return tasks.filter(t => t.taskStatus === 'rejected');
      default: return [];
    }
  };

  const getCurrentTabTitle = (): string => {
    switch (activeTab) {
      case 'assigned': return 'Assigned Tasks';
      case 'accepted': return 'Accepted Tasks';
      case 'completed': return 'Completed Tasks';
      case 'rejected': return 'Rejected Tasks';
    }
  };

  const getCurrentTabDescription = (): string => {
    switch (activeTab) {
      case 'assigned': return 'Tasks assigned to you - accept or reject them';
      case 'accepted': return 'Tasks you have accepted and are working on';
      case 'completed': return 'Successfully completed tasks';
      case 'rejected': return 'Tasks you have rejected (reasons visible to admin)';
    }
  };

  // Format currency in Naira
  const formatNaira = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const filteredTasks = getFilteredTasks();
    
    const exportData = filteredTasks.map(task => ({
      'Task ID': task.taskId,
      'Booking ID': task.bookingId,
      'Order ID': task.orderId,
      'Service': task.serviceName,
      'Customer': task.customerFullName || task.customerFirstName,
      'Customer ID': task.customerId,
      'Date': formatDateTime(task.date),
      'Time': task.time,
      'Duration (min)': task.duration,
      'Fee (₦)': task.fee,
      'Total Amount (₦)': task.totalOrderAmount,
      'Order Status': task.orderStatus,
      'Task Status': task.taskStatus.toUpperCase(),
      'Settlement': task.settlementStatus,
      'Assigned At': formatDateTime(task.assignedAt),
      'Location Type': task.location.type,
      'Notes': task.notes || ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Task ID
      { wch: 20 }, // Booking ID
      { wch: 25 }, // Order ID
      { wch: 25 }, // Service
      { wch: 25 }, // Customer
      { wch: 20 }, // Customer ID
      { wch: 20 }, // Date
      { wch: 10 }, // Time
      { wch: 12 }, // Duration
      { wch: 15 }, // Fee
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Order Status
      { wch: 12 }, // Task Status
      { wch: 12 }, // Settlement
      { wch: 20 }, // Assigned At
      { wch: 18 }, // Location Type
      { wch: 40 }  // Notes
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${getCurrentTabTitle()} Tasks`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `Service_Provider_${getCurrentTabTitle().replace(' ', '_')}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tasks</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Provider Dashboard</h1>
          <p className="text-gray-600">Manage your allocated tasks from organizations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`bg-white rounded-lg shadow p-6 transition-all ${
              activeTab === 'assigned' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.assigned}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('accepted')}
            className={`bg-white rounded-lg shadow p-6 transition-all ${
              activeTab === 'accepted' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accepted Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.accepted}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`bg-white rounded-lg shadow p-6 transition-all ${
              activeTab === 'completed' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.completed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`bg-white rounded-lg shadow p-6 transition-all ${
              activeTab === 'rejected' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.rejected}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'assigned'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Assigned
                </div>
                <span className="block mt-1 text-xs opacity-75">{statistics.assigned} tasks</span>
              </button>

              <button
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'accepted'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Accepted
                </div>
                <span className="block mt-1 text-xs opacity-75">{statistics.accepted} tasks</span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </div>
                <span className="block mt-1 text-xs opacity-75">{statistics.completed} tasks</span>
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected
                </div>
                <span className="block mt-1 text-xs opacity-75">{statistics.rejected} tasks</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Task Content Area */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getCurrentTabTitle()}</h2>
              <p className="text-sm text-gray-600 mt-1">{getCurrentTabDescription()}</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee (₦)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTasks().length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      {activeTab === 'assigned' && 'No assigned tasks available'}
                      {activeTab === 'accepted' && 'No accepted tasks'}
                      {activeTab === 'completed' && 'No completed tasks'}
                      {activeTab === 'rejected' && 'No rejected tasks'}
                    </td>
                  </tr>
                ) : (
                  getFilteredTasks().map((task) => (
                    <tr key={task.taskId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{task.serviceName}</div>
                        <div className="text-xs text-gray-500">Order: {task.orderId.slice(-8)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {task.taskStatus === 'accepted' || task.taskStatus === 'completed'
                          ? task.customerFullName || task.customerFirstName
                          : task.customerFirstName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono text-xs">{task.customerId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDateTime(task.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.time}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.duration} min</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatNaira(task.fee)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.taskStatus === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                          task.taskStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                          task.taskStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.taskStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {activeTab === 'assigned' && task.canAccept && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAcceptTask(task.taskId)}
                              disabled={submitting === task.taskId}
                              className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Accept Task"
                            >
                              {submitting === task.taskId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectTask(task)}
                              disabled={submitting === task.taskId}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Task"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {activeTab === 'accepted' && task.canComplete && (
                          <button
                            onClick={() => handleCompleteTask(task.taskId)}
                            disabled={submitting === task.taskId}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as Complete"
                          >
                            {submitting === task.taskId ? (
                                <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                              ) : null}
                            Complete
                          </button>
                        )}
                        {activeTab === 'completed' && (
                          <span className="text-green-600">
                            <CheckCircle className="w-5 h-5" />
                          </span>
                        )}
                        {activeTab === 'rejected' && (
                          <span className="text-red-600">
                            <XCircle className="w-5 h-5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reject Task</h2>
            <p className="text-gray-600 mb-4">
              You are rejecting: <strong>{selectedTask.serviceName}</strong>
            </p>
            
            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Please provide a detailed reason for rejecting this task..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be visible to the organization admin
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitRejection}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedTask(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;
