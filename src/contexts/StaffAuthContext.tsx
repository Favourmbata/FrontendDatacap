"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import { StaffUser } from '@/types/staff';
import { StaffAuthService } from '@/services/StaffAuthService';

export interface StaffAuthContextType {
  token: string | null;
  user: StaffUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: StaffUser['role'] | StaffUser['role'][]) => boolean;
}

export const StaffAuthContext = createContext<StaffAuthContextType | undefined>(
  undefined
);

export const StaffAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!token && !!user;

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authService = new StaffAuthService();
      const { token: newToken, user: userData } = await authService.login(email, password);
      
      setToken(newToken);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem("staff_token", newToken);
      localStorage.setItem("staff_user", JSON.stringify(userData));

      // Redirect to dashboard
      router.push('/staff/dashboard');
    } catch (error) {
      console.error('Staff login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");

    // Redirect to login
    router.push('/staff/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Define role-based permissions
    const rolePermissions: Record<StaffUser['role'], string[]> = {
      field_agent: [
        'view_tasks',
        'create_verification',
        'edit_own_verification',
        'upload_documents',
        'view_organizations'
      ],
      supervisor: [
        'view_tasks',
        'create_verification',
        'edit_verification',
        'approve_verification',
        'reject_verification',
        'assign_tasks',
        'view_reports',
        'manage_field_agents',
        'upload_documents',
        'view_organizations'
      ],
      admin: [
        'view_tasks',
        'create_verification',
        'edit_verification',
        'approve_verification',
        'reject_verification',
        'assign_tasks',
        'view_reports',
        'manage_staff',
        'system_config',
        'upload_documents',
        'view_organizations',
        'delete_verification',
        'manage_templates'
      ]
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasRole = (role: StaffUser['role'] | StaffUser['role'][]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  // Restore authentication state on mount
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedToken = localStorage.getItem("staff_token");
        const storedUser = localStorage.getItem("staff_user");

        if (storedToken && storedUser && 
            storedToken !== "undefined" && storedToken !== "null" &&
            storedUser !== "undefined" && storedUser !== "null") {
          
          try {
            // Verify token is still valid
            const authService = new StaffAuthService();
            const userData = await authService.verifyToken(storedToken);
            
            setToken(storedToken);
            setUser(userData);
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem("staff_token");
            localStorage.removeItem("staff_user");
            console.warn('Invalid staff token, cleared from storage');
          }
        }
      } catch (error) {
        console.error('Error restoring staff auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  return (
    <StaffAuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      isLoading,
      signIn,
      signOut,
      hasPermission,
      hasRole
    }}>
      {children}
    </StaffAuthContext.Provider>
  );
};

// Custom hook to use the StaffAuthContext
export const useStaffAuth = () => {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error("useStaffAuth must be used within a StaffAuthProvider");
  }
  return context;
};