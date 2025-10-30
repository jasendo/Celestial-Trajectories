import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import { loadLevel, initializeGameObjects } from '../utils/levelLoader';

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
`;

const CanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
  height: 700px;
  background: transparent;
`;

const LevelSelectButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;
  z-index: 1000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Game: React.FC = () => {
  const { state, dispatch, goToLevelSelect, completeLevel, showLevelComplete } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentLevelNumber = useRef<number>(1);

  // Load level when game mode changes to playing
  useEffect(() => {
    if (state.gameMode === 'playing' && !state.currentLevel) {
      const firstLevel = loadLevel('level-1');
      if (firstLevel) {
        dispatch({ type: 'SET_LEVEL', payload: firstLevel });
        const gameObjects = initializeGameObjects(firstLevel);
        dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: gameObjects });
      }
    }
  }, [state.gameMode, state.currentLevel, dispatch]);

  // Add effect to re-initialize game objects after reset
  useEffect(() => {
    if (state.currentLevel && state.gameObjects.length === 0) {
      const gameObjects = initializeGameObjects(state.currentLevel);
      dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: gameObjects });
    }
  }, [state.currentLevel, state.gameObjects.length, dispatch]);

  // Handle level completion
  useEffect(() => {
    if (state.gameWon && state.currentLevel) {
      // Extract level number from level ID (e.g., "level-1" -> 1)
      const levelId = state.currentLevel.id;
      const levelNumber = parseInt(levelId.split('-')[1]);
      currentLevelNumber.current = levelNumber;
      
      // Mark level as completed
      completeLevel(levelNumber);
      
      // Show level complete screen
      showLevelComplete(levelNumber);
    }
  }, [state.gameWon, state.currentLevel, completeLevel, showLevelComplete]);

  const handleLevelSelect = () => {
    goToLevelSelect();
  };

  return (
    <GameContainer>
      <LevelSelectButton onClick={handleLevelSelect}>
        ← Level Select
      </LevelSelectButton>
      <GameUI />
      <CanvasWrapper>
        <GameCanvas ref={canvasRef} />
      </CanvasWrapper>
    </GameContainer>
  );
};

export default Game; 