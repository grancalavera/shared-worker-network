import React from "react";

interface Port {
  id: string;
  state: "on" | "off";
  metadata?: {
    url?: string;
    timestamp?: number;
  };
}

interface PortDotProps {
  port: Port;
}

const PortDot: React.FC<PortDotProps> = ({ port }) => {
  return (
    <div
      className={`port-dot ${port.state}`}
      title={`Port ${port.id.slice(0, 8)}... - ${port.state}`}
    >
      <div className="port-indicator" />
      <div className="port-id">{port.id.slice(0, 8)}</div>
    </div>
  );
};

export default PortDot;
