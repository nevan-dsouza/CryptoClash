import React, { useState, useEffect } from 'react';
import './TeamChat.css';
import socket from '../../socket';

const TeamChat = ({ team }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (currentMessage.trim() !== '') {
      socket.emit('sendMessage', { team, message: currentMessage });
      setMessages([...messages, { team, message: currentMessage }]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', ({ team, message }) => {
      setMessages([...messages, { team, message }]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [messages]);

  return (
    <div className="team-chat">
      <h2 className="team-chat__title">{`${team} Team Chat`}</h2>
      <div className="team-chat__messages">
        {messages.map(({ team, message }, index) => (
          <div key={index} className={`team-chat__message ${team}`}>
            <span className="team-chat__message-team">{team}</span>
            <span className="team-chat__message-text">{message}</span>
          </div>
        ))}
      </div>
      <div className="team-chat__input-container">
        <input
          type="text"
          className="team-chat__input"
          placeholder="Type your message here"
          value={currentMessage}
          onChange={handleInputChange}
        />
        <button className="team-chat__send-btn" onClick={handleSubmitMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TeamChat;
