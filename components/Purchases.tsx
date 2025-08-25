import React, { useState } from 'react';
import type { Purchase, Supplier, Product, PurchaseItem } from '../types';
import { SupplierFormModal } from './SupplierFormModal';

const PurchaseFormModal: React.FC<{
    suppliers: Supplier[];
    products: Product[];
    onSave: (purchase: Omit<Purchase, 'id'>) => void;
    onClose: () => void;
    onAddSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
}> = ({ suppliers, products, onSave, onClose, onAddSupplier }) => {
    const [supplierId, setSupplierId] = useState('');
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

    const addItem = (product: Product) => {
        const existing = items.find(i => i.productId === product.id);
        if (!existing) {
            setItems(prevItems => [...prevItems, { productId: product.id, quantity: 1, costPrice: product.costPrice }]);
        }
        setProductSearch('');
    }
    
    const updateItem = (productId: string, field: 'quantity' | 'costPrice', value: number) => {
        setItems(items.map(i => i.productId === productId ? { ...i, [field]: value } : i));
    }

    const removeItem = (productId: string) => {
        setItems(items.filter(i => i.productId !== productId));
    }
    
    const handleSaveNewSupplier = (newSupplierData: Supplier | Omit<Supplier, 'id'>) => {
        if (!('id' in newSupplierData)) {
            const newSupplier = onAddSupplier(newSupplierData);
            setSupplierId(newSupplier.id);
        }
        setIsSupplierModalOpen(false);
    };

    const total = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId || items.length === 0) return;
        onSave({
            supplierId,
            date: new Date().toISOString(),
            items,
            total,
        });
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl max-h-[90vh] flex flex-col">
                    <div className="flex items-start justify-between pb-4 border-b rounded-t">
                      <h3 className="text-xl font-semibold text-gray-900">
                          Registrar Nueva Compra
                      </h3>
                      <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Cerrar modal">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden space-y-4 pt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                            <div className="flex items-center gap-2 mt-1">
                                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="flex-grow block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required>
                                    <option value="">-- Seleccione un Proveedor --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rut})</option>)}
                                </select>
                                <button type="button" onClick={() => setIsSupplierModalOpen(true)} className="flex-shrink-0 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm">
                                    + Nuevo
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                            {/* Product Search Column */}
                            <div className="flex flex-col space-y-2 overflow-hidden">
                               <h4 className="text-lg font-medium text-gray-800">1. Buscar Productos</h4>
                               <input type="text" placeholder="Escriba para buscar..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                                <div className="flex-1 border rounded-lg overflow-y-auto">
                                    <ul className="divide-y divide-gray-200">
                                        {filteredProducts.map(p => (
                                            <li key={p.id} onClick={() => addItem(p)} className="p-3 hover:bg-green-100 cursor-pointer flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-800">{p.name}</p>
                                                    <p className="text-xs text-gray-600">Costo Actual: ${p.costPrice.toLocaleString('es-CL')}</p>
                                                </div>
                                                <span className="text-sm text-gray-500">Stock: {p.stock}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Items List Column */}
                            <div className="flex flex-col space-y-2 overflow-hidden">
                                 <h4 className="text-lg font-medium text-gray-800">2. Ítems en la Compra</h4>
                                <div className="flex-1 overflow-y-auto border rounded-lg p-2 space-y-2 bg-gray-50">
                                    {items.length === 0 ? <p className="text-center text-gray-500 py-4">Agregue productos desde la lista.</p> : items.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <div key={item.productId} className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-gray-800">{product?.name}</p>
                                                    <p className="text-xs text-gray-500">Subtotal: ${(item.costPrice * item.quantity).toLocaleString('es-CL')}</p>
                                                </div>
                                                <input type="number" placeholder="Costo" value={item.costPrice} onChange={e => updateItem(item.productId, 'costPrice', parseFloat(e.target.value) || 0)} className="w-24 p-1 border rounded text-center" />
                                                <input type="number" placeholder="Cant." value={item.quantity} onChange={e => updateItem(item.productId, 'quantity', parseInt(e.target.value) || 0)} className="w-16 p-1 border rounded text-center" />
                                                <button type="button" onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 space-x-2 border-t border-gray-200 rounded-b">
                            <span className="text-xl font-bold text-gray-800">Total Compra: ${total.toLocaleString('es-CL')}</span>
                            <div className="space-x-2">
                                <button type="button" onClick={onClose} className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Cancelar</button>
                                <button type="submit" className="py-2.5 px-5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300">Guardar Compra</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {isSupplierModalOpen && (
                <SupplierFormModal 
                    onSave={handleSaveNewSupplier}
                    onClose={() => setIsSupplierModalOpen(false)}
                />
            )}
        </>
    );
}

interface PurchasesProps {
  purchases: Purchase[];
  suppliers: Supplier[];
  products: Product[];
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
}

export const Purchases: React.FC<PurchasesProps> = ({ purchases, suppliers, products, onAddPurchase, onAddSupplier }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || 'N/A';
    
    const handleSave = (purchaseData: Omit<Purchase, 'id'>) => {
        onAddPurchase(purchaseData);
        setIsModalOpen(false);
    }
  
    return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Compras a Proveedores</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Registrar Compra
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">ID Compra</th>
                <th scope="col" className="px-6 py-3">Fecha</th>
                <th scope="col" className="px-6 py-3">Proveedor</th>
                <th scope="col" className="px-6 py-3">N° Items</th>
                <th scope="col" className="px-6 py-3">Total</th>
            </tr>
            </thead>
            <tbody>
            {purchases.map(purchase => (
                <tr key={purchase.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{purchase.id}</td>
                    <td className="px-6 py-4">{new Date(purchase.date).toLocaleString('es-CL')}</td>
                    <td className="px-6 py-4">{getSupplierName(purchase.supplierId)}</td>
                    <td className="px-6 py-4">{purchase.items.length}</td>
                    <td className="px-6 py-4 font-semibold">${purchase.total.toLocaleString('es-CL')}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
      {isModalOpen && <PurchaseFormModal suppliers={suppliers} products={products} onSave={handleSave} onClose={() => setIsModalOpen(false)} onAddSupplier={onAddSupplier} />}
    </div>
  );
};