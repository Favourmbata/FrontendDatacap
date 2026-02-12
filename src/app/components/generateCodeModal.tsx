import React, { useState } from 'react';
import { OneTimeCodeRequest } from '@/services/OneTimeCodeService';

interface GenerateCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OneTimeCodeRequest) => void;
  loading: boolean;
}

const GenerateCodeModal: React.FC<GenerateCodeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState<OneTimeCodeRequest>({
    userEmail: '',
    expirationHours: 24
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expirationHours' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.userEmail) {
      setError('Email is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Generate One-Time Code</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
                placeholder="external@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">Email of the external user who will receive the one-time code</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Time <span className="text-red-500">*</span>
              </label>
              <select
                name="expirationHours"
                value={formData.expirationHours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={18}>18 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Duration before the one-time code expires</p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e] disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateCodeModal;