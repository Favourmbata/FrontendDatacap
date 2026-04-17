'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Star, AlertCircle, Loader2 } from 'lucide-react';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { NotificationService, AdminNotification } from '@/services/NotificationService';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, fetchUnreadCount } = useNotificationContext();
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1, false);
    }
  }, [isOpen, fetchNotifications]);

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    // Could add navigation or detail view here
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      const success = await markAllAsRead();
      if (success) {
        await fetchUnreadCount();
      }
    } finally {
      setMarkingAllRead(false);
    }
  };

  const getNotificationIcon = (type: AdminNotification['type']) => {
    const color = NotificationService.getNotificationColor(type);
    switch (type) {
      case 'task_accepted':
        return <CheckCircle className="w-5 h-5" style={{ color }} />;
      case 'task_rejected':
        return <XCircle className="w-5 h-5" style={{ color }} />;
      case 'task_completed':
        return <Star className="w-5 h-5" style={{ color }} />;
      case 'all_providers_rejected':
        return <AlertCircle className="w-5 h-5" style={{ color }} />;
      default:
        return <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />;
    }
  };

  const groupNotificationsByDate = (notifications: AdminNotification[]) => {
    const groups: { label: string; notifications: AdminNotification[] }[] = [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const today: AdminNotification[] = [];
    const thisWeek: AdminNotification[] = [];
    const older: AdminNotification[] = [];

    notifications.forEach(notif => {
      const date = new Date(notif.createdAt);
      if (date >= todayStart) {
        today.push(notif);
      } else if (date >= weekStart) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    if (today.length > 0) groups.push({ label: 'Today', notifications: today });
    if (thisWeek.length > 0) groups.push({ label: 'This Week', notifications: thisWeek });
    if (older.length > 0) groups.push({ label: 'Older', notifications: older });

    return groups;
  };

  if (!isOpen) return null;

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{
          background: 'transparent',
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div
        className="fixed"
        style={{
          top: '181px',
          left: '910px',
          width: '449px',
          maxHeight: '500px',
          background: '#FFFFFF',
          borderRadius: '20px',
          zIndex: 9999,
          boxShadow: '0px 2px 8px 0px rgba(93, 42, 139, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(110, 110, 110, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3
              style={{
                fontFamily: 'Manrope',
                fontWeight: 500,
                fontSize: '16px',
                color: '#1A1A1A',
                margin: 0,
              }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAllRead}
                style={{
                  background: 'transparent',
                  border: '1px solid #5D2A8B',
                  color: '#5D2A8B',
                  cursor: markingAllRead ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontFamily: 'Manrope',
                  fontWeight: 500,
                  opacity: markingAllRead ? 0.6 : 1,
                }}
                type="button"
              >
                {markingAllRead ? 'Marking...' : 'Mark all read'}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              type="button"
            >
              <X className="w-5 h-5" style={{ color: '#1A1A1A' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0',
          }}
        >
          {loading ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: '#5D2A8B' }} />
              <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#6E6E6E', marginTop: '12px' }}>
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
              <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#6E6E6E' }}>
                No notifications yet
              </p>
            </div>
          ) : (
            groupedNotifications.map((group) => (
              <div key={group.label} style={{ padding: '16px 24px' }}>
                <h4
                  style={{
                    fontFamily: 'Manrope',
                    fontWeight: 500,
                    fontSize: '13px',
                    color: '#6E6E6E',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {group.label}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      style={{
                        background: notif.isRead ? '#FBFAFC' : '#F4EFFA',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: notif.isRead ? 'none' : '2px solid #5D2A8B',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#E8D5F5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notif.isRead ? '#FBFAFC' : '#F4EFFA';
                      }}
                    >
                      {/* Icon */}
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: 'Manrope',
                            fontWeight: notif.isRead ? 400 : 600,
                            fontSize: '14px',
                            color: notif.isRead ? '#6E6E6E' : '#1A1A1A',
                            margin: '0 0 4px 0',
                            lineHeight: '1.4',
                          }}
                        >
                          {notif.title}
                        </p>
                        <p
                          style={{
                            fontFamily: 'Manrope',
                            fontWeight: 400,
                            fontSize: '12px',
                            color: '#6E6E6E',
                            margin: '0 0 6px 0',
                            lineHeight: '1.4',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {notif.message}
                        </p>
                        <span
                          style={{
                            fontFamily: 'Manrope',
                            fontWeight: 400,
                            fontSize: '11px',
                            color: '#6E6E6EB2',
                          }}
                        >
                          {NotificationService.formatNotificationTime(notif.createdAt)}
                        </span>
                      </div>

                      {/* Unread indicator */}
                      {!notif.isRead && (
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#5D2A8B',
                            flexShrink: 0,
                            marginTop: '6px',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
