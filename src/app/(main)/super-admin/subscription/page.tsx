"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Edit, Trash2, MoreVertical, Filter } from 'lucide-react';
import SubscriptionService, { SubscriptionPackage } from "@/services/subscriptionService";

const SubscriptionPage = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionPackage[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<SubscriptionPackage | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch data from the API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { packages } = await SubscriptionService.getSubscriptionPackages();
        setSubscriptions(packages);
        setFilteredSubscriptions(packages);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, []);

  // Filter subscriptions when search term or status filter changes
  useEffect(() => {
    if (searchTerm.trim() === '' && statusFilter === 'all') {
      setFilteredSubscriptions(subscriptions);
    } else {
      let filtered = subscriptions;
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(subscription =>
          subscription.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (subscription.features && subscription.features.some(feature => 
            feature.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(subscription => 
          subscription.status === statusFilter
        );
      }
      
      setFilteredSubscriptions(filtered);
    }
  }, [searchTerm, subscriptions, statusFilter]);

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

  const getPackageId = (subscription: SubscriptionPackage): string => {
    return subscription._id || subscription.id || '';
  };

  const handleView = (subscription: SubscriptionPackage) => {
    setDropdownOpen(null);
    const id = getPackageId(subscription);
    if (id) {
      router.push(`/super-admin/subscription/view/${id}`);
    }
  };

  const handleEdit = (subscription: SubscriptionPackage) => {
    setDropdownOpen(null);
    const id = getPackageId(subscription);
    if (id) {
      router.push(`/super-admin/subscription/edit/${id}`);
    }
  };

  const handleDeleteClick = (subscription: SubscriptionPackage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDropdownOpen(null);
    setSubscriptionToDelete(subscription);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!subscriptionToDelete) return;
    
    try {
      setIsDeleting(true);
      const id = getPackageId(subscriptionToDelete);
      if (!id) {
        throw new Error('No ID found for subscription');
      }
      await SubscriptionService.deleteSubscriptionPackage(id);
      
      // Remove from state
      setSubscriptions(subscriptions.filter(sub => getPackageId(sub) !== id));
      setFilteredSubscriptions(filteredSubscriptions.filter(sub => getPackageId(sub) !== id));
      
      setDeleteMessage('Subscription deleted successfully!');
      
      setTimeout(() => {
        setDeleteMessage('');
        setShowDeleteModal(false);
        setSubscriptionToDelete(null);
      }, 2000);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setDeleteMessage('Failed to delete subscription package');
      setTimeout(() => setDeleteMessage(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSubscriptionToDelete(null);
  };

  const handleStatusToggle = async (subscription: SubscriptionPackage) => {
    try {
      const newStatus: 'active' | 'inactive' = subscription.status === 'active' ? 'inactive' : 'active';
      const id = getPackageId(subscription);
      if (!id) return;
      
      await SubscriptionService.updateSubscriptionStatus(id, newStatus);
      
      // Update local state with properly typed status
      const updatedSubscription: SubscriptionPackage = {
        ...subscription,
        status: newStatus
      };
      
      setSubscriptions(subscriptions.map(sub => 
        getPackageId(sub) === id ? updatedSubscription : sub
      ));
      
      setFilteredSubscriptions(filteredSubscriptions.map(sub => 
        getPackageId(sub) === id ? updatedSubscription : sub
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (subscription: SubscriptionPackage) => {
    const isActive = subscription.status === 'active';
    return (
      <button
        onClick={() => handleStatusToggle(subscription)}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
          isActive 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        }`}
      >
        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
      </button>
    );
  };

  // Calculate statistics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const inactiveSubscriptions = subscriptions.filter(s => s.status === 'inactive').length;
  const totalFeatures = subscriptions.reduce((acc, sub) => acc + (sub.features?.length || 0), 0);

  if (loading) {
    return (
      <div className="manrope ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen bg-gray-50">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Subscription Package Management</h1>
            <p className="text-gray-600">Manage subscription packages</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Subscription Package Management</h1>
            <p className="text-gray-600">Manage subscription packages</p>
          </div>
                
          {/* Add Package Button */}
          <button 
            className="flex items-center justify-center bg-[#5D2A8B] text-white px-4 py-2.5 rounded-lg hover:bg-[#4a216d] transition-colors whitespace-nowrap"
            onClick={() => router.push('/super-admin/subscription/create')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Subscription Package
          </button>
        </div>

      

        {/* Search & Filters Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D2A8B] focus:border-[#5D2A8B]"
                  placeholder="Search packages by title, description, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
           
            
          </div>
          
          {/* Search results info */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredSubscriptions.length} of {subscriptions.length} packages
              {searchTerm && (
                <span className="ml-2">
                  for "<span className="font-medium">{searchTerm}</span>"
                </span>
              )}
            </div>
            
            {/* Export Button */}
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => SubscriptionService.exportSubscriptionPackages('csv')}
                className="text-sm text-[#5D2A8B] hover:text-[#4a216d] hover:underline"
              >
                Export CSV
              </button>
            </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Features</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created Date</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription) => {
                    const subscriptionId = getPackageId(subscription);
                    return (
                      <tr key={subscriptionId} className="border-t border-gray-100 hover:bg-gray-50 group">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{subscription.title}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600 max-w-xs truncate" title={subscription.description}>
                            {subscription.description}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-700 max-w-xs truncate" title={subscription.features?.join(', ')}>
                            {subscription.features?.slice(0, 2).join(', ')}
                            {subscription.features && subscription.features.length > 2 && (
                              <span className="text-gray-500 ml-1">+{subscription.features.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-700 font-medium">
                            {formatCurrency(subscription.price)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(subscription)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(subscription.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="relative">
                            <button 
                              onClick={(e) => toggleDropdown(subscriptionId, e)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors group-hover:bg-gray-100"
                              title="Actions"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                            
                            {dropdownOpen === subscriptionId && (
                              <div 
                                ref={(el) => {
                                  dropdownRefs.current[subscriptionId] = el;
                                }}
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                              >
                                <button 
                                  onClick={() => handleView(subscription)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-100"
                                >
                                  <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                  View Details
                                </button>
                                <button 
                                  onClick={() => handleEdit(subscription)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2 text-yellow-600" />
                                  Edit
                                </button>
                                {/* Removed Deactivate/Activate from dropdown */}
                                <button 
                                  onClick={(e) => handleDeleteClick(subscription, e)}
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center text-gray-500">
                      {searchTerm || statusFilter !== 'all' ? (
                        <div className="flex flex-col items-center">
                          <Search className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-600">No subscription packages found</p>
                          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                            }}
                            className="text-[#5D2A8B] hover:text-[#4a216d] hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-600">No subscription packages yet</p>
                          <p className="text-gray-500 mb-6">Get started by creating your first subscription package</p>
                          <button 
                            className="flex items-center justify-center bg-[#5D2A8B] text-white px-6 py-3 rounded-lg hover:bg-[#4a216d] transition-colors"
                            onClick={() => router.push('/super-admin/subscription/create')}
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Create First Package
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal - No Background */}
      {showDeleteModal && subscriptionToDelete && (
        <div 
          className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{subscriptionToDelete.title}"</span>? This action cannot be undone.
              </p>
              
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Deleting this package will remove it permanently. Any subscribers to this package may be affected.
                </p>
              </div>
              
              {deleteMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  deleteMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {deleteMessage}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Package'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;