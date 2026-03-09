"use client";

import { MapPin, CheckCircle, Package, Scissors, Eye } from 'lucide-react';
import type { PublicProduct } from '@/types/publicProduct';

interface ProductCardProps {
  product: PublicProduct;
  onViewDetails: (product: PublicProduct) => void;
  formatCurrency: (amount: number) => string;
}

const ProductCard = ({ product, onViewDetails, formatCurrency }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-[#5d2a8b] hover:border-[#7a3aa3]">
     
      <div className="bg-white aspect-square flex items-center justify-center p-4 relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            {product.itemType === 'service' ? (
              <Scissors className="w-12 h-12 text-gray-300" />
            ) : (
              <Package className="w-12 h-12 text-gray-300" />
            )}
          </div>
        )}
        
       
        {product.location?.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center font-semibold z-10">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#5d2a8b] text-white px-2 py-1 rounded-full text-xs font-semibold">
          {product.categoryName}
        </div>
        {product.discount > 0 && (
          <div className="absolute top-12 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
     
      <div className="p-5 border-t border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
     
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="text-lg font-bold text-[#5d2a8b]">
              {formatCurrency(product.discountedPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-600">
              Save {formatCurrency(Math.abs(product.youSave))}
            </span>
            {product.itemType === 'product' && (
              <span className="text-sm font-semibold text-gray-600">
                {product.availableQuantity} left
              </span>
            )}
          </div>
        </div>
        
      
        <p className="text-sm text-[#5d2a8b] font-medium mb-2">{product.businessName}</p>
        
        {/* Location */}
        {product.location && (
          <p className="text-xs text-gray-500 mb-3 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {product.location.city}, {product.location.state}
          </p>
        )}
        
      
        <button 
          onClick={() => onViewDetails(product)}
          className="w-full bg-[#5d2a8b] text-white py-2.5 rounded-lg hover:bg-[#7a3aa3] transition-colors font-semibold flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;