"use client";

import React, { useState, useEffect } from 'react';
import { Search, Package, Calendar, Users, Tag, Percent, Eye, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Service {
  serviceId: string;
  serviceName: string;
  duration: string;
  price: number;
  _id: string;
}

interface SubscriptionPackage {
  _id: string;
  title: string;
  description: string;
  services: Service[];
  totalServiceCost: number;
  promoCode: string;
  discountPercentage: number;
  promoStartDate: string | null;
  promoEndDate: string | null;
  discountAmount: number;
  finalPriceAfterDiscount: number;
  features: string[];
  maxUsers: number;
  note: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ViewSubscriptionPackagesPage = () => {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<SubscriptionPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data since the endpoint is not available yet
  const mockPackages: SubscriptionPackage[] = [
    {
      "_id": "696e9a043a530eb702697bc1",
      "title": "House town",
      "description": "house town and cold stone",
      "services": [
        {
          "serviceId": "696df8e62b3c2531736e7dd6",
          "serviceName": "Assert Management",
          "duration": "monthly",
          "price": 1200,
          "_id": "696e9a043a530eb702697bc2"
        },
        {
          "serviceId": "696aad0cf06274fd794798d9",
          "serviceName": "Body Measurement Service",
          "duration": "monthly",
          "price": 1000,
          "_id": "696e9a043a530eb702697bc3"
        }
      ],
      "totalServiceCost": 2200,
      "promoCode": "6A51H9VZ",
      "discountPercentage": 0,
      "promoStartDate": null,
      "promoEndDate": null,
      "discountAmount": 0,
      "finalPriceAfterDiscount": 2200,
      "features": [
        "hfhhfhhhd",
        "dhhhdhhd"
      ],
      "maxUsers": 17,
      "note": "",
      "isActive": true,
      "createdBy": "366212a0-b7a1-4142-8b3a-8f547e5ac5a2",
      "createdAt": "2026-01-19T20:54:28.177Z",
      "updatedAt": "2026-01-19T20:54:28.177Z",
      "__v": 0
    },
    {
      "_id": "696e95473a530eb702697bad",
      "title": "Entrepreneurs package",
      "description": "Entrepreneurs package",
      "services": [
        {
          "serviceId": "696aad0cf06274fd794798d9",
          "serviceName": "Body Measurement Service",
          "duration": "monthly",
          "price": 1000,
          "_id": "696e95473a530eb702697bae"
        },
        {
          "serviceId": "696df8e62b3c2531736e7dd6",
          "serviceName": "Assert Management",
          "duration": "monthly",
          "price": 1200,
          "_id": "696e95473a530eb702697baf"
        }
      ],
      "totalServiceCost": 2200,
      "promoCode": "LS3H8ESL",
      "discountPercentage": 5,
      "promoStartDate": "2026-01-20T00:00:00.000Z",
      "promoEndDate": "2026-01-24T00:00:00.000Z",
      "discountAmount": 110,
      "finalPriceAfterDiscount": 2090,
      "features": [
        "smoot",
        "jjjnonses"
      ],
      "maxUsers": 18,
      "note": "",
      "isActive": true,
      "createdBy": "366212a0-b7a1-4142-8b3a-8f547e5ac5a2",
      "createdAt": "2026-01-19T20:34:15.573Z",
      "updatedAt": "2026-01-19T20:34:15.573Z",
      "__v": 0
    },
    {
      "maxUsers": 10,
      "_id": "696aadcbf06274fd794798e4",
      "title": "Premium Business Package",
      "description": "Premium Business Package",
      "services": [
        {
          "serviceId": "696aad0cf06274fd794798d9",
          "serviceName": "Body Measurement Service",
          "duration": "quarterly",
          "price": 2700,
          "_id": "696aadcbf06274fd794798e5"
        }
      ],
      "totalServiceCost": 2700,
      "promoCode": "E6FVE8C9",
      "discountPercentage": 5,
      "promoStartDate": null,
      "promoEndDate": null,
      "discountAmount": 135,
      "finalPriceAfterDiscount": 2565,
      "features": [
        "Smooth",
        "Nice"
      ],
      "note": "",
      "isActive": true,
      "createdBy": "366212a0-b7a1-4142-8b3a-8f547e5ac5a2",
      "createdAt": "2026-01-16T21:29:47.972Z",
      "updatedAt": "2026-01-16T21:29:47.972Z",
      "__v": 0
    },
    {
      "maxUsers": 10,
      "_id": "696a66e8815c85f0951840b7",
      "title": "Body package",
      "description": "body ppackage",
      "services": [
        {
          "serviceId": "696a416a977126a9515f838c",
          "serviceName": "Body Measurements",
          "duration": "monthly",
          "price": 5000,
          "_id": "696a66e8815c85f0951840b8"
        }
      ],
      "totalServiceCost": 5000,
      "promoCode": "WKC77Q2I",
      "discountPercentage": 5,
      "promoStartDate": "2026-01-17T00:00:00.000Z",
      "promoEndDate": "2026-01-23T00:00:00.000Z",
      "discountAmount": 250,
      "finalPriceAfterDiscount": 4750,
      "features": [
        "smoot",
        "Suuus"
      ],
      "note": "",
      "isActive": true,
      "createdBy": "366212a0-b7a1-4142-8b3a-8f547e5ac5a2",
      "createdAt": "2026-01-16T16:27:20.723Z",
      "updatedAt": "2026-01-16T16:27:20.723Z",
      "__v": 0
    },
    {
      "totalServiceCost": 2000,
      "discountPercentage": 0,
      "discountAmount": 0,
      "finalPriceAfterDiscount": 2000,
      "maxUsers": 10,
      "_id": "696895596fdc695972f5ad56",
      "title": "Body Measurement",
      "description": "Full access to all features",
      "services": [],
      "promoCode": "",
      "promoStartDate": null,
      "promoEndDate": null,
      "features": [
        "Unlimited AI body measurements",
        "Manual measurement forms",
        "Photo storage up to 1000 images"
      ],
      "note": "Best value for professional tailors and fashion designers",
      "isActive": true,
      "createdBy": "366212a0-b7a1-4142-8b3a-8f547e5ac5a2",
      "createdAt": "2026-01-15T07:20:57.354Z",
      "updatedAt": "2026-01-15T07:20:57.354Z",
      "__v": 0
    }
  ];

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setPackages(mockPackages);
      setFilteredPackages(mockPackages);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter packages based on search term
  useEffect(() => {
    if (packages) {
      const result = packages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.promoCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(result);
    }
  }, [searchTerm, packages]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getServiceDurationBadge = (duration: string) => {
    const durationColors: Record<string, string> = {
      'monthly': 'bg-blue-100 text-blue-800',
      'quarterly': 'bg-purple-100 text-purple-800',
      'yearly': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${durationColors[duration] || 'bg-gray-100 text-gray-800'}`}>
        {duration}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D2A8B]"></div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Table container with fixed height for scroll */
        .table-container {
          max-height: calc(100vh - 300px);
          overflow-y: auto;
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Packages</h1>
        <p className="text-gray-600">View and manage all subscription packages</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Link href="/admin/subscription/profile">
            <button className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Verify Profile
            </button>
          </Link>
        </div>
        
        <Link href="/subscription">
          <button className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Subscribe to Package
          </button>
        </Link>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="table-container custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Users
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Package className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No packages found</p>
                      <p className="text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{pkg.title}</div>
                        {pkg.promoCode && (
                          <div className="flex items-center gap-1 mt-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 font-mono">{pkg.promoCode}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={pkg.description}>
                        {pkg.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(pkg.totalServiceCost)}
                      </div>
                      {pkg.finalPriceAfterDiscount < pkg.totalServiceCost && (
                        <div className="text-sm text-purple-600 font-semibold">
                          {formatCurrency(pkg.finalPriceAfterDiscount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pkg.discountPercentage > 0 ? (
                          <div className="flex items-center gap-1">
                            <Percent className="w-4 h-4 text-red-500" />
                            <span>{pkg.discountPercentage}%</span>
                            <span className="text-red-600">(-{formatCurrency(pkg.discountAmount)})</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.services.slice(0, 2).map((service) => (
                          <span key={service._id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            <span>{service.serviceName}</span>
                            {getServiceDurationBadge(service.duration)}
                          </span>
                        ))}
                        {pkg.services.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{pkg.services.length - 2} more
                          </span>
                        )}
                        {pkg.services.length === 0 && (
                          <span className="text-xs text-gray-400 italic">No services</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{pkg.maxUsers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(pkg.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(pkg.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewSubscriptionPackagesPage;