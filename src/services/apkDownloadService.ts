interface SignupAndDownloadPayload {
  email: string;
  password: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: "CUSTOMER" | "ORGANIZATION" | "SERVICE_PROVIDER" | "TAILOR" | "ADMIN";
  organizationName?: string;
  country?: string;
  industryId?: string;
  industryName?: string;
  platform: "android" | "ios";
}

interface Industry {
  id: string;
  name: string;
  description?: string;
}

interface SignupAndDownloadResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      isVerified: boolean;
      status: string;
    };
    message: string;
    jwtToken?: string;
    downloadUrl: string;
    platform: "android" | "ios";
    otpExpiresAt: string;
    otpExpiresIn: string;
    maxAttempts: number;
    remainingAttempts: number;
    requiresVerification: boolean;
    nextStep: string;
  };
  message?: string;
}

interface IndustriesResponse {
  success: boolean;
  data: {
    industries: Industry[];
  };
  message?: string;
}

interface DownloadStatsResponse {
  success: boolean;
  data: {
    totalDownloads: number;
    uniqueUsers: number;
    androidDownloads: number;
    iosDownloads: number;
    downloadsToday: number;
    downloadsThisWeek: number;
    downloadsThisMonth: number;
  };
  message?: string;
}

interface LoginAndDownloadPayload {
  email: string;
  password: string;
  platform: "android" | "ios";
}

interface LoginAndDownloadResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      isVerified: boolean;
      status: string;
    };
    message: string;
    jwtToken: string;
    downloadUrl: string;
    platform: "android" | "ios";
  };
  message?: string;
}

export class ApkDownloadService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com';
  }

  async signupAndDownload(
    payload: SignupAndDownloadPayload
  ): Promise<SignupAndDownloadResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/apk-download/signup-and-download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.message || "Signup and download failed");
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return response.json();
  }

  async getIndustries(): Promise<IndustriesResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/industries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch industries");
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return response.json();
  }

  triggerDownload(downloadUrl: string, platform: "android" | "ios"): void {
    if (platform === "ios") {
      window.open(downloadUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "vestradat-app.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  async loginAndDownload(
    payload: LoginAndDownloadPayload
  ): Promise<LoginAndDownloadResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/apk-download/login-and-download`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.message || "Login and download failed");
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return response.json();
  }

  async getDownloadStats(token: string): Promise<DownloadStatsResponse> {
    const response = await fetch(`${this.baseUrl}/api/apk-download/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch download statistics");
      } else {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return response.json();
  }
}

export const apkDownloadService = new ApkDownloadService();
