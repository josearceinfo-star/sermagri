import React, { useState } from 'react';
import type { Product } from '../types';

const ProductFormModal: React.FC<{
  product?: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onClose: () => void;
}> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            setFormData(prev => ({ ...prev, imageUrl: base64String }));
        };
        reader.readAsDataURL(file);
      }
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
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Compra</label>
                <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Venta</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
              <div className="mt-2 flex items-center space-x-4">
                  {imagePreview ? (
                      <img src={imagePreview} alt="Vista previa" className="h-16 w-16 object-cover rounded-md shadow-sm" />
                  ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                  )}
                  <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                  />
              </div>
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

const ImportModal: React.FC<{
    onClose: () => void;
    onImport: (products: Omit<Product, 'id'>[]) => void;
}> = ({ onClose, onImport }) => {
    const [parsedProducts, setParsedProducts] = useState<Omit<Product, 'id'>[]>([]);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError('');
        setParsedProducts([]);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            try {
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                const headers = lines[0].split(',').map(h => h.trim());
                // Expecting: name,category,price,costPrice,stock
                if(headers.length < 5 || !['name', 'category', 'price', 'costPrice', 'stock'].every(h => headers.includes(h))) {
                    throw new Error('Cabeceras de CSV inválidas. Se esperan: name,category,price,costPrice,stock');
                }

                const products = lines.slice(1).map((line, index) => {
                    const data = line.split(',');
                    const productData = headers.reduce((obj, header, i) => {
                        obj[header] = data[i];
                        return obj;
                    }, {} as any);

                    const product: Omit<Product, 'id'> = {
                        name: productData.name,
                        category: productData.category,
                        price: parseFloat(productData.price),
                        costPrice: parseFloat(productData.costPrice),
                        stock: parseInt(productData.stock, 10),
                        imageUrl: '',
                    };
                    if (isNaN(product.price) || isNaN(product.costPrice) || isNaN(product.stock)) {
                        throw new Error(`Datos inválidos en la fila ${index + 2}.`);
                    }
                    return product;
                });
                setParsedProducts(products);
            } catch (err: any) {
                setError(err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleImport = () => {
        if (parsedProducts.length > 0) {
            onImport(parsedProducts);
            onClose();
        }
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Importar Productos desde CSV</h2>
                <p className="text-sm text-gray-600 mb-4">Seleccione un archivo CSV con las columnas: <strong>name,category,price,costPrice,stock</strong>. La primera fila debe ser la cabecera.</p>
                
                <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer mb-4" />
                
                {error && <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
                
                {parsedProducts.length > 0 && (
                    <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                             <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Nombre</th>
                                    <th className="px-4 py-2">Categoría</th>
                                    <th className="px-4 py-2">Precio</th>
                                    <th className="px-4 py-2">Costo</th>
                                    <th className="px-4 py-2">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedProducts.map((p, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="px-4 py-2">{p.name}</td>
                                        <td className="px-4 py-2">{p.category}</td>
                                        <td className="px-4 py-2">${p.price.toLocaleString('es-CL')}</td>
                                        <td className="px-4 py-2">${p.costPrice.toLocaleString('es-CL')}</td>
                                        <td className="px-4 py-2">{p.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <p className="text-sm text-gray-600 mt-2">{parsedProducts.length} productos listos para importar.</p>


                <div className="flex justify-end space-x-4 pt-6">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleImport} disabled={parsedProducts.length === 0 || !!error} className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                        Importar {parsedProducts.length > 0 ? parsedProducts.length : ''} Productos
                    </button>
                </div>
            </div>
        </div>
    )
};


interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onImportProducts: (products: Omit<Product, 'id'>[]) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onImportProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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
        <div className="flex items-center gap-4">
            <button onClick={() => setIsImportModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Importar desde CSV
            </button>
            <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Agregar Producto
            </button>
        </div>
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
                    <td className={`px-6 py-4 font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>{product.stock}</td>
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
      {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} onImport={onImportProducts} />}
    </div>
  );
};
