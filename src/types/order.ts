export interface Order {
  _id: string;
  productName: string;
  organizationName: string;
  totalAmountPaid: number;
  orderStatus: 'pending' | 'partially_paid' | 'fully_paid';
  deliveryStatus: 'pending' | 'confirmed';
  createdAt: string;
  updatedAt: string;
  deliveryConfirmation?: {
    deliveryMode: 'pickup_center' | 'shipping' | 'organization_location';
    deliveryAddress?: string;
    pickupCenterName?: string;
    productImageUrl?: string;
    representativeImageUrl?: string;
    userImageUrl?: string;
    imageComment?: string;
    satisfactionDeclaration: string;
    confirmedAt: string;
  };
  remittance?: {
    amountRemitted: number;
    settlementDate: string;
    paymentEvidenceUrl?: string;
    remittanceStatus: 'pending' | 'confirmed';
  };
}