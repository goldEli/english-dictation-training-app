import { useState, useCallback } from 'react';
import useDictationStore from '@/src/store/dictationStore';

export const useSentencesList = () => {
  const { sentences, currentIndex, setCurrentIndex } = useDictationStore();
  const [isSentencesVisible, setIsSentencesVisible] = useState(false);

  // Handle list icon hover to show the list
  const handleListIconHover = useCallback(() => {
    setIsSentencesVisible(true);
  }, []);

  // Handle clicking the backdrop to close the list
  const handleBackdropClick = useCallback(() => {
    setIsSentencesVisible(false);
  }, []);

  // Handle sentence selection
  const handleSentenceClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsSentencesVisible(false);
  }, [setCurrentIndex]);

  return {
    isSentencesVisible,
    sentences,
    currentIndex,
    handleListIconHover,
    handleBackdropClick,
    handleSentenceClick,
  };
};