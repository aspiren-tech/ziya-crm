# Campaign Module API Specification

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

### 1. Connect Account
**POST** `/accounts/connect`

**Request:**
```json
{
  "provider": "whatsapp_business",
  "connection_type": "oauth",
  "access_token": "oauth_access_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account_id": "acc_1234567890",
    "provider": "whatsapp_business",
    "phone_number": "+1234567890",
    "display_name": "Business Name",
    "is_connected": true,
    "connected_at": "2023-05-15T10:30:00Z"
  }
}
```

### 2. Disconnect Account
**POST** `/accounts/disconnect`

**Request:**
```json
{
  "account_id": "acc_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account disconnected successfully"
}
```

### 3. Import Contacts
**POST** `/contacts/import`

**Request (multipart/form-data):**
```form
file: contacts.csv
create_group: true
group_name: "Imported May 2023"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_processed": 150,
    "imported": 142,
    "skipped": 5,
    "errors": 3,
    "group_id": "grp_1234567890"
  }
}
```

### 4. Create Campaign
**POST** `/campaigns`

**Request:**
```json
{
  "name": "Summer Promotion",
  "account_id": "acc_1234567890",
  "type": "template",
  "message_template": "Hi {{name}}, check out our summer sale! {{custom_field_1}}",
  "message_variables": ["name", "custom_field_1"],
  "schedule_type": "scheduled",
  "scheduled_at": "2023-06-15T14:00:00Z",
  "target_audience_type": "tag",
  "target_audience_value": ["vip", "premium"],
  "rate_control": 120
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign_id": "camp_1234567890",
    "name": "Summer Promotion",
    "status": "scheduled",
    "scheduled_at": "2023-06-15T14:00:00Z"
  }
}
```

### 5. Send Campaign
**POST** `/campaigns/{campaign_id}/send`

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
    "status": "sending",
    "total_messages": 1250,
    "estimated_completion": "2023-06-15T16:30:00Z"
  }
}
```

### 6. Get Campaign Status
**GET** `/campaigns/{campaign_id}/status`

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
      "bounced": 25
    },
    "scheduled_at": "2023-06-15T14:00:00Z",
    "started_at": "2023-06-15T14:01:15Z",
    "estimated_completion": "2023-06-15T16:30:00Z"
  }
}
```

### 7. List Campaigns
**GET** `/campaigns?status=completed&date_from=2023-05-01&date_to=2023-05-31`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "campaign_id": "camp_1234567890",
      "name": "Summer Promotion",
      "status": "completed",
      "sent_count": 1250,
      "delivered_count": 1200,
      "failed_count": 25,
      "bounced_count": 25,
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