
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameBoard } from '../../../components/GameBoard';
import { Keyboard } from '../../../components/Keyboard';
import { GameModal } from '../../../components/GameModal';
import { Loader } from '../../../components/Loader';
import { Toast } from '../../../components/Toast';
import Header from '../../../components/Header';
import { HowToPlayModal } from '../../components/HowToPlayModal';
import { DailySummaryModal } from '../../components/DailySummaryModal';
import { Guess, LetterStatus, GameMode, GameState, GameStats, WordWithDefinition } from '../../types';
import { MAX_GUESSES } from '../../../constants';
import { useSettings } from '../../hooks/useSettings';
import { fetchWordForGame } from '../../services/wordService';
import * as dailyChallengeService from '../../services/dailyChallengeService';
import * as statsService from '../../services/statsService';
import { playSound } from '../../services/soundService';
import { tr_words } from '../../seed/tr_extended';
import { en_words } from '../../seed/en_extended';
import { ar_words } from '../../seed/ar_extended';
import { AdsenseAd } from '../../components/AdsenseAd';

interface GameScreenProps {
  gameMode: GameMode;
  onBack: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameMode, onBack }) => {
  const { settings, t } = useSettings();
  const { wordLength, language } = settings;

  const wordList = useMemo(() => {
    const words = language === 'en' ? en_words : language === 'ar' ? ar_words : tr_words;
    return new Set(words.map(w => w.word.toUpperCase()));
  }, [language]);

  const [solution, setSolution] = useState<WordWithDefinition | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: LetterStatus }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakeCurrentRow, setShakeCurrentRow] = useState(false);
  
  const [isPracticeModalOpen, setPracticeModalOpen] = useState(false);
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
  const [isHowToPlayOpen, setHowToPlayOpen] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  const [stats, setStats] = useState<GameStats>(statsService.loadStats(language));
  const [announcement, setAnnouncement] = useState('');

  const startNewGame = useCallback((newWord: WordWithDefinition) => {
    setSolution(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setKeyStatuses({});
    setIsLoading(false);
    setPracticeModalOpen(false);
    setSummaryModalOpen(false);
  }, []);

  useEffect(() => {
    const firstTime = !localStorage.getItem('islamicWordlePlayedBefore');
    if (firstTime) {
      setHowToPlayOpen(true);
      localStorage.setItem('islamicWordlePlayedBefore', 'true');
    }
    
    setIsLoading(true);
    if (gameMode === 'daily') {
      const dailyState = dailyChallengeService.loadDailyChallengeState(language);
      const dailyWord = dailyChallengeService.getDailyWord(wordLength, language);

      if (dailyState && dailyState.solution.word.toUpperCase() === dailyWord.word.toUpperCase()) {
        setSolution(dailyState.solution);
        setGuesses(dailyState.guesses);
        setGameState(dailyState.gameState);
        
        const initialStatuses = {};
        const finalStatuses = dailyState.guesses.reduce((acc, guess) => {
            const newStatuses = { ...acc };
            guess.letters.forEach((letter, i) => {
                const status = guess.statuses[i];
                const existing = newStatuses[letter];
                if (existing === LetterStatus.Correct) return;
                if (existing === LetterStatus.Present && status === LetterStatus.Absent) return;
                newStatuses[letter] = status;
            });
            return newStatuses;
        }, initialStatuses);
        setKeyStatuses(finalStatuses);
        
        if (dailyState.gameState !== 'playing') {
          setTimeout(() => setSummaryModalOpen(true), 500);
        }
        setIsLoading(false);
      } else {
        startNewGame(dailyWord);
      }
    } else { // practice mode
      startNewGame(fetchWordForGame(wordLength, language));
    }
    setStats(statsService.loadStats(language));
  }, [gameMode, wordLength, startNewGame, language]);


  const showToast = (message: string, duration = 1500) => {
    setToastMessage(message);
  };
  
  const getGuessWithStatuses = (guess: string, sol: string): Guess => {
    const guessLetters = guess.split('');
    const solutionLetters = sol.split('');
    const statuses: LetterStatus[] = Array(wordLength).fill(LetterStatus.Absent);
    const letterCounts = solutionLetters.reduce((acc, letter) => {
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    guessLetters.forEach((letter, i) => {
        if (letter === solutionLetters[i]) {
            statuses[i] = LetterStatus.Correct;
            letterCounts[letter]--;
        }
    });

    guessLetters.forEach((letter, i) => {
        if (statuses[i] !== LetterStatus.Correct && solutionLetters.includes(letter) && letterCounts[letter] > 0) {
            statuses[i] = LetterStatus.Present;
            letterCounts[letter]--;
        }
    });
    
    return { letters: guessLetters, statuses };
  };

  const updateKeyStatuses = (guess: Guess) => {
    setKeyStatuses(prev => {
        const newStatuses = { ...prev };
        guess.letters.forEach((letter, i) => {
            const status = guess.statuses[i];
            const existingStatus = newStatuses[letter];
            if (existingStatus === LetterStatus.Correct) return;
            if (existingStatus === LetterStatus.Present && status === LetterStatus.Absent) return;
            newStatuses[letter] = status;
        });
        return newStatuses;
    });
  };

  const submitGuess = () => {
    if (!solution) return;

    if (currentGuess.length !== wordLength) {
      setShakeCurrentRow(true);
      setTimeout(() => setShakeCurrentRow(false), 600);
      showToast(t('notEnoughLetters'));
      playSound('error', settings.hapticsEnabled);
      return;
    }

    if (!wordList.has(currentGuess)) {
       setShakeCurrentRow(true);
       setTimeout(() => setShakeCurrentRow(false), 600);
       showToast(t('notInWordList'));
       playSound('error', settings.hapticsEnabled);
       return;
    }
    
    setIsRevealing(true);
    const newGuess = getGuessWithStatuses(currentGuess, solution.word);
    
    setTimeout(() => {
        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');
        updateKeyStatuses(newGuess);
        setIsRevealing(false);

        const isWin = newGuess.letters.join('') === solution.word;
        const isLoss = newGuesses.length === MAX_GUESSES && !isWin;

        const guessNumber = newGuesses.length;
        const statusWords = newGuess.statuses.map(status =>
            t('status' + status.charAt(0).toUpperCase() + status.slice(1))
        ).join(', ');
        const guessSummaryText = t('guessSummary').replace('{guessNum}', String(guessNumber));
        const resultAnnouncement = `${guessSummaryText}: ${statusWords}`;
        setAnnouncement(resultAnnouncement);

        if (isWin) {
            setGameState('won');
            setAnnouncement(prev => `${prev}. ${t('modalWinTitle')}`);
            playSound('win', settings.hapticsEnabled);
        } else if (isLoss) {
            setGameState('lost');
            setAnnouncement(prev => `${prev}. ${t('modalLossTitle')}. ${t('modalSolutionIs')} ${solution.word}`);
            playSound('lose', settings.hapticsEnabled);
            setShakeScreen(true);
            setTimeout(() => setShakeScreen(false), 600);
        } else {
            playSound('guess', settings.hapticsEnabled);
        }

        if (gameMode === 'daily' && (isWin || isLoss)) {
            dailyChallengeService.saveDailyChallengeState(solution, newGuesses, isWin ? 'won' : 'lost', language);
            const updatedStats = statsService.updateStats(isWin, newGuesses.length, language);
            setStats(updatedStats);
        }

    }, wordLength * 100 + 100);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing' || isRevealing) return;

    if (key === 'Enter') {
      submitGuess();
      return;
    }

    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    const isValidKey = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\u0600-\u06FF]$/.test(key);
    if (isValidKey && currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key.toUpperCase());
      playSound('keyPress', settings.hapticsEnabled);
    }
  }, [gameState, isRevealing, currentGuess, wordLength, settings, t, submitGuess, wordList, solution]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (isHowToPlayOpen || isPracticeModalOpen || isSummaryModalOpen) return;
        handleKeyPress(event.key);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, isHowToPlayOpen, isPracticeModalOpen, isSummaryModalOpen]);
  
  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      setTimeout(() => {
        if (gameMode === 'daily') {
          setSummaryModalOpen(true);
        } else {
          setPracticeModalOpen(true);
        }
      }, wordLength * 100 + 500);
    }
  }, [gameState, gameMode, wordLength]);

  const handlePlayAgain = () => {
    setIsLoading(true);
    startNewGame(fetchWordForGame(wordLength, language));
  };
  
  if (isLoading || !solution) {
    return <Loader />;
  }

  return (
    <div className={`flex flex-col flex-grow w-full max-w-lg mx-auto ${shakeScreen ? 'animate-shake' : ''}`}>
      <div className="absolute w-px h-px overflow-hidden" style={{clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)'}} aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <Header onBack={onBack} onShowHelp={() => setHowToPlayOpen(true)} gameMode={gameMode} onRandomize={handlePlayAgain} />
      {toastMessage && <Toast message={toastMessage} onHide={() => setToastMessage('')} />}
      <main className="flex-grow flex flex-col justify-center items-center">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          wordLength={wordLength}
          isRevealing={isRevealing}
          shakeCurrentRow={shakeCurrentRow}
          gameState={gameState}
        />
      </main>
      <div className="mt-auto">
        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />
        <AdsenseAd />
      </div>
      {gameMode === 'practice' && (
        <GameModal
          isOpen={isPracticeModalOpen}
          isWin={gameState === 'won'}
          solution={solution.word}
          solutionDefinition={solution.definition}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {gameMode === 'daily' && (
          <DailySummaryModal
            isOpen={isSummaryModalOpen}
            onClose={() => setSummaryModalOpen(false)}
            stats={stats}
            solution={solution.word}
            solutionDefinition={solution.definition}
            guesses={guesses}
            isWin={gameState === 'won'}
          />
      )}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
      />
    </div>
  );
};

export default GameScreen;