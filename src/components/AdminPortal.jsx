/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, Users, ClipboardCheck, ArrowDownToLine, 
  Search, RefreshCw, Layers, Database, Mail, ShieldAlert,
  Sliders, UserCheck, Trash2, Calendar, MapPin
} from 'lucide-react';

import { getUsers} from "./../services/user";

export default function AdminPortal({
  config,
  onUpdateConfig,
  completions,
  onAddCompletion,
  onClearCompletions,
  onSeedMockData,
  handleOriginalData
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const [companyName, setCompanyName] = useState(config.companyName);
  const [presidingOfficer, setPresidingOfficer] = useState(config.presidingOfficer);
  const [externalMember, setExternalMember] = useState(config.externalMember);
  const [icMembersText, setIcMembersText] = useState(config.icMembers.join(', '));
  const [icEmail, setIcEmail] = useState(config.icEmail);
  const [hrContactName, setHrContactName] = useState(config.hrContactName);
  const [hrContactEmail, setHrContactEmail] = useState(config.hrContactEmail);
  const [policyLink, setPolicyLink] = useState(config.policyLink);
  const [passingScore, setPassingScore] = useState(config.passingScore);
  const [totalAssignedRef, setTotalAssignedRef] = useState(0);

  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const updated = {
      companyName,
      presidingOfficer,
      externalMember,
      icMembers: icMembersText.split(',').map((m) => m.trim()).filter(Boolean),
      icEmail,
      hrContactName,
      hrContactEmail,
      policyLink,
      passingScore: Number(passingScore)
    };
    onUpdateConfig(updated);
    showToast('IC & Module Configuration Saved Successfully!');
  };

  const handleExportCSV = () => {
    if (completions.length === 0) {
      showToast('No compliance records to export yet.');
      return;
    }
    
    const headers = ['Record ID', 'Employee Name', 'Email', 'Employee ID', 'Department', 'Role', 'Location/City', 'Quiz Score', 'Completion Date', 'Acknowledgement Status'];
    const rows = completions.map((r) => [
        String(r.id ?? ''),
        r.name ?? '',
        r.email ?? '',
        r.employeeId ?? '',
        r.department ?? '',
        r.role ?? '',
        r.city ?? '',
        `${r.quizScore ?? 0}/5`,
        r.completedAt ?? '',
        r.acknowledged ? 'Signed' : 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `POSH_Compliance_Report_${new Date().getFullYear()}_${new Date().getMonth() + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Compliance Report Exported!');
  };

//   const totalAssignedRef = 40;
  const completedHeadcount = completions.length;
  const pendingHeadcount = Math.max(0, totalAssignedRef - completedHeadcount);
  const completionRate = Math.round((completedHeadcount / totalAssignedRef) * 100);

  const departments = ['Web App Development','BI','Accounts','Mobile App Development','Human Resources','Sales & Marketing','Operations','Product Management','Others'];
  const deptCompletions = departments.reduce((acc, dept) => {
    acc[dept] = completions.filter((c) => c.department === dept).length;
    return acc;
  }, {});

  const cities = ['Delhi', 'Gurgaon'];
  const cityCompletions = cities.reduce((acc, city) => {
    acc[city] = completions.filter((c) => c.city === city).length;
    return acc;
  }, {});

  const avgQuizScore = completions.length > 0 
    ? (completions.reduce((acc, c) => acc + c.quizScore, 0) / completions.length).toFixed(1)
    : '0.0';

  const filteredCompletions = completions.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || r.department === deptFilter;
    const matchesCity = cityFilter === 'all' || r.city === cityFilter;
    return matchesSearch && matchesDept && matchesCity;
  });

   useEffect(() => {
        getUsers().then((users) => {
            console.log("Fetched users:", users.data.data);
            const usersData = users.data.data
            handleOriginalData(usersData);
            setTotalAssignedRef(usersData.length);
            // localStorage.setItem('posh_completions', JSON.stringify(users.data.data));
        });    
    }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-white select-none">
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black border border-accent text-white px-4 py-3 rounded-none shadow-2xl flex items-center gap-2 z-50 text-xs font-mono uppercase tracking-wider animate-in fade-in slide-in-from-bottom-5 duration-200">
          <ClipboardCheck className="w-4 h-4 text-accent" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-[#050505] text-white border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-accent/10 text-accent text-[9px] px-2.5 py-0.5 rounded-none font-bold border border-accent/30 tracking-widest font-mono uppercase">
                  COMPLIANCE AUDIT PORTAL
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">POSH ACT 2013 STATUTORY REPORT</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight font-display text-white">
                POSH Audit Panel
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Oversee compliance certifications, monitor quiz analytics, and update committee directories for <span className="text-accent font-bold">{config.companyName}</span>
              </p>
            </div>
            
            {/* <div className="flex items-center gap-2 justify-start md:justify-end">
              <button 
                onClick={onSeedMockData} 
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 font-mono font-bold text-[10px] tracking-wider rounded-none uppercase flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                title="Populates mock staff logs for reporting representation"
              >
                <Database className="w-3.5 h-3.5 text-accent" />
                <span>Seed Sample Data</span>
              </button>
              <button 
                onClick={onClearCompletions} 
                className="px-3.5 py-2 bg-rose-950/20 hover:bg-rose-950/45 text-rose-300 font-mono font-bold text-[10px] tracking-wider rounded-none uppercase flex items-center gap-1.5 transition border border-rose-900/40 cursor-pointer"
                title="Clears all compliance training submissions"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </button>
            </div> */}
          </div>

          <div className="flex flex-wrap gap-2 mt-8 border-t border-white/10 pt-5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeTab === 'overview' ? 'bg-accent text-black font-extrabold border-0' : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10 font-bold'}`}
              id="admin-overview-tab"
            >
              ⚡ Compliance Overview
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeTab === 'records' ? 'bg-accent text-black font-extrabold border-0' : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10 font-bold'}`}
              id="admin-records-tab"
            >
              📜 Completion Ledger ({completions.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all rounded-none ${activeTab === 'settings' ? 'bg-accent text-black font-extrabold border-0' : 'text-slate-400 hover:text-white border border-transparent hover:border-white/10 font-bold'}`}
              id="admin-settings-tab"
            >
              ⚙️ IC & Policy Setup
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-[#0A0A0A] p-5 rounded-none border border-white/10 shadow-xs relative overflow-hidden group">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Active Headcount</span>
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-4xl font-extrabold text-[#CCFF00] font-display">{totalAssignedRef}</div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">TOTAL ACTIVE PERSONNEL COHORT</p>
              </div>

              <div className="bg-[#0A0A0A] p-5 rounded-none border border-white/10 shadow-xs relative overflow-hidden group">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Training Completed</span>
                  <UserCheck className="w-4 h-4 text-[#CCFF00]" />
                </div>
                <div className="text-4xl font-extrabold text-[#CCFF00] font-display">{completedHeadcount}</div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">{pendingHeadcount} EMPLOYEES OUTSTANDING</p>
              </div>

              <div className="bg-[#0A0A0A] p-5 rounded-none border border-white/10 shadow-xs relative overflow-hidden group">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Compliance Level</span>
                  <div className="w-2 h-2 bg-[#CCFF00]"></div>
                </div>
                <div className="text-4xl font-extrabold text-white font-display">{completionRate}%</div>
                <div className="w-full bg-white/10 rounded-none h-1.5 mt-3">
                  <div 
                    className="bg-[#CCFF00] h-1.5 rounded-none transition-all duration-500" 
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-5 rounded-none border border-white/10 shadow-xs relative overflow-hidden group">
                <div className="flex justify-between items-center text-slate-400 mb-2">
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Average Test Score</span>
                  <span className="text-[9px] font-mono bg-white/10 text-white px-1.5 py-0.5 rounded-none font-semibold">MAX 5.0</span>
                </div>
                <div className="text-4xl font-extrabold text-[#CCFF00] font-display">{avgQuizScore}</div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">REQUIRED SCORE: {config.passingScore}.0 / 5.0</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              
              <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-extrabold text-white font-display text-base uppercase tracking-tight">Department Statistics</h3>
                    <p className="text-[10px] text-slate-400 font-mono">CERTIFIED INDIVIDUALS PER CORE OFFICE</p>
                  </div>
                  <Layers className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-4 pt-2">
                  {departments.map((dept) => {
                    const count = deptCompletions[dept] || 0;
                    const maxVal = Math.max(...Object.values(deptCompletions), 1);
                    const barWidthPercent = Math.max((count / maxVal) * 100, 4);

                    return (
                      <div key={dept} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 font-bold">{dept.toUpperCase()}</span>
                          <span className="font-black text-[#CCFF00]">{count} Certified</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-white/10 h-2.5 rounded-none">
                            <div 
                              className="bg-[#CCFF00] h-2.5 rounded-none transition-all duration-500"
                              style={{ width: `${barWidthPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-white font-display text-base uppercase tracking-tight">Regional Distribution</h3>
                      <p className="text-[10px] text-slate-400 font-mono">OFFICE SITE ROSTER BREAKDOWNS</p>
                    </div>
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>

                  {completions.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                      <span>NO RECORDS FOUND. CLICK SEED DATA TO POPULATE.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 py-2 text-left">
                      {cities.map((city) => {
                        const count = cityCompletions[city] || 0;
                        const percentage = completions.length > 0 ? Math.round((count / completions.length) * 100) : 0;
                        return (
                          <div key={city} className="bg-white/5 p-3 rounded-none border border-white/10">
                            <span className="text-[9px] font-mono font-black text-slate-400 block tracking-widest uppercase">{city}</span>
                            <div className="flex items-baseline gap-1.5 mt-1.5">
                              <span className="text-xl font-extrabold text-[#CCFF00]">{count}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({percentage}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="bg-white/5 p-3.5 rounded-none border border-white/10 flex items-start gap-2.5 text-xs text-left">
                    <ShieldAlert className="w-5 h-5 text-[#CCFF00] shrink-0" />
                    <div className="font-mono text-[11px] leading-relaxed">
                      <strong className="text-white block mb-0.5">STATUTORY ANNUITY FILINGS:</strong>
                      <span className="text-slate-400">
                        Under Indian POSH Law Section 21, companies must document active IC inquiries & training coverages in an official Annual Report uploaded directly with the district commission.
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {completions.length === 0 && (
              <div className="bg-accent/5 rounded-none p-6 border border-accent/20 text-center space-y-3">
                <Database className="w-10 h-10 text-accent mx-auto" />
                <h4 className="font-extrabold text-white font-display text-base uppercase tracking-wider">No compliance listings populated yet</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto font-mono">
                  To view full analytical dashboards and complete rosters, you can use the "Seed Sample Data" button above to bulk-populate professional compliance records in your web sandbox.
                </p>
                <button 
                  onClick={onSeedMockData}
                  className="px-5 py-3 bg-accent hover:bg-accent/90 text-black rounded-none text-xs font-black uppercase tracking-wider transition cursor-pointer"
                  id="seed-inside-card"
                >
                  Populate Mock Records
                </button>
              </div>
            )}

          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-[#0A0A0A] rounded-none border border-white/10 shadow-2xl overflow-hidden text-left">
            
            <div className="p-5 border-b border-white/10 bg-[#050505] space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search ledger by Name, email or Employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-white/10 bg-white/5 text-white rounded-none text-xs font-mono w-full focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                  id="search-input"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-[#0A0A0A] text-white border border-white/10 px-3 py-2 text-xs font-mono rounded-none uppercase focus:ring-1 focus:ring-accent focus:outline-hidden"
                  id="dept-filter"
                >
                  <option value="all">Every Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-[#0A0A0A] text-white border border-white/10 px-3 py-2 text-xs font-mono rounded-none uppercase focus:ring-1 focus:ring-accent focus:outline-hidden"
                  id="city-filter"
                >
                  <option value="all">Every Location</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-extrabold text-xs rounded-none flex items-center gap-1.5 transition shadow-lg cursor-pointer uppercase tracking-wider"
                  id="export-csv-btn"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Export CSV Log</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white border-b border-white/10">
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300">Employee Particulars</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300">Reference ID</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300">Department</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300">Office Location</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300 text-center">Test Score</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300">Completed Date</th>
                    <th className="px-6 py-3.5 font-mono text-[10px] tracking-wider uppercase font-bold text-slate-300 text-center">Acknowledge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {filteredCompletions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500 font-mono uppercase text-xs">
                        <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        No compliant records match these query filters inside local storage.
                      </td>
                    </tr>
                  ) : (
                    filteredCompletions.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 bg-transparent border-b border-white/5">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-white text-sm leading-tight uppercase font-display">{r.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{r.email}</div>
                          <div className="text-[10px] text-accent font-semibold font-mono uppercase mt-0.5">{r.role}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{r.employeeId}</td>
                        <td className="px-6 py-4">
                          <span className="bg-white/5 border border-white/10 text-white rounded-none px-2 py-0.5 font-mono font-bold text-[10px] uppercase">
                            {r.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#CCFF00]"></span>
                            <span>{r.city.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-none font-bold text-xs font-mono uppercase border ${r.quizScore >= config.passingScore ? 'bg-accent/10 text-accent border-accent/25' : 'bg-rose-950/20 text-rose-400 border-rose-900/30'}`}>
                            {r.quizScore} / 5
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-xs">
                          {r.completedAt}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider font-mono text-accent bg-accent/10 px-2.5 py-0.5 border border-accent/25 uppercase rounded-none">
                            Signed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#050505] text-[10px] text-slate-500 border-t border-white/10 font-mono flex flex-col md:flex-row justify-between items-center gap-2 uppercase tracking-wide">
              <span>Showing {filteredCompletions.length} of {completions.length} total completion logs</span>
              <span>Local storage database: OK</span>
            </div>

          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#0A0A0A] rounded-none border border-white/10 max-w-3xl mx-auto overflow-hidden text-left">
            <div className="bg-[#050505] p-5 text-white flex items-center gap-3 border-b border-white/10">
              <div className="p-2 bg-white/5 border border-white/10 rounded-none text-accent">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold font-display text-base uppercase tracking-wider">Internal Committee Configuration</h2>
                <p className="text-xs text-slate-400 font-mono">MANAGE MEMBERS, STATUTORY HELPLINES AND QUIZ SCORES</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Company Legal Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">IC Presiding Officer Name</label>
                  <input
                    type="text"
                    value={presidingOfficer}
                    onChange={(e) => setPresidingOfficer(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Must legally be a senior-level woman employee</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">External Member Name</label>
                  <input
                    type="text"
                    value={externalMember}
                    onChange={(e) => setExternalMember(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Legally required NGO specialized member or lawyer</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Internal Committee Helpline Email</label>
                  <input
                    type="email"
                    value={icEmail}
                    onChange={(e) => setIcEmail(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Other Committee Members (Comma separated)</label>
                <input
                  type="text"
                  value={icMembersText}
                  onChange={(e) => setIcMembersText(e.target.value)}
                  placeholder="e.g. Priyanjali Sen, Rajiv Duggal, Shalini Saxena"
                  className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">HR POSH Coordinator Name</label>
                  <input
                    type="text"
                    value={hrContactName}
                    onChange={(e) => setHrContactName(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">HR POSH Coordinator Email</label>
                  <input
                    type="email"
                    value={hrContactEmail}
                    onChange={(e) => setHrContactEmail(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Company POSH Policy Hyperlink</label>
                  <input
                    type="text"
                    value={policyLink}
                    onChange={(e) => setPolicyLink(e.target.value)}
                    className="w-full text-xs font-semibold bg-white/5 border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Final Quiz Passing Score Threshold</label>
                  <select
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full text-xs font-bold bg-[#0A0A0A] border border-white/10 text-white p-3 rounded-none focus:ring-1 focus:ring-accent focus:outline-hidden"
                  >
                    <option value={3}>At least 3 out of 5 correct (60%)</option>
                    <option value={4}>At least 4 out of 5 correct (80%) [RECOMMENDED]</option>
                    <option value={5}>Perfect 5 out of 5 score required (100%)</option>
                  </select>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/25 px-4 py-3 rounded-none text-xs leading-relaxed text-accent font-semibold font-mono uppercase tracking-wide">
                🔔 SAVITY NOTICE: UPDATING THIS DIRECTORY RE-COMPILES ALL TRAINING SLIDES DYNAMICALLY AND UPDATES VERIFYING CERTIFICATES INSTANTLY.
              </div>

              <div className="flex justify-end pt-5 border-t border-white/10">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-accent hover:bg-accent/90 text-black font-extrabold text-xs uppercase tracking-wider rounded-none shadow-lg transition cursor-pointer"
                  id="save-config-btn"
                >
                  Save Committee settings
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
