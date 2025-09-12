import React from 'react';
import { Guess } from '../src/types';
import { Tile } from './Tile';
import { MAX_GUESSES } from '../constants';

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: string;
  wordLength: number;
  isRevealing: boolean;
  shakeCurrentRow: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, wordLength, isRevealing, shakeCurrentRow }) => {
  const emptyRows = guesses.length < MAX_GUESSES - 1
    ? Array.from(Array(MAX_GUESSES - 1 - guesses.length))
    : [];
  
  const currentRowClass = shakeCurrentRow ? 'animate-shake' : '';

  return (
    <div className="flex flex-col gap-1.5 p-2 md:p-4">
      {guesses.map((guess, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {guess.letters.map((letter, j) => (
            <Tile
              key={j}
              letter={letter}
              status={guess.statuses[j]}
              isRevealing={isRevealing && guesses.length - 1 === i}
              animationDelay={j * 100}
              isSubmitted
            />
          ))}
        </div>
      ))}

      {guesses.length < MAX_GUESSES && (
        <div className={`flex gap-1.5 justify-center ${currentRowClass}`}>
          {Array.from(Array(wordLength)).map((_, i) => (
            <Tile
              key={i}
              letter={currentGuess[i] || ''}
              isTyped={!!currentGuess[i]}
            />
          ))}
        </div>
      )}

      {emptyRows.map((_, i) => (
        <div key={i} className="flex gap-1.5 justify-center">
          {Array.from(Array(wordLength)).map((_, j) => (
            <Tile key={j} letter="" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;