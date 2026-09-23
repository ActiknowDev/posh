/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import "./services/interceptor";
import React, { useState, useEffect } from 'react';
import {  ShieldCheck, HelpCircle, Users, Settings, RefreshCw, Layout, GraduationCap, FileSpreadsheet, Lock, FileText 
} from 'lucide-react';
import TrainingModule from './components/TrainingModule';
import AdminPortal from './components/AdminPortal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import { getConfigs } from "./services/user";

const params = new URLSearchParams(window.location.search);
const employeeId = params.get("employeeId");
const role = params.get("role");

const roles = {
    4: "Manager",
    5: "Tech Lead",
    6: "BD",
    7: "Developer",
    8: "Designer",
    9: "Reporting",
    10: "All Project",
    11: "Support",
    12: "Management",
    13: "Expertal"
};
const userRoles = role
    ? role.split(",").map(Number)
    : [];
const hasAdminAccess = userRoles.includes(4) //|| userRoles.includes(12);

// Seeding Default POSH configurations (Actiknow compliance defaults)
const DEFAULT_CONFIG = {
  companyName: 'Actiknow Consulting',
  policyLink: 'https://compliance.actiknow.com/posh_framework_actiknow.pdf',
  icEmail: 'Posh@actiknow.com',
  presidingOfficer: 'Deepika Malhotra (Vice President) – Committee Head',
  externalMember: 'Anindita Mitra (Advocate) – External Committee Member',
  icMembers: [
    'Sumit Jhunjhunwala (Director) – Member',
    'Twinkle Gupta (Sr. Engagement Manager) – Member',
    'Himani Duhan (Sr. Engagement Manager) – Member / Coordinator'
  ],
  hrContactName: 'Himani Duhan (Coordinator)',
  hrContactEmail: 'Posh@actiknow.com',
  passingScore: 4 // Standard 80% passing mark
};

const DEFAULT_SESSION = {
  name: '',
  email: '',
  employeeId: employeeId,
  department: 'Web App Development',
  role: role,//'Software Engineer',
  city: 'Delhi',//'Bengaluru',
  isRegistered: false,
  currentSlideIndex: 0,
  completedSlides: [],
  quizAnswers: {},
  quizCompleted: false,
  quizScore: 0,
  acknowledged: false,
  signatureSubmitted: false,
};

export default function App() {
  const [viewMode, setViewMode] = useState('training');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [session, setSession] = useState(DEFAULT_SESSION);
  const [completions, setCompletions] = useState([]);
  const [showICDirectoryModal, setShowICDirectoryModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  // Load state from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('posh_config');
    const savedSession = localStorage.getItem('posh_session');
    const savedCompletions = localStorage.getItem('posh_completions');

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Force update to the new Deepika Malhotra / Actiknow roster if running on stale seed names
        if (!parsed.presidingOfficer || !parsed.presidingOfficer.includes('Deepika Malhotra') || parsed.icEmail !== 'Posh@actiknow.com') {
          getConfigs().then((config) => {
              const usersData = config.data.data
              setConfig(usersData);
              localStorage.setItem('posh_config', JSON.stringify(usersData));
          });
          // setConfig(DEFAULT_CONFIG);
          // localStorage.setItem('posh_config', JSON.stringify(DEFAULT_CONFIG));
        } else {
          setConfig(parsed);
        }
      } catch (e) {
        console.error(e);
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      localStorage.setItem('posh_config', JSON.stringify(DEFAULT_CONFIG));
    }

    if (savedSession) {
      try { setSession(JSON.parse(savedSession)); } catch (e) { console.error(e); }
    }

    if (savedCompletions) {
      try { setCompletions(JSON.parse(savedCompletions)); } catch (e) { console.error(e); }
    } else {
      // Prompt with empty array by default
      localStorage.setItem('posh_completions', JSON.stringify([]));
    }
  }, []);

  // Save changes to localStorage helper
  const handleUpdateConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('posh_config', JSON.stringify(newConfig));
  };

  const handleUpdateSession = (newSession) => {
    setSession(newSession);
    localStorage.setItem('posh_session', JSON.stringify(newSession));
  };

  const handleAddCompletion = (newRecord) => {
    const updated = [newRecord, ...completions];
    setCompletions(updated);
    localStorage.setItem('posh_completions', JSON.stringify(updated));
  };

  const handleClearCompletions = () => {
    if (window.confirm('Are you absolutely sure you want to clear all compliance records from local storage? This cannot be undone.')) {
      setCompletions([]);
      localStorage.setItem('posh_completions', JSON.stringify([]));
    }
  };

  // Seed sample mock ledger logins representing various departments & scores
  const handleSeedMockData = () => {
    const mockStaff = [
      {
        id: 'REC-349A',
        name: 'Aishwarya Nair',
        email: 'aishwarya.nair@actiknow.com',
        employeeId: 'EMP-1104',
        department: 'Product Management',
        role: 'Director of Product',
        city: 'Mumbai',
        quizScore: 5,
        completedAt: '12/03/2026 10:45 AM',
        acknowledged: true
      },
      {
        id: 'REC-558B',
        name: 'Rohan Deshmukh',
        email: 'rohan.deshmukh@actiknow.com',
        employeeId: 'EMP-1402',
        department: 'Web App Development',
        role: 'Staff Devops Engineer',
        city: 'Pune',
        quizScore: 4,
        completedAt: '14/03/2026 02:15 PM',
        acknowledged: true
      },
      {
        id: 'REC-892C',
        name: 'Meera Iyer',
        email: 'meera.iyer@actiknow.com',
        employeeId: 'EMP-1823',
        department: 'Human Resources',
        role: 'Senior HR Specialist',
        city: 'Bengaluru',
        quizScore: 5,
        completedAt: '15/03/2026 11:30 AM',
        acknowledged: true
      },
      {
        id: 'REC-441D',
        name: 'Arjun Malhotra',
        email: 'arjun.malhotra@actiknow.com',
        employeeId: 'EMP-1156',
        department: 'Sales & Marketing',
        role: 'VP Sales India',
        city: 'Delhi NCR',
        quizScore: 4,
        completedAt: '15/03/2026 04:50 PM',
        acknowledged: true
      },
      {
        id: 'REC-107E',
        name: 'Priyanka Sen',
        email: 'priyanka.sen@actiknow.com',
        employeeId: 'EMP-1033',
        department: 'Operations',
        role: 'Operations Lead Manager',
        city: 'Hyderabad',
        quizScore: 3,
        completedAt: '16/03/2026 09:12 AM',
        acknowledged: true
      },
      {
        id: 'REC-994F',
        name: 'Siddharth Saxena',
        email: 'siddharth.saxena@actiknow.com',
        employeeId: 'EMP-1290',
        department: 'Web App Development',
        role: 'Lead FullStack Engineer',
        city: 'Bengaluru',
        quizScore: 5,
        completedAt: '16/03/2026 01:22 PM',
        acknowledged: true
      },
      {
        id: 'REC-301G',
        name: 'Anjali Sharma',
        email: 'anjali.sharma@actiknow.com',
        employeeId: 'EMP-1502',
        department: 'Finance',
        role: 'Direct Tax Specialist',
        city: 'Chennai',
        quizScore: 4,
        completedAt: '16/03/2026 03:40 PM',
        acknowledged: true
      },
      {
        id: 'REC-229H',
        name: 'Vikram Joshi',
        email: 'vikram.joshi@actiknow.com',
        employeeId: 'EMP-1088',
        department: 'Human Resources',
        role: 'Recruiter Analyst',
        city: 'Mumbai',
        quizScore: 4,
        completedAt: '16/03/2026 05:05 PM',
        acknowledged: true
      }
    ];

    setCompletions(mockStaff);
    localStorage.setItem('posh_completions', JSON.stringify(mockStaff));
  };
  const handleOriginalData = (userData) => {
    setCompletions(userData);
    localStorage.setItem('posh_completions', JSON.stringify(userData));
  };

  const handleResetSession = () => {
    // if (window.confirm('Do you want to logout? This will clear your current employee training session and acknowledgment signature.')) {
    //   const cleanSession = DEFAULT_SESSION
    //   setSession(cleanSession);
    //   localStorage.setItem('posh_session', JSON.stringify(cleanSession));
    //   setViewMode('training');
    // }
    if (window.confirm('Do you want to close this? This will clear your current employee training session and acknowledgment signature.')) {
      // sessionStorage.clear(); // or sessionStorage.removeItem("user");
      localStorage.setItem('posh_config', JSON.stringify(DEFAULT_CONFIG));
      localStorage.setItem('posh_session', JSON.stringify(DEFAULT_SESSION));
      localStorage.setItem('posh_completions', JSON.stringify([]));

      window.close();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col justify-between selection:bg-accent selection:text-white">
      
      {/* Absolute Header with mode switcher */}
      <header className="sticky top-0 bg-white text-slate-900 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent text-white font-bold flex items-center justify-center rounded-lg shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight uppercase font-display text-base block leading-none text-slate-900">Actiknow <span className="text-accent">POSH</span></span>
              <span className="text-[9px] text-accent font-mono tracking-[0.2em] uppercase block mt-1 font-bold">COMPLIANCE SHIELD</span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 rounded-lg">
            {/* { session.mustRetakeTraining && ( */}
              <button
                onClick={() => setViewMode('training')}
                className={`px-3 py-2.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-md ${viewMode === 'training' ? 'bg-accent text-white shadow-sm' : 'text-slate-600 hover:text-accent'}`}
                id="switch-training-mode-btn"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
              </button>

              {session.isUserLogin && (<button
                onClick={() => setViewMode('dasboard')}
                className={`px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-md ${viewMode === 'dasboard' ? 'bg-accent text-white shadow-sm' : 'text-slate-600 hover:text-accent'}`}
                id="switch-admin-mode-btn"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>)}

            {/* )} */}
            { hasAdminAccess && (
              <button
                onClick={() => setViewMode('admin')}
                className={`px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-md ${viewMode === 'admin' ? 'bg-accent text-white shadow-sm' : 'text-slate-600 hover:text-accent'}`}
                id="switch-admin-mode-btn"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            )}
            </div>

            {/* Global Directory button always available */}
            <button
              onClick={() => setShowICDirectoryModal(true)}
              className="px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-accent bg-[#800000]/5 text-accent hover:bg-[#800000] hover:text-white transition-all rounded-md flex items-center gap-1.5 cursor-pointer shadow-2xs text-center"
              id="always-access-ic-btn"
              title="Show official POSH Committee contact list and email hotline"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>IC Contacts</span>
            </button>

          </div>

          {/* Training session resets */}
          {session.isRegistered && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetSession}
                className="text-[10px] text-slate-500 hover:text-accent font-mono bg-white border border-slate-400 shadow-4xs px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1 rounded-md"
                id="reset-training-session-btn"
              >
                {/* <RefreshCw className="w-3 h-3" /> */}
                {/* <span>Restart Session</span> */}
                <span>Close</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main viewport area */}
      {/* <main className="flex-1 bg-slate-50">
        {viewMode === 'training' ? (
          <TrainingModule 
            userSession={session}
            onChangeSession={handleUpdateSession}
            config={config}
            onAddCompletion={handleAddCompletion}
          />
        ) : (
          <AdminPortal
            config={config}
            onUpdateConfig={handleUpdateConfig}
            completions={completions}
            onAddCompletion={handleAddCompletion}
            onClearCompletions={handleClearCompletions}
            onSeedMockData={handleSeedMockData}
            handleOriginalData={handleOriginalData}
          />
        )}
      </main> */}
      <main className="flex-1 bg-slate-50">

        {viewMode === "training" && (
            <TrainingModule
            userSession={session}
            onChangeSession={handleUpdateSession}
            config={config}
            onAddCompletion={handleAddCompletion}
            goToLogin={() => setViewMode("login")}
            // onLoginSuccess={() => setViewMode("admin")}
            onLoginSuccess={() => setViewMode("training")}
            viewMode={viewMode}
            />
        )}

        {viewMode === "login" && (
            <Login
            onLoginSuccess={() => setViewMode("admin")}
            goToSignup={() => setViewMode("training")}
            onChangeSession={handleUpdateSession}
            />
        )}
        {/* {viewMode === "admin" && (
            session.isUserLogin ? (
                <Dashboard
                    userSession={session}
                    onLogout={() => setViewMode("training")}
                />
            ) : (
                <AdminPortal
                    config={config}
                    onUpdateConfig={handleUpdateConfig}
                    completions={completions}
                    onAddCompletion={handleAddCompletion}
                    onClearCompletions={handleClearCompletions}
                    onSeedMockData={handleSeedMockData}
                    handleOriginalData={handleOriginalData}
                />
            )
        )} */}
        { (viewMode === "dasboard" && session.isUserLogin) && (
            <Dashboard
            userSession={session}
            onLogout={() => setViewMode("training")}
            />
        )}

        {viewMode === "admin" && (
            <AdminPortal
            config={config}
            onUpdateConfig={handleUpdateConfig}
            completions={completions}
            onAddCompletion={handleAddCompletion}
            onClearCompletions={handleClearCompletions}
            onSeedMockData={handleSeedMockData}
            handleOriginalData={handleOriginalData}
            />
        )}

        </main>

      {/* Corporate compliance footer */}
      <footer className="bg-white text-slate-400 border-t border-slate-200 py-4.5 text-center text-[10px] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} {config.companyName}. All Rights Reserved.</span>
          <div className="flex gap-4">
            <span className="text-accent font-bold uppercase">POSH Act, 2013 compliant</span>
            <span>Local State: Certified</span>
          </div>
        </div>
      </footer>

      {/* Persistent IC directory Modal overlay */}
      {showICDirectoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowICDirectoryModal(false)}>
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl text-left animate-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#800000]/5 rounded text-[#800000]">
                  <Users className="w-5 h-5 text-[#800000]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 font-sans text-sm md:text-base uppercase tracking-wide">Internal Committee</h3>
                  <p className="text-[9px] text-[#800000] font-mono tracking-widest uppercase font-bold mt-0.5">Actiknow Standing Roster</p>
                </div>
              </div>
              <button 
                onClick={() => setShowICDirectoryModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base p-1.5 hover:bg-slate-50 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Under Sections 4 and 19 of the <strong className="text-slate-800">POSH Act 2013</strong>, Actiknow maintains this certified roster for all compliance, query escalations, and incident inquiries:
            </p>

            <div className="space-y-2.5 pt-1 text-xs font-sans">
              <div className="p-3 bg-[#800000]/5 border border-rose-100 rounded-lg flex flex-col">
                <span className="font-extrabold text-[#800000] text-[9px] uppercase tracking-wider block mb-0.5 font-mono">Presiding Officer</span>
                <span className="text-slate-900 font-bold">{config.presidingOfficer || 'Deepika Malhotra (Vice President) – Committee Head'}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col">
                <span className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5 font-mono">External Member</span>
                <span className="text-slate-900 font-bold">{config.externalMember || 'Anindita Mitra (Advocate) – External Committee Member'}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col">
                <span className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5 font-mono">Other Standing Members</span>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-600 font-medium">
                  {config.icMembers && config.icMembers.length > 0 ? (
                    config.icMembers.map((member, i) => <li key={i}>{member}</li>)
                  ) : (
                    <>
                      <li>Sumit Jhunjhunwala (Director) – Member</li>
                      <li>Twinkle Gupta (Sr. Engagement Manager) – Member</li>
                      <li>Himani Duhan (Sr. Engagement Manager) – Member / Coordinator</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="p-3 bg-[#800000]/5 border border-[#800000]/15 rounded-lg flex flex-col space-y-1">
                <span className="font-extrabold text-[#800000] text-[9px] uppercase tracking-wider font-mono">Official E-mail Helpline</span>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-900 font-mono font-bold select-all underline text-xs break-all">{config.icEmail || 'Posh@actiknow.com'}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase font-mono shrink-0">Safe & Monitored</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col space-y-1">
                <span className="font-extrabold text-[#800000] text-[9px] uppercase tracking-wider font-mono">Official Hotline Phone</span>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-900 font-mono font-bold text-xs select-all">+91 11 450 527 11</span>
                  <span className="bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase font-mono shrink-0">Direct Call</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowICDirectoryModal(false)}
              className="w-full py-2.5 bg-[#800000] hover:bg-[#800000]/95 text-white font-bold uppercase text-xs tracking-wider rounded-lg transition-all cursor-pointer block mt-4"
            >
              Close Directory
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
