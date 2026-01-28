"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Heart, CheckCircle, Clock, Phone, Mail, Calendar, Scissors, Dumbbell, Bath, Shirt } from 'lucide-react';
import { useAuth } from '@/api/hooks/useAuth';

const BodyCarePage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for body care services
  const mockServices = [
    {
      id: 1,
      brandName: 'Favours Internal Salon',
      category: 'Salon',
      address: '1, Governor\'s House, Portharcourt',
      rating: 4.8,
      verified: true,
      description: 'Premium salon services with experienced stylists',
      icon: <Scissors className="w-8 h-8 text-purple-600" />,
      innerPictures: [
        '/placeholder-inner1.jpg',
        '/placeholder-inner2.jpg',
        '/placeholder-inner3.jpg',
        '/placeholder-inner4.jpg'
      ],
      productGallery: [
        {
          id: 1,
          name: 'Hair Styling Package',
          description: 'Complete hair styling and treatment service',
          price: '₦25,000',
          discountedPrice: '₦20,000',
          category: 'Hair Care',
          ingredients: 'Premium hair products, organic oils, conditioning treatments',
          modeOfPayment: 'Cash, Card, Transfer'
        },
        {
          id: 2,
          name: 'Manicure & Pedicure',
          description: 'Professional nail care service',
          price: '₦15,000',
          discountedPrice: '₦12,000',
          category: 'Nail Care',
          ingredients: 'Quality nail polish, cuticle care, moisturizers',
          modeOfPayment: 'Cash, Card, Transfer'
        }
      ],
      availability: {
        openingTime: '8:00 AM - 7:00 PM',
        workingDays: 'Monday - Saturday'
      },
      contact: {
        phone: '+234 803 123 4567',
        email: 'favours@salon.com'
      }
    },
    {
      id: 2,
      brandName: 'Elite Fitness Gym',
      category: 'Gym',
      address: '15, Trans Amadi Industrial Layout, Portharcourt',
      rating: 4.6,
      verified: true,
      description: 'Modern gym with state-of-the-art equipment',
      icon: <Dumbbell className="w-8 h-8 text-purple-600" />,
      innerPictures: [
        '/placeholder-gym1.jpg',
        '/placeholder-gym2.jpg',
        '/placeholder-gym3.jpg'
      ],
      productGallery: [
        {
          id: 1,
          name: 'Monthly Membership',
          description: 'Full access to all gym facilities',
          price: '₦30,000',
          discountedPrice: '₦25,000',
          category: 'Membership',
          ingredients: 'Access to gym equipment, trainer consultation, locker',
          modeOfPayment: 'Card, Transfer'
        }
      ],
      availability: {
        openingTime: '5:00 AM - 10:00 PM',
        workingDays: 'Monday - Sunday'
      },
      contact: {
        phone: '+234 803 234 5678',
        email: 'info@elitefitness.com'
      }
    },
    {
      id: 3,
      brandName: 'Luxury Spa & Wellness',
      category: 'Spa',
      address: '22, Aba Road, Portharcourt',
      rating: 4.9,
      verified: true,
      description: 'Relaxing spa treatments and wellness services',
      icon: <Bath className="w-8 h-8 text-purple-600" />,
      innerPictures: [
        '/placeholder-spa1.jpg',
        '/placeholder-spa2.jpg',
        '/placeholder-spa3.jpg',
        '/placeholder-spa4.jpg'
      ],
      productGallery: [
        {
          id: 1,
          name: 'Full Body Massage',
          description: 'Relaxing therapeutic massage session',
          price: '₦40,000',
          discountedPrice: '₦35,000',
          category: 'Massage',
          ingredients: 'Essential oils, aromatherapy, hot stones',
          modeOfPayment: 'Cash, Card, Transfer'
        }
      ],
      availability: {
        openingTime: '9:00 AM - 8:00 PM',
        workingDays: 'Monday - Saturday'
      },
      contact: {
        phone: '+234 803 345 6789',
        email: 'contact@luxuryspa.com'
      }
    },
    {
      id: 4,
      brandName: 'Couture Fashion Design',
      category: 'Fashion Designer',
      address: '8, Rumuola Road, Portharcourt',
      rating: 4.7,
      verified: false,
      description: 'Custom fashion design and tailoring services',
      icon: <Shirt className="w-8 h-8 text-purple-600" />,
      innerPictures: [
        '/placeholder-fashion1.jpg',
        '/placeholder-fashion2.jpg'
      ],
      productGallery: [
        {
          id: 1,
          name: 'Custom Dress Design',
          description: 'Bespoke dress design and tailoring',
          price: '₦50,000',
          discountedPrice: '₦45,000',
          category: 'Fashion',
          ingredients: 'Premium fabrics, custom fittings, embellishments',
          modeOfPayment: 'Cash, Transfer (50% deposit required)'
        }
      ],
      availability: {
        openingTime: '10:00 AM - 6:00 PM',
        workingDays: 'Tuesday - Saturday'
      },
      contact: {
        phone: '+234 803 456 7890',
        email: 'info@couturefashion.com'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    'All Categories',
    'Gym',
    'Spa',
    'Fashion Designer',
    'Salon'
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || service.category === selectedCategory;
    const matchesVerification = selectedVerification === '' || 
                               (selectedVerification === 'Verified' && service.verified) || 
                               (selectedVerification === 'Unverified' && !service.verified);
    
    return matchesSearch && matchesCategory && matchesVerification;
  });

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  if (selectedService) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={handleBack}
              className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              ← Back to Services
            </button>

            {/* Service Provider Profile */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {/* Header with verification */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedService.brandName}</h1>
                    <p className="text-purple-100 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedService.address}
                    </p>
                  </div>
                  {selectedService.verified && (
                    <div className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              {/* Building Picture */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Service Category</h2>
                <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center">
                    {selectedService.icon}
                  </div>
                </div>

                {/* Service Highlights */}
                <h2 className="text-xl font-semibold mb-4">Service Highlights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {selectedService.productGallery.slice(0, 4).map((product: any, index: number) => (
                    <div key={index} className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-2">
                          {selectedService.icon}
                        </div>
                        <p className="text-xs font-medium text-gray-700 truncate">{product.name}</p>
                        <p className="text-xs text-purple-600 font-bold">{product.discountedPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Availability & Opening Time */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h2 className="text-xl font-semibold mb-4">Availability & Opening Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Opening Hours</p>
                        <p className="font-semibold">{selectedService.availability.openingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Working Days</p>
                        <p className="font-semibold">{selectedService.availability.workingDays}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{selectedService.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{selectedService.contact.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products/Service Gallery */}
                <h2 className="text-xl font-semibold mb-4">Products/Service Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selectedService.productGallery.map((product: any) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-3">{product.name}</h3>
                      
                      {/* Product Details */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Description:</p>
                          <p className="text-gray-800">{product.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Price:</p>
                            <p className="text-gray-500 line-through">{product.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Discounted Price:</p>
                            <p className="text-2xl font-bold text-purple-600">{product.discountedPrice}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Ingredients/Formulas:</p>
                          <p className="text-gray-800">{product.ingredients}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Mode of Payment:</p>
                          <p className="text-gray-800">{product.modeOfPayment}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Category:</p>
                          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Book Now Button */}
                <div className="flex justify-center">
                  <button className="bg-purple-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                    Book Now
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
            Find trusted body care service provider near you
          </h1>
          <p className="text-gray-600 text-lg">Discover quality services in your area</p>
        </div>

        {/* Main Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Gym, Spa, Fashion designer, salon"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Search
              </button>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Badge</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
              >
                <option value="">All</option>
                <option value="Verified">Verified Only</option>
                <option value="Unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredServices.length}</span> service providers
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
                    {service.icon}
                  </div>
                  {service.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center font-semibold">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.brandName}</h3>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  
                  {/* Pricing Information */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Starting from</span>
                      <span className="text-lg font-bold text-purple-600">
                        {service.productGallery[0]?.discountedPrice || '₦20,000'}
                      </span>
                    </div>
                    {service.productGallery[0]?.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 line-through">
                          {service.productGallery[0]?.price}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Save {(() => {
                            const discounted = parseInt(service.productGallery[0].discountedPrice.replace(/[^0-9]/g, ''));
                            const original = parseInt(service.productGallery[0].price.replace(/[^0-9]/g, ''));
                            return Math.round((1 - (discounted / original)) * 100);
                          })()}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-purple-600 font-medium mb-3">{service.category}</p>
                  <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-start text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{service.address}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleViewDetails(service)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No service providers found matching your criteria</p>
            <button 
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedVerification('');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default BodyCarePage;