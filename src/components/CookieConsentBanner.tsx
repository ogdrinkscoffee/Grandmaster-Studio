import React, { useState } from 'react';
import { Cookie, ShieldCheck, Sliders, Check, X } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { LegalTab } from './LegalModal';

export const COOKIE_CONSENT_STORAGE_KEY = 'gm_cookie_consent_v1';

export interface CookieConsentRecord {
  choice: 'all' | 'essential';
  functionalStorage: boolean;
  onlineFeatures: boolean;
  updatedAt: string;
}

export function loadCookieConsent(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed && (parsed.choice === 'all' || parsed.choice === 'essential')) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(record: CookieConsentRecord): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // ignore storage errors
  }
}

interface CookieConsentBannerProps {
  isOpen: boolean;
  currentConsent: CookieConsentRecord | null;
  onSelectConsent: (choice: 'all' | 'essential') => void;
  onOpenLegal: (tab: LegalTab) => void;
  onClose?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  isOpen,
  currentConsent,
  onSelectConsent,
  onOpenLegal,
  onClose
}) => {
  const { theme } = useAppTheme();
  const [showCustomize, setShowCustomize] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and storage consent"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-40 sm:max-w-lg rounded-2xl border p-4 shadow-2xl backdrop-blur-md"
      style={{
        backgroundColor: theme.cardHex,
        borderColor: theme.cardBorderHex,
        color: theme.textPrimary
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cookie className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
          <h3 className="font-display text-sm font-bold" style={{ color: theme.textPrimary }}>
            Cookie &amp; Storage Preferences
          </h3>
        </div>
        {onClose && currentConsent && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cookie preferences"
            className="p-1 rounded-lg hover:opacity-75 cursor-pointer"
            style={{ color: theme.textMutedHex }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.textSecondary }}>
        Grandmaster Studio uses strictly necessary local storage and session cookies for offline boards, clocks, Google Sign-In sessions, and live Classic Chess multiplayer. We do not run advertising trackers or sell data.{' '}
        <button
          type="button"
          onClick={() => onOpenLegal('privacy')}
          className="font-semibold underline cursor-pointer"
          style={{ color: theme.accentHex }}
        >
          Privacy Policy
        </button>
        {' · '}
        <button
          type="button"
          onClick={() => onOpenLegal('sdks')}
          className="font-semibold underline cursor-pointer"
          style={{ color: theme.accentHex }}
        >
          SDK Audit
        </button>
      </p>

      {showCustomize && (
        <div
          className="mt-3 p-3 rounded-xl border text-[11px] space-y-2"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex,
            color: theme.textSecondary
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-bold" style={{ color: theme.textPrimary }}>
                Essential Storage &amp; Auth Session
              </div>
              <div style={{ color: theme.textMutedHex }}>
                Required for board preferences, offline cache, and Firebase authentication state.
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: theme.accentHex }}>
              Always Active
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
            <div>
              <div className="font-bold" style={{ color: theme.textPrimary }}>
                Optional Cloud Preferences &amp; Google Fonts
              </div>
              <div style={{ color: theme.textMutedHex }}>
                Remembers cross-device theme and typographic assets when online.
              </div>
            </div>
            <span className="font-mono text-[10px]" style={{ color: theme.textMutedHex }}>
              Optional
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectConsent('all')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: theme.accentHex,
            color: theme.accentTextHex
          }}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectConsent('essential')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition hover:opacity-85 cursor-pointer"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex,
            color: theme.textPrimary
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
          <span>Essential Only</span>
        </button>

        <button
          type="button"
          onClick={() => setShowCustomize(v => !v)}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
          style={{ color: theme.textMutedHex }}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showCustomize ? 'Hide Details' : 'Customize'}</span>
        </button>
      </div>
    </div>
  );
};
