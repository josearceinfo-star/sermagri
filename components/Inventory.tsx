
import React, { useState } from 'react';
import type { Product } from '../types';

interface ProductFormModalProps {
  product?: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || 'https://picsum.photos/200'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...product, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Compra</label>
                <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Venta</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transition-shadow">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (productData: Product | Omit<Product, 'id'>) => {
    if ('id' in productData) {
      onUpdateProduct(productData as Product);
    } else {
      onAddProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Inventario</h2>
        <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Agregar Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Precio Compra</th>
              <th scope="col" className="px-6 py-3">Precio Venta</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Margen ($)</th>
              <th scope="col" className="px-6 py-3">Margen (%)</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
                const marginValue = product.price - product.costPrice;
                const marginPercentage = product.price > 0 ? (marginValue / product.price) * 100 : 0;
                return (
                  <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">${product.costPrice.toLocaleString('es-CL')}</td>
                    <td className="px-6 py-4 font-semibold">${product.price.toLocaleString('es-CL')}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className={`px-6 py-4 font-semibold ${marginValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${marginValue.toLocaleString('es-CL')}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${marginValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {marginPercentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">Editar</button>
                      <button onClick={() => onDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && <ProductFormModal product={editingProduct} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
