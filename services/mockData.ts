
import type { Product, Sale, User } from '../types';

export const mockProducts: Product[] = [
  { id: 'PROD-001', name: 'Fertilizante Nitro Full', category: 'Fertilizantes', price: 15000, costPrice: 9500, stock: 120, imageUrl: 'https://picsum.photos/seed/fertilizer/200' },
  { id: 'PROD-002', name: 'Semillas de Maíz Híbrido', category: 'Semillas', price: 25000, costPrice: 18000, stock: 80, imageUrl: 'https://picsum.photos/seed/corn/200' },
  { id: 'PROD-003', name: 'Herbicida Selectivo "Maleza Cero"', category: 'Pesticidas', price: 22500, costPrice: 15000, stock: 200, imageUrl: 'https://picsum.photos/seed/herbicide/200' },
  { id: 'PROD-004', name: 'Riego por Goteo Kit Básico', category: 'Riego', price: 45000, costPrice: 32000, stock: 50, imageUrl: 'https://picsum.photos/seed/irrigation/200' },
  { id: 'PROD-005', name: 'Guantes de Trabajo Reforzados', category: 'Herramientas', price: 8000, costPrice: 4500, stock: 150, imageUrl: 'https://picsum.photos/seed/gloves/200' },
  { id: 'PROD-006', name: 'Pala de Punta Redonda', category: 'Herramientas', price: 12000, costPrice: 7000, stock: 95, imageUrl: 'https://picsum.photos/seed/shovel/200' },
  { id: 'PROD-007', name: 'Sustrato Premium 50L', category: 'Sustratos', price: 18000, costPrice: 11500, stock: 110, imageUrl: 'https://picsum.photos/seed/soil/200' },
  { id: 'PROD-008', name: 'Fungicida "Hongo Stop"', category: 'Pesticidas', price: 19500, costPrice: 13000, stock: 75, imageUrl: 'https://picsum.photos/seed/fungicide/200' },
];

export const mockSales: Sale[] = [
  {
    id: 'SALE-001',
    date: '2023-10-26T10:30:00Z',
    items: [
      { productId: 'PROD-001', quantity: 2, price: 15000, costPrice: 9500 },
      { productId: 'PROD-005', quantity: 1, price: 8000, costPrice: 4500 },
    ],
    total: 38000
  },
  {
    id: 'SALE-002',
    date: '2023-10-26T11:45:00Z',
    items: [
      { productId: 'PROD-002', quantity: 1, price: 25000, costPrice: 18000 },
    ],
    total: 25000
  },
  {
    id: 'SALE-003',
    date: '2023-10-25T15:00:00Z',
    items: [
      { productId: 'PROD-003', quantity: 1, price: 22500, costPrice: 15000 },
      { productId: 'PROD-006', quantity: 2, price: 12000, costPrice: 7000 },
      { productId: 'PROD-007', quantity: 1, price: 18000, costPrice: 11500 },
    ],
    total: 64500
  }
];

export const mockUsers: User[] = [
    { id: 'USER-001', name: 'Administrador', role: 'admin', password: 'admin' },
    { id: 'USER-002', name: 'Vendedor Ejemplo', role: 'user', password: 'user' },
];
