"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import AddToCartComponent from '@/modules/user/addToCart';

const AddToCartPage = () => {
  const { user } = useAuth();
  const params = useParams();

  // Extract product ID from URL if available
  const productId = params.productId ? Array.isArray(params.productId) ? params.productId[0] : params.productId : undefined;

  return (
    <div>
      <AddToCartComponent productId={productId} />
    </div>
  );
};

export default AddToCartPage;