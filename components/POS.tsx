
import React, { useState, useMemo } from 'react';
import type { Product, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  onCreateSale: (items: SaleItem[], total: number) => void;
  isCashRegisterOpen: boolean;
}

export const POS: React.FC<POSProps> = ({ products, onCreateSale, isCashRegisterOpen }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => 
    products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
    ), [products, searchTerm]
  );
  
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (product.stock > existingItem.quantity) {
          updateQuantity(product.id, existingItem.quantity + 1);
      }
    } else {
        if (product.stock > 0) {
            setCart([...cart, { productId: product.id, quantity: 1, price: product.price, costPrice: product.costPrice }]);
        }
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > 0 && quantity <= product.stock) {
      setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
    } else if (quantity === 0) {
      removeFromCart(productId);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const iva = subtotal * 0.19; // IVA Chile
  const total = subtotal + iva;
  
  const handleCreateSale = () => {
    if(cart.length === 0) return;
    onCreateSale(cart, total);
    setCart([]);
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  return (
    <div className="relative flex h-[calc(100vh-128px)] gap-6">
       {!isCashRegisterOpen && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-white text-2xl font-bold">La caja está cerrada</p>
          <p className="text-white text-lg">Por favor, abra la caja para comenzar a registrar ventas.</p>
        </div>
      )}
      {/* Product Selection */}
      <div className="w-3/5 bg-white p-4 rounded-lg shadow-md flex flex-col">
        <input 
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => addToCart(product)} className="border rounded-lg p-2 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow">
                <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md mb-2" />
                <p className="text-sm font-semibold text-gray-700">{product.name}</p>
                <p className="text-xs text-gray-600">Stock: {product.stock}</p>
                <p className="text-sm font-bold text-green-600">${product.price.toLocaleString('es-CL')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart/Sale Details */}
      <div className="w-2/5 bg-white p-4 rounded-lg shadow-md flex flex-col">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Venta Actual</h3>
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center mt-8">El carro está vacío.</p>
          ) : (
            cart.map(item => {
              const product = getProductById(item.productId);
              return (
                <div key={item.productId} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-semibold">{product?.name}</p>
                    <p className="text-sm text-gray-600">${item.price.toLocaleString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded-md text-center"
                    />
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>IVA (19%)</span>
            <span>${iva.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total</span>
            <span>${total.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <button 
            onClick={handleCreateSale}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-md mt-4 font-bold text-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
};