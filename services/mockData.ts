import type { Product, Sale, User, Client, Supplier, Purchase } from '../types';

export const mockProducts: Product[] = [
  { id: 'PROD-001', name: 'Cinta de Goteo 16mm (Rollo 100m)', category: 'Riego por Goteo', price: 25000, costPrice: 18500, stock: 150, imageUrl: 'https://picsum.photos/seed/driptape/200' },
  { id: 'PROD-002', name: 'Gotero Autocompensante 4 L/h', category: 'Goteros', price: 150, costPrice: 90, stock: 10000, imageUrl: 'https://picsum.photos/seed/dripper/200' },
  { id: 'PROD-003', name: 'Filtro de Malla 1" 120 Mesh', category: 'Filtración', price: 18000, costPrice: 12000, stock: 80, imageUrl: 'https://picsum.photos/seed/filter/200' },
  { id: 'PROD-004', name: 'Válvula de Bola PVC 1"', category: 'Válvulas', price: 3500, costPrice: 2100, stock: 200, imageUrl: 'https://picsum.photos/seed/valve/200' },
  { id: 'PROD-005', name: 'Tubería HDPE 32mm (PN10)', category: 'Tuberías', price: 1800, costPrice: 1100, stock: 500, imageUrl: 'https://picsum.photos/seed/pipe/200' },
  { id: 'PROD-006', name: 'Programador de Riego Autónomo', category: 'Automatización', price: 45000, costPrice: 33000, stock: 40, imageUrl: 'https://picsum.photos/seed/controller/200' },
  { id: 'PROD-007', name: 'Conector Inicial para Cinta 16mm', category: 'Conectores', price: 250, costPrice: 150, stock: 5000, imageUrl: 'https://picsum.photos/seed/connector/200' },
  { id: 'PROD-008', name: 'Bomba de Agua Periférica 0.5HP', category: 'Bombas', price: 55000, costPrice: 41000, stock: 30, imageUrl: 'https://picsum.photos/seed/pump/200' },
];

export const mockClients: Client[] = [
    { id: 'CLIENT-001', name: 'Agrícola Santa María', rut: '76.111.222-3', email: 'contacto@santamaria.cl', phone: '+56987654321', address: 'Fundo El Roble, Parcela 5, Colina' },
    { id: 'CLIENT-002', name: 'Juan Pérez', rut: '15.222.333-4', email: 'juan.perez@email.com', phone: '+56912345678', address: 'Av. Providencia 123, Santiago' },
];

export const mockSuppliers: Supplier[] = [
    { id: 'SUP-001', name: 'Importadora RiegoMax', rut: '77.333.444-5', contactPerson: 'Carlos Rodríguez', phone: '+56223456789', email: 'ventas@riegomax.cl'},
    { id: 'SUP-002', name: 'Plásticos del Sur S.A.', rut: '78.555.666-7', contactPerson: 'Ana López', phone: '+56229876543', email: 'ana.lopez@plasticossur.cl'},
];

export const mockPurchases: Purchase[] = [
    {
        id: 'PUR-001',
        supplierId: 'SUP-001',
        date: '2023-10-20T09:00:00Z',
        items: [
            { productId: 'PROD-001', quantity: 50, costPrice: 18000 },
            { productId: 'PROD-002', quantity: 5000, costPrice: 85 },
        ],
        total: 1325000,
    }
];


export const mockSales: Sale[] = [
  {
    id: 'SALE-001',
    date: '2023-10-26T10:30:00Z',
    items: [
      { productId: 'PROD-001', quantity: 1, price: 25000, costPrice: 18500 },
      { productId: 'PROD-007', quantity: 50, price: 250, costPrice: 150 },
      { productId: 'PROD-004', quantity: 2, price: 3500, costPrice: 2100 },
    ],
    total: 44500,
    clientId: 'CLIENT-001',
    paymentMethod: 'debito',
  },
  {
    id: 'SALE-002',
    date: '2023-10-26T11:45:00Z',
    items: [
      { productId: 'PROD-002', quantity: 200, price: 150, costPrice: 90 },
    ],
    total: 30000,
    clientId: 'CLIENT-002',
    paymentMethod: 'efectivo',
  },
  {
    id: 'SALE-003',
    date: '2023-10-25T15:00:00Z',
    items: [
      { productId: 'PROD-003', quantity: 1, price: 18000, costPrice: 12000 },
      { productId: 'PROD-005', quantity: 20, price: 1800, costPrice: 1100 },
      { productId: 'PROD-008', quantity: 1, price: 55000, costPrice: 41000 },
    ],
    total: 109000,
    paymentMethod: 'credito',
  }
];

export const mockUsers: User[] = [
    { id: 'USER-001', name: 'Administrador', role: 'admin', password: 'admin' },
    { id: 'USER-002', name: 'Vendedor Ejemplo', role: 'user', password: 'user' },
];