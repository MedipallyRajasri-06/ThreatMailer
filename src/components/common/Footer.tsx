import React from 'react';
import { ShieldCheck, Lock, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060911] text-slate-600 dark:text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16 no-print transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">ThreatMailer Forensics</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-slate-700">
              Enterprise SOC Platform
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            AI-Powered Email Threat Detection, GeoLocation Routing and Forensic Intelligence Platform.
          </p>
          <p className="text-[11px] text-slate-500 italic">
            Privacy & Compliance Notice: Email analysis is performed for security investigation purposes. IP
            geolocation represents approximate network routing location and should not be interpreted as the physical
            location of an individual.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Zero-Retention Analysis</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Globe2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>GeoIP Routing Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
