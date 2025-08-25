import React, { forwardRef } from 'react';
import type { Sale, Product, Client, CompanyInfo } from '../types';

interface TicketProps {
  sale: Sale;
  products: Product[];
  clients: Client[];
  companyInfo: CompanyInfo;
}

export const Ticket = forwardRef<HTMLDivElement, TicketProps>(({ sale, products, clients, companyInfo }, ref) => {
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'N/A';
  const subtotal = sale.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const iva = subtotal * 0.19;
  const client = sale.clientId ? clients.find(c => c.id === sale.clientId) : null;


  return (
      <div ref={ref} id="ticket-to-print" className="w-[80mm] mx-auto p-4 font-mono text-[10px] print:text-[10px] text-black bg-white">
        <div className="text-center mb-4">
          <h1 className="text-sm font-bold">{companyInfo.name}</h1>
          <p>RUT: {companyInfo.rut}</p>
          <p>{companyInfo.address}</p>
          <p>{companyInfo.website}</p>
        </div>
        {client && (
            <div className="text-left mb-2 border-t border-dashed border-black pt-1">
                <p><span className="font-semibold">CLIENTE:</span> {client.name}</p>
                <p><span className="font-semibold">RUT:</span> {client.rut}</p>
                <p><span className="font-semibold">DIRECCIÓN:</span> {client.address}</p>
            </div>
        )}
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
                <tr className="border-b border-dashed border-black">
                    <th className="text-left pb-1">CANT</th>
                    <th className="text-left pb-1">DESCRIPCIÓN</th>
                    <th className="text-right pb-1">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {sale.items.map(item => (
                    <tr key={item.productId} className="text-black text-[9px] align-top">
                        <td className="pr-1 py-0.5">{item.quantity}</td>
                        <td className="pr-1 py-0.5">
                            {getProductName(item.productId)}
                        </td>
                        <td className="text-right py-0.5">${(item.quantity * item.price).toLocaleString('es-CL')}</td>
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
             <div className="flex justify-between font-bold text-xs mt-1">
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