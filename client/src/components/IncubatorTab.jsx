import React, { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';

export function IncubatorTab({ data, onReachMilestone }) {
  const [statusData, setStatusData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('GreenProsper Agritech');
  const [sector, setSector] = useState('Agritech & Food Logistics');
  const [idea, setIdea] = useState('Direct bulk cassava delivery connecting farmers to Lagos food factories.');
  const [problem, setProblem] = useState('High post-harvest loss and volatile market pricing.');
  const [funding, setFunding] = useState(1500000);
  const [feedback, setFeedback] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  if (!data) return null;
  const { affiliateStats } = data;
  const isUnlocked = affiliateStats.qualifyingAffiliates >= 25;

  const fetchIncubator = () => {
    fetch('/api/incubator/status')
      .then(res => res.json())
      .then(d => setStatusData(d));
  };

  useEffect(() => {
    fetchIncubator();
  }, [isUnlocked]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/incubator/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessIdea: idea,
          sector,
          problemSolved: problem,
          revenueModel: '3.5% commission on settled transactions',
          fundingRequirement: funding
        })
      });
      const d = await res.json();
      if (d.success) {
        setFeedback({ type: 'success', text: d.message });
        fetchIncubator();
      } else {
        setFeedback({ type: 'error', text: d.error });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const courses = [
    {
      id: 'c1',
      title: 'Financial Modeling & Nigerian Tax Structure',
      duration: '4 Modules • 2h 30m',
      instructor: 'Dr. Ngozi Balogun',
      progress: 100,
      completed: true
    },
    {
      id: 'c2',
      title: 'Digital Funnel Architecture & WhatsApp Commerce',
      duration: '6 Modules • 3h 15m',
      instructor: 'Mrs. Folashade Adeleke',
      progress: 65,
      completed: false
    },
    {
      id: 'c3',
      title: 'B2B Sales & Supply Chain Optimization in Lagos',
      duration: '5 Modules • 2h 45m',
      instructor: 'Engr. Babajide Williams',
      progress: 20,
      completed: false
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-white font-display tracking-tight">RAP BUSINESS INCUBATOR</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Youth empowerment accelerator: From referral commissions to sustainable Nigerian enterprise
        </p>
      </div>

      {!isUnlocked ? (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Icon name="lock" className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Incubator Pathway Locked</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            The RAP Business Incubator is reserved for members who prove leadership by building an active community of <strong>25 Qualifying Affiliates</strong>.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Qualification Progress</span>
              <span className="text-amber-400 font-bold">{affiliateStats.qualifyingAffiliates} / 25 ({affiliateStats.percentProgress}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                style={{ width: `${affiliateStats.percentProgress}%` }}
              ></div>
            </div>
            <span className="block text-[11px] text-slate-400 mt-1.5">
              {affiliateStats.remainingAffiliates} more verified affiliates required.
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
          {/* Active Status & Mentor Card */}
          {statusData?.application ? (
            <div className="bg-gradient-to-br from-emerald-950/50 to-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                    Incubator Active • Cohort 2026
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">
                    {statusData.application.business_name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Sector: <strong>{statusData.application.sector}</strong> • Target Funding: <strong>₦{statusData.application.funding_requirement.toLocaleString()}</strong>
                  </p>
                </div>

                {/* Assigned Mentor Card */}
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                    BW
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Assigned Mentor</span>
                    <span className="text-xs font-bold text-white block">Engr. Babajide Williams</span>
                    <span className="text-[10px] text-slate-400">Fintech & Scale Strategist</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Application Form */
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-3">Submit Incubator Venture Application</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Business Venture Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Business Idea & Value Proposition</label>
                  <textarea
                    rows={2}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Core Problem Being Solved</label>
                    <input
                      type="text"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Seed Capital (₦)</label>
                    <input
                      type="number"
                      value={funding}
                      onChange={(e) => setFunding(Number(e.target.value))}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {feedback && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${
                    feedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {feedback.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition"
                >
                  {submitting ? 'Submitting to Selection Committee...' : 'Submit Application & Join Incubator Cohort'}
                </button>
              </form>
            </div>
          )}

          {/* 6 Incubator Progression Stages */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">6-Stage Incubation Roadmap</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { n: 1, title: 'Discovery', desc: 'Market pain validation', active: true },
                { n: 2, title: 'Skills', desc: 'Enterprise management', active: false },
                { n: 3, title: 'Planning', desc: 'Financial modeling', active: false },
                { n: 4, title: 'Validation', desc: 'First 10 customers', active: false },
                { n: 5, title: 'Growth', desc: 'Unit economics', active: false },
                { n: 6, title: 'Funding', desc: 'Catalytic grant pitch', active: false }
              ].map(st => (
                <div key={st.n} className={`p-3 rounded-xl border text-center ${
                  st.active
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                    : 'bg-slate-800/40 border-slate-800 opacity-60'
                }`}>
                  <span className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1.5 ${
                    st.active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {st.n}
                  </span>
                  <span className="text-xs font-bold text-white block">{st.title}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{st.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Entrepreneurship Academy Courses */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">RAP Enterprise Learning Hub</h3>
                <p className="text-xs text-slate-400">Curated modules required to advance through incubator stages</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">1 of 3 Completed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-750 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{course.duration}</span>
                      {course.completed && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Icon name="check" className="w-3.5 h-3.5" /> Certified
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{course.title}</h4>
                    <span className="text-[10px] text-slate-400 block mt-1">Instructor: {course.instructor}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-white">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
