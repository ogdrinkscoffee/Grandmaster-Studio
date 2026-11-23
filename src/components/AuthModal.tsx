import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  Shield,
  X,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  UserCheck,
  Edit3,
  Check
} from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';
import { OnlinePlayerPublic } from '../engine/onlineClassic';
import {
  deleteEntireAccount,
  signInWithGoogleWithConsent,
  signOutGoogle,
  updateOnlineUsername
} from '../services/onlineChessService';
import { LegalTab } from './LegalModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  firebaseUser: User | null;
  publicProfile: OnlinePlayerPublic | null;
  cookieConsent: 'all' | 'essential';
  onOpenLegal: (tab: LegalTab) => void;
  onAccountDeleted: () => void;
  onPublicProfileUpdated: (profile: OnlinePlayerPublic) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  firebaseUser,
  publicProfile,
  cookieConsent,
  onOpenLegal,
  onAccountDeleted,
  onPublicProfileUpdated
}) => {
  const { theme } = useAppTheme();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(publicProfile?.username || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    setNameInput(publicProfile?.username || firebaseUser?.displayName || '');
  }, [publicProfile?.username, firebaseUser?.displayName]);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg(null);
      setStatusMsg(null);
      setConfirmDelete(false);
      setDeleteConfirmText('');
      setEditingName(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canSignUpWithGoogle = ageConfirmed && termsAccepted && !loading;

  const handleGoogleSignIn = async () => {
    if (!ageConfirmed || !termsAccepted) {
      setErrorMsg('Please confirm the 13+ age check and accept the Terms of Service & Privacy Policy first.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await signInWithGoogleWithConsent({
        ageConfirmed: true,
        cookieConsent,
        preferredUsername: publicProfile?.username
      });
      onPublicProfileUpdated(res.publicProfile);
      setStatusMsg('Signed in with Google! Online Classic Chess is unlocked.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In was cancelled or blocked.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!firebaseUser || !publicProfile) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const next = await updateOnlineUsername(firebaseUser.uid, nameInput);
      onPublicProfileUpdated({ ...publicProfile, username: next });
      setEditingName(false);
      setStatusMsg(`Updated public handle to ${next}.`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not update handle.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!firebaseUser) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      setErrorMsg('Type DELETE in the confirmation box to permanently delete your account.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteEntireAccount(firebaseUser);
      setConfirmDelete(false);
      setDeleteConfirmText('');
      onAccountDeleted();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not delete account right now. Please sign in again and retry.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        aria-labelledby="auth-modal-title"
        className="rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border flex flex-col gap-4 animate-modal-reveal"
        style={{
          backgroundColor: theme.cardHex,
          borderColor: theme.cardBorderHex,
          color: theme.textPrimary
        }}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.cardBorderHex }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${theme.accentHex}1f`,
                border: `1px solid ${theme.accentHex}55`,
                color: theme.accentHex
              }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-display text-lg font-extrabold tracking-tight">
                {firebaseUser ? 'Google Account & Online Identity' : 'Sign Up / Sign In with Google'}
              </h2>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Synced Classic Chess ratings &amp; live multiplayer across Website and Android APK.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
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

        {!firebaseUser ? (
          <div className="space-y-4">
            <div
              className="p-3.5 rounded-xl border text-xs space-y-1.5"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: theme.cardBorderHex,
                color: theme.textSecondary
              }}
            >
              <div className="font-bold flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
                <Shield className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
                <span>Verified Google Sign-Up · Privacy-Protected Profile</span>
              </div>
              <p>
                Your Google email is stored exclusively in an owner-only private record and is never shown to opponents or public leaderboards.
              </p>
            </div>

            {/* Mandatory Age Check at Sign-Up */}
            <label
              className="flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: ageConfirmed ? theme.accentHex : theme.cardBorderHex
              }}
            >
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={e => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer"
                style={{ accentColor: theme.accentHex }}
              />
              <span style={{ color: theme.textPrimary }}>
                <strong>Age Check:</strong> I confirm that I am at least <strong>13 years old</strong> (or meet the minimum digital consent age in my jurisdiction with verified parental consent).
              </span>
            </label>

            {/* Mandatory Terms, Privacy & Refund Acceptance */}
            <label
              className="flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer"
              style={{
                backgroundColor: theme.cardSecondaryHex,
                borderColor: termsAccepted ? theme.accentHex : theme.cardBorderHex
              }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer"
                style={{ accentColor: theme.accentHex }}
              />
              <span style={{ color: theme.textSecondary }}>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="font-bold underline cursor-pointer"
                  style={{ color: theme.accentHex }}
                >
                  Terms of Service
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="font-bold underline cursor-pointer"
                  style={{ color: theme.accentHex }}
                >
                  Privacy Policy
                </button>
                , and{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal('refund')}
                  className="font-bold underline cursor-pointer"
                  style={{ color: theme.accentHex }}
                >
                  Refund Policy
                </button>
                , and agree not to use engine assistance in online games.
              </span>
            </label>

            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {statusMsg && (
              <div
                className="p-3 rounded-xl border text-xs"
                style={{ borderColor: `${theme.accentHex}55`, backgroundColor: `${theme.accentHex}15`, color: theme.accentHex }}
              >
                {statusMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!canSignUpWithGoogle}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition disabled:opacity-45 cursor-pointer"
              style={{
                backgroundColor: theme.accentHex,
                color: theme.accentTextHex
              }}
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'Connecting Google Account…' : 'Continue with Google'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div
              className="p-4 rounded-xl border flex flex-col gap-3"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accentHex }}>
                    Verified Google Account
                  </div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: theme.textPrimary }}>
                    {firebaseUser.email || firebaseUser.displayName}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Active</span>
                </span>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: theme.cardBorderHex }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: theme.textMutedHex }}>
                  Public Chess Handle
                </div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      maxLength={32}
                      onChange={e => setNameInput(e.target.value)}
                      className="flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      style={{
                        backgroundColor: theme.cardHex,
                        border: `1px solid ${theme.cardBorderHex}`,
                        color: theme.textPrimary
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                      style={{ backgroundColor: theme.accentHex, color: theme.accentTextHex }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-sm" style={{ color: theme.textPrimary }}>
                      {publicProfile?.username || firebaseUser.displayName || 'GMPlayer'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
                      style={{ color: theme.accentHex }}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Handle
                    </button>
                  </div>
                )}
              </div>

              {publicProfile && (
                <div className="grid grid-cols-4 gap-2 pt-2 border-t text-center font-mono tabular-nums" style={{ borderColor: theme.cardBorderHex }}>
                  <div>
                    <div className="text-[10px] uppercase" style={{ color: theme.textMutedHex }}>Bullet</div>
                    <div className="font-bold">{publicProfile.bulletElo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase" style={{ color: theme.textMutedHex }}>Blitz</div>
                    <div className="font-bold">{publicProfile.blitzElo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase" style={{ color: theme.textMutedHex }}>Rapid</div>
                    <div className="font-bold" style={{ color: theme.accentHex }}>{publicProfile.rapidElo}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase" style={{ color: theme.textMutedHex }}>Classical</div>
                    <div className="font-bold">{publicProfile.classicalElo}</div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {statusMsg && (
              <div
                className="p-3 rounded-xl border text-xs"
                style={{ borderColor: `${theme.accentHex}55`, backgroundColor: `${theme.accentHex}15`, color: theme.accentHex }}
              >
                {statusMsg}
              </div>
            )}

            {/* Plan & Easy Cancel Info */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between gap-2"
              style={{ backgroundColor: theme.cardSecondaryHex, borderColor: theme.cardBorderHex }}
            >
              <div>
                <div className="font-bold" style={{ color: theme.textPrimary }}>Current Plan: Free ($0/mo)</div>
                <div className="text-[11px]" style={{ color: theme.textMutedHex }}>
                  No recurring charges or billing commitments. Cancel or delete anytime.
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOutGoogle();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg border font-bold inline-flex items-center gap-1.5 hover:opacity-85 cursor-pointer shrink-0"
                style={{
                  backgroundColor: theme.cardHex,
                  borderColor: theme.cardBorderHex,
                  color: theme.textPrimary
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            {/* Delete Account Button (Google Play Policy Mandatory) */}
            <div className="p-3.5 rounded-xl border border-rose-500/35 bg-rose-500/5 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Delete Account &amp; Cloud Data</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: theme.textMutedHex }}>
                    Permanently deletes your Google sign-in profile, private consent record, public Elo card, and waiting challenges.
                  </p>
                </div>
                {!confirmDelete && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3 py-1.5 rounded-lg border border-rose-500/50 text-rose-400 font-bold hover:bg-rose-500/15 transition shrink-0 cursor-pointer"
                  >
                    Delete Account
                  </button>
                )}
              </div>

              {confirmDelete && (
                <div className="pt-2 border-t border-rose-500/25 space-y-2">
                  <label className="block text-[11px]" style={{ color: theme.textSecondary }}>
                    Type <strong className="font-mono text-rose-400">DELETE</strong> to confirm permanent account deletion:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="flex-1 min-w-[120px] rounded-lg px-2.5 py-1.5 text-xs font-mono border border-rose-500/40 bg-black/25 text-rose-200"
                    />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDeleteAccount}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold inline-flex items-center gap-1.5 hover:bg-rose-500 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{loading ? 'Deleting…' : 'Confirm Delete Account'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDelete(false);
                        setDeleteConfirmText('');
                      }}
                      className="px-3 py-1.5 rounded-lg border font-semibold cursor-pointer"
                      style={{
                        backgroundColor: theme.cardHex,
                        borderColor: theme.cardBorderHex,
                        color: theme.textSecondary
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
