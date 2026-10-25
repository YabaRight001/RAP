import React, { useState } from 'react';
import { Icon } from '../icons.jsx';

export function SkillsTab({ data, setActiveTab, onOpenSendTransfer }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState({
    'c-web': { progress: 75, completed: false },
    'c-fin': { progress: 100, completed: true },
    'c-mobile': { progress: 35, completed: false },
    'c-sales': { progress: 80, completed: false }
  });
  const [toastMsg, setToastMsg] = useState(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'tech', label: '💻 Tech Skills' },
    { id: 'personal', label: '🧠 Personal Dev' },
    { id: 'affiliate', label: '📈 Affiliate & Sales' },
    { id: 'certified', label: '🏆 My Certifications' }
  ];

  const courses = [
    {
      id: 'c-web',
      category: 'tech',
      title: 'Full-Stack Web & AI App Development',
      badge: 'High In Demand',
      description: 'Master React, Node.js, and modern AI API integration. Build bank-grade web applications from Nigeria for global clients.',
      duration: '8 Weeks • 24 Lessons',
      level: 'Beginner to Intermediate',
      instructor: 'Tunde Adeleke (Senior Lead Engineer)',
      tools: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'AI APIs'],
      modules: [
        'Module 1: Modern JavaScript & ES6 Fundamentals',
        'Module 2: React State, Components & Hooks Architecture',
        'Module 3: Full-Stack APIs & Bank-Grade Security',
        'Module 4: Deploying on Cloud & Building with AI'
      ]
    },
    {
      id: 'c-mobile',
      category: 'tech',
      title: 'Mobile App Engineering (React Native & Flutter)',
      badge: 'Trending Tech',
      description: 'Create lightning-fast Android & iOS fintech applications. Learn biometric auth, local storage, push notifications, and payment gateways.',
      duration: '6 Weeks • 18 Lessons',
      level: 'Intermediate',
      instructor: 'Chisom Obi (Mobile Architecture Specialist)',
      tools: ['React Native', 'Flutter', 'Expo', 'Fintech APIs'],
      modules: [
        'Module 1: Mobile UI/UX & Responsive Layouts',
        'Module 2: Biometrics, FaceID & State Management',
        'Module 3: Payment Gateway & Push Notifications',
        'Module 4: Publishing to Google Play Store & iOS TestFlight'
      ]
    },
    {
      id: 'c-uiux',
      category: 'tech',
      title: 'Fintech UI/UX & Product Design System',
      badge: 'Creative Tech',
      description: 'Design mobile banking and digital wallet interfaces using Figma. Master micro-animations, user flows, and Nigerian design patterns.',
      duration: '5 Weeks • 15 Lessons',
      level: 'All Levels',
      instructor: 'Amaka Eze (Product Designer)',
      tools: ['Figma', 'Prototyping', 'Design Systems', 'Design Tokens'],
      modules: [
        'Module 1: Fundamentals of Fintech User Psychology',
        'Module 2: Building Scalable Design Systems in Figma',
        'Module 3: High-Fidelity Interactive Wireframing',
        'Module 4: Design Handoff & Developer Collaboration'
      ]
    },
    {
      id: 'c-data',
      category: 'tech',
      title: 'Data Analytics & AI Automation for Business',
      badge: 'Future of Work',
      description: 'Learn SQL, Python data manipulation, automated reporting, and prompt engineering to multiply your daily work efficiency.',
      duration: '6 Weeks • 20 Lessons',
      level: 'Beginner Friendly',
      instructor: 'Ibrahim Danjuma (Data Science Lead)',
      tools: ['Python', 'SQL', 'Excel Advanced', 'OpenAI'],
      modules: [
        'Module 1: Data Wrangling & Excel Advanced Analytics',
        'Module 2: SQL Databases & Financial Querying',
        'Module 3: Python for Automated Data Scripts',
        'Module 4: AI Prompt Engineering for Business Growth'
      ]
    },
    {
      id: 'c-fin',
      category: 'personal',
      title: 'Financial Literacy & Wealth Preservation (70/30 Rule)',
      badge: 'Certified Essential',
      description: 'Understand money, inflation protection in Nigeria, compulsory savings discipline, compound interest, and personal budgeting.',
      duration: '3 Weeks • 12 Lessons',
      level: 'Foundation',
      instructor: 'Dr. Ngozi Balogun (Economist & Wealth Advisor)',
      tools: ['70/30 Wealth Formula', 'Budgeting Tool', 'Compound Growth'],
      modules: [
        'Module 1: The Psychology of Money & Saving in Naira',
        'Module 2: The RAP 70/30 Compulsory Savings Engine',
        'Module 3: Hedging Against Inflation & Currency Devaluation',
        'Module 4: Creating Long-Term Generational Prosperity'
      ]
    },
    {
      id: 'c-sales',
      category: 'affiliate',
      title: 'High-Converting Affiliate Marketing & WhatsApp Funnels',
      badge: 'Direct Monetization',
      description: 'Turn your WhatsApp status and network into a daily income engine. Step-by-step scripts and tactics to hit your 25 qualifying affiliates.',
      duration: '4 Weeks • 14 Lessons',
      level: 'All Levels',
      instructor: 'Emeka Chukwu (Top Growth Affiliate)',
      tools: ['WhatsApp Business', 'Copywriting Scripts', 'Audience Growth'],
      modules: [
        'Module 1: Crafting High-Converting WhatsApp Broadcasts',
        'Module 2: The Art of Honest Recommendation & Referral',
        'Module 3: Converting Inquiries into Active Bank Accounts',
        'Module 4: Scaling to RAP Growth Partner (20% Commission)'
      ]
    },
    {
      id: 'c-speak',
      category: 'personal',
      title: 'Executive Public Speaking & Persuasive Pitching',
      badge: 'Leadership',
      description: 'Overcome stage anxiety, master business storytelling, and deliver persuasive presentations that win clients and investors.',
      duration: '4 Weeks • 10 Lessons',
      level: 'Intermediate',
      instructor: 'Folake Alabi (Keynote Speaker)',
      tools: ['Storytelling Framework', 'Pitch Decks', 'Vocal Presence'],
      modules: [
        'Module 1: Voice Projection & Confidence On Camera',
        'Module 2: The 3-Minute Elevator Pitch Structure',
        'Module 3: Handling Objections with Grace & Clarity',
        'Module 4: Pitching for Startup & Incubator Grants'
      ]
    },
    {
      id: 'c-ent',
      category: 'personal',
      title: 'Nigerian Business Incubation & CAC Enterprise Setup',
      badge: 'Incubator Pathway',
      description: 'Register your enterprise, establish corporate governance, model your cash flows, and qualify for RAP startup incubation funding.',
      duration: '6 Weeks • 18 Lessons',
      level: 'Advanced',
      instructor: 'Engr. Babajide Williams (Incubator Director)',
      tools: ['CAC Registration', 'Unit Economics', 'Venture Modeling'],
      modules: [
        'Module 1: Legal Registration & Nigerian Corporate Affairs',
        'Module 2: Testing Market Demand with Low Budget',
        'Module 3: Financial Cashflow & Unit Economics',
        'Module 4: Pitching to the RAP Venture Selection Committee'
      ]
    }
  ];

  const handleCompleteModule = (courseId) => {
    setEnrolledCourses(prev => {
      const current = prev[courseId] || { progress: 0, completed: false };
      const nextProgress = Math.min(100, current.progress + 25);
      const isNowCompleted = nextProgress >= 100;

      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      setToastMsg(isNowCompleted
        ? '🎓 Congratulations! You completed this course and earned your certificate!'
        : `✓ Progress updated: ${nextProgress}% complete! Keep going!`
      );
      setTimeout(() => setToastMsg(null), 4000);

      return {
        ...prev,
        [courseId]: { progress: nextProgress, completed: isNowCompleted }
      };
    });
  };

  const filteredCourses = courses.filter(c => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'certified') {
      return enrolledCourses[c.id]?.completed;
    }
    return c.category === selectedCategory;
  });

  return (
    <div className="wrap" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Top Banner Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(31, 166, 64, 0.08) 0%, rgba(29, 123, 232, 0.12) 100%)',
        borderColor: 'var(--green)',
        marginBottom: '24px'
      }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--green)' }}>RAP Academy • Youth Empowerment</div>
            <h1 style={{ fontSize: '26px', marginTop: '4px' }}>Tech Skills &amp; Personal Development</h1>
            <p className="sub" style={{ margin: '4px 0 0', maxWidth: '640px' }}>
              Learn high-income technical skills, personal finance, and entrepreneurship. Practice with hands-on projects, earn verified certifications, and monetize directly via RAP Bank.
            </p>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button
              onClick={() => setActiveTab('affiliate')}
              className="btn line sm"
              style={{ fontWeight: '700' }}
            >
              Affiliate Earnings
            </button>
            <button
              onClick={() => setSelectedCategory('certified')}
              className="btn pri sm"
            >
              <Icon name="sparkles" style={{ width: '16px', height: '16px' }} />
              <span>My Certifications ({Object.values(enrolledCourses).filter(x => x.completed).length})</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Summary */}
        <div className="grid4" style={{ marginTop: '20px' }}>
          <div style={{ background: 'var(--card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--mute)' }}>💻 TECH COURSES</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--blue)', marginTop: '2px' }}>Coding &amp; AI</div>
            <span style={{ fontSize: '12px', color: 'var(--mute)' }}>Web, Mobile, Data, UI/UX</span>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--mute)' }}>🧠 PERSONAL DEV</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--green)', marginTop: '2px' }}>Wealth &amp; Mindset</div>
            <span style={{ fontSize: '12px', color: 'var(--mute)' }}>70/30 Rule, Public Speaking</span>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--mute)' }}>📈 MONETIZATION</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--warn)', marginTop: '2px' }}>70% Payouts</div>
            <span style={{ fontSize: '12px', color: 'var(--mute)' }}>Affiliate commissions to bank</span>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--mute)' }}>🚀 INCUBATOR</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--ink)', marginTop: '2px' }}>Startup Funding</div>
            <span style={{ fontSize: '12px', color: 'var(--mute)' }}>Unlock at 25 affiliates</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`btn sm ${selectedCategory === cat.id ? 'pri' : 'line'}`}
            style={{ borderRadius: '99px', whiteSpace: 'nowrap', fontSize: '13px', padding: '8px 16px' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Catalog Grid */}
      <div className="grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filteredCourses.map(course => {
          const enroll = enrolledCourses[course.id];
          const isCompleted = enroll?.completed;
          const progress = enroll?.progress || 0;

          return (
            <div
              key={course.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderColor: isCompleted ? 'var(--green)' : undefined,
                position: 'relative'
              }}
            >
              <div>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span
                    className="badge"
                    style={{
                      background: course.category === 'tech' ? 'var(--blue-soft)' : course.category === 'personal' ? 'var(--green-soft)' : 'var(--wbg)',
                      color: course.category === 'tech' ? 'var(--blue)' : course.category === 'personal' ? 'var(--green)' : 'var(--warn)',
                      borderColor: 'transparent',
                      fontWeight: '800'
                    }}
                  >
                    {course.badge}
                  </span>
                  <span className="note" style={{ fontSize: '12px', fontWeight: '600' }}>
                    {course.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', lineHeight: '1.3', marginBottom: '8px' }}>
                  {course.title}
                </h3>

                <p className="note" style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
                  {course.description}
                </p>

                {/* Tools & Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {course.tools.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'var(--soft)',
                        color: 'var(--ink)',
                        fontWeight: '600'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Progress bar if in progress or completed */}
                {enroll && (
                  <div style={{ marginBottom: '14px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                    <div className="row" style={{ justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: isCompleted ? 'var(--green)' : 'var(--mute)' }}>
                        {isCompleted ? '✓ Completed & Certified' : 'Learning Progress'}
                      </span>
                      <b style={{ color: isCompleted ? 'var(--green)' : 'var(--blue)' }}>{progress}%</b>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: isCompleted ? 'var(--green)' : 'var(--blue)',
                          borderRadius: '99px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="row" style={{ gap: '8px' }}>
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="btn line sm"
                    style={{ flex: 1, fontSize: '13px' }}
                  >
                    View Syllabus
                  </button>
                  <button
                    onClick={() => handleCompleteModule(course.id)}
                    className={`btn sm ${isCompleted ? 'line' : 'pri'}`}
                    style={{ flex: 1, fontSize: '13px' }}
                  >
                    {isCompleted ? 'Review & Certificate' : enroll ? 'Advance Module' : 'Enroll Free'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus & Interactive Course Modal */}
      {activeCourseModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '580px', width: '92%' }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ color: 'var(--green)', borderColor: 'var(--green)' }}>
                  {activeCourseModal.badge}
                </span>
                <h3 style={{ fontSize: '20px', marginTop: '6px' }}>{activeCourseModal.title}</h3>
                <p className="note" style={{ fontSize: '13px' }}>Instructor: <b>{activeCourseModal.instructor}</b></p>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                style={{ background: 'transparent', border: 0, fontSize: '24px', cursor: 'pointer', color: 'var(--mute)' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--ink)', margin: '14px 0', lineHeight: '1.6' }}>
              {activeCourseModal.description}
            </p>

            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Course Modules &amp; Curriculum</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeCourseModal.modules.map((mod, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--soft)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{mod}</span>
                  <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: '700' }}>✓ Open</span>
                </div>
              ))}
            </div>

            <div className="row" style={{ marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="btn line sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCompleteModule(activeCourseModal.id);
                  setActiveCourseModal(null);
                }}
                className="btn pri sm"
              >
                Mark Module Complete (+25%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="toast">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
