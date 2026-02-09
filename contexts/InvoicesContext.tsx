import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_INVOICES } from '../constants';
import type { Invoice } from '../types';

interface InvoicesContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updatedInvoiceData: Partial<Invoice>) => void;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export const InvoicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const addInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
        ...newInvoiceData,
        id: `inv_${Date.now()}`,
    };
    setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
  };

  const updateInvoice = (id: string, updatedInvoiceData: Partial<Invoice>) => {
    setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
            invoice.id === id ? { ...invoice, ...updatedInvoiceData } : invoice
        )
    );
  };

  return (
    <InvoicesContext.Provider value={{ invoices, addInvoice, updateInvoice }}>
      {children}
    </InvoicesContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
};