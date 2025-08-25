
import React, { useRef } from 'react';
import type { Sale, Product } from '../types';
import { Ticket } from './Ticket';

declare var jspdf: any;
declare var html2canvas: any;

interface PrintModalProps {
    sale: Sale;
    products: Product[];
    onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ sale, products, onClose }) => {
    const ticketRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = ticketRef.current;
        if (input) {
            html2canvas(input, { scale: 3 }).then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [80, 200] // Approximate size for thermal paper
                });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Boleta-${sale.id}.pdf`);
            });
        }
    };
    
    const handlePrint = () => {
        window.print();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Venta Finalizada</h2>
                <div className="bg-gray-200 p-4 rounded-md overflow-y-auto max-h-96">
                   <Ticket sale={sale} products={products} ref={ticketRef} />
                </div>
                 <div className="flex justify-end space-x-4 pt-6 mt-4 border-t">
                    <button onClick={handleDownloadPdf} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Descargar PDF
                    </button>
                    <button onClick={handlePrint} className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Imprimir
                    </button>
                    <button onClick={onClose} className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
