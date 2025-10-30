import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Matter from 'matter-js';
import { useGame } from '../context/GameContext';
import { GameObjectType, Seeker } from '../types/game';
import { calculatePredictedPath, updateGameObjectPhysics } from '../utils/physics';
import { renderGameObjects } from '../utils/rendering';

const Canvas = styled.canvas`
  border: 1px solid #333;
  background: #0a0a0a;
`;

interface GameCanvasProps {}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>((props, ref) => {
  const { state, dispatch } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const physicsAnimationRef = useRef<number | null>(null);
  const renderAnimationRef = useRef<number | null>(null);

  // Initialize Matter.js engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: 1200,
        height: 700,
        wireframes: false,
        background: 'transparent',
      },
    });

    engineRef.current = engine;
    worldRef.current = world;
    renderRef.current = render;

    // Matter.Render.run(render);

    return () => {
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  // Handle mouse events for drag and launch
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.isSimulating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on the seeker
    const seeker = state.gameObjects.find(obj => obj.type === GameObjectType.SEEKER) as Seeker;
    if (seeker && !seeker.isLaunched) {
      const distance = Math.sqrt((x - seeker.position.x) ** 2 + (y - seeker.position.y) ** 2);
      if (distance <= seeker.radius) {
        dispatch({ type: 'SET_DRAGGING', payload: true });
        dispatch({ type: 'SET_DRAG_START', payload: { x, y } });
      }
    }
  }, [state.isSimulating, state.gameObjects, dispatch]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.isDragging || state.isSimulating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dispatch({ type: 'SET_DRAG_END', payload: { x, y } });

    // Calculate predicted path
    const seeker = state.gameObjects.find(obj => obj.type === GameObjectType.SEEKER) as Seeker;
    if (seeker && state.dragStart) {
      const velocity = {
        x: (state.dragStart.x - x) * 1.6,
        y: (state.dragStart.y - y) * 1.6,
      };
      const predictedPath = calculatePredictedPath(seeker.position, velocity, state.gameObjects);
      dispatch({ type: 'SET_PREDICTED_PATH', payload: predictedPath });
    }
  }, [state.isDragging, state.isSimulating, state.gameObjects, state.dragStart, dispatch]);

  const handleMouseUp = useCallback(() => {
    if (!state.isDragging || state.isSimulating) return;

    dispatch({ type: 'SET_DRAGGING', payload: false });

    // Launch the seeker
    const seeker = state.gameObjects.find(obj => obj.type === GameObjectType.SEEKER) as Seeker;
    if (seeker && state.dragStart && state.dragEnd) {
      const velocity = {
        x: (state.dragStart.x - state.dragEnd.x) * 1.6,
        y: (state.dragStart.y - state.dragEnd.y) * 1.6,
      };

      // Update seeker with launch velocity
      const updatedSeeker = { ...seeker, velocity, isLaunched: true };
      const updatedObjects = state.gameObjects.map(obj => 
        obj.id === seeker.id ? updatedSeeker : obj
      );

      dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: updatedObjects });
      dispatch({ type: 'SET_SIMULATING', payload: true });
      dispatch({ type: 'SET_PREDICTED_PATH', payload: [] });
    }

    dispatch({ type: 'SET_DRAG_START', payload: null });
    dispatch({ type: 'SET_DRAG_END', payload: null });
  }, [state.isDragging, state.isSimulating, state.gameObjects, state.dragStart, state.dragEnd, dispatch]);

  // Game loop for physics simulation
  useEffect(() => {
    if (!state.isSimulating || !engineRef.current) return;

    const gameLoop = () => {
      // Update game objects and check for win/loss
      const { updatedObjects, gameWon, gameLost, gameShouldStop, lossReason } = updateGameObjectPhysics(state.gameObjects, 1 / 60);
      
      // Update state
      dispatch({ type: 'UPDATE_GAME_OBJECTS', payload: updatedObjects });
      dispatch({ type: 'SET_SIMULATION_STEP', payload: state.simulationStep + 1 });
      if (gameWon) {
        console.log('Game loop: WIN detected, setting gameWon to true');
        dispatch({ type: 'SET_GAME_WON', payload: true });
        dispatch({ type: 'SET_SIMULATING', payload: false });
        return;
      }
      if (gameLost) {
        console.log('Game loop: LOSS detected, setting gameLost to true');
        dispatch({ type: 'SET_GAME_LOST', payload: true });
        if (lossReason) {
          dispatch({ type: 'SET_LOSS_REASON', payload: lossReason });
        }
        dispatch({ type: 'SET_SIMULATING', payload: false });
        return;
      }
      if (gameShouldStop) {
        console.log('Game loop: Game should stop (but no win/loss)');
        dispatch({ type: 'SET_SIMULATING', payload: false });
        return;
      }
      physicsAnimationRef.current = requestAnimationFrame(gameLoop);
    };

    physicsAnimationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (physicsAnimationRef.current) {
        cancelAnimationFrame(physicsAnimationRef.current);
      }
    };
  }, [state.isSimulating, state.simulationStep, state.gameObjects, dispatch]);

  // Continuous animation loop for visual effects (runs 24/7)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animationLoop = () => {
      // Only re-render if we have game objects to render
      if (state.gameObjects.length > 0) {
        renderGameObjects(ctx, state.gameObjects, state.predictedPath, state.isDragging);
      }
      renderAnimationRef.current = requestAnimationFrame(animationLoop);
    };

    renderAnimationRef.current = requestAnimationFrame(animationLoop);

    return () => {
      if (renderAnimationRef.current) {
        cancelAnimationFrame(renderAnimationRef.current);
      }
    };
  }, [state.gameObjects, state.predictedPath, state.isDragging]);

  return (
    <Canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      width={1200}
      height={700}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas; 