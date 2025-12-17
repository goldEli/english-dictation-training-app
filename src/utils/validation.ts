export function normalizeString(str: string): string {
  return str.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function compareSentences(original: string, input: string): boolean {
  const normalizedOriginal = normalizeString(original);
  const normalizedInput = normalizeString(input);
  return normalizedOriginal === normalizedInput;
}