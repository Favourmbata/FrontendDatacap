import React from 'react';
import { Customer } from '../modules/super-admin/user/userModule';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: string;
  customer: Customer | null;
}

const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionType, 
  customer 
}) => {
  if (!isOpen || !customer) return null;

  const getActionTitle = () => {
    switch (actionType) {
      case 'status':
        return customer.status === 'active' ? 'Suspend Customer' : 'Activate Customer';
      case 'reset-password':
        return 'Reset Customer Password';
      case 'view':
        return 'View Customer Details';
      case 'edit':
        return 'Edit Customer';
      default:
        return 'Action';
    }
  };

  const getActionMessage = () => {
    switch (actionType) {
      case 'status':
        return customer.status === 'active' 
          ? `Are you sure you want to suspend ${customer.customerName}?` 
          : `Are you sure you want to activate ${customer.customerName}?`;
      case 'reset-password':
        return `Are you sure you want to reset the password for ${customer.customerName}? A new password will be generated and sent to their email.`;
      case 'view':
        return `Customer Details for ${customer.customerName}`;
      case 'edit':
        return `Edit details for ${customer.customerName}`;
      default:
        return 'Are you sure you want to perform this action?';
    }
  };

  const isViewOrEdit = actionType === 'view' || actionType === 'edit';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{getActionTitle()}</h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-4">{getActionMessage()}</p>
          
          {isViewOrEdit && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{customer.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                  <p className="mt-1 text-sm text-gray-900">{customer.customerId}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{customer.phoneNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-sm text-gray-900">{customer.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LGA</label>
                  <p className="mt-1 text-sm text-gray-900">{customer.lga}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{customer.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <p className="mt-1 text-sm text-gray-900">{customer.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{customer.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(customer.accountCreatedOn).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          {!isViewOrEdit && (
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onConfirm}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;