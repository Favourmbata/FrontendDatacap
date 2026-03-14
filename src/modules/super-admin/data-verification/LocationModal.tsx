'use client';

import React from 'react';
import { X, MapPin, Building, Home } from 'lucide-react';

interface Location {
  _id: string;
  locationType: string;
  brandName: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  houseNumber: string;
  street: string;
  landmark: string;
  buildingColor?: string;
  buildingType?: string;
}

interface Assignment {
  _id: string;
  userId: string;
  userName: string;
  organizationId: string;
  organizationName: string;
  targetUserId: string;
  targetUserName: string;
  targetUserEmail: string;
  organizationLocationDetails: Location[];
  status: string;
  assignedBy: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationModalProps {
  isOpen: boolean;
  assignment: Assignment | null;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, assignment, onClose }) => {
  if (!isOpen || !assignment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (locationType: string) => {
    return locationType === 'headquarters' ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assignment Details</h2>
            <p className="text-sm text-gray-600 mt-1">{assignment.organizationName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Assignment Info */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Assigned User</p>
                <p className="font-semibold text-gray-900">{assignment.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target User</p>
                <p className="font-semibold text-gray-900">{assignment.targetUserName}</p>
                <p className="text-sm text-gray-500">{assignment.targetUserEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm text-gray-600">Status:</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                {assignment.status.replace('_', ' ')}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <p>Assigned At: {new Date(assignment.assignedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Organization Locations ({assignment.organizationLocationDetails.length})
            </h3>

            {assignment.organizationLocationDetails.length === 0 ? (
              <p className="text-gray-500 text-sm">No locations assigned</p>
            ) : (
              <div className="grid gap-4">
                {assignment.organizationLocationDetails.map((location, index) => (
                  <div
                    key={location._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-600">
                          {getLocationIcon(location.locationType)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{location.brandName}</h4>
                          <span className="text-xs text-gray-500 capitalize">{location.locationType}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Location #{index + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Country</p>
                        <p className="font-medium text-gray-900">{location.country}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">State</p>
                        <p className="font-medium text-gray-900">{location.state}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">LGA</p>
                        <p className="font-medium text-gray-900">{location.lga}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">City</p>
                        <p className="font-medium text-gray-900">{location.city}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Region</p>
                        <p className="font-medium text-gray-900">{location.cityRegion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">House Number</p>
                        <p className="font-medium text-gray-900">{location.houseNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Street</p>
                        <p className="font-medium text-gray-900">{location.street}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Landmark</p>
                        <p className="font-medium text-gray-900">{location.landmark || 'N/A'}</p>
                      </div>
                      {location.buildingColor && (
                        <div>
                          <p className="text-gray-500">Building Color</p>
                          <p className="font-medium text-gray-900">{location.buildingColor}</p>
                        </div>
                      )}
                      {location.buildingType && (
                        <div>
                          <p className="text-gray-500">Building Type</p>
                          <p className="font-medium text-gray-900">{location.buildingType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
