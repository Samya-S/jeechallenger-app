# Production Email Infrastructure Specification & Operational Runbook

This document specifies the authoritative production email routing architecture, DNS authentication topology, client integrations, and operational maintenance procedures for **JEE Challenger** (`jeechallenger.com`).

---

## 1. Executive Overview & Design Principles

The email system is designed to provide custom branded domain addresses (`@jeechallenger.com`) with enterprise-grade deliverability, strict anti-spoofing protection, and zero vendor lock-in at \$0/month operating cost.

### Core Architecture Pillars

1. **Inbound Mail Routing (Cloudflare Email Routing)**: All incoming emails sent to domain addresses are processed at Cloudflare's edge. Valid addresses are forwarded to the primary Google Workspace / Gmail inbox (`jeechallenger@gmail.com`). All unauthorized or catch-all addresses are rejected at the edge with a hard `550 Drop`, preventing spam, directory harvesting, and bounce floods.
2. **Outbound Mail Relay (Resend SMTP)**: Outbound emails sent either from the Next.js web application or directly from the Gmail web/mobile interface are routed through Resend's authenticated SMTP relay (`smtp.resend.com:465` SSL) in the Tokyo region (`ap-northeast-1`).
3. **Unified Client Experience (Gmail "Send Mail As")**: All inbound messages land in `jeechallenger@gmail.com`. Replies automatically adopt the recipient persona (`contact@` or `legal@`) via SMTP alias authentication without exposing personal Gmail credentials.
4. **Vendor-Agnostic Application Backend (12-Factor Generic SMTP)**: The web backend (`server/contact-actions.js`) uses standard environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`) with strict fail-fast validation, allowing provider migrations with zero code changes.

### Email Identity & Ownership Matrix

| Address | Display Name | Purpose & Scope | Outbound Relay | Inbound Destination |
| :--- | :--- | :--- | :--- | :--- |
| `contact@jeechallenger.com` | `JEE Challenger Support` | Student inquiries, bug reports, feedback, and general support | Resend SMTP / Gmail | `jeechallenger@gmail.com` |
| `legal@jeechallenger.com` | `JEE Challenger Legal` | Privacy policy inquiries, terms violations, DMCA takedowns, data deletion | Resend SMTP / Gmail | `jeechallenger@gmail.com` |
| `noreply@jeechallenger.com` | `JEE Challenger Automated` | Automated transactional emails, test reports, future OTPs (send-only) | Resend SMTP | *Edge Dropped (550)* |

---

## 2. System Architecture Flowcharts

### 2.1 Inbound Email Flow & Edge Spam Rejection (Cloudflare Email Routing)

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                      INCOMING TRAFFIC AT CLOUDFLARE EDGE                       │
├────────────────────────────────────────────────────────────────────────────────┤
│ Inbound DNS MX: route1/2/3.mx.cloudflare.net (Priorities 5, 26, 98)            │
│ Cloudflare Edge inspects recipient address and applies SPF/DKIM validation     │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
  [Rule Match: contact@ or legal@]              [Catch-All / Unknown Address]
                 │                                             │
                 ▼                                             ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│      AUTHORIZED FORWARDING RULE      │  │          EDGE 550 REJECTION          │
├──────────────────────────────────────┤  ├──────────────────────────────────────┤
│ * contact@jeechallenger.com          │  │ * Action: Drop                       │
│ * legal@jeechallenger.com            │  │ * Direct 550 rejection at edge       │
│ --> Forwarded via TLS to:            │  │ * Zero backscatter / bounce loops    │
│     jeechallenger@gmail.com          │  │ * Never enters or pollutes Gmail     │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

### 2.2 Outbound Sending & Persona Routing (Dual Pathways)

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                 PATHWAY A: AUTOMATED WEBSITE FORM SUBMISSIONS                  │
├────────────────────────────────────────────────────────────────────────────────┤
│ Visitor submits form (/contact-us, Bug Report, Feedback)                       │
│   │                                                                            │
│   ▼ Next.js Server Action (server/contact-actions.js)                          │
│   ├── Validates schema & neutralizes HTML injection                            │
│   ├── Injects replyTo header with student email for 1-click reply              │
│   └── Dispatches via Nodemailer SMTPS to Resend (smtp.resend.com:465 SSL)      │
│   │                                                                            │
│   ▼ Resend SMTP Relay                                                          │
│   └── Signs outbound email with 2048-bit DKIM & SPF (send.jeechallenger.com)   │
│   │                                                                            │
│   ▼ Delivered to RECEIVER_EMAILS (contact@) ──► Forwarded to Gmail inbox       │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                    PATHWAY B: MANUAL CLIENT REPLIES (GMAIL)                    │
├────────────────────────────────────────────────────────────────────────────────┤
│ Operator clicks "Reply" in jeechallenger@gmail.com                             │
│   │                                                                            │
│   ├── Persona Matching: "Reply from the same address message was sent to"      │
│   │   ├── Received at contact@ ──► Auto-replies as "JEE Challenger Support"    │
│   │   └── Received at legal@   ──► Auto-replies as "JEE Challenger Legal"      │
│   │                                                                            │
│   ▼ Gmail Client SMTPS Dispatch                                                │
│   └── Authenticates via smtp.resend.com:465 SSL using Resend API Key           │
│   │                                                                            │
│   ▼ Delivered straight to Student / Recipient Inbox                            │
│   └── 100% SPF, DKIM, and strict DMARC (p=reject;) alignment (zero footers)    │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cloudflare DNS & Inbound Routing Specification

### Inbound MX Records

The following MX records direct inbound traffic for `@jeechallenger.com` to Cloudflare's mail filtering cluster:

| Priority | Host / Name | Mail Server Target | Purpose |
| :---: | :--- | :--- | :--- |
| `5` | `@` (`jeechallenger.com`) | `route2.mx.cloudflare.net` | Primary Inbound Node |
| `26` | `@` (`jeechallenger.com`) | `route3.mx.cloudflare.net` | Secondary Inbound Node |
| `98` | `@` (`jeechallenger.com`) | `route1.mx.cloudflare.net` | Tertiary Inbound Node |

### Inbound Routing Rules

Configured under **Cloudflare Dashboard** $\rightarrow$ **Email Routing** $\rightarrow$ **Routing Rules**:

| Rule Type | Custom Address | Action | Destination | Status |
| :--- | :--- | :--- | :--- | :--- |
| Custom Rule | `contact@jeechallenger.com` | Send to an email | `jeechallenger@gmail.com` | **Active** |
| Custom Rule | `legal@jeechallenger.com` | Send to an email | `jeechallenger@gmail.com` | **Active** |
| Catch-all | Any address `@jeechallenger.com` | Drop | N/A | **Disabled / Drop** |

> [!IMPORTANT]
> **Legacy Record Cleanup**: The legacy RFC 7505 Null MX record (`MX jeechallenger.com . priority 0`) and the strict null SPF record (`v=spf1 -all`) were retired and deleted to allow Cloudflare Email Routing activation.

---

## 4. Resend Outbound Relay Specification

### Domain Configuration Parameters

* **Domain**: `jeechallenger.com`
* **Region**: Tokyo (`ap-northeast-1`) — chosen for minimum network latency to the Asian subcontinent.
* **Return-Path Domain**: `send.jeechallenger.com` (handles bounce notifications and alignment).
* **Tracking Domain**: `rsend.jeechallenger.com` (click tracking and open tracking are disabled to maintain clean privacy headers and maximize inbox delivery).
* **Tier & Quotas**: Free Tier (3,000 emails/month, 100 emails/day hard limit, zero footer branding).

---

## 5. Master DNS Records Table (Cloudflare Zone `jeechallenger.com`)

All records are configured as **DNS Only** (unproxied, grey cloud) as required by email RFC standards:

| Type | Name | Content / Target | TTL | Purpose |
| :--- | :--- | :--- | :---: | :--- |
| `MX` | `@` | `route2.mx.cloudflare.net` (Priority 5) | Auto | Cloudflare Inbound Mail |
| `MX` | `@` | `route3.mx.cloudflare.net` (Priority 26) | Auto | Cloudflare Inbound Mail |
| `MX` | `@` | `route1.mx.cloudflare.net` (Priority 98) | Auto | Cloudflare Inbound Mail |
| `TXT` | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | Auto | Cloudflare Inbound SPF Validation |
| `CNAME` | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | Auto | Resend Return-Path & Outbound SPF |
| `CNAME` | `rsend` | `rsend.jeechallenger.com.mw-cname.ap-northeast-1.resend.com` | Auto | Resend Tracking Endpoint |
| `TXT` | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...` | Auto | Resend 2048-bit DKIM Key |
| `TXT` | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=r; aspf=r; pct=100;` | Auto | Strict DMARC Policy (Rejects Spoofed Mail) |

---

## 6. Gmail Client ("Send Mail As") Configuration

To send emails directly from the Gmail interface using the custom domain:

1. **Log in to**: `jeechallenger@gmail.com`
2. **Navigate to**: **Settings (Gear Icon)** $\rightarrow$ **See all settings** $\rightarrow$ **Accounts and Import** $\rightarrow$ **Send mail as**.
3. **Configure the Two Aliases**:

### Persona 1: General Support
* **Name**: `JEE Challenger Support`
* **Email Address**: `contact@jeechallenger.com`
* **Treat as an alias**: `Checked`
* **SMTP Server**: `smtp.resend.com`
* **Port**: `465`
* **Security Protocol**: `Secured connection using SSL (recommended)`
* **Username**: `resend`
* **Password**: `<RESEND_API_KEY>`

### Persona 2: Legal & Compliance
* **Name**: `JEE Challenger Legal`
* **Email Address**: `legal@jeechallenger.com`
* **Treat as an alias**: `Checked`
* **SMTP Server**: `smtp.resend.com`
* **Port**: `465`
* **Security Protocol**: `Secured connection using SSL (recommended)`
* **Username**: `resend`
* **Password**: `<RESEND_API_KEY>`

### Dynamic Reply Mode
Under **When replying to a message**, the setting is strictly configured to:
> 🔘 **"Reply from the same address to which the message was sent"**

This ensures that whenever a user sends an email to `legal@jeechallenger.com`, pressing "Reply" automatically defaults the sender to `legal@jeechallenger.com` without requiring manual dropdown selection.

---

## 7. Next.js Codebase Implementation Details

### Server Action Architecture (`server/contact-actions.js`)

* **Generic Transporter Initialization**: Single-instance `nodemailer` transporter instantiated dynamically from process environment variables.
* **Fail-Fast Error Handling**: If any required environment variable (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SENDER_EMAIL`, `RECEIVER_EMAILS`) is missing, an explicit descriptive Error is thrown immediately, preventing silent email drops.
* **Reply-To Injection**: Every outgoing submission email automatically includes:
  ```javascript
  replyTo: `${safeName} <${safeEmail}>`
  ```
  When the team receives a student submission in Gmail and clicks **Reply**, the email client replies straight to the student's personal email rather than `noreply@` or the sender address.

### Production Environment Variable Contract

These variables must be populated in the production environment (e.g. Vercel Project Settings) and `.env.local`:

```env
# Generic SMTP Transport Configuration
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=<RESEND_API_KEY>

# Domain Personas
SENDER_EMAIL="JEE Challenger Support <contact@jeechallenger.com>"
RECEIVER_EMAILS=contact@jeechallenger.com
```

---

## 8. Operational Maintenance Runbooks

### Runbook A: Adding a New Custom Email Address (e.g., `press@jeechallenger.com`)

1. **Step 1: Cloudflare Email Routing**:
   * Navigate to **Cloudflare** $\rightarrow$ `jeechallenger.com` $\rightarrow$ **Email Routing** $\rightarrow$ **Routing rules**.
   * Click **Create routing rule**.
   * Enter email prefix (e.g. `press`), action: `Send to an email`, destination: `jeechallenger@gmail.com`.
   * Click **Save**.
2. **Step 2: Gmail Send As Alias**:
   * In Gmail, go to **Settings** $\rightarrow$ **Accounts and Import** $\rightarrow$ **Add another email address**.
   * Name: `JEE Challenger Press`
   * Email: `press@jeechallenger.com`
   * SMTP Server: `smtp.resend.com`, Port: `465`, SSL.
   * Username: `resend`, Password: `<RESEND_API_KEY>`.
   * Complete the verification code sent to `jeechallenger@gmail.com`.

---

### Runbook B: Resend API Key Rotation

If the Resend API key needs to be rotated:
1. Log in to **Resend Dashboard** $\rightarrow$ **API Keys** $\rightarrow$ **Create API Key** (Permission: `Sending access`).
2. Copy the new key `re_...`.
3. In **Vercel**: Update `SMTP_PASS` in Project Settings $\rightarrow$ Environment Variables $\rightarrow$ Redeploy latest production deployment.
4. In **Local Development**: Update `SMTP_PASS` in `.env.local`.
5. In **Gmail**: Go to **Settings** $\rightarrow$ **Accounts and Import** $\rightarrow$ Click **edit info** next to each alias (`contact@` and `legal@`) $\rightarrow$ Click **Next Step** $\rightarrow$ Re-enter the new password $\rightarrow$ Click **Save Changes**.
6. In **Resend Dashboard**: Delete the old API key once all services are verified.

---

### Runbook C: Provider Migration (e.g., to AWS SES or Brevo)

Because the application code uses 12-factor generic SMTP:
1. Obtain the new provider's SMTP credentials (`host`, `port`, `user`, `pass`).
2. Update the DNS SPF and DKIM records in Cloudflare to authorize the new provider.
3. Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` in Vercel.
4. **Zero application code changes or deployments are needed.**
