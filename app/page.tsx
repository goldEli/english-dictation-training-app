'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Volume2, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDictationStore from '@/src/store/dictationStore';
import { compareSentences } from '@/src/utils/validation';
import { audioManager } from '@/src/utils/audio';

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
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

  const currentSentence = sentences[currentIndex] || '';

  useEffect(() => {
    inputRef.current?.focus();
    if (currentSentence) {
      audioManager.speakText(currentSentence);
    }
  }, [currentIndex, currentSentence]);

  useEffect(() => {
    if (currentSentence && compareSentences(currentSentence, userInput)) {
      handleCorrectAnswer();
    }
  }, [userInput, currentSentence]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        replayAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSentence]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioManager.playKeypressSound();
    setUserInput(e.target.value);
  };

  const replayAudio = () => {
    audioManager.replayText(currentSentence);
  };

  const handleCorrectAnswer = () => {
    setIsConfettiActive(true);
    setTimeout(() => {
      setIsConfettiActive(false);
      nextSentence();
    }, 1500);
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
              onClick={() => router.push('/sentences')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Listen and type the sentence</h2>
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
                {currentSentence}
              </div>
              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the sentence here..."
                className="text-lg h-12"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={replayAudio}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Replay Audio
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/sentences')}
                className="gap-2 ml-auto"
              >
                Sentence Management
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Confetti Effect */}
        {isConfettiActive && (
          <div className="fixed inset-0 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  animation: `fall ${3 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `translateY(-100vh) rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
            <style jsx>{`
              @keyframes fall {
                to {
                  transform: translateY(100vh) rotate(${360}deg);
                }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Sentence List */}
      <div className="w-80 bg-card border-l border-border flex flex-col">
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
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-foreground'}
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
