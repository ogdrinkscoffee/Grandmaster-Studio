import React, { useEffect, useState } from 'react';
import {
  Shield,
  FileText,
  Scale,
  X,
  Lock,
  Cpu,
  BookOpen,
  Receipt,
  PackageCheck
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'sdks' | 'copyright';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'refund', label: 'Refund Policy', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'sdks', label: 'SDKs & Keys', icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { id: 'copyright', label: 'Licenses & Copyright', icon: <Scale className="w-3.5 h-3.5" /> }
  ];

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
        aria-labelledby="legal-modal-title"
        className="rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border max-h-[88vh] flex flex-col gap-4 animate-modal-reveal"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex,
          color: theme.textPrimary
        }}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.cardBorderHex }}>
          <div>
            <h2 id="legal-modal-title" className="font-display text-lg font-extrabold tracking-tight">
              Legal, Privacy, Refunds &amp; Compliance Center
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Grandmaster Studio governance for Web and Android WebAPK, Google Play compliance, and audited SDK disclosures.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal dialog"
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

        <div
          role="tablist"
          aria-label="Legal sections"
          className="flex flex-wrap gap-1.5 p-1 rounded-xl"
          style={{ backgroundColor: theme.cardSecondaryHex, border: `1px solid ${theme.cardBorderHex}` }}
        >
          {tabs.map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer"
                style={
                  active
                    ? { backgroundColor: theme.accentHex, color: theme.accentTextHex }
                    : { color: theme.textSecondary }
                }
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto pr-1 text-xs leading-relaxed flex flex-col gap-3" style={{ color: theme.textSecondary }}>
          {activeTab === 'privacy' && (
            <>
              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.accentHex }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                    1. Strict PII Isolation &amp; Local-First Storage
                  </div>
                  <p className="mt-1">
                    When playing offline, your games, settings, puzzles, and custom variants remain solely in browser storage. When signing in with Google for Online Classic Chess, your email address and age/legal consent timestamps are stored in an owner-only private collection (<code className="font-mono">usersPrivate</code>) never accessible to other players.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  2. Data Collected for Online Classic Chess
                </h3>
                <p>
                  Public opponent cards display only your chosen chess handle, title, avatar piece, and Online Classic Elo ratings. Moves, timestamps, and sportsmanship match chat in live rooms are processed solely to run games and calculate ratings. We do not sell personal data or run ad-network tracking cookies.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  3. Cookie &amp; Consent Choices
                </h3>
                <p>
                  You can switch between &ldquo;Accept All&rdquo; and &ldquo;Essential Only&rdquo; at any time from the footer&apos;s Cookie Preferences control. Strictly essential storage preserves your board state, offline cache, and signed-in session.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  4. Account Deletion &amp; Data Erasure Rights
                </h3>
                <p>
                  Signed-in users can permanently delete their account and associated Firestore profile data at any time via the <strong>Delete Account</strong> button inside the Google Account modal or Studio Settings → Profile, App &amp; Sync. Local data can also be wiped cleanly via <strong>Reset Local Studio Data</strong>.
                </p>
              </div>
            </>
          )}

          {activeTab === 'terms' && (
            <>
              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  1. Acceptance &amp; Age Eligibility (13+)
                </h3>
                <p>
                  By using Grandmaster Studio (web app or installable Android WebAPK), you confirm you are at least 13 years old (or meet the minimum digital consent age in your country with verified parental/guardian permission) and accept these Terms of Service.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  2. Fair Play Policy (Online Classic Chess)
                </h3>
                <p>
                  Online multiplayer is strictly limited to Classic Chess. While playing live online games against human opponents, external chess engines (including Stockfish), tablebases, or move assistance are strictly prohibited. Engine analysis tools are disabled on active online match boards and reserved exclusively for offline sparring and post-game review.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  3. Online Conduct &amp; Honest Representations
                </h3>
                <p>
                  Users must engage respectfully in match chat without harassment, hate speech, spam, or impersonation. Grandmaster Studio does not publish fabricated reviews, paid testimonials, or AI bots disguised as human online players; all offline opponents are transparently marked as AI Bots.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  4. Service Availability &amp; Disclaimer
                </h3>
                <p>
                  Grandmaster Studio is provided &ldquo;as is&rdquo; without warranty of uninterrupted network uptime. Match clocks rely on synchronized server timestamps and client latency compensation.
                </p>
              </div>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <div className="p-3.5 rounded-xl border" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                  Current Pricing Status: 100% Free Forever ($0.00)
                </div>
                <p className="mt-1">
                  Grandmaster Studio currently requires no credit card, paid subscription, or in-app purchases on Web or Android. You cannot be billed unexpectedly, and every core feature (Stockfish 19 offline analysis, 36 variants, puzzles, and Online Classic Chess) is available at zero cost.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  1. Easy Cancellation &amp; Zero Dark Patterns
                </h3>
                <p>
                  You can cancel any live matchmaking seek with one click (&ldquo;Cancel Search&rdquo;), sign out of Google authentication immediately, or permanently delete your account via the <strong>Delete Account</strong> button without contacting support or navigating hidden menus.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs mb-1" style={{ color: theme.textPrimary }}>
                  2. Future Paid Tiers &amp; Google Play Billing Refund Policy
                </h3>
                <p>
                  If optional premium features or Google Play Billing subscriptions are ever introduced in future versions:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Subscriptions may be canceled at any time in Google Play → Payments &amp; Subscriptions or directly inside Studio Settings with immediate effect at the end of the billing period.</li>
                  <li>Refunds on Google Play purchases within 48 hours can be requested directly through Google Play&apos;s automated refund portal, and all mandatory consumer statutory refund rights (EU/UK 14-day withdrawal where applicable, US/global billing error protections) are fully honored.</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'sdks' && (
            <>
              <div className="p-3.5 rounded-xl border" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                  Third-Party SDK &amp; API Key Security Audit
                </div>
                <p className="mt-1">
                  Grandmaster Studio embeds <strong>zero advertising SDKs</strong>, <strong>zero third-party behavioral analytics/telemetry brokers</strong>, and keeps all private server credentials (such as <code className="font-mono">GEMINI_API_KEY</code>) strictly inside server environment variables—never bundled into client JavaScript or Android packages.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: theme.cardBorderHex, color: theme.textPrimary }}>
                      <th className="py-2 pr-3 font-bold">SDK / Dependency</th>
                      <th className="py-2 pr-3 font-bold">Purpose</th>
                      <th className="py-2 font-bold">Data Sharing Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: `${theme.cardBorderHex}66` }}>
                    <tr>
                      <td className="py-2 pr-3 font-mono font-semibold" style={{ color: theme.textPrimary }}>Firebase Auth &amp; Firestore</td>
                      <td className="py-2 pr-3">Google Sign-In &amp; real-time Online Classic rooms</td>
                      <td className="py-2">Auth UID, isolated email, match states &amp; ratings</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-mono font-semibold" style={{ color: theme.textPrimary }}>Stockfish 19 WASM</td>
                      <td className="py-2 pr-3">100% local chess analysis &amp; offline AI</td>
                      <td className="py-2">On-device only (zero network calls)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-mono font-semibold" style={{ color: theme.textPrimary }}>chess.js</td>
                      <td className="py-2 pr-3">Local move legality &amp; PGN parsing</td>
                      <td className="py-2">On-device only (zero network calls)</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-mono font-semibold" style={{ color: theme.textPrimary }}>Google Gemini API (Proxy)</td>
                      <td className="py-2 pr-3">Optional on-demand Coach Mikhail explanations</td>
                      <td className="py-2">Server-side proxy only; no API keys on client</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3 font-mono font-semibold" style={{ color: theme.textPrimary }}>Google Fonts</td>
                      <td className="py-2 pr-3">UI &amp; monospace typography</td>
                      <td className="py-2">Standard CSS font delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'copyright' && (
            <>
              <div className="p-3.5 rounded-xl border" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                  © 2026 Grandmaster Studio. All rights reserved.
                </div>
                <p className="mt-1">
                  All original interface designs, board frames, typography pairings, adaptive puzzle progressions, Chaturanga and custom fairy variant mechanics, and studio graphics are protected under copyright law.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <Cpu className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.accentHex }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                    Stockfish Engine Notice (GNU GPL v3)
                  </div>
                  <p className="mt-1">
                    Includes Stockfish 19 WebAssembly compiled engine binaries distributed under the GNU General Public License v3. The full license text is bundled in the application distribution (<code className="font-mono">/stockfish/COPYING.txt</code>).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border flex items-start gap-2.5" style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}>
                <BookOpen className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.accentHex }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: theme.textPrimary }}>
                    Open-Source Libraries &amp; Attribution
                  </div>
                  <p className="mt-1">
                    Move validation leverages <code className="font-mono">chess.js</code> (BSD-2-Clause License). Curated opening classifications follow standard Encyclopedia of Chess Openings (ECO) nomenclature. &ldquo;Chess.com&rdquo; and &ldquo;Lichess&rdquo; are trademarks of their respective owners referenced solely for layout familiarity.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: theme.cardBorderHex, color: theme.textMutedHex }}>
          <span>© 2026 Grandmaster Studio · All rights reserved</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-bold text-xs transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
