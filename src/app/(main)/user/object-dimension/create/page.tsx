
"use client";


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/app/components/hooks/use-toast";
import { ObjectDimensionFormValues } from "@/types";


const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  formId: Yup.string().required("Form ID is required"),
  measurementUnit: Yup.string().required("Measurement unit is required"),
  objectName: Yup.string().required("Object name is required"),
  objectType: Yup.string().required("Object type is required"),
  brand: Yup.string().required("Brand is required"),
  quantity: Yup.number().min(0, "Quantity must be positive"),
  length: Yup.number().min(0, "Length must be positive"),
  height: Yup.number().min(0, "Height must be positive"),
  width: Yup.number().min(0, "Width must be positive"),
  weight: Yup.number().min(0, "Weight must be positive"),
  depth: Yup.number().min(0, "Depth must be positive"),
  thickness: Yup.number().min(0, "Thickness must be positive"),
  diameter: Yup.number().min(0, "Diameter must be positive"),
  radius: Yup.number().min(0, "Radius must be positive"),
  perimeter: Yup.number().min(0, "Perimeter must be positive"),
  circumference: Yup.number().min(0, "Circumference must be positive"),
  angle: Yup.number().min(0, "Angle must be positive"),
  curvature: Yup.number().min(0, "Curvature must be positive"),
  crossSectionArea: Yup.number().min(0, "Cross section area must be positive"),
});

const initialValues: ObjectDimensionFormValues = {
  title: "",
  description: "",
  formId: "",
  measurementUnit: "cm",
  objectName: "",
  objectType: "",
  brand: "",
  quantity: undefined,
  optionalDescription: "",
  length: undefined,
  height: undefined,
  width: undefined,
  weight: undefined,
  depth: undefined,
  thickness: undefined,
  diameter: undefined,
  radius: undefined,
  perimeter: undefined,
  circumference: undefined,
  angle: undefined,
  curvature: undefined,
  crossSectionArea: undefined,
  status: "draft",
};

export default function CreateObjectDimensionForm() {
  const router = useRouter();
  // const { client } = useAuth();
  const queryClient = useQueryClient();

  const createObjectDimensionMutation = useMutation({
    mutationFn: async (values: ObjectDimensionFormValues) => {
      // Mock API call - replace with actual API
      console.log("Creating object dimension:", values);
      
      // Replace with actual API call:
      // return client.post("/api/v1/object-dimensions", values);
      return { data: { success: true } };
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Object dimension created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["all object dimensions"] });
      router.push("/user/object-dimensions");
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create object dimension",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Object Dimensions
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Create Object Dimension
          </h1>
          <p className="text-gray-600 mt-2">
            Add new object dimension details
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            createObjectDimensionMutation.mutate(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter object title"
                    />
                    {errors.title && touched.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form ID <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="formId"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter form ID"
                    />
                    {errors.formId && touched.formId && (
                      <p className="mt-1 text-sm text-red-600">{errors.formId}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter object description"
                  />
                  {errors.description && touched.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Object Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="objectName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter object name"
                    />
                    {errors.objectName && touched.objectName && (
                      <p className="mt-1 text-sm text-red-600">{errors.objectName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Object Type <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="objectType"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter object type"
                    />
                    {errors.objectType && touched.objectType && (
                      <p className="mt-1 text-sm text-red-600">{errors.objectType}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="brand"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter brand"
                    />
                    {errors.brand && touched.brand && (
                      <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Measurement Unit <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="measurementUnit"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="m">Meters (m)</option>
                      <option value="inch">Inches</option>
                      <option value="ft">Feet</option>
                    </Field>
                    {errors.measurementUnit && touched.measurementUnit && (
                      <p className="mt-1 text-sm text-red-600">{errors.measurementUnit}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (Optional)
                    </label>
                    <Field
                      type="number"
                      name="quantity"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter quantity"
                    />
                    {errors.quantity && touched.quantity && (
                      <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </Field>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Optional Description
                  </label>
                  <Field
                    as="textarea"
                    name="optionalDescription"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter additional description (optional)"
                  />
                </div>
              </div>

              {/* Core Geometric Parameters */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Core Geometric Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length
                    </label>
                    <Field
                      type="number"
                      name="length"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter length"
                    />
                    {errors.length && touched.length && (
                      <p className="mt-1 text-sm text-red-600">{errors.length}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height
                    </label>
                    <Field
                      type="number"
                      name="height"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter height"
                    />
                    {errors.height && touched.height && (
                      <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width
                    </label>
                    <Field
                      type="number"
                      name="width"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter width"
                    />
                    {errors.width && touched.width && (
                      <p className="mt-1 text-sm text-red-600">{errors.width}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <Field
                      type="number"
                      name="weight"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter weight"
                    />
                    {errors.weight && touched.weight && (
                      <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth
                    </label>
                    <Field
                      type="number"
                      name="depth"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter depth"
                    />
                    {errors.depth && touched.depth && (
                      <p className="mt-1 text-sm text-red-600">{errors.depth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thickness
                    </label>
                    <Field
                      type="number"
                      name="thickness"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter thickness"
                    />
                    {errors.thickness && touched.thickness && (
                      <p className="mt-1 text-sm text-red-600">{errors.thickness}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Parameters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diameter
                    </label>
                    <Field
                      type="number"
                      name="diameter"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter diameter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius
                    </label>
                    <Field
                      type="number"
                      name="radius"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter radius"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perimeter
                    </label>
                    <Field
                      type="number"
                      name="perimeter"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter perimeter"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Circumference
                    </label>
                    <Field
                      type="number"
                      name="circumference"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter circumference"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Angle
                    </label>
                    <Field
                      type="number"
                      name="angle"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter angle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curvature
                    </label>
                    <Field
                      type="number"
                      name="curvature"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter curvature"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cross Section Area
                    </label>
                    <Field
                      type="number"
                      name="crossSectionArea"
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter cross section area"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                <button
                  type="button"
                  onClick={() => router.push("/user/object-dimensions")}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createObjectDimensionMutation.isPending}
                  className={`flex items-center gap-2 px-6 py-2 bg-[#EAAB40] text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${
                    createObjectDimensionMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {createObjectDimensionMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>Create Object Dimension</>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}