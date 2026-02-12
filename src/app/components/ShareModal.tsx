import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareToOrganization: (code: string) => void;
  onShareToOthers: () => void;
  loading: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShareToOrganization,
  onShareToOthers,
  loading
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOrganizationShare = () => {
    if (!code.trim()) {
      setError('One-time code is required');
      return;
    }
    setError('');
    onShareToOrganization(code);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-start justify-end z-50 p-4 pt-16">
      <div className="bg-white rounded-xl shadow-xl w-64">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Share</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Share to others</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    // Share to Facebook
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent('Check out my body measurements!');
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span>Facebook</span>
                </button>
                
                <button
                  onClick={() => {
                    // Share to WhatsApp
                    const text = encodeURIComponent(`Check out my body measurements! ${window.location.href}`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">w</span>
                  </div>
                  <span>WhatsApp</span>
                </button>
                
                <button
                  onClick={() => {
                    // Share to Twitter
                    const text = encodeURIComponent('Check out my body measurements!');
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">t</span>
                  </div>
                  <span>Twitter</span>
                </button>
                
                <button
                  onClick={() => {
                    // Share to LinkedIn
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">in</span>
                  </div>
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                // Share to organization - just show the input field
                // The actual sharing will happen when user enters code and clicks share
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-700 text-xs">...</span>
              </div>
              <span>Share to organization</span>
            </button>
            
            <div className="mt-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter one-time code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D2A8B] text-sm"
              />
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            <button
              onClick={handleOrganizationShare}
              disabled={loading}
              className="w-full mt-2 px-3 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e] disabled:opacity-50 text-sm"
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;