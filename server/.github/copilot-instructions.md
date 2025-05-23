# Copilot Instructions

## Testing Conventions

- All unit test files must go in the `../src/tests/unit/` directory.
- The test file should match the name of the file it tests, with `.test.ts` as the extension.
  - Example: `src/services/currencyService.ts` → `src/tests/unit/services/currencyService.test.ts`
- When generating tests, always include:
  - A successful case
  - A failure case
  - One or more edge cases
- Tests must be self-contained with all necessary mocks included.
- Follow patterns in existing test files in the same directory, if present.
