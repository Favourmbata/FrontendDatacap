"use client";

import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import AdminTaskManagementService, { 
  ServiceBooking, 
  ProviderReport, 
  TaskReport,
  UpdateSettlementRequest 
} from '@/services/AdminTaskManagementService';

type TabType = 'bookings' | 'providers' | 'accepted' | 'rejected' | 'completed';

const AdminTaskManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [providers, setProviders] = useState<ProviderReport[]>([]);
  const [acceptedTasks, setAcceptedTasks] = useState<TaskReport[]>([]);
  const [rejectedTasks, setRejectedTasks] = useState<TaskReport[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskReport[]>([]);
  
  // Filters
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Settlement modal
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskReport | null>(null);
  const [newSettlementStatus, setNewSettlementStatus] = useState<'pending' | 'paid' | 'disputed'>('paid');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, dateFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'bookings':
          const bookingsRes = await AdminTaskManagementService.getServiceBookings(dateFilter || undefined);
          if (bookingsRes.success) setBookings(bookingsRes.data.bookings);
          break;
        case 'providers':
          const providersRes = await AdminTaskManagementService.getProvidersReport();
          if (providersRes.success) setProviders(providersRes.data.providers);
          break;
        case 'accepted':
          const acceptedRes = await AdminTaskManagementService.getAcceptedTasksReport();
          if (acceptedRes.success) setAcceptedTasks(acceptedRes.data.tasks);
          break;
        case 'rejected':
          const rejectedRes = await AdminTaskManagementService.getRejectedTasksReport();
          if (rejectedRes.success) setRejectedTasks(rejectedRes.data.tasks);
          break;
        case 'completed':
          const completedRes = await AdminTaskManagementService.getCompletedTasksReport();
          if (completedRes.success) setCompletedTasks(completedRes.data.tasks);
          break;
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (reportType: string) => {
    try {
      const blob = await AdminTaskManagementService.exportReport(reportType);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error exporting:', err);
      alert('Failed to export report');
    }
  };

  const handleUpdateSettlement = async (task: TaskReport) => {
    setSelectedTask(task);
    setNewSettlementStatus('paid');
    setShowSettlementModal(true);
  };

  const submitSettlementUpdate = async () => {
    if (!selectedTask) return;

    try {
      setUpdating(true);
      const response = await AdminTaskManagementService.updateSettlementStatus(
        selectedTask.taskId,
        newSettlementStatus
      );

      if (response.success) {
        alert('Settlement status updated successfully');
        setShowSettlementModal(false);
        setSelectedTask(null);
        fetchData();
      }
    } catch (err: any) {
      console.error('Error updating settlement:', err);
      alert(err.message || 'Failed to update settlement status');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSettlementBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading task management data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
          <p className="text-gray-600">Manage service bookings, provider reports, and settlements</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'bookings' as TabType, label: 'Service Bookings', icon: Calendar },
                { id: 'providers' as TabType, label: 'Provider Reports', icon: DollarSign },
                { id: 'accepted' as TabType, label: 'Accepted Tasks', icon: CheckCircle },
                { id: 'rejected' as TabType, label: 'Rejected Tasks', icon: XCircle },
                { id: 'completed' as TabType, label: 'Completed Tasks', icon: Clock },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeTab === 'bookings' && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => handleExport(
              activeTab === 'bookings' ? 'all-providers' :
              activeTab === 'providers' ? 'all-providers' :
              activeTab === 'accepted' ? 'accepted-tasks' :
              activeTab === 'rejected' ? 'rejected-tasks' :
              'completed-tasks'
            )}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {activeTab === 'bookings' && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement</th>
                  </tr>
                )}
                {activeTab === 'providers' && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accepted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Earnings</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                  </tr>
                )}
                {(activeTab === 'accepted' || activeTab === 'rejected' || activeTab === 'completed') && (
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'bookings' && bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No service bookings found
                    </td>
                  </tr>
                )}
                {activeTab === 'providers' && providers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No provider data available
                    </td>
                  </tr>
                )}
                {activeTab === 'accepted' && acceptedTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No accepted tasks
                    </td>
                  </tr>
                )}
                {activeTab === 'rejected' && rejectedTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No rejected tasks
                    </td>
                  </tr>
                )}
                {activeTab === 'completed' && completedTasks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No completed tasks
                    </td>
                  </tr>
                )}

                {activeTab === 'bookings' && bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-xs">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">{booking.serviceName}</td>
                    <td className="px-4 py-3 text-sm">{booking.customerName}</td>
                    <td className="px-4 py-3 text-sm">{booking.serviceProviderName || '-'}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(booking.bookingDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(booking.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {booking.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSettlementBadge(booking.settlementStatus)}`}>
                        {booking.settlementStatus}
                      </span>
                    </td>
                  </tr>
                ))}

                {activeTab === 'providers' && providers.map((provider) => (
                  <tr key={provider.providerId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{provider.providerName}</td>
                    <td className="px-4 py-3 text-sm">{provider.providerEmail}</td>
                    <td className="px-4 py-3 text-sm">{provider.totalTasks}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{provider.acceptedTasks}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{provider.completedTasks}</td>
                    <td className="px-4 py-3 text-sm text-red-600">{provider.rejectedTasks}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(provider.totalEarnings)}</td>
                    <td className="px-4 py-3 text-sm text-yellow-600">{formatCurrency(provider.pendingAmount)}</td>
                  </tr>
                ))}

                {(activeTab === 'accepted' || activeTab === 'rejected' || activeTab === 'completed') && (
                  <>
                    {activeTab === 'accepted' && acceptedTasks.map((task) => (
                      <tr key={task.taskId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-xs">{task.taskId}</td>
                        <td className="px-4 py-3 text-sm">{task.serviceName}</td>
                        <td className="px-4 py-3 text-sm">{task.providerName}</td>
                        <td className="px-4 py-3 text-sm">{task.customerName}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(task.bookingDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(task.fee)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSettlementBadge(task.settlementStatus)}`}>
                            {task.settlementStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleUpdateSettlement(task)}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Update Settlement
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'rejected' && rejectedTasks.map((task) => (
                      <tr key={task.taskId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-xs">{task.taskId}</td>
                        <td className="px-4 py-3 text-sm">{task.serviceName}</td>
                        <td className="px-4 py-3 text-sm">{task.providerName}</td>
                        <td className="px-4 py-3 text-sm">{task.customerName}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(task.bookingDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(task.fee)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            N/A
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {task.rejectionReason && (
                            <span className="text-xs text-gray-500" title={task.rejectionReason}>
                              View Reason
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'completed' && completedTasks.map((task) => (
                      <tr key={task.taskId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-xs">{task.taskId}</td>
                        <td className="px-4 py-3 text-sm">{task.serviceName}</td>
                        <td className="px-4 py-3 text-sm">{task.providerName}</td>
                        <td className="px-4 py-3 text-sm">{task.customerName}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(task.bookingDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(task.fee)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSettlementBadge(task.settlementStatus)}`}>
                            {task.settlementStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleUpdateSettlement(task)}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Update Settlement
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Settlement Update Modal */}
      {showSettlementModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Settlement Status</h2>
            <p className="text-gray-600 mb-4">
              Task: <strong>{selectedTask.serviceName}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Provider: {selectedTask.providerName} | Fee: {formatCurrency(selectedTask.fee)}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Settlement Status
              </label>
              <select
                value={newSettlementStatus}
                onChange={(e) => setNewSettlementStatus(e.target.value as 'pending' | 'paid' | 'disputed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitSettlementUpdate}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowSettlementModal(false);
                  setSelectedTask(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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

export default AdminTaskManagement;
