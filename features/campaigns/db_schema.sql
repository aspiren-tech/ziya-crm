-- Campaign Module Database Schema

-- WhatsApp Accounts
CREATE TABLE whatsapp_accounts (
  id VARCHAR(36) PRIMARY KEY,
  account_id_from_provider VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  token_encrypted TEXT NOT NULL,
  token_expires_at TIMESTAMP,
  connected_by VARCHAR(36) NOT NULL,
  connected_at TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'connected', -- connected, disconnected, expiring_soon
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts
CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  normalized_phone VARCHAR(20) NOT NULL,
  group_name VARCHAR(100),
  tags JSON,
  custom_fields JSON,
  source VARCHAR(50), -- import, manual, api
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_phone (normalized_phone)
);

-- Contact Groups
CREATE TABLE contact_groups (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Campaigns
CREATE TABLE campaigns (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sender_account_id VARCHAR(36) NOT NULL,
  message_type VARCHAR(20) NOT NULL, -- template, free_text
  message_body TEXT,
  variables JSON,
  target_query JSON,
  schedule_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft', -- draft, queued, sending, completed, failed, cancelled
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sender_account_id) REFERENCES whatsapp_accounts(id)
);

-- Campaign Recipients
CREATE TABLE campaign_recipients (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36),
  phone VARCHAR(20),
  personalized_message TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, read, failed
  provider_response JSON,
  attempted_at TIMESTAMP,
  delivered_at TIMESTAMP,
  retries INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

-- Leads
CREATE TABLE leads (
  id VARCHAR(36) PRIMARY KEY,
  contact_id VARCHAR(36) NOT NULL,
  campaign_id VARCHAR(36) NOT NULL,
  message_snippet TEXT,
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, lost
  assigned_to VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Import Jobs
CREATE TABLE import_jobs (
  id VARCHAR(36) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
  total_rows INT DEFAULT 0,
  imported_rows INT DEFAULT 0,
  duplicate_rows INT DEFAULT 0,
  invalid_rows INT DEFAULT 0,
  group_id VARCHAR(36),
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Audit Logs
CREATE TABLE campaign_audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  action VARCHAR(50) NOT NULL, -- connect, disconnect, send, import
  account_id VARCHAR(36),
  campaign_id VARCHAR(36),
  import_job_id VARCHAR(36),
  details JSON,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);