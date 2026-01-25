'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/app/components/ui/card';
import { 
  Button 
} from '@/app/components/ui/button';
import { 
  Input 
} from '@/app/components/ui/input';
import { 
  Label 
} from '@/app/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { 
  Textarea 
} from '@/app/components/ui/textarea';
import { 
  Upload,
  MapPin,
  Building,
  Users,
  DollarSign,
  Camera,
  Plus,
  Trash2
} from 'lucide-react';
import { DataVerificationService } from '@/services/DataVerificationService';
import { toast } from '@/app/components/hooks/use-toast';

interface FormData {
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organizationId: string;
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
}

const CreateVerificationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    country: '',
    state: '',
    lga: '',
    city: '',
    cityRegion: '',
    organizationId: '',
    buildingPictures: {
      frontView: '',
      streetPicture: '',
      agentInFrontBuilding: '',
      whatsappLocation: '',
      insideOrganization: '',
      withStaffOrOwner: '',
      videoWithNeighbor: ''
    },
    transportationCost: {
      going: [{
        startPoint: '',
        time: '',
        nextDestination: '',
        fareSpent: 0,
        timeSpent: ''
      }],
      finalDestination: '',
      finalFareSpent: 0,
      finalTime: '',
      totalJourneyTime: '',
      comingBack: {
        totalTransportationCost: 0,
        otherExpensesCost: 0,
        receiptUrl: ''
      }
    }
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBuildingPictureChange = (field: keyof FormData['buildingPictures'], value: string) => {
    setFormData(prev => ({
      ...prev,
      buildingPictures: {
        ...prev.buildingPictures,
        [field]: value
      }
    }));
  };

  const handleTransportationChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newGoing = [...prev.transportationCost.going];
      newGoing[index] = {
        ...newGoing[index],
        [field]: value
      };
      return {
        ...prev,
        transportationCost: {
          ...prev.transportationCost,
          going: newGoing
        }
      };
    });
  };

  const addTransportationLeg = () => {
    setFormData(prev => ({
      ...prev,
      transportationCost: {
        ...prev.transportationCost,
        going: [
          ...prev.transportationCost.going,
          {
            startPoint: '',
            time: '',
            nextDestination: '',
            fareSpent: 0,
            timeSpent: ''
          }
        ]
      }
    }));
  };

  const removeTransportationLeg = (index: number) => {
    setFormData(prev => {
      const newGoing = [...prev.transportationCost.going];
      newGoing.splice(index, 1);
      return {
        ...prev,
        transportationCost: {
          ...prev.transportationCost,
          going: newGoing
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.country || !formData.state || !formData.organizationId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await DataVerificationService.createVerification(formData);
      
      toast({
        title: "Success",
        description: "Verification created successfully"
      });
      
      // Reset form or redirect
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error creating verification:', error);
      toast({
        title: "Error",
        description: "Failed to create verification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Create New Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleInputChange('lga', e.target.value)}
                  placeholder="Enter Local Government Area"
                />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="cityRegion">City Region</Label>
                <Input
                  id="cityRegion"
                  value={formData.cityRegion}
                  onChange={(e) => handleInputChange('cityRegion', e.target.value)}
                  placeholder="Enter city region"
                />
              </div>
            </div>

            {/* Organization */}
            <div>
              <Label htmlFor="organizationId">Organization *</Label>
              <Select 
                value={formData.organizationId} 
                onValueChange={(value: string) => handleInputChange('organizationId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="org-1">Tech Company Ltd</SelectItem>
                  <SelectItem value="org-2">Global Solutions Inc</SelectItem>
                  <SelectItem value="org-3">Digital Innovations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Building Pictures Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Building Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData.buildingPictures).map((key) => (
                    <div key={key}>
                      <Label className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <div className="mt-1 flex items-center">
                        <Input
                          value={formData.buildingPictures[key as keyof typeof formData.buildingPictures]}
                          onChange={(e) => handleBuildingPictureChange(key as keyof typeof formData.buildingPictures, e.target.value)}
                          placeholder={`Enter ${key} URL`}
                        />
                        <Button type="button" variant="outline" className="ml-2">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transportation Costs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Transportation Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Going Journey */}
                <div>
                  <h3 className="font-medium mb-3">Going Journey</h3>
                  {formData.transportationCost.going.map((leg, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Leg {index + 1}</h4>
                        {formData.transportationCost.going.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeTransportationLeg(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Start Point</Label>
                          <Input
                            value={leg.startPoint}
                            onChange={(e) => handleTransportationChange(index, 'startPoint', e.target.value)}
                            placeholder="Starting location"
                          />
                        </div>
                        
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={leg.time}
                            onChange={(e) => handleTransportationChange(index, 'time', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label>Next Destination</Label>
                          <Input
                            value={leg.nextDestination}
                            onChange={(e) => handleTransportationChange(index, 'nextDestination', e.target.value)}
                            placeholder="Next stop"
                          />
                        </div>
                        
                        <div>
                          <Label>Fare Spent (₦)</Label>
                          <Input
                            type="number"
                            value={leg.fareSpent}
                            onChange={(e) => handleTransportationChange(index, 'fareSpent', Number(e.target.value))}
                            placeholder="Amount"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label>Time Spent</Label>
                          <Input
                            value={leg.timeSpent}
                            onChange={(e) => handleTransportationChange(index, 'timeSpent', e.target.value)}
                            placeholder="e.g., 30 minutes"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addTransportationLeg}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Leg
                  </Button>
                </div>

                {/* Final Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Final Destination</Label>
                    <Input
                      value={formData.transportationCost.finalDestination}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        transportationCost: {
                          ...prev.transportationCost,
                          finalDestination: e.target.value
                        }
                      }))}
                      placeholder="Final destination"
                    />
                  </div>
                  
                  <div>
                    <Label>Final Fare Spent (₦)</Label>
                    <Input
                      type="number"
                      value={formData.transportationCost.finalFareSpent}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        transportationCost: {
                          ...prev.transportationCost,
                          finalFareSpent: Number(e.target.value)
                        }
                      }))}
                      placeholder="Amount"
                    />
                  </div>
                  
                  <div>
                    <Label>Final Time</Label>
                    <Input
                      type="time"
                      value={formData.transportationCost.finalTime}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        transportationCost: {
                          ...prev.transportationCost,
                          finalTime: e.target.value
                        }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label>Total Journey Time</Label>
                    <Input
                      value={formData.transportationCost.totalJourneyTime}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        transportationCost: {
                          ...prev.transportationCost,
                          totalJourneyTime: e.target.value
                        }
                      }))}
                      placeholder="e.g., 1 hour 30 minutes"
                    />
                  </div>
                </div>

                {/* Coming Back */}
                <div>
                  <h3 className="font-medium mb-3">Coming Back</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Total Transportation Cost (₦)</Label>
                      <Input
                        type="number"
                        value={formData.transportationCost.comingBack.totalTransportationCost}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          transportationCost: {
                            ...prev.transportationCost,
                            comingBack: {
                              ...prev.transportationCost.comingBack,
                              totalTransportationCost: Number(e.target.value)
                            }
                          }
                        }))}
                        placeholder="Amount"
                      />
                    </div>
                    
                    <div>
                      <Label>Other Expenses Cost (₦)</Label>
                      <Input
                        type="number"
                        value={formData.transportationCost.comingBack.otherExpensesCost}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          transportationCost: {
                            ...prev.transportationCost,
                            comingBack: {
                              ...prev.transportationCost.comingBack,
                              otherExpensesCost: Number(e.target.value)
                            }
                          }
                        }))}
                        placeholder="Amount"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>Receipt URL</Label>
                      <div className="flex items-center">
                        <Input
                          value={formData.transportationCost.comingBack.receiptUrl}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            transportationCost: {
                              ...prev.transportationCost,
                              comingBack: {
                                ...prev.transportationCost.comingBack,
                                receiptUrl: e.target.value
                              }
                            }
                          }))}
                          placeholder="Enter receipt URL"
                        />
                        <Button type="button" variant="outline" className="ml-2">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Verification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVerificationForm;