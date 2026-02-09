# Campaign Module UI Wireframes

## A) Account Connection Modal

```
+-------------------------------------------------------------+
| Connect WhatsApp Account                                    |
+-------------------------------------------------------------+
|                                                             |
|  [OAuth2 Connect] [API Token]                               |
|                                                             |
|  OAuth2 Connect:                                            |
|  [Connect with WhatsApp]                                    |
|                                                             |
|  API Token:                                                 |
|  [Access Token       ] **************************************** |
|  [API URL (optional) ] https://api.whatsapp.com             |
|  [Verify Token       ] [Verify]                             |
|                                                             |
|  Connection Status: [✓ Verified]                            |
|                                                             |
|  [Connect Account]    [Cancel]                              |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Connected Accounts                                          |
+-------------------------------------------------------------+
|                                                             |
|  Business Name                                              |
|  +1234567890                                                |
|  Connected: May 15, 2023 by John Doe                        |
|  Status: [●] Connected                                      |
|  [Reconnect/Refresh] [Disconnect]                           |
|                                                             |
|  Expired Account                                            |
|  +0987654321                                                |
|  Connected: Apr 10, 2023 by John Doe                        |
|  Status: [!] Expiring Soon                                  |
|  [Reconnect/Refresh] [Disconnect]                           |
|                                                             |
|  Disconnected Account                                       |
|  +1122334455                                                |
|  Disconnected: May 10, 2023                                 |
|  Status: [○] Disconnected                                   |
|  [Reconnect]                                                |
|                                                             |
+-------------------------------------------------------------+
```

## B) Import Contacts

```
+-------------------------------------------------------------+
| Import Contacts                                             |
+-------------------------------------------------------------+
|                                                             |
|  Upload CSV File:                                           |
|  [Choose File] contacts.csv                                 |
|  [Upload]                                                   |
|                                                             |
|  CSV Format: phone, name, group, tags, custom_field_1,      |
|              custom_field_2                                 |
|  [Download Sample CSV]                                      |
|                                                             |
|  Column Mapping:                                            |
|  File Column      →  CRM Field                              |
|  [phone_________] → [phone_____]                            |
|  [name__________] → [name______]                            |
|  [group_________] → [group_____]                            |
|  [tags__________] → [tags______]                            |
|  [custom1_______] → [custom_field_1]                        |
|  [custom2_______] → [custom_field_2]                        |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Preview (5 of 120 rows)                               |  |
|  |                                                       |  |
|  |  Phone         Name        Group     Tags             |  |
|  |  +1234567890   John Doe     Customers  vip,premium      |  |
|  |  +1234567891   Jane Smith   Leads     new,interested    |  |
|  |  ...                                                  |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  Import Options:                                            |
|  [x] Create contact group                                   |
|      [Group Name       ] Imported May 2023                  |
|                                                             |
|  [Import Contacts]    [Cancel]                              |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Import Summary                                              |
+-------------------------------------------------------------+
|                                                             |
|  Upload Complete                                            |
|                                                             |
|  Total rows:      120                                       |
|  Successfully imported: 100                                 |
|  Duplicates:      15                                        |
|  Invalid rows:    5                                         |
|                                                             |
|  Created group: [Imported May 2023]                         |
|                                                             |
|  [View Contacts]    [Create Campaign]    [Import More]      |
|                                                             |
+-------------------------------------------------------------+
```

## C) Create Campaign

```
+-------------------------------------------------------------+
| Create Campaign                                             |
+-------------------------------------------------------------+
|                                                             |
|  Campaign Name: [Summer Promotion Sale          ]           |
|                                                             |
|  Sender Account:                                            |
|  [WhatsApp Business (+1234567890)]                          |
|                                                             |
|  Message Type:                                              |
|  (●) Template Message    ( ) Free Text Message              |
|                                                             |
|  Template Selection:                                        |
|  [Select Template ▼]                                        |
|                                                             |
|  Message Body:                                              |
|  [Hi {{name}}, check out our summer sale! {{custom_field_1}}] |
|                                                             |
|  Available Variables:                                       |
|  [name] [custom_field_1] [custom_field_2] [group] [tags]    |
|                                                             |
|  Attachments:                                               |
|  [Upload Image] [Upload Document]                           |
|                                                             |
|  [Preview Message]                                          |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Create Campaign (continued)                                 |
+-------------------------------------------------------------+
|                                                             |
|  Target Audience:                                           |
|  (●) Contact List    ( ) Group    ( ) Tag    ( ) Manual     |
|  [Select Contact List ▼]                                    |
|                                                             |
|  Schedule:                                                  |
|  (●) Send Immediately    ( ) Schedule for later             |
|  [Date & Time] [2023-06-15 14:00]                           |
|                                                             |
|  Rate Control:                                              |
|  [120] messages per minute                                  |
|                                                             |
|  Retries:                                                   |
|  [3] max attempts on transient errors                       |
|                                                             |
|  [Save Draft]    [Send Test]    [Confirm & Send]            |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Message Preview                                             |
+-------------------------------------------------------------+
|                                                             |
|  Preview of personalized messages:                          |
|                                                             |
|  1. To: John Doe (+1234567890)                              |
|     Hi John, check out our summer sale! Special offer       |
|                                                             |
|  2. To: Jane Smith (+1234567891)                            |
|     Hi Jane, check out our summer sale! Exclusive deal      |
|                                                             |
|  3. To: Bob Johnson (+1234567892)                           |
|     Hi Bob, check out our summer sale! VIP discount         |
|                                                             |
|  [Edit Message]    [Close]                                  |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Confirm & Send                                              |
+-------------------------------------------------------------+
|                                                             |
|  Campaign Summary                                           |
|                                                             |
|  Name:        Summer Promotion Sale                         |
|  Sender:      WhatsApp Business (+1234567890)               |
|  Recipients:  1,250 contacts                                 |
|  Message:     Template message with variables               |
|  Schedule:    Immediately                                   |
|  Rate:        120 messages/minute                           |
|  Retries:     3 attempts                                    |
|                                                             |
|  [← Back]  [Confirm & Send Campaign]                        |
|                                                             |
+-------------------------------------------------------------+
```

## D) Campaign List

```
+-------------------------------------------------------------+
| Campaigns                                                   |
+-------------------------------------------------------------+
|                                                             |
|  [Create Campaign]                                          |
|                                                             |
|  Filters:                                                   |
|  Date: [2023-05-01] to [2023-05-31]  Sender: [All ▼]        |
|  Status: [All ▼]  Search: [____________________] [Search]   |
|                                                             |
|  +----+------------------+-----------+----------+-----------+ |
|  |Name| Sender           | Recipients| Status   | Date      | |
|  +----+------------------+-----------+----------+-----------+ |
|  |Summ| Business (+1234) | 1,250     |[Sending] |May 15,2023| |
|  |Prom|                  |           |68%       |14:01      | |
|  |----+------------------+-----------+----------+-----------+ |
|  |New | Business (+1234) | -         |Scheduled |Jun 15,2023| |
|  |Prod|                  |           |          |14:00      | |
|  |----+------------------+-----------+----------+-----------+ |
|  |May | Business (+1234) | 1,250     |Completed |May 1, 2023| |
|  |Sale|                  |           |          |09:00      | |
|  +----+------------------+-----------+----------+-----------+ |
|                                                             |
|  [1] [2] [3] ... [Next]                                     |
|                                                             |
+-------------------------------------------------------------+
```

## E) Campaign Detail

```
+-------------------------------------------------------------+
| Campaigns > Summer Promotion                                |
+-------------------------------------------------------------+
|                                                             |
|  [Pause] [Cancel] [Duplicate] [Export CSV]                  |
|                                                             |
|  Status: [Sending]                                          |
|  Progress: [███████░░░] 68% (850/1,250 sent)                |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Summary                                               |  |
|  |                                                       |  |
|  |  Sent:      850                                       |  |
|  |  Delivered: 820                                       |  |
|  |  Read:      750                                       |  |
|  |  Failed:    5                                         |  |
|  |                                                       |  |
|  |  Started:   May 15, 2023 14:01                        |  |
|  |  Estimated: May 15, 2023 16:30                        |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  Timeline Activity:                                         |
|  [14:01] Campaign started                                 |
|  [14:05] 200 messages sent                                |
|  [14:10] 400 messages sent                                |
|  [14:15] 600 messages sent                                |
|  [14:20] 800 messages sent                                |
|  [14:25] 850 messages sent                                |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Campaigns > Summer Promotion (continued)                    |
+-------------------------------------------------------------+
|                                                             |
|  Recipient Status:                                          |
|  [Search] [Filter ▼] [Export CSV]                          |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Phone         Status     Delivered   Error            |  |
|  | +1234567890   Delivered  14:05                         |  |
|  | +1234567891   Sent       -                             |  |
|  | +1234567892   Failed     -           Invalid number    |  |
|  | +1234567893   Read       14:10                         |  |
|  | +1234567894   Delivered  14:08                         |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [1] [2] [3] ... [Next]                                     |
|                                                             |
+-------------------------------------------------------------+
```

```
+-------------------------------------------------------------+
| Campaigns > Summer Promotion > Leads                        |
+-------------------------------------------------------------+
|                                                             |
|  Leads Created from Replies:                                |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Contact       Phone         Status     Created        |  |
|  | John Doe      +1234567890   New        14:30          |  |
|  | Jane Smith    +1234567891   Contacted  14:45          |  |
|  | Bob Johnson   +1234567892   Qualified  15:10          |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  [View in Leads Module]                                     |
|                                                             |
+-------------------------------------------------------------+
```