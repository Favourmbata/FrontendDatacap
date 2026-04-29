"use client";
import React from "react";
import { Calendar, User, MapPin, X } from "lucide-react";
import { AdminBooking } from "@/services/BookingAdminService";

interface BookingDetailsModalProps {
  booking: AdminBooking;
  onClose: () => void;
  onUpdateStatus: (booking: AdminBooking) => void;
  formatCurrency: (amount: number) => string;
  getLocationLabel: (type: string) => string;
  getStatusBadge: (status: string) => string;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onUpdateStatus,
  formatCurrency,
  getLocationLabel,
  getStatusBadge
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Booking Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-lg font-mono font-bold">{booking.bookingId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.bookingStatus)}`}>
              {booking.bookingStatus}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Service Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Service Name</p>
                <p className="font-medium">{booking.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium">{booking.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {new Date(booking.bookingDate).toLocaleDateString('en-NG', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} {booking.bookingTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fee</p>
                <p className="font-medium text-purple-600">{formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{booking.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{booking.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{booking.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Persons</p>
                <p className="font-medium">{booking.totalPersons}</p>
              </div>
              {booking.customer.customUserId && (
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-medium">{booking.customer.customUserId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Location
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{getLocationLabel(booking.location.type)}</p>
              {booking.location.address && (
                <p className="text-sm text-gray-600 mt-1">{booking.location.address}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onUpdateStatus(booking)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
