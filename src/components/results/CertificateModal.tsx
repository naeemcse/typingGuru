import React, { useState } from 'react';
import { Award, Printer, X, ShieldCheck, UserCheck, Edit3 } from 'lucide-react';
import { SessionMetrics, UserSettings } from '../../types';
import { StorageAdapter } from '../../lib/storage/storageAdapter';

interface CertificateModalProps {
  metrics: SessionMetrics;
  contentTitle: string;
  settings: UserSettings;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  metrics,
  contentTitle,
  settings,
  onClose,
}) => {
  const [candidateName, setCandidateName] = useState(() => StorageAdapter.getCandidateName() || '');
  const [candidateId] = useState(`REG-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleNameChange = (name: string) => {
    setCandidateName(name);
    StorageAdapter.saveCandidateName(name);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPassed = metrics.netWpm >= 25 && metrics.accuracy >= 0.9;
  const currentDate = new Date().toLocaleDateString(settings.language === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="certificate-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="certificate-modal-wrapper w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto flex flex-col gap-5 text-slate-100 print:bg-white print:text-black print:p-0 print:shadow-none print:border-none">

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 print:hidden no-print"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Name Input Header Controls (Screen Only) */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col gap-2 print:hidden no-print">
          <label className="text-xs font-bold text-slate-300 font-bangla flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>
              {settings.language === 'bn' ? 'সনদপত্রের জন্য পরীক্ষার্থীর পূর্ণ নাম:' : 'Candidate Full Name for Certificate:'}
            </span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={candidateName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={settings.language === 'bn' ? 'আপনার নাম লিখুন (যেমন: মোঃ নাজমুল ইসলাম)...' : 'Type your full name here...'}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-bangla focus:outline-none focus:ring-1 focus:ring-indigo-500/50 pr-10"
            />
            <Edit3 className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div id="printable-certificate" className="certificate-printable-card border-4 border-indigo-500/40 p-5 sm:p-6 rounded-2xl relative bg-slate-950/40 print:border-slate-900 print:bg-white print:text-slate-900">

          {/* Certificate Header */}
          <div className="text-center flex flex-col items-center gap-1.5 border-b border-slate-800 print:border-slate-300 pb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-0.5 print:bg-indigo-100 print:border-indigo-400 print:text-indigo-700">
              <Award className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase text-indigo-300 font-sans print:text-indigo-950">
              CERTIFICATE OF TYPING PROFICIENCY
            </h1>
            <p className="text-[11px] text-slate-400 font-bangla print:text-slate-600">
              {settings.language === 'bn' ? 'টাইপিং দক্ষতা ও কম্পিউটিং অ্যাসেসমেন্ট সনদপত্র' : 'Official Recruitment & Assessment Certificate'}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-4 flex flex-col items-center text-center gap-3">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest print:text-slate-500 font-sans font-bold">THIS IS TO CERTIFY THAT</p>

            {/* Candidate Name Display */}
            <div className="w-full max-w-lg border-b-2 border-indigo-500/40 print:border-slate-800 py-1 text-center">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-bangla print:text-slate-900">
                {candidateName.trim() || (settings.language === 'bn' ? 'পরীক্ষার্থীর নাম' : 'Candidate Name')}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-bangla max-w-lg leading-relaxed pt-1 print:text-slate-700">
              {settings.language === 'bn'
                ? `সফলভাবে টাইপিং দক্ষতা অ্যাসেসমেন্ট সম্পন্ন করেছেন। টাইপিং গতি ও নির্ভুলতা যাচাইয়ের তথ্য নিচে প্রদত্ত হলো:`
                : `has successfully completed the computer typing assessment for candidate evaluation.`}
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3 w-full my-2">
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center print:bg-slate-100 print:border-slate-300">
                <span className="text-[9px] text-slate-400 font-sans uppercase font-bold print:text-slate-600">NET SPEED</span>
                <span className="text-xl font-black text-indigo-400 print:text-indigo-700">{metrics.netWpm} WPM</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center print:bg-slate-100 print:border-slate-300">
                <span className="text-[9px] text-slate-400 font-sans uppercase font-bold print:text-slate-600">CHAR SPEED</span>
                <span className="text-xl font-black text-emerald-400 print:text-emerald-700">{metrics.cpm} CPM</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center print:bg-slate-100 print:border-slate-300">
                <span className="text-[9px] text-slate-400 font-sans uppercase font-bold print:text-slate-600">ACCURACY</span>
                <span className="text-xl font-black text-amber-400 print:text-amber-700">{Math.round(metrics.accuracy * 100)}%</span>
              </div>
            </div>

            {/* Status & Verification Footer */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400 print:border-slate-300 print:text-slate-600">
              <div className="flex flex-col items-start gap-0.5">
                <span>Issue Date: <strong className="text-slate-200 print:text-slate-900">{currentDate}</strong></span>
                <span>Verification ID: <strong className="text-indigo-400 font-mono print:text-indigo-800">{candidateId}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-semibold text-xs print:bg-emerald-50 print:border-emerald-300 print:text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                <span>{isPassed ? 'QUALIFIED / PASSED' : 'ASSESSED'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex items-center justify-end gap-3 print:hidden no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{settings.language === 'bn' ? 'প্রিন্ট / PDF সেভ করুন' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
