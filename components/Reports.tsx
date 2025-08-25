import React, { useMemo } from 'react';
import type { Sale, Product } from '../types';

interface ReportsProps {
  sales: Sale[];
  products: Product[];
}

const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

export const Reports: React.FC<ReportsProps> = ({ sales, products }) => {

    const { topSold, bottomSold, revenue, cogs, profit } = useMemo(() => {
        const productSales = new Map<string, { quantity: number; revenue: number }>();
        let totalRevenue = 0;
        let totalCogs = 0;

        sales.forEach(sale => {
            totalRevenue += sale.total;
            sale.items.forEach(item => {
                totalCogs += item.costPrice * item.quantity;
                const current = productSales.get(item.productId) || { quantity: 0, revenue: 0 };
                current.quantity += item.quantity;
                current.revenue += item.price * item.quantity;
                productSales.set(item.productId, current);
            });
        });

        const sortedProducts = Array.from(productSales.entries())
            .map(([productId, data]) => ({
                product: products.find(p => p.id === productId),
                ...data,
            }))
            .filter(p => p.product)
            .sort((a, b) => b.quantity - a.quantity);

        return {
            topSold: sortedProducts.slice(0, 5),
            bottomSold: sortedProducts.slice(-5).reverse(),
            revenue: totalRevenue,
            cogs: totalCogs,
            profit: totalRevenue - totalCogs,
        };
    }, [sales, products]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Reportes de Gestión</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReportCard title="Ingresos Totales">
                    <p className="text-3xl font-bold text-green-600">${revenue.toLocaleString('es-CL')}</p>
                </ReportCard>
                 <ReportCard title="Costo de Ventas (COGS)">
                    <p className="text-3xl font-bold text-orange-600">${cogs.toLocaleString('es-CL')}</p>
                </ReportCard>
                 <ReportCard title="Ganancia Bruta">
                    <p className="text-3xl font-bold text-blue-600">${profit.toLocaleString('es-CL')}</p>
                </ReportCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard title="Productos Más Vendidos (por unidad)">
                    <ul className="space-y-3">
                        {topSold.map(({ product, quantity }) => (
                            <li key={product!.id} className="flex justify-between items-center">
                                <span className="text-gray-800">{product!.name}</span>
                                <span className="font-semibold text-gray-900">{quantity} unidades</span>
                            </li>
                        ))}
                    </ul>
                </ReportCard>
                <ReportCard title="Productos Menos Vendidos (por unidad)">
                    <ul className="space-y-3">
                        {bottomSold.map(({ product, quantity }) => (
                            <li key={product!.id} className="flex justify-between items-center">
                                <span className="text-gray-800">{product!.name}</span>
                                <span className="font-semibold text-gray-900">{quantity} unidades</span>
                            </li>
                        ))}
                    </ul>
                </ReportCard>
            </div>
        </div>
    );
};