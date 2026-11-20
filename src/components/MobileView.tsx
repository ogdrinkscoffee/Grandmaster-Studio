import React, { useState, useCallback, useEffect } from 'react';
import {
  Swords,
  Compass,
  Trophy,
  Brain,
  BarChart3,
  Settings,
  BatteryCharging,
  WifiOff,
  Sun,
  Moon,
  GraduationCap,
  Keyboard,
  LogOut
} from 'lucide-react';
import { AppTab, AppViewProps } from './AppViewProps';
import { PlayView } from './PlayView';
import { VariantsView } from './VariantsView';
import { PuzzlesView } from './PuzzlesView';
import { GameReviewView } from './GameReviewView';
import { CoachView } from './CoachView';
import { TrainView } from './TrainView';
import { GlobalSearch } from './GlobalSearch';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { AchievementToast } from './Achievements';
import { DashboardView } from './DashboardView';
import { SettingsModal } from './SettingsModal';
import { PWAInstallButton } from './PWAInstallButton';
import { ChessPieceIcon } from './ChessPieces';

const MOBILE_NAV_ITEMS: { id: AppTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'play', label: 'Play', shortLabel: 'Play', icon: <Swords className="w-4 h-4" /> },
  { id: 'variants', label: 'Variants & Studio', shortLabel: 'Variants', icon: <Compass className="w-4 h-4" /> },
  { id: 'puzzles', label: 'Puzzles', shortLabel: 'Puzzles', icon: <Trophy className="w-4 h-4" /> },
  { id: 'train', label: 'Training', shortLabel: 'Train', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'coach', label: 'AI Coach', shortLabel: 'Coach', icon: <Brain className="w-4 h-4" /> },
  { id: 'dashboard', label: 'Archive', shortLabel: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
];

export const MobileView: React.FC<AppViewProps> = ({
  activeTab,
  onSelectTab,
  onSelectNavTab,
  activeVariant,
  activeCustomVariant,
  variantsSubTab,
  studioSeedConfig,
  onSelectVariantToPlay,
  onPlayCustomInArena,
  onEditVariantRules,
  trainSectionRequest,
  onOpenVisionTrainer,
  selectedReviewGame,
  recommendedPuzzleTheme,
  onStartRecommendedPuzzles,
  dailyPuzzleRequestKey,
  onOpenDailyPuzzle,
  botChallengeRequest,
  onChallengeAdaptiveBot,
  profile,
  matches,
  currentAppTheme,
  isLightMode,
  displayHeaderRapidElo,
  isOnline,
  isMobile,
  achievementStatuses,
  activeToast,
  onDismissToast,
  isSettingsOpen,
  settingsInitialTab,
  onOpenSettings,
  onCloseSettings,
  isShortcutsOpen,
  onOpenShortcuts,
  onCloseShortcuts,
  onSaveGame,
  onRunGameReview,
  onImportGame,
  onUpdatePuzzleElo,
  onUpdateSettings,
  onToggleColorMode,
  onToggleShortcutSetting,
  onUpdateProfile,
  onRestoreDataPayload,
  onResetLocalData,
  onGlobalHelpAction,
}) => {
  const [gameActive, setGameActive] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingTab, setPendingTab] = useState<AppTab | null>(null);

  const handleGameStart = useCallback(() => {
    setGameActive(true);
    // Request fullscreen
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const handleGameEnd = useCallback(() => {
    setGameActive(false);
    // Exit fullscreen
    document.exitFullscreen?.().catch(() => {});
  }, []);

  const handleLeaveGame = useCallback(() => {
    setShowLeaveConfirm(true);
  }, []);

  // beforeunload handler for page refresh/close
  useEffect(() => {
    if (!gameActive) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameActive]);

  // Intercept tab changes when game is active
  const handleAttemptNav = (tab: AppTab, navHandler: (tab: AppTab) => void) => {
    if (gameActive && tab !== 'play') {
      setPendingTab(tab);
      setShowLeaveConfirm(true);
      return;
    }
    navHandler(tab);
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    if (pendingTab) {
      const tab = pendingTab;
      setPendingTab(null);
      onSelectTab(tab);
    }
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
    setPendingTab(null);
  };

  // When game is active, render full-screen distraction-free mode
  if (gameActive) {
    return (
      <div
        className="fixed inset-0 h-[100dvh] overflow-hidden overscroll-none"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--gm-text)'
        }}
      >
        <PlayView
          initialVariant={activeVariant}
          customVariantConfig={activeCustomVariant}
          settings={profile.settings}
          playerRapidElo={profile.ratings.rapid}
          recentGames={matches}
          botChallengeRequest={botChallengeRequest}
          onSaveGame={onSaveGame}
          onRunGameReview={onRunGameReview}
          onUpdateSettings={onUpdateSettings}
          onEditVariantRules={onEditVariantRules}
          isMobile={isMobile}
          onGameStart={handleGameStart}
          onGameEnd={handleGameEnd}
          onLeaveGame={handleLeaveGame}
          distractionFree={true}
        />

        {/* Leave Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className="border rounded-2xl max-w-md w-full p-6 shadow-2xl text-center flex flex-col items-center gap-4 animate-modal-reveal"
              style={{
                backgroundColor: currentAppTheme.cardHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
            >
              <div
                className="w-14 h-14 rounded-xl border flex items-center justify-center"
                style={{
                  backgroundColor: `${currentAppTheme.accentHex}18`,
                  borderColor: `${currentAppTheme.accentHex}40`,
                  color: currentAppTheme.accentHex
                }}
              >
                <LogOut className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold" style={{ color: currentAppTheme.textPrimary }}>
                  Leave Game?
                </h3>
                <p className="text-xs mt-1" style={{ color: currentAppTheme.textSecondary }}>
                  Your current game will be lost if you leave now.
                </p>
              </div>
              <div className="w-full flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={confirmLeave}
                  className="w-full py-2.5 rounded-xl font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 hover:opacity-90"
                  style={{
                    backgroundColor: currentAppTheme.accentHex,
                    color: currentAppTheme.accentTextHex
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave Game</span>
                </button>
                <button
                  type="button"
                  onClick={cancelLeave}
                  className="w-full py-2.5 rounded-xl border font-semibold text-xs transition hover:opacity-80"
                  style={{
                    backgroundColor: currentAppTheme.cardSecondaryHex,
                    borderColor: currentAppTheme.cardBorderHex,
                    color: currentAppTheme.textPrimary
                  }}
                >
                  Continue Playing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Normal lobby/nav UI when no game is active
  return (
    <div
      className="relative isolate min-h-screen flex flex-col"
      style={{
        color: 'var(--gm-text)'
      }}
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundColor: 'var(--bg-color)',
          backgroundImage: 'var(--bg-gradient)',
          transform: 'translateZ(0)'
        }}
      />
      {/* Mobile Top Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ backgroundColor: 'var(--gm-header)', borderColor: 'var(--gm-border)' }}
      >
        <div
          className="absolute inset-x-0 bottom-[-1px] h-px pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, var(--gm-accent), var(--gm-accent-2), transparent)',
            opacity: 0.7
          }}
        />
        <div className="max-w-7xl mx-auto h-14 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Emblem */}
          <button
            type="button"
            onClick={() => onSelectTab('play')}
            className="flex items-center gap-2.5 cursor-pointer group select-none text-left focus:outline-none shrink-0"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center p-1 transition-transform group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentAppTheme.accentHex}33, ${currentAppTheme.accent2Hex}26)`,
                backgroundColor: currentAppTheme.cardSecondaryHex,
                border: `1px solid ${currentAppTheme.accentHex}55`,
                boxShadow: `0 0 18px -4px ${currentAppTheme.accentHex}66`
              }}
            >
              <ChessPieceIcon type="n" color="w" set={profile.settings.pieceSet} />
            </div>
            <span className="font-display font-extrabold text-sm sm:text-base tracking-tight whitespace-nowrap" style={{ color: currentAppTheme.textPrimary }}>
              Grandmaster Studio
            </span>
          </button>

          {/* Search, Telemetry & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <PWAInstallButton variant="compact" />

            {profile.settings.batterySaver && (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: currentAppTheme.accentHex }}
                title="Battery Saver Mode Active"
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>Eco</span>
              </span>
            )}

            {/* Offline indicator only shown when offline */}
            {!isOnline && (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-500"
                title="Offline · Local Encrypted Vault"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </span>
            )}

            <GlobalSearch
              iconOnly
              matches={matches}
              onSelectGame={onRunGameReview}
              onSelectVariant={onSelectVariantToPlay}
              onSelectCustomVariant={onPlayCustomInArena}
              onExecuteHelpAction={onGlobalHelpAction}
            />

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={isLightMode}
              aria-label="Light mode"
              title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              onClick={onToggleColorMode}
              className="relative h-8 w-[58px] rounded-full border shrink-0"
              style={{
                backgroundColor: 'var(--gm-card-2)',
                borderColor: 'var(--gm-border)'
              }}
            >
              <Moon
                className="absolute left-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: 'var(--gm-muted)' }}
              />
              <Sun
                className="absolute right-[9px] top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: 'var(--gm-muted)' }}
              />
              <span
                className="absolute top-[3px] left-[3px] w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-transform duration-150"
                style={{
                  transform: isLightMode ? 'translateX(26px)' : 'translateX(0px)',
                  backgroundImage: 'linear-gradient(135deg, var(--gm-accent), var(--gm-accent-2))',
                  color: 'var(--gm-accent-text)'
                }}
              >
                {isLightMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </span>
            </button>

            {/* Rapid Rating Metric */}
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className="hidden sm:inline-flex text-xs font-mono font-bold tabular-nums hover:opacity-80 transition whitespace-nowrap"
              style={{ color: currentAppTheme.accentHex }}
              title="View Rating Archive & Dashboard"
            >
              {displayHeaderRapidElo} Elo
            </button>

            {/* Keyboard Shortcuts Trigger */}
            <button
              type="button"
              onClick={onOpenShortcuts}
              aria-label="Keyboard shortcuts"
              className="hidden sm:inline-flex p-2 rounded-lg border transition hover:opacity-80"
              style={{
                backgroundColor: currentAppTheme.cardSecondaryHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => onOpenSettings(undefined)}
              aria-label="Open settings"
              className="p-2 rounded-lg border transition hover:opacity-80"
              style={{
                backgroundColor: currentAppTheme.cardSecondaryHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
              title="Customization & Settings (,)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 pb-20">
        {activeTab === 'play' && (
          <PlayView
            initialVariant={activeVariant}
            customVariantConfig={activeCustomVariant}
            settings={profile.settings}
            playerRapidElo={profile.ratings.rapid}
            recentGames={matches}
            botChallengeRequest={botChallengeRequest}
            onSaveGame={onSaveGame}
            onRunGameReview={onRunGameReview}
            onUpdateSettings={onUpdateSettings}
            onEditVariantRules={onEditVariantRules}
            isMobile={isMobile}
            onGameStart={handleGameStart}
            onGameEnd={handleGameEnd}
            onLeaveGame={handleLeaveGame}
          />
        )}

        {activeTab === 'variants' && (
          <VariantsView
            initialSubTab={variantsSubTab}
            initialCustomConfig={studioSeedConfig}
            onSelectVariant={onSelectVariantToPlay}
            onPlayCustomInArena={onPlayCustomInArena}
          />
        )}

        {activeTab === 'puzzles' && (
          <PuzzlesView
            userPuzzleElo={profile.ratings.puzzles}
            initialTheme={recommendedPuzzleTheme}
            initialDailyRequestKey={dailyPuzzleRequestKey}
            onRatingChange={onUpdatePuzzleElo}
          />
        )}

        {activeTab === 'train' && (
          <TrainView
            initialSection={trainSectionRequest?.section}
            sectionRequestKey={trainSectionRequest?.key}
          />
        )}

        {activeTab === 'review' && selectedReviewGame && (
          <GameReviewView
            game={selectedReviewGame}
            playerElo={profile.ratings.rapid}
            onBack={() => onSelectTab('dashboard')}
          />
        )}

        {activeTab === 'coach' && (
          <CoachView
            profile={profile}
            recentGames={matches}
            onStartRecommendedPuzzles={onStartRecommendedPuzzles}
            onChallengeAdaptiveBot={onChallengeAdaptiveBot}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            matches={matches}
            onReviewGame={onRunGameReview}
            onPlayNewGame={() => onSelectTab('play')}
            onImportGame={onImportGame}
            onOpenPuzzles={() => onSelectTab('puzzles')}
            onOpenDailyPuzzle={onOpenDailyPuzzle}
            onOpenVisionTrainer={onOpenVisionTrainer}
            achievements={achievementStatuses}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 h-14 backdrop-blur-lg border-t px-2 flex items-center justify-around"
        style={{
          backgroundColor: 'var(--gm-header)',
          borderColor: 'var(--gm-border)'
        }}
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAttemptNav(item.id, onSelectNavTab)}
              className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition"
              style={{
                color: isActive ? currentAppTheme.accentHex : currentAppTheme.textSecondary
              }}
            >
              {item.icon}
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      <AchievementToast
        achievement={activeToast}
        onDismiss={onDismissToast}
        onOpen={() => {
          onDismissToast();
          onSelectTab('dashboard');
        }}
      />

      {/* Settings & Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        initialTab={settingsInitialTab}
        onClose={onCloseSettings}
        settings={profile.settings}
        onSaveSettings={onUpdateSettings}
        fullDataPayload={{ profile, matches }}
        onRestoreDataPayload={onRestoreDataPayload}
        profile={{ username: profile.username, title: profile.title }}
        onUpdateProfile={onUpdateProfile}
        onResetLocalData={onResetLocalData}
        isMobile={isMobile}
      />

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={onCloseShortcuts}
        keyboardControl={Boolean(profile.settings.keyboardControl)}
        notationInput={Boolean(profile.settings.notationInput)}
        onToggleSetting={onToggleShortcutSetting}
      />
    </div>
  );
};