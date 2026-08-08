import React, { useState, useEffect } from 'react';
import { AppMode, UserSettings, SessionMetrics, TypingSession } from './types';
import { StorageAdapter } from './lib/storage/storageAdapter';
import { Header } from './components/layout/Header';
import { TutorialModule } from './modules/tutorial/TutorialModule';
import { PracticeModule } from './modules/practice/PracticeModule';
import { ExamModule } from './modules/exam/ExamModule';
import { AnalyticsModule } from './modules/analytics/AnalyticsModule';
import { ResultModal } from './components/results/ResultModal';
import { CertificateModal } from './components/results/CertificateModal';
import { SettingsModal } from './components/settings/SettingsModal';

export function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('practice');
  const [settings, setSettings] = useState<UserSettings>(() => StorageAdapter.getSettings());
  const [bestWpm, setBestWpm] = useState<number>(0);

  const [activeSessionMetrics, setActiveSessionMetrics] = useState<SessionMetrics | null>(null);
  const [activeContentTitle, setActiveContentTitle] = useState<string>('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    updatePersonalBest();
  }, []);

  const updatePersonalBest = () => {
    const history = StorageAdapter.getHistory();
    const highest = history.reduce((max, s) => Math.max(max, s.metrics.netWpm || 0), 0);
    setBestWpm(highest);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      StorageAdapter.saveSettings(updated);
      return updated;
    });
  };

  const handleSessionComplete = (metrics: SessionMetrics, contentTitle = 'Typing Session') => {
    setActiveSessionMetrics(metrics);
    setActiveContentTitle(contentTitle);
    setShowResultModal(true);

    // Save session to LocalStorage
    const sessionRecord: TypingSession = {
      sessionId: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: 'local-anonymous',
      moduleType: activeMode,
      language: settings.language,
      layoutUsed: settings.language === 'bn' ? settings.banglaLayout : 'qwerty',
      contentTitle,
      contentRefId: 'session-ref',
      startedAt: new Date().toISOString(),
      durationSec: metrics.durationSec,
      settingsSnapshot: settings,
      metrics,
    };

    StorageAdapter.saveSession(sessionRecord);
    updatePersonalBest();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-bangla antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Header
        activeMode={activeMode}
        onModeChange={setActiveMode}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setShowSettingsModal(true)}
        bestWpm={bestWpm}
      />

      {/* Main Module Content Container */}
      <main className="flex-1 w-full pb-12">
        {activeMode === 'tutorial' && (
          <TutorialModule
            settings={settings}
            onSessionComplete={(m) => handleSessionComplete(m, 'Tutorial Drill')}
          />
        )}

        {activeMode === 'practice' && (
          <PracticeModule
            settings={settings}
            onSessionComplete={(m) => handleSessionComplete(m, 'Practice Drill')}
          />
        )}

        {activeMode === 'exam' && (
          <ExamModule
            settings={settings}
            onSessionComplete={(m) => handleSessionComplete(m, 'Recruitment Exam')}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeMode === 'analytics' && (
          <AnalyticsModule settings={settings} />
        )}
      </main>

      {/* Result Modal */}
      {showResultModal && activeSessionMetrics && (
        <ResultModal
          metrics={activeSessionMetrics}
          contentTitle={activeContentTitle}
          settings={settings}
          onRetry={() => setShowResultModal(false)}
          onPracticeWeakness={() => {
            setShowResultModal(false);
            setActiveMode('practice');
          }}
          onOpenCertificate={() => {
            setShowResultModal(false);
            setShowCertificateModal(true);
          }}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && activeSessionMetrics && (
        <CertificateModal
          metrics={activeSessionMetrics}
          contentTitle={activeContentTitle}
          settings={settings}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
