import React, { useState } from 'react';
import './Lobby.css';

const Lobby = ({ players, onReady }) => {
  const [teamAssignments, setTeamAssignments] = useState(players.map(() => ''));

  const handleTeamSelect = (index, team) => {
    setTeamAssignments(assignments => [
      ...assignments.slice(0, index),
      team,
      ...assignments.slice(index + 1)
    ]);
  };

  const handleReadyClick = () => {
    const numPlayers = players.length;
    const numTeams = new Set(teamAssignments).size;

    if (numPlayers < 2) {
      alert('You need at least 2 players to start the game.');
    } else if (numTeams < 2) {
      alert('You need at least 2 teams to start the game.');
    } else if (teamAssignments.some(team => !team)) {
      alert('You must assign a team to each player.');
    } else {
      onReady(teamAssignments);
    }
  };

  return (
    <div className="lobby">
      <h2>Lobby</h2>
      <div className="player-list">
        {players.map((player, index) => (
          <div key={player.id} className="player">
            <span>{player.name}</span>
            <select value={teamAssignments[index]} onChange={e => handleTeamSelect(index, e.target.value)}>
              <option value="">Choose team...</option>
              <option value="CodeMasters">CodeMasters</option>
              <option value="Decoders">Decoders</option>
            </select>
          </div>
        ))}
      </div>
      <button onClick={handleReadyClick}>Ready to Start</button>
    </div>
  );
};

export default Lobby;
