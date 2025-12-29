"use client";

import React, { useState } from 'react';
import { superAdminUserModule } from './userModule';

const SuperAdminUserExport: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blob = await superAdminUserModule.exportCustomers(exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Export Customers</h1>
        <p className="text-gray-600">Export customer data in various formats</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
            Select Export Format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="csv"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value as 'csv')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="csv" className="ml-2 block text-sm text-gray-700">
                CSV
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="excel"
                name="format"
                value="excel"
                checked={exportFormat === 'excel'}
                onChange={(e) => setExportFormat(e.target.value as 'excel')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="excel" className="ml-2 block text-sm text-gray-700">
                Excel
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="pdf"
                name="format"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="pdf" className="ml-2 block text-sm text-gray-700">
                PDF
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Exporting...' : 'Export Customers'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Export Options</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>CSV: Comma-separated values, compatible with most spreadsheet applications</li>
            <li>Excel: Microsoft Excel format with formatting and multiple sheets support</li>
            <li>PDF: Portable Document Format, suitable for printing and sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUserExport;