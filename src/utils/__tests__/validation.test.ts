import { describe, it, expect } from 'vitest';
import { normalizeString, compareSentences } from '../validation';

describe('validation.ts', () => {
  describe('normalizeString', () => {
    it('should convert string to lowercase', () => {
      expect(normalizeString('HELLO WORLD')).toBe('hello world');
    });

    it('should remove special characters', () => {
      expect(normalizeString('Hello, World!')).toBe('hello world');
    });

    it('should preserve alphanumeric characters and spaces', () => {
      expect(normalizeString('Hello 123 World')).toBe('hello 123 world');
    });

    it('should handle empty strings', () => {
      expect(normalizeString('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(normalizeString('!,@#$%^&*()_+-=[]{}|;:,.<>?')).toBe('');
    });

    it('should handle strings with mixed content', () => {
      expect(normalizeString('H3ll0, W0rld!')).toBe('h3ll0 w0rld');
    });
  });

  describe('compareSentences', () => {
    it('should return true for identical sentences', () => {
      expect(compareSentences('Hello world', 'Hello world')).toBe(true);
    });

    it('should return true for sentences with different cases', () => {
      expect(compareSentences('Hello World', 'hello world')).toBe(true);
    });

    it('should return true for sentences with different special characters', () => {
      expect(compareSentences('Hello, World!', 'Hello World')).toBe(true);
    });

    it('should return false for different sentences', () => {
      expect(compareSentences('Hello world', 'Hello there')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(compareSentences('', '')).toBe(true);
      expect(compareSentences('Hello', '')).toBe(false);
    });

    it('should handle strings with numbers', () => {
      expect(compareSentences('Test 123', 'test 123')).toBe(true);
      expect(compareSentences('Test 123', 'test 456')).toBe(false);
    });

    it('should handle sentences with multiple spaces', () => {
      expect(compareSentences('Hello   world', 'Hello world')).toBe(true);
    });
  });
});
