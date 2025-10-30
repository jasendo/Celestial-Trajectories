const STORAGE_KEY = 'celestial_trajectories_progress';

export interface GameProgress {
  unlockedLevels: number;
  completedLevels: number[];
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error);
  }
}

export function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        unlockedLevels: parsed.unlockedLevels || 1,
        completedLevels: parsed.completedLevels || [],
      };
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error);
  }
  
  // Default progress - only level 1 unlocked
  return {
    unlockedLevels: 1,
    completedLevels: [],
  };
}

export function unlockNextLevel(currentUnlocked: number, completedLevels: number[]): number {
  // Only unlock the next level if the current highest unlocked level is completed
  const highestCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const nextLevel = highestCompleted + 1;
  
  // Only unlock if the next level is higher than currently unlocked and within bounds
  if (nextLevel > currentUnlocked && nextLevel <= 8) {
    return nextLevel;
  }
  
  return currentUnlocked;
}

export function markLevelCompleted(levelNumber: number, completedLevels: number[]): number[] {
  if (!completedLevels.includes(levelNumber)) {
    return [...completedLevels, levelNumber].sort((a, b) => a - b);
  }
  return completedLevels;
} 