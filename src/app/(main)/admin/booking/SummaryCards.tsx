"use client";
import React from "react";
import { Calendar, Clock, CheckCircle, DollarSign, Users } from "lucide-react";
import { AdminBooking } from "@/services/BookingAdminService";

interface SummaryCardsProps {
  bookings: AdminBooking[];
  totalBookings: number;
  showAcceptedTasks: boolean;
  onToggleAcceptedTasks: () => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  bookings,
  totalBookings,
  showAcceptedTasks,
  onToggleAcceptedTasks
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.bookingStatus === 'pending' || b.orderStatus === 'pending').length}
            </p>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.bookingStatus === 'accepted').length}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-purple-600">
              {bookings.filter(b => b.bookingStatus === 'completed').length}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-purple-600" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <button
          onClick={onToggleAcceptedTasks}
          className="w-full h-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <Users className="w-8 h-8" />
          <span>{showAcceptedTasks ? 'Hide' : 'Show'} Accepted Tasks</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryCards;
