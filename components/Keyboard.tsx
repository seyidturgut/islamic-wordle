import React from 'react';
import { LetterStatus } from '../src/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: { [key: string]: LetterStatus };
}

const Key: React.FC<{
  value: string;
  status?: LetterStatus;
  onKeyPress: (key: string) => void;
  flex?: number;
  isSpecial?: boolean;
}> = ({ value, status, onKeyPress, flex = 1, isSpecial }) => {
  const baseClasses = `h-14 rounded-md font-bold flex items-center justify-center m-0.5 sm:m-1 cursor-pointer transition-colors duration-200 select-none`;
  const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-gray-900";
  const statusClasses = {
    [LetterStatus.Correct]: 'bg-emerald-600 text-white border-transparent',
    [LetterStatus.Present]: 'bg-amber-500 text-white border-transparent',
    [LetterStatus.Absent]: 'bg-gray-800 dark:bg-gray-700 text-white border-transparent',
  };
  const defaultClasses = isSpecial 
    ? 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white'
    : 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-400 text-black dark:text-white';


  const classes = `${baseClasses} ${status !== undefined ? statusClasses[status] : defaultClasses} ${focusClasses}`;
  
  let content;
  let textAndCaseClasses = 'uppercase text-sm sm:text-base';
  
  if (value === 'Backspace') {
    content = '⌫';
    textAndCaseClasses = 'text-2xl normal-case';
  } else if (value === 'Enter') {
    content = value;
    textAndCaseClasses = 'uppercase text-xs sm:text-sm';
  } else {
    content = value;
  }

  return (
    <button
      className={classes}
      style={{ flex: `${flex} 1 0` }}
      onClick={() => onKeyPress(value)}
      aria-label={value}
    >
      <span className={textAndCaseClasses}>{content}</span>
    </button>
  );
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  const row1 = ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'];
  const row3 = ['Enter', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'Backspace'];
  
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center mt-4 md:mt-8 px-1 sm:px-0 pb-4">
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 1">
        {row1.map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key]} />)}
      </div>
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 2">
        {row2.map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key]} />)}
      </div>
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 3">
        <Key value="Enter" onKeyPress={onKeyPress} flex={1.5} isSpecial />
        {row3.slice(1, -1).map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key]} />)}
        <Key value="Backspace" onKeyPress={onKeyPress} flex={1.5} isSpecial />
      </div>
    </div>
  );
};