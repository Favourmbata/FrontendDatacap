'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  MapPin,
  Users
} from 'lucide-react';
import { DataVerificationService } from '@/services/DataVerificationService';
import { toast } from '@/app/components/hooks/use-toast';

interface Verification {
  _id: string;
  verificationId: string;
  organizationName: string;
  targetUserFirstName: string;
  targetUserLastName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  submittedAt?: string;
}

const UserDataVerificationPage = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await DataVerificationService.getMyVerifications();
      const verificationsData = response.data.verifications || [];
      
      setVerifications(verificationsData);
      
      // Calculate stats
      const statsData = {
        total: verificationsData.length,
        draft: verificationsData.filter((v: Verification) => v.status === 'draft').length,
        submitted: verificationsData.filter((v: Verification) => v.status === 'submitted').length,
        approved: verificationsData.filter((v: Verification) => v.status === 'approved').length,
        rejected: verificationsData.filter((v: Verification) => v.status === 'rejected').length
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Verification</h1>
          <p className="text-gray-600 mt-2">Manage your verification requests and submissions</p>
        </div>
        <Button onClick={() => console.log('Create new verification')}>
          <Plus className="mr-2 h-4 w-4" />
          New Verification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
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
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
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
              <Upload className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-2xl font-bold">{stats.submitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            My Verifications
          </CardTitle>
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
                        <span>{verification.targetUserFirstName} {verification.targetUserLastName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{verification.organizationName}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {verification.submittedAt 
                            ? `Submitted: ${formatDate(verification.submittedAt)}` 
                            : `Created: ${formatDate(verification.createdAt)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {verification.status === 'draft' && (
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {verifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No verifications found</p>
                <p className="text-sm mt-2">Create your first verification to get started</p>
                <Button className="mt-4" onClick={() => console.log('Create new verification')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Verification
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDataVerificationPage;