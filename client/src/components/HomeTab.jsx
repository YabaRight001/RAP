import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../icons.jsx';

export function HomeTab({
  data,
  isLoggedIn,
  setIsLoggedIn,
  onOpenMondayTransfer,
  onOpenSendTransfer,
  onReachMilestone,
  setActiveTab
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const trackRef = useRef(null);

  // 3 Official Flyers: including the new "Earn with RAP Bank" flyer uploaded by user
  const flyers = [
    {
      src: '/img/flyer-3.jpg',
      alt: 'Earn with RAP Bank — Learn in-demand skills, Get real opportunities, Earn with RAP Bank',
      tag: 'Skills & Earning'
    },
    {
      src: '/img/flyer-2.jpg',
      alt: 'Create a RAP account today — Youth empowerment',
      tag: 'Youth Banking'
    },
    {
      src: '/img/flyer-1.jpg',
      alt: 'Bank that helps you prosper — 70/30 Wealth Creation Formula',
      tag: 'Wealth Building'
    }
  ];

  // Auto scroll carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % flyers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [flyers.length]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: carouselIndex * trackRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [carouselIndex]);

  if (!data) return <div className="wrap sec"><p className="note">Loading RAP Bank...</p></div>;

  const { user, partnerBank, balances, affiliateStats } = data;

  const quickActions = [
    {
      id: 'transfer',
      label: 'Send Transfer',
      icon: 'send',
      color: '#1d7be8',
      bg: 'rgba(29, 123, 232, 0.12)',
      onClick: onOpenSendTransfer
    },
    {
      id: 'skills',
      label: 'Tech Skills',
      icon: 'skills',
      color: '#1fa640',
      bg: 'rgba(31, 166, 64, 0.12)',
      onClick: () => setActiveTab('skills')
    },
    {
      id: 'savings',
      label: '30% Savings',
      icon: 'lock',
      color: '#a15c07',
      bg: 'rgba(245, 158, 11, 0.14)',
      onClick: onOpenMondayTransfer
    },
    {
      id: 'affiliate',
      label: 'Affiliate (70%)',
      icon: 'trending-up',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
      onClick: () => setActiveTab('affiliate')
    },
    {
      id: 'refer',
      label: 'Refer & Earn',
      icon: 'refer',
      color: '#0ea5e9',
      bg: 'rgba(14, 165, 233, 0.12)',
      onClick: () => setActiveTab('refer')
    }
  ];

  const feats = [
    {
      title: "Bank Account for Youth",
      desc: "Instant NIBSS-connected partner account for transfers and daily banking.",
      icon: "bank"
    },
    {
      title: "In-Demand Tech Skills",
      desc: "Gain coding, AI, UI/UX, and personal development workforce training.",
      icon: "skills"
    },
    {
      title: "70/30 Wealth Engine",
      desc: "70% affiliate commissions available today; 30% locked in 1-year wealth savings.",
      icon: "trending-up"
    },
    {
      title: "Incubator Capital",
      desc: "Reach 25 qualifying affiliates to unlock startup grants and venture incubation.",
      icon: "sparkles"
    }
  ];

  return (
    <div className="wrap" style={{ paddingTop: '16px' }}>
      {/* 1. SWITCHING BANNERS FIRST (User Requirement: The first thing they see!) */}
      <section style={{ marginBottom: '20px' }}>
        <div className="car" style={{ maxWidth: '100%', borderRadius: '20px', position: 'relative' }}>
          <div className="track" ref={trackRef}>
            {flyers.map((f, idx) => (
              <a
                key={idx}
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  if (idx === 0) setActiveTab('skills');
                  else if (idx === 1) setActiveTab(isLoggedIn ? 'home' : 'login');
                  else setActiveTab('affiliate');
                }}
                style={{ position: 'relative' }}
              >
                <img
                  src={f.src}
                  alt={f.alt}
                  style={{
                    width: '100%',
                    maxHeight: '380px',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block'
                  }}
                />
              </a>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            className="cbtn p"
            aria-label="Previous Banner"
            onClick={() => setCarouselIndex((prev) => (prev === 0 ? flyers.length - 1 : prev - 1))}
          >
            ‹
          </button>
          <button
            className="cbtn n"
            aria-label="Next Banner"
            onClick={() => setCarouselIndex((prev) => (prev + 1) % flyers.length)}
          >
            ›
          </button>

          {/* Carousel Pagination Dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              zIndex: 10
            }}
          >
            {flyers.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                style={{
                  width: carouselIndex === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '99px',
                  border: 0,
                  padding: 0,
                  background: carouselIndex === i ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SIMPLE BANK APP QUICK ACTIONS BAR */}
      <section style={{ marginBottom: '22px' }}>
        <div
          className="card"
          style={{
            padding: '14px 16px',
            background: 'var(--card-bg)',
            borderRadius: '18px',
            boxShadow: 'var(--sh)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}
          >
            {quickActions.map((act) => (
              <button
                key={act.id}
                onClick={act.onClick}
                style={{
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 2px',
                  borderRadius: '12px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: act.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: act.color
                  }}
                >
                  <Icon name={act.icon} style={{ width: '22px', height: '22px' }} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--ink)',
                    lineHeight: '1.2'
                  }}
                >
                  {act.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WELCOME SECTION (User Requirement: Welcome should be after they sign in!) */}
      {isLoggedIn ? (
        <section style={{ marginBottom: '24px' }}>
          {/* Authenticated Welcome Card */}
          <div
            className="card"
            style={{
              borderColor: 'var(--green)',
              background: 'linear-gradient(135deg, rgba(31, 166, 64, 0.08) 0%, rgba(29, 123, 232, 0.08) 100%)',
              padding: '18px 20px',
              borderRadius: '20px'
            }}
          >
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div className="row" style={{ gap: '8px', alignItems: 'center' }}>
                  <span className="badge" style={{ color: 'var(--green)', borderColor: 'var(--green)', fontWeight: '800' }}>
                    Active Banking Session
                  </span>
                  <span className="badge">{user.membershipTier}</span>
                </div>
                <h2 style={{ fontSize: '22px', marginTop: '6px' }}>
                  Welcome back, {user.fullName}
                </h2>
                <div className="note" style={{ marginTop: '2px', fontSize: '13px' }}>
                  {partnerBank.partnerBankName} • Acc: <b>{partnerBank.accountNumber}</b>
                </div>
              </div>

              <div className="row" style={{ gap: '8px' }}>
                <button onClick={onOpenSendTransfer} className="btn pri sm">
                  <Icon name="send" style={{ width: '15px', height: '15px' }} />
                  <span>Send Money</span>
                </button>
                <button onClick={() => setActiveTab('skills')} className="btn line sm">
                  <span>My Skills</span>
                </button>
              </div>
            </div>

            {/* Balances Highlight */}
            <div className="grid" style={{ marginTop: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div style={{ background: 'var(--card-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                <div className="k">Available to Transfer (70%)</div>
                <div className="v b" style={{ fontSize: '24px' }}>₦{balances.earningsAvailableForTransfer.toLocaleString()}</div>
                <button
                  onClick={onOpenMondayTransfer}
                  className="btn pri sm"
                  style={{ marginTop: '8px', width: '100%', fontSize: '12px', padding: '6px' }}
                  disabled={balances.earningsAvailableForTransfer <= 0}
                >
                  Transfer to Bank
                </button>
              </div>

              <div style={{ background: 'var(--card-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                <div className="k">Locked Wealth Savings (30%)</div>
                <div className="v g" style={{ fontSize: '24px' }}>₦{balances.lockedSavingsBalance.toLocaleString()}</div>
                <div className="note" style={{ marginTop: '8px', fontSize: '12px' }}>
                  🔒 1-Year Compulsory Vault
                </div>
              </div>

              <div style={{ background: 'var(--card-bg)', padding: '14px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                <div className="k">Bank Account Balance</div>
                <div className="v" style={{ fontSize: '24px' }}>₦{balances.actualBankBalance.toLocaleString()}</div>
                <div className="note" style={{ marginTop: '8px', fontSize: '12px' }}>
                  Ready for debit card &amp; withdrawals
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Guest / Pre-Sign In Card */
        <section style={{ marginBottom: '24px' }}>
          <div
            className="card"
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(29, 123, 232, 0.05) 0%, rgba(31, 166, 64, 0.05) 100%)',
              textAlign: 'center'
            }}
          >
            <span className="badge" style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}>
              Official Bank &amp; Youth Skills Platform
            </span>
            <h2 style={{ fontSize: '24px', marginTop: '10px' }}>
              Bank that helps you <span style={{ color: 'var(--green)' }}>prosper</span>
            </h2>
            <p className="note" style={{ maxWidth: '520px', margin: '8px auto 18px', fontSize: '14px', lineHeight: '1.6' }}>
              Open your free partner bank account. Gain in-demand digital and tech skills. Earn sustainable affiliate income with our proven 70/30 wealth formula.
            </p>

            <div className="row" style={{ justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  if (window.confetti) window.confetti({ particleCount: 70, spread: 60 });
                }}
                className="btn pri"
                style={{ padding: '12px 24px', fontSize: '14.5px' }}
              >
                Sign In to Account
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className="btn line"
                style={{ padding: '12px 24px', fontSize: '14.5px' }}
              >
                Explore Tech Skills
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. WEEKLY 70% MONDAY PAYOUT CARD */}
      <section className="sec" style={{ paddingBottom: '10px' }}>
        <div className="card" style={{ borderColor: 'var(--blue)', background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span className="badge" style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>Monday Payout Engine</span>
              <h3 style={{ marginTop: '6px' }}>Weekly 70% Affiliate Payout</h3>
            </div>
            <div className="v b" style={{ fontSize: '28px' }}>
              ₦{balances.earningsAvailableForTransfer.toLocaleString()}
            </div>
          </div>
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
      </section>

      {/* 5. THE 10 DISTINCT FINANCIAL BALANCES GRID */}
      <section className="sec">
        <div className="eyebrow">Financial Balance Architecture</div>
        <h2>10 Distinct Platform Balances</h2>
        <p className="sub">
          Separated directly in the financial engine. Never combined into a misleading total.
        </p>

        <div className="grid">
          <div className="card">
            <div className="k">1. Actual Bank Balance</div>
            <div className="v">₦{balances.actualBankBalance.toLocaleString()}</div>
            <div className="note">{partnerBank.partnerBankName}</div>
          </div>

          <div className="card">
            <div className="k">2. Available Bank Balance</div>
            <div className="v g">₦{balances.availableBankBalance.toLocaleString()}</div>
            <div className="note">Ready for cards &amp; transfers</div>
          </div>

          <div className="card">
            <div className="k">3. Total Affiliate Earned</div>
            <div className="v">₦{balances.totalAffiliateIncomeEarned.toLocaleString()}</div>
            <div className="note">Gross cumulative earnings</div>
          </div>

          <div className="card">
            <div className="k">4. Pending Earnings</div>
            <div className="v" style={{ color: 'var(--warn)' }}>₦{balances.pendingAffiliateEarnings.toLocaleString()}</div>
            <div className="note">Awaiting verification</div>
          </div>

          <div className="card">
            <div className="k">5. Approved Earnings</div>
            <div className="v">₦{balances.approvedAffiliateEarnings.toLocaleString()}</div>
            <div className="note">Cleared commissions</div>
          </div>

          <div className="card" style={{ border: '1.5px solid var(--blue)' }}>
            <div className="k" style={{ color: 'var(--blue)', fontWeight: '700' }}>6. 70% Transferable</div>
            <div className="v b">₦{balances.earningsAvailableForTransfer.toLocaleString()}</div>
            <div className="note">Available for Monday payout</div>
          </div>

          <div className="card" style={{ border: '1.5px solid var(--green)' }}>
            <div className="k" style={{ color: 'var(--green)', fontWeight: '700' }}>7. 30% Locked Savings</div>
            <div className="v g">₦{balances.lockedSavingsBalance.toLocaleString()}</div>
            <div className="note">1-Year lock period</div>
          </div>

          <div className="card">
            <div className="k">8. Matures &lt; 30 Days</div>
            <div className="v">₦{balances.savingsApproachingMaturity.toLocaleString()}</div>
            <div className="note">Upcoming release</div>
          </div>

          <div className="card">
            <div className="k">9. Total Withdrawals</div>
            <div className="v">₦{balances.totalWithdrawals.toLocaleString()}</div>
            <div className="note">Completed payouts</div>
          </div>

          <div className="card">
            <div className="k">10. Total Transfers</div>
            <div className="v">₦{balances.totalTransfers.toLocaleString()}</div>
            <div className="note">Bank transfers sent</div>
          </div>
        </div>
      </section>

      {/* 6. FOUR PILLARS: Bank. Learn. Grow. */}
      <section className="sec">
        <div className="eyebrow">All-in-one Youth Platform</div>
        <h2>Bank. Learn. Grow.</h2>
        <p className="sub">Personal development, tech skills, and financial empowerment.</p>
        <div className="grid4">
          {feats.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (f.icon === 'skills') setActiveTab('skills');
                else if (f.icon === 'trending-up') setActiveTab('affiliate');
                else if (f.icon === 'sparkles') setActiveTab('refer');
              }}
            >
              <div className="ico">
                <Icon name={f.icon} style={{ width: '24px', height: '24px', stroke: '#fff' }} />
              </div>
              <h3>{f.title}</h3>
              <p className="note" style={{ fontSize: '13.5px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW THE 70/30 SYSTEM WORKS */}
      <section className="sec" id="how-it-works">
        <div className="soft">
          <div className="eyebrow">How your earnings work</div>
          <h2>70% to use today. 30% saved for your future.</h2>
          <p className="sub">
            Every approved affiliate earning is split automatically. Example: ₦100,000 earned.
          </p>

          <div className="grid4">
            <div>
              <div className="k">Available to transfer (70%)</div>
              <div className="v b">₦70,000</div>
            </div>
            <div>
              <div className="k">Locked savings for 1 year (30%)</div>
              <div className="v g">₦30,000</div>
            </div>
          </div>

          {/* Dual Split Bar */}
          <div className="split3">
            <i style={{ width: '70%', background: '#1d7be8' }}></i>
            <i style={{ width: '30%', background: '#1fa640' }}></i>
          </div>

          <p className="note" style={{ marginTop: '10px' }}>
            Each savings amount has its own maturity date, and it cannot be withdrawn early. This guarantees disciplined wealth creation for every Nigerian youth.
          </p>
        </div>
      </section>

      {/* 8. 25-AFFILIATE MILESTONE SECTION */}
      <section className="sec">
        <div className="eyebrow">Grow with referrals</div>
        <h2>Reach 25 qualifying affiliates</h2>
        <p className="sub">
          Qualifying means verified and approved bank accounts. At 25 you unlock a higher earning tier (20%), a business loan assessment, and the RAP incubator.
        </p>

        <div className="card">
          <div className="bar-p">
            <i style={{ width: `${affiliateStats.percentProgress}%` }}></i>
          </div>
          <p className="note" style={{ fontSize: '13.5px' }}>
            Qualifying affiliates: <b>{affiliateStats.qualifyingAffiliates}/{affiliateStats.threshold}</b> · Remaining: {affiliateStats.remainingAffiliates} · {affiliateStats.percentProgress}%<br />
            Next milestone: <b>RAP Growth Partner</b> · Loan: <b>{affiliateStats.isUnlocked ? 'Unlocked' : 'Locked'}</b> · Incubation: <b>{affiliateStats.isUnlocked ? 'Unlocked' : 'Locked'}</b>
          </p>

          <div className="row" style={{ marginTop: '12px' }}>
            <button
              onClick={() => setActiveTab('refer')}
              className="btn line sm"
            >
              Get my referral link
            </button>
            {!affiliateStats.isUnlocked && (
              <button
                onClick={onReachMilestone}
                className="btn pri sm"
              >
                Simulate 25 Affiliates Milestone
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <img src="/img/logo.png" alt="RAP Bank" style={{ height: '36px' }} />
          <span style={{ fontSize: '13px', color: 'var(--mute)' }}>
            © 2026 RAP Bank – Rise and Prosper. Bank accounts provided through our approved CBN partner.
          </span>
        </div>
      </footer>
    </div>
  );
}
