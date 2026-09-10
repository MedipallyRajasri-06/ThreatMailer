import React from 'react';
import { ArrowRight, Play, Zap, Fingerprint, Terminal, AlertTriangle } from 'lucide-react';

interface HeroSectionProps {
  onStartInvestigation: () => void;
  onTryDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartInvestigation, onTryDemo }) => {
  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Cyber Grid & Glow effects */}
      <div className="absolute inset-0 cyber-grid opacity-60 dark:opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-xs font-mono mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          <span className="font-semibold">Next-Gen Email Threat Intelligence & Forensics</span>
        </div>

        {/* Mandatory Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
          AI-Powered Email{' '}
          <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Threat Intelligence
          </span>
        </h1>

        {/* Mandatory Subtitle */}
        <p className="text-xl sm:text-2xl font-mono text-cyan-700 dark:text-cyan-300/90 font-medium mb-6 tracking-wide">
          Detect. Investigate. Trace.
        </p>

        {/* Platform Overview Description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          A modern cybersecurity SOC platform combining explainable AI threat scoring with deep email header
          forensics, IP infrastructure intelligence, typosquatting domain detection, and interactive hop-by-hop
          geolocation mapping. Empowering incident responders, law enforcement, and security teams with instant
          actionable forensic evidence.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartInvestigation}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] cursor-pointer"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/60 transition-all shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-emerald-600 dark:text-emerald-400" />
            <span>Try Demo (Instant Case)</span>
          </button>
        </div>

        {/* Live Cyber Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
          <div className="text-left p-3">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> AI Detection Engine
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">Multi-Vector Heuristics</p>
          </div>
          <div className="text-left p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Header Parsing
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">RFC 5322 Compliant</p>
          </div>
          <div className="text-left p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Geolocation
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">Leaflet Hop Path</p>
          </div>
          <div className="text-left p-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Standard Exports
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">STIX 2.1 & PDF Dossiers</p>
          </div>
        </div>
      </div>
    </section>
  );
};
