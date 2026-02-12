"use client";

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import { mockProducts, Product, CartItem } from '@/services/mockBodyCareData';

interface AddToCartProps {
  productId?: string;
}

const AddToCartPage: React.FC<AddToCartProps> = ({ productId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // If productId is provided, add that product to the cart
    if (productId) {
      const savedProductData = localStorage.getItem('selectedProduct');
      if (savedProductData) {
        const productData = JSON.parse(savedProductData);
        const productToAdd = mockProducts.find(p => p.id === parseInt(productId));
        if (productToAdd) {
          setCartItems([{ product: productToAdd, quantity: 1 }]);
        }
      }
    }
  }, [productId]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.actualAmount * item.quantity), 0);
  };



  // Mock product data for demonstration
  const mockProduct = {
    id: 1,
    productName: "Premium Body Care Cream",
    producer: "Organic Beauty Co.",
    category: "Skin Care",
    actualAmount: 5000,
    description: "A luxurious moisturizing cream enriched with natural ingredients to nourish and hydrate your skin. Perfect for daily use to maintain healthy, glowing skin."
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold">Product Details</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>
            </div>

            <div className="p-6">
              {/* Product Card */}
              <div className="bg-white border-2 border-[#5d2a8b] rounded-xl shadow-sm mb-8 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{mockProduct.productName}</h2>
                <p className="text-lg text-gray-600 mb-1">By {mockProduct.producer}</p>
                
                <div className="my-6">
                  <span className="text-3xl font-bold text-[#5d2a8b]">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(mockProduct.actualAmount)}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{mockProduct.description}</p>
                </div>
              </div>

              {/* Checkout Card */}
              <div className="bg-white border-2 border-[#5d2a8b] rounded-xl shadow-sm p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium">{mockProduct.productName}</h4>
                      <p className="text-sm text-gray-600">Qty: 1</p>
                    </div>
                    <span className="font-semibold text-[#5d2a8b]">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(mockProduct.actualAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(mockProduct.actualAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(500)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#5d2a8b]">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(mockProduct.actualAmount + 500)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    className="bg-[#5d2a8b] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors text-sm"
                    onClick={() => router.push('/user/payment')}
                  >
                    Proceed to Payment
                  </button>
                  <button 
                    className="px-4 py-2 border border-[#5d2a8b] text-[#5d2a8b] rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors text-sm"
                    onClick={() => router.push('/user/body-care')}
                  >
                    Back to Products
                  </button>
                </div>
              </div>

              {/* Similar Products Section */}
              <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Similar Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="bg-gray-100 h-32 rounded-lg mb-3 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">Similar Product {item}</h4>
                      <p className="text-sm text-gray-600 mb-2">By Brand Name</p>
                      <p className="text-lg font-bold text-[#5d2a8b]">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(4500 + (item * 500))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;