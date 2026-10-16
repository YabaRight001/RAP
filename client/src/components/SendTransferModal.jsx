import React, { useState } from 'react';
import { Icon } from '../icons.jsx';

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Access Bank',
  'Zenith Bank',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Moniepoint MFB',
  'Kuda Bank',
  'OPay Digital Services',
  'PalmPay Limited',
  'Wema Bank',
  'Providus Bank',
  'First City Monument Bank (FCMB)',
  'Stanbic IBTC Bank',
  'Sterling Bank'
];

export function SendTransferModal({ isOpen, onClose, data, onTransferSuccess }) {
  if (!isOpen || !data) return null;

  const { balances } = data;
  const availableBankBalance = balances.availableBankBalance;

  const [bank, setBank] = useState(NIGERIAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [resolving, setResolving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAccountChange = (val) => {
    setAccountNumber(val);
    if (val.length === 10) {
      setResolving(true);
      setTimeout(() => {
        setResolving(false);
        setBeneficiaryName('OLUWATOBI SAMUEL BALOGUN');
      }, 500);
    } else {
      setBeneficiaryName('');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!beneficiaryName) {
      setErrorMsg('Please enter a valid 10-digit account number.');
      return;
    }
    if (Number(amount) <= 0 || Number(amount) > availableBankBalance) {
      setErrorMsg(`Amount must be between ₦100 and ₦${availableBankBalance.toLocaleString()}.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/banking/send-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          destinationBank: bank,
          destinationAccount: accountNumber,
          destinationName: beneficiaryName,
          narration: narration || 'RAP Outgoing Transfer'
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setReceipt(resData.transaction);
        if (onTransferSuccess) onTransferSuccess();
      } else {
        setErrorMsg(resData.error);
      }
    } catch {
      setErrorMsg('Transaction failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Send money</h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: 'var(--mute)' }}
          >
            ✕
          </button>
        </div>

        {!receipt ? (
          <div>
            <p className="note" style={{ fontSize: '14px', marginTop: '4px' }}>
              Available in bank balance: <b>₦{availableBankBalance.toLocaleString()}</b>
            </p>

            <form onSubmit={handleSend} style={{ marginTop: '16px' }}>
              <label>Destination bank</label>
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                {NIGERIAN_BANKS.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>

              <label>Account number</label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value.replace(/\D/g, ''))}
                placeholder="10 digits"
                required
              />

              {resolving && (
                <div className="note" style={{ color: 'var(--blue)', fontWeight: '600' }}>
                  Resolving NIBSS beneficiary...
                </div>
              )}

              {beneficiaryName && (
                <div className="badge" style={{ display: 'block', margin: '8px 0', background: '#e9f9ee', color: '#1fa640', fontWeight: '700' }}>
                  ✓ {beneficiaryName}
                </div>
              )}

              <label>Amount (₦)</label>
              <input
                type="number"
                min="100"
                max={availableBankBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                required
              />

              <label>Narration (optional)</label>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Living expenses / payment"
              />

              {errorMsg && (
                <div className="warn" style={{ color: '#d92d20', marginTop: '12px' }}>
                  {errorMsg}
                </div>
              )}

              <div className="row" style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn line sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || availableBankBalance <= 0}
                  className="btn pri sm"
                >
                  {submitting ? 'Authenticating...' : 'Confirm transfer'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="v g" style={{ fontSize: '32px' }}>
              ₦{receipt.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontWeight: '700', color: 'var(--green)', marginTop: '4px' }}>
              ✓ Transfer Verified &amp; Completed
            </div>
            <p className="note" style={{ marginTop: '6px' }}>
              Sent to {receipt.destinationName} ({receipt.destinationBank})
            </p>

            <div className="card" style={{ background: 'var(--soft)', marginTop: '16px', textAlign: 'left', fontSize: '13px' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="k">Reference:</span>
                <b>{receipt.reference}</b>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: '6px' }}>
                <span className="k">New bank balance:</span>
                <b style={{ color: 'var(--green)' }}>₦{receipt.newBalance.toLocaleString()}</b>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn pri block"
              style={{ marginTop: '18px' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
