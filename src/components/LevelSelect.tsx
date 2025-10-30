import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const LevelSelectContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${css`${fadeIn} 0.8s ease-out`};
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #00ffff;
  margin: 0 0 10px 0;
  font-family: 'Orbitron', 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-family: 'Arial', sans-serif;
`;

const LevelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  max-width: 800px;
  width: 100%;
  animation: ${css`${fadeIn} 1s ease-out 0.2s both`};
`;

const LevelButton = styled.button<{ unlocked: boolean; completed: boolean }>`
  width: 120px;
  height: 120px;
  border: none;
  border-radius: 15px;
  cursor: ${props => props.unlocked ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  position: relative;
  font-family: 'Orbitron', 'Arial', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  
  ${props => props.unlocked ? css`
    background: linear-gradient(135deg, #00ffff, #0080ff);
    box-shadow: 0 8px 25px rgba(0, 255, 255, 0.3);
    
    &:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 12px 35px rgba(0, 255, 255, 0.5);
      animation: ${pulse} 2s infinite;
    }
  ` : css`
    background: linear-gradient(135deg, #333, #555);
    opacity: 0.5;
    color: #999;
  `}
  
  ${props => props.completed && props.unlocked ? css`
    background: linear-gradient(135deg, #00ff00, #008000);
    box-shadow: 0 8px 25px rgba(0, 255, 0, 0.3);
  ` : ''}
`;

const LevelNumber = styled.div`
  font-size: 2rem;
  margin-bottom: 5px;
`;

const LevelStatus = styled.div<{ completed: boolean }>`
  font-size: 0.8rem;
  opacity: 0.8;
  ${props => props.completed ? 'color: #00ff00;' : 'color: #ffff00;'}
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

interface LevelSelectProps {
  unlockedLevels: number;
  completedLevels: number[];
  onLevelSelect: (level: number) => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({
  unlockedLevels,
  completedLevels,
  onLevelSelect,
  onBack
}) => {
  const totalLevels = 10; // Total number of levels in the game

  return (
    <LevelSelectContainer>
      <BackButton onClick={onBack}>
        ← Back to Title
      </BackButton>
      
      <Header>
        <Title>Mission Control</Title>
        <Subtitle>Select your destination</Subtitle>
      </Header>
      
      <LevelGrid>
        {Array.from({ length: totalLevels }, (_, i) => {
          const levelNumber = i + 1;
          const unlocked = levelNumber <= unlockedLevels;
          const completed = completedLevels.includes(levelNumber);
          
          return (
            <LevelButton
              key={levelNumber}
              unlocked={unlocked}
              completed={completed}
              onClick={() => unlocked && onLevelSelect(levelNumber)}
            >
              <LevelNumber>{levelNumber}</LevelNumber>
              <LevelStatus completed={completed}>
                {completed ? 'COMPLETED' : unlocked ? 'UNLOCKED' : 'LOCKED'}
              </LevelStatus>
            </LevelButton>
          );
        })}
      </LevelGrid>
    </LevelSelectContainer>
  );
};

export default LevelSelect; 