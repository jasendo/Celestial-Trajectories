import { Level, GameObjectType, Seeker, Chalice, Planet, Wormhole, SpacetimeCurrent, PhaseGate, DebrisCloud } from '../types/game';

// Sample level data
const levels: Record<string, Level> = {
  'level-1': {
    id: 'level-1',
    name: 'First Steps',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 200, y: 350 },
      radius: 15,
    },
    chalice: {
      position: { x: 1000, y: 350 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 600, y: 350 },
        radius: 80,
        mass: 30000,
        gravityStrength: 1,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-2': {
    id: 'level-2',
    name: 'Push and Pull',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 200, y: 600 },
      radius: 15,
    },
    chalice: {
      position: { x: 1000, y: 100 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 500, y: 300 },
        radius: 60,
        mass: 25000,
        gravityStrength: 1,
        isNegativeGravity: false,
      },
      {
        position: { x: 800, y: 450 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1,
        isNegativeGravity: true,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-3': {
    id: 'level-3',
    name: 'Triple Gravity',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 100, y: 350 },
      radius: 15,
    },
    chalice: {
      position: { x: 1100, y: 350 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 350, y: 250 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1.2,
        isNegativeGravity: false,
      },
      {
        position: { x: 600, y: 450 },
        radius: 60,
        mass: 25000,
        gravityStrength: 1,
        isNegativeGravity: true,
      },
      {
        position: { x: 850, y: 200 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.1,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-4': {
    id: 'level-4',
    name: 'Gravity Maze',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 200, y: 150 },
      radius: 15,
    },
    chalice: {
      position: { x: 1000, y: 550 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 300, y: 350 },
        radius: 70,
        mass: 30000,
        gravityStrength: 1.3,
        isNegativeGravity: false,
      },
      {
        position: { x: 600, y: 250 },
        radius: 55,
        mass: 22000,
        gravityStrength: 1.2,
        isNegativeGravity: true,
      },
      {
        position: { x: 900, y: 450 },
        radius: 65,
        mass: 28000,
        gravityStrength: 1.1,
        isNegativeGravity: false,
      },
      {
        position: { x: 450, y: 550 },
        radius: 40,
        mass: 15000,
        gravityStrength: 1,
        isNegativeGravity: true,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-5': {
    id: 'level-5',
    name: 'Cosmic Dance',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 100, y: 100 },
      radius: 15,
    },
    chalice: {
      position: { x: 1100, y: 600 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 250, y: 450 },
        radius: 60,
        mass: 25000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 550, y: 200 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 750, y: 400 },
        radius: 70,
        mass: 30000,
        gravityStrength: 1.2,
        isNegativeGravity: false,
      },
      {
        position: { x: 950, y: 250 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.1,
        isNegativeGravity: true,
      },
      {
        position: { x: 300, y: 500 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.1,
        isNegativeGravity: true,
      },
      {
        position: { x: 700, y: 550 },
        radius: 40,
        mass: 16000,
        gravityStrength: 1.0,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-6': {
    id: 'level-6',
    name: 'Gravity Corridor',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 150, y: 350 },
      radius: 15,
    },
    chalice: {
      position: { x: 1050, y: 350 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 300, y: 200 },
        radius: 40,
        mass: 15000,
        gravityStrength: 1.5,
        isNegativeGravity: false,
      },
      {
        position: { x: 300, y: 500 },
        radius: 40,
        mass: 15000,
        gravityStrength: 1.5,
        isNegativeGravity: false,
      },
      {
        position: { x: 600, y: 150 },
        radius: 35,
        mass: 12000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 600, y: 550 },
        radius: 35,
        mass: 12000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 900, y: 250 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 900, y: 450 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-7': {
    id: 'level-7',
    name: 'Spiral Galaxy',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 100, y: 100 },
      radius: 15,
    },
    chalice: {
      position: { x: 1100, y: 600 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 200, y: 300 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1.6,
        isNegativeGravity: false,
      },
      {
        position: { x: 400, y: 200 },
        radius: 40,
        mass: 16000,
        gravityStrength: 1.5,
        isNegativeGravity: true,
      },
      {
        position: { x: 600, y: 400 },
        radius: 55,
        mass: 22000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 800, y: 150 },
        radius: 35,
        mass: 14000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 1000, y: 350 },
        radius: 60,
        mass: 24000,
        gravityStrength: 1.2,
        isNegativeGravity: false,
      },
      {
        position: { x: 300, y: 500 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.1,
        isNegativeGravity: true,
      },
      {
        position: { x: 700, y: 550 },
        radius: 40,
        mass: 16000,
        gravityStrength: 1.0,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-8': {
    id: 'level-8',
    name: 'Master Challenge',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 150, y: 150 },
      radius: 15,
    },
    chalice: {
      position: { x: 1050, y: 550 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 250, y: 400 },
        radius: 65,
        mass: 26000,
        gravityStrength: 1.8,
        isNegativeGravity: false,
      },
      {
        position: { x: 450, y: 250 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1.7,
        isNegativeGravity: true,
      },
      {
        position: { x: 650, y: 450 },
        radius: 70,
        mass: 28000,
        gravityStrength: 1.6,
        isNegativeGravity: false,
      },
      {
        position: { x: 850, y: 200 },
        radius: 45,
        mass: 18000,
        gravityStrength: 1.5,
        isNegativeGravity: true,
      },
      {
        position: { x: 350, y: 600 },
        radius: 55,
        mass: 22000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 750, y: 300 },
        radius: 60,
        mass: 24000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 550, y: 500 },
        radius: 40,
        mass: 16000,
        gravityStrength: 1.2,
        isNegativeGravity: false,
      },
      {
        position: { x: 950, y: 400 },
        radius: 50,
        mass: 20000,
        gravityStrength: 1.1,
        isNegativeGravity: true,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-9': {
    id: 'level-9',
    name: 'Quantum Nexus',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 100, y: 200 },
      radius: 15,
    },
    chalice: {
      position: { x: 1100, y: 500 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 200, y: 400 },
        radius: 70,
        mass: 30000,
        gravityStrength: 2.0,
        isNegativeGravity: false,
      },
      {
        position: { x: 400, y: 150 },
        radius: 55,
        mass: 25000,
        gravityStrength: 1.9,
        isNegativeGravity: true,
      },
      {
        position: { x: 600, y: 350 },
        radius: 65,
        mass: 28000,
        gravityStrength: 1.8,
        isNegativeGravity: false,
      },
      {
        position: { x: 800, y: 250 },
        radius: 50,
        mass: 22000,
        gravityStrength: 1.7,
        isNegativeGravity: true,
      },
      {
        position: { x: 300, y: 550 },
        radius: 60,
        mass: 26000,
        gravityStrength: 1.6,
        isNegativeGravity: false,
      },
      {
        position: { x: 700, y: 450 },
        radius: 45,
        mass: 20000,
        gravityStrength: 1.5,
        isNegativeGravity: true,
      },
      {
        position: { x: 500, y: 300 },
        radius: 40,
        mass: 18000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 900, y: 400 },
        radius: 55,
        mass: 24000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
      {
        position: { x: 350, y: 200 },
        radius: 35,
        mass: 16000,
        gravityStrength: 1.2,
        isNegativeGravity: false,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
  'level-10': {
    id: 'level-10',
    name: 'Final Frontier',
    width: 1200,
    height: 700,
    seeker: {
      position: { x: 50, y: 100 },
      radius: 15,
    },
    chalice: {
      position: { x: 1150, y: 600 },
      radius: 20,
      maxEntryVelocity: 50,
    },
    planets: [
      {
        position: { x: 150, y: 350 },
        radius: 75,
        mass: 35000,
        gravityStrength: 2.2,
        isNegativeGravity: false,
      },
      {
        position: { x: 350, y: 200 },
        radius: 60,
        mass: 28000,
        gravityStrength: 2.1,
        isNegativeGravity: true,
      },
      {
        position: { x: 550, y: 450 },
        radius: 80,
        mass: 32000,
        gravityStrength: 2.0,
        isNegativeGravity: false,
      },
      {
        position: { x: 750, y: 150 },
        radius: 55,
        mass: 25000,
        gravityStrength: 1.9,
        isNegativeGravity: true,
      },
      {
        position: { x: 950, y: 350 },
        radius: 70,
        mass: 30000,
        gravityStrength: 1.8,
        isNegativeGravity: false,
      },
      {
        position: { x: 250, y: 550 },
        radius: 65,
        mass: 27000,
        gravityStrength: 1.7,
        isNegativeGravity: true,
      },
      {
        position: { x: 450, y: 400 },
        radius: 50,
        mass: 22000,
        gravityStrength: 1.6,
        isNegativeGravity: false,
      },
      {
        position: { x: 650, y: 250 },
        radius: 45,
        mass: 20000,
        gravityStrength: 1.5,
        isNegativeGravity: true,
      },
      {
        position: { x: 850, y: 500 },
        radius: 60,
        mass: 26000,
        gravityStrength: 1.4,
        isNegativeGravity: false,
      },
      {
        position: { x: 1050, y: 200 },
        radius: 40,
        mass: 18000,
        gravityStrength: 1.3,
        isNegativeGravity: true,
      },
    ],
    wormholes: [],
    currents: [],
    phaseGates: [],
    debrisClouds: [],
  },
};

export function loadLevel(levelId: string): Level | null {
  return levels[levelId] || null;
}

export function initializeGameObjects(level: Level) {
  const gameObjects = [];

  // Create seeker
  const seeker: Seeker = {
    id: 'seeker',
    type: GameObjectType.SEEKER,
    position: level.seeker.position,
    velocity: { x: 0, y: 0 },
    radius: level.seeker.radius,
    isLaunched: false,
    isInChalice: false,
  };
  gameObjects.push(seeker);

  // Create chalice
  const chalice: Chalice = {
    id: 'chalice',
    type: GameObjectType.CHALICE,
    position: level.chalice.position,
    radius: level.chalice.radius,
    maxEntryVelocity: level.chalice.maxEntryVelocity,
  };
  gameObjects.push(chalice);

  // Create planets
  level.planets.forEach((planetData, index) => {
    const planet: Planet = {
      id: `planet-${index}`,
      type: GameObjectType.PLANET,
      position: planetData.position,
      radius: planetData.radius,
      mass: planetData.mass,
      gravityStrength: planetData.gravityStrength,
      isNegativeGravity: planetData.isNegativeGravity,
    };
    gameObjects.push(planet);
  });

  // Create wormholes
  level.wormholes.forEach((wormholeData, index) => {
    const wormhole: Wormhole = {
      id: `wormhole-${index}`,
      type: GameObjectType.WORMHOLE,
      position: wormholeData.position,
      radius: wormholeData.radius,
      pairId: wormholeData.pairId,
    };
    gameObjects.push(wormhole);
  });

  // Create spacetime currents
  level.currents.forEach((currentData, index) => {
    const current: SpacetimeCurrent = {
      id: `current-${index}`,
      type: GameObjectType.CURRENT,
      position: currentData.position,
      direction: currentData.direction,
      strength: currentData.strength,
      width: currentData.width,
      height: currentData.height,
    };
    gameObjects.push(current);
  });

  // Create phase gates
  level.phaseGates.forEach((gateData, index) => {
    const gate: PhaseGate = {
      id: `gate-${index}`,
      type: GameObjectType.PHASE_GATE,
      position: gateData.position,
      width: gateData.width,
      height: gateData.height,
      minVelocity: gateData.minVelocity,
      maxVelocity: gateData.maxVelocity,
      isActive: gateData.isActive,
    };
    gameObjects.push(gate);
  });

  // Create debris clouds
  level.debrisClouds.forEach((cloudData, index) => {
    const cloud: DebrisCloud = {
      id: `debris-${index}`,
      type: GameObjectType.DEBRIS_CLOUD,
      position: cloudData.position,
      radius: cloudData.radius,
      dragCoefficient: cloudData.dragCoefficient,
    };
    gameObjects.push(cloud);
  });

  return gameObjects;
}

export { levels }; 