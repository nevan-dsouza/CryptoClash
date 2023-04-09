const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

const players = new Map(); // A map to store player socket IDs and their respective team names
const teams = {
  codemasters: [],
  decoders: []
};

// Helper function to add a player to a team
const addPlayerToTeam = (playerId, team) => {
  players.set(playerId, team);
  teams[team].push(playerId);
};

// Helper function to remove a player from a team
const removePlayerFromTeam = (playerId) => {
  const team = players.get(playerId);
  if (team) {
    players.delete(playerId);
    teams[team] = teams[team].filter((id) => id !== playerId);
  }
};

// Helper function to get the team with the fewer players
const getTeamWithFewerPlayers = () => {
  return teams.codemasters.length <= teams.decoders.length ? 'codemasters' : 'decoders';
};

// SecretWord
let secretWord = '';

const isValidSecretWord = async (word) => {
  // Check if the word has the correct length
  if (word.length !== 5) {
    return false;
  }

  // Check if the word has a meaning using the Datamuse API
  try {
    const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&max=1`);
    return response.data.length > 0;
  } catch (error) {
    console.error(`Error validating word: ${error}`);
    return false;
  }
};

const compareGuess = (guess, secretWord) => {
  const feedback = [];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretWord[i]) {
      feedback.push('green');
    } else if (secretWord.includes(guess[i])) {
      feedback.push('yellow');
    } else {
      feedback.push('darkgrey');
    }
  }

  return feedback;
};




app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://nevan-dsouza:dkTVqsEL8YR2Uamb@cyrptoclash.frozmvu.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add player to a team
  const team = getTeamWithFewerPlayers();
  addPlayerToTeam(socket.id, team);

  // Send the team name to the player
  socket.emit('team', team);

  socket.on('selectSecretWord', async (word) => {
    if ((await isValidSecretWord(word)) && secretWord === '') {
      secretWord = word;
      io.emit('secretWordSelected', secretWord);
    }
  });  

  socket.on('submitGuess', (guess) => {
    const room = findRoomByPlayerId(socket.id);
    if (room) {
      const feedback = compareGuess(guess, room.secretWord);
      socket.to(room.id).emit('decodersFeedback', { guess, feedback });
      socket.to(room.id).emit('codemastersFeedback', { guess, feedback, secretWord: room.secretWord });
    }
  });
  

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    removePlayerFromTeam(socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
