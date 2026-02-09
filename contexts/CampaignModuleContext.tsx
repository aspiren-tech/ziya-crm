import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  WhatsAppBusinessAccount, 
  Contact, 
  ContactGroup, 
  CampaignModuleItem,
  CampaignRecipient,
  CampaignLead,
  ImportJob,
  CampaignAuditLog,
  WhatsAppTemplate
} from '../types';

interface CampaignModuleContextType {
  accounts: WhatsAppBusinessAccount[];
  contacts: Contact[];
  groups: ContactGroup[];
  campaigns: CampaignModuleItem[];
  recipients: CampaignRecipient[];
  leads: CampaignLead[];
  importJobs: ImportJob[];
  auditLogs: CampaignAuditLog[];
  templates: WhatsAppTemplate[];
  
  // Account methods
  connectAccount: (account: Omit<WhatsAppBusinessAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  disconnectAccount: (accountId: string) => void;
  refreshAccount: (accountId: string) => void;
  removeAccount: (accountId: string) => void;
  
  // Contact methods
  importContacts: (contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  
  // Campaign methods
  createCampaign: (campaign: Omit<CampaignModuleItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (campaignId: string, updates: Partial<CampaignModuleItem>) => void;
  deleteCampaign: (campaignId: string) => void;
  sendCampaign: (campaignId: string) => void;
  sendTestMessage: (campaignId: string, testPhone: string) => void;
  
  // Lead methods
  createLead: (lead: Omit<CampaignLead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (leadId: string, updates: Partial<CampaignLead>) => void;
  
  // Import job methods
  createImportJob: (job: Omit<ImportJob, 'id' | 'createdAt'>) => void;
  updateImportJob: (jobId: string, updates: Partial<ImportJob>) => void;
  
  // Audit log methods
  createAuditLog: (log: Omit<CampaignAuditLog, 'id' | 'createdAt'>) => void;
}

const CampaignModuleContext = createContext<CampaignModuleContextType | undefined>(undefined);

// Mock data for demonstration
const MOCK_ACCOUNTS: WhatsAppBusinessAccount[] = [
  {
    id: 'wa_acc_1',
    accountIdFromProvider: 'provider_123',
    name: 'Business Account',
    phoneNumber: '+1234567890',
    tokenEncrypted: 'encrypted_token_1',
    tokenExpiresAt: '2025-12-31T23:59:59Z',
    connectedBy: 'user_1',
    connectedAt: '2023-05-15T10:30:00Z',
    status: 'connected',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'wa_acc_2',
    accountIdFromProvider: 'provider_456',
    name: 'Expiring Account',
    phoneNumber: '+0987654321',
    tokenEncrypted: 'encrypted_token_2',
    tokenExpiresAt: '2025-06-01T10:00:00Z',
    connectedBy: 'user_1',
    connectedAt: '2023-04-15T10:30:00Z',
    status: 'expiring_soon',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  }
];

const MOCK_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'template_1',
    accountId: 'wa_acc_1',
    name: 'Welcome Message',
    namespace: 'business',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        text: 'Welcome to Our Store!'
      },
      {
        type: 'BODY',
        text: 'Hi {{1}}, welcome to our store! Your {{2}} discount code is {{3}}. Use it before {{4}}.'
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'QUICK_REPLY',
            text: 'Shop Now'
          }
        ]
      }
    ],
    variables: ['1', '2', '3', '4'],
    status: 'APPROVED',
    category: 'MARKETING',
    createdAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-05-10T09:00:00Z'
  },
  {
    id: 'template_2',
    accountId: 'wa_acc_1',
    name: 'Order Confirmation',
    namespace: 'business',
    language: 'en',
    components: [
      {
        type: 'BODY',
        text: 'Hello {{name}}, your order #{{order_id}} has been confirmed! Estimated delivery: {{delivery_date}}.'
      }
    ],
    variables: ['name', 'order_id', 'delivery_date'],
    status: 'APPROVED',
    category: 'UTILITY',
    createdAt: '2023-05-12T14:30:00Z',
    updatedAt: '2023-05-12T14:30:00Z'
  },
  {
    id: 'template_3',
    accountId: 'wa_acc_2',
    name: 'Feedback Request',
    namespace: 'business',
    language: 'en',
    components: [
      {
        type: 'BODY',
        text: 'Hi {{name}}, how was your experience with {{product_name}}? We value your feedback!'
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'QUICK_REPLY',
            text: 'Excellent'
          },
          {
            type: 'QUICK_REPLY',
            text: 'Good'
          },
          {
            type: 'QUICK_REPLY',
            text: 'Needs Improvement'
          }
        ]
      }
    ],
    variables: ['name', 'product_name'],
    status: 'APPROVED',
    category: 'MARKETING',
    createdAt: '2023-05-14T11:15:00Z',
    updatedAt: '2023-05-14T11:15:00Z'
  },
  {
    id: 'template_4',
    accountId: 'wa_acc_1',
    name: 'Appointment Reminder',
    namespace: 'business',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        text: 'Appointment Reminder'
      },
      {
        type: 'BODY',
        text: 'Hi {{name}}, this is a reminder for your appointment on {{date}} at {{time}}. Location: {{location}}.'
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'QUICK_REPLY',
            text: 'Confirm'
          },
          {
            type: 'QUICK_REPLY',
            text: 'Reschedule'
          }
        ]
      }
    ],
    variables: ['name', 'date', 'time', 'location'],
    status: 'APPROVED',
    category: 'UTILITY',
    createdAt: '2023-05-16T16:45:00Z',
    updatedAt: '2023-05-16T16:45:00Z'
  }
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact_1',
    name: 'John Doe',
    phone: '+1234567890',
    normalizedPhone: '+1234567890',
    groupName: 'Customers',
    tags: ['vip', 'premium', 'customer'],
    customFields: {
      custom_field_1: 'Manager',
      custom_field_2: 'Technology'
    },
    source: 'import',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'contact_2',
    name: 'Jane Smith',
    phone: '+1234567891',
    normalizedPhone: '+1234567891',
    groupName: 'Leads',
    tags: ['new', 'interested'],
    customFields: {
      custom_field_1: 'Designer',
      custom_field_2: 'Creative'
    },
    source: 'import',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'contact_3',
    name: 'Bob Johnson',
    phone: '+1234567892',
    normalizedPhone: '+1234567892',
    groupName: 'Customers',
    tags: ['customer'],
    customFields: {
      custom_field_1: 'Developer',
      custom_field_2: 'IT'
    },
    source: 'import',
    createdAt: '2023-05-16T11:30:00Z',
    updatedAt: '2023-05-16T11:30:00Z'
  },
  {
    id: 'contact_4',
    name: 'Alice Williams',
    phone: '+1234567893',
    normalizedPhone: '+1234567893',
    groupName: 'Prospects',
    tags: ['follow-up', 'interested'],
    customFields: {
      custom_field_1: 'Director',
      custom_field_2: 'Marketing'
    },
    source: 'import',
    createdAt: '2023-05-17T14:30:00Z',
    updatedAt: '2023-05-17T14:30:00Z'
  }
];

const MOCK_GROUPS: ContactGroup[] = [
  {
    id: 'group_1',
    name: 'Customers',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  }
];

const MOCK_CAMPAIGNS: CampaignModuleItem[] = [
  {
    id: 'camp_1',
    name: 'Summer Promotion',
    senderAccountId: 'wa_acc_1',
    messageType: 'template',
    messageBody: 'Hi {{name}}, check out our summer sale! {{custom_field_1}}',
    variables: ['name', 'custom_field_1'],
    targetQuery: {
      type: 'tag',
      value: ['vip', 'premium']
    },
    scheduleAt: '2023-06-15T14:00:00Z',
    status: 'completed',
    createdBy: 'user_1',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'camp_2',
    name: 'New Product Launch',
    senderAccountId: 'wa_acc_1',
    messageType: 'template',
    messageBody: 'Hello {{name}}, we have a new product just for you!',
    variables: ['name'],
    targetQuery: {
      type: 'tag',
      value: ['interested']
    },
    scheduleAt: '2023-06-20T10:00:00Z',
    status: 'sending',
    createdBy: 'user_1',
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  },
  {
    id: 'camp_3',
    name: 'Customer Feedback Survey',
    senderAccountId: 'wa_acc_2',
    messageType: 'free_text',
    messageBody: 'Hi {{name}}, could you please take a moment to share your feedback with us?',
    variables: ['name'],
    targetQuery: {
      type: 'tag',
      value: ['customer']
    },
    scheduleAt: '2023-06-25T16:00:00Z',
    status: 'queued',
    createdBy: 'user_2',
    createdAt: '2023-05-25T14:20:00Z',
    updatedAt: '2023-05-25T14:20:00Z'
  }
];

const MOCK_RECIPIENTS: CampaignRecipient[] = [
  {
    id: 'recipient_1',
    campaignId: 'camp_1',
    contactId: 'contact_1',
    phone: '+1234567890',
    personalizedMessage: 'Hi John, check out our summer sale! Special offer for you.',
    status: 'delivered',
    retries: 0,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:35:00Z',
    deliveredAt: '2023-05-15T10:35:00Z',
    attemptedAt: '2023-05-15T10:35:00Z'
  },
  {
    id: 'recipient_2',
    campaignId: 'camp_1',
    contactId: 'contact_2',
    phone: '+1234567891',
    personalizedMessage: 'Hi Jane, check out our summer sale! Special offer for you.',
    status: 'read',
    retries: 0,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:40:00Z',
    deliveredAt: '2023-05-15T10:35:00Z',
    attemptedAt: '2023-05-15T10:35:00Z'
  },
  {
    id: 'recipient_3',
    campaignId: 'camp_1',
    contactId: 'contact_3',
    phone: '+1234567892',
    personalizedMessage: 'Hi Bob, check out our summer sale! Special offer for you.',
    status: 'failed',
    retries: 2,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:45:00Z',
    attemptedAt: '2023-05-15T10:45:00Z'
  },
  {
    id: 'recipient_4',
    campaignId: 'camp_2',
    contactId: 'contact_1',
    phone: '+1234567890',
    personalizedMessage: 'Hello John, we have a new product just for you!',
    status: 'sent',
    retries: 0,
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:20:00Z',
    attemptedAt: '2023-05-20T09:20:00Z'
  },
  {
    id: 'recipient_5',
    campaignId: 'camp_2',
    contactId: 'contact_4',
    phone: '+1234567893',
    personalizedMessage: 'Hello Alice, we have a new product just for you!',
    status: 'pending',
    retries: 0,
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  }
];

const MOCK_LEADS: CampaignLead[] = [
  {
    id: 'lead_1',
    contactId: 'contact_1',
    campaignId: 'camp_1',
    messageSnippet: 'I\'m interested in the summer sale',
    status: 'qualified',
    assignedTo: 'user_1',
    createdAt: '2023-05-15T14:30:00Z',
    updatedAt: '2023-05-16T10:30:00Z'
  },
  {
    id: 'lead_2',
    contactId: 'contact_2',
    campaignId: 'camp_1',
    messageSnippet: 'Can you send me more details?',
    status: 'contacted',
    assignedTo: 'user_2',
    createdAt: '2023-05-16T09:15:00Z',
    updatedAt: '2023-05-16T11:30:00Z'
  },
  {
    id: 'lead_3',
    contactId: 'contact_4',
    campaignId: 'camp_2',
    messageSnippet: 'Not interested at the moment',
    status: 'lost',
    createdAt: '2023-05-21T12:30:00Z',
    updatedAt: '2023-05-21T12:30:00Z'
  }
];

const MOCK_IMPORT_JOBS: ImportJob[] = [
  {
    id: 'import_job_1',
    fileName: 'contacts.csv',
    status: 'completed',
    totalRows: 120,
    importedRows: 100,
    duplicateRows: 15,
    invalidRows: 5,
    groupId: 'group_1',
    createdBy: 'user_1',
    createdAt: '2023-05-15T11:00:00Z',
    completedAt: '2023-05-15T11:30:00Z'
  },
  {
    id: 'import_job_2',
    fileName: 'leads.csv',
    status: 'completed',
    totalRows: 80,
    importedRows: 75,
    duplicateRows: 3,
    invalidRows: 2,
    groupId: 'group_1',
    createdBy: 'user_1',
    createdAt: '2023-05-20T14:00:00Z',
    completedAt: '2023-05-20T14:20:00Z'
  }
];

const MOCK_AUDIT_LOGS: CampaignAuditLog[] = [
  {
    id: 'log_1',
    action: 'connect',
    accountId: 'wa_acc_1',
    createdBy: 'user_1',
    createdAt: '2023-05-15T10:30:00Z'
  }
];

export const CampaignModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<WhatsAppBusinessAccount[]>(MOCK_ACCOUNTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [groups, setGroups] = useState<ContactGroup[]>(MOCK_GROUPS);
  const [campaigns, setCampaigns] = useState<CampaignModuleItem[]>(MOCK_CAMPAIGNS);
  const [recipients, setRecipients] = useState<CampaignRecipient[]>(MOCK_RECIPIENTS);
  const [leads, setLeads] = useState<CampaignLead[]>(MOCK_LEADS);
  const [importJobs, setImportJobs] = useState<ImportJob[]>(MOCK_IMPORT_JOBS);
  const [auditLogs, setAuditLogs] = useState<CampaignAuditLog[]>(MOCK_AUDIT_LOGS);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(MOCK_TEMPLATES);

  // Account methods
  const connectAccount = (account: Omit<WhatsAppBusinessAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: WhatsAppBusinessAccount = {
      ...account,
      id: `wa_acc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAccounts(prev => [...prev, newAccount]);
    
    // Log the action
    createAuditLog({
      action: 'connect',
      accountId: newAccount.id,
      createdBy: account.connectedBy
    });
  };

  const disconnectAccount = (accountId: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, status: 'disconnected', updatedAt: new Date().toISOString() } 
          : account
      )
    );
    
    // Log the action
    createAuditLog({
      action: 'disconnect',
      accountId,
      createdBy: 'user_1' // In real app, get from auth context
    });
  };

  const refreshAccount = (accountId: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, updatedAt: new Date().toISOString() } 
          : account
      )
    );
    
    // Log the action
    createAuditLog({
      action: 'refresh',
      accountId,
      createdBy: 'user_1' // In real app, get from auth context
    });
  };

  const removeAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    
    // Log the action
    createAuditLog({
      action: 'remove',
      accountId,
      createdBy: 'user_1' // In real app, get from auth context
    });
  };

  // Contact methods
  const importContacts = (newContacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const contactsToAdd: Contact[] = newContacts.map(contact => ({
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    setContacts(prev => [...prev, ...contactsToAdd]);
  };

  const createContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: `contact_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, ...updates, updatedAt: new Date().toISOString() } 
          : contact
      )
    );
  };

  // Campaign methods
  const createCampaign = (campaign: Omit<CampaignModuleItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCampaign: CampaignModuleItem = {
      ...campaign,
      id: `camp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const updateCampaign = (campaignId: string, updates: Partial<CampaignModuleItem>) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, ...updates, updatedAt: new Date().toISOString() } 
          : campaign
      )
    );
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    setRecipients(prev => prev.filter(recipient => recipient.campaignId !== campaignId));
  };

  const sendCampaign = (campaignId: string) => {
    updateCampaign(campaignId, { status: 'sending' });
    
    // Simulate sending process
    setTimeout(() => {
      updateCampaign(campaignId, { status: 'completed' });
    }, 3000);
    
    // Log the action
    createAuditLog({
      action: 'send',
      campaignId,
      createdBy: 'user_1' // In real app, get from auth context
    });
  };

  const sendTestMessage = (campaignId: string, testPhone: string) => {
    // In a real implementation, this would send a test message
    console.log(`Sending test message for campaign ${campaignId} to ${testPhone}`);
    
    // Log the action
    createAuditLog({
      action: 'send_test',
      campaignId,
      details: { testPhone },
      createdBy: 'user_1' // In real app, get from auth context
    });
  };

  // Lead methods
  const createLead = (lead: Omit<CampaignLead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: CampaignLead = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLeads(prev => [...prev, newLead]);
  };

  const updateLead = (leadId: string, updates: Partial<CampaignLead>) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, ...updates, updatedAt: new Date().toISOString() } 
          : lead
      )
    );
  };

  // Import job methods
  const createImportJob = (job: Omit<ImportJob, 'id' | 'createdAt'>) => {
    const newJob: ImportJob = {
      ...job,
      id: `import_job_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setImportJobs(prev => [...prev, newJob]);
  };

  const updateImportJob = (jobId: string, updates: Partial<ImportJob>) => {
    setImportJobs(prev => 
      prev.map(job => 
        job.id === jobId 
          ? { ...job, ...updates, updatedAt: new Date().toISOString() } 
          : job
      )
    );
  };

  // Audit log methods
  const createAuditLog = (log: Omit<CampaignAuditLog, 'id' | 'createdAt'>) => {
    const newLog: CampaignAuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  return (
    <CampaignModuleContext.Provider value={{ 
      accounts,
      contacts,
      groups,
      campaigns,
      recipients,
      leads,
      importJobs,
      auditLogs,
      templates,
      connectAccount,
      disconnectAccount,
      refreshAccount,
      removeAccount,
      importContacts,
      createContact,
      updateContact,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      sendCampaign,
      sendTestMessage,
      createLead,
      updateLead,
      createImportJob,
      updateImportJob,
      createAuditLog
    }}>
      {children}
    </CampaignModuleContext.Provider>
  );
};

export const useCampaignModule = () => {
  const context = useContext(CampaignModuleContext);
  if (context === undefined) {
    throw new Error('useCampaignModule must be used within a CampaignModuleProvider');
  }
  return context;
};