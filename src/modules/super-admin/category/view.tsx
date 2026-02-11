"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit } from 'lucide-react';
import CategoryService from '@/services/CategoryService';
import { toast } from 'react-toastify';


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

 
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        if (categoryId) {
          const categoryData = await CategoryService.getCategoryById(categoryId);
          setCategory(categoryData);
        } else {
          toast.error('No category ID provided');
          router.push('/super-admin/category');
        }
      } catch (error: any) {
        console.error('Error fetching category:', error);
        toast.error(error.message || 'Failed to load category data');
        router.push('/super-admin/category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, router]);

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

  const handleEdit = () => {
    if (category) {
      router.push(`/super-admin/category/edit/${category.id}`);
    }
  };

  if (loading) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="manrope">
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
          .manrope { font-family: 'Manrope', sans-serif; }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Details</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
          <div className="text-center py-8">
            <p className="text-gray-600">Category not found</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-[#5D2A8B] text-white rounded-lg hover:bg-[#4a216d] transition-colors"
            >
              Back to Categories
            </button>
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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handleBack}
            className="flex items-center text-[#5D2A8B] hover:text-[#4a216d]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Category Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Category Information</h2>
            <div className="mt-2">
              {getStatusBadge()}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            ID: {category.id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category Name</h3>
            <p className="text-gray-900 font-medium">{category.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Industry</h3>
            <p className="text-gray-900 font-medium">
              {category.industryName || `Industry ID: ${category.industryId}`}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-900">{category.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
            <p className="text-gray-900">{formatDate(category.createdAt)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-900">{formatDate(category.updatedAt)}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={handleEdit}
            className="flex items-center px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;