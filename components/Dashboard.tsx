
import React from 'react';
import type { Product, Sale, CashRegisterSession } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  activeSession: CashRegisterSession | null;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ title, value, icon, color = 'green' }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`bg-${color}-100 p-3 rounded-full`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ sales, products, activeSession }) => {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalSales = sales.length;
  const totalProducts = products.length;

  const totalGrossProfit = sales.reduce((totalProfit, sale) => {
    const saleProfit = sale.items.reduce((itemProfit, item) => {
        return itemProfit + (item.price - item.costPrice) * item.quantity;
    }, 0);
    return totalProfit + saleProfit;
  }, 0);
  
  const cashStatus = activeSession && !activeSession.endDate 
    ? { title: "Caja Abierta", value: "Activa", icon: <CashOpenIcon />, color: "green" }
    : { title: "Caja Cerrada", value: "Inactiva", icon: <CashClosedIcon />, color: "red" };

  const salesData = sales.slice(0, 10).map(s => ({
      name: new Date(s.date).toLocaleDateString('es-CL'),
      Ventas: s.total,
  })).reverse();


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ingresos Totales" value={`$${totalRevenue.toLocaleString('es-CL')}`} icon={<CashIcon />} />
        <StatCard title="Ganancia Bruta Total" value={`$${totalGrossProfit.toLocaleString('es-CL')}`} icon={<ProfitIcon />} color="blue"/>
        <StatCard title="Productos en Inventario" value={totalProducts} icon={<InventoryIcon />} />
        <StatCard title={cashStatus.title} value={cashStatus.value} icon={cashStatus.icon} color={cashStatus.color} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Últimas Ventas ({totalSales} en total)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('es-CL')}`, 'Venta']} />
            <Legend />
            <Bar dataKey="Ventas" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5A6.5 6.5 0 1012 5.5a6.5 6.5 0 000 13z" />
    </svg>
);

const ProfitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);


const InventoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const CashOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

const CashClosedIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);