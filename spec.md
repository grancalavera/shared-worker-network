# Shared Worker Port Network Management Specification

## Overview

This specification defines a system for managing a network of ports connected to a single shared worker, where each port represents a `window` object. The first iteration focuses on developing a dashboard that visualizes connected ports and monitors connection/disconnection events.

## Requirements & Questions to Address

### Core Purpose & Scope

- **Primary Purpose**: Dashboard visualization and monitoring of port connections
- **Expected Connections**: Up to 100 simultaneous connections
- **Client Types**: Browser tabs only

### Port Lifecycle Detection

- **Disconnection Detection**: Use Web Locks API for lock-based detection - each port holds a unique lock using its UUID, shared worker listens for lock release
- **Lock Strategy**: Each connecting port acquires an exclusive lock using its UUID directly, worker sets up promise-based listener for lock release
- **Cleanup Trigger**: When tab closes/crashes, browser automatically releases lock, triggering immediate cleanup in shared worker
- **Browser Support Fallback**: No support for browsers without Web Locks API.

### Port Identification & Metadata

- **Port Identity**: ports are identified by a unique UUID generated on connection using `crypto.randomUUID()`.
- **Optional Metadata**: Future improvements could include collecting window URL, connection time, user agent, or other browser tab information.

### Port Internal State

- **State Management**: Each port has an "on/off" state that can be toggled with a button on the port's UI

### Dashboard Features

- **Dashboard Visualization**: The dashboard shows each connected port as a dot along with its current state (on/off)
- **Global Alert Indicator**: The dashboard displays a global alert when any port is in the "off" state
- **Alert Visibility**: The global alert is hidden when all ports return to the "on" state
- **State Synchronization**: Port state changes are immediately communicated to the shared worker and reflected in the dashboard

### Technical Architecture

- **Dashboard Implementation**: React application using TypeScript, vite and npm.
- **Port Registry**: A shared worker maintains a registry of connected ports, storing their UUIDs and metadata.
- **Message Protocol**: RPC using <https://github.com/GoogleChromeLabs/comlink>

## Technology Stack

- **Runtime**: Node.js - JavaScript runtime environment
- **Package Manager**: npm - Package manager for JavaScript
- **Build Tool**: Vite - Fast build tool and dev server
- **Testing**: Vitest - Unit testing framework integrated with Vite
- **Worker Communication**: Comlink - RPC library for seamless worker communication
- **UI Framework**: React - Component-based UI library
- **State Management**: RxJS - Reactive programming for managing asynchronous data streams
- **Language**: TypeScript - Type-safe JavaScript development
- **Transpilation**: SWC - Fast TypeScript/JavaScript compiler

## Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) is a tiny library (1.1kB) by Google Chrome Labs that makes WebWorkers enjoyable by removing the mental barrier of thinking about `postMessage` and hiding the fact that you are working with workers. It provides an RPC implementation for `postMessage` using ES6 Proxies.

### How Comlink Could Be Used

**For the Shared Worker:**

- **Simplified API Design**: Instead of manually handling `postMessage` protocols, Comlink could expose clean JavaScript objects/functions from the shared worker
- **Type Safety**: With TypeScript support, the worker's API would be fully typed, reducing runtime errors
- **Automatic Serialization**: Comlink handles the complexity of transferring data between threads

**For Port Management:**

- **Clean Interface**: Each port connection could expose methods like `registerPort()`, `updatePortState()` through Comlink
- **Callback Handling**: State change callbacks and event notifications could be seamlessly passed between worker and ports using `Comlink.proxy()`
- **SharedWorker Integration**: Comlink has built-in SharedWorker support, requiring only minor adaptations for port-based communication

**Example Usage Pattern:**

```javascript
// In the shared worker
const portManager = {
  registerPort(portId, metadata) {
    /* ... */
  },
  updatePortState(portId, state) {
    /* ... */
  },
};
Comlink.expose(portManager, port);

// In each browser tab
const worker = new SharedWorker("worker.js");
const api = Comlink.wrap(worker.port);
const portId = crypto.randomUUID();
await api.registerPort(portId);
```

## Health Check Method

### Lock-Based Disconnection Detection

**Implementation Approach:**

```javascript
// In shared worker when new port connects
async function registerPort(portId, metadata) {
  // Add to active ports immediately
  this.activePorts.set(portId, metadata);

  // Set up disconnection listener
  navigator.locks.request(portId, { mode: "exclusive" }, () => {
    // This callback runs when the tab releases the lock
    this.removePort(portId);
    this.notifyDashboard("port-disconnected", portId);
    return "cleanup-complete";
  });
}
```

### Port Connection and Lock Acquisition

**Client-Side Implementation:**

```javascript
// In each browser tab
const worker = new SharedWorker("/src/rpc/worker.js");
const api = Comlink.wrap(worker.port);

// Generate unique port identifier
const portId = crypto.randomUUID();

// Acquire exclusive lock using port ID
navigator.locks.request(portId, { mode: "exclusive" }, () => {
  // Hold the lock as long as the tab is alive
  return new Promise(() => {}); // Never resolves intentionally
});

// Register with worker
await api.registerPort(portId, {
  url: window.location.href,
  timestamp: Date.now(),
});
```

**Characteristics:**

- **No overhead**: No intervals, no polling, no periodic checks
- **Immediate detection**: Callback fires when a tab closes
- **Resource efficient**: Only active when locks are actually released
- **Simple lifecycle**: Each port registration creates its own cleanup handler

**Flow:**

1. Tab connects → acquires lock + registers with worker
2. Worker tracks port + sets up lock-release listener
3. Tab closes → browser releases lock → worker callback fires
4. Worker removes port from tracking + notifies dashboard

### Dashboard Event Listening

**Dashboard Implementation:**

The dashboard connects to the shared worker as a special client that receives real-time updates about all port activities through EventTarget-based events.

```javascript
// In dashboard
import * as Comlink from "comlink";

// Connect to shared worker
const worker = new SharedWorker("/src/rpc/worker.js");
const api = Comlink.wrap(worker.port);

// Get the dashboard event handler from worker
const dashboardHandler = await api.getDashboardHandler();

// Listen to port lifecycle events
dashboardHandler.addEventListener("port-connected", (event) => {
  const { portId, metadata } = event.detail;
  addPortToUI(portId, metadata);
});

dashboardHandler.addEventListener("port-disconnected", (event) => {
  const { portId } = event.detail;
  removePortFromUI(portId);
});

dashboardHandler.addEventListener("port-state-changed", (event) => {
  const { portId, state } = event.detail;
  updatePortState(portId, state);
  updateGlobalAlert();
});
```

**Shared Worker Event Dispatching:**

```javascript
// In shared worker
class DashboardHandler extends EventTarget {
  constructor() {
    super();
  }

  notifyPortConnected(portId, metadata) {
    this.dispatchEvent(
      new CustomEvent("port-connected", {
        detail: { portId, metadata },
      })
    );
  }

  notifyPortDisconnected(portId) {
    this.dispatchEvent(
      new CustomEvent("port-disconnected", {
        detail: { portId },
      })
    );
  }

  notifyPortStateChanged(portId, state) {
    this.dispatchEvent(
      new CustomEvent("port-state-changed", {
        detail: { portId, state },
      })
    );
  }
}

const dashboardHandler = new DashboardHandler();

// Expose dashboard handler to dashboard clients
function getDashboardHandler() {
  return dashboardHandler;
}
```

**Event Flow:**

1. Dashboard connects and gets reference to `DashboardHandler`
2. Worker dispatches events to `DashboardHandler` when ports connect/disconnect/change state
3. Dashboard receives events and updates UI in real-time
4. Global alert indicator updates based on aggregated port states

**Trade-offs:**

- **Browser support**: Requires Web Locks API support
- **Same-origin limitation**: Won't work across different origins
- **Dependency**: Relies on relatively new browser API

This represents a lock-based approach that eliminates the need for heartbeat mechanisms or polling, providing immediate and reliable disconnection detection.

## Architecture

### Project Structure

```text
src/
├── dashboard/
│   ├── main.tsx              # Dashboard entry point
│   ├── Application.tsx       # Main dashboard React component
│   ├── components/
│   │   ├── PortDot.tsx      # Individual port visualization
│   │   ├── GlobalAlert.tsx   # Alert indicator component
│   │   └── PortGrid.tsx     # Grid layout for port dots
│   └── styles/
│       └── dashboard.css
│
├── port/
│   ├── main.tsx              # Port entry point
│   ├── PortApp.tsx          # Port interface React component
│   ├── components/
│   │   └── StateToggle.tsx   # On/off toggle button
│   └── styles/
│       └── port.css
│
├── rpc/
│   ├── client.ts            # Client-side RPC interface (Comlink wrapper)
│   └── worker.ts            # Shared worker implementation
│
├── lib/
│   └── (library code will be added here)
│
├── public/
│   └── vite.svg             # Static assets
│
├── dashboard.html           # Dashboard HTML entry
├── port.html               # Port HTML entry
└── vite.config.ts           # Multi-entry Vite configuration
```

### Entry Points

- **Dashboard**: `src/dashboard/main.tsx` → `dashboard.html`
- **Port Interface**: `src/port/main.tsx` → `port.html`
- **Shared Worker**: `src/rpc/worker.ts` (loaded by both entries)

### Component Responsibilities

- **client.ts**: Comlink wrapper for type-safe RPC communication
- **worker.ts**: Shared worker with port registry and Web Locks logic
- **Application.tsx**: Dashboard UI with port visualization and global alerts
- **PortApp.tsx**: Port interface with state toggle functionality
- **lib/**: Top-level directory for any library code

This structure separates concerns while enabling shared code reuse through the `rpc/` directory for communication logic.

## Milestones

- [x] **Milestone 1**: Project Setup
- [x] **Milestone 2**: UI Components and Entry Points
- [x] **Milestone 3**: Launch Ports
- [ ] **Milestone 4**: RPC Layer Implementation

### Milestone 1: Project Setup

- Assume vite project is already created
- Install and configure Vitest for testing
- Configure Vitest test environment and settings
- Configure ESLint with default settings, React rules, and rules of hooks
- Configure Prettier with default settings
- Add Comlink and RxJS dependencies
- Create basic project structure and build scripts

### Milestone 2: UI Components and Entry Points

- Create dashboard HTML entry point (`dashboard.html`)
- Create port HTML entry point (`port.html`)
- Implement dashboard React components:
  - `Application.tsx` - Main dashboard application
  - `PortDot.tsx` - Individual port visualization
  - `GlobalAlert.tsx` - Global status indicator
  - `PortGrid.tsx` - Grid layout for port dots
- Implement port interface React components:
  - `PortApp.tsx` - Port interface application
  - `StateToggle.tsx` - On/off toggle button
- Configure Vite multi-entry build setup
- Add basic styling for both interfaces
- **Out of scope**: RPC layer implementation (client.ts, worker.ts)

### Milestone 3: Launch Ports

- Add "Launch Port" button to the dashboard UI
- Implement `window.open()` to launch new port windows pointing to `port.html`
- Add basic error handling for popup blockers
- **Out of scope**: Port connection behavior (handled in Milestone 4)

### Milestone 4: RPC Layer Implementation

- Implement shared worker (`src/rpc/worker.ts`):
  - Port registry with UUID-based tracking
  - Web Locks API integration for disconnection detection
  - Port state management (on/off)
  - Lock-based cleanup on lock release
- Implement RPC client (`src/rpc/client.ts`):
  - Comlink wrapper for type-safe worker communication
  - Port registration with UUID generation
  - State update methods
  - Lock acquisition on connection
- Integrate RPC layer with UI components:
  - Connect dashboard to receive port updates
  - Connect port interface to send state changes
- Implement dashboard real-time updates using RxJS
- Add error handling for RPC communication failures
