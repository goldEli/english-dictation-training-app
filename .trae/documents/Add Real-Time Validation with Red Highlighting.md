To add real-time validation with red highlighting for incorrect characters, I'll modify the `renderDisplay` function in `/app/page.tsx` to:

1. Compare each user-typed character with the corresponding character in the original sentence
2. Add a new `isCorrect` condition that checks if the filled character matches the original
3. Apply red color class for incorrect characters, while maintaining green for correct ones
4. Ensure the active dash highlighting still works correctly

The changes will be made to the `renderDisplay` function, specifically modifying the character mapping logic to include validation and updated CSS classes.

This will provide users with immediate feedback on their input, showing green for correct characters and red for incorrect ones, while still highlighting the current position to type.