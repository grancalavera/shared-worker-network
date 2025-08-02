# Agent Guidelines for shared-worker-network

## Agent Etiquette

- If I tell you to work on the specification, just make changes to the specification and not to the code. I want to be able to commit specification changes separately from code changes.
- Don't start the dev server (`npm run dev`), assume it is running. If you need to test something and the dev server isn't running ask me to start it for you.

## Project Specification

Complete project details, requirements, architecture, and milestones are documented in [spec.md](./spec.md). This includes:

- System overview and purpose
- Technical architecture and component structure
- SharedWorker + Comlink implementation patterns
- Web Locks API integration for disconnection detection
- Complete milestone breakdown and current status
- Build configuration and testing guidelines

## Build/Test Commands

- `npm run build` - Build the project
- `npm run dev` - Start development server
- `npm run test` - Run all tests
- `npm run test -- --testNamePattern="TestName"` - Run single test
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript type checking
