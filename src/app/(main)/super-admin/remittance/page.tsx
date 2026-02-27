"use client";

import React, { useState, useEffect } from 'react';
import RemittanceService from '@/services/RemittanceService';
import { Upload, Play, Copy, CheckCircle } from 'lucide-react';

const RemittancePage = () => {
  const [remittanceData, setRemittanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('remittance');

  useEffect(() => {
    // Mock data for demonstration
    const mockRemittanceData = [
      {
        id: 'REM-001',
        productId: 'PROD-001',
        productName: 'Premium Consultation Package',
        organisation: 'ABC Consulting Ltd',
        orgId: 'ORG-001',
        productPrice: 1500.00,
        totalAmountPaid: 1500.00,
        deliveryMode: 'shipping',
        uploadedImages: ['image1.jpg', 'image2.jpg'],
        comments: 'All items received in good condition',
        userVideo: 'video1.mp4',
        satisfactionDeclaration: 'Customer satisfied with service quality',
        orgBankDetails: 'GTBank: 0123456789',
        amountRemitted: 1450.00,
        dateOfSettlement: '2024-01-15',
        superAdminBankDetails: 'Access Bank: 9876543210',
        paymentEvidence: 'evidence1.pdf',
        confirmationStatus: 'confirmed',
        orgComments: 'Payment received successfully'
      },
      {
        id: 'REM-002',
        productId: 'PROD-002',
        productName: 'Premium Design Package',
        organisation: 'XYZ Graphics Inc',
        orgId: 'ORG-002',
        productPrice: 2500.00,
        totalAmountPaid: 2500.00,
        deliveryMode: 'pickup',
        uploadedImages: ['image3.jpg'],
        comments: 'Product collected from pickup center',
        userVideo: 'video2.mp4',
        satisfactionDeclaration: 'Design exceeds expectations',
        orgBankDetails: 'UBA: 1122334455',
        amountRemitted: 2450.00,
        dateOfSettlement: '2024-01-16',
        superAdminBankDetails: 'Access Bank: 9876543210',
        paymentEvidence: 'evidence2.pdf',
        confirmationStatus: 'pending',
        orgComments: ''
      },
      {
        id: 'REM-003',
        productId: 'PROD-003',
        productName: 'Software License',
        organisation: 'Tech Solutions Ltd',
        orgId: 'ORG-003',
        productPrice: 5000.00,
        totalAmountPaid: 5000.00,
        deliveryMode: 'address',
        uploadedImages: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
        comments: 'Digital license delivered via email',
        userVideo: 'video3.mp4',
        satisfactionDeclaration: 'Software works perfectly',
        orgBankDetails: 'Zenith Bank: 5566778899',
        amountRemitted: 4900.00,
        dateOfSettlement: '2024-01-17',
        superAdminBankDetails: 'Access Bank: 9876543210',
        paymentEvidence: 'evidence3.pdf',
        confirmationStatus: 'pending',
        orgComments: ''
      }
    ];
    
    setRemittanceData(mockRemittanceData);
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'pending' | 'confirmed') => {
    setRemittanceData(prev => 
      prev.map(record => 
        record.id === id ? { ...record, confirmationStatus: newStatus } : record
      )
    );
  };

  const handleCommentChange = (id: string, comment: string) => {
    setRemittanceData(prev => 
      prev.map(record => 
        record.id === id ? { ...record, orgComments: comment } : record
      )
    );
  };

  const copySatisfactionMessage = () => {
    const message = "I hereby declare my satisfaction with the product/service received and approve the remittance of funds to the organization.";
    navigator.clipboard.writeText(message);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Remittance to Organisation</h1>
        <p className="text-gray-600">Manage product and service delivery confirmations</p>
      </div>

      <div className="mb-4 border-b">
        <button
          className={`mr-4 pb-2 px-1 border-b-2 ${activeTab === 'remittance' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
          onClick={() => setActiveTab('remittance')}
        >
          Delivery Confirmations
        </button>
        <button
          className={`mr-4 pb-2 px-1 ${activeTab === 'settlement' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
          onClick={() => setActiveTab('settlement')}
        >
          Organisation Settlements
        </button>
      </div>
      
      {activeTab === 'remittance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Product & Service Delivery Confirmations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Product' name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Product's ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Organisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Organization's ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Product's price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Total amount paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Mode of delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Upload picture</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> User's video</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Org's bank details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Amount remitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Date of settlement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Superadmin's bank details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Upload evidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Confirmation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {remittanceData.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{record.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.organisation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.orgId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${record.productPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${record.totalAmountPaid.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.deliveryMode === 'shipping' && 'Shipping to Address'}
                        {record.deliveryMode === 'pickup' && 'Pick-up Center'}
                        {record.deliveryMode === 'address' && 'Org Location'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Images
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Video
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.orgBankDetails}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${record.amountRemitted.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.dateOfSettlement}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.superAdminBankDetails}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Evidence
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className={`px-3 py-1 rounded ${
                            record.confirmationStatus === 'confirmed' 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-yellow-500 hover:bg-yellow-600'
                          } text-white`}
                          onClick={() => handleStatusChange(record.id, record.confirmationStatus === 'confirmed' ? 'pending' : 'confirmed')}
                        >
                          {record.confirmationStatus === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View Comments
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRecord && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Confirmation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <p>{selectedRecord.productName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                  <p>{selectedRecord.productId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
                  <p>{selectedRecord.organisation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisation ID</label>
                  <p>{selectedRecord.orgId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Price</label>
                  <p>${selectedRecord.productPrice.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount Paid</label>
                  <p>${selectedRecord.totalAmountPaid.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Mode</label>
                  <p>
                    {selectedRecord.deliveryMode === 'shipping' && 'Shipping to Customer Address'}
                    {selectedRecord.deliveryMode === 'pickup' && 'Pick-up Center'}
                    {selectedRecord.deliveryMode === 'address' && 'Organisation Location'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Satisfaction Declaration</label>
                  <p>{selectedRecord.satisfactionDeclaration}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Evidence</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      {selectedRecord.uploadedImages.map((img: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img 
                            src={`/placeholder-${idx+1}.jpg`} 
                            alt={`Upload ${idx+1}`} 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span>{img}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">Upload Picture of Product</label>
                      <div className="flex items-center gap-2 border-2 border-dashed p-4 rounded">
                        <Upload className="w-5 h-5" />
                        <span>Upload product image</span>
                      </div>
                      
                      <label className="block text-sm font-medium text-gray-700">Upload Representative Image</label>
                      <div className="flex items-center gap-2 border-2 border-dashed p-4 rounded">
                        <Upload className="w-5 h-5" />
                        <span>Upload representative image</span>
                      </div>
                      
                      <label className="block text-sm font-medium text-gray-700">Upload User Image</label>
                      <div className="flex items-center gap-2 border-2 border-dashed p-4 rounded">
                        <Upload className="w-5 h-5" />
                        <span>Upload user image</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea 
                    value={selectedRecord.comments} 
                    onChange={(e) => handleCommentChange(selectedRecord.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add your comments here..."
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Video Confirmation</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2 border-2 border-dashed p-4 rounded">
                      <Play className="w-5 h-5" />
                      <span>Upload video confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="satisfaction" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="satisfaction" className="block text-sm">Declaration of satisfaction on product</label>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satisfaction Message</label>
                  <div className="mt-2">
                    <p className="mb-2">
                      "I hereby declare my satisfaction with the product/service received and approve the remittance of funds to the organization."
                    </p>
                    <button 
                      onClick={copySatisfactionMessage}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'settlement' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Organisation Settlements</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Org ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Remitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Settlement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SuperAdmin Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Evidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Org Confirmation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {remittanceData
                    .filter(record => record.amountRemitted > 0)
                    .map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{record.organisation}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.orgId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.orgBankDetails}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${record.amountRemitted.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.dateOfSettlement}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.superAdminBankDetails}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-indigo-600 hover:text-indigo-900">View Evidence</button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.confirmationStatus === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.confirmationStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="text" 
                            value={record.orgComments} 
                            onChange={(e) => handleCommentChange(record.id, e.target.value)}
                            placeholder="Add comment..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemittancePage;