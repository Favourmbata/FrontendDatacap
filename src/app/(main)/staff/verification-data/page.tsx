"use client"
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerificationData {
  id: number;
  country: string;
  state: string;
  lga: string;
  city: string;
  cityRegion: string;
  organisation: string;
  firstName: string;
  lastName: string;
}

const VerificationDataPage = () => {
  const router = useRouter();
  const [verificationData, setVerificationData] = useState<VerificationData[]>([
    {
      id: 1,
      country: 'Nigeria',
      state: 'Lagos',
      lga: 'Ikeja',
      city: 'Ikeja',
      cityRegion: 'Mainland',
      organisation: 'Tech Corp Ltd',
      firstName: 'John',
      lastName: 'Doe'
    },
    {
      id: 2,
      country: 'Nigeria',
      state: 'Abuja',
      lga: 'Municipal',
      city: 'Abuja',
      cityRegion: 'Central',
      organisation: 'Finance Solutions',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this verification data?')) {
      setVerificationData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCreateClick = () => {
    router.push('/staff/verification-data/create');
  };

  const filteredData = verificationData.filter(item =>
    item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Verification Data Management</h1>
              <p className="text-gray-600">Manage organization verification information</p>
            </div>
            <div className="text-sm text-gray-500">
              Total: <span className="font-medium">{verificationData.length}</span> records
            </div>
          </div>
        </div>

        {/* Search and Add buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B] bg-white"
              placeholder="Search verification data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <button 
              onClick={handleCreateClick}
              className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Verification Data
            </button>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">Country</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">State</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">LGA</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">City</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">City Region</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">Organisation</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">First Name</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap">Last Name</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm whitespace-nowrap sticky right-0 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No verification data found</h3>
                        <p className="mb-4 text-sm">
                          {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first verification data'}
                        </p>
                        {!searchTerm && (
                          <button 
                            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2 rounded-lg hover:bg-[#4a216d] transition-colors text-sm"
                            onClick={handleCreateClick}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Verification Data
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.country}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.state}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.lga}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.city}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.cityRegion}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium">{item.organisation}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.firstName}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{item.lastName}</span>
                      </td>
                      <td className="py-4 px-4 sticky right-0 bg-white">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => alert(`Edit functionality for ID: ${item.id}`)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors text-xs"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-xs"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredData.length}</span> of{' '}
                <span className="font-medium">{verificationData.length}</span> results
              </div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs">
                  Previous
                </button>
                <button className="px-2 py-1 bg-[#5D2A8B] text-white rounded hover:bg-[#4a216d] text-xs">
                  1
                </button>
                <button className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 text-xs">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationDataPage;