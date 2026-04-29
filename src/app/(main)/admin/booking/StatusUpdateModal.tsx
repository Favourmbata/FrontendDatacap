"use client";
import React from "react";
import { Loader2, X } from "lucide-react";
import { AdminBooking } from "@/services/BookingAdminService";

interface StatusUpdateModalProps {
  booking: AdminBooking;
  newStatus: string;
  newDate: string;
  newTime: string;
  adminNotes: string;
  updatingStatus: boolean;
  onStatusChange: (status: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNotesChange: (notes: string) => void;
  onUpdate: () => void;
  onCancel: () => void;
  getStatusBadge: (status: string) => string;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  booking,
  newStatus,
  newDate,
  newTime,
  adminNotes,
  updatingStatus,
  onStatusChange,
  onDateChange,
  onTimeChange,
  onNotesChange,
  onUpdate,
  onCancel,
  getStatusBadge
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Update Booking Status</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Booking ID</p>
            <p className="font-mono font-bold">{booking.bookingId}</p>
            <p className="text-sm text-gray-600 mt-2">Current Status</p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.bookingStatus)}`}>
              {booking.bookingStatus}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status *</label>
              <select
                value={newStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            {(newStatus === 'rescheduled' || newStatus === 'confirmed') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => onTimeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                placeholder="Add notes about this status change..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onUpdate}
              disabled={updatingStatus || !newStatus}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updatingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
