import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const LevelTitle = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: white;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const LossMenu = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #ff4444;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  z-index: 100;
  color: white;
  font-family: 'Arial', sans-serif;
`;

const LossTitle = styled.h2`
  color: #ff4444;
  margin: 0 0 20px 0;
  font-size: 24px;
`;

const LossMessage = styled.p`
  margin: 0 0 25px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const RetryButton = styled.button`
  background: #ff4444;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6666;
    transform: scale(1.05);
  }
`;

const GameUI: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleReset = () => {
    dispatch({ type: 'RESET_LEVEL' });
  };

  const getLossMessage = () => {
    switch (state.lossReason) {
      case 'planet':
        return "You crashed into a sun! The gravitational forces were too strong.";
      case 'outOfBounds':
        return "You went out of bounds! The seeker drifted too far from the play area.";
      default:
        return "Mission failed! Try again with a different approach.";
    }
  };

  return (
    <>
      <LevelTitle>
        {state.currentLevel && state.currentLevel.name}
      </LevelTitle>

      {state.gameLost && (
        <LossMenu>
          <LossTitle>Mission Failed!</LossTitle>
          <LossMessage>{getLossMessage()}</LossMessage>
          <RetryButton onClick={handleReset}>
            Retry Level
          </RetryButton>
        </LossMenu>
      )}
    </>
  );
};

export default GameUI; 