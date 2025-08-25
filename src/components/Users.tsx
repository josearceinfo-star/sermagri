import React, { useState } from 'react';
import type { User, Role } from '../types';

interface UserFormModalProps {
  user?: User | null;
  onSave: (user: User | Omit<User, 'id'>) => void;
  onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'user',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave({ ...user, name: formData.name, role: formData.role as Role });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{user ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="user">Vendedor</option>
                <option value="admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{user ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500" required={!user} />
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


interface UsersProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const Users: React.FC<UsersProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (userData: User | Omit<User, 'id'>) => {
    if ('id' in userData) {
      onUpdateUser(userData as User);
    } else {
      onAddUser(userData);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
        <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center font-semibold shadow-sm hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Agregar Usuario
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID Usuario</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Rol</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 capitalize">{user.role === 'admin' ? 'Administrador' : 'Vendedor'}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => { if(window.confirm('¿Está seguro de eliminar este usuario?')) onDeleteUser(user.id) }} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <UserFormModal user={editingUser} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
