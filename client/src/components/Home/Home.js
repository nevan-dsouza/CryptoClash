import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  return (
    <div>
      <h1>Welcome to CryptoClash</h1>
      <div>
        <label htmlFor="username">Enter your username: </label>
        <input type="text" id="username" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label htmlFor="roomId">Room ID: </label>
        <input type="text" id="roomId" value={roomId} onChange={handleRoomIdChange} />
      </div>
      <ul>
        <li>
          <Link to={`/multiplayer?username=${username}&roomId=${roomId}`}>Join Private Room</Link>
        </li>
        <li>
          <Link to={`/multiplayer?username=${username}`}>Create Private Room</Link>
        </li>
        {/* Add other navigation options here */}
      </ul>
    </div>
  );
}

export default Home;
