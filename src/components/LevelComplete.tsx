import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGame } from '../context/GameContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const LevelCompleteContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  text-align: center;
  z-index: 10;
  animation: ${css`${fadeIn} 1s ease-out`};
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #00ff00;
  margin: 0 0 20px 0;
  font-family: 'Orbitron', 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 20px #00ff00;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 40px 0;
  font-family: 'Arial', sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary 
    ? 'linear-gradient(45deg, #00ff00, #008000)' 
    : 'linear-gradient(45deg, #00ffff, #0080ff)'};
  border: none;
  color: white;
  padding: 15px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px ${props => props.primary 
    ? 'rgba(0, 255, 0, 0.3)' 
    : 'rgba(0, 255, 255, 0.3)'};
  font-family: 'Orbitron', 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 40px ${props => props.primary 
      ? 'rgba(0, 255, 0, 0.5)' 
      : 'rgba(0, 255, 255, 0.5)'};
    animation: ${css`${pulse} 2s infinite`};
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

interface LevelCompleteProps {
  levelNumber: number;
  onNextLevel: () => void;
  onLevelSelect: () => void;
  onBackToTitle?: () => void;
  hasNextLevel: boolean;
}

const LevelComplete: React.FC<LevelCompleteProps> = ({
  levelNumber,
  onNextLevel,
  onLevelSelect,
  onBackToTitle,
  hasNextLevel
}) => {
  const { dispatch, goToTitle, goToLevelSelect } = useGame();

  const handleBackToTitle = () => {
    console.log('Back to title clicked!'); // Debug log
    
    // Reset all game state to ensure clean transition
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
    
    // Now go to title - this will trigger the routing in App.tsx
    goToTitle();
  };

  return (
    <LevelCompleteContainer>
      <BackButton onClick={handleBackToTitle}>
        ← Back to Title
      </BackButton>
      
      <Content>
        <Title>Level {levelNumber} Complete!</Title>
        <Subtitle>Mission accomplished, pilot!</Subtitle>
        
        <ButtonContainer>
          <Button 
            primary 
            onClick={onNextLevel}
            disabled={!hasNextLevel}
          >
            {hasNextLevel ? 'Next Level' : 'All Levels Complete!'}
          </Button>
          <Button onClick={goToLevelSelect}>
            Level Select
          </Button>
        </ButtonContainer>
      </Content>
    </LevelCompleteContainer>
  );
};

export default LevelComplete; 