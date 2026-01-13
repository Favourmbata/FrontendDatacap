// Core interfaces for Staff Verification Dashboard

export interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'field_agent' | 'supervisor' | 'admin';
  region: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationTask {
  id: string;
  organizationId: string;
  assignedAgentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  location: {
    address: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationData {
  id: string;
  organizationId: string;
  taskId: string;
  collectedBy: string;
  data: Record<string, any>;
  documents: UploadedDocument[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  auditTrail: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  verificationStatus: 'not_started' | 'in_progress' | 'verified' | 'rejected';
  verifiedBadge: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionnaireTemplate {
  id: string;
  name: string;
  version: string;
  fields: FormField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date';
  label: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: string[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'fileSize' | 'fileType';
  value?: any;
  message: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  changes: Record<string, { from: any; to: any }>;
  ipAddress?: string;
}

export interface DashboardMetrics {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  rejectedTasks: number;
  averageCompletionTime: number;
  tasksByPriority: Record<string, number>;
}

export interface UserPermissions {
  canView: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canAssign: boolean;
  canDelete: boolean;
}

// Component Props Interfaces
export interface StaffDashboardProps {
  user: StaffUser;
  assignments: VerificationTask[];
  metrics: DashboardMetrics;
}

export interface QuestionnaireProps {
  organizationId: string;
  templateId: string;
  existingData?: VerificationData;
  onSave: (data: VerificationData) => void;
}

export interface VerificationDataProps {
  organizationId: string;
  data: VerificationData[];
  permissions: UserPermissions;
  onUpdate: (data: VerificationData) => void;
}