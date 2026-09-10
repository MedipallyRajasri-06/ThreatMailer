import React from 'react';
import { ExternalLink, PlusCircle, PlayCircle } from 'lucide-react';
import { RECENT_INVESTIGATIONS_FEED } from '../../data/historicalData';
import { Badge } from '../common/Badge';

interface RecentInvestigationsProps {
  onSelectInvestigation: (id: string) => void;
  onStartNew: () => void;
  onLaunchDemo: () => void;
}

export const RecentInvestigations: React.FC<RecentInvestigationsProps> = ({
  onSelectInvestigation,
  onStartNew,
  onLaunchDemo,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Investigations</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 font-semibold">
              Active SOC Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Audit logs and evidentiary trails indexed by threat level
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onLaunchDemo}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Judge Demo Case</span>
          </button>

          <button
            onClick={onStartNew}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start New Investigation</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px]">
              <th className="pb-3 font-semibold">Investigation ID</th>
              <th className="pb-3 font-semibold">Sender & Subject</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Threat Score</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 font-semibold">Timestamp</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {RECENT_INVESTIGATIONS_FEED.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                <td className="py-3 font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  {item.id}
                </td>
                <td className="py-3 max-w-xs sm:max-w-md">
                  <p className="text-slate-900 dark:text-slate-200 font-medium truncate group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">
                    {item.subject}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{item.sender}</p>
                </td>
                <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 font-mono font-bold">
                  <span
                    className={
                      item.score >= 80
                        ? 'text-red-600 dark:text-red-400'
                        : item.score >= 60
                        ? 'text-amber-600 dark:text-amber-400'
                        : item.score >= 30
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {item.score}/100
                  </span>
                </td>
                <td className="py-3">
                  <Badge level={item.riskLevel} size="sm" />
                </td>
                <td className="py-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {item.timestamp}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onSelectInvestigation(item.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/80 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-all font-mono text-[11px]"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
