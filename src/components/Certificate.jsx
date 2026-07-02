/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Award, Printer, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function Certificate({ userSession, config }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;

    const styleSheet = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>POSH Completion Certificate - ${userSession.name}</title>
            <style>
              ${styleSheet}
              body {
                background: white;
                color: black;
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 98vh;
              }
              @page {
                size: landscape;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div>${printContent}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  const getCertificateId = () => {
    const raw = `${userSession.employeeId || 'EMP'}-${userSession.department || 'DEPT'}-${config.companyName || 'CO'}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `POSH-${Math.abs(hash).toString(16).toUpperCase()}-${new Date(userSession.acknowledgedAt || Date.now()).getFullYear()}`;
  };

  const certId = getCertificateId();
  const completionDate = userSession.acknowledgedAt 
    ? new Date(userSession.acknowledgedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

  return (
    <div className="space-y-12">
      <div 
        ref={printRef} 
        className="relative bg-white border-[10px] border-double border-accent p-8 md:p-12 text-center shadow-md max-w-4xl mx-auto rounded-lg text-slate-800"
        style={{ contentVisibility: 'auto' }}
      >
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-accent/50"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-accent/50"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-accent/50"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-accent/50"></div>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-accent/5 text-accent mb-2 border border-accent/20 rounded-lg">
              <Award className="w-12 h-12" />
            </div>
            <h4 className="text-accent tracking-widest text-xs uppercase font-mono font-bold">
              STATUTORY COMPLIANCE RECORD
            </h4>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-slate-900 font-display tracking-tight">
              Certificate of Completion
            </h2>
            <p className="text-xs font-sans italic text-slate-500 max-w-lg mx-auto">
              Completed under the Prevention of Sexual Harassment of Women at Workplace
              (Prevention, Prohibition and Redressal) Act, 2013 [India]
            </p>
          </div>

          <div className="py-2">
            <span className="text-[10px] text-slate-450 block tracking-widest uppercase font-mono">This certifies that</span>
            <span className="text-2xl md:text-3xl font-black uppercase text-accent block py-1 border-b border-slate-200 max-w-md mx-auto font-display">
              {userSession.name || 'Valued Employee'}
            </span>
            <span className="text-xs text-slate-500 block mt-2 font-mono">
              Emp ID: <strong className="text-slate-900">{userSession.employeeId || 'N/A'}</strong> • Dept: <strong className="text-slate-900">{userSession.department || 'N/A'}</strong>
            </span>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto py-2">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
              has successfully completed the <strong>Prevention of Sexual Harassment (POSH) Awareness Training</strong>.
              The program educates staff on rights, standards of conduct, recognizing boundaries, bystander action logs, 
              reporting methods, and strict confidentiality guidelines under Indian Law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-3xl mx-auto">
            <div className="flex flex-col justify-end text-center">
              <span className="text-[10px] text-slate-400 font-mono block">DATE OF COMPLETION</span>
              <span className="text-sm font-semibold text-slate-900 font-sans">{completionDate}</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-accent bg-accent/5 px-3 py-1.5 rounded-md border border-accent/20 text-xs font-semibold font-mono">
                <BadgeCheck className="w-4 h-4" />
                <span>QUIZ CLEARED ({userSession.quizScore}/5)</span>
              </div>
            </div>

            <div className="flex flex-col justify-end text-center">
              <span className="text-[10px] text-slate-400 font-mono block">PRESIDING OFFICER</span>
              <span className="text-xs font-bold text-slate-900 uppercase font-sans border-t border-dashed border-slate-350 pt-1 mt-1 max-w-[170px] mx-auto">
                {config.presidingOfficer || 'Presiding Officer, IC'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono mt-4">
            <span>COMPANY: {config.companyName.toUpperCase()}</span>
            <span>CERT ID: {certId}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold uppercase text-xs tracking-wider rounded-md flex items-center gap-2 shadow-xs transition cursor-pointer"
          id="print-certificate-btn"
        >
          <Printer className="w-4 h-4" />
          <span>Print or Save as PDF</span>
        </button>
      </div>
    </div>
  );
}
