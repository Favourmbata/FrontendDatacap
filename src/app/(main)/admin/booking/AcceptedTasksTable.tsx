"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronUp, ChevronDown, Eye, CheckCircle, XCircle } from "lucide-react";
import AdminTaskManagementService, { TaskReport } from "@/services/AdminTaskManagementService";

interface AcceptedTasksTableProps {
  onTaskClick?: (task: TaskReport) => void;
}

const AcceptedTasksTable: React.FC<AcceptedTasksTableProps> = ({ onTaskClick }) => {
  const [acceptedTasks, setAcceptedTasks] = useState<TaskReport[]>([]);
  const [loadingAcceptedTasks, setLoadingAcceptedTasks] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof TaskReport>('acceptedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const fetchAcceptedTasks = async () => {
    setLoadingAcceptedTasks(true);
    try {
      const response = await AdminTaskManagementService.getAcceptedTasksReport();
      
      if (response.success) {
        setAcceptedTasks(response.data.tasks);
      } else {
        console.error('Failed to fetch accepted tasks:', response.message);
      }
    } catch (error) {
      console.error('Error fetching accepted tasks:', error);
    } finally {
      setLoadingAcceptedTasks(false);
    }
  };

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  const sortedAcceptedTasks = useMemo(() => {
    const sorted = [...acceptedTasks];
    if (sortColumn) {
      sorted.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }
    return sorted;
  }, [acceptedTasks, sortColumn, sortDirection]);

  const handleSort = (column: keyof TaskReport) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: keyof TaskReport }) => {
    if (sortColumn !== column) return <span className="w-4 h-4 inline-block" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (loadingAcceptedTasks) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accepted tasks...</p>
          <p className="text-xs text-gray-400 mt-2">Fetching from API</p>
        </div>
      </div>
    );
  }

  if (acceptedTasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No accepted tasks found</p>
          <button
            onClick={fetchAcceptedTasks}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold">Accepted Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            {acceptedTasks.length} task{acceptedTasks.length !== 1 ? 's' : ''} accepted
          </p>
        </div>
        <button
          onClick={fetchAcceptedTasks}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('serviceName')}>
                <div className="flex items-center gap-1">
                  Service
                  <SortIcon column="serviceName" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('providerName')}>
                <div className="flex items-center gap-1">
                  Provider
                  <SortIcon column="providerName" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}>
                <div className="flex items-center gap-1">
                  Customer
                  <SortIcon column="customerName" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('bookingDate')}>
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon column="bookingDate" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('fee')}>
                <div className="flex items-center gap-1">
                  Fee
                  <SortIcon column="fee" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settlement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAcceptedTasks.map((task, index) => (
              <tr key={task.taskId} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-mono text-xs">{task.taskId}</p>
                    {task.acceptedAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(task.acceptedAt).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-xs">{task.bookingId}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{task.serviceName}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{task.providerName}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{task.customerName}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(task.bookingDate).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatCurrency(task.fee)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.settlementStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    task.settlementStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    task.settlementStatus === 'disputed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.settlementStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {onTaskClick && (
                    <button
                      onClick={() => onTaskClick(task)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcceptedTasksTable;
