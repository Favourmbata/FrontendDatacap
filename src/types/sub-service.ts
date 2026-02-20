
export interface SubService {
  id: string;
  name: string;
  description: string;
  picture: File | null;
  price: string;
  subPlatformUniqueCode: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AvailabilityPeriod {
  startYear: string;
  endYear: string;
}
export interface TimeSlot {
  startTime: string;
  endTime: string;
}
export interface Service {

  id: string;
  name: string;              
  description: string;        
  category: string;           
  sku: string;              
  prodnar: string;            
  upc: string;             
  totalProviders: string;     
   timeSlot: TimeSlot;  

  subServiceCount: number;   
  subServices: SubService[];  


  discount: string;           
  discountedAmount: string;   
  platformCharge: string;    
  actualAmount: string;      


  visibilityPeriod: DateRange;
  upfrontPayment: boolean;    


  availabilityType: "unlimited" | "period";
  availabilityPeriod: AvailabilityPeriod;
}

// Constants
export const SUB_SERVICE_COUNT_OPTIONS = Array.from({ length: 99 }, (_, i) => i + 2);

export const INITIAL_SUB_SERVICE: SubService = {
  id: "",
  name: "",
  description: "",
  picture: null,
  price: "",
  subPlatformUniqueCode: "",
};

export const INITIAL_SERVICE: Service = {
  id: "",
  name: "",
  description: "",
  category: "",
  sku: "",
  prodnar: "",
  upc: "",
  totalProviders: "",
  subServiceCount: 2,
  subServices: [],
  discount: "",
  discountedAmount: "",
  
  timeSlot: { startTime: "", endTime: "" },
  platformCharge: "",
  actualAmount: "",
  visibilityPeriod: { startDate: "", endDate: "" },
  upfrontPayment: false,
  availabilityType: "unlimited",
  availabilityPeriod: { startYear: "", endYear: "" },
};