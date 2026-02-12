"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import ServiceService from '@/services/ServiceService';
import { useAuthContext } from '@/AuthContext';

interface Service {
  id: string;
  serviceName: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const ServicePage = () => {
  const router = useRouter();
  const { token } = useAuthContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const serviceService = new ServiceService(token);
        const servicesData = await serviceService.getAllServices();
        
        // Ensure servicesData is an array
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          console.error('Expected servicesData to be an array but got:', servicesData);
          setServices([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownOpen(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleCreateNew = () => {
    router.push('/super-admin/service/create');
  };

  const handleViewDetails = (id: string) => {
    setDropdownOpen(null);
    router.push(`/super-admin/service/${id}`);
  };

  const handleEdit = (id: string) => {
    setDropdownOpen(null);
    router.push(`/super-admin/service/${id}/edit`);
  };

  const handleDeleteClick = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDropdownOpen(null);
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        const serviceService = new ServiceService(token);
        await serviceService.deleteService(serviceToDelete);
        
        // Update the local state to reflect the deletion
        setServices(services.filter(service => service.id !== serviceToDelete));
        setServiceToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Error deleting service:', error);
        // Optionally show an error message to the user
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const cancelDelete = () => {
    setServiceToDelete(null);
    setShowDeleteModal(false);
  };

  const handleStatusChange = async (id: string) => {
    try {
      const serviceService = new ServiceService(token);
      const currentService = services.find(service => service.id === id);
      
      if (!currentService) {
        console.error('Service not found');
        return;
      }
      
      // Toggle the status locally first for immediate UI update
      const updatedServices = services.map(service => 
        service.id === id 
          ? { 
              ...service, 
              status: service.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive'
            } 
          : service
      );
      setServices(updatedServices);
      
      // Update the service on the backend
      const updateData = {
        serviceName: currentService.serviceName,
        monthlyPrice: currentService.monthlyPrice,
        quarterlyPrice: currentService.quarterlyPrice,
        yearlyPrice: currentService.yearlyPrice,
      };
      
      await serviceService.updateService(id, updateData);
    } catch (error) {
      console.error('Error updating service status:', error);
      // Revert the status change in case of error
      setServices(services.map(service => 
        service.id === id 
          ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' } 
          : service
      ));
      alert('Failed to update service status. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Management</h1>
            <p className="text-gray-600">Manage platform services and pricing</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="w-full sm:w-auto h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Service Management</h1>
          <p className="text-gray-600">Manage platform services and pricing</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D2A8B]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto px-6 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
          >
            + Create New Service
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
          {/* Delete Confirmation Modal - Overlay on table */}
          {showDeleteModal && serviceToDelete && (
            <div className="absolute inset-0 flex items-center justify-center z-20 rounded-xl">
              <div 
                className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this service? This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly (₦)
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarterly (₦)
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly (₦)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {formatPrice(service.monthlyPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {formatPrice(service.quarterlyPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {formatPrice(service.yearlyPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="relative flex justify-center">
                          <button
                            onClick={(e) => toggleDropdown(service.id, e)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          
                          {dropdownOpen === service.id && (
                            <div 
                              ref={(el) => {
                                dropdownRefs.current[service.id] = el;
                              }}
                              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                            >
                              <button
                                onClick={() => handleViewDetails(service.id)}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-100"
                              >
                                <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(service.id)}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2 text-yellow-600" />
                                Edit
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(service.id, e)}
                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

         
        </div>
      </div>


    </div>
  );
};

export default ServicePage;