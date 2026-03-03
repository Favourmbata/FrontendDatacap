interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  updatedAt: string;
}

interface BankDetailsResponse {
  success: boolean;
  data: {
    bankDetails: BankDetails;
  };
}

class BankDetailsService {
  private static BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000';

  /**
   * Register/Update bank account details for admin
   */
  static async registerBankDetails(data: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }): Promise<BankDetails> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${this.BASE_URL}/api/admin/bank-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      const result: BankDetailsResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.data?.bankDetails ? 'Failed to register bank details' : 'Organization must exist in database before adding bank details');
      }

      return result.data.bankDetails;
    } catch (error) {
      console.error('Error registering bank details:', error);
      throw error;
    }
  }

  /**
   * Get registered bank details for admin
   */
  static async getBankDetails(): Promise<BankDetails | null> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${this.BASE_URL}/api/admin/bank-details`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No bank details found
        }
        throw new Error('Failed to fetch bank details');
      }

      const result: BankDetailsResponse = await response.json();
      return result.data.bankDetails;
    } catch (error) {
      console.error('Error fetching bank details:', error);
      throw error;
    }
  }
}

export default BankDetailsService;