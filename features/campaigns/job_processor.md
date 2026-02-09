# Campaign Module Job Processor Pseudocode

## Campaign Sending Processor

```python
# Campaign sending job processor
class CampaignProcessor:
    def __init__(self, db, whatsapp_client, rate_limiter):
        self.db = db
        self.whatsapp_client = whatsapp_client
        self.rate_limiter = rate_limiter

    def process_campaign_queue(self):
        # Get campaigns ready to send
        campaigns = self.db.get_campaigns_by_status('queued')
        
        for campaign in campaigns:
            self.process_campaign(campaign)

    def process_campaign(self, campaign):
        # Update campaign status to sending
        self.db.update_campaign_status(campaign.id, 'sending')
        
        # Get recipients for this campaign
        recipients = self.db.get_pending_recipients(campaign.id)
        
        # Process recipients respecting rate limits
        for recipient in recipients:
            # Check rate limit
            if not self.rate_limiter.can_send(campaign.sender_account_id):
                # Wait for rate limit to reset
                wait_time = self.rate_limiter.get_wait_time(campaign.sender_account_id)
                time.sleep(wait_time)
            
            # Send message
            result = self.send_message(campaign, recipient)
            
            # Update recipient status
            self.db.update_recipient_status(recipient.id, result)
            
            # Update campaign progress
            self.db.update_campaign_progress(campaign.id)
            
            # Check for rate limit response
            if result.get('rate_limited'):
                # Apply exponential backoff
                backoff_time = self.calculate_backoff(result.get('retries', 0))
                time.sleep(backoff_time)
                
        # Check if campaign is complete
        if self.db.is_campaign_complete(campaign.id):
            self.db.update_campaign_status(campaign.id, 'completed')

    def send_message(self, campaign, recipient):
        # Prepare message with personalized content
        message = self.personalize_message(campaign.message_body, recipient)
        
        # Send via WhatsApp API
        try:
            response = self.whatsapp_client.send_message(
                account_id=campaign.sender_account_id,
                to=recipient.phone,
                message=message,
                media=campaign.media  # if any
            )
            
            return {
                'status': 'sent',
                'message_id': response.get('message_id'),
                'timestamp': response.get('timestamp'),
                'retries': 0
            }
            
        except WhatsAppAPIError as e:
            # Handle different error types
            if e.is_transient():
                # Check retry count
                if recipient.retries < campaign.max_retries:
                    return {
                        'status': 'retry',
                        'error': str(e),
                        'retries': recipient.retries + 1
                    }
                else:
                    return {
                        'status': 'failed',
                        'error': f'Max retries exceeded: {str(e)}',
                        'retries': recipient.retries
                    }
            else:
                # Permanent error
                return {
                    'status': 'failed',
                    'error': str(e),
                    'retries': recipient.retries
                }
        except Exception as e:
            # Unexpected error
            return {
                'status': 'failed',
                'error': f'Unexpected error: {str(e)}',
                'retries': recipient.retries
            }

    def personalize_message(self, template, recipient):
        # Replace variables in template
        message = template
        contact_data = self.db.get_contact_data(recipient.contact_id)
        
        # Replace all variables
        for variable in self.extract_variables(template):
            if variable in contact_data:
                message = message.replace(f'{{{{{variable}}}}}', contact_data[variable])
            else:
                # Handle missing variables
                message = message.replace(f'{{{{{variable}}}}}', '[Missing Data]')
                
        return message

    def extract_variables(self, template):
        # Extract variables in format {{variable_name}}
        import re
        return re.findall(r'{{(.*?)}}', template)

    def calculate_backoff(self, retry_count):
        # Exponential backoff: 1s, 2s, 4s, 8s, etc.
        return min(2 ** retry_count, 300)  # Max 5 minutes

# Rate limiter
class RateLimiter:
    def __init__(self, db):
        self.db = db
        self.limits = {}  # In-memory cache of limits
        
    def can_send(self, account_id):
        # Check if account can send based on rate limit
        limit = self.get_account_limit(account_id)
        sent_count = self.get_sent_count(account_id)
        return sent_count < limit
    
    def get_wait_time(self, account_id):
        # Calculate wait time until next send window
        # Simplified implementation
        return 60  # Wait 1 minute
        
    def get_account_limit(self, account_id):
        # Get rate limit for account (messages per minute)
        if account_id not in self.limits:
            account = self.db.get_whatsapp_account(account_id)
            self.limits[account_id] = account.rate_limit or 60
        return self.limits[account_id]
        
    def get_sent_count(self, account_id):
        # Get messages sent in current minute
        return self.db.get_messages_sent_in_window(account_id, window_minutes=1)

# WhatsApp API client
class WhatsAppAPIClient:
    def __init__(self, db):
        self.db = db
        
    def send_message(self, account_id, to, message, media=None):
        # Get account details
        account = self.db.get_whatsapp_account(account_id)
        
        # Decrypt token
        token = self.decrypt_token(account.token_encrypted)
        
        # Prepare API request
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'to': to,
            'message': message
        }
        
        if media:
            payload['media'] = media
            
        # Send request
        response = requests.post(
            f'{account.api_url}/messages',
            headers=headers,
            json=payload
        )
        
        # Handle response
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 429:
            # Rate limited
            raise WhatsAppAPIError('Rate limited', transient=True)
        elif response.status_code >= 500:
            # Server error (transient)
            raise WhatsAppAPIError(f'Server error: {response.status_code}', transient=True)
        else:
            # Client error (permanent)
            raise WhatsAppAPIError(f'Client error: {response.status_code} - {response.text}', transient=False)

    def decrypt_token(self, encrypted_token):
        # Decrypt token using system key
        # Implementation depends on encryption method used
        pass

# Custom exceptions
class WhatsAppAPIError(Exception):
    def __init__(self, message, transient=False):
        super().__init__(message)
        self.transient = transient
        
    def is_transient(self):
        return self.transient
```

## Contact Import Processor

```python
# Contact import job processor
class ContactImportProcessor:
    def __init__(self, db, file_storage):
        self.db = db
        self.file_storage = file_storage
        
    def process_import_job(self, job_id):
        # Get import job details
        job = self.db.get_import_job(job_id)
        
        # Download file
        file_path = self.file_storage.download(job.file_name)
        
        # Process CSV
        results = self.process_csv(file_path, job)
        
        # Update job status
        self.db.update_import_job_status(job_id, 'completed', results)
        
        return results
        
    def process_csv(self, file_path, job):
        import csv
        import phonenumbers
        
        results = {
            'total_rows': 0,
            'imported_rows': 0,
            'duplicate_rows': 0,
            'invalid_rows': 0,
            'errors': []
        }
        
        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row_num, row in enumerate(reader, start=1):
                results['total_rows'] += 1
                
                try:
                    # Validate and normalize phone number
                    phone = self.normalize_phone(row.get('phone'))
                    
                    # Check for duplicates
                    if self.db.contact_exists(phone):
                        results['duplicate_rows'] += 1
                        continue
                        
                    # Create contact record
                    contact_data = {
                        'name': row.get('name'),
                        'phone': phone,
                        'normalized_phone': phone,
                        'group_name': row.get('group'),
                        'tags': self.parse_tags(row.get('tags')),
                        'custom_fields': {
                            'custom_field_1': row.get('custom_field_1'),
                            'custom_field_2': row.get('custom_field_2')
                        },
                        'source': 'import'
                    }
                    
                    self.db.create_contact(contact_data)
                    results['imported_rows'] += 1
                    
                except ValidationError as e:
                    results['invalid_rows'] += 1
                    results['errors'].append({
                        'row': row_num,
                        'error': str(e)
                    })
                except Exception as e:
                    results['invalid_rows'] += 1
                    results['errors'].append({
                        'row': row_num,
                        'error': f'Unexpected error: {str(e)}'
                    })
                    
        # Create group if requested
        if job.create_group_flag and job.group_name:
            self.db.create_contact_group(job.group_name)
            
        return results
        
    def normalize_phone(self, phone):
        # Remove all non-numeric characters except +
        import re
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # Validate E.164 format
        if not cleaned.startswith('+'):
            raise ValidationError('Phone number must include country code')
            
        # Use phonenumbers library for validation
        try:
            parsed = phonenumbers.parse(cleaned, None)
            if not phonenumbers.is_valid_number(parsed):
                raise ValidationError('Invalid phone number')
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except phonenumbers.NumberParseException:
            raise ValidationError('Invalid phone number format')
            
    def parse_tags(self, tags_string):
        if not tags_string:
            return []
        return [tag.strip() for tag in tags_string.split(',')]

class ValidationError(Exception):
    pass
```

## Lead Creation from Replies

```python
# Lead creation processor for campaign replies
class LeadCreationProcessor:
    def __init__(self, db):
        self.db = db
        
    def process_incoming_message(self, message_data):
        # Extract contact info from message
        phone = message_data.get('from')
        message_text = message_data.get('text')
        campaign_id = message_data.get('campaign_id')
        
        # Find contact by phone
        contact = self.db.get_contact_by_phone(phone)
        if not contact:
            # Create contact if not exists
            contact = self.db.create_contact({
                'phone': phone,
                'normalized_phone': phone,
                'source': 'reply'
            })
            
        # Check if lead already exists for this campaign
        existing_lead = self.db.get_lead_by_contact_and_campaign(contact.id, campaign_id)
        if existing_lead:
            # Update existing lead
            self.db.update_lead(existing_lead.id, {
                'message_snippet': message_text[:100],  # First 100 chars
                'status': 'new',
                'updated_at': datetime.utcnow()
            })
        else:
            # Create new lead
            self.db.create_lead({
                'contact_id': contact.id,
                'campaign_id': campaign_id,
                'message_snippet': message_text[:100],
                'status': 'new'
            })
            
        # Log lead creation
        self.db.create_audit_log({
            'action': 'lead_created',
            'campaign_id': campaign_id,
            'details': {
                'contact_id': contact.id,
                'message_preview': message_text[:50]
            }
        })
```