import { db } from './db.js';

export function handleApiRequest(req, res, url, body) {
  const method = req.method;
  const pathname = url.pathname;

  // Set standard JSON headers & CORS
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    // ----------------------------------------------------
    // 1. SYSTEM OVERVIEW & 10 DISTINCT BALANCES
    // ----------------------------------------------------
    if (pathname === '/api/user/balances' && method === 'GET') {
      const userId = url.searchParams.get('userId') || 'usr-nigerian-youth-01';
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      const bank = db.prepare('SELECT * FROM bank_accounts WHERE user_id = ?').get(userId);
      const affiliate = db.prepare('SELECT * FROM affiliate_profiles WHERE user_id = ?').get(userId);
      const savings = db.prepare('SELECT * FROM savings_accounts WHERE user_id = ?').get(userId);

      // Calculate total withdrawals & transfers
      const transfersOut = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM bank_transactions 
        WHERE user_id = ? AND type = 'transfer_out' AND status = 'completed'
      `).get(userId);

      const withdrawals = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM transfer_requests 
        WHERE user_id = ? AND status = 'completed'
      `).get(userId);

      // Approaching maturity (due within 30 days)
      const now = new Date();
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const approachingMaturity = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM savings_allocations 
        WHERE user_id = ? AND status = 'locked' AND maturity_date <= ?
      `).get(userId, thirtyDaysLater);

      // The 10 distinct balances required by RAP specification
      const response = {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          membershipTier: user.membership_tier,
          kycLevel: user.kyc_level,
          referralCode: user.referral_code
        },
        partnerBank: {
          partnerBankName: bank ? bank.partner_bank_name : 'Wema Bank (RAP Partner)',
          accountNumber: bank ? bank.account_number : '9823481029',
          accountName: bank ? bank.account_name : 'RISE & PROSPER / ' + user.full_name.toUpperCase(),
          status: bank ? bank.status : 'active',
          currency: 'NGN'
        },
        balances: {
          // 1. Actual bank account balance
          actualBankBalance: bank ? Number(bank.actual_balance.toFixed(2)) : 0.00,
          // 2. Available bank account balance
          availableBankBalance: bank ? Number(bank.available_balance.toFixed(2)) : 0.00,
          // 3. Total affiliate income earned (Gross lifetime)
          totalAffiliateIncomeEarned: affiliate ? Number(affiliate.total_earned.toFixed(2)) : 0.00,
          // 4. Pending affiliate earnings
          pendingAffiliateEarnings: affiliate ? Number(affiliate.pending_earnings.toFixed(2)) : 0.00,
          // 5. Approved affiliate earnings
          approvedAffiliateEarnings: affiliate ? Number(affiliate.approved_earnings.toFixed(2)) : 0.00,
          // 6. Earnings available for transfer (the 70% rule bucket)
          earningsAvailableForTransfer: affiliate ? Number(affiliate.withdrawable_balance.toFixed(2)) : 0.00,
          // 7. Locked savings balance (the 30% compulsory 1-year locked bucket)
          lockedSavingsBalance: savings ? Number(savings.total_locked_balance.toFixed(2)) : 0.00,
          // 8. Savings approaching maturity (within 30 days)
          savingsApproachingMaturity: Number(approachingMaturity.total.toFixed(2)),
          // 9. Total withdrawals (cumulative completed withdrawals)
          totalWithdrawals: Number(withdrawals.total.toFixed(2)),
          // 10. Total transfers (cumulative transfers sent)
          totalTransfers: Number(transfersOut.total.toFixed(2))
        },
        affiliateStats: {
          qualifyingAffiliates: affiliate ? affiliate.qualifying_affiliates : 0,
          totalReferrals: affiliate ? affiliate.total_referrals : 0,
          threshold: 25,
          percentProgress: affiliate ? Math.min(100, Math.round((affiliate.qualifying_affiliates / 25) * 100)) : 0,
          remainingAffiliates: affiliate ? Math.max(0, 25 - affiliate.qualifying_affiliates) : 25,
          isUnlocked: affiliate ? affiliate.qualifying_affiliates >= 25 : false
        }
      };

      res.statusCode = 200;
      res.end(JSON.stringify(response));
      return;
    }

    // ----------------------------------------------------
    // 2. THE 70/30 COMMISSION ENGINE (Simulate or Credit ₦100k)
    // ----------------------------------------------------
    if (pathname === '/api/affiliate/credit-commission' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const grossAmount = Number(body.amount) || 100000.00; // Default ₦100,000 test amount
      const eventDescription = body.description || 'Approved Affiliate Commission (₦100,000 gross)';

      // 70% accessible, 30% locked savings
      const transferablePortion = Number((grossAmount * 0.70).toFixed(2));
      const savingsPortion = Number((grossAmount * 0.30).toFixed(2));

      // Calculate 1-year maturity (365 days / calendar year)
      const creditDate = new Date();
      const maturityDate = new Date(creditDate);
      maturityDate.setFullYear(maturityDate.getFullYear() + 1);

      const ledgerId = 'ledg-' + Date.now();
      const reference = 'RAP-COMM-' + Date.now();

      // 1. Record in financial earnings ledger
      db.prepare(`
        INSERT INTO earnings_ledger (
          id, user_id, gross_amount, transferable_portion, savings_portion,
          event_type, description, reference, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')
      `).run(ledgerId, userId, grossAmount, transferablePortion, savingsPortion, 'affiliate_commission', eventDescription, reference);

      // 2. Update affiliate profile balances
      db.prepare(`
        UPDATE affiliate_profiles 
        SET total_earned = total_earned + ?,
            approved_earnings = approved_earnings + ?,
            withdrawable_balance = withdrawable_balance + ?,
            lifetime_locked_savings = lifetime_locked_savings + ?
        WHERE user_id = ?
      `).run(grossAmount, grossAmount, transferablePortion, savingsPortion, userId);

      // 3. Update savings account
      db.prepare(`
        UPDATE savings_accounts 
        SET total_locked_balance = total_locked_balance + ?,
            updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?
      `).run(savingsPortion, userId);

      // 4. Record individual locked savings allocation with exact 1-year maturity
      const allocId = 'sav-alloc-' + Date.now();
      db.prepare(`
        INSERT INTO savings_allocations (
          id, user_id, earnings_ledger_id, amount, credit_date, maturity_date, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, 'locked', ?)
      `).run(
        allocId,
        userId,
        ledgerId,
        savingsPortion,
        creditDate.toISOString(),
        maturityDate.toISOString(),
        `30% compulsory 1-year locked savings from ${reference} (Gross ₦${grossAmount.toLocaleString()})`
      );

      // 5. Record Financial Audit Log
      db.prepare(`
        INSERT INTO financial_audit_logs (
          id, actor_id, action, target_entity, target_id, amount, details
        ) VALUES (?, ?, 'CREDIT_COMMISSION_70_30', 'earnings_ledger', ?, ?, ?)
      `).run(
        'audit-' + Date.now(),
        userId,
        ledgerId,
        grossAmount,
        `Allocated gross ₦${grossAmount.toLocaleString()} into 70% transferable (₦${transferablePortion.toLocaleString()}) and 30% locked savings (₦${savingsPortion.toLocaleString()}). Maturity: ${maturityDate.toISOString().split('T')[0]}`
      );

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Commission processed and allocated under 70/30 rule successfully.',
        allocation: {
          grossAmount,
          transferablePortion,
          savingsPortion,
          creditDate: creditDate.toISOString(),
          maturityDate: maturityDate.toISOString(),
          reference
        }
      }));
      return;
    }

    // ----------------------------------------------------
    // 3. MONDAY TRANSFER FEATURE (Manual or Scheduled)
    // ----------------------------------------------------
    if (pathname === '/api/transfers/monday-earnings-transfer' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const requestedAmount = Number(body.amount);
      const destinationBank = body.destinationBank || 'Guaranty Trust Bank';
      const destinationAccountNumber = body.destinationAccountNumber || '0129485739';
      const destinationAccountName = body.destinationAccountName || 'CHUKWUEMEKA O. ADEBAYO';

      const affiliate = db.prepare('SELECT * FROM affiliate_profiles WHERE user_id = ?').get(userId);
      if (!affiliate) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: 'Affiliate profile not found' }));
        return;
      }

      const availableForTransfer = affiliate.withdrawable_balance;
      const transferAmount = requestedAmount && requestedAmount > 0 ? requestedAmount : availableForTransfer;

      if (transferAmount <= 0) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'No available affiliate earnings to transfer under the 70% allocation.' }));
        return;
      }

      if (transferAmount > availableForTransfer) {
        res.statusCode = 400;
        res.end(JSON.stringify({
          success: false,
          error: `Transfer amount (₦${transferAmount.toLocaleString()}) exceeds your 70% available earnings balance of ₦${availableForTransfer.toLocaleString()}. The 30% locked savings cannot be transferred.`
        }));
        return;
      }

      // Process Monday transfer
      const txRef = 'RAP-MON-' + Date.now();
      const transferId = 'trf-' + Date.now();

      // Deduct from affiliate transferable bucket
      db.prepare(`
        UPDATE affiliate_profiles 
        SET withdrawable_balance = withdrawable_balance - ? 
        WHERE user_id = ?
      `).run(transferAmount, userId);

      // Record transfer request
      db.prepare(`
        INSERT INTO transfer_requests (
          id, user_id, source_type, amount, destination_bank,
          destination_account_number, destination_account_name, reference,
          scheduled_for_monday, status, completed_at
        ) VALUES (?, ?, 'affiliate_transferable_earnings', ?, ?, ?, ?, ?, 1, 'completed', CURRENT_TIMESTAMP)
      `).run(
        transferId,
        userId,
        transferAmount,
        destinationBank,
        destinationAccountNumber,
        destinationAccountName,
        txRef
      );

      // Also record bank transaction in user's bank ledger if funded into RAP bank account or external
      db.prepare(`
        INSERT INTO bank_transactions (
          id, bank_account_id, user_id, type, amount, balance_after, reference,
          narration, beneficiary_bank, beneficiary_account, beneficiary_name, status
        ) VALUES (?, (SELECT id FROM bank_accounts WHERE user_id = ?), ?, 'transfer_in', ?, 
          (SELECT actual_balance + ? FROM bank_accounts WHERE user_id = ?), ?, ?, ?, ?, ?, 'completed')
      `).run(
        'tx-' + Date.now(),
        userId,
        userId,
        transferAmount,
        transferAmount,
        userId,
        txRef,
        'RAP Monday Earnings Transfer (70% accessible payout)',
        destinationBank,
        destinationAccountNumber,
        destinationAccountName
      );

      // Credit the partner bank account
      db.prepare(`
        UPDATE bank_accounts 
        SET actual_balance = actual_balance + ?,
            available_balance = available_balance + ?
        WHERE user_id = ?
      `).run(transferAmount, transferAmount, userId);

      // Audit Log
      db.prepare(`
        INSERT INTO financial_audit_logs (
          id, actor_id, action, target_entity, target_id, amount, details
        ) VALUES (?, ?, 'MONDAY_TRANSFER_COMPLETED', 'transfer_requests', ?, ?, ?)
      `).run(
        'audit-' + Date.now(),
        userId,
        transferId,
        transferAmount,
        `Processed Monday transfer of ₦${transferAmount.toLocaleString()} to ${destinationBank} (${destinationAccountNumber})`
      );

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Monday affiliate earnings payout completed successfully.',
        transfer: {
          transferId,
          reference: txRef,
          amount: transferAmount,
          destinationBank,
          destinationAccountNumber,
          destinationAccountName,
          remainingTransferable: availableForTransfer - transferAmount
        }
      }));
      return;
    }

    // ----------------------------------------------------
    // 4. BANK TRANSFER (Send Money to Any Nigerian Bank)
    // ----------------------------------------------------
    if (pathname === '/api/banking/send-transfer' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const amount = Number(body.amount);
      const destinationBank = body.destinationBank || 'Access Bank';
      const destinationAccount = body.destinationAccount;
      const destinationName = body.destinationName || 'Verified Beneficiary';
      const narration = body.narration || 'RAP Outgoing Transfer';

      const bank = db.prepare('SELECT * FROM bank_accounts WHERE user_id = ?').get(userId);
      if (!bank || bank.available_balance < amount) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Insufficient available bank balance.' }));
        return;
      }

      const txRef = 'RAP-TX-' + Date.now();
      const newBalance = bank.actual_balance - amount;

      db.prepare(`
        UPDATE bank_accounts 
        SET actual_balance = actual_balance - ?,
            available_balance = available_balance - ?
        WHERE id = ?
      `).run(amount, amount, bank.id);

      db.prepare(`
        INSERT INTO bank_transactions (
          id, bank_account_id, user_id, type, amount, balance_after, reference,
          narration, beneficiary_bank, beneficiary_account, beneficiary_name, status
        ) VALUES (?, ?, ?, 'transfer_out', ?, ?, ?, ?, ?, ?, ?, 'completed')
      `).run(
        'tx-' + Date.now(),
        bank.id,
        userId,
        amount,
        newBalance,
        txRef,
        narration,
        destinationBank,
        destinationAccount,
        destinationName
      );

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Transfer submitted and verified successfully.',
        transaction: {
          reference: txRef,
          amount,
          newBalance,
          destinationBank,
          destinationAccount,
          destinationName,
          narration,
          date: new Date().toISOString()
        }
      }));
      return;
    }

    // ----------------------------------------------------
    // 5. MY SAVINGS LEDGER & MATURITY SCHEDULE
    // ----------------------------------------------------
    if (pathname === '/api/savings/allocations' && method === 'GET') {
      const userId = url.searchParams.get('userId') || 'usr-nigerian-youth-01';
      const allocations = db.prepare(`
        SELECT * FROM savings_allocations 
        WHERE user_id = ? 
        ORDER BY credit_date DESC
      `).all(userId);

      const savings = db.prepare('SELECT * FROM savings_accounts WHERE user_id = ?').get(userId);

      res.statusCode = 200;
      res.end(JSON.stringify({
        totalLockedBalance: savings ? savings.total_locked_balance : 0,
        maturedUnreleased: savings ? savings.matured_unreleased_balance : 0,
        totalReleased: savings ? savings.total_released_balance : 0,
        allocations
      }));
      return;
    }

    // ----------------------------------------------------
    // 6. 25-AFFILIATE MILESTONE: SIMULATE OR ADD REFERRALS
    // ----------------------------------------------------
    if (pathname === '/api/affiliate/reach-25-milestone' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const affiliate = db.prepare('SELECT * FROM affiliate_profiles WHERE user_id = ?').get(userId);
      const currentQualifying = affiliate ? affiliate.qualifying_affiliates : 18;
      const needed = Math.max(0, 25 - currentQualifying);

      // Add the remaining qualifying Nigerian affiliates
      const additionalNames = [
        'Somtochukwu Madu', 'Aisha Danladi', 'Favour Adebayo',
        'Tunde Bakare Jr.', 'Chioma Okonkwo', 'Victor Oshimen', 'Rasheedat Ajibade'
      ];

      for (let i = 0; i < needed; i++) {
        const name = additionalNames[i] || `Young Entrepreneur ${i + 19}`;
        const newUserId = `usr-ref-dynamic-${Date.now()}-${i}`;
        
        db.prepare(`
          INSERT INTO users (
            id, full_name, email, phone, password_hash, role, status, membership_tier,
            is_email_verified, is_phone_verified, kyc_level, referral_code, referred_by
          ) VALUES (?, ?, ?, ?, 'hashed_pass_2026', 'user', 'active', 'RAP Member', 1, 1, 2, ?, 'RAP-EMEK98')
        `).run(
          newUserId,
          name,
          `user${i + 19}@riseandprosper.ng`,
          `+23480998877${i + 10}`,
          `RAP-${name.split(' ')[0].toUpperCase()}${i + 19}`
        );

        db.prepare(`
          INSERT INTO affiliate_referrals (
            id, referrer_id, referred_user_id, referral_code,
            is_email_verified, is_phone_verified, is_kyc_completed, is_qualifying, status
          ) VALUES (?, ?, ?, 'RAP-EMEK98', 1, 1, 1, 1, 'active')
        `).run(`ref-dyn-${Date.now()}-${i}`, userId, newUserId);
      }

      // Promote User to RAP Growth Partner Tier!
      const newQualifyingCount = currentQualifying + needed;
      db.prepare(`
        UPDATE affiliate_profiles 
        SET qualifying_affiliates = ?,
            total_referrals = total_referrals + ?,
            tier = 'RAP Growth Partner',
            commission_rate = 20.0
        WHERE user_id = ?
      `).run(newQualifyingCount, needed, userId);

      db.prepare(`
        UPDATE users 
        SET membership_tier = 'RAP Growth Partner' 
        WHERE id = ?
      `).run(userId);

      // Record Tier History
      db.prepare(`
        INSERT INTO user_tier_history (
          id, user_id, old_tier, new_tier, trigger_reason, qualifying_count
        ) VALUES (?, ?, 'RAP Affiliate', 'RAP Growth Partner', 'Reached 25 Qualifying Affiliates Milestone', ?)
      `).run('tier-' + Date.now(), userId, newQualifyingCount);

      // Audit Log
      db.prepare(`
        INSERT INTO financial_audit_logs (
          id, actor_id, action, target_entity, target_id, amount, details
        ) VALUES (?, ?, 'TIER_UNLOCKED_25_AFFILIATES', 'users', ?, 0, 'Promoted to RAP Growth Partner, unlocked Loan Assessment and Business Incubator.')
      `).run('audit-' + Date.now(), userId, userId);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Congratulations! You have achieved 25 Qualifying Affiliates!',
        unlocked: {
          tier: 'RAP Growth Partner',
          commissionRate: '20%',
          loanOpportunity: 'UNLOCKED',
          businessIncubator: 'UNLOCKED',
          qualifyingCount: newQualifyingCount
        }
      }));
      return;
    }

    // ----------------------------------------------------
    // 7. LOANS: LIST PRODUCTS & APPLY
    // ----------------------------------------------------
    if (pathname === '/api/loans/products' && method === 'GET') {
      const products = db.prepare('SELECT * FROM loan_products WHERE is_active = 1').all();
      res.statusCode = 200;
      res.end(JSON.stringify(products));
      return;
    }

    if (pathname === '/api/loans/apply' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const productId = body.productId || 'prod-loan-sme';
      const requestedAmount = Number(body.requestedAmount) || 250000.00;
      const tenureMonths = Number(body.tenureMonths) || 6;
      const purpose = body.purpose || 'Working capital for retail store inventory';
      const businessName = body.businessName || 'Adebayo Digital Fashion Store';

      // Verify that user meets 25 affiliate requirement
      const affiliate = db.prepare('SELECT * FROM affiliate_profiles WHERE user_id = ?').get(userId);
      if (!affiliate || affiliate.qualifying_affiliates < 25) {
        res.statusCode = 403;
        res.end(JSON.stringify({
          success: false,
          error: `Loan opportunities unlock at 25 qualifying affiliates. Current: ${affiliate ? affiliate.qualifying_affiliates : 0}/25.`
        }));
        return;
      }

      const appId = 'loan-app-' + Date.now();
      db.prepare(`
        INSERT INTO loan_applications (
          id, user_id, product_id, requested_amount, purpose, tenure_months,
          business_name, monthly_revenue, qualifying_affiliates_at_application, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 350000.00, ?, 'under_review')
      `).run(appId, userId, productId, requestedAmount, purpose, tenureMonths, businessName, affiliate.qualifying_affiliates);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Loan application submitted successfully. Credit team will review your business profile.',
        applicationId: appId
      }));
      return;
    }

    if (pathname === '/api/loans/user-applications' && method === 'GET') {
      const userId = url.searchParams.get('userId') || 'usr-nigerian-youth-01';
      const applications = db.prepare(`
        SELECT la.*, lp.name as product_name, lp.interest_rate_percent 
        FROM loan_applications la
        JOIN loan_products lp ON la.product_id = lp.id
        WHERE la.user_id = ?
        ORDER BY la.created_at DESC
      `).all(userId);

      res.statusCode = 200;
      res.end(JSON.stringify(applications));
      return;
    }

    // ----------------------------------------------------
    // 8. BUSINESS INCUBATOR: APPLY & TRACK
    // ----------------------------------------------------
    if (pathname === '/api/incubator/apply' && method === 'POST') {
      const userId = body.userId || 'usr-nigerian-youth-01';
      const businessName = body.businessName || 'GreenProsper Agritech';
      const businessIdea = body.businessIdea || 'Connecting rural cassava farmers to urban bulk processors using SMS order escrow.';
      const sector = body.sector || 'Agritech & Food Logistics';
      const problemSolved = body.problemSolved || 'Post-harvest spoilage and predatory middleman pricing.';
      const revenueModel = body.revenueModel || '3.5% transaction commission on settled bulk farm gate orders.';
      const fundingRequirement = Number(body.fundingRequirement) || 1200000.00;

      const affiliate = db.prepare('SELECT * FROM affiliate_profiles WHERE user_id = ?').get(userId);
      if (!affiliate || affiliate.qualifying_affiliates < 25) {
        res.statusCode = 403;
        res.end(JSON.stringify({
          success: false,
          error: `Incubator admission unlocks at 25 qualifying affiliates. Current: ${affiliate ? affiliate.qualifying_affiliates : 0}/25.`
        }));
        return;
      }

      const incAppId = 'inc-app-' + Date.now();
      db.prepare(`
        INSERT INTO incubator_applications (
          id, user_id, business_name, business_idea, sector, target_customers,
          problem_solved, proposed_product, revenue_model, funding_requirement,
          qualifying_affiliates_count, current_stage, mentor_id, status
        ) VALUES (?, ?, ?, ?, ?, 'Urban Food Processors & Cassava Cooperatives', ?, 'Digital Escrow Logistics System', ?, ?, ?, 1, 'mnt-001', 'active')
      `).run(
        incAppId,
        userId,
        businessName,
        businessIdea,
        sector,
        problemSolved,
        revenueModel,
        fundingRequirement,
        affiliate.qualifying_affiliates
      );

      // Create Initial Milestone
      db.prepare(`
        INSERT INTO incubator_milestones (
          id, application_id, stage_number, title, description, status
        ) VALUES (?, ?, 1, 'Stage 1: Discovery & Problem Validation', 'Interview 20 cooperative leaders and document current post-harvest loss numbers.', 'in_progress')
      `).run('inc-ms-' + Date.now(), incAppId);

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Business Incubator application approved! Welcome to Cohort 2026. Mentor assigned.',
        applicationId: incAppId
      }));
      return;
    }

    if (pathname === '/api/incubator/status' && method === 'GET') {
      const userId = url.searchParams.get('userId') || 'usr-nigerian-youth-01';
      const incApp = db.prepare(`
        SELECT ia.*, m.full_name as mentor_name, m.title as mentor_title, m.avatar_url as mentor_avatar
        FROM incubator_applications ia
        LEFT JOIN mentors m ON ia.mentor_id = m.id
        WHERE ia.user_id = ?
        ORDER BY ia.created_at DESC LIMIT 1
      `).get(userId);

      const milestones = incApp ? db.prepare('SELECT * FROM incubator_milestones WHERE application_id = ?').all(incApp.id) : [];

      res.statusCode = 200;
      res.end(JSON.stringify({
        application: incApp || null,
        milestones,
        stages: [
          { number: 1, title: 'Discovery', desc: 'Identify opportunity, define market & validate pain point.' },
          { number: 2, title: 'Skills Development', desc: 'Master financial modeling, sales funnels & management.' },
          { number: 3, title: 'Business Planning', desc: 'Build lean canvas, budget forecasts & acquisition plan.' },
          { number: 4, title: 'Validation', desc: 'Acquire first 10 paying customers & test traction.' },
          { number: 5, title: 'Growth', desc: 'Optimize unit economics, operations & partnerships.' },
          { number: 6, title: 'Funding Assessment', desc: 'Pitch for catalytic seed grants & partner equity.' }
        ]
      }));
      return;
    }

    // ----------------------------------------------------
    // 9. TRANSACTIONS & STATEMENT
    // ----------------------------------------------------
    if (pathname === '/api/banking/transactions' && method === 'GET') {
      const userId = url.searchParams.get('userId') || 'usr-nigerian-youth-01';
      const txs = db.prepare(`
        SELECT * FROM bank_transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC LIMIT 20
      `).all(userId);

      res.statusCode = 200;
      res.end(JSON.stringify(txs));
      return;
    }

    // ----------------------------------------------------
    // 10. ADMIN: SYSTEM METRICS & AUDIT LOGS
    // ----------------------------------------------------
    if (pathname === '/api/admin/overview' && method === 'GET') {
      const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const totalVolume = db.prepare('SELECT COALESCE(SUM(amount), 0) as vol FROM bank_transactions').get().vol;
      const totalLockedSavings = db.prepare('SELECT COALESCE(SUM(total_locked_balance), 0) as sav FROM savings_accounts').get().sav;
      const pendingLoans = db.prepare("SELECT COUNT(*) as count FROM loan_applications WHERE status = 'under_review'").get().count;
      const incubatorStudents = db.prepare('SELECT COUNT(*) as count FROM incubator_applications').get().count;
      const auditLogs = db.prepare('SELECT * FROM financial_audit_logs ORDER BY created_at DESC LIMIT 15').all();
      const settings = db.prepare('SELECT * FROM system_settings').all();

      res.statusCode = 200;
      res.end(JSON.stringify({
        metrics: {
          totalUsers,
          totalVolume,
          totalLockedSavings,
          pendingLoans,
          incubatorStudents
        },
        auditLogs,
        settings
      }));
      return;
    }

    // ----------------------------------------------------
    // 11. STEP 1 - 19 END-TO-END SCENARIO RUNNER
    // ----------------------------------------------------
    if (pathname === '/api/scenario/run-step' && method === 'POST') {
      const step = Number(body.step);
      const userId = body.userId || 'usr-nigerian-youth-01';

      let result = { step, status: 'completed', description: '' };

      switch (step) {
        case 1:
          result.description = 'Young Nigerian registers for RAP (Full name, credentials initialized).';
          break;
        case 2:
          db.prepare('UPDATE users SET is_email_verified = 1, is_phone_verified = 1 WHERE id = ?').run(userId);
          result.description = 'User confirms email address and verifies phone number via OTP.';
          break;
        case 3:
          db.prepare('UPDATE users SET kyc_level = 2, bvn = "22244455588", nin = "19827364521" WHERE id = ?').run(userId);
          result.description = 'User completes identity verification (BVN/NIN matched with NIBSS).';
          break;
        case 4:
          result.description = 'User applies for RAP banking account; Wema/Monnify partner account 9823481029 issued.';
          break;
        case 5:
          result.description = 'User registers as affiliate and receives unique referral code: RAP-EMEK98.';
          break;
        case 6:
          // Reach 25 qualifying affiliates
          db.prepare('UPDATE affiliate_profiles SET qualifying_affiliates = 25, total_referrals = 28 WHERE user_id = ?').run(userId);
          result.description = '25 qualifying Nigerian affiliates register and satisfy KYC/activation conditions.';
          break;
        case 7:
          db.prepare("UPDATE affiliate_profiles SET tier = 'RAP Growth Partner', commission_rate = 20.0 WHERE user_id = ?").run(userId);
          db.prepare("UPDATE users SET membership_tier = 'RAP Growth Partner' WHERE id = ?").run(userId);
          result.description = 'System verifies 25 affiliates and unlocks higher tier, loan application, and incubator!';
          break;
        case 8:
          result.description = 'User earns ₦100,000 in approved affiliate commission.';
          break;
        case 9:
          // Allocate 70/30
          {
            const gross = 100000.00;
            const t70 = 70000.00;
            const s30 = 30000.00;
            const cDate = new Date();
            const mDate = new Date(cDate);
            mDate.setFullYear(mDate.getFullYear() + 1);

            db.prepare(`
              INSERT INTO earnings_ledger (
                id, user_id, gross_amount, transferable_portion, savings_portion,
                event_type, description, reference, status
              ) VALUES (?, ?, ?, ?, ?, 'affiliate_commission', '₦100k Commission 70/30 Split', ?, 'approved')
            `).run('ledg-step9-' + Date.now(), userId, gross, t70, s30, 'RAP-COMM-STEP9-' + Date.now());

            db.prepare(`
              UPDATE affiliate_profiles 
              SET total_earned = total_earned + ?,
                  approved_earnings = approved_earnings + ?,
                  withdrawable_balance = withdrawable_balance + ?,
                  lifetime_locked_savings = lifetime_locked_savings + ?
              WHERE user_id = ?
            `).run(gross, gross, t70, s30, userId);

            db.prepare(`
              UPDATE savings_accounts 
              SET total_locked_balance = total_locked_balance + ? 
              WHERE user_id = ?
            `).run(s30, userId);

            db.prepare(`
              INSERT INTO savings_allocations (
                id, user_id, amount, credit_date, maturity_date, status, notes
              ) VALUES (?, ?, ?, ?, ?, 'locked', '30% locked savings (₦30,000) for 1 year')
            `).run('sav-step9-' + Date.now(), userId, s30, cDate.toISOString(), mDate.toISOString());

            result.description = 'System allocates ₦70,000 to transferable balance and ₦30,000 to 1-year locked savings.';
          }
          break;
        case 10:
          result.description = 'Dashboard displays both amounts separately: ₦70k transferable, ₦30k locked.';
          break;
        case 11:
          result.description = 'On Monday, user clicks "TRANSFER MY AVAILABLE EARNINGS".';
          break;
        case 12:
          // Process Monday transfer of ₦70,000
          db.prepare(`
            UPDATE affiliate_profiles 
            SET withdrawable_balance = withdrawable_balance - 70000.00 
            WHERE user_id = ?
          `).run(userId);

          db.prepare(`
            UPDATE bank_accounts 
            SET actual_balance = actual_balance + 70000.00,
                available_balance = available_balance + 70000.00
            WHERE user_id = ?
          `).run(userId);

          result.description = 'System validates ₦70k available amount, verifies GTBank 0129485739, and processes transfer.';
          break;
        case 13:
          result.description = 'Transfer confirmed via payment switch (Reference: RAP-MON-STEP13).';
          break;
        case 14:
          result.description = 'Financial ledger and bank balances updated to reflect completed transfer.';
          break;
        case 15:
          result.description = 'User inspects MY SAVINGS dashboard showing ₦30,000 locked until 1 year maturity.';
          break;
        case 16:
          // Submit loan application
          db.prepare(`
            INSERT INTO loan_applications (
              id, user_id, product_id, requested_amount, purpose, tenure_months,
              business_name, monthly_revenue, qualifying_affiliates_at_application, status
            ) VALUES (?, ?, 'prod-loan-sme', 250000.00, 'SME Inventory Growth', 6, 'Adebayo Stores', 350000.00, 25, 'under_review')
          `).run('loan-app-step16-' + Date.now(), userId);
          result.description = 'User applies for ₦250,000 SME Starter Loan through unlocked loan opportunity.';
          break;
        case 17:
          // Admin approves loan
          db.prepare(`
            UPDATE loan_applications 
            SET status = 'approved', assessment_notes = 'Credit score excellent. 25 affiliates verified. Approved at 5% youth rate.' 
            WHERE user_id = ? AND status = 'under_review'
          `).run(userId);
          result.description = 'Authorised administrator assesses and approves loan application.';
          break;
        case 18:
          // Apply to incubator
          db.prepare(`
            INSERT INTO incubator_applications (
              id, user_id, business_name, business_idea, sector, target_customers,
              problem_solved, proposed_product, revenue_model, funding_requirement,
              qualifying_affiliates_count, current_stage, mentor_id, status
            ) VALUES (?, ?, 'Prosper Logistics', 'Direct farm-to-table delivery', 'AgriTech', 'Lagos households', 'Food inflation', 'Cold chain delivery', 'Commission', 1000000, 25, 1, 'mnt-001', 'active')
          `).run('inc-step18-' + Date.now(), userId);
          result.description = 'User applies to RAP Business Incubator; assigned to mentor Engr. Babajide Williams.';
          break;
        case 19:
          result.description = 'Administrator inspects complete auditable history of referrals, 70/30 splits, transfers, loans, and incubator progress.';
          break;
        default:
          result.description = `Step ${step} executed.`;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, result }));
      return;
    }

    // 404 for unknown endpoints
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found: ' + pathname }));
  } catch (err) {
    console.error('API Error:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}
