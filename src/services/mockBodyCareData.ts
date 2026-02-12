export interface Product {
  id: number;
  productName: string;
  description: string;
  barcode: string;
  category: string;
  sku: string;
  producer: string;
  upc: string;
  totalQuantity: number;
  price: number;
  discountPercent: number;
  discountAmount: number;
  platformChargePercent: number;
  actualAmount: number;
  rating: number;
  verified: boolean;
  address: string;
  images: string[];
  ingredients: string;
  modeOfPayment: string;
  availability: {
    openingTime: string;
    workingDays: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  locations: Array<{
    id: number;
    locationType: string;
    brandName: string;
    country: string;
    state: string;
    lga: string;
    city: string;
    cityRegion: string;
    cityRegionFee: number;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    productName: 'Premium Hair Styling Package',
    description: 'Complete professional hair styling service with premium products and expert consultation',
    barcode: '123456789012',
    category: 'Hair Care',
    sku: 'HS-001',
    producer: 'Favours Internal Salon',
    upc: '123456789012',
    totalQuantity: 50,
    price: 25000,
    discountPercent: 20,
    discountAmount: 5000,
    platformChargePercent: 10,
    actualAmount: 20000,
    rating: 4.8,
    verified: true,
    address: '1, Governor\'s House, Portharcourt',
    images: [
      '/placeholder-hair1.jpg',
      '/placeholder-hair2.jpg',
      '/placeholder-hair3.jpg'
    ],
    ingredients: 'Premium hair products, organic oils, conditioning treatments',
    modeOfPayment: 'Cash, Card, Transfer',
    availability: {
      openingTime: '8:00 AM - 7:00 PM',
      workingDays: 'Monday - Saturday'
    },
    contact: {
      phone: '+234 803 123 4567',
      email: 'favours@salon.com'
    },
    locations: [
      {
        id: 1,
        locationType: "headquarters",
        brandName: "Favours Internal Salon - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Governor's House",
        cityRegionFee: 5000,
      },
      {
        id: 2,
        locationType: "branch",
        brandName: "Favours Internal Salon - New Location",
        country: "Nigeria",
        state: "Rivers",
        lga: "Obio-Akpor",
        city: "Rumuodara",
        cityRegion: "Woji Phase 2",
        cityRegionFee: 3000,
      },
      {
        id: 3,
        locationType: "branch",
        brandName: "Favours Internal Salon - Beach Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Old GRA",
        cityRegionFee: 4000,
      }
    ]
  },
  {
    id: 2,
    productName: 'Professional Manicure & Pedicure',
    description: 'Complete nail care service with quality polish and cuticle treatment',
    barcode: '234567890123',
    category: 'Nail Care',
    sku: 'NP-002',
    producer: 'Favours Internal Salon',
    upc: '234567890123',
    totalQuantity: 30,
    price: 15000,
    discountPercent: 20,
    discountAmount: 3000,
    platformChargePercent: 10,
    actualAmount: 12000,
    rating: 4.7,
    verified: true,
    address: '1, Governor\'s House, Portharcourt',
    images: [
      '/placeholder-nails1.jpg',
      '/placeholder-nails2.jpg'
    ],
    ingredients: 'Quality nail polish, cuticle care, moisturizers',
    modeOfPayment: 'Cash, Card, Transfer',
    availability: {
      openingTime: '8:00 AM - 7:00 PM',
      workingDays: 'Monday - Saturday'
    },
    contact: {
      phone: '+234 803 123 4567',
      email: 'favours@salon.com'
    },
    locations: [
      {
        id: 4,
        locationType: "headquarters",
        brandName: "Favours Internal Salon - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Governor's House",
        cityRegionFee: 5000,
      },
      {
        id: 5,
        locationType: "branch",
        brandName: "Favours Internal Salon - New Location",
        country: "Nigeria",
        state: "Rivers",
        lga: "Obio-Akpor",
        city: "Rumuodara",
        cityRegion: "Woji Phase 2",
        cityRegionFee: 3000,
      }
    ]
  },
  {
    id: 3,
    productName: 'Full Access Gym Membership',
    description: 'Monthly membership with full access to all gym facilities and equipment',
    barcode: '345678901234',
    category: 'Fitness',
    sku: 'GYM-003',
    producer: 'Elite Fitness Gym',
    upc: '345678901234',
    totalQuantity: 100,
    price: 30000,
    discountPercent: 16.67,
    discountAmount: 5000,
    platformChargePercent: 10,
    actualAmount: 25000,
    rating: 4.6,
    verified: true,
    address: '15, Trans Amadi Industrial Layout, Portharcourt',
    images: [
      '/placeholder-gym1.jpg',
      '/placeholder-gym2.jpg',
      '/placeholder-gym3.jpg'
    ],
    ingredients: 'Access to gym equipment, trainer consultation, locker',
    modeOfPayment: 'Card, Transfer',
    availability: {
      openingTime: '5:00 AM - 10:00 PM',
      workingDays: 'Monday - Sunday'
    },
    contact: {
      phone: '+234 803 234 5678',
      email: 'info@elitefitness.com'
    },
    locations: [
      {
        id: 6,
        locationType: "headquarters",
        brandName: "Elite Fitness Gym - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Trans Amadi",
        cityRegionFee: 7000,
      },
      {
        id: 7,
        locationType: "branch",
        brandName: "Elite Fitness Gym - City Center",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Opposite International Hotel",
        cityRegionFee: 6000,
      }
    ]
  },
  {
    id: 4,
    productName: 'Relaxing Full Body Massage',
    description: 'Therapeutic massage session with essential oils and aromatherapy',
    barcode: '456789012345',
    category: 'Spa Treatment',
    sku: 'SP-004',
    producer: 'Luxury Spa & Wellness',
    upc: '456789012345',
    totalQuantity: 25,
    price: 40000,
    discountPercent: 12.5,
    discountAmount: 5000,
    platformChargePercent: 10,
    actualAmount: 35000,
    rating: 4.9,
    verified: true,
    address: '22, Aba Road, Portharcourt',
    images: [
      '/placeholder-spa1.jpg',
      '/placeholder-spa2.jpg'
    ],
    ingredients: 'Essential oils, aromatherapy, hot stones',
    modeOfPayment: 'Cash, Card, Transfer',
    availability: {
      openingTime: '9:00 AM - 8:00 PM',
      workingDays: 'Monday - Saturday'
    },
    contact: {
      phone: '+234 803 345 6789',
      email: 'contact@luxuryspa.com'
    },
    locations: [
      {
        id: 8,
        locationType: "headquarters",
        brandName: "Luxury Spa & Wellness - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Aba Road",
        cityRegionFee: 8000,
      }
    ]
  },
  {
    id: 5,
    productName: 'Custom Dress Design Service',
    description: 'Bespoke fashion design and tailoring with premium fabrics',
    barcode: '567890123456',
    category: 'Fashion',
    sku: 'FD-005',
    producer: 'Couture Fashion Design',
    upc: '567890123456',
    totalQuantity: 15,
    price: 50000,
    discountPercent: 10,
    discountAmount: 5000,
    platformChargePercent: 10,
    actualAmount: 45000,
    rating: 4.7,
    verified: false,
    address: '8, Rumuola Road, Portharcourt',
    images: [
      '/placeholder-fashion1.jpg',
      '/placeholder-fashion2.jpg'
    ],
    ingredients: 'Premium fabrics, custom fittings, embellishments',
    modeOfPayment: 'Cash, Transfer (50% deposit required)',
    availability: {
      openingTime: '10:00 AM - 6:00 PM',
      workingDays: 'Tuesday - Saturday'
    },
    contact: {
      phone: '+234 803 456 7890',
      email: 'info@couturefashion.com'
    },
    locations: [
      {
        id: 9,
        locationType: "headquarters",
        brandName: "Couture Fashion Design - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Rumuola",
        cityRegionFee: 4000,
      },
      {
        id: 10,
        locationType: "branch",
        brandName: "Couture Fashion Design - Satellite Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Obio-Akpor",
        city: "Rumuodara",
        cityRegion: "University Junction",
        cityRegionFee: 3500,
      }
    ]
  },
  {
    id: 6,
    productName: 'Facial Treatment Package',
    description: 'Professional facial care with skin analysis and premium skincare products',
    barcode: '678901234567',
    category: 'Skin Care',
    sku: 'FC-006',
    producer: 'Beauty Glow Studio',
    upc: '678901234567',
    totalQuantity: 40,
    price: 18000,
    discountPercent: 16.67,
    discountAmount: 3000,
    platformChargePercent: 10,
    actualAmount: 15000,
    rating: 4.5,
    verified: true,
    address: '12, Elekahia Road, Portharcourt',
    images: [
      '/placeholder-facial1.jpg',
      '/placeholder-facial2.jpg'
    ],
    ingredients: 'Professional skincare products, vitamin serums, moisturizers',
    modeOfPayment: 'Cash, Card',
    availability: {
      openingTime: '9:00 AM - 6:00 PM',
      workingDays: 'Monday - Friday'
    },
    contact: {
      phone: '+234 803 567 8901',
      email: 'hello@beautyglow.com'
    },
    locations: [
      {
        id: 11,
        locationType: "headquarters",
        brandName: "Beauty Glow Studio - Main Branch",
        country: "Nigeria",
        state: "Rivers",
        lga: "Port Harcourt",
        city: "Portharcourt",
        cityRegion: "Elekahia",
        cityRegionFee: 3000,
      }
    ]
  }
];