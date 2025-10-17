export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'reception';
}

export interface Entry {
  id: string;
  serialNumber: number;
  numberOfCustomers: number;
  pricePerPerson: number;
  totalAmount: number;
  date: Date;
  adminName: string;
  adminId: string;
}

export interface DailySummary {
  date: string;
  totalCustomers: number;
  totalAmount: number;
  numberOfTransactions: number;
  entries: Entry[];
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalCustomers: number;
  totalAmount: number;
  numberOfDays: number;
  dailySummaries: DailySummary[];
}

export interface Settings {
  defaultPrice: number;
  businessName: string;
  logoUrl: string;
  lastPriceUpdate: Date;
  updatedBy: string;
}

