"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import DataVerificationService from '@/services/DataVerificationService';
import { FileText, MapPin, Building, CheckCircle, Clock, Plus, Eye, Search } from 'lucide-react';

interface Assignment {
  _id: string;
  organizationId: string;
  organizationName: string;
  targetUserId: string;
  targetUserName: string;
  targetUserEmail: string;
  organizationLocationDetails: Array<{
    locationType: string;
    brandName: string;
    country: string;
    state: string;
    lga: string;
    city: string;
    cityRegion: string;
    houseNumber: string;
    street: string;
    landmark: string;
    buildingColor?: string;
    buildingType?: string;
  }>;
  status: 'pending' | 'in_progress' | 'completed';
  assignedAt: string;
  verificationId?: string;
}

const FieldAgentPage = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const dataVerificationService = new DataVerificationService();

  useEffect(() => {
    if (token) {
      fetchAssignments();
    } else {
      setError('Please log in to view assignments');
      setLoading(false);
    }
  }, [token]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await dataVerificationService.getMyAssignments(token);
      
      if (response.success && response.data) {
        setAssignments(response.data.assignments);
      } else {
        setError(response.message || 'Failed to fetch assignments');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <FileText className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateVerification = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowCreateModal(true);
  };

  const handleViewDetails = (assignment: Assignment) => {
    // Navigate to assignment details or show modal
    alert(`View details for assignment ${assignment._id}`);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.targetUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.targetUserEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Field Agent - Data Verification</h1>
            <p className="text-gray-600">Manage your data verification assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {assignments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {assignments.filter(a => a.status === 'in_progress').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {assignments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by organization, contact name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => setShowCreateModal(true)}
                  disabled={filteredAssignments.length === 0}
                  className="px-4 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Verification
                </button>
              </div>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {error || 'No assignments found'}
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assignment.organizationName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {assignment.organizationId.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.targetUserName}</div>
                          <div className="text-sm text-gray-500">{assignment.targetUserEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {assignment.organizationLocationDetails[0]?.city}, {assignment.organizationLocationDetails[0]?.state}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.organizationLocationDetails.length} location(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(assignment.status)}
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                              {assignment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(assignment.assignedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(assignment)}
                              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Verification Modal */}
      {showCreateModal && selectedAssignment && (
        <CreateVerificationModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedAssignment(null);
            fetchAssignments();
          }}
          token={token!}
        />
      )}
    </div>
  );
};

// Create Verification Modal Component
interface CreateVerificationModalProps {
  assignment: Assignment;
  onClose: () => void;
  token: string;
}

const CreateVerificationModal: React.FC<CreateVerificationModalProps> = ({ assignment, onClose, token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: 'Nigeria',
    state: '',
    lga: '',
    city: '',
    cityRegion: '',
    targetUserFirstName: '',
    targetUserLastName: '',
    headquartersAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verificationData = {
        assignmentId: assignment._id,
        ...formData,
        organizationId: assignment.organizationId,
        organizationName: assignment.organizationName,
        targetUserId: assignment.targetUserId,
        organizationClaimedLocation: {
          locationType: 'headquarters' as const,
          country: formData.country,
          state: formData.state,
          lga: formData.lga,
          city: formData.city,
          cityRegion: formData.cityRegion,
        },
        organizationDetails: {
          name: assignment.organizationName,
          headquartersAddress: formData.headquartersAddress,
        },
      };

      const service = new DataVerificationService();
      const response = await service.createVerification(verificationData, token);

      if (response.success) {
        alert('Verification created successfully! Assignment status updated to in_progress.');
        onClose();
        router.push('/admin/data-verification/field-agent');
      } else {
        alert(response.message || 'Failed to create verification');
      }
    } catch (error) {
      console.error('Error creating verification:', error);
      alert('An error occurred while creating verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Verification</h2>
          <p className="text-sm text-gray-600 mt-1">Organization: {assignment.organizationName}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.targetUserFirstName}
                    onChange={(e) => setFormData({...formData, targetUserFirstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.targetUserLastName}
                    onChange={(e) => setFormData({...formData, targetUserLastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="e.g., Lagos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lga}
                    onChange={(e) => setFormData({...formData, lga: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="e.g., Ikeja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="e.g., Ikeja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City Region/Street
                  </label>
                  <input
                    type="text"
                    value={formData.cityRegion}
                    onChange={(e) => setFormData({...formData, cityRegion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                    placeholder="e.g., Allen Avenue"
                  />
                </div>
              </div>
            </div>

            {/* Headquarters Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters Address
              </label>
              <textarea
                value={formData.headquartersAddress}
                onChange={(e) => setFormData({...formData, headquartersAddress: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent"
                placeholder="Enter full headquarters address"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-[#5d2a8b] text-white rounded-lg hover:bg-[#7a3aa3] transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldAgentPage;
