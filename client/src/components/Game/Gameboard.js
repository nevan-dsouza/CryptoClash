import React, { useState, useEffect } from 'react';
import './Gameboard.css';
import socket from '../../socket';

const GameBoard = ({ team, players, onSecretWordSelected }) => {
  const [codemastersWatching, setCodemastersWatching] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wordOptions, setWordOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    socket.on('codemastersWatching', () => {
      setCodemastersWatching(true);
    });

    socket.on('startTimer', (time) => {
      setTimer(time);
      setTimeLeft(time);
    });

    socket.on('updateTimer', (time) => {
      setTimeLeft(time);
    });

    socket.on('stopTimer', () => {
      setTimer(null);
      setTimeLeft(0);
    });

    socket.on('updateGuesses', (newGuesses) => {
      setGuesses(newGuesses);
    });

    socket.on('updateWordOptions', (options) => {
      setWordOptions(options);
    });

    return () => {
      socket.off('codemastersWatching');
      socket.off('startTimer');
      socket.off('updateTimer');
      socket.off('stopTimer');
      socket.off('updateGuesses');
      socket.off('updateWordOptions');
    };
  }, []);

  useEffect(() => {
    socket.on('secretWordSelected', () => {
      onSecretWordSelected();
    });

    return () => {
      socket.off('secretWordSelected');
    };
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    socket.emit('submitWord', selectedOption.word);
    setSubmitted(true);
  };

  const renderGuesses = () => {
    return guesses.map(({ guess, feedback }, index) => (
      <div key={index} className="guess">
        {guess.split('').map((char, i) => (
          <span key={i} className={`letter ${feedback[i]}`}>
            {char}
          </span>
        ))}
      </div>
    ));
  };

  const renderOptions = () => {
    return wordOptions.map((option, index) => {
      const className = option === selectedOption ? 'choice selected' : 'choice';
      return (
        <div
          key={index}
          className={className}
          onClick={() => handleOptionSelect(option)}
        >
          {option.word}
        </div>
      );
    });
  };

  return (
    <div className="game-board">
      {codemastersWatching ? (
        <div className="codemasters-watching">Codemasters are watching...</div>
      ) : (
        <>
          {timer !== null && (
            <div className="timer">
              Time left: {timeLeft} seconds
            </div>
          )}
          <div className="guesses">
            {renderGuesses()}
          </div>
          <div className="word-input">
            <label>Secret Word:</label>
            <input type="text" disabled={submitted} />
          </div>
          <div className="choices">
            {renderOptions()}
          </div>
          {!submitted && (
            <div className="submit-button" onClick={handleSubmit}>
              Submit
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GameBoard;