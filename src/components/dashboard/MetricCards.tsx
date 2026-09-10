import React from 'react';
import { Mail, AlertOctagon, AlertTriangle, ShieldCheck, Server, Globe, Skull } from 'lucide-react';
import { DashboardMetrics } from '../../types/forensic';

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Emails Analyzed',
      value: metrics.totalAnalyzed.toLocaleString(),
      change: '+14% today',
      icon: Mail,
      color: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-500/30',
      bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    },
    {
      title: 'Phishing Detected',
      value: metrics.phishingDetected.toLocaleString(),
      change: 'High confidence',
      icon: Skull,
      color: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-500/30',
      bg: 'bg-red-50/50 dark:bg-red-950/20',
    },
    {
      title: 'High Risk Emails',
      value: metrics.highRiskCount.toLocaleString(),
      change: 'Immediate triage',
      icon: AlertOctagon,
      color: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-500/30',
      bg: 'bg-orange-50/50 dark:bg-orange-950/20',
    },
    {
      title: 'Medium Risk Emails',
      value: metrics.mediumRiskCount.toLocaleString(),
      change: 'Under monitoring',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/30',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    },
    {
      title: 'Low Risk / Clean',
      value: metrics.lowRiskCount.toLocaleString(),
      change: 'Passed authentication',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/30',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    },
    {
      title: 'Malicious IPs Found',
      value: metrics.maliciousIps.toLocaleString(),
      change: 'Blocked at firewall',
      icon: Server,
      color: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-500/30',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
    },
    {
      title: 'Suspicious Domains',
      value: metrics.suspiciousDomains.toLocaleString(),
      change: 'Typosquatting feeds',
      icon: Globe,
      color: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-500/30',
      bg: 'bg-purple-50/50 dark:bg-purple-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border ${card.border} ${card.bg} flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium truncate">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 truncate">{card.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
