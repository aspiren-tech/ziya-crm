# Meta Webhook Setup for Real-time Lead Updates

This document explains how to set up the Meta webhook endpoint to receive real-time notifications when new leads are generated from your Meta Lead Ads.

## Webhook Endpoint

The webhook endpoint is implemented in `src/api/metaWebhook.ts` and handles incoming notifications from Meta's servers.

Endpoint URL: `POST /api/meta/webhook`

## Setup Instructions

### 1. Deploy the Webhook Endpoint

First, you need to deploy the webhook endpoint to a publicly accessible URL. This can be done by:

- Deploying your application to a cloud provider (AWS, Google Cloud, Azure, etc.)
- Using a tunneling service like ngrok for local development

### 2. Configure Meta App Webhook

1. Go to [Meta for Developers](https://developers.facebook.com/) and navigate to your app
2. In the left sidebar, click on "Webhooks"
3. Click "+ Add Callback URL"
4. Enter the following information:
   - **Callback URL**: Your deployed webhook endpoint URL (e.g., `https://yourdomain.com/api/meta/webhook`)
   - **Verify Token**: A secret token of your choice (store this in your environment variables as `META_WEBHOOK_VERIFY_TOKEN`)
5. Click "Verify and Save"

### 3. Subscribe to Lead Generation Events

1. After verifying the callback URL, select the Facebook page you want to receive lead notifications from
2. Subscribe to the `leadgen` field
3. Click "Done"

## Webhook Verification

When setting up the webhook, Meta will send a GET request to verify the endpoint. The endpoint responds with a challenge to confirm it's working correctly.

## Receiving Lead Notifications

Once set up, Meta will send POST requests to your webhook endpoint whenever a new lead is generated. The system will:

1. Log the new lead information
2. Extract lead details (lead ID, form ID, ad ID)
3. Process and store the lead in your CRM database

## Environment Variables

Make sure to set the following environment variable:

```
META_WEBHOOK_VERIFY_TOKEN=your_secret_verify_token
```

## Testing the Webhook

For local development, you can use ngrok:

1. Install ngrok: `npm install -g ngrok`
2. Run your application locally
3. Expose your local server: `ngrok http 3000` (or your app's port)
4. Use the ngrok HTTPS URL as your callback URL in Meta's webhook settings

## Security Considerations

- Always verify webhook requests come from Meta
- Use HTTPS for your webhook endpoint
- Keep your verify token secret
- Validate all incoming data before processing