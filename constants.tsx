
import { Home, Users, Briefcase, DollarSign, Megaphone, BarChart2, Settings, User, Layers, FileText, Sparkles, CheckSquare, Bell } from 'lucide-react';
import type { Lead, Note, Activity, User as UserType, AdLead, Invoice, Contact, Task, Account, Deal, Campaign, LeadStatus, DealStage } from './types';

export const NAV_LINKS = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Contacts', href: '/contacts', icon: User },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Accounts', href: '/accounts', icon: Briefcase },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Ads Sync', href: '/ads-sync', icon: Layers },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const PIPELINE_STAGES: LeadStatus[] = ['New', 'Contacted', 'Proposal', 'Negotiation', 'Closed - Won'];
export const DEAL_STAGES: DealStage[] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed - Won', 'Closed - Lost'];

export const MOCK_USERS: Record<string, UserType> = {
  user_1: { id: 'user_1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=user_1' },
  user_2: { id: 'user_2', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=user_2' },
};

export const MOCK_NOTES: Note[] = [
    { id: 'note_1', leadId: 'lead_1', authorId: 'user_1', authorName: 'Alex Johnson', authorAvatar: MOCK_USERS.user_1.avatar, content: 'Initial call made, left a voicemail. Sent a follow-up email with brochure.', createdAt: '2025-11-04T11:05:00Z' },
    { id: 'note_2', leadId: 'lead_1', authorId: 'user_1', authorName: 'Alex Johnson', authorAvatar: MOCK_USERS.user_1.avatar, content: 'John called back, seems very interested in the enterprise plan. Scheduled a demo for Friday.', createdAt: '2025-11-05T14:30:00Z' },
    { id: 'note_3', leadId: 'lead_2', authorId: 'user_2', authorName: 'Maria Garcia', authorAvatar: MOCK_USERS.user_2.avatar, content: 'Contacted via LinkedIn. They are evaluating competitors but liked our pricing.', createdAt: '2025-11-03T09:00:00Z' },
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'activity_1', leadId: 'lead_1', type: 'Email', title: 'Follow-up Email Sent', content: 'Sent brochure and pricing details.', createdAt: '2025-11-04T11:06:00Z', authorName: 'Alex Johnson' },
    { id: 'activity_2', leadId: 'lead_1', type: 'Meeting', title: 'Scheduled Demo', content: 'Demo scheduled for Friday at 10 AM.', createdAt: '2025-11-05T14:32:00Z', authorName: 'Alex Johnson' },
    { id: 'activity_3', leadId: 'lead_2', type: 'Call', title: 'Initial Discovery Call', content: 'Had a 15-minute call to discuss their needs.', createdAt: '2025-11-04T16:00:00Z', authorName: 'Maria Garcia' },
    { id: 'activity_4', leadId: 'lead_1', type: 'Task', title: 'Prepare Demo Materials', content: 'Need to prepare a custom demo focusing on integration capabilities.', createdAt: '2025-11-06T09:00:00Z', authorName: 'Alex Johnson' },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead_1',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Inc.',
    email: 'john.doe@acme.com',
    phone: '+1-555-123-4567',
    source: 'Facebook Lead Ad',
    campaignId: 'camp_1',
    status: 'Contacted',
    ownerId: 'user_1',
    ownerName: 'Alex Johnson',
    ownerAvatar: MOCK_USERS.user_1.avatar,
    score: 85,
    value: 15000,
    tags: ['Enterprise', 'High-Priority'],
    createdAt: '2025-11-04T11:00:00.000Z',
    updatedAt: '2025-11-05T14:32:00.000Z',
    notes: ['note_1', 'note_2'],
    activities: ['activity_1', 'activity_2', 'activity_4'],
    attachments: [{ id: 'att_1', name: 'brochure.pdf', url: '#', size: 120450 }]
  },
  {
    id: 'lead_2',
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'Innovate LLC',
    email: 'jane.smith@innovate.com',
    phone: '+1-555-987-6543',
    source: 'Website Form',
    campaignId: 'camp_2',
    status: 'New',
    ownerId: 'user_2',
    ownerName: 'Maria Garcia',
    ownerAvatar: MOCK_USERS.user_2.avatar,
    score: 60,
    value: 5000,
    tags: ['SMB', 'Follow-up'],
    createdAt: '2025-11-03T08:45:00.000Z',
    updatedAt: '2025-11-04T16:00:00.000Z',
    notes: ['note_3'],
    activities: ['activity_3'],
    attachments: []
  },
  {
    id: 'lead_3',
    firstName: 'Peter',
    lastName: 'Jones',
    company: 'Solutions Co.',
    email: 'peter.jones@solutions.co',
    phone: '+1-555-555-5555',
    source: 'Referral',
    campaignId: 'camp_1',
    status: 'Proposal',
    ownerId: 'user_1',
    ownerName: 'Alex Johnson',
    ownerAvatar: MOCK_USERS.user_1.avatar,
    score: 95,
    value: 25000,
    tags: ['Hot Lead'],
    createdAt: '2025-11-02T15:20:00.000Z',
    updatedAt: '2025-11-05T10:00:00.000Z',
    notes: [],
    activities: [],
    attachments: []
  },
  {
    id: 'lead_4',
    firstName: 'Emily',
    lastName: 'White',
    company: 'Global Tech',
    email: 'emily.white@globaltech.com',
    phone: '+1-555-234-5678',
    source: 'Trade Show',
    campaignId: 'camp_3',
    status: 'Lost',
    ownerId: 'user_2',
    ownerName: 'Maria Garcia',
    ownerAvatar: MOCK_USERS.user_2.avatar,
    score: 40,
    value: 8000,
    tags: ['Competitor'],
    createdAt: '2025-10-28T12:00:00.000Z',
    updatedAt: '2025-11-01T18:00:00.000Z',
    notes: [],
    activities: [],
    attachments: []
  },
   {
    id: 'lead_5',
    firstName: 'Michael',
    lastName: 'Brown',
    company: 'Creative Agency',
    email: 'michael.b@creative.co',
    phone: '+1-555-303-3030',
    source: 'Organic Search',
    campaignId: 'camp_2',
    status: 'New',
    ownerId: 'user_1',
    ownerName: 'Alex Johnson',
    ownerAvatar: MOCK_USERS.user_1.avatar,
    score: 70,
    value: 12000,
    tags: ['Marketing'],
    createdAt: '2025-11-06T10:00:00.000Z',
    updatedAt: '2025-11-06T10:00:00.000Z',
    notes: [],
    activities: [],
    attachments: []
  },
  {
    id: 'lead_6',
    firstName: 'Sarah',
    lastName: 'Davis',
    company: 'Data Dynamics',
    email: 'sarah.d@datadyn.com',
    phone: '+1-555-404-4040',
    source: 'LinkedIn',
    campaignId: 'camp_3',
    status: 'Negotiation',
    ownerId: 'user_2',
    ownerName: 'Maria Garcia',
    ownerAvatar: MOCK_USERS.user_2.avatar,
    score: 90,
    value: 50000,
    tags: ['Big Data', 'Enterprise'],
    createdAt: '2025-11-01T11:00:00.000Z',
    updatedAt: '2025-11-07T14:00:00.000Z',
    notes: [],
    activities: [],
    attachments: []
  },
  {
    id: 'lead_7',
    firstName: 'David',
    lastName: 'Wilson',
    company: 'HealthWell',
    email: 'david.w@healthwell.io',
    phone: '+1-555-606-6060',
    source: 'Referral',
    campaignId: 'camp_1',
    status: 'Closed - Won',
    ownerId: 'user_1',
    ownerName: 'Alex Johnson',
    ownerAvatar: MOCK_USERS.user_1.avatar,
    score: 98,
    value: 75000,
    tags: ['Healthcare', 'High-Value'],
    createdAt: '2025-10-15T09:30:00.000Z',
    updatedAt: '2025-11-05T17:00:00.000Z',
    notes: [],
    activities: [],
    attachments: []
  }
];

export const MOCK_AD_LEADS: AdLead[] = [
  {
    id: 'ad_lead_1',
    created_time: '2025-11-10T10:00:00Z',
    ad_name: 'Q4 Promo Ad',
    campaign_name: 'Winter Sale Campaign',
    form_name: 'Contact Us Form',
    field_data: {
      full_name: 'Alice Wonder',
      email: 'alice.w@example.com',
      phone_number: '+1-555-111-2222',
      company_name: 'Wonderland Creations'
    }
  },
  {
    id: 'ad_lead_2',
    created_time: '2025-11-10T09:30:00Z',
    ad_name: 'New Feature Ad',
    campaign_name: 'Product Launch Campaign',
    form_name: 'Sign Up Form',
    field_data: {
      full_name: 'Bob Builder',
      email: 'bob.b@example.net',
      phone_number: '+1-555-333-4444',
    }
  },
  {
    id: 'ad_lead_3',
    created_time: '2025-11-09T18:15:00Z',
    ad_name: 'Q4 Promo Ad',
    campaign_name: 'Winter Sale Campaign',
    form_name: 'Contact Us Form',
    field_data: {
      full_name: 'Charlie Chaplin',
      email: 'charlie.c@example.org',
      phone_number: '+1-555-555-6666',
      company_name: 'Silent Films Co.'
    }
  },
   {
    id: 'ad_lead_4',
    created_time: '2025-11-09T15:00:00Z',
    ad_name: 'Webinar Sign-up Ad',
    campaign_name: 'Educational Series',
    form_name: 'Webinar Registration',
    field_data: {
      full_name: 'Diana Prince',
      email: 'diana.p@example.io',
      phone_number: '+1-555-777-8888',
      company_name: 'Themyscira Corp'
    }
  },
];

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv_1',
        invoiceNumber: 'INV-001',
        clientName: 'John Doe',
        clientCompany: 'Acme Inc.',
        clientEmail: 'john.doe@acme.com',
        issueDate: '2025-11-05',
        dueDate: '2025-11-20',
        status: 'Paid',
        taxRate: 8,
        items: [
            { id: 'item_1', description: 'Enterprise Plan Subscription - November', quantity: 1, price: 500 },
            { id: 'item_2', description: 'Onboarding & Training Service', quantity: 1, price: 250 },
        ],
    },
    {
        id: 'inv_2',
        invoiceNumber: 'INV-002',
        clientName: 'Jane Smith',
        clientCompany: 'Innovate LLC',
        clientEmail: 'jane.smith@innovate.com',
        issueDate: '2025-11-10',
        dueDate: '2025-11-25',
        status: 'Due',
        taxRate: 8,
        items: [
            { id: 'item_3', description: 'Pro Plan Subscription - Yearly', quantity: 1, price: 1200 },
        ],
    },
     {
        id: 'inv_3',
        invoiceNumber: 'INV-003',
        clientName: 'Peter Jones',
        clientCompany: 'Solutions Co.',
        clientEmail: 'peter.jones@solutions.co',
        issueDate: '2025-10-15',
        dueDate: '2025-10-30',
        status: 'Overdue',
        taxRate: 5,
        items: [
            { id: 'item_4', description: 'Custom Development Work', quantity: 10, price: 150 },
            { id: 'item_5', description: 'API Integration Module', quantity: 1, price: 750 },
        ],
    },
     {
        id: 'inv_4',
        invoiceNumber: 'INV-004',
        clientName: 'Alice Wonder',
        clientCompany: 'Wonderland Creations',
        clientEmail: 'alice.w@example.com',
        issueDate: '2025-11-12',
        dueDate: '2025-11-27',
        status: 'Draft',
        taxRate: 0,
        items: [
            { id: 'item_6', description: 'Initial Consultation', quantity: 2, price: 100 },
        ],
    },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'contact_1', name: 'Salman Khan', phone: '918148035472', normalizedPhone: '+918148035472', tags: ['VIP'], source: 'Referral', customFields: {}, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { id: 'contact_2', name: 'Aisha Khan', phone: '919876543210', normalizedPhone: '+919876543210', tags: ['New Customer', 'Follow-up'], source: 'Web Form', customFields: {}, createdAt: '2025-11-02T11:00:00Z', updatedAt: '2025-11-02T11:00:00Z' },
  { id: 'contact_3', name: 'Deepika Padukone', phone: '918887776665', normalizedPhone: '+918887776665', tags: ['Influencer'], source: 'Social Media', customFields: {}, createdAt: '2025-11-03T12:00:00Z', updatedAt: '2025-11-03T12:00:00Z' },
  { id: 'contact_4', name: 'Anushka Sharma', phone: '919998887776', normalizedPhone: '+919998887776', tags: [], source: 'Event', customFields: {}, createdAt: '2025-11-04T13:00:00Z', updatedAt: '2025-11-04T13:00:00Z' },
];

export const MOCK_TASKS: Task[] = [
  { id: 'task_1', title: 'Follow up with John Doe', status: 'Pending', priority: 'High', dueDate: '2025-11-15', assignedToId: 'user_1', relatedTo: { type: 'Lead', id: 'lead_1', name: 'John Doe'} },
  { id: 'task_2', title: 'Prepare Q4 sales report', status: 'In Progress', priority: 'Medium', dueDate: '2025-11-20', assignedToId: 'user_1' },
  { id: 'task_3', title: 'Send welcome kit to Jane Smith', status: 'Completed', priority: 'Low', dueDate: '2025-11-10', assignedToId: 'user_2', relatedTo: { type: 'Lead', id: 'lead_2', name: 'Jane Smith'} },
  { id: 'task_4', title: 'Schedule demo for Solutions Co.', status: 'Pending', priority: 'High', dueDate: '2025-11-18', assignedToId: 'user_1', relatedTo: { type: 'Deal', id: 'deal_1', name: 'Solutions Co. Deal'} },
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc_1', name: 'Acme Inc.', industry: 'Technology', phone: '+1-555-123-4567', website: 'acme.com', ownerId: 'user_1' },
  { id: 'acc_2', name: 'Innovate LLC', industry: 'Software', phone: '+1-555-987-6543', website: 'innovate.com', ownerId: 'user_2' },
  { id: 'acc_3', name: 'Solutions Co.', industry: 'Consulting', phone: '+1-555-555-5555', website: 'solutions.co', ownerId: 'user_1' },
  { id: 'acc_4', name: 'Global Tech', industry: 'Hardware', phone: '+1-555-234-5678', website: 'globaltech.com', ownerId: 'user_2' },
];

export const MOCK_DEALS: Deal[] = [
  { id: 'deal_1', name: 'Acme Inc. - Enterprise License', accountId: 'acc_1', accountName: 'Acme Inc.', stage: 'Proposal', value: 15000, closeDate: '2025-11-30', ownerId: 'user_1' },
  { id: 'deal_2', name: 'Innovate LLC - Platform Upgrade', accountId: 'acc_2', accountName: 'Innovate LLC', stage: 'Qualification', value: 5000, closeDate: '2025-12-15', ownerId: 'user_2' },
  { id: 'deal_3', name: 'Solutions Co. - Consulting Retainer', accountId: 'acc_3', accountName: 'Solutions Co.', stage: 'Negotiation', value: 25000, closeDate: '2025-11-25', ownerId: 'user_1' },
  { id: 'deal_4', name: 'Data Dynamics - Big Data Solution', accountId: 'acc_4', accountName: 'Data Dynamics', stage: 'Closed - Won', value: 50000, closeDate: '2025-11-08', ownerId: 'user_2' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp_1', name: 'Winter Sale Campaign', type: 'Email', status: 'Active', audience: 1250, createdAt: '2025-11-01' },
  { id: 'camp_2', name: 'Product Launch Campaign', type: 'Social Media', status: 'Active', audience: 5000, createdAt: '2025-10-25' },
  { id: 'camp_3', name: 'Q4 Promo Ad', type: 'Broadcast', status: 'Completed', audience: 850, createdAt: '2025-10-15' },
  { id: 'camp_4', name: 'Educational Series', type: 'API', status: 'Inactive', audience: 2200, createdAt: '2025-09-20' },
];

export const COMPANY_INFO = {
  name: 'ZIYA CRM Inc.',
  address: '123 Business Avenue, Suite 100\nBusiness City, BC 12345',
  phone: '+1 (555) 123-4567',
  email: 'info@ziya-crm.com',
  website: 'www.ziya-crm.com',
  logo: 'https://placehold.co/100x40/2a75d1/white?text=ZIYA+CRM'
};
