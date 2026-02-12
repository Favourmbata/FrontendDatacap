"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Heart, CheckCircle, Clock, Phone, Mail, Calendar, Scissors, Dumbbell, Bath, Shirt, Barcode, Tag, Package, ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '@/api/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/services/mockBodyCareData';

const BodyCarePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Set products from imported data
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const categories = [
    'All Categories',
    'Hair Care',
    'Nail Care',
    'Fitness',
    'Spa Treatment',
    'Fashion',
    'Skin Care'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesVerification = selectedVerification === '' || 
                               (selectedVerification === 'Verified' && product.verified) || 
                               (selectedVerification === 'Unverified' && !product.verified);
    
    return matchesSearch && matchesCategory && matchesVerification;
  });

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const addToCart = (product: any) => {
    // Add to localStorage and navigate to add to cart page
    const cartData = {
      productId: product.id,
      timestamp: Date.now()
    };
    localStorage.setItem('selectedProduct', JSON.stringify(cartData));
    router.push('/user/add-to-cart');
  };

  const bookAppointment = (product: any) => {
    // Store appointment data and navigate to appointment page
    localStorage.setItem('appointmentProduct', JSON.stringify(product));
    router.push('/user/book-appointment');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={handleBack}
              className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              ← Back to Products
            </button>

            {/* Product Detail View */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedProduct.productName}</h1>
                    <p className="text-[#d0c4da] flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedProduct.address}
                    </p>
                  </div>
                  {selectedProduct.verified && (
                    <div className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center">
                        <Package className="w-16 h-16 text-[#5d2a8b]" />
                      </div>
                    </div>
                    
                    {/* Product Gallery Thumbnails */}
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.images.slice(0, 3).map((img: string, index: number) => (
                        <div key={index} className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#5d2a8b]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Details Card */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Original Price</p>
                          <p className="text-lg font-bold text-gray-500 line-through">{formatCurrency(selectedProduct.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Discounted Price</p>
                          <p className="text-2xl font-bold text-[#5d2a8b]">{formatCurrency(selectedProduct.actualAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">You Save</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(selectedProduct.discountAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Discount</p>
                          <p className="text-lg font-bold text-orange-600">{selectedProduct.discountPercent}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Category</p>
                          <p className="font-semibold">{selectedProduct.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Available Quantity</p>
                          <p className="font-semibold">{selectedProduct.totalQuantity} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">SKU</p>
                          <p className="font-mono">{selectedProduct.sku}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">UPC</p>
                          <p className="font-mono">{selectedProduct.upc}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
                        <p className="text-gray-700">{selectedProduct.description}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Ingredients/Formulas</p>
                        <p className="text-gray-700">{selectedProduct.ingredients}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Payment Methods</p>
                        <p className="text-gray-700">{selectedProduct.modeOfPayment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Provider Information Card */}
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Service Provider Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Producer</p>
                      <p className="font-semibold text-lg">{selectedProduct.producer}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Contact</p>
                      <div className="space-y-2">
                        <p className="text-gray-700 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                          {selectedProduct.contact.phone}
                        </p>
                        <p className="text-gray-700 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                          {selectedProduct.contact.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Availability</p>
                      <div className="space-y-2">
                        <p className="text-gray-700 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                          {selectedProduct.availability.openingTime}
                        </p>
                        <p className="text-gray-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                          {selectedProduct.availability.workingDays}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Different Locations Card */}
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Service Locations</h2>
                  
                  <div className="space-y-4">
                    {selectedProduct.locations && selectedProduct.locations.map((location: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{location.brandName}</h3>
                            <p className="text-sm text-gray-600 capitalize">{location.locationType}</p>
                          </div>
                          <span className="bg-[#5d2a8b]/10 text-[#5d2a8b] text-xs px-2 py-1 rounded-full">
                            Fee: {formatCurrency(location.cityRegionFee)}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                            <span>{location.cityRegion}, {location.city}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">LGA:</span> {location.lga}
                          </div>
                          <div>
                            <span className="text-gray-600">State:</span> {location.state}
                          </div>
                          <div>
                            <span className="text-gray-600">Country:</span> {location.country}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center mt-8 space-x-4">
                  <button 
                    onClick={() => addToCart(selectedProduct)}
                    className="bg-[#5d2a8b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => bookAppointment(selectedProduct)}
                    className="border-2 border-[#5d2a8b] text-[#5d2a8b] px-8 py-3 rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              <span className="text-[#5d2a8b]">Verified</span> Body Care Products & Services
            </h1>
            <p className="text-gray-600 text-lg">Discover quality services and products from verified providers</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-2 border-[#5d2a8b]">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5d2a8b] w-6 h-6" />
              <input
                type="text"
                placeholder="Search for products, services, or providers..."
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                <select
                  className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                >
                  <option value="">All Providers</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Unverified">Unverified Only</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button className="w-full bg-[#5d2a8b] text-white py-3 rounded-lg hover:bg-[#7a3aa3] transition-colors font-semibold flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search Products
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#5d2a8b]">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="w-4 h-4 mr-1" />
              Sorted by popularity
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-[#5d2a8b] hover:border-[#7a3aa3]">
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#5d2a8b]" />
                    </div>
                    {product.verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center font-semibold z-10">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#5d2a8b] text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </div>
                    <div className="absolute top-12 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                      {product.discountPercent}% OFF
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5">
                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.productName}</h3>
                    
                    {/* Pricing */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
                        <span className="text-lg font-bold text-[#5d2a8b]">{formatCurrency(product.actualAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">
                          Save {formatCurrency(product.discountAmount)}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {product.totalQuantity} left
                        </span>
                      </div>
                    </div>
                    
                    {/* Producer */}
                    <p className="text-sm text-[#5d2a8b] font-medium mb-2">{product.producer}</p>
                    
                    {/* Action Button */}
                    <button 
                      onClick={() => handleViewDetails(product)}
                      className="w-full bg-[#5d2a8b] text-white py-2.5 rounded-lg hover:bg-[#7a3aa3] transition-colors font-semibold flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                className="text-purple-600 hover:text-purple-700 font-medium"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedVerification('');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyCarePage;