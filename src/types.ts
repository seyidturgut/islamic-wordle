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

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number };
}

export type AppTheme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: AppTheme;
  language: 'tr' | 'en' | 'ar';
  wordLength: number;
  hapticsEnabled: boolean;
}

export type GameMode = 'daily' | 'practice';

export type GameState = 'playing' | 'won' | 'lost';

export interface DailyChallengeState {
  solution: string;
  date: string; // YYYY-MM-DD
  guesses: Guess[];
  gameState: GameState;
}