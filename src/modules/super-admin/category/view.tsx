"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import CategoryService from '@/services/CategoryService';

interface Category {
  _id?: string;
  id: string;
  name: string;
  description: string;
  industryId: string;
  industryName?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const CategoryView = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        if (!categoryId) {
          throw new Error('Category ID is missing');
        }

        const categoryData = await CategoryService.getCategoryById(categoryId);
        setCategory(categoryData);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching category:', error);
        setError(error.message || 'Failed to load category data');
        toast.error(error.message || 'Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    if (!category) return null;
    
    let statusValue = category.status;
    
    // Determine status based on available data
    if (statusValue) {
      // status is already set
    } else if (category.isActive !== undefined) {
      statusValue = category.isActive ? 'active' : 'inactive';
    } else {
      statusValue = 'active'; // default
    }
    
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    
    if (statusValue === 'active') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Active
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          Inactive
        </span>
      );
    }
  };

  const handleBack = () => {
    router.push('/super-admin/category');
  };

  

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 ml-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-red-500 text-center py-8">
              <p className="text-lg font-medium">Error loading category</p>
              <p className="text-sm mt-1">{error || 'Category not found'}</p>
              <button
                onClick={handleBack}
                className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
              >
                Return to Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manrope">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="ml-0 md:ml-[350px] pt-8 md:pt-8 p-4 md:p-8 min-h-screen">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Category Details</h2>
              <div className="mt-1">
                {getStatusBadge()}
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
              ID: {category.id}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category Name</h3>
              <p className="text-gray-900 font-medium text-lg">{category.name}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Industry</h3>
              <p className="text-gray-900 font-medium text-lg">
                {category.industryName || `Industry ID: ${category.industryId}`}
              </p>
            </div>
            
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{category.description}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
              <p className="text-gray-900">{formatDate(category.createdAt)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-900">{formatDate(category.updatedAt)}</p>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default CategoryView;