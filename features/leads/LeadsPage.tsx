import React, { useState, useMemo } from 'react';
import LeadsToolbar from './components/LeadsToolbar';
import LeadsTable from './components/LeadsTable';
import LeadsPipelineView, { NewLeadProvider } from './components/LeadsPipelineView';
import EditLeadModal from './components/EditLeadModal';
import CreateLeadModal from './components/CreateLeadModal';
import { useLeads } from '../../contexts/LeadsContext';
import { useUI } from '../../contexts/UIContext';
import { Lead, LeadStatus } from '../../types';

const LeadsPage: React.FC = () => {
  const { leads } = useLeads();
  const { isEditLeadModalOpen, isCreateLeadModalOpen } = useUI();
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus | null>(null);

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const lowercasedQuery = searchQuery.toLowerCase();
    return leads.filter(lead =>
        lead.firstName.toLowerCase().includes(lowercasedQuery) ||
        lead.lastName.toLowerCase().includes(lowercasedQuery) ||
        lead.company.toLowerCase().includes(lowercasedQuery) ||
        lead.email.toLowerCase().includes(lowercasedQuery)
    );
  }, [leads, searchQuery]);

  const sortedLeads = useMemo(() => {
    let sortableLeads = [...filteredLeads];
    if (sortConfig !== null) {
      sortableLeads.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [filteredLeads, sortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to handle lead selection for editing
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const newLeadContextValue = {
    newLeadStatus,
    setNewLeadStatus
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
        <LeadsToolbar activeView={view} setActiveView={setView} onSearch={setSearchQuery} />
        <div className="flex-1 overflow-hidden">
             {view === 'pipeline' ? (
                <NewLeadProvider value={newLeadContextValue}>
                  <LeadsPipelineView leads={filteredLeads} onSelectLead={handleSelectLead} />
                </NewLeadProvider>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm h-full overflow-y-auto">
                    <LeadsTable leads={sortedLeads} requestSort={requestSort} sortConfig={sortConfig} />
                </div>
            )}
        </div>
        {isEditLeadModalOpen && <EditLeadModal lead={selectedLead} />}
        {isCreateLeadModalOpen && <CreateLeadModal defaultStatus={newLeadStatus || undefined} />}
    </div>
  );
};

export default LeadsPage;