import React, { useState, useEffect } from 'react';
import { UserSettings, KingFinialStyle } from '../types/chess';
import {
  ALL_15_PIECE_SETS,
  APP_THEME_FAMILIES,
  SIGNATURE_BOARDS,
  getAppTheme,
  resolveBoardTheme
} from '../theme/themes';
import { ChessPieceIcon } from './ChessPieces';
import { BoardEditor, BoardSwatch } from './BoardEditor';
import { PWAInstallButton } from './PWAInstallButton';
import { encryptData, decryptData } from '../utils/crypto';
import {
  Palette,
  Sparkles,
  BatteryCharging,
  Lock,
  Cloud,
  Volume2,
  X,
  Download,
  Upload,
  Check,
  Shield,
  Sliders,
  Moon,
  Sun,
  FastForward,
  MousePointerClick,
  Keyboard,
  Terminal,
  FlipVertical2,
  Timer,
  Eye,
  EyeOff,
  Wand2,
  User,
  RotateCcw,
  AlertTriangle,
  Globe,
  UserCheck,
  Cookie,
  Receipt
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { OnlinePlayerPublic } from '../engine/onlineClassic';
import { LegalTab } from './LegalModal';
import { useAppTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  settings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: UserSettings) => void;
  fullDataPayload: unknown;
  onRestoreDataPayload: (payload: unknown) => void;
  profile?: { username: string; title: string };
  onUpdateProfile?: (patch: { username?: string; title?: string }) => void;
  onResetLocalData?: () => void;
  initialTab?: 'customization' | 'gameplay' | 'sync';
  firebaseUser?: FirebaseUser | null;
  publicProfile?: OnlinePlayerPublic | null;
  onOpenAuthModal?: () => void;
  onOpenLegalModal?: (tab: LegalTab) => void;
  onReopenCookieBanner?: () => void;
}

async function computeVaultToken(vaultId: string, pass: string): Promise<string> {
  const encoded = new TextEncoder().encode(`${vaultId}:${pass}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  fullDataPayload,
  onRestoreDataPayload,
  profile,
  onUpdateProfile,
  onResetLocalData,
  initialTab,
  firebaseUser,
  publicProfile,
  onOpenAuthModal,
  onOpenLegalModal,
  onReopenCookieBanner
}) => {
  const { theme: currentTheme } = useAppTheme();
  const [current, setCurrent] = useState<UserSettings>(settings);
  const [activeTab, setActiveTab] = useState<'customization' | 'gameplay' | 'sync'>(initialTab || 'customization');
  const [showBoardEditor, setShowBoardEditor] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Keep state synchronized
  useEffect(() => {
    setCurrent(settings);
  }, [settings, isOpen]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Reset transient UI states when closed
  useEffect(() => {
    if (!isOpen) {
      setShowBoardEditor(false);
      setConfirmReset(false);
      setShowPassphrase(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Immediate live updater
  const updateSettingImmediate = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...current, [key]: value };
    setCurrent(updated);
    onSaveSettings(updated);
  };

  const validatePassphrase = (): boolean => {
    if (passphrase.trim().length < 6) {
      setSyncStatus('Enter a private encryption passphrase of at least 6 characters first.');
      return false;
    }
    return true;
  };

  const handlePushCloudSync = async () => {
    if (!validatePassphrase()) return;
    try {
      setSyncStatus('Encrypting with AES-GCM 256...');
      const serialized = JSON.stringify(fullDataPayload);
      const encrypted = await encryptData(serialized, passphrase);
      const token = await computeVaultToken(current.syncVaultId, passphrase);

      const res = await fetch('/api/sync/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vault-token': token,
        },
        body: JSON.stringify({
          vaultId: current.syncVaultId,
          encryptedPayload: encrypted,
        }),
      });

      if (res.ok) {
        setSyncStatus('Encrypted cloud backup synced successfully! (Ciphertext stored)');
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setSyncStatus(errData.error || `Cloud sync rejected (HTTP ${res.status}).`);
      }
    } catch {
      setSyncStatus('Network unavailable — could not reach Cloud Sync server.');
    }
  };

  const handlePullCloudSync = async () => {
    if (!validatePassphrase()) return;
    try {
      setSyncStatus('Fetching encrypted ciphertext...');
      const token = await computeVaultToken(current.syncVaultId, passphrase);
      const res = await fetch(`/api/sync/pull/${encodeURIComponent(current.syncVaultId)}`, {
        headers: {
          'x-vault-token': token,
        },
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setSyncStatus(errData.error || `Could not restore vault (HTTP ${res.status}).`);
        return;
      }
      const data = await res.json();
      setSyncStatus('Decrypting with private passphrase...');
      const decrypted = await decryptData(data.ciphertext, passphrase);
      const restored = JSON.parse(decrypted);
      onRestoreDataPayload(restored);
      setSyncStatus('Profile and match history restored securely!');
    } catch {
      setSyncStatus('Decryption failed! Please check your encryption passphrase.');
    }
  };

  const handleExportBackup = async () => {
    if (!validatePassphrase()) return;
    try {
      const serialized = JSON.stringify(fullDataPayload);
      const encrypted = await encryptData(serialized, passphrase);
      const blob = new Blob([encrypted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gm-chess-backup-${Date.now()}.gmchess`;
      a.click();
      URL.revokeObjectURL(url);
      setSyncStatus('Encrypted .gmchess backup downloaded.');
    } catch (err) {
      console.error(err);
      setSyncStatus('Failed to export encrypted backup.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!validatePassphrase()) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const decrypted = await decryptData(text, passphrase);
        const restored = JSON.parse(decrypted);
        onRestoreDataPayload(restored);
        setSyncStatus('Encrypted vault file imported and restored!');
      } catch {
        setSyncStatus('Import failed! Invalid passphrase or corrupted file.');
      }
    };
    reader.readAsText(file);
  };

  const updateSettings = (patch: Partial<UserSettings>) => {
    const updated = { ...current, ...patch };
    setCurrent(updated);
    onSaveSettings(updated);
  };

  const matchBoard = current.matchBoardToPieces !== false;
  const activeBoard = resolveBoardTheme(current);
  const colorMode = current.colorMode === 'light' ? 'light' : 'dark';
  const activeFamily = getAppTheme(current.appTheme, colorMode);

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
        aria-labelledby="settings-modal-title"
        className="rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl max-h-[92vh] flex flex-col"
        style={{
          backgroundColor: currentTheme.cardHex,
          border: `1px solid ${currentTheme.cardBorderHex}`,
          color: currentTheme.textPrimary
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${currentTheme.cardBorderHex}` }}>
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5" style={{ color: currentTheme.accentHex }} />
            <div>
              <h2 id="settings-modal-title" className="font-display text-lg font-bold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                Studio Settings & Customization
              </h2>
              <p className="text-xs tabular-nums" style={{ color: currentTheme.textMutedHex }}>
                30 Boards · 10 Themes (Dark & Light) · 15 Piece Styles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 rounded-lg transition hover:opacity-70"
            style={{ color: currentTheme.textMutedHex }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none text-xs font-semibold" style={{ borderBottom: `1px solid ${currentTheme.cardBorderHex}` }}>
          <button
            type="button"
            onClick={() => setActiveTab('customization')}
            className="px-4 py-2 rounded-xl flex items-center gap-2 transition"
            style={
              activeTab === 'customization'
                ? {
                    backgroundColor: currentTheme.accentHex,
                    color: currentTheme.accentTextHex,
                    fontWeight: 700
                  }
                : {
                    backgroundColor: currentTheme.cardSecondaryHex,
                    color: currentTheme.textMutedHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }
            }
          >
            <Palette className="w-4 h-4" />
            <span>Customization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gameplay')}
            className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap"
            style={
              activeTab === 'gameplay'
                ? {
                    backgroundColor: currentTheme.accentHex,
                    color: currentTheme.accentTextHex,
                    fontWeight: 700
                  }
                : {
                    backgroundColor: currentTheme.cardSecondaryHex,
                    color: currentTheme.textMutedHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }
            }
          >
            <FastForward className="w-4 h-4" />
            <span>Gameplay & Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className="px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap"
            style={
              activeTab === 'sync'
                ? {
                    backgroundColor: currentTheme.accentHex,
                    color: currentTheme.accentTextHex,
                    fontWeight: 700
                  }
                : {
                    backgroundColor: currentTheme.cardSecondaryHex,
                    color: currentTheme.textMutedHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }
            }
          >
            <Shield className="w-4 h-4" />
            <span>Profile, App &amp; Sync</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-6">
          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && showBoardEditor && (
            <BoardEditor settings={current} onUpdate={updateSettings} onBack={() => setShowBoardEditor(false)} />
          )}

          {activeTab === 'customization' && !showBoardEditor && (
            <div className="space-y-6">
              {/* SECTION 1: BOARDS */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="font-bold uppercase tracking-wider text-xs flex items-center gap-1.5" style={{ color: currentTheme.textPrimary }}>
                    <Sliders className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                    Chess Boards
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBoardEditor(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition hover:opacity-80"
                    style={{
                      backgroundColor: currentTheme.cardSecondaryHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.accentHex
                    }}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Board editor
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {SIGNATURE_BOARDS.map(board => {
                    const isSelected = activeBoard.id === board.id;
                    const pieceInfo = ALL_15_PIECE_SETS.find(p => p.id === board.pieceSet);
                    return (
                      <button
                        key={board.id}
                        type="button"
                        title={board.description}
                        onClick={() =>
                          matchBoard
                            ? updateSettings({ pieceSet: board.pieceSet!, boardTheme: board.id })
                            : updateSettings({ boardTheme: board.id })
                        }
                        className="p-2 rounded-xl flex flex-col gap-1.5 transition text-left"
                        style={{
                          backgroundColor: isSelected ? `${currentTheme.accentHex}20` : currentTheme.cardSecondaryHex,
                          border: `2px solid ${isSelected ? currentTheme.accentHex : currentTheme.cardBorderHex}`,
                          color: currentTheme.textPrimary
                        }}
                      >
                        <BoardSwatch board={board} />
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[11px] truncate" style={{ color: currentTheme.textPrimary }}>{board.name}</span>
                          {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: currentTheme.accentHex }} />}
                        </div>
                        <span className="flex items-center gap-1 text-[9px] truncate" style={{ color: currentTheme.textMutedHex }}>
                          <span className="w-3.5 h-3.5 shrink-0">
                            <ChessPieceIcon type="k" color="w" set={board.pieceSet!} />
                          </span>
                          {pieceInfo?.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: 10 APP THEMES */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <span className="font-bold uppercase tracking-wider text-xs flex items-center gap-1.5" style={{ color: currentTheme.textPrimary }}>
                    <Sparkles className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                    App Themes · 10
                  </span>

                  <div
                    role="radiogroup"
                    aria-label="Color mode"
                    className="flex items-center p-0.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: currentTheme.cardSecondaryHex, border: `1px solid ${currentTheme.cardBorderHex}` }}
                  >
                    {(['dark', 'light'] as const).map(mode => {
                      const active = colorMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => updateSettingImmediate('colorMode', mode)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full transition"
                          style={
                            active
                              ? { backgroundColor: currentTheme.accentHex, color: currentTheme.accentTextHex }
                              : { color: currentTheme.textMutedHex }
                          }
                        >
                          {mode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                          {mode === 'dark' ? 'Dark' : 'Light'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {APP_THEME_FAMILIES.map(family => {
                    const isSelected = activeFamily.id === family.id;
                    const t = colorMode === 'light' ? family.light : family.dark;
                    return (
                      <button
                        key={family.id}
                        type="button"
                        onClick={() => updateSettingImmediate('appTheme', family.id)}
                        className="p-2 rounded-xl flex flex-col gap-1.5 transition text-left"
                        style={{
                          backgroundColor: isSelected ? `${currentTheme.accentHex}20` : currentTheme.cardSecondaryHex,
                          border: `2px solid ${isSelected ? currentTheme.accentHex : currentTheme.cardBorderHex}`,
                          color: currentTheme.textPrimary
                        }}
                      >
                        <div
                          className="w-full h-12 rounded-lg p-1.5 flex flex-col gap-1 overflow-hidden"
                          style={{
                            backgroundColor: t.bgHex,
                            backgroundImage: t.bgGradient,
                            backgroundSize: 'cover',
                            border: `1px solid ${t.cardBorderHex}`
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundImage: `linear-gradient(135deg, ${t.accentHex}, ${t.accent2Hex})` }}
                            />
                            <div className="h-1 w-6 rounded-full" style={{ backgroundColor: t.textPrimary, opacity: 0.7 }} />
                          </div>
                          <div className="flex-1 rounded flex items-center gap-1 px-1" style={{ backgroundColor: t.cardHex, border: `1px solid ${t.cardBorderHex}` }}>
                            <div className="h-1 w-5 rounded-full" style={{ backgroundColor: t.textSecondary, opacity: 0.7 }} />
                            <div className="ml-auto h-2 w-4 rounded-sm" style={{ backgroundColor: t.accentHex }} />
                          </div>
                        </div>
                        <div className="flex h-1.5 rounded-full overflow-hidden">
                          <div className="flex-1" style={{ backgroundColor: family.dark.bgHex }} />
                          <div className="flex-1" style={{ backgroundColor: family.dark.accentHex }} />
                          <div className="flex-1" style={{ backgroundColor: family.light.accentHex }} />
                          <div className="flex-1" style={{ backgroundColor: family.light.bgHex }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] truncate" style={{ color: currentTheme.textPrimary }}>{family.name}</span>
                          {isSelected && <Check className="w-3 h-3 shrink-0" style={{ color: currentTheme.accentHex }} />}
                        </div>
                        <span className="text-[9px] truncate" style={{ color: currentTheme.textMutedHex }}>{family.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: KING CROWN EMBLEM */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl"
                style={{ backgroundColor: currentTheme.cardSecondaryHex, border: `1px solid ${currentTheme.cardBorderHex}` }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 shrink-0">
                    <ChessPieceIcon type="k" color="w" set={current.pieceSet} kingFinial={current.kingFinial || 'crescent'} />
                  </span>
                  <span className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>King emblem</span>
                </span>
                <div
                  role="radiogroup"
                  aria-label="King crown emblem"
                  className="flex items-center p-0.5 rounded-lg"
                  style={{ backgroundColor: currentTheme.cardHex, border: `1px solid ${currentTheme.cardBorderHex}` }}
                >
                  {([
                    { id: 'crescent', name: 'Crescent' },
                    { id: 'star', name: 'Star' },
                    { id: 'crescent_star', name: 'Both' }
                  ] as { id: KingFinialStyle; name: string }[]).map(option => {
                    const isSelected = (current.kingFinial || 'crescent') === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        title={option.id === 'crescent_star' ? 'Crescent & Star' : option.name}
                        onClick={() => updateSettingImmediate('kingFinial', option.id)}
                        className="flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-md text-[11px] font-bold transition"
                        style={
                          isSelected
                            ? { backgroundColor: currentTheme.accentHex, color: currentTheme.accentTextHex }
                            : { color: currentTheme.textSecondary }
                        }
                      >
                        <span className="w-5 h-5 shrink-0">
                          <ChessPieceIcon type="k" color={isSelected ? 'w' : 'b'} set={current.pieceSet} kingFinial={option.id} />
                        </span>
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: BOARD LAYOUT OPTIONS */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl text-xs"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="board-size-slider" className="font-bold uppercase tracking-wider text-[11px]" style={{ color: currentTheme.textSecondary }}>
                      Board Size
                    </label>
                    <span className="font-mono font-bold text-[11px]" style={{ color: currentTheme.accentHex }}>
                      {current.boardSize || 100}%
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="flex items-center p-0.5 rounded-lg"
                      style={{ backgroundColor: currentTheme.cardHex, border: `1px solid ${currentTheme.cardBorderHex}` }}
                    >
                      {[
                        { label: 'S', value: 75 },
                        { label: 'M', value: 100 },
                        { label: 'L', value: 120 },
                        { label: 'XL', value: 140 }
                      ].map(preset => {
                        const active = (current.boardSize || 100) === preset.value;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => updateSettingImmediate('boardSize', preset.value)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold transition"
                            style={
                              active
                                ? { backgroundColor: currentTheme.accentHex, color: currentTheme.accentTextHex }
                                : { color: currentTheme.textSecondary }
                            }
                            aria-label={`Board size ${preset.label} (${preset.value}%)`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      id="board-size-slider"
                      type="range"
                      min={60}
                      max={140}
                      step={5}
                      value={current.boardSize || 100}
                      onChange={e => updateSettingImmediate('boardSize', Number(e.target.value))}
                      className="flex-1 min-w-[140px]"
                      style={{ accentColor: currentTheme.accentHex }}
                    />
                  </div>
                  <p className="mt-1 text-[10px]" style={{ color: currentTheme.textMutedHex }}>
                    Larger sizes are limited by your window width.
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl text-xs"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div>
                  <label className="font-bold block mb-1.5 uppercase tracking-wider text-[11px]" style={{ color: currentTheme.textSecondary }}>
                    Eval Bar Position
                  </label>
                  <select
                    value={current.evalBarPosition}
                    onChange={e => updateSettingImmediate('evalBarPosition', e.target.value as 'left' | 'right' | 'hidden')}
                    className="w-full rounded-xl px-3 py-2 font-medium"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.textPrimary
                    }}
                  >
                    <option value="left">Left / Above Board</option>
                    <option value="right">Right / Below Board</option>
                    <option value="hidden">Hidden (Focus Mode)</option>
                  </select>
                </div>
              
                              <div>
                                <label className="font-bold block mb-1.5 uppercase tracking-wider text-[11px]" style={{ color: currentTheme.textSecondary }}>
                                  Coordinates Display
                                </label>
                                <select
                                  value={current.showCoordinates}
                                  onChange={e => updateSettingImmediate('showCoordinates', e.target.value as 'inside' | 'outside' | 'hidden')}
                                  className="w-full rounded-xl px-3 py-2 font-medium"
                                  style={{
                                    backgroundColor: currentTheme.cardHex,
                                    border: `1px solid ${currentTheme.cardBorderHex}`,
                                    color: currentTheme.textPrimary
                                  }}
                                >
                                  <option value="inside">Inside Board Squares</option>
                                  <option value="outside">Outside Borders</option>
                                  <option value="hidden">Hidden</option>
                                </select>
                              </div>
                            </div>
            </div>
          )}

          {/* TAB: GAMEPLAY & AUDIO */}
          {activeTab === 'gameplay' && (
            <div className="space-y-4 text-xs">
              {/* Premove Availability */}
              <div
                className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${currentTheme.accentHex}15`,
                      color: currentTheme.accentHex,
                      border: `1px solid ${currentTheme.accentHex}30`
                    }}
                  >
                    <FastForward className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      Premoves Queue Limit
                    </div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Queue up to 2 conditional premoves or infinite chains while AI thinks. Right-click or press Esc to cancel.
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 p-1 rounded-lg border shrink-0"
                  style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                >
                  {([
                    { id: 'off', label: 'Off' },
                    { id: '2', label: '2 Premoves' },
                    { id: 'infinite', label: 'Infinite (∞)' }
                  ] as const).map(opt => {
                    const active = (current.premoveMode || 'infinite') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSettingImmediate('premoveMode', opt.id)}
                        className="px-2.5 py-1.5 rounded-md font-bold transition whitespace-nowrap"
                        style={{
                          backgroundColor: active ? currentTheme.accentHex : 'transparent',
                          color: active ? currentTheme.accentTextHex : currentTheme.textSecondary
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Move Timing */}
              <div
                className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${currentTheme.accentHex}15`,
                      color: currentTheme.accentHex,
                      border: `1px solid ${currentTheme.accentHex}30`
                    }}
                  >
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      AI Move Timing
                    </div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Human-like pacing scales thinking time naturally by clock speed &amp; position complexity, or switch to Instant replies.
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 p-1 rounded-lg border shrink-0"
                  style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                >
                  {([
                    { id: 'human', label: 'Human-Like' },
                    { id: 'instant', label: 'Instant' }
                  ] as const).map(opt => {
                    const active = (current.aiThinkingMode || 'human') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSettingImmediate('aiThinkingMode', opt.id)}
                        className="px-2.5 py-1.5 rounded-md font-bold transition whitespace-nowrap"
                        style={{
                          backgroundColor: active ? currentTheme.accentHex : 'transparent',
                          color: active ? currentTheme.accentTextHex : currentTheme.textSecondary
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Piece Move Input Method */}
              <div
                className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      Piece Movement Input
                    </div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Drag smoothly with animated piece lift, click squares, or allow both.
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 p-1 rounded-lg border shrink-0"
                  style={{ backgroundColor: currentTheme.cardHex, borderColor: currentTheme.cardBorderHex }}
                >
                  {([
                    { id: 'both', label: 'Click & Drag' },
                    { id: 'drag', label: 'Drag Only' },
                    { id: 'click', label: 'Click Only' }
                  ] as const).map(opt => {
                    const active = (current.moveInputMethod || 'both') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSettingImmediate('moveInputMethod', opt.id)}
                        className="px-2.5 py-1.5 rounded-md font-bold transition whitespace-nowrap"
                        style={{
                          backgroundColor: active ? currentTheme.accentHex : 'transparent',
                          color: active ? currentTheme.accentTextHex : currentTheme.textSecondary
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keyboard & Notation Move Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                        Keyboard Board Control
                      </div>
                      <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                        Move cursor with Arrow keys or WASD and press Space or Enter to move pieces.
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Keyboard Board Control"
                    checked={Boolean(current.keyboardControl)}
                    onChange={e => updateSettingImmediate('keyboardControl', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer shrink-0"
                    style={{ accentColor: currentTheme.accentHex }}
                  />
                </div>

                <div
                  className="p-4 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                        Type Notation to Move
                      </div>
                      <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                        Show a live move command bar to play by typing SAN or UCI (e.g. Nf3, O-O, e2e4).
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Type Notation to Move"
                    checked={Boolean(current.notationInput)}
                    onChange={e => updateSettingImmediate('notationInput', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer shrink-0"
                    style={{ accentColor: currentTheme.accentHex }}
                  />
                </div>
              </div>

              {/* Pass & Play Auto-Flip Board */}
              <div
                className="p-4 rounded-xl flex items-center justify-between gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <FlipVertical2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      Auto-Flip Pass &amp; Play Board
                    </div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Automatically orient the board to the active player after every move in 2-player local mode.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  aria-label="Auto-Flip Pass and Play Board"
                  checked={Boolean(current.autoFlipLocal2P)}
                  onChange={e => updateSettingImmediate('autoFlipLocal2P', e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer shrink-0"
                  style={{ accentColor: currentTheme.accentHex }}
                />
              </div>

              {/* Live Evaluation & Move Icons During AI Matches */}
              <div
                className="p-4 rounded-xl flex items-center justify-between gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${currentTheme.accentHex}15`,
                      color: currentTheme.accentHex,
                      border: `1px solid ${currentTheme.accentHex}30`
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      Live Evaluation &amp; Move Badges (vs AI)
                    </div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Show eval bar, move accuracy, and badges (!!, ★, ??) while playing AI. Turn off for distraction-free focus (post-game review stays available).
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  aria-label="Live Evaluation and Move Badges"
                  checked={current.showLiveEval !== false}
                  onChange={e => updateSettingImmediate('showLiveEval', e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer shrink-0"
                  style={{ accentColor: currentTheme.accentHex }}
                />
              </div>

              {/* Auto-Promote to Queen + Legal Move Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Auto-Promote to Queen</div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Turn off to show the 4-piece picker (Q, R, B, N) on promotion.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Auto-Promote to Queen"
                    checked={current.autoQueen !== false}
                    onChange={e => updateSettingImmediate('autoQueen', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer shrink-0"
                    style={{ accentColor: currentTheme.accentHex }}
                  />
                </div>

                <div
                  className="p-4 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Highlight Legal Moves</div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Display target dots and capture rings when lifting or selecting a piece.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Highlight Legal Moves"
                    checked={current.highlightLegalMoves !== false}
                    onChange={e => updateSettingImmediate('highlightLegalMoves', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer shrink-0"
                    style={{ accentColor: currentTheme.accentHex }}
                  />
                </div>
              </div>

              {/* Battery Saver Mode */}
              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${currentTheme.accentHex}15`,
                      color: currentTheme.accentHex,
                      border: `1px solid ${currentTheme.accentHex}30`
                    }}
                  >
                    <BatteryCharging className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Battery Saver & Low Power Mode</div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Throttles engine worker threads and reduces GPU drag/settle animations on older devices.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.batterySaver}
                  onChange={e => updateSettingImmediate('batterySaver', e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: currentTheme.accentHex }}
                />
              </div>

              {/* Sound settings */}
              <div
                className="p-4 rounded-xl flex items-center justify-between"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.cardBorderHex}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>Web Audio Sound Effects</div>
                    <div className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
                      Synthesized locally with zero battery waste and instant response.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={current.soundEnabled}
                  onChange={e => updateSettingImmediate('soundEnabled', e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: currentTheme.accentHex }}
                />
              </div>
            </div>
          )}

          {/* TAB: PROFILE, PWA & E2EE CLOUD SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4 text-xs">
              {profile && onUpdateProfile && (
                <div
                  className="p-4 rounded-xl flex flex-col gap-3"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    border: `1px solid ${currentTheme.cardBorderHex}`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                    <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                      Player Profile Identity
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="profile-username-input" className="text-[10px] uppercase font-bold block mb-1" style={{ color: currentTheme.textMutedHex }}>
                        Username
                      </label>
                      <input
                        id="profile-username-input"
                        type="text"
                        value={profile.username}
                        maxLength={32}
                        onChange={e => onUpdateProfile({ username: e.target.value })}
                        className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        style={{
                          backgroundColor: currentTheme.cardHex,
                          border: `1px solid ${currentTheme.cardBorderHex}`,
                          color: currentTheme.textPrimary
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-title-select" className="text-[10px] uppercase font-bold block mb-1" style={{ color: currentTheme.textMutedHex }}>
                        Title
                      </label>
                      <select
                        id="profile-title-select"
                        value={profile.title}
                        onChange={e => onUpdateProfile({ title: e.target.value })}
                        className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        style={{
                          backgroundColor: currentTheme.cardHex,
                          border: `1px solid ${currentTheme.cardBorderHex}`,
                          color: currentTheme.textPrimary
                        }}
                      >
                        <option value="">None</option>
                        <option value="Club">Club</option>
                        <option value="CM">CM</option>
                        <option value="NM">NM</option>
                        <option value="FM">FM</option>
                        <option value="IM">IM</option>
                        <option value="GM">GM</option>
                        <option value="WGM">WGM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <PWAInstallButton variant="card" />

              <div
                className="p-4 rounded-xl flex flex-col gap-3"
                style={{
                  backgroundColor: currentTheme.cardSecondaryHex,
                  border: `1px solid ${currentTheme.accentHex}40`
                }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                  <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                    End-to-End Encryption (E2EE) &amp; Cloud Sync
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMutedHex }}>
                  Your match archive, rating trends, and notes are encrypted locally with AES-GCM 256 using your private passphrase. Only a SHA-256 vault access token and ciphertext are sent to the server.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label htmlFor="vault-passphrase-input" className="text-[10px] uppercase font-bold block mb-1" style={{ color: currentTheme.textMutedHex }}>
                      Private Encryption Passphrase (6+ chars)
                    </label>
                    <div className="relative">
                      <input
                        id="vault-passphrase-input"
                        type={showPassphrase ? 'text' : 'password'}
                        value={passphrase}
                        onChange={e => setPassphrase(e.target.value)}
                        placeholder="Enter private passphrase..."
                        autoComplete="off"
                        className="w-full rounded-lg pl-2.5 pr-8 py-1.5 text-xs"
                        style={{
                          backgroundColor: currentTheme.cardHex,
                          border: `1px solid ${currentTheme.cardBorderHex}`,
                          color: currentTheme.textPrimary
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassphrase(v => !v)}
                        aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:opacity-80"
                        style={{ color: currentTheme.textMutedHex }}
                      >
                        {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="vault-id-input" className="text-[10px] uppercase font-bold block mb-1" style={{ color: currentTheme.textMutedHex }}>
                      Vault ID
                    </label>
                    <input
                      id="vault-id-input"
                      type="text"
                      value={current.syncVaultId}
                      onChange={e => updateSettingImmediate('syncVaultId', e.target.value)}
                      className="w-full rounded-lg px-2.5 py-1.5 text-xs font-mono"
                      style={{
                        backgroundColor: currentTheme.cardHex,
                        border: `1px solid ${currentTheme.cardBorderHex}`,
                        color: currentTheme.accentHex
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePushCloudSync}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: currentTheme.accentHex,
                      color: currentTheme.accentTextHex
                    }}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    Push Encrypted Backup
                  </button>

                  <button
                    type="button"
                    onClick={handlePullCloudSync}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.textPrimary
                    }}
                  >
                    <Lock className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
                    Pull &amp; Decrypt
                  </button>

                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.textPrimary
                    }}
                    title="Download encrypted file (.gmchess)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Vault
                  </button>

                  <label
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.textPrimary
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Import Vault
                    <input
                      type="file"
                      accept=".gmchess,.json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>

                {syncStatus && (
                  <div
                    className="p-2 rounded font-mono text-[11px]"
                    style={{
                      backgroundColor: currentTheme.cardHex,
                      border: `1px solid ${currentTheme.cardBorderHex}`,
                      color: currentTheme.accentHex
                    }}
                  >
                    {syncStatus}
                  </div>
                )}
              </div>

              {/* Google Account, Free Plan & Easy Cancel / Delete + Cookie & Legal Controls */}
              {onOpenAuthModal && (
                <div
                  className="p-4 rounded-xl flex flex-col gap-3 border"
                  style={{
                    backgroundColor: currentTheme.cardSecondaryHex,
                    borderColor: currentTheme.cardBorderHex
                  }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {firebaseUser ? (
                        <UserCheck className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                      ) : (
                        <Globe className="w-4 h-4" style={{ color: currentTheme.accentHex }} />
                      )}
                      <div className="font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                        Online Classic Account &amp; Data Controls
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold" style={{ color: currentTheme.accentHex }}>
                      Free Plan ($0)
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMutedHex }}>
                    {firebaseUser
                      ? `Signed in with Google as ${publicProfile?.username || firebaseUser.displayName || firebaseUser.email}. Online Classic ratings & challenges sync across both Web and Android APK.`
                      : 'Sign in with Google (13+ age check required) to unlock rated Classic Online matches, private friend links, and account deletion/export controls.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.accentHex,
                        color: currentTheme.accentTextHex
                      }}
                    >
                      {firebaseUser ? <UserCheck className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>{firebaseUser ? 'Manage Account / Cancel / Delete' : 'Sign In with Google'}</span>
                    </button>

                    {onReopenCookieBanner && (
                      <button
                        type="button"
                        onClick={onReopenCookieBanner}
                        className="px-3 py-1.5 rounded-lg border font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                        style={{
                          backgroundColor: currentTheme.cardHex,
                          borderColor: currentTheme.cardBorderHex,
                          color: currentTheme.textPrimary
                        }}
                      >
                        <Cookie className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
                        <span>Cookie Preferences</span>
                      </button>
                    )}

                    {onOpenLegalModal && (
                      <button
                        type="button"
                        onClick={() => onOpenLegalModal('refund')}
                        className="px-3 py-1.5 rounded-lg border font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                        style={{
                          backgroundColor: currentTheme.cardHex,
                          borderColor: currentTheme.cardBorderHex,
                          color: currentTheme.textPrimary
                        }}
                      >
                        <Receipt className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
                        <span>Refund Policy &amp; SDK Audit</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {onResetLocalData && (
                <div
                  className="p-4 rounded-xl flex flex-col gap-2.5 border border-rose-500/30 bg-rose-500/5"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5 text-rose-400">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Reset Local Studio Data</span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: currentTheme.textMutedHex }}>
                        Clears locally stored matches, custom variants, puzzle queue, training progress, and restores starter profile defaults.
                      </p>
                    </div>
                    {!confirmReset ? (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 font-bold text-xs hover:bg-rose-500/10 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Local Data</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onResetLocalData();
                            setConfirmReset(false);
                            setSyncStatus('Local studio data reset to starter defaults.');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs hover:opacity-90 transition"
                        >
                          Confirm Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-3 py-1.5 rounded-lg border font-semibold text-xs hover:opacity-80 transition"
                          style={{
                            backgroundColor: currentTheme.cardHex,
                            borderColor: currentTheme.cardBorderHex,
                            color: currentTheme.textSecondary
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 text-xs" style={{ borderTop: `1px solid ${currentTheme.cardBorderHex}` }}>
          <span className="text-[11px]" style={{ color: currentTheme.textMutedHex }}>
            Changes apply live instantly and save automatically.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold transition shadow-lg active:scale-95"
            style={{
              backgroundColor: currentTheme.accentHex,
              color: currentTheme.accentTextHex
            }}
          >
            <Check className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
