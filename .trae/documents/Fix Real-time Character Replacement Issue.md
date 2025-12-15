## Fix Real-time Character Replacement Issue

### Problem
When the user types letters, the dashes aren't being replaced in real time. This is likely due to focus management issues - the div element with the keydown handler isn't receiving keyboard focus.

### Root Cause Analysis
1. The dictation area div has a `tabIndex={0}` and `onKeyDown` handler
2. However, it may not be automatically receiving focus when the component mounts
3. The focus might be lost after interactions
4. The keydown events aren't being captured properly

### Solution
1. **Improve Focus Management**
   - Add auto-focus on component mount
   - Add click-to-focus functionality
   - Ensure focus is maintained during interactions
   - Add visual indication of focus

2. **Fix Character Replacement Logic**
   - Verify the `handleCharacterInput` function works correctly
   - Ensure the `userChars` state is being updated properly
   - Check the `renderDisplay` function for correct rendering

3. **Add Debugging**
   - Add console logs to track keydown events
   - Verify state updates are happening

### Implementation Steps

1. **Add Auto-focus Effect**
   - Create a useEffect that sets focus to the dictation area when the component mounts or when sentences change
   - Use the `dictationAreaRef` to focus the element

2. **Add Click-to-Focus**
   - Add an onClick handler to the dictation area to set focus when clicked
   - Improve user experience by allowing users to click to focus

3. **Improve Visual Feedback**
   - Add a focus indicator style to the dictation area
   - Make it clear when the area is ready for input

4. **Verify Character Replacement Logic**
   - Check that `handleCharacterInput` is correctly updating the `userChars` array
   - Verify that `renderDisplay` is correctly mapping between `userChars` and the display
   - Ensure the indices are correctly aligned

5. **Test and Debug**
   - Test the fix thoroughly
   - Add temporary console logs if needed
   - Ensure all edge cases are handled

### Expected Result
- The dictation area automatically receives focus when the component mounts
- Users can click to focus the area
- Typed characters replace dashes in real time
- Correct characters are highlighted in green
- Backspace functionality works correctly

### Files to Modify
- `/app/page.tsx` - Add focus management and fix character replacement

This fix will ensure users can interact with the fill-in-the-blanks display properly, with real-time character replacement as they type.