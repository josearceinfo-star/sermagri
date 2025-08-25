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
        
        <div className="text-center mt-6 flex flex-col items-center">
            <p className="font-semibold">¡Gracias por su compra!</p>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 my-2" viewBox="0 0 256 256">
                <path fill="black" d="M140 140h28v28h-28z"/>
                <path fill="black" d="M40 40h80v80H40zm10 10v60h60V50z"/>
                <path fill="black" d="M40 176h80v40H40zm10-30h60v20h-60z"/>
                <path fill="black" d="M176 40h40v80h-40zm30 70V50h-20v60z"/>
                <path fill="black" d="M152 204h24v-24h-24v-12h12v-12h12v24h24v-12h12v-12h-12v-12h-12v-12h-12v12h-12v12h12v12h-12v12h-12v12h12v12h-12v12h24v-12h-12v-12h12zm24-36h12v12h-12z"/>
            </svg>
            <p className="font-bold">Timbre Electrónico SII</p>
            <p className="mt-2 text-[8px]">Resolución SII N° 80 del 22/08/2014</p>
            <p className="text-[8px]">Verifique documento en www.sii.cl</p>
        </div>
      </div>
  );
});
