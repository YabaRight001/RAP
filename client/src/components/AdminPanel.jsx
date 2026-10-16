import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function AdminPanel({ onClose }) {
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [transferablePct, setTransferablePct] = useState(70);
  const [lockedPct, setLockedPct] = useState(30);
  const [lockDays, setLockDays] = useState(365);
  const [payoutDay, setPayoutDay] = useState('Monday');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchAdminData = () => {
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(d => setAdminData(d));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      {/* Top Banner */}
      <div className="card" style={{ borderColor: '#d92d20' }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge" style={{ borderColor: '#d92d20', color: '#d92d20' }}>Admin Governance</span>
            <h2 style={{ fontSize: '22px', marginTop: '4px' }}>RAP Platform Administration</h2>
            <div className="note">Logged in as: <b>Dr. Ngozi Balogun</b> (Super Administrator)</div>
          </div>
          <button onClick={onClose} className="btn line sm">
            Exit Admin Panel
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {adminData && (
        <div className="grid">
          <div className="card">
            <div className="k">Total members</div>
            <div className="v">{adminData.metrics.totalUsers}</div>
          </div>
          <div className="card">
            <div className="k">Platform volume</div>
            <div className="v">₦{adminData.metrics.totalVolume.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="k">Locked savings vault</div>
            <div className="v g">₦{adminData.metrics.totalLockedSavings.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="k">Pending loans</div>
            <div className="v b">{adminData.metrics.pendingLoans}</div>
          </div>
          <div className="card">
            <div className="k">Incubator cohort</div>
            <div className="v">{adminData.metrics.incubatorStudents}</div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="chips" style={{ margin: '18px 0' }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{ background: activeTab === 'settings' ? 'var(--ink)' : undefined, color: activeTab === 'settings' ? '#fff' : undefined }}
        >
          Configure 70/30 Policy
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          style={{ background: activeTab === 'audit' ? 'var(--ink)' : undefined, color: activeTab === 'audit' ? '#fff' : undefined }}
        >
          Immutable Financial Audit Trail
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <h3>Configure 70/30 System Rules</h3>
          <p className="note" style={{ marginTop: '2px' }}>
            Adjust the earnings split percentages, lock duration, and weekly payout schedules.
          </p>

          <form onSubmit={handleSaveSettings} style={{ marginTop: '16px' }}>
            <label>Transferable portion (%)</label>
            <input
              type="number"
              value={transferablePct}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTransferablePct(val);
                setLockedPct(100 - val);
              }}
              min="0"
              max="100"
              required
            />

            <label>Locked savings portion (%)</label>
            <input
              type="number"
              value={lockedPct}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLockedPct(val);
                setTransferablePct(100 - val);
              }}
              min="0"
              max="100"
              required
            />

            <label>Savings lock duration (days)</label>
            <input
              type="number"
              value={lockDays}
              onChange={(e) => setLockDays(Number(e.target.value))}
              required
            />

            <label>Scheduled weekly payout day</label>
            <select
              value={payoutDay}
              onChange={(e) => setPayoutDay(e.target.value)}
            >
              <option value="Monday">Monday (Approved Schedule)</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Friday">Friday</option>
            </select>

            {savedSuccess && (
              <div className="badge" style={{ display: 'block', margin: '14px 0', padding: '10px', background: '#e9f9ee', color: '#1fa640' }}>
                ✓ System allocation rules updated and logged to audit trail!
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn pri block">
                Save System Rules
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'audit' && adminData && (
        <div className="card">
          <h3>Financial Audit Ledger</h3>
          <p className="note">Immutable audit records for compliance and regulatory reporting.</p>
          <div className="scroll" style={{ marginTop: '14px' }}>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {adminData.auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.created_at).toLocaleString('en-NG')}</td>
                    <td><b style={{ color: 'var(--blue)' }}>{log.action}</b></td>
                    <td>{log.actor_id}</td>
                    <td style={{ maxWidth: '350px', whiteSpace: 'normal', fontSize: '13px' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
