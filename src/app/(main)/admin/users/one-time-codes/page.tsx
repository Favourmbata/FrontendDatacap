"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OneTimeCodeService, OneTimeCodeRequest } from '@/services/OneTimeCodeService';
import GenerateCodeModal from '@/app/components/generateCodeModal';

const OneTimeCodesPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codes, setCodes] = useState<any[]>([]);
  const [codesLoading, setCodesLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCodes, setTotalCodes] = useState<number>(0);

  // Fetch one-time codes from API
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const service = new OneTimeCodeService();
        const response = await service.getOneTimeCodes(currentPage, 10);
        setCodes(response.data.codes || []);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCodes(response.data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load one-time codes');
        console.error('Error fetching codes:', err);
      } finally {
        setCodesLoading(false);
      }
    };
    
    fetchCodes();
  }, [currentPage]);

  const handleGenerateCode = async (formData: OneTimeCodeRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const service = new OneTimeCodeService();
      const response = await service.generateOneTimeCode(formData);
      
      setSuccess(response.data.message);
      setIsModalOpen(false);
      
      // Refresh the codes list
      const codesResponse = await service.getOneTimeCodes(currentPage, 10);
      setCodes(codesResponse.data.codes || []);
      setTotalPages(codesResponse.data.pagination.totalPages);
      setTotalCodes(codesResponse.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate one-time code');
      console.error('Error generating code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={goBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mb-4"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">One-Time Codes</h1>
            <p className="text-gray-600">Manage generated access codes for external users</p>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e]"
            >
              Generate Code
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            Success: {success}
          </div>
        )}
      
      {/* Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">One-Time Codes</h2>
          
          {codesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5D2A8B]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Error loading codes: {error}</div>
          ) : codes.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No one-time codes generated yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codes.map((code) => (
                    <tr key={code.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{code.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          code.isUsed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {code.isUsed ? 'Used' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(code.expiresAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(code.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && !codesLoading && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> 
                ({totalCodes} codes total)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Generate Code Modal */}
      <GenerateCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateCode}
        loading={loading}
      />
    </div>
  </div>
  );
}

export default OneTimeCodesPage;