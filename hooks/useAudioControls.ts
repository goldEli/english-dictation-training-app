import { useCallback, useEffect } from 'react';
import { audioManager } from '@/src/utils/audio';

interface UseAudioControlsProps {
  currentSentence: string;
}

export const useAudioControls = ({ currentSentence }: UseAudioControlsProps) => {
  // Handle audio playback when currentSentence changes
  useEffect(() => {
    if (currentSentence) {
      audioManager.speakText(currentSentence);
    }
  }, [currentSentence]);

  // Replay audio for current sentence
  const replayAudio = useCallback(() => {
    audioManager.replayText(currentSentence);
  }, [currentSentence]);

  // Set up global keyboard shortcut for replay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        replayAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [replayAudio]);

  return {
    replayAudio,
  };
};