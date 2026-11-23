import React, { useState } from 'react';
import {
  Home,
  Swords,
  Compass,
  Trophy,
  Brain,
  BarChart3,
  Settings,
  BatteryCharging,
  WifiOff,
  Palette,
  Sun,
  Moon,
  GraduationCap,
  Keyboard,
  Smartphone,
  Menu,
  X,
  Globe,
  UserCheck
} from 'lucide-react';
import { AppThemeId } from '../types/chess';
import { APP_THEME_FAMILIES } from '../theme/themes';
import { AppTab, AppViewProps } from './AppViewProps';
import { HomeView } from './HomeView';
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
import { AndroidAppModal } from './AndroidAppModal';
import { LegalModal } from './LegalModal';
import { AuthModal } from './AuthModal';
import { CookieConsentBanner } from './CookieConsentBanner';
import { ChessPieceIcon } from './ChessPieces';

const PRIMARY_NAV_ITEMS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4 shrink-0" /> },
  { id: 'play', label: 'Play', icon: <Swords className="w-4 h-4 shrink-0" /> },
  { id: 'puzzles', label: 'Puzzles', icon: <Trophy className="w-4 h-4 shrink-0" /> },
  { id: 'train', label: 'Learn', icon: <GraduationCap className="w-4 h-4 shrink-0" /> },
  { id: 'variants', label: 'Variants', icon: <Compass className="w-4 h-4 shrink-0" /> },
  { id: 'coach', label: 'AI Coach', icon: <Brain className="w-4 h-4 shrink-0" /> },
  { id: 'dashboard', label: 'Archive', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
];

const TAB_TITLES: Record<AppTab, string> = {
  home: 'Grandmaster Studio',
  play: 'Play Arena',
  puzzles: 'Tactical Puzzles',
  train: 'Training & Drills',
  variants: 'Variants & Custom Studio',
  coach: 'AI Strategy Coach',
  dashboard: 'Archive & Ratings',
  review: 'Game Review'
};

export const DesktopView: React.FC<AppViewProps> = ({
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
  quickPlayRequest,
  onQuickPlay,
  initialPlayFenRequest,
  onPlayFromFen,
  trainSectionRequest,
  onOpenTrainSection,
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
  isApkModalOpen,
  onOpenApkModal,
  onCloseApkModal,
  isLegalModalOpen,
  legalInitialTab,
  onOpenLegalModal,
  onCloseLegalModal,
  firebaseUser,
  publicProfile,
  isAuthModalOpen,
  onOpenAuthModal,
  onCloseAuthModal,
  onPublicProfileUpdated,
  onAccountDeleted,
  pendingChallengeCode,
  onConsumeChallengeCode,
  onOnlineEloUpdated,
  cookieConsent,
  isCookieBannerOpen,
  onSelectCookieConsent,
  onReopenCookieBanner,
  onCloseCookieBanner,
  onSaveGame,
  onRunGameReview,
  onImportGame,
  onUpdatePuzzleElo,
  onUpdateSettings,
  onToggleColorMode,
  onSelectAppTheme,
  onToggleShortcutSetting,
  onUpdateProfile,
  onRestoreDataPayload,
  onResetLocalData,
  onGlobalHelpAction,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (tab: AppTab) => {
    onSelectNavTab(tab);
    setDrawerOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between p-3.5 gap-4">
      <div className="flex flex-col gap-5">
        {/* Brand Emblem */}
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none text-left focus:outline-none min-w-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 shrink-0"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentAppTheme.accentHex}33, ${currentAppTheme.accent2Hex}26)`,
                backgroundColor: currentAppTheme.cardSecondaryHex,
                border: `1px solid ${currentAppTheme.accentHex}55`,
                boxShadow: `0 0 18px -4px ${currentAppTheme.accentHex}55`
              }}
            >
              <ChessPieceIcon type="n" color="w" set={profile.settings.pieceSet} />
            </div>
            <div className="min-w-0">
              <div className="font-display font-extrabold text-sm tracking-tight truncate" style={{ color: currentAppTheme.textPrimary }}>
                Grandmaster
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: currentAppTheme.accentHex }}>
                Studio
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg border cursor-pointer"
            style={{
              backgroundColor: currentAppTheme.cardSecondaryHex,
              borderColor: currentAppTheme.cardBorderHex,
              color: currentAppTheme.textSecondary
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chess.com / Lichess Primary Vertical Navigation */}
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {PRIMARY_NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer text-left whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? `${currentAppTheme.accentHex}1c` : 'transparent',
                  color: isActive ? currentAppTheme.accentHex : currentAppTheme.textSecondary
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                    style={{ backgroundColor: currentAppTheme.accentHex }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Rail: Google Account, Android APK Button, Theme & Utility Controls */}
      <div className="flex flex-col gap-2.5 pt-3 border-t" style={{ borderColor: currentAppTheme.cardBorderHex }}>
        <button
          type="button"
          onClick={() => {
            setDrawerOpen(false);
            onOpenAuthModal();
          }}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border font-bold text-xs transition hover:opacity-90 cursor-pointer whitespace-nowrap"
          style={{
            backgroundColor: firebaseUser ? `${currentAppTheme.accentHex}16` : currentAppTheme.cardSecondaryHex,
            borderColor: firebaseUser ? `${currentAppTheme.accentHex}55` : currentAppTheme.cardBorderHex,
            color: currentAppTheme.textPrimary
          }}
        >
          <span className="flex items-center gap-2 min-w-0">
            {firebaseUser ? (
              <UserCheck className="w-4 h-4 shrink-0" style={{ color: currentAppTheme.accentHex }} />
            ) : (
              <Globe className="w-4 h-4 shrink-0" style={{ color: currentAppTheme.accentHex }} />
            )}
            <span className="truncate">
              {firebaseUser ? (publicProfile?.username || firebaseUser.displayName || 'Google Account') : 'Sign In (Google)'}
            </span>
          </span>
          {firebaseUser && publicProfile && (
            <span className="font-mono text-[10px] shrink-0" style={{ color: currentAppTheme.accentHex }}>
              {publicProfile.rapidElo}
            </span>
          )}
        </button>

        {/* Prominent Android APK / App Download Button */}
        <button
          type="button"
          onClick={() => {
            setDrawerOpen(false);
            onOpenApkModal();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition hover:opacity-90 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          style={{
            backgroundColor: currentAppTheme.accentHex,
            color: currentAppTheme.accentTextHex
          }}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Install Android APK</span>
        </button>

        {/* Compact Theme Selector */}
        <label
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs cursor-pointer"
          style={{
            backgroundColor: currentAppTheme.cardSecondaryHex,
            borderColor: currentAppTheme.cardBorderHex
          }}
        >
          <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: currentAppTheme.accentHex }} />
          <select
            value={currentAppTheme.id}
            aria-label="Select app theme"
            onChange={e => onSelectAppTheme(e.target.value as AppThemeId)}
            className="w-full bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            style={{ color: currentAppTheme.textPrimary }}
          >
            {APP_THEME_FAMILIES.map(t => (
              <option
                key={t.id}
                value={t.id}
                style={{ backgroundColor: currentAppTheme.cardHex, color: currentAppTheme.textPrimary }}
              >
                {t.name}
              </option>
            ))}
          </select>
        </label>

        {/* Footer Actions: Light/Dark, Shortcuts, Settings */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={isLightMode}
            aria-label="Light mode"
            title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={onToggleColorMode}
            className="relative h-8 w-[58px] rounded-full border shrink-0 cursor-pointer"
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onOpenShortcuts();
              }}
              aria-label="Keyboard shortcuts"
              className="inline-flex p-2 rounded-lg border transition hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: currentAppTheme.cardSecondaryHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onOpenSettings(undefined);
              }}
              aria-label="Open settings"
              className="inline-flex p-2 rounded-lg border transition hover:opacity-80 cursor-pointer"
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
      </div>
    </div>
  );

  return (
    <div
      className="relative isolate min-h-screen flex"
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

      {/* Desktop Left Navigation Sidebar (Chess.com / Lichess Architecture) */}
      <aside
        className="hidden lg:flex lg:flex-col w-56 xl:w-60 shrink-0 sticky top-0 h-screen border-r z-30"
        style={{
          backgroundColor: currentAppTheme.cardHex,
          borderColor: currentAppTheme.cardBorderHex
        }}
      >
        {SidebarContent}
      </aside>

      {/* Responsive Slide-over Navigation Drawer for Tablets & Phones */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/65 backdrop-blur-xs flex"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <aside
            className="w-64 max-w-[82vw] h-full border-r shadow-2xl"
            style={{
              backgroundColor: currentAppTheme.cardHex,
              borderColor: currentAppTheme.cardBorderHex
            }}
          >
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Right Content Shell: Slim Contextual Top Utility Bar + Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-20 h-14 border-b backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3"
          style={{ backgroundColor: 'var(--gm-header)', borderColor: 'var(--gm-border)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg border shrink-0 cursor-pointer"
              style={{
                backgroundColor: currentAppTheme.cardSecondaryHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className="lg:hidden flex items-center gap-2 min-w-0 cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center p-1 shrink-0"
                style={{
                  backgroundColor: currentAppTheme.cardSecondaryHex,
                  border: `1px solid ${currentAppTheme.accentHex}55`
                }}
              >
                <ChessPieceIcon type="n" color="w" set={profile.settings.pieceSet} />
              </div>
              <span className="font-display font-extrabold text-sm truncate" style={{ color: currentAppTheme.textPrimary }}>
                GM Studio
              </span>
            </button>

            <span
              className="hidden lg:inline font-display font-bold text-sm tracking-tight truncate"
              style={{ color: currentAppTheme.textPrimary }}
            >
              {TAB_TITLES[activeTab]}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <GlobalSearch
              iconOnly
              matches={matches}
              onSelectGame={onRunGameReview}
              onSelectVariant={onSelectVariantToPlay}
              onSelectCustomVariant={onPlayCustomInArena}
              onExecuteHelpAction={onGlobalHelpAction}
            />

            <button
              type="button"
              onClick={onOpenApkModal}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-90 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: currentAppTheme.accentHex,
                color: currentAppTheme.accentTextHex
              }}
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span>APK</span>
            </button>

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

            {!isOnline && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500"
                title="Offline · Local Encrypted Vault"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}

            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition hover:opacity-85 cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: firebaseUser ? `${currentAppTheme.accentHex}16` : currentAppTheme.cardSecondaryHex,
                borderColor: firebaseUser ? `${currentAppTheme.accentHex}55` : currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
              title={firebaseUser ? 'Manage Google Account & Online Classic Ratings' : 'Sign Up / Sign In with Google for Online Classic Chess'}
            >
              {firebaseUser ? (
                <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: currentAppTheme.accentHex }} />
              ) : (
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: currentAppTheme.accentHex }} />
              )}
              <span className="hidden sm:inline">
                {firebaseUser ? (publicProfile?.username || 'Online Account') : 'Sign In'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold tabular-nums hover:opacity-85 transition whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: currentAppTheme.cardSecondaryHex,
                borderColor: currentAppTheme.cardBorderHex,
                color: currentAppTheme.textPrimary
              }}
              title="View Profile & Rating Archive"
            >
              <span className="hidden md:inline font-sans font-semibold">{profile.username}</span>
              <span className="hidden md:inline" style={{ color: currentAppTheme.textMutedHex }}>·</span>
              <span style={{ color: currentAppTheme.accentHex }}>{displayHeaderRapidElo} Elo</span>
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 pb-10">
          {activeTab === 'home' && (
            <HomeView
              profile={profile}
              matches={matches}
              onQuickPlay={onQuickPlay}
              onSelectTab={onSelectNavTab}
              onSelectVariant={onSelectVariantToPlay}
              onOpenDailyPuzzle={onOpenDailyPuzzle}
              onOpenTrainSection={onOpenTrainSection}
              onReviewGame={onRunGameReview}
              onOpenApkModal={onOpenApkModal}
            />
          )}

          {activeTab === 'play' && (
            <PlayView
              initialVariant={activeVariant}
              customVariantConfig={activeCustomVariant}
              settings={profile.settings}
              playerRapidElo={profile.ratings.rapid}
              recentGames={matches}
              botChallengeRequest={botChallengeRequest}
              quickPlayRequest={quickPlayRequest}
              initialFenRequest={initialPlayFenRequest}
              firebaseUser={firebaseUser}
              publicProfile={publicProfile}
              pendingChallengeCode={pendingChallengeCode}
              onConsumeChallengeCode={onConsumeChallengeCode}
              onOpenAuthModal={onOpenAuthModal}
              onOnlineEloUpdated={onOnlineEloUpdated}
              onSaveGame={onSaveGame}
              onRunGameReview={onRunGameReview}
              onUpdateSettings={onUpdateSettings}
              onEditVariantRules={onEditVariantRules}
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
              onPlayFromFen={onPlayFromFen}
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

        {/* Site Legal & Copyright Footer */}
        <footer
          className="border-t px-4 sm:px-6 py-4 text-xs"
          style={{
            borderColor: currentAppTheme.cardBorderHex,
            color: currentAppTheme.textMutedHex
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © 2026 Grandmaster Studio. All rights reserved.
            </div>
            <nav aria-label="Legal and platform links" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
              <button
                type="button"
                onClick={() => onOpenLegalModal('privacy')}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('terms')}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('refund')}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                Refund Policy
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('sdks')}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                SDKs &amp; Keys
              </button>
              <button
                type="button"
                onClick={onReopenCookieBanner}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                Cookie Preferences
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalModal('copyright')}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.textSecondary }}
              >
                Licenses &amp; Copyright
              </button>
              <button
                type="button"
                onClick={onOpenApkModal}
                className="hover:underline cursor-pointer transition"
                style={{ color: currentAppTheme.accentHex }}
              >
                Android APK
              </button>
            </nav>
          </div>
        </footer>
      </div>

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
        firebaseUser={firebaseUser}
        publicProfile={publicProfile}
        onOpenAuthModal={() => {
          onCloseSettings();
          onOpenAuthModal();
        }}
        onOpenLegalModal={tab => {
          onCloseSettings();
          onOpenLegalModal(tab);
        }}
        onReopenCookieBanner={() => {
          onCloseSettings();
          onReopenCookieBanner();
        }}
      />

      {/* Android App & APK Download Modal */}
      <AndroidAppModal
        isOpen={isApkModalOpen}
        onClose={onCloseApkModal}
        playerUsername={profile.username}
        playerElo={profile.ratings.rapid}
      />

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={onCloseShortcuts}
        keyboardControl={Boolean(profile.settings.keyboardControl)}
        notationInput={Boolean(profile.settings.notationInput)}
        onToggleSetting={onToggleShortcutSetting}
      />

      {/* Privacy Policy, Terms of Service, Refund Policy, SDKs & Copyright Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalInitialTab}
        onClose={onCloseLegalModal}
      />

      {/* Google Sign-Up / Sign-In, Age Check, Easy Cancel & Delete Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        firebaseUser={firebaseUser}
        publicProfile={publicProfile}
        cookieConsent={cookieConsent?.choice ?? 'essential'}
        onOpenLegal={onOpenLegalModal}
        onAccountDeleted={onAccountDeleted}
        onPublicProfileUpdated={onPublicProfileUpdated}
      />

      {/* Persistent Cookie Consent & Preferences Banner */}
      <CookieConsentBanner
        isOpen={isCookieBannerOpen}
        currentConsent={cookieConsent}
        onSelectConsent={onSelectCookieConsent}
        onOpenLegal={onOpenLegalModal}
        onClose={onCloseCookieBanner}
      />
    </div>
  );
};
