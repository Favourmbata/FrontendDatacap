export class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com') {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, try to get text or use status text
        const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      // Handle specific authentication errors
      if (response.status === 401) {
        throw new Error(errorData.message || 'Authentication required. Please log in again.');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async postData<T>(data: any, endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async putData<T>(data: any, endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async patchData<T>(data: any, endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async deleteData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  // Add method for uploading images
  async uploadImage<T>(imageData: string, height: number, mimeType: string, fileName: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/photos/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        imageData,
        height,
        mimeType,
        fileName
      }),
    });
    return this.handleResponse<T>(response);
  }

  // Add method for downloading files
  async download(endpoint: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    
    return response.blob();
  }

  // Static methods for easy usage
  static async get<T>(endpoint: string): Promise<T> {
    const httpService = new HttpService();
    return httpService.getData<T>(endpoint);
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const httpService = new HttpService();
    return httpService.postData<T>(data, endpoint);
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const httpService = new HttpService();
    return httpService.putData<T>(data, endpoint);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const httpService = new HttpService();
    return httpService.deleteData<T>(endpoint);
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const httpService = new HttpService();
    return httpService.patchData<T>(data, endpoint);
  }

  static async download(endpoint: string): Promise<Blob> {
    const httpService = new HttpService();
    return httpService.download(endpoint);
  }
}