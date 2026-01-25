'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  MapPin, 
  Calendar,
  Users,
  Building,
  Camera,
  DollarSign
} from 'lucide-react';
import { DataVerificationService } from '@/services/DataVerificationService';
import { toast } from '@/app/components/hooks/use-toast';

interface VerificationDetail {
  _id: string;
  verificationId: string;
  verifierUserId: string;
  verifierName: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organizationId: string;
  organizationName: string;
  targetUserId: string;
  targetUserFirstName: string;
  targetUserLastName: string;
  organizationDetails: {
    name: string;
    attachments: Array<{ fileUrl: string; comments: string }>;
    headquartersAddress: string;
    addressAttachments: Array<{ fileUrl: string; comments: string }>;
  };
  buildingPictures: {
    frontView: string;
    streetPicture: string;
    agentInFrontBuilding: string;
    whatsappLocation: string;
    insideOrganization: string;
    withStaffOrOwner: string;
    videoWithNeighbor: string;
  };
  transportationCost: {
    going: Array<{
      startPoint: string;
      time: string;
      nextDestination: string;
      fareSpent: number;
      timeSpent: string;
    }>;
    finalDestination: string;
    finalFareSpent: number;
    finalTime: string;
    totalJourneyTime: string;
    comingBack: {
      totalTransportationCost: number;
      otherExpensesCost: number;
      receiptUrl: string;
    };
  };
  status: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationId: string;
  onReviewComplete: () => void;
}

const ReviewVerificationModal = ({ 
  isOpen, 
  onClose, 
  verificationId,
  onReviewComplete 
}: ReviewVerificationModalProps) => {
  const [verification, setVerification] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected' | null>(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && verificationId) {
      fetchVerificationDetails();
    }
  }, [isOpen, verificationId]);

  const fetchVerificationDetails = async () => {
    try {
      setLoading(true);
      const response: any = await DataVerificationService.getVerificationById(verificationId);
      setVerification(response.data.verification);
    } catch (error) {
      console.error('Error fetching verification details:', error);
      toast({
        title: "Error",
        description: "Failed to load verification details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewStatus) {
      toast({
        title: "Validation Error",
        description: "Please select a review decision",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await DataVerificationService.reviewVerification(verificationId, {
        status: reviewStatus,
        comments
      });

      toast({
        title: "Success",
        description: `Verification ${reviewStatus} successfully`
      });

      onReviewComplete();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Review Verification #{verification?.verificationId}
          </DialogTitle>
        </DialogHeader>

        {verification && (
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Verification Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Verifier:</span>
                        <span className="font-medium">{verification.verifierName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Organization:</span>
                        <span className="font-medium">{verification.organizationName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Location:</span>
                        <span>{verification.city}, {verification.state}, {verification.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Submitted:</span>
                        <span>{formatDate(verification.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Target User</h3>
                    <div className="space-y-2">
                      <div className="text-lg font-medium">
                        {verification.targetUserFirstName} {verification.targetUserLastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        ID: {verification.targetUserId}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Building Pictures */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Building Documentation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(verification.buildingPictures).map(([key, url]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <div className="border rounded-lg overflow-hidden">
                        {url.endsWith('.mp4') ? (
                          <video 
                            src={url} 
                            controls 
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <img 
                            src={url} 
                            alt={key} 
                            className="w-full h-32 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transportation Costs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Transportation Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Going Journey</h4>
                    {verification.transportationCost.going.map((trip, index) => (
                      <div key={index} className="mb-3 p-3 border rounded-lg">
                        <div className="text-sm">
                          <div><strong>Start:</strong> {trip.startPoint} at {trip.time}</div>
                          <div><strong>To:</strong> {trip.nextDestination}</div>
                          <div><strong>Fare:</strong> ₦{trip.fareSpent}</div>
                          <div><strong>Time:</strong> {trip.timeSpent}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Return Journey</h4>
                    <div className="space-y-2">
                      <div><strong>Total Transportation:</strong> ₦{verification.transportationCost.comingBack.totalTransportationCost}</div>
                      <div><strong>Other Expenses:</strong> ₦{verification.transportationCost.comingBack.otherExpensesCost}</div>
                      {verification.transportationCost.comingBack.receiptUrl && (
                        <div>
                          <strong>Receipt:</strong>
                          <div className="mt-1">
                            <img 
                              src={verification.transportationCost.comingBack.receiptUrl} 
                              alt="Receipt" 
                              className="w-full h-32 object-cover border rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Review Decision</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Decision *</Label>
                    <RadioGroup 
                      value={reviewStatus || ''} 
                      onValueChange={(value) => setReviewStatus(value as 'approved' | 'rejected')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="approved" id="approve" />
                        <Label htmlFor="approve" className="flex items-center gap-2 cursor-pointer">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Approve
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rejected" id="reject" />
                        <Label htmlFor="reject" className="flex items-center gap-2 cursor-pointer">
                          <XCircle className="h-5 w-5 text-red-600" />
                          Reject
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="comments" className="text-base font-medium mb-2 block">
                      Comments
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Add any additional comments for this review..."
                      value={comments}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={submitting || !reviewStatus}
                      className={reviewStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    >
                      {submitting ? 'Submitting...' : `Submit ${reviewStatus}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewVerificationModal;