import React, { useState, useMemo } from 'react';
import InvoicesToolbar from './components/InvoicesToolbar';
import InvoicesTable from './components/InvoicesTable';
import InvoiceFilters from './components/InvoiceFilters';
import { useInvoices } from '../../contexts/InvoicesContext';
import { Invoice, InvoiceStatus } from '../../types';
import Button from '../../components/shared/ui/Button';
import { useNavigate } from 'react-router-dom';

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, updateInvoice } = useInvoices();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(invoice =>
        invoice.clientName.toLowerCase().includes(lowercasedQuery) ||
        invoice.clientCompany.toLowerCase().includes(lowercasedQuery) ||
        invoice.invoiceNumber.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(invoice => invoice.status === statusFilter);
    }
    
    return result;
  }, [invoices, searchQuery, statusFilter]);

  const sortedInvoices = useMemo(() => {
    const calculateTotal = (invoice: Invoice) => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      return subtotal + tax;
    };

    let sortableInvoices = filteredInvoices.map(invoice => ({
      ...invoice,
      totalAmount: calculateTotal(invoice),
    }));

    if (sortConfig !== null) {
      sortableInvoices.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInvoices;
  }, [filteredInvoices, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const calculateTotal = (invoice: Invoice) => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      return subtotal + tax;
    };
    
    const totalInvoices = sortedInvoices.length;
    const totalAmount = sortedInvoices.reduce((sum, invoice) => sum + calculateTotal(invoice), 0);
    const paidAmount = sortedInvoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, invoice) => sum + calculateTotal(invoice), 0);
    
    return { totalInvoices, totalAmount, paidAmount };
  }, [sortedInvoices]);

  // Handle invoice selection
  const toggleInvoiceSelection = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId);
    } else {
      newSelected.add(invoiceId);
    }
    setSelectedInvoices(newSelected);
  };

  const selectAllInvoices = () => {
    if (selectedInvoices.size === sortedInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(sortedInvoices.map(invoice => invoice.id)));
    }
  };

  // Bulk actions
  const bulkUpdateStatus = (status: InvoiceStatus) => {
    selectedInvoices.forEach(invoiceId => {
      updateInvoice(invoiceId, { status });
    });
    setSelectedInvoices(new Set());
  };

  const bulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedInvoices.size} invoice(s)?`)) {
      // In a real app, you would implement delete functionality in the context
      alert('Delete functionality would be implemented here');
      setSelectedInvoices(new Set());
    }
  };

  // Export all invoices as CSV
  const exportInvoicesAsCSV = () => {
    // Calculate total amounts for each invoice
    const invoicesWithTotals = sortedInvoices.map(invoice => {
      const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      const tax = subtotal * (invoice.taxRate / 100);
      const total = subtotal + tax;
      return {
        ...invoice,
        totalAmount: total
      };
    });

    // Create CSV content
    const headers = ['Invoice Number', 'Client Name', 'Client Company', 'Client Email', 'Issue Date', 'Due Date', 'Status', 'Total Amount'];
    const csvContent = [
      headers.join(','),
      ...invoicesWithTotals.map(invoice => [
        `"${invoice.invoiceNumber}"`,
        `"${invoice.clientName}"`,
        `"${invoice.clientCompany}"`,
        `"${invoice.clientEmail}"`,
        `"${invoice.issueDate}"`,
        `"${invoice.dueDate}"`,
        `"${invoice.status}"`,
        `"${invoice.totalAmount.toFixed(2)}"`
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <InvoicesToolbar onSearch={setSearchQuery} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Invoices</h3>
          <p className="text-3xl font-bold text-text-main">{summary.totalInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Amount</h3>
          <p className="text-3xl font-bold text-text-main">${summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Amount Paid</h3>
          <p className="text-3xl font-bold text-green-600">${summary.paidAmount.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Filters and Bulk Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <InvoiceFilters 
            statusFilter={statusFilter} 
            onStatusFilterChange={setStatusFilter} 
          />
        </div>
        
        {selectedInvoices.size > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedInvoices.size} selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => bulkUpdateStatus('Paid')}
            >
              Mark as Paid
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => bulkUpdateStatus('Due')}
            >
              Mark as Sent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={bulkDelete}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportInvoicesAsCSV}
            >
              Export All as CSV
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <InvoicesTable 
          invoices={sortedInvoices} 
          requestSort={requestSort} 
          sortConfig={sortConfig}
          selectedInvoices={selectedInvoices}
          onInvoiceSelect={toggleInvoiceSelection}
          onSelectAll={selectAllInvoices}
        />
      </div>
    </div>
  );
};

export default InvoicesPage;