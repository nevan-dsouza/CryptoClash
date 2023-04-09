import React, { useState, useEffect } from 'react';
import './TeammatesPanel.css';
import socket from '../../socket';

const TeammatesPanel = ({ players }) => {
  const [teammates, setTeammates] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom');

    socket.on('teammatesUpdate', (updatedTeammates) => {
      setTeammates(updatedTeammates);
    });

    return () => {
      socket.off('teammatesUpdate');
    };
  }, []);

  return (
    <div className="teammates-panel">
      <h2 className="teammates-panel__title">Teammates</h2>
      <ul className="teammates-panel__list">
        {players.map(({ id, name }) => (
          <li key={id} className="teammates-panel__list-item">
            {name}
            {teammates.find((teammate) => teammate.id === id) && (
              <span className="teammates-panel__list-item-status"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeammatesPanel;
