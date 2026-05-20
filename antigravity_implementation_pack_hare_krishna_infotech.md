# Hare Krishna Infotech
# AI Builder Implementation Pack
## Comprehensive Product + System Specification for Antigravity

---

# 1. Executive Summary

## Product Vision
Build a centralized internal operations platform for Hare Krishna Infotech that combines:

1. CRM (Customer Relationship Management)
2. OMS (Order Management System)
3. AMC Management
4. Incident / Service Management
5. Reporting & PDF Generation

The platform should allow internal teams to manage customers, orders, products, AMCs, and service incidents in one connected workflow.

The most critical business requirement is the ability to generate professional AMC service reports in PDF format and share them with customers.

---

# 2. Business Problem Statement

Currently, customer records, orders, AMCs, and service incidents are fragmented or manually tracked.

This creates problems such as:
- poor visibility into customer history,
- difficulty tracking AMC validity,
- disconnected incident records,
- manual report preparation,
- lack of auditability,
- operational inefficiencies.

The new platform should centralize all workflows and create traceable relationships between customers, orders, products, AMCs, and incidents.

---

# 3. Primary Goals

## Core Goals
- Centralize operational workflows
- Improve AMC tracking
- Improve incident management
- Reduce manual reporting work
- Improve auditability and traceability
- Create scalable operational foundation

## Success Metrics
- Reduced report preparation time
- Faster incident resolution
- Reduced AMC tracking errors
- Faster customer lookup and support workflows
- Centralized historical records

---

# 4. User Roles & Permissions

## 4.1 Platform Admin
Full system access.

Permissions:
- manage users
- manage roles
- manage master data
- access all records
- generate reports
- configure system settings

---

## 4.2 Operations Executive
Handles customer/order/AMC operations.

Permissions:
- create customers
- create orders
- attach AMC
- edit records
- generate reports
- view incidents

---

## 4.3 Support Engineer
Handles incidents.

Permissions:
- create incidents
- update incidents
- close incidents
- upload service notes
- view customer/order context

---

## 4.4 Sales / Account Manager
Customer-facing operational visibility.

Permissions:
- view customers
- view orders
- view AMCs
- view reports
- limited editing

---

## 4.5 Management / Read Only
Executive visibility.

Permissions:
- dashboard access
- report access
- analytics access
- read-only platform visibility

---

# 5. High-Level System Architecture

```text
Customer
 ├── Contacts
 ├── Orders
 │     ├── Order Items / Products
 │     │      ├── AMC Contracts
 │     │      │      ├── Incidents
 │     │      │      └── Service Reports
 │     │      └── Incident History
 │     └── Attachments
 ├── Reports
 └── Activity Timeline
```

---

# 6. Core Modules

## 6.1 Authentication & Access Control

### Features
- login
- logout
- password reset
- session management
- role-based access control
- account disable/enable
- secure password storage

### Required Screens
- Login
- Forgot Password
- Reset Password
- User Management
- Role Management

### Business Rules
- only admins can create users
- disabled users cannot access platform
- every action should be audit logged

---

## 6.2 CRM Module

## Purpose
Store and manage customer information.

### Features
- create customer
- edit customer
- archive customer
- customer search
- multiple contacts per customer
- notes
- activity timeline
- linked orders
- linked incidents
- linked reports

### Customer Fields

| Field | Type |
|---|---|
| Customer ID | Auto Generated |
| Company Name | Text |
| Contact Person | Text |
| Phone Number | Text |
| Email | Text |
| Address | Text |
| City | Text |
| State | Text |
| GST Number | Text |
| Customer Type | Dropdown |
| Status | Dropdown |
| Notes | Long Text |
| Created At | Timestamp |
| Updated At | Timestamp |

### Customer Statuses
- Active
- Inactive
- Archived

### Customer Detail Tabs
- Overview
- Contacts
- Orders
- AMCs
- Incidents
- Reports
- Activity Timeline

---

# 7. Order Management System

## Purpose
Track customer purchases and service-linked products.

## Features
- create order
- add products
- edit order
- cancel order
- attach documents
- link AMC
- view incident history

## Order Header Fields

| Field | Type |
|---|---|
| Order ID | Auto Generated |
| Order Number | Text |
| Customer ID | Relation |
| Order Date | Date |
| Status | Dropdown |
| Payment Status | Dropdown |
| Notes | Long Text |
| Created By | User |
| Created At | Timestamp |

## Order Item Fields

| Field | Type |
|---|---|
| Item ID | Auto Generated |
| Product Name | Text |
| Product Code | Text |
| Quantity | Number |
| Serial Number | Text |
| Unit Price | Currency |
| AMC Eligible | Boolean |
| Warranty End Date | Date |
| Notes | Long Text |

## Order Statuses
- Draft
- Confirmed
- In Progress
- Completed
- Cancelled

## Payment Statuses
- Pending
- Partially Paid
- Paid
- Overdue

---

# 8. AMC Management Module

## Purpose
Manage Annual Maintenance Contracts attached to products.

## Core Principle
AMC should ALWAYS be attached at product/order-item level.

Not only at order level.

---

## Features
- create AMC
- renew AMC
- extend AMC
- expire AMC
- pause AMC
- AMC history
- AMC alerts
- AMC coverage tracking

## AMC Fields

| Field | Type |
|---|---|
| AMC ID | Auto Generated |
| Order Item ID | Relation |
| Customer ID | Relation |
| Start Date | Date |
| End Date | Date |
| Coverage Type | Dropdown |
| Status | Dropdown |
| SLA Type | Dropdown |
| Renewal Status | Dropdown |
| Notes | Long Text |

## AMC Statuses
- Active
- Expired
- Renewed
- Paused
- Cancelled

## AMC Coverage Types
- Full Coverage
- Limited Coverage
- Service Only
- Parts Excluded

## AMC Renewal Statuses
- Renewal Due
- Renewal Pending
- Renewed
- Not Renewed

## AMC Business Rules
- incidents should verify AMC validity
- expired AMC should show warning badge
- one product may have multiple AMC records historically
- only one AMC can be active at a time for same product

---

# 9. Incident Management Module

## Purpose
Track service/support incidents against AMC-covered products.

## Features
- create incident
- assign incident
- incident timeline
- resolution notes
- incident comments
- reopen incident
- closure workflow
- incident history
- AMC validation

## Incident Fields

| Field | Type |
|---|---|
| Incident ID | Auto Generated |
| Customer ID | Relation |
| Order ID | Relation |
| Order Item ID | Relation |
| AMC ID | Relation |
| Incident Type | Dropdown |
| Severity | Dropdown |
| Status | Dropdown |
| Description | Long Text |
| Assigned User | User |
| Resolution Notes | Long Text |
| Opened Date | Timestamp |
| Closed Date | Timestamp |
| Covered Under AMC | Boolean |

## Incident Types
- Hardware Issue
- Software Issue
- Installation
- Maintenance
- Network Issue
- Other

## Severity Levels
- Low
- Medium
- High
- Critical

## Incident Statuses
- Open
- Assigned
- In Progress
- Waiting on Customer
- Resolved
- Closed
- Reopened

## Incident Business Rules
- incident must belong to customer
- incident should preferably belong to order item
- incident resolution should be audit logged
- closed incidents become read-only
- reopened incidents should preserve old closure history

---

# 10. Reporting Module

# Critical Business Module

This module is one of the most important business outputs.

---

## Report Types

### Customer Service Report
Includes:
- customer details
- orders
- AMC summary
- incidents
- resolutions

---

### AMC Activity Report
Includes:
- AMC validity
- covered products
- active incidents
- renewals
- SLA performance

---

### Incident Report
Includes:
- open incidents
- closed incidents
- severity
- resolution timelines

---

## Report Export Formats
- PDF
- CSV
- Excel

---

## PDF Layout Requirements

### Header
- company logo
- company name
- report title
- generated date

### Body
- customer details
- order summary
- product table
- AMC coverage table
- incident summary
- resolution notes

### Footer
- page number
- generated by
- report ID

---

## Report Business Rules
- reports should snapshot historical data
- reports should remain downloadable later
- regenerated reports should maintain version history

---

# 11. Dashboard & Analytics

## Dashboard Widgets

### Operational Metrics
- total customers
- total orders
- active AMCs
- expired AMCs
- open incidents
- closed incidents this month
- pending incidents
- average resolution time

### Alerts
- expiring AMC
- overdue incidents
- unresolved critical incidents

### Charts
- incidents by month
- incidents by severity
- AMC renewals
- incident resolution trends

---

# 12. Notifications Module

## MVP Notifications
- incident assigned
- incident closed
- AMC expiring soon
- order created
- report generated

## Notification Channels
### MVP
- in-app notifications

### Future
- email
- WhatsApp
- SMS

---

# 13. Activity Timeline & Audit Logs

## Requirement
Every critical action should generate audit logs.

## Actions To Track
- customer created
- customer updated
- order created
- order edited
- AMC attached
- AMC renewed
- incident created
- incident status updated
- report generated
- login activity

## Audit Log Fields
- user
- action
- entity type
- entity ID
- old value
- new value
- timestamp

---

# 14. Global Search Requirements

The platform should support universal search.

## Searchable Items
- customer name
- order number
- serial number
- AMC ID
- incident ID
- product name
- contact number

## Search Features
- fuzzy search
- filters
- sorting
- pagination

---

# 15. File & Attachment Management

## Future-Ready Requirement

Support:
- incident attachments
- installation photos
- invoices
- signed reports
- AMC contracts

## Allowed File Types
- PDF
- JPG
- PNG
- DOCX
- XLSX

---

# 16. Entity Relationship Definitions

## Relationships

### Customer → Orders
One customer can have many orders.

### Order → Order Items
One order can have many products/items.

### Order Item → AMC
One product can have multiple AMC records over time.

### AMC → Incident
One AMC can have many incidents.

### Order Item → Incident
One product can have multiple incidents.

### User → Incident
One user can own many incidents.

---

# 17. Database Schema Recommendation

## Recommended Stack

### Frontend
- React
- Next.js
- Tailwind CSS

### Backend
- Node.js
- NestJS or Express

### Database
- PostgreSQL

### File Storage
- AWS S3 or equivalent

### Authentication
- JWT + Refresh Tokens

---

# 18. Suggested Database Tables

## Core Tables
- users
- roles
- permissions
- customers
- customer_contacts
- orders
- order_items
- amc_contracts
- incidents
- incident_comments
- reports
- notifications
- activity_logs
- attachments

---

# 19. API Design Guidelines

## API Standards
- REST APIs
- versioned APIs
- pagination support
- filtering support
- sorting support
- authentication middleware
- audit logging middleware

---

# 20. Suggested API Endpoints

## Customers
- GET /customers
- POST /customers
- GET /customers/:id
- PUT /customers/:id

## Orders
- GET /orders
- POST /orders
- GET /orders/:id
- PUT /orders/:id

## AMCs
- GET /amcs
- POST /amcs
- PUT /amcs/:id

## Incidents
- GET /incidents
- POST /incidents
- PUT /incidents/:id
- POST /incidents/:id/close
- POST /incidents/:id/reopen

## Reports
- POST /reports/generate
- GET /reports
- GET /reports/:id/download

---

# 21. Screen-by-Screen Functional Specification

# 21.1 Login Screen

## Components
- email field
- password field
- login button
- forgot password link

## Validation
- required fields
- invalid credentials message

---

# 21.2 Dashboard

## Sections
- KPI cards
- charts
- notifications
- recent incidents
- AMC alerts
- quick actions

---

# 21.3 Customer List Screen

## Features
- table view
- search
- filters
- pagination
- export
- create customer button

## Filters
- status
- city
- AMC status

---

# 21.4 Customer Detail Screen

## Tabs
- Overview
- Orders
- AMCs
- Incidents
- Reports
- Timeline

## Actions
- edit customer
- create order
- generate report

---

# 21.5 Order List Screen

## Features
- order table
- search
- filters
- sorting
- export

---

# 21.6 Order Detail Screen

## Sections
- order header
- customer info
- order items
- AMC details
- linked incidents
- timeline

## Actions
- add product
- attach AMC
- edit order

---

# 21.7 AMC List Screen

## Features
- active AMC list
- expiring AMC filters
- renewal tracking

---

# 21.8 AMC Detail Screen

## Sections
- AMC details
- linked product
- linked incidents
- coverage terms
- renewal history

## Actions
- renew AMC
- extend AMC
- generate AMC report

---

# 21.9 Incident List Screen

## Features
- incident table
- filters
- assignment tracking
- SLA indicators

## Filters
- severity
- status
- assigned user
- AMC covered

---

# 21.10 Incident Detail Screen

## Sections
- incident overview
- linked customer
- linked product
- AMC status
- comments
- resolution notes
- activity timeline

## Actions
- assign incident
- change status
- close incident
- reopen incident

---

# 21.11 Report Builder Screen

## Filters
- customer
- date range
- order
- AMC
- incident status

## Actions
- preview report
- export PDF
- export Excel
- save template

---

# 21.12 User Management Screen

## Features
- create user
- disable user
- assign role
- reset password

---

# 22. Workflow Logic

# Customer Creation Workflow

```text
Create Customer
    ↓
Add Contact Details
    ↓
Save Customer
    ↓
Activity Log Created
```

---

# Order Workflow

```text
Create Order
    ↓
Add Products
    ↓
Save Order
    ↓
Attach AMC
    ↓
Generate Order Timeline
```

---

# Incident Workflow

```text
Create Incident
    ↓
Verify AMC Coverage
    ↓
Assign Engineer
    ↓
In Progress
    ↓
Resolution Notes Added
    ↓
Resolved
    ↓
Closed
```

---

# Report Workflow

```text
Select Filters
    ↓
Generate Data Snapshot
    ↓
Create PDF
    ↓
Store Report Record
    ↓
Download/Share
```

---

# 23. UI/UX Design Direction

## Design Principles
- clean enterprise UI
- fast navigation
- dashboard-first design
- mobile responsive
- dark/light mode ready
- operational efficiency focused

## UI Style
- modern SaaS admin panel
- clean tables
- minimal clutter
- status badges
- timeline views
- modal-based editing

---

# 24. Non-Functional Requirements

## Performance
- fast search response
- pagination on all large tables
- optimized reporting queries

## Security
- RBAC
- encrypted passwords
- secure sessions
- audit logs

## Reliability
- backups
- error logging
- retry-safe APIs

## Scalability
- modular architecture
- scalable database design
- API-first architecture

---

# 25. MVP Scope

## Included In MVP
- authentication
- roles & permissions
- CRM
- OMS
- AMC management
- incident management
- dashboard
- PDF reports
- audit logs
- search & filters

---

# 26. Future Scope

## Phase 2
- customer portal
- SLA automation
- email notifications
- WhatsApp integration
- invoice/payment module
- mobile app
- technician app
- geo-tagging
- digital signatures
- AI analytics

---

# 27. Critical Business Rules

## Important Constraints
- incidents should not exist without customer
- AMC should be tied to order item
- reports should preserve historical data
- status changes should be logged
- closed incidents become read-only
- expired AMC should not be treated active

---

# 28. Acceptance Criteria

The MVP is considered successful when:

- users can securely login
- customers can be created
- orders can be managed
- products can be added to orders
- AMC can be attached to products
- incidents can be linked correctly
- reports can be exported to PDF
- dashboards show operational visibility
- audit logs are functioning

---

# 29. Recommended Build Sequence

## Phase 1
1. Authentication
2. User Management
3. CRM
4. Orders
5. Order Items

## Phase 2
6. AMC Module
7. Incident Module
8. Dashboard
9. Reporting Engine

## Phase 3
10. Notifications
11. Attachments
12. Advanced Analytics

---

# 30. Final Notes For Antigravity

## Priority Guidance
The most important architectural principle is:

```text
Customer → Order → Product → AMC → Incident
```

This relationship chain must remain clean and traceable.

The reporting system is a critical business feature and should be treated as a first-class module, not an afterthought.

The platform should prioritize operational simplicity, auditability, and reliability over excessive complexity in v1.

