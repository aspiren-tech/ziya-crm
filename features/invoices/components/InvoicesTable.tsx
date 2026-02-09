import React from 'react';
import { Link } from 'react-router-dom';
import type { Invoice } from '../../../types';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { getInvoiceStatusMeta } from '../constants';

interface InvoicesTableProps {
  invoices: (Invoice & { totalAmount: number })[];
  requestSort: (key: string) => void;
  sortConfig: { key: string; direction: 'ascending' | 'descending' } | null;
  selectedInvoices?: Set<string>;
  onInvoiceSelect?: (id: string) => void;
  onSelectAll?: () => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ 
  invoices, 
  requestSort, 
  sortConfig,
  selectedInvoices = new Set(),
  onInvoiceSelect,
  onSelectAll = () => {}
}) => {
  
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const allSelected = invoices.length > 0 && selectedInvoices.size === invoices.length;
  const someSelected = selectedInvoices.size > 0 && !allSelected;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
                checked={allSelected}
                onChange={onSelectAll}
                ref={el => {
                  if (el) {
                    el.indeterminate = someSelected;
                  }
                }}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               <button onClick={() => requestSort('invoiceNumber')} className="flex items-center hover:text-gray-700">Invoice # {getSortIcon('invoiceNumber')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button onClick={() => requestSort('clientName')} className="flex items-center hover:text-gray-700">Client {getSortIcon('clientName')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 <button onClick={() => requestSort('totalAmount')} className="flex items-center hover:text-gray-700">Amount {getSortIcon('totalAmount')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 <button onClick={() => requestSort('dueDate')} className="flex items-center hover:text-gray-700">Due Date {getSortIcon('dueDate')}</button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 <button onClick={() => requestSort('status')} className="flex items-center hover:text-gray-700">Status {getSortIcon('status')}</button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
                  checked={selectedInvoices.has(invoice.id)}
                  onChange={(e) => {
                    if (onInvoiceSelect) {
                      onInvoiceSelect(invoice.id);
                    }
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/invoices/${invoice.id}`} className="text-sm font-medium text-primary hover:underline">
                  {invoice.invoiceNumber}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{invoice.clientName}</div>
                <div className="text-sm text-gray-500">{invoice.clientCompany}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                ${invoice.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(() => {
                  const statusMeta = getInvoiceStatusMeta(invoice.status);
                  return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMeta.chipClass}`}>
                      {statusMeta.label}
                    </span>
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;