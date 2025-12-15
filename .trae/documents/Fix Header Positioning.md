To fix the header at the top of the screen, I'll make the following changes to `/app/page.tsx`:

1. **Restructure Layout**: Move the header div (title and buttons) outside the dictation area div but inside the main container
2. **Apply Fixed Positioning**: Add `fixed` positioning with `top-0 left-0` and conditional `right-0`/`right-80` based on sentences list visibility
3. **Add Styling**: 
   - Set a background color to hide content behind it
   - Add padding for proper spacing
   - Set appropriate z-index to ensure it stays above other content
4. **Adjust Dictation Area**: Add top margin to the dictation area to avoid overlap with the fixed header
5. **Maintain Responsiveness**: Ensure the header works correctly with both visible and hidden sentences list
6. **Update UI Consistency**: Match the header's styling with the rest of the application

The changes will transform the header from a centered element to a fixed top bar, providing better accessibility to the title and control buttons while maintaining the existing design aesthetic.