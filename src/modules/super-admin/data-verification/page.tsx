'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  Users, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  MapPin,
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download
} from 'lucide-react';
import { DataVerificationService } from '@/services/DataVerificationService';
import { toast } from '@/app/components/hooks/use-toast';

interface Verification {
  _id: string;
  verificationId: string;
  verifierUserId: string;
  verifierName: string;
  country: string;
  state: string;
  organizationName: string;
  targetUserFirstName: string;
  targetUserLastName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  permissions: string[];
  createdAt: string;
}

interface Stats {
  total: number;
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
  thisMonth: number;
}

const DataVerificationPage = () => {
  const [activeTab, setActiveTab] = useState('verifications');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedStatus, page, searchTerm, sortBy, sortOrder, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [verificationsRes, usersRes, statsRes]: [any, any, any] = await Promise.all([
        DataVerificationService.getAllVerifications(selectedStatus === 'all' ? undefined : selectedStatus),
        DataVerificationService.getVerificationUsers(),
        DataVerificationService.getVerificationStats()
      ]);

      setVerifications(verificationsRes.data.verifications);
      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
      setTotalUsers(usersRes.data.total || usersRes.data.users.length);
      setTotalPages(Math.ceil((usersRes.data.total || usersRes.data.users.length) / limit));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800">Submitted</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-4 md:pt-4 p-4 md:p-8 min-h-screen bg-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Data Verification Management</h1>
        <p className="text-gray-600 mt-2">Manage data verification processes and field agents</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileCheck className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-2xl font-bold">{stats.submitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="users">Field Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="mr-2 h-5 w-5" />
                All Verifications
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === 'submitted' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('submitted')}
                  size="sm"
                >
                  Submitted
                </Button>
                <Button
                  variant={selectedStatus === 'approved' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('approved')}
                  size="sm"
                >
                  Approved
                </Button>
                <Button
                  variant={selectedStatus === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('rejected')}
                  size="sm"
                >
                  Rejected
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div key={verification._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">#{verification.verificationId}</span>
                          {getStatusBadge(verification.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{verification.verifierName}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{verification.organizationName}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(verification.submittedAt)}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Target: {verification.targetUserFirstName} {verification.targetUserLastName} • 
                          Location: {verification.state}, {verification.country}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {verifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No verifications found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Field Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Updated user table to match user management style */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {/* Search and Filter Section */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search field agents..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {}}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Export CSV
                          </>
                        )}
                      </button>
                      
                      <button
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {}}
                        disabled={exportLoading}
                      >
                        {exportLoading ? (
                          <>
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Export Excel
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'active' | 'suspended' | 'inactive' | '')}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Roles</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="USER">USER</option>
                      </select>
                      
                      <button
                        className="px-4 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => {}}
                      >
                        <Plus className="w-5 h-5" />
                        Add Field Agent
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          S/N
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Full Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Email Address
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Permissions
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Date Created
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {loading ? (
                        <tr className="border-b border-gray-200">
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <p className="text-lg font-medium">Loading field agents...</p>
                            </div>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr className="border-b border-gray-200">
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <p className="text-lg font-medium">No field agents found</p>
                              <p className="text-sm mt-1">Try adjusting your search or filter</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200">
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="text-sm text-gray-900">{index + 1}</div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="text-sm text-gray-900">{user.role}</div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.map((perm) => (
                                  <span key={perm} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {perm}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200">
                              <div className="text-sm text-gray-500">
                                {formatDate(user.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="View user"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Edit user"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {!loading && users.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * limit, totalUsers)}
                      </span>{' '}
                      of <span className="font-medium">{totalUsers}</span> field agents
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`p-2 rounded-lg ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                        {page} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`p-2 rounded-lg ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVerificationPage;