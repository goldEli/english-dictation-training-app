To implement the progress bar in the header, I'll follow these steps:

1. **Install Progress Bar Component**: 
   - Use the shadcn/ui CLI to add the progress bar component
   - This will create the necessary files in the components/ui directory
   - The command will be something like: `npx shadcn-ui@latest add progress`

2. **Add Progress Bar to Header**: 
   - Import the Progress component in the page.tsx file
   - Calculate the progress percentage as: `(currentIndex + 1) / sentences.length * 100`
   - Add the progress bar to the header section, below the title and buttons
   - Ensure it's responsive and fits well in the header layout

3. **Style the Progress Bar**: 
   - Use Tailwind CSS classes to ensure proper styling
   - Set appropriate width and height
   - Ensure it matches the dark theme
   - Add margin/padding as needed for proper spacing

4. **Handle Edge Cases**: 
   - Ensure the progress bar handles 0 sentences gracefully
   - Make sure it updates correctly when navigating between sentences
   - Handle cases where currentIndex might be -1

5. **Verify Implementation**: 
   - Check that the progress bar updates in real-time as the user progresses through sentences
   - Ensure it's visually appealing and fits well in the header
   - Verify that the percentage calculation is correct

The implementation will use the shadcn/ui Progress component, integrate it into the existing header layout, and calculate the progress based on the current training index and total number of sentences.