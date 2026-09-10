import React, { useState } from 'react';
import { Clock, Search, ExternalLink, PlusCircle } from 'lucide-react';
import { InvestigationData } from '../../types/forensic';
import { Badge } from '../common/Badge';

interface InvestigationHistoryViewProps {
  investigations: InvestigationData[];
  onSelectInvestigation: (id: string) => void;
  onStartNew: () => void;
}

export const InvestigationHistoryView: React.FC<InvestigationHistoryViewProps> = ({
  investigations,
  onSelectInvestigation,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  const filtered = investigations.filter((inv) => {
    const matchesSearch =
      inv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || inv.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Investigation Audit History</span>
          </h2>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Archived incident response dossiers with cryptographic verification
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, sender email, or Investigation ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedRisk === risk
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/50 font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Investigations Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px] bg-slate-50 dark:bg-slate-950/70">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Message Subject & Sender</th>
                <th className="p-4 font-semibold">Score</th>
                <th className="p-4 font-semibold">Threat Classification</th>
                <th className="p-4 font-semibold">Date / Time</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 font-bold text-cyan-700 dark:text-cyan-400 whitespace-nowrap">{inv.id}</td>
                  <td className="p-4 max-w-sm sm:max-w-md">
                    <p className="text-slate-900 dark:text-white font-medium truncate font-sans text-xs group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                      {inv.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{inv.sender}</p>
                  </td>
                  <td className="p-4 font-bold whitespace-nowrap">
                    <span
                      className={
                        inv.threatScore >= 80
                          ? 'text-red-600 dark:text-red-400'
                          : inv.threatScore >= 60
                          ? 'text-amber-600 dark:text-amber-400'
                          : inv.threatScore >= 30
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }
                    >
                      {inv.threatScore} / 100
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge level={inv.riskLevel} size="sm" />
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(inv.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectInvestigation(inv.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors font-mono"
                    >
                      <span>Open Dossier</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
            No matching investigations found.
          </div>
        )}
      </div>
    </div>
  );
};
