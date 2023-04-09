import React from 'react';
import './CodemastersWatching.css'

const CodemastersWatching = ({ codemastersGuesses }) => {
  return (
    <div className="codemasters-watching">
      <h2>Watching the Decoders guess...</h2>
      <div className="guesses">
        {codemastersGuesses.map(({ guess, feedback }, index) => (
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

export default CodemastersWatching;
