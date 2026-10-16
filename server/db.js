// Database engine using Node 22 built-in SQLite
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'rap_platform.sqlite');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    -- System Configuration
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user', -- 'user', 'mentor', 'loan_officer', 'admin', 'super_admin'
      status TEXT NOT NULL DEFAULT 'verified', -- 'pending_verification', 'verified', 'pending_banking_approval', 'active', 'restricted', 'suspended', 'closed'
      membership_tier TEXT NOT NULL DEFAULT 'RAP Affiliate', -- 'RAP Member', 'RAP Affiliate', 'RAP Growth Partner', 'RAP Ambassador'
      is_email_verified INTEGER NOT NULL DEFAULT 1,
      is_phone_verified INTEGER NOT NULL DEFAULT 1,
      kyc_level INTEGER NOT NULL DEFAULT 2, -- 1 = Basic, 2 = BVN/NIN verified, 3 = Address verified
      bvn TEXT,
      nin TEXT,
      address TEXT,
      two_factor_enabled INTEGER NOT NULL DEFAULT 0,
      referral_code TEXT UNIQUE NOT NULL,
      referred_by TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Bank Accounts (Connected through approved banking partner, e.g. Wema / Providus / Monnify)
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      partner_bank_name TEXT NOT NULL DEFAULT 'Wema Bank (RAP Partner)',
      partner_bank_code TEXT NOT NULL DEFAULT '035',
      account_number TEXT UNIQUE NOT NULL,
      account_name TEXT NOT NULL,
      actual_balance REAL NOT NULL DEFAULT 0.00,
      available_balance REAL NOT NULL DEFAULT 0.00,
      currency TEXT NOT NULL DEFAULT 'NGN',
      status TEXT NOT NULL DEFAULT 'active', -- 'pending_verification', 'active', 'restricted', 'frozen', 'closed'
      bvn_match INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Bank Account Links (External payout accounts linked by the user)
    CREATE TABLE IF NOT EXISTS bank_account_links (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      bank_name TEXT NOT NULL,
      bank_code TEXT NOT NULL,
      account_number TEXT NOT NULL,
      account_name TEXT NOT NULL,
      is_verified INTEGER NOT NULL DEFAULT 1,
      is_default INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Bank Transactions (From partner integration or internal transfers)
    CREATE TABLE IF NOT EXISTS bank_transactions (
      id TEXT PRIMARY KEY,
      bank_account_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'transfer_out', 'transfer_in', 'fee'
      amount REAL NOT NULL,
      balance_after REAL NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      narration TEXT,
      beneficiary_bank TEXT,
      beneficiary_account TEXT,
      beneficiary_name TEXT,
      status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'reversed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Account Applications (Tracking bank account issuance)
    CREATE TABLE IF NOT EXISTS account_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      applicant_name TEXT NOT NULL,
      id_type TEXT NOT NULL DEFAULT 'NIN',
      id_number TEXT NOT NULL,
      proof_of_address_url TEXT,
      partner_provider TEXT NOT NULL DEFAULT 'Wema/Monnify Virtual Bank',
      status TEXT NOT NULL DEFAULT 'approved', -- 'pending_verification', 'under_review', 'approved', 'rejected'
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Verifications Log
    CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'verified',
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS phone_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      phone TEXT NOT NULL,
      otp TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'verified',
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Affiliate Profiles
    CREATE TABLE IF NOT EXISTS affiliate_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      affiliate_code TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved', -- 'pending', 'approved', 'suspended'
      tier TEXT NOT NULL DEFAULT 'Standard', -- 'Standard', 'RAP Growth Partner', 'RAP Ambassador'
      commission_rate REAL NOT NULL DEFAULT 10.0, -- Default percentage
      total_referrals INTEGER NOT NULL DEFAULT 0,
      qualifying_affiliates INTEGER NOT NULL DEFAULT 0,
      total_earned REAL NOT NULL DEFAULT 0.00,
      pending_earnings REAL NOT NULL DEFAULT 0.00,
      approved_earnings REAL NOT NULL DEFAULT 0.00,
      withdrawable_balance REAL NOT NULL DEFAULT 0.00, -- 70% transferable bucket
      lifetime_locked_savings REAL NOT NULL DEFAULT 0.00, -- 30% bucket cumulative
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Affiliate Referrals
    CREATE TABLE IF NOT EXISTS affiliate_referrals (
      id TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL,
      referred_user_id TEXT UNIQUE NOT NULL,
      referral_code TEXT NOT NULL,
      is_email_verified INTEGER NOT NULL DEFAULT 1,
      is_phone_verified INTEGER NOT NULL DEFAULT 1,
      is_kyc_completed INTEGER NOT NULL DEFAULT 1,
      is_qualifying INTEGER NOT NULL DEFAULT 1, -- meets approved conditions
      status TEXT NOT NULL DEFAULT 'active', -- 'pending', 'active', 'rejected_fraud'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Earnings Ledger (Auditable, decimal-safe earnings with 70/30 division)
    CREATE TABLE IF NOT EXISTS earnings_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      gross_amount REAL NOT NULL,
      transferable_portion REAL NOT NULL, -- 70%
      savings_portion REAL NOT NULL,      -- 30%
      event_type TEXT NOT NULL DEFAULT 'affiliate_commission', -- 'affiliate_commission', 'milestone_bonus', 'mentor_stipend'
      description TEXT NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved', -- 'pending', 'approved', 'reversed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Savings Accounts
    CREATE TABLE IF NOT EXISTS savings_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      total_locked_balance REAL NOT NULL DEFAULT 0.00,
      matured_unreleased_balance REAL NOT NULL DEFAULT 0.00,
      total_released_balance REAL NOT NULL DEFAULT 0.00,
      currency TEXT NOT NULL DEFAULT 'NGN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Individual 30% Savings Allocations (Each has strict 1-year lock maturity)
    CREATE TABLE IF NOT EXISTS savings_allocations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      earnings_ledger_id TEXT,
      amount REAL NOT NULL,
      credit_date DATETIME NOT NULL,
      maturity_date DATETIME NOT NULL, -- Exactly 1 year / 365 days from credit
      status TEXT NOT NULL DEFAULT 'locked', -- 'locked', 'approaching_maturity', 'matured', 'released'
      release_date DATETIME,
      destination_account TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Transfer Requests & Monday Payouts
    CREATE TABLE IF NOT EXISTS transfer_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      source_type TEXT NOT NULL, -- 'bank_account' or 'affiliate_transferable_earnings'
      amount REAL NOT NULL,
      destination_bank TEXT NOT NULL,
      destination_account_number TEXT NOT NULL,
      destination_account_name TEXT NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      scheduled_for_monday INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'completed', -- 'initiated', 'processing', 'completed', 'failed', 'cancelled'
      fee REAL NOT NULL DEFAULT 0.00,
      failure_reason TEXT,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Scheduled Payouts (Recurring Monday auto-payout)
    CREATE TABLE IF NOT EXISTS scheduled_payouts (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 0,
      payout_day TEXT NOT NULL DEFAULT 'Monday',
      destination_link_id TEXT,
      min_threshold REAL NOT NULL DEFAULT 5000.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Loan Products
    CREATE TABLE IF NOT EXISTS loan_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      min_amount REAL NOT NULL,
      max_amount REAL NOT NULL,
      interest_rate_percent REAL NOT NULL,
      tenure_months INTEGER NOT NULL,
      required_affiliates INTEGER NOT NULL DEFAULT 25,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Loan Applications
    CREATE TABLE IF NOT EXISTS loan_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      requested_amount REAL NOT NULL,
      purpose TEXT NOT NULL,
      tenure_months INTEGER NOT NULL,
      business_name TEXT,
      monthly_revenue REAL,
      qualifying_affiliates_at_application INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'under_review', -- 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'completed'
      assessment_notes TEXT,
      reviewer_id TEXT,
      disbursed_amount REAL,
      disbursed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES loan_products(id)
    );

    -- Loan Offers & Repayments
    CREATE TABLE IF NOT EXISTS loan_offers (
      id TEXT PRIMARY KEY,
      application_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      approved_amount REAL NOT NULL,
      interest_rate_percent REAL NOT NULL,
      monthly_repayment REAL NOT NULL,
      total_payable REAL NOT NULL,
      tenure_months INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'offered', -- 'offered', 'accepted', 'declined', 'disbursed'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accepted_at DATETIME,
      FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS loan_repayments (
      id TEXT PRIMARY KEY,
      loan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      installment_number INTEGER NOT NULL,
      amount_due REAL NOT NULL,
      amount_paid REAL NOT NULL DEFAULT 0.00,
      due_date DATETIME NOT NULL,
      paid_at DATETIME,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
      FOREIGN KEY (loan_id) REFERENCES loan_applications(id) ON DELETE CASCADE
    );

    -- Incubator Applications & Stages
    CREATE TABLE IF NOT EXISTS incubator_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      business_name TEXT NOT NULL,
      business_idea TEXT NOT NULL,
      sector TEXT NOT NULL,
      target_customers TEXT NOT NULL,
      problem_solved TEXT NOT NULL,
      proposed_product TEXT NOT NULL,
      revenue_model TEXT NOT NULL,
      funding_requirement REAL NOT NULL,
      qualifying_affiliates_count INTEGER NOT NULL,
      current_stage INTEGER NOT NULL DEFAULT 1, -- 1: Discovery, 2: Skills, 3: Planning, 4: Validation, 5: Growth, 6: Funding
      mentor_id TEXT,
      status TEXT NOT NULL DEFAULT 'active', -- 'submitted', 'under_review', 'active', 'graduated', 'rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Incubator Milestones & Courses
    CREATE TABLE IF NOT EXISTS incubator_milestones (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      stage_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress', -- 'pending', 'in_progress', 'completed'
      feedback TEXT,
      completed_at DATETIME,
      FOREIGN KEY (application_id) REFERENCES incubator_applications(id) ON DELETE CASCADE
    );

    -- Mentors
    CREATE TABLE IF NOT EXISTS mentors (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      title TEXT NOT NULL,
      expertise TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatar_url TEXT,
      email TEXT NOT NULL
    );

    -- Financial Audit Logs (Immutable records for sensitive operations)
    CREATE TABLE IF NOT EXISTS financial_audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_entity TEXT NOT NULL,
      target_id TEXT NOT NULL,
      amount REAL,
      details TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tier History
    CREATE TABLE IF NOT EXISTS user_tier_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      old_tier TEXT NOT NULL,
      new_tier TEXT NOT NULL,
      trigger_reason TEXT NOT NULL,
      qualifying_count INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // Check if system settings already exist
  const existingSettings = db.prepare('SELECT COUNT(*) as count FROM system_settings').get();
  if (existingSettings.count === 0) {
    const insertSetting = db.prepare('INSERT INTO system_settings (key, value, description) VALUES (?, ?, ?)');
    insertSetting.run('transferable_percentage', '70', 'Accessible affiliate earnings portion');
    insertSetting.run('locked_savings_percentage', '30', 'Compulsory locked savings portion');
    insertSetting.run('savings_lock_duration_days', '365', 'Lock duration in days (1 calendar year)');
    insertSetting.run('scheduled_payout_day', 'Monday', 'Designated weekly payout day');
    insertSetting.run('min_transfer_amount', '2000', 'Minimum withdrawal amount in NGN');
    insertSetting.run('max_transfer_amount', '2000000', 'Maximum daily withdrawal limit in NGN');
    insertSetting.run('standard_commission_rate', '10', 'Default affiliate rate (%)');
    insertSetting.run('partner_commission_rate', '20', 'RAP Growth Partner commission rate (%)');
    insertSetting.run('qualifying_affiliate_threshold', '25', 'Milestone for unlocking growth tier, loans, incubator');
  }

  // Check if default user exists
  const existingUser = db.prepare('SELECT COUNT(*) as count FROM users WHERE id = ?').get('usr-nigerian-youth-01');
  if (existingUser.count === 0) {
    // 1. Insert Nigerian Young Member: Chukwuemeka Adebayo
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, full_name, email, phone, password_hash, role, status, membership_tier,
        is_email_verified, is_phone_verified, kyc_level, bvn, nin, address,
        referral_code, referred_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'usr-nigerian-youth-01',
      'Chukwuemeka Adebayo',
      'adebayo@riseandprosper.ng',
      '+2348039876543',
      'hash_secure_adebayo_2026',
      'user',
      'active',
      'RAP Affiliate',
      1,
      1,
      2,
      '22244455588',
      '19827364521',
      '14 Broad Street, Marina, Lagos State',
      'RAP-EMEK98',
      'RAP-SYSTEM'
    );

    // 2. Admin Account: Dr. Ngozi Balogun
    insertUser.run(
      'usr-admin-01',
      'Dr. Ngozi Balogun',
      'admin@riseandprosper.ng',
      '+2348021112233',
      'hash_admin_master_2026',
      'admin',
      'active',
      'RAP Ambassador',
      1,
      1,
      3,
      '22119988776',
      '99887766554',
      'Plot 12 Ahmadu Bello Way, Victoria Island, Lagos',
      'RAP-ADMIN',
      null
    );

    // 3. Bank Account for Chukwuemeka (Partner Bank Wema Bank / Monnify Virtual Account)
    const insertBank = db.prepare(`
      INSERT INTO bank_accounts (
        id, user_id, partner_bank_name, partner_bank_code, account_number, account_name,
        actual_balance, available_balance, status, bvn_match
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertBank.run(
      'bnk-act-001',
      'usr-nigerian-youth-01',
      'Wema Bank (RAP Partner)',
      '035',
      '9823481029',
      'RISE & PROSPER / CHUKWUEMEKA ADEBAYO',
      185450.00,
      185450.00,
      'active',
      1
    );

    // 4. Linked External Bank Account (for payouts)
    const insertLinked = db.prepare(`
      INSERT INTO bank_account_links (
        id, user_id, bank_name, bank_code, account_number, account_name, is_verified, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertLinked.run(
      'lnk-act-001',
      'usr-nigerian-youth-01',
      'Guaranty Trust Bank (GTBank)',
      '058',
      '0129485739',
      'CHUKWUEMEKA O. ADEBAYO',
      1,
      1
    );

    // 5. Affiliate Profile (starts with 18 qualifying affiliates so user is at 72% toward 25!)
    const insertAffiliate = db.prepare(`
      INSERT INTO affiliate_profiles (
        id, user_id, affiliate_code, status, tier, commission_rate,
        total_referrals, qualifying_affiliates, total_earned, pending_earnings,
        approved_earnings, withdrawable_balance, lifetime_locked_savings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAffiliate.run(
      'aff-prof-001',
      'usr-nigerian-youth-01',
      'RAP-EMEK98',
      'approved',
      'Standard',
      10.0,
      21, // 21 registered, 18 qualifying, 3 pending verification
      18,
      145000.00,
      15000.00,
      145000.00,
      101500.00, // 70% of 145,000 = 101,500
      43500.00   // 30% of 145,000 = 43,500
    );

    // 6. Savings Account
    const insertSavingsAccount = db.prepare(`
      INSERT INTO savings_accounts (
        id, user_id, total_locked_balance, matured_unreleased_balance, total_released_balance
      ) VALUES (?, ?, ?, ?, ?)
    `);
    insertSavingsAccount.run(
      'sav-act-001',
      'usr-nigerian-youth-01',
      43500.00,
      0.00,
      0.00
    );

    // 7. Seed 3 Past Individual Savings Allocations (demonstrating exact dates & maturities)
    const insertSavingsAlloc = db.prepare(`
      INSERT INTO savings_allocations (
        id, user_id, earnings_ledger_id, amount, credit_date, maturity_date, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Past allocation 1: Jan 5 -> Mature Jan 5 next year
    insertSavingsAlloc.run(
      'sav-alloc-001',
      'usr-nigerian-youth-01',
      'ledg-past-001',
      12000.00,
      '2026-01-05 10:30:00',
      '2027-01-05 10:30:00',
      'locked',
      '30% locked savings from Jan Week 1 commission (₦40,000 gross)'
    );

    // Past allocation 2: Jan 12 -> Mature Jan 12 next year
    insertSavingsAlloc.run(
      'sav-alloc-002',
      'usr-nigerian-youth-01',
      'ledg-past-002',
      16500.00,
      '2026-01-12 14:15:00',
      '2027-01-12 14:15:00',
      'locked',
      '30% locked savings from Jan Week 2 commission (₦55,000 gross)'
    );

    // Past allocation 3: Jan 19 -> Mature Jan 19 next year
    insertSavingsAlloc.run(
      'sav-alloc-003',
      'usr-nigerian-youth-01',
      'ledg-past-003',
      15000.00,
      '2026-01-19 09:40:00',
      '2027-01-19 09:40:00',
      'locked',
      '30% locked savings from Jan Week 3 commission (₦50,000 gross)'
    );

    // 8. Seed 18 Qualifying Nigerian Affiliates
    const nigerianAffiliates = [
      { name: 'Oluwaseun Bakare', phone: '+2348023451001', city: 'Ibadan' },
      { name: 'Amina Mohammed', phone: '+2348034561002', city: 'Abuja' },
      { name: 'Chinedu Eze', phone: '+2348055671003', city: 'Enugu' },
      { name: 'Blessing Okafor', phone: '+2348076781004', city: 'Asaba' },
      { name: 'Ibrahim Danjuma', phone: '+2348097891005', city: 'Kano' },
      { name: 'Tolulope Fashola', phone: '+2348123451006', city: 'Lagos' },
      { name: 'Kelechi Nwosu', phone: '+2348134561007', city: 'Owerri' },
      { name: 'Fatima Garba', phone: '+2348145671008', city: 'Kaduna' },
      { name: 'Babatunde Alabi', phone: '+2348156781009', city: 'Abeokuta' },
      { name: 'Ngozi Onyeka', phone: '+2348167891010', city: 'Port Harcourt' },
      { name: 'Uchechukwu Dike', phone: '+2348178901011', city: 'Uyo' },
      { name: 'Maryam Sani', phone: '+2348189011012', city: 'Jos' },
      { name: 'Ayomide Adeleke', phone: '+2348190121013', city: 'Osogbo' },
      { name: 'Osasere Ighodaro', phone: '+2348021231014', city: 'Benin City' },
      { name: 'Halima Yusuf', phone: '+2348032341015', city: 'Sokoto' },
      { name: 'Emeka Nwachukwu', phone: '+2348043451016', city: 'Warri' },
      { name: 'Zainab Bello', phone: '+2348054561017', city: 'Ilorin' },
      { name: 'Damilola Ajayi', phone: '+2348065671018', city: 'Akure' }
    ];

    const insertAffReferral = db.prepare(`
      INSERT INTO affiliate_referrals (
        id, referrer_id, referred_user_id, referral_code,
        is_email_verified, is_phone_verified, is_kyc_completed, is_qualifying, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    nigerianAffiliates.forEach((aff, idx) => {
      const refUserId = `usr-ref-seeded-${idx + 1}`;
      // Insert user
      insertUser.run(
        refUserId,
        aff.name,
        `affiliate${idx + 1}@riseandprosper.ng`,
        aff.phone,
        'hashed_sub_pw_2026',
        'user',
        'active',
        'RAP Member',
        1,
        1,
        2,
        `222333444${idx + 10}`,
        `199288377${idx + 10}`,
        `${aff.city}, Nigeria`,
        `RAP-${aff.name.split(' ')[0].toUpperCase()}${idx + 1}`,
        'RAP-EMEK98'
      );

      // Insert affiliate referral record
      insertAffReferral.run(
        `ref-rec-${idx + 1}`,
        'usr-nigerian-youth-01',
        refUserId,
        'RAP-EMEK98',
        1,
        1,
        1,
        1, // qualifying
        'active',
        new Date(Date.now() - (18 - idx) * 86400000 * 2).toISOString()
      );
    });

    // 9. Seed Bank Transactions
    const insertBankTx = db.prepare(`
      INSERT INTO bank_transactions (
        id, bank_account_id, user_id, type, amount, balance_after, reference,
        narration, beneficiary_bank, beneficiary_account, beneficiary_name, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBankTx.run(
      'tx-001',
      'bnk-act-001',
      'usr-nigerian-youth-01',
      'deposit',
      150000.00,
      150000.00,
      'WEMA-CR-20261010-0921',
      'Virtual Account Credit / Funding via Monnify Transfer',
      'Wema Bank',
      '9823481029',
      'Chukwuemeka Adebayo',
      'completed',
      '2026-10-10 11:20:00'
    );

    insertBankTx.run(
      'tx-002',
      'bnk-act-001',
      'usr-nigerian-youth-01',
      'transfer_out',
      24550.00,
      125450.00,
      'RAP-TRF-20261012-4412',
      'Transfer to GTBank / Living Expenses',
      'Guaranty Trust Bank',
      '0129485739',
      'CHUKWUEMEKA O. ADEBAYO',
      'completed',
      '2026-10-12 16:45:00'
    );

    insertBankTx.run(
      'tx-003',
      'bnk-act-001',
      'usr-nigerian-youth-01',
      'deposit',
      60000.00,
      185450.00,
      'RAP-MON-PAYOUT-20261013-11',
      'RAP Monday Transfer / 70% Affiliate Payout',
      'RAP Partner Bank',
      '9823481029',
      'Chukwuemeka Adebayo',
      'completed',
      '2026-10-13 08:30:00'
    );

    // 10. Seed Loan Products
    const insertLoanProduct = db.prepare(`
      INSERT INTO loan_products (
        id, name, description, min_amount, max_amount, interest_rate_percent,
        tenure_months, required_affiliates, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLoanProduct.run(
      'prod-loan-sme',
      'RAP Youth SME Starter Loan',
      'Low-interest working capital for verified RAP Growth Partners to kickstart or expand their Nigerian small business.',
      50000.00,
      500000.00,
      5.0, // 5% subsidized youth rate
      6,
      25,
      1
    );

    insertLoanProduct.run(
      'prod-loan-growth',
      'RAP Business Scale Capital',
      'Expansion loan for graduates of the RAP Business Incubator with established customer traction and validated revenue.',
      500000.00,
      2500000.00,
      7.5,
      12,
      25,
      1
    );

    insertLoanProduct.run(
      'prod-loan-tech',
      'RAP Tech Equipment & Gadget Financing',
      'Procure laptops, smartphones, photography gear, and digital tools for tech freelancing and remote work.',
      100000.00,
      750000.00,
      4.0,
      6,
      25,
      1
    );

    // 11. Seed Mentors
    const insertMentor = db.prepare(`
      INSERT INTO mentors (
        id, full_name, title, expertise, bio, avatar_url, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertMentor.run(
      'mnt-001',
      'Engr. Babajide Williams',
      'Fintech & Digital Commerce Strategist',
      'Financial Modeling, Scale & Operations',
      '15+ years mentoring Nigerian youth entrepreneurs across Yaba tech cluster and Pan-Atlantic University EDC.',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'babajide@riseandprosper.ng'
    );

    insertMentor.run(
      'mnt-002',
      'Mrs. Folashade Adeleke',
      'E-commerce & Brand Director',
      'Brand Positioning, Sales Funnels & Supply Chain',
      'Founder of top Lagos retail accelerator, helping youth scale pre-order and inventory models nationwide.',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      'folashade@riseandprosper.ng'
    );
  }
}
