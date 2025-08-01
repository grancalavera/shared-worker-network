# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

From AGENTS.md, the following commands are available:

- `npm run build` - Build the project
- `npm run dev` - Start development server
- `npm run test` - Run all tests
- `npm run test -- --testNamePattern="TestName"` - Run single test
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript type checking

**Note**: The project appears to be in early setup phase - no package.json or source files exist yet.

## Project Architecture

This is a **Shared Worker Port Network Management** system for monitoring browser tab connections through a dashboard.

### Core Components

**Technology Stack:**

- React + TypeScript + Vite build system
- Comlink RPC for SharedWorker communication
- Web Locks API for disconnection detection
- RxJS for reactive state management

**Multi-Entry Architecture:**

- `src/dashboard/` - Dashboard React app for monitoring ports
- `src/port/` - Port interface React app for individual tabs
- `src/rpc/` - Shared worker and RPC communication layer
- `public/dashboard.html` & `public/port.html` - Separate entry points

### Key Technical Concepts

**Port Management:**

- Each browser tab gets a unique UUID via `crypto.randomUUID()`
- Uses Web Locks API for immediate disconnection detection (no polling)
- SharedWorker maintains port registry and state (on/off toggle per port)

**Communication Flow:**

1. Tabs connect → acquire exclusive lock + register with SharedWorker
2. SharedWorker tracks ports + sets up lock-release listeners
3. Tab closes → browser releases lock → worker cleanup fires immediately
4. Dashboard receives real-time updates via EventTarget-based events

**RPC Implementation:**

- Comlink handles postMessage complexity with typed interfaces
- Dashboard connects as special client receiving port lifecycle events
- Lock-based approach eliminates need for heartbeat/polling mechanisms

### Development Milestones

The project is structured in 3 phases:

1. **Milestone 1**: Node.js + Vite + React + TypeScript setup
2. **Milestone 2**: UI components for dashboard and port interfaces
3. **Milestone 3**: SharedWorker + RPC + Web Locks integration

### Code Style (from AGENTS.md)

- TypeScript required, no `any` types
- Named exports preferred over default exports
- Import order: Node modules, local modules, types (blank line separated)
- File naming: kebab-case for files, PascalCase for components
- Function naming: camelCase, classes: PascalCase, constants: UPPER_SNAKE_CASE
- 100 character line limit
- Async/await over promise chains
