import React from "react";

interface GlobalAlertProps {
  isVisible: boolean;
}

const GlobalAlert: React.FC<GlobalAlertProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="global-alert">
      <div className="alert-icon">⚠️</div>
      <div className="alert-message">One or more ports are in the OFF state</div>
    </div>
  );
};

export default GlobalAlert;
