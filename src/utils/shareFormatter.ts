// FIX: Implemented the share formatter utility.
import { Guess, LetterStatus } from '../types';

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
  language: string
): string => {
  const title = `İslami Wordle (${language.toUpperCase()}) ${isDaily ? new Date().toLocaleDateString(language) : ''}`;
  const attemptCount = isWin ? guesses.length : 'X';
  const header = `${title} ${attemptCount}/6\n`;

  const grid = guesses
    .map(guess =>
      guess.statuses.map(status => emojiMap[status]).join('')
    )
    .join('\n');
    
  return `${header}\n${grid}\n\n`;
};
