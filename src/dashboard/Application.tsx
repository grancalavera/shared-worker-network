import React from "react";
import PortGrid from "./components/PortGrid";
import GlobalAlert from "./components/GlobalAlert";
import { workerAPI } from "../rpc/client";

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
  const [echoResult, setEchoResult] = React.useState<string>("");

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

  const testEcho = async () => {
    try {
      const result = await workerAPI.echo("Hello from Dashboard!");
      setEchoResult(result);
      console.log("Echo result:", result);
    } catch (error) {
      console.error("Echo test failed:", error);
      setEchoResult("Error: " + (error as Error).message);
    }
  };

  const clearEcho = () => {
    setEchoResult("");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Shared Worker Network Dashboard</h1>
        <div className="header-controls">
          <button className="launch-port-button" onClick={launchPort} type="button">
            Launch Port
          </button>
          <button className="echo-test-button" onClick={testEcho} type="button">
            Echo Test
          </button>{" "}
          <div className="connection-count">Connected Ports: {ports.length}</div>
        </div>
      </header>

      {echoResult && (
        <div className="echo-result">
          <strong>Echo Result:</strong> {echoResult}
          <button className="clear-echo-button" onClick={clearEcho} type="button">
            Clear
          </button>
        </div>
      )}

      <GlobalAlert isVisible={hasOffPorts} />

      <main className="dashboard-content">
        <PortGrid ports={ports} />
      </main>
    </div>
  );
};

export default Application;
