# Campaign Module Database Schema

## Tables

### 1. Campaign Accounts
```sql
CREATE TABLE campaign_accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  provider VARCHAR(20) NOT NULL, -- 'whatsapp_business', 'whatsapp_official'
  connection_type VARCHAR(10) NOT NULL, -- 'oauth', 'token'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  phone_number VARCHAR(20),
  display_name VARCHAR(100),
  is_connected BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP,
  disconnected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Contacts
```sql
CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  group_name VARCHAR(100),
  tags JSON,
  custom_field_1 VARCHAR(255),
  custom_field_2 VARCHAR(255),
  is_opted_in BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_phone_user (phone, user_id)
);
```

### 3. Contact Groups
```sql
CREATE TABLE contact_groups (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Contact Group Members
```sql
CREATE TABLE contact_group_members (
  id VARCHAR(36) PRIMARY KEY,
  group_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_contact_group (contact_id, group_id)
);
```

### 5. Campaigns
```sql
CREATE TABLE campaigns (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  account_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'template', 'free_text'
  message_template TEXT,
  message_variables JSON,
  schedule_type VARCHAR(10) NOT NULL, -- 'immediate', 'scheduled'
  scheduled_at TIMESTAMP,
  target_audience_type VARCHAR(20) NOT NULL, -- 'list', 'tag', 'segment'
  target_audience_value JSON,
  rate_control INT DEFAULT 60, -- messages per minute
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'completed', 'paused', 'cancelled'
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (account_id) REFERENCES campaign_accounts(id)
);
```

### 6. Campaign Messages
```sql
CREATE TABLE campaign_messages (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36) NOT NULL,
  message_id VARCHAR(100), -- provider message ID
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
  error_code VARCHAR(50),
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
```

### 7. Campaign Audit Logs
```sql
CREATE TABLE campaign_audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  campaign_id VARCHAR(36),
  account_id VARCHAR(36),
  action VARCHAR(50) NOT NULL, -- 'connect', 'disconnect', 'import', 'send', 'error'
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Leads from Campaign Replies
```sql
CREATE TABLE campaign_leads (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  campaign_message_id VARCHAR(36) NOT NULL,
  contact_id VARCHAR(36) NOT NULL,
  lead_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (campaign_message_id) REFERENCES campaign_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
```