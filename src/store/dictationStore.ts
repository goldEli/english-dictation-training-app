import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DictationState {
  sentences: string[];
  favoriteSentences: string[];
  currentIndex: number;
  userInput: string;
  setSentences: (sentences: string[]) => void;
  addSentence: (sentence: string) => void;
  updateSentence: (index: number, sentence: string) => void;
  deleteSentence: (index: number) => void;
  deleteAllSentences: () => void;
  deleteAllExceptFavorites: () => void;
  setCurrentIndex: (index: number) => void;
  nextSentence: () => void;
  setUserInput: (input: string) => void;
  resetUserInput: () => void;
  importSentences: (sentences: string[]) => void;
  toggleFavorite: () => void;
}

const useDictationStore = create<DictationState>()(
  persist(
    (set, get) => ({
      sentences: [
        "The quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "Peter Piper picked a peck of pickled peppers.",
        "A watched pot never boils.",
      ],
      favoriteSentences: [],
      currentIndex: 0,
      userInput: '',

      setSentences: (sentences) => set({ sentences }),

      addSentence: (sentence) =>
        set((state) => ({
          sentences: [...state.sentences, sentence.trim()],
        })),

      updateSentence: (index, sentence) =>
        set((state) => {
          const newSentences = [...state.sentences];
          newSentences[index] = sentence.trim();
          return { sentences: newSentences };
        }),

      deleteSentence: (index) =>
        set((state) => {
          const newSentences = state.sentences.filter((_, i) => i !== index);
          const newIndex = Math.min(state.currentIndex, newSentences.length - 1);
          return { sentences: newSentences, currentIndex: newIndex };
        }),

      deleteAllSentences: () => set({ sentences: [], currentIndex: 0 }),

      setCurrentIndex: (index) => set({ currentIndex: index, userInput: '' }),

      nextSentence: () =>
        set((state) => {
          const nextIndex = (state.currentIndex + 1) % state.sentences.length;
          return { currentIndex: nextIndex, userInput: '' };
        }),

      setUserInput: (input) => set({ userInput: input }),

      resetUserInput: () => set({ userInput: '' }),

      importSentences: (newSentences) =>
        set((state) => ({
          sentences: [...state.sentences, ...newSentences.map((s) => s.trim())],
        })),

      toggleFavorite: () =>
        set((state) => {
          const currentSentence = state.sentences[state.currentIndex];
          const isFavorite = state.favoriteSentences.includes(currentSentence);
          
          if (isFavorite) {
            return {
              favoriteSentences: state.favoriteSentences.filter(
                (sentence) => sentence !== currentSentence
              ),
            };
          } else {
            return {
              favoriteSentences: [...state.favoriteSentences, currentSentence],
            };
          }
        }),

      deleteAllExceptFavorites: () =>
        set((state) => {
          const filteredSentences = state.sentences.filter((sentence) =>
            state.favoriteSentences.includes(sentence)
          );
          return {
            sentences: filteredSentences,
            currentIndex: Math.min(state.currentIndex, filteredSentences.length - 1),
          };
        }),
    }),
    {
      name: 'dictation-storage',
      partialize: (state) => ({
        sentences: state.sentences,
        favoriteSentences: state.favoriteSentences,
        currentIndex: state.currentIndex,
      }),
    }
  )
);

export default useDictationStore;