import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function LoansTab({ data, onReachMilestone }) {
  const [products, setProducts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestedAmount, setRequestedAmount] = useState(250000);
  const [tenureMonths, setTenureMonths] = useState(6);
  const [businessName, setBusinessName] = useState('Adebayo Digital Fashion');
  const [purpose, setPurpose] = useState('Working capital to purchase bulk inventory');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!data) return null;
  const { affiliateStats } = data;
  const isUnlocked = affiliateStats.qualifyingAffiliates >= 25;

  const fetchLoanData = () => {
    fetch('/api/loans/products')
      .then(res => res.json())
      .then(p => {
        setProducts(p);
        if (p.length > 0 && !selectedProduct) setSelectedProduct(p[0]);
      });

    fetch('/api/loans/user-applications')
      .then(res => res.json())
      .then(a => setApplications(a));
  };

  useEffect(() => {
    fetchLoanData();
  }, [isUnlocked]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct ? selectedProduct.id : 'prod-loan-sme',
          requestedAmount,
          tenureMonths,
          purpose,
          businessName
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setFeedbackMsg({ type: 'success', text: resData.message });
        fetchLoanData();
      } else {
        setFeedbackMsg({ type: 'error', text: resData.error });
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Monthly repayment calculation
  const interestRate = selectedProduct ? selectedProduct.interest_rate_percent : 5;
  const totalInterest = (requestedAmount * (interestRate / 100) * (tenureMonths / 12));
  const totalRepayable = requestedAmount + totalInterest;
  const monthlyPayment = totalRepayable / tenureMonths;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-white font-display tracking-tight">RAP GROWTH & LOAN OPPORTUNITIES</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Non-predatory catalytic growth capital for verified RAP Growth Partners
        </p>
      </div>

      {/* Lock Guard Check */}
      {!isUnlocked ? (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Icon name="lock" className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Loan Opportunities Locked</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            The RAP Loan Assessment Portal unlocks when you build a network of at least <strong>25 Qualifying Affiliates</strong>. This ensures participating entrepreneurs possess community traction and financial discipline.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Milestone Progress</span>
              <span className="text-amber-400 font-bold">{affiliateStats.qualifyingAffiliates} / 25 ({affiliateStats.percentProgress}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                style={{ width: `${affiliateStats.percentProgress}%` }}
              ></div>
            </div>
            <span className="block text-[11px] text-slate-400 mt-1.5">
              Only {affiliateStats.remainingAffiliates} more verified affiliates to unlock!
            </span>
          </div>

          <button
            onClick={onReachMilestone}
            className="mt-6 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            ⚡ Simulate 25 Affiliates Milestone
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unlocked Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Icon name="unlock" className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Milestone Achieved (25 Qualifying Affiliates)
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Loan Application & Risk Assessment Pathway Unlocked
              </h3>
            </div>
          </div>

          {/* Available Loan Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(prod => (
              <div
                key={prod.id}
                onClick={() => {
                  setSelectedProduct(prod);
                  setRequestedAmount(Math.min(prod.max_amount, Math.max(prod.min_amount, requestedAmount)));
                  setTenureMonths(prod.tenure_months);
                }}
                className={`p-5 rounded-2xl border transition cursor-pointer relative ${
                  selectedProduct?.id === prod.id
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-xl shadow-emerald-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedProduct?.id === prod.id && (
                  <span className="absolute top-3 right-3 p-1 rounded-full bg-emerald-500 text-slate-950">
                    <Icon name="check" className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  {prod.interest_rate_percent}% Subsidized Youth Rate
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{prod.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Range:</span>
                  <span className="font-bold text-white">
                    ₦{prod.min_amount.toLocaleString()} - ₦{prod.max_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Application & Repayment Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Loan Application Details</h2>
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Requested Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    min={selectedProduct ? selectedProduct.min_amount : 50000}
                    max={selectedProduct ? selectedProduct.max_amount : 500000}
                    step={10000}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Registered Business / Enterprise Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Repayment Tenure
                    </label>
                    <select
                      value={tenureMonths}
                      onChange={(e) => setTenureMonths(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={9}>9 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Use of Funds / Business Purpose
                  </label>
                  <textarea
                    rows={2}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {feedbackMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {feedbackMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition transform active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Submitting to Credit Committee...' : 'Submit Loan Application for Assessment'}
                </button>
              </form>
            </div>

            {/* Repayment Schedule Card */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Estimated Repayment Plan</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Principal Amount</span>
                  <span className="font-bold text-white">₦{requestedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Interest Rate</span>
                  <span className="font-bold text-emerald-400">{interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Tenure</span>
                  <span className="font-bold text-white">{tenureMonths} Months</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Total Interest Fee</span>
                  <span className="font-bold text-white">₦{Math.round(totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="font-bold text-slate-300">Monthly Repayment</span>
                  <span className="font-black text-emerald-400 font-display text-sm">
                    ₦{Math.round(monthlyPayment).toLocaleString()} / mo
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Repayments are deducted automatically from your verified partner bank balance on the designated monthly schedule.
              </p>
            </div>
          </div>

          {/* User Application History */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Your Loan Applications</h3>
            {applications.length === 0 ? (
              <p className="text-xs text-slate-400">No applications submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-800 text-xs">
                {applications.map(app => (
                  <div key={app.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{app.product_name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ₦{app.requested_amount.toLocaleString()} • {app.tenure_months} Mo • {app.business_name}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      app.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
