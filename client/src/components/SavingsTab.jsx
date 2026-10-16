import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function SavingsTab({ data }) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/savings/allocations')
      .then(res => res.json())
      .then(d => {
        setAllocations(d.allocations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!data) return null;
  const { balances } = data;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-white font-display tracking-tight">MY SAVINGS</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Compulsory 1-year locked savings ledger from the 30% affiliate allocation
        </p>
      </div>

      {/* Savings Summary Banner */}
      <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 p-6 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
              <Icon name="lock" className="w-4 h-4" /> 1-Year Compulsory Locked Wealth
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-2 font-display tracking-tight">
              ₦{balances.lockedSavingsBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-300 mt-1.5 max-w-lg leading-relaxed">
              Every affiliate earning credits 30% into this secure vault. Each credit is locked for 365 days from the date it was earned to guarantee long-term prosperity.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 min-w-[200px]">
            <span className="text-[11px] font-semibold text-slate-400 block">Approaching Maturity (&lt;30d)</span>
            <span className="text-xl font-bold text-emerald-400 font-display block mt-1">
              ₦{balances.savingsApproachingMaturity.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Next maturity: Jan 05, 2027</span>
          </div>
        </div>
      </div>

      {/* Security Rule Warning */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
        <Icon name="shield" className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Strict Backend Restriction Enforced</strong>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Locked savings cannot be transferred or withdrawn before the maturity date under any circumstance. The backend rejects any API transfer attempts on these funds until the 365-day period has elapsed.
          </p>
        </div>
      </div>

      {/* Individual Savings Allocations Table */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Individual Savings Allocations</h2>
            <p className="text-xs text-slate-400">Chronological ledger of every 30% allocation with exact maturity dates</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {allocations.length} Active Records
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">Loading savings ledger...</div>
        ) : allocations.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">No savings allocations yet.</div>
        ) : (
          <div className="divide-y divide-slate-800 text-xs">
            {allocations.map((alloc) => {
              const creditDate = new Date(alloc.credit_date).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const maturityDate = new Date(alloc.maturity_date).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div key={alloc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                      <Icon name="lock" className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">
                          ₦{alloc.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                          {alloc.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{alloc.notes}</p>
                    </div>
                  </div>

                  <div className="sm:text-right text-[11px] text-slate-400 space-y-0.5 pl-9 sm:pl-0">
                    <div>Credited: <span className="text-slate-300 font-medium">{creditDate}</span></div>
                    <div>Matures on: <strong className="text-emerald-400 font-bold">{maturityDate}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
