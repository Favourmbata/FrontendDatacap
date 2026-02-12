import { NextRequest } from 'next/server';

// Define the Module interface
interface Module {
  id: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for modules (in production, this would be a database)
let modules: Module[] = [
  {
    id: 'mod_001',
    moduleName: 'User Management',
    description: 'Manage user accounts and permissions',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'mod_002',
    moduleName: 'Organization Management',
    description: 'Manage organizations and their details',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let filteredModules = [...modules];

    // Apply search filter
    if (search) {
      filteredModules = filteredModules.filter(module =>
        module.moduleName.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      const isActive = status === 'active';
      filteredModules = filteredModules.filter(module => module.isActive === isActive);
    }

    return Response.json({
      success: true,
      data: {
        modules: filteredModules,
      },
      message: 'Modules retrieved successfully',
    });
  } catch (error: any) {
    console.error('Error retrieving modules:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to retrieve modules',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.moduleName || !body.description) {
      return Response.json(
        { success: false, message: 'Module name and description are required' },
        { status: 400 }
      );
    }

    // Create new module
    const newModule: Module = {
      id: `mod_${Date.now()}`,
      moduleName: body.moduleName,
      description: body.description,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    modules.push(newModule);

    return Response.json({
      success: true,
      data: {
        module: newModule,
      },
      message: 'Module created successfully',
    });
  } catch (error: any) {
    console.error('Error creating module:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to create module',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle PUT and DELETE methods
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return Response.json(
        { success: false, message: 'Module ID is required' },
        { status: 400 }
      );
    }

    const moduleIndex = modules.findIndex(mod => mod.id === body.id);
    
    if (moduleIndex === -1) {
      return Response.json(
        { success: false, message: 'Module not found' },
        { status: 404 }
      );
    }

    // Update module
    const updatedModule = {
      ...modules[moduleIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    modules[moduleIndex] = updatedModule;

    return Response.json({
      success: true,
      data: {
        module: updatedModule,
      },
      message: 'Module updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating module:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to update module',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, message: 'Module ID is required' },
        { status: 400 }
      );
    }

    const initialLength = modules.length;
    modules = modules.filter(mod => mod.id !== id);

    if (modules.length === initialLength) {
      return Response.json(
        { success: false, message: 'Module not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting module:', error);
    return Response.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete module',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}