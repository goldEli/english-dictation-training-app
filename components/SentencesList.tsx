import { useEffect, useRef } from 'react';

interface SentencesListProps {
  isVisible: boolean;
  sentences: string[];
  currentIndex: number;
  onBackdropClick: () => void;
  onSentenceClick: (index: number) => void;
}

export const SentencesList = ({
  isVisible,
  sentences,
  currentIndex,
  onBackdropClick,
  onSentenceClick,
}: SentencesListProps) => {
  const sentencesListRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Backdrop Overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-35 transition-opacity duration-300"
          onClick={onBackdropClick}
        />
      )}

      {/* Sentence List - Hidden by default, shows on hover */}
      <div
        ref={sentencesListRef}
        className={`fixed top-0 right-0 w-80 h-screen bg-card border-l border-border flex flex-col max-h-screen transition-all duration-300 ease-in-out z-40 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
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
                  onClick={() => onSentenceClick(index)}
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
    </>
  );
};