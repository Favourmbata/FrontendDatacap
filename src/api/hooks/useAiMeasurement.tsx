'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

interface AiMeasurementRequest {
  frontImageData: string;
  sideImageData?: string;
  userHeight: number;
  scanTimestamp: string;
  firstName: string;
  lastName: string;
  subject: string;
}

export interface MeasurementData {
  id: string;
  userId: string;
  userHeight: number;
  measurements: {
    shoulder: number;
    bust: number;
    armLength: number;
    neck: number;
    butt: number;
    waist: number;
    hips: number;
    wrist: number;
    inseam: number;
    chest: number;
  };
  scanTimestamp: string;
  analysisTimestamp: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  subject: string;
}

interface AiMeasurementResponse {
  success: boolean;
  data: {
    measurements: MeasurementData;
    message: string;
  };
}

export const useAiMeasurement = () => {
  const { client } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiMeasurementResponse | null>(null);

  const analyzeBodyScan = async (request: AiMeasurementRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Sending body scan analysis request:', {
        frontImageData: request.frontImageData ? `${request.frontImageData.substring(0, 50)}...` : null,
        sideImageData: request.sideImageData ? `${request.sideImageData.substring(0, 50)}...` : null,
        userHeight: request.userHeight,
        scanTimestamp: request.scanTimestamp
      });

      const response = await client.post<AiMeasurementResponse>('/api/measurements/scan', request);
      
      console.log('✅ Body scan analysis response:', response.data);
      
      setResult(response.data);
      return response.data;
    } catch (err: unknown) {
      console.error('❌ Body scan analysis error:', err);
      let errorMessage = 'Failed to analyze body scan';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract error message from axios-like error objects
        const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
        errorMessage = axiosError.response?.data?.message || axiosError.message || errorMessage;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Removed the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    analyzeBodyScan,
    convertFileToBase64,
    isLoading,
    error,
    result,
    reset: () => {
      setError(null);
      setResult(null);
    }
  };
};