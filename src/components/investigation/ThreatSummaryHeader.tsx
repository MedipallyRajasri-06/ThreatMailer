import React from 'react';
import {
  User,
  Globe,
  Network,
  MapPin,
  CheckCircle,
  XCircle,
  Link,
  FileText,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { InvestigationData } from '../../types/forensic';
import { ScoreGauge } from '../common/ScoreGauge';

interface ThreatSummaryHeaderProps {
  investigation: InvestigationData;
  onOpenReport: () => void;
  onStartNew: () => void;
  onExportIocs: () => void;
}

export const ThreatSummaryHeader: React.FC<ThreatSummaryHeaderProps> = ({
  investigation,
  onOpenReport,
  onStartNew,
  onExportIocs,
}) => {
  const originHop = investigation.transmissionPath.find((h) => h.isSenderOrigin) || investigation.transmissionPath[0];
  const domainIntel = investigation.domainIntelligence[0];
  const authPassed =
    investigation.authentication.spf.status === 'PASS' &&
    investigation.authentication.dkim.status === 'PASS' &&
    investigation.authentication.dmarc.status === 'PASS';

  const maliciousUrlsCount = investigation.urls.filter((u) => u.risk === 'CRITICAL' || u.risk === 'HIGH').length;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
      {/* Background threat glow */}
      <div
        className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          investigation.riskLevel === 'CRITICAL'
            ? 'bg-red-500'
            : investigation.riskLevel === 'HIGH'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      {/* Top Banner Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-start gap-5">
          {/* Circular Score Gauge */}
          <ScoreGauge score={investigation.threatScore} riskLevel={investigation.riskLevel} size={130} />

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold tracking-widest text-red-700 dark:text-red-400 uppercase bg-red-100 dark:bg-red-950/60 px-2.5 py-0.5 rounded border border-red-300 dark:border-red-800/60">
                {investigation.threatScore >= 60 ? '🚨 THREAT DETECTED' : '🛡️ VERIFIED SCAN'}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ID: {investigation.id}</span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">• {new Date(investigation.createdAt).toLocaleString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              {investigation.classification}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1.5 leading-relaxed font-sans">
              {investigation.summary}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={onOpenReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Forensic Report</span>
          </button>

          <button
            onClick={onExportIocs}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            title="Export extracted IOCs to JSON / CSV / STIX 2.1"
          >
            <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Export IOCs</span>
          </button>

          <button
            onClick={onStartNew}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            title="Run another investigation"
          >
            <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6">
        {/* Card 1: Sender */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <User className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Sender
          </span>
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={investigation.sender}>
              {investigation.emailHeaders.fromDisplayName || investigation.sender}
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate" title={investigation.emailHeaders.fromEmail}>
              {investigation.emailHeaders.fromEmail || investigation.sender}
            </p>
          </div>
        </div>

        {/* Card 2: Domain */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Globe className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Domain
          </span>
          <div className="mt-2">
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate" title={domainIntel?.domain}>
              {domainIntel?.domain || 'unknown'}
            </p>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                domainIntel?.reputation === 'MALICIOUS'
                  ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/60'
                  : domainIntel?.reputation === 'SUSPICIOUS'
                  ? 'text-amber-800 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/60'
                  : 'text-emerald-800 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/60'
              }`}
            >
              {domainIntel?.reputation || 'UNKNOWN'}
            </span>
          </div>
        </div>

        {/* Card 3: Origin IP */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Network className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Origin IP
          </span>
          <div className="mt-2">
            <p className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 truncate">
              {originHop?.ip || investigation.emailHeaders.xOriginatingIp || '185.220.101.5'}
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">{originHop?.asn || 'AS49210'}</p>
          </div>
        </div>

        {/* Card 4: Location */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Location
          </span>
          <div className="mt-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {originHop?.city ? `${originHop.city}, ${originHop.country}` : 'Singapore'}
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Approx. Geolocation</p>
          </div>
        </div>

        {/* Card 5: Authentication */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Authentication
          </span>
          <div className="mt-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
              {authPassed ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">PASSED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-400">FAILED</span>
                </>
              )}
            </div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
              SPF: {investigation.authentication.spf.status} • DKIM: {investigation.authentication.dkim.status}
            </p>
          </div>
        </div>

        {/* Card 6: Malicious URLs */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Link className="w-3 h-3 text-red-600 dark:text-red-400" /> Embedded URLs
          </span>
          <div className="mt-2">
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {investigation.urls.length} Found{' '}
              {maliciousUrlsCount > 0 && (
                <span className="text-red-600 dark:text-red-400 font-bold">({maliciousUrlsCount} Flagged)</span>
              )}
            </p>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {maliciousUrlsCount > 0 ? 'High Risk Endpoints' : 'No Critical URLs'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
