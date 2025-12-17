import { useMemo } from 'react';
import useDictationStore from '@/src/store/dictationStore';

export const useProgressCalculation = () => {
  const { sentences, currentIndex } = useDictationStore();

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (sentences.length === 0) return 0;
    return ((currentIndex + 1) / sentences.length) * 100;
  }, [sentences.length, currentIndex]);

  // Format progress text
  const progressText = useMemo(() => {
    return `${currentIndex + 1} / ${sentences.length}`;
  }, [sentences.length, currentIndex]);

  return {
    progressPercentage,
    progressText,
  };
};