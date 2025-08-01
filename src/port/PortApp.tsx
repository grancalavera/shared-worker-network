import React from "react";
import StateToggle from "./components/StateToggle";

const PortApp: React.FC = () => {
  const [portState, setPortState] = React.useState<"on" | "off">("on");
  const [portId] = React.useState(() => crypto.randomUUID());

  const handleStateToggle = () => {
    setPortState((current) => (current === "on" ? "off" : "on"));
  };

  return (
    <div className="port-app">
      <header className="port-header">
        <h1>Port Interface</h1>
        <div className="port-info">
          <div className="port-id">ID: {portId.slice(0, 8)}...</div>
          <div className="port-url">URL: {window.location.href}</div>
        </div>
      </header>

      <main className="port-content">
        <div className="state-section">
          <h2>Port State</h2>
          <StateToggle state={portState} onToggle={handleStateToggle} />
        </div>

        <div className="status-section">
          <div className={`status-indicator ${portState}`}>
            <div className="indicator-dot" />
            <span>Status: {portState.toUpperCase()}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortApp;
