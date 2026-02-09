# CRM API Documentation

## Overview

This document describes the API structure for the CRM application. The API is organized into logical modules that correspond to the main features of the CRM.

## Base URL

All API endpoints are relative to the base URL: `/api`

For example, to access the leads endpoint, the full URL would be: `/api/leads`

## Authentication

Most endpoints require authentication via JWT tokens. Tokens should be included in the Authorization header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication & User Management
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh authentication token
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get specific user

### Leads Management
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads/{id}` - Get specific lead
- `PUT /api/leads/{id}` - Update specific lead
- `DELETE /api/leads/{id}` - Delete specific lead
- `POST /api/leads/{id}/status` - Update lead status
- `POST /api/leads/{id}/notes` - Add note to lead
- `POST /api/leads/import` - Import leads from external source

### Contacts Management
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts/{id}` - Get specific contact
- `PUT /api/contacts/{id}` - Update specific contact
- `DELETE /api/contacts/{id}` - Delete specific contact
- `POST /api/contacts/import` - Import contacts from external source

### Accounts Management
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create a new account
- `GET /api/accounts/{id}` - Get specific account
- `PUT /api/accounts/{id}` - Update specific account
- `DELETE /api/accounts/{id}` - Delete specific account

### Deals Management
- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create a new deal
- `GET /api/deals/{id}` - Get specific deal
- `PUT /api/deals/{id}` - Update specific deal
- `DELETE /api/deals/{id}` - Delete specific deal
- `POST /api/deals/{id}/stage` - Update deal stage

### Tasks Management
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update specific task
- `DELETE /api/tasks/{id}` - Delete specific task
- `POST /api/tasks/{id}/status` - Update task status

### Campaigns Management
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/{id}` - Get specific campaign
- `PUT /api/campaigns/{id}` - Update specific campaign
- `DELETE /api/campaigns/{id}` - Delete specific campaign
- `GET /api/campaigns/{id}/analytics` - Get campaign analytics

### Invoices Management
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/{id}` - Get specific invoice
- `PUT /api/invoices/{id}` - Update specific invoice
- `DELETE /api/invoices/{id}` - Delete specific invoice
- `POST /api/invoices/{id}/status` - Update invoice status
- `POST /api/invoices/{id}/send` - Send invoice

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create a new notification
- `GET /api/notifications/{id}` - Get specific notification
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/{id}` - Delete specific notification

### Meta Ads Integration
- `POST /api/meta/connect` - Connect Meta account
- `POST /api/meta/disconnect` - Disconnect Meta account
- `GET /api/meta/accounts` - Get Meta ad accounts
- `GET /api/meta/accounts/{accountId}/campaigns` - Get campaigns for an account
- `GET /api/meta/campaigns/{campaignId}/adsets` - Get ad sets for a campaign
- `GET /api/meta/adsets/{adsetId}/ads` - Get ads for an ad set
- `GET /api/meta/forms/{formId}/leads` - Get leads from a form
- `POST /api/meta/leads/import` - Import leads from Meta

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/transcribe` - Transcribe audio
- `POST /api/ai/analyze-lead` - Analyze lead with AI

### Reports & Analytics
- `GET /api/reports/dashboard` - Get dashboard report
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/leads` - Get leads report
- `GET /api/reports/deals` - Get deals report
- `GET /api/reports/performance` - Get performance report

### Templates (WhatsApp)
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create a new template
- `GET /api/templates/{id}` - Get specific template
- `PUT /api/templates/{id}` - Update specific template
- `DELETE /api/templates/{id}` - Delete specific template

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/company` - Get company settings
- `PUT /api/settings/company` - Update company settings

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

All endpoints are subject to rate limiting to prevent abuse. Exceeding the rate limit will result in a 429 (Too Many Requests) response.

## Implementation Notes

1. **Versioning**: Consider adding versioning to your API paths (e.g., `/api/v1/leads`)

2. **Pagination**: For endpoints that return lists, implement pagination using query parameters:
   - `page`: Page number (default: 1)
   - `limit`: Number of items per page (default: 10, max: 100)

3. **Filtering and Sorting**: Support filtering and sorting through query parameters:
   - `sort`: Field to sort by (prefix with `-` for descending order)
   - `filter`: Filter criteria in field:value format

4. **Meta Integration**: The Meta Ads integration endpoints should handle:
   - OAuth flow for authentication
   - Token refresh mechanisms
   - Error handling for common Meta API issues

5. **Webhooks**: The webhook endpoint should:
   - Verify incoming requests using the verification token
   - Handle different types of Meta events (lead generation, etc.)
   - Process and store lead data in your CRM

   