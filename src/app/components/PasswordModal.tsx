

import React from 'react';

import { Eye, EyeOff } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  password?: string;
  onConfirm?: (password: string, generateNew: boolean) => void;
  title?: string;
  message?: string;
}
const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  password,
  onConfirm,
  title = 'Reset Password',
  message = 'Enter new password for Sarah Sedith'
}) => {
  const [newPassword, setNewPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4  bg-opacity-30"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl z-[100000] w-full max-w-md mx-auto"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          <p className="text-sm md:text-base text-gray-600 mb-4">{message}</p>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                </button>
              </div>
              <button
                onClick={generatePassword}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm md:text-base whitespace-nowrap"
              >
                Generate
              </button>
            </div>
            
            {password && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700 mb-1">Generated Password:</p>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-gray-50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onConfirm) {
                  // If there's a generated password, use it; otherwise use the manually entered password
                  if (password) {
                    onConfirm(password, true); // Use generated password
                  } else if (newPassword) {
                    onConfirm(newPassword, false); // Use manually entered password
                  }
                }
                onClose();
              }}
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm md:text-base"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PasswordModal;