import React from "react";
import PortGrid from "./components/PortGrid";
import GlobalAlert from "./components/GlobalAlert";

interface Port {
  id: string;
  state: "on" | "off";
  metadata?: {
    url?: string;
    timestamp?: number;
  };
}

const Application: React.FC = () => {
  const [ports] = React.useState<Port[]>([]);

  const hasOffPorts = ports.some((port) => port.state === "off");

  const launchPort = () => {
    try {
      const portWindow = window.open("/port.html", "_blank", "width=400,height=500");
      if (!portWindow) {
        console.error("Failed to launch port: popup blocked");
        alert("Unable to launch port. Please allow popups for this site.");
      }
    } catch (error) {
      console.error("Error launching port:", error);
      alert("An error occurred while launching the port.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Shared Worker Network Dashboard</h1>
        <div className="header-controls">
          <button className="launch-port-button" onClick={launchPort} type="button">
            Launch Port
          </button>
          <div className="connection-count">Connected Ports: {ports.length}</div>
        </div>
      </header>

      <GlobalAlert isVisible={hasOffPorts} />

      <main className="dashboard-content">
        <PortGrid ports={ports} />
      </main>
    </div>
  );
};

export default Application;
