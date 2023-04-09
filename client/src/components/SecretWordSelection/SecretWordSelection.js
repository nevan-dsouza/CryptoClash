import './SecretWordSelection.css';
import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import axios from 'axios';

const SecretWordSelection = ({ onFinish }) => {
  const [wordOptions, setWordOptions] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');

  useEffect(() => {
    const fetchWordOptions = async () => {
      try {
        const response = await axios.get('https://api.datamuse.com/words?ml=cryptocurrency&max=5');
        setWordOptions(response.data.map((wordObj) => wordObj.word));
      } catch (error) {
        console.error(`Error fetching word options: ${error}`);
      }
    };

    fetchWordOptions();
  }, []);

  const handleSelectWord = (word) => {
    setSelectedWord(word);
    socket.emit('selectSecretWord', word);
  };

  return (
    <div className="secret-word-selection">
      <h2>Select a secret word:</h2>
      <ul>
        {wordOptions.map((word) => (
          <li key={word} onClick={() => handleSelectWord(word)}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SecretWordSelection;
