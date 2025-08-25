import React, { useState } from 'react';
import type { Sale, Product, Client } from '../types';

interface SalesProps {
  sales: Sale[];
  products: Product[];
  clients: Client[];
  onPrintSale: (sale: Sale) => void;
}

const SaleDetailModal: React.FC<{ sale: Sale; products: Product[]; clientName: string; onClose: () => void }> = ({ sale, products, clientName, onClose }) => {
    const findProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Producto Desconocido';
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Detalle de Venta - {sale.id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                </div>
                <div className="mb-4 space-y-1 text-sm">
                    <p><span className="font-semibold text-gray-600">Fecha:</span> {new Date(sale.date).toLocaleString('es-CL')}</p>
                    <p><span className="font-semibold text-gray-600">Cliente:</span> {clientName}</p>
                    <p><span className="font-semibold text-gray-600">Método de Pago:</span> <span className="capitalize">{sale.paymentMethod}</span></p>
                </div>

                <div className="border-t border-b py-2 max-h-64 overflow-y-auto">
                    {sale.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-semibold text-gray-800">{findProductName(item.productId)}</p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity} x ${item.price.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <p className="font-semibold text-gray-800">${(item.quantity * item.price).toLocaleString('es-CL')}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end items-center mt-4 pt-4 border-t">
                    <span className="text-lg font-bold text-gray-700">Total:</span>
                    <span className="text-lg font-bold text-gray-900 ml-4">${sale.total.toLocaleString('es-CL')}</span>
                </div>
                 <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export const Sales: React.FC<SalesProps> = ({ sales, products, clients, onPrintSale }) => {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const getClientName = (clientId?: string) => {
      if (!clientId) return 'Cliente General';
      return clients.find(c => c.id === clientId)?.name || 'Cliente Desconocido';
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Ventas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID Venta</th>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">N° de Items</th>
              <th scope="col" className="px-6 py-3">Método Pago</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{sale.id}</td>
                <td className="px-6 py-4">{new Date(sale.date).toLocaleString('es-CL')}</td>
                <td className="px-6 py-4">{getClientName(sale.clientId)}</td>
                <td className="px-6 py-4">{sale.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                <td className="px-6 py-4 capitalize">{sale.paymentMethod}</td>
                <td className="px-6 py-4 font-semibold">${sale.total.toLocaleString('es-CL')}</td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button onClick={() => setSelectedSale(sale)} className="text-blue-600 hover:text-blue-800 font-medium">Ver Detalles</button>
                  <button onClick={() => onPrintSale(sale)} className="text-green-600 hover:text-green-800 font-medium">Imprimir Boleta</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedSale && <SaleDetailModal sale={selectedSale} products={products} clientName={getClientName(selectedSale.clientId)} onClose={() => setSelectedSale(null)} />}
    </div>
  );
};
