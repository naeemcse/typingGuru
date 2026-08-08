import React, { useState } from 'react';
import { Award, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { SessionMetrics, UserSettings } from '../../types';

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
  const [candidateName, setCandidateName] = useState('মোঃ নাজমুল ইসলাম');
  const [candidateId, setCandidateId] = useState(`REG-${Math.floor(100000 + Math.random() * 900000)}`);
  
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8 flex flex-col gap-6 text-slate-100 print:bg-white print:text-black print:p-0 print:shadow-none print:border-none">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Area */}
        <div className="border-4 border-indigo-500/40 p-6 sm:p-8 rounded-2xl relative bg-slate-950/40 print:border-slate-900">
          
          {/* Certificate Header */}
          <div className="text-center flex flex-col items-center gap-2 border-b border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-1">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase text-indigo-300 font-sans">
              CERTIFICATE OF TYPING PROFICIENCY
            </h1>
            <p className="text-xs text-slate-400 font-bangla">
              {settings.language === 'bn' ? 'টাইপিং দক্ষতা ও কম্পিউটিং অ্যাসেসমেন্ট সনদপত্র' : 'Official Recruitment & Assessment Certificate'}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest">THIS IS TO CERTIFY THAT</p>
            
            {/* Candidate Name Input */}
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="text-xl sm:text-2xl font-extrabold text-center bg-transparent border-b border-indigo-500/50 focus:border-indigo-400 focus:outline-none text-emerald-400 font-bangla px-4 py-1"
              placeholder="Candidate Full Name"
            />

            <p className="text-xs text-slate-300 font-bangla max-w-lg leading-relaxed pt-2">
              {settings.language === 'bn'
                ? `সফলভাবে টাইপিং দক্ষতা অ্যাসেসমেন্ট সম্পন্ন করেছেন। টাইপিং গতি ও নির্ভুলতা যাচাইয়ের তথ্য নিচে প্রদত্ত হলো:`
                : `has successfully completed the computer typing assessment for candidate evaluation.`}
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-4 w-full my-4">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-sans uppercase">NET SPEED</span>
                <span className="text-2xl font-black text-indigo-400">{metrics.netWpm} WPM</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-sans uppercase">CHAR SPEED</span>
                <span className="text-2xl font-black text-emerald-400">{metrics.cpm} CPM</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-sans uppercase">ACCURACY</span>
                <span className="text-2xl font-black text-amber-400">{Math.round(metrics.accuracy * 100)}%</span>
              </div>
            </div>

            {/* Status & Verification Footer */}
            <div className="w-full flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex flex-col items-start gap-1">
                <span>Issue Date: <strong className="text-slate-200">{currentDate}</strong></span>
                <span>Verification ID: <strong className="text-indigo-400 font-mono">{candidateId}</strong></span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isPassed ? 'QUALIFIED / PASSED' : 'ASSESSED'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="flex items-center justify-end gap-3 print:hidden">
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
