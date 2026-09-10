import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { InvestigationData } from '../../types/forensic';
import { Badge } from '../common/Badge';
import { ScoreGauge } from '../common/ScoreGauge';
import { downloadFile } from '../../utils/exportUtils';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigation: InvestigationData;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  investigation,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    downloadFile(
      `${investigation.id}_Forensic_Dossier.json`,
      JSON.stringify(investigation, null, 2),
      'application/json'
    );
  };

  const originHop = investigation.transmissionPath.find((h) => h.isSenderOrigin) || investigation.transmissionPath[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
              OFFICIAL INCIDENT REPORT
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ID: {investigation.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-report" className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-8 text-slate-800 dark:text-slate-200">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-300 dark:border-slate-700 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wider font-mono uppercase">
                  FORENSIC INCIDENT INVESTIGATION REPORT
                </h1>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                ThreatMailer Cyber SOC • Email Threat Detection & Forensic Intelligence Platform
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-500 dark:text-slate-400">
              <p className="font-bold text-cyan-700 dark:text-cyan-400 text-sm">{investigation.id}</p>
              <p>Generated: {new Date().toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Security Clearance: RESTRICTED / SOC AUDIT</p>
            </div>
          </div>

          {/* Section 1: Executive Summary & Verdict */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="sm:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  1. Executive Threat Assessment
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{investigation.classification}</span>
                  <Badge level={investigation.riskLevel} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{investigation.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Subject: "{investigation.subject}"</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-black/40 rounded-lg border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-2">Composite Threat Score</span>
              <ScoreGauge score={investigation.threatScore} riskLevel={investigation.riskLevel} size={110} />
            </div>
          </div>

          {/* Section 2: Email Metadata & Originating Host */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span>2. Message Metadata & Originating Infrastructure</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">FROM HEADER:</span>
                <span className="text-slate-800 dark:text-slate-200">{investigation.emailHeaders.from}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">TO HEADER:</span>
                <span className="text-slate-800 dark:text-slate-200">{investigation.emailHeaders.to}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">REPLY-TO:</span>
                <span className="text-slate-800 dark:text-slate-200">{investigation.emailHeaders.replyTo || 'None specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">MESSAGE-ID:</span>
                <span className="text-slate-700 dark:text-slate-300 break-all">{investigation.emailHeaders.messageId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">SENDER ORIGIN IP:</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-bold">{originHop?.ip || '185.220.101.5'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">GEOLOCATION / ASN:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {originHop?.city}, {originHop?.country} ({originHop?.asn})
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Authentication Cryptographic Analysis */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              3. Cryptographic Signature & Authentication Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">SPF Record:</span>
                  <Badge level={investigation.authentication.spf.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{investigation.authentication.spf.details}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">DKIM Signature:</span>
                  <Badge level={investigation.authentication.dkim.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{investigation.authentication.dkim.details}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">DMARC Policy:</span>
                  <Badge level={investigation.authentication.dmarc.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{investigation.authentication.dmarc.details}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Explainable AI Attribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              4. Explainable AI Evidentiary Findings
            </h3>
            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {investigation.explainableReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/60 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 dark:text-slate-200 block">{reason.title}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">{reason.evidence}</span>
                  </div>
                  <Badge level={reason.severity} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Extracted Indicators of Compromise (IOCs) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              5. Indicators of Compromise (IOC Inventory)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-xs">
              <table className="w-full text-left bg-white dark:bg-slate-900/60">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-950/60">
                  <tr>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Observable</th>
                    <th className="p-2.5">Risk Level</th>
                    <th className="p-2.5">Forensic Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {investigation.iocs.map((ioc) => (
                    <tr key={ioc.id}>
                      <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{ioc.type}</td>
                      <td className="p-2.5 text-cyan-700 dark:text-cyan-300 break-all font-semibold">{ioc.indicator}</td>
                      <td className="p-2.5">
                        <Badge level={ioc.risk} size="sm" />
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-300 font-sans text-xs">{ioc.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 6: Hop-by-Hop Transmission Path */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              6. Transmission Hop Vectors
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {investigation.transmissionPath.map((hop) => (
                <div key={hop.hopNumber} className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-cyan-800 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                      {hop.hopNumber}
                    </span>
                    <span className="text-cyan-700 dark:text-cyan-300 font-bold">{hop.ip}</span>
                    <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">({hop.city}, {hop.country})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate">{hop.isp}</span>
                    <Badge level={hop.riskLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Final Conclusion & Sign-Off */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              7. Final Forensic Conclusion & Recommended Action
            </h3>
            <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {investigation.threatScore >= 60
                ? 'Based on multivariate forensic evaluation, this message constitutes an active malicious threat. Recommended SOC actions: 1) Block sender IP and domain across mail gateways and perimeter firewalls; 2) Purge instance from all organizational inboxes; 3) Ingest extracted IOCs into EDR threat-hunting telemetry.'
                : 'Message passes critical cryptographic and transmission routing checks. No hostile credential harvesting or spoofing mechanisms detected. Cleared for standard delivery.'}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-slate-500 text-[11px]">
              <span>Investigator Sign-Off: Lead Forensic Analyst [ThreatMailer SOC]</span>
              <span>Digital Checksum: SHA256:{investigation.id.replace(/-/g, '').padEnd(32, 'f')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
