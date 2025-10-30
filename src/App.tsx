import React from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import TitleScreen from './components/TitleScreen';
import LevelSelect from './components/LevelSelect';
import LevelComplete from './components/LevelComplete';
import { GameProvider, useGame } from './context/GameContext';
import { loadLevel, initializeGameObjects } from './utils/levelLoader';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AppContent() {
  const { state, dispatch, goToLevelSelect, goToTitle } = useGame();

  const handlePlayClick = () => {
    goToLevelSelect();
  };

  const handleLevelSelect = (levelNumber: number) => {
    const level = loadLevel(`level-${levelNumber}`);
    if (level) {
      dispatch({ type: 'SET_LEVEL', payload: level });
      // Initialize game objects for the selected level
      const gameObjects = initializeGameObjects(level);
      dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: gameObjects });
      dispatch({ type: 'SET_GAME_MODE', payload: 'playing' });
      // Reset game state for the selected level
      dispatch({ type: 'SET_GAME_WON', payload: false });
      dispatch({ type: 'SET_GAME_LOST', payload: false });
      dispatch({ type: 'SET_LOSS_REASON', payload: undefined });
      dispatch({ type: 'SET_COMPLETED_LEVEL_NUMBER', payload: undefined });
    }
  };

  const handleNextLevel = () => {
    if (state.completedLevelNumber) {
      const nextLevelNumber = state.completedLevelNumber + 1;
      const nextLevel = loadLevel(`level-${nextLevelNumber}`);
      if (nextLevel) {
        dispatch({ type: 'SET_LEVEL', payload: nextLevel });
        // Initialize game objects for the new level
        const gameObjects = initializeGameObjects(nextLevel);
        dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: gameObjects });
        dispatch({ type: 'SET_GAME_MODE', payload: 'playing' });
        // Reset game state for next level
        dispatch({ type: 'SET_GAME_WON', payload: false });
        dispatch({ type: 'SET_GAME_LOST', payload: false });
        dispatch({ type: 'SET_LOSS_REASON', payload: undefined });
        dispatch({ type: 'SET_COMPLETED_LEVEL_NUMBER', payload: undefined });
      }
    }
  };

  const handleBackToTitle = () => {
    goToTitle();
  };

  switch (state.gameMode) {
    case 'title':
      return <TitleScreen onPlayClick={handlePlayClick} />;
    case 'levelSelect':
      return (
        <LevelSelect
          unlockedLevels={state.unlockedLevels}
          completedLevels={state.completedLevels}
          onLevelSelect={handleLevelSelect}
          onBack={handleBackToTitle}
        />
      );
    case 'levelComplete':
      if (state.completedLevelNumber) {
        const hasNextLevel = state.completedLevelNumber < 10;
        return (
          <LevelComplete
            levelNumber={state.completedLevelNumber}
            onNextLevel={handleNextLevel}
            onLevelSelect={() => {
              dispatch({ type: 'SET_GAME_MODE', payload: 'levelSelect' });
            }}
            hasNextLevel={hasNextLevel}
          />
        );
      }
      return <Game />;
    case 'playing':
      return <Game />;
    default:
      return <TitleScreen onPlayClick={handlePlayClick} />;
  }
}

function App() {
  return (
    <GameProvider>
      <AppContainer>
        <AppContent />
      </AppContainer>
    </GameProvider>
  );
}

export default App; 