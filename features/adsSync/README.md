# Meta Ads Sync Module

## Overview
This module integrates with Meta's Marketing API to sync advertising campaigns and leads directly into the CRM system. It provides a comprehensive interface for managing Meta ad accounts, campaigns, ad sets, ads, and lead data.

## Features Implemented

### 1. Account Connection
- OAuth integration with Meta (simulated)
- Manual login option for testing
- Persistent account storage using localStorage
- Account disconnection functionality

### 2. Campaign Management
- Fetch and display ad campaigns from Meta accounts
- View campaign details including:
  - Name and status
  - Objective (LEAD_GENERATION, CONVERSIONS, BRAND_AWARENESS, etc.)
  - Creation date and schedule
- Campaign performance metrics (simulated)

### 3. Ad Set Management
- Navigate from campaigns to ad sets
- View ad set details:
  - Name and status
  - Budget information
  - Targeting parameters
  - Schedule information

### 4. Ad Management
- View individual ads within ad sets
- Ad details including:
  - Name and status
  - Creative type
  - Creation date

### 5. Lead Retrieval
- Fetch leads from Lead Ads forms
- Display lead information in a table format
- Lead details include:
  - Full name
  - Email address
  - Phone number
  - Company name (when available)

### 6. Lead Import
- Select leads for import to CRM
- Bulk import functionality
- Mapping modal for field alignment
- Status tracking (imported vs pending)

## Architecture

### Components
- `AdsSyncPage.tsx` - Main page component
- `AdsLeadsTable.tsx` - Table display for leads
- `MappingModal.tsx` - Lead import mapping interface
- `MetaOAuthButton.tsx` - OAuth connection button

### Services
- `metaApi.ts` - Meta API service layer (simulated)

### Context
- `MetaAccountContext.tsx` - Account state management

## API Integration Structure

The module is structured to work with Meta's Marketing API v20.0:

### Endpoints Implemented (Simulated)
- `GET /me/adaccounts` - Fetch ad accounts
- `GET /{ad_account_id}/campaigns` - Fetch campaigns
- `GET /{campaign_id}/adsets` - Fetch ad sets
- `GET /{adset_id}/ads` - Fetch ads
- `GET /{form_id}/leads` - Fetch lead data

### Permissions Required
- `ads_read`
- `ads_management`
- `business_management`
- `leads_retrieval`
- `pages_read_engagement`
- `pages_show_list`

## Data Flow

1. **Authentication**
   - User connects Meta account via OAuth or manual login
   - Access token is stored securely
   - Ad accounts are fetched and cached

2. **Campaign Browsing**
   - Campaigns are fetched for the selected ad account
   - User can drill down into campaign details
   - Ad sets are loaded for selected campaigns
   - Ads are loaded for selected ad sets

3. **Lead Management**
   - Leads are fetched for campaigns with Lead Ads forms
   - Leads are displayed in a table with selection capabilities
   - Selected leads can be imported to the CRM

4. **Import Process**
   - User selects leads to import
   - Mapping modal allows field alignment
   - Leads are added to the CRM Leads context
   - Imported leads are marked as such in the UI

## Future Enhancements

### Backend Integration
- Implement actual Meta API calls
- Add webhook support for real-time lead updates
- Create database schema for persistent storage
- Add server-side authentication and token management

### Advanced Features
- Campaign performance analytics
- Automated lead scoring
- Lead assignment rules
- Campaign optimization suggestions
- A/B testing capabilities

### UI Improvements
- Advanced filtering and sorting
- Export functionality (CSV, Excel)
- Campaign comparison views
- Performance dashboards
- Custom field mapping

## Usage Instructions

1. **Connect Account**
   - Click "Connect to Meta Account" button
   - Use OAuth flow or manual login for testing
   - Account information will be persisted

2. **Browse Campaigns**
   - View list of available campaigns
   - Click "View Details" or double-click to drill down
   - Navigate through campaigns → ad sets → ads

3. **Fetch Leads**
   - On campaign detail view, click "Fetch Leads"
   - View leads in the table interface
   - Select leads for import

4. **Import Leads**
   - Check boxes next to leads to select them
   - Click "Import Selected Leads" button
   - Confirm field mapping in the modal
   - Leads will appear in the main CRM leads list

## Technical Notes

- All API calls are currently simulated with realistic delays
- Data structures match Meta's API response formats
- Error handling and loading states are implemented
- Responsive design follows CRM UI patterns
- TypeScript interfaces ensure type safety