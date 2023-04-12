import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage({ onPlayerJoin, onRoomCreate }) {
  const [isMultiplayerSelected, setIsMultiplayerSelected] = useState(false);
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId) {
      const url = window.location.href + 'room/' + roomId;
      window.location.href = url;
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const newRoomId = generateRoomId();
    onPlayerJoin({ name: 'CodeMaster', team: 'CodeMasters' });
    console.log("handle");
    setRoomId(newRoomId);

    axios.post('http://localhost:8080/api/rooms', { roomId: newRoomId })
      .then((response) => {
        console.log('Room created successfully:', response.data);
        onRoomCreate(newRoomId);
      })
      .catch((error) => {
        console.error('Failed to create room:', error);
      });
  };

  const generateRoomId = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let roomId = '';
    for (let i = 0; i < 4; i++) {
      roomId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return roomId;
  };

  return (
    <div className="home">
      <h1>Welcome to Wordle!</h1>
      <div className="options">
        <Link to="/profile">Profile</Link>
        <Link to="/instructions">Instructions</Link>
        <button onClick={() => setIsMultiplayerSelected(true)}>Multiplayer</button>
      </div>
      {isMultiplayerSelected && (
        <div className="multiplayer-options">
          <form onSubmit={handleJoinRoom}>
            <label htmlFor="roomId">Enter Room ID:</label>
            <input type="text" id="roomId" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <button type="submit">Join Room</button>
          </form>
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;