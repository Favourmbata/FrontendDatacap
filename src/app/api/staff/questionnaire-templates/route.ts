import { NextRequest, NextResponse } from 'next/server';
import { QuestionnaireTemplate } from '@/types/staff';

// Mock questionnaire templates
let mockTemplates: QuestionnaireTemplate[] = [
  {
    id: 'template-1',
    name: 'Standard Organization Verification',
    version: '1.0',
    fields: [
      {
        id: 'org-name',
        type: 'text',
        label: 'Organization Name',
        required: true,
      },
      {
        id: 'reg-number',
        type: 'text',
        label: 'Registration Number',
        required: true,
      },
      {
        id: 'address',
        type: 'textarea',
        label: 'Physical Address',
        required: true,
      },
      {
        id: 'contact-email',
        type: 'text',
        label: 'Contact Email',
        required: true,
      },
      {
        id: 'contact-phone',
        type: 'text',
        label: 'Contact Phone',
        required: true,
      },
      {
        id: 'business-type',
        type: 'select',
        label: 'Business Type',
        required: true,
        options: ['Manufacturing', 'Services', 'Technology', 'Retail', 'Healthcare', 'Education'],
      },
      {
        id: 'employees-count',
        type: 'text',
        label: 'Number of Employees',
        required: false,
      },
      {
        id: 'annual-revenue',
        type: 'text',
        label: 'Annual Revenue (₦)',
        required: false,
      },
      {
        id: 'operating-years',
        type: 'text',
        label: 'Years in Operation',
        required: false,
      },
      {
        id: 'certificates',
        type: 'file',
        label: 'Certificates and Licenses',
        required: true,
      },
      {
        id: 'documents',
        type: 'file',
        label: 'Supporting Documents',
        required: true,
      },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-2',
    name: 'Individual Verification Template',
    version: '1.0',
    fields: [
      {
        id: 'full-name',
        type: 'text',
        label: 'Full Name',
        required: true,
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email Address',
        required: true,
      },
      {
        id: 'phone',
        type: 'text',
        label: 'Phone Number',
        required: true,
      },
      {
        id: 'address',
        type: 'textarea',
        label: 'Residential Address',
        required: true,
      },
      {
        id: 'id-type',
        type: 'select',
        label: 'ID Type',
        required: true,
        options: ['National ID', 'International Passport', 'Driver\'s License', 'Voter\'s Card'],
      },
      {
        id: 'id-number',
        type: 'text',
        label: 'ID Number',
        required: true,
      },
      {
        id: 'occupation',
        type: 'text',
        label: 'Occupation',
        required: false,
      },
      {
        id: 'id-document',
        type: 'file',
        label: 'ID Document',
        required: true,
      },
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // max limit 100

    // Filter templates based on isActive if provided
    let filteredTemplates = mockTemplates;
    
    if (isActive !== null) {
      const isActiveBool = isActive === 'true';
      filteredTemplates = filteredTemplates.filter(template => template.isActive === isActiveBool);
    }
    
    if (search) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        templates: paginatedTemplates,
        total: filteredTemplates.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTemplates.length / limit),
      },
      message: 'Questionnaire templates retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching questionnaire templates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch questionnaire templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.fields) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, fields' },
        { status: 400 }
      );
    }

    // Create new template
    const newTemplate: QuestionnaireTemplate = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      version: body.version || '1.0',
      fields: body.fields,
      isActive: body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data
    mockTemplates.push(newTemplate);

    return NextResponse.json({
      success: true,
      data: { template: newTemplate },
      message: 'Questionnaire template created successfully',
    });
  } catch (error) {
    console.error('Error creating questionnaire template:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create questionnaire template' },
      { status: 500 }
    );
  }
}