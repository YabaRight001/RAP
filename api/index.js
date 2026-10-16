// Vercel Serverless API Handler for RAP (Rise and Prosper)
// Pure JavaScript, zero native dependencies, fully compatible with all Vercel Node runtimes (18, 20, 22)

let platformState = {
  user: {
    id: "usr-nigerian-youth-01",
    fullName: "Chukwuemeka Adebayo",
    email: "adebayo@riseandprosper.ng",
    phone: "+2348039876543",
    role: "user",
    status: "active",
    membershipTier: "RAP Affiliate",
    kycLevel: 2,
    referralCode: "RAP-EMEK98"
  },
  partnerBank: {
    partnerBankName: "Wema Bank (RAP Partner)",
    accountNumber: "9823481029",
    accountName: "RISE & PROSPER / CHUKWUEMEKA ADEBAYO",
    status: "active",
    currency: "NGN"
  },
  balances: {
    actualBankBalance: 184500.00,
    availableBankBalance: 124500.00,
    totalAffiliateIncomeEarned: 240000.00,
    pendingAffiliateEarnings: 25000.00,
    approvedAffiliateEarnings: 168000.00,
    earningsAvailableForTransfer: 42000.00,
    lockedSavingsBalance: 72000.00,
    savingsApproachingMaturity: 30000.00,
    totalWithdrawals: 45000.00,
    totalTransfers: 60000.00
  },
  affiliateStats: {
    qualifyingAffiliates: 18,
    totalReferrals: 22,
    threshold: 25,
    percentProgress: 72,
    remainingAffiliates: 7,
    tierCommissionRate: 15
  },
  savingsDetails: {
    totalLocked: 72000.00,
    accumulatedThisMonth: 18000.00,
    accumulatedToDate: 72000.00,
    approachingMaturity: 30000.00,
    maturedSavings: 0.00,
    releasedSavings: 0.00,
    allocations: [
      {
        id: "sav-alloc-01",
        credit_date: "2025-11-15",
        original_amount: 30000.00,
        amount: 30000.00,
        maturity_date: "2026-11-15",
        status: "locked",
        days_remaining: 30
      },
      {
        id: "sav-alloc-02",
        credit_date: "2026-01-20",
        original_amount: 24000.00,
        amount: 24000.00,
        maturity_date: "2027-01-20",
        status: "locked",
        days_remaining: 96
      },
      {
        id: "sav-alloc-03",
        credit_date: "2026-03-10",
        original_amount: 18000.00,
        amount: 18000.00,
        maturity_date: "2027-03-10",
        status: "locked",
        days_remaining: 145
      }
    ]
  },
  recentTransactions: [
    {
      id: "tx-seed-01",
      reference: "RAP-TX-20261014-9841",
      type: "deposit",
      amount: 50000.00,
      balance_after: 184500.00,
      narration: "Bank Transfer from GTBank / Adebayo Emeka",
      status: "completed",
      created_at: "2026-10-14 14:22:10"
    },
    {
      id: "tx-seed-02",
      reference: "RAP-MON-20261012-7721",
      type: "transfer_in",
      amount: 42000.00,
      balance_after: 134500.00,
      narration: "Monday Payout: 70% Transferable Affiliate Commission",
      status: "completed",
      created_at: "2026-10-12 09:15:00"
    },
    {
      id: "tx-seed-03",
      reference: "RAP-TRF-20261010-3312",
      type: "transfer_out",
      amount: 25000.00,
      balance_after: 92500.00,
      narration: "Transfer to Zenith Bank (1029384756) / Chioma Okonkwo",
      status: "completed",
      created_at: "2026-10-10 16:40:22"
    }
  ],
  loans: [],
  incubator: null
};

export default async function handler(req, res) {
  // CORS & Content-Type
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Parse path
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Read body if needed
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // 1. Balances
  if (pathname.endsWith('/balances') || pathname === '/api/user/balances') {
    return res.status(200).json(platformState);
  }

  // 2. 70/30 Commission Credit
  if (pathname.includes('/credit-commission')) {
    const amount = Number(body.amount) || 100000;
    const transferable = amount * 0.70;
    const locked = amount * 0.30;
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    platformState.balances.totalAffiliateIncomeEarned += amount;
    platformState.balances.approvedAffiliateEarnings += amount;
    platformState.balances.earningsAvailableForTransfer += transferable;
    platformState.balances.lockedSavingsBalance += locked;

    platformState.savingsDetails.totalLocked += locked;
    platformState.savingsDetails.accumulatedThisMonth += locked;
    platformState.savingsDetails.accumulatedToDate += locked;
    platformState.savingsDetails.allocations.unshift({
      id: 'sav-' + Date.now(),
      credit_date: new Date().toISOString().split('T')[0],
      original_amount: locked,
      amount: locked,
      maturity_date: oneYearLater.toISOString().split('T')[0],
      status: 'locked',
      days_remaining: 365
    });

    return res.status(200).json({
      success: true,
      message: `Commission of ₦${amount.toLocaleString()} credited successfully.`,
      allocation: {
        totalEarned: amount,
        transferablePortion: transferable,
        lockedSavingsPortion: locked,
        maturityDate: oneYearLater.toISOString().split('T')[0]
      }
    });
  }

  // 3. 25 Milestone
  if (pathname.includes('/reach-25-milestone')) {
    platformState.user.membershipTier = 'RAP Growth Partner';
    platformState.affiliateStats.qualifyingAffiliates = 25;
    platformState.affiliateStats.percentProgress = 100;
    platformState.affiliateStats.remainingAffiliates = 0;
    platformState.affiliateStats.tierCommissionRate = 20;

    return res.status(200).json({
      success: true,
      message: 'Congratulations! You have reached 25 qualifying affiliates.',
      tier: 'RAP Growth Partner',
      unlocked: { loans: true, incubator: true }
    });
  }

  // 4. Monday Transfer
  if (pathname.includes('/monday-earnings-transfer')) {
    const amount = Number(body.amount) || platformState.balances.earningsAvailableForTransfer;
    if (amount <= 0 || amount > platformState.balances.earningsAvailableForTransfer) {
      return res.status(400).json({ success: false, error: 'Insufficient available earnings.' });
    }

    platformState.balances.earningsAvailableForTransfer -= amount;
    platformState.balances.totalWithdrawals += amount;
    platformState.balances.actualBankBalance += amount;
    platformState.balances.availableBankBalance += amount;

    const ref = 'RAP-MON-' + Date.now().toString().slice(-6);
    const tx = {
      id: 'tx-' + Date.now(),
      reference: ref,
      type: 'transfer_in',
      amount: amount,
      balance_after: platformState.balances.actualBankBalance,
      narration: `Monday Payout: 70% Transferable Affiliate Commission to ${body.destinationBank || 'Internal Bank'}`,
      status: 'completed',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    platformState.recentTransactions.unshift(tx);

    return res.status(200).json({
      success: true,
      transfer: {
        reference: ref,
        amount: amount,
        fee: 0,
        netAmount: amount,
        destinationBank: body.destinationBank || 'Wema Bank (RAP Partner)',
        destinationAccount: body.destinationAccountNumber || '9823481029',
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });
  }

  // 5. Send Transfer
  if (pathname.includes('/send-transfer')) {
    const amount = Number(body.amount) || 0;
    if (amount <= 0 || amount > platformState.balances.availableBankBalance) {
      return res.status(400).json({ success: false, error: 'Insufficient available bank balance.' });
    }

    platformState.balances.actualBankBalance -= amount;
    platformState.balances.availableBankBalance -= amount;
    platformState.balances.totalTransfers += amount;

    const ref = 'RAP-TRF-' + Date.now().toString().slice(-6);
    const tx = {
      id: 'tx-' + Date.now(),
      reference: ref,
      type: 'transfer_out',
      amount: amount,
      balance_after: platformState.balances.actualBankBalance,
      narration: `Transfer to ${body.destinationBank} (${body.destinationAccount}) / ${body.destinationName}`,
      status: 'completed',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    platformState.recentTransactions.unshift(tx);

    return res.status(200).json({
      success: true,
      transaction: {
        reference: ref,
        amount: amount,
        fee: 10.75,
        destinationBank: body.destinationBank,
        destinationAccount: body.destinationAccount,
        destinationName: body.destinationName,
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });
  }

  // 6. Savings allocations
  if (pathname.includes('/savings/allocations')) {
    return res.status(200).json(platformState.savingsDetails);
  }

  // 7. Transactions
  if (pathname.includes('/banking/transactions')) {
    return res.status(200).json(platformState.recentTransactions);
  }

  // 8. Loans
  if (pathname.includes('/loans/user-applications')) {
    return res.status(200).json(platformState.loans);
  }

  // 9. Incubator
  if (pathname.includes('/incubator/status')) {
    return res.status(200).json({ application: platformState.incubator });
  }

  // 10. Scenario Walkthrough runner
  if (pathname.includes('/scenario/run-step')) {
    const step = Number(body.step) || 1;
    return res.status(200).json({
      success: true,
      step: step,
      result: {
        step: step,
        status: 'success',
        description: `Step ${step} executed successfully.`
      }
    });
  }

  // Default fallback: return current platform state
  return res.status(200).json(platformState);
}
