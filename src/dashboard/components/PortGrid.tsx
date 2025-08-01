import React from "react";
import PortDot from "./PortDot";

interface Port {
  id: string;
  state: "on" | "off";
  metadata?: {
    url?: string;
    timestamp?: number;
  };
}

interface PortGridProps {
  ports: Port[];
}

const PortGrid: React.FC<PortGridProps> = ({ ports }) => {
  return (
    <div className="port-grid">
      {ports.length === 0 ? (
        <div className="empty-state">No ports connected</div>
      ) : (
        ports.map((port) => <PortDot key={port.id} port={port} />)
      )}
    </div>
  );
};

export default PortGrid;
