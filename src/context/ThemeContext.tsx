import React, { createContext, useContext, useLayoutEffect, useMemo } from 'react';
import { AppThemeConfig, BoardThemeConfig, getAppTheme, resolveBoardTheme } from '../theme/themes';
import {
  BoardThemeId,
  CustomBoardRecipe,
  KingFinialStyle,
  PieceSetId,
  UserSettings
} from '../types/chess';

interface ThemeContextType {
  theme: AppThemeConfig;
  boardTheme: BoardThemeConfig;
  pieceSet: PieceSetId;
  kingFinial: KingFinialStyle;
  settings: UserSettings;
}

export interface PieceDisplayContextType {
  pieceSet: PieceSetId;
  kingFinial: KingFinialStyle;
  batterySaver: boolean;
}

export interface BoardRuntimeContextType {
  boardTheme: BoardThemeConfig;
  boardThemeId: BoardThemeId;
  matchBoardToPieces: boolean;
  customBoards: CustomBoardRecipe[];
  pieceSet: PieceSetId;
  kingFinial: KingFinialStyle;
  boardSize: number;
  showCoordinates: 'inside' | 'outside' | 'hidden';
  highlightLegalMoves: boolean;
  moveInputMethod: UserSettings['moveInputMethod'];
  autoQueen: boolean;
  batterySaver: boolean;
  keyboardControl: boolean;
}

const defaultSettings: UserSettings = {
  appTheme: 'emerald_studio',
  colorMode: 'dark',
  boardTheme: 'emerald',
  matchBoardToPieces: true,
  customBoards: [],
  pieceSet: 'neo',
  kingFinial: 'crescent',
  soundEnabled: true,
  soundVolume: 0.6,
  hapticsEnabled: true,
  batterySaver: false,
  evalBarPosition: 'left',
  boardSize: 100,
  showLiveEval: true,
  showCoordinates: 'inside',
  showBestMoveArrow: true,
  autoQueen: true,
  moveInputMethod: 'both',
  keyboardControl: false,
  notationInput: false,
  autoFlipLocal2P: false,
  premoveMode: 'infinite',
  aiThinkingMode: 'human',
  highlightLegalMoves: true,
  engineMaxDepth: 16,
  syncVaultId: 'gm-vault-8812',
  e2eeEnabled: true,
};

const defaultTheme = getAppTheme('emerald_studio', 'dark');
const defaultBoardTheme = resolveBoardTheme(defaultSettings);

const defaultContext: ThemeContextType = {
  theme: defaultTheme,
  boardTheme: defaultBoardTheme,
  pieceSet: 'neo',
  kingFinial: 'crescent',
  settings: defaultSettings
};

const defaultPieceDisplayContext: PieceDisplayContextType = {
  pieceSet: 'neo',
  kingFinial: 'crescent',
  batterySaver: false
};

const defaultBoardRuntimeContext: BoardRuntimeContextType = {
  boardTheme: defaultBoardTheme,
  boardThemeId: defaultSettings.boardTheme,
  matchBoardToPieces: true,
  customBoards: [],
  pieceSet: 'neo',
  kingFinial: 'crescent',
  boardSize: 100,
  showCoordinates: 'inside',
  highlightLegalMoves: true,
  moveInputMethod: 'both',
  autoQueen: true,
  batterySaver: false,
  keyboardControl: false
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);
export const PieceDisplayContext = createContext<PieceDisplayContextType>(defaultPieceDisplayContext);
export const BoardRuntimeContext = createContext<BoardRuntimeContextType>(defaultBoardRuntimeContext);

export const useAppTheme = () => useContext(ThemeContext);
export const usePieceDisplay = () => useContext(PieceDisplayContext);
export const useBoardRuntime = () => useContext(BoardRuntimeContext);

export const ThemeProvider: React.FC<{
  settings: UserSettings;
  children: React.ReactNode;
}> = ({ settings, children }) => {
  const appThemeId = settings.appTheme || 'emerald_studio';
  const colorMode = settings.colorMode || 'dark';
  const boardThemeId = settings.boardTheme || 'emerald';
  const matchBoardToPieces = settings.matchBoardToPieces !== false;
  const customBoards = settings.customBoards || [];
  const pieceSet: PieceSetId = settings.pieceSet || 'neo';
  const kingFinial: KingFinialStyle = settings.kingFinial || 'crescent';
  const batterySaver = Boolean(settings.batterySaver);
  const boardSize = settings.boardSize ?? 100;
  const showCoordinates = settings.showCoordinates || 'inside';
  const highlightLegalMoves = settings.highlightLegalMoves !== false;
  const moveInputMethod = settings.moveInputMethod || 'both';
  const autoQueen = settings.autoQueen !== false;
  const keyboardControl = Boolean(settings.keyboardControl);

  const theme = useMemo(
    () => getAppTheme(appThemeId, colorMode),
    [appThemeId, colorMode]
  );

  const boardTheme = useMemo(
    () =>
      resolveBoardTheme({
        boardTheme: boardThemeId,
        matchBoardToPieces,
        pieceSet,
        customBoards
      }),
    [boardThemeId, matchBoardToPieces, pieceSet, customBoards]
  );

  // Sync root classes, theme attributes, and CSS custom properties before paint
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.dataset.colorMode = theme.mode;
    root.classList.toggle('dark', theme.mode === 'dark');
    root.classList.toggle('light', theme.mode === 'light');
    root.style.colorScheme = theme.mode;

    root.style.setProperty('--bg-color', theme.bgHex);
    root.style.setProperty('--gm-bg', theme.bgHex);
    root.style.setProperty('--bg-gradient', theme.bgGradient);
    root.style.setProperty('--gm-bg-gradient', theme.bgGradient);
    root.style.setProperty('--gm-header', theme.headerHex);
    root.style.setProperty('--gm-card', theme.cardHex);
    root.style.setProperty('--gm-card-2', theme.cardSecondaryHex);
    root.style.setProperty('--gm-border', theme.cardBorderHex);
    root.style.setProperty('--gm-accent', theme.accentHex);
    root.style.setProperty('--gm-accent-2', theme.accent2Hex);
    root.style.setProperty('--gm-accent-text', theme.accentTextHex);
    root.style.setProperty('--gm-text', theme.textPrimary);
    root.style.setProperty('--gm-text-2', theme.textSecondary);
    root.style.setProperty('--gm-muted', theme.textMutedHex);
    root.style.setProperty('--gm-hover', theme.surfaceHoverHex);
  }, [theme]);

  // Sync root board colors & textures independently from dark/light or app-theme toggles
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.boardTheme = boardTheme.id;
    root.style.setProperty('--square-light', boardTheme.lightHex);
    root.style.setProperty('--square-dark', boardTheme.darkHex);
    root.style.setProperty('--square-selected', boardTheme.selectedHex);
    root.style.setProperty('--square-last-move', boardTheme.lastMoveHex);
    root.style.setProperty('--coord-light', boardTheme.coordLight);
    root.style.setProperty('--coord-dark', boardTheme.coordDark);
    root.style.setProperty('--square-tex-light', boardTheme.squareTexture?.light || 'none');
    root.style.setProperty('--square-tex-dark', boardTheme.squareTexture?.dark || 'none');
  }, [boardTheme]);

  const pieceDisplayValue = useMemo<PieceDisplayContextType>(
    () => ({ pieceSet, kingFinial, batterySaver }),
    [pieceSet, kingFinial, batterySaver]
  );

  const boardRuntimeValue = useMemo<BoardRuntimeContextType>(
    () => ({
      boardTheme,
      boardThemeId,
      matchBoardToPieces,
      customBoards,
      pieceSet,
      kingFinial,
      boardSize,
      showCoordinates,
      highlightLegalMoves,
      moveInputMethod,
      autoQueen,
      batterySaver,
      keyboardControl
    }),
    [
      boardTheme,
      boardThemeId,
      matchBoardToPieces,
      customBoards,
      pieceSet,
      kingFinial,
      boardSize,
      showCoordinates,
      highlightLegalMoves,
      moveInputMethod,
      autoQueen,
      batterySaver,
      keyboardControl
    ]
  );

  const themeValue = useMemo<ThemeContextType>(
    () => ({ theme, boardTheme, pieceSet, kingFinial, settings }),
    [theme, boardTheme, pieceSet, kingFinial, settings]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <BoardRuntimeContext.Provider value={boardRuntimeValue}>
        <PieceDisplayContext.Provider value={pieceDisplayValue}>
          {children}
        </PieceDisplayContext.Provider>
      </BoardRuntimeContext.Provider>
    </ThemeContext.Provider>
  );
};
