# Campaign Module Validation Rules

## Phone Number Validation
- Format: E.164 standard (+[country code][number])
- Examples: +1234567890, +441234567890
- Max length: 15 digits (including country code)
- Normalization: Remove all non-numeric characters except leading +
- Country code fallback: If missing, prompt user for country code

## CSV Import Validation
1. Required columns: phone
2. Recommended columns: name
3. Optional columns: group, tags, custom_field_1, custom_field_2
4. Phone number must be unique per user
5. Tags should be comma-separated values
6. Maximum file size: 10MB
7. Supported formats: CSV only (UTF-8 encoding)

## Campaign Validation
1. Campaign name: 1-255 characters
2. Message template:
   - For WhatsApp templates: Must comply with WhatsApp template rules
   - Variables must be in format {{variable_name}}
   - Required variables: name (if used in template)
3. Schedule:
   - Scheduled time must be in the future
   - For immediate campaigns, send within 1 minute
4. Target audience:
   - Must select at least one contact, tag, or segment
5. Rate control:
   - Min: 1 message/minute
   - Max: 1000 messages/minute
   - Default: 60 messages/minute
6. Retries:
   - Min: 0
   - Max: 10
   - Default: 3

## WhatsApp Template Rules
1. Templates must be pre-approved by WhatsApp
2. Variables must be placeholder-only (no mixed content)
3. No promotional content in templates
4. Templates must include opt-out instructions

## Security Validation
1. Tokens must be encrypted at rest
2. All API requests must be authenticated
3. Rate limiting: 100 requests/minute per user
4. Session timeout: 30 minutes of inactivity
5. Admin-only access to campaign module

## Error Handling
1. Invalid phone rows: Reject with specific error message
2. Missing variables in templates: Mark recipient as error and skip
3. Provider rate limits: Implement exponential backoff
4. Transient errors (5xx): Retry with exponential backoff
5. User-level quotas: Check and enforce daily send limits

## Edge Cases
1. Empty CSV files: Return appropriate error
2. CSV with only headers: Return appropriate error
3. Duplicate phone numbers: Deduplicate and count
4. Invalid UTF-8 encoding: Reject file
5. Exceeding maximum file size: Reject file
6. Missing required fields: Mark as invalid
7. Expired tokens: Prompt for reconnection
8. Disconnected accounts: Prevent campaign sending