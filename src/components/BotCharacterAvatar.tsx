import React from 'react';

interface BotCharacterAvatarProps {
  botId: string;
  elo?: number;
  size?: number;
  isLocal2P?: boolean;
}

/**
 * Distinct SVG vector character portraits for every AI opponent tier & style,
 * plus Custom Elo, Adaptive Coach, and Pass & Play crests.
 */
export const BotCharacterAvatar: React.FC<BotCharacterAvatarProps> = ({
  botId,
  elo = 1250,
  size = 40,
  isLocal2P = false
}) => {
  if (isLocal2P) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="10" fill="#0f172a" />
        <rect x="1.5" y="1.5" width="45" height="45" rx="8.5" stroke="#10b981" strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="17" cy="18" r="5.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.4" />
        <path d="M8.5 36C8.5 30.8 12.2 27 17 27C21.8 27 25.5 30.8 25.5 36H8.5Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.4" />
        <circle cx="31" cy="18" r="5.5" fill="#334155" stroke="#94a3b8" strokeWidth="1.4" />
        <path d="M22.5 36C22.5 30.8 26.2 27 31 27C35.8 27 39.5 30.8 39.5 36H22.5Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.4" />
      </svg>
    );
  }

  switch (botId) {
    case 'bot_adaptive_coach':
      // Coach Mikhail Adaptive - Grandmaster with emerald-gold mentor ring & glasses
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#052e2b" />
          <rect x="1.5" y="1.5" width="45" height="45" rx="8.5" stroke="#10b981" strokeOpacity="0.65" strokeWidth="1.5" />
          <path d="M9 42C9 33.5 15.5 28.5 24 28.5C32.5 28.5 39 33.5 39 42H9Z" fill="#0f766e" />
          <path d="M20 29L24 37L28 29H20Z" fill="#f8fafc" />
          <path d="M22.5 29.5L24 38L25.5 29.5H22.5Z" fill="#10b981" />
          <circle cx="24" cy="21.5" r="8.2" fill="#fed7aa" />
          {/* Silver-swept scholar hair */}
          <path d="M15.5 20C15.5 12.5 19.5 9.5 24 9.5C28.5 9.5 32.5 12.5 32.5 20C29 15.5 19 15.5 15.5 20Z" fill="#cbd5e1" />
          {/* Mentor glasses */}
          <rect x="17.5" y="19.5" width="5.5" height="4.2" rx="1.4" stroke="#0f172a" strokeWidth="1.4" fill="#ecfdf5" fillOpacity="0.4" />
          <rect x="25" y="19.5" width="5.5" height="4.2" rx="1.4" stroke="#0f172a" strokeWidth="1.4" fill="#ecfdf5" fillOpacity="0.4" />
          <line x1="23" y1="21.4" x2="25" y2="21.4" stroke="#0f172a" strokeWidth="1.3" />
          <path d="M21 25.8C22.5 27.2 25.5 27.2 27 25.8" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
          {/* Adaptive pulse emblem */}
          <circle cx="38" cy="10" r="4" fill="#10b981" />
          <path d="M36.5 10.2L37.8 11.4L39.8 8.8" stroke="#052e2b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'bot_milo':
      // Milo (250) - Cheerful Beginner in Green Cap
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#064e3b" />
          <path d="M10 42C10 34 16 29 24 29C32 29 38 34 38 42H10Z" fill="#10b981" />
          <circle cx="24" cy="22" r="9" fill="#fde68a" />
          <path d="M14 20C14 13.5 18.5 9.5 24 9.5C29.5 9.5 34 13.5 34 20H14Z" fill="#34d399" />
          <path d="M22 18H38C38 20 35 21 30 21H22V18Z" fill="#059669" />
          <circle cx="20.5" cy="23" r="1.4" fill="#1e293b" />
          <circle cx="27.5" cy="23" r="1.4" fill="#1e293b" />
          <path d="M21 26.5C22.5 28 25.5 28 27 26.5" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'bot_sunny':
      // Sunny (400 Chaotic) - Wild Sprinter with Orange Headband & Shades
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#431407" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#ea580c" />
          {/* Spiky hair */}
          <path d="M14 19L16 11L21 14L24 8L27 14L32 11L34 19H14Z" fill="#fb923c" />
          <circle cx="24" cy="22.5" r="8.5" fill="#fed7aa" />
          {/* Bandana */}
          <rect x="15.5" y="16" width="17" height="3.2" rx="1.5" fill="#facc15" />
          {/* Sporty shades */}
          <rect x="17" y="20" width="6" height="3.6" rx="1" fill="#0f172a" />
          <rect x="25" y="20" width="6" height="3.6" rx="1" fill="#0f172a" />
          <line x1="23" y1="21.5" x2="25" y2="21.5" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M20.5 26.5C22.5 28.5 25.5 28.5 27.5 26.5" stroke="#7c2d12" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'bot_bram':
      // Bram (400 Defensive) - Cautious Builder with Beanie & Beard
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#172554" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#2563eb" />
          <circle cx="24" cy="22.5" r="8.5" fill="#fde68a" />
          {/* Cozy knit beanie */}
          <path d="M14.5 19C14.5 12.5 18.8 9 24 9C29.2 9 33.5 12.5 33.5 19H14.5Z" fill="#60a5fa" />
          <rect x="14" y="17.5" width="20" height="3.5" rx="1.7" fill="#3b82f6" />
          {/* Gentle beard */}
          <path d="M16.5 24.5C16.5 29 19.5 31.5 24 31.5C28.5 31.5 31.5 29 31.5 24.5C29 26 27 26.5 24 26.5C21 26.5 19 26 16.5 24.5Z" fill="#78350f" />
          <circle cx="20.8" cy="22.3" r="1.3" fill="#0f172a" />
          <circle cx="27.2" cy="22.3" r="1.3" fill="#0f172a" />
        </svg>
      );

    case 'bot_pip':
      // Pip (550) - Café Tactician with Beret & Glasses
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#0c4a6e" />
          <path d="M10 42C10 34 16 29 24 29C32 29 38 34 38 42H10Z" fill="#0284c7" />
          <circle cx="24" cy="23" r="8.8" fill="#fed7aa" />
          <ellipse cx="23" cy="14.5" rx="12" ry="5" transform="rotate(-10 23 14.5)" fill="#38bdf8" />
          <rect x="22" y="9" width="2.5" height="3" rx="1" fill="#e0f2fe" />
          <circle cx="20" cy="23" r="3" stroke="#0f172a" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
          <circle cx="28" cy="23" r="3" stroke="#0f172a" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
          <line x1="23" y1="23" x2="25" y2="23" stroke="#0f172a" strokeWidth="1.5" />
          <path d="M21.5 27.5H26.5" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_aria':
      // Aria (850) - Scholastic Ace with Star Hairpin
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#451a03" />
          <path d="M10 42C10 34 16 29 24 29C32 29 38 34 38 42H10Z" fill="#d97706" />
          <path d="M13 24C13 13 18 9 24 9C30 9 35 13 35 24V31H13V24Z" fill="#78350f" />
          <circle cx="24" cy="22.5" r="8.2" fill="#fde68a" />
          <path d="M16 19C18 14 23 13 28 15C30 16 32 18 32 20C28 17 20 17 16 19Z" fill="#78350f" />
          <circle cx="21" cy="23" r="1.3" fill="#1e293b" />
          <circle cx="27" cy="23" r="1.3" fill="#1e293b" />
          <path d="M22 26.5C23.5 27.5 25 27.5 26 26.5" stroke="#92400e" strokeWidth="1.4" strokeLinecap="round" />
          <polygon points="31,13 32.2,15.5 35,15.8 33,17.6 33.5,20.2 31,18.9 28.5,20.2 29,17.6 27,15.8 29.8,15.5" fill="#fbbf24" />
        </svg>
      );

    case 'bot_felix':
      // Felix (850 Aggressive) - Gambit Spark with Flame Pompadour
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#450a0a" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#dc2626" />
          <path d="M18 29L24 36L30 29H18Z" fill="#f97316" />
          <circle cx="24" cy="22.5" r="8.3" fill="#fed7aa" />
          {/* Flame hair swoop */}
          <path d="M14 20C14 12 20 7.5 28 9C32 10 34 14 33 19C28 14 19 14 14 20Z" fill="#f97316" />
          <line x1="18.5" y1="20" x2="22" y2="21.2" stroke="#450a0a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="29.5" y1="20" x2="26" y2="21.2" stroke="#450a0a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20.5" cy="22.8" r="1.2" fill="#0f172a" />
          <circle cx="27.5" cy="22.8" r="1.2" fill="#0f172a" />
          <path d="M21 26.5C23 25.5 25 25.5 27 26.5" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_claire':
      // Claire (1050 Defensive) - Quiet Wall with Bob Cut & Turtleneck
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#1e293b" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#475569" />
          <rect x="19" y="27" width="10" height="5" rx="2" fill="#64748b" />
          <path d="M13 24C13 13 18 9 24 9C30 9 35 13 35 24V29H13V24Z" fill="#334155" />
          <circle cx="24" cy="21.5" r="8" fill="#fef3c7" />
          <path d="M16 19C19 15 29 15 32 19C29 17 19 17 16 19Z" fill="#334155" />
          <circle cx="21" cy="21.8" r="1.2" fill="#0f172a" />
          <circle cx="27" cy="21.8" r="1.2" fill="#0f172a" />
          <path d="M21.5 25.5H26.5" stroke="#78350f" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'bot_viktor':
      // Viktor (1250 Positional) - Club Maestro with Crimson Scarf
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#4c0519" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#334155" />
          <path d="M17 29L24 35L31 29L28 38H20L17 29Z" fill="#e11d48" />
          <circle cx="24" cy="21" r="8.5" fill="#fed7aa" />
          <path d="M15 20C15 12 20 9 26 10C31 11 33 14 33 19C29 15 19 15 15 20Z" fill="#1e293b" />
          <line x1="19" y1="19.5" x2="22" y2="20.5" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="29" y1="19.5" x2="26" y2="20.5" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20.5" cy="22" r="1.2" fill="#0f172a" />
          <circle cx="27.5" cy="22" r="1.2" fill="#0f172a" />
          <path d="M21 26H27" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_rocco':
      // Rocco (1250 Aggressive) - Kingside Brawler with Fighter Band
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#3f0d12" />
          <path d="M8 42C8 33 15 28 24 28C33 28 40 33 40 42H8Z" fill="#7f1d1d" />
          <circle cx="24" cy="21.5" r="8.8" fill="#fdba74" />
          <path d="M15.2 18.5C15.2 12 19 9 24 9C29 9 32.8 12 32.8 18.5H15.2Z" fill="#18181b" />
          {/* Crimson fighter headband */}
          <rect x="14.8" y="16" width="18.4" height="3.2" rx="1.2" fill="#ef4444" />
          <line x1="18.5" y1="20.5" x2="22" y2="21.5" stroke="#18181b" strokeWidth="1.7" strokeLinecap="round" />
          <line x1="29.5" y1="20.5" x2="26" y2="21.5" stroke="#18181b" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="20.5" cy="22.8" r="1.2" fill="#0f172a" />
          <circle cx="27.5" cy="22.8" r="1.2" fill="#0f172a" />
          {/* Goatee */}
          <path d="M21 26.5H27L25.5 29.5H22.5L21 26.5Z" fill="#27272a" />
        </svg>
      );

    case 'bot_lyra':
      // Lyra (1250 Tactical) - Trap Weaver with Violet Cloak & Crescent
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#2e1065" />
          <path d="M9 42C9 33 15.5 28.5 24 28.5C32.5 28.5 39 33 39 42H9Z" fill="#7e22ce" />
          <path d="M13 25C13 13 18 9 24 9C30 9 35 13 35 25V31H13V25Z" fill="#1e1b4b" />
          <circle cx="24" cy="22" r="8" fill="#fde68a" />
          <path d="M16 18C20 15 28 15 32 18" stroke="#c084fc" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="14" r="2" fill="#e9d5ff" />
          <circle cx="21" cy="22.5" r="1.3" fill="#3b0764" />
          <circle cx="27" cy="22.5" r="1.3" fill="#3b0764" />
          <path d="M21.5 26C23 27 25 26.8 26.5 25.5" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_nadia':
      // Nadia (1600 Positional) - Quiet Strategist with Teal Headband
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#134e4a" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#0f766e" />
          <path d="M14 23C14 13 18 9 24 9C30 9 34 13 34 23V32H14V23Z" fill="#0f172a" />
          <circle cx="24" cy="22" r="8" fill="#fde68a" />
          <path d="M16 17C19 14.5 29 14.5 32 17" stroke="#2dd4bf" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="21" cy="22" r="1.2" fill="#0f172a" />
          <circle cx="27" cy="22" r="1.2" fill="#0f172a" />
          <path d="M21.5 26C23 27 25 27 26.5 26" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_dante':
      // Dante (1600 Chaotic) - Tal Disciple with Wild Crimson Hair & Eyepatch
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#500724" />
          <path d="M9 42C9 33 15.5 28.5 24 28.5C32.5 28.5 39 33 39 42H9Z" fill="#9d174d" />
          <circle cx="24" cy="22" r="8.3" fill="#fed7aa" />
          <path d="M14 19C14 11 19 8 25 8C31 8 34 13 34 19C29 14 18 15 14 19Z" fill="#ec4899" />
          {/* Eyepatch */}
          <line x1="16" y1="18" x2="31" y2="23" stroke="#1e293b" strokeWidth="1.4" />
          <rect x="25" y="19.5" width="5.2" height="4" rx="1.6" fill="#0f172a" />
          <circle cx="20.5" cy="22" r="1.4" fill="#0f172a" />
          <path d="M21 26.5C23 27.5 25.5 26.5 27 25.2" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'bot_hugo':
      // Hugo (1600 Endgame) - Endgame Grinder with Gold Monocle & Mustache
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#422006" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#713f12" />
          <path d="M21 29L24 35L27 29H21Z" fill="#facc15" />
          <circle cx="24" cy="21.5" r="8.4" fill="#fef3c7" />
          <path d="M15.5 18.5C15.5 11.5 19.5 9 24 9C28.5 9 32.5 11.5 32.5 18.5C28 15 20 15 15.5 18.5Z" fill="#94a3b8" />
          {/* Gold Monocle */}
          <circle cx="27.5" cy="21.5" r="3" stroke="#eab308" strokeWidth="1.5" fill="#fef08a" fillOpacity="0.25" />
          <circle cx="20.5" cy="21.5" r="1.3" fill="#1e293b" />
          <circle cx="27.5" cy="21.5" r="1.3" fill="#1e293b" />
          {/* Mustache */}
          <path d="M19.5 25.5C21.5 24 23 24.5 24 25.5C25 24.5 26.5 24 28.5 25.5" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'bot_kael':
      // Kael (1950 Aggressive) - Gambit Knight with Indigo Mantle & Hood
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#1e1b4b" />
          <path d="M8 42C8 33 15 28 24 28C33 28 40 33 40 42H8Z" fill="#4338ca" />
          <path d="M12 29C12 14 17 8 24 8C31 8 36 14 36 29L31 32H17L12 29Z" fill="#312e81" stroke="#818cf8" strokeWidth="1.2" />
          <circle cx="24" cy="22" r="7.5" fill="#e2e8f0" />
          <path d="M18 19L23 21.5L18 22.5Z" fill="#1e1b4b" />
          <path d="M30 19L25 21.5L30 22.5Z" fill="#1e1b4b" />
          <circle cx="21" cy="22" r="1.2" fill="#6366f1" />
          <circle cx="27" cy="22" r="1.2" fill="#6366f1" />
          <path d="M22 26.5H26" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_selene':
      // Selene (1950 Defensive) - Iron Fortress with Silver Helm Crest
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#0f172a" />
          <path d="M8 42C8 33 15 28 24 28C33 28 40 33 40 42H8Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.2" />
          <path d="M14 23C14 13 18 8.5 24 8.5C30 8.5 34 13 34 23V30H14V23Z" fill="#475569" />
          <circle cx="24" cy="21.5" r="7.5" fill="#f1f5f9" />
          {/* Silver crown band */}
          <path d="M15.5 16.5L24 12L32.5 16.5L24 15L15.5 16.5Z" fill="#cbd5e1" />
          <circle cx="21.2" cy="21.8" r="1.2" fill="#0f172a" />
          <circle cx="26.8" cy="21.8" r="1.2" fill="#0f172a" />
          <path d="M21.5 25.8H26.5" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_arthur':
      // Arthur (2150 Endgame) - Classical Technician with Bowtie & Spectacles
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#082f49" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#0369a1" />
          {/* Bowtie */}
          <polygon points="20,30 24,32 20,34" fill="#38bdf8" />
          <polygon points="28,30 24,32 28,34" fill="#38bdf8" />
          <circle cx="24" cy="32" r="1.2" fill="#e0f2fe" />
          <circle cx="24" cy="21.5" r="8.2" fill="#fed7aa" />
          <path d="M15.5 19C16 12 20 9.5 25 9.5C29.5 9.5 32.5 13 32.5 19C28 15 20 15 15.5 19Z" fill="#0f172a" />
          <rect x="17.5" y="19.5" width="5.2" height="3.8" rx="1" stroke="#0f172a" strokeWidth="1.3" />
          <rect x="25.3" y="19.5" width="5.2" height="3.8" rx="1" stroke="#0f172a" strokeWidth="1.3" />
          <line x1="22.7" y1="21.2" x2="25.3" y2="21.2" stroke="#0f172a" strokeWidth="1.3" />
          <path d="M21.5 26H26.5" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_magnus':
      // Magnus (2350 Positional) - Grandmaster Sovereign with Golden Crown
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#1f1606" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#1e293b" />
          <path d="M22 29L24 39L26 29H22Z" fill="#eab308" />
          <circle cx="24" cy="22" r="8.2" fill="#fed7aa" />
          <path d="M15 16L17.5 10L21.5 13.5L24 8.5L26.5 13.5L30.5 10L33 16H15Z" fill="#facc15" stroke="#a16207" strokeWidth="1" />
          <circle cx="21" cy="22" r="1.3" fill="#0f172a" />
          <circle cx="27" cy="22" r="1.3" fill="#0f172a" />
          <path d="M21 26.5C22.5 27.3 25.5 27.3 27 26.5" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_tessa':
      // Tessa (2350 Tactical) - Tactical Tempest with Crimson Tiara
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#4c0519" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#be123c" />
          <path d="M13 24C13 13 18 9 24 9C30 9 35 13 35 24V31H13V24Z" fill="#18181b" />
          <circle cx="24" cy="22" r="8" fill="#fef3c7" />
          <path d="M15.5 16.5L19 11.5L24 14L29 11.5L32.5 16.5H15.5Z" fill="#fb7185" />
          <circle cx="21" cy="22" r="1.3" fill="#881337" />
          <circle cx="27" cy="22" r="1.3" fill="#881337" />
          <path d="M21 26.2C23 25.5 25 25.5 27 26.2" stroke="#9f1239" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_evelyn':
      // Evelyn (2750 Endgame) - Endgame Empress with Royal Violet Diadem
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#2e1065" />
          <path d="M9 42C9 34 15.5 29 24 29C32.5 29 39 34 39 42H9Z" fill="#6b21a8" />
          <path d="M13 24C13 13 18 9 24 9C30 9 35 13 35 24V31H13V24Z" fill="#1e1b4b" />
          <circle cx="24" cy="22" r="8" fill="#fef3c7" />
          <path d="M16 16.5L20 12.5L24 10L28 12.5L32 16.5L24 15L16 16.5Z" fill="#e879f9" />
          <circle cx="24" cy="12.8" r="1.5" fill="#fdf4ff" />
          <circle cx="21" cy="22" r="1.2" fill="#1e1b4b" />
          <circle cx="27" cy="22" r="1.2" fill="#1e1b4b" />
          <path d="M21.5 26H26.5" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'bot_aegis':
      // Aegis (3600) - Apex Neural Core Visor Construct
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#082f49" />
          <path d="M10 42C10 34 16 29 24 29C32 29 38 34 38 42H10Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.2" />
          <path d="M15 17C15 11.5 19 8.5 24 8.5C29 8.5 33 11.5 33 17V24C33 28.5 29 31.5 24 31.5C19 31.5 15 28.5 15 24V17Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.4" />
          <rect x="17" y="18" width="14" height="4.5" rx="2.2" fill="#22d3ee" />
          <rect x="19" y="19.3" width="4" height="1.8" rx="0.9" fill="#ecfeff" />
          <rect x="25" y="19.3" width="4" height="1.8" rx="0.9" fill="#ecfeff" />
          <polygon points="24,6 27,10 24,12 21,10" fill="#22d3ee" />
        </svg>
      );

    default:
      // Custom Elo (100 - 3600) - Adaptive Chronometer Dial Crest
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect width="48" height="48" rx="10" fill="#1e293b" />
          <circle cx="24" cy="24" r="14" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="24" cy="24" r="9.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <text
            x="24"
            y="27"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="8.5"
            fontWeight="700"
            fontFamily="monospace"
          >
            {elo}
          </text>
        </svg>
      );
  }
};
