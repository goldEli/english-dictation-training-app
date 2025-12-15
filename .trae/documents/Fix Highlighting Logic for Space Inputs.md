To fix the issue where dashes are highlighted when the next expected input is a space, I'll make two key changes to the `renderDisplay` function in `/app/page.tsx`:

1. **Update activeIndex calculation**: Change from finding the first empty dash to finding the first empty position overall, regardless of whether it's a dash or space
2. **Modify isActive condition**: Only highlight positions that are both the activeIndex AND are dashes

This ensures that when the next expected input is a space (which isn't a dash), no dash will be highlighted. The highlighting will only occur when the next expected input is actually a dash.

The changes will be made to lines 147-149 (activeIndex calculation) and line 157 (isActive condition) in the `renderDisplay` function.