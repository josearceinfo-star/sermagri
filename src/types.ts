export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: Role;
  password?: string; // Should be hashed in a real app
}

export interface Client {
  id:string;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  rut: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number; // Cost at the time of purchase
}

export interface Purchase {
  id: string;
  supplierId: string;
  date: string; // ISO string
  items: PurchaseItem[];
  total: number;
}

export interface CompanyInfo {
    name: string;
    rut: string;
    address: string;
    phone: string;
    website: string;
}

export interface SmtpConfig {
    server: string;
    port: number;
    user: string;
    pass: string; // Should be encrypted
}

export interface PrinterConfig {
    paperSize: '80mm' | '58mm';
    connectionType: 'browser' | 'usb';
    selectedPrinterId?: string; // ID or name of the selected USB printer
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
  clientId?: string;
  paymentMethod: string;
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
  Purchases = 'purchases',
  Clients = 'clients',
  Suppliers = 'suppliers',
  Reports = 'reports',
  Users = 'users',
  Settings = 'settings',
  CashRegister = 'cash_register'
}
