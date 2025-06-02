
export interface Customer {
  id: string;
  name: string;
  phone: string;
  lastPurchase: string;
  totalPurchases: number;
  totalAmount: number;
  averagePrice: number;
  preferredLanguage: 'ar' | 'en' | 'hi' | 'bn';
  purchases: CustomerPurchase[];
}

export interface CustomerPurchase {
  id: string;
  date: string;
  batteryType: string;
  quantity: number;
  price: number;
  total: number;
  discount: number;
  finalTotal: number;
}

export const customersData: Customer[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    phone: '+966501234567',
    lastPurchase: '2024-01-15',
    totalPurchases: 15,
    totalAmount: 4500,
    averagePrice: 300,
    preferredLanguage: 'ar',
    purchases: [
      {
        id: '1',
        date: '2024-01-15',
        batteryType: 'بطارية سيارة',
        quantity: 5,
        price: 300,
        total: 1500,
        discount: 0,
        finalTotal: 1500
      },
      {
        id: '2',
        date: '2024-01-10',
        batteryType: 'بطارية شاحنة',
        quantity: 3,
        price: 450,
        total: 1350,
        discount: 50,
        finalTotal: 1300
      }
    ]
  },
  {
    id: '2',
    name: 'فهد العتيبي',
    phone: '+966507654321',
    lastPurchase: '2024-01-10',
    totalPurchases: 8,
    totalAmount: 2400,
    averagePrice: 300,
    preferredLanguage: 'ar',
    purchases: [
      {
        id: '3',
        date: '2024-01-10',
        batteryType: 'بطارية دراجة نارية',
        quantity: 8,
        price: 300,
        total: 2400,
        discount: 0,
        finalTotal: 2400
      }
    ]
  },
  {
    id: '3',
    name: 'سالم الرشيد',
    phone: '+966551234567',
    lastPurchase: '2024-01-05',
    totalPurchases: 12,
    totalAmount: 3600,
    averagePrice: 300,
    preferredLanguage: 'ar',
    purchases: []
  },
  {
    id: '4',
    name: 'خالد النصر',
    phone: '+966557654321',
    lastPurchase: '2023-12-20',
    totalPurchases: 5,
    totalAmount: 1500,
    averagePrice: 300,
    preferredLanguage: 'ar',
    purchases: []
  },
  {
    id: '5',
    name: 'John Smith',
    phone: '+966551234567',
    lastPurchase: '2024-01-05',
    totalPurchases: 12,
    totalAmount: 3600,
    averagePrice: 300,
    preferredLanguage: 'en',
    purchases: []
  }
];

export const batteryTypes = [
  'بطارية سيارة',
  'بطارية شاحنة', 
  'بطارية دراجة نارية',
  'بطارية UPS'
];
