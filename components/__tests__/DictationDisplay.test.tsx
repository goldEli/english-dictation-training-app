import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DictationDisplay } from '../DictationDisplay';

describe('DictationDisplay', () => {
  const mockSentence = 'Hello world';
  const mockBlanks = '----- -----';

  it('should render correctly with empty user input', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['', '', '', '', '', '', '', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(11); // 5 dashes + 1 space + 5 dashes
  });

  it('should display correct characters in green', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['h', 'e', 'l', 'l', 'o', ' ', 'w', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Check the first 4 letters are green
    for (let i = 0; i < 5; i++) {
      expect(spans[i]).toHaveClass('text-green-500');
    }
    // Check the 'w' is green
    expect(spans[6]).toHaveClass('text-green-500');
  });

  it('should display incorrect characters in red', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['x', '', '', '', '', '', '', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    expect(spans[0]).toHaveClass('text-red-500');
  });

  it('should highlight the first empty dash position', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['h', 'e', '', '', '', '', '', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Find the first span with a dash that should be highlighted
    const firstDashSpan = spans[2]; // Position 2 should be the first empty dash
    expect(firstDashSpan).toHaveClass('text-green-500 font-bold');
  });

  it('should not highlight spaces', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['h', 'e', 'l', 'l', 'o', '', '', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Check position 5 is the space and not highlighted
    const spaceSpan = spans[5];
    expect(spaceSpan).not.toHaveClass('text-green-500 font-bold');
  });

  it('should render fully filled correct input', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Check all non-space spans are green
    spans.forEach((span, index) => {
      if (index !== 5) { // Skip the space position
        expect(span).toHaveClass('text-green-500');
      }
    });
  });

  it('should render fully filled incorrect input', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['x', 'y', 'z', 'z', 'z', ' ', 'a', 'b', 'c', 'd', 'e']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Check all non-space spans are red
    spans.forEach((span, index) => {
      if (index !== 5) { // Skip the space position
        expect(span).toHaveClass('text-red-500');
      }
    });
  });

  it('should preserve spaces in the display', () => {
    const { container } = render(
      <DictationDisplay
        blanks={mockBlanks}
        userChars={['', '', '', '', '', '', '', '', '', '', '']}
        currentSentence={mockSentence}
      />
    );

    const spans = container.querySelectorAll('span');
    // Check position 5 is the space
    const spaceSpan = spans[5];
    expect(spaceSpan.textContent).toBe(' ');
    expect(spaceSpan).not.toHaveClass('text-green-500 font-bold');
  });
});
