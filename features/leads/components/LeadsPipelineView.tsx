import React, { useState, useMemo, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, GripVertical, Edit, Eye, Trash2, Plus } from 'lucide-react';
import type { Lead, LeadStatus } from '../../../types';
import { useLeads } from '../../../contexts/LeadsContext';
import { useUI } from '../../../contexts/UIContext';
import { PIPELINE_STAGES } from '../../../constants';
import Button from '../../../components/shared/ui/Button';

// Create a context to share the new lead status between components
interface NewLeadContextType {
  newLeadStatus: LeadStatus | null;
  setNewLeadStatus: (status: LeadStatus | null) => void;
}

const NewLeadContext = createContext<NewLeadContextType | undefined>(undefined);

export const useNewLead = () => {
  const context = useContext(NewLeadContext);
  if (context === undefined) {
    throw new Error('useNewLead must be used within a NewLeadProvider');
  }
  return context;
};

export const NewLeadProvider: React.FC<{ children: React.ReactNode; value: NewLeadContextType }> = ({ children, value }) => {
  return <NewLeadContext.Provider value={value}>{children}</NewLeadContext.Provider>;
};

interface LeadCardProps {
  lead: Lead;
  onSelectLead: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelectLead }) => {
  const { openEditLeadModal } = useUI();
  const { deleteLead } = useLeads();
  const [showActions, setShowActions] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('leadId', lead.id);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectLead(lead);
    openEditLeadModal();
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the lead ${lead.firstName} ${lead.lastName}?`)) {
      deleteLead(lead.id);
    }
    setShowActions(false);
  };
  
  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex justify-between items-start">
        <Link to={`/leads/${lead.id}`} className="font-semibold text-sm text-gray-800 hover:text-primary hover:underline">
            {lead.firstName} {lead.lastName}
        </Link>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showActions && (
            <div 
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
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
                  onClick={handleEditClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
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
      </div>
      <p className="text-xs text-gray-500 truncate">{lead.company}</p>
      <p className="text-sm font-bold text-gray-700 my-2">
        ${lead.value.toLocaleString()}
      </p>
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-1.5 ${lead.score > 75 ? 'bg-green-500' : lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
            <span className="text-red-500 font-semibold">{lead.score}</span>
        </div>
        <img src={lead.ownerAvatar} alt={lead.ownerName} className="w-6 h-6 rounded-full" title={lead.ownerName} />
      </div>
    </div>
  );
};

interface PipelineColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onCreateLead: (status: LeadStatus) => void;
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({ status, leads, onSelectLead, onCreateLead }) => {
  const { updateLeadStatus } = useLeads();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      updateLeadStatus(leadId, status);
    }
    setIsDragOver(false);
  };

  const totalValue = useMemo(() => leads.reduce((sum, lead) => sum + lead.value, 0), [leads]);

  return (
    <div 
      className={`w-72 xs:w-80 sm:w-96 bg-gray-50 rounded-lg p-1 flex-shrink-0 h-full flex flex-col transition-colors ${isDragOver ? 'bg-blue-100' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center p-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center">
          <GripVertical size={16} className="text-gray-400 mr-1" />
          {status} <span className="text-gray-400 ml-2">{leads.length}</span>
        </h2>
        <span className="text-sm font-bold text-gray-600">${totalValue.toLocaleString()}</span>
      </div>
      <div className="overflow-y-auto px-2 flex-1">
        {leads.map(lead => <LeadCard key={lead.id} lead={lead} onSelectLead={onSelectLead} />)}
        <div className="mb-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            className="w-full"
            onClick={() => onCreateLead(status)}
          >
            Add Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

interface LeadsPipelineViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const LeadsPipelineView: React.FC<LeadsPipelineViewProps> = ({ leads, onSelectLead }) => {
  const { openCreateLeadModal } = useUI();
  const { newLeadStatus, setNewLeadStatus } = useNewLead();

  const leadsByStatus = useMemo(() => {
    const grouped: { [key in LeadStatus]?: Lead[] } = {};
    for (const lead of leads) {
      if (PIPELINE_STAGES.includes(lead.status)) {
        if (!grouped[lead.status]) {
            grouped[lead.status] = [];
        }
        grouped[lead.status]!.push(lead);
      }
    }
    return grouped;
  }, [leads]);
  
  // Function to handle creating a new lead
  const handleCreateLead = (status: LeadStatus) => {
    setNewLeadStatus(status);
    openCreateLeadModal();
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 h-full">
      {PIPELINE_STAGES.map(status => (
        <PipelineColumn
          key={status}
          status={status}
          leads={leadsByStatus[status] || []}
          onSelectLead={onSelectLead}
          onCreateLead={handleCreateLead}
        />
      ))}
    </div>
  );
};

export default LeadsPipelineView;