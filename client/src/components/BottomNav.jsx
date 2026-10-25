import React from 'react';
import { Icon } from '../icons.jsx';

export function BottomNav({ activeTab, setActiveTab, inPhone }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'skills', label: 'Skills', icon: 'skills' },
    { id: 'affiliate', label: 'Affiliate', icon: 'affiliate' },
    { id: 'login', label: 'Profile', icon: 'login' },
    { id: 'refer', label: 'Refer', icon: 'refer' }
  ];

  return (
    <nav
      className="tabbar"
      aria-label="Main Navigation"
      style={inPhone ? {
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        zIndex: 50
      } : undefined}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (!inPhone) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={isActive ? 'on' : ''}
          >
            <Icon
              name={tab.icon}
              style={{
                width: '22px',
                height: '22px',
                stroke: isActive ? 'var(--green)' : 'var(--mute)'
              }}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
