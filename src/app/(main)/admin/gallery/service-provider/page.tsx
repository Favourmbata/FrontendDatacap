"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

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

type TaskTab = 'available' | 'accepted' | 'completed' | 'rejected';

const ServiceProviderDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState<TaskTab>('available');

  useEffect(() => {
    // Fetch tasks for service provider
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // TODO: Replace with actual API call
      const mockTasks: Task[] = [
        {
          id: '1',
          serialNumber: 'SN-2026-001',
          title: 'Add New Gallery Item',
          description: 'Create and upload new gallery items for fashion collection',
          type: 'gallery',
          priority: 'high',
          status: 'pending',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          organizationName: 'Fashion Hub Ltd',
          serviceProviderName: 'Creative Studio NG',
          serviceProviderId: 'SP-001',
          customerFullName: 'Chidinma Okafor',
          customerId: 'CUST-2026-001',
          assignmentDateTime: new Date('2026-03-20T10:30:00'),
          serviceDuration: '5 days',
          feeInNaira: 150000,
        },
        {
          id: '2',
          serialNumber: 'SN-2026-002',
          title: 'Update Product Measurements',
          description: 'Update measurement data for winter clothing line',
          type: 'product',
          priority: 'medium',
          status: 'pending',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          organizationName: 'Style Co',
          serviceProviderName: 'Premium Products Ltd',
          serviceProviderId: 'SP-002',
          customerFullName: 'Adebayo Johnson',
          customerId: 'CUST-2026-002',
          assignmentDateTime: new Date('2026-03-19T14:15:00'),
          serviceDuration: '3 days',
          feeInNaira: 85000,
        },
        {
          id: '3',
          serialNumber: 'SN-2026-003',
          title: 'Create Service Package',
          description: 'Define new tailoring service package with pricing',
          type: 'service',
          priority: 'low',
          status: 'pending',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          organizationName: 'Tailor Masters',
          serviceProviderName: 'Expert Services Inc',
          serviceProviderId: 'SP-003',
          customerFullName: 'Fatima Abdullahi',
          customerId: 'CUST-2026-003',
          assignmentDateTime: new Date('2026-03-18T09:00:00'),
          serviceDuration: '7 days',
          feeInNaira: 200000,
        },
        {
          id: '4',
          serialNumber: 'SN-2026-004',
          title: 'Custom Tailoring Service',
          description: 'Professional custom tailoring for corporate wear',
          type: 'service',
          priority: 'high',
          status: 'accepted',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          organizationName: 'Corporate Styles',
          serviceProviderName: 'Creative Studio NG',
          serviceProviderId: 'SP-001',
          customerFullName: 'Oluwaseun Adeyemi',
          customerId: 'CUST-2026-004',
          assignmentDateTime: new Date('2026-03-17T11:45:00'),
          serviceDuration: '4 days',
          feeInNaira: 120000,
        },
        {
          id: '5',
          serialNumber: 'SN-2026-005',
          title: 'Product Photography',
          description: 'Professional photography for e-commerce products',
          type: 'gallery',
          priority: 'medium',
          status: 'completed',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          organizationName: 'E-shop Nigeria',
          serviceProviderName: 'Premium Products Ltd',
          serviceProviderId: 'SP-002',
          customerFullName: 'Ibrahim Mohammed',
          customerId: 'CUST-2026-005',
          assignmentDateTime: new Date('2026-03-15T08:30:00'),
          serviceDuration: '3 days',
          feeInNaira: 95000,
        },
        {
          id: '6',
          serialNumber: 'SN-2026-006',
          title: 'Express Alterations',
          description: 'Quick alterations and adjustments for wedding dress',
          type: 'service',
          priority: 'urgent',
          status: 'rejected',
          assignedDate: new Date(),
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          organizationName: 'Bridal World',
          serviceProviderName: 'Expert Services Inc',
          serviceProviderId: 'SP-003',
          customerFullName: 'Blessing Okonkwo',
          customerId: 'CUST-2026-006',
          assignmentDateTime: new Date('2026-03-21T16:20:00'),
          serviceDuration: '1 day',
          feeInNaira: 45000,
        },
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      // TODO: Replace with actual API call
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'accepted' as const } : task
      ));
      alert('Task accepted successfully!');
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('Failed to accept task');
    }
  };

  const handleRejectTask = (task: Task) => {
    setSelectedTask(task);
    setShowRejectionModal(true);
  };

  const handleSubmitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      // TODO: Replace with actual API call
      if (selectedTask) {
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? { ...task, status: 'rejected' as const } : task
        ));
        // Here you would also send the rejection reason to the backend
        console.log('Rejection reason:', rejectionReason);
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedTask(null);
        alert('Task rejected. Organization admin will be notified.');
      }
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Failed to reject task');
    }
  };

  const handleResetTask = async (taskId: string) => {
    try {
      // TODO: Replace with actual API call
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'pending' as const } : task
      ));
      alert('Task reset to pending status!');
    } catch (error) {
      console.error('Error resetting task:', error);
      alert('Failed to reset task');
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

  const getFilteredTasks = (): Task[] => {
    switch (activeTab) {
      case 'available': return tasks.filter(t => t.status === 'pending');
      case 'accepted': return tasks.filter(t => t.status === 'accepted');
      case 'completed': return tasks.filter(t => t.status === 'completed');
      case 'rejected': return tasks.filter(t => t.status === 'rejected');
      default: return [];
    }
  };

  const getCurrentTabTitle = (): string => {
    switch (activeTab) {
      case 'available': return 'Available Tasks';
      case 'accepted': return 'Accepted Tasks';
      case 'completed': return 'Completed Tasks';
      case 'rejected': return 'Rejected Tasks';
    }
  };

  const getCurrentTabDescription = (): string => {
    switch (activeTab) {
      case 'available': return 'Review and accept or reject allocated tasks';
      case 'accepted': return 'Tasks you have accepted and are working on';
      case 'completed': return 'Successfully completed tasks';
      case 'rejected': return 'Tasks you have rejected (reasons visible to organization admin)';
    }
  };

  // Format currency in Naira
  const formatNaira = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date and time
  const formatDateTime = (date: Date): string => {
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
    
    // Prepare data for export
    const exportData = filteredTasks.map(task => ({
      'S/N': task.serialNumber,
      'Task': task.title,
      'Service Provider': task.serviceProviderName,
      'Service Provider ID': task.serviceProviderId,
      "Customer's Full Name": task.customerFullName,
      'Customer ID': task.customerId,
      'Date & Time of Assignment': formatDateTime(task.assignmentDateTime),
      'Duration': task.serviceDuration,
      'Fee (₦)': task.feeInNaira,
      'Status': task.status.toUpperCase(),
      'Priority': task.priority.toUpperCase()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // S/N
      { wch: 30 }, // Task
      { wch: 25 }, // Service Provider
      { wch: 15 }, // Service Provider ID
      { wch: 25 }, // Customer Name
      { wch: 15 }, // Customer ID
      { wch: 25 }, // Date & Time
      { wch: 12 }, // Duration
      { wch: 15 }, // Fee
      { wch: 12 }, // Status
      { wch: 10 }  // Priority
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${getCurrentTabTitle()} Tasks`);

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `Service_Provider_${getCurrentTabTitle().replace(' ', '_')}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const acceptedTasks = tasks.filter(t => t.status === 'accepted');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const rejectedTasks = tasks.filter(t => t.status === 'rejected');

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
            onClick={() => setActiveTab('available')}
            className={`bg-white rounded-lg shadow p-6 transition-all ${
              activeTab === 'available' ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{pendingTasks.length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{acceptedTasks.length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{completedTasks.length}</p>
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
                <p className="text-3xl font-bold text-gray-900">{rejectedTasks.length}</p>
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
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'available'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available
                </div>
                <span className="block mt-1 text-xs opacity-75">{pendingTasks.length} tasks</span>
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
                <span className="block mt-1 text-xs opacity-75">{acceptedTasks.length} tasks</span>
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
                <span className="block mt-1 text-xs opacity-75">{completedTasks.length} tasks</span>
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
                <span className="block mt-1 text-xs opacity-75">{rejectedTasks.length} tasks</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee (₦)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredTasks().length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                      {activeTab === 'available' && 'No pending tasks available'}
                      {activeTab === 'accepted' && 'No accepted tasks'}
                      {activeTab === 'completed' && 'No completed tasks'}
                      {activeTab === 'rejected' && 'No rejected tasks'}
                    </td>
                  </tr>
                ) : (
                  getFilteredTasks().map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.serialNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-xs text-gray-500">{task.description.substring(0, 50)}...</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.serviceProviderName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{task.serviceProviderId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.customerFullName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{task.customerId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDateTime(task.assignmentDateTime)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{task.serviceDuration}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatNaira(task.feeInNaira)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {activeTab === 'available' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAcceptTask(task.id)}
                              className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              title="Accept Task"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectTask(task)}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              title="Reject Task"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {activeTab === 'accepted' && (
                          <button
                            onClick={() => handleResetTask(task.id)}
                            className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            title="Reset Task"
                          >
                            <RefreshCw className="w-4 h-4" />
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
              You are rejecting: <strong>{selectedTask.title}</strong>
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
