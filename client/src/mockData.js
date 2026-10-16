// Initial Seed Data for RAP (Rise and Prosper)
// Matches RAP specification with 10 distinct balances, Nigerian banking, and affiliate tracking

export const initialRapData = {
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
    // 1. Actual bank account balance
    actualBankBalance: 184500.00,
    // 2. Available bank account balance
    availableBankBalance: 124500.00,
    // 3. Total affiliate income earned (Gross lifetime)
    totalAffiliateIncomeEarned: 240000.00,
    // 4. Pending affiliate earnings
    pendingAffiliateEarnings: 25000.00,
    // 5. Approved affiliate earnings
    approvedAffiliateEarnings: 168000.00,
    // 6. Earnings available for transfer (the 70% rule bucket)
    earningsAvailableForTransfer: 42000.00,
    // 7. Locked savings balance (the 30% compulsory 1-year locked bucket)
    lockedSavingsBalance: 72000.00,
    // 8. Savings approaching maturity (within 30 days)
    savingsApproachingMaturity: 30000.00,
    // 9. Total withdrawals (cumulative completed withdrawals)
    totalWithdrawals: 45000.00,
    // 10. Total transfers (cumulative transfers sent)
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
  loans: {
    appliedLoans: []
  },
  incubator: {
    application: null
  }
};

export function getStoredData() {
  try {
    const raw = localStorage.getItem('rap-platform-data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.balances) return parsed;
    }
  } catch {
    // Ignore local storage parse error
  }
  return initialRapData;
}

export function saveStoredData(data) {
  try {
    localStorage.setItem('rap-platform-data', JSON.stringify(data));
  } catch {
    // Ignore storage quota error
  }
}
