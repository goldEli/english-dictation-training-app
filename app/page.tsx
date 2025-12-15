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
  const dictationAreaRef = useRef<HTMLDivElement>(null);
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
  
  // Generate blanks from original sentence, ignoring special characters
  const generateBlanks = (sentence: string): string => {
    return sentence.split('').map(char => {
      if (/[a-zA-Z0-9]/.test(char)) {
        return '-';
      }
      return char;
    }).join('');
  };

  const [blanks, setBlanks] = useState(generateBlanks(currentSentence));
  const [userChars, setUserChars] = useState<string[]>([]);

  useEffect(() => {
    if (currentSentence) {
      audioManager.speakText(currentSentence);
      const generatedBlanks = generateBlanks(currentSentence);
      setBlanks(generatedBlanks);
      setUserChars(new Array(generatedBlanks.length).fill(''));
      
      // Auto-focus the dictation area when sentence changes
      setTimeout(() => {
        dictationAreaRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, currentSentence]);

  useEffect(() => {
    if (currentSentence && compareSentences(currentSentence, userChars.join(''))) {
      handleCorrectAnswer();
    }
  }, [userChars, currentSentence]);

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

  // Handle keyboard input for fill-in-the-blanks
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Cmd+R for replay
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
      e.preventDefault();
      replayAudio();
      return;
    }

    // Prevent default for non-navigation keys
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
      e.preventDefault();
      audioManager.playKeypressSound();
      handleCharacterInput(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    }
  };

  // Handle character input
  const handleCharacterInput = (char: string) => {
    console.log('handleCharacterInput:', char);
    setUserChars(prev => {
      const newChars = [...prev];
      // Find the first empty or non-alphanumeric position to fill
      for (let i = 0; i < newChars.length; i++) {
        if (blanks[i] === '-' && newChars[i] === '') {
          newChars[i] = char;
          break;
        }
      }
      return newChars;
    });
  };

  // Handle backspace
  const handleBackspace = () => {
    setUserChars(prev => {
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
  };

  // Render the current display with filled characters and remaining blanks
  const renderDisplay = () => {
    return blanks.split('').map((char, index) => {
      const userChar = userChars[index] || '';
      const displayChar = userChar || char;
      const isFilled = userChar !== '';
      console.log('isFilled:', isFilled, 'char:', char, 'userChar:', userChar, 'displayChar:', displayChar, userChars);
      
      return (
        <span key={index} className={`inline-block w-6 text-center ${isFilled ? 'text-green-500' : 'text-foreground'}`}>
          {displayChar}
        </span>
      );
    });
  };

  const replayAudio = () => {
    audioManager.replayText(currentSentence);
  };

  const handleCorrectAnswer = () => {
    console.log('handleCorrectAnswer:', userChars);
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
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Dictation Area */}
      <div 
        ref={dictationAreaRef}
        className="flex-1 flex flex-col items-center justify-center p-8 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => dictationAreaRef.current?.focus()}
      >
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
      <div className="fixed bottom-0 left-0 right-80 bg-card border-t border-border p-4 shadow-lg z-10">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Original Sentence
        </h3>
        <p className="text-lg font-medium">
          {currentSentence}
        </p>
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
                  ${index === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"}
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
