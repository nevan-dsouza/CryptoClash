import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home/Home'
import Multiplayer from './components/Multiplayer/Multiplayer';
import Profile from './components/Profile/Profile';
import Instructions from './components/Instructions/Instructions';
import GameBoard from './components/Game/Gameboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/multiplayer" element={<Multiplayer />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/instructions" element={<Instructions />} />
          <Route exact path="/gameboard" element={<GameBoard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
