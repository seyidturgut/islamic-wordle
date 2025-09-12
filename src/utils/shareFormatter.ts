// FIX: Implemented the share formatter utility.
import { Guess, LetterStatus, Badge } from '../types';

const emojiMap: { [key in LetterStatus]: string } = {
  [LetterStatus.Correct]: '🟩',
  [LetterStatus.Present]: '🟨',
  [LetterStatus.Absent]: '⬛',
  [LetterStatus.Default]: '⬜',
};

export const formatShareText = (
  solution: string,
  guesses: Guess[],
  isWin: boolean,
  isDaily: boolean,
  language: string,
  newlyUnlockedBadge: Badge | null,
  t: (key: string) => string,
): string => {
  const title = `İslami Wordle (${language.toUpperCase()}) ${isDaily ? new Date().toLocaleDateString(language) : ''}`;
  const attemptCount = isWin ? guesses.length : 'X';
  const header = `${title} ${attemptCount}/6\n`;

  const grid = guesses
    .map(guess =>
      guess.statuses.map(status => emojiMap[status]).join('')
    )
    .join('\n');
    
  let badgeText = '';
  if (newlyUnlockedBadge) {
    badgeText = `\n\n🏆 ${t('unlockedBadge')}: ${t(newlyUnlockedBadge.nameKey)}`;
  }
    
  return `${header}\n${grid}${badgeText}\n\n`;
};