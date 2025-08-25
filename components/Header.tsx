
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, users, onSwitchUser }) => {

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === e.target.value);
    if (selectedUser) {
        onSwitchUser(selectedUser);
    }
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 print:hidden">
      <h2 className="text-2xl font-semibold text-gray-800">Sistema de Bodega y Ventas</h2>
      <div className="flex items-center space-x-4">
         <div className="relative">
            <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-1 bg-green-500 rounded-full"></span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
         </div>
        <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
                <span className="font-medium text-gray-700 block leading-tight">{currentUser.name}</span>
                <span className="text-sm text-gray-600 capitalize">{currentUser.role}</span>
            </div>
             <select onChange={handleUserChange} value={currentUser.id} className="ml-2 bg-transparent text-sm cursor-pointer focus:outline-none">
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
        </div>
      </div>
    </header>
  );
};