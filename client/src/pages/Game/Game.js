import React, { useState, useEffect } from 'react';
import "./Game.css"
import { getRoom, updateRoomByGameStart, updateRoomBySecretWord, updateRoomByGuess, updateRoomByRoundPoints } from "../../features/room/roomActions";
import lightBackround from "../../assets/light-background.jpg";
import avatar from "../../assets/avatar.png"
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useWordChecker } from 'react-word-checker';
import Chat from '../Chat/Chat';
import Spinner from "../../components/Spinner/Spinner";

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

    // console.log('room_', room_)
    // console.log('room', room)

    const submitSecretWord = () => {

        var letters = /^[A-Za-z]+$/;

        if (secretWord?.length == 5 && secretWord.match(letters) && wordExists(secretWord)) {
            setSecretWordError('')
            dispatch(updateRoomBySecretWord({ player_name: playerInfo?.name, secret_word: secretWord, roomId }))

        } else {
            setSecretWordError('Secret word should be five characters valid word!')
        }
    }

    const submitGuessWord = () => {

        if (guessWord?.length == 5) {
            setGuessWordError('')
            dispatch(updateRoomByGuess({ player_name: playerInfo?.name, guess: guessWord, roomId }))

        } else {
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


    useEffect(() => {
        setRoom(room)
    }, [room])


    useEffect(() => {
        dispatch(getRoom({ roomId }))
    }, [])

    // setTimeout(() => {

    //     // dispatch(getRoom({roomId}))

    //     if (JSON.stringify(room_) != JSON.stringify(room)) {
    //         // update room
    //         setRoom(room)

    //         console.log('room updated!')
    //     }
    // }, 1000)


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


                {/* when code master joins the room --- CODE MASTER --- View */}
                {(isCodeMaster && room_?.players?.length <= 1 && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == false) &&
                    <div className="players_panel_heading">
                        <span className="player_name">Waiting for Decoders to Join !</span>
                    </div>
                }

                {/* when decoder joins the room -- DECODER --- View*/}
                {(!isCodeMaster && room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == false) &&
                    <>
                        {loadingRoom ? <Spinner /> :
                            <div className="heroSecCardGame" onClick={() => dispatch(updateRoomByGameStart({ player_name: playerInfo?.name, roomId }))}>
                                Start Game
                            </div>}
                    </>
                }

                {/* when decoder joined the room and code master not started game ---  CODE MASTER --- View */}
                {(isCodeMaster && room_?.players?.length > 1 && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == false) &&

                    <>
                        {loadingRoom ? <Spinner /> :
                            <div className="heroSecCardGame" onClick={() => dispatch(updateRoomByGameStart({ player_name: playerInfo?.name, roomId }))}>
                                Start Game
                            </div>}
                    </>
                }


                {/* when decoder starts the game -- DECODER --- View*/}
                {(!isCodeMaster && room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == true
                    && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == false
                ) &&
                    <div className="players_panel_heading">
                        <span className="player_name">Waiting for Code Masters to Start !</span>
                    </div>
                }


                {/* when code master starts the game ---  CODE MASTER --- View */}
                {(isCodeMaster && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true &&
                    room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == false
                ) &&
                    <div className="players_panel_heading">
                        <span className="player_name">Waiting for Decoders to Start !</span>
                    </div>
                }

                {/* when game is started from both ends ---  CODE MASTER --- View */}
                {(isCodeMaster && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true &&
                    room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == true
                ) &&
                    <div className="players_panel_heading">
                        <span className="player_name">Game Started </span><br />

                        {/* when secret word is NOT submitted ---  CODE MASTER --- View */}
                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length != 1)
                            && (
                                <>
                                    <span className="player_name">Enter Secret Word (5 letters) </span>
                                    <div className="InputContainer">
                                        <input placeholder="Enter Secret Word" type="text" value={secretWord} onChange={(e) => setSecretWord(e.target.value)} />
                                        {secretWordError &&
                                            <div className="field-error-meesage">
                                                {secretWordError}
                                            </div>
                                        }
                                    </div>
                                    {loadingRoom ? <Spinner /> :
                                        <div className="heroSecCardGame" onClick={submitSecretWord}>
                                            Submit
                                        </div>
                                    }
                                </>
                            )}

                        {/* when secret word is submitted and Decoders are guessing ---  CODE MASTER --- View */}

                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length == 1 && room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length < 5) &&

                            <>
                                <span className="player_name">Decoders are guessing  ----- [{room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word}] </span>
                                <br />
                                <span> " - " means " letter is not in secret " </span><br />
                                <span> " O " means " letter is misplaced " </span><br />


                                {/* show decoders guesses */}
                                {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.map((guessObj) => (
                                    <div>
                                        <span className="player_name">Guess: [{guessObj.guess}] ---------- Result : [{guessObj.guess_output}]</span>
                                    </div>
                                ))}
                            </>
                        }

                        {/* when secret word is submitted and Decoder's GUESSES are OVER or CORRECT GUESS ---  CODE MASTER --- View */}
                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length == 1 &&
                            (room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length == 5
                                || room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.correct_guess == true)) &&
                            <>
                            
                                <div className="player_name">
                                    Round is Over -------- New Points : {
                                        room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.correct_guess == true ?
                                            room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.team_score :
                                            room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.team_score + 10
                                    }
                                </div>

                                {
                                    loadingRoom ? <Spinner /> :
                                        <div className="heroSecCardGame" onClick={() => dispatch(updateRoomByRoundPoints({ roomId }))}>
                                            Start New Round
                                        </div>
                                }

                            </>
                        }

                    </div>
                }

                {/* ------------------------------------------------------------------------------------------ */}

                {/* when game is started from both ends ---  DECODERS --- View */}
                {(!isCodeMaster && room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.start_game == true &&
                    room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.start_game == true
                )
                    &&
                    <div className="players_panel_heading">
                        <span className="player_name">Game Started </span><br />

                        {/* when secret word is NOT submitted ---  DECODERS --- View */}
                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length != 1)
                            && (
                                <span className="player_name">Code Masters are thinking for a secret word! </span>
                            )
                        }

                        {/* when secret word is submitted and Decoders are guessing ---  DECODERS --- View */}

                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length == 1 && room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length < 5) &&

                            <>
                                <span className="player_name">Attempts Left:</span> {5 - room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length}<br />
                                <span> " - " means " letter is not in secret " </span><br />
                                <span> " O " means " letter is misplaced " </span><br />
                                {/* show decoders guesses*/}
                                {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.map((guessObj) => (
                                    <div>
                                        <span className="player_name">Guess: [{guessObj.guess}] ---------- Result : [{guessObj.guess_output}]</span>
                                    </div>
                                ))}

                                {/* show guess input*/}

                                {room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.correct_guess == false
                                    &&
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

                                        {loadingRoom ? <Spinner /> :
                                            <div className="heroSecCardGame" onClick={submitGuessWord}>
                                                Submit
                                            </div>
                                        }

                                    </>

                                }

                            </>
                        }

                        {/* when secret word is submitted and Decoder's GUESSES are OVER or CORRECT GUESS ---  DECODER --- View */}
                        {(room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.secret_word.length == 1 &&
                            (room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.guesses?.length == 5
                                || room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.correct_guess == true)) &&
                            <>
                                <div className="player_name">
                                    Round is Over -------- New Points : {
                                        room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.correct_guess == true ?
                                            room_?.teamAssignments[teamAssignments_?.length - 1].decoders?.team_score + 10 :
                                            room_?.teamAssignments[teamAssignments_?.length - 1].codemasters?.team_score
                                    }
                                </div>

                                {loadingRoom ? <Spinner /> :
                                    <div className="heroSecCardGame" onClick={() => dispatch(updateRoomByRoundPoints({ roomId }))}>
                                        Start New Round
                                    </div>}
                            </>
                        }
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