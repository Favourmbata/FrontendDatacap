// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
// import { AdminUserService, AdminUser } from "@/services/AdminUserService";
// import { AdminMeasurementService, Measurement } from "@/services/AdminMeasurementService";
// import { toast } from "@/app/components/hooks/use-toast";
// import { MeasurementTopNav } from "@/app/components/MeasurementTopNav";

// interface MeasurementField {
//   name: string;
//   value: string;
// }

// interface MeasurementSection {
//   name: string;
//   fields: MeasurementField[];
// }

// interface FormValues {
//   userId: string;
//   measurementType: string;
//   notes: string;
//   sections: MeasurementSection[];
// }

// // Initial values with potential copied data
// const getInitialValues = (): FormValues => {
//   if (copyDataParam) {
//     try {
//       const copyData = JSON.parse(decodeURIComponent(copyDataParam));
//       return convertMeasurementToFormValues(copyData);
//     } catch (error) {
//       console.error('Error parsing copy data:', error);
//       // Return default values if parsing fails
//     }
//   }
  
//   return {
//     userId: "",
//     measurementType: "Manual",
//     notes: "",
//     sections: [
//       {
//         name: "Upper Body",
//         fields: [
//           { name: "Chest", value: "" },
//           { name: "Waist", value: "" },
//           { name: "Hips", value: "" }
//         ]
//       }
//     ]
//   };
// };

// const validationSchema = Yup.object().shape({
//   userId: Yup.string().required("User is required"),
//   measurementType: Yup.string().required("Measurement type is required"),
//   sections: Yup.array()
//     .of(
//       Yup.object().shape({
//         name: Yup.string().required("Section name is required"),
//         fields: Yup.array()
//           .of(
//             Yup.object().shape({
//               name: Yup.string().required("Field name is required"),
//               value: Yup.string().required("Value is required"),
//             })
//           )
//           .min(1, "At least one field is required"),
//       })
//     )
//     .min(1, "At least one section is required"),
// });

// export default function AdminBodyMeasurementCreate() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Get copy data from query parameters
//   const copyDataParam = searchParams.get('copyData');
  
//   // Function to convert measurement data to form format
//   const convertMeasurementToFormValues = (measurement: any): FormValues => {
//     const sections: MeasurementSection[] = [];
    
//     // Create a section from the measurement data
//     if (measurement.measurements) {
//       const fields: MeasurementField[] = [];
      
//       Object.entries(measurement.measurements).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           // Convert camelCase keys back to proper names (e.g., 'chest' to 'Chest')
//           const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
//           fields.push({
//             name: fieldName,
//             value: String(value)
//           });
//         }
//       });
      
//       if (fields.length > 0) {
//         sections.push({
//           name: "Copied Measurements",
//           fields
//         });
//       }
//     }
    
//     // If no measurements exist or are empty, use default
//     if (sections.length === 0) {
//       sections.push({
//         name: "Upper Body",
//         fields: [
//           { name: "Chest", value: "" },
//           { name: "Waist", value: "" },
//           { name: "Hips", value: "" }
//         ]
//       });
//     }
    
//     return {
//       userId: measurement.userId || "",
//       measurementType: measurement.submissionType || "Manual",
//       notes: measurement.notes || "",
//       sections
//     };
//   };



//   // Fetch active users for dropdown
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const userService = new AdminUserService();
//         // Get all active users to populate the dropdown
//         const response = await userService.getUsersByStatus('active', 1, 100);
//         setUsers(response.data.users);
//       } catch (error: any) {
//         console.error("Error fetching users:", error);
//         toast({
//           title: "Error",
//           description: error.message || "Failed to fetch users",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const getInitialValues = (): FormValues => {
//     if (copyDataParam) {
//       try {
//         const copyData = JSON.parse(decodeURIComponent(copyDataParam));
//         return convertMeasurementToFormValues(copyData);
//       } catch (error) {
//         console.error('Error parsing copy data:', error);
//         // Return default values if parsing fails
//       }
//     }
    
//     return {
//       userId: "",
//       measurementType: "Manual",
//       notes: "",
//       sections: [
//         {
//           name: "Upper Body",
//           fields: [
//             { name: "Chest", value: "" },
//             { name: "Waist", value: "" },
//             { name: "Hips", value: "" }
//           ]
//         }
//       ]
//     };
//   };
  
//   const formik = useFormik<FormValues>({
//     initialValues: getInitialValues(),
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);
//       try {
//         const measurementService = new AdminMeasurementService();
        
//         // Transform form values to API payload
//         const measurements: Record<string, number> = {};
//         values.sections.forEach(section => {
//           section.fields.forEach(field => {
//             // Convert field name to camelCase and lowercase for API compatibility
//             const fieldName = field.name
//               .toLowerCase()
//               .replace(/\s+/g, '')
//               .replace(/[^a-z0-9]/g, '');
            
//             // Only add to measurements if the value is a valid number
//             const parsedValue = parseFloat(field.value);
//             if (!isNaN(parsedValue)) {
//               measurements[fieldName] = parsedValue;
//             }
//           });
//         });
        
//         const payload = {
//           userId: values.userId,
//           measurements,
//           notes: values.notes
//         };
        
//         await measurementService.createMeasurement(payload);
        
//         toast({
//           title: "Success!",
//           description: "Measurement created successfully",
//         });
        
//         router.push("/admin/body-measurement");
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to create measurement",
//           variant: "destructive",
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   const addSection = () => {
//     formik.setFieldValue("sections", [
//       ...formik.values.sections,
//       {
//         name: "",
//         fields: [{ name: "", value: "" }],
//       },
//     ]);
//   };

//   const removeSection = (index: number) => {
//     const newSections = [...formik.values.sections];
//     newSections.splice(index, 1);
//     formik.setFieldValue("sections", newSections);
//   };

//   const addField = (sectionIndex: number) => {
//     const newSections = [...formik.values.sections];
//     newSections[sectionIndex].fields.push({ name: "", value: "" });
//     formik.setFieldValue("sections", newSections);
//   };

//   const removeField = (sectionIndex: number, fieldIndex: number) => {
//     const newSections = [...formik.values.sections];
//     newSections[sectionIndex].fields.splice(fieldIndex, 1);
//     formik.setFieldValue("sections", newSections);
//   };

//   const updateSectionName = (index: number, name: string) => {
//     const newSections = [...formik.values.sections];
//     newSections[index].name = name;
//     formik.setFieldValue("sections", newSections);
//   };

//   const updateFieldName = (sectionIndex: number, fieldIndex: number, name: string) => {
//     const newSections = [...formik.values.sections];
//     newSections[sectionIndex].fields[fieldIndex].name = name;
//     formik.setFieldValue("sections", newSections);
//   };

//   const updateFieldValue = (sectionIndex: number, fieldIndex: number, value: string) => {
//     const newSections = [...formik.values.sections];
//     newSections[sectionIndex].fields[fieldIndex].value = value;
//     formik.setFieldValue("sections", newSections);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <style jsx>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
//         .manrope {
//           font-family: 'Manrope', sans-serif;
//         }
        
//         /* Mobile-first responsive styles */
//         .desktop-topnav {
//           display: none;
//         }
        
//         .mobile-container {
//           display: block;
//           width: 100%;
//           padding: 16px;
//         }
        
//         .modal-container {
//           position: relative;
//           width: 100%;
//           max-width: 100%;
//           margin: 0;
//           padding: 0;
//         }
        
//         @media (min-width: 768px) {
//           .desktop-topnav {
//             display: block;
//           }
          
//           .mobile-container {
//             display: none;
//           }
          
//           .modal-container {
//             position: fixed;
//             inset: 0;
//             z-index: 50;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             padding: 16px;
//           }
//         }
//       `}</style>
      
//       {/* Desktop Top Nav - Hidden on mobile */}
//       <div className="desktop-topnav">
//         <MeasurementTopNav />
//       </div>

//       {/* Responsive Modal/Container */}
//       <div className="modal-container">
//         <div className="bg-white pt-8 px-4 rounded-none md:rounded-[20px] md:shadow-2xl w-full max-w-4xl md:ml-[350px] max-h-screen md:max-h-[90vh] overflow-hidden">
//           <form onSubmit={formik.handleSubmit} className="flex flex-col h-screen md:h-full md:max-h-[90vh]">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <div>
//                   <h2 className="manrope text-lg md:text-[22px] font-semibold text-gray-900">
//                     Create Body Measurement
//                   </h2>
//                 </div>
//               </div>
              
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Scrollable Content */}
//             <div className="overflow-y-auto flex-1">
//               <div className="p-4 md:p-6 space-y-6">
//                 {/* User Selection */}
//                 <div>
//                   <label className="manrope block text-sm font-medium text-gray-700 mb-2">
//                     Select User *
//                   </label>
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
//                   ) : (
//                     <select
//                       name="userId"
//                       value={formik.values.userId}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                     >
//                       <option value="">Select a user</option>
//                       {users.map((user) => (
//                         <option key={user.id} value={user.id}>
//                           {user.firstName} {user.lastName} ({user.email})
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                   {formik.touched.userId && formik.errors.userId && (
//                     <div className="manrope text-red-500 text-xs mt-1">
//                       {formik.errors.userId}
//                     </div>
//                   )}
//                 </div>


//                 {/* Measurement Type */}
//                 <div>
//                   <label className="manrope block text-sm font-medium text-gray-700 mb-2">
//                     Measurement Type *
//                   </label>
//                   <select
//                     name="measurementType"
//                     value={formik.values.measurementType}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                   >
//                     <option value="Manual">Manual</option>
//                     <option value="AI">AI</option>
//                     <option value="External">External</option>
//                   </select>
//                   {formik.touched.measurementType && formik.errors.measurementType && (
//                     <div className="manrope text-red-500 text-xs mt-1">
//                       {formik.errors.measurementType}
//                     </div>
//                   )}
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="manrope block text-sm font-medium text-gray-700 mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     name="notes"
//                     value={formik.values.notes}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     rows={3}
//                     placeholder="Additional notes about this measurement"
//                     className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                   />
//                 </div>

//                 {/* Measurement Sections */}
//                 <div className="space-y-6">
//                   <h3 className="manrope text-lg font-medium text-gray-900">Measurements</h3>
                  
//                   {formik.values.sections.map((section, sectionIndex) => (
//                     <div key={sectionIndex} className="space-y-4 p-4 border border-gray-200 rounded-lg">
//                       <div className="flex items-center justify-between">
//                         <input
//                           type="text"
//                           value={section.name}
//                           onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
//                           placeholder="Section Name (e.g., Upper Body)"
//                           className="manrope flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium"
//                         />
//                         {formik.values.sections.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeSection(sectionIndex)}
//                             className="ml-2 p-2 text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
                      
//                       {section.fields.map((field, fieldIndex) => (
//                         <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                           <input
//                             type="text"
//                             value={field.name}
//                             onChange={(e) => updateFieldName(sectionIndex, fieldIndex, e.target.value)}
//                             placeholder="Measurement Name (e.g., Chest)"
//                             className="manrope px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                           />
//                           <div className="flex gap-2">
//                             <input
//                               type="text"
//                               value={field.value}
//                               onChange={(e) => updateFieldValue(sectionIndex, fieldIndex, e.target.value)}
//                               placeholder="Value (e.g., 92)"
//                               className="manrope flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                             />
//                             <span className="manrope flex items-center text-gray-500 text-sm">cm</span>
//                             {section.fields.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeField(sectionIndex, fieldIndex)}
//                                 className="p-2 text-red-500 hover:text-red-700"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
                      
//                       <button
//                         type="button"
//                         onClick={() => addField(sectionIndex)}
//                         className="manrope text-[#5D2A8B] text-sm font-medium flex items-center gap-1 hover:text-purple-700"
//                       >
//                         <Plus className="w-4 h-4" />
//                         Add Field
//                       </button>
//                     </div>
//                   ))}
                  
//                   <button
//                     type="button"
//                     onClick={addSection}
//                     className="manrope w-full text-[#5D2A8B] text-sm font-medium flex items-center justify-center gap-1 hover:text-purple-700 border border-[#5D2A8B] rounded-lg px-4 py-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Section
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             {/* Footer Buttons */}
//             <div className="flex flex-col-reverse md:flex-row justify-end gap-3 p-4 md:p-6 border-t border-gray-200 flex-shrink-0">
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="manrope w-full md:w-auto px-6 py-2.5 text-gray-700 border border-[#5D2A8B] rounded-full hover:bg-gray-50 transition-colors"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || !formik.isValid}
//                 className={`manrope w-full md:w-auto px-6 py-2.5 bg-[#5D2A8B] text-white rounded-full hover:bg-purple-700 transition-colors ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Creating...
//                   </div>
//                 ) : (
//                   "Create Measurement"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { AdminUserService, AdminUser } from '@/services/AdminUserService';
import { AdminMeasurementService } from '@/services/AdminMeasurementService';
import { useSectionOptions } from '@/api/hooks/useManualMeasurement';
import { toast } from "@/app/components/hooks/use-toast";
import { MeasurementTopNav } from "@/app/components/MeasurementTopNav";

interface MeasurementField {
  name: string;
  value: string;
}

interface MeasurementSection {
  name: string;
  fields: MeasurementField[];
}

interface FormValues {
  userId: string;
  measurementType: string;
  notes: string;
  sections: MeasurementSection[];
}

// Function to convert measurement data to form format (handles both old and new formats)
const convertMeasurementToFormValues = (measurement: any): FormValues => {
  const sections: MeasurementSection[] = [];
  
  // Handle new format with sections array
  if (measurement.sections && Array.isArray(measurement.sections)) {
    measurement.sections.forEach((section: any) => {
      const fields: MeasurementField[] = [];
      
      if (section.measurements && Array.isArray(section.measurements)) {
        section.measurements.forEach((meas: any) => {
          if (meas.bodyPartName && meas.size !== undefined && meas.size !== null) {
            // Format bodyPartName for display
            const displayName = meas.bodyPartName
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str: string) => str.toUpperCase());
            
            fields.push({
              name: displayName,
              value: String(meas.size)
            });
          }
        });
      }
      
      if (fields.length > 0) {
        sections.push({
          name: section.sectionName || "Measurements",
          fields
        });
      }
    });
  }
  // Handle old format with measurements object
  else if (measurement.measurements && typeof measurement.measurements === 'object') {
    const fields: MeasurementField[] = [];
    
    Object.entries(measurement.measurements).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert camelCase to display name
        const displayName = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        fields.push({
          name: displayName,
          value: String(value)
        });
      }
    });
    
    if (fields.length > 0) {
      sections.push({
        name: "",
        fields
      });
    }
  }
  
  // If no measurements exist or are empty, use default
  if (sections.length === 0) {
    sections.push({
      name: "Upper Body",
      fields: [
        { name: "Chest", value: "" },
        { name: "Waist", value: "" },
        { name: "Hips", value: "" }
      ]
    });
  }
  
  return {
    userId: measurement.userId || measurement.userInfo?.id || "",
    measurementType: measurement.submissionType || measurement.measurementType || "Manual",
    notes: measurement.notes || "",
    sections
  };
};

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("User is required"),
  measurementType: Yup.string().required("Measurement type is required"),
  sections: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Section name is required"),
        fields: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required("Field name is required"),
              value: Yup.string()
                .required("Value is required")
                .test('is-number', 'Value must be a valid number', (value) => {
                  if (!value) return false;
                  const num = parseFloat(value);
                  return !isNaN(num) && num >= 0;
                }),
            })
          )
          .min(1, "At least one field is required"),
      })
    )
    .min(1, "At least one section is required"),
});

export default function AdminBodyMeasurementCreate() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyDataParam, setCopyDataParam] = useState<string | null>(null);
  const { data: sectionOptions = [], isLoading: isLoadingSections } = useSectionOptions();
  
  // Get copy data from query parameters after component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('copyData');
    setCopyDataParam(param);
  }, []);
  
  const getInitialValues = (): FormValues => {
    // Only process copy data if it's available
    if (copyDataParam) {
      try {
        const copyData = JSON.parse(decodeURIComponent(copyDataParam));
        return convertMeasurementToFormValues(copyData);
      } catch (error) {
        console.error('Error parsing copy data:', error);
        toast({
          title: "Warning",
          description: "Could not load copied data. Using default form.",
          variant: "default",
        });
      }
    }
    
    return {
      userId: "",
      measurementType: "Manual",
      notes: "",
      sections: [
        {
          name: "",
          fields: [
            { name: "", value: "" }
          ]
        }
      ]
    };
  };
  
  // Fetch active users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userService = new AdminUserService();
        const response = await userService.getUsersByStatus('active', 1, 100);
        setUsers(response.data.users || []);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const measurementService = new AdminMeasurementService();
        
        // Transform form values to new API format with sections
        const sections = values.sections.map(section => {
          const sectionMeasurements = section.fields.map(field => {
            // Convert to camelCase for API
            const fieldName = field.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .replace(/[^a-z0-9]/g, '');
            
            return {
              bodyPartName: fieldName,
              size: parseFloat(field.value)
            };
          });
          
          return {
            sectionName: section.name,
            measurements: sectionMeasurements
          };
        });
        
        // Create measurements object for backward compatibility
        const measurements: Record<string, number> = {};
        values.sections.forEach(section => {
          section.fields.forEach(field => {
            const fieldName = field.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .replace(/[^a-z0-9]/g, '');
            
            const parsedValue = parseFloat(field.value);
            if (!isNaN(parsedValue)) {
              measurements[fieldName] = parsedValue;
            }
          });
        });
        
        const payload = {
          userId: values.userId,
          submissionType: values.measurementType,
          notes: values.notes || undefined,
          sections: sections,
          measurements: measurements // Keep for backward compatibility
        };
        
        console.log("Submitting payload:", payload);
        
        await measurementService.createMeasurement(payload);
        
        toast({
          title: "Success!",
          description: "Measurement created successfully",
        });
        
        router.push("/admin/body-measurement");
      } catch (error: any) {
        console.error("Error creating measurement:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create measurement",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const addSection = () => {
    formik.setFieldValue("sections", [
      ...formik.values.sections,
      {
        name: "",
        fields: [{ name: "", value: "" }],
      },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = [...formik.values.sections];
    newSections.splice(index, 1);
    formik.setFieldValue("sections", newSections);
  };

  const addField = (sectionIndex: number) => {
    const newSections = [...formik.values.sections];
    newSections[sectionIndex].fields.push({ name: "", value: "" });
    formik.setFieldValue("sections", newSections);
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...formik.values.sections];
    newSections[sectionIndex].fields.splice(fieldIndex, 1);
    formik.setFieldValue("sections", newSections);
  };

  const updateSectionName = (index: number, name: string) => {
    const newSections = [...formik.values.sections];
    newSections[index].name = name;
    
    // Define default measurements for each section
    const defaultMeasurements: Record<string, string[]> = {
      "Upper Body": "Chest,Shoulders,Arms,Sleeve Length,Back Width,Front Length,Across Back,Across Front".split(","),
      "Lower Body": "Waist,Hips,Inseam,Thigh,Calf,Ankle".split(","),
      "Full Body": "Chest,Waist,Hips,Inseam,Shoulders,Thigh".split(","),
      "Arms": "Upper Arm,Elbow,Sleeve Length,Forearm,Wrist".split(","),
      "Legs": "Thigh,Knee,Calf,Ankle,Inseam".split(","),
      "Neck": "Neck,Collar".split(","),
      "Torso": "Chest,Back Width,Front Length,Across Back,Across Front".split(","),
    };
    
    // If the section has default measurements, add them
    if (defaultMeasurements[name] && newSections[index].fields.length === 1 && newSections[index].fields[0].name === "") {
      const defaultFields = defaultMeasurements[name].map(measurementName => ({
        name: measurementName,
        value: ""
      }));
      newSections[index].fields = defaultFields;
    }
    
    formik.setFieldValue("sections", newSections);
  };

  const updateFieldName = (sectionIndex: number, fieldIndex: number, name: string) => {
    const newSections = [...formik.values.sections];
    newSections[sectionIndex].fields[fieldIndex].name = name;
    formik.setFieldValue("sections", newSections);
  };

  const updateFieldValue = (sectionIndex: number, fieldIndex: number, value: string) => {
    // Only allow numbers and decimal points
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const newSections = [...formik.values.sections];
    newSections[sectionIndex].fields[fieldIndex].value = cleanedValue;
    formik.setFieldValue("sections", newSections);
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
          <form onSubmit={formik.handleSubmit} className="flex flex-col h-screen md:h-full md:max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="manrope text-lg md:text-[22px] font-semibold text-gray-900">
                    Create Body Measurement
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
              <div className="p-4 md:p-6 space-y-6">
                {/* User Selection */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Select User *
                  </label>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="manrope text-sm text-gray-500">Loading users...</span>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="manrope text-sm text-red-500">
                      No active users found. Please create a user first.
                    </div>
                  ) : (
                    <>
                      <select
                        name="userId"
                        value={formik.values.userId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </option>
                        ))}
                      </select>
                      {formik.touched.userId && formik.errors.userId && (
                        <div className="manrope text-red-500 text-xs mt-1">
                          {formik.errors.userId}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Measurement Type */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Measurement Type *
                  </label>
                  <select
                    name="measurementType"
                    value={formik.values.measurementType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="Manual">Manual</option>
                    <option value="AI">AI</option>
                    <option value="External">External</option>
                  </select>
                  {formik.touched.measurementType && formik.errors.measurementType && (
                    <div className="manrope text-red-500 text-xs mt-1">
                      {formik.errors.measurementType}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="manrope block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    placeholder="Additional notes about this measurement"
                    className="manrope w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Measurement Sections */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="manrope text-lg font-medium text-gray-900">Measurements</h3>
                    <div className="text-sm text-gray-500">
                      Add sections and measurement fields
                    </div>
                  </div>
                  
                  {formik.values.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <select
                            value={section.name}
                            onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
                            className="manrope w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium"
                            disabled={isLoadingSections}
                          >
                            <option value="">Select a section</option>
                            {sectionOptions.map((option: string, idx: number) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                        </div>
                        {formik.values.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(sectionIndex)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Remove section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {section.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                            <div>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateFieldName(sectionIndex, fieldIndex, e.target.value)}
                                onBlur={formik.handleBlur}
                                placeholder="Measurement Name (e.g., Chest)"
                                className="manrope w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />

                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => updateFieldValue(sectionIndex, fieldIndex, e.target.value)}
                                  onBlur={formik.handleBlur}
                                  placeholder="Value (e.g., 92)"
                                  className="manrope w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                />

                              </div>
                              <span className="manrope flex items-center text-gray-500 text-sm px-2">cm</span>
                              {section.fields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeField(sectionIndex, fieldIndex)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                  title="Remove field"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => addField(sectionIndex)}
                        className="manrope text-[#5D2A8B] text-sm font-medium flex items-center gap-1 hover:text-purple-700 px-3 py-1 hover:bg-purple-50 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        Add Field
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSection}
                    className="manrope w-full text-[#5D2A8B] text-sm font-medium flex items-center justify-center gap-1 hover:text-purple-700 border border-[#5D2A8B] rounded-lg px-4 py-2 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 p-4 md:p-6 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => router.back()}
                className="manrope w-full md:w-auto px-6 py-2.5 text-gray-700 border border-[#5D2A8B] rounded-full hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formik.isValid || formik.values.sections.length === 0}
                className={`manrope w-full md:w-auto px-6 py-2.5 bg-[#5D2A8B] text-white rounded-full hover:bg-purple-700 transition-colors ${
                  isSubmitting || !formik.isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Measurement"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}