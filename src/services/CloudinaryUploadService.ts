import { HttpService } from './HttpService';
import { routes } from './apiRoutes';

export interface ScanMeasurementRequest {
  frontImageUrl: string;
  sideImageUrl?: string;
  userHeight: number;
  scanTimestamp: string;
  firstName: string;
  lastName: string;
  subject: string;
}

export interface ScanMeasurementResponse {
  success: boolean;
  data: {
    measurements: {
      id: string;
      userId: string;
      userHeight: number;
      measurements: {
        shoulder: number;
        bust: number;
        armLength: number;
        neck: number;
        butt: number;
        waist: number;
        hips: number;
        wrist: number;
        inseam: number;
        chest: number;
      };
      scanTimestamp: string;
      analysisTimestamp: string;
      createdAt: string;
      updatedAt: string;
      firstName: string;
      lastName: string;
      subject: string;
    };
    message: string;
  };
}

export class CloudinaryUploadService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Upload image to Cloudinary
   */
  static async uploadToCloudinary(imageUri: string): Promise<string> {
    try {
      // Create a blob from the data URL
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('file', blob, `measurement-${Date.now()}.jpg`);
      formData.append('upload_preset', 'vestradat_preset');
      
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/disz21zwr/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await cloudinaryResponse.json();
      
      if (!result.secure_url) {
        throw new Error('Upload failed');
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }

  /**
   * Scan measurement using AI
   */
  async scanMeasurement(request: ScanMeasurementRequest): Promise<ScanMeasurementResponse> {
    return this.httpService.postData(request, routes.scanMeasurements());
  }
}