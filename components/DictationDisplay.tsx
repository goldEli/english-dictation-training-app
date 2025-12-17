interface DictationDisplayProps {
  blanks: string;
  userChars: string[];
  currentSentence: string;
}

export const DictationDisplay = ({ blanks, userChars, currentSentence }: DictationDisplayProps) => {
  // Find the first empty position overall (active position)
  const activeIndex = userChars.findIndex(char => char === '');
  const originalChars = currentSentence.split('');

  return blanks.split('').map((char, index) => {
    const userChar = userChars[index] || '';
    const displayChar = userChar || char;
    const isFilled = userChar !== '';
    // Only highlight if it's the active position AND it's a dash
    const isActive = index === activeIndex && blanks[index] === '-';
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