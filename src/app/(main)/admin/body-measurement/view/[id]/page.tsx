"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminMeasurementService, Measurement } from '@/services/AdminMeasurementService';
import { AdminUserService, AdminUser } from '@/services/AdminUserService';
import { toast } from '@/app/components/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

const AdminBodyMeasurementViewPage = ({ params }: ViewPageProps) => {
  const router = useRouter();
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMeasurement = async () => {
      try {
        const { id } = await params;
        const measurementService = new AdminMeasurementService();
        
        // Fetch measurement details using the API endpoint
        const response = await measurementService.getAdminMeasurementById(id);
        
        if (response.data.measurement) {
          const measurementData = response.data.measurement;
          setMeasurement(measurementData);
          
          // Fetch user details
          const userService = new AdminUserService();
          try {
            const userData = await userService.getAdminUserById(measurementData.userId);
            setUser(userData);
          } catch (userError) {
            console.error('Error fetching user:', userError);
            toast({
              title: 'Warning',
              description: 'Could not load user details',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Error',
            description: 'Measurement not found',
            variant: 'destructive',
          });
          router.push('/admin/body-measurement');
        }
      } catch (error: any) {
        console.error('Error fetching measurement:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch measurement',
          variant: 'destructive',
        });
        router.push('/admin/body-measurement');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeasurement();
  }, [params, router]);
  
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Loading Measurement...</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }
  
  if (!measurement) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Measurement Not Found</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">The requested measurement could not be found.</p>
        </div>
      </div>
    );
  }
  
  // Try new format first (sections with bodyPartName)
  let measurementEntries: [string, number | string][] = [];
  
  if (measurement.sections && Array.isArray(measurement.sections) && measurement.sections.length > 0) {
    // Process measurements from sections format
    measurement.sections.forEach((section) => {
      if (section.measurements && Array.isArray(section.measurements)) {
        section.measurements.forEach((measurementItem: { bodyPartName: string; size: number }) => {
          if (measurementItem.bodyPartName && measurementItem.size !== undefined && measurementItem.size !== null) {
            const partName = measurementItem.bodyPartName.charAt(0).toUpperCase() + measurementItem.bodyPartName.slice(1);
            measurementEntries.push([partName, `${measurementItem.size} cm`]);
          }
        });
      }
    });
  }
  // Fallback to old format (measurements object)
  else if (measurement.measurements && typeof measurement.measurements === 'object') {
    measurementEntries = Object.entries(measurement.measurements).map(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return [formattedKey, value !== undefined && value !== null ? `${value} cm` : 'N/A'];
    });
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back 
        </button>
        <h1 className="text-3xl font-bold text-gray-900">View Body Measurement</h1>
        
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Measurement Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User Email</p>
                <p className="font-medium">{user ? user.email : 'Loading...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(measurement.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Measurement Type</p>
                <p className="font-medium">{measurement.submissionType || 'Manual'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
            <div className="space-y-4">
              
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium">{measurement.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Display measurements in sections if available, otherwise as a flat list */}
        {measurement.sections && Array.isArray(measurement.sections) && measurement.sections.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Measurement Data by Section</h2>
            <div className="space-y-6">
              {measurement.sections.map((section: { sectionName: string; measurements: Array<{ bodyPartName: string; size: number }> }, sectionIndex: number) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">{section.sectionName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.measurements && Array.isArray(section.measurements) && section.measurements.length > 0 ? (
                      section.measurements.map((measurementItem: { bodyPartName: string; size: number }, itemIndex: number) => (
                        <div key={itemIndex} className="p-3 border border-gray-100 rounded-md">
                          <p className="text-sm text-gray-500 capitalize">{measurementItem.bodyPartName}</p>
                          <p className="font-medium">{measurementItem.size !== undefined && measurementItem.size !== null ? `${measurementItem.size} cm` : 'N/A'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        No measurements in this section
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Measurement Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {measurementEntries.length > 0 ? (
                measurementEntries.map(([key, value]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                    <p className="font-medium">{value !== undefined && value !== null ? value : 'N/A'}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No measurement data available
                </div>
              )}
            </div>
          </div>
        )}
        
       
      </div>
    </div>
  );
};

export default AdminBodyMeasurementViewPage;