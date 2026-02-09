# Campaign Module API Contract

## Base URL
`/api/v1/campaigns`

## Authentication
All endpoints require Bearer Token authentication in the Authorization header.

## Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": {
      "field": "phone",
      "value": "+12345"
    }
  }
}
```

## Endpoints

### A) Account Management

#### POST `/api/integrations/whatsapp/connect`
Connect a WhatsApp Business/Official API account

**Request:**
```json
{
  "method": "oauth",
  "payload": {
    "code": "oauth_code_from_provider"
  }
}
```

OR

```json
{
  "method": "token",
  "payload": {
    "access_token": "access_token_here",
    "api_url": "https://api.whatsapp.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account_id": "wa_acc_1234567890",
    "account_name": "Business Name",
    "phone_numbers": ["+1234567890"],
    "connected_by": "user_123",
    "connected_at": "2023-05-15T10:30:00Z"
  }
}
```

#### POST `/api/integrations/whatsapp/disconnect`
Disconnect a WhatsApp account

**Request:**
```json
{
  "account_id": "wa_acc_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account disconnected successfully"
}
```

### B) Contact Import

#### POST `/api/contacts/import`
Import contacts from CSV

**Request (multipart/form-data):**
```form
file: contacts.csv
group: "Customers"
create_group_flag: true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "import_job_1234567890"
  }
}
```

#### GET `/api/imports/{job_id}/status`
Check import job status

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "import_job_1234567890",
    "status": "completed",
    "total_rows": 120,
    "imported_rows": 100,
    "duplicate_rows": 15,
    "invalid_rows": 5,
    "completed_at": "2023-05-15T11:30:00Z"
  }
}
```

### C) Campaign Management

#### POST `/api/campaigns`
Create a new campaign

**Request:**
```json
{
  "name": "Summer Promotion",
  "sender_account_id": "wa_acc_1234567890",
  "message_type": "template",
  "message_body": "Hi {{name}}, check out our summer sale! {{custom_field_1}}",
  "variables": ["name", "custom_field_1"],
  "target_query": {
    "type": "tag",
    "value": ["vip", "premium"]
  },
  "schedule_at": "2023-06-15T14:00:00Z",
  "rate_control": {
    "messages_per_minute": 120
  },
  "retries": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign_id": "camp_1234567890",
    "name": "Summer Promotion",
    "status": "draft"
  }
}
```

#### POST `/api/campaigns/{id}/send`
Send a campaign

**Request:**
```json
{
  "test_phone": "+1234567890" // Optional for test send
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign_id": "camp_1234567890",
    "status": "queued",
    "recipients_count": 1250
  }
}
```

#### GET `/api/campaigns`
List campaigns with filters

**Query Parameters:**
- `date_from`: 2023-05-01
- `date_to`: 2023-05-31
- `sender_id`: wa_acc_1234567890
- `status`: completed
- `search`: "Summer"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "camp_1234567890",
      "name": "Summer Promotion",
      "sender_account_id": "wa_acc_1234567890",
      "sender_name": "Business Name",
      "sender_phone": "+1234567890",
      "created_by": "user_123",
      "created_by_name": "John Doe",
      "recipients_count": 1250,
      "sent_count": 1250,
      "delivered_count": 1200,
      "failed_count": 25,
      "status": "completed",
      "scheduled_at": "2023-06-15T14:00:00Z",
      "created_at": "2023-05-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

#### GET `/api/campaigns/{id}/status`
Get campaign status

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign_id": "camp_1234567890",
    "name": "Summer Promotion",
    "status": "sending",
    "progress": {
      "sent": 850,
      "delivered": 820,
      "failed": 5,
      "pending": 400
    },
    "scheduled_at": "2023-06-15T14:00:00Z",
    "started_at": "2023-06-15T14:01:15Z",
    "estimated_completion": "2023-06-15T16:30:00Z"
  }
}
```

#### GET `/api/campaigns/{id}/recipients`
Get campaign recipients

**Query Parameters:**
- `status`: delivered
- `page`: 1
- `per_page`: 50

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "recipient_1234567890",
      "contact_id": "contact_1234567890",
      "contact_name": "John Doe",
      "phone": "+1234567890",
      "personalized_message": "Hi John, check out our summer sale! Special offer for you.",
      "status": "delivered",
      "provider_response": {
        "message_id": "msg_1234567890",
        "timestamp": "2023-06-15T14:05:22Z"
      },
      "attempted_at": "2023-06-15T14:05:20Z",
      "delivered_at": "2023-06-15T14:05:22Z",
      "retries": 0
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 1250
  }
}
```