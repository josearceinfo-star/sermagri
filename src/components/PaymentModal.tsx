import React, { useState, useMemo } from 'react';

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  onConfirmSale: (paymentMethod: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ totalAmount, onClose, onConfirmSale }) => {
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'debito' | 'credito' | null>(null);
  const [cashReceived, setCashReceived] = useState('');

  const change = useMemo(() => {
    const received = parseFloat(cashReceived);
    if (paymentMethod === 'efectivo' && !isNaN(received) && received >= totalAmount) {
      return received - totalAmount;
    }
    return 0;
  }, [cashReceived, totalAmount, paymentMethod]);

  const canConfirm = useMemo(() => {
    if (!paymentMethod) return false;
    if (paymentMethod === 'efectivo') {
      const received = parseFloat(cashReceived);
      return !isNaN(received) && received >= totalAmount;
    }
    return true; // For debito/credito
  }, [paymentMethod, cashReceived, totalAmount]);

  const handleConfirm = () => {
    if (canConfirm && paymentMethod) {
      onConfirmSale(paymentMethod);
    }
  };

  const getQuickCashOptions = (): number[] => {
      const options = new Set<number>([totalAmount]);
      if (totalAmount < 5000) options.add(5000);
      if (totalAmount < 10000) options.add(10000);
      if (totalAmount < 20000) options.add(20000);
      if (totalAmount < 50000) options.add(50000);
      
      const roundedUp = Math.ceil(totalAmount / 1000) * 1000;
      if (roundedUp > totalAmount) options.add(roundedUp);

      return Array.from(options).sort((a,b) => a-b).slice(0, 4);
  }

  const getPaymentMethodClass = (method: 'efectivo' | 'debito' | 'credito') => {
      const baseClass = "flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200";
      return paymentMethod === method 
        ? `${baseClass} border-green-600 bg-green-50 shadow-lg` 
        : `${baseClass} border-gray-300 bg-white hover:border-green-400 hover:bg-gray-50`;
  }
  
  const Icon: React.FC<{d:string}> = ({d}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Procesar Pago</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl">&times;</button>
        </div>

        <div className="text-center bg-gray-100 p-4 my-6 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total a Pagar</p>
          <p className="text-4xl font-bold text-gray-900">${totalAmount.toLocaleString('es-CL')}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => setPaymentMethod('efectivo')} className={getPaymentMethodClass('efectivo')}>
            <Icon d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            <span className="font-semibold text-gray-800">Efectivo</span>
          </button>
          <button onClick={() => setPaymentMethod('debito')} className={getPaymentMethodClass('debito')}>
             <Icon d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            <span className="font-semibold text-gray-800">Débito</span>
          </button>
          <button onClick={() => setPaymentMethod('credito')} className={getPaymentMethodClass('credito')}>
            <Icon d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            <span className="font-semibold text-gray-800">Crédito</span>
          </button>
        </div>

        {paymentMethod === 'efectivo' && (
          <div className="mt-6 border-t pt-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Pago en Efectivo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monto Recibido</label>
              <input 
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="Ingrese el monto..."
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm text-lg"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
                {getQuickCashOptions().map(amount => (
                    <button key={amount} onClick={() => setCashReceived(String(amount))} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">
                       ${amount.toLocaleString('es-CL')}
                    </button>
                ))}
            </div>
            {parseFloat(cashReceived) >= totalAmount && (
                <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center">
                    <p className="text-sm">Vuelto</p>
                    <p className="text-2xl font-bold">${change.toLocaleString('es-CL')}</p>
                </div>
            )}
          </div>
        )}
        
        {(paymentMethod === 'debito' || paymentMethod === 'credito') && (
            <div className="mt-6 border-t pt-4 text-center text-gray-600">
                <p>Por favor, procese el pago en el terminal de tarjetas.</p>
            </div>
        )}

        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancelar</button>
          <button onClick={handleConfirm} disabled={!canConfirm} className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold disabled:bg-gray-400 disabled:cursor-not-allowed">
            Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
};
