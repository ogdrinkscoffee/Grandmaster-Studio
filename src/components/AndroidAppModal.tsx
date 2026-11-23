import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  Cpu,
  Compass,
  Trophy,
  Brain,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Home,
  Swords,
  GraduationCap,
  Menu,
  Clock
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ChessPieceIcon } from './ChessPieces';
import { resolveBoardTheme } from '../theme/themes';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerUsername?: string;
  playerElo?: number;
}

const MINI_PREVIEW_PIECES: Record<string, { type: 'r' | 'n' | 'b' | 'q' | 'k' | 'p'; color: 'w' | 'b' }> = {
  a8: { type: 'r', color: 'b' },
  c8: { type: 'b', color: 'b' },
  d8: { type: 'q', color: 'b' },
  f8: { type: 'r', color: 'b' },
  g8: { type: 'k', color: 'b' },
  a7: { type: 'p', color: 'b' },
  b7: { type: 'p', color: 'b' },
  c7: { type: 'p', color: 'b' },
  f7: { type: 'p', color: 'b' },
  g7: { type: 'p', color: 'b' },
  h7: { type: 'p', color: 'b' },
  c6: { type: 'n', color: 'b' },
  f6: { type: 'n', color: 'b' },
  d5: { type: 'p', color: 'b' },
  e4: { type: 'p', color: 'w' },
  c4: { type: 'b', color: 'w' },
  f3: { type: 'n', color: 'w' },
  c3: { type: 'n', color: 'w' },
  a2: { type: 'p', color: 'w' },
  b2: { type: 'p', color: 'w' },
  c2: { type: 'p', color: 'w' },
  f2: { type: 'p', color: 'w' },
  g2: { type: 'p', color: 'w' },
  h2: { type: 'p', color: 'w' },
  a1: { type: 'r', color: 'w' },
  d1: { type: 'q', color: 'w' },
  f1: { type: 'r', color: 'w' },
  g1: { type: 'k', color: 'w' }
};

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({
  isOpen,
  onClose,
  playerUsername = 'GrandmasterPilot',
  playerElo = 1450
}) => {
  const { theme, pieceSet, settings } = useAppTheme();
  const boardTheme = resolveBoardTheme(settings);
  const { isInstalled, hasNativePrompt, isIOS, promptInstall } = usePWAInstall();
  const [installNotice, setInstallNotice] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInstallWebApk = async () => {
    setInstallNotice(null);
    if (isInstalled) {
      setInstallNotice('Already installed on this device as a standalone offline Android WebAPK.');
      return;
    }
    if (hasNativePrompt) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setInstallNotice('Installing Grandmaster Studio Android WebAPK to your home screen…');
      } else if (outcome === 'dismissed') {
        setInstallNotice('Install dismissed. You can install anytime from Chrome’s menu (⋮ → Install App).');
      } else {
        setInstallNotice(
          'Open this page in Chrome on Android and tap Menu (⋮) → Install App to add the standalone offline WebAPK to your home screen.'
        );
      }
      return;
    }
    if (isIOS) {
      setInstallNotice('On iOS/iPadOS Safari: tap Share → Add to Home Screen for full offline app mode.');
    } else {
      setInstallNotice(
        'Open this link in Chrome on Android and tap Menu (⋮) → Install App — Android installs the signed standalone WebAPK directly with zero archive extraction.'
      );
    }
  };

  const handleCopyMobileUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setInstallNotice(`Open ${window.location.origin} on your Android phone in Chrome to install the APK.`);
    }
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="android-apk-modal-title"
        className="rounded-2xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border max-h-[92vh] overflow-y-auto animate-modal-reveal"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex,
          color: theme.textPrimary
        }}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.cardBorderHex }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${theme.accentHex}1f`,
                border: `1px solid ${theme.accentHex}55`,
                color: theme.accentHex
              }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="android-apk-modal-title"
                className="font-display text-lg sm:text-xl font-extrabold tracking-tight"
                style={{ color: theme.textPrimary }}
              >
                Android App &amp; APK Package
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                Chess.com-proportioned mobile layout with every Grandmaster Studio feature bundled offline.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Android App dialog"
            className="p-2 rounded-lg border transition hover:opacity-80 cursor-pointer"
            style={{
              backgroundColor: theme.cardSecondaryHex,
              borderColor: theme.cardBorderHex,
              color: theme.textSecondary
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Split: Chess.com-sized Phone Interface Preview + Install & APK Build Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
          {/* Left: Phone Mockup in Chess.com Mobile Proportions */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="w-[276px] rounded-[28px] p-2.5 border-2 shadow-2xl"
              style={{
                backgroundColor: '#090d14',
                borderColor: theme.cardBorderHex
              }}
            >
              {/* Phone Status Notch */}
              <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-mono text-slate-400">
                <span>9:41</span>
                <div className="w-16 h-3 rounded-full bg-slate-800/90" />
                <span>Offline</span>
              </div>

              {/* Chess.com-Exact Mobile Screen Layout */}
              <div
                className="rounded-[20px] overflow-hidden border flex flex-col"
                style={{
                  backgroundColor: theme.bgHex,
                  borderColor: theme.cardBorderHex
                }}
              >
                {/* Compact Mobile Header */}
                <div
                  className="px-3 py-2 flex items-center justify-between border-b text-[11px] font-bold"
                  style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
                >
                  <span className="font-display font-extrabold tracking-tight">GM Studio</span>
                  <span className="font-mono text-[10px]" style={{ color: theme.accentHex }}>
                    Rapid 10+0
                  </span>
                </div>

                {/* Opponent Plate (Top) */}
                <div className="px-2.5 py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: theme.cardSecondaryHex, color: theme.accentHex }}
                    >
                      V
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate">Viktor (1400)</div>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded font-mono font-bold text-[11px] tabular-nums"
                    style={{ backgroundColor: theme.cardSecondaryHex, color: theme.textSecondary }}
                  >
                    09:42
                  </div>
                </div>

                {/* Full-Width Mobile Eval Strip */}
                <div className="h-1.5 w-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-slate-100" style={{ width: '56%' }} />
                </div>

                {/* Edge-to-Edge Chess.com-Sized 8x8 Board */}
                <div className="w-full aspect-square grid grid-cols-8 grid-rows-8">
                  {ranks.map((r, rIdx) =>
                    files.map((f, fIdx) => {
                      const sq = `${f}${r}`;
                      const isDark = (rIdx + fIdx) % 2 === 1;
                      const piece = MINI_PREVIEW_PIECES[sq];
                      return (
                        <div
                          key={sq}
                          className="flex items-center justify-center relative"
                          style={{
                            backgroundColor: isDark ? boardTheme.darkHex : boardTheme.lightHex
                          }}
                        >
                          {piece && (
                            <div className="w-[82%] h-[82%]">
                              <ChessPieceIcon type={piece.type} color={piece.color} set={pieceSet} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Player Plate (Bottom) */}
                <div className="px-2.5 py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center p-0.5"
                      style={{ backgroundColor: theme.cardSecondaryHex }}
                    >
                      <ChessPieceIcon type="n" color="w" set={pieceSet} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate">
                        {playerUsername} ({playerElo})
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded font-mono font-bold text-[11px] tabular-nums"
                    style={{
                      backgroundColor: `${theme.accentHex}22`,
                      color: theme.accentHex,
                      border: `1px solid ${theme.accentHex}66`
                    }}
                  >
                    09:54
                  </div>
                </div>

                {/* Chess.com-style Bottom 5-Tab Navigation Bar */}
                <div
                  className="grid grid-cols-5 border-t py-1.5 text-[9px] font-semibold"
                  style={{ backgroundColor: theme.cardHex, borderColor: theme.cardBorderHex }}
                >
                  {[
                    { label: 'Home', icon: <Home className="w-3.5 h-3.5" />, active: false },
                    { label: 'Play', icon: <Swords className="w-3.5 h-3.5" />, active: true },
                    { label: 'Puzzles', icon: <Trophy className="w-3.5 h-3.5" />, active: false },
                    { label: 'Learn', icon: <GraduationCap className="w-3.5 h-3.5" />, active: false },
                    { label: 'More', icon: <Menu className="w-3.5 h-3.5" />, active: false }
                  ].map(tab => (
                    <div
                      key={tab.label}
                      className="flex flex-col items-center gap-0.5"
                      style={{ color: tab.active ? theme.accentHex : theme.textMutedHex }}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Features & Download/Install Options */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div>
              <h3 className="font-display text-base font-bold" style={{ color: theme.textPrimary }}>
                All Desktop Features · Tuned for Android Screens
              </h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textSecondary }}>
                Designed in Chess.com’s signature mobile proportions with edge-to-edge touch boards, pinned opponent/player clocks, swipe-free drag &amp; tap, and full offline engine execution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                {
                  icon: <Cpu className="w-4 h-4" />,
                  title: 'Stockfish 19 WASM Offline',
                  desc: 'Full local search & move classification with zero internet.'
                },
                {
                  icon: <Compass className="w-4 h-4" />,
                  title: '36 Variants & Custom Studio',
                  desc: 'Chaturanga, Chess960, Atomic, Duck Chess & custom boards.'
                },
                {
                  icon: <Trophy className="w-4 h-4" />,
                  title: '1,030+ Puzzles & Drills',
                  desc: 'Adaptive tactics, Puzzle Rush, Openings, Endgames & Vision.'
                },
                {
                  icon: <Brain className="w-4 h-4" />,
                  title: 'AI Coach & Review',
                  desc: 'Live Tutor hints, Game Review & Position Decoder.'
                },
                {
                  icon: <Shield className="w-4 h-4" />,
                  title: 'AES-GCM Encrypted Sync',
                  desc: 'End-to-end encrypted vault sync between web & phone.'
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  title: 'Tournament Clocks & Premoves',
                  desc: 'Infinite premoves, increment timers & 15 custom themes.'
                }
              ].map(item => (
                <div
                  key={item.title}
                  className="p-3 rounded-xl border flex items-start gap-2.5"
                  style={{
                    backgroundColor: theme.cardSecondaryHex,
                    borderColor: theme.cardBorderHex
                  }}
                >
                  <div className="mt-0.5 shrink-0" style={{ color: theme.accentHex }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                      {item.title}
                    </div>
                    <div className="text-[11px] mt-0.5 leading-snug" style={{ color: theme.textSecondary }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div
              className="p-4 rounded-xl border flex flex-col gap-3"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: `${theme.accentHex}45`
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleInstallWebApk}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-[13px] transition hover:opacity-90 active:scale-[0.98] cursor-pointer whitespace-nowrap min-w-0"
                  style={{
                    backgroundColor: theme.accentHex,
                    color: theme.accentTextHex
                  }}
                >
                  {isInstalled ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Download className="w-4 h-4 shrink-0" />}
                  <span>{isInstalled ? 'APK Installed (Offline)' : 'Install Android APK (WebAPK)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMobileUrl}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border font-bold text-xs sm:text-[13px] transition hover:opacity-85 active:scale-[0.98] cursor-pointer whitespace-nowrap min-w-0"
                  style={{
                    backgroundColor: theme.cardHex,
                    borderColor: theme.cardBorderHex,
                    color: theme.textPrimary
                  }}
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                  )}
                  <span>{copiedLink ? 'Phone Link Copied' : 'Copy Link for Android Phone'}</span>
                </button>
              </div>

              {installNotice && (
                <p className="text-xs leading-relaxed" style={{ color: theme.accentHex }}>
                  {installNotice}
                </p>
              )}

              <div
                className="text-[11px] leading-relaxed pt-2 border-t flex items-start gap-2"
                style={{ borderColor: theme.cardBorderHex, color: theme.textMutedHex }}
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.accentHex }} />
                <span>
                  <strong style={{ color: theme.textSecondary }}>Direct Android WebAPK Install:</strong> In Chrome on Android, tapping{' '}
                  <strong style={{ color: theme.textSecondary }}>Install Android APK (WebAPK)</strong> (or Chrome Menu ⋮ → Install App) automatically provisions and installs a signed standalone Android app with full offline Stockfish 19 WASM and home-screen icon.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
