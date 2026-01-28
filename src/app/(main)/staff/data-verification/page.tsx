"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataVerificationService, VerificationStatus } from '@/services/DataVerificationService';
import { Plus, Search, Eye, Edit, Trash2, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Verification {
  _id: string;
  verificationId: string;
  organizationName: string;
  status: VerificationStatus;
  createdAt: string;
}

export default function DataVerificationPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const dataVerificationService = new DataVerificationService();

  useEffect(() => {
    fetchVerifications();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [verifications, searchTerm, statusFilter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await dataVerificationService.getMyVerifications();
      if (response.success) {
        setVerifications(response.data.verifications);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
      // Mock data for demo
      setVerifications([
        {
          _id: '1',
          verificationId: 'DV-001',
          organizationName: 'Tech Solutions Ltd',
          status: 'draft',
          createdAt: '2024-01-15T09:00:00.000Z'
        },
        {
          _id: '2',
          verificationId: 'DV-002',
          organizationName: 'Global Services Inc',
          status: 'submitted',
          createdAt: '2024-01-14T14:30:00.000Z'
        },
        {
          _id: '3',
          verificationId: 'DV-003',
          organizationName: 'Innovation Hub Co',
          status: 'approved',
          createdAt: '2024-01-13T11:15:00.000Z'
        },
        {
          _id: '4',
          verificationId: 'DV-004',
          organizationName: 'Digital Systems LLC',
          status: 'rejected',
          createdAt: '2024-01-12T16:45:00.000Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterVerifications = () => {
    let filtered = verifications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(verification => 
        verification.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.verificationId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(verification => verification.status === statusFilter);
    }

    setFilteredVerifications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (id: string) => {
    router.push(`/staff/data-verification/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/staff/data-verification/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this verification?')) {
      setVerifications(prev => prev.filter(v => v._id !== id));
      setFilteredVerifications(prev => prev.filter(v => v._id !== id));
    }
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Verifications</h1>
              <p className="text-gray-600 mt-1">Manage your organization verification requests</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total: <span className="font-medium">{filteredVerifications.length}</span> verifications
              </span>
              <button
                onClick={() => router.push('/staff/data-verification/create')}
                className="flex items-center px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Verification
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by organization name or ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Verifications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D2A8B]"></div>
              <span className="ml-3 text-gray-600">Loading verifications...</span>
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Get started by creating your first verification'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/staff/data-verification/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#5D2A8B] hover:bg-[#4a216d]"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create Verification
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVerifications.map((verification) => (
                    <tr key={verification._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {verification.organizationName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {verification.verificationId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                          {getStatusIcon(verification.status)}
                          <span className="ml-1">
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(verification.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(verification._id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {verification.status === 'draft' && (
                            <button
                              onClick={() => handleEdit(verification._id)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(verification._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}