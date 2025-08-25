import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { POS } from './components/POS';
import { Settings } from './components/Settings';
import { Users } from './components/Users';
import { Clients } from './components/Clients';
import { Suppliers } from './components/Suppliers';
import { Purchases } from './components/Purchases';
import { Reports } from './components/Reports';
import { CashRegister } from './components/CashRegister';
import { PrintModal } from './components/PrintModal';
import { LockScreen } from './components/LockScreen';
import { mockProducts, mockSales, mockUsers, mockClients, mockSuppliers, mockPurchases } from './services/mockData';
import type { Product, Sale, SaleItem, User, CashRegisterSession, CashTransaction, Client, Supplier, Purchase, CompanyInfo, SmtpConfig, PrinterConfig } from './types';
import { View } from './types';


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  
  // App lock state
  const [isLocked, setIsLocked] = useState(false);

  // Data state
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  
  // User Management State
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to admin

  // Settings State
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: 'Sermagri', rut: '76.123.456-7', address: 'Av. Siempre Viva 742, Santiago', phone: '+56221234567', website: 'www.sermagri.cl'});
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({ server: '', port: 587, user: '', pass: ''});
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>({ paperSize: '80mm', connectionType: 'usb', selectedPrinterId: '' });

  // Cash Register State
  const [activeSession, setActiveSession] = useState<CashRegisterSession | null>(null);

  // Printing State
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  // Lock/Unlock Handlers
  const handleLock = () => setIsLocked(true);
  
  const handleUnlock = (userToLogin: User, passwordAttempt: string): boolean => {
    if (userToLogin.password === passwordAttempt) {
      setCurrentUser(userToLogin);
      setIsLocked(false);
      return true;
    }
    return false;
  };

  // User Management Handlers
  const addUser = (user: Omit<User, 'id'>) => setUsers(prev => [...prev, { ...user, id: `USER-${Date.now()}` }]);
  const updateUser = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  const deleteUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));
  
  // Client Management
  const addClient = (client: Omit<Client, 'id'>) => setClients(prev => [...prev, { ...client, id: `CLIENT-${Date.now()}` }]);
  const updateClient = (updatedClient: Client) => setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  const deleteClient = (clientId: string) => setClients(prev => prev.filter(c => c.id !== clientId));

  // Supplier Management
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => setSuppliers(prev => [...prev, { ...supplier, id: `SUP-${Date.now()}` }]);
  const updateSupplier = (updatedSupplier: Supplier) => setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  const deleteSupplier = (supplierId: string) => setSuppliers(prev => prev.filter(s => s.id !== supplierId));

  // Product Management
  const addProduct = (product: Omit<Product, 'id'>) => setProducts(prev => [...prev, { ...product, id: `PROD-${Date.now()}` }]);
  const addMultipleProducts = (newProducts: Omit<Product, 'id'>[]) => {
      const productsToAdd = newProducts.map(p => ({...p, id: `PROD-${Date.now()}-${Math.random()}`}));
      setProducts(prev => [...prev, ...productsToAdd]);
  };
  const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const deleteProduct = (productId: string) => setProducts(prev => prev.filter(p => p.id !== productId));
  
  // Purchase Management
  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
      const newPurchase = { ...purchase, id: `PUR-${Date.now()}`};
      setPurchases(prev => [newPurchase, ...prev]);
      // Update stock
      setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          newPurchase.items.forEach(item => {
              const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
              if (productIndex !== -1) {
                  updatedProducts[productIndex].stock += item.quantity;
              }
          });
          return updatedProducts;
      });
  };

  // Sale & Cash Register Handlers
  const openCashRegister = (openingBalance: number) => {
    if (activeSession) return;
    const newSession: CashRegisterSession = {
        id: `SESSION-${Date.now()}`, startDate: new Date().toISOString(), endDate: null,
        openingBalance, closingBalance: null, countedBalance: null,
    };
    setActiveSession(newSession);
    setView(View.POS);
  };
  
  const addCashTransaction = (transaction: Omit<CashTransaction, 'id' | 'date' | 'sessionId'>) => {
    if (!activeSession) return;
    const newTransaction: CashTransaction = { ...transaction, id: `TRANS-${Date.now()}`, date: new Date().toISOString(), sessionId: activeSession.id };
    setCashTransactions(prev => [...prev, newTransaction]);
  };

  const closeCashRegister = (countedBalance: number) => {
    if (!activeSession) return;
    const sessionSales = sales.filter(s => s.sessionId === activeSession.id);
    const sessionTransactions = cashTransactions.filter(t => t.sessionId === activeSession.id);
    const totalSalesValue = sessionSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalIncome = sessionTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = sessionTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const closingBalance = activeSession.openingBalance + totalSalesValue + totalIncome - totalExpense;
    setActiveSession(prev => prev ? { ...prev, endDate: new Date().toISOString(), countedBalance, closingBalance } : null);
  };
  
  const createSale = (items: SaleItem[], total: number, paymentMethod: string, clientId?: string) => {
    if (!activeSession) return;
    const newSale: Sale = { id: `SALE-${Date.now()}`, date: new Date().toISOString(), items, total, paymentMethod, sessionId: activeSession.id, clientId };
    setSales(prev => [newSale, ...prev]);
    // Update stock
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      items.forEach(item => {
        const productIndex = newProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          newProducts[productIndex].stock -= item.quantity;
        }
      });
      return newProducts;
    });
    setSaleToPrint(newSale);
    setIsPrintModalOpen(true);
  };

  const handlePrintSale = (sale: Sale) => {
    setSaleToPrint(sale);
    setIsPrintModalOpen(true);
  };

  const renderView = () => {
    // Role-based access control
    if ((view === View.Settings || view === View.Users || view === View.Reports) && currentUser.role !== 'admin') {
      setView(View.Dashboard);
      return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
    }

    const sessionSales = activeSession ? sales.filter(s => s.sessionId === activeSession.id) : [];
    const sessionTransactions = activeSession ? cashTransactions.filter(t => t.sessionId === activeSession.id) : [];

    switch (view) {
      case View.Dashboard:
        return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
      case View.Inventory:
        return <Inventory products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} onImportProducts={addMultipleProducts} />;
      case View.Sales:
        return <Sales sales={sales} products={products} clients={clients} onPrintSale={handlePrintSale} />;
      case View.POS:
        return <POS products={products} clients={clients} onCreateSale={createSale} isCashRegisterOpen={!!activeSession && !activeSession.endDate} />;
      case View.Settings:
        return <Settings 
            companyInfo={companyInfo} 
            onSaveCompanyInfo={setCompanyInfo} 
            smtpConfig={smtpConfig} 
            onSaveSmtpConfig={setSmtpConfig}
            printerConfig={printerConfig}
            onSavePrinterConfig={setPrinterConfig}
        />;
      case View.Users:
        return <Users users={users} onAddUser={addUser} onUpdateUser={updateUser} onDeleteUser={deleteUser} />;
      case View.Clients:
        return <Clients clients={clients} onAddClient={addClient} onUpdateClient={updateClient} onDeleteClient={deleteClient} />;
      case View.Suppliers:
        return <Suppliers suppliers={suppliers} onAddSupplier={addSupplier} onUpdateSupplier={updateSupplier} onDeleteSupplier={deleteSupplier} />;
      case View.Purchases:
          return <Purchases purchases={purchases} suppliers={suppliers} products={products} onAddPurchase={addPurchase} />;
      case View.Reports:
          return <Reports sales={sales} products={products} />;
      case View.CashRegister:
        return <CashRegister activeSession={activeSession} onOpenSession={openCashRegister} onCloseSession={closeCashRegister} sessionSales={sessionSales} sessionTransactions={sessionTransactions} onAddTransaction={addCashTransaction} />;
      default:
        return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={view} setView={setView} userRole={currentUser.role}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLock={handleLock} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
      {isPrintModalOpen && saleToPrint && (
        <PrintModal 
            sale={saleToPrint} 
            products={products} 
            clients={clients}
            companyInfo={companyInfo}
            printerConfig={printerConfig}
            onClose={() => {
                setIsPrintModalOpen(false);
                setSaleToPrint(null);
            }} 
        />
      )}
      {isLocked && <LockScreen currentUser={currentUser} users={users} onUnlock={handleUnlock} />}
    </div>
  );
};

export default App;