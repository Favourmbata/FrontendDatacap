'use client';

import React from 'react';
import { CheckCircle, XCircle, Star, AlertCircle, Mail, Phone, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { AdminNotification, NotificationService } from '@/services/NotificationService';

interface NotificationDetailProps {
  notification: AdminNotification;
}

export const NotificationDetail: React.FC<NotificationDetailProps> = ({ notification }) => {
  const { type, data, title, message, createdAt } = notification;

  const iconColor = NotificationService.getNotificationColor(type);

  const getIcon = () => {
    switch (type) {
      case 'task_accepted':
        return <CheckCircle className="w-8 h-8" style={{ color: iconColor }} />;
      case 'task_rejected':
        return <XCircle className="w-8 h-8" style={{ color: iconColor }} />;
      case 'task_completed':
        return <Star className="w-8 h-8" style={{ color: iconColor }} />;
      case 'all_providers_rejected':
        return <AlertCircle className="w-8 h-8" style={{ color: iconColor }} />;
      default:
        return null;
    }
  };

  const getUrgencyBanner = () => {
    if (type === 'all_providers_rejected') {
      return (
        <div
          style={{
            background: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle className="w-6 h-6" style={{ color: '#F59E0B' }} />
            <div>
              <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#92400E', margin: 0 }}>
                Urgent: Manual Intervention Required
              </p>
              <p style={{ fontFamily: 'Manrope', fontSize: '13px', color: '#A16207', margin: '4px 0 0 0' }}>
                All available providers have rejected this task
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderProviderInfo = () => {
    if (!data.provider) return null;

    return (
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#1A1A1A', margin: '0 0 12px 0' }}>
          Provider Information
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Name:</strong> {data.provider.name}
          </p>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Email:</strong> {data.provider.email}
          </p>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Phone:</strong> {data.provider.phone}
          </p>
        </div>
      </div>
    );
  };

  const renderServiceInfo = () => {
    if (!data.service) return null;

    return (
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#1A1A1A', margin: '0 0 12px 0' }}>
          Service Details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Service:</strong> {data.service.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar className="w-4 h-4" style={{ color: '#6E6E6E' }} />
            <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>
              {new Date(data.service.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock className="w-4 h-4" style={{ color: '#6E6E6E' }} />
            <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>
              {data.service.time} ({data.service.duration} min)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin className="w-4 h-4 mt-1" style={{ color: '#6E6E6E' }} />
            <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>
              {data.service.location}
            </span>
          </div>
          {data.service.notes && (
            <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: '8px 0 0 0', fontStyle: 'italic' }}>
              <strong>Notes:</strong> {data.service.notes}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderCustomerInfo = () => {
    if (!data.customer) return null;

    return (
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#1A1A1A', margin: '0 0 12px 0' }}>
          Customer Information
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Name:</strong> {data.customer.fullName || data.customer.firstName}
          </p>
          {data.customer.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail className="w-4 h-4" style={{ color: '#6E6E6E' }} />
              <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>
                {data.customer.email}
              </span>
            </div>
          )}
          {data.customer.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone className="w-4 h-4" style={{ color: '#6E6E6E' }} />
              <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>
                {data.customer.phone}
              </span>
            </div>
          )}
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Customer ID:</strong> {data.customer.customerId}
          </p>
        </div>
      </div>
    );
  };

  const renderFinancialInfo = () => {
    if (!data.financials) return null;

    return (
      <div
        style={{
          background: '#F0FDF4',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #86EFAC',
        }}
      >
        <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#166534', margin: '0 0 12px 0' }}>
          Financial Details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>Total Fee:</span>
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#166534' }}>
              {NotificationService.formatCurrency(data.financials.totalFee)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>Provider Fee:</span>
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#166534' }}>
              {NotificationService.formatCurrency(data.financials.providerFee)}
            </span>
          </div>
          {data.financials.settlementStatus && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #86EFAC' }}>
              <span style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151' }}>Settlement Status:</span>
              <span
                style={{
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: data.financials.settlementStatus === 'pending' ? '#F59E0B' : '#10B981',
                  background: data.financials.settlementStatus === 'pending' ? '#FEF3C7' : '#D1FAE5',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'capitalize',
                }}
              >
                {data.financials.settlementStatus}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRejectionReason = () => {
    if (type !== 'task_rejected' || !data.rejectionReason) return null;

    return (
      <div
        style={{
          background: '#FEF2F2',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #FCA5A5',
        }}
      >
        <h4 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '14px', color: '#991B1B', margin: '0 0 8px 0' }}>
          Rejection Reason
        </h4>
        <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#7F1D1D', margin: 0, fontStyle: 'italic' }}>
          "{data.rejectionReason}"
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Urgency Banner */}
      {getUrgencyBanner()}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: `${iconColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getIcon()}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: '18px', color: '#1A1A1A', margin: '0 0 4px 0' }}>
            {title}
          </h3>
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#6E6E6E', margin: '0 0 8px 0' }}>
            {message}
          </p>
          <p style={{ fontFamily: 'Manrope', fontSize: '12px', color: '#6E6E6EB2', margin: 0 }}>
            {NotificationService.formatNotificationTime(createdAt)}
          </p>
        </div>
      </div>

      {/* Task ID */}
      {data.taskId && (
        <div
          style={{
            background: '#F9FAFB',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontFamily: 'Manrope', fontSize: '13px', color: '#6E6E6E', margin: 0 }}>
            <strong>Task ID:</strong> <span style={{ fontFamily: 'monospace', color: '#5D2A8B' }}>{data.taskId}</span>
          </p>
        </div>
      )}

      {/* Content Sections */}
      {renderProviderInfo()}
      {renderServiceInfo()}
      {renderCustomerInfo()}
      {renderFinancialInfo()}
      {renderRejectionReason()}

      {/* Simple notification for all_providers_rejected */}
      {type === 'all_providers_rejected' && data.serviceName && (
        <div
          style={{
            background: '#F9FAFB',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <p style={{ fontFamily: 'Manrope', fontSize: '14px', color: '#374151', margin: 0 }}>
            <strong>Service:</strong> {data.serviceName}
          </p>
        </div>
      )}
    </div>
  );
};
