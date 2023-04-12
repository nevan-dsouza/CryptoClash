import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// import { getChat } from "../../features/chat/chatActions";
import axios from 'axios';

import "./JoinChat.css";

const JoinChat = ({ darkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roomId, setRoomId] = useState('');
  const [isMultiplayerSelected, setIsMultiplayerSelected] = useState(false);

  // const { userInfo } = useSelector((state) => state.user);
  // const { error, success } = useSelector((state) => state.chat);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [roomBookedMessage, setRoomBookedMessage] = useState(false);

  const [joinRoomRequested, setJoinRoomRequested] = useState(false);
  const generateRoomId = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let roomId = '';
    for (let i = 0; i < 4; i++) {
      roomId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return roomId;
  };

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
    // onPlayerJoin({ name: 'CodeMaster', team: 'CodeMasters' });
    console.log("handle");
    setRoomId(newRoomId);

    axios.post('http://localhost:8080/api/rooms', { roomId: newRoomId })
      .then((response) => {
        console.log('Room created successfully:', response.data);
        // onRoomCreate(newRoomId);
      })
      .catch((error) => {
        console.error('Failed to create room:', error);
      });
  };

  const joinRoom = () => {
    setJoinRoomRequested(true);

    navigate("/chat", { state: { username: username, room: room } });
    // if (userInfo == null) {
    //   //get chat data
    //   dispatch(getChat({ room_id: room }));
    // } else if (username !== "" && room !== "") {
    //   navigate("/chat", { state: { username: username, room: room } });
    // }
  };

  return (
    <div className="joinChatContainer">
      <p
        className={` ${darkMode ? "text-light" : "text-dark"}`}
        style={{
          fontSize: "4rem",
          fontWeight: "bolder",
          fontFamily: "sans-serif",
          textShadow:
            "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        }}
      >
        Welcome to Wordle!
      </p>


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

        <input
          type="text"
          placeholder="Enter your Name ..."
          onChange={(event) => {
            setRoomBookedMessage(false);
            setUsername(event.target.value);
          }}
        />

      <input
        type="text"
        placeholder="Enter Room ID..."
        onChange={(event) => {
          setRoomBookedMessage(false);
          setRoom(event.target.value);
        }}
      />

      {roomBookedMessage ? (
        <div className="text-danger text-center mb-2 bg-white p-2">
          The chat room is booked by a registered user.
          <i class="fas fa-exclamation-triangle text-danger"></i>{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Register{" "}
          </span>
        </div>
      ) : null}
      <button onClick={joinRoom}>Join Chat Room</button>
    </div>
  );
};

export default JoinChat;
