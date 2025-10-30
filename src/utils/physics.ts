import { Vector2D, GameObject, GameObjectType, Planet, Wormhole, SpacetimeCurrent, PhaseGate, DebrisCloud, Chalice } from '../types/game';

const GRAVITY_CONSTANT = 20;
const TIME_STEP = 0.016; // 60 FPS
const MAX_PREDICTION_STEPS = 1250;

export function calculatePredictedPath(
  startPosition: Vector2D,
  initialVelocity: Vector2D,
  gameObjects: GameObject[]
): Vector2D[] {
  const path: Vector2D[] = [startPosition];
  let currentPosition = { ...startPosition };
  let currentVelocity = { ...initialVelocity };

  for (let step = 0; step < MAX_PREDICTION_STEPS; step++) {
    // Calculate forces from all game objects
    const totalForce = { x: 0, y: 0 };

    gameObjects.forEach(obj => {
      switch (obj.type) {
        case GameObjectType.PLANET:
          totalForce.x += calculateGravityForce(currentPosition, obj as Planet).x;
          totalForce.y += calculateGravityForce(currentPosition, obj as Planet).y;
          break;
        case GameObjectType.CURRENT:
          const currentForce = calculateCurrentForce(currentPosition, obj as SpacetimeCurrent);
          if (currentForce) {
            totalForce.x += currentForce.x;
            totalForce.y += currentForce.y;
          }
          break;
        case GameObjectType.DEBRIS_CLOUD:
          const dragForce = calculateDragForce(currentVelocity, obj as DebrisCloud);
          totalForce.x += dragForce.x;
          totalForce.y += dragForce.y;
          break;
      }
    });

    // Update velocity based on forces
    currentVelocity.x += totalForce.x * TIME_STEP;
    currentVelocity.y += totalForce.y * TIME_STEP;

    // Update position
    currentPosition.x += currentVelocity.x * TIME_STEP;
    currentPosition.y += currentVelocity.y * TIME_STEP;

    // Check for wormhole teleportation
    const wormhole = checkWormholeCollision(currentPosition, gameObjects);
    if (wormhole) {
      const pair = gameObjects.find(obj => 
        obj.type === GameObjectType.WORMHOLE && obj.id === wormhole.pairId
      ) as Wormhole;
      if (pair) {
        currentPosition = { ...pair.position };
        path.push(currentPosition);
        continue;
      }
    }

    // Check for phase gate collision
    const gateCollision = checkPhaseGateCollision(currentPosition, currentVelocity, gameObjects);
    if (gateCollision === 'blocked') {
      break; // Path is blocked
    }

    path.push({ ...currentPosition });

    // Check if we've gone too far or hit boundaries
    if (currentPosition.x < 0 || currentPosition.x > 1200 || 
        currentPosition.y < 0 || currentPosition.y > 700) {
      break;
    }

    // Check if we've reached the chalice
    const chalice = gameObjects.find(obj => obj.type === GameObjectType.CHALICE) as Chalice;
    if (chalice) {
      const distance = Math.sqrt(
        (currentPosition.x - chalice.position.x) ** 2 + 
        (currentPosition.y - chalice.position.y) ** 2
      );
      if (distance <= chalice.radius) {
        break;
      }
    }
  }

  return path;
}

function calculateGravityForce(position: Vector2D, planet: Planet): Vector2D {
  const dx = planet.position.x - position.x;
  const dy = planet.position.y - position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < planet.radius) {
    return { x: 0, y: 0 }; // Inside planet, no gravity
  }

  const forceMagnitude = (GRAVITY_CONSTANT * planet.mass * planet.gravityStrength) / (distance * distance);
  const direction = planet.isNegativeGravity ? -1 : 1;
  
  return {
    x: (dx / distance) * forceMagnitude * direction,
    y: (dy / distance) * forceMagnitude * direction,
  };
}

function calculateCurrentForce(position: Vector2D, current: SpacetimeCurrent): Vector2D | null {
  const halfWidth = current.width / 2;
  const halfHeight = current.height / 2;
  
  if (position.x >= current.position.x - halfWidth && 
      position.x <= current.position.x + halfWidth &&
      position.y >= current.position.y - halfHeight && 
      position.y <= current.position.y + halfHeight) {
    return {
      x: current.direction.x * current.strength,
      y: current.direction.y * current.strength,
    };
  }
  
  return null;
}

function calculateDragForce(velocity: Vector2D, debris: DebrisCloud): Vector2D {
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const dragMagnitude = speed * speed * debris.dragCoefficient;
  
  return {
    x: -(velocity.x / speed) * dragMagnitude,
    y: -(velocity.y / speed) * dragMagnitude,
  };
}

function checkWormholeCollision(position: Vector2D, gameObjects: GameObject[]): Wormhole | null {
  for (const obj of gameObjects) {
    if (obj.type === GameObjectType.WORMHOLE) {
      const wormhole = obj as Wormhole;
      const distance = Math.sqrt(
        (position.x - wormhole.position.x) ** 2 + 
        (position.y - wormhole.position.y) ** 2
      );
      if (distance <= wormhole.radius) {
        return wormhole;
      }
    }
  }
  return null;
}

function checkPhaseGateCollision(
  position: Vector2D, 
  velocity: Vector2D, 
  gameObjects: GameObject[]
): 'allowed' | 'blocked' | null {
  for (const obj of gameObjects) {
    if (obj.type === GameObjectType.PHASE_GATE) {
      const gate = obj as PhaseGate;
      const halfWidth = gate.width / 2;
      const halfHeight = gate.height / 2;
      
      if (position.x >= gate.position.x - halfWidth && 
          position.x <= gate.position.x + halfWidth &&
          position.y >= gate.position.y - halfHeight && 
          position.y <= gate.position.y + halfHeight) {
        
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        if (speed >= gate.minVelocity && speed <= gate.maxVelocity) {
          return 'allowed';
        } else {
          return 'blocked';
        }
      }
    }
  }
  return null;
}

export function updateGameObjectPhysics(
  gameObjects: GameObject[],
  deltaTime: number
): { updatedObjects: GameObject[], gameWon: boolean, gameLost: boolean, gameShouldStop: boolean, lossReason?: 'planet' | 'outOfBounds' } {
  let gameWon = false;
  let gameLost = false;
  let gameShouldStop = false;
  let seekerInPlanet = false;
  let seekerInChalice = false;
  let seekerOutOfBounds = false;
  let lossReason: 'planet' | 'outOfBounds' | undefined = undefined;
  let seekerSpeed = 0;
  
  // Canvas boundaries
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 700;
  const OUT_OF_BOUNDS_MARGIN = 50; // Extra margin to ensure ball is completely out of bounds
  
  let updatedObjects = gameObjects.map(obj => {
    if (obj.type === GameObjectType.SEEKER) {
      const seeker = obj as any;
      if (seeker.isLaunched) {
        // Calculate forces
        const totalForce = { x: 0, y: 0 };
        
        gameObjects.forEach(otherObj => {
          switch (otherObj.type) {
            case GameObjectType.PLANET:
              const gravityForce = calculateGravityForce(seeker.position, otherObj as Planet);
              totalForce.x += gravityForce.x;
              totalForce.y += gravityForce.y;
              break;
            case GameObjectType.CURRENT:
              const currentForce = calculateCurrentForce(seeker.position, otherObj as SpacetimeCurrent);
              if (currentForce) {
                totalForce.x += currentForce.x;
                totalForce.y += currentForce.y;
              }
              break;
            case GameObjectType.DEBRIS_CLOUD:
              const dragForce = calculateDragForce(seeker.velocity, otherObj as DebrisCloud);
              totalForce.x += dragForce.x;
              totalForce.y += dragForce.y;
              break;
          }
        });

        // Update velocity and position
        const newVelocity = {
          x: seeker.velocity.x + totalForce.x * deltaTime,
          y: seeker.velocity.y + totalForce.y * deltaTime,
        };

        const newPosition = {
          x: seeker.position.x + newVelocity.x * deltaTime,
          y: seeker.position.y + newVelocity.y * deltaTime,
        };

        // Check for out-of-bounds
        if (newPosition.x < -OUT_OF_BOUNDS_MARGIN || 
            newPosition.x > CANVAS_WIDTH + OUT_OF_BOUNDS_MARGIN ||
            newPosition.y < -OUT_OF_BOUNDS_MARGIN || 
            newPosition.y > CANVAS_HEIGHT + OUT_OF_BOUNDS_MARGIN) {
          console.log('Seeker out of bounds!', { 
            position: newPosition, 
            bounds: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, margin: OUT_OF_BOUNDS_MARGIN } 
          });
          seekerOutOfBounds = true;
          lossReason = 'outOfBounds';
          gameShouldStop = true;
          
          // Stop the seeker at the boundary
          return {
            ...seeker,
            position: {
              x: Math.max(-OUT_OF_BOUNDS_MARGIN, Math.min(CANVAS_WIDTH + OUT_OF_BOUNDS_MARGIN, newPosition.x)),
              y: Math.max(-OUT_OF_BOUNDS_MARGIN, Math.min(CANVAS_HEIGHT + OUT_OF_BOUNDS_MARGIN, newPosition.y))
            },
            velocity: { x: 0, y: 0 },
            isLaunched: false,
          };
        }

        // Check collision with planets
        for (const obj of gameObjects) {
          if (obj.type === GameObjectType.PLANET) {
            const planet = obj as Planet;
            const dist = Math.sqrt((newPosition.x - planet.position.x) ** 2 + (newPosition.y - planet.position.y) ** 2);
            if (dist <= planet.radius) {
              seekerInPlanet = true;
              lossReason = 'planet';
              break;
            }
          }
        }

        // Check collision with chalice
        const chalice = gameObjects.find(obj => obj.type === GameObjectType.CHALICE) as Chalice;
        if (chalice) {
          const dist = Math.sqrt((newPosition.x - chalice.position.x) ** 2 + (newPosition.y - chalice.position.y) ** 2);
          const speed = Math.sqrt(newVelocity.x ** 2 + newVelocity.y ** 2);
          if (dist <= chalice.radius) {
            console.log('Seeker entered chalice!', { 
              speed, 
              maxEntryVelocity: chalice.maxEntryVelocity, 
              isWin: speed <= chalice.maxEntryVelocity 
            });
            
            seekerInChalice = true;
            seekerSpeed = speed;
            gameShouldStop = true;
            
            // Stop the seeker
            return {
              ...seeker,
              position: { ...chalice.position },
              velocity: { x: 0, y: 0 },
              isLaunched: false,
              isInChalice: true,
            };
          }
        }

        return {
          ...seeker,
          position: newPosition,
          velocity: newVelocity,
        };
      }
    }
    return obj;
  });

  // Check win/loss conditions AFTER updating objects
  if (seekerInChalice) {
    gameWon = true;
    console.log('WIN CONDITION MET! gameWon set to:', gameWon);
  }
  
  if (seekerInPlanet || seekerOutOfBounds) {
    gameLost = true;
    console.log('LOSS CONDITION MET! gameLost set to:', gameLost, { seekerInPlanet, seekerOutOfBounds, lossReason });
  }

  console.log('Physics update returning:', { gameWon, gameLost, gameShouldStop, lossReason });
  return { updatedObjects, gameWon, gameLost, gameShouldStop, lossReason };
} 