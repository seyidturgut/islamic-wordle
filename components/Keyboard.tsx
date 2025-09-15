

import React from 'react';
// FIX: Corrected import path for types to use the root re-exporting types.ts
import { LetterStatus } from '../types';
import { useSettings } from '../src/hooks/useSettings';

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
  isArabic: boolean;
  specialKeyText?: string;
}> = ({ value, status, onKeyPress, flex = 1, isSpecial, isArabic, specialKeyText }) => {
  const baseClasses = `h-12 rounded-md font-bold flex items-center justify-center m-1 cursor-pointer transition-all duration-100 select-none`;
  const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E96306] dark:focus-visible:ring-offset-[#121212]";
  const pressClasses = "active:scale-95 active:brightness-90";
  const statusClasses = {
    [LetterStatus.Correct]: 'bg-[#E96306] text-white border-transparent',
    [LetterStatus.Present]: 'bg-[#FFC857] text-gray-900 border-transparent',
    [LetterStatus.Absent]: 'bg-[#444444] text-white border-transparent',
  };
  const defaultClasses = isSpecial 
    ? 'bg-gray-400 dark:bg-[#3A3A3A] hover:bg-gray-500 dark:hover:bg-[#444444] text-white'
    : 'bg-gray-300 dark:bg-[#2A2A2A] hover:bg-gray-400 dark:hover:bg-[#333333] text-black dark:text-[#F5F5F5]';


  const classes = `${baseClasses} ${status !== undefined ? statusClasses[status] : defaultClasses} ${focusClasses} ${pressClasses}`;
  
  let content;
  let textAndCaseClasses: string;
  
  if (value === 'Backspace') {
    content = '⌫';
    textAndCaseClasses = 'text-2xl normal-case';
  } else if (value === 'Enter') {
    content = specialKeyText;
    textAndCaseClasses = isArabic ? 'text-base normal-case' : 'uppercase text-xs sm:text-sm';
  } else {
    content = value;
    textAndCaseClasses = isArabic ? 'text-xl normal-case' : 'uppercase text-sm sm:text-base';
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
  // FIX: The `useSettings` hook now provides `settings` and `t`.
  const { settings, t } = useSettings();
  const isArabic = settings.language === 'ar';

  const layouts = {
    tr: {
      row1: ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
      row3: ['Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'],
    },
    en: {
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    },
    ar: {
      row1: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
      row2: ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك'],
      row3: ['ظ', 'ط', 'ذ', 'د', 'ز', 'ر', 'و', 'ة', 'ى'],
    }
  };

  const layout = layouts[settings.language] || layouts.tr;
  const { row1, row2, row3 } = layout;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center px-1 sm:px-0 pb-2">
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 1">
        {row1.map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key.toUpperCase()]} isArabic={isArabic} />)}
      </div>
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 2">
        {row2.map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key.toUpperCase()]} isArabic={isArabic} />)}
      </div>
      <div role="group" className="w-full flex justify-center" aria-label="Keyboard row 3">
        <Key value="Enter" onKeyPress={onKeyPress} flex={1.5} isSpecial isArabic={isArabic} specialKeyText={t('Enter')} />
        {row3.map(key => <Key key={key} value={key} onKeyPress={onKeyPress} status={keyStatuses[key.toUpperCase()]} isArabic={isArabic} />)}
        <Key value="Backspace" onKeyPress={onKeyPress} flex={1.5} isSpecial isArabic={isArabic} />
      </div>
    </div>
  );
};