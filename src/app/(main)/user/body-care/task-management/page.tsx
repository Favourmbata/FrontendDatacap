"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import ServiceProviderTaskService, { 
  AssignedTask, 
  AcceptedTask, 
  RejectedTask,
  CompletedTask,
  TaskStatistics
} from '@/services/ServiceProviderTaskService';

type TabType = 'assigned' | 'accepted' | 'rejected' | 'completed';

const TaskManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('assigned');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
  const [acceptedTasks, setAcceptedTasks] = useState<AcceptedTask[]>([]);
  const [rejectedTasks, setRejectedTasks] = useState<RejectedTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  
  // Action states
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics
      const statsRes = await ServiceProviderTaskService.getTaskStatistics();
      if (statsRes.success) {
        setStatistics(statsRes.data.statistics);
      }

      // Fetch tasks based on active tab
      switch (activeTab) {
        case 'assigned':
          const assignedRes = await ServiceProviderTaskService.getAssignedTasks();
          if (assignedRes.success) setAssignedTasks(assignedRes.data.tasks);
          break;
        case 'accepted':
          const acceptedRes = await ServiceProviderTaskService.getAcceptedTasks();
          if (acceptedRes.success) setAcceptedTasks(acceptedRes.data.tasks);
          break;
        case 'rejected':
          const rejectedRes = await ServiceProviderTaskService.getRejectedTasks();
          if (rejectedRes.success) setRejectedTasks(rejectedRes.data.tasks);
          break;
        case 'completed':
          const completedRes = await ServiceProviderTaskService.getCompletedTasks();
          if (completedRes.success) setCompletedTasks(completedRes.data.tasks);
          break;
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      setProcessingTask(taskId);
      const response = await ServiceProviderTaskService.acceptTask(taskId);
      
      if (response.success) {
        alert('Task accepted successfully! Customer details are now available.');
        fetchData();
      }
    } catch (err: any) {
      console.error('Error accepting task:', err);
      alert(err.message || 'Failed to accept task');
    } finally {
      setProcessingTask(null);
    }
  };

  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedTaskId || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingTask(selectedTaskId);
      const response = await ServiceProviderTaskService.rejectTask(selectedTaskId, rejectionReason);
      
      if (response.success) {
        alert('Task rejected successfully');
        setShowRejectModal(false);
        setSelectedTaskId(null);
        setRejectionReason('');
        fetchData();
      }
    } catch (err: any) {
      console.error('Error rejecting task:', err);
      alert(err.message || 'Failed to reject task');
    } finally {
      setProcessingTask(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setProcessingTask(taskId);
      const response = await ServiceProviderTaskService.completeTask(taskId);
      
      if (response.success) {
        alert('Task marked as completed! Settlement process has begun.');
        fetchData();
      }
    } catch (err: any) {
      console.error('Error completing task:', err);
      alert(err.message || 'Failed to complete task');
    } finally {
      setProcessingTask(null);
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

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getLocationText = (location: string | { type: string; address?: string }): string => {
    if (typeof location === 'string') return location;
    
    const typeMap: Record<string, string> = {
      'customer_address': "Customer's Address",
      'merchant_location': 'Service Provider Location',
      'new_address': 'New Address'
    };
    
    const typeText = typeMap[location.type] || location.type;
    return location.address ? `${typeText}: ${location.address}` : typeText;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" min-h-screen bg-gray-50 p-8 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
          <p className="text-gray-600">Manage your service provider tasks and appointments</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.assigned}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.accepted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.completed}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { id: 'assigned' as TabType, label: 'Assigned Tasks', icon: Calendar, count: assignedTasks.length },
                { id: 'accepted' as TabType, label: 'Accepted', icon: CheckCircle, count: acceptedTasks.length },
                { id: 'rejected' as TabType, label: 'Rejected', icon: XCircle, count: rejectedTasks.length },
                { id: 'completed' as TabType, label: 'Completed', icon: Clock, count: completedTasks.length },
              ].map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 min-w-[120px] py-4 px-4 text-center border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {activeTab === 'assigned' && assignedTasks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assigned tasks available</p>
            </div>
          )}
          {activeTab === 'accepted' && acceptedTasks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No accepted tasks</p>
            </div>
          )}
          {activeTab === 'rejected' && rejectedTasks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rejected tasks</p>
            </div>
          )}
          {activeTab === 'completed' && completedTasks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No completed tasks</p>
            </div>
          )}

          {/* Assigned Tasks */}
          {activeTab === 'assigned' && assignedTasks.map((task) => (
            <div key={task.taskId} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{task.serviceName}</h3>
                      <p className="text-sm text-gray-600">Task ID: {task.taskId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(task.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{formatTime(task.time)} ({task.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{getLocationText(task.location)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-green-600">{formatCurrency(task.fee)}</span>
                    </div>
                  </div>

                  <div className="mt-3 ml-13">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Customer:</span> {task.customerFirstName} (ID: {task.customerId})
                    </p>
                    {task.notes && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{task.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 md:items-end">
                  <button
                    onClick={() => handleAcceptTask(task.taskId)}
                    disabled={processingTask === task.taskId}
                    className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingTask === task.taskId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectClick(task.taskId)}
                    disabled={processingTask === task.taskId}
                    className="flex-1 md:flex-none px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Accepted Tasks */}
          {activeTab === 'accepted' && acceptedTasks.map((task) => (
            <div key={task.taskId} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{task.serviceName}</h3>
                      <p className="text-sm text-gray-600">Task ID: {task.taskId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{formatDate(task.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{formatTime(task.time)} ({task.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{getLocationText(task.location)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-green-600">{formatCurrency(task.fee)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 rounded-lg ml-13">
                    <p className="text-sm font-semibold text-green-900 mb-2">Customer Details</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {task.customerFullName}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {task.customerEmail}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {task.customerPhone}</p>
                  </div>

                  {task.notes && (
                    <p className="text-sm text-gray-600 mt-3 ml-13 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{task.notes}</span>
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 md:items-end">
                  <button
                    onClick={() => handleCompleteTask(task.taskId)}
                    disabled={processingTask === task.taskId}
                    className="flex-1 md:flex-none px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingTask === task.taskId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Rejected Tasks */}
          {activeTab === 'rejected' && rejectedTasks.map((task) => (
            <div key={task.taskId} className="bg-white rounded-lg shadow p-6 opacity-75">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.serviceName}</h3>
                  <p className="text-sm text-gray-600">Task ID: {task.taskId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(task.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{formatTime(task.time)} ({task.duration} min)</span>
                </div>
              </div>

              <div className="mt-3 ml-13">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Customer:</span> {task.customerFirstName} (ID: {task.customerId})
                </p>
                <div className="mt-2 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-900">
                    <span className="font-medium">Rejection Reason:</span> {task.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Completed Tasks */}
          {activeTab === 'completed' && completedTasks.map((task) => (
            <div key={task.taskId} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.serviceName}</h3>
                  <p className="text-sm text-gray-600">Task ID: {task.taskId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-13">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(task.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{formatTime(task.time)} ({task.duration} min)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-green-600">{formatCurrency(task.fee)}</span>
                </div>
              </div>

              <div className="mt-3 ml-13">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Customer:</span> {task.customerFullName} (ID: {task.customerId})
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Settlement:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.settlementStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    task.settlementStatus === 'disputed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.settlementStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Reject Task</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this task. This will be sent to the admin.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Not available at that time, Schedule conflict, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRejectSubmit}
                disabled={processingTask === selectedTaskId || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processingTask === selectedTaskId && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedTaskId(null);
                  setRejectionReason('');
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

export default TaskManagementPage;
