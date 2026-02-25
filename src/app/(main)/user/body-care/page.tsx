"use client";

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Search, Filter, MapPin, Star, Heart, CheckCircle, Clock, Phone, Mail, Calendar, Scissors, Dumbbell, Bath, Shirt, Barcode, Tag, Package, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { useAuth } from '@/api/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Industry, PublicProduct, PublicProductDetails } from '@/types/publicProduct';
import { PublicProductService } from '@/services/publicProductService.ts';

const BodyCarePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PublicProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Filter options
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Array<{ 
    id: string; 
    name: string; 
    description: string; 
    industry: { id: string; name: string; }; 
    productCount: number; 
  }>>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts();
    fetchAllCategories();
  }, [pagination.page]);

  // Extract filter options when products change
  useEffect(() => {
    if (products.length > 0) {
      setCategories(PublicProductService.extractCategories(products));
      setIndustries(PublicProductService.extractIndustries(products));
      const locations = PublicProductService.extractLocations(products);
      setCities(locations.cities);
      setStates(locations.states);
    }
  }, [products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await PublicProductService.searchProducts({
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        categoryName: selectedCategoryName || undefined,
        industryId: selectedIndustry || undefined,
        city: selectedCity || undefined,
        state: selectedState || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        itemType: 'product', // Default to products for body care
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined
      });

      if (response.success) {
        setProducts(response.data.items);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        });
      } else {
        setError(response.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error('Error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await PublicProductService.getAllCategories();
      if (response.success) {
        setAllCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSearchByCode = async (platformCode: string) => {
    try {
      setLoadingDetails(true);
      setError(null);
      const response = await PublicProductService.getProductByCode(platformCode);
      
      if (response.success) {
        setSelectedProduct(response.data);
      } else {
        setError(response.message || 'Product not found with this platform code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product by code');
      console.error('Error fetching product by code:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = async (product: PublicProduct) => {
    try {
      setLoadingDetails(true);
      setError(null);
      const response = await PublicProductService.getProductDetails(product.id);
      
      if (response.success) {
        setSelectedProduct(response.data);
      } else {
        setError(response.message || 'Failed to fetch product details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product details');
      console.error('Error fetching product details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const addToCart = (product: PublicProductDetails) => {
    const cartData = {
      productId: product.product.id,
      name: product.product.name,
      price: product.product.pricing.discountedPrice,
      upfrontPayment: product.product.pricing.upfrontPaymentAmount,
      timestamp: Date.now()
    };
    localStorage.setItem('selectedProduct', JSON.stringify(cartData));
    router.push('/user/add-to-cart');
  };

  const bookAppointment = (product: PublicProductDetails) => {
    localStorage.setItem('appointmentProduct', JSON.stringify(product));
    router.push('/user/book-appointment');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCategoryName('');
    setSelectedIndustry('');
    setSelectedCity('');
    setSelectedState('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination({ ...pagination, page: 1 });
    fetchProducts();
  };

  const formatCurrency = PublicProductService.formatNaira;

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

            {loadingDetails ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b]"></div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{selectedProduct.product.name}</h1>
                      <p className="text-[#d0c4da] flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedProduct.product.location.address}
                      </p>
                    </div>
                    {selectedProduct.product.location.verified && (
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
                      {selectedProduct.product.images.main ? (
                        <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                          <img 
                            src={selectedProduct.product.images.main} 
                            alt={selectedProduct.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center">
                            <Package className="w-16 h-16 text-[#5d2a8b]" />
                          </div>
                        </div>
                      )}
                      
                      {/* Product Gallery Thumbnails */}
                      {selectedProduct.product.images.all.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.product.images.all.slice(0, 3).map((img: string, index: number) => (
                            <div key={index} className="h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden">
                              <img 
                                src={img} 
                                alt={`${selectedProduct.product.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Details Card */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Original Price</p>
                            <p className="text-lg font-bold text-gray-500 line-through">
                              {formatCurrency(selectedProduct.product.pricing.originalPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Discounted Price</p>
                            <p className="text-2xl font-bold text-[#5d2a8b]">
                              {formatCurrency(selectedProduct.product.pricing.discountedPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">You Save</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(Math.abs(selectedProduct.product.pricing.youSave))}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Discount</p>
                            <p className="text-lg font-bold text-orange-600">
                              {selectedProduct.product.pricing.discount}%
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Category</p>
                            <p className="font-semibold">{selectedProduct.product.productInfo.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Industry</p>
                            <p className="font-semibold">{selectedProduct.product.productInfo.industry}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Available Quantity</p>
                            <p className="font-semibold">{selectedProduct.product.productInfo.availableQuantity} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Platform Code</p>
                            <p className="font-mono text-xs">{selectedProduct.product.productInfo.platformUniqueCode}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
                          <p className="text-gray-700">{selectedProduct.product.description}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Ingredients/Formulas</p>
                          <p className="text-gray-700">{selectedProduct.product.ingredients}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-2">Payment Methods</p>
                          <p className="text-gray-700">{selectedProduct.product.paymentMethods}</p>
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
                        <p className="font-semibold text-lg">{selectedProduct.serviceProvider.producer}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Contact</p>
                        <div className="space-y-2">
                          <p className="text-gray-700 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                            {selectedProduct.serviceProvider.contact.phone}
                          </p>
                          <p className="text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                            {selectedProduct.serviceProvider.contact.email}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Availability</p>
                        <div className="space-y-2">
                          <p className="text-gray-700 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                            {selectedProduct.serviceProvider.availability.hours}
                          </p>
                          <p className="text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                            {selectedProduct.serviceProvider.availability.days}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Different Locations Card */}
                  <div className="bg-gray-50 p-6 rounded-lg mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Service Locations</h2>
                    
                    <div className="space-y-4">
                      {selectedProduct.serviceLocations.map((location: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; subtitle: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; fee: any; address: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lga: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; state: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; country: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; verified: any; }, index: Key | null | undefined) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{location.title}</h3>
                              <p className="text-sm text-gray-600">{location.subtitle}</p>
                            </div>
                            <span className="bg-[#5d2a8b]/10 text-[#5d2a8b] text-xs px-2 py-1 rounded-full">
                              Fee: {formatCurrency(location.fee)}
                            </span>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-[#5d2a8b]" />
                              <span>{location.address}</span>
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
                          
                          {location.verified && (
                            <div className="mt-2 flex items-center text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Location
                            </div>
                          )}
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
            )}
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

          {/* Quick Platform Code Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-purple-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
             
              Quick Search by Platform Code
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter platform unique code (e.g., ORG1766704354663-005-008)"
                className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSearchByCode(e.currentTarget.value.trim());
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input');
                  if (input && input.value.trim()) {
                    handleSearchByCode(input.value.trim());
                  }
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Code
              </button>
            </div>
           
          </div>

          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-6 mb-8 border-2 border-[#5d2a8b]">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5d2a8b] w-6 h-6" />
              <input
                type="text"
                placeholder="Search by name, platform code, SKU, UPC, or description..."
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Category Filter (ID) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <select
                  className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={selectedCategoryName}
                  onChange={(e) => setSelectedCategoryName(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {allCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name} - {category.industry.name} 
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  className="w-full px-4 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b]"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>{industry.name}</option>
                  ))}
                </select>
              </div>

              {/* Location Filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Sorting */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt">Newest</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="discount">Discount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    className="w-full px-3 py-3 border border-[#5d2a8b] rounded-lg focus:ring-2 focus:ring-[#5d2a8b] focus:border-[#5d2a8b] text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit"
                className="flex-1 bg-[#5d2a8b] text-white py-3 rounded-lg hover:bg-[#7a3aa3] transition-colors font-semibold flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Products
              </button>
              <button 
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#5d2a8b]">{products.length}</span> of{' '}
              <span className="font-semibold">{pagination.total}</span> products
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="w-4 h-4 mr-1" />
              Sorted by {sortBy === 'createdAt' ? 'newest' : sortBy} ({sortOrder === 'desc' ? 'desc' : 'asc'})
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-[#5d2a8b] hover:border-[#7a3aa3]">
                    {/* Product Image */}
                    <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center relative">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
                          <Package className="w-8 h-8 text-[#5d2a8b]" />
                        </div>
                      )}
                      {product.location?.verified && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center font-semibold z-10">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#5d2a8b] text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.categoryName}
                      </div>
                      {product.discount > 0 && (
                        <div className="absolute top-12 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      
                      {/* Pricing */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                          <span className="text-lg font-bold text-[#5d2a8b]">
                            {formatCurrency(product.discountedPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-600">
                            Save {formatCurrency(Math.abs(product.youSave))}
                          </span>
                          <span className="text-sm font-semibold text-gray-600">
                            {product.availableQuantity} left
                          </span>
                        </div>
                      </div>
                      
                      {/* Producer */}
                      <p className="text-sm text-[#5d2a8b] font-medium mb-2">{product.businessName}</p>
                      
                      {/* Location */}
                      {product.location && (
                        <p className="text-xs text-gray-500 mb-3 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {product.location.city}, {product.location.state}
                        </p>
                      )}
                      
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className={`px-4 py-2 border rounded-lg ${
                      pagination.page === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[#5d2a8b] text-[#5d2a8b] hover:bg-[#5d2a8b] hover:text-white'
                    } transition-colors`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum = pagination.page;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination({ ...pagination, page: pageNum })}
                        className={`px-4 py-2 border rounded-lg ${
                          pagination.page === pageNum
                            ? 'bg-[#5d2a8b] text-white border-[#5d2a8b]'
                            : 'border-[#5d2a8b] text-[#5d2a8b] hover:bg-[#5d2a8b] hover:text-white'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-4 py-2 border rounded-lg ${
                      pagination.page === pagination.totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-[#5d2a8b] text-[#5d2a8b] hover:bg-[#5d2a8b] hover:text-white'
                    } transition-colors`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {products.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium"
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