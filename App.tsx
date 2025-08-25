
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { POS } from './components/POS';
import { Settings } from './components/Settings';
import { Users } from './components/Users';
import { CashRegister } from './components/CashRegister';
import { PrintModal } from './components/PrintModal';
import { mockProducts, mockSales, mockUsers } from './services/mockData';
import type { Product, Sale, SaleItem, User, CashRegisterSession, CashTransaction } from './types';
import { View } from './types';


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  
  // Data state
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  
  // User Management State
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to admin

  // Cash Register State
  const [activeSession, setActiveSession] = useState<CashRegisterSession | null>(null);

  // Printing State
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  // User Management Handlers
  const addUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: `USER-${Date.now()}` }]);
  };
  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  // Product Management Handlers
  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `PROD-${Date.now()}` }]);
  };
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Sale & Cash Register Handlers
  const openCashRegister = (openingBalance: number) => {
    if (activeSession) return;
    const newSession: CashRegisterSession = {
        id: `SESSION-${Date.now()}`,
        startDate: new Date().toISOString(),
        endDate: null,
        openingBalance,
        closingBalance: null,
        countedBalance: null,
    };
    setActiveSession(newSession);
    setView(View.POS);
  };
  
  const addCashTransaction = (transaction: Omit<CashTransaction, 'id' | 'date' | 'sessionId'>) => {
    if (!activeSession) return;
    const newTransaction: CashTransaction = {
        ...transaction,
        id: `TRANS-${Date.now()}`,
        date: new Date().toISOString(),
        sessionId: activeSession.id,
    };
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
  
  const createSale = (items: SaleItem[], total: number) => {
    if (!activeSession) return; // Cannot create sale if register is closed

    const newSale: Sale = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
      sessionId: activeSession.id
    };
    setSales(prev => [newSale, ...prev]);

    // Update stock
    const newProducts = [...products];
    items.forEach(item => {
      const productIndex = newProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        newProducts[productIndex].stock -= item.quantity;
      }
    });
    setProducts(newProducts);
    setSaleToPrint(newSale);
    setIsPrintModalOpen(true);
  };

  const renderView = () => {
    // Role-based access control
    if ((view === View.Settings || view === View.Users) && currentUser.role !== 'admin') {
      return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
    }

    const sessionSales = activeSession ? sales.filter(s => s.sessionId === activeSession.id) : [];
    const sessionTransactions = activeSession ? cashTransactions.filter(t => t.sessionId === activeSession.id) : [];

    switch (view) {
      case View.Dashboard:
        return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
      case View.Inventory:
        return <Inventory products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />;
      case View.Sales:
        return <Sales sales={sales} products={products} />;
      case View.POS:
        return <POS products={products} onCreateSale={createSale} isCashRegisterOpen={!!activeSession && !activeSession.endDate} />;
      case View.Settings:
        return <Settings />;
      case View.Users:
        return <Users users={users} onAddUser={addUser} onUpdateUser={updateUser} onDeleteUser={deleteUser} />;
      case View.CashRegister:
        return <CashRegister 
                    activeSession={activeSession} 
                    onOpenSession={openCashRegister} 
                    onCloseSession={closeCashRegister} 
                    sessionSales={sessionSales}
                    sessionTransactions={sessionTransactions}
                    onAddTransaction={addCashTransaction} />;
      default:
        return <Dashboard sales={sales} products={products} activeSession={activeSession} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={view} setView={setView} userRole={currentUser.role}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} users={users} onSwitchUser={setCurrentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
      {isPrintModalOpen && saleToPrint && (
        <PrintModal 
            sale={saleToPrint} 
            products={products} 
            onClose={() => {
                setIsPrintModalOpen(false);
                setSaleToPrint(null);
            }} 
        />
      )}
    </div>
  );
};

export default App;
