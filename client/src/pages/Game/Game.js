import React, { useState, useEffect } from 'react';
import "./Game.css"
import { createRoom, joinRoom, getRoom, updateRoomByGameStart, updateRoomBySecretWord, updateRoomByGuess, updateRoomByRoundPoints } from "../../features/room/roomActions";
import lightBackround from "../../assets/light-background.jpg";
import avatar from "../../assets/avatar.png"
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useWordChecker } from 'react-word-checker';
import Chat from '../Chat/Chat';

export default function Game() {

    const { words, isLoading, wordExists } = useWordChecker("en");

    const location = useLocation();
    const dispatch = useDispatch();

    const { mode, roomId } = location.state;

    const { playerInfo } = useSelector((state) => state.player);
    const { room, loading: loadingRoom, success: successRoom, error: errorRoom } = useSelector((state) => state.room);

    const [isCodeMaster, setIsCodeMaster] = useState("");
    const [secretWord, setSecretWord] = useState("");
    const [secretWordError, setSecretWordError] = useState("");
    const [guessWord, setGuessWord] = useState("");
    const [guessWordError, setGuessWordError] = useState("");

    const [room_, setRoom] = useState(null);

    const teamAssignments_ = room_?.teamAssignments;
    // console.log('playerInfo', playerInfo)
    console.log('room_', room_)
    console.log('room', room)


    const submitSecretWord = () => {

        var letters = /^[A-Za-z]+$/;

        if (secretWord?.length == 5 && secretWord.match(letters) && wordExists(secretWord)) {
            //submit
            // console.log('ready to submit')
            setSecretWordError('')
            dispatch(updateRoomBySecretWord({ player_name: playerInfo?.name, secret_word: secretWord, roomId }))

        } else {
            //     console.log('secret word should be five vvalid')
            setSecretWordError('Secret word should be five characters valid word!')
        }
    }

    const submitGuessWord = () => {

        if (guessWord?.length == 5) {
            //submit
            // console.log('ready to submit')
            setGuessWordError('')
            dispatch(updateRoomByGuess({ player_name: playerInfo?.name, guess: guessWord, roomId }))

        } else {
            //     console.log('secret word should be five vvalid')
            setGuessWordError('Guess word should be of five characters!')
        }

    }

    useEffect(() => {

        if (room_ != null) {
            const teamAssignments = room_?.teamAssignments;

            if (teamAssignments?.length != 0) {

                const isCodemaster = teamAssignments[teamAssignments?.length - 1].codemasters?.players?.some(playerID => playerID == playerInfo?._id)
                const isDecoder = teamAssignments[teamAssignments?.length - 1].decoders?.players?.some(playerID => playerID == playerInfo?._id)

                if (isCodemaster) {
                    setIsCodeMaster(true)
                }
                else if (isDecoder) {
                    setIsCodeMaster(false)
                }
            }
        }
    }, [room_]);

    // Update Round
    useEffect(() => {

        if (room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length == 5) {
            // call update for round
            dispatch(updateRoomByRoundPoints({ roomId }))
        }
    }, [
        room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length
    ])

    //room_?.teamAssignments[teamAssignments_.length - 1].decoders?.guesses.length

    // console.log('isCodeMaster', isCodeMaster)
    // console.log('room_?.teamAssignments[teamAssignments_.length - 1].codemasters?.start_game', room_?.teamAssignments[teamAssignments_.length - 1].codemasters?.start_game)


    useEffect(() => { 
    
        setRoom(room)},[room])

    setTimeout(() => {

        // dispatch(getRoom({roomId}))

        if (JSON.stringify(room_) != JSON.stringify(room)) {
            // update room
            setRoom(room)

            console.log('room updated!')
        }
    }, 1000)


    return (
        <div className="game_main"

            style={{
                backgroundImage: `url(${lightBackround})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >

            <div className="players_panel">
                <div className="players_panel_heading">
                    Players
                </div>

                {room_?.players?.map((player) =>
                    <div className="player_container">
                        <img src={avatar} className="player_avatar" />
                        <div className="player_name">
                            {player.name}
                        </div>
                    </div>
                )}
            </div>
            <div className="game_panel">
                <div className="game_main_header">
                    Room # {roomId} &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;  {mode}
                </div>
                <div className="game_panel_heading_container">
                    <div className="players_panel_heading">
                        Points : <span className="player_name">

                            {isCodeMaster ? room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.team_score : room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.team_score}

                        </span>
                    </div>
                    <div className="players_panel_heading">
                        Team : <span className="player_name">
                            {isCodeMaster ? "CodeMasters" : "Decoders"}
                        </span>
                    </div>
                    <div className="players_panel_heading">
                        Round : <span className="player_name">
                            {room_?.teamAssignments[teamAssignments_?.length - 1].round}
                        </span>
                    </div>
                </div>
                {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true && room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == true)
                    ?
                    <div className="game_panel_heading_container">
                        <div className="players_panel_heading">
                            <span className="player_name">Game Started </span>

                            {isCodeMaster ?

                                (room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length != 1) ?
                                    <>
                                        <div className="InputContainer">
                                            <input placeholder="Enter Secret Word" type="text" value={secretWord} onChange={(e) => setSecretWord(e.target.value)} />
                                            {secretWordError &&
                                                <div className="field-error-meesage">
                                                    {secretWordError}
                                                </div>
                                            }
                                        </div>
                                        <div className="heroSecCardGame">
                                            <div onClick={submitSecretWord} >Submit</div>
                                        </div>
                                    </>

                                    :

                                    room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length < 5 ?
                                        <>
                                            <span className="player_name">Decoders are guessing </span>
                                            {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.map((guessObj) => (
                                                <div>
                                                    <span className="player_name">Guess: {guessObj.guess} ---- Result : {guessObj.guess_output}</span>
                                                </div>
                                            ))}
                                        </> :
                                        <><hr />
                                            <div className="player_name">
                                                Round is Over ----- Points : {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.team_score}
                                            </div>
                                        </>

                                :
                                // secret added
                                (room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word?.length == 1) ?
                                    <>

                                        {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.map((guessObj) => (
                                            <div>
                                                <span className="player_name">Guess: {guessObj.guess} ---- Result : {guessObj.guess_output}</span>
                                            </div>
                                        ))

                                        }

                                        {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length < 5 ?
                                            (
                                                <>
                                                    <span className="player_name">Enter Your Guess (5 letters) </span>
                                                    <div className="InputContainer">
                                                        <input placeholder="Enter Guess Word" type="text" value={guessWord} onChange={(e) => setGuessWord(e.target.value)} />
                                                        {guessWordError &&
                                                            <div className="field-error-meesage">
                                                                {guessWordError}
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="heroSecCardGame">
                                                        <div onClick={submitGuessWord} >Submit</div>
                                                    </div>
                                                </>)

                                            :

                                            <><hr />
                                                <div className="player_name">
                                                    Round is Over ----- Points : {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.team_score}
                                                </div>
                                            </>

                                        }

                                    </>
                                    :
                                    <span className="player_name">Code Masters are thinking for a secret word! </span>
                            }

                        </div>
                    </div> :
                    room_?.players?.length <= 1 ?

                        <div className="players_panel_heading">
                            <span className="player_name">Waiting for Others to Join !</span>
                        </div> :

                        (room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true || room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true) ?

                            <div className="players_panel_heading">
                                <span className="player_name">Game Started Waiting for other team ... !</span>
                            </div> :
                            <div className="heroSecCardGame">
                                <div onClick={() => dispatch(updateRoomByGameStart({ player_name: playerInfo?.name, roomId }))} >Start Game</div>
                            </div>

                }

            </div>
            {roomId && playerInfo?.name &&

                <Chat username={playerInfo?.name} room={roomId} />
            }
            {/* <div className="chat_panel">
                <div className="game_panel_heading_container">
                    <div className="players_panel_heading">
                        Chat : <span className="player_name">(4)</span>
                    </div>
                </div>
            </div> */}

        </div>)

}