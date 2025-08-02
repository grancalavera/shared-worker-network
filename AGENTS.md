# Agent Guidelines for shared-worker-network

## Agent Etiquette

- Don't start the dev server (`npm run dev`), assume it is running. If you need to test something and the dev server isn't running ask me to start it for you.

## Project Overview

This is a React + TypeScript + Vite project that implements a shared worker port network management system. The system consists of two main interfaces (dashboard and port) that communicate through a shared worker using Comlink for RPC.

## Build/Test Commands

- `npm run build` - Build the project
- `npm run dev` - Start development server
- `npm run test` - Run all tests
- `npm run test -- --testNamePattern="TestName"` - Run single test
- `npm run lint` - Run linter
- `npm run typecheck` - Run TypeScript type checking

## Entry Points

- **Dashboard**: `dashboard.html` → `src/dashboard/main.tsx`
- **Port Interface**: `port.html` → `src/port/main.tsx`
- **Shared Worker**: `src/rpc/worker.ts`

## Architecture Guidelines

### SharedWorker + Comlink Pattern

- Use Vite's recommended worker constructor: `new SharedWorker(new URL('./worker.ts', import.meta.url), { type: 'module' })`
- Always call `port.start()` on both client and worker sides
- Export WorkerAPI directly from client module (no getAPI or initialize methods)
- Use ESM imports in worker, not `importScripts()`

### Web Locks API Integration

- Each port acquires an exclusive lock using its UUID: `navigator.locks.request(portId, { mode: "exclusive" })`
- Worker listens for lock release to detect disconnections
- No polling or heartbeat mechanisms - rely on browser's automatic lock cleanup

### RPC Communication

- Use Comlink for type-safe worker communication
- Expose clean JavaScript objects/functions from shared worker
- Handle callbacks and events using `Comlink.proxy()`
- Use EventTarget pattern for dashboard event listening

## Component Structure

### Dashboard Components

- `Application.tsx` - Main dashboard with port visualization and global alerts
- `PortDot.tsx` - Individual port visualization
- `GlobalAlert.tsx` - Alert indicator component
- `PortGrid.tsx` - Grid layout for port dots

### Port Components

- `PortApp.tsx` - Port interface with state toggle
- `StateToggle.tsx` - On/off toggle button

### RPC Layer

- `client.ts` - Comlink wrapper for type-safe worker communication
- `worker.ts` - Shared worker with port registry and Web Locks logic

## Current Milestone Status

- ✅ Milestone 1: Project Setup
- ✅ Milestone 2: UI Components and Entry Points
- ✅ Milestone 3: Launch Ports
- ✅ Milestone 4: Basic SharedWorker + Comlink Foundation
- 🚧 Milestone 5: Full RPC Layer Implementation

## Testing Guidelines

- Use Vitest for unit testing
- Test components in isolation where possible
- Mock shared worker for component tests
- Test RPC communication separately from UI components
