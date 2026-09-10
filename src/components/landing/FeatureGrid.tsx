import React from 'react';
import {
  Cpu,
  Fingerprint,
  Network,
  MapPin,
  Globe2,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react';

interface FeatureGridProps {
  onSelectFeature?: (feature: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'ai-threat',
      icon: Cpu,
      title: 'AI Threat Detection',
      tag: '0–100 Risk Scoring',
      desc: 'Multivariate ML & heuristic engine evaluating social engineering indicators, homoglyph traps, urgent language coercion, and credential harvesting signals.',
      color: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-slate-800/80 border-cyan-200 dark:border-slate-700',
    },
    {
      id: 'email-forensics',
      icon: Fingerprint,
      title: 'Email Forensics',
      tag: 'RFC 5322 Metadata',
      desc: 'Deep structural decomposition of message headers, SPF / DKIM / DMARC cryptographic alignment checks, Return-Path tampering, and user agent fingerprinting.',
      color: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-700',
    },
    {
      id: 'ip-intel',
      icon: Network,
      title: 'IP Intelligence',
      tag: 'ASN & Relay Audit',
      desc: 'Originating IP extraction from Received hop chains, Autonomous System Number (ASN) categorization, bulletproof hosting detection, and transit peer mapping.',
      color: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-slate-800/80 border-amber-200 dark:border-slate-700',
    },
    {
      id: 'geolocation',
      icon: MapPin,
      title: 'GeoLocation',
      tag: 'Interactive OpenStreetMap',
      desc: 'Interactive Leaflet visualization charting the physical global relay vector from attacker origin node across international data centers to target inbox.',
      color: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-slate-800/80 border-emerald-200 dark:border-slate-700',
    },
    {
      id: 'domain-analysis',
      icon: Globe2,
      title: 'Domain Analysis',
      tag: 'Typosquatting & WHOIS',
      desc: 'Levenshtein homoglyph distance scoring against monitored Fortune 500 & government brands, detecting character substitution (1 for l, 0 for o) and new registrations.',
      color: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-slate-800/80 border-rose-200 dark:border-slate-700',
    },
    {
      id: 'forensic-reports',
      icon: FileCheck2,
      title: 'Forensic Reports',
      tag: 'STIX 2.1 & PDF Dossiers',
      desc: 'Automated chain-of-custody incident documentation, complete with cryptographic hash verification, structured IOC tables, and one-click PDF generation.',
      color: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-slate-800/80 border-sky-200 dark:border-slate-700',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-700 dark:text-cyan-400 font-bold mb-2">
          Investigation Capabilities
        </h2>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Comprehensive Cyber Threat Telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              onClick={() => onSelectFeature && onSelectFeature(feature.id)}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-md flex flex-col justify-between group cursor-default shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border ${feature.iconBg} ${feature.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                <span>SOC Verified</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
