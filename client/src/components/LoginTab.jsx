import React, { useState } from 'react';
import { Icon } from '../icons.jsx';

export function LoginTab({ data, isAdmin, setIsAdmin, setActiveTab, isLoggedIn, setIsLoggedIn }) {
  const [mode, setMode] = useState(isLoggedIn ? 'profile' : 'signin'); // 'profile', 'signin', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [message, setMessage] = useState(null);

  if (!data) return null;
  const { user } = data;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (setIsLoggedIn) setIsLoggedIn(true);
    setMessage({ type: 'success', text: `Welcome back, ${user.fullName}!` });
    if (window.confetti) window.confetti({ particleCount: 80, spread: 70 });
    setTimeout(() => {
      setMessage(null);
      setMode('profile');
      setActiveTab('home');
    }, 1200);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (setIsLoggedIn) setIsLoggedIn(true);
    setMessage({ type: 'success', text: 'Registration completed! Account is verified.' });
    if (window.confetti) window.confetti({ particleCount: 100, spread: 70 });
    setTimeout(() => {
      setMessage(null);
      setMode('profile');
      setActiveTab('home');
    }, 1200);
  };

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      {mode === 'profile' ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="eyebrow">User profile &amp; security</div>
          <h2>My Account Profile</h2>
          <p className="sub">Manage credentials, review identity status, or switch into system administration.</p>

          <div className="card">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px' }}>{user.fullName}</h3>
                <div className="note" style={{ marginTop: '2px', fontFamily: 'monospace' }}>
                  {user.email} · {user.phone}
                </div>
              </div>
              <div>
                <span className="badge" style={{ color: 'var(--green)', borderColor: 'var(--green)' }}>
                  {user.membershipTier}
                </span>
                <span className="badge">
                  KYC Level {user.kycLevel}
                </span>
              </div>
            </div>

            <div className="row" style={{ marginTop: '16px', gap: '8px' }}>
              <button
                onClick={() => {
                  if (setIsLoggedIn) setIsLoggedIn(false);
                  setMode('signin');
                }}
                className="btn line sm"
                style={{ color: '#d92d20', borderColor: '#fca5a5' }}
              >
                Sign Out
              </button>
              <button
                onClick={() => setMode('signin')}
                className="btn line sm"
              >
                Switch Account
              </button>
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="btn pri sm"
                style={{ background: isAdmin ? '#d92d20' : undefined }}
              >
                {isAdmin ? 'Exit Administrator Mode' : 'Open Admin Governance'}
              </button>
            </div>
          </div>

          {/* Compliance & Status Info */}
          <div className="grid">
            <div className="card">
              <div className="k">Email status</div>
              <div className="v g" style={{ fontSize: '18px' }}>✓ Verified</div>
              <div className="note">Confirmed via 6-digit OTP</div>
            </div>
            <div className="card">
              <div className="k">Phone status</div>
              <div className="v g" style={{ fontSize: '18px' }}>✓ Verified</div>
              <div className="note">Nigerian SMS OTP confirmed</div>
            </div>
            <div className="card">
              <div className="k">NIBSS BVN/NIN</div>
              <div className="v g" style={{ fontSize: '18px' }}>✓ Matched</div>
              <div className="note">National identity verified</div>
            </div>
          </div>

          <br />

          {/* Login History */}
          <div className="card">
            <h3>Recent login history</h3>
            <div className="scroll" style={{ marginTop: '10px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>IP Location</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Chrome on Linux</b></td>
                    <td>127.0.0.1 (Lagos Gateway)</td>
                    <td>Active now</td>
                    <td className="st active">Current session</td>
                  </tr>
                  <tr>
                    <td><b>Safari on iPhone 15</b></td>
                    <td>102.89.44.12 (MTN Nigeria)</td>
                    <td>Yesterday 18:42</td>
                    <td className="st completed">Completed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Sign In / Register Marketplace View */
        <div className="authgrid">
          <div className="card" style={{ margin: 0 }}>
            {/* Segmented Controller */}
            <div className="seg">
              <button
                className={mode === 'signin' ? 'on' : ''}
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
              <button
                className={mode === 'register' ? 'on' : ''}
                onClick={() => setMode('register')}
              >
                Create account
              </button>
            </div>

            {message && (
              <div className="badge" style={{ display: 'block', margin: '10px 0', padding: '10px', background: '#e9f9ee', color: '#1fa640', width: '100%' }}>
                {message.text}
              </div>
            )}

            {mode === 'signin' ? (
              <form onSubmit={handleSignIn}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adebayo@riseandprosper.ng"
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <div style={{ marginTop: '20px' }}>
                  <button type="submit" className="btn pri block">
                    Sign in
                  </button>
                </div>

                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setMode('profile')}
                    className="note"
                    style={{ background: 'transparent', border: 0, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Return to active profile
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <p className="note">
                  This creates a RAP membership account. A bank account is a separate step through our banking partner.
                </p>

                <label>Full name (exactly as on your NIN)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Chukwuemeka Adebayo"
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@riseandprosper.ng"
                  required
                />

                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  required
                />

                <label>Password (8+ characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <label>Referral code (optional)</label>
                <input
                  type="text"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  placeholder="RAP-EMEK98"
                />

                <div style={{ marginTop: '20px' }}>
                  <button type="submit" className="btn pri block">
                    Register now
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Official Promotional Flyer */}
          <div>
            <img
              src="/img/flyer-2.jpg"
              alt="Create a RAP account today"
              style={{
                borderRadius: '22px',
                maxWidth: '380px',
                display: 'block',
                margin: '0 auto',
                boxShadow: 'var(--sh-lg)',
                border: '1px solid var(--line)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
