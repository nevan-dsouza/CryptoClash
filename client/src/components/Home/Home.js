import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to CryptoClash!</h1>
      <div className="options">
        <Link to="/multiplayer" className="option">
          <h2>Multiplayer</h2>
        </Link>
        <Link to="/instructions" className="option">
          <h2>Instructions</h2>
        </Link>
        <Link to="/profile" className="option">
          <h2>Profile</h2>
        </Link>
      </div>
    </div>
  );
};

export default Home;
