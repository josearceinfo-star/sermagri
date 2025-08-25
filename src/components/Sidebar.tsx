import React from 'react';
import { View, Role } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  userRole: Role;
}

const NavIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole }) => {
    
  const baseNavItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m-2-1.5V21a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0018 21V16.5m-7.5 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A1.125 1.125 0 016 7.5h1.5a3.375 3.375 0 003.375-3.375V3.75z" },
    { view: View.POS, label: 'Nueva Venta', icon: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25V5.106c0-.621.504-1.125 1.125-1.125h4.25c.621 0 1.125.504 1.125 1.125v9.144M7.5 14.25h1.875a3.375 3.375 0 013.375 3.375v.375m-6.75-3.75h9.375" },
    { view: View.CashRegister, label: 'Caja', icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3.75-3.75M17.25 19.5l-3.75-3.75m0 0A2.25 2.25 0 0112 13.5h-1.5a2.25 2.25 0 01-2.25-2.25V7.5A2.25 2.25 0 0110.5 5.25h1.5a2.25 2.25 0 012.25 2.25v1.5m0 4.5h.008v.008h-.008v-.008z" },
    { view: View.Sales, label: 'Ventas', icon: "M16.5 18.75h-9a9.75 9.75 0 100-12.75h9a9.75 9.75 0 000 12.75zM16.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM16.5 18.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" },
    { view: View.Inventory, label: 'Inventario', icon: "M2.25 7.125A2.25 2.25 0 014.5 4.875h15A2.25 2.25 0 0121.75 7.125v1.518a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 8.643V7.125zM12 1.5A2.25 2.25 0 0114.25 3.75h-4.5A2.25 2.25 0 0112 1.5zM12 15a2.25 2.25 0 012.25 2.25h-4.5A2.25 2.25 0 0112 15zM4.5 19.125a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25v.375A2.25 2.25 0 0117.25 21.75H6.75A2.25 2.25 0 014.5 19.5v-.375z" },
    { view: View.Purchases, label: 'Compras', icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
    { view: View.Clients, label: 'Clientes', icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 3.375c-1.621 0-3.074.49-4.398 1.368M12 3.375c1.621 0 3.074.49 4.398 1.368M12 3.375V9.75" },
    { view: View.Suppliers, label: 'Proveedores', icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-1.085 19.904 19.904 0 00-4.476 0 2.056 2.056 0 00-1.58 1.085 17.902 17.902 0 00-3.213 9.193c-.04.62.469 1.124 1.09 1.124h1.125" },
  ];

  const adminNavItems = [
    { view: View.Reports, label: 'Reportes', icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { view: View.Users, label: 'Usuarios', icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72M13.5 18.72a9.094 9.094 0 013.741-.479m-7.512 2.72c-1.017-.146-2.012-.428-2.953-.852a3 3 0 01-4.682-2.72m8.646-1.59c-1.017-.146-2.012-.428-2.953-.852m11.566 2.72c-1.017-.146-2.012-.428-2.953-.852" },
    { view: View.Settings, label: 'Configuración', icon: "M9.594 3.94c.09-.542.56-1.007 1.11-1.226a2.25 2.25 0 012.58 1.226c.345.675.246 1.523.04 2.122a2.25 2.25 0 01-1.294 1.294c-.6.205-1.447.305-2.122.04a2.25 2.25 0 01-1.226-2.58zM12 18a6 6 0 100-12 6 6 0 000 12z" },
  ];

  const navItems = userRole === 'admin' ? [...baseNavItems.slice(0, 1), adminNavItems[0], ...baseNavItems.slice(1), ...adminNavItems.slice(1)] : baseNavItems;

  const getNavItemClass = (view: View) => {
    const baseClass = "flex items-center px-4 py-3 text-white hover:bg-green-700 transition-colors duration-200 rounded-md";
    return currentView === view ? `${baseClass} bg-green-700 font-semibold` : baseClass;
  };
    
  return (
    <div className="flex flex-col w-64 bg-gray-800 print:hidden">
      <div className="flex items-center justify-center h-20 shadow-md bg-gray-900">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 008.625-5.336 9.002 9.002 0 00-17.25 0A9.002 9.002 0 0012 21z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.313 0-6 2.687-6 6 0 2.25 1.233 4.211 3 5.252" />
        </svg>
        <h1 className="text-2xl font-bold text-white">Sermagri Riego</h1>
      </div>
      <ul className="flex flex-col py-4 px-2 space-y-2">
        {navItems.map(item => (
            <li key={item.view}>
                <button onClick={() => setView(item.view)} className={`${getNavItemClass(item.view)} w-full text-left`}>
                    <NavIcon icon={item.icon} />
                    <span className="mx-4">{item.label}</span>
                </button>
            </li>
        ))}
      </ul>
    </div>
  );
};
