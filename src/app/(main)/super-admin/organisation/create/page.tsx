'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OrganizationForm from '@/components/forms/OrganizationForm';

const CreateOrganizationPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/super-admin/organisation');
  };

  const handleCancel = () => {
    router.push('/super-admin/organisation');
  };

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Organization</h1>
          <p className="text-gray-600">Fill in the details below to create a new organization</p>
        </div>

        <OrganizationForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CreateOrganizationPage;