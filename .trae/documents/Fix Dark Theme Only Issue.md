## Fix Dark Theme Only Issue

### Problem
The dark theme isn't working because the `dark` class isn't being applied to the HTML element. Currently, the app defaults to light theme.

### Solution
Update the `layout.tsx` file to permanently add the `dark` class to the HTML element, ensuring the app always uses dark theme.

### Implementation Steps
1. Edit `/app/layout.tsx` to add the `dark` class to the `<html>` tag
2. Verify that the dark theme is now applied correctly
3. Ensure no other theme-related code is overriding this setting

### Expected Result
The app will always display in dark theme, with all components using the dark theme styles defined in `globals.css`.