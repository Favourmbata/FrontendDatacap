"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2, MessageSquare, FileText, Upload, Video, Link } from 'lucide-react';
import ServiceProviderTaskService, { 
  AssignedTask, 
  AcceptedTask, 
  RejectedTask,
  CompletedTask,
  CompletionTemplate,
  CompletionTemplateResponse
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
  
  // Completion flow states
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [completionTemplate, setCompletionTemplate] = useState<CompletionTemplate | null>(null);
  const [completionFormData, setCompletionFormData] = useState<Record<string, string | string[] | Array<{ url: string; type: string }>>>({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Action states
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
          const completedRes = await ServiceProviderTaskService.getCompletedTasksWithDetails();
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

  const handleShowCompletionModal = async (taskId: string) => {
    try {
      setProcessingTask(taskId);
      const templateRes = await ServiceProviderTaskService.getCompletionTemplate(taskId);
      if (templateRes.success) {
        setCompletionTemplate(templateRes.data.template);
        setSelectedTaskId(taskId);
        setShowCompletionModal(true);
        // Initialize form data with empty values for required fields
        const initialFormData: Record<string, string | string[]> = {};
        Object.entries(templateRes.data.template.completionFields).forEach(([key, field]) => {
          if (field.required && field.type === 'textarea') {
            initialFormData[key] = '';
          } else if (field.required && field.type === 'file[]') {
            initialFormData[key] = [];
          }
        });
        setCompletionFormData(initialFormData);
      }
    } catch (err: any) {
      console.error('Error fetching completion template:', err);
      alert(err.message || 'Failed to load completion template');
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

  const handleCompleteTaskWithDetails = async () => {
    if (!selectedTaskId || !completionTemplate) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare the data for submission
      const submissionData: {
        serviceCompletionDeclaration: string;
        serviceComment?: string;
        serviceImages?: string[];
        serviceVideoUrl?: string;
        videoUrl?: string;
      } = {
        serviceCompletionDeclaration: completionFormData.serviceCompletionDeclaration as string || '',
      };
      
      // Add optional fields if they exist in the form data
      if (completionFormData.serviceComment) {
        submissionData.serviceComment = completionFormData.serviceComment as string;
      }
      if (Array.isArray(completionFormData.serviceImages)) {
        // Extract only the 'url' strings from preview objects
        submissionData.serviceImages = (completionFormData.serviceImages as Array<{ url: string }>)
          .map(item => item.url);
      }
      if (completionFormData.serviceVideoUrl) {
        submissionData.serviceVideoUrl = completionFormData.serviceVideoUrl as string;
      }
      if (completionFormData.videoUrl) {
        submissionData.videoUrl = completionFormData.videoUrl as string;
      }
      
      const response = await ServiceProviderTaskService.completeTaskWithDetails(selectedTaskId, submissionData);
      
      if (response.success) {
        alert('Task completed successfully with confirmation details! Settlement process has begun.');
        setShowCompletionModal(false);
        setSelectedTaskId(null);
        setCompletionTemplate(null);
        setCompletionFormData({});
        fetchData();
      }
    } catch (err: any) {
      console.error('Error completing task with details:', err);
      alert(err.message || 'Failed to complete task with confirmation details');
    } finally {
      setIsSubmitting(false);
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
                    onClick={() => handleShowCompletionModal(task.taskId)}
                    disabled={processingTask === task.taskId}
                    className="flex-1 md:flex-none px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Complete Task
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
              
              {task.confirmationDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg ml-13">
                  <h4 className="font-semibold text-gray-900 mb-2">Confirmation Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Completion Declaration:</span>
                      <p className="text-gray-600 mt-1">{task.confirmationDetails.serviceCompletionDeclaration}</p>
                    </div>
                    {task.confirmationDetails.serviceComment && (
                      <div>
                        <span className="font-medium text-gray-700">Comments:</span>
                        <p className="text-gray-600 mt-1">{task.confirmationDetails.serviceComment}</p>
                      </div>
                    )}
                    {task.confirmationDetails.serviceImages && task.confirmationDetails.serviceImages.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Images:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.confirmationDetails.serviceImages.map((imgUrl, idx) => (
                            <div key={idx} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              <img src={imgUrl} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {task.confirmationDetails.serviceVideoUrl && (
                      <div>
                        <span className="font-medium text-gray-700">Video:</span>
                        <div className="mt-1 flex items-center gap-2">
                          <Video className="w-4 h-4 text-gray-600" />
                          <span className="text-blue-600 hover:underline cursor-pointer">View Video</span>
                        </div>
                      </div>
                    )}
                    {task.confirmationDetails.videoUrl && (
                      <div>
                        <span className="font-medium text-gray-700">Video URL:</span>
                        <a href={task.confirmationDetails.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          {task.confirmationDetails.videoUrl}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Confirmed At:</span>
                      <span className="text-gray-600 ml-2">{formatDate(task.confirmationDetails.confirmedAt)}</span>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Completion Modal */}
      {showCompletionModal && completionTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Complete Task: {completionTemplate.serviceName}</h2>
              <button 
                onClick={() => {
                  setShowCompletionModal(false);
                  setSelectedTaskId(null);
                  setCompletionTemplate(null);
                  setCompletionFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Task Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Customer:</span> {completionTemplate.customerName}</div>
                <div><span className="font-medium">Date:</span> {formatDate(completionTemplate.serviceDate)}</div>
                <div><span className="font-medium">Time:</span> {completionTemplate.serviceTime}</div>
                <div><span className="font-medium">Location:</span> {getLocationText(completionTemplate.location)}</div>
              </div>
            </div>

            <h3 className="font-semibold mb-4">Please provide confirmation details</h3>
            
            <div className="space-y-6">
              {Object.entries(completionTemplate.completionFields).map(([key, field]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.description && <span className="block text-xs text-gray-500 mt-1">{field.description}</span>}
                  </label>
                  
                  {field.type === 'textarea' && (
                    <textarea
                      value={completionFormData[key] as string || ''}
                      onChange={(e) => setCompletionFormData(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={field.maxLength && field.maxLength > 500 ? 6 : 4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${field.required && !(completionFormData[key] as string) ? 'border-red-500' : 'border-gray-300'}`}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'file[]' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload up to {field.maxFiles} files</p>
                      <p className="text-xs text-gray-500 mb-2">Accepts: {field.accept}</p>
                      <label className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 cursor-pointer inline-block">
                        Choose Files
                        <input
                          type="file"
                          multiple
                          accept={field.accept}
                          onChange={(e) => {
                            const fileList = e.target.files;
                            if (!fileList || fileList.length === 0) return;
                            const files = Array.from(fileList);
                            // Store preview objects with type for conditional rendering
                            const previewItems = files.map(file => ({
                              url: URL.createObjectURL(file),
                              type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other',
                            }));
                            setCompletionFormData(prev => ({
                              ...prev,
                              [key]: previewItems,
                            } as Record<string, string | string[] | Array<{ url: string; type: string }>>));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {/* Preview section */}
                  {Array.isArray(completionFormData[key]) && completionFormData[key].length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(Array.isArray(completionFormData[key]) && 'url' in (completionFormData[key] as any)[0]
                        ? (completionFormData[key] as Array<{ url: string; type: string }>)
                        : []
                      ).map((item, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-24 object-cover"
                            />
                          ) : item.type === 'video' ? (
                            <video
                              src={item.url}
                              className="w-full h-24 object-cover"
                              muted
                            />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                              Unsupported
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              // Revoke object URL
                              URL.revokeObjectURL(item.url);
                              // Remove from array
                              setCompletionFormData(prev => ({
                                ...prev,
                                [key]: (Array.isArray(prev[key]) && 'url' in (prev[key] as any)[0]
                                  ? (prev[key] as Array<{ url: string; type: string }>)
                                  : []
                                ).filter((_, i) => i !== idx),
                              } as Record<string, string | string[] | Array<{ url: string; type: string }>>));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {field.type === 'file' && field.accept?.includes('video') && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload video (max {field.maxDuration} seconds)</p>
                      <p className="text-xs text-gray-500 mb-2">Accepts: {field.accept}</p>
                      <button 
                        type="button"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                      >
                        Choose Video
                      </button>
                    </div>
                  )}
                  
                  {field.type === 'url' && (
                    <div className="flex gap-2">
                      <Link className="w-5 h-5 text-gray-400 mt-2" />
                      <input
                        type="url"
                        value={completionFormData[key] as string || ''}
                        onChange={(e) => setCompletionFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleCompleteTaskWithDetails}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Submit Completion
              </button>
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setSelectedTaskId(null);
                  setCompletionTemplate(null);
                  setCompletionFormData({});
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
