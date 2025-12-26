
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/app/components/hooks/use-toast";
import { Questionnaire, QuestionnaireFormValues } from "@/types";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  formId: Yup.string().required("Form ID is required"),
  sendToIndividual: Yup.string().email("Must be a valid email").required("Recipient email is required"),
  status: Yup.string().required("Status is required"),
});

// Mock data for editing
const mockQuestionnaires: Questionnaire[] = [
  {
    _id: "1",
    title: "Customer Feedback Form",
    description: "Gathering customer feedback on our services",
    formId: "FORM-Q-001",
    sendToIndividual: "user@example.com",
    sendToGroup: ["group1@example.com", "group2@example.com"],
    sections: [
      {
        id: "section1",
        name: "General Information",
        fields: [
          {
            id: "field1",
            label: "Name",
            type: "text",
            required: true
          },
          {
            id: "field2",
            label: "Email",
            type: "email",
            required: true
          }
        ]
      }
    ],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface EditObjectDimensionFormProps {
  editId: string;
}

export default function EditObjectDimensionForm({ editId }: EditObjectDimensionFormProps) {
  const router = useRouter();
  // const { client } = useAuth();
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: questionnaireData, isLoading: isLoadingQuestionnaire } = useQuery({
    queryKey: ["object-dimension", editId],
    queryFn: async () => {
      if (!editId) return null;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const questionnaire = mockQuestionnaires.find(q => q._id === editId);
      if (!questionnaire) throw new Error("Questionnaire not found");
      return questionnaire;
    },
    enabled: !!editId && isClient,
  });

  const initialValues: QuestionnaireFormValues = {
    title: questionnaireData?.title || "",
    description: questionnaireData?.description || "",
    formId: questionnaireData?.formId || "",
    sendToIndividual: questionnaireData?.sendToIndividual || "",
    sendToGroup: questionnaireData?.sendToGroup || [],
    sections: questionnaireData?.sections || [],
    status: questionnaireData?.status || "draft",
  };

  const updateQuestionnaireMutation = useMutation({
    mutationFn: async (values: QuestionnaireFormValues) => {
      // Mock API call - replace with actual API
      console.log("Updating questionnaire:", values);
      
      // Replace with actual API call:
      // return client.put(`/api/v1/questionnaires/${editId}`, values);
      return { data: { success: true } };
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Questionnaire updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["all questionnaires"] });
      router.push("/user/questionnaires");
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update questionnaire",
        variant: "destructive",
      });
    },
  });

  if (!isClient || isLoadingQuestionnaire) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EAAB40] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questionnaire data...</p>
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
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Questionnaires
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Questionnaire
          </h1>
          <p className="text-gray-600 mt-2">
            Update your questionnaire details
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values) => {
            updateQuestionnaireMutation.mutate(values);
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
                      placeholder="Enter questionnaire title"
                    />
                    {errors.title && touched.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="sendToIndividual"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter recipient email"
                    />
                    {errors.sendToIndividual && touched.sendToIndividual && (
                      <p className="mt-1 text-sm text-red-600">{errors.sendToIndividual}</p>
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
                    placeholder="Enter questionnaire description"
                  />
                  {errors.description && touched.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send To Group
                    </label>
                    <Field
                      name="sendToGroup"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter group emails (comma separated)"
                    />
                    {errors.sendToGroup && touched.sendToGroup && (
                      <p className="mt-1 text-sm text-red-600">{errors.sendToGroup}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    {errors.status && touched.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                <button
                  type="button"
                  onClick={() => router.push("/user/questionnaires")}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateQuestionnaireMutation.isPending}
                  className={`flex items-center gap-2 px-6 py-2 bg-[#EAAB40] text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${
                    updateQuestionnaireMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {updateQuestionnaireMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>Update Questionnaire</>
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
