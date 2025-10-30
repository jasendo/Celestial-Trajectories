import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; }
  50% { text-shadow: 0 0 30px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff, 0 0 60px #00ffff; }
`;

const TitleContainer = styled.div`
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

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Star = styled.div<{ x: number; y: number; size: number; delay: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  animation: ${css`${float} 3s ease-in-out infinite`};
  animation-delay: ${props => props.delay}s;
  opacity: 0.8;
`;

const TitleContent = styled.div`
  text-align: center;
  z-index: 10;
  animation: ${css`${fadeIn} 1s ease-out`};
`;

const MainTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ff00);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glow} 3s ease-in-out infinite;
  font-family: 'Orbitron', 'Arial', sans-serif;
  letter-spacing: 4px;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 20px 0 40px 0;
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
`;

const PlayButton = styled.button`
  background: linear-gradient(45deg, #00ffff, #0080ff);
  border: none;
  color: white;
  padding: 20px 60px;
  font-size: 1.8rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
  font-family: 'Orbitron', 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 255, 255, 0.5);
    background: linear-gradient(45deg, #00ffff, #00bfff);
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

interface TitleScreenProps {
  onPlayClick: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onPlayClick }) => {
  // Generate random stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <TitleContainer>
      <StarField>
        {stars.map((star, index) => (
          <Star
            key={index}
            x={star.x}
            y={star.y}
            size={star.size}
            delay={star.delay}
          />
        ))}
      </StarField>
      
      <TitleContent>
        <MainTitle>Celestial Trajectories</MainTitle>
        <Subtitle>Navigate the cosmos through gravity and time</Subtitle>
        <PlayButton onClick={onPlayClick}>
          Launch Mission
        </PlayButton>
      </TitleContent>
    </TitleContainer>
  );
};

export default TitleScreen; 