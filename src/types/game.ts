export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  position: Vector2D;
  type: GameObjectType;
}

export enum GameObjectType {
  SEEKER = 'seeker',
  CHALICE = 'chalice',
  PLANET = 'planet',
  WORMHOLE = 'wormhole',
  CURRENT = 'current',
  PHASE_GATE = 'phase_gate',
  DEBRIS_CLOUD = 'debris_cloud'
}

export interface Seeker extends GameObject {
  type: GameObjectType.SEEKER;
  velocity: Vector2D;
  radius: number;
  isLaunched: boolean;
  isInChalice: boolean;
}

export interface Chalice extends GameObject {
  type: GameObjectType.CHALICE;
  radius: number;
  maxEntryVelocity: number;
}

export interface Planet extends GameObject {
  type: GameObjectType.PLANET;
  radius: number;
  mass: number;
  gravityStrength: number;
  isNegativeGravity: boolean;
}

export interface Wormhole extends GameObject {
  type: GameObjectType.WORMHOLE;
  radius: number;
  pairId: string;
}

export interface SpacetimeCurrent extends GameObject {
  type: GameObjectType.CURRENT;
  direction: Vector2D;
  strength: number;
  width: number;
  height: number;
}

export interface PhaseGate extends GameObject {
  type: GameObjectType.PHASE_GATE;
  width: number;
  height: number;
  minVelocity: number;
  maxVelocity: number;
  isActive: boolean;
}

export interface DebrisCloud extends GameObject {
  type: GameObjectType.DEBRIS_CLOUD;
  radius: number;
  dragCoefficient: number;
}

export interface Level {
  id: string;
  name: string;
  width: number;
  height: number;
  seeker: Omit<Seeker, 'id' | 'type' | 'velocity' | 'isLaunched' | 'isInChalice'>;
  chalice: Omit<Chalice, 'id' | 'type'>;
  planets: Omit<Planet, 'id' | 'type'>[];
  wormholes: Omit<Wormhole, 'id' | 'type'>[];
  currents: Omit<SpacetimeCurrent, 'id' | 'type'>[];
  phaseGates: Omit<PhaseGate, 'id' | 'type'>[];
  debrisClouds: Omit<DebrisCloud, 'id' | 'type'>[];
}

export interface GameState {
  currentLevel: Level | null;
  gameObjects: GameObject[];
  isDragging: boolean;
  dragStart: Vector2D | null;
  dragEnd: Vector2D | null;
  predictedPath: Vector2D[];
  isSimulating: boolean;
  simulationStep: number;
  gameWon: boolean;
  gameLost: boolean;
  lossReason?: 'planet' | 'outOfBounds';
  gameMode: 'title' | 'levelSelect' | 'playing' | 'levelComplete';
  unlockedLevels: number;
  completedLevels: number[];
  completedLevelNumber?: number;
} 