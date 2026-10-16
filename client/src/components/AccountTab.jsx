import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function AccountTab({ data, onOpenMondayTransfer, onOpenSendTransfer, onOpenStatement }) {
  const [savingsList, setSavingsList] = useState([]);
  const [transfersList, setTransfersList] = useState([]);
  const [tryWithdrawModal, setTryWithdrawModal] = useState(false);
  const [kycModal, setKycModal] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  useEffect(() => {
    fetch('/api/savings/allocations')
      .then(res => res.json())
      .then(d => setSavingsList(d.allocations || []));

    fetch('/api/banking/transactions')
      .then(res => res.json())
      .then(d => setTransfersList(d || []));
  }, []);

  if (!data) return null;
  const { user, partnerBank, balances } = data;

  const copyAccount = () => {
    navigator.clipboard.writeText(partnerBank.accountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      {/* Top Earn Card */}
      <div className="earn">
        <div className="k">Hello {user.fullName}</div>
        <div style={{ marginTop: '4px' }}>
          <span className="badge">{user.membershipTier}</span>
          <span className="badge">{user.status.toUpperCase()}</span>
          <span className="badge">KYC Level {user.kycLevel} Verified</span>
        </div>

        <div className="v" style={{ marginTop: '12px' }}>
          ₦{balances.totalAffiliateIncomeEarned.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </div>
        <div className="k">Total eligible earnings</div>

        <div className="split3">
          <i style={{ width: '70%', background: '#1d7be8' }}></i>
          <i style={{ width: '30%', background: '#1fa640' }}></i>
        </div>
        <div className="note">
          70% available to transfer (₦{balances.earningsAvailableForTransfer.toLocaleString()}) · 30% locked savings (₦{balances.lockedSavingsBalance.toLocaleString()})
        </div>
      </div>

      {/* Verified Partner Banking Account Card */}
      <div className="card" style={{ borderColor: 'var(--green)' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--green)' }}>Authorized Partner Bank Account</div>
            <h3 style={{ fontSize: '20px' }}>{partnerBank.partnerBankName}</h3>
            <p className="note" style={{ marginTop: '2px' }}>
              Account Name: <b>{partnerBank.accountName}</b>
            </p>
          </div>
          <span className="badge" style={{ borderColor: 'var(--green)', color: 'var(--green)', fontWeight: '800' }}>
            NIBSS Active
          </span>
        </div>

        <div className="row" style={{ marginTop: '14px', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {partnerBank.accountNumber}
          </div>
          <button
            onClick={copyAccount}
            className="btn line sm"
            style={{ padding: '6px 12px' }}
          >
            {copiedAcc ? '✓ Copied' : 'Copy Number'}
          </button>
        </div>

        <div className="row" style={{ marginTop: '16px', gap: '8px' }}>
          <button onClick={onOpenSendTransfer} className="btn pri sm">
            Send Money
          </button>
          <button onClick={onOpenStatement} className="btn line sm">
            Download Statement
          </button>
          <button onClick={() => setKycModal(true)} className="btn line sm">
            KYC Documents
          </button>
        </div>
      </div>

      {/* Financial Balances Grid */}
      <div className="grid">
        <div className="card">
          <div className="k">Bank balance</div>
          <div className="v">₦{balances.actualBankBalance.toLocaleString()}</div>
          <div className="note">Shown once a banking partner account exists.</div>
        </div>

        <div className="card">
          <div className="k">Available to transfer</div>
          <div className="v b">₦{balances.earningsAvailableForTransfer.toLocaleString()}</div>
          <div className="note">70% of eligible earnings</div>
        </div>

        <div className="card">
          <div className="k">Locked savings</div>
          <div className="v g">₦{balances.lockedSavingsBalance.toLocaleString()}</div>
          <div className="note">One-year savings rule</div>
        </div>

        <div className="card">
          <div className="k">Saved this month</div>
          <div className="v">₦{(12000).toLocaleString()}</div>
          <div className="note">Credited within current month</div>
        </div>

        <div className="card">
          <div className="k">Total withdrawn</div>
          <div className="v">₦{balances.totalWithdrawals.toLocaleString()}</div>
          <div className="note">Completed transfers only</div>
        </div>
      </div>

      <br />

      {/* Monday Transfer Button Card */}
      <div className="card">
        <button
          onClick={onOpenMondayTransfer}
          className="btn pri block"
          disabled={balances.earningsAvailableForTransfer <= 0}
        >
          TRANSFER MY AVAILABLE EARNINGS
        </button>
        <p className="note" style={{ textAlign: 'center', marginTop: '10px' }}>
          70% of your eligible affiliate income is available for transfer. The remaining 30% is reserved as one-year locked savings.
        </p>
      </div>

      {/* My Savings Table Card */}
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <h3>My savings</h3>
            <p className="note" style={{ marginTop: '2px' }}>
              Each allocation has its own maturity date. Matured funds are released through your savings partner.
            </p>
          </div>
          <button
            onClick={() => setTryWithdrawModal(true)}
            className="btn line sm"
          >
            Try to withdraw savings
          </button>
        </div>

        {savingsList.length ? (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Credited Date</th>
                  <th>Amount (₦)</th>
                  <th>1-Year Maturity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {savingsList.map((x) => (
                  <tr key={x.id}>
                    <td>{new Date(x.credit_date).toLocaleDateString('en-NG')}</td>
                    <td style={{ fontWeight: '700' }}>₦{x.amount.toLocaleString()}</td>
                    <td>{new Date(x.maturity_date).toLocaleDateString('en-NG')}</td>
                    <td className={`st ${x.status}`}>{x.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="note">No savings yet. They appear when a commission is approved.</p>
        )}
      </div>

      {/* Transfers History Card */}
      <div className="card">
        <h3>Transfers</h3>
        {transfersList.length ? (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Narration / Bank</th>
                  <th>Amount (₦)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transfersList.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.created_at).toLocaleDateString('en-NG')}</td>
                    <td>{t.narration || t.beneficiary_bank}</td>
                    <td style={{ fontWeight: '700' }}>₦{t.amount.toLocaleString()}</td>
                    <td className={`st ${t.status}`}>{t.status === 'pending' ? 'Processing' : t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="note">No transfers yet.</p>
        )}
      </div>

      {/* Try to Withdraw Savings Modal (Enforces 1-Year Restriction) */}
      {tryWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: 'var(--warn)' }}>Savings are locked for 1 year</h3>
            <p className="note" style={{ fontSize: '14px', marginTop: '10px', lineHeight: '1.6' }}>
              Under the RAP 70/30 wealth creation rule, your 30% savings portion cannot be prematurely withdrawn before its individual 365-day maturity date.
            </p>
            <div className="warn" style={{ marginTop: '14px' }}>
              🔒 <b>Backend Security Enforcement</b>: The API prevents early liquidation to ensure long-term prosperity. Your oldest allocation matures on <b>Jan 05, 2027</b>.
            </div>
            <div className="row" style={{ marginTop: '18px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setTryWithdrawModal(false)}
                className="btn pri sm"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Modal */}
      {kycModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Identity Verification (KYC)</h3>
            <p className="note" style={{ fontSize: '13.5px', marginTop: '6px' }}>
              Central Bank of Nigeria compliance. Your Level 2 verification is already approved via NIBSS.
            </p>
            <div className="card" style={{ marginTop: '12px', background: 'var(--soft)' }}>
              <div><b>BVN:</b> 222•••••588 (Matched)</div>
              <div style={{ marginTop: '4px' }}><b>NIN:</b> 198•••••521 (Verified)</div>
              <div style={{ marginTop: '4px' }}><b>Compliance Tier:</b> Tier 2 (₦5,000,000 limit)</div>
            </div>
            <div className="row" style={{ marginTop: '18px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setKycModal(false)}
                className="btn pri sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
