interface RemittanceRecord {
  id: string;
  productId: string;
  productName: string;
  organisation: string;
  orgId: string;
  productPrice: number;
  totalAmountPaid: number;
  deliveryMode: 'shipping' | 'pickup' | 'address';
  uploadedImages: string[];
  comments: string;
  userVideo: string;
  satisfactionDeclaration: string;
  orgBankDetails: string;
  amountRemitted: number;
  dateOfSettlement: string;
  superAdminBankDetails: string;
  paymentEvidence: string;
  confirmationStatus: 'pending' | 'confirmed';
  orgComments: string;
}

class RemittanceService {
  private static BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000/api';

  /**
   * Fetch all remittance records
   */
  static async getAllRemittances(role: 'super-admin' | 'admin'): Promise<RemittanceRecord[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${role}/remittance`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch remittance records: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching remittance records:', error);
      throw error;
    }
  }

  /**
   * Update a remittance record (for confirming payment, adding comments, etc.)
   */
  static async updateRemittance(
    role: 'super-admin' | 'admin',
    record: RemittanceRecord
  ): Promise<RemittanceRecord> {
    try {
      const response = await fetch(`${this.BASE_URL}/${role}/remittance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update remittance record: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating remittance record:', error);
      throw error;
    }
  }

  /**
   * Create a new remittance record (only for super admin)
   */
  static async createRemittance(
    record: Omit<RemittanceRecord, 'id' | 'confirmationStatus'>
  ): Promise<RemittanceRecord> {
    try {
      const response = await fetch(`${this.BASE_URL}/super-admin/remittance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create remittance record: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating remittance record:', error);
      throw error;
    }
  }

  /**
   * Change confirmation status of a remittance record
   */
  static async changeConfirmationStatus(
    role: 'super-admin' | 'admin',
    recordId: string,
    newStatus: 'pending' | 'confirmed' | undefined,
    orgComments?: string
  ): Promise<RemittanceRecord> {
    try {
      // Get the current record
      const allRecords = await this.getAllRemittances(role);
      const recordIndex = allRecords.findIndex(r => r.id === recordId);
      
      if (recordIndex === -1) {
        throw new Error('Remittance record not found');
      }
      
      const recordToUpdate = { ...allRecords[recordIndex] };
      if (newStatus !== undefined) {
        recordToUpdate.confirmationStatus = newStatus;
      }
      
      if (orgComments !== undefined) {
        recordToUpdate.orgComments = orgComments;
      }
      
      return await this.updateRemittance(role, recordToUpdate);
    } catch (error) {
      console.error('Error changing confirmation status:', error);
      throw error;
    }
  }
}

export default RemittanceService;