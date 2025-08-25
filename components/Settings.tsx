import React, { useState } from 'react';
import type { CompanyInfo, SmtpConfig, PrinterConfig } from '../types';

interface SettingsProps {
    companyInfo: CompanyInfo;
    onSaveCompanyInfo: (info: CompanyInfo) => void;
    smtpConfig: SmtpConfig;
    onSaveSmtpConfig: (config: SmtpConfig) => void;
    printerConfig: PrinterConfig;
    onSavePrinterConfig: (config: PrinterConfig) => void;
}


export const Settings: React.FC<SettingsProps> = ({ 
    companyInfo, 
    onSaveCompanyInfo,
    smtpConfig,
    onSaveSmtpConfig,
    printerConfig,
    onSavePrinterConfig
}) => {
    const [companyData, setCompanyData] = useState<CompanyInfo>(companyInfo);
    const [smtpData, setSmtpData] = useState<SmtpConfig>(smtpConfig);
    const [printerData, setPrinterData] = useState<PrinterConfig>(printerConfig);
    
    // Mock list of printers for the desktop app
    const availablePrinters = ['EPSON TM-T20II', 'BIXOLON SRP-350plus', 'Generic Thermal Printer'];


    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setSmtpData({ ...smtpData, [name]: type === 'number' ? (parseInt(value) || 0) : value });
    };

    const handlePrinterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrinterData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCompanySave = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveCompanyInfo(companyData);
        alert('Información de la empresa guardada.');
    };

    const handleSmtpSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveSmtpConfig(smtpData);
        alert('Configuración de SMTP guardada.');
    };

    const handlePrinterSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSavePrinterConfig(printerData);
        alert('Configuración de la impresora guardada.');
    };
    
    const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Información de la Empresa</h2>
        <form onSubmit={handleCompanySave} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                <input type="text" id="name" name="name" value={companyData.name} onChange={handleCompanyChange} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT</label>
                <input type="text" id="rut" name="rut" value={companyData.rut} onChange={handleCompanyChange} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                <input type="text" id="address" name="address" value={companyData.address} onChange={handleCompanyChange} className={inputClasses} />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input type="text" id="phone" name="phone" value={companyData.phone} onChange={handleCompanyChange} className={inputClasses} />
            </div>
             <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Sitio Web</label>
                <input type="text" id="website" name="website" value={companyData.website} onChange={handleCompanyChange} className={inputClasses} />
            </div>
             <div className="flex justify-end pt-2">
                <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-sm">Guardar Información</button>
            </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Configuración SMTP (Email)</h2>
        <form onSubmit={handleSmtpSave} className="space-y-4">
            <div>
                <label htmlFor="server" className="block text-sm font-medium text-gray-700">Servidor SMTP</label>
                <input type="text" id="server" name="server" value={smtpData.server} onChange={handleSmtpChange} className={inputClasses} placeholder="smtp.example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700">Puerto</label>
                    <input type="number" id="port" name="port" value={smtpData.port} onChange={handleSmtpChange} className={inputClasses} placeholder="587" />
                </div>
                <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input type="text" id="user" name="user" value={smtpData.user} onChange={handleSmtpChange} className={inputClasses} placeholder="user@example.com" />
                </div>
            </div>
            <div>
                <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" id="pass" name="pass" value={smtpData.pass} onChange={handleSmtpChange} className={inputClasses} />
            </div>
            <div className="flex justify-end pt-2">
                <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-sm">Guardar Configuración SMTP</button>
            </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Configuración de Impresora</h2>
        <form onSubmit={handlePrinterSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700">Tamaño del Papel</label>
                    <select id="paperSize" name="paperSize" value={printerData.paperSize} onChange={handlePrinterChange} className={inputClasses}>
                        <option value="80mm">80mm (Estándar)</option>
                        <option value="58mm">58mm (Pequeño)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="connectionType" className="block text-sm font-medium text-gray-700">Tipo de Conexión</label>
                    <select id="connectionType" name="connectionType" value={printerData.connectionType} onChange={handlePrinterChange} className={inputClasses}>
                        <option value="usb">USB (Recomendado para App de Escritorio)</option>
                        <option value="browser">Impresora del Sistema (Navegador)</option>
                    </select>
                </div>
            </div>
             {printerData.connectionType === 'usb' && (
                 <div>
                    <label htmlFor="selectedPrinterId" className="block text-sm font-medium text-gray-700">Seleccionar Impresora USB</label>
                    <select 
                        id="selectedPrinterId" 
                        name="selectedPrinterId" 
                        value={printerData.selectedPrinterId || ''} 
                        onChange={handlePrinterChange} 
                        className={inputClasses}
                    >
                        <option value="">-- Elija una impresora --</option>
                        {availablePrinters.map(printer => (
                            <option key={printer} value={printer}>{printer}</option>
                        ))}
                    </select>
                     <p className="text-xs text-gray-500 mt-1">Esta lista se poblará con las impresoras conectadas en la aplicación de escritorio (Electron).</p>
                </div>
             )}
            <div className="flex justify-end pt-2">
                <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold shadow-sm">Guardar Configuración de Impresora</button>
            </div>
        </form>
      </div>
    </div>
  );
};