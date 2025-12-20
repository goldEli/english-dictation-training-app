import { useRef, useCallback, useEffect } from 'react';
import { Volume2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DictationDisplay } from './DictationDisplay';

interface DictationAreaProps {
  blanks: string;
  userChars: string[];
  currentSentence: string;
  isFavorited: boolean;
  replayAudio: () => void;
  onSkip: () => void;
  onToggleFavorite: () => void;
  onCharacterInput: (char: string) => void;
  onBackspace: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  playKeypressSound: () => void;
}

export const DictationArea = ({
  blanks,
  userChars,
  currentSentence,
  isFavorited,
  replayAudio,
  onSkip,
  onToggleFavorite,
  onCharacterInput,
  onBackspace,
  onKeyDown,
  playKeypressSound,
}: DictationAreaProps) => {
  const dictationAreaRef = useRef<HTMLDivElement>(null);

  // Auto-focus the dictation area when component mounts
  useEffect(() => {
    setTimeout(() => {
      dictationAreaRef.current?.focus();
    }, 100);
  }, []);

  // Handle keyboard input for fill-in-the-blanks
  const handleLocalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Cmd+R for replay
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        replayAudio();
        return;
      }

      // Prevent default for non-navigation keys
      if (/^[a-zA-Z0-9 -]$/.test(e.key)) {
        e.preventDefault();
        playKeypressSound();
        onCharacterInput(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onBackspace();
      }

      // Call external onKeyDown handler if provided
      onKeyDown(e);
    },
    [replayAudio, onCharacterInput, onBackspace, onKeyDown, playKeypressSound]
  );

  return (
    <div
      ref={dictationAreaRef}
      className="flex-1 flex flex-col items-center justify-center pt-24 pb-24 px-8 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
      tabIndex={0}
      onKeyDown={handleLocalKeyDown}
      onClick={() => dictationAreaRef.current?.focus()}
    >
      <div className="w-full space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-between">
            <h2 className="text-xl font-semibold">
              Listen and type the sentence
            </h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={replayAudio}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Listen Again (⌘+R)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onToggleFavorite}
                className={`gap-2 ${isFavorited ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onSkip}
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Fill-in-the-Blanks Display */}
          <div className="bg-card rounded-lg p-8 shadow-sm">
            <div className="text-2xl font-medium text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-1">
                <DictationDisplay
                  blanks={blanks}
                  userChars={userChars}
                  currentSentence={currentSentence}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Type the missing letters above
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};