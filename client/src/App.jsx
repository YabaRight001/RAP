import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { HomeTab } from './components/HomeTab.jsx';
import { AccountTab } from './components/AccountTab.jsx';
import { AffiliateTab } from './components/AffiliateTab.jsx';
import { ReferTab } from './components/ReferTab.jsx';
import { LoginTab } from './components/LoginTab.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import { MondayTransferModal } from './components/MondayTransferModal.jsx';
import { SendTransferModal } from './components/SendTransferModal.jsx';
import { StatementModal } from './components/StatementModal.jsx';
import { ScenarioWalkthrough } from './components/ScenarioWalkthrough.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rap-theme') || 'light'; } catch { return 'light'; }
  });

  // View Mode: 'desktop' | 'phone' (phone simulator on desktop)
  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem('rap-viewmode') || 'desktop'; } catch { return 'desktop'; }
  });

  // Modals state
  const [mondayModalOpen, setMondayModalOpen] = useState(false);
  const [sendTransferModalOpen, setSendTransferModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('rap-theme', theme); } catch {}
  }, [theme]);

  // Persist viewMode
  useEffect(() => {
    try { localStorage.setItem('rap-viewmode', viewMode); } catch {}
  }, [viewMode]);

  const fetchUserData = () => {
    fetch('/api/user/balances')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error('Failed to load balances', err));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const showToast = (text) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreditCommission = async (amount = 100000) => {
    try {
      const res = await fetch('/api/affiliate/credit-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const resData = await res.json();
      if (resData.success) {
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        showToast('✓ Commission credited: 70% available, 30% locked savings for 1 year!');
        fetchUserData();
      }
    } catch {
      showToast('Commission process failed');
    }
  };

  const handleReachMilestone = async () => {
    try {
      const res = await fetch('/api/affiliate/reach-25-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const resData = await res.json();
      if (resData.success) {
        if (window.confetti) {
          window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        }
        showToast('🎉 25 Affiliates Milestone Reached! Upgraded to RAP Growth Partner (20%)');
        fetchUserData();
      }
    } catch {
      showToast('Milestone update failed');
    }
  };

  // The inner app content (tabs, bottom nav)
  const appContent = (
    <>
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {isAdmin ? (
          <AdminPanel onClose={() => setIsAdmin(false)} />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeTab
                data={data}
                onOpenMondayTransfer={() => setMondayModalOpen(true)}
                onOpenSendTransfer={() => setSendTransferModalOpen(true)}
                onReachMilestone={handleReachMilestone}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'account' && (
              <AccountTab
                data={data}
                onOpenMondayTransfer={() => setMondayModalOpen(true)}
                onOpenSendTransfer={() => setSendTransferModalOpen(true)}
                onOpenStatement={() => setStatementModalOpen(true)}
              />
            )}

            {activeTab === 'affiliate' && (
              <AffiliateTab
                data={data}
                onCreditCommission={handleCreditCommission}
                onReachMilestone={handleReachMilestone}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'refer' && (
              <ReferTab data={data} />
            )}

            {activeTab === 'login' && (
              <LoginTab
                data={data}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile App Bottom Navigation Bar */}
      {!isAdmin && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          inPhone={viewMode === 'phone'}
        />
      )}
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', transition: 'background 0.25s ease' }}>
      {/* Top Header — always full-width */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={data?.user}
        onOpenWalkthrough={() => setWalkthroughOpen(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        theme={theme}
        setTheme={setTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* View Mode: Phone Simulator or Full Desktop */}
      {viewMode === 'phone' ? (
        <div className="phone-frame-container" style={{ flex: 1 }}>
          <div className="phone-mockup">
            {/* Dynamic Island / Status Bar */}
            <div className="phone-speaker-notch">
              <span>{new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="phone-dynamic-island" />
              <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
              </span>
            </div>

            {/* Scrollable phone content area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
              {appContent}
            </div>

            {/* iPhone-style home indicator bar */}
            <div className="phone-home-indicator">
              <div className="phone-home-bar" />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {appContent}
        </div>
      )}

      {/* Interactive Modals */}
      <MondayTransferModal
        isOpen={mondayModalOpen}
        onClose={() => setMondayModalOpen(false)}
        data={data}
        onTransferSuccess={() => {
          showToast('✓ Monday 70% transfer completed successfully!');
          fetchUserData();
        }}
      />

      <SendTransferModal
        isOpen={sendTransferModalOpen}
        onClose={() => setSendTransferModalOpen(false)}
        data={data}
        onTransferSuccess={() => {
          showToast('✓ Bank transfer completed successfully!');
          fetchUserData();
        }}
      />

      <StatementModal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
        data={data}
      />

      <ScenarioWalkthrough
        isOpen={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        onRefreshData={fetchUserData}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
