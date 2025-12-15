import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

// Types
export interface MeasurementData {
  bodyPartName: string;
  size: number | string;
}

export interface MeasurementSection {
  sectionName: string;
  measurements: MeasurementData[];
}

export interface Measurement {
  id: string;
  firstName: string;
  lastName: string;
  measurementType: string;
  subject: string;
  createdAt: string;
  sections: MeasurementSection[];
}

export interface MeasurementSaveRequest {
  measurementType: string;
  subject: string;
  firstName: string;
  lastName: string;
  sections: MeasurementSection[];
}

// Hook for fetching all measurements
export const useManualMeasurements = () => {
  const { client } = useAuth();

  return useQuery({
    queryKey: ['manual-measurements'],
    queryFn: async () => {
      const response = await client.get('/api/manual-measurements');
      return response.data.data?.measurements || [];
    },
  });
};

// Hook for fetching a single measurement by ID
export const useManualMeasurement = (id: string | null) => {
  const { client } = useAuth();

  return useQuery({
    queryKey: ['manual-measurement', id],
    queryFn: async () => {
      if (!id) throw new Error('Measurement ID is required');
      const response = await client.get(`/api/manual-measurements/${id}`);
      return response.data.data?.measurement;
    },
    enabled: !!id,
  });
};

// Hook for saving a measurement
export const useSaveManualMeasurement = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MeasurementSaveRequest) => {
      const response = await client.post('/api/manual-measurements/save', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-measurements'] });
    },
  });
};

// Hook for updating a measurement
export const useUpdateManualMeasurement = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await client.put(`/api/manual-measurements/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-measurements'] });
      queryClient.invalidateQueries({ queryKey: ['manual-measurement'] });
    },
  });
};

// Hook for deleting a measurement
export const useDeleteManualMeasurement = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete(`/api/manual-measurements/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-measurements'] });
    },
  });
};

// Hook for fetching measurement types
export const useMeasurementTypes = () => {
  const { client } = useAuth();

  return useQuery({
    queryKey: ['measurement-types'],
    queryFn: async () => {
      const response = await client.get('/api/manual-measurements/options/types');
      return response.data.data?.options || [];
    },
  });
};

export const useSectionOptions = () => {
  const { client } = useAuth();

  return useQuery({
    queryKey: ['section-options'],
    queryFn: async () => {
      try {
        const response = await client.get('/api/manual-measurements/options/sections');
        // CORRECTED: Use 'sections' instead of 'options'
        return response.data.data?.sections || [];
      } catch (error) {
        console.warn('Failed to fetch section options, using defaults:', error);
        return [
          "Head Section",
          "Chest Section", 
          "Abdomen Section",
          "Waist Section",
          "Thigh Section"
        ];
      }
    },
  });
};