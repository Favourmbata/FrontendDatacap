"use client";

import React from 'react';
import { SubService } from '@/types/sub-service';

interface SubServiceFormProps {
  index: number;
  subService: SubService;
  onChange: (index: number, field: keyof SubService, value: any) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  errors?: Record<string, string>;
}

export const SubServiceForm: React.FC<SubServiceFormProps> = ({
  index,
  subService,
  onChange,
  onRemove,
  showRemove = false,
  errors = {},
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(index, 'picture', file);
  };

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          
          <h4 className="font-semibold text-gray-700">Sub-service {index + 1}</h4>
        </div>
        {showRemove && onRemove && (
          <button 
            type="button" 
            onClick={onRemove}
            className="px-3 py-1.5 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={subService.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.name`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Sub-service name"
          />
          {errors[`subServices.${index}.name`] && (
            <p className="text-red-500 text-xs">{errors[`subServices.${index}.name`]}</p>
          )}
        </div>

       
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            value={subService.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.description`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Sub-service description"
            rows={2}
          />
          {errors[`subServices.${index}.description`] && (
            <p className="text-red-500 text-xs">{errors[`subServices.${index}.description`]}</p>
          )}
        </div>

        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Upload Picture</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`picture-${index}`}
            />
            <label
              htmlFor={`picture-${index}`}
              className="block w-full px-3 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer hover:border-[#5d2a8b] hover:text-[#5d2a8b] transition-colors"
            >
              {subService.picture?.name || 'Choose file'}
            </label>
          </div>
        </div>

        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={subService.price}
            onChange={(e) => onChange(index, 'price', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.price`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors[`subServices.${index}.price`] && (
            <p className="text-red-500 text-xs">{errors[`subServices.${index}.price`]}</p>
          )}
        </div>

        <div className="space-y-1 md:col-span-3">
          <label className="text-sm font-medium text-gray-600">Sub-Platform Unique Code</label>
          <input
            type="text"
            value={subService.subPlatformUniqueCode}
            onChange={(e) => onChange(index, 'subPlatformUniqueCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.subPlatformUniqueCode`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Sub-platform unique code"
          />
          <p className="text-gray-500 text-xs mt-1">
            The sub-platform unique code will act as the main platform unique code.
          </p>
          {errors[`subServices.${index}.subPlatformUniqueCode`] && (
            <p className="text-red-500 text-xs">{errors[`subServices.${index}.subPlatformUniqueCode`]}</p>
          )}
        </div>
      </div>
    </div>
  );
};