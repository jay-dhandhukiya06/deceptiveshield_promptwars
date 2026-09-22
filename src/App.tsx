/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SandboxView } from './components/SandboxView';
import { WallOfShameView } from './components/WallOfShameView';
import { ManualSubmissionView } from './components/ManualSubmissionView';
import { ExtensionDistributionHub } from './components/ExtensionDistributionHub';
import { LegalRegulatoryEngineView } from './components/LegalRegulatoryEngineView';
import { TabMode, CommunityReport } from './types';
import { INITIAL_COMMUNITY_REPORTS } from './data/mockReports';

const LOCAL_STORAGE_KEY = 'deceptiveshield_community_reports';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabMode>('sandbox');
  const [detectedCount, setDetectedCount] = useState<number>(3);

  // Community reports state with local storage fallback
  const [reports, setReports] = useState<CommunityReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read saved reports from localStorage', e);
    }
    return INITIAL_COMMUNITY_REPORTS;
  });

  // Save reports to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not persist reports to localStorage', e);
    }
  }, [reports]);

  // Handle Reddit-style Upvote and Downvote
  const handleVote = (reportId: string, direction: 1 | -1) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        if (rep.userVote === direction) {
          // toggle off existing vote
          return {
            ...rep,
            votes: rep.votes - direction,
            userVote: 0
          };
        }
        // apply or flip vote
        const voteDiff = direction - rep.userVote;
        return {
          ...rep,
          votes: rep.votes + voteDiff,
          userVote: direction
        };
      })
    );
  };

  // Add new report from Sandbox or Manual Form
  const handlePublishReport = (newReport: CommunityReport) => {
    setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
  };

  // Delete an individual report dynamically
  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  // Global reset / clear all crowdsourced records
  const handleClearAllReports = () => {
    setReports([]);
  };

  // Restore default sample seed records
  const handleResetToDefaultReports = () => {
    setReports(INITIAL_COMMUNITY_REPORTS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        detectedCount={detectedCount}
        communityReportCount={reports.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 pb-12">
        {currentTab === 'sandbox' && (
          <SandboxView
            onStatsChange={setDetectedCount}
            onPublishReport={handlePublishReport}
            onNavigateToWall={() => setCurrentTab('wall')}
            onNavigateToLegal={() => setCurrentTab('legal')}
          />
        )}

        {currentTab === 'wall' && (
          <WallOfShameView
            reports={reports}
            onVote={handleVote}
            onDeleteReport={handleDeleteReport}
            onClearAll={handleClearAllReports}
            onResetDefaults={handleResetToDefaultReports}
            onOpenSubmit={() => setCurrentTab('submit')}
          />
        )}

        {currentTab === 'submit' && (
          <ManualSubmissionView
            onSubmitReport={(report) => {
              handlePublishReport(report);
              setCurrentTab('wall');
            }}
          />
        )}

        {currentTab === 'legal' && (
          <LegalRegulatoryEngineView
            reports={reports}
            onSelectSandbox={() => setCurrentTab('sandbox')}
          />
        )}

        {(currentTab === 'extension' || currentTab === 'popup' || currentTab === 'code' || currentTab === 'install') && (
          <ExtensionDistributionHub
            detectedCount={detectedCount}
            onNavigateToSandbox={() => setCurrentTab('sandbox')}
            defaultSubTab={currentTab === 'popup' ? 'popup' : currentTab === 'code' ? 'code' : 'install'}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DeceptiveShield • Chrome Extension (Manifest V3) & Community Dark Pattern Index</span>
          <span className="font-mono text-[11px] text-slate-600">Client-Side Heuristics • Real-time Consumer Protection</span>
        </div>
      </footer>
    </div>
  );
}


