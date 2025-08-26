import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Sale, Product, Client, CompanyInfo, PrinterConfig } from '../types';
import { Ticket } from './Ticket';

interface PrintModalProps {
    sale: Sale;
    products: Product[];
    clients: Client[];
    companyInfo: CompanyInfo;
    printerConfig: PrinterConfig;
    onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ sale, products, clients, companyInfo, printerConfig, onClose }) => {
    const ticketRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = ticketRef.current;
        if (input) {
            html2canvas(input, { scale: 3 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdfWidth = printerConfig.paperSize === '58mm' ? 58 : 80;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [pdfWidth, pdfHeight]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Boleta-${sale.id}.pdf`);
            });
        }
    };
    
    const handlePrint = () => {
        const ticketElement = ticketRef.current;
        if (!ticketElement) return;

        if (printerConfig.connectionType === 'usb' && window.electron) {
            console.log(`Capturing ticket with html2canvas for USB printer: ${printerConfig.selectedPrinterId}`);
            html2canvas(ticketElement, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                window.electron.printDirect(imgData, printerConfig.selectedPrinterId);
                onClose(); // Close modal after sending to print
            }).catch(err => {
                console.error("Error generating canvas for printing:", err);
                // As a fallback, we can try the browser's print dialog
                document.body.classList.add('printing-ticket');
                window.print();
                document.body.classList.remove('printing-ticket');
            });
        } else {
            // Fallback to browser's default print dialog
            document.body.classList.add('printing-ticket');
            window.print();
            document.body.classList.remove('printing-ticket');
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 print:bg-white print:block">
            <style>
                {`
                    @media print {
                        body.printing-ticket > *:not(.print-container) {
                            display: none;
                        }
                        .print-container {
                            display: block !important;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg print:shadow-none print:rounded-none print:p-0 print-container">
                <h2 className="text-xl font-bold mb-4 text-gray-900 print:hidden">Venta Finalizada</h2>
                <div className="bg-gray-200 p-4 rounded-md overflow-y-auto max-h-96 print:bg-white print:p-0 print:overflow-visible print:max-h-full">
                   <Ticket sale={sale} products={products} clients={clients} companyInfo={companyInfo} ref={ticketRef} />
                </div>
                 <div className="flex justify-end space-x-4 pt-6 mt-4 border-t print:hidden">
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