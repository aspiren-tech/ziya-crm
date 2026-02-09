import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import LeadDetailHeader from './components/LeadDetailHeader';
import LeadInfoCard from './components/LeadInfoCard';
import LeadTimeline from './components/LeadTimeline';
import EditLeadModal from './components/EditLeadModal';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadsContext';
import { useTimeline } from '../../contexts/TimelineContext';
import { useUI } from '../../contexts/UIContext';
import { Lead } from '../../types';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leads } = useLeads();
  const { notes, activities } = useTimeline();
  const { isEditLeadModalOpen } = useUI();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const lead = leads.find(l => l.id === id);
  
  if (!lead) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Lead not found</h2>
        <Link to="/leads" className="text-primary hover:underline mt-4 inline-block">
          <ArrowLeft className="inline w-4 h-4 mr-2" />
          Back to Leads
        </Link>
      </div>
    );
  }

  const leadNotes = notes.filter(n => n.leadId === id);
  const leadActivities = activities.filter(a => a.leadId === id);
  
  // Function to handle lead selection for editing
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="space-y-6">
      <div onClick={() => handleSelectLead(lead)}>
        <LeadDetailHeader lead={lead} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LeadInfoCard lead={lead} />
        </div>
        <div className="lg:col-span-2">
          <LeadTimeline lead={lead} notes={leadNotes} activities={leadActivities} />
        </div>
      </div>
      {isEditLeadModalOpen && <EditLeadModal lead={selectedLead} />}
    </div>
  );
};

export default LeadDetailPage;