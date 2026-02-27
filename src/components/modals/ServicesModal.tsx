import React from 'react';
import { X, Calendar, Package } from 'lucide-react';

interface Service {
  serviceId: string;
  serviceName: string;
  duration: string;
  _id?: string;
}

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  packageTitle: string;
}

const ServicesModal: React.FC<ServicesModalProps> = ({ 
  isOpen, 
  onClose, 
  services, 
  packageTitle 
}) => {
  if (!isOpen) return null;

  const getServiceDurationBadge = (duration: string) => {
    const durationColors: Record<string, string> = {
      'monthly': 'bg-blue-100 text-blue-800',
      'quarterly': 'bg-purple-100 text-purple-800',
      'yearly': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${durationColors[duration] || 'bg-gray-100 text-gray-800'}`}>
        {duration}
      </span>
    );
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Package Services</h2>
              <p className="text-sm text-gray-500">Services included in {packageTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {services && services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service, index) => (
                <div 
                  key={service._id || index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Package className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{service.serviceName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500">Service ID: {service.serviceId}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getServiceDurationBadge(service.duration)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No services found</p>
              <p className="text-sm text-gray-400 mt-1">This package doesn't include any services</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Total services: <span className="font-medium text-gray-700">{services?.length || 0}</span>
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;