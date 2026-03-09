"use client";

import { 
  MapPin, CheckCircle, Clock, Phone, Mail, Calendar, 
  Wrench, Package, Layers, ShoppingCart 
} from 'lucide-react';

interface SubService {
  name: string;
  description: string;
  subPlatformUniqueCode: string;
  uploadPicture: string;
  price: number;
}

interface ExtendedPublicProductDetails {
  product: {
    id: string;
    name: string;
    title: string;
    itemType: 'product' | 'service';
    location: {
      brandName: string;
      address: string;
      verified: boolean;
    };
    images: {
      main: string | null;
      video: string | null;
      all: string[];
      thumbnails: string[];
    };
    pricing: {
      originalPrice: number;
      discountedPrice: number;
      youSave: number;
      discount: number;
      upfrontPaymentPercentage: number;
      upfrontPaymentAmount: number;
    };
    productInfo: {
      category: string;
      industry: string;
      availableQuantity: number;
      sku: string;
      upc: string;
      platformUniqueCode: string;
    };
    description: string;
    ingredients: string;
    paymentMethods: string;
    notes: string;
    subServices?: SubService[];
    subServiceCount?: number;
    hasSubServices?: boolean;
  };
  serviceProvider: {
    producer: string;
    contact: {
      phone: string;
      email: string;
    };
    availability: {
      hours: string;
      days: string;
    };
  };
  serviceLocations: Array<{
    title: string;
    subtitle: string;
    fee: number;
    address: string;
    lga: string;
    state: string;
    country: string;
    verified: boolean;
    gallery: {
      images: string[];
      videos: string[];
    };
  }>;
}

interface ProductDetailsViewProps {
  selectedProduct: ExtendedPublicProductDetails;
  loading: boolean;
  onBack: () => void;
  onSubServiceSelect: (subService: SubService) => void;
  onMakePayment: (product: ExtendedPublicProductDetails, subService?: SubService) => void;
  onBookAppointment: (product: ExtendedPublicProductDetails, subService?: SubService) => void;
  formatCurrency: (amount: number) => string;
}

const ProductDetailsView = ({
  selectedProduct,
  loading,
  onBack,
  onSubServiceSelect,
  onMakePayment,
  onBookAppointment,
  formatCurrency
}: ProductDetailsViewProps) => {
  const subServices = selectedProduct.product.subServices || [];
  const hasSubServices = subServices.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d2a8b]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            ← Back to {selectedProduct?.product?.itemType === 'service' ? 'Services' : 'Products'}
          </button>

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
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                    {selectedProduct.product.images.main ? (
                      <div className="w-full aspect-square flex items-center justify-center p-4">
                        <img 
                          src={selectedProduct.product.images.main} 
                          alt={selectedProduct.product.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                        {selectedProduct?.product?.itemType === 'service' ? (
                          <Wrench className="w-24 h-24 text-gray-300" />
                        ) : (
                          <Package className="w-24 h-24 text-gray-300" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Gallery Thumbnails */}
                  {selectedProduct.product.images.all.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.product.images.all.slice(0, 3).map((img: string, index: number) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square">
                          <img 
                            src={img} 
                            alt={`${selectedProduct.product.name} ${index + 1}`}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedProduct?.product?.itemType === 'service' ? 'Service' : 'Product'} Details
                  </h2>
                  
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
                      {selectedProduct.product.itemType === 'product' && (
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Available Quantity</p>
                          <p className="font-semibold">{selectedProduct.product.productInfo.availableQuantity} units</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Platform Code</p>
                        <p className="font-mono text-xs">{selectedProduct.product.productInfo.platformUniqueCode}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
                      <p className="text-gray-700">{selectedProduct.product.description}</p>
                    </div>

                    {selectedProduct.product.ingredients && selectedProduct.product.ingredients !== 'Not specified' && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-2">Ingredients/Formulas</p>
                        <p className="text-gray-700">{selectedProduct.product.ingredients}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-2">Payment Methods</p>
                      <p className="text-gray-700">{selectedProduct.product.paymentMethods}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Services Section */}
              {selectedProduct.product.itemType === 'service' && hasSubServices && (
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <div className="flex items-center mb-4">
                    <Layers className="w-6 h-6 text-[#5d2a8b] mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Available Sub-Services</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    This service has {subServices.length} sub-services available. Select one to proceed.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subServices.map((subService: SubService, index: number) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#5d2a8b] hover:shadow-md transition-all cursor-pointer"
                        onClick={() => onSubServiceSelect(subService)}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">{subService.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subService.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#5d2a8b]">
                            {formatCurrency(subService.price)}
                          </span>
                          <button className="text-sm bg-[#5d2a8b] text-white px-3 py-1 rounded hover:bg-[#7a3aa3] transition-colors">
                            Select
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-mono">
                          {subService.subPlatformUniqueCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Provider Information */}
              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedProduct?.product?.itemType === 'service' ? 'Service' : 'Product'} Provider Information
                </h2>
                
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

              {/* Locations */}
              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedProduct?.product?.itemType === 'service' ? 'Service' : 'Product'} Locations
                </h2>
                
                <div className="space-y-4">
                  {selectedProduct.serviceLocations.map((location: any, index: number) => (
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
              {(!hasSubServices || selectedProduct.product.itemType === 'product') && (
                <div className="flex justify-center mt-8 space-x-4">
                  <button 
                    onClick={() => onMakePayment(selectedProduct)}
                    className="bg-[#5d2a8b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {selectedProduct?.product?.itemType === 'service' ? 'Book & Pay Service' : 'Make Payment'}
                  </button>
                  <button 
                    onClick={() => onBookAppointment(selectedProduct)}
                    className="border-2 border-[#5d2a8b] text-[#5d2a8b] px-8 py-3 rounded-lg font-semibold hover:bg-[#5d2a8b] hover:text-white transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              )}

              {/* Message for services with sub-services */}
              {selectedProduct.product.itemType === 'service' && hasSubServices && (
                <div className="mt-8 text-center text-gray-600">
                  <p className="mb-2">Please select a sub-service above to proceed with payment or booking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsView;