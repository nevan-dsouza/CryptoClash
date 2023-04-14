import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import lightBackround from "../../assets/light-background.jpg";
import manChatting from "../../assets/male-chat-3d.png";
import "./JoinChat.css";


import { joinRoom } from "../../features/room/roomActions";
import { createPlayer, getPlayerByName } from "../../features/player/playerActions";
import Spinner from "../../components/Spinner/Spinner";

const JoinChat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roomId, setRoomId] = useState('');
  const [isMultiplayerSelected, setIsMultiplayerSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [roomError, setRoomError] = useState("");


  const { playerInfo, loading: loadingPlayer, success: successPlayer, error: errorPlayer } = useSelector((state) => state.player);
  const { room, loading: loadingRoom, success: successRoom, error: errorRoom } = useSelector((state) => state.room);

  // const { userInfo } = useSelector((state) => state.user);
  // const { error, success } = useSelector((state) => state.chat);

  useEffect(() => {
    if (errorPlayer != null) {
      setUserNameError(errorPlayer)
    } else {
      setUserNameError("")
    }
  }, [errorPlayer]);

  useEffect(() => {
    if (errorRoom != null) {
      setRoomError(errorRoom)
    } else {
      setRoomError("")
    }
  }, [errorRoom]);


  useEffect(() => {
    if (playerInfo != null && room != null) {
      navigate("/game", { state: { mode: 'Multiplayer', roomId } })
    }
  }, [playerInfo, room]);

  useEffect(() => {
    if (successRoom) {
      dispatch(getPlayerByName({ name: username }));
    }
  }, [successRoom]);


  useEffect(() => {
    if (username == "") {
      setUserNameError("");
    } else if (username.length < 3) {
      setUserNameError("User name should be atleast of 3 characters");
    } else {
      setUserNameError("");
    }
  }, [username]);

  useEffect(() => {
    if (roomId == "") {
      setRoomError("");
    } else if (roomId.length < 3) {
      setRoomError("Room ID should be atleast of 3 characters");
    } else {
      setRoomError("");
    }
  }, [roomId]);


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

    if (username == "") {
      setUserNameError("User name is empty");
    }

    if (roomId == "") {
      setRoomError("RoomId is empty");

    }

    if (
      userNameError == "" &&
      roomError == "" &&
      username != "" &&
      roomId != ""
    ) {

      dispatch(joinRoom({ player_name: username, roomId }));

    } else {
      console.log("Error!");
    }

  };

  const createRoom = () => {
    if (roomId == "") {
      const newRoomId = generateRoomId();
      setRoomId(newRoomId);
    }
  };

  return (
    <div className="joinChatContainer"

      style={{
        backgroundImage: `url(${lightBackround})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}

    >
      <div className="optionsContainer">

        <p
          className={`text-dark headingWelcome`}
          style={{
            fontSize: "4rem",
            fontWeight: "bolder",
            fontFamily: "sans-serif",
            textShadow:
              "-1px -1px 0 #fff, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          Welcome to Wordle!
        </p>

        <div className="options">
          <div className="heroSecCard">
            <div onClick={() => navigate("/profile")} >Profile</div>
          </div>
          <div className="heroSecCard">
            <div onClick={() => navigate("/instructions")}>Instructions</div>
          </div>
          <div className="heroSecCard" onClick={() => setIsMultiplayerSelected(!isMultiplayerSelected)}>Multiplayer</div>
        </div>

        {isMultiplayerSelected && (
          <div className="multiplayer-options">


            <div className="InputContainer">
              <input placeholder="Enter Room ID" type="text" id="roomId" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
              {roomError &&
                <div className="field-error-meesage">
                  {roomError}
                </div>
              }
            </div>

            <div className="InputContainer">
              <input placeholder="Enter Player Name" type="text" id="userName" value={username} onChange={(e) => setUsername(e.target.value)} />
              {userNameError &&
                <div className="field-error-meesage">
                  {userNameError}
                </div>
              }
            </div>

            {(loadingPlayer || loadingRoom) ?
              <Spinner /> :
              <>
                <button onClick={handleJoinRoom}>Join Room</button>
                <button onClick={createRoom}>Create Room</button>
              </>
            }
          </div>
        )}

      </div>

      <img src={manChatting} className="mainImage" />
    </div>
  );
};

export default JoinChat;
