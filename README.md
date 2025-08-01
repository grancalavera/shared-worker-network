# Shared Worker Port Network Management

A dashboard system for managing and monitoring browser tab connections through a shared worker. This project enables real-time visualization of connected ports with state management and disconnection detection using the Web Locks API.

## Overview

This system creates a network of browser tab "ports" connected to a single shared worker, where:

- **Dashboard Interface**: Visualizes all connected ports as dots with on/off states
- **Port Interface**: Individual browser tabs that can toggle their state
- **Shared Worker**: Manages port registry and real-time communication
- **Web Locks API**: Provides immediate disconnection detection when tabs close

## Key Features

- Real-time port visualization with up to 100 simultaneous connections
- Lock-based disconnection detection (no polling required)
- Global alert indicator when any port is in "off" state
- TypeScript implementation with React UI components
- RPC communication using Comlink library

## Technology Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite with SWC transpilation
- **Testing**: Vitest + Testing Library
- **Communication**: Comlink for RPC between workers and tabs
- **State Management**: RxJS for reactive data streams
- **Code Quality**: ESLint + Prettier

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── dashboard/          # Dashboard interface components
├── port/              # Port interface components  
├── rpc/               # Shared worker and RPC communication
├── lib/               # Shared library code
└── public/            # HTML entry points
```

## Development

- **Dashboard**: Navigate to `/dashboard.html` for the monitoring interface
- **Port**: Navigate to `/port.html` for individual tab interface
- See [AGENTS.md](./AGENTS.md) for development guidelines and build commands
- See [spec.md](./spec.md) for detailed technical specification

## Architecture

The system uses a three-layer architecture:

1. **UI Layer**: React components for dashboard and port interfaces
2. **Communication Layer**: Comlink RPC for type-safe worker communication
3. **Worker Layer**: Shared worker managing port registry and Web Locks API

For detailed implementation information, see the [full specification](./spec.md).