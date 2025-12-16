"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Volume2, ChevronRight, Settings, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import useDictationStore from "@/src/store/dictationStore";
import { compareSentences } from "@/src/utils/validation";
import { audioManager } from "@/src/utils/audio";
import Confetti from "@/components/Confetti";

export default function Home() {
  const router = useRouter();
  const dictationAreaRef = useRef<HTMLDivElement>(null);
  const sentencesListRef = useRef<HTMLDivElement>(null);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isSentencesVisible, setIsSentencesVisible] = useState(false);

  const {
    sentences,
    currentIndex,
    setCurrentIndex,
    nextSentence,
    resetUserInput,
  } = useDictationStore();

  const currentSentence = sentences[currentIndex] || "";

  // Generate blanks from original sentence, ignoring special characters
  const generateBlanks = (sentence: string): string => {
    return sentence
      .split("")
      .map((char) => {
        if (/[a-zA-Z0-9]/.test(char)) {
          return "-";
        }
        return char;
      })
      .join("");
  };

  const replayAudio = useCallback(() => {
    audioManager.replayText(currentSentence);
  }, [currentSentence]);

  const handleCorrectAnswer = useCallback(() => {
    // Toggle confetti to ensure it triggers on each completion
    setIsConfettiActive(false);
    setTimeout(() => {
      setIsConfettiActive(true);
    }, 10);
    nextSentence();
  }, [nextSentence]);

  const [blanks, setBlanks] = useState(generateBlanks(currentSentence));
  const [userChars, setUserChars] = useState<string[]>([]);

  useEffect(() => {
    if (currentSentence) {
      audioManager.speakText(currentSentence);
      const generatedBlanks = generateBlanks(currentSentence);
      setBlanks(generatedBlanks);
      setUserChars(new Array(generatedBlanks.length).fill(""));

      // Auto-focus the dictation area when sentence changes
      setTimeout(() => {
        dictationAreaRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, currentSentence]);

  useEffect(() => {
    if (
      currentSentence &&
      compareSentences(currentSentence, userChars.join(""))
    ) {
      handleCorrectAnswer();
    }
  }, [userChars, currentSentence, handleCorrectAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault();
        replayAudio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSentence, replayAudio]);

  // Handle keyboard input for fill-in-the-blanks
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Cmd+R for replay
    if ((e.metaKey || e.ctrlKey) && e.key === "r") {
      e.preventDefault();
      replayAudio();
      return;
    }

    // Prevent default for non-navigation keys
    if (/^[a-zA-Z0-9 -]$/.test(e.key)) {
      e.preventDefault();
      audioManager.playKeypressSound();
      handleCharacterInput(e.key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
    }
  };

  // Handle character input
  const handleCharacterInput = (char: string) => {
    setUserChars((prev) => {
      const newChars = [...prev];
      // Find the first empty position to fill
      for (let i = 0; i < newChars.length; i++) {
        if (
          newChars[i] === "" &&
          (blanks[i] === "-" || (blanks[i] === " " && char === " "))
        ) {
          newChars[i] = char;
          break;
        }
      }
      return newChars;
    });
  };

  // Handle backspace
  const handleBackspace = () => {
    setUserChars((prev) => {
      const newChars = [...prev];
      // Find the last filled character
      for (let i = newChars.length - 1; i >= 0; i--) {
        if (newChars[i] !== "") {
          newChars[i] = "";
          break;
        }
      }
      return newChars;
    });
  };

  // Render the current display with filled characters and remaining blanks
  const renderDisplay = () => {
    // Find the first empty position overall (active position)
    const activeIndex = userChars.findIndex(char => char === "");
    const originalChars = currentSentence.split("");

    return blanks.split("").map((char, index) => {
      const userChar = userChars[index] || "";
      const displayChar = userChar || char;
      const isFilled = userChar !== "";
      // Only highlight if it's the active position AND it's a dash
      const isActive = index === activeIndex && blanks[index] === "-";
      // Check if filled character matches the original
      const isCorrect = isFilled && userChar.toLowerCase() === originalChars[index]?.toLowerCase();

      return (
        <span
          key={index}
          className={`inline-block w-6 text-center 
            ${isFilled
              ? isCorrect
                ? "text-green-500"
                : "text-red-500"
              : isActive
              ? "text-green-500 font-bold"
              : "text-foreground"}`}
        >
          {displayChar}
        </span>
      );
    });
  };

  const handleSentenceClick = (index: number) => {
    setCurrentIndex(index);
    resetUserInput();
  };

  // Handle list icon hover
  const handleListIconHover = () => {
    setIsSentencesVisible(true);
  };

  // Handle clicking the backdrop to close the sentences list
  const handleBackdropClick = () => {
    setIsSentencesVisible(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-30 ${isSentencesVisible ? 'right-80' : 'right-0'}`}>
        <div className="bg-card border-b border-border p-4 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">English Dictation Training</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/sentences")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
                {/* List Icon Button - Show when sentences list is hidden */}
                {!isSentencesVisible && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="transition-opacity duration-300"
                    onMouseEnter={handleListIconHover}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-2">
              <Progress 
                value={sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Progress</span>
                <span>{sentences.length > 0 ? `${currentIndex + 1} / ${sentences.length}` : '0 / 0'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dictation Area */}
      <div
        ref={dictationAreaRef}
        className="flex-1 flex flex-col items-center justify-center pt-24 pb-24 px-8 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => dictationAreaRef.current?.focus()}
      >
        <div className="w-full space-y-8">

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

            {/* Fill-in-the-Blanks Display */}
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <div className="text-2xl font-medium text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-1">
                  {renderDisplay()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Type the missing letters above
                </div>
              </div>
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

      {/* Original Sentence - Fixed at Bottom */}
      <div className={`fixed bottom-0 left-0 bg-card border-t border-border p-4 shadow-lg z-10 transition-all duration-300 ${isSentencesVisible ? 'right-80' : 'right-0'}`}>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Original Sentence
        </h3>
        <p className="text-lg font-medium">{currentSentence}</p>
      </div>

      {/* Backdrop Overlay */}
      {isSentencesVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-35 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sentence List - Hidden by default, shows on hover */}
      <div
        ref={sentencesListRef}
        className={`fixed top-0 right-0 w-80 h-screen bg-card border-l border-border flex flex-col max-h-screen transition-all duration-300 ease-in-out z-40 ${isSentencesVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Sentences ({sentences.length})</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sentences.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No sentences available
            </div>
          ) : (
            sentences.map((sentence, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={index}
                  className={
                    "px-4 py-3 rounded-md cursor-pointer transition-colors " +
                    (isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground")
                  }
                  onClick={() => handleSentenceClick(index)}
                >
                  <div className="truncate whitespace-nowrap overflow-hidden">
                    {sentence}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
