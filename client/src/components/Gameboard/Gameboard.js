import React from 'react';
import './Gameboard.css';

const GameBoard = ({ guesses }) => {
  return (
    <div className="gameboard-container">
      {guesses.map((guess, index) => (
        <div key={index} className="guess-row">
          <div className={`guess-index ${guess.result}`}>
            {index + 1}
          </div>
          <div className="guess-letters">
            {guess.guess.split('').map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`guess-letter ${guess.result} ${
                  guess.correctLetters.includes(letterIndex)
                    ? 'correct-letter'
                    : ''
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
