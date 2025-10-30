# Celestial Trajectories

A minimalist physics-based puzzle game where you launch a "Seeker" star into a target "Chalice" using gravitational forces, wormholes, and cosmic currents.

## 🎮 Game Concept

Celestial Trajectories is about creating beautiful, intricate paths through space. You must meticulously plan a single, perfect trajectory using:

- **Gravity Wells**: Planets that pull or push your Seeker
- **Wormholes**: Teleportation portals that maintain momentum
- **Spacetime Currents**: Flowing rivers of space that accelerate your Seeker
- **Phase Gates**: Barriers that only allow passage at specific velocities
- **Debris Clouds**: Space dust that slows your Seeker down

## 🚀 Core Gameplay

1. **The Launch**: Click and drag from the Seeker to set launch direction and velocity
2. **The Prediction**: See a dotted line showing your exact predicted path
3. **The Journey**: Watch your plan unfold as the Seeker follows the predicted trajectory
4. **The Goal**: Guide the Seeker into the Chalice below the maximum entry velocity

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Matter.js** for physics simulation
- **Canvas API** for smooth rendering
- **Styled Components** for UI styling
- **React Context** for state management

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Main game container
│   ├── GameCanvas.tsx  # Canvas rendering and physics
│   └── GameUI.tsx      # User interface
├── context/            # React context
│   └── GameContext.tsx # Game state management
├── types/              # TypeScript type definitions
│   └── game.ts         # Game object types
├── utils/              # Utility functions
│   ├── levelLoader.ts  # Level loading and initialization
│   ├── physics.ts      # Physics calculations
│   └── rendering.ts    # Canvas rendering
└── App.tsx             # Main app component
```

## 🎯 Game Objects

### Seeker

- The player-controlled star
- Draggable to set launch trajectory
- Affected by all physics forces

### Chalice

- The target destination
- Must be entered below maximum velocity
- Glows with cyan energy

### Planets

- Create gravity wells
- Can have positive or negative gravity
- Visual gravity field lines

### Wormholes

- Paired teleportation portals
- Maintain momentum through teleportation
- Animated portal effects

### Spacetime Currents

- Rectangular flow zones
- Accelerate Seeker in specific direction
- Visual flow arrows

### Phase Gates

- Conditional barriers
- Only allow passage at specific velocity ranges
- Display velocity requirements

### Debris Clouds

- Circular zones that slow the Seeker
- Particle effects
- Useful for velocity control

## 🎨 Visual Design

The game features a minimalist, space-themed aesthetic:

- Dark background with subtle gradients
- Glowing effects for all objects
- Smooth animations and transitions
- Clear visual feedback for all interactions

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. **Level 1 - First Steps**: Learn the basics with a single planet
2. **Level 2 - Gravity Dance**: Master multiple gravity wells
3. **Future Levels**: Will introduce wormholes, currents, gates, and debris

### Controls

- **Click and Drag** from the Seeker to set trajectory
- **Release** to launch
- **Reset Level** button to try again
- **Next Level** button when completed

## 🔧 Development

### Adding New Levels

Levels are defined in `src/utils/levelLoader.ts`. Each level specifies:

- Seeker and Chalice positions
- Planet configurations
- Wormhole pairs
- Current flows
- Phase gates
- Debris clouds

### Physics System

The physics engine in `src/utils/physics.ts` handles:

- Gravitational forces
- Current acceleration
- Wormhole teleportation
- Phase gate collision detection
- Debris drag effects

### Rendering System

The rendering system in `src/utils/rendering.ts` provides:

- Smooth canvas rendering
- Glowing effects
- Animated elements
- Visual feedback

## 🎯 Future Features

- More complex levels with multiple mechanics
- Level editor
- Particle effects and sound
- Mobile touch support
- Level sharing system
- Achievement system

## 📝 License

This project is open source and available under the MIT License.
