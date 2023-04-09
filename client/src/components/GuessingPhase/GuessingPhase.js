import React, { useState } from 'react';
import socket from '../../socket';
import axios from 'axios';
import './GuessingPhase.css';

const GuessingPhase = ({ onFinish, decodersGuesses }) => {
  const [currentGuess, setCurrentGuess] = useState('');

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value);
  };

  const validateGuess = async (guess) => {
    try {
      const response = await axios.get(`https://api.datamuse.com/words?sp=${guess}&max=1`);
      if (response.data.length > 0 && response.data[0].word === guess) {
        return true;
      }
    } catch (error) {
      console.error(`Error validating guess: ${error}`);
    }
    return false;
  };

  const handleSubmitGuess = async () => {
    if (await validateGuess(currentGuess)) {
      socket.emit('submitGuess', currentGuess);
    } else {
      alert('Invalid guess. Please enter a valid 5-letter word.');
    }

    // Reset the input field
    setCurrentGuess('');
  };

  // ...

  return (
    <div className="guessing-phase">
      {/* Add your other GuessingPhase component content here */}
      <div className="guesses">
        {decodersGuesses.map(({ guess, feedback }, index) => (
          <div key={index} className="guess">
            {guess.split('').map((char, i) => (
              <span key={i} className={`letter ${feedback[i]}`}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessingPhase;
