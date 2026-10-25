import React from 'react';
import { Icon } from '../icons.jsx';

export function BottomNav({ activeTab, setActiveTab, onOpenSendTransfer, inPhone }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'skills', label: 'Skills', icon: 'skills' },
    { id: 'transfer', label: 'Transfer', icon: 'send', isAction: true },
    { id: 'affiliate', label: 'Affiliate', icon: 'affiliate' },
    { id: 'login', label: 'Profile', icon: 'login' }
  ];

  return (
    <nav
      className="tabbar"
      aria-label="Main Banking Navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // Prominent Center Quick Send Transfer Action
        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (onOpenSendTransfer) onOpenSendTransfer();
              }}
              className="tab-action-btn"
              title="Quick Send Money / Transfer"
              aria-label="Send Transfer"
            >
              <div className="tab-action-circle">
                <Icon
                  name={tab.icon}
                  style={{
                    width: '20px',
                    height: '20px',
                    stroke: '#ffffff'
                  }}
                />
              </div>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (!inPhone) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`tab-btn ${isActive ? 'on' : ''}`}
            aria-label={tab.label}
          >
            <div className="tab-icon-wrap">
              <Icon
                name={tab.icon}
                style={{
                  width: '21px',
                  height: '21px',
                  stroke: isActive ? 'var(--green)' : 'var(--mute)'
                }}
              />
            </div>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
