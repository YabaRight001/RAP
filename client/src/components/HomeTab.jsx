import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../icons.jsx';

export function HomeTab({
  data,
  onOpenMondayTransfer,
  onOpenSendTransfer,
  onReachMilestone,
  setActiveTab
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const trackRef = useRef(null);

  const flyers = [
    { src: '/img/flyer-2.jpg', alt: 'Create a RAP account today' },
    { src: '/img/flyer-1.jpg', alt: 'Bank that helps you prosper' }
  ];

  // Auto scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: carouselIndex * trackRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [carouselIndex]);

  if (!data) return <div className="wrap sec"><p className="note">Loading RAP...</p></div>;

  const { user, partnerBank, balances, affiliateStats } = data;

  const feats = [
    {
      title: "Open a Youth Account",
      desc: "Start your financial journey with an authorized partner account.",
      icon: "account"
    },
    {
      title: "Access Workforce Training",
      desc: "Gain in-demand digital, finance, and entrepreneurship skills.",
      icon: "graduation-cap"
    },
    {
      title: "Explore Earning Opportunities",
      desc: "Turn your network and skills into daily sustainable income.",
      icon: "trending-up"
    },
    {
      title: "Build a Brighter Future",
      desc: "More skills. More opportunities. More prosperity for you.",
      icon: "sparkles"
    }
  ];

  return (
    <div className="wrap">
      {/* Top Welcome Strip */}
      <div className="strip">
        <div>
          <b>Welcome back, {user.fullName}</b>
          <div className="note" style={{ marginTop: '2px' }}>
            Available <b>₦{balances.earningsAvailableForTransfer.toLocaleString()}</b> · Locked Savings <b>₦{balances.lockedSavingsBalance.toLocaleString()}</b>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('account')}
          className="btn sm pri"
        >
          Open my account
        </button>
      </div>

      {/* Hero Section with Official Flyer Carousel */}
      <section className="hero2">
        <div>
          <div className="eyebrow">Youth banking · Skills · Opportunity · Real growth</div>
          <h1>
            Bank that helps you <em>prosper</em>
          </h1>
          <p className="lead">
            Build your skills. Grow your income. Secure your future.
          </p>

          <div className="row">
            <button
              onClick={() => setActiveTab('account')}
              className="btn pri"
            >
              Go to my account
            </button>
            <button
              onClick={() => setActiveTab('affiliate')}
              className="btn line"
            >
              Affiliate hub
            </button>
          </div>

          {/* Quick Navigation Chips */}
          <div className="chips" style={{ marginTop: '20px' }}>
            <button onClick={() => setActiveTab('account')}>Account</button>
            <button onClick={() => setActiveTab('affiliate')}>Affiliate</button>
            <button onClick={() => setActiveTab('refer')}>Refer &amp; earn</button>
            <a href="#how-it-works">How it works</a>
          </div>
        </div>

        {/* Carousel with Official RAP Flyers */}
        <div>
          <div className="car">
            <div className="track" ref={trackRef}>
              {flyers.map((f, idx) => (
                <a key={idx} href="#affiliate" onClick={(e) => { e.preventDefault(); setActiveTab('affiliate'); }}>
                  <img src={f.src} alt={f.alt} />
                </a>
              ))}
            </div>
            <button
              className="cbtn p"
              aria-label="Previous"
              onClick={() => setCarouselIndex(prev => (prev === 0 ? 1 : 0))}
            >
              ‹
            </button>
            <button
              className="cbtn n"
              aria-label="Next"
              onClick={() => setCarouselIndex(prev => (prev === 0 ? 1 : 0))}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Prominent Monday Transfer Feature Card */}
      <section className="sec" style={{ paddingBottom: '10px' }}>
        <div className="card" style={{ borderColor: 'var(--blue)', background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <span className="badge" style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>Monday Payout Feature</span>
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

      {/* The 10 Distinct Financial Balances Grid */}
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

      {/* Feature Grid: Bank. Learn. Grow. */}
      <section className="sec">
        <div className="eyebrow">One account</div>
        <h2>Bank. Learn. Grow.</h2>
        <p className="sub">One account, endless opportunities.</p>
        <div className="grid4">
          {feats.map((f, i) => (
            <div key={i} className="card">
              <div className="ico">
                <Icon name={f.icon} style={{ width: '24px', height: '24px', stroke: '#fff' }} />
              </div>
              <h3>{f.title}</h3>
              <p className="note" style={{ fontSize: '13.5px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How the 70/30 System Works */}
      <section className="sec" id="how-it-works">
        <div className="soft">
          <div className="eyebrow">How your earnings work</div>
          <h2>70% to use. 30% saved for you.</h2>
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
            Each savings amount has its own maturity date, and it can't be withdrawn early. This is an illustration, not a promise of income.
          </p>
        </div>
      </section>

      {/* 25-Affiliate Milestone Section */}
      <section className="sec">
        <div className="eyebrow">Grow with referrals</div>
        <h2>Reach 25 qualifying affiliates</h2>
        <p className="sub">
          Qualifying means verified and approved, not just a link click. At 25 you unlock a higher earning tier (20%), a loan assessment, and the RAP business incubator.
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
        <div className="wrap">
          <img src="/img/logo.png" alt="RAP" style={{ height: '34px' }} />
          <span>
            © 2026 RAP – Rise and Prosper. Bank accounts are provided through our approved banking partner.
          </span>
        </div>
      </footer>
    </div>
  );
}
