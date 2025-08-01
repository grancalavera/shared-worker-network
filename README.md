# Shared Worker Port Network Management

A dashboard system for monitoring and managing a network of browser tabs connected through a shared worker. Each tab represents a port with toggleable state, and the dashboard provides real-time visualization of all connected ports.

## Features

- **Dashboard Visualization**: Real-time grid view of connected ports as visual dots
- **Port Management**: Each port has an on/off state toggle
- **Global Alert System**: Dashboard shows alerts when any port is in the "off" state
- **Automatic Disconnection Detection**: Uses Web Locks API for immediate detection when tabs close
- **RPC Communication**: Type-safe communication between ports and shared worker using Comlink

## Architecture

The system consists of two main interfaces:

- **Dashboard** (`dashboard.html`): Monitors all connected ports and displays their states
- **Port Interface** (`port.html`): Individual tab interface with state toggle

Both interfaces communicate through a shared worker that maintains the port registry and handles state synchronization.

## Getting Started

### Prerequisites

- Node.js (latest LTS)
- A modern browser with Web Locks API support

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open the dashboard:

- Navigate to `http://localhost:5173/dashboard.html`

Launch ports:

- Use the "Launch Port" button in the dashboard, or
- Manually navigate to `http://localhost:5173/port.html`

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Technology Stack

- **React** - Component-based UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **Comlink** - RPC library for worker communication
- **Web Locks API** - Automatic disconnection detection

## Project Status

Current implementation includes:

- ✅ Project setup and build configuration
- ✅ UI components and entry points
- ✅ Port launching functionality
- ✅ Basic SharedWorker + Comlink foundation
- 🚧 Full RPC layer implementation (in progress)

See `spec.md` for detailed project specifications and milestones.
