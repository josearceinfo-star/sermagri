
import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Configuración de Impresión</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="thermalPrinter" className="block text-sm font-medium text-gray-700">Impresora Térmica (para boletas)</label>
            <select id="thermalPrinter" name="thermalPrinter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
              <option>Impresora PDF (por defecto)</option>
              <option>HP LaserJet</option>
              <option>Epson TM-T20II</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">Seleccione la impresora predeterminada para tickets. La selección final se realiza en el diálogo de impresión del navegador.</p>
          </div>
          <div>
            <label htmlFor="defaultPrinter" className="block text-sm font-medium text-gray-700">Impresora Estándar (para reportes)</label>
            <select id="defaultPrinter" name="defaultPrinter" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
              <option>Impresora PDF (por defecto)</option>
              <option>HP LaserJet</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Integración SII (Servicio de Impuestos Internos)</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Esta sección es para configurar la firma electrónica y la emisión de boletas/facturas electrónicas. Se requiere contratar un proveedor de servicios autorizado por el SII.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key del Proveedor</label>
            <input type="password" id="apiKey" name="apiKey" placeholder="************" disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 cursor-not-allowed"/>
          </div>
          <div>
            <label htmlFor="apiUser" className="block text-sm font-medium text-gray-700">Usuario API</label>
            <input type="text" id="apiUser" name="apiUser" placeholder="No configurado" disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 cursor-not-allowed"/>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">Estado de la conexión: <span className="text-red-600 font-semibold">No conectado</span></span>
            <button disabled className="py-2 px-4 bg-gray-400 text-white rounded-md cursor-not-allowed">Probar Conexión</button>
          </div>
        </div>
      </div>
    </div>
  );
};
