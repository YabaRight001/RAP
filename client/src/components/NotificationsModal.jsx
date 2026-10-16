import React from 'react';
import { Icon } from '../icons.jsx';

export function NotificationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Monday Payout Ready',
      desc: '₦101,500.00 is available for transfer under your 70% accessible affiliate balance.',
      time: 'Today, 08:00 AM',
      type: 'financial',
      unread: true
    },
    {
      id: 2,
      title: 'New Qualifying Affiliate Joined',
      desc: 'Oluwaseun Bakare registered with your link and completed BVN/NIN verification.',
      time: 'Yesterday, 14:22',
      type: 'affiliate',
      unread: false
    },
    {
      id: 3,
      title: '30% Locked Savings Credited',
      desc: '₦30,000 was safely locked for 1 calendar year (Matures in 365 days).',
      time: '3 days ago',
      type: 'savings',
      unread: false
    },
    {
      id: 4,
      title: 'Security Notice: New Session',
      desc: 'Your account was accessed from Chrome on Linux (Lagos Gateway).',
      time: '4 days ago',
      type: 'security',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-white font-display mb-3">Notifications & Alerts</h2>
        <div className="divide-y divide-slate-800 text-xs">
          {notifications.map(n => (
            <div key={n.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
