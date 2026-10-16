import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function StatementModal({ isOpen, onClose, data }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/banking/transactions')
        .then(res => res.json())
        .then(d => setTransactions(d));
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;
  const { partnerBank, balances } = data;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
          <div className="row" style={{ gap: '10px' }}>
            <img src="/img/logo.png" alt="RAP" style={{ height: '32px' }} />
            <div>
              <h3 style={{ fontSize: '17px' }}>Account Statement</h3>
              <div className="note">{partnerBank.partnerBankName}</div>
            </div>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="btn pri sm"
            >
              Print / PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: 'var(--mute)' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Account Details Header */}
        <div className="grid4" style={{ marginTop: '16px', fontSize: '13px' }}>
          <div>
            <span className="k">Account name:</span>
            <div><b>{partnerBank.accountName}</b></div>
          </div>
          <div>
            <span className="k">Account number:</span>
            <div><b>{partnerBank.accountNumber}</b></div>
          </div>
          <div>
            <span className="k">Period:</span>
            <div>Last 30 Days</div>
          </div>
          <div>
            <span className="k">Closing balance:</span>
            <div style={{ color: 'var(--green)', fontWeight: '800' }}>₦{balances.actualBankBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="scroll" style={{ marginTop: '18px' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Narration</th>
                <th>Amount (₦)</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString('en-NG')}</td>
                  <td><b>{tx.narration || tx.type}</b></td>
                  <td style={{ fontWeight: '700', color: tx.type === 'deposit' || tx.type === 'transfer_in' ? 'var(--green)' : 'var(--ink)' }}>
                    {tx.type === 'deposit' || tx.type === 'transfer_in' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </td>
                  <td>₦{tx.balance_after?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row" style={{ marginTop: '18px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn line sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
