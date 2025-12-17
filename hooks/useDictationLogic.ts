import { useState, useEffect, useCallback } from 'react';
import useDictationStore from '@/src/store/dictationStore';
import { compareSentences } from '@/src/utils/validation';
import { audioManager } from '@/src/utils/audio';

interface UseDictationLogicProps {
  onCorrectAnswer: () => void;
}

export const useDictationLogic = ({ onCorrectAnswer }: UseDictationLogicProps) => {
  const { sentences, currentIndex, nextSentence } = useDictationStore();
  const currentSentence = sentences[currentIndex] || '';

  // Generate blanks from original sentence, ignoring special characters
  const generateBlanks = useCallback((sentence: string): string => {
    return sentence
      .split('')
      .map((char) => {
        if (/[a-zA-Z0-9]/.test(char)) {
          return '-';
        }
        return char;
      })
      .join('');
  }, []);

  const [blanks, setBlanks] = useState(generateBlanks(currentSentence));
  const [userChars, setUserChars] = useState<string[]>([]);

  // Update blanks and userChars when currentSentence changes
  useEffect(() => {
    if (currentSentence) {
      const generatedBlanks = generateBlanks(currentSentence);
      setBlanks(generatedBlanks);
      setUserChars(new Array(generatedBlanks.length).fill(''));
    }
  }, [currentIndex, currentSentence, generateBlanks]);

  // Check if user input matches the original sentence
  useEffect(() => {
    if (currentSentence && compareSentences(currentSentence, userChars.join(''))) {
      onCorrectAnswer();
    }
  }, [userChars, currentSentence, onCorrectAnswer]);

  // Handle character input
  const handleCharacterInput = useCallback((char: string) => {
    setUserChars((prev) => {
      const newChars = [...prev];
      // Find the first empty position to fill
      for (let i = 0; i < newChars.length; i++) {
        if (newChars[i] === '' && (blanks[i] === '-' || (blanks[i] === ' ' && char === ' '))) {
          newChars[i] = char;
          break;
        }
      }
      return newChars;
    });
  }, [blanks]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    setUserChars((prev) => {
      const newChars = [...prev];
      // Find the last filled character
      for (let i = newChars.length - 1; i >= 0; i--) {
        if (newChars[i] !== '') {
          newChars[i] = '';
          break;
        }
      }
      return newChars;
    });
  }, []);

  // Play keypress sound
  const playKeypressSound = useCallback(() => {
    audioManager.playKeypressSound();
  }, []);

  return {
    currentSentence,
    blanks,
    userChars,
    handleCharacterInput,
    handleBackspace,
    playKeypressSound,
  };
};