## Refactor Dictation Area

### Overview
This refactoring will transform the dictation area into a fill-in-the-blanks interactive component with the original sentence fixed at the bottom of the screen.

### Requirements
1. **Fixed Original Sentence** - Always visible at bottom of screen
2. **Fill-in-the-Blanks Interaction** - Replace textarea with dynamic blanks
3. **Blank Generation Rules** - Dashes represent letters, ignore special characters
4. **Real-time Replacement** - Each typed character replaces corresponding dash
5. **Maintain Existing Features** - Audio playback, validation, confetti, etc.

### Implementation Steps

1. **Update Layout Structure**
   - Change main container to `flex flex-col`
   - Move original sentence to bottom with `fixed` positioning
   - Ensure proper z-index and spacing

2. **Implement Blank Generation Logic**
   - Create function to generate blanks from original sentence
   - Ignore special characters and punctuation
   - Handle spaces and word boundaries
   - Generate one dash per letter

3. **Create Character Input System**
   - Track user input as array of characters
   - Implement real-time replacement of dashes
   - Update input handling to work with individual characters
   - Maintain proper focus management

4. **Update Validation Logic**
   - Adapt existing validation to work with new input format
   - Ensure proper comparison ignoring special characters
   - Maintain word-by-word highlighting

5. **Update UI Components**
   - Remove Textarea component
   - Add custom input rendering for blanks
   - Style blanks with appropriate spacing
   - Ensure responsive design

### Expected Result
- Original sentence fixed at bottom of screen, always visible
- Fill-in-the-blanks display with dashes representing letters
- Real-time replacement of dashes as user types
- Proper validation and feedback
- Maintained audio playback and confetti effects

### Files to Modify
- `/app/page.tsx` - Main refactoring
- `/src/utils/validation.ts` - Update validation logic if needed

### Implementation Time
This refactoring will be implemented in a single session, focusing on maintaining existing functionality while adding the new fill-in-the-blanks feature.