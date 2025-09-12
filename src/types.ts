// FIX: Implemented the central type definitions for the application.
export enum LetterStatus {
  Correct = 'correct',
  Present = 'present',
  Absent = 'absent',
  Default = 'default',
}

export interface Guess {
  letters: string[];
  statuses: LetterStatus[];
}

export type GameMode = 'daily' | 'practice';
export type GameState = 'playing' | 'won' | 'lost';

export interface WordWithDefinition {
  word: string;
  definition: string;
}

export type AppTheme = 'light' | 'dark' | 'system';
export type Language = 'tr' | 'en' | 'ar';

export interface AppSettings {
  wordLength: number;
  language: Language;
  theme: AppTheme;
  hapticsEnabled: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number };
}

export interface DailyChallengeState {
  solution: WordWithDefinition;
  guesses: Guess[];
  gameState: GameState;
  date: string;
}
