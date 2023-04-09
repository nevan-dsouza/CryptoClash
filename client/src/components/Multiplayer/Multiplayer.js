import React, { useState, useEffect } from 'react';
import './Multiplayer.css';
import socket from '../../socket';
import Header from '../Header/Header';
import SecretWordSelection from '../SecretWordSelection/SecretWordSelection';
import GuessingPhase from '../GuessingPhase/GuessingPhase';
import CodemastersWatching from '../CodemastersWatching/CodemastersWatching';
import WinnerPanel from '../WinnerPanel/WinnerPanel';
import TeammatesPanel from '../TeammatesPanel/TeammatesPanel';
import TeamChat from '../TeamChat/TeamChat';

const Multiplayer = () => {
  const [team, setTeam] = useState(null);
  const [isSecretWordSelected, setIsSecretWordSelected] = useState(false);
  const [decodersGuesses, setDecodersGuesses] = useState([]);
  const [codemastersGuesses, setCodemastersGuesses] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [winningTeam, setWinningTeam] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // socket event listeners
    socket.on('team', (assignedTeam) => {
      setTeam(assignedTeam);
    });

    return () => {
      socket.off('team');
    };
  }, []);

  useEffect(() => {
    socket.on('secretWordSelected', () => {
      setIsSecretWordSelected(true);
    });

    return () => {
      socket.off('secretWordSelected');
    };
  }, []);

  useEffect(() => {
    socket.on('decodersFeedback', ({ guess, feedback }) => {
      setDecodersGuesses([...decodersGuesses, { guess, feedback }]);
    });
  
    socket.on('codemastersFeedback', ({ guess, feedback, secretWord }) => {
      setCodemastersGuesses([...codemastersGuesses, { guess, feedback }]);
    });
  
    return () => {
      socket.off('decodersFeedback');
      socket.off('codemastersFeedback');
    };

  }, [decodersGuesses, codemastersGuesses]);

  useEffect(() => {  
    socket.on('gameEnd', ({ room }) => {
      setIsGameEnded(true);
      setWinningTeam(room.scores.codemasters > room.scores.decoders ? 'codemasters' : 'decoders');
    });

    socket.on('players', (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off('players');
      socket.off('gameEnd');
    };
  }, []);
  

  return (
    <div className="multiplayer">
      <div className="multiplayer__sidebar">
        <TeammatesPanel players={players} />
        <TeamChat team={team} />
      </div>
      <div className="multiplayer__main">
        {team && <Header team={team} />}
        {team === "codemasters" && !isSecretWordSelected && (
          <SecretWordSelection />
        )}
        {team === "decoders" && isSecretWordSelected && (
          <GuessingPhase decodersGuesses={decodersGuesses} />
        )}
        {team === "codemasters" && isSecretWordSelected && (
          <CodemastersWatching codemastersGuesses={codemastersGuesses} />
        )}
        {isGameEnded && <WinnerPanel winningTeam={winningTeam} />}
      </div>
    </div>
  );
};

export default Multiplayer;
