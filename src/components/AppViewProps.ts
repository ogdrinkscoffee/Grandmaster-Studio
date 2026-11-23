import {
  UserProfile,
  GameHistoryItem,
  UserSettings,
  VariantId,
  CustomVariantConfig,
  AppThemeId,
  OpponentMode
} from '../types/chess';
import { User } from 'firebase/auth';
import { TrainSection } from './TrainView';
import { LegalTab } from './LegalModal';
import { SearchActionTarget } from '../engine/globalSearch';
import { AchievementDef, AchievementStatus } from '../engine/achievements';
import { AdaptivePosture } from '../engine/adaptiveBot';
import { AppThemeConfig } from '../theme/themes';
import { OnlinePlayerPublic } from '../engine/onlineClassic';
import { CookieConsentRecord } from './CookieConsentBanner';

export type AppTab = 'home' | 'play' | 'variants' | 'puzzles' | 'train' | 'review' | 'coach' | 'dashboard';

export interface QuickPlayRequest {
  presetId: string;
  mode: OpponentMode;
  variant?: VariantId;
  key: number;
}

export interface AppViewProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onSelectNavTab: (tab: AppTab) => void;

  activeVariant: VariantId;
  activeCustomVariant: CustomVariantConfig | null;
  variantsSubTab: 'catalog' | 'custom';
  studioSeedConfig: CustomVariantConfig | null;
  onSelectVariantToPlay: (variantId: VariantId) => void;
  onPlayCustomInArena: (config: CustomVariantConfig) => void;
  onEditVariantRules: (config: CustomVariantConfig) => void;

  quickPlayRequest: QuickPlayRequest | null;
  onQuickPlay: (req: Omit<QuickPlayRequest, 'key'>) => void;

  initialPlayFenRequest: { fen: string; key: number } | null;
  onPlayFromFen: (fen: string) => void;

  trainSectionRequest?: { section: TrainSection; key: number };
  onOpenTrainSection: (section: TrainSection) => void;
  onOpenVisionTrainer: () => void;

  selectedReviewGame: GameHistoryItem | null;
  recommendedPuzzleTheme?: string;
  onStartRecommendedPuzzles: (themeName: string) => void;
  dailyPuzzleRequestKey: number;
  onOpenDailyPuzzle: () => void;

  botChallengeRequest: {
    botId: string;
    posture?: AdaptivePosture;
    mode?: OpponentMode;
    key: number;
  } | null;
  onChallengeAdaptiveBot: (posture: AdaptivePosture, mode: OpponentMode) => void;

  profile: UserProfile;
  matches: GameHistoryItem[];
  currentAppTheme: AppThemeConfig;
  isLightMode: boolean;
  displayHeaderRapidElo: number;
  isOnline: boolean;

  achievementStatuses: AchievementStatus[];
  activeToast: AchievementDef | null;
  onDismissToast: () => void;

  isSettingsOpen: boolean;
  settingsInitialTab?: 'customization' | 'gameplay' | 'sync';
  onOpenSettings: (tab?: 'customization' | 'gameplay' | 'sync') => void;
  onCloseSettings: () => void;

  isShortcutsOpen: boolean;
  onOpenShortcuts: () => void;
  onCloseShortcuts: () => void;

  isApkModalOpen: boolean;
  onOpenApkModal: () => void;
  onCloseApkModal: () => void;

  isLegalModalOpen: boolean;
  legalInitialTab: LegalTab;
  onOpenLegalModal: (tab?: LegalTab) => void;
  onCloseLegalModal: () => void;

  firebaseUser: User | null;
  publicProfile: OnlinePlayerPublic | null;
  isAuthModalOpen: boolean;
  onOpenAuthModal: () => void;
  onCloseAuthModal: () => void;
  onPublicProfileUpdated: (profile: OnlinePlayerPublic) => void;
  onAccountDeleted: () => void;

  pendingChallengeCode: string | null;
  onConsumeChallengeCode: () => void;
  onOnlineEloUpdated: (bucket: 'bullet' | 'blitz' | 'rapid', elo: number) => void;

  cookieConsent: CookieConsentRecord | null;
  isCookieBannerOpen: boolean;
  onSelectCookieConsent: (choice: 'all' | 'essential') => void;
  onReopenCookieBanner: () => void;
  onCloseCookieBanner: () => void;

  onSaveGame: (newGame: GameHistoryItem) => void;
  onRunGameReview: (game: GameHistoryItem) => void;
  onImportGame: (game: GameHistoryItem) => void;
  onUpdatePuzzleElo: (newElo: number, solved?: boolean) => void;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onToggleColorMode: () => void;
  onSelectAppTheme: (themeId: AppThemeId) => void;
  onToggleShortcutSetting: (key: 'keyboardControl' | 'notationInput', value: boolean) => void;
  onUpdateProfile: (patch: { username?: string; title?: string }) => void;
  onRestoreDataPayload: (payload: unknown) => void;
  onResetLocalData: () => void;
  onGlobalHelpAction: (target: SearchActionTarget) => void;
}
