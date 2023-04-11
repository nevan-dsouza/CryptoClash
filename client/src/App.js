import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import InstructionsPage from "./pages/InstructionsPage/InstructionsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Lobby from "./components/Lobby/Lobby";
import Room from "./components/Room/Room";

function App() {
  const [players, setPlayers] = useState([]);
  const [teamAssignments, setTeamAssignments] = useState([]);
  const [roomId, setRoomId] = useState("");

  const handlePlayerJoin = (player) => {
    setPlayers((players) => [...players, player]);
  };

  const handleRoomCreate = (roomId) => {
    setRoomId(roomId);
  };

  const handleTeamAssignments = (assignments) => {
    setTeamAssignments(assignments);
  };

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={
              <HomePage
                onPlayerJoin={handlePlayerJoin}
                onRoomCreate={handleRoomCreate}
              />
            }
          />
          <Route exact path="/instructions" element={<InstructionsPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route
            exact
            path="/lobby"
            element={
              <Lobby players={players} onReady={handleTeamAssignments} />
            }
          />
          <Route
            exact
            path="/room"
            element={
              <Room
                players={players}
                teamAssignments={teamAssignments}
                roomId={roomId}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
