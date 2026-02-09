import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_LEADS, MOCK_USERS } from '../constants';
import type { Lead, AdLead, LeadStatus } from '../types';

interface LeadsContextType {
  leads: Lead[];
  addLeads: (adLeads: AdLead[]) => void;
  createLead: (leadData: Pick<Lead, 'firstName' | 'lastName' | 'email' | 'company' | 'phone'>, status?: LeadStatus) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  editLead: (leadId: string, leadData: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addLeads = (adLeads: AdLead[]) => {
    const newLeads: Lead[] = adLeads.map(adLead => {
      // Parse the full name into first and last name
      const nameParts = adLead.field_data.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Determine the source based on campaign name
      const source = adLead.campaign_name ? `Meta Ad: ${adLead.campaign_name}` : 'Meta Ad';
      
      return {
        id: `imported_${adLead.id}`,
        firstName,
        lastName,
        company: adLead.field_data.company_name || 'N/A',
        email: adLead.field_data.email,
        phone: adLead.field_data.phone_number || '',
        source: source,
        campaignId: adLead.campaign_name || '',
        status: 'New',
        ownerId: 'user_2', // Assign to a default user
        ownerName: MOCK_USERS.user_2.name,
        ownerAvatar: MOCK_USERS.user_2.avatar,
        score: 50, // Default score for new ad leads
        value: 0, // Default value, should be updated manually
        tags: ['Meta Ad'],
        createdAt: adLead.created_time,
        updatedAt: adLead.created_time,
        notes: [],
        activities: [],
        attachments: [],
      };
    });

    // Filter out leads that are already in the system to prevent duplicates
    const uniqueNewLeads = newLeads.filter(newLead => !leads.some(existingLead => existingLead.id === newLead.id));

    if (uniqueNewLeads.length > 0) {
      setLeads(prevLeads => [...prevLeads, ...uniqueNewLeads]);
    }
  };

  const createLead = (leadData: Pick<Lead, 'firstName' | 'lastName' | 'email' | 'company' | 'phone'>, status: LeadStatus = 'New') => {
    const defaultOwner = MOCK_USERS.user_1;
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      source: 'Manual Entry',
      campaignId: '',
      status: status,
      ownerId: defaultOwner.id,
      ownerName: defaultOwner.name,
      ownerAvatar: defaultOwner.avatar,
      score: 50,
      value: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      activities: [],
      attachments: [],
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };
  
  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId
          ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  };

  const editLead = (leadId: string, leadData: Partial<Lead>) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId
          ? { ...lead, ...leadData, updatedAt: new Date().toISOString() }
          : lead
      )
    );
  };

  const deleteLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLeads, createLead, updateLeadStatus, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};