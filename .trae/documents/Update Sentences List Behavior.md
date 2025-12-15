To implement the requested changes to the sentences list behavior, I'll make the following modifications to `/app/page.tsx`:

1. **Add Backdrop Overlay**: 
   - Add a conditional backdrop div that appears when `isSentencesVisible` is true
   - Position it fixed with full width/height
   - Add semi-transparent background color
   - Add click event handler `handleBackdropClick` to close the list
   - Set z-index to be between header and sentences list

2. **Update Z-Index Values**: 
   - Increase sentences list z-index from z-20 to z-40 (higher than header's z-30)
   - Set backdrop z-index to z-35
   - Ensure proper stacking order: header (z-30) < backdrop (z-35) < sentences list (z-40)

3. **Remove Mouse Leave Logic**: 
   - Remove `onMouseEnter` and `onMouseLeave` event handlers from the sentences list
   - Remove `handleListEnter` and `handleListLeave` functions
   - Keep only `handleListIconHover` and add `handleBackdropClick`

4. **Update Sentences List Container**: 
   - Remove `onMouseEnter` and `onMouseLeave` props
   - Keep the same transition animation for showing/hiding
   - Ensure it appears above the header

5. **Maintain List Icon Functionality**: 
   - Keep the `handleListIconHover` function to show the list
   - Ensure the list icon still appears/hides correctly

These changes will transform the sentences list from a hover-to-dismiss component to a modal-style component with backdrop, higher z-index, and click-to-close functionality, while maintaining the existing hover-to-open behavior from the list icon.