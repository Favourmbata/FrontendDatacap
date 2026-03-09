"use client";

import { Scissors, ShoppingCart, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import type { ExtendedPublicProductDetails, SubService } from '@/types/BodyCare';

interface SubServiceViewProps {
  selectedSubService: SubService;
  selectedProduct: ExtendedPublicProductDetails;
  onBack: () => void;
  onMakePayment: (product: ExtendedPublicProductDetails, subService: SubService) => void;
  onBookAppointment: (product: ExtendedPublicProductDetails, subService: SubService) => void;
  formatCurrency: (amount: number) => string;
}

const SubServiceView = ({
  selectedSubService,
  selectedProduct,
  onBack,
  onMakePayment,
  onBookAppointment,
  formatCurrency
}: SubServiceViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
         
          <button 
            onClick={onBack}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            ← Back to Service Details
          </button>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-[#5d2a8b]">
           
            <div className="bg-gradient-to-r from-[#5d2a8b] to-[#7a3aa3] p-6 text-white">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedSubService.name}</h1>
                <p className="text-[#d0c4da]">{selectedProduct.product.name} - Sub Service</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  {selectedSubService.uploadPicture ? (
                    <div className="w-full aspect-square flex items-center justify-center p-4">
                      <img 
                        src={selectedSubService.uploadPicture} 
                        alt={selectedSubService.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                      <Scissors className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                </div>

              
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Sub-Service Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Service Name</p>
                      <p className="text-lg font-bold text-gray-900">{selectedSubService.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700">{selectedSubService.description}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-3xl font-bold text-[#5d2a8b]">
                        {formatCurrency(selectedSubService.price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Platform Code</p>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                        {selectedSubService.subPlatformUniqueCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

           
              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Provider Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Provider</p>
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
                </div>
              </div>

        
              <div className="flex justify-center mt-8 space-x-4">
                <button 
                  onClick={() => onMakePayment(selectedProduct, selectedSubService)}
                  className="bg-[#5d2a8b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a3aa3] transition-colors flex items-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Pay for this Service
                </button>
                <button 
                  onClick={() => onBookAppointment(selectedProduct, selectedSubService)}
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
};

export default SubServiceView;