import React, { useState } from 'react';
import { Icon } from '../icons.jsx';

export function ReferTab({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;
  const { user, affiliateStats } = data;
  const referralLink = `https://riseandprosper.ng/join?ref=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const msg = encodeURIComponent(`Join me on RAP: bank that helps you prosper. ${referralLink}`);

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      <div className="eyebrow">Refer &amp; earn</div>
      <h2>Invite friends to RAP</h2>
      <p className="sub">
        Share your link. People who register, verify and get approved count as qualifying affiliates.
      </p>

      {/* Referral Link & WhatsApp Share Card */}
      <div className="card">
        <div className="k">Your referral link</div>
        <div className="row" style={{ marginTop: '8px' }}>
          <input
            readOnly
            value={referralLink}
            style={{ flex: 1, minWidth: '220px', fontFamily: 'monospace', fontWeight: '600' }}
          />
          <button onClick={copyLink} className="btn">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <div className="row" style={{ marginTop: '12px' }}>
          <a
            className="btn pri"
            href={`https://wa.me/?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid">
        <div className="card">
          <div className="k">Total referrals</div>
          <div className="v">{affiliateStats.totalReferrals}</div>
        </div>
        <div className="card">
          <div className="k">Qualifying</div>
          <div className="v g">{affiliateStats.qualifyingAffiliates} / {affiliateStats.threshold}</div>
        </div>
        <div className="card">
          <div className="k">Remaining</div>
          <div className="v">{affiliateStats.remainingAffiliates}</div>
        </div>
      </div>

      <br />

      {/* Progress Card */}
      <div className="card">
        <h3>Your progress</h3>
        <div className="bar-p">
          <i style={{ width: `${affiliateStats.percentProgress}%` }}></i>
        </div>
        <p className="note" style={{ fontSize: '13.5px' }}>
          Qualifying affiliates: <b>{affiliateStats.qualifyingAffiliates}/{affiliateStats.threshold}</b> · Remaining: {affiliateStats.remainingAffiliates} · {affiliateStats.percentProgress}%<br />
          Next milestone: <b>RAP Growth Partner</b> · Loan: <b>{affiliateStats.isUnlocked ? 'Unlocked' : 'Locked'}</b> · Incubation: <b>{affiliateStats.isUnlocked ? 'Unlocked' : 'Locked'}</b>
        </p>
      </div>

      {/* What Counts as Qualifying Card */}
      <div className="card">
        <h3>What counts as qualifying?</h3>
        <ul className="steps">
          <li>Registered with your link or code ({user.referralCode})</li>
          <li>Email address and phone number verified with OTP</li>
          <li>Level 2 identity check completed (BVN/NIN match)</li>
          <li>Approved as an active affiliate</li>
        </ul>
      </div>
    </div>
  );
}
