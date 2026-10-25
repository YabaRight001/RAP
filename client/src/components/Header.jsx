import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../icons.jsx';

export function Header({
  activeTab,
  setActiveTab,
  user,
  isLoggedIn,
  setIsLoggedIn,
  onOpenWalkthrough,
  onOpenNotifications,
  onOpenSendTransfer,
  isAdmin,
  setIsAdmin,
  theme,
  setTheme,
  viewMode,
  setViewMode
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'phone' ? 'desktop' : 'phone');
    setMenuOpen(false);
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Top Ticker — Micro announcement marquee */}
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
          {/* Brand Logo */}
          <div className="row" style={{ gap: '12px', alignItems: 'center' }}>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('home');
              }}
              aria-label="RAP Bank Home"
              style={{ display: 'flex', alignItems: 'center' }}
            >
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
              onClick={() => {
                if (onOpenSendTransfer) onOpenSendTransfer();
              }}
              className=""
              style={{ color: 'var(--blue)', fontWeight: '700' }}
            >
              Transfer
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
              Refer &amp; Earn
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={activeTab === 'login' ? 'on' : ''}
            >
              Profile
            </button>
          </nav>

          {/* Right Action Controls: Clean Fintech Icons */}
          <div className="row" style={{ gap: '8px', alignItems: 'center', position: 'relative' }}>
            {/* Notification Bell Button with Unread Indicator */}
            <button
              onClick={onOpenNotifications}
              className="icon-round-btn"
              title="View Notifications &amp; Alerts"
              aria-label="Notifications"
            >
              <Icon name="bell" style={{ width: '18px', height: '18px' }} />
              <span className="notification-dot" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="icon-round-btn"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle light and dark mode"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} style={{ width: '17px', height: '17px' }} />
            </button>

            {/* Discreet Settings & Developer Menu Button */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`icon-round-btn ${menuOpen ? 'active' : ''}`}
                style={{ borderColor: isAdmin ? '#d92d20' : undefined }}
                title="Account Settings &amp; Tools"
                aria-label="Open settings menu"
              >
                <Icon name="more" style={{ width: '18px', height: '18px', fill: 'currentColor' }} />
              </button>

              {/* Floating Settings & Tools Dropdown Menu */}
              {menuOpen && (
                <div className="menu-dropdown">
                  {/* User Status Header */}
                  <div className="menu-dropdown-header">
                    <div style={{ fontWeight: '800', fontSize: '13.5px', color: 'var(--ink)' }}>
                      {isLoggedIn ? (user?.fullName || 'Chukwuemeka Adebayo') : 'RAP Bank Guest'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--mute)', marginTop: '2px' }}>
                      {isLoggedIn ? `${user?.membershipTier || 'RAP Affiliate'} • Level 2 KYC` : 'Not Signed In'}
                    </div>
                  </div>

                  <div className="menu-dropdown-body">
                    {/* 19-Step Scenario Walkthrough */}
                    <button
                      onClick={() => {
                        onOpenWalkthrough();
                        setMenuOpen(false);
                      }}
                      className="menu-item"
                    >
                      <span className="menu-item-icon" style={{ background: 'rgba(31, 166, 64, 0.12)', color: 'var(--green)' }}>
                        <Icon name="sparkles" style={{ width: '16px', height: '16px' }} />
                      </span>
                      <div className="menu-item-text">
                        <b>19 Steps Walkthrough</b>
                        <span>Test all end-to-end features</span>
                      </div>
                    </button>

                    {/* View Mode Toggle (App Simulator vs Desktop) */}
                    <button
                      onClick={toggleViewMode}
                      className="menu-item"
                    >
                      <span className="menu-item-icon" style={{ background: 'rgba(29, 123, 232, 0.12)', color: 'var(--blue)' }}>
                        <Icon name={viewMode === 'phone' ? 'device-desktop' : 'device-mobile'} style={{ width: '16px', height: '16px' }} />
                      </span>
                      <div className="menu-item-text">
                        <b>{viewMode === 'phone' ? 'Desktop View' : 'App Mode Simulator'}</b>
                        <span>Switch screen simulation</span>
                      </div>
                    </button>

                    {/* Admin Switcher */}
                    <button
                      onClick={() => {
                        setIsAdmin(!isAdmin);
                        setMenuOpen(false);
                      }}
                      className="menu-item"
                    >
                      <span className="menu-item-icon" style={{ background: isAdmin ? 'rgba(217, 45, 32, 0.12)' : 'rgba(100, 116, 139, 0.12)', color: isAdmin ? '#d92d20' : 'var(--mute)' }}>
                        <Icon name="shield" style={{ width: '16px', height: '16px' }} />
                      </span>
                      <div className="menu-item-text">
                        <b>{isAdmin ? 'Exit Admin Mode' : 'Admin Governance'}</b>
                        <span>System governance &amp; logs</span>
                      </div>
                    </button>

                    <div style={{ height: '1px', background: 'var(--line)', margin: '4px 0' }} />

                    {/* Auth Toggle */}
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setMenuOpen(false);
                        }}
                        className="menu-item"
                        style={{ color: '#d92d20' }}
                      >
                        <span className="menu-item-icon" style={{ background: 'rgba(217, 45, 32, 0.1)', color: '#d92d20' }}>
                          <Icon name="login" style={{ width: '16px', height: '16px' }} />
                        </span>
                        <div className="menu-item-text">
                          <b style={{ color: '#d92d20' }}>Sign Out</b>
                          <span>End current session</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTab('login');
                          setMenuOpen(false);
                        }}
                        className="menu-item"
                        style={{ color: 'var(--green)' }}
                      >
                        <span className="menu-item-icon" style={{ background: 'var(--green-soft)', color: 'var(--green)' }}>
                          <Icon name="login" style={{ width: '16px', height: '16px' }} />
                        </span>
                        <div className="menu-item-text">
                          <b style={{ color: 'var(--green)' }}>Sign In / Register</b>
                          <span>Access personal bank account</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
