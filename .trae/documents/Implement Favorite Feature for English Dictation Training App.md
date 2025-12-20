## Implementation Plan

### 1. Extend the DictationState Interface and Store
**File**: `src/store/dictationStore.ts`
- Add `favoriteSentences: string[]` to the `DictationState` interface
- Add `toggleFavorite` action to add/remove current sentence from favorites
- Add `deleteAllExceptFavorites` action to delete all non-favorite sentences
- Update the persist configuration to include `favoriteSentences`

### 2. Update the DictationArea Component
**File**: `components/DictationArea.tsx`
- Import a Heart icon from lucide-react
- Add `isFavorited` and `onToggleFavorite` to the component props
- Add a Favorite button next to the "Skip" button
- Implement visual state indication (different color for favorited state)

### 3. Update the Main Page Component
**File**: `app/page.tsx`
- Modify the `DictationArea` usage to include favorite-related props
- Calculate the current favorite state using the store
- Pass the toggle function from the store

### 4. Update the Sentence Management Page
**File**: `app/sentences/page.tsx`
- Add `deleteAllExceptFavorites` to the store usage
- Add a new "Delete All Except Favorites" button next to "Delete All"
- Implement a confirmation dialog for the new button
- Call the new store action when confirmed

### 5. Update Dependencies and Hooks
**File**: `src/hooks/useDictationLogic.ts` (if exists)
- Update any custom hooks that provide props to DictationArea to include favorite functionality

This implementation will satisfy all requirements:
- Toggleable Favorite icon next to "Skip" button
- Add/remove current sentence from favorites on click
- Persist favorite list in LocalStorage
- Visual state indication with different colors
- "Delete All Except Favorites" button in Sentence Management