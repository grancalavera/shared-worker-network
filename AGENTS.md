# Agent Guidelines for shared-worker-network

## Build/Test Commands

- `npm run build` - Build the project
- `npm run dev` - Start development server
- `npm run test` - Run all tests
- `npm run test -- --testNamePattern="TestName"` - Run single test
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript type checking

## Code Style Guidelines

- Use TypeScript for all new code
- Import order: Node modules, local modules, types (separated by blank lines)
- Use named exports over default exports
- Function names: camelCase, classes: PascalCase, constants: UPPER_SNAKE_CASE
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises chains
- Error handling: throw Error objects with descriptive messages
- Use strict TypeScript config - no `any` types
- Prefer functional programming patterns where appropriate
- Use JSDoc comments for public APIs
- File naming: kebab-case for files, PascalCase for components
- Maximum line length: 100 characters
- When writing markdown headers, always add an empty line after the header
