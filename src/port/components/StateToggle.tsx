import React from "react";

interface StateToggleProps {
  state: "on" | "off";
  onToggle: () => void;
}

const StateToggle: React.FC<StateToggleProps> = ({ state, onToggle }) => {
  return (
    <div className="state-toggle">
      <button className={`toggle-button ${state}`} onClick={onToggle} type="button">
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
        <span className="toggle-label">{state === "on" ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
};

export default StateToggle;
