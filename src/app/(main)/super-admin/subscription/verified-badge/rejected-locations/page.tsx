"use client";

import { useState, useEffect } from "react";
import { Search, Mail, CheckCircle, Clock, Eye, Filter } from "lucide-react";
import { LocationVerificationService } from '@/services/LocationVerificationService';

interface RejectedLocation {
  profileId: string;
  locationIndex: number;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  location: {
    brandName: string;
    locationType: string;
    cityRegion: string;
    cityRegionFee?: number;
    address: string;
    gallery: {
      images: string[];
      videos: string[];
    };
    rejectionReason: string;
    emailSent: boolean;
    emailSentAt: string | null;
  };
  rejectedAt: string;
}

const RejectedLocationVerificationsPage = () => {
  const [rejectedLocations, setRejectedLocations] = useState<RejectedLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<RejectedLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch rejected locations
  useEffect(() => {
    const fetchRejectedLocations = async () => {
      try {
        setLoading(true);
        
        const response = await LocationVerificationService.getRejectedLocations();
        
        if (response.success && response.data) {
          setRejectedLocations(response.data.rejectedLocationVerifications);
          setFilteredLocations(response.data.rejectedLocationVerifications);
        } else {
          throw new Error(response.message || 'Failed to fetch rejected locations');
        }
      } catch (error) {
        console.error("Error fetching rejected locations:", error);
       
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedLocations();
  }, []);


  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(rejectedLocations);
    } else {
      const filtered = rejectedLocations.filter(
        (location) =>
          location.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.location.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.location.rejectionReason.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, rejectedLocations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const sendRejectionEmail = async (profileId: string, locationIndex: number) => {
    try {
      const response = await LocationVerificationService.sendRejectionEmail(profileId, locationIndex);

      if (response.success) {
        alert(`Rejection email sent successfully to ${response.data.recipientEmail}`);
        
        setRejectedLocations(prev => prev.map(loc => {
          if (loc.profileId === profileId && loc.locationIndex === locationIndex) {
            return {
              ...loc,
              location: {
                ...loc.location,
                emailSent: true,
                emailSentAt: new Date().toISOString()
              }
            };
          }
          return loc;
        }));
        
        setFilteredLocations(prev => prev.map(loc => {
          if (loc.profileId === profileId && loc.locationIndex === locationIndex) {
            return {
              ...loc,
              location: {
                ...loc.location,
                emailSent: true,
                emailSentAt: new Date().toISOString()
              }
            };
          }
          return loc;
        }));
      } else {
        alert(`Failed to send rejection email: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending rejection email:', error);
      alert('Error sending rejection email');
    }
  };

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                      <th key={col} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row} className="border-b border-gray-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                        <td key={col} className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-full mx-auto">
     
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Rejected Location Verifications</h1>
          <p className="text-gray-600">Manage and review rejected location verification requests</p>
        </div>

     
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:w-2/3">
              <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  placeholder="Search by organization, admin, location, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">S/N</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Organization</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Admin</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Location Type</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">City Region</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Rejection Reason</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Rejected At</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Email Status</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location, index) => (
                    <tr key={`${location.profileId}-${location.locationIndex}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{index + 1}</td>
                      <td className="py-4 px-4 text-gray-900 font-medium text-sm">{location.organizationName}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        <div>{location.adminName}</div>
                        <div className="text-gray-500 text-xs">{location.adminEmail}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.location.brandName}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.location.locationType}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{location.location.cityRegion}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm max-w-xs">{location.location.rejectionReason}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{formatDate(location.rejectedAt)}</td>
                      <td className="py-4 px-4 text-sm">
                        {location.location.emailSent ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Sent on {formatDate(location.location.emailSentAt!)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {!location.location.emailSent ? (
                          <button
                            onClick={() => sendRejectionEmail(location.profileId, location.locationIndex)}
                            className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium whitespace-nowrap"
                          >
                            <Mail className="w-4 h-4" />
                            Send Email
                          </button>
                        ) : (
                          <button
                            className="flex items-center justify-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg cursor-not-allowed text-xs font-medium whitespace-nowrap"
                            disabled
                          >
                            <CheckCircle className="w-4 h-4" />
                            Sent
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 px-4 text-center text-gray-500">
                      No rejected locations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedLocationVerificationsPage;