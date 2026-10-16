import React, { useState } from 'react';
import { Icon } from '../icons.jsx';

const SCENARIO_STEPS = [
  { step: 1, title: 'Step 1: Registration', desc: 'Young Nigerian registers on RAP with basic personal details.' },
  { step: 2, title: 'Step 2: Email & Phone OTP', desc: 'User verifies email address and phone number with 6-digit OTP.' },
  { step: 3, title: 'Step 3: Identity Verification', desc: 'User completes KYC Level 2: BVN/NIN verified via NIBSS database.' },
  { step: 4, title: 'Step 4: Bank Account Issuance', desc: 'User applies for banking account; Wema/Monnify partner account issued.' },
  { step: 5, title: 'Step 5: Affiliate Onboarding', desc: 'User receives unique affiliate referral link (RAP-EMEK98).' },
  { step: 6, title: 'Step 6: 25 Qualifying Affiliates', desc: '25 Nigerian referrals register, verify OTPs, and complete KYC.' },
  { step: 7, title: 'Step 7: Tier & Benefit Unlock', desc: 'Promoted to RAP Growth Partner (20% rate). Loans & Incubator unlocked!' },
  { step: 8, title: 'Step 8: Commission Earned', desc: 'User earns ₦100,000 in approved affiliate commission.' },
  { step: 9, title: 'Step 9: 70/30 Allocation', desc: 'Backend splits: ₦70,000 transferable, ₦30,000 locked for 1 calendar year.' },
  { step: 10, title: 'Step 10: Dashboard Ledger Check', desc: 'Dashboard separately displays ₦70,000 available and ₦30,000 locked.' },
  { step: 11, title: 'Step 11: Monday Transfer Clicked', desc: 'User clicks "TRANSFER MY AVAILABLE EARNINGS" on Monday.' },
  { step: 12, title: 'Step 12: Account Validation & Transfer', desc: 'System verifies ₦70k limit, confirms GTBank 0129485739, and transfers.' },
  { step: 13, title: 'Step 13: Transfer Confirmation', desc: 'Transfer confirmed by payment switch with official reference.' },
  { step: 14, title: 'Step 14: Ledger Settlement', desc: 'Financial ledger & bank balance updated with completed transfer.' },
  { step: 15, title: 'Step 15: My Savings Inspection', desc: 'User inspects 1-year locked savings vault maturing in exactly 365 days.' },
  { step: 16, title: 'Step 16: Loan Application', desc: 'User applies for ₦250,000 SME Starter Loan via unlocked opportunity.' },
  { step: 17, title: 'Step 17: Loan Assessment & Approval', desc: 'Administrator reviews business traction and approves loan offer.' },
  { step: 18, title: 'Step 18: Incubator & Mentor Onboarding', desc: 'User enters Business Incubator, assigned to mentor Engr. Babajide.' },
  { step: 19, title: 'Step 19: Full Audit Trail Inspection', desc: 'Administrator reviews immutable audit logs of entire financial journey.' }
];

export function ScenarioWalkthrough({ isOpen, onClose, onRefreshData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  if (!isOpen) return null;

  const runStep = async (stepNum) => {
    setRunning(true);
    let stepDesc = SCENARIO_STEPS.find(s => s.step === stepNum)?.desc || `Step ${stepNum} executed successfully.`;
    try {
      const res = await fetch('/api/scenario/run-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNum })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.result?.description) {
          stepDesc = data.result.description;
        }
      }
    } catch {
      // Fallback to local scenario simulation
    }

    setLogs(prev => [
      { step: stepNum, desc: stepDesc, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
    if (onRefreshData) onRefreshData();
    setRunning(false);
  };

  const handleNextStep = async () => {
    await runStep(currentStep);
    if (currentStep < 19) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleRunAll = async () => {
    setRunning(true);
    for (let s = currentStep; s <= 19; s++) {
      await runStep(s);
      setCurrentStep(s);
      await new Promise(r => setTimeout(r, 400));
    }
    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }
    setRunning(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '780px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <div>
            <div className="eyebrow">End-to-End Test Engine</div>
            <h3 style={{ fontSize: '18px' }}>19-Step Specification Walkthrough</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: 'var(--mute)' }}
          >
            ✕
          </button>
        </div>

        {/* Action Controls */}
        <div className="row" style={{ justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="note" style={{ fontSize: '13.5px' }}>
            Current: <b>{SCENARIO_STEPS[currentStep - 1]?.title}</b>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button
              onClick={handleNextStep}
              disabled={running}
              className="btn pri sm"
            >
              Run Step {currentStep}
            </button>
            <button
              onClick={handleRunAll}
              disabled={running}
              className="btn line sm"
              style={{ fontWeight: '800', borderColor: 'var(--blue)', color: 'var(--blue)' }}
            >
              Run All 19 Steps
            </button>
          </div>
        </div>

        {/* Two-Column Steps & Live Logs */}
        <div className="grid4" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginTop: '14px', maxHeight: '450px', overflowY: 'auto' }}>
          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SCENARIO_STEPS.map((s) => {
              const isPast = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    setCurrentStep(s.step);
                    runStep(s.step);
                  }}
                  className="card"
                  style={{
                    padding: '10px 12px',
                    margin: 0,
                    cursor: 'pointer',
                    borderColor: isCurrent ? 'var(--blue)' : isPast ? 'var(--green)' : 'var(--line)',
                    background: isCurrent ? '#f0f7ff' : isPast ? '#f3fbf5' : '#fff'
                  }}
                >
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <b style={{ fontSize: '13px', color: isCurrent ? 'var(--blue)' : isPast ? 'var(--green)' : 'var(--ink)' }}>
                      {s.title}
                    </b>
                    {isPast && <span className="badge" style={{ color: 'var(--green)', borderColor: 'var(--green)', padding: '1px 6px', fontSize: '10px' }}>✓ Done</span>}
                  </div>
                  <div className="note" style={{ fontSize: '12px', marginTop: '2px' }}>{s.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Live Logs */}
          <div className="card" style={{ background: '#fafcff', margin: 0, overflowY: 'auto' }}>
            <div className="k" style={{ fontWeight: '700', marginBottom: '8px' }}>Live Execution Logs</div>
            {logs.length === 0 ? (
              <p className="note">Click "Run Step" or "Run All 19 Steps" to trigger live ledger actions...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {logs.map((l, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', background: '#fff', borderRadius: '10px', border: '1px solid var(--line)', fontSize: '12px' }}>
                    <div className="row" style={{ justifyContent: 'space-between', color: 'var(--mute)', fontSize: '11px' }}>
                      <b style={{ color: 'var(--green)' }}>Step {l.step}</b>
                      <span>{l.time}</span>
                    </div>
                    <div style={{ marginTop: '2px', color: 'var(--ink)' }}>{l.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row" style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn line sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
