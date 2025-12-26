"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/app/components/hooks/use-toast';
import { OneTimeCodeService } from '@/services/OneTimeCodeService';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OneTimeCode {
  id: string;
  code: string;
  userEmail: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

const OneTimeCodeGenerator = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [expirationHours, setExpirationHours] = useState(24);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codes, setCodes] = useState<OneTimeCode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch one-time codes on component mount
  useEffect(() => {
    fetchCodes();
  }, []);

  // Generate one-time code
  const generateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const oneTimeCodeService = new OneTimeCodeService();
      const response = await oneTimeCodeService.generateOneTimeCode({
        userEmail,
        expirationHours
      });
      
      if (response.success) {
        setGeneratedCode(response.data.code);
        toast({ 
          title: 'Success', 
          description: response.data.message,
          variant: 'default'
        });
        // Refresh the codes list
        fetchCodes();
      } else {
        throw new Error(response.data.message || 'Failed to generate code');
      }
    } catch (error: any) {
      console.error('Error generating code:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to generate one-time code',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch one-time codes
  const fetchCodes = async (page: number = 1) => {
    try {
      const oneTimeCodeService = new OneTimeCodeService();
      const response = await oneTimeCodeService.getOneTimeCodes(page, limit);
      
      if (response.success) {
        setCodes(response.data.codes);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.page);
      } else {
        throw new Error(response.data.message || 'Failed to fetch codes');
      }
    } catch (error: any) {
      console.error('Error fetching codes:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to fetch one-time codes',
        variant: 'destructive'
      });
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCodes(newPage);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ 
      title: 'Copied', 
      description: 'One-time code copied to clipboard',
      variant: 'default'
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Check if code is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Centered Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
              {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-[#5D2A8B] hover:text-purple-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-6">Generate One-Time Code</h2>
              
              {/* Generate Code Form */}
              <form onSubmit={generateCode} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      User Email *
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter user email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expirationHours" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Hours (1-168) *
                    </label>
                    <input
                      type="number"
                      id="expirationHours"
                      min="1"
                      max="168"
                      value={expirationHours}
                      onChange={(e) => setExpirationHours(parseInt(e.target.value) || 24)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Maximum 7 days (168 hours)</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#5D2A8B] text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate One-Time Code'
                    )}
                  </button>
                </div>
              </form>
              
              {/* Generated Code Display */}
              {generatedCode && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Generated Code</h3>
                  <div className="flex items-center gap-4">
                    <code className="text-2xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded">
                      {generatedCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedCode)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Copy Code
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-green-700">
                    Share this code with the user. It will expire in {expirationHours} hour(s).
                  </p>
                </div>
              )}
              
              {/* Codes List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Codes</h3>
                
                {codes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No one-time codes generated yet
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expires
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {codes.map((code) => (
                            <tr key={code.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {code.code}
                                </code>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {code.userEmail}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {code.isUsed ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Used
                                  </span>
                                ) : isExpired(code.expiresAt) ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(code.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(code.expiresAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneTimeCodeGenerator;