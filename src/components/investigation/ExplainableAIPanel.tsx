import React from 'react';
import { Cpu, CheckCircle2, Info } from 'lucide-react';
import { ExplainableReason } from '../../types/forensic';
import { Badge } from '../common/Badge';

interface ExplainableAIPanelProps {
  reasons: ExplainableReason[];
  threatScore: number;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  reasons,
  threatScore,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Explainable AI: Why Was This Email Flagged?</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Transparent heuristic & ML feature attribution explaining risk calculation in plain language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Total Factors Evaluated:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
            {reasons.length} Findings
          </span>
        </div>
      </div>

      {/* Reasons list */}
      <div className="space-y-3">
        {reasons.map((reason, index) => {
          const isCritical = reason.severity === 'CRITICAL';
          const isHigh = reason.severity === 'HIGH';
          const isMedium = reason.severity === 'MEDIUM';

          return (
            <div
              key={reason.id || index}
              className={`p-4 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-red-50/70 border-red-200 dark:bg-red-950/20 dark:border-red-900/60'
                  : isHigh
                  ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60'
                  : isMedium
                  ? 'bg-yellow-50/70 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/60'
                  : 'bg-slate-50 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCritical
                        ? 'bg-red-500 animate-pulse'
                        : isHigh
                        ? 'bg-amber-500'
                        : isMedium
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                    {reason.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-medium">
                    Category: {reason.category}
                  </span>
                  <Badge level={reason.severity} size="sm" />
                </div>
              </div>

              {/* Technical evidentiary detail */}
              <div className="pl-4 sm:pl-4.5 border-l-2 border-slate-300 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed mt-2">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block sm:inline mr-1.5 font-semibold">
                  FORENSIC EVIDENCE:
                </span>
                {reason.evidence}
              </div>
            </div>
          );
        })}

        {reasons.length === 0 && (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No malicious threats or anomalies detected. All authentication vectors validated cleanly.
          </div>
        )}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
        <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Non-technical summary: This email exhibits multiple indicators commonly used by cybercriminals, including
          disguised domain names, forged transmission signatures, and coercive calls to action to harvest credentials.
        </span>
      </div>
    </div>
  );
};
