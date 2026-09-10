import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { MetricCards } from './components/dashboard/MetricCards';
import { ThreatCharts } from './components/dashboard/ThreatCharts';
import { RecentInvestigations } from './components/dashboard/RecentInvestigations';
import { EmailUploadModal } from './components/investigation/EmailUploadModal';
import { ScanningProgressModal } from './components/investigation/ScanningProgressModal';
import { ThreatSummaryHeader } from './components/investigation/ThreatSummaryHeader';
import { ExplainableAIPanel } from './components/investigation/ExplainableAIPanel';
import { AuthenticationCard } from './components/investigation/AuthenticationCard';
import { HeaderForensicsView } from './components/investigation/HeaderForensicsView';
import { TransmissionPathHop } from './components/investigation/TransmissionPathHop';
import { UrlAnalysisTable } from './components/investigation/UrlAnalysisTable';
import { DomainIntelligenceCard } from './components/investigation/DomainIntelligenceCard';
import { GeoLocationMap } from './components/investigation/GeoLocationMap';
import { ThreatGraph } from './components/investigation/ThreatGraph';
import { IocExtractionTable } from './components/investigation/IocExtractionTable';
import { InvestigationTimeline } from './components/investigation/InvestigationTimeline';
import { ForensicReportModal } from './components/report/ForensicReportModal';
import { InvestigationHistoryView } from './components/history/InvestigationHistoryView';
import { ReportsListView } from './components/report/ReportsListView';

import { InvestigationData, DashboardMetrics } from './types/forensic';
import { DEMO_INVESTIGATION } from './data/demoInvestigation';
import { INITIAL_DASHBOARD_METRICS } from './data/historicalData';
import { getSavedInvestigations, saveInvestigation, getInvestigationById } from './services/storageService';
import { analyzeEmailThreat } from './services/threatAnalysisService';
import { exportIocsAsStix } from './utils/exportUtils';

export function App() {
  // Theme State: Default to Light mode per user request ("change background into light")
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('threatmailer_theme') || localStorage.getItem('sih_theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    } catch {
      return 'light';
    }
  });

  // Synchronize theme on document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('threatmailer_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'investigation' | 'history' | 'reports'>('landing');

  // Stored Investigations & Metrics State
  const [investigations, setInvestigations] = useState<InvestigationData[]>([]);
  const [activeInvestigation, setActiveInvestigation] = useState<InvestigationData>(DEMO_INVESTIGATION);
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_DASHBOARD_METRICS);

  // Modals State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isScanningOpen, setIsScanningOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [pendingInvestigation, setPendingInvestigation] = useState<InvestigationData | null>(null);

  // Initialize stored investigations on mount
  useEffect(() => {
    const saved = getSavedInvestigations();
    setInvestigations(saved);
    if (saved.length > 0) {
      setActiveInvestigation(saved[0]);
    }
  }, []);

  // Quick Action: Launch Demo (Judge Mode)
  const handleLaunchDemo = () => {
    setActiveInvestigation(DEMO_INVESTIGATION);
    setCurrentTab('investigation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select an investigation from History / Dashboard
  const handleSelectInvestigation = (id: string) => {
    const found = getInvestigationById(id);
    if (found) {
      setActiveInvestigation(found);
      setCurrentTab('investigation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit email / URL for scanning
  const handleSubmitEmail = async (rawContent: string, fileName?: string) => {
    setIsUploadOpen(false);

    // Run threat analysis engine
    const result = await analyzeEmailThreat(rawContent, fileName);
    setPendingInvestigation(result);

    // Open animated scanning radar modal
    setIsScanningOpen(true);
  };

  // Triggered when the 7-step scanning sequence finishes
  const handleScanCompleted = () => {
    setIsScanningOpen(false);
    if (pendingInvestigation) {
      saveInvestigation(pendingInvestigation);
      const updated = getSavedInvestigations();
      setInvestigations(updated);
      setActiveInvestigation(pendingInvestigation);
      setPendingInvestigation(null);

      // Update dashboard counter
      setMetrics((prev) => ({
        ...prev,
        totalAnalyzed: prev.totalAnalyzed + 1,
        phishingDetected: pendingInvestigation.threatScore >= 70 ? prev.phishingDetected + 1 : prev.phishingDetected,
        highRiskCount: pendingInvestigation.threatScore >= 60 ? prev.highRiskCount + 1 : prev.highRiskCount,
      }));

      // Switch to investigation results view
      setCurrentTab('investigation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#070b14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Top SOC Navbar with Theme Switcher */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLaunchDemo={handleLaunchDemo}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentTab === 'landing' && (
          <div>
            <HeroSection
              onStartInvestigation={() => setIsUploadOpen(true)}
              onTryDemo={handleLaunchDemo}
            />
            <FeatureGrid onSelectFeature={() => setCurrentTab('dashboard')} />
          </div>
        )}

        {/* VIEW 2: SOC DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Cyber SOC Telemetry Dashboard
                </h1>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  Active monitoring, threat distribution analytics, and forensic audit queue
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLaunchDemo}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-sm"
                >
                  Inspect Demo (INV-2026-0001)
                </button>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  + New Scan
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <MetricCards metrics={metrics} />

            {/* Recharts Threat Trend & Distribution */}
            <ThreatCharts />

            {/* Recent Investigations Feed */}
            <RecentInvestigations
              onSelectInvestigation={handleSelectInvestigation}
              onStartNew={() => setIsUploadOpen(true)}
              onLaunchDemo={handleLaunchDemo}
            />
          </div>
        )}

        {/* VIEW 3: DETAILED INVESTIGATION DOSSIER */}
        {currentTab === 'investigation' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Top Threat Summary Header */}
            <ThreatSummaryHeader
              investigation={activeInvestigation}
              onOpenReport={() => setIsReportOpen(true)}
              onStartNew={() => setIsUploadOpen(true)}
              onExportIocs={() => exportIocsAsStix(activeInvestigation.iocs, activeInvestigation)}
            />

            {/* Explainable AI Panel */}
            <ExplainableAIPanel
              reasons={activeInvestigation.explainableReasons}
              threatScore={activeInvestigation.threatScore}
            />

            {/* Authentication (SPF / DKIM / DMARC) */}
            <AuthenticationCard auth={activeInvestigation.authentication} />

            {/* Email Header Forensics & Raw Headers */}
            <HeaderForensicsView headers={activeInvestigation.emailHeaders} />

            {/* Transmission Path Hop Progression Cards */}
            <TransmissionPathHop hops={activeInvestigation.transmissionPath} />

            {/* Embedded URL & Link Analysis Table */}
            <UrlAnalysisTable urls={activeInvestigation.urls} />

            {/* Domain Intelligence & Homoglyph Analysis */}
            <DomainIntelligenceCard domains={activeInvestigation.domainIntelligence} />

            {/* Interactive Leaflet OpenStreetMap Geolocation */}
            <GeoLocationMap hops={activeInvestigation.transmissionPath} theme={theme} />

            {/* Threat Intelligence Interactive Graph */}
            <ThreatGraph investigation={activeInvestigation} />

            {/* Indicators of Compromise (IOC) Hub */}
            <IocExtractionTable
              iocs={activeInvestigation.iocs}
              investigation={activeInvestigation}
            />

            {/* Investigation Timeline */}
            <InvestigationTimeline timeline={activeInvestigation.timeline} />
          </div>
        )}

        {/* VIEW 4: INVESTIGATION HISTORY */}
        {currentTab === 'history' && (
          <InvestigationHistoryView
            investigations={investigations}
            onSelectInvestigation={handleSelectInvestigation}
            onStartNew={() => setIsUploadOpen(true)}
          />
        )}

        {/* VIEW 5: FORENSIC REPORTS LIST */}
        {currentTab === 'reports' && (
          <ReportsListView
            investigations={investigations}
            onOpenReport={(inv) => {
              setActiveInvestigation(inv);
              setIsReportOpen(true);
            }}
            onSelectInvestigation={handleSelectInvestigation}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer />

      {/* MODALS */}
      <EmailUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmitEmail={handleSubmitEmail}
      />

      <ScanningProgressModal
        isOpen={isScanningOpen}
        onComplete={handleScanCompleted}
      />

      <ForensicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        investigation={activeInvestigation}
      />
    </div>
  );
}

export default App;
