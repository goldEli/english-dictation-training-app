"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useDictationStore from "@/src/store/dictationStore";
import { compareSentences, normalizeString } from "@/src/utils/validation";
import { audioManager } from "@/src/utils/audio";
import Confetti from "@/components/Confetti";

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const {
    sentences,
    currentIndex,
    userInput,
    setCurrentIndex,
    nextSentence,
    setUserInput,
    resetUserInput,
  } = useDictationStore();

  const currentSentence = sentences[currentIndex] || "";
  const originalWords = currentSentence.split(" ");
  const [correctWords, setCorrectWords] = useState<boolean[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    if (currentSentence) {
      audioManager.speakText(currentSentence);
      setCorrectWords(new Array(originalWords.length).fill(false));
    }
  }, [currentIndex, currentSentence, originalWords.length]);

  useEffect(() => {
    if (currentSentence && compareSentences(currentSentence, userInput)) {
      handleCorrectAnswer();
    } else {
      // Validate words individually
      const userWords = userInput.split(" ");
      const newCorrectWords = originalWords.map((originalWord, index) => {
        if (index >= userWords.length) return false;
        const normalizedOriginal = normalizeString(originalWord);
        const normalizedUser = normalizeString(userWords[index]);
        return normalizedOriginal === normalizedUser;
      });
      setCorrectWords(newCorrectWords);
    }
  }, [userInput, currentSentence, originalWords]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault();
        replayAudio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSentence]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    audioManager.playKeypressSound();
    setUserInput(e.target.value);
  };

  const replayAudio = () => {
    audioManager.replayText(currentSentence);
  };

  const handleCorrectAnswer = () => {
    // Toggle confetti to ensure it triggers on each completion
    setIsConfettiActive(false);
    setTimeout(() => {
      setIsConfettiActive(true);
    }, 10);
    nextSentence();
  };

  const handleSentenceClick = (index: number) => {
    setCurrentIndex(index);
    resetUserInput();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Dictation Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">English Dictation Training</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/sentences")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Listen and type the sentence
              </h2>
              <Button
                variant="default"
                size="sm"
                onClick={replayAudio}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Listen Again (⌘+R)
              </Button>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 text-lg font-medium">
                <div className="flex flex-wrap gap-1">
                  {originalWords.map((word, index) => (
                    <span
                      key={index}
                      className={`${
                        correctWords[index]
                          ? "text-green-500"
                          : "text-foreground"
                      } transition-colors`}
                    >
                      {word}
                      {index < originalWords.length - 1 && " "}
                    </span>
                  ))}
                </div>
              </div>
              <Textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the sentence here..."
                className="text-lg"
                rows={3}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button variant="default" onClick={replayAudio} className="gap-2">
                <Volume2 className="h-4 w-4" />
                Replay Audio
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/sentences")}
                className="gap-2 ml-auto"
              >
                Sentence Management
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Confetti Effect */}
        <Confetti
          isActive={isConfettiActive}
          onComplete={() => setIsConfettiActive(false)}
          duration={2500}
          pieceCount={80}
        />
      </div>

      {/* Sentence List */}
      <div className="w-80 bg-card border-l border-border flex flex-col max-h-screen">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Sentences ({sentences.length})</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sentences.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No sentences available
            </div>
          ) : (
            sentences.map((sentence, index) => (
              <div
                key={index}
                className={`
                  px-4 py-3 rounded-md cursor-pointer transition-colors
                  ${
                    index === currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  }
                `}
                onClick={() => handleSentenceClick(index)}
              >
                <div className="truncate whitespace-nowrap overflow-hidden">
                  {sentence}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
