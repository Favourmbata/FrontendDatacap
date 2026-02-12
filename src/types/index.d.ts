// types/object-dimension.ts
export interface ObjectDimension {
  _id: string;
  title: string;
  description: string;
  formId: string;
  measurementUnit: string;
  objectName: string;
  objectType: string;
  brand: string;
  quantity?: number;
  optionalDescription?: string;
  
  // Core Geometric Parameters
  length?: number;
  height?: number;
  width?: number;
  weight?: number;
  depth?: number;
  thickness?: number;
  
  // Additional Parameters
  diameter?: number;
  radius?: number;
  perimeter?: number;
  circumference?: number;
  angle?: number;
  curvature?: number;
  crossSectionArea?: number;
  
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ObjectDimensionFormValues {
  title: string;
  description: string;
  formId: string;
  measurementUnit: string;
  objectName: string;
  objectType: string;
  brand: string;
  quantity?: number;
  optionalDescription?: string;
  
  // Core Geometric Parameters
  length?: number;
  height?: number;
  width?: number;
  weight?: number;
  depth?: number;
  thickness?: number;
  
  // Additional Parameters
  diameter?: number;
  radius?: number;
  perimeter?: number;
  circumference?: number;
  angle?: number;
  curvature?: number;
  crossSectionArea?: number;
  
  status: "draft" | "active" | "archived";
}



// types/organization.ts
export interface Organization {
  id: string;
  organizationName: string;
  accountNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
  contactPerson: string;
  status: 'active' | 'suspended' | 'inactive';
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

// types/measurement.ts
export interface MeasurementSection {
  sectionName: string;
  measurements: Array<{
    bodyPartName: string;
    size: number;
  }>;
}

// types/questionnaire.ts
export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

export interface QuestionnaireSection {
  id: string;
  name: string;
  picture?: File | string;
  pictureUrl?: string;
  fields: QuestionnaireField[];
}

export interface Questionnaire {
  _id: string;
  title: string;
  description: string;
  formId: string;
  sendToIndividual: string;
  sendToGroup: string[];
  sections: QuestionnaireSection[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireFormValues {
  title: string;
  description: string;
  formId: string;
  sendToIndividual: string;
  sendToGroup: string[];
  sections: QuestionnaireSection[];
  status: 'draft' | 'active' | 'archived';
}

// types/organization.ts
export interface Organization {
  id: string;
  organizationName: string;
  accountNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
  contactPerson: string;
  status: 'active' | 'suspended' | 'inactive';
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}