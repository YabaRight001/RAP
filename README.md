# RAP — RISE AND PROSPER
> **"BANK THAT HELPS YOU PROSPER"**
> Full Banking, Affiliate Earnings 70/30 Ledger & Youth Empowerment System

Built for Nigerian youths and entrepreneurs with a mobile-app first user experience (inspired by `yabaright.ng`), luxury fintech branding (Prosperity Emerald Green, Sunrise Gold & Royal Midnight Slate), and an easy-to-use desktop command center.

---

## 🌟 Key System Capabilities

### 1. Complete Banking and Account Management
- **Architectural Distinction**: Strictly distinguishes between a **RAP Membership Account**, the user's **RAP Earnings Ledger (70/30)**, and the **Actual Bank Account** provided by partner banks.
- **Partner Virtual Account**: Connects to authorized banking partner (**Wema Bank PLC / Providus Bank / Monnify Virtual Accounts**).
- **KYC Compliance**: Level 1 (Phone/Email OTP), Level 2 (BVN & NIN verification matched via NIBSS), and Level 3 (Proof of address).
- **Linked Accounts**: External payout bank accounts (e.g. GTBank) for authorized withdrawals.
- **Official Statements**: Statement generator with transaction references and PDF/print support.

### 2. 10 Distinct Financial Balances (Never Combined Misleadingly)
1. **Actual Bank Account Balance**: Verified balance from connected banking partner.
2. **Available Bank Account Balance**: Funds immediately usable for transfers and withdrawals.
3. **Total Affiliate Income Earned**: Cumulative gross commissions.
4. **Pending Affiliate Earnings**: Commissions awaiting verification.
5. **Approved Affiliate Earnings**: Settled, cleared affiliate commissions.
6. **Earnings Available for Transfer (70%)**: The accessible portion under the 70/30 rule.
7. **Locked Savings Balance (30%)**: Compulsory wealth allocation locked for 1 calendar year (365 days).
8. **Savings Approaching Maturity**: Allocations due for release within 30 days.
9. **Total Withdrawals**: Cumulative payouts sent to external accounts.
10. **Total Transfers**: Bank-to-bank transfers dispatched.

### 3. The RAP 70/30 Earnings & Permanent Savings System
- **Core Backend Engine**: Every approved affiliate commission automatically splits:
  - **70% Accessible Transferable Income**
  - **30% Permanent Locked Savings** (strictly locked for 365 days from credit date).
- **Monday Transfer Feature**:
  - Prominent banner and button: `TRANSFER MY AVAILABLE EARNINGS`
  - Explanatory mandate: *"70% of your eligible affiliate income is available for transfer. The remaining 30% is reserved as one-year locked savings."*
  - Supports **Manual Monday Transfer** and **Scheduled Recurring Auto-Payout**.
- **Backend Lock Enforcement**: Early withdrawal attempts on the 30% savings portion are blocked at the database and API level.

### 4. The 25-Affiliate Unlocking System
- **Qualifying Affiliates Definition**: Referral must register, confirm email, verify phone via OTP, and complete Level 2 KYC. Prevents self-referrals and duplicate device manipulation.
- **"YOUR RAP GROWTH JOURNEY" Card**:
  - Live progress tracker (e.g., 18/25 referrals, 72% progress, 7 remaining).
  - Unlocking Milestone: At 25 qualifying affiliates, automatically promotes user to **RAP Growth Partner**, increases commission to **20%**, and unlocks both **Loan Assessment** and the **Business Incubator**!

### 5. RAP Growth & Loan Opportunities
- Subsidized youth loan programmes:
  - **RAP Youth SME Starter Loan** (₦50,000 – ₦500,000 @ 5% p.a., 6 months tenure)
  - **RAP Business Scale Capital** (₦500,000 – ₦2,500,000 @ 7.5% p.a., 12 months tenure)
  - **RAP Tech Equipment Financing** (₦100,000 – ₦750,000 @ 4% p.a., 6 months tenure)
- Integrated repayment schedule calculator and credit assessment workflow.

### 6. RAP Business Incubator (Youth Empowerment)
- Structured 6-Stage Venture Pathway:
  1. **Discovery**: Problem validation & market research.
  2. **Skills Development**: Entrepreneurship academy with financial modeling courses.
  3. **Business Planning**: Lean canvas & financial forecasts.
  4. **Validation**: Acquiring first 10 paying customers.
  5. **Growth**: Scaling unit economics & operations.
  6. **Funding Assessment**: Pitching for catalytic seed grants and partner debt.
- Mentor assignment (Engr. Babajide Williams & Mrs. Folashade Adeleke) with meeting schedules and feedback logs.

### 7. Bottom App Navigation
Customized for the bank as specified:
`Home` | `Account` | `Affiliate` | `Login` (Profile & Security) | `Refer`

### 8. Centralized Admin Governance & Audit Logs
- Policy configuration for the 70/30 rule (adjustable transferable %, locked %, lock duration, and payout schedules).
- Complete immutable financial audit log.

---

## 🚀 Running the Platform

The server is currently running and accessible at:
- **URL**: `http://localhost:3000`

To start manually or rebuild at any time:
```bash
# Build the client bundle (takes ~400ms)
npm run build

# Start the Node.js server with SQLite
npm start
```

---

## 🧪 19-Step End-to-End Walkthrough Demonstration

An interactive **"19-Step Scenario"** walkthrough button is integrated right into the top header of the web application. You can click **"Run Next Step"** or **"Run All 19 Steps"** to watch the platform execute every mandated step:
1. Registration of young Nigerian
2. Email & phone OTP verification
3. Identity verification (BVN/NIN match via NIBSS)
4. Bank account issuance (Wema Bank 9823481029)
5. Unique referral link issuance (RAP-EMEK98)
6. 25 qualifying Nigerian affiliates onboarding
7. Milestone verification & unlock of RAP Growth Partner tier (20%), Loan Portal, and Incubator
8. ₦100,000 approved commission earned
9. 70/30 allocation (₦70,000 transferable, ₦30,000 locked for 365 days)
10. Dashboard separate balance display
11. Monday "TRANSFER MY AVAILABLE EARNINGS" trigger
12. Validation & transfer to GTBank 0129485739
13. Confirmation via payment switch
14. Financial ledger and balance settlement
15. Locked savings inspection with maturity countdown
16. SME loan application submission
17. Loan credit assessment & approval
18. Business incubator application & mentor assignment
19. Super admin inspection of the immutable financial audit logs.
