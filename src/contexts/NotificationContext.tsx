'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationService, AdminNotification, NotificationResponse } from '@/services/NotificationService';

interface NotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  totalNotifications: number;
  currentPage: number;
  totalPages: number;
  fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await NotificationService.getUnreadCount();
      if (result.success && result.data) {
        setUnreadCount(result.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page: number = 1, unreadOnly: boolean = false) => {
    try {
      setLoading(true);
      const result = await NotificationService.getNotifications(page, 20, unreadOnly);
      
      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setTotalNotifications(result.data.total);
        setCurrentPage(result.data.pagination.page);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const result = await NotificationService.markAsRead(notificationId);
      
      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        
        // Refresh unread count
        await fetchUnreadCount();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, [fetchUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const result = await NotificationService.markAllAsRead();
      
      if (result.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        
        // Refresh unread count and notifications
        await fetchUnreadCount();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }, [fetchUnreadCount]);

  // Refresh notifications (re-fetch current page)
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications(1);
  }, [fetchUnreadCount, fetchNotifications]);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    totalNotifications,
    currentPage,
    totalPages,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
