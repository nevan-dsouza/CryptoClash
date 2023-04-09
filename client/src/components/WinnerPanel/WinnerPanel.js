import React from 'react'
import './WinnerPanel.css'

const WinnerPanel = ({ winningTeam }) => {
    return (
      <div className="winner-panel">
        <h2>{winningTeam} won!</h2>
        <button onClick={() => window.location.reload()}>Back to homepage</button>
      </div>
    );
};

export default WinnerPanel;