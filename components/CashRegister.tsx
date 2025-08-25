
import React, { useState, useMemo } from 'react';
import type { CashRegisterSession, Sale, CashTransaction } from '../types';

interface CashRegisterProps {
  activeSession: CashRegisterSession | null;
  sessionSales: Sale[];
  sessionTransactions: CashTransaction[];
  onOpenSession: (openingBalance: number) => void;
  onCloseSession: (countedBalance: number) => void;
  onAddTransaction: (transaction: Omit<CashTransaction, 'id' | 'date' | 'sessionId'>) => void;
}

const TransactionModal: React.FC<{
    type: 'income' | 'expense';
    onSave: (amount: number, reason: string) => void;
    onClose: () => void;
}> = ({ type, onSave, onClose }) => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const title = type === 'income' ? 'Registrar Ingreso' : 'Registrar Egreso';
    const buttonColor = type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if(!isNaN(numericAmount) && numericAmount > 0 && reason.trim()) {
            onSave(numericAmount, reason.trim());
        }
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Monto</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required min="0.01" step="0.01" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Motivo</label>
                    <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className={`py-2 px-4 text-white rounded-md ${buttonColor}`}>Guardar</button>
                </div>
            </form>
        </div>
    )
}

const OpenRegisterForm: React.FC<{ onOpen: (balance: number) => void }> = ({ onOpen }) => {
  const [balance, setBalance] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const openingBalance = parseFloat(balance);
    if (!isNaN(openingBalance) && openingBalance >= 0) {
      onOpen(openingBalance);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Abrir Caja</h2>
      <p className="text-gray-600 mb-6">La caja está cerrada. Ingresa el monto inicial para comenzar una nueva sesión de ventas.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Monto inicial"
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                min="0"
                step="any"
            />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-semibold">
          Iniciar Sesión de Caja
        </button>
      </form>
    </div>
  );
};

const ActiveSessionView: React.FC<{ session: CashRegisterSession; sales: Sale[]; transactions: CashTransaction[]; onClose: (counted: number) => void, onAddTransaction: CashRegisterProps['onAddTransaction'] }> = ({ session, sales, transactions, onClose, onAddTransaction }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [counted, setCounted] = useState('');
    const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);

    const totalSales = useMemo(() => sales.reduce((sum, sale) => sum + sale.total, 0), [sales]);
    const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [transactions]);
    const expectedCash = session.openingBalance + totalSales + totalIncome - totalExpense;

    const handleClose = () => {
        const countedBalance = parseFloat(counted);
        if(!isNaN(countedBalance) && countedBalance >= 0) {
            onClose(countedBalance);
            setIsClosing(false);
        }
    }
    
    const handleSaveTransaction = (amount: number, reason: string) => {
        if(modalType) {
            onAddTransaction({ type: modalType, amount, reason });
            setModalType(null);
        }
    }

    if (session.endDate) { // Session is closed, show summary
        const difference = (session.countedBalance ?? 0) - (session.closingBalance ?? 0);
        return (
             <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen de Caja Cerrada</h2>
                <p className="text-sm text-gray-600 mb-6">Sesión finalizada el {new Date(session.endDate).toLocaleString('es-CL')}</p>
                <div className="space-y-3">
                    <SummaryRow label="Monto Inicial" value={session.openingBalance} />
                    <SummaryRow label="Total de Ventas" value={totalSales} />
                    <SummaryRow label="Otros Ingresos" value={totalIncome} color="text-green-600" />
                    <SummaryRow label="Egresos" value={totalExpense} color="text-red-600" />
                    <SummaryRow label="Dinero Esperado en Caja" value={session.closingBalance ?? 0} isBold={true}/>
                    <hr className="my-3"/>
                    <SummaryRow label="Dinero Contado" value={session.countedBalance ?? 0} isBold={true}/>
                    <SummaryRow label="Diferencia" value={difference} color={difference === 0 ? 'text-green-600' : 'text-red-600'} isBold={true}/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-6 items-start">
            <div className="bg-white p-8 rounded-lg shadow-md flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sesión de Caja Activa</h2>
                <p className="text-sm text-gray-600 mb-6">Iniciada el {new Date(session.startDate).toLocaleString('es-CL')}</p>

                <div className="space-y-3">
                    <SummaryRow label="Monto Inicial" value={session.openingBalance} />
                    <SummaryRow label="Ventas Realizadas" value={`${sales.length} transacciones`} />
                    <SummaryRow label="Total de Ventas" value={totalSales} />
                    <SummaryRow label="Otros Ingresos" value={totalIncome} color="text-green-600" />
                    <SummaryRow label="Egresos" value={totalExpense} color="text-red-600" />
                    <hr className="my-3"/>
                    <SummaryRow label="Dinero Esperado en Caja" value={expectedCash} isBold={true}/>
                </div>

                <div className="mt-6 border-t pt-6 flex gap-4">
                    <button onClick={() => setModalType('income')} className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-md hover:bg-green-200">Registrar Ingreso</button>
                    <button onClick={() => setModalType('expense')} className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200">Registrar Egreso</button>
                </div>

                {isClosing ? (
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Realizar Cierre de Caja</h3>
                        <p className="text-sm text-gray-600 mb-4">Cuenta todo el dinero en el cajón e ingresa el monto total para cerrar la sesión.</p>
                        <div className="flex items-center gap-4">
                            <input type="number" value={counted} onChange={e => setCounted(e.target.value)} placeholder="Monto contado" className="w-full p-2 border rounded-md" />
                            <button onClick={handleClose} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Confirmar</button>
                            <button onClick={() => setIsClosing(false)} className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-center">
                        <button onClick={() => setIsClosing(true)} className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 font-semibold">
                            Cerrar Caja
                        </button>
                    </div>
                )}
            </div>

            <div className="w-1/3 bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Movimientos de Caja</h3>
                {transactions.length === 0 ? <p className="text-sm text-gray-600">No hay movimientos.</p> : (
                    <ul className="space-y-2">
                        {transactions.map(t => (
                            <li key={t.id} className="text-sm p-2 rounded-md bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{t.reason}</span>
                                    <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'} ${t.amount.toLocaleString('es-CL')}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(t.date).toLocaleTimeString('es-CL')}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {modalType && <TransactionModal type={modalType} onSave={handleSaveTransaction} onClose={() => setModalType(null)}/>}
        </div>
    )
}

const SummaryRow: React.FC<{label: string; value: number | string; isBold?: boolean; color?: string}> = ({label, value, isBold, color = 'text-gray-800'}) => (
    <div className={`flex justify-between items-center ${isBold ? 'font-bold' : ''} ${color}`}>
        <span className="text-gray-600">{label}:</span>
        <span>{typeof value === 'number' ? `$${value.toLocaleString('es-CL')}` : value}</span>
    </div>
);


export const CashRegister: React.FC<CashRegisterProps> = ({ activeSession, sessionSales, sessionTransactions, onOpenSession, onCloseSession, onAddTransaction }) => {
  if (!activeSession || activeSession.endDate) {
    if(activeSession && activeSession.endDate) { // If there's a closed session, show its summary
         return <ActiveSessionView session={activeSession} sales={sessionSales} transactions={sessionTransactions} onClose={onCloseSession} onAddTransaction={onAddTransaction} />;
    }
    return <OpenRegisterForm onOpen={onOpenSession} />;
  }
  
  return <ActiveSessionView session={activeSession} sales={sessionSales} transactions={sessionTransactions} onClose={onCloseSession} onAddTransaction={onAddTransaction} />;
};