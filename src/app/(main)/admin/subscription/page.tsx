"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ShieldCheck, Building, Users, MapPin, CreditCard } from "lucide-react";
import OrganizationProfileService, { OrganizationProfile } from "@/services/OrganizationProfileService";

const SubscriptionPage: React.FC = () => {
  const [organizationDetails, setOrganizationDetails] = useState<OrganizationProfile | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizationProfileService = new OrganizationProfileService();

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        
        // Load organization profile
        const profileResponse = await organizationProfileService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setOrganizationDetails(profileResponse.data.profile);
        }
        
        // Load locations
        const locationsResponse = await organizationProfileService.getAllLocations();
        if (locationsResponse.success && locationsResponse.data) {
          setLocations(locationsResponse.data.locations);
        }
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Overview</h2>
              <p className="text-gray-600">View your organization's subscription and profile information</p>
            </div>
            <a href="/admin/subscription/profile" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Manage Profile
            </a>
          </div>
        </div>

        {/* Organization Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center mb-6">
            <ShieldCheck className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Organization Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <Building className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Business Type</h3>
              </div>
              <p className="mt-2 text-lg font-medium">
                {organizationDetails?.businessType || 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Locations</h3>
              </div>
              <p className="mt-2 text-lg font-medium">
                {locations.length} {locations.length === 1 ? 'Location' : 'Locations'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <ShieldCheck className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Verification Status</h3>
              </div>
              <p className="mt-2 text-lg font-medium">
                {organizationDetails?.verificationStatus || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        {organizationDetails && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <div className="flex items-center mb-6">
              <Building className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Organization Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Business Type</h3>
                <p className="text-gray-900 capitalize">
                  {organizationDetails.businessType}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Public Profile</h3>
                <p className="text-gray-900">
                  {organizationDetails.isPublicProfile ? 'Visible' : 'Hidden'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Verification Status</h3>
                <p className={`font-medium ${organizationDetails.verificationStatus === 'verified' ? 'text-green-600' : 'text-orange-600'}`}>
                  {organizationDetails.verificationStatus.charAt(0).toUpperCase() + organizationDetails.verificationStatus.slice(1)}
                </p>
              </div>


            </div>
          </div>
        )}

        {/* Locations Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <MapPin className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Locations</h2>
          </div>

          {locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.map((location, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${location.locationType === 'headquarters' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {location.locationType.charAt(0).toUpperCase() + location.locationType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{location.brandName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location.city}, {location.state}, {location.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {location.houseNumber} {location.street}, {location.cityRegion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No locations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;