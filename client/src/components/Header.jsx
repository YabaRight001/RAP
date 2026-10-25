import React from 'react';
import { Icon } from '../icons.jsx';

export function Header({
  activeTab,
  setActiveTab,
  user,
  isLoggedIn,
  setIsLoggedIn,
  onOpenWalkthrough,
  isAdmin,
  setIsAdmin,
  theme,
  setTheme,
  viewMode,
  setViewMode
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'phone' ? 'desktop' : 'phone');
  };

  return (
    <>
      {/* Top Ticker — animated marquee */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          <span>🏦 RAP BANK • BANK THAT HELPS YOU PROSPER</span>
          <span>💻 IN-DEMAND TECH SKILLS &amp; PERSONAL DEVELOPMENT</span>
          <span>📈 AFFILIATE EARNINGS — 70% YOURS TODAY</span>
          <span>🔒 30% LOCKED SAVINGS — 1 YEAR WEALTH BUILDING</span>
          <span>💳 SEAMLESS BANK TRANSFERS &amp; PAYOUTS</span>
          <span>🏦 RAP BANK • BANK THAT HELPS YOU PROSPER</span>
          <span>💻 IN-DEMAND TECH SKILLS &amp; PERSONAL DEVELOPMENT</span>
          <span>📈 AFFILIATE EARNINGS — 70% YOURS TODAY</span>
          <span>🔒 30% LOCKED SAVINGS — 1 YEAR WEALTH BUILDING</span>
          <span>💳 SEAMLESS BANK TRANSFERS &amp; PAYOUTS</span>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="top">
        <div className="wrap">
          <div className="row" style={{ gap: '12px', alignItems: 'center' }}>
            <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} aria-label="RAP Bank Home" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/img/logo.png" alt="RAP Bank" className="logo-img" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="dnav">
            <button
              onClick={() => setActiveTab('home')}
              className={activeTab === 'home' ? 'on' : ''}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={activeTab === 'skills' ? 'on' : ''}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('affiliate')}
              className={activeTab === 'affiliate' ? 'on' : ''}
            >
              Affiliate
            </button>
            <button
              onClick={() => setActiveTab('refer')}
              className={activeTab === 'refer' ? 'on' : ''}
            >
              Refer & Earn
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={activeTab === 'login' ? 'on' : ''}
            >
              Profile
            </button>
          </nav>

          {/* Right Action CTA Controls */}
          <div className="row" style={{ gap: '8px' }}>
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="btn line sm theme-toggle-btn"
              style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle light and dark mode"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} style={{ width: '15px', height: '15px' }} />
              <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* View Mode Toggle Button (App Simulator vs Desktop) */}
            <button
              onClick={toggleViewMode}
              className="btn line sm view-mode-btn"
              style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title={viewMode === 'phone' ? 'Switch to Full Desktop View' : 'Switch to Phone App View Simulator'}
            >
              <Icon name={viewMode === 'phone' ? 'device-desktop' : 'device-mobile'} style={{ width: '15px', height: '15px' }} />
              <span className="view-mode-label">{viewMode === 'phone' ? 'Desktop' : 'App Mode'}</span>
            </button>

            {/* 19-Step Scenario Walkthrough Button */}
            <button
              onClick={onOpenWalkthrough}
              className="btn pri sm"
              style={{ fontSize: '13px' }}
              title="Test all 19 steps end-to-end"
            >
              <Icon name="sparkles" style={{ width: '15px', height: '15px' }} />
              <span>19 Steps</span>
            </button>

            {/* Auth State Button */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="btn line sm"
                style={{ fontSize: '13px' }}
                title="Sign out of your account"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="btn pri sm"
                style={{ fontSize: '13px' }}
                title="Sign into your RAP Bank account"
              >
                Sign In
              </button>
            )}

            {/* Admin Switcher */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="btn line sm"
              style={{ fontSize: '13px', borderColor: isAdmin ? '#d92d20' : undefined, color: isAdmin ? '#d92d20' : undefined }}
            >
              {isAdmin ? 'Exit Admin' : 'Admin'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
