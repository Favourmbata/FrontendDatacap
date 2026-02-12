// interface RejectedLocation {
//   profileId: string;
//   locationIndex: number;
//   organizationId: string;
//   organizationName: string;
//   adminEmail: string;
//   adminName: string;
//   location: {
//     brandName: string;
//     locationType: string;
//     cityRegion: string;
//     cityRegionFee: number;
//     address: string;
//     gallery: {
//       images: string[];
//       videos: string[];
//     };
//     rejectionReason: string;
//     emailSent: boolean;
//     emailSentAt: string | null;
//   };
//   rejectedAt: string;
// }

// interface VerifiedLocation {
//   profileId: string;
//   locationIndex: number;
//   organizationId: string;
//   organizationName: string;
//   adminEmail: string;
//   adminName: string;
//   location: {
//     brandName: string;
//     locationType: string;
//     cityRegion: string;
//     cityRegionFee: number;
//     address: string;
//     gallery: {
//       images: string[];
//       videos: string[];
//     };
//   };
//   verifiedAt: string;
//   verifiedBy: string;
// }

// interface SendRejectionEmailResponse {
//   success: boolean;
//   data: {
//     emailSent: boolean;
//     recipientEmail: string;
//     recipientName: string;
//     locationName: string;
//     rejectionReason: string;
//   };
//   message: string;
// }

// export class LocationVerificationService {
//   private static BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

//   /**
//    * Get all rejected location verifications
//    */
//   static async getRejectedLocations(token: string): Promise<{ success: boolean; data?: { rejectedLocationVerifications: RejectedLocation[]; count: number }; message: string }> {
//     try {
//       const response = await fetch(`${this.BASE_URL}/super-admin/location-verifications/rejected`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to fetch rejected locations');
//       }

//       return {
//         success: true,
//         data: result.data,
//         message: result.message
//       };
//     } catch (error: any) {
//       console.error('Error fetching rejected locations:', error);
//       return {
//         success: false,
//         message: error.message || 'An error occurred while fetching rejected locations'
//       };
//     }
//   }

//   /**
//    * Get all verified location verifications
//    */
//   static async getVerifiedLocations(token: string): Promise<{ success: boolean; data?: { verifiedLocationVerifications: VerifiedLocation[]; count: number }; message: string }> {
//     try {
//       const response = await fetch(`${this.BASE_URL}/super-admin/location-verifications/verified`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to fetch verified locations');
//       }

//       return {
//         success: true,
//         data: result.data,
//         message: result.message
//       };
//     } catch (error: any) {
//       console.error('Error fetching verified locations:', error);
//       return {
//         success: false,
//         message: error.message || 'An error occurred while fetching verified locations'
//       };
//     }
//   }

//   /**
//    * Send rejection email for a specific location
//    */
//   static async sendRejectionEmail(profileId: string, locationIndex: number, token: string): Promise<SendRejectionEmailResponse> {
//     try {
//       const response = await fetch(`${this.BASE_URL}/super-admin/location-verifications/${profileId}/${locationIndex}/send-rejection-email`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to send rejection email');
//       }

//       return result;
//     } catch (error: any) {
//       console.error('Error sending rejection email:', error);
//       throw new Error(error.message || 'An error occurred while sending rejection email');
//     }
//   }
// }


import { HttpService } from './HttpService';

interface RejectedLocation {
  profileId: string;
  locationIndex: number;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  location: {
    brandName: string;
    locationType: string;
    cityRegion: string;
    cityRegionFee?: number;
    address: string;
    gallery: {
      images: string[];
      videos: string[];
    };
    rejectionReason: string;
    emailSent: boolean;
    emailSentAt: string | null;
  };
  rejectedAt: string;
}

interface VerifiedLocation {
  profileId: string;
  locationIndex: number;
  organizationId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  location: {
    brandName: string;
    locationType: string;
    cityRegion: string;
    cityRegionFee?: number;
    address: string;
    gallery: {
      images: string[];
      videos: string[];
    };
  };
  verifiedAt: string;
  verifiedBy: string;
}

interface SendRejectionEmailResponse {
  success: boolean;
  data: {
    emailSent: boolean;
    recipientEmail: string;
    recipientName: string;
    locationName: string;
    rejectionReason: string;
  };
  message: string;
}

export class LocationVerificationService {
  private static httpService = new HttpService();

  /**
   * Get all rejected location verifications
   */
  static async getRejectedLocations(token?: string): Promise<{ success: boolean; data?: { rejectedLocationVerifications: RejectedLocation[]; count: number }; message: string }> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { rejectedLocationVerifications: RejectedLocation[]; count: number }; 
        message: string 
      }>('/api/super-admin/location-verifications/rejected');

      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error fetching rejected locations:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while fetching rejected locations'
      };
    }
  }

  /**
   * Get all verified location verifications
   */
  static async getVerifiedLocations(token?: string): Promise<{ success: boolean; data?: { verifiedLocationVerifications: VerifiedLocation[]; count: number }; message: string }> {
    try {
      const response = await this.httpService.getData<{ 
        success: boolean; 
        data: { verifiedLocationVerifications: VerifiedLocation[]; count: number }; 
        message: string 
      }>('/api/super-admin/location-verifications/verified');

      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error: any) {
      console.error('Error fetching verified locations:', error);
      return {
        success: false,
        message: error.message || 'An error occurred while fetching verified locations'
      };
    }
  }

  /**
   * Send rejection email for a specific location
   */
  static async sendRejectionEmail(profileId: string, locationIndex: number): Promise<SendRejectionEmailResponse> {
    try {
      const response = await this.httpService.postData<SendRejectionEmailResponse>(
        {}, 
        `/api/super-admin/location-verifications/${profileId}/${locationIndex}/send-rejection-email`
      );

      return response;
    } catch (error: any) {
      console.error('Error sending rejection email:', error);
      throw new Error(error.message || 'An error occurred while sending rejection email');
    }
  }
}