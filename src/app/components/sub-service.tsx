"use client";

import React, { useState, useEffect } from 'react';
import { SubService } from '@/types/sub-service';
import Image from 'next/image';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    subService.pictureUrl || null
  );

  useEffect(() => {
    if (subService.picture instanceof File) {
      const url = URL.createObjectURL(subService.picture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (subService.pictureUrl) {
      setPreviewUrl(subService.pictureUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [subService.picture, subService.pictureUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(index, 'picture', file);
  };

  const handleRemoveImage = () => {
    onChange(index, 'picture', null);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
    
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="bg-[#5d2a8b] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
          <h4 className="font-semibold text-gray-700">Sub-service Details</h4>
        </div>
        {showRemove && onRemove && (
          <button 
            type="button" 
            onClick={onRemove}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        )}
      </div>

      {/* Two Column Grid for Name and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subService.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.name`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter sub-service name"
          />
          {errors[`subServices.${index}.name`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`subServices.${index}.name`]}</p>
          )}
        </div>

        {/* Price Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={subService.price}
              onChange={(e) => onChange(index, 'price', e.target.value)}
              className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
                errors[`subServices.${index}.price`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors[`subServices.${index}.price`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`subServices.${index}.price`]}</p>
          )}
        </div>
      </div>

     
      <div className="mb-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={subService.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent resize-none ${
              errors[`subServices.${index}.description`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter sub-service description"
            rows={3}
          />
          {errors[`subServices.${index}.description`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`subServices.${index}.description`]}</p>
          )}
        </div>
      </div>

    
      <div className="mb-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Upload Picture</label>
          <div className="flex items-start gap-4">
       
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id={`picture-${index}`}
              />
              <label
                htmlFor={`picture-${index}`}
                className="flex flex-col items-center justify-center w-full h-24 px-3 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#5d2a8b] hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#5d2a8b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500 group-hover:text-[#5d2a8b]">
                    {subService.picture?.name || 'Click to upload image'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
              </label>
              {errors[`subServices.${index}.picture`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`subServices.${index}.picture`]}</p>
              )}
            </div>

         
            {previewUrl && (
              <div className="relative w-24 h-24 border rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                  sizes="96px"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

   
      <div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Sub-Platform Unique Code</label>
          <input
            type="text"
            value={subService.subPlatformUniqueCode || ''}
            onChange={(e) => onChange(index, 'subPlatformUniqueCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d2a8b] focus:border-transparent ${
              errors[`subServices.${index}.subPlatformUniqueCode`] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Auto-generated if left empty"
          />
          
          {errors[`subServices.${index}.subPlatformUniqueCode`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`subServices.${index}.subPlatformUniqueCode`]}</p>
          )}
        </div>
      </div>
    </div>
  );
};