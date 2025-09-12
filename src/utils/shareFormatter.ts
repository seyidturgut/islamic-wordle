
import { Guess, LetterStatus } from "../types";
import { MAX_GUESSES } from "../../constants";

const statusToEmoji = {
    [LetterStatus.Correct]: '🟩',
    [LetterStatus.Present]: '🟨',
    [LetterStatus.Absent]: '⬛',
    [LetterStatus.Default]: '⬜',
};

export const formatShareText = (guesses: Guess[], isWin: boolean): string => {
    const title = `İslami Wordle - ${isWin ? guesses.length : 'X'}/${MAX_GUESSES}`;
    
    const grid = guesses.map(guess => 
        guess.statuses.map(status => statusToEmoji[status]).join('')
    ).join('\n');

    return `${title}\n\n${grid}`;
};