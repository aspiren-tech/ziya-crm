import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lead, LeadStatus } from '../../../types';
import { ChevronsUpDown, ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useLeads } from '../../../contexts/LeadsContext';
import EditLeadModal from './EditLeadModal';

interface LeadsTableProps {
  leads: Lead[];
  requestSort: (key: keyof Lead) => void;
  sortConfig: { key: keyof Lead; direction: 'ascending' | 'descending' } | null;
}

// FIX: Replaced 'Converted' with 'Closed - Won' to match LeadStatus type and added missing statuses to prevent runtime errors.
const statusColors: Record<LeadStatus, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Proposal': 'bg-orange-100 text-orange-800',
  'Negotiation': 'bg-indigo-100 text-indigo-800',
  'Closed - Won': 'bg-purple-100 text-purple-800',
  'Lost': 'bg-red-100 text-red-800',
  'Qualified': 'bg-green-100 text-green-800',
};

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, requestSort, sortConfig }) => {
  const { openEditLeadModal } = useUI();
  const { deleteLead } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const getSortIcon = (key: keyof Lead) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    openEditLeadModal();
  };

  const handleDeleteClick = (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete the lead ${lead.firstName} ${lead.lastName}?`)) {
      deleteLead(lead.id);
    }
    setShowActions(null);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button onClick={() => requestSort('firstName')} className="flex items-center hover:text-gray-700">Lead Name {getSortIcon('firstName')}</button>
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              <button onClick={() => requestSort('company')} className="flex items-center hover:text-gray-700">Company {getSortIcon('company')}</button>
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              <button onClick={() => requestSort('email')} className="flex items-center hover:text-gray-700">Email {getSortIcon('email')}</button>
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button onClick={() => requestSort('status')} className="flex items-center hover:text-gray-700">Status {getSortIcon('status')}</button>
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              <button onClick={() => requestSort('ownerName')} className="flex items-center hover:text-gray-700">Owner {getSortIcon('ownerName')}</button>
            </th>
            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                 <input type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <Link to={`/leads/${lead.id}`} className="text-sm font-medium text-primary hover:underline">
                  {lead.firstName} {lead.lastName}
                </Link>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{lead.company}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{lead.email}</td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={lead.ownerAvatar} alt={lead.ownerName} />
                    <div className="ml-3 text-sm text-gray-900 hidden lg:block">{lead.ownerName}</div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => setShowActions(showActions === lead.id ? null : lead.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {showActions === lead.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                        <button
                          onClick={() => handleEditClick(lead)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lead)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedLead && (
        <EditLeadModal lead={selectedLead} />
      )}
    </div>
  );
};

export default LeadsTable;