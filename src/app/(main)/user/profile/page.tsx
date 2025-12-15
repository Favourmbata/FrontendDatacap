'use client';

import React, { useState } from 'react';
import { useProfile } from '@/api/hooks/useProfile';
import Image from 'next/image';
import { MessageModal } from '@/app/components/MessageModal';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MeasurementTopNav } from '@/app/components/MeasurementTopNav';

const ProfilePage = () => {
  const router = useRouter();
  const { profile, loading, error } = useProfile();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error'
  });

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}`
          : '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || profile.phoneNumber || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setModalState({
      isOpen: true,
      title: 'Feature Coming Soon',
      message: 'Save profile feature is currently under development. Please check back later.',
      type: 'info'
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-white p-0">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }

         @media (min-width: 768px) {
          .desktop-topnav {
            display: block;
          }
        }
      `}</style>

      {/* Message Modal */}
      <MessageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
      
      <div className="desktop-topnav">
        <MeasurementTopNav />
      </div>

      {/* Main Profile Container */}
      <div 
        className="absolute bg-white"
        style={{
          width: '958px',
          height: '1005px',
          top: '227px',
          left: '401px',
          background:"#FFFFFF",
          borderRadius: '20px',
          opacity: 1
        }}
      >
        {/* View Profile Header */}
        <button 
          onClick={() => router.back()}
          className="absolute flex items-center manrope text-gray-700 hover:text-gray-900"
          style={{
            width: '161px',
            height: '30px',
            top: '52px',
            left: '25px',
            gap: '14px',
            opacity: 1
          }}
        >
          <ChevronLeft size={20} />
          <span className="text-base font-medium">View Profile</span>
        </button>

        {loading ? (
          <div className="text-center py-8">
            <p className="manrope text-gray-500">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="manrope text-red-500">Failed to load profile</p>
            <p className="manrope text-sm text-gray-500 mt-2">{error}</p>
          </div>
        ) : (
          /* Inner User Details Container */
          <div 
            className="absolute bg-white"
            style={{
              width: '811px',
              height: '819px',
              top: '135px',
              left: '49px',
              borderRadius: '20px',
              opacity: 1,
              boxShadow: '0px 2px 8px 0px #5D2A8B1A',
              padding: '48px'
            }}
          >
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div 
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#6D1E1E'
                  }}
                >
                  <Image 
                    src="/Frame 1707479300.png" 
                    alt="User Avatar" 
                    width={60} 
                    height={60}
                    className="object-cover"
                  />
                </div>
                <button 
                  className="manrope text-sm font-medium"
                  style={{ color: '#6E6E6EB2' }}

                >
                  Upload new picture
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="manrope w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: '#E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="manrope w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: '#E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Phone No */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Phone No.
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone No."
                    className="manrope w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: '#E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Save Profile Button */}
              <div className="flex justify-end pt-4">
                <button 
                  className="manrope text-white font-medium transition-colors hover:opacity-90"
                  onClick={handleSaveProfile}
                  style={{
                    background: '#5D2A8B',
                    width: '109px',
                    height: '38px',
                    borderRadius: '20px',
                    opacity: 1,
                    paddingTop: '8px',
                    paddingRight: '10px',
                    paddingBottom: '8px',
                    paddingLeft: '10px',
                    fontSize: '14px'
                  }}
                >
                  edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;