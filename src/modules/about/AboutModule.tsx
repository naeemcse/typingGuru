import React from 'react';
import {
  User,
  Briefcase,
  MapPin,
  Mail,
  ExternalLink,
  Sparkles,
  Compass,
  Code2,
  Layers,
  Globe,
  Heart,
  Download
} from 'lucide-react';
import { UserSettings } from '../../types';
import commonData from '../../content/common-data.json';

interface AboutModuleProps {
  settings: UserSettings;
}

// Inline Social Icon Components for TypeScript build safety
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ChromeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export const AboutModule: React.FC<AboutModuleProps> = ({ settings }) => {
  const { developer, social, otherProjects, platform } = commonData;
  const isBn = settings.language === 'bn';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">

      {/* Main Banner Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-sans">
                Open Source Project
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-sans">
                BN / EN Keyboard Tutor
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              {platform.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed">
              {isBn
                ? 'বাংলা (বিজয়, জাতীয়, অভ্র ফোনেটিক) ও ইংরেজি টাইপিং স্পিড টেস্ট, টিউটোরিয়াল এবং সরকারি ও কর্পোরেট চাকরি পরীক্ষার নিখুঁত প্রস্তুতির জন্য একটি আধুনিক প্ল্যাটফর্ম।'
                : platform.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={social.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-lg"
            >
              <GithubIcon className="w-4 h-4 text-indigo-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Developer Profile Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
              {isBn ? 'ডেভেলপার পরিচিতি' : 'About the Developer'}
            </h2>
            <p className="text-xs text-slate-400 font-bangla">
              {isBn ? 'প্রজেক্টের নির্মাতা ও সফটওয়্যার প্রকৌশলী' : 'Creator & Software Engineer'}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Main Info */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-extrabold text-white font-sans">
                {developer.name}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-lg">
                {developer.role}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>{developer.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{developer.location}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-1 bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
              "{developer.summary}"
            </p>
          </div>

          {/* Social Links Cards */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans px-1">
              {isBn ? 'যোগাযোগ ও সোশ্যাল মিডিয়া' : 'Connect & Socials'}
            </span>

            {/* LinkedIn */}
            <a
              href={social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="glass-card rounded-xl p-3 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <span>LinkedIn Profile</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            </a>

            {/* GitHub */}
            <a
              href={social.github}
              target="_blank"
              rel="noreferrer"
              className="glass-card rounded-xl p-3 border border-slate-800 hover:border-slate-600 flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <span>GitHub @naeemcse</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </a>

            {/* YouTube */}
            <a
              href={social.youtube}
              target="_blank"
              rel="noreferrer"
              className="glass-card rounded-xl p-3 border border-slate-800 hover:border-red-500/50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <YoutubeIcon className="w-4 h-4" />
                </div>
                <span>YouTube @ICTCareHome</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${social.email}`}
              className="glass-card rounded-xl p-3 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[160px]">{social.email}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Other Featured Projects Section (ApplyMama) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                {isBn ? 'অন্যান্য দরকারি প্রজেক্ট' : 'Other Projects'}
              </h2>
              <p className="text-xs text-slate-400 font-bangla">
                {isBn ? 'চাকরিপ্রার্থীদের জন্য ডেভেলপ করা অটোমেশন ও ব্রাউজার এক্সটেনশন' : 'Tools & Browser Extensions for Job Seekers'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {otherProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-extrabold text-white font-sans">
                    {project.name}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full">
                    {project.tagline}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Action Store Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Live Web Link */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Chrome */}
                {project.storeUrls?.chrome && (
                  <a
                    href={project.storeUrls.chrome}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                  >
                    <ChromeIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Chrome Extension</span>
                  </a>
                )}

                {/* Edge */}
                {project.storeUrls?.edge && (
                  <a
                    href={project.storeUrls.edge}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edge Addon</span>
                  </a>
                )}

                {/* Firefox */}
                {project.storeUrls?.firefox && (
                  <a
                    href={project.storeUrls.firefox}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-orange-500 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-400" />
                    <span>Firefox Addon</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Architecture & Open Source Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-1">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">
            {isBn ? 'ডিকাপল্ড JSON আর্কিটেকচার' : 'Decoupled Content'}
          </h4>
          <p className="text-xs text-slate-400 font-bangla leading-relaxed">
            {isBn
              ? 'সকল টিউটোরিয়াল, অনুচ্ছেদ ও পরীক্ষার কনটেন্ট ডিকাপল্ড JSON ফাইলে সংরক্ষিত — কোড না ছুঁয়েই নতুন কনটেন্ট যুক্ত করা যায়।'
              : 'All passages and exam sets are isolated in pure JSON files for fast and modular updates.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-1">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">
            {isBn ? 'বিজয়, অভ্র ও জাতীয় কিবোর্ড' : 'Triple Layout Engine'}
          </h4>
          <p className="text-xs text-slate-400 font-bangla leading-relaxed">
            {isBn
              ? 'বিজয় (ইউনিকোড), অভ্র ফোনেটিক এবং জাতীয় (জাতীয় ইউনিকোড) কিবোর্ড লেআউট সাপোর্ট।'
              : 'Full input engine support for Bijoy Unicode, Avro Phonetic, and National Unicode standards.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-1">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">
            {isBn ? 'ওপেন সোর্স ও সম্পূর্ণ ফ্রি' : '100% Free & Open Source'}
          </h4>
          <p className="text-xs text-slate-400 font-bangla leading-relaxed">
            {isBn
              ? 'কোনো হিডেন চার্জ বা রেজিস্ট্রেশন ছাড়াই যেকোনো ডিভাইসে যেকোনো সময় সরাসরি ব্যবহার উপযোগী।'
              : 'Built for job candidates and students — 100% free with no account setup required.'}
          </p>
        </div>
      </div>

    </div>
  );
};
