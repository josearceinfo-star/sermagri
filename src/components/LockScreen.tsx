import React, { useState, FormEvent } from 'react';
import type { User } from '../types';

interface LockScreenProps {
  currentUser: User;
  users: User[];
  onUnlock: (user: User, passwordAttempt: string) => boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({ currentUser, users, onUnlock }) => {
  const [selectedUser, setSelectedUser] = useState<User>(currentUser);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onUnlock(selectedUser, password);
    if (!success) {
      setError('Contraseña incorrecta. Inténtelo de nuevo.');
      setPassword('');
    }
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setPassword('');
    setError('');
    setIsSwitchingUser(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {isSwitchingUser ? (
            <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar Usuario</h2>
                <div className="space-y-3">
                    {users.map(user => (
                        <button 
                            key={user.id} 
                            onClick={() => handleUserSelect(user)}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mr-4 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-gray-700 text-left">{user.name}</p>
                                <p className="text-sm text-gray-500 capitalize text-left">{user.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </>
        ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedUser.name}</h2>
                <p className="text-gray-600 mb-6">La sesión está bloqueada.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center bg-white text-gray-900"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-transform transform hover:scale-105"
                    >
                        Desbloquear
                    </button>
                </form>
                <div className="mt-6">
                    <button onClick={() => setIsSwitchingUser(true)} className="text-sm text-green-600 hover:underline">
                        Cambiar de Usuario
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
