"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import useDictationStore from "@/src/store/dictationStore";
import Confetti from "@/components/Confetti";

// Hooks
import { useDictationLogic } from "@/hooks/useDictationLogic";
import { useSentencesList } from "@/hooks/useSentencesList";
import { useAudioControls } from "@/hooks/useAudioControls";
import { useProgressCalculation } from "@/hooks/useProgressCalculation";

// Components
import { Header } from "@/components/Header";
import { DictationArea } from "@/components/DictationArea";
import { OriginalSentence } from "@/components/OriginalSentence";
import { SentencesList } from "@/components/SentencesList";

export default function Home() {
  const router = useRouter();
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const { nextSentence, favoriteSentences, toggleFavorite } = useDictationStore();

  // Handle correct answer with confetti effect
  const handleCorrectAnswer = useCallback(() => {
    // Toggle confetti to ensure it triggers on each completion
    setIsConfettiActive(false);
    setTimeout(() => {
      setIsConfettiActive(true);
    }, 10);
    nextSentence();
  }, [nextSentence]);

  // Initialize hooks
  const { 
    currentSentence, 
    blanks, 
    userChars, 
    handleCharacterInput, 
    handleBackspace,
    playKeypressSound
  } = useDictationLogic({ onCorrectAnswer: handleCorrectAnswer });

  const { 
    isSentencesVisible, 
    sentences, 
    currentIndex, 
    handleListIconHover, 
    handleBackdropClick, 
    handleSentenceClick 
  } = useSentencesList();

  const { replayAudio } = useAudioControls({ currentSentence });
  const { progressPercentage, progressText } = useProgressCalculation();

  // Handle settings button click
  const handleSettingsClick = useCallback(() => {
    router.push("/sentences");
  }, [router]);

  // Handle keyboard events
  const handleKeyDown = useCallback(() => {
    // Keyboard events are handled internally by DictationArea
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Header */}
      <Header
        isSentencesVisible={isSentencesVisible}
        progressPercentage={progressPercentage}
        progressText={progressText}
        onSettingsClick={handleSettingsClick}
        onListIconHover={handleListIconHover}
      />

      {/* Dictation Area */}
      <DictationArea
        blanks={blanks}
        userChars={userChars}
        currentSentence={currentSentence}
        isFavorited={favoriteSentences.includes(currentSentence)}
        replayAudio={replayAudio}
        onSkip={nextSentence}
        onToggleFavorite={toggleFavorite}
        onCharacterInput={handleCharacterInput}
        onBackspace={handleBackspace}
        onKeyDown={handleKeyDown}
        playKeypressSound={playKeypressSound}
      />

      {/* Original Sentence */}
      <OriginalSentence
        isSentencesVisible={isSentencesVisible}
        currentSentence={currentSentence}
      />

      {/* Sentences List */}
      <SentencesList
        isVisible={isSentencesVisible}
        sentences={sentences}
        currentIndex={currentIndex}
        onBackdropClick={handleBackdropClick}
        onSentenceClick={handleSentenceClick}
      />

      {/* Confetti Effect */}
      <Confetti
        isActive={isConfettiActive}
        onComplete={() => setIsConfettiActive(false)}
        duration={2500}
        pieceCount={80}
      />
    </div>
  );
}
