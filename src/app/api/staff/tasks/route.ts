import { NextRequest, NextResponse } from 'next/server';
import { VerificationTask } from '@/types/staff';

// Mock task data
const mockTasks: VerificationTask[] = [
  {
    id: 'task-1',
    organizationId: 'org-1',
    assignedAgentId: '1',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: {
      address: '123 Main St, Lagos',
      coordinates: [6.4512, 3.3869],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    organizationId: 'org-2',
    assignedAgentId: '1',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: {
      address: '456 Business Ave, Abuja',
      coordinates: [9.0820, 7.5072],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-3',
    organizationId: 'org-3',
    assignedAgentId: '2',
    status: 'completed',
    priority: 'low',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    location: {
      address: '789 Corporate Blvd, Port Harcourt',
      coordinates: [4.8065, 7.0384],
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedAgentId = searchParams.get('assignedAgentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // max limit 100

    // Filter tasks based on query parameters
    let filteredTasks = mockTasks;
    
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === priority);
    }
    
    if (assignedAgentId) {
      filteredTasks = filteredTasks.filter(t => t.assignedAgentId === assignedAgentId);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        tasks: paginatedTasks,
        total: filteredTasks.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTasks.length / limit),
      },
      message: 'Tasks retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.organizationId || !body.assignedAgentId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: organizationId, assignedAgentId' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask: VerificationTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organizationId: body.organizationId,
      assignedAgentId: body.assignedAgentId,
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 1 week from now
      location: body.location || { address: 'TBD', coordinates: [0, 0] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, you would save to a database
    // For now, we'll just return the new task

    return NextResponse.json({
      success: true,
      data: { task: newTask },
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create task' },
      { status: 500 }
    );
  }
}