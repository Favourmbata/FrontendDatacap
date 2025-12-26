// app/(main)/user/object-dimensions/[id]/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ruler } from "lucide-react";
import { ObjectDimension } from "@/types";


// Mock data
const mockObjectDimension: ObjectDimension = {
  _id: "1",
  title: "Steel Beam Structure",
  description: "Structural steel beam for construction",
  formId: "FORM-BEAM-001",
  measurementUnit: "cm",
  objectName: "I-Beam 200x100",
  objectType: "Structural Beam",
  brand: "SteelCorp",
  quantity: 10,
  length: 600,
  height: 200,
  width: 100,
  weight: 45.5,
  depth: 8,
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function ObjectDimensionDetailPage({ params }: DetailPageProps) {
  const router = useRouter();
  const { id } = params;

  const { data: dimension, isLoading } = useQuery({
    queryKey: ["object-dimension", id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockObjectDimension;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAAB40] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading object dimension details...</p>
        </div>
      </div>
    );
  }

  if (!dimension) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Object dimension not found.</p>
          <button 
            onClick={() => router.push("/user/object-dimensions")}
            className="mt-4 bg-[#EAAB40] text-white px-4 py-2 rounded hover:bg-orange-500"
          >
            Back to Object Dimensions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/user/object-dimensions")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Object Dimensions
          </button>
          
          <div className="flex items-center gap-3">
            <Ruler className="w-8 h-8 text-[#EAAB40]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {dimension.title}
              </h1>
              <p className="text-gray-600 mt-1">{dimension.objectName}</p>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
              dimension.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : dimension.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {dimension.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form ID
                  </label>
                  <p className="text-gray-900">{dimension.formId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Object Type
                  </label>
                  <p className="text-gray-900">{dimension.objectType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <p className="text-gray-900">{dimension.brand}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurement Unit
                  </label>
                  <p className="text-gray-900">{dimension.measurementUnit}</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{dimension.description}</p>
              </div>

              {dimension.optionalDescription && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Description
                  </label>
                  <p className="text-gray-900">{dimension.optionalDescription}</p>
                </div>
              )}

              {dimension.quantity && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <p className="text-gray-900">{dimension.quantity}</p>
                </div>
              )}
            </div>

            {/* Core Geometric Parameters */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Core Geometric Parameters
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dimension.length && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length
                    </label>
                    <p className="text-gray-900">{dimension.length} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.height && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <p className="text-gray-900">{dimension.height} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.width && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <p className="text-gray-900">{dimension.width} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.weight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <p className="text-gray-900">{dimension.weight} kg</p>
                  </div>
                )}
                
                {dimension.depth && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depth
                    </label>
                    <p className="text-gray-900">{dimension.depth} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.thickness && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thickness
                    </label>
                    <p className="text-gray-900">{dimension.thickness} {dimension.measurementUnit}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Additional Parameters */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Additional Parameters
              </h3>
              
              <div className="space-y-3">
                {dimension.diameter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diameter
                    </label>
                    <p className="text-gray-900">{dimension.diameter} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.radius && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Radius
                    </label>
                    <p className="text-gray-900">{dimension.radius} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.perimeter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perimeter
                    </label>
                    <p className="text-gray-900">{dimension.perimeter} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.circumference && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Circumference
                    </label>
                    <p className="text-gray-900">{dimension.circumference} {dimension.measurementUnit}</p>
                  </div>
                )}
                
                {dimension.angle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Angle
                    </label>
                    <p className="text-gray-900">{dimension.angle}°</p>
                  </div>
                )}
                
                {dimension.curvature && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curvature
                    </label>
                    <p className="text-gray-900">{dimension.curvature}</p>
                  </div>
                )}
                
                {dimension.crossSectionArea && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cross Section Area
                    </label>
                    <p className="text-gray-900">{dimension.crossSectionArea} {dimension.measurementUnit}²</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Metadata
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {new Date(dimension.createdAt).toLocaleDateString()} at{" "}
                    {new Date(dimension.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {new Date(dimension.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(dimension.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}