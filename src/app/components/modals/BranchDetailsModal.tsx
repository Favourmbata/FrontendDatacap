import React, { useState } from 'react';
import { X, Plus, User, MapPin, Mail, Phone, Home, Building2, Map, Users } from 'lucide-react';
import { VerifiedSubscription, Branch } from '@/services/VerifiedSubscriptionService';

interface BranchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: VerifiedSubscription | null;
}

const BranchDetailsModal: React.FC<BranchDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  subscription 
}) => {
  const [branches, setBranches] = useState<Branch[]>(subscription?.branches || []);
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({
    branchName: '',
    houseNumber: '',
    streetName: '',
    cityRegion: '',
    typeOfBuilding: '',
    lga: '',
    state: '',
    country: '',
    personName: '',
    position: '',
    emailAddress: '',
    phoneNumber: '',
  });
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  if (!isOpen || !subscription) return null;

  const handleAddBranch = () => {
    if (!newBranch.branchName || !newBranch.streetName || !newBranch.lga || !newBranch.state || !newBranch.country) {
      alert('Please fill in all required fields');
      return;
    }

    const branchToAdd: Branch = {
      id: `br_${Date.now()}`,
      branchName: newBranch.branchName || '',
      houseNumber: newBranch.houseNumber || '',
      streetName: newBranch.streetName || '',
      cityRegion: newBranch.cityRegion || '',
      typeOfBuilding: newBranch.typeOfBuilding,
      lga: newBranch.lga || '',
      state: newBranch.state || '',
      country: newBranch.country || '',
      personName: newBranch.personName,
      position: newBranch.position || '',
      emailAddress: newBranch.emailAddress || '',
      phoneNumber: newBranch.phoneNumber || '',
      createdAt: new Date().toISOString(),
    };

    setBranches([...branches, branchToAdd]);
    setNewBranch({
      branchName: '',
      houseNumber: '',
      streetName: '',
      cityRegion: '',
      typeOfBuilding: '',
      lga: '',
      state: '',
      country: '',
      personName: '',
      position: '',
      emailAddress: '',
      phoneNumber: '',
    });
    setIsAddingBranch(false);
  };

  const handleSave = () => {
    // Here you would typically save the updated branches to the backend
    console.log('Updated branches:', branches);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Branch Details for {subscription.organizationName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Headquarters Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{subscription.headquartersLocation}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Map className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{subscription.address}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Home className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{subscription.city}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">LGA</p>
                    <p className="font-medium">{subscription.lga}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Map className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{subscription.state}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Map className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{subscription.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Branches</h3>
              <button
                onClick={() => setIsAddingBranch(!isAddingBranch)}
                className="flex items-center gap-2 px-4 py-2 bg-[#5D2A8B] text-white rounded-md hover:bg-[#4a216e]"
              >
                <Plus className="w-4 h-4" />
                Add Branch
              </button>
            </div>

            {isAddingBranch && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Add New Branch</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                    <input
                      type="text"
                      value={newBranch.branchName}
                      onChange={(e) => setNewBranch({...newBranch, branchName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
                    <input
                      type="text"
                      value={newBranch.houseNumber}
                      onChange={(e) => setNewBranch({...newBranch, houseNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter house number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Name *</label>
                    <input
                      type="text"
                      value={newBranch.streetName}
                      onChange={(e) => setNewBranch({...newBranch, streetName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter street name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City's Region</label>
                    <input
                      type="text"
                      value={newBranch.cityRegion}
                      onChange={(e) => setNewBranch({...newBranch, cityRegion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter city's region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type of Building</label>
                    <input
                      type="text"
                      value={newBranch.typeOfBuilding}
                      onChange={(e) => setNewBranch({...newBranch, typeOfBuilding: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter type of building"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LGA *</label>
                    <input
                      type="text"
                      value={newBranch.lga}
                      onChange={(e) => setNewBranch({...newBranch, lga: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter LGA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={newBranch.state}
                      onChange={(e) => setNewBranch({...newBranch, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <input
                      type="text"
                      value={newBranch.country}
                      onChange={(e) => setNewBranch({...newBranch, country: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Person's Name</label>
                    <input
                      type="text"
                      value={newBranch.personName}
                      onChange={(e) => setNewBranch({...newBranch, personName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter person's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      value={newBranch.position}
                      onChange={(e) => setNewBranch({...newBranch, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={newBranch.emailAddress}
                      onChange={(e) => setNewBranch({...newBranch, emailAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      value={newBranch.phoneNumber}
                      onChange={(e) => setNewBranch({...newBranch, phoneNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsAddingBranch(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBranch}
                    className="px-4 py-2 bg-[#5D2A8B] text-white rounded-md"
                  >
                    Add Branch
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div key={branch.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">Branch {index + 1}: {branch.branchName}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <Home className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">House No.</p>
                        <p className="text-sm">{branch.houseNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Map className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Street</p>
                        <p className="text-sm">{branch.streetName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Map className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">City's Region</p>
                        <p className="text-sm">{branch.cityRegion || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Building Type</p>
                        <p className="text-sm">{branch.typeOfBuilding || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">LGA</p>
                        <p className="text-sm">{branch.lga}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Map className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">State</p>
                        <p className="text-sm">{branch.state}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Map className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Country</p>
                        <p className="text-sm">{branch.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Contact Name</p>
                        <p className="text-sm">{branch.personName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Position</p>
                        <p className="text-sm">{branch.position}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm">{branch.emailAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm">{branch.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#5D2A8B] text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailsModal;