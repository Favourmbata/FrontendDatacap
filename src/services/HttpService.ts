console.log('HttpService: File initialization started');
console.log('HttpService: Module loading started');
console.log('HttpService: File initialization started');
console.log('HttpService: Module initialization started');
console.log('HttpService: File loading started');
console.log('HttpService: Module loading started');
console.log('HttpService: File execution started');
console.log('HttpService: Module execution started');
console.log('HttpService: Starting file execution');
console.log('HttpService: Initializing service');
export class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_BACKEND_API || 'https://datacapture-backend.onrender.com') {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
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
        console.log('\n🔴🔴🔴 ERROR RESPONSE 🔴🔴🔴');
        console.log('❌ Status:', response.status);
        console.log('❌ Error Data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        const errorText = await response.text().catch(() => `HTTP error! status: ${response.status}`);
        console.log('\n🔴🔴🔴 ERROR RESPONSE (Non-JSON) 🔴🔴🔴');
        console.log('❌ Status:', response.status);
        console.log('❌ Error Text:', errorText);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      // Handle specific authentication errors
      if (response.status === 401) {
        console.log('❌ 401 AUTHENTICATION ERROR');
        throw new Error(errorData.message || 'Authentication required. Please log in again.');
      }
      
      // Handle subscription-related errors
      if (errorData.message?.includes('subscription') || errorData.message?.includes('Active subscription required')) {
        console.log('❌ SUBSCRIPTION ERROR');
        throw new Error(errorData.message);
      }
      
      // Handle 404 errors specifically
      if (response.status === 404) {
        console.log('❌ 404 NOT FOUND');
        throw new Error(`Endpoint not found (${response.url}). Please check if the backend API is running and the endpoint exists.`);
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('\n✅✅✅ SUCCESS RESPONSE ✅✅✅');
    console.log('✅ Data:', JSON.stringify(responseData, null, 2));
    return responseData;
  }

  async getData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async postData<T>(data: any, endpoint: string): Promise<T> {
    console.log('\n🔵 HTTP POST:', `${this.baseUrl}${endpoint}`);
    console.log('🔵 Payload:', JSON.stringify(data, null, 2));
    
    const headers = this.getHeaders() as Record<string, string>;
    const hasAuth = headers['Authorization'] ? '✅ Has Auth Token' : '❌ No Auth Token';
    console.log('🔵', hasAuth);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log('🔵 Response Status:', response.status, response.ok ? '✅' : '❌');
    
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

  async deleteData<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: 'DELETE',
      headers: this.getHeaders(),
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
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

  static async delete<T>(endpoint: string, data?: any): Promise<T> {
    const httpService = new HttpService();
    return httpService.deleteData<T>(endpoint, data);
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