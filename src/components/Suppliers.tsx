import React, { useState } from 'react';
import type { Supplier } from '../types';
import { SupplierFormModal } from './SupplierFormModal';

interface SuppliersProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAddSupplier, onUpdateSupplier, onDeleteSupplier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSave = (supplierData: Supplier | Omit<Supplier, 'id'>) => {
    if ('id' in supplierData) {
      onUpdateSupplier(supplierData as Supplier);
    } else {
      onAddSupplier(supplierData);
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Proveedores</h2>
        <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Agregar Proveedor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">RUT</th>
              <th scope="col" className="px-6 py-3">Contacto</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                <td className="px-6 py-4">{supplier.rut}</td>
                <td className="px-6 py-4">{supplier.contactPerson}</td>
                <td className="px-6 py-4">{supplier.phone}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(supplier)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => onDeleteSupplier(supplier.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <SupplierFormModal supplier={editingSupplier} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
