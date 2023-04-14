import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Room.css';
import GameBoard from '../Gameboard/Gameboard';
import ChatPanel from '../ChatPanel/ChatPanel';
import TeammatesPanel from '../TeammatesPanel/TeammatesPanel';
import SecretWordSelection from '../SecretWordSelection/SecretWordSelection';
import WordDisplay from '../WordDisplay/WordDisplay';
import WinnerPanel from '../WinnerPanel/WinnerPanel';

const ENDPOINT = 'http://localhost:5000';

const Room = ({ playerName, team, roomName }) => {
  // state variables
  const [socket, setSocket] = useState(null);
  const [round, setRound] = useState(1);
  const [roundOver, setRoundOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wordSelected, setWordSelected] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [selectedGuess, setSelectedGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winningTeam, setWinningTeam] = useState('');
  const [teammates, setTeammates] = useState([]);
  const [randomWords, setRandomWords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [winner, setWinner] = useState('');

  // useEffect hooks
  useEffect(() => {
    // connect to socket on mount
    const newSocket = io(ENDPOINT, {
      query: { playerName, team, roomName }
    });
    setSocket(newSocket);

    // disconnect from socket on unmount
    return () => newSocket.close();
  }, [playerName, team, roomName]);

  useEffect(() => {
    // socket event listeners
    if (socket) {
      socket.on('round over', () => {
        setRoundOver(true);
      });

      socket.on('start next round', () => {
        setRound(round => round + 1);
        setRoundOver(false);
        setTimeLeft(30);
        setWordSelected(false);
        setGuesses([]);
        setSelectedGuess('');
      });

      socket.on('game over', data => {
        setGameOver(true);
        setWinningTeam(data.winningTeam);
      });

      socket.on('teammates', data => {
        setTeammates(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    // timer for round and codemasters failure event
    if (timeLeft > 0 && !wordSelected) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !wordSelected) {
      socket.emit('codemasters failed', round);
      setRoundOver(true);
    }
  }, [timeLeft, wordSelected, round, socket]);

  useEffect(() => {
    // fetch random words from API on mount
    async function fetchWords() {
      const response = await fetch('https://random-word-api.com/word?number=5&length=5');
      const data = await response.json();
      setRandomWords(data);
    }
    fetchWords();
  }, []);
  
  const checkSecretWord = (secretWord, guess) => {
    const secretLetters = secretWord.split("");
    const guessLetters = guess.split("");
    let correctCount = 0;
    let correctLetterPositions = [];
    let almostCorrectCount = 0;
  
    for (let i = 0; i < guessLetters.length; i++) {
      const guessLetter = guessLetters[i];
      const letterIndex = secretLetters.indexOf(guessLetter);
  
      if (letterIndex !== -1) {
        if (letterIndex === i) {
          correctCount++;
          correctLetterPositions.push(i);
        } else {
          almostCorrectCount++;
        }
      }
    }
  
    return {
      correct: correctCount,
      correctLetterPositions,
      almostCorrect: almostCorrectCount,
      incorrect: 5 - correctCount - almostCorrectCount,
    };
  };

  // function to handle selection of secret word by codemaster
  const handleSecretWordSelect = word => {
    setSecretWord(word);
    setWordSelected(true);
  };

  const handleSecretWordSubmit = () => {
    if (secretWord) {
      socket.emit('secret word submit', { secretWord, round });
    }
  };

  // function to handle selection of guess by decoder
  const handleGuessSelect = guess => {
    setSelectedGuess(guess);
  };

  const handleGuessSubmit = ({ guess, round, team }) => {
    if (guess) {
      const guessResult = checkSecretWord(secretWord, guess);
      const newGuesses = [...guesses[round - 1], { guess, result: guessResult, team }];
      setGuesses(guesses => {
        const newGuesses = [...guesses];
        newGuesses[round - 1] = [...guesses[round - 1], { guess, result: guessResult, team }];
        return newGuesses;
      });
      setSelectedGuess('');
      if (guessResult.correct === 5) {
        setWinner(team);
        setGameOver(true);
        socket.emit('game over', { winningTeam: team });
      }
    }
  };  
  
  const handleMessageSend = message => {
    if (message) {
      socket.emit('send message', { message, playerName, team });
    }
  };
  

  const handleWordSelection = word => {
    setSecretWord(word);
    setWordSelected(true);
  };

  return (
    <div className="room">
      <div className="teammates-panel">
        <h3>Teammates</h3>
        <TeammatesPanel teammates={teammates.filter(player => player.team === team)} />
      </div>
      <div className="gameboard">
        {team === "CodeMasters" ? (
          <div className="secret-word-selection">
            {wordSelected ? (
              <div className="secret-word">
                <h3>Your secret word:</h3>
                <p>{secretWord}</p>
                <WordDisplay words={randomWords} onWordSelect={handleWordSelection} />
                {timeLeft > 0 && (
                  <div className="timer">
                    <h4>Time Remaining: {timeLeft}</h4>
                  </div>
                )}
                <button onClick={handleSecretWordSubmit}>Submit Secret Word</button>
              </div>
            ) : (
              <div className="choose-secret-word">
                <h3>You are a CodeMaster</h3>
                <p>Please choose a secret word from the following options:</p>
                <WordDisplay words={randomWords} onWordSelect={handleWordSelection} />
                {timeLeft > 0 && (
                  <div className="timer">
                    <h4>Time Remaining: {timeLeft}</h4>
                  </div>
                )}
                <button onClick={handleSecretWordSelect}>Select Secret Word</button>
              </div>
            )}
          </div>
        ) : (
          <div className="word-guessing">
            <h3>You are a Decoder</h3>
            {wordSelected ? (
              <div>
                <h4>The CodeMasters are thinking of a secret word...</h4>
                {timeLeft > 0 && (
                  <div className="timer">
                    <h4>Time Remaining: {timeLeft}</h4>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h4>Guess the secret word:</h4>
                <input type="text" value={selectedGuess} onChange={e => handleGuessSelect(e.target.value)} />
                {timeLeft > 0 && (
                  <div className="timer">
                    <h4>Time Remaining: {timeLeft}</h4>
                  </div>
                )}
                <button onClick={handleGuessSubmit}>Submit Guess</button>
              </div>
            )}
          </div>
        )}
        <GameBoard guesses={guesses} randomWords={randomWords} />
      </div>
      <div className="chat-panel">
        <h3>Chat</h3>
        <ChatPanel messages={messages} onMessageSend={handleMessageSend} />
      </div>
    </div>
  );
}  
 
export default Room;
