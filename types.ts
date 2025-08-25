
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: Role;
  password?: string; // Should be hashed in a real app
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  imageUrl?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number; // Price at the time of sale
  costPrice: number; // Cost price at the time of sale
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
  sessionId?: string;
}

export interface CashRegisterSession {
  id: string;
  startDate: string; // ISO string
  endDate: string | null;
  openingBalance: number;
  closingBalance: number | null; // Calculated expected balance
  countedBalance: number | null; // User-inputted counted amount
}

export interface CashTransaction {
  id: string;
  sessionId: string;
  type: 'income' | 'expense';
  amount: number;
  reason: string;
  date: string; // ISO string
}


export enum View {
  Dashboard = 'dashboard',
  Inventory = 'inventory',
  Sales = 'sales',
  POS = 'pos',
  Settings = 'settings',
  Users = 'users',
  CashRegister = 'cash_register'
}
