interface OriginalSentenceProps {
  isSentencesVisible: boolean;
  currentSentence: string;
}

export const OriginalSentence = ({ isSentencesVisible, currentSentence }: OriginalSentenceProps) => {
  return (
    <div className={`fixed bottom-0 left-0 bg-card border-t border-border p-4 shadow-lg z-10 transition-all duration-300 ${isSentencesVisible ? 'right-80' : 'right-0'}`}>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        Original Sentence
      </h3>
      <p className="text-lg font-medium">{currentSentence}</p>
    </div>
  );
};