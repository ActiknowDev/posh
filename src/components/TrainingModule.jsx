/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, 
  HelpCircle, Shield, FileSpreadsheet, Lock, AlertTriangle, 
  FileText, Activity, BookOpen, Signature, Award, ChevronRight,
  Info, Mail, Users
} from 'lucide-react';
import { ALL_SLIDES, SCENARIOS, QUIZ_QUESTIONS } from '../data/slides';
import Certificate from './Certificate';
import {saveUsers, completeTraining} from "./../services/user";

import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/user";

import Dashboard from './Dashboard';

export default function TrainingModule({
  userSession,
  onChangeSession,
  config,
  onAddCompletion,
  goToLogin,
  onLoginSuccess,
  viewMode
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = ALL_SLIDES[activeSlideIndex];

  const [clickedRevealIdx, setClickedRevealIdx] = useState([]);
  const [flippedCardIdx, setFlippedCardIdx] = useState([]);
  const [consentSliderVal, setConsentSliderVal] = useState(0);
  const [clickedTimelineIdx, setClickedTimelineIdx] = useState([]);
  const [checklistChecks, setChecklistChecks] = useState({});
  
  const humorPool = [
    { id: 'h1', text: '"Friday evening chai represents our real project manager."', correctCategory: 'safe' },
    { id: 'h2', text: 'Sharing a sexually colored meme or sticker in a team chat group.', correctCategory: 'risky' },
    { id: 'h3', text: 'Teasing a junior employee about their romantic status in team meetings.', correctCategory: 'risky' },
    { id: 'h4', text: '"The delayed espresso machine is causing heavy project latency."', correctCategory: 'safe' }
  ];
  const [sortedHumor, setSortedHumor] = useState({
    h1: 'pool',
    h2: 'pool',
    h3: 'pool',
    h4: 'pool'
  });
  const [humorChecked, setHumorChecked] = useState(false);
  const [humorSuccess, setHumorSuccess] = useState(false);

  const [selectedScenarioAnswers, setSelectedScenarioAnswers] = useState({});
  const [scenarioSubmitted, setScenarioSubmitted] = useState({});

  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [enrollForm, setEnrollForm] = useState({
    name: userSession.name,
    email: userSession.email,
    employeeId: userSession.employeeId,
    department: 'Web App Development',
    role: 'Software Engineer',
    city: 'Delhi'
  });

  useEffect(() => {
    setClickedRevealIdx([]);
    setFlippedCardIdx([]);
    setConsentSliderVal(0);
    setClickedTimelineIdx([]);
    setChecklistChecks({});
  }, [activeSlideIndex]);

  useEffect(() => {
    if (!userSession.isRegistered) {
      setActiveSlideIndex(0);
      setClickedRevealIdx([]);
      setFlippedCardIdx([]);
      setConsentSliderVal(0);
      setClickedTimelineIdx([]);
      setChecklistChecks({});
      setSortedHumor({
        h1: 'pool',
        h2: 'pool',
        h3: 'pool',
        h4: 'pool'
      });
      setHumorChecked(false);
      setHumorSuccess(false);
      setSelectedScenarioAnswers({});
      setScenarioSubmitted({});
      setActiveQuizQuestionIdx(0);
      setQuizSubmitted(false);
      setQuizScore(0);
      setEnrollForm({
        name: '',
        email: '',
        employeeId: '',
        department: 'Web App Development',
        role: '',//'Software Engineer',
        city: 'Delhi'
      });
    } else {
      setEnrollForm({
        name: userSession.name || '',
        email: userSession.email || '',
        employeeId: userSession.employeeId || '',
        department: userSession.department || 'Web App Development',
        role: userSession.role || '',//'Software Engineer',
        city: userSession.city || 'Delhi'
      });
    }
  }, [userSession.isRegistered]);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.email || !enrollForm.employeeId || !enrollForm.department || !enrollForm.role || !enrollForm.city) {
      alert('Please fill in all enrollment fields.');
      return;
    }
    const updated = {
      ...userSession,
      name: enrollForm.name,
      email: enrollForm.email,
      employeeId: enrollForm.employeeId,
      department: enrollForm.department,
      role: enrollForm.role,
      city: enrollForm.city,
      isRegistered: true,
      startedAt: new Date().toISOString()
    };        
    //onChangeSession(updated);
    try {
        const response = await saveUsers(updated);
        const savedUser = response.data.data;
        
        onChangeSession({
            ...updated,
            id: savedUser.id,
        });

    } catch (error) {
        console.error("Enrollment failed:", error);
        alert( error.response?.data?.message || "Unable to enroll. Please try again." );
    }

  };

  const isInteractionCompulsory = () => {
    switch (activeSlide.type) {
      case 'click-reveal':
        if (activeSlide.id === 'slide_2') return clickedRevealIdx.length < 4;
        if (activeSlide.id === 'slide_5') return clickedRevealIdx.length < 1;
        if (activeSlide.id === 'slide_14') return clickedRevealIdx.length < 3;
        if (activeSlide.id === 'slide_14_a') return clickedRevealIdx.length < 3;
        if (activeSlide.id === 'slide_16') return clickedRevealIdx.length < 4;
        if (activeSlide.id === 'slide_20') return clickedRevealIdx.length < 3;
        if (activeSlide.id === 'slide_23') return clickedRevealIdx.length < 1;
        if (activeSlide.id === 'slide_26') return clickedRevealIdx.length < 3;
        return false;
      
      case 'flip-cards':
        return flippedCardIdx.length < 5;
        
      case 'consent-slider':
        return consentSliderVal < 100;
        
      case 'timeline':
        if (activeSlide.id === 'slide_21') return clickedTimelineIdx.length < 5;
        if (activeSlide.id === 'slide_9') return clickedTimelineIdx.length < 4;
        return false;
        
      case 'drag-drop':
        return !humorSuccess;
        
      case 'checklist':
        return false;
        
      case 'quiz-single':
        return !selectedScenarioAnswers[activeSlide.id];
        
      case 'scenario':
        const activeScen = getActiveScenario();
        if (!activeScen) return false;
        return !scenarioSubmitted[activeScen.id];
        
      case 'final-quiz':
        return !userSession.quizCompleted;
        
      case 'acknowledgement':
        return !userSession.acknowledged;

      default:
        return false;
    }
  };

  const getActiveScenario = () => {
    if (activeSlide.id === 'slide_28') return SCENARIOS.find(s => s.id === 'scen_1');
    if (activeSlide.id === 'slide_29') return SCENARIOS.find(s => s.id === 'scen_2');
    if (activeSlide.id === 'slide_30') return SCENARIOS.find(s => s.id === 'scen_3');
    if (activeSlide.id === 'slide_31') return SCENARIOS.find(s => s.id === 'scen_4');
    if (activeSlide.id === 'slide_32') return SCENARIOS.find(s => s.id === 'scen_5');
    if (activeSlide.id === 'slide_33') return SCENARIOS.find(s => s.id === 'scen_6');
    if (activeSlide.id === 'slide_33_a') return SCENARIOS.find(s => s.id === 'scen_7');
    if (activeSlide.id === 'slide_33_b') return SCENARIOS.find(s => s.id === 'scen_8');
    return null;
  };

  const activeScenario = getActiveScenario();

  const handleNextSlide = () => {
    if (isInteractionCompulsory()) {
      return;
    }
    if (activeSlideIndex < ALL_SLIDES.length - 1) {
      setActiveSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    }
  };

  const handleRevealClick = (idx) => {
    if (!clickedRevealIdx.includes(idx)) {
      setClickedRevealIdx(prev => [...prev, idx]);
    }
  };

  const handleCardFlip = (idx) => {
    if (!flippedCardIdx.includes(idx)) {
      setFlippedCardIdx(prev => [...prev, idx]);
    }
  };

  const handleTimelineClick = (idx) => {
    if (!clickedTimelineIdx.includes(idx)) {
      setClickedTimelineIdx(prev => [...prev, idx]);
    }
  };

  const handleChecklistToggle = (key) => {
    setChecklistChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSingleQuizSelect = (id, selectOptId) => {
    setSelectedScenarioAnswers(prev => ({ ...prev, [id]: selectOptId }));
  };

  const handleScenarioSelect = (id, choiceId) => {
    setSelectedScenarioAnswers(prev => ({ ...prev, [id]: choiceId }));
  };

  const handleScenarioSubmit = (scenId) => {
    setScenarioSubmitted(prev => ({ ...prev, [scenId]: true }));
  };

  const handleMoveHumor = (humorId, dest) => {
    setSortedHumor(prev => ({ ...prev, [humorId]: dest }));
    setHumorChecked(false);
  };

  const handleValidateHumor = () => {
    let hasError = false;
    humorPool.forEach((item) => {
      const userSelected = sortedHumor[item.id];
      if (userSelected !== item.correctCategory) {
        hasError = true;
      }
    });

    setHumorChecked(true);
    if (!hasError) {
      setHumorSuccess(true);
    }
  };

  const handleSelectQuizAnswer = (qId, answerId) => {
    onChangeSession({
      ...userSession,
      quizAnswers: { ...userSession.quizAnswers, [qId]: answerId }
    });
  };

  const handleQuizNext = () => {
    const activeQObj = QUIZ_QUESTIONS[activeQuizQuestionIdx];
    const userAns = userSession.quizAnswers[activeQObj.id];
    if (!userAns) return;

    if (activeQuizQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setActiveQuizQuestionIdx(prev => prev + 1);
    } else {
      let correctCounts = 0;
      QUIZ_QUESTIONS.forEach(q => {
        if (userSession.quizAnswers[q.id] === q.correctAnswer) {
          correctCounts++;
        }
      });
      setQuizScore(correctCounts);
      setQuizSubmitted(true);
      onChangeSession({
        ...userSession,
        quizCompleted: true,
        quizScore: correctCounts
      });
    }
  };

  const handleRetryQuiz = () => {
    setActiveQuizQuestionIdx(0);
    setQuizSubmitted(false);
    setQuizScore(0);
    onChangeSession({
      ...userSession,
      quizAnswers: {},
      quizCompleted: false,
      quizScore: 0
    });
  };

  const handleAcknowledgeSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();
    // onChangeSession({
    //     ...userSession,
    //     signatureSubmitted: true,
    //     acknowledged: true,
    // });
    const finalSession = {
        ...userSession,
        acknowledged: true,
        acknowledgedAt: now,
        completedAt: now,
        signatureSubmitted: true,
    };

    try {
        await completeTraining(userSession.id, {
            quizScore: userSession.quizScore,
            acknowledged: true,
            acknowledgedAt: now,
            completedAt: now
        });

        const newRecord = {
            id: userSession.id,
            name: userSession.name,
            email: userSession.email,
            employeeId: userSession.employeeId,
            department: userSession.department,
            role: userSession.role,
            city: userSession.city,
            quizScore: userSession.quizScore,
            completedAt:
                new Date().toLocaleDateString("en-IN") +
                " " +
                new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            acknowledged: true,
        };

        onAddCompletion(newRecord);
        onChangeSession(finalSession);

    } catch (error) {
        console.error("Failed to complete training:", error);
        alert("Something went wrong while saving your completion. Please try again.");
    }
};
//   const handleAcknowledgeSubmit = (e) => {
//     e.preventDefault();
//     const finalSession = {
//       ...userSession,
//       acknowledged: true,
//       acknowledgedAt: new Date().toISOString(),
//       completedAt: new Date().toISOString()
//     };

//     const newRecord = {
//       id: `REC-${Date.now().toString().slice(-5)}`,
//       name: userSession.name,
//       email: userSession.email,
//       employeeId: userSession.employeeId,
//       department: userSession.department,
//       role: userSession.role,
//       city: userSession.city,
//       quizScore: userSession.quizScore,
//       completedAt: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
//       acknowledged: true
//     };
//     onAddCompletion(newRecord);

//     completeTraining({
//         quizScore: userSession.quizScore,
//         acknowledged: true,
//         acknowledgedAt: new Date().toISOString(),
//         completedAt: new Date().toISOString()
//     })
    
//     onChangeSession(finalSession);

//   };

const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await googleLogin({
            credential: credentialResponse.credential
        });
        onChangeSession({
            ...res.data.data,
            isRegistered: true,
            // isUserLogin: true,
            quizAnswers: {}
        });

        onLoginSuccess();

    } catch (err) {
         console.log(err);
        console.log(err.message);
        console.log(err.stack);

        alert(err.response?.data?.message || err.message);
        //alert(err.response?.data?.message || "Login Failed. Please try again.");
    }
};
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between selection:bg-accent selection:text-white" style={{ contentVisibility: 'auto' }}>
        {!userSession.isRegistered ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden max-w-lg w-full text-left">
            {/* Form Banner */}
            <div className="bg-[#800000] p-6 text-white text-center border-b border-rose-900/10">
              <Shield className="w-10 h-10 text-white mx-auto mb-2" />
              <h2 className="text-xl md:text-2xl font-extrabold font-display uppercase tracking-wider text-white">Compliance Enrollment</h2>
              <p className="text-[10px] text-rose-250 mt-1 uppercase tracking-widest font-mono font-bold">
                Statutory POSH Awareness Program &bull; India
              </p>
            </div>

            {/* Fields Form */}
            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
              <div className="bg-[#800000]/5 border border-[#800000]/15 p-3.5 rounded-lg text-xs leading-relaxed text-slate-705 font-sans">
                <strong className="text-[#800000]">📝 MANDATORY TRAINING NOTICE:</strong> This interactive training module is required under India's Prevention of Sexual Harassment (POSH) regulations. Your completion and quiz details will be logged in company compliance audits.
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                <input 
                  type="text"
                  placeholder="Employee First & Last Name"
                  value={enrollForm.name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Employee Email</label>
                  <input 
                    type="email"
                    placeholder="name@company.com"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Employee ID</label>
                  <input 
                    type="text"
                    placeholder="e.g. EMP-1049"
                    value={enrollForm.employeeId}
                    onChange={(e) => setEnrollForm({ ...enrollForm, employeeId: e.target.value })}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono font-mono">Department</label>
                  <select 
                    value={enrollForm.department}
                    onChange={(e) => setEnrollForm({ ...enrollForm, department: e.target.value })}
                    className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-accent focus:outline-hidden"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Product Management">Product Management</option>

                    <option value="Web App Development">Web App Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="BI">BI</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Others">Others</option>


                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono font-mono">Designation</label>
                  <input 
                    type="text"
                    value={enrollForm.role}
                    onChange={(e) => setEnrollForm({ ...enrollForm, role: e.target.value })}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono font-mono">Office branch</label>
                  <select
                    value={enrollForm.city}
                    onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
                    className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-accent focus:outline-hidden"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Gurgaon">Gurgaon</option>
                  </select>
                </div>
              </div>

              {/* Start Slide deck action */}
              <button
                type="submit"
                className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest rounded-lg mt-4 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="start-training-enroll-btn"
              >
                <span>Authorize & Enroll in Course</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
                
              <p className="text-[10px] text-center text-slate-400 font-mono uppercase">
                By enrolling, you certify these particulars are officially assigned.
              </p>
            </form>

            <p className="ml-50 mb-1 align-center text-primary text-[15px] text-black-400 font-mono uppercase"> OR </p>
            <div className="text-center mt-3">
                <span className="text-xs text-slate-500"> Already registered?{" "} </span>
                <button 
                    onClick={goToLogin} 
                    className="mb-4 underline text-primary text-[15px] text-slate-400 font-mono uppercase cursor-pointer"
                > Login </button>
            </div>

            <div className="flex items-center my-2">
                <div className="flex-1 border-t"></div>
                <span className="mx-3 text-xs text-gray-500">OR</span>
                <div className="flex-1 border-t"></div>
            </div>

            <div className="flex justify-center mb-4">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => alert("Google Login Failed")}
                />
            </div>


          </div>
        </div>

        ) :  
        userSession.isUserLogin && !userSession.mustRetakeTraining && viewMode === "admin" ? ( 
            <Dashboard userSession={userSession}/>
        ) :
        userSession.isUserLogin && !userSession.mustRetakeTraining && viewMode === "training" ? (
            <Certificate userSession={userSession} config={config} />
        ) :
        (
        /* TRAINING SLIDE ENGINE CONTAINER */
        <>
          {/* Progress Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-accent text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  Module {activeSlide.moduleId}
                </span>
                <span className="font-bold text-slate-800">{activeSlide.moduleTitle.toUpperCase()}</span>
              </div>
              
              {/* Progress counter text */}
              <div className="uppercase text-[10px] tracking-widest text-slate-500 font-bold">
                <span>Screen {activeSlideIndex + 1} of {ALL_SLIDES.length} Completed</span>
              </div>
            </div>

            {/* Horizontal timeline bar */}
            <div className="max-w-4xl mx-auto w-full bg-slate-200 h-2 mt-3 rounded-full overflow-hidden">
              <div 
                className="bg-accent h-2 transition-all duration-300"
                style={{ width: `${((activeSlideIndex + 1) / ALL_SLIDES.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Core active card viewport */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto max-h-[calc(100vh-170px)] bg-slate-50">
            <div className="bg-white border border-slate-205 shadow-md rounded-xl w-full max-w-4xl p-6 md:p-10 transition-all duration-300 text-left">
              
              {/* TITLE RENDERER */}
              {activeSlide.type === 'title' && (
                <div className="text-center space-y-6 py-4">
                  <div className="inline-flex p-3.5 bg-accent/5 rounded-full text-accent border border-accent/20 animate-pulse-slow">
                    <Shield className="w-14 h-14" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black tracking-normal text-slate-900 font-sans uppercase">
                      {activeSlide.title}
                    </h1>
                    <p className="text-accent max-w-lg mx-auto font-mono text-xs uppercase tracking-widest font-extrabold">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-5 rounded-lg text-xs space-y-2.5 text-left font-mono">
                    <div className="font-extrabold text-accent font-sans uppercase tracking-wider text-[10px]">AUTHORIZED ENROLLMENT LOG PARTICULARS:</div>
                    <div className="flex justify-between text-slate-500">
                      <span>Name:</span> <strong className="text-slate-850 font-bold font-sans">{userSession.name}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Employee ID:</span> <strong className="text-slate-850 font-bold font-sans">{userSession.employeeId}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Department:</span> <strong className="text-slate-850 font-bold font-sans">{userSession.department}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleNextSlide}
                      className="px-6 py-3.5 bg-[#800000] hover:bg-[#800000]/90 text-white font-extrabold uppercase tracking-widest rounded-lg flex items-center gap-1.5 mx-auto transition cursor-pointer"
                      id="begin-slide-btn"
                    >
                      <span>Begin Interactive Training</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STANDARD INFO CARD REVEALS */}
              {activeSlide.type === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-extrabold">{activeSlide.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                    {/* Visual cards Left */}
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 text-slate-800 space-y-4 shadow-xs relative overflow-hidden min-h-[220px] flex flex-col justify-between text-left">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full translate-x-12 -translate-y-12"></div>
                      <BookOpen className="w-8 h-8 text-accent" />
                      
                      {activeSlide.id === 'slide_3' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Continuous Evaluation</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Active participation screens will check understanding. Standard "Skip" commands are fully disabled to protect training legitimacy and corporate compliance compliance standards.
                          </p>
                        </div>
                      )}
                      
                      {activeSlide.id === 'slide_4' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Policy & Procedures</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Our formal internal POSH guideline applies to offsites, digital spaces, commute vehicles, and third-party vendor interfaces. Always read the complete documentation PDF.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_10' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Understanding Boundaries</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Boundary-pushing of personal limits creates toxic cultures. Keeping communication clear and respecting comfortable body distance is the baseline corporate expectation.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_12' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Digital Accountability</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Official company communication streams (Slack, Teams, Work Emails) are statutory records. Casual boundary violations in chats carry direct disciplinary risk.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_18' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Strict Due Process</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            A complaint does not yield direct guilt. Every accused has full rights of natural justice to receive reports, present evidence, and cross-examine details through the formal IC.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_25' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Natural Justice Principles</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Neither the complainant nor the respondent is judged on speculation. Objective written evidence, witness logs, and legal timelines support complete fairness.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_27' && (
                        <div className="space-y-2">
                          <h4 className="font-bold uppercase tracking-wider font-display text-base text-accent">Employer Mandates</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            The company takes action based on findings of the IC. Disciplinary penalties can include service termination, formal reprimands, or standard salary deductions for legal redressals.
                          </p>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-bold">SECURE AUDIT PATHWAY</span>
                    </div>

                    {/* Explanatory texts / Bullets Right */}
                    <div className="space-y-4 text-left">
                      {activeSlide.id === 'slide_3' && (
                        <ul className="space-y-3 font-sans">
                          <li className="flex gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 animate-pulse-slow" />
                            <span className="text-slate-600 text-sm"><strong className="text-slate-900 font-bold">8 Branching Scenarios:</strong> Reflecting actual challenges faced daily in modern office structures.</span>
                          </li>
                          <li className="flex gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 animate-pulse-slow" />
                            <span className="text-slate-600 text-sm"><strong className="text-slate-900 font-bold">Evaluated Quiz Check:</strong> Requires demonstrating a solid grasp of rules to unlock the digital completion license.</span>
                          </li>
                          <li className="flex gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 animate-pulse-slow" />
                            <span className="text-slate-600 text-sm"><strong className="text-slate-900 font-bold">Signed Acknowledgement:</strong> Satisfies your human resources training record for audit reviews.</span>
                          </li>
                        </ul>
                      )}

                      {activeSlide.id === 'slide_4' && (
                        <div className="space-y-3 font-sans">
                          <p className="text-slate-600 text-sm leading-relaxed">
                            Under <strong className="text-slate-900 font-bold">The Sexual Harassment of Women at Workplace Act 2013 [India]</strong>, companies must guarantee complete protection against retaliation, carry out standard workshops, and constituent an Internal Committee with legal representation.
                          </p>
                          <div className="bg-[#800000]/5 p-3.5 rounded-lg border border-[#800000]/15 text-xs text-slate-700 font-sans leading-relaxed">
                            <strong className="text-accent uppercase font-bold text-[10px] tracking-wider block mb-1 font-mono">Notice:</strong> We mandate safe, highly standardized protocols for both male and female staff. If you have concerns, refer to the Contacts panel on screen 37.
                          </div>
                        </div>
                      )}

                      {activeSlide.id === 'slide_10' && (
                        <div className="space-y-3 font-sans text-slate-600 text-sm leading-relaxed">
                          <p>
                            Workplace compliance is evaluated based on whether behaviour would be deemed inappropriate by any <strong className="text-slate-900 font-bold">reasonable third-person perspective</strong>.
                          </p>
                          <p>
                            If an employee asks you to avoid personal discussions or seems uncomfortable, do not try to explain it away. Respect boundaries instantly.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_12' && (
                        <div className="space-y-3 font-sans text-slate-600 text-sm leading-relaxed">
                          <p>
                            Digital harassment is a major focus area in modern POSH jurisprudence.
                          </p>
                          <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-500 font-mono">
                            <li>Late-night texting without work purposes</li>
                            <li>Sending unofficial emojis/memes carrying suggestive contexts</li>
                            <li>Repeated texting after no clear response</li>
                          </ul>
                        </div>
                      )}

                      {activeSlide.id === 'slide_18' && (
                        <div className="space-y-3 font-sans text-slate-600 text-sm leading-relaxed">
                          <p>
                            An accusation is an allegation, not an official conviction. The company ensures a completely impartial inquiry process.
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            You must never contact, message, pressure, or threaten the reporting colleague, nor discuss details in common office spaces (which violates confidentiality rules).
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_25' && (
                        <div className="space-y-3 font-sans text-slate-600 text-sm leading-relaxed">
                          <p>
                            The IC evaluates cases with the standard of <strong className="text-slate-900 font-bold">Preponderance of Probabilities</strong> rather than the strict "beyond reasonable doubt" used in criminal courts.
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            This makes preserving chronological digital records, logs, calendars, and bystander statements extremely valuable for accurate, fast findings.
                          </p>
                        </div>
                      )}

                      {activeSlide.id === 'slide_27' && (
                        <div className="space-y-3 font-sans text-slate-600 text-sm leading-relaxed">
                          <p>
                            Under Section 19 of the POSH Act, companies must register and submit mandatory annual records reporting the number of files raised, resolved, and pending, which is tracked by district labor officers.
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            This makes timely compliance training completions a critical requirement for corporate operational certificates.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 2 / 5 - CLICK REVEALS ITEMS */}
              {activeSlide.type === 'click-reveal' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  {activeSlide.id === 'slide_2' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Click on each educational item below to reveal how this training protects our workplace ecosystem:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { title: '🛡️ Core Protection', desc: 'Ensures everyone understands boundaries, reducing uncomfortable situations.' },
                          { title: '📏 Legal Awareness', desc: 'Explains specific rights, procedures, and timelines under the Indian POSH Act, 2013.' },
                          { title: '🔒 preventing Gossip', desc: 'Safeguards the confidentiality of all reporting parties and prevents retaliation.' },
                          { title: '💡 Active Bystander Action', desc: 'Empowers employees to support affected colleagues safely instead of turning away.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-5 rounded-lg border text-left transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-accent hover:bg-accent/95 text-white border-transparent shadow-xs'}`}
                            >
                              <h4 className="font-bold uppercase tracking-wider font-display text-sm flex items-center justify-between font-sans">
                                <span>{item.title}</span>
                                {!isRevealed && <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-sm uppercase font-mono tracking-wider font-bold">Reveal</span>}
                              </h4>
                              {isRevealed ? (
                                <p className="text-slate-600 text-xs mt-2 leading-relaxed animate-in fade-in duration-305">
                                  {item.desc}
                                </p>
                              ) : (
                                <p className="text-white/80 text-xs mt-2 leading-relaxed font-mono">Click to study this module pillar...</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_5' && (
                    <div className="space-y-6 pt-2 text-left">
                      <p className="text-slate-600 text-sm">
                        What makes something sexual harassment? Click check below to study the legal threshold:
                      </p>

                      <div className="max-w-xl mx-auto space-y-4">
                        <div 
                           onClick={() => handleRevealClick(0)}
                           className={`p-6 rounded-lg border text-center transition-all cursor-pointer ${clickedRevealIdx.includes(0) ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-accent hover:bg-accent/95 text-white border-transparent shadow-md'}`}
                        >
                          <span className={`${clickedRevealIdx.includes(0) ? 'text-accent' : 'text-white/80'} text-xs font-bold font-mono block mb-1`}>THE CRITICAL METRIC</span>
                          <span className="text-2xl md:text-3xl font-extrabold tracking-widest block font-display">
                            UNWELCOME
                          </span>
                          {clickedRevealIdx.includes(0) ? (
                            <div className="mt-4 text-xs text-slate-600 leading-relaxed max-w-md mx-auto animate-in fade-in duration-305 space-y-2 text-left">
                              <p>
                                <strong>Unwelcome</strong> means the conduct was not invited, wanted, or consented to by the person receiving it.
                              </p>
                              <p className="text-slate-400 italic block font-mono">
                                Whether the sender "meant it as a compliment" is not what defines harassment. The impact and comfort of the recipient are primary.
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-white/90 font-mono font-bold tracking-wider uppercase block mt-3">
                              (Click to reveal complete definition)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_14' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-650 text-sm leading-relaxed">
                        Hierarchical structures can severely distort or compromise consent. Click on each pillar below to study how power dynamics complicate workplace boundaries:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: '📊 Consent Distortion', desc: 'A junior employee may feel completely unable to refuse a supervisor\'s social or romantic requests due to fear of career or rating impacts.' },
                          { title: '⚖️ Quid Pro Quo Risk', desc: 'Conditioning work assignments, project allocations, or grading on personal dates or attention is severe, direct Quid Pro Quo harassment.' },
                          { title: '🛡️ Retaliation Fear', desc: 'Often, victims of supervisor harassment remain silent because they fear being assigned unfavorable shifts, isolated, or excluded from meetings.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-5 rounded-lg border text-left min-h-[170px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-205 text-slate-800' : 'bg-accent hover:bg-accent/95 text-white border-transparent shadow-xs'}`}
                            >
                              <h4 className="font-bold uppercase tracking-wider font-display text-xs flex items-center justify-between font-sans">
                                <span>{item.title}</span>
                              </h4>
                              {isRevealed ? (
                                <p className="text-slate-650 text-xs mt-2 leading-relaxed animate-in fade-in duration-305">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block mt-4">Click to study power dynamic...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_14_a' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-655 text-sm leading-relaxed">
                        While Actiknow Consulting Pvt. Ltd. respects employee privacy, romantic relationships between employees are <strong>strongly discouraged</strong>. Click on each pillar below to study our official guidelines and requirements:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: '⚠️ Strong Discouragement', desc: 'Relationships are strongly discouraged to maintain a professional, objective work environment, preventing conflicts of interest, favoritism, team disruptions, or complaints emerging from workplace romances.' },
                          { title: '📝 Confidential Disclosure', desc: 'Employees involved or intending to engage in a relationship must disclose it confidentially to HR or the ICC. If one employee has evaluative authority over the other, it must be writing, and an interview will be conducted.' },
                          { title: '💼 Professional Boundaries', desc: 'Strict professional boundaries must be observed during working hours and on premises. Failure to maintain professionalism or any adverse impact on the workspace may lead to disciplinary action, including termination.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-5 rounded-lg border text-left min-h-[170px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-205 text-slate-800' : 'bg-accent hover:bg-accent/95 text-white border-transparent shadow-xs'}`}
                            >
                              <h4 className="font-bold uppercase tracking-wider font-display text-xs flex items-center justify-between font-sans">
                                <span>{item.title}</span>
                              </h4>
                              {isRevealed ? (
                                <p className="text-slate-650 text-xs mt-2 leading-relaxed animate-in fade-in duration-305 font-sans">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block mt-4">Click to study disclosure rules...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_16' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-605 text-sm">
                        If you encounter boundary-pushing or unacceptable conduct, follow these four chronological steps:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { title: '1. SAY NO', desc: 'If safe, tell the person clearly that their behaviour is unwelcome and must stop.' },
                          { title: '2. SAVE LOGS', desc: 'Preserve emails, chat messages, call durations, dates, timelines, and screenshots.' },
                          { title: '3. SECURE NOTES', desc: 'Write precise chronological notes of the occurrence for your own records.' },
                          { title: '4. FILE LAWSUIT/IC', desc: 'Directly contact the presiding officer or submit details to our IC email pool.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-4 rounded-lg border text-left min-h-[160px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-205 text-slate-800' : 'bg-accent text-white hover:bg-accent/95 border-transparent shadow-xs'}`}
                            >
                              <div className="font-bold font-display text-xs tracking-wider uppercase">{item.title}</div>
                              {isRevealed ? (
                                <p className="text-slate-600 text-xs mt-2 leading-tight animate-in fade-in duration-305">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block mt-4">Click to study...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_20' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-700 text-sm">
                        Click on each card to review the legal composition of the Internal Committee (IC) mandated by law:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: '👩‍💼 Presiding Officer', desc: 'A senior woman employee within the company who heads all meetings and files.' },
                          { title: '🧑‍🤝‍🧑 Staff Members', desc: 'At least two employees selected for commitment to social/legal worker safety.' },
                          { title: '⚖️ External Member', desc: 'An independent NGO specialized expert or advocate to guarantee fairness and neutral rulings.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-4 rounded-md border text-left min-h-[160px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-rose-50/50 border-[#800000]/20 text-slate-800' : 'bg-accent text-white hover:bg-accent/90 border-transparent shadow-xs'}`}
                            >
                              <div className="font-bold font-display text-sm tracking-wider uppercase">{item.title}</div>
                              {isRevealed ? (
                                <p className="text-slate-600 text-xs mt-2 leading-tight animate-in fade-in duration-300">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block mt-4">Reveal structure...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* ACTUAL ACTIKNOW COMMITTEE DIRECTORY */}
                      <div className="mt-8 bg-amber-500/5 border border-amber-900/15 p-5 rounded-lg text-left">
                        <h4 className="font-extrabold text-[#800000] font-sans text-sm flex items-center gap-2 mb-2 uppercase tracking-wide">
                          <Users className="w-5 h-5 text-[#800000]" />
                          <span>Actiknow Internal Committee (IC) Directory Contacts</span>
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed flex items-center">
                          Below is the active, certified roster representing our Internal Committee in all regulatory POSH enquiries at Actiknow:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                            <span className="font-bold text-[#800000] block mb-1">Presiding Officer: 👩‍💼</span>
                            <span className="text-slate-800 font-semibold text-xs">{config.presidingOfficer}</span>
                          </div>
                          <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                            <span className="font-bold text-[#800000] block mb-1">External NGO Expert: ⚖️</span>
                            <span className="text-slate-800 font-semibold text-xs">{config.externalMember}</span>
                          </div>
                          <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs md:col-span-2 text-left">
                            <span className="font-bold text-[#800000] block mb-1.5 font-sans">Other Standing Committee Members: 🧑‍🤝‍🧑</span>
                            <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                              {config.icMembers.map((member, i) => (
                                <li key={i} className="text-xs">{member}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3.5 bg-rose-50/40 border border-dashed border-[#800000]/25 rounded-lg md:col-span-2 flex justify-between items-center text-left">
                            <div>
                              <span className="font-bold text-[#800000] block">Official Escalation E-mail:</span>
                              <span className="text-slate-800 text-[11px] font-mono select-all font-semibold underline">{config.icEmail}</span>
                            </div>
                            <span className="bg-[#800000] text-white font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">24/7 Monitored</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_23' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-600 text-sm">
                        Why does the law mandate strict, absolute confidentiality? Click card to study:
                      </p>

                      <div className="max-w-xl mx-auto space-y-3">
                        <div 
                          onClick={() => handleRevealClick(0)}
                          className={`p-5 rounded-lg border text-left transition-all cursor-pointer ${clickedRevealIdx.includes(0) ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-accent text-white hover:bg-accent/95 border-transparent shadow-sm'}`}
                        >
                          <h4 className={`font-black uppercase tracking-wider flex items-center gap-2 text-sm ${clickedRevealIdx.includes(0) ? 'text-[#800000]' : 'text-white'}`}>
                            <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Identity Protection Laws (Section 16)</span>
                          </h4>
                          {clickedRevealIdx.includes(0) ? (
                            <div className="text-xs text-slate-650 mt-2 space-y-2 leading-relaxed animate-in fade-in duration-305 text-left font-sans">
                              <p>
                                The law forbids sharing names of the reporting employee, respondent, or witnesses with anyone. Leaking identity, even on unofficial chats, leads to steep fines.
                              </p>
                              <p className="font-extrabold text-[#800000] uppercase font-mono tracking-wider text-[10px]">
                                Gossip compromises investigations and degrades workplace safety. We maintain absolute zero tolerance.
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-white/90 block mt-2 font-mono font-bold uppercase tracking-wider">Click to study the legal fines...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_26' && (
                    <div className="space-y-4 pt-2 text-left">
                      <p className="text-slate-600 text-sm">
                        Your professional conduct is governed by three primary pillars. Click each to certify:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                        {[
                          { title: '🤝 Mutual Dignity', desc: 'Respect personal limits, relationship privacy, and professional choices.' },
                          { title: '📱 Professional Chats', desc: 'Avoid sexualized joking, memes, or suggestive stickers in official or unofficial teams channels.' },
                          { title: '🔒 Defeating Rumours', desc: 'Refuse to participate in canteen gossiping or speculative leaking of compliance filings.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedRevealIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleRevealClick(idx)}
                              className={`p-5 rounded-lg border text-left min-h-[160px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-202 text-slate-800' : 'bg-accent text-white hover:bg-accent/95 border-transparent shadow-sm'}`}
                            >
                              <div className="font-bold font-display text-sm tracking-wider uppercase">{item.title}</div>
                              {isRevealed ? (
                                <p className="text-slate-600 text-xs mt-2 leading-tight animate-in fade-in duration-305 font-sans">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/90 font-mono font-bold uppercase tracking-wider block mt-4">Confirm Pillar...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Compulsory hint */}
                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/20 p-3.5 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 Please click and reveal all section items to unlock the "Next Screen" button.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 2 - FLIP EXAMPLE CARDS */}
              {activeSlide.type === 'flip-cards' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed text-left font-medium">
                    Click and flip each interactive card below to study what constitutes sexual harassment vs. inappropriate conduct:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 font-sans">
                    {[
                      { icon: '🤝', title: '1. Unwanted Touch', desc: 'Touching shoulders, waist, or hand after they look tense or explicitly ask you to stop.' },
                      { icon: '💬', title: '2. Coloured Remarks', desc: 'Suggestive remarks regarding clothes, bodies, relationship status, or sexual innuendos.' },
                      { icon: '📱', title: '3. Digital Chafing', desc: 'Incessant late-evening chats, sending unofficial suggestive memes or reels.' },
                      { icon: '⚖️', title: '4. Quid Pro Quo', desc: 'Conditioning project scopes, performance reviews, or appraisals to personal social dates.' },
                      { icon: '🌋', title: '5. Hostile Space', desc: 'Tolerating group-chat mockings, sexual jokings, or environment-based boundary violations.' }
                    ].map((item, idx) => {
                      const isFlipped = flippedCardIdx.includes(idx);
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleCardFlip(idx)}
                          className={`p-4 rounded-lg border text-center transition-all cursor-pointer min-h-[170px] flex flex-col justify-between ${isFlipped ? 'bg-accent text-white border-transparent shadow-md' : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200 shadow-xs'}`}
                        >
                          <span className="text-2xl block">{item.icon}</span>
                          <h4 className="text-[12px] font-bold font-display mt-1.5 leading-tight uppercase tracking-wider">{item.title}</h4>
                          
                          {isFlipped ? (
                            <p className="text-[10px] text-white/90 mt-2 leading-tight animate-in fade-in duration-305">
                              {item.desc}
                            </p>
                          ) : (
                            <span className="text-[9px] font-mono tracking-widest text-[#800000] font-extrabold uppercase block mt-3">Flip Card</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/20 p-3.5 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 Study and flip all 5 cards above to enable progress.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 2 - CONSENT WARNING SLIDER */}
              {activeSlide.type === 'consent-slider' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  <p className="text-slate-600 text-sm text-left">
                    Move the interactive slide bar below from left (0%) to right (100%) to study physical and social signals indicating workplace distress:
                  </p>

                  <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-lg border border-slate-205 shadow-inner space-y-6">
                    {/* Visual signal display based on slider value */}
                    <div className="text-center space-y-3">
                      {consentSliderVal < 30 ? (
                        <div className="space-y-1.5">
                          <span className="text-4xl">🟢 😊</span>
                          <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-mono">SAFE & ENGAGED (0 - 30%)</div>
                          <p className="text-xs text-slate-600 italic">"Prompt answers, open professional posture, standard work focus."</p>
                        </div>
                      ) : consentSliderVal < 70 ? (
                        <div className="space-y-1.5">
                          <span className="text-4xl">🟡 😐</span>
                          <div className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono">EARLY DISTRESS SIGNS (31 - 70%)</div>
                          <p className="text-xs text-slate-600 italic">"Slow/short answers, avoiding unnecessary video calls, tense face, polite but highly brief text answers."</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="text-4xl">🔴 😰</span>
                          <div className="text-xs font-bold text-rose-700 uppercase tracking-widest font-mono">SEVERE BOUNDARY VIOLATION (71 - 100%)</div>
                          <p className="text-xs text-slate-600 italic">"Explicitly says -please stop-, stops replying on chat, isolates self, shifts meeting schedules to avoid contact."</p>
                        </div>
                      )}
                    </div>

                    {/* Numeric slider input */}
                    <div className="space-y-2">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={consentSliderVal}
                        onChange={(e) => setConsentSliderVal(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#800000]"
                        id="consent-range-slider"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 tracking-wider font-semibold uppercase">
                        <span>0% COMFORT</span>
                        <span>50% DISQUIET</span>
                        <span>100% EXPLICIT STOP</span>
                      </div>
                    </div>
                  </div>

                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/20 p-3.5 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 Please click and push the slide bar to 100% to study all physical distress signals before proceeding.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 2 / 5 - REUSABLE TIMELINE RENDERER */}
              {activeSlide.type === 'timeline' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  {activeSlide.id === 'slide_9' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-600 text-sm">
                        A "workplace" includes many environments. Click each step below to check legal boundaries:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { title: 'Office Layout', desc: 'Normal office desks, private cabins, lockers, and cafeteria tables.' },
                          { title: 'Company Transit', desc: 'Cabs, shuttle logistics, and transport vehicles provided by the firm.' },
                          { title: 'Client premises', desc: 'Any client sites, offsite workshops, or business meetings visited.' },
                          { title: 'online Space', desc: 'Slack, zoom, emails, official whatsapp groups, and late video calls.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedTimelineIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleTimelineClick(idx)}
                              className={`p-4 rounded-lg border text-left min-h-[140px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-205 text-slate-800 shadow-xs' : 'bg-accent text-white hover:bg-accent/95 border-transparent shadow-md'}`}
                            >
                              <div className="font-bold text-xs uppercase tracking-widest font-display">{item.title}</div>
                              {isRevealed ? (
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in duration-305">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[10px] text-white/95 font-mono tracking-widest font-bold block uppercase mt-4">Check range...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSlide.id === 'slide_21' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-600 text-sm font-medium">
                        The POSH inquiry follows 5 absolute milestones. Click each milestone step to study the regulatory requirements:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {[
                          { title: '1. Complaint', label: '📅 Within 3 Months', desc: 'Written complaint raised within 90 days of the last incident.' },
                          { title: '2. Notice', label: '✉️ Within 7 Days', desc: 'The IC forwards copy details to respondent demanding response.' },
                          { title: '3. Inquiry', label: '⚖️ Within 90 Days', desc: 'Trial proceedings, examination, and evidence logs concluded.' },
                          { title: '4. Summary', label: '📝 Within 10 Days', desc: 'The IC submits finding recommendations to management.' },
                          { title: '5. Action', label: '🔨 Within 60 Days', desc: 'Management executes the final recommended penalties.' }
                        ].map((item, idx) => {
                          const isRevealed = clickedTimelineIdx.includes(idx);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleTimelineClick(idx)}
                              className={`p-4 rounded-lg border text-left min-h-[170px] flex flex-col justify-between transition-all cursor-pointer ${isRevealed ? 'bg-slate-50 border-slate-205 text-slate-800 shadow-xs' : 'bg-accent text-white hover:bg-accent/95 border-transparent shadow-md'}`}
                            >
                              <div>
                                <div className="font-bold text-xs uppercase tracking-wider font-display">{item.title}</div>
                                <span className={`text-[9px] font-bold block mt-1 py-0.5 rounded-sm px-1.5 ${isRevealed ? 'bg-slate-200 text-slate-700 font-mono uppercase tracking-wider' : 'bg-white/20 text-white font-mono uppercase tracking-wider'}`}>
                                  {item.label}
                                </span>
                              </div>
                              {isRevealed ? (
                                <p className="text-[10px] text-slate-600 leading-tight animate-in fade-in duration-305">
                                  {item.desc}
                                </p>
                              ) : (
                                <span className="text-[9.5px] text-white/90 font-mono font-bold tracking-widest block uppercase">Click Step...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/20 p-3.5 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 Please click and study all steps to unlock compliance advancement.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 3 - HUMOR DRAG DROP/SORTER */}
              {activeSlide.type === 'drag-drop' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  <p className="text-slate-600 text-sm text-left leading-relaxed">
                    Classify each statement card into the correct category below: click on any statement bubble to move it directly to its target bin!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-sans">
                    
                    {/* BUCKET 1: Safe humour */}
                    <div className="bg-emerald-50/20 rounded-lg p-4 border border-emerald-250 text-center space-y-3 min-h-[220px]">
                      <h4 className="font-bold text-emerald-800 font-mono text-xs tracking-wider flex items-center justify-center gap-1 uppercase">
                        <span>🟢 Safe Office Humor</span>
                      </h4>
                      <div className="space-y-2">
                        {humorPool.map((item) => {
                          if (sortedHumor[item.id] !== 'safe') return null;
                          return (
                            <div 
                              key={item.id}
                              onClick={() => handleMoveHumor(item.id, 'pool')}
                              className="bg-white border border-emerald-100 text-emerald-900 p-3 rounded-lg text-xs text-left cursor-pointer hover:bg-emerald-50/50 shadow-sm animate-in zoom-in-95 duration-100 leading-tight"
                            >
                              {item.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CENTRAL POOL: Statement items */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-205 text-center space-y-3 min-h-[220px]">
                      <h4 className="font-bold text-slate-700 font-mono text-xs tracking-wider uppercase">Statements to Classify</h4>
                      <div className="space-y-2">
                        {humorPool.map((item) => {
                          if (sortedHumor[item.id] !== 'pool') return null;
                          return (
                            <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-left shadow-xs space-y-2.5 text-slate-800">
                              <div className="leading-tight font-medium">{item.text}</div>
                              <div className="flex gap-1.5 justify-end pt-1">
                                <button 
                                  onClick={() => handleMoveHumor(item.id, 'safe')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                                >
                                  Safe Bin
                                </button>
                                <button 
                                  onClick={() => handleMoveHumor(item.id, 'risky')}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                                >
                                  Risky Bin
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* If pool is fully sorted */}
                        {Object.values(sortedHumor).filter(v => v === 'pool').length === 0 && (
                          <div className="text-slate-400 text-xs py-10 font-mono uppercase tracking-wider font-semibold">
                            🌿 All humor logs sorted. Click validation check below.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BUCKET 2: Risky boundary behaviour */}
                    <div className="bg-rose-50/20 rounded-lg p-4 border border-rose-250 text-center space-y-3 min-h-[220px]">
                      <h4 className="font-bold text-rose-800 font-mono text-xs tracking-wider flex items-center justify-center gap-1 uppercase">
                        <span>🔴 Boundary Violations</span>
                      </h4>
                      <div className="space-y-2">
                        {humorPool.map((item) => {
                          if (sortedHumor[item.id] !== 'risky') return null;
                          return (
                            <div 
                              key={item.id}
                              onClick={() => handleMoveHumor(item.id, 'pool')}
                              className="bg-white border border-rose-100 text-rose-900 p-3 rounded-lg text-xs text-left cursor-pointer hover:bg-rose-50/50 shadow-sm animate-in zoom-in-95 duration-100 leading-tight"
                            >
                              {item.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Actions & Feedback */}
                  <div className="flex flex-col items-center gap-3 pt-2 font-sans">
                    <button
                      onClick={handleValidateHumor}
                      disabled={Object.values(sortedHumor).filter(v => v === 'pool').length > 0}
                      className="px-6 py-3 bg-accent text-white hover:bg-accent/90 disabled:bg-slate-100 disabled:text-slate-400 border border-transparent font-bold text-xs uppercase tracking-widest rounded-lg transition shadow-xs cursor-pointer"
                      id="validate-humor-btn"
                    >
                      Check Sorting Classifications
                    </button>

                    {humorChecked && (
                      humorSuccess ? (
                        <div className="bg-emerald-55 border border-emerald-200 p-3.5 rounded-lg text-emerald-950 text-xs font-semibold text-center leading-relaxed">
                          🎉 Correct Classifications! Safe team humor is playful and neutral. Sexual memes or teasing romantic interest creates actionable compliance hazards. Click Next.
                        </div>
                      ) : (
                        <div className="bg-rose-55 border border-rose-200 p-3.5 rounded-lg text-rose-950 text-xs font-mono font-bold text-center leading-relaxed uppercase tracking-wider">
                          ❌ Incorrect arrangement detected. Click statement cards in the side boxes to return them to center, and try re-sorting.
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 3 / 4 / 5 - CHECKLIST REQUIREMENTS */}
              {activeSlide.type === 'checklist' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  {/* BYSTANDER CHECKLIST */}
                  {activeSlide.id === 'slide_15' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        If you witness inappropriate or boundary-pushing behaviour, how should you respond? 
                        Select the <strong>4 helpful / correct bystander actions</strong> and leave unhelpful ones blank:
                      </p>

                      <div className="space-y-2.5 max-w-2xl mx-auto text-left">
                        {[
                          { key: 'b_ok', text: '💡 Intervene or distract to check if your colleague is okay.' },
                          { key: 'b_support', text: '🤫 Offer private supportive empathy to them after the occurrence.' },
                          { key: 'b_gossip', text: '🗣️ Tell multiple colleagues in other layout panels to gossips.' },
                          { key: 'b_ic', text: '📞 Guide them safely to the contact coordinates of the IC.' },
                          { key: 'b_laugh', text: '😆 Laugh along so the scenario is not awkward.' },
                          { key: 'b_evidence', text: '📝 Safely preserve emails or digital recordings if sent in public work chats.' }
                        ].map((item) => (
                          <label 
                            key={item.key} 
                            className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${checklistChecks[item.key] ? 'bg-slate-50 border-accent text-slate-900 font-semibold shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                          >
                            <input 
                              type="checkbox"
                              checked={!!checklistChecks[item.key]}
                              onChange={() => handleChecklistToggle(item.key)}
                              className="accent-accent w-4 h-4 mt-0.5 rounded-xs"
                            />
                            <span className="text-xs">{item.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MANAGER CHECKLIST */}
                  {activeSlide.id === 'slide_19' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        Managers have a major legal mandate. What must a manager <strong>DO</strong> when a harassment issue is disclosed (Select the <strong>4 correct DOs</strong>)?
                      </p>

                      <div className="space-y-2.5 max-w-2xl mx-auto text-left">
                        {[
                          { key: 'm_listen', text: 'Listen neutrally and supportively without doubting.' },
                          { key: 'm_settle', text: 'Try to negotiate or privately settle the filing to shelter the department.' },
                          { key: 'm_conf', text: 'Maintain absolute, iron-clad confidentiality.' },
                          { key: 'm_warn', text: 'Casually warn the respondent over a private coffee conversation.' },
                          { key: 'm_route', text: 'Route the employee immediately to the designated Internal Committee email.' },
                          { key: 'm_prevent', text: 'Proactively prevent retaliations or workload exclusions of any type.' }
                        ].map((item) => (
                          <label 
                            key={item.key} 
                            className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${checklistChecks[item.key] ? 'bg-slate-50 border-accent text-slate-900 font-semibold shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                          >
                            <input 
                              type="checkbox"
                              checked={!!checklistChecks[item.key]}
                              onChange={() => handleChecklistToggle(item.key)}
                              className="accent-accent w-4 h-4 mt-0.5 rounded-xs"
                            />
                            <span className="text-xs">{item.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RETALIATION CHECKLIST */}
                  {activeSlide.id === 'slide_24' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        What actions qualify as illegal retaliation under workplace compliance codes? (Select all <strong>4 retaliatory examples</strong>):
                      </p>

                      <div className="space-y-2.5 max-w-2xl mx-auto text-left">
                        {[
                          { key: 'r_shift', text: '💥 Assigning difficult/unfavorable night shifts immediately after filing.' },
                          { key: 'r_exclusion', text: '🚪 Systemic exclusion from critical team roadmap sync meetings.' },
                          { key: 'r_norm', text: '📈 Providing a routine quarterly performance report which is highly balanced.' },
                          { key: 'r_appraisal', text: '📉 Altering performance metrics downward without objective reason logs.' },
                          { key: 'r_gossip', text: '🤐 Participating in office whispers, isolation, or social canteens boycott.' }
                        ].map((item) => (
                          <label 
                            key={item.key} 
                            className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${checklistChecks[item.key] ? 'bg-slate-50 border-accent text-slate-900 font-semibold shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                          >
                            <input 
                              type="checkbox"
                              checked={!!checklistChecks[item.key]}
                              onChange={() => handleChecklistToggle(item.key)}
                              className="accent-accent w-4 h-4 mt-0.5 rounded-xs"
                            />
                            <span className="text-xs">{item.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compulsory advance check */}
                  {isInteractionCompulsory() ? (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/25 p-3 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 You must select all 4 correct options (and leave harmful/incorrect blank) to advance.
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs font-sans font-bold text-emerald-800 text-center uppercase tracking-wider">
                      ✅ Beautiful select log matching! You have demonstrated key grasp of rules. Click Next.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 2 / 3 - STANDALONE MCQS */}
              {activeSlide.type === 'quiz-single' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-display text-slate-900">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  {activeSlide.id === 'slide_7' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-650 text-sm leading-relaxed">
                        Consider this common explanation: “I didn't intend to cause discomfort, I was just trying to be friendly and complimentary.”
                      </p>
                      
                      <div className="bg-slate-50 p-4 border border-slate-205 rounded-lg space-y-1 my-3">
                        <strong className="text-xs text-accent font-mono font-bold uppercase tracking-wider block">Workplace Standard:</strong>
                        <span className="text-xs text-slate-600">
                          Workplace conduct under POSH is judged strictly on both <strong>Impact</strong> and <strong>Context</strong>. 
                        </span>
                      </div>

                      <div className="space-y-2.5 max-w-xl mx-auto">
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_7'] === 'A' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="intent-ans" 
                            checked={selectedScenarioAnswers['slide_7'] === 'A'}
                            onChange={() => handleSingleQuizSelect('slide_7', 'A')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs"><strong>Option A:</strong> If there is no harmful intent, it cannot be classified as harassment.</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_7'] === 'B' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="intent-ans" 
                            checked={selectedScenarioAnswers['slide_7'] === 'B'}
                            onChange={() => handleSingleQuizSelect('slide_7', 'B')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs"><strong>Option B:</strong> Regardless of intent, if the behaviour is unwelcome and inappropriate, it defines violation.</span>
                        </label>
                      </div>

                      {selectedScenarioAnswers['slide_7'] && (
                        selectedScenarioAnswers['slide_7'] === 'B' ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            🎉 Correct! Impact and recipient comfort define workplace standards, not subjective intents or jokes.
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-lg text-rose-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            ❌ Disapproved answer. Legal rules specify recipient impact governs workplace space. Select B to progress.
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {activeSlide.id === 'slide_11' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-650 text-sm leading-relaxed">
                        Compare these two statements made by colleagues:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-205">
                          <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">STATEMENT 1</span>
                          <span className="text-xs text-slate-600">"That color outfit looks good on you."</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-205">
                          <span className="text-[10px] text-slate-500 font-mono block uppercase mb-1">STATEMENT 2</span>
                          <span className="text-xs text-rose-700 font-bold">"You look hot today. You should wear clothes like this more often."</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 max-w-xl mx-auto">
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_11'] === 'A' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="comp-ans" 
                            checked={selectedScenarioAnswers['slide_11'] === 'A'}
                            onChange={() => handleSingleQuizSelect('slide_11', 'A')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Both comments represent normal office compliments.</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_11'] === 'B' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="comp-ans" 
                            checked={selectedScenarioAnswers['slide_11'] === 'B'}
                            onChange={() => handleSingleQuizSelect('slide_11', 'B')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Statement 2 is inappropriate / sexually coloured, crossing into violation.</span>
                        </label>
                      </div>

                      {selectedScenarioAnswers['slide_11'] && (
                        selectedScenarioAnswers['slide_11'] === 'B' ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            🎉 Correct! Professional comments focus on output work. Suggestive, personal terms are highly prohibited.
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-lg text-rose-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            ❌ Incorrect option. Statement 2 is highly personal sexual vocabulary. Please select B to proceed.
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {activeSlide.id === 'slide_14_b' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-655 text-sm leading-relaxed">
                        If a consensual workplace dating relationship or romance ends, which of the following is true?
                      </p>

                      <div className="space-y-2.5 max-w-xl mx-auto">
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_14_b'] === 'A' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="romance-end-ans" 
                            checked={selectedScenarioAnswers['slide_14_b'] === 'A'}
                            onChange={() => handleSingleQuizSelect('slide_14_b', 'A')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">It remains a purely private matter, and any continued pursuit is not a POSH issue.</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_14_b'] === 'B' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="romance-end-ans" 
                            checked={selectedScenarioAnswers['slide_14_b'] === 'B'}
                            onChange={() => handleSingleQuizSelect('slide_14_b', 'B')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Prior consent is fully revoked. Any continued unwelcome personal attention of a romantic nature represents a POSH violation.</span>
                        </label>
                      </div>

                      {selectedScenarioAnswers['slide_14_b'] && (
                        selectedScenarioAnswers['slide_14_b'] === 'B' ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            🎉 Correct! Consent is continuous and can be withdrawn at any point. Once a relationship ends, any continued pursuit is evaluated strictly as unwelcome conduct.
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-lg text-rose-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            ❌ Incorrect option. Having a personal history does not grant permanent consent. Please select B to proceed.
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {activeSlide.id === 'slide_17' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-650 text-sm leading-relaxed">
                        A coworker tells you privately that a senior manager is sending them unwelcome messages.
                      </p>

                      <div className="space-y-2.5 max-w-xl mx-auto">
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_17'] === 'A' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="disc-ans" 
                            checked={selectedScenarioAnswers['slide_17'] === 'A'}
                            onChange={() => handleSingleQuizSelect('slide_17', 'A')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Say: “Are you sure you didn't misunderstand? They are very friendly.”</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_17'] === 'B' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="disc-ans" 
                            checked={selectedScenarioAnswers['slide_17'] === 'B'}
                            onChange={() => handleSingleQuizSelect('slide_17', 'B')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Say: “Keep quiet, because legal reports will ruin your performance file.”</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_17'] === 'C' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="disc-ans" 
                            checked={selectedScenarioAnswers['slide_17'] === 'C'}
                            onChange={() => handleSingleQuizSelect('slide_17', 'C')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Say: “I am sorry this happened. Let's connect you directly with support and our IC.”</span>
                        </label>
                      </div>

                      {selectedScenarioAnswers['slide_17'] && (
                        selectedScenarioAnswers['slide_17'] === 'C' ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            🎉 Correct! Listen with respect, respect their privacy, and guide them to official IC channels without judging.
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-lg text-rose-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            ❌ Incorrect option. This feedback downplays harassment issues or intimidates colleagues. Please select C to proceed.
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {activeSlide.id === 'slide_22' && (
                    <div className="space-y-4 pt-2 text-left font-sans">
                      <p className="text-slate-650 text-sm leading-relaxed">
                        Can a company manager force a reporting employee and a respondent to reach a "handshake settlement" before the inquiry?
                      </p>

                      <div className="space-y-2.5 max-w-xl mx-auto">
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_22'] === 'A' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="conc-ans" 
                            checked={selectedScenarioAnswers['slide_22'] === 'A'}
                            onChange={() => handleSingleQuizSelect('slide_22', 'A')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">Yes, managers can negotiate quick private settlements.</span>
                        </label>
                        <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition ${selectedScenarioAnswers['slide_22'] === 'B' ? 'border-accent bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}>
                          <input 
                            type="radio" 
                            name="conc-ans" 
                            checked={selectedScenarioAnswers['slide_22'] === 'B'}
                            onChange={() => handleSingleQuizSelect('slide_22', 'B')}
                            className="accent-accent w-4 h-4 mt-0.5"
                          />
                          <span className="text-xs">No, conciliation is voluntary, and managers cannot force or pressure any settlement.</span>
                        </label>
                      </div>

                      {selectedScenarioAnswers['slide_22'] && (
                        selectedScenarioAnswers['slide_22'] === 'B' ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-lg text-emerald-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            🎉 Correct! Conciliation is a voluntary avenue. Pressure to settle or withdraw claims is highly illegal and disciplinary.
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-lg text-rose-800 text-xs font-mono font-bold text-center mt-3 uppercase tracking-wider">
                            ❌ Incorrect answer. Mangers cannot mediate formal boundary filings. Please select Option B to proceed.
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/25 p-3 rounded-lg text-center text-xs font-mono font-bold text-[#800000] animate-pulse uppercase tracking-wider">
                      🔒 Answer the MCQ correctly to unlock the next screen.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 7 - INTERACTIVE SCENARIO PANELS */}
              {activeSlide.type === 'scenario' && activeScenario && (
                <div className="space-y-6">
                  <div className="text-left font-sans">
                    <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-black px-2.5 py-0.5 rounded-sm tracking-widest uppercase inline-block text-left mb-1.5">
                      Interactive Case Scenario
                    </span>
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase tracking-wider mt-1.5">{activeScenario.title}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 items-start text-left font-sans">
                    {/* Story explanation */}
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-205 text-slate-705 text-sm space-y-3 leading-relaxed">
                      <div className="flex items-center gap-2 text-accent/80 mb-1 font-mono uppercase tracking-widest text-[10px] font-extrabold">
                        <Activity className="w-4 h-4 text-accent" />
                        <span>Case narrative</span>
                      </div>
                      <p>{activeScenario.story}</p>
                    </div>

                    {/* Options form */}
                    <div className="space-y-4">
                      <strong className="text-xs tracking-widest text-slate-550 font-mono uppercase block text-left">
                        {activeScenario.question}
                      </strong>

                      <div className="space-y-2.5">
                        {activeScenario.options.map((opt) => (
                          <label 
                            key={opt.id}
                            className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition text-left ${selectedScenarioAnswers[activeScenario.id] === opt.id ? 'bg-slate-50 border-accent text-slate-900 font-bold shadow-xs' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
                          >
                            <input
                              type="radio"
                              name={`scen_${activeScenario.id}`}
                              checked={selectedScenarioAnswers[activeScenario.id] === opt.id}
                              onChange={() => handleScenarioSelect(activeScenario.id, opt.id)}
                              disabled={scenarioSubmitted[activeScenario.id]}
                              className="accent-accent w-3.5 h-3.5 mt-0.5 shrink-0"
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>

                      {/* Scenario buttons */}
                      {!scenarioSubmitted[activeScenario.id] ? (
                        <button
                          onClick={() => handleScenarioSubmit(activeScenario.id)}
                          disabled={!selectedScenarioAnswers[activeScenario.id]}
                          className="w-full py-3 bg-accent text-white hover:bg-accent/90 disabled:bg-slate-105 disabled:text-slate-400 border border-transparent font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition shadow-xs cursor-pointer"
                          id="submit-scenario-btn"
                        >
                          Submit Case response
                        </button>
                      ) : (
                        <div className={`p-3.5 rounded-lg text-xs leading-relaxed font-sans font-bold text-center border ${selectedScenarioAnswers[activeScenario.id] === activeScenario.correctAnswer ? 'bg-emerald-50 border-emerald-150 text-emerald-800' : 'bg-rose-50 border-rose-150 text-rose-850'}`}>
                          {selectedScenarioAnswers[activeScenario.id] === activeScenario.correctAnswer ? (
                            <span>✔️ {activeScenario.feedback}</span>
                          ) : (
                            <span>❌ Incorrect choice. Correct Answer: {activeScenario.correctAnswer}. {activeScenario.feedback}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {isInteractionCompulsory() && (
                    <div className="bg-[#800000]/5 border border-dashed border-[#800000]/25 p-3 rounded-lg text-xs font-mono font-bold text-[#800000] text-center animate-pulse uppercase tracking-wider">
                      🔒 Please select your scenario answer and click Submit to proceed.
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 8 - QUIZ INTROS */}
              {activeSlide.type === 'quiz-intro' && (
                <div className="text-center space-y-6 py-4 font-sans">
                  <div className="inline-flex p-3.5 bg-accent/10 border border-accent/20 rounded-full text-accent animate-pulse-slow">
                    <Activity className="w-12 h-12 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-display text-slate-900 uppercase tracking-wider">
                    {activeSlide.title}
                  </h2>
                  <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                    You have finished study modules! You have reached the official compliance assessment. 
                    You must score <strong>at least {config.passingScore} out of 5</strong> core questions correctly to verify your training logs.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleNextSlide}
                      className="px-6 py-3.5 bg-accent text-white hover:bg-accent/95 border border-transparent font-black font-mono text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5 mx-auto transition cursor-pointer shadow-sm hover:scale-[1.01] active:translate-y-0.5"
                      id="start-final-quiz-btn"
                    >
                      <span>Start Evaluation Quiz</span>
                      <ChevronRight className="w-5 h-5 text-white animate-pulse" />
                    </button>
                  </div>
                </div>
              )}

              {/* MODULE 8 - CORE SEQUENTIAL EVAL EVALS */}
              {activeSlide.type === 'final-quiz' && (
                <div className="space-y-6 font-sans">
                  <div>
                    <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-black px-2.5 py-0.5 rounded-sm tracking-widest uppercase inline-block text-left mb-1.5">
                      Core Evaluation Index
                    </span>
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase tracking-wider">{activeSlide.title}</h2>
                  </div>

                  {!quizSubmitted ? (
                    <div className="max-w-xl mx-auto text-left space-y-4 pt-2">
                      <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                        <span>QUESTION {activeQuizQuestionIdx + 1} OF 5</span>
                        <HelpCircle className="w-4 h-4 text-accent" />
                      </div>

                      <div className="bg-slate-50 p-4 border border-slate-205 rounded-lg shadow-2xs">
                        <p className="text-sm font-semibold text-slate-850 leading-relaxed font-sans">
                          {QUIZ_QUESTIONS[activeQuizQuestionIdx].question}
                        </p>
                      </div>
{console.log("QUIZ_QUESTIONS===",QUIZ_QUESTIONS)}
{console.log("activeQuizQuestionIdx===",activeQuizQuestionIdx)}
                      <div className="space-y-2.5">
                        {QUIZ_QUESTIONS[activeQuizQuestionIdx].options.map((opt) => {
                          const questionId = QUIZ_QUESTIONS[activeQuizQuestionIdx].id;
                          const isSelected = userSession.quizAnswers[questionId] === opt.id;
                          return (
                            <label 
                              key={opt.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition text-left ${isSelected ? 'border-accent bg-slate-50 font-bold text-slate-900 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                              <input 
                                type="radio"
                                name={`quiz_${questionId}`}
                                checked={isSelected}
                                onChange={() => handleSelectQuizAnswer(questionId, opt.id)}
                                className="accent-accent w-4 h-4 mt-0.5 shrink-0"
                              />
                              <span>{opt.text}</span>
                            </label>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleQuizNext}
                        disabled={!userSession.quizAnswers[QUIZ_QUESTIONS[activeQuizQuestionIdx].id]}
                        className="w-full py-3 bg-accent text-white hover:bg-accent/90 disabled:bg-slate-100 disabled:text-slate-400 disabled:border border-slate-150 font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition cursor-pointer shadow-xs"
                        id="next-quiz-btn"
                      >
                        {activeQuizQuestionIdx < 4 ? 'Next Question' : 'Calculate Quiz Score'}
                      </button>
                    </div>
                  ) : (
                    /* PASS / FAIL VISUALS */
                    <div className="text-center space-y-5 max-w-md mx-auto py-4 font-sans">
                      {quizScore >= config.passingScore ? (
                        <>
                          <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 animate-bounce">
                            <CheckCircle2 className="w-12 h-12" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase tracking-wider">Evaluation Cleared!</h3>
                          <p className="text-sm text-slate-650 leading-relaxed">
                            Congratulations, you scored <strong>{quizScore} out of 5</strong>. You have demonstrated clear grasp of statutory compliance guidelines.
                          </p>
                          <button
                            onClick={handleNextSlide}
                            className="px-6 py-2.5 bg-accent text-white font-bold font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-accent/90 cursor-pointer transition shadow-sm"
                            id="proceed-pass-btn"
                          >
                            Proceed to sign Acknowledgement
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="inline-flex p-3 bg-rose-50 rounded-full text-[#800000] border border-rose-100">
                            <AlertTriangle className="w-12 h-12" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black font-display text-[#800000] uppercase tracking-wider">Evaluation failed</h3>
                          <p className="text-xs text-slate-650 leading-relaxed">
                            Your score of <strong>{quizScore} out of 5</strong> does not meet the company's minimum compliance requirement of {config.passingScore} correct responses. 
                          </p>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-205 text-left text-slate-600 text-[11px] leading-relaxed">
                            💡 <strong>Tip:</strong> Re-study scenario details regarding unwelcome behavior, intent, digital texting limits, and direct manager reporting.
                          </div>
                          <button
                            onClick={handleRetryQuiz}
                            className="px-6 py-3 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#800000] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                            id="retry-quiz-btn"
                          >
                            Retake Quiz Evals
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 8 - ACKNOWLEDGEMENT SIGN-OFF */}
              {activeSlide.type === 'acknowledgement' && (
                <div className="space-y-6">
                  <div className="text-left font-sans">
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase tracking-wider">{activeSlide.title}</h2>
                    <p className="text-[10px] text-accent font-mono uppercase tracking-widest mt-1.5 font-bold">{activeSlide.subtitle}</p>
                  </div>

                  <form onSubmit={handleAcknowledgeSubmit} className="max-w-xl mx-auto text-left space-y-4 pt-2 font-sans">
                    
                    <div className="bg-slate-50 border border-slate-205 p-4 rounded-lg space-y-3 leading-relaxed text-xs text-slate-705 text-left">
                      <h4 className="font-bold text-accent font-mono flex items-center gap-1.5 uppercase tracking-wider">
                        <Signature className="w-4 h-4 text-accent" />
                        <span>STATUTORY AFFIDAVIT DECLARATION</span>
                      </h4>
                      <p>
                        I, <strong className="text-slate-900 font-bold">{userSession.name}</strong>, officially declare and confirm that I have completed this Prevention of Sexual Harassment (POSH) training module in its entirety.
                      </p>
                      <p>
                        I fully understand my rights, standards of workplace conduct, manager directives, and Internal Committee escalations. I certify that I will respect boundaries, maintain confidentiality, and protect our ecosystem from retaliations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-mono font-bold tracking-wider uppercase text-slate-500 block mb-1 text-left text-[10px]">Employee Name</label>
                        <input 
                          type="text" 
                          value={userSession.name} 
                          disabled 
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-700 opacity-80"
                        />
                      </div>
                      <div>
                        <label className="font-mono font-bold tracking-wider uppercase text-slate-500 block mb-1 text-left text-[10px]">Employee ID</label>
                        <input 
                          type="text" 
                          value={userSession.employeeId} 
                          disabled 
                          className="w-full bg-slate-100 border border-slate-205 rounded-lg p-2 font-mono font-bold text-slate-700 opacity-80"
                        />
                      </div>
                    </div>

                    <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer hover:bg-slate-50 text-left transition ${userSession.acknowledged ? 'bg-slate-50 border-accent text-slate-900' : 'bg-white border-slate-200 text-slate-700'}`}>
                      <input 
                        type="checkbox"
                        checked={userSession.acknowledged}
                        onChange={(e) => onChangeSession({ ...userSession, acknowledged: e.target.checked, signatureSubmitted: e.target.checked ? false:true })}
                        className="accent-accent w-4 h-4 mt-0.5 shrink-0 rounded-xs"
                        id="ack-checkbox"
                        required
                      />
                      <span className="text-xs select-none font-medium leading-relaxed">
                        I acknowledge, sign, and authorize this POSH compliance log.
                      </span>
                    </label>

                    {!userSession.signatureSubmitted  ? (
                      <button
                        type="submit"
                        disabled={!userSession.acknowledged}
                        className="w-full py-3 bg-accent text-white disabled:bg-slate-50 disabled:text-slate-400 disabled:border border-slate-200 font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition cursor-pointer shadow-xs"
                      >
                        Authorize Legal Signature
                      </button>
                    ) :  '' }
                    { (userSession.signatureSubmitted && userSession.acknowledged) ?
                    (
                      <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-3.5 rounded-lg text-xs font-sans font-bold text-left leading-relaxed mt-2 uppercase tracking-wide">
                        🎉 Compliance Signature Certified! Completed at {new Date().toLocaleDateString('en-IN')}. Please click Next Screen to display contacts and save/print your license certificate.
                      </div>
                    ) : ('')}

                  </form>
                </div>
              )}

              {/* MODULE 8 - HELPLINE CORE RESOURCES */}
              {activeSlide.type === 'support' && (
                <div className="space-y-6">
                  <div className="text-center font-sans">
                    <span className="bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      👑 CERTIFIED COMPLIANT
                    </span>
                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase tracking-wider mt-2">{activeSlide.title}</h2>
                    <p className="text-xs text-slate-600 mt-1 font-mono uppercase tracking-wider font-semibold">Thank you for helping maintain a dignified and safe work culture.</p>
                  </div>

                  {/* Certification Validity status banner */}
                  {(() => {
                    const completionDateRaw = userSession.completedAt ? new Date(userSession.completedAt) : new Date();
                    const nextRequiredDate = new Date(completionDateRaw.getTime() + 365 * 24 * 60 * 60 * 1000);

                    const completionDateStr = completionDateRaw.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    const nextRequiredDateStr = nextRequiredDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    return (
                      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg text-left shadow-2xs space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-emerald-600 text-white rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-emerald-950 font-sans text-sm uppercase tracking-wide">
                              POSH Certification Validity: ACTIVE & COMPLIANT
                            </h4>
                            <p className="text-xs text-emerald-700 font-medium font-sans">
                              Your annual compliance certification is registered successfully at Actiknow Human Resources.
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2.5 border-t border-emerald-200">
                          <div className="p-3 bg-white/70 rounded-md border border-emerald-100">
                            <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider font-bold">Certification Date</span>
                            <span className="text-xs font-bold text-slate-900 font-sans">{completionDateStr}</span>
                          </div>
                          <div className="p-3 bg-white/70 rounded-md border border-emerald-100">
                            <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider font-bold">Next Recertification Due (365 days)</span>
                            <span className="text-xs font-bold text-emerald-800 font-sans flex items-center gap-1.5">
                              <span>{nextRequiredDateStr}</span>
                              <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold uppercase font-sans animate-pulse">Required</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left font-sans">
                    
                    {/* Printable Certificate component */}
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-205 space-y-4 text-left shadow-2xs">
                      <h4 className="font-bold text-accent font-display font-black text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-accent" />
                        <span>Completion Certificate</span>
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-mono">
                        Your digital completion card is ready. You can download it directly as PDF or print a hard-copy for human resources filing logs.
                      </p>
                      
                      {/* Certificate inline display */}
                      <Certificate userSession={userSession} config={config} />
                    </div>

                    {/* Resources directory */}
                    <div className="space-y-4">
                      
                      {/* Internal Helpline Directory */}
                      <div className="bg-slate-50 p-5 rounded-lg border border-slate-205 space-y-3 text-left shadow-2xs">
                        <h4 className="font-bold text-accent font-display font-black text-xs flex items-center gap-1.5 uppercase tracking-wider">
                          <Mail className="w-4 h-4 text-accent" />
                          <span>Committee Directory Contacts</span>
                        </h4>

                        <div className="space-y-2 text-xs font-sans">
                          <div className="border-b border-slate-205 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Presiding Officer</span>
                            <strong className="text-slate-850 font-bold">Deepika Malhotra</strong> <span className="text-slate-500">(Vice President) – Committee Head</span>
                          </div>
                          <div className="border-b border-slate-205 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">External Member</span>
                            <strong className="text-slate-850 font-bold">Anindita Mitra</strong> <span className="text-slate-500">(Advocate) – External Committee Member</span>
                          </div>
                          <div className="border-b border-slate-205 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Committee Members & Coordinator</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-705 font-medium mt-0.5">
                              <li><strong>Sumit Jhunjhunwala</strong> (Director) – Member</li>
                              <li><strong>Twinkle Gupta</strong> (Sr. Engagement Manager) – Member</li>
                              <li><strong>Himani Duhan</strong> (Sr. Engagement Manager) – Coordinator</li>
                            </ul>
                          </div>
                          <div className="border-b border-slate-205 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Official Email</span>
                            <strong className="text-accent font-mono select-all underline font-bold">Posh@actiknow.com</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block uppercase">Official Phone</span>
                            <strong className="text-slate-850 font-mono font-bold">+91 11 450 527 11</strong>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Persistent slide navigation footer */}
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
              
              {/* Back slide action */}
              <button
                onClick={handlePrevSlide}
                disabled={activeSlideIndex === 0}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-705 disabled:opacity-30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                id="back-slide-action-btn"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Prev Screen</span>
              </button>

              {/* Next slide action */}
              {activeSlide.type !== 'final-quiz' ? (
                <button
                  onClick={handleNextSlide}
                  disabled={isInteractionCompulsory() || activeSlideIndex === ALL_SLIDES.length - 1}
                  className="px-5 py-2.5 bg-accent text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs hover:bg-accent/90 transition cursor-pointer"
                  id="next-slide-action-btn"
                >
                  <span>Next Screen</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <div className="w-[105px]"></div>
              )}

            </div>
          </div>
        </>
      )}

        

    </div>
    // <div className="bg-slate-50 min-h-screen flex flex-col justify-between selection:bg-accent selection:text-white">
      
    //   {!userSession.isRegistered ? (
    //     <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-screen">
    //       <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden max-w-lg w-full text-left">
    //         <div className="bg-[#800000] p-6 text-white text-center border-b border-rose-900/10">
    //           <Shield className="w-10 h-10 text-white mx-auto mb-2" />
    //           <h2 className="text-xl md:text-2xl font-extrabold font-display uppercase tracking-wider text-white">Compliance Enrollment</h2>
    //           <p className="text-[10px] text-rose-250 mt-1 uppercase tracking-widest font-mono font-bold">
    //             Statutory POSH Awareness Program • India
    //           </p>
    //         </div>

    //         <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
    //           <div className="bg-[#800000]/5 border border-[#800000]/15 p-3.5 rounded-lg text-xs leading-relaxed text-slate-705 font-sans">
    //             <strong className="text-[#800000]">📝 MANDATORY TRAINING NOTICE:</strong> This interactive training module is required under India's Prevention of Sexual Harassment (POSH) regulations. Your completion and quiz details will be logged in company compliance audits.
    //           </div>

    //           <div>
    //             <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
    //             <input 
    //               type="text"
    //               placeholder="Employee First & Last Name"
    //               value={enrollForm.name}
    //               onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
    //               className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
    //               required
    //             />
    //           </div>

    //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //             <div>
    //               <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Employee Email</label>
    //               <input 
    //                 type="email"
    //                 placeholder="name@company.com"
    //                 value={enrollForm.email}
    //                 onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
    //                 className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
    //                 required
    //               />
    //             </div>
    //             <div>
    //               <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Employee ID</label>
    //               <input 
    //                 type="text"
    //                 placeholder="e.g. EMP-1049"
    //                 value={enrollForm.employeeId}
    //                 onChange={(e) => setEnrollForm({ ...enrollForm, employeeId: e.target.value })}
    //                 className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
    //                 required
    //               />
    //             </div>
    //           </div>

    //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    //             <div>
    //               <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Department</label>
    //               <select 
    //                 value={enrollForm.department}
    //                 onChange={(e) => setEnrollForm({ ...enrollForm, department: e.target.value })}
    //                 className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-accent focus:outline-hidden"
    //               >
    //                 <option value="Engineering">Engineering</option>
    //                 <option value="Human Resources">Human Resources</option>
    //                 <option value="Sales & Marketing">Sales & Marketing</option>
    //                 <option value="Operations">Operations</option>
    //                 <option value="Product Management">Product Management</option>
    //               </select>
    //             </div>
    //             <div>
    //               <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Designation</label>
    //               <input 
    //                 type="text"
    //                 value={enrollForm.role}
    //                 onChange={(e) => setEnrollForm({ ...enrollForm, role: e.target.value })}
    //                 className="w-full text-xs font-semibold bg-white border border-slate-300 text-slate-800 p-3 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
    //                 required
    //               />
    //             </div>
    //             <div>
    //               <label className="text-[10px] font-extrabold text-slate-600 block uppercase tracking-wider mb-1.5 font-mono">Office branch</label>
    //               <select
    //                 value={enrollForm.city}
    //                 onChange={(e) => setEnrollForm({ ...enrollForm, city: e.target.value })}
    //                 className="w-full text-xs font-bold bg-white text-slate-800 border border-slate-300 rounded-lg p-3 focus:ring-1 focus:ring-accent focus:outline-hidden"
    //               >
    //                 <option value="Bengaluru">Bengaluru</option>
    //                 <option value="Mumbai">Mumbai</option>
    //                 <option value="Delhi NCR">Delhi NCR</option>
    //                 <option value="Hyderabad">Hyderabad</option>
    //                 <option value="Pune">Pune</option>
    //                 <option value="Chennai">Chennai</option>
    //               </select>
    //             </div>
    //           </div>

    //           <button
    //             type="submit"
    //             className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest rounded-lg mt-4 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
    //             id="start-training-enroll-btn"
    //           >
    //             <span>Authorize & Enroll in Course</span>
    //             <ChevronRight className="w-5 h-5 text-white" />
    //           </button>

    //           <p className="text-[10px] text-center text-slate-400 font-mono uppercase">
    //             By enrolling, you certify these particulars are officially assigned.
    //           </p>
    //         </form>
    //       </div>
    //     </div>
    //   ) : userSession.acknowledged ? (
    //     <Certificate userSession={userSession} config={config} />
    //   ) : (
    //     <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
    //       <div className="bg-white border border-slate-200 shadow-md rounded-xl max-w-4xl w-full p-6 md:p-10">
    //         <h2 className="text-2xl font-black uppercase tracking-wider font-display text-slate-900 mb-6">Training Module</h2>
    //         <p className="text-sm text-slate-600 mb-4">Slide {activeSlideIndex + 1} of {ALL_SLIDES.length}</p>
    //         <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
    //           <div 
    //             className="bg-accent h-2 rounded-full transition-all duration-300"
    //             style={{ width: `${((activeSlideIndex + 1) / ALL_SLIDES.length) * 100}%` }}
    //           ></div>
    //         </div>
            
    //         {activeSlide && (
    //           <div className="min-h-[300px] mb-6">
    //             <h3 className="text-xl font-bold mb-2">{activeSlide.title}</h3>
    //             <p className="text-slate-600">{activeSlide.subtitle || 'Training content'}</p>
    //           </div>
    //         )}

    //         <div className="flex justify-between gap-4">
    //           <button
    //             onClick={handlePrevSlide}
    //             disabled={activeSlideIndex === 0}
    //             className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-bold rounded-lg transition cursor-pointer flex items-center gap-2"
    //           >
    //             <ArrowLeft className="w-4 h-4" />
    //             Previous
    //           </button>
              
    //           {activeSlideIndex === ALL_SLIDES.length - 1 ? (
    //             <button
    //               onClick={handleAcknowledgeSubmit}
    //               className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition cursor-pointer"
    //             >
    //               Complete & Sign
    //             </button>
    //           ) : (
    //             <button
    //               onClick={handleNextSlide}
    //               disabled={isInteractionCompulsory()}
    //               className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-2"
    //             >
    //               Next
    //               <ArrowRight className="w-4 h-4" />
    //             </button>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}
