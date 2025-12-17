To improve separation of concerns in the Home component, I'll implement the following refactoring plan:

### 1. Create Directories
- Create `/components` directory for custom UI components
- Create `/hooks` directory for custom React hooks

### 2. Extract Custom Hooks

#### `useDictationLogic` (`/hooks/useDictationLogic.ts`)
- Handles core dictation functionality
- Manages userChars and blanks state
- Implements character input, backspace, and space handling
- Generates blanks from sentences
- Handles correct answer detection

#### `useSentencesList` (`/hooks/useSentencesList.ts`)
- Manages sentences list visibility state
- Implements hover-to-show and click-to-close functionality
- Handles backdrop interactions

#### `useAudioControls` (`/hooks/useAudioControls.ts`)
- Wraps audioManager functionality
- Handles text-to-speech and replay
- Manages keypress sounds

#### `useProgressCalculation` (`/hooks/useProgressCalculation.ts`)
- Calculates progress percentage based on current index and total sentences

### 3. Extract UI Components

#### `Header` (`/components/Header.tsx`)
- Contains title and control buttons
- Includes progress bar
- Handles settings and list icon interactions

#### `DictationArea` (`/components/DictationArea.tsx`)
- Main dictation interface
- Renders fill-in-the-blanks display
- Handles keyboard events
- Manages focus

#### `OriginalSentence` (`/components/OriginalSentence.tsx`)
- Fixed at bottom of screen
- Shows the original sentence

#### `SentencesList` (`/components/SentencesList.tsx`)
- Right-side sentences list
- Includes backdrop overlay
- Handles sentence selection

#### `DictationDisplay` (`/components/DictationDisplay.tsx`)
- Renders the fill-in-the-blanks with highlighting
- Shows active position and validation status

### 4. Update Page Component (`/app/page.tsx`)
- Import and use extracted hooks and components
- Handle composition and orchestration
- Pass necessary props and callbacks between components
- Maintain global state management with Zustand

### 5. Benefits
- **Improved Testability**: Business logic in hooks can be easily unit tested
- **Reusability**: UI components can be reused across different pages
- **Better Maintainability**: Clear separation of concerns makes code easier to understand and modify
- **Scalability**: New features can be added without bloating the main component
- **Cleaner Code**: Each file has a single responsibility

The refactoring will follow React best practices, keeping components pure and focused, while extracting complex logic into hooks for better separation of concerns.