import React, { useState } from "react";
import "./App.css";
import {  Route, Routes } from "react-router-dom";


import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import InstructionsPage from "./pages/InstructionsPage/InstructionsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Lobby from "./components/Lobby/Lobby";
import Room from "./components/Room/Room";


import Chat from "./pages/Chat/Chat";
import JoinChat from "./pages/JoinChat/JoinChat";

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
        <Header />
        <Routes>
          {/* <Route exact path="/" element={
              <HomePage
                onPlayerJoin={handlePlayerJoin}
                onRoomCreate={handleRoomCreate}
              />
            }
          /> */}
          <Route path="/" element={<JoinChat  />} />
          <Route path="/chat" element={<Chat />} />
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
    </div>
  );
}

export default App;
