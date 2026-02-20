"use client"

import React, { useState } from 'react'

import { SubService, INITIAL_SUB_SERVICE } from '@/types/sub-service'
import { SubServiceForm } from '@/app/components/sub-service';

const SubServicePage = () => {
  const [subServices, setSubServices] = useState<SubService[]>([
    { ...INITIAL_SUB_SERVICE, id: '1' }
  ]);

  const handleSubServiceChange = (index: number, field: keyof SubService, value: any) => {
    setSubServices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSubService = () => {
    setSubServices(prev => [
      ...prev,
      { 
        ...INITIAL_SUB_SERVICE, 
        id: String(prev.length + 1) 
      }
    ]);
  };

  const removeSubService = (index: number) => {
    setSubServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sub-services:', subServices);
    alert('Sub-services saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sub-service Management</h1>
        <p className="text-gray-600 mb-8">Create and manage your sub-services</p>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
              <h2 className="text-xl font-semibold">Sub-services</h2>
              <button
                type="button"
                onClick={addSubService}
                className="px-3 py-1.5 bg-[#5d2a8b] text-white rounded-md text-sm hover:bg-[#4a2170] transition-colors"
              >
                + Add Sub-service
              </button>
            </div>
            
            {subServices.length === 0 ? (
              <div className="bg-purple-50 text-[#5d2a8b] px-4 py-3 rounded-md">
                No sub-services configured. Click "Add Sub-service" to create one.
              </div>
            ) : (
              subServices.map((subService, index) => (
                <SubServiceForm
                  key={subService.id}
                  index={index}
                  subService={subService}
                  onChange={handleSubServiceChange}
                  onRemove={() => removeSubService(index)}
                  showRemove={subServices.length > 1}
                />
              ))
            )}
          </div>

        
        </form>

       
        {subServices.some(s => s.name || s.description || s.price) && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
              Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subServices.map((sub, index) => (
                <div key={sub.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    
                    <h3 className="font-semibold text-gray-700">
                      {sub.name || `Sub-service ${index + 1}`}
                    </h3>
                  </div>
                  {sub.description && (
                    <p className="text-sm text-gray-600 mt-1">{sub.description}</p>
                  )}
                  {sub.price && (
                    <p className="text-sm font-medium mt-2">Price: ${sub.price}</p>
                  )}
                  {sub.subPlatformUniqueCode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Code: {sub.subPlatformUniqueCode}
                    </p>
                  )}
                  {sub.picture && (
                    <p className="text-xs text-gray-500 mt-1">
                      Image: {sub.picture.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubServicePage