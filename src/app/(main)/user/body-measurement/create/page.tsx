"use client";
import { useSaveManualMeasurement, useSectionOptions } from "@/api/hooks/useManualMeasurement";
import { useProfile } from "@/api/hooks/useProfile";
import {
  Field,
  FieldArray,
  Formik,
} from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, X, Upload } from "lucide-react";
import { toast } from "@/app/components/hooks/use-toast";
import { MeasurementTopNav } from "@/app/components/MeasurementTopNav";

interface CustomMeasurement {
  bodyPartName: string;
  size: string;
}

interface BodySection {
  sectionName: string;
  measurements: CustomMeasurement[];
}

interface SelfMeasurementFormValues {
  // Removed formId from here
  firstName: string;
  lastName: string;
  measurementType: string;
  subject: string;
  bodySections: BodySection[];
}

// Remove the generateFormId function entirely
// const generateFormId = () => {
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 11);
//   return `CUR001-${timestamp.toString().slice(-6)}-${random.slice(0, 3).toUpperCase()}`;
// };

const validationSchema = Yup.object().shape({
  // Removed formId from validation
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  measurementType: Yup.string().required("Measurement type is required"),
  subject: Yup.string().required("Subject is required"),
  bodySections: Yup.array()
    .of(
      Yup.object().shape({
        sectionName: Yup.string().required("Section name is required"),
        measurements: Yup.array()
          .of(
            Yup.object().shape({
              bodyPartName: Yup.string().required("Body part name is required"),
              size: Yup.string().required("Size is required"),
            })
          )
          .min(1, "At least one measurement is required"),
      })
    )
    .min(1, "At least one section is required"),
});

const initialValues: SelfMeasurementFormValues = {
  // Removed formId
  firstName: "",
  lastName: "",
  measurementType: "Manual",
  subject: "Self",
  bodySections: [
    {
      sectionName: "",
      measurements: [
        { bodyPartName: "", size: "" },
      ],
    },
  ],
};

export default function SelfMeasurementForm() {
  const router = useRouter();
  const { profile } = useProfile();
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1);
  // Removed formId state
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [customSection, setCustomSection] = useState("");
  const saveMeasurementMutation = useSaveManualMeasurement();
  const { data: sectionOptions = [], isLoading: isLoadingSections } = useSectionOptions();

  const AutoFillUserInfo = ({ values, setFieldValue }: { 
    values: SelfMeasurementFormValues; 
    setFieldValue: (field: string, value: string | number | boolean | object | null | undefined) => void 
  }) => {
    useEffect(() => {
      if (values.subject === "Self" && profile) {
        setFieldValue("firstName", profile.firstName || "");
        setFieldValue("lastName", profile.lastName || "");
      }
    }, [values.subject, setFieldValue]);

    return null;
  };

  const handleSubmit = async (values: SelfMeasurementFormValues) => {
    setIsCreating(true);
    try {
      const payload = {
        // Do NOT include formId in the payload - server will generate it
        measurementType: values.measurementType,
        subject: values.subject,
        firstName: values.firstName,
        lastName: values.lastName,
        sections: values.bodySections.map(section => ({
          sectionName: section.sectionName,
          measurements: section.measurements.map(m => ({
            bodyPartName: m.bodyPartName,
            size: parseFloat(m.size) || m.size,
          })),
        })),
      };

      await saveMeasurementMutation.mutateAsync(payload);
      
      toast({
        title: "Success!",
        description: "Measurement saved successfully",
      });
      
      router.push("/user/body-measurement");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save measurement",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const addCustomSection = (push: (section: BodySection) => void) => {
    if (customSection.trim()) {
      push({
        sectionName: customSection.trim(),
        measurements: [{ bodyPartName: "", size: "" }]
      });
      setCustomSection("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        .manrope {
          font-family: 'Manrope', sans-serif;
        }
        
        /* Mobile-first responsive styles */
        .desktop-topnav {
          display: none;
        }
        
        .mobile-container {
          display: block;
          width: 100%;
          padding: 16px;
        }
        
        .modal-container {
          position: relative;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        
        @media (min-width: 768px) {
          .desktop-topnav {
            display: block;
          }
          
          .mobile-container {
            display: none;
          }
          
          .modal-container {
            position: fixed;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
        }
      `}</style>
      
      {/* Desktop Top Nav - Hidden on mobile */}
      <div className="desktop-topnav">
        <MeasurementTopNav />
      </div>

      {/* Responsive Modal/Container */}
      <div className="modal-container">
        <div className="bg-white pt-8 px-4 rounded-none md:rounded-[20px] md:shadow-2xl w-full max-w-4xl md:ml-[350px] max-h-screen md:max-h-[90vh] overflow-hidden">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, setFieldValue, handleSubmit: formikHandleSubmit }) => (
              <form onSubmit={formikHandleSubmit} className="flex flex-col h-screen md:h-full md:max-h-[90vh]">
                <AutoFillUserInfo values={values} setFieldValue={setFieldValue} />

                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => step === 2 ? setStep(1) : router.back()}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="manrope text-lg md:text-[22px] font-semibold text-gray-900">
                        Take New Measurement
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                  {/* Step 1: Initial Setup */}
                  {step === 1 && (
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                      {/* Form ID section removed - server will generate it */}

                      {/* Measurement Type and Subject */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            Manual or AI Measurement
                          </label>
                          <Field
                            as="select"
                            name="measurementType"
                            className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="Manual">Manual</option>
                            <option value="AI">AI</option>
                          </Field>
                        </div>
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            Whose Measurement
                          </label>
                          <Field
                            as="select"
                            name="subject"
                            className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="Self">Self</option>
                            <option value="Other">Other</option>
                          </Field>
                        </div>
                      </div>

                      {/* First Name and Last Name */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <Field
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            disabled={values.subject === "Self"}
                            className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:bg-gray-100"
                          />
                          {errors.firstName && touched.firstName && (
                            <div className="manrope text-red-500 text-xs mt-1">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <Field
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            disabled={values.subject === "Self"}
                            className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:bg-gray-100"
                          />
                          {errors.lastName && touched.lastName && (
                            <div className="manrope text-red-500 text-xs mt-1">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image Uploads */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            Upload Front Image
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setFrontImage(e.target.files?.[0] || null)}
                              className="hidden"
                              id="front-image"
                            />
                            <label htmlFor="front-image" className="cursor-pointer">
                              <Upload className="w-6 h-6 md:w-8 md:h-8 text-purple-500 mx-auto mb-2" />
                              <p className="manrope text-xs md:text-sm text-gray-500">
                                {frontImage ? frontImage.name : "Upload front view"}
                              </p>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                            Upload Side Image
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setSideImage(e.target.files?.[0] || null)}
                              className="hidden"
                              id="side-image"
                            />
                            <label htmlFor="side-image" className="cursor-pointer">
                              <Upload className="w-6 h-6 md:w-8 md:h-8 text-purple-500 mx-auto mb-2" />
                              <p className="manrope text-xs md:text-sm text-gray-500">
                                {sideImage ? sideImage.name : "Upload side view"}
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Next/Cancel Buttons */}
                      <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="manrope w-full md:w-auto px-6 py-2.5 text-gray-700 border border-[#5D2A8B] rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!values.firstName || !values.lastName) {
                              toast({
                                title: "Required Fields",
                                description: "Please fill in first name and last name",
                                variant: "destructive",
                              });
                              return;
                            }
                            setStep(2);
                          }}
                          className="manrope w-full md:w-auto px-6 py-2.5 bg-[#5D2A8B] text-white rounded-full hover:bg-purple-700 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Measurements with Dropdown Sections */}
                  {step === 2 && (
                    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                      <FieldArray name="bodySections">
                        {({ push: pushSection, remove: removeSection }) => (
                          <>
                            {values.bodySections.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="space-y-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                                {/* Section Header with Dropdown */}
                                <div className="space-y-3">
                                  <label className="manrope block text-sm font-medium text-gray-700">
                                    Section Name
                                  </label>
                                  <div className="flex gap-2">
                                    <Field
                                      as="select"
                                      name={`bodySections.${sectionIndex}.sectionName`}
                                      className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                      disabled={isLoadingSections}
                                    >
                                      <option value="">Select a section</option>
                                      {sectionOptions.map((option: string, idx: number) => (
                                        <option key={idx} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </Field>
                                    {values.bodySections.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeSection(sectionIndex)}
                                        className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                  {errors.bodySections?.[sectionIndex] && 
                                   typeof errors.bodySections[sectionIndex] === 'object' && 
                                   'sectionName' in (errors.bodySections[sectionIndex] as any) &&
                                   touched.bodySections?.[sectionIndex] && 
                                   typeof touched.bodySections[sectionIndex] === 'object' && 
                                   'sectionName' in (touched.bodySections[sectionIndex] as any) && (
                                    <p className="manrope text-red-500 text-xs mt-1">
                                      {(errors.bodySections[sectionIndex] as any).sectionName}
                                    </p>
                                  )}
                                </div>

                                {/* Measurements Grid */}
                                <FieldArray name={`bodySections.${sectionIndex}.measurements`}>
                                  {({ push: pushMeasurement, remove: removeMeasurement }) => (
                                    <div className="space-y-4">
                                      {section.measurements.map((measurement, measurementIndex) => (
                                        <div key={measurementIndex} className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                                          {/* Body Part Name */}
                                          <div>
                                            <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                                              Body Part Name
                                            </label>
                                            <div className="relative">
                                              <Field
                                                name={`bodySections.${sectionIndex}.measurements.${measurementIndex}.bodyPartName`}
                                                type="text"
                                                placeholder="e.g., Shoulder Width"
                                                className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                              />
                                              {measurementIndex > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={() => removeMeasurement(measurementIndex)}
                                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 p-1"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              )}
                                            </div>
                                            {errors.bodySections?.[sectionIndex] && 
                                             typeof errors.bodySections[sectionIndex] === 'object' && 
                                             'measurements' in (errors.bodySections[sectionIndex] as any) &&
                                             Array.isArray((errors.bodySections[sectionIndex] as any).measurements) &&
                                             (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             typeof (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] === 'object' &&
                                             'bodyPartName' in (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             touched.bodySections?.[sectionIndex] && 
                                             typeof touched.bodySections[sectionIndex] === 'object' && 
                                             'measurements' in (touched.bodySections[sectionIndex] as any) &&
                                             Array.isArray((touched.bodySections[sectionIndex] as any).measurements) &&
                                             (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             typeof (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] === 'object' &&
                                             'bodyPartName' in (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] && (
                                              <p className="manrope text-red-500 text-xs mt-1">
                                                {((errors.bodySections[sectionIndex] as any).measurements[measurementIndex] as any).bodyPartName}
                                              </p>
                                            )}
                                          </div>

                                          {/* Size */}
                                          <div>
                                            <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                                              Size (cm)
                                            </label>
                                            <Field
                                              name={`bodySections.${sectionIndex}.measurements.${measurementIndex}.size`}
                                              type="text"
                                              placeholder="e.g., 45"
                                              className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                            {errors.bodySections?.[sectionIndex] && 
                                             typeof errors.bodySections[sectionIndex] === 'object' && 
                                             'measurements' in (errors.bodySections[sectionIndex] as any) &&
                                             Array.isArray((errors.bodySections[sectionIndex] as any).measurements) &&
                                             (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             typeof (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] === 'object' &&
                                             'size' in (errors.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             touched.bodySections?.[sectionIndex] && 
                                             typeof touched.bodySections[sectionIndex] === 'object' && 
                                             'measurements' in (touched.bodySections[sectionIndex] as any) &&
                                             Array.isArray((touched.bodySections[sectionIndex] as any).measurements) &&
                                             (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] &&
                                             typeof (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] === 'object' &&
                                             'size' in (touched.bodySections[sectionIndex] as any).measurements[measurementIndex] && (
                                              <p className="manrope text-red-500 text-xs mt-1">
                                                {((errors.bodySections[sectionIndex] as any).measurements[measurementIndex] as any).size}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}

                                      {/* Add New Field Button */}
                                      <button
                                        type="button"
                                        onClick={() => pushMeasurement({ bodyPartName: "", size: "" })}
                                        className="manrope text-[#5D2A8B] text-sm font-medium flex items-center gap-1 hover:text-purple-700"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Add New Field
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            ))}

                            {/* Add Custom Section */}
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <label className="manrope block text-sm font-medium text-gray-700">
                                  Add Custom Section
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={customSection}
                                    onChange={(e) => setCustomSection(e.target.value)}
                                    placeholder="Enter custom section name"
                                    className="manrope flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => addCustomSection(pushSection)}
                                    className="manrope flex items-center gap-2 bg-[#5D2A8B] text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-colors text-sm flex-shrink-0"
                                    disabled={!customSection.trim()}
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add
                                  </button>
                                </div>
                              </div>
                              
                              {/* Add New Section Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  pushSection({
                                    sectionName: "",
                                    measurements: [{ bodyPartName: "", size: "" }],
                                  })
                                }
                                className="manrope w-full md:w-auto text-[#5D2A8B] text-sm font-medium flex items-center justify-center gap-1 hover:text-purple-700 border border-[#5D2A8B] rounded-lg px-4 py-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add New Section
                              </button>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  )}
                </div>

                {/* Footer Buttons - Fixed at bottom */}
                {step === 2 && (
                  <div className="flex flex-col-reverse md:flex-row justify-end gap-3 p-4 md:p-6 border-t border-gray-200 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="manrope w-full md:w-auto px-6 py-2.5 text-gray-700 border border-[#5D2A8B] rounded-full hover:bg-gray-50 transition-colors"
                      disabled={isCreating}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className={`manrope w-full md:w-auto px-6 py-2.5 bg-[#5D2A8B] text-white rounded-full hover:bg-purple-700 transition-colors ${
                        isCreating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isCreating ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}