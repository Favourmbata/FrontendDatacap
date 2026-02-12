import React, { useState, useEffect } from 'react';

interface OTPVerificationProps {
  email: string;
  otpExpiresIn: number;
  maxAttempts: number;
  remainingAttempts: number;
}

const OTPVerificationScreen: React.FC<OTPVerificationProps> = ({ 
  email, 
  otpExpiresIn, 
  maxAttempts, 
  remainingAttempts 
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(otpExpiresIn); // 600 seconds
  const [attempts, setAttempts] = useState(remainingAttempts);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Format countdown as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    setError('');
    
    // Validate OTP format
    if (!/^[0-9]{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Navigate to login or dashboard
        setTimeout(() => {
          window.location.href = '/login'; // or wherever you want to redirect
        }, 2000);
      } else {
        setAttempts(prev => prev - 1);
        setError(data.message || 'Invalid OTP. Please try again.');
        
        // If no attempts left, disable the form
        if (attempts <= 1) {
          setIsResendDisabled(false);
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    setError('');
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        // Reset countdown with new OTP expiry time
        setCountdown(data.data.otpExpiresIn);
        setAttempts(data.data.remainingAttempts);
        setIsResendDisabled(true);
        setError('');
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="otp-verification-screen p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-6">Enter the 6-digit code sent to <strong>{email}</strong></p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Email verified successfully! Redirecting...
        </div>
      )}

      {/* OTP Input */}
      <div className="mb-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
            setOtp(value);
          }}
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-center"
          disabled={success}
        />
      </div>

      {/* Countdown Timer */}
      <div className="mb-4 countdown-timer">
        {countdown > 0 ? (
          <p className="text-gray-700">OTP expires in: <strong className="font-semibold text-purple-600">{formatTime(countdown)}</strong></p>
        ) : (
          <p className="text-red-600 font-medium expired">OTP has expired. Please request a new one.</p>
        )}
      </div>

      {/* Remaining Attempts */}
      <div className="mb-6 attempts-info">
        <p className="text-gray-700">Remaining attempts: <strong className="font-semibold">{attempts}/{maxAttempts}</strong></p>
      </div>

      {/* Verify Button */}
      <button 
        onClick={handleVerifyOTP}
        disabled={otp.length !== 6 || countdown <= 0 || success}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white mb-4 ${otp.length !== 6 || countdown <= 0 || success ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        Verify OTP
      </button>

      {/* Resend Button */}
      <button 
        onClick={handleResendOTP}
        disabled={isResendDisabled || success}
        className={`w-full py-3 px-4 rounded-lg font-semibold ${isResendDisabled || success ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        {isResendDisabled 
          ? `Resend OTP in ${formatTime(countdown)}` 
          : 'Resend OTP'}
      </button>
    </div>
  );
};

export default OTPVerificationScreen;