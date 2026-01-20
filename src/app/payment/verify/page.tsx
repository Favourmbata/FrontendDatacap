'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import PaymentService from '@/services/PaymentService';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the client component with no SSR
const PaymentVerificationClient = dynamic(
  () => import('./PaymentVerificationClient'),
  { ssr: false }
);

const PaymentVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Loading...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your payment</p>
          </div>
        </div>
      </div>
    }>
      <PaymentVerificationClient />
    </Suspense>
  );
};

export default PaymentVerificationPage;