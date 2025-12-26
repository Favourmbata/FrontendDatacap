'use client';

import { useState, useEffect } from 'react';
import { ProfileService } from '@/services/ProfileService';

interface UseProfileReturn {
  profile: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const service = new ProfileService();
      const profileData = await service.getProfile();
      setProfile(profileData);
    } catch (error: any) {
      console.error('Profile API error:', error);
      setError(error.message || 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};