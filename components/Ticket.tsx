
import React, { forwardRef } from 'react';
import type { Sale, Product } from '../types';

interface TicketProps {
  sale: Sale;
  products: Product[];
}

export const Ticket = forwardRef<HTMLDivElement, TicketProps>(({ sale, products }, ref) => {
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'N/A';
  const subtotal = sale.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const iva = subtotal * 0.19;

  return (
      <div ref={ref} id="ticket-to-print" className="w-[80mm] mx-auto p-4 font-mono text-xs text-black bg-white">
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">Sermagri</h1>
          <p>RUT: 76.123.456-7</p>
          <p>Av. Siempre Viva 742, Santiago</p>
          <p>www.sermagri.cl</p>
        </div>
        <div className="border-t border-b border-dashed border-black py-1 mb-2">
            <p>BOLETA ELECTRÓNICA</p>
            <div className="flex justify-between">
                <span>N°: {sale.id.replace('SALE-', '')}</span>
                <span>Fecha: {new Date(sale.date).toLocaleDateString('es-CL')}</span>
            </div>
             <div className="flex justify-between">
                <span>Hora: {new Date(sale.date).toLocaleTimeString('es-CL')}</span>
            </div>
        </div>
        <table className="w-full">
            <thead>
                <tr>
                    <th className="text-left">CANT</th>
                    <th className="text-left">DESCRIPCIÓN</th>
                    <th className="text-right">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {sale.items.map(item => (
                    <tr key={item.productId}>
                        <td className="align-top">{item.quantity}</td>
                        <td>
                            {getProductName(item.productId)}
                            <br/>
                            <span className="ml-2">@ ${item.price.toLocaleString('es-CL')}</span>
                        </td>
                        <td className="text-right align-top">${(item.quantity * item.price).toLocaleString('es-CL')}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="border-t border-dashed border-black mt-4 pt-2">
            <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
                <span>IVA (19%):</span>
                <span>${iva.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
             <div className="flex justify-between font-bold text-sm mt-1">
                <span>TOTAL A PAGAR:</span>
                <span>${sale.total.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
        </div>
        
        <div className="text-center mt-6">
            <p>¡Gracias por su compra!</p>
            <p className="mt-2 text-[8px]">Resolución SII N° xxxxxx del xx.xx.xxxx</p>
        </div>
      </div>
  );
});
