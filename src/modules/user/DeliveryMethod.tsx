"use client";

import { useState, useEffect } from 'react';
import { MapPin, Package, Home, Truck, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/hooks/useAuth';
import { mockProducts, Product, CartItem } from '@/services/mockBodyCareData';

interface DeliveryMethodProps {
  fromCheckout?: boolean;
}

const DeliveryMethodPage: React.FC<DeliveryMethodProps> = ({ fromCheckout = true }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'merchant_address' | 'pickup_center' | 'home_delivery' | 'third_party'>('merchant_address');
  const [selectedPickupCenter, setSelectedPickupCenter] = useState<number | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    country: '',
    state: '',
    lga: '',
    city: '',
    cityRegion: '',
    address: '',
    shippingCost: 0
  });

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleDeliveryMethodChange = (method: 'merchant_address' | 'pickup_center' | 'home_delivery' | 'third_party') => {
    setSelectedDeliveryMethod(method);
  };

  const handlePickupCenterChange = (centerId: number) => {
    setSelectedPickupCenter(centerId);
  };

  const handleSubmitOrder = () => {
    // Process the final order submission
    console.log("Order submitted:", {
      cartItems,
      selectedDeliveryMethod,
      selectedPickupCenter,
      shippingAddress
    });
    // Navigate to payment page
    router.push('/user/payment');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.actualAmount * item.quantity), 0);
  };

  const getTotalPriceWithDelivery = () => {
    const totalPrice = getTotalPrice();
    
    if (selectedDeliveryMethod === 'pickup_center' && selectedPickupCenter !== null) {
      const pickupCenter = cartItems[0]?.product.locations.find(loc => loc.id === selectedPickupCenter);
      return totalPrice + (pickupCenter?.cityRegionFee || 0);
    }
    
    return totalPrice;
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
                  onClick={() => fromCheckout ? router.push('/user/add-to-cart') : router.back()}
                  className="flex items-center text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </button>
                <h1 className="text-3xl font-bold">Delivery Method</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>
            </div>

            <div className="p-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium">{item.product.productName}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#5d2a8b]">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(item.product.actualAmount * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold text-lg">
                    <span>Subtotal</span>
                    <span className="text-[#5d2a8b]">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Options</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedDeliveryMethod === 'merchant_address' ? 'border-[#5d2a8b] bg-[#5d2a8b]/5' : 'border-gray-200 hover:border-[#5d2a8b]'}`}
                    onClick={() => handleDeliveryMethodChange('merchant_address')}
                  >
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-[#5d2a8b] mr-2" />
                      <h4 className="font-semibold">Merchant Address</h4>
                    </div>
                    <p className="text-sm text-gray-600">Collect from merchant's registered address</p>
                    <p className="text-sm font-medium text-green-600 mt-2">Free</p>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedDeliveryMethod === 'pickup_center' ? 'border-[#5d2a8b] bg-[#5d2a8b]/5' : 'border-gray-200 hover:border-[#5d2a8b]'}`}
                    onClick={() => handleDeliveryMethodChange('pickup_center')}
                  >
                    <div className="flex items-center mb-2">
                      <Package className="w-5 h-5 text-[#5d2a8b] mr-2" />
                      <h4 className="font-semibold">Pick-up Center</h4>
                    </div>
                    <p className="text-sm text-gray-600">Collect from designated center</p>
                    <p className="text-sm font-medium text-green-600 mt-2">Fee applies</p>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedDeliveryMethod === 'home_delivery' ? 'border-[#5d2a8b] bg-[#5d2a8b]/5' : 'border-gray-200 hover:border-[#5d2a8b]'}`}
                    onClick={() => handleDeliveryMethodChange('home_delivery')}
                  >
                    <div className="flex items-center mb-2">
                      <Home className="w-5 h-5 text-[#5d2a8b] mr-2" />
                      <h4 className="font-semibold">Home Delivery</h4>
                    </div>
                    <p className="text-sm text-gray-600">Delivered to your address</p>
                    <p className="text-sm font-medium text-green-600 mt-2">Shipping fee applies</p>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${selectedDeliveryMethod === 'third_party' ? 'border-[#5d2a8b] bg-[#5d2a8b]/5' : 'border-gray-200 hover:border-[#5d2a8b]'}`}
                    onClick={() => handleDeliveryMethodChange('third_party')}
                  >
                    <div className="flex items-center mb-2">
                      <Truck className="w-5 h-5 text-[#5d2a8b] mr-2" />
                      <h4 className="font-semibold">3rd Party Delivery</h4>
                    </div>
                    <p className="text-sm text-gray-600">Via third-party service</p>
                    <p className="text-sm font-medium text-green-600 mt-2">Shipping fee applies</p>
                  </div>
                </div>
                
                {selectedDeliveryMethod === 'pickup_center' && (
                  <div className="mt-6 p-6 bg-white border-2 border-[#5d2a8b] rounded-lg">
                    <h4 className="font-semibold text-lg mb-4">Select Pick-up Center</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cartItems[0]?.product.locations.map((location, index) => (
                        <div 
                          key={index}
                          className={`border-2 rounded-lg p-4 cursor-pointer ${selectedPickupCenter === location.id ? 'border-[#5d2a8b] bg-[#5d2a8b]/5' : 'border-gray-200 hover:border-[#5d2a8b]'}`}
                          onClick={() => handlePickupCenterChange(location.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold">{location.brandName}</h5>
                              <p className="text-sm text-gray-600">{location.cityRegion}, {location.city}</p>
                              <p className="text-xs text-gray-500 mt-1">{location.lga}, {location.state}</p>
                            </div>
                            <span className="bg-[#5d2a8b]/10 text-[#5d2a8b] text-xs px-2 py-1 rounded-full font-medium">
                              {new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(location.cityRegionFee)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(selectedDeliveryMethod === 'home_delivery' || selectedDeliveryMethod === 'third_party') && (
                  <div className="mt-6 p-6 bg-white border-2 border-[#5d2a8b] rounded-lg">
                    <h4 className="font-semibold text-lg mb-4">Shipping Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          placeholder="Enter country"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          placeholder="Enter state"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LGA</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.lga}
                          onChange={(e) => setShippingAddress({...shippingAddress, lga: e.target.value})}
                          placeholder="Enter LGA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          placeholder="Enter city"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery city's region</label>
                        <select
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.cityRegion}
                          onChange={(e) => {
                            const region = e.target.value;
                            setShippingAddress({...shippingAddress, cityRegion: region});
                            
                            if (region) {
                              const matchingLocation = cartItems[0]?.product.locations.find(loc => loc.cityRegion === region);
                              if (matchingLocation) {
                                setShippingAddress(prev => ({...prev, shippingCost: matchingLocation.cityRegionFee}));
                              }
                            }
                          }}
                        >
                          <option value="">Select delivery region</option>
                          {cartItems[0]?.product.locations.map((location, index) => (
                            <option key={index} value={location.cityRegion}>
                              {location.cityRegion} - {new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(location.cityRegionFee)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address (e.g., 1A, Hughes, Yaba)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                          placeholder="Enter full address"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Order Summary with Delivery */}
              <div className="bg-white border-2 border-[#5d2a8b] rounded-lg p-6 mb-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Total</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(getTotalPrice())}
                    </span>
                  </div>
                  
                  {selectedDeliveryMethod === 'pickup_center' && selectedPickupCenter !== null && (
                    <div className="flex justify-between">
                      <span>Pickup Center Fee</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(cartItems[0]?.product.locations.find(loc => loc.id === selectedPickupCenter)?.cityRegionFee || 0)}
                      </span>
                    </div>
                  )}
                  
                  {(selectedDeliveryMethod === 'home_delivery' || selectedDeliveryMethod === 'third_party') && shippingAddress.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(shippingAddress.shippingCost)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#5d2a8b]">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(getTotalPriceWithDelivery())}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-[#5d2a8b] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors text-lg"
                  onClick={handleSubmitOrder}
                  disabled={!selectedDeliveryMethod}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMethodPage;