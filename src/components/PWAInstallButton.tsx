import React, { useState } from 'react';
import { Download, Share, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useAppTheme } from '../context/ThemeContext';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { theme } = useAppTheme();
  const { canInstall, hasNativePrompt, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'compact') return null;
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold"
        style={{
          backgroundColor: `${theme.accentHex}15`,
          borderColor: `${theme.accentHex}45`,
          color: theme.accentHex
        }}
      >
        <Check className="w-4 h-4 shrink-0" />
        <span>Installed as a standalone offline app</span>
      </div>
    );
  }

  if (!canInstall && variant === 'compact') return null;

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      await promptInstall();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          title="Install Grandmaster Studio for offline desktop & mobile access"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition hover:opacity-90 whitespace-nowrap"
          style={{
            backgroundColor: `${theme.accentHex}18`,
            borderColor: `${theme.accentHex}50`,
            color: theme.accentHex
          }}
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>Install App</span>
        </button>
      ) : (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border"
          style={{
            backgroundColor: theme.cardSecondaryHex,
            borderColor: theme.cardBorderHex
          }}
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold" style={{ color: theme.textPrimary }}>
              Install Offline App (PWA)
            </div>
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>
              {canInstall
                ? 'Install Grandmaster Studio to your home screen or desktop with offline Stockfish & puzzle caching.'
                : 'Available via your browser’s address-bar Install icon or Share → Add to Home Screen.'}
            </p>
          </div>
          {canInstall && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold shrink-0 transition hover:opacity-90"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}
        </div>
      )}

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Install on iOS"
        >
          <div
            className="w-full max-w-sm rounded-2xl border p-5 space-y-3 shadow-2xl"
            style={{
              backgroundColor: theme.cardHex,
              borderColor: theme.cardBorderHex,
              color: theme.textPrimary
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Share className="w-4 h-4" style={{ color: theme.accentHex }} />
                Install on iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close install instructions"
                className="p-1 rounded-lg hover:opacity-75"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="text-xs space-y-2 list-decimal list-inside" style={{ color: theme.textSecondary }}>
              <li>Tap the <strong>Share</strong> button in Safari’s toolbar.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> to launch Grandmaster Studio offline anytime.</li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};
