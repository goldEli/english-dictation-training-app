To set up Vitest and write unit tests for the requested files, I'll implement the following plan:

### 1. Install Required Dependencies
- Install Vitest if not already installed (it's already in package.json)
- Install React testing utilities: `@testing-library/react` and `@testing-library/jest-dom`
- Install Vite React plugin if needed

### 2. Create Configuration Files
- Create `vitest.config.ts` for Vitest configuration
- Create `vitest.setup.ts` for test setup (including React testing library setup)
- Update `package.json` to add test scripts

### 3. Write Unit Tests

#### For `src/utils/validation.ts`
- Test `normalizeString` function:
  - Should convert string to lowercase
  - Should remove special characters
  - Should preserve alphanumeric characters and spaces
  - Should handle empty strings
  - Should handle strings with only special characters

- Test `compareSentences` function:
  - Should return true for identical sentences
  - Should return true for sentences with different cases
  - Should return true for sentences with different special characters
  - Should return false for different sentences
  - Should handle empty strings

#### For `components/DictationDisplay.tsx`
- Test rendering with various input states:
  - Empty user input (all blanks)
  - Partially filled input with correct characters
  - Partially filled input with incorrect characters
  - Fully filled correct input
  - Fully filled incorrect input

- Test active position highlighting:
  - Should highlight the first empty dash position
  - Should not highlight filled positions
  - Should not highlight spaces

- Test character validation:
  - Should display correct characters in green
  - Should display incorrect characters in red
  - Should preserve spaces

### 4. Run Tests and Verify Coverage
- Run tests to ensure they pass
- Verify test coverage if needed
- Ensure no regressions in existing functionality

### 5. Update Documentation
- Add test instructions to README.md
- Document any testing conventions used

This plan will ensure comprehensive testing of both the utility functions and the React component, providing confidence in their correctness and reliability.