export type LeadStatus = 'New' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Closed - Won' | 'Lost' | 'Qualified';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
}

export interface Note {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id:string;
  leadId: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task';
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  campaignId: string;
  status: LeadStatus;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  score: number;
  value: number; // Potential deal value
  tags: string[];
  createdAt: string;
  updatedAt: string;
  notes: string[]; // array of note IDs
  activities: string[]; // array of activity IDs
  attachments: Attachment[];
}

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface AdLead {
  id: string;
  created_time: string;
  ad_name: string;
  campaign_name: string;
  form_name: string;
  field_data: {
    full_name: string;
    email: string;
    phone_number: string;
    company_name?: string;
  };
}

export type InvoiceStatus = 'Paid' | 'Due' | 'Overdue' | 'Draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  taxRate: number; // as a percentage, e.g., 8 for 8%
}

export type NotificationType = 'invoice_overdue' | 'invoice_due_soon' | 'payment_received' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string; // e.g., invoice ID
  relatedEntityType?: 'invoice' | 'lead' | 'deal';
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string; // For scheduled notifications
  sentAt?: string; // When the notification was actually sent
}

export type ContactStatus = 'Active' | 'Inactive';
export type ContactState = 'Handled' | 'Pending';

export interface CampaignAccount {
  id: string;
  userId: string;
  provider: 'whatsapp_business' | 'whatsapp_official';
  connectionType: 'oauth' | 'token';
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  phoneNumber: string;
  displayName: string;
  isConnected: boolean;
  connectedAt?: string;
  disconnectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppBusinessAccount {
  id: string;
  accountIdFromProvider: string;
  name: string;
  phoneNumber: string;
  tokenEncrypted: string;
  tokenExpiresAt?: string;
  connectedBy: string;
  connectedAt: string;
  status: 'connected' | 'disconnected' | 'expiring_soon';
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  accountId: string;
  name: string;
  namespace: string;
  language: string;
  components: {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    text?: string;
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone?: string;
    }>;
  }[];
  variables: string[];
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name?: string;
  phone: string;
  normalizedPhone: string;
  groupName?: string;
  tags: string[];
  customFields: Record<string, string>;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CampaignModuleStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused' | 'cancelled';

export type CampaignMessageType = 'template' | 'free_text';

export type ScheduleType = 'immediate' | 'scheduled';

export type TargetAudienceType = 'list' | 'tag' | 'segment';

export interface CampaignModule {
  id: string;
  userId: string;
  accountId: string;
  name: string;
  type: CampaignMessageType;
  messageTemplate?: string;
  messageVariables?: string[];
  scheduleType: ScheduleType;
  scheduledAt?: string;
  targetAudienceType: TargetAudienceType;
  targetAudienceValue?: any;
  rateControl: number;
  status: CampaignModuleStatus;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  bouncedCount: number;
  createdAt: string;
  updatedAt: string;
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

export interface CampaignMessage {
  id: string;
  campaignId: string;
  contactId: string;
  messageId?: string;
  status: MessageStatus;
  errorCode?: string;
  errorMessage?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignModuleItem {
  id: string;
  name: string;
  senderAccountId: string;
  messageType: 'template' | 'free_text';
  messageBody?: string;
  variables: string[];
  targetQuery: {
    type: 'list' | 'group' | 'tag' | 'manual' | 'imported_csv_job' | 'meta_form';
    value: any;
  };
  scheduleAt?: string;
  status: 'draft' | 'queued' | 'sending' | 'completed' | 'failed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactId?: string;
  phone?: string;
  personalizedMessage?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  providerResponse?: any;
  attemptedAt?: string;
  deliveredAt?: string;
  retries: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignLead {
  id: string;
  contactId: string;
  campaignId: string;
  messageSnippet?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  totalRows: number;
  importedRows: number;
  duplicateRows: number;
  invalidRows: number;
  groupId?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface CampaignAuditLog {
  id: string;
  action: string;
  accountId?: string;
  campaignId?: string;
  importJobId?: string;
  details?: any;
  createdBy: string;
  createdAt: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedToId: string;
  relatedTo?: {
    type: 'Lead' | 'Contact' | 'Deal';
    id: string;
    name: string;
  };
}

export type DealStage = 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed - Won' | 'Closed - Lost';

export interface Deal {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  stage: DealStage;
  value: number;
  closeDate: string;
  ownerId: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  phone: string;
  website: string;
  ownerId: string;
}

export type CampaignStatus = 'Active' | 'Inactive' | 'Completed';
export type CampaignType = 'Email' | 'Social Media' | 'Broadcast' | 'API' | 'Scheduled';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audience: number;
  createdAt: string;
}