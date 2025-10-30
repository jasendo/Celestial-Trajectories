import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Level, Vector2D } from '../types/game';
import { loadProgress, saveProgress, unlockNextLevel, markLevelCompleted } from '../utils/storage';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  goToTitle: () => void;
  goToLevelSelect: () => void;
  startLevel: (levelNumber: number) => void;
  completeLevel: (levelNumber: number) => void;
  showLevelComplete: (levelNumber: number) => void;
  goToNextLevel: () => void;
}

type GameAction =
  | { type: 'SET_LEVEL'; payload: Level }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_DRAG_START'; payload: Vector2D | null }
  | { type: 'SET_DRAG_END'; payload: Vector2D | null }
  | { type: 'SET_PREDICTED_PATH'; payload: Vector2D[] }
  | { type: 'SET_SIMULATING'; payload: boolean }
  | { type: 'SET_SIMULATION_STEP'; payload: number }
  | { type: 'SET_GAME_WON'; payload: boolean }
  | { type: 'SET_GAME_LOST'; payload: boolean }
  | { type: 'SET_LOSS_REASON'; payload: 'planet' | 'outOfBounds' | undefined }
  | { type: 'UPDATE_GAME_OBJECTS'; payload: any[] }
  | { type: 'RESET_LEVEL' }
  | { type: 'SET_GAME_MODE'; payload: 'title' | 'levelSelect' | 'playing' | 'levelComplete' }
  | { type: 'SET_UNLOCKED_LEVELS'; payload: number }
  | { type: 'SET_COMPLETED_LEVELS'; payload: number[] }
  | { type: 'LOAD_PROGRESS'; payload: { unlockedLevels: number; completedLevels: number[] } }
  | { type: 'SET_COMPLETED_LEVEL_NUMBER'; payload: number | undefined };

const initialState: GameState = {
  currentLevel: null,
  gameObjects: [],
  isDragging: false,
  dragStart: null,
  dragEnd: null,
  predictedPath: [],
  isSimulating: false,
  simulationStep: 0,
  gameWon: false,
  gameLost: false,
  lossReason: undefined,
  gameMode: 'title',
  unlockedLevels: 1,
  completedLevels: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, currentLevel: action.payload };
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    case 'SET_DRAG_START':
      return { ...state, dragStart: action.payload };
    case 'SET_DRAG_END':
      return { ...state, dragEnd: action.payload };
    case 'SET_PREDICTED_PATH':
      return { ...state, predictedPath: action.payload };
    case 'SET_SIMULATING':
      return { ...state, isSimulating: action.payload };
    case 'SET_SIMULATION_STEP':
      return { ...state, simulationStep: action.payload };
    case 'SET_GAME_WON':
      return { ...state, gameWon: action.payload };
    case 'SET_GAME_LOST':
      return { ...state, gameLost: action.payload };
    case 'SET_LOSS_REASON':
      return { ...state, lossReason: action.payload };
    case 'UPDATE_GAME_OBJECTS':
      return { ...state, gameObjects: action.payload };
    case 'RESET_LEVEL':
      return { 
        ...initialState, 
        currentLevel: state.currentLevel,
        gameMode: state.gameMode,
        unlockedLevels: state.unlockedLevels,
        completedLevels: state.completedLevels
      };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_UNLOCKED_LEVELS':
      return { ...state, unlockedLevels: action.payload };
    case 'SET_COMPLETED_LEVELS':
      return { ...state, completedLevels: action.payload };
    case 'LOAD_PROGRESS':
      return { 
        ...state, 
        unlockedLevels: action.payload.unlockedLevels,
        completedLevels: action.payload.completedLevels
      };
    case 'SET_COMPLETED_LEVEL_NUMBER':
      return { ...state, completedLevelNumber: action.payload };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    // Temporarily disabled localStorage
    // const progress = loadProgress();
    // dispatch({ type: 'LOAD_PROGRESS', payload: progress });
    
    // Set default values for testing
    dispatch({ type: 'LOAD_PROGRESS', payload: { unlockedLevels: 1, completedLevels: [] } });
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    // Temporarily disabled localStorage
    // if (state.gameMode !== 'title') {
    //   saveProgress({
    //     unlockedLevels: state.unlockedLevels,
    //     completedLevels: state.completedLevels,
    //   });
    // }
  }, [state.unlockedLevels, state.completedLevels, state.gameMode]);

  const goToTitle = () => {
    dispatch({ type: 'SET_GAME_MODE', payload: 'title' });
  };

  const goToLevelSelect = () => {
    // Reset all game state when going to level select
    dispatch({ type: 'SET_GAME_WON', payload: false });
    dispatch({ type: 'SET_GAME_LOST', payload: false });
    dispatch({ type: 'SET_LOSS_REASON', payload: undefined });
    dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: [] });
    dispatch({ type: 'SET_COMPLETED_LEVEL_NUMBER', payload: undefined });
    dispatch({ type: 'SET_DRAGGING', payload: false });
    dispatch({ type: 'SET_DRAG_START', payload: null });
    dispatch({ type: 'SET_DRAG_END', payload: null });
    dispatch({ type: 'SET_PREDICTED_PATH', payload: [] });
    dispatch({ type: 'SET_SIMULATING', payload: false });
    dispatch({ type: 'SET_SIMULATION_STEP', payload: 0 });
    dispatch({ type: 'SET_GAME_MODE', payload: 'levelSelect' });
  };

  const startLevel = (levelNumber: number) => {
    // This will be implemented when we load the level
    dispatch({ type: 'SET_GAME_MODE', payload: 'playing' });
  };

  const completeLevel = (levelNumber: number) => {
    const newCompletedLevels = markLevelCompleted(levelNumber, state.completedLevels);
    const newUnlockedLevels = unlockNextLevel(state.unlockedLevels, newCompletedLevels);
    
    dispatch({ type: 'SET_COMPLETED_LEVELS', payload: newCompletedLevels });
    dispatch({ type: 'SET_UNLOCKED_LEVELS', payload: newUnlockedLevels });
  };

  const showLevelComplete = (levelNumber: number) => {
    dispatch({ type: 'SET_COMPLETED_LEVEL_NUMBER', payload: levelNumber });
    dispatch({ type: 'SET_GAME_MODE', payload: 'levelComplete' });
  };

  const goToNextLevel = () => {
    // Reset game state for next level
    dispatch({ type: 'SET_GAME_WON', payload: false });
    dispatch({ type: 'SET_GAME_LOST', payload: false });
    dispatch({ type: 'SET_LOSS_REASON', payload: undefined });
    dispatch({ type: 'SET_COMPLETED_LEVEL_NUMBER', payload: undefined });
    dispatch({ type: 'SET_GAME_MODE', payload: 'playing' });
  };

  return (
    <GameContext.Provider value={{ 
      state, 
      dispatch, 
      goToTitle, 
      goToLevelSelect, 
      startLevel, 
      completeLevel,
      showLevelComplete,
      goToNextLevel
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 