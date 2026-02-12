import { NextRequest, NextResponse } from 'next/server';
import { measurementService, BodyMeasurements } from '@/services/measurement.service.impl';

interface AiMeasurementRequest {
  frontImageData: string;
  sideImageData?: string;
  userHeight: number;
  scanTimestamp: string;
  firstName: string;
  lastName: string;
  subject: string;
}

interface MeasurementData {
  id: string;
  userId: string;
  userHeight: number;
  measurements: BodyMeasurements;
  scanTimestamp: string;
  analysisTimestamp: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  subject: string;
}

interface AiMeasurementResponse {
  success: boolean;
  data: {
    measurements: MeasurementData;
    message: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// In-memory storage for measurements (for development/testing)
const measurementStorage = new Map<string, MeasurementData>();

function generateMeasurementId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `measurement_${timestamp}_${randomSuffix}`;
}

function validateRequest(body: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!body.frontImageData) {
    errors.push('frontImageData is required');
  }
  
  if (typeof body.userHeight !== 'number') {
    errors.push('userHeight must be a number');
  } else if (body.userHeight <= 0 || body.userHeight > 300) {
    errors.push('userHeight must be between 1 and 300 cm');
  }
  
  if (!body.scanTimestamp) {
    errors.push('scanTimestamp is required');
  } else {
    // Validate timestamp format
    const timestamp = new Date(body.scanTimestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push('scanTimestamp must be a valid ISO 8601 timestamp');
    }
  }

  if (!body.firstName) {
    errors.push('firstName is required');
  }
  
  if (!body.lastName) {
    errors.push('lastName is required');
  }
  
  if (!body.subject) {
    errors.push('subject is required');
  }

  // Validate image data format
  if (body.frontImageData) {
    if (typeof body.frontImageData !== 'string') {
      errors.push('frontImageData must be a string');
    } else {
      // Check if it's base64 or data URL format
      let imageData = body.frontImageData;
      if (imageData.startsWith('data:image') && imageData.includes(',')) {
        imageData = imageData.split(',')[1];
      }
      
      // Basic base64 validation
      if (imageData.length === 0) {
        errors.push('frontImageData cannot be empty');
      }
    }
  }

  // Validate optional side image data
  if (body.sideImageData && typeof body.sideImageData !== 'string') {
    errors.push('sideImageData must be a string');
  }

  // Validate names
  if (body.firstName && typeof body.firstName !== 'string') {
    errors.push('firstName must be a string');
  }
  
  if (body.lastName && typeof body.lastName !== 'string') {
    errors.push('lastName must be a string');
  }
  
  if (body.subject && typeof body.subject !== 'string') {
    errors.push('subject must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Processing AI measurement scan request');
    
    // Parse request body
    let body: AiMeasurementRequest;
    try {
      body = await request.json();
    } catch (error) {
      console.error('❌ Invalid JSON in request body:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid JSON in request body',
            details: { error: String(error) }
          }
        },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.isValid) {
      console.error('❌ Request validation failed:', validation.errors);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: { errors: validation.errors }
          }
        },
        { status: 400 }
      );
    }

    console.log('✅ Request validation passed');

    // Process the body scan using the existing service
    let measurements: BodyMeasurements;
    try {
      // Use front image data for processing (side image is optional for now)
      measurements = await measurementService.processBodyScan(
        body.frontImageData,
        body.userHeight
      );
      
      console.log('✅ AI measurement processing completed');
    } catch (error) {
      console.error('❌ AI measurement processing failed:', error);
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: {
            code: 'PROCESSING_ERROR',
            message: error instanceof Error ? error.message : 'AI processing failed',
            details: { originalError: String(error) }
          }
        },
        { status: 500 }
      );
    }

    // Generate measurement data with metadata
    const measurementId = generateMeasurementId();
    const now = new Date().toISOString();
    
    const measurementData: MeasurementData = {
      id: measurementId,
      userId: 'user-placeholder', // TODO: Get from authentication context
      userHeight: body.userHeight,
      measurements: measurements,
      scanTimestamp: body.scanTimestamp,
      analysisTimestamp: now,
      createdAt: now,
      updatedAt: now,
      firstName: body.firstName,
      lastName: body.lastName,
      subject: body.subject
    };

    // Store the measurement (in-memory for now)
    measurementStorage.set(measurementId, measurementData);
    
    console.log('✅ Measurement stored with ID:', measurementId);

    // Return successful response
    const response: AiMeasurementResponse = {
      success: true,
      data: {
        measurements: measurementData,
        message: 'Body scan analysis completed successfully'
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('❌ Unexpected error in AI measurement API:', error);
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred',
          details: { error: String(error) }
        }
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to retrieve measurements by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Measurement ID is required',
        }
      },
      { status: 400 }
    );
  }

  const measurement = measurementStorage.get(id);
  if (!measurement) {
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Measurement not found',
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      measurements: measurement,
      message: 'Measurement retrieved successfully'
    }
  });
}