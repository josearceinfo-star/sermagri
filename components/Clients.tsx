import React, { useState } from 'react';
import type { Client } from '../types';

const ClientFormModal: React.FC<{
  client?: Client | null;
  onSave: (client: Client | Omit<Client, 'id'>) => void;
  onClose: () => void;
}> = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    rut: client?.rut || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      onSave({ ...client, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-labelledby="client-modal-title" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex items-start justify-between pb-4 border-b rounded-t">
          <h3 id="client-modal-title" className="text-xl font-semibold text-gray-900">
              {client ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Cerrar modal">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo o Razón Social</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">RUT</label>
            <input type="text" name="rut" value={formData.rut} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="flex items-center justify-end pt-4 space-x-2 border-t border-gray-200 rounded-b">
            <button type="button" onClick={onClose} className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Cancelar</button>
            <button type="submit" className="py-2.5 px-5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300">Guardar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};


interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleAddNew = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSave = (clientData: Client | Omit<Client, 'id'>) => {
    if ('id' in clientData) {
      onUpdateClient(clientData as Client);
    } else {
      onAddClient(clientData);
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Clientes</h2>
        <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Agregar Cliente
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">RUT</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4">{client.rut}</td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4">{client.phone}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => onDeleteClient(client.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <ClientFormModal client={editingClient} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
