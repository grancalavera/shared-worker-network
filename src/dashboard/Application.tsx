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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Shared Worker Network Dashboard</h1>
        <div className="connection-count">Connected Ports: {ports.length}</div>
      </header>

      <GlobalAlert isVisible={hasOffPorts} />

      <main className="dashboard-content">
        <PortGrid ports={ports} />
      </main>
    </div>
  );
};

export default Application;
