import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function AffiliateTab({ data, onCreditCommission, onReachMilestone, setActiveTab }) {
  const [loanAmount, setLoanAmount] = useState('250000');
  const [loanPurpose, setLoanPurpose] = useState('Working capital for inventory');
  const [businessName, setBusinessName] = useState('Adebayo Digital Fashion Store');
  const [businessIdea, setBusinessIdea] = useState('Direct clothing pre-orders and bulk distribution in Lagos');
  const [businessSector, setBusinessSector] = useState('Fashion');
  const [appliedLoans, setAppliedLoans] = useState([]);
  const [incubatorData, setIncubatorData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [simulating, setSimulating] = useState(false);

  if (!data) return null;
  const { user, affiliateStats } = data;
  const isUnlocked = affiliateStats.qualifyingAffiliates >= 25;

  const loadData = () => {
    fetch('/api/loans/user-applications')
      .then(res => res.json())
      .then(l => setAppliedLoans(l || []));

    fetch('/api/incubator/status')
      .then(res => res.json())
      .then(i => setIncubatorData(i?.application || null));
  };

  useEffect(() => {
    loadData();
  }, [isUnlocked]);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const res = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedAmount: Number(loanAmount),
          purpose: loanPurpose,
          businessName
        })
      });
      const d = await res.json();
      if (d.success) {
        setFeedback({ type: 'success', text: 'Loan application submitted for credit assessment!' });
        loadData();
      } else {
        setFeedback({ type: 'error', text: d.error });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network request failed' });
    }
  };

  const handleApplyIncubator = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const res = await fetch('/api/incubator/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessIdea,
          sector: businessSector,
          fundingRequirement: 1500000
        })
      });
      const d = await res.json();
      if (d.success) {
        setFeedback({ type: 'success', text: 'Incubator application submitted! Mentor assigned.' });
        loadData();
      } else {
        setFeedback({ type: 'error', text: d.error });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network request failed' });
    }
  };

  const handleSimulate100k = async () => {
    setSimulating(true);
    await onCreditCommission(100000);
    setSimulating(false);
  };

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div className="eyebrow">Your RAP growth journey</div>
          <h2>{user.membershipTier}</h2>
        </div>
        <button
          onClick={handleSimulate100k}
          disabled={simulating}
          className="btn pri sm"
        >
          {simulating ? 'Processing...' : '⚡ Simulate ₦100k Commission'}
        </button>
      </div>

      {feedback && (
        <div className={feedback.type === 'success' ? 'badge' : 'warn'} style={{ display: 'block', marginBottom: '14px', padding: '12px 16px', background: feedback.type === 'success' ? '#e9f9ee' : undefined, color: feedback.type === 'success' ? '#1fa640' : undefined }}>
          {feedback.text}
        </div>
      )}

      {/* Growth Progress Card */}
      <div className="card">
        <div className="bar-p">
          <i style={{ width: `${affiliateStats.percentProgress}%` }}></i>
        </div>
        <p className="note" style={{ fontSize: '13.5px' }}>
          Qualifying affiliates: <b>{affiliateStats.qualifyingAffiliates}/{affiliateStats.threshold}</b> · Remaining: {affiliateStats.remainingAffiliates} · {affiliateStats.percentProgress}%<br />
          Next milestone: <b>RAP Growth Partner</b> · Loan: <b>{isUnlocked ? 'Unlocked' : 'Locked'}</b> · Incubation: <b>{isUnlocked ? 'Unlocked' : 'Locked'}</b>
        </p>

        <div className="row" style={{ marginTop: '14px' }}>
          <button
            onClick={() => setActiveTab('refer')}
            className="btn line sm"
          >
            Get my referral link
          </button>
          {!isUnlocked && (
            <button
              onClick={onReachMilestone}
              className="btn pri sm"
            >
              Simulate 25 Affiliates Milestone
            </button>
          )}
        </div>
      </div>

      {/* Grid: Loan Opportunity & Business Incubator */}
      <div className="grid4" style={{ alignItems: 'start', marginTop: '16px' }}>
        {/* Loan Opportunity Card */}
        <div className="card">
          <h3>Loan opportunity</h3>
          {isUnlocked ? (
            <form onSubmit={handleApplyLoan} style={{ marginTop: '10px' }}>
              <p className="note" style={{ fontSize: '13.5px' }}>
                Milestone complete. This unlocks an <b>assessment</b>, not a guaranteed loan. Subsidized youth rate is 5% p.a.
              </p>

              {appliedLoans.map((l) => (
                <div key={l.id} className="card" style={{ background: 'var(--soft)', padding: '10px 14px', margin: '8px 0' }}>
                  <b>₦{l.requested_amount.toLocaleString()}</b> · <span className={`st ${l.status}`}>{l.status.replace('_', ' ')}</span>
                  <div className="note">{l.business_name} ({l.tenure_months} Mo)</div>
                </div>
              ))}

              <label>Amount (₦)</label>
              <input
                type="number"
                min="50000"
                max="500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />

              <label>Purpose</label>
              <input
                type="text"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                required
              />

              <div style={{ marginTop: '16px' }}>
                <button type="submit" className="btn pri block">
                  Apply for a loan
                </button>
              </div>
            </form>
          ) : (
            <div className="warn" style={{ marginTop: '10px' }}>
              Locked. {affiliateStats.remainingAffiliates} more qualifying affiliates to go.
            </div>
          )}
          <p className="note" style={{ marginTop: '12px' }}>
            Decisions are made by an authorised lender or administrator. Funding is never promised.
          </p>
        </div>

        {/* Business Incubator Card */}
        <div className="card">
          <h3>Business incubator</h3>
          {isUnlocked ? (
            incubatorData ? (
              <div style={{ marginTop: '10px' }}>
                <div className="card" style={{ background: 'var(--soft)' }}>
                  <b>{incubatorData.business_name}</b> · <span className={`st ${incubatorData.status}`}>{incubatorData.status}</span>
                  <div className="note" style={{ marginTop: '4px' }}>
                    Stage 1: Discovery · Sector: {incubatorData.sector}
                  </div>
                  <div className="note" style={{ marginTop: '2px' }}>
                    Assigned Mentor: <b>Engr. Babajide Williams</b>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyIncubator} style={{ marginTop: '10px' }}>
                <label>Business name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />

                <label>Business idea</label>
                <textarea
                  rows="3"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  required
                ></textarea>

                <label>Sector</label>
                <select
                  value={businessSector}
                  onChange={(e) => setBusinessSector(e.target.value)}
                >
                  <option value="Agriculture">Agriculture</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Tech">Tech</option>
                  <option value="Services">Services</option>
                </select>

                <div style={{ marginTop: '16px' }}>
                  <button type="submit" className="btn pri block">
                    Apply to the incubator
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="warn" style={{ marginTop: '10px' }}>
              Locked until you reach {affiliateStats.threshold} qualifying affiliates.
            </div>
          )}
        </div>
      </div>

      {/* Workforce Training / Learn Card */}
      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Workforce Training &amp; Learn</h3>
        <p className="note" style={{ fontSize: '13.5px', marginTop: '4px' }}>
          Interactive modules provided under the youth empowerment curriculum:
        </p>
        <div className="grid4" style={{ marginTop: '12px' }}>
          <div className="card" style={{ background: 'var(--soft)' }}>
            <b>Financial Modeling &amp; Taxes</b>
            <div className="note">4 Modules • Completed (100%)</div>
            <span className="badge" style={{ marginTop: '8px', color: 'var(--green)' }}>✓ Certified</span>
          </div>
          <div className="card" style={{ background: 'var(--soft)' }}>
            <b>WhatsApp &amp; Digital Commerce</b>
            <div className="note">6 Modules • In progress (65%)</div>
          </div>
          <div className="card" style={{ background: 'var(--soft)' }}>
            <b>B2B Supply Chain in Lagos</b>
            <div className="note">5 Modules • In progress (20%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
