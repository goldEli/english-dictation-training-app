## English Dictation Training Web App Implementation Plan

### Project Structure

1. **State Management**
   - Create a Zustand store in `src/store/dictationStore.ts` to manage:
     - Sentences list
     - Current selected sentence index
     - User input
     - Dictation status
     - Audio playback

2. **Home Page (/app/page.tsx)**
   - **Layout**: Split screen with dictation area on left and sentence list on right
   - **Dictation Area**:
     - Text-to-Speech functionality using browser API
     - Input field for user to type dictated sentence
     - Real-time validation comparing input with original sentence
     - Keypress sound effect on input
     - Confetti animation on correct answer
     - Keyboard shortcut (Cmd+R) to replay audio
   - **Sentence List**:
     - Display all sentences in a scrollable list
     - Single-line display with ellipsis for overflow
     - Highlight currently selected sentence
     - Click to select different sentence
   - **Navigation**: Button to go to Sentence Management page

3. **Sentence Management Page (/app/sentences/page.tsx)**
   - **Sentence List**:
     - Display all sentences with edit/delete options
     - Add new sentence form
     - Batch import via JSON textarea
     - Delete all sentences button
   - **Navigation**: Back button to return to Home page

4. **UI Components**
   - Use shadcn/ui components (button, input, textarea, card, dialog)
   - Use lucide-react icons for UI elements
   - Implement dark theme only

5. **Utility Functions**
   - Create `src/utils/validation.ts` for sentence comparison logic (ignoring special characters)
   - Create `src/utils/audio.ts` for text-to-speech and keypress sound management

### Implementation Steps

1. **Set up Zustand Store**
   - Create store with sentences array, current index, user input, and methods
   - Implement local storage persistence

2. **Build Home Page**
   - Implement layout with two main sections
   - Add TTS functionality
   - Implement input validation
   - Add confetti animation on success
   - Implement keyboard shortcuts
   - Add keypress sound

3. **Build Sentence Management Page**
   - Implement CRUD operations for sentences
   - Add batch import functionality
   - Add delete all functionality

4. **Test and Refine**
   - Test TTS functionality
   - Test input validation
   - Test navigation between pages
   - Ensure dark theme works correctly
   - Test keyboard shortcuts
   - Test confetti animation

### Key Features

- Text-to-Speech using browser API
- Real-time input validation
- Confetti animation on success
- Keyboard shortcuts
- Keypress sound effects
- Sentence management with CRUD operations
- Batch import via JSON
- Local storage persistence
- Dark theme only
- Responsive design

This implementation plan covers all the requirements specified in the project brief while leveraging the existing tech stack and project structure.